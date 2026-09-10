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
