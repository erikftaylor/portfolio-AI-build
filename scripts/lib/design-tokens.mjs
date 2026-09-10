import fs from 'node:fs';
import path from 'node:path';

const aliasPattern = /^\{([^}]+)\}$/;

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
