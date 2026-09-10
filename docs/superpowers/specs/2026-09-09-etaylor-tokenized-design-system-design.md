# etaylor.co Tokenized Design System

Date: 2026-09-09

## Purpose

Create a portable design system for etaylor.co that can be stored and maintained in both Figma and GitHub. The system supports an editorial portfolio for enterprise design leaders and positions Erik Taylor as a Senior Product Designer who turns ambiguous product problems into defensible decisions and shipped systems.

The system replaces the site's existing collection of visual theme profiles with one coherent identity. It separates brand expression from interface actions so the Direction Band remains distinctive without becoming a substitute for navigation, status, or control hierarchy.

## Design principles

1. **Judgment before decoration.** Visual hierarchy should clarify the argument each page is making.
2. **One identity, two grounds.** Parchment and Smoked Aubergine are contextual surfaces that can appear on the same page.
3. **Brand and interface roles stay separate.** Direction Band colors do not become button, link, or status colors.
4. **Evidence stays flexible.** Media frames must support product UI, research artifacts, system diagrams, journey maps, and contextual photography.
5. **Accessibility is encoded in the tokens.** Approved semantic pairings meet WCAG contrast requirements by default.
6. **Instrument Sans carries the full voice.** No condensed companion or secondary display family is used.

## Token architecture

The system has three layers.

### Core tokens

Core tokens contain raw values only. They are not used directly in components except when defining semantic aliases.

Groups:

- Color primitives
- Font families and weights
- Type sizes, line heights, and tracking
- Spacing
- Layout dimensions
- Border widths
- Corner radii
- Shadows
- Texture opacity
- Motion durations and easing

### Semantic tokens

Semantic tokens describe purpose. They alias core tokens and provide two modes:

- `Parchment`
- `Aubergine`

These are contextual surface modes, not global light and dark themes. A page may use both modes at once by applying the appropriate mode to a frame, section, or component subtree.

Semantic groups:

- Canvas and surfaces
- Text
- Borders and dividers
- Links
- Actions
- Focus
- Selection
- Status
- Media and evidence

### Component tokens

Component tokens define controlled mappings for recurring portfolio patterns. They alias semantic and core tokens rather than duplicating raw values.

Components:

- Navigation
- Buttons
- Hero
- Featured and compact case cards
- Evidence frames
- Decision callouts
- Evidence notes
- Metadata
- Contact call-to-action
- Footer
- Direction Band

## Figma structure

### Variable collections

#### `ET / Core`

Single mode named `Value`.

Contains:

- Primitive colors
- Spacing values
- Layout dimensions
- Border widths
- Corner radii
- Texture opacity values
- Motion durations

Figma variable names use slash notation, for example:

- `color/brand/aubergine`
- `color/signal/research`
- `space/6`
- `layout/page/max`
- `radius/control`
- `motion/duration/standard`

#### `ET / Semantic`

Modes:

- `Parchment`
- `Aubergine`

Contains color roles such as:

- `color/surface/canvas`
- `color/surface/raised`
- `color/text/primary`
- `color/action/primary/background`
- `color/focus/ring`
- `color/status/success`

#### `ET / Component`

Modes:

- `Parchment`
- `Aubergine`

Contains component mappings such as:

- `button/primary/background`
- `button/primary/foreground`
- `case-card/featured/background`
- `decision-callout/background`
- `navigation/active/underline`

### Figma styles

Typography remains a set of Figma text styles because it is a composite of family, weight, size, line height, and tracking.

Text style names:

- `ET / Display / XL`
- `ET / Display / LG`
- `ET / Heading / XL`
- `ET / Heading / LG`
- `ET / Heading / MD`
- `ET / Heading / SM`
- `ET / Body / LG`
- `ET / Body / MD`
- `ET / Body / SM`
- `ET / Label`
- `ET / Eyebrow`
- `ET / Caption`

Grid styles:

- `ET / Grid / Desktop 12`
- `ET / Grid / Tablet 6`
- `ET / Grid / Mobile 4`

Effect style:

- `ET / Effect / Overlay`

## GitHub structure

The implementation package will use this structure:

```text
design-system/
  README.md
  figma/
    variables.md
  tokens/
    core.json
    semantic.json
    components.json
    tokens.css
```

JSON uses Design Tokens Community Group style fields:

- `$type`
- `$value`
- `$description`

Aliases use brace notation, for example:

```json
{
  "parchment": {
    "color": {
      "surface": {
        "canvas": {
          "$type": "color",
          "$value": "{color.paper.100}"
        }
      }
    }
  }
}
```

Mode-specific JSON uses explicit `Parchment` and `Aubergine` branches because portable token tooling does not yet share one universal mode syntax.

CSS custom properties use kebab-case names that mirror the slash paths:

```css
--et-color-surface-canvas
--et-color-text-primary
--et-button-primary-background
--et-space-6
```

Mode selectors:

```css
[data-et-surface="parchment"]
[data-et-surface="aubergine"]
```

## Core color tokens

### Neutral and brand primitives

| Token | Value | Purpose |
|---|---:|---|
| `color.paper.50` | `#FBF6F0` | Raised light surface |
| `color.paper.100` | `#F5EADC` | Parchment brand ground |
| `color.paper.200` | `#EADBCB` | Subtle light surface |
| `color.paper.300` | `#D8C4B3` | Disabled light fill |
| `color.paper.400` | `#C9BBAE` | Light divider and subtle border |
| `color.plum.300` | `#73676D` | Tertiary light-mode text and strong border |
| `color.plum.400` | `#665A61` | Secondary light-mode text |
| `color.plum.500` | `#5A4151` | Subtle inverse surface |
| `color.plum.600` | `#513A49` | Raised inverse surface |
| `color.plum.700` | `#46313F` | Smoked Aubergine brand ground |
| `color.plum.800` | `#382632` | Aubergine active state |
| `color.plum.900` | `#2D202A` | Ink and deepest action state |
| `color.inverse.secondary` | `#D9CCD4` | Secondary text on Aubergine |
| `color.inverse.tertiary` | `#C2B1BB` | Tertiary text on Aubergine |
| `color.inverse.border` | `#6E5968` | Subtle inverse border |

### Direction Band primitives

| Token | Value | Meaning |
|---|---:|---|
| `color.signal.research` | `#0095A0` | Research |
| `color.signal.decide` | `#009A46` | Decide |
| `color.signal.design` | `#CC6F00` | Design |
| `color.signal.ship` | `#F13737` | Ship |

The sequence is always Research, Decide, Design, Ship. The colors are used for the Direction Band and large brand graphics only.

### Status primitives

| State | Parchment value | Aubergine value |
|---|---:|---:|
| Information | `#2E6670` | `#8BCAD2` |
| Success | `#276443` | `#88D6A8` |
| Warning | `#875000` | `#F3B848` |
| Danger | `#9B3035` | `#F39A9D` |

Status colors are separate from Direction Band colors even when their hues are similar.

## Semantic color tokens

| Token | Parchment mode | Aubergine mode |
|---|---:|---:|
| `color.surface.canvas` | `color.paper.100` | `color.plum.700` |
| `color.surface.raised` | `color.paper.50` | `color.plum.600` |
| `color.surface.subtle` | `color.paper.200` | `color.plum.500` |
| `color.text.primary` | `color.plum.900` | `color.paper.100` |
| `color.text.secondary` | `color.plum.400` | `color.inverse.secondary` |
| `color.text.tertiary` | `color.plum.300` | `color.inverse.tertiary` |
| `color.border.subtle` | `color.paper.400` | `color.inverse.border` |
| `color.border.strong` | `color.plum.300` | `color.inverse.secondary` |
| `color.link.foreground` | `color.text.primary` | `color.text.primary` |
| `color.link.decoration` | `color.text.primary` | `color.text.primary` |
| `color.focus.ring` | `color.signal.research` | `color.signal.research` |
| `color.action.primary.background` | `color.plum.700` | `color.paper.100` |
| `color.action.primary.foreground` | `color.paper.100` | `color.plum.900` |
| `color.action.primary.hover` | `color.plum.900` | `color.paper.50` |
| `color.action.primary.active` | `color.plum.800` | `color.paper.200` |
| `color.action.disabled.background` | `color.paper.300` | `color.plum.500` |
| `color.action.disabled.foreground` | `color.plum.300` | `color.inverse.tertiary` |
| `color.action.secondary.background` | transparent | transparent |
| `color.action.secondary.foreground` | `color.text.primary` | `color.text.primary` |
| `color.action.secondary.border` | `color.border.strong` | `color.border.strong` |
| `color.selection.background` | `color.paper.300` | `color.plum.500` |
| `color.selection.foreground` | `color.text.primary` | `color.text.primary` |
| `color.status.info` | `#2E6670` | `#8BCAD2` |
| `color.status.success` | `#276443` | `#88D6A8` |
| `color.status.warning` | `#875000` | `#F3B848` |
| `color.status.danger` | `#9B3035` | `#F39A9D` |

## Typography tokens

Family:

- `font.family.sans`: Instrument Sans, system-ui, sans-serif
- `font.family.display`: aliases `font.family.sans`

Weights:

- `font.weight.regular`: 400
- `font.weight.medium`: 500
- `font.weight.semibold`: 600
- `font.weight.heading`: 620
- `font.weight.display`: 650
- `font.weight.bold`: 700

| Style | Size | Line height | Weight | Tracking |
|---|---:|---:|---:|---:|
| `display.xl` | 64px | 64px | 650 | -0.045em |
| `display.lg` | 56px | 58px | 650 | -0.04em |
| `heading.xl` | 40px | 44px | 620 | -0.035em |
| `heading.lg` | 32px | 36px | 620 | -0.03em |
| `heading.md` | 24px | 28px | 600 | -0.02em |
| `heading.sm` | 20px | 24px | 600 | -0.015em |
| `body.lg` | 18px | 28px | 400 | 0 |
| `body.md` | 16px | 24px | 400 | 0 |
| `body.sm` | 14px | 20px | 400 | 0 |
| `label` | 12px | 16px | 650 | 0 |
| `eyebrow` | 11px | 16px | 700 | 0.12em |
| `caption` | 11px | 16px | 450 | 0.01em |

Eyebrows use uppercase and are limited to one per three sections. Display styles use sentence case.

## Spacing and layout tokens

### Spacing scale

| Token | Value |
|---|---:|
| `space.0` | 0 |
| `space.1` | 4px |
| `space.2` | 8px |
| `space.3` | 12px |
| `space.4` | 16px |
| `space.5` | 20px |
| `space.6` | 24px |
| `space.8` | 32px |
| `space.10` | 40px |
| `space.12` | 48px |
| `space.16` | 64px |
| `space.20` | 80px |
| `space.24` | 96px |
| `space.32` | 128px |

### Layout

| Token | Value |
|---|---:|
| `layout.page.max` | 1200px |
| `layout.reading.max` | 680px |
| `layout.edge.desktop` | 48px |
| `layout.edge.tablet` | 32px |
| `layout.edge.mobile` | 20px |
| `layout.section.desktop` | 96px |
| `layout.section.tablet` | 72px |
| `layout.section.mobile` | 56px |
| `layout.grid.desktop.columns` | 12 |
| `layout.grid.tablet.columns` | 6 |
| `layout.grid.mobile.columns` | 4 |
| `layout.grid.desktop.gutter` | 24px |
| `layout.grid.tablet.gutter` | 20px |
| `layout.grid.mobile.gutter` | 16px |

## Shape, depth, texture, and motion

| Token | Value |
|---|---:|
| `radius.none` | 0 |
| `radius.control` | 2px |
| `radius.tag` | 2px |
| `border.default` | 1px |
| `border.focus` | 2px |
| `texture.paper.opacity` | 0.04 |
| `texture.aubergine.opacity` | 0.025 |
| `motion.duration.fast` | 120ms |
| `motion.duration.standard` | 220ms |
| `motion.duration.deliberate` | 360ms |
| `motion.easing.standard` | cubic-bezier(0.2, 0, 0, 1) |

Surfaces and evidence frames use square corners. Controls and small tags use 2px corners. Pills are not part of the system. Shadows are reserved for overlays.

Reduced-motion mode makes non-essential transitions immediate and removes movement-based reveals.

## Component mappings

### Buttons

#### Primary

- Background: `color.action.primary.background`
- Foreground: `color.action.primary.foreground`
- Hover background: `color.action.primary.hover`
- Active background: `color.action.primary.active`
- Border: none
- Radius: `radius.control`
- Horizontal padding: `space.5`
- Minimum height: 44px
- Text style: `label`
- Disabled background: `color.action.disabled.background`
- Disabled foreground: `color.action.disabled.foreground`
- Disabled controls do not respond to hover or active input

#### Secondary

- Background: transparent
- Foreground: `color.action.secondary.foreground`
- Border: `border.default` using `color.action.secondary.border`
- Hover background: `color.surface.subtle`
- Radius: `radius.control`
- Horizontal padding: `space.5`
- Minimum height: 44px
- Text style: `label`
- Disabled background: `color.action.disabled.background`
- Disabled foreground: `color.action.disabled.foreground`
- Disabled controls do not respond to hover or active input

#### Tertiary

- Background: transparent
- Foreground: `color.link.foreground`
- Decoration: underline
- Hover: 2px underline
- Minimum target size: 44 by 44px
- Text style: `label`

All controls use a 2px `color.focus.ring` with a 2px offset. Active feedback translates the control down by 1px when motion is permitted.

### Navigation

- Height: 68px
- Horizontal padding: responsive layout edge
- Monogram size: 32px
- Link gap: 28px
- Link style: `label`
- Active indicator: underline in current text color
- Mobile behavior: one menu trigger with a 44px minimum target

### Hero

- Headline: `display.xl`, reduced to `heading.xl` on mobile
- Introductory copy: `body.lg`
- Maximum headline length: two desktop lines
- Maximum actions: one primary and one optional secondary
- Layout: asymmetric text and evidence composition
- Direction Band: maximum one hero appearance

### Case cards

#### Featured

- Background: `color.surface.raised`
- Border: `border.default` using `color.border.subtle`
- Radius: `radius.none`
- Padding: `space.10`
- Title: `heading.md`
- Layout: asymmetric text and media split

#### Compact

- Background: `color.surface.canvas` or `color.surface.raised`
- Border: `border.default` using `color.border.subtle`
- Radius: `radius.none`
- Padding: `space.8`
- Title: `heading.md`
- Includes one evidence preview

### Evidence frame

- Radius: `radius.none`
- Border: `border.default` using `color.border.strong`
- Supported ratios: 4:3 and 16:9
- Supported content: product UI, research artifact, journey map, system diagram, or contextual photography
- Caption: `caption`

### Decision callout

- Mode: Aubergine
- Background: `color.surface.canvas`
- Foreground: `color.text.primary`
- Padding: `space.8` to `space.10`
- Heading: `heading.lg`
- Optional Direction Band: `band.sm`

### Evidence note

- Background: `color.surface.subtle`
- Border: `border.default` using `color.border.subtle`
- Padding: `space.5` to `space.6`
- Heading: `label`
- Body: `body.sm`

### Metadata

- Text style: `caption` or `eyebrow`
- Background: none
- Pills are prohibited

### Contact call-to-action

- Statement: `heading.xl`
- Maximum actions: one primary
- Layout: asymmetric statement and action

### Footer

- Top border: `border.default` using `color.border.subtle`
- Text: `caption`
- Padding: `space.6` vertically and responsive layout edge horizontally

## Direction Band component

| Token | Small | Medium | Large |
|---|---:|---:|---:|
| Stripe width | 8px | 12px | 22px |
| Gap | 5px | 6px | 10px |
| Height | 40px | 74px | 120px |

Shared properties:

- Angle: 18 degrees
- Four equal-width stripes
- Fixed order: Research, Decide, Design, Ship
- Square ends
- No outline or keyline
- No per-stripe animation

Usage:

- One appearance in a hero or major evidence frame
- A second appearance is permitted at a major decision point
- Never use on every card
- Never crop to fewer than four stripes
- Never reorder or recolor
- Never use for status, charts, navigation, buttons, or form feedback

## Accessibility contract

Required pairings:

- Ink on Parchment: 13.08:1
- Parchment on Smoked Aubergine: 9.98:1
- Secondary text on Parchment: 5.53:1
- Tertiary text on Parchment: 4.55:1
- Secondary inverse text on Aubergine: 7.64:1
- Focus Cyan on Parchment: 3.05:1
- Focus Cyan on Aubergine: 3.28:1

Direction Band contrast:

| Color | On Aubergine | On Parchment |
|---|---:|---:|
| Research Cyan | 3.28:1 | 3.05:1 |
| Decide Green | 3.22:1 | 3.10:1 |
| Design Amber | 3.30:1 | 3.03:1 |
| Ship Red | 3.02:1 | 3.31:1 |

Rules:

- Direction Band colors are non-text graphic accents only.
- Body text must meet 4.5:1 at minimum, with AAA preferred.
- Large text must meet 3:1 at minimum.
- Meaning must not rely on color alone.
- Focus indicators must remain visible in both modes.
- Interactive targets must be at least 44 by 44px.
- Motion must respect `prefers-reduced-motion`.

## Surface rhythm

Parchment is the default page ground. Smoked Aubergine is reserved for one deliberate narrative shift such as a decision, working-principles section, or outcome. Raised and subtle surfaces create hierarchy elsewhere without turning every block into a card.

The two semantic modes may coexist on a page, but a component inherits only one mode at a time.

## Migration boundary

The future implementation will:

1. Add the design-system token package without changing routes or content.
2. Self-host Instrument Sans and replace Space Grotesk and DM Sans mappings.
3. Replace legacy color-profile variables with the new semantic tokens.
4. Migrate shared navigation, buttons, cards, and evidence patterns first.
5. Migrate page sections and case studies after shared components are stable.
6. Remove legacy theme profiles only after no references remain.

The migration will preserve existing URLs, primary navigation labels, SEO metadata, accessibility behavior, and analytics hooks.

## Validation requirements

The implementation must include checks for:

- Valid JSON and resolvable aliases
- One-to-one naming parity between Figma tables, JSON, and CSS
- Required semantic tokens present in both modes
- Contrast ratios for approved pairings
- No Direction Band colors used as button or status aliases
- No remaining references to legacy font or theme tokens after migration
- Responsive rendering at mobile, tablet, and desktop widths

## Deliverables

The completed package will include:

1. A design-system README with principles and usage guidance
2. Figma variable tables with collections, modes, values, and aliases
3. Core token JSON
4. Semantic token JSON with Parchment and Aubergine branches
5. Component token JSON with matching modes
6. A CSS custom-property build that mirrors the JSON names
7. Validation instructions and contrast documentation
