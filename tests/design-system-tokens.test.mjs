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
