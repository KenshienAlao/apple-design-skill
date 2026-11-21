#!/usr/bin/env node
// Regenerates the showcase token sheets from the skill's markdown token source.
// The generated CSS is disposable; the markdown token sheet is the source of truth.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(here, '..');
const skillRoot = path.resolve(showcaseRoot, '..');
const source = path.join(skillRoot, 'references', 'tokens-apple-style.md');
const generator = path.join(skillRoot, 'scripts', 'generate-tokens.mjs');
const outDir = path.join(showcaseRoot, 'src');
const marker = '/* apple-design-audit:ignore apple-design-token-lint:ignore apple-design-code-audit:ignore */\n';

execFileSync(process.execPath, [generator, source, '--format=css', `--out=${outDir}`], {
  stdio: 'inherit'
});

// The reference sheet places its dark color block before the shared token
// blocks, so the upstream CSS parser classifies shared tokens as dark-only.
// Normalize here without changing any value: colors stay per-appearance, and
// typography, spacing, radius, motion, size, and z tokens stay shared.
const sourceText = fs.readFileSync(source, 'utf8');
const darkStart = sourceText.indexOf('@media (prefers-color-scheme: dark)');
if (darkStart < 0) {
  console.error('Could not find the dark token block in the token source.');
  process.exit(1);
}

const declaration = /--(apple-[\w-]+)\s*:\s*([^;]+);/g;
const lightColors = {};
const darkColors = {};
const shared = {};
const colorOrder = [];
const sharedOrder = [];

for (const match of sourceText.matchAll(declaration)) {
  const token = `--${match[1]}`;
  const value = match[2].trim();
  const isDark = (match.index ?? 0) > darkStart;
  const isColor = match[1].startsWith('apple-color-');

  if (isColor) {
    const target = isDark ? darkColors : lightColors;
    if (!(token in target)) target[token] = value;
    if (!colorOrder.includes(token)) colorOrder.push(token);
  } else {
    if (!(token in shared)) shared[token] = value;
    if (!sharedOrder.includes(token)) sharedOrder.push(token);
  }
}

if (!colorOrder.length || !sharedOrder.length) {
  console.error('Could not derive color and shared tokens from the token source.');
  process.exit(1);
}

function block(values, order, indent = '  ') {
  return order.map((token) => `${indent}${token}: ${values[token]};`).join('\n');
}

for (const token of colorOrder) {
  if (!(token in lightColors) || !(token in darkColors)) {
    console.error(`Missing an appearance value for ${token}.`);
    process.exit(1);
  }
}

const css = `${marker}/* Generated from ${path.basename(source)}. Do not edit by hand. */
/* Shared tokens are emitted for both appearances; only colors diverge. */
:root {
${block(lightColors, colorOrder)}

${block(shared, sharedOrder)}
}

@media (prefers-color-scheme: dark) {
  :root {
${block(darkColors, colorOrder, '    ')}
  }
}
`;

fs.writeFileSync(path.join(outDir, 'tokens.css'), css);

const appearance = `${marker}/* Generated from ${path.basename(source)}. Do not edit by hand. */
/* Scoped appearance overrides use the same token values as the root sheet. */

[data-appearance='light'] {
${block(lightColors, colorOrder)}
${block(shared, sharedOrder)}
}

[data-appearance='dark'] {
${block(darkColors, colorOrder)}
${block(shared, sharedOrder)}
}
`;

fs.writeFileSync(path.join(outDir, 'appearance.css'), appearance);
console.log(`Wrote scoped appearance tokens to ${path.join(outDir, 'appearance.css')}`);
