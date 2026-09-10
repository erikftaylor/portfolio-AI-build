import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  contrastRatio,
  createRegistry,
  flattenTokens,
  loadTokenBundle,
  resolveValue,
} from '../scripts/lib/design-tokens.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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

test('core aliases are limited to the approved display-family alias', () => {
  const { core } = loadTokenBundle(projectRoot);
  for (const [tokenPath, token] of flattenTokens(core)) {
    if (tokenPath === 'font.family.display') continue;
    assert.equal(
      typeof token.$value === 'string' && token.$value.startsWith('{'),
      false,
      `${tokenPath} must use a raw value`,
    );
  }
});

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
