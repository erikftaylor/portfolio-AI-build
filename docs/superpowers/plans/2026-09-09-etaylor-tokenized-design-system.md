# etaylor.co Tokenized Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a version-controlled design-system package whose Figma variables, DTCG-style JSON tokens, and generated CSS express the approved etaylor.co identity with verifiable parity and accessibility.

**Architecture:** Three source layers—core primitives, semantic surface modes, and component mappings—live as JSON in GitHub. Small dependency-free Node utilities validate aliases, policy boundaries, and contrast, then generate a committed CSS artifact. A Figma handoff document mirrors the same paths and mode branches so design and implementation use one vocabulary.

**Tech Stack:** JSON, CSS custom properties, Node.js ES modules, Node's built-in test runner, npm scripts, Markdown

**Spec:** `docs/superpowers/specs/2026-09-09-etaylor-tokenized-design-system-design.md`

## Global Constraints

- Treat `design-system/tokens/core.json`, `semantic.json`, and `components.json` as the source of truth.
- Keep `tokens.css` generated and committed; never edit it by hand.
- Use Instrument Sans only. Do not add a condensed or secondary display family.
- Keep Direction Band primitives out of actions, navigation, status, charts, and form feedback.
- Support both `parchment` and `aubergine` as contextual surface modes that may coexist on one page.
- Preserve the approved raw colors, typography metrics, spacing, layout, radii, motion, and component mappings exactly.
- Do not modify `src/index.css`, route code, content, analytics, or SEO in this package-only phase.
- Do not remove legacy theme profiles in this phase. Site migration is a separate, follow-on plan.
- Use `apply_patch` for authored file changes and deterministic scripts for generated output.

## File Structure

```text
design-system/
  README.md                         # Principles, usage, accessibility, and maintenance workflow
  figma/
    variables.md                    # Copy-ready Figma collections, modes, aliases, and styles
  tokens/
    core.json                       # Raw primitives only
    semantic.json                   # Parchment and Aubergine purpose aliases
    components.json                 # Parchment and Aubergine component mappings
    tokens.css                      # Generated CSS custom properties
scripts/
  lib/
    design-tokens.mjs               # Loading, flattening, alias resolution, contrast, validation
  build-design-tokens.mjs           # Deterministic JSON-to-CSS generator
  validate-design-tokens.mjs        # CLI validation entrypoint
tests/
  design-system-tokens.test.mjs     # Contract, policy, contrast, and generated-output tests
package.json                        # Token build, test, and check scripts
```

## Shared Interfaces

Implement these exact public functions in `scripts/lib/design-tokens.mjs`:

```js
export function loadTokenBundle(rootDir) {}
export function flattenTokens(node, prefix = []) {}
export function createRegistry(bundle) {}
export function resolveValue(value, registry, stack = []) {}
export function relativeLuminance(hex) {}
export function contrastRatio(foreground, background) {}
export function validateTokenBundle(bundle) {}
export function buildCss(bundle) {}
```

`loadTokenBundle(rootDir)` returns:

```js
{
  core: Object,
  semantic: Object,
  components: Object
}
```

`validateTokenBundle(bundle)` returns an array of human-readable error strings. An empty array means the bundle is valid. The CLI exits non-zero when the array is non-empty.

---

## Task 1: Establish the Core Token Contract

**Files:**

- Create: `design-system/tokens/core.json`
- Create: `scripts/lib/design-tokens.mjs`
- Create: `tests/design-system-tokens.test.mjs`

### Interfaces

- `flattenTokens(node, prefix): Map<string, { $type: string, $value: unknown, $description?: string }>`
- `loadTokenBundle(rootDir): { core, semantic, components }`
- `createRegistry(bundle): Map<string, tokenRecord>`
- Core token leaf: an object containing `$type` and `$value`; `$description` is optional.

- [ ] **Step 1: Write the failing core-contract test**

Create `tests/design-system-tokens.test.mjs` with the initial contract:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  createRegistry,
  flattenTokens,
  loadTokenBundle,
} from '../scripts/lib/design-tokens.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('core tokens contain the approved brand and Direction Band values', () => {
  const { core } = loadTokenBundle(projectRoot);
  const tokens = flattenTokens(core);

  assert.equal(tokens.get('color.paper.100').$value, '#F5EADC');
  assert.equal(tokens.get('color.plum.700').$value, '#46313F');
  assert.equal(tokens.get('color.plum.900').$value, '#2D202A');
  assert.equal(tokens.get('color.signal.research').$value, '#0095A0');
  assert.equal(tokens.get('color.signal.decide').$value, '#009A46');
  assert.equal(tokens.get('color.signal.design').$value, '#CC6F00');
  assert.equal(tokens.get('color.signal.ship').$value, '#F13737');
});

test('core typography uses Instrument Sans without a condensed family', () => {
  const bundle = loadTokenBundle(projectRoot);
  const registry = createRegistry(bundle);

  assert.equal(
    registry.get('font.family.sans').$value,
    'Instrument Sans, system-ui, sans-serif',
  );
  assert.equal(registry.get('font.family.display').$value, '{font.family.sans}');
  assert.equal(
    [...registry.values()].some((token) =>
      String(token.$value).toLowerCase().includes('condensed'),
    ),
    false,
  );
});
```

- [ ] **Step 2: Run the test and confirm it fails because the token library and JSON do not exist**

Run:

```bash
node --test tests/design-system-tokens.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/lib/design-tokens.mjs`.

- [ ] **Step 3: Implement the token loader and flattener**

Create `scripts/lib/design-tokens.mjs` with JSON loading and leaf traversal. The implementation must:

```js
import fs from 'node:fs';
import path from 'node:path';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isToken(value) {
  return Boolean(
    value
      && typeof value === 'object'
      && !Array.isArray(value)
      && '$type' in value
      && '$value' in value,
  );
}

export function loadTokenBundle(rootDir) {
  const tokenDir = path.join(rootDir, 'design-system', 'tokens');
  return {
    core: readJson(path.join(tokenDir, 'core.json')),
    semantic: readJson(path.join(tokenDir, 'semantic.json')),
    components: readJson(path.join(tokenDir, 'components.json')),
  };
}

export function flattenTokens(node, prefix = []) {
  const tokens = new Map();

  for (const [key, value] of Object.entries(node)) {
    const tokenPath = [...prefix, key];
    if (isToken(value)) {
      tokens.set(tokenPath.join('.'), value);
      continue;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const [nestedPath, token] of flattenTokens(value, tokenPath)) {
        tokens.set(nestedPath, token);
      }
    }
  }

  return tokens;
}

export function createRegistry(bundle) {
  const registry = new Map(flattenTokens(bundle.core));
  for (const mode of ['parchment', 'aubergine']) {
    for (const layer of ['semantic', 'components']) {
      for (const [tokenPath, token] of flattenTokens(bundle[layer][mode])) {
        registry.set(`${mode}.${tokenPath}`, token);
      }
    }
  }
  return registry;
}
```

During this step, create temporary empty mode shells for `semantic.json` and `components.json` so `loadTokenBundle` can execute:

```json
{
  "parchment": {},
  "aubergine": {}
}
```

- [ ] **Step 4: Add all approved core tokens**

Populate `core.json` with the exact spec values under these paths:

```text
color.paper.50, 100, 200, 300, 400
color.plum.300, 400, 500, 600, 700, 800, 900
color.inverse.secondary, tertiary, border
color.signal.research, decide, design, ship
color.status.parchment.info, success, warning, danger
color.status.aubergine.info, success, warning, danger
font.family.sans, display
font.weight.regular, medium, semibold, heading, display, bold
font.style.display.xl, display.lg
font.style.heading.xl, heading.lg, heading.md, heading.sm
font.style.body.lg, body.md, body.sm
font.style.label, eyebrow, caption
space.0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32
layout.page.max, reading.max
layout.edge.desktop, tablet, mobile
layout.section.desktop, tablet, mobile
layout.grid.desktop.columns, tablet.columns, mobile.columns
layout.grid.desktop.gutter, tablet.gutter, mobile.gutter
radius.none, control, tag
border.default, focus
shadow.overlay
texture.paper.opacity, aubergine.opacity
motion.duration.fast, standard, deliberate
motion.easing.standard
```

Use DTCG-compatible leaf types:

```json
{
  "color": { "$type": "color", "$value": "#F5EADC" },
  "dimension": { "$type": "dimension", "$value": "4px" },
  "number": { "$type": "number", "$value": 0.04 },
  "duration": { "$type": "duration", "$value": "120ms" },
  "cubicBezier": { "$type": "cubicBezier", "$value": [0.2, 0, 0, 1] },
  "fontFamily": { "$type": "fontFamily", "$value": "Instrument Sans, system-ui, sans-serif" },
  "fontWeight": { "$type": "fontWeight", "$value": 600 }
}
```

Represent each composite typography style with individual leaves named `fontFamily`, `fontWeight`, `fontSize`, `lineHeight`, `letterSpacing`, and `textCase`. Use `textCase: "uppercase"` only for `font.style.eyebrow`; all other styles use `"none"`. Set `shadow.overlay` to a restrained single shadow and document that it is overlay-only:

```json
{
  "$type": "shadow",
  "$value": {
    "color": "#2D202A26",
    "offsetX": "0px",
    "offsetY": "12px",
    "blur": "32px",
    "spread": "0px"
  },
  "$description": "Reserved for overlays; not for cards or page sections."
}
```

- [ ] **Step 5: Run the core tests**

Run:

```bash
node --test tests/design-system-tokens.test.mjs
```

Expected: PASS for the core color and Instrument Sans contracts.

- [ ] **Step 6: Commit the core token layer**

```bash
git add design-system/tokens/core.json design-system/tokens/semantic.json design-system/tokens/components.json scripts/lib/design-tokens.mjs tests/design-system-tokens.test.mjs
git commit -m "feat: add etaylor core design tokens"
```

---

## Task 2: Add Semantic Modes and Accessibility Validation

**Files:**

- Modify: `design-system/tokens/semantic.json`
- Modify: `scripts/lib/design-tokens.mjs`
- Modify: `tests/design-system-tokens.test.mjs`

### Interfaces

- Alias syntax: a full string matching `{token.path}`.
- `resolveValue(value, registry, stack): unknown`
- `relativeLuminance(hex): number`
- `contrastRatio(foreground, background): number`
- Semantic registry keys: `parchment.color.*` and `aubergine.color.*`.

- [ ] **Step 1: Write failing tests for semantic parity, aliases, and contrast**

Append:

```js
import {
  contrastRatio,
  resolveValue,
} from '../scripts/lib/design-tokens.mjs';

const requiredSemanticPaths = [
  'color.surface.canvas',
  'color.surface.raised',
  'color.surface.subtle',
  'color.text.primary',
  'color.text.secondary',
  'color.text.tertiary',
  'color.border.subtle',
  'color.border.strong',
  'color.link.foreground',
  'color.link.decoration',
  'color.focus.ring',
  'color.action.primary.background',
  'color.action.primary.foreground',
  'color.action.primary.hover',
  'color.action.primary.active',
  'color.action.disabled.background',
  'color.action.disabled.foreground',
  'color.action.secondary.background',
  'color.action.secondary.foreground',
  'color.action.secondary.border',
  'color.selection.background',
  'color.selection.foreground',
  'color.status.info',
  'color.status.success',
  'color.status.warning',
  'color.status.danger',
];

test('semantic modes expose identical paths', () => {
  const { semantic } = loadTokenBundle(projectRoot);
  const parchment = [...flattenTokens(semantic.parchment).keys()].sort();
  const aubergine = [...flattenTokens(semantic.aubergine).keys()].sort();

  assert.deepEqual(parchment, aubergine);
  assert.deepEqual(parchment, [...requiredSemanticPaths].sort());
});

test('approved semantic pairings meet their contrast thresholds', () => {
  const bundle = loadTokenBundle(projectRoot);
  const registry = createRegistry(bundle);
  const resolved = (mode, tokenPath) =>
    resolveValue(registry.get(`${mode}.${tokenPath}`).$value, registry, [mode]);

  assert.ok(contrastRatio(resolved('parchment', 'color.text.primary'), resolved('parchment', 'color.surface.canvas')) >= 13);
  assert.ok(contrastRatio(resolved('aubergine', 'color.text.primary'), resolved('aubergine', 'color.surface.canvas')) >= 9.9);
  assert.ok(contrastRatio(resolved('parchment', 'color.text.secondary'), resolved('parchment', 'color.surface.canvas')) >= 5.5);
  assert.ok(contrastRatio(resolved('parchment', 'color.text.tertiary'), resolved('parchment', 'color.surface.canvas')) >= 4.5);
  assert.ok(contrastRatio(resolved('aubergine', 'color.text.secondary'), resolved('aubergine', 'color.surface.canvas')) >= 7.6);
  assert.ok(contrastRatio(resolved('parchment', 'color.focus.ring'), resolved('parchment', 'color.surface.canvas')) >= 3);
  assert.ok(contrastRatio(resolved('aubergine', 'color.focus.ring'), resolved('aubergine', 'color.surface.canvas')) >= 3);
});

test('status and Direction Band colors meet their intended-use contrast thresholds', () => {
  const bundle = loadTokenBundle(projectRoot);
  const registry = createRegistry(bundle);
  const resolved = (mode, tokenPath) =>
    resolveValue(registry.get(`${mode}.${tokenPath}`).$value, registry, [mode]);
  const canvas = (mode) => resolved(mode, 'color.surface.canvas');

  for (const status of ['info', 'success', 'warning', 'danger']) {
    assert.ok(contrastRatio(resolved('parchment', `color.status.${status}`), canvas('parchment')) >= 4.5);
    assert.ok(contrastRatio(resolved('aubergine', `color.status.${status}`), canvas('aubergine')) >= 4.5);
  }

  for (const signal of ['research', 'decide', 'design', 'ship']) {
    const signalColor = registry.get(`color.signal.${signal}`).$value;
    assert.ok(contrastRatio(signalColor, canvas('parchment')) >= 3);
    assert.ok(contrastRatio(signalColor, canvas('aubergine')) >= 3);
  }
});
```

- [ ] **Step 2: Run the tests and confirm the missing semantic paths fail**

Run:

```bash
node --test tests/design-system-tokens.test.mjs
```

Expected: FAIL because both semantic branches are empty.

- [ ] **Step 3: Implement recursive alias resolution and contrast helpers**

Add to `scripts/lib/design-tokens.mjs`:

```js
const aliasPattern = /^\{([^}]+)\}$/;

export function resolveValue(value, registry, stack = []) {
  if (typeof value !== 'string') return value;
  const match = value.match(aliasPattern);
  if (!match) return value;

  const requestedPath = match[1];
  const mode = stack[0];
  const candidates = mode
    ? [`${mode}.${requestedPath}`, requestedPath]
    : [requestedPath];
  const resolvedPath = candidates.find((candidate) => registry.has(candidate));

  if (!resolvedPath) throw new Error(`Unresolved alias: ${value}`);
  if (stack.includes(resolvedPath)) {
    throw new Error(`Circular alias: ${[...stack, resolvedPath].join(' -> ')}`);
  }

  return resolveValue(
    registry.get(resolvedPath).$value,
    registry,
    [...stack, resolvedPath],
  );
}

function channelToLinear(channel) {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Expected six-digit hex color, received: ${hex}`);
  const channels = match[1].match(/.{2}/g).map((part) => Number.parseInt(part, 16));
  const [red, green, blue] = channels.map(channelToLinear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
```

- [ ] **Step 4: Populate both semantic branches**

Create every path in `requiredSemanticPaths` using the approved aliases from the spec. Use `{color.transparent}` for transparent backgrounds, and add this primitive to `core.json`:

```json
{
  "$type": "color",
  "$value": "#00000000",
  "$description": "Transparent fill for secondary and tertiary controls."
}
```

Status semantics must alias mode-specific status primitives. Example:

```json
{
  "parchment": {
    "color": {
      "surface": {
        "canvas": { "$type": "color", "$value": "{color.paper.100}" }
      },
      "status": {
        "success": { "$type": "color", "$value": "{color.status.parchment.success}" }
      }
    }
  },
  "aubergine": {
    "color": {
      "surface": {
        "canvas": { "$type": "color", "$value": "{color.plum.700}" }
      },
      "status": {
        "success": { "$type": "color", "$value": "{color.status.aubergine.success}" }
      }
    }
  }
}
```

- [ ] **Step 5: Run semantic tests**

Run:

```bash
node --test tests/design-system-tokens.test.mjs
```

Expected: PASS, including all stated contrast thresholds.

- [ ] **Step 6: Commit semantic modes**

```bash
git add design-system/tokens/core.json design-system/tokens/semantic.json scripts/lib/design-tokens.mjs tests/design-system-tokens.test.mjs
git commit -m "feat: add accessible surface mode tokens"
```

---

## Task 3: Add Component Mappings and Brand-Use Guardrails

**Files:**

- Modify: `design-system/tokens/components.json`
- Modify: `scripts/lib/design-tokens.mjs`
- Modify: `tests/design-system-tokens.test.mjs`

### Interfaces

- Component roots: `navigation`, `button`, `hero`, `case-card`, `evidence-frame`, `decision-callout`, `evidence-note`, `metadata`, `contact-cta`, `footer`, and `direction-band`.
- `validateTokenBundle(bundle): string[]`
- Component aliases may target semantic paths within the current mode or core paths.

- [ ] **Step 1: Write failing component parity and policy tests**

Append:

```js
import { validateTokenBundle } from '../scripts/lib/design-tokens.mjs';

test('component modes expose identical paths', () => {
  const { components } = loadTokenBundle(projectRoot);
  const parchment = [...flattenTokens(components.parchment).keys()].sort();
  const aubergine = [...flattenTokens(components.aubergine).keys()].sort();
  assert.deepEqual(parchment, aubergine);
  assert.ok(parchment.includes('button.primary.background'));
  assert.ok(parchment.includes('case-card.featured.background'));
  assert.ok(parchment.includes('direction-band.research.color'));
});

test('all aliases resolve and Direction Band colors stay out of UI semantics', () => {
  const bundle = loadTokenBundle(projectRoot);
  assert.deepEqual(validateTokenBundle(bundle), []);
});
```

- [ ] **Step 2: Run the tests and confirm component mapping failures**

Run:

```bash
node --test tests/design-system-tokens.test.mjs
```

Expected: FAIL because component branches do not contain the required mappings.

- [ ] **Step 3: Implement bundle validation**

Add `validateTokenBundle` with alias, mode-parity, brand-boundary, and accessibility checks:

```js
export function validateTokenBundle(bundle) {
  const errors = [];
  const registry = createRegistry(bundle);

  for (const [tokenPath, token] of registry) {
    try {
      const mode = tokenPath.startsWith('parchment.')
        ? 'parchment'
        : tokenPath.startsWith('aubergine.')
          ? 'aubergine'
          : undefined;
      resolveValue(token.$value, registry, mode ? [mode] : []);
    } catch (error) {
      errors.push(`${tokenPath}: ${error.message}`);
    }
  }

  for (const layer of ['semantic', 'components']) {
    const parchment = [...flattenTokens(bundle[layer].parchment).keys()].sort();
    const aubergine = [...flattenTokens(bundle[layer].aubergine).keys()].sort();
    if (JSON.stringify(parchment) !== JSON.stringify(aubergine)) {
      errors.push(`${layer}: Parchment and Aubergine paths differ`);
    }
  }

  const forbiddenRoots = [
    'color.action',
    'color.status',
    'button',
    'navigation',
  ];
  for (const mode of ['parchment', 'aubergine']) {
    for (const [tokenPath, token] of [
      ...flattenTokens(bundle.semantic[mode]),
      ...flattenTokens(bundle.components[mode]),
    ]) {
      if (
        forbiddenRoots.some((root) => tokenPath.startsWith(root))
        && typeof token.$value === 'string'
        && token.$value.includes('{color.signal.')
      ) {
        errors.push(`${mode}.${tokenPath}: Direction Band alias is prohibited`);
      }
    }
  }

  const resolved = (mode, tokenPath) =>
    resolveValue(registry.get(`${mode}.${tokenPath}`).$value, registry, [mode]);
  for (const mode of ['parchment', 'aubergine']) {
    const canvas = resolved(mode, 'color.surface.canvas');
    for (const status of ['info', 'success', 'warning', 'danger']) {
      if (contrastRatio(resolved(mode, `color.status.${status}`), canvas) < 4.5) {
        errors.push(`${mode}.color.status.${status}: contrast is below 4.5:1`);
      }
    }
    for (const signal of ['research', 'decide', 'design', 'ship']) {
      if (contrastRatio(registry.get(`color.signal.${signal}`).$value, canvas) < 3) {
        errors.push(`${mode}.color.signal.${signal}: contrast is below 3:1`);
      }
    }
  }

  return errors;
}
```

- [ ] **Step 4: Populate component tokens for both modes**

Implement the spec's exact mappings. Include these paths in both branches:

```text
navigation.background
navigation.foreground
navigation.active.underline
navigation.height
navigation.monogram.size
navigation.link.gap
button.primary.background, foreground, hover, active, disabled-background, disabled-foreground
button.secondary.background, foreground, border, hover, disabled-background, disabled-foreground
button.tertiary.background, foreground, decoration
button.shared.radius, padding-x, min-height, focus-width, focus-offset
hero.background, foreground, headline.max-width, action.max-count
case-card.featured.background, foreground, border, radius, padding
case-card.compact.background, foreground, border, radius, padding
evidence-frame.background, border, radius
decision-callout.background, foreground, padding-min, padding-max
evidence-note.background, foreground, border, padding-min, padding-max
metadata.foreground, background
contact-cta.background, foreground, action.max-count
footer.background, foreground, border, padding-y
direction-band.angle
direction-band.research.color, decide.color, design.color, ship.color
direction-band.sm.stripe-width, gap, height
direction-band.md.stripe-width, gap, height
direction-band.lg.stripe-width, gap, height
```

Use semantic aliases for appearance and core aliases for dimensions. Direction Band color paths are the only component paths allowed to alias `color.signal.*`. Add any missing component-only dimension primitives to `core.json`, including `size.control.minimum: 44px`, `size.navigation.height: 68px`, `size.navigation.monogram: 32px`, and Direction Band size and angle values.

- [ ] **Step 5: Add mutation tests proving the guardrail detects misuse**

Append:

```js
test('validator rejects a Direction Band color used as an action', () => {
  const bundle = structuredClone(loadTokenBundle(projectRoot));
  bundle.semantic.parchment.color.action.primary.background.$value = '{color.signal.ship}';
  assert.ok(
    validateTokenBundle(bundle).some((error) =>
      error.includes('Direction Band alias is prohibited'),
    ),
  );
});

test('validator rejects unresolved aliases', () => {
  const bundle = structuredClone(loadTokenBundle(projectRoot));
  bundle.components.aubergine.footer.border.$value = '{color.missing.value}';
  assert.ok(
    validateTokenBundle(bundle).some((error) => error.includes('Unresolved alias')),
  );
});
```

- [ ] **Step 6: Run and commit component-token tests**

Run:

```bash
node --test tests/design-system-tokens.test.mjs
```

Expected: PASS for parity, all aliases, guardrails, and mutation tests.

Commit:

```bash
git add design-system/tokens/core.json design-system/tokens/components.json scripts/lib/design-tokens.mjs tests/design-system-tokens.test.mjs
git commit -m "feat: add portfolio component design tokens"
```

---

## Task 4: Generate the CSS Artifact Deterministically

**Files:**

- Create: `scripts/build-design-tokens.mjs`
- Modify: `scripts/lib/design-tokens.mjs`
- Create: `design-system/tokens/tokens.css`
- Modify: `tests/design-system-tokens.test.mjs`
- Modify: `package.json`

### Interfaces

- `buildCss(bundle): string`
- Core selector: `:root`
- Semantic/component selectors: `[data-et-surface="parchment"]` and `[data-et-surface="aubergine"]`
- CSS variable prefix: `--et-`

- [ ] **Step 1: Write the failing CSS generation test**

Append:

```js
import fs from 'node:fs';
import { buildCss } from '../scripts/lib/design-tokens.mjs';

test('committed CSS matches deterministic token output', () => {
  const bundle = loadTokenBundle(projectRoot);
  const generated = buildCss(bundle);
  const committed = fs.readFileSync(
    path.join(projectRoot, 'design-system', 'tokens', 'tokens.css'),
    'utf8',
  );
  assert.equal(committed, generated);
  assert.match(generated, /--et-color-paper-100: #F5EADC;/);
  assert.match(generated, /\[data-et-surface="parchment"\]/);
  assert.match(generated, /\[data-et-surface="aubergine"\]/);
  assert.match(generated, /--et-button-primary-background:/);
});
```

- [ ] **Step 2: Run the test and confirm the generated CSS is missing**

Run:

```bash
node --test tests/design-system-tokens.test.mjs
```

Expected: FAIL with `ENOENT` for `design-system/tokens/tokens.css` or because `buildCss` is not exported.

- [ ] **Step 3: Implement `buildCss`**

The generator must:

1. Sort token paths alphabetically for stable diffs.
2. Convert dotted paths to kebab-case custom properties prefixed with `--et-`.
3. Render core values in `:root`.
4. Render semantic and component aliases in each surface selector.
5. Convert aliases to CSS `var()` references.
6. Render cubic Bézier arrays as `cubic-bezier(...)`.
7. Render shadow objects as valid CSS box-shadow values.
8. Include a generated-file header.

Use these helpers:

```js
function cssName(tokenPath) {
  return `--et-${tokenPath.replaceAll('.', '-')}`;
}

function cssValue(value) {
  if (typeof value === 'string') {
    const match = value.match(aliasPattern);
    return match ? `var(${cssName(match[1])})` : value;
  }
  if (Array.isArray(value) && value.length === 4) {
    return `cubic-bezier(${value.join(', ')})`;
  }
  if (value && typeof value === 'object' && 'offsetX' in value) {
    return `${value.offsetX} ${value.offsetY} ${value.blur} ${value.spread} ${value.color}`;
  }
  return String(value);
}

function renderBlock(selector, entries) {
  const declarations = entries
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([tokenPath, token]) => `  ${cssName(tokenPath)}: ${cssValue(token.$value)};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}

export function buildCss(bundle) {
  const blocks = [
    '/* Generated by npm run tokens:build. Do not edit directly. */',
    renderBlock(':root', [...flattenTokens(bundle.core)]),
  ];

  for (const mode of ['parchment', 'aubergine']) {
    const entries = [
      ...flattenTokens(bundle.semantic[mode]),
      ...flattenTokens(bundle.components[mode]),
    ];
    blocks.push(renderBlock(`[data-et-surface="${mode}"]`, entries));
  }

  blocks.push(`@media (prefers-reduced-motion: reduce) {\n  :root {\n    --et-motion-duration-fast: 0ms;\n    --et-motion-duration-standard: 0ms;\n    --et-motion-duration-deliberate: 0ms;\n  }\n}`);
  return `${blocks.join('\n\n')}\n`;
}
```

- [ ] **Step 4: Add the build entrypoint and npm scripts**

Create `scripts/build-design-tokens.mjs`:

```js
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { buildCss, loadTokenBundle, validateTokenBundle } from './lib/design-tokens.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundle = loadTokenBundle(projectRoot);
const errors = validateTokenBundle(bundle);

if (errors.length > 0) {
  throw new Error(`Token validation failed:\n${errors.join('\n')}`);
}

fs.writeFileSync(
  path.join(projectRoot, 'design-system', 'tokens', 'tokens.css'),
  buildCss(bundle),
);
```

Add these scripts to `package.json`:

```json
{
  "tokens:build": "node scripts/build-design-tokens.mjs",
  "tokens:test": "node --test tests/design-system-tokens.test.mjs",
  "tokens:validate": "node scripts/validate-design-tokens.mjs",
  "tokens:check": "npm run tokens:validate && npm run tokens:build && git diff --exit-code -- design-system/tokens/tokens.css && npm run tokens:test"
}
```

- [ ] **Step 5: Generate CSS and rerun the tests**

Run:

```bash
npm run tokens:build
npm run tokens:test
```

Expected: PASS; `tokens.css` contains root primitives plus both contextual surface selectors.

- [ ] **Step 6: Commit generator and CSS**

```bash
git add package.json scripts/build-design-tokens.mjs scripts/lib/design-tokens.mjs design-system/tokens/tokens.css tests/design-system-tokens.test.mjs
git commit -m "feat: generate CSS from design tokens"
```

---

## Task 5: Add the Validation CLI and Figma Parity Contract

**Files:**

- Create: `scripts/validate-design-tokens.mjs`
- Create: `design-system/figma/variables.md`
- Modify: `scripts/lib/design-tokens.mjs`
- Modify: `tests/design-system-tokens.test.mjs`

### Interfaces

- The Figma document must contain machine-readable token rows in the form `` `token.path` | value-or-alias ``.
- Figma collection headings: `ET / Core`, `ET / Semantic`, `ET / Component`.
- Figma modes: `Value`, `Parchment`, `Aubergine`.
- The CLI prints `Design token validation passed.` on success.

- [ ] **Step 1: Add a failing test for Figma-to-JSON naming parity**

Append:

```js
test('Figma handoff names every JSON token path', () => {
  const bundle = loadTokenBundle(projectRoot);
  const figma = fs.readFileSync(
    path.join(projectRoot, 'design-system', 'figma', 'variables.md'),
    'utf8',
  );
  const documented = new Set(
    [...figma.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]),
  );

  for (const tokenPath of flattenTokens(bundle.core).keys()) {
    assert.ok(documented.has(tokenPath), `Missing Figma core row: ${tokenPath}`);
  }
  for (const layer of ['semantic', 'components']) {
    for (const mode of ['parchment', 'aubergine']) {
      for (const tokenPath of flattenTokens(bundle[layer][mode]).keys()) {
        assert.ok(
          documented.has(`${mode}.${tokenPath}`),
          `Missing Figma ${layer} row: ${mode}.${tokenPath}`,
        );
      }
    }
  }
});
```

- [ ] **Step 2: Run the test and confirm the Figma document is missing**

Run:

```bash
npm run tokens:test
```

Expected: FAIL with `ENOENT` for `design-system/figma/variables.md`.

- [ ] **Step 3: Write the Figma variable handoff**

Create `design-system/figma/variables.md` with:

- Collection setup instructions and exact mode names.
- A row for every core token, using slash notation in the visible Figma Name column and the dotted JSON path in the machine-readable Token Path column.
- A row for every semantic token in each mode, with its alias target.
- A row for every component token in each mode, with its alias target.
- All twelve text styles with exact Instrument Sans family, weights, size, line height, tracking, and eyebrow case.
- The 12/6/4 grid styles and responsive margins/gutters.
- `ET / Effect / Overlay` using `shadow.overlay`.
- Direction Band construction instructions: fixed Research/Decide/Design/Ship order, 18-degree angle, square ends, no outline, no per-stripe animation.
- Accessibility notes and the approved contrast table.
- A maintenance rule that changes start in JSON, are regenerated to CSS, and are then mirrored into Figma.

Use table headers that preserve the test's first-column contract:

```md
| Token Path | Figma Name | Parchment | Aubergine | Type |
|---|---|---:|---:|---|
| `parchment.color.surface.canvas` | `color/surface/canvas` | `{color.paper.100}` | — | Color |
| `aubergine.color.surface.canvas` | `color/surface/canvas` | — | `{color.plum.700}` | Color |
```

- [ ] **Step 4: Create the validation CLI**

Create `scripts/validate-design-tokens.mjs`:

```js
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { loadTokenBundle, validateTokenBundle } from './lib/design-tokens.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = validateTokenBundle(loadTokenBundle(projectRoot));

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Design token validation passed.');
}
```

- [ ] **Step 5: Run validation and parity tests**

Run:

```bash
npm run tokens:validate
npm run tokens:test
```

Expected:

```text
Design token validation passed.
```

All tests PASS.

- [ ] **Step 6: Commit Figma documentation and CLI**

```bash
git add design-system/figma/variables.md scripts/validate-design-tokens.mjs scripts/lib/design-tokens.mjs tests/design-system-tokens.test.mjs package.json
git commit -m "docs: add Figma token handoff"
```

---

## Task 6: Document Adoption and Verify the Portable Package

**Files:**

- Create: `design-system/README.md`
- Modify: `tests/design-system-tokens.test.mjs`

### Interfaces

- CSS opt-in: import `design-system/tokens/tokens.css` and set `data-et-surface` on each contextual surface root.
- Default page ground: `data-et-surface="parchment"`.
- Nested narrative shift: `data-et-surface="aubergine"`.
- Direction Band is a brand motif, not an interactive or semantic color system.

- [ ] **Step 1: Add a failing documentation contract test**

Append:

```js
test('README documents both surface modes and the Direction Band boundary', () => {
  const readme = fs.readFileSync(
    path.join(projectRoot, 'design-system', 'README.md'),
    'utf8',
  );

  assert.match(readme, /data-et-surface="parchment"/);
  assert.match(readme, /data-et-surface="aubergine"/);
  assert.match(readme, /Direction Band/);
  assert.match(readme, /not.*button/i);
  assert.match(readme, /Figma/);
  assert.match(readme, /npm run tokens:check/);
});
```

- [ ] **Step 2: Run the test and confirm the README is missing**

Run:

```bash
npm run tokens:test
```

Expected: FAIL with `ENOENT` for `design-system/README.md`.

- [ ] **Step 3: Write the design-system README**

Document:

1. Positioning: editorial portfolio for enterprise design leaders.
2. The core → semantic → component architecture.
3. Parchment and Aubergine as coexisting contextual surfaces.
4. CSS import and usage examples.
5. Primary, secondary, and tertiary action hierarchy.
6. Direction Band rationale and prohibited uses.
7. Typography, spacing, grid, evidence frame, and motion guidance.
8. Figma setup and update sequence.
9. GitHub source-of-truth and regeneration sequence.
10. Accessibility pairings and non-text-only rule for signal colors.
11. Validation commands.
12. Migration boundary, explicitly stating that this package does not yet replace live-site styles.

Include this usage example:

```html
<link rel="stylesheet" href="/design-system/tokens/tokens.css">

<main data-et-surface="parchment">
  <section class="portfolio-hero">Portfolio content</section>
  <section data-et-surface="aubergine">Decision narrative</section>
</main>
```

And this component mapping example:

```css
.button-primary {
  min-height: var(--et-button-shared-min-height);
  padding-inline: var(--et-button-shared-padding-x);
  color: var(--et-button-primary-foreground);
  background: var(--et-button-primary-background);
  border-radius: var(--et-button-shared-radius);
}
```

- [ ] **Step 4: Run the complete package checks**

Run:

```bash
npm run tokens:check
npm run lint
```

Expected:

- Token validation passes.
- Regeneration produces no diff in `tokens.css`.
- All design-system tests pass.
- ESLint exits successfully.

Do not run the repository's full `npm run build` as the primary token verification because it performs networked RAG, prompt, GitHub, indexing, and deployment-adjacent tasks unrelated to this package. If those services are configured, run `npx tsc -b && npx vite build` as an additional local integration check.

- [ ] **Step 5: Inspect the final diff for scope and generated parity**

Run:

```bash
git status --short
git diff --check
git diff -- design-system scripts/lib/design-tokens.mjs scripts/build-design-tokens.mjs scripts/validate-design-tokens.mjs tests/design-system-tokens.test.mjs package.json
```

Confirm:

- No changes under `src/`.
- No legacy font or theme deletion in this phase.
- No untracked temporary artifacts added.
- `tokens.css` is fully generated from the three JSON sources.
- Figma rows cover every token path and mode.

- [ ] **Step 6: Commit the completed portable package**

```bash
git add design-system/README.md tests/design-system-tokens.test.mjs
git commit -m "docs: document design system adoption"
```

---

## Final Verification Checklist

- [ ] `npm run tokens:validate` prints `Design token validation passed.`
- [ ] `npm run tokens:build` creates no unexpected diff.
- [ ] `npm run tokens:test` passes every contract.
- [ ] `npm run tokens:check` passes end-to-end.
- [ ] `npm run lint` passes.
- [ ] `git diff --check` returns no whitespace errors.
- [ ] Figma, JSON, and CSS names have one-to-one parity.
- [ ] Parchment and Aubergine contain identical semantic and component paths.
- [ ] Approved text, focus, and Direction Band contrast thresholds pass.
- [ ] Direction Band signal colors appear only in core primitives and Direction Band component mappings.
- [ ] Instrument Sans is the only design-system type family and no token contains `condensed`.
- [ ] `src/` remains unchanged.
- [ ] Existing untracked user files remain untouched.

## Follow-on Work Explicitly Out of Scope

A separate migration plan should cover self-hosting Instrument Sans, importing `tokens.css` into the application, replacing legacy variables in shared components, validating responsive pages, and removing old theme profiles only after reference counts reach zero. Keeping migration separate lets the portable system be reviewed and imported into Figma before it changes the production portfolio.
