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
