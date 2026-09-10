import fs from 'node:fs';
import path from 'node:path';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isToken(value) {
  return Boolean(
    value && typeof value === 'object' && !Array.isArray(value)
      && '$type' in value && '$value' in value,
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
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
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
