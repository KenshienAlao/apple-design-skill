#!/usr/bin/env node
// Checks semantic color pairs against WCAG contrast targets.
// Uses token values from references/tokens-apple-style.md. Node built-ins only.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  commaArgs,
  contrastRatio,
  parseColor,
  readTokenSource
} from './lib/tokens.mjs';

const args = commaArgs();
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const positional = args.filter((arg) => !arg.startsWith('--'));
const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, '..');
const defaultInput = path.join(skillRoot, 'references', 'tokens-apple-style.md');
const inputPath = path.resolve(positional[0] || defaultInput);

if (wantsHelp) {
  console.log(`apple-design check-contrast

Usage:
  node scripts/check-contrast.mjs [tokens.md] [--json] [--strict]

Checks light and dark semantic pairs. Exits 1 with --strict when a
configured pair misses its target.`);
  process.exit(0);
}

let source;
try {
  source = readTokenSource(inputPath, fs);
} catch {
  console.error(`Token source not found: ${inputPath}`);
  process.exit(2);
}

const PAIRS = [
  { name: 'label / bg', fg: 'apple-color-label', bg: 'apple-color-bg', target: 4.5, kind: 'body' },
  { name: 'label / surface', fg: 'apple-color-label', bg: 'apple-color-surface', target: 4.5, kind: 'body' },
  { name: 'label / surface-2', fg: 'apple-color-label', bg: 'apple-color-surface-2', target: 4.5, kind: 'body' },
  { name: 'label-2 / bg', fg: 'apple-color-label-2', bg: 'apple-color-bg', target: 3.0, kind: 'secondary' },
  { name: 'label-2 / surface', fg: 'apple-color-label-2', bg: 'apple-color-surface', target: 3.0, kind: 'secondary' },
  { name: 'label-3 / bg', fg: 'apple-color-label-3', bg: 'apple-color-bg', target: 1.7, kind: 'decorative metadata' },
  { name: 'label-3 / surface', fg: 'apple-color-label-3', bg: 'apple-color-surface', target: 1.7, kind: 'decorative metadata' },
  { name: 'tint-contrast / tint', fg: 'apple-color-tint-contrast', bg: 'apple-color-tint', target: 3.0, kind: 'large/bold control label' },
  { name: 'tint / bg', fg: 'apple-color-tint', bg: 'apple-color-bg', target: 3.0, kind: 'ui' },
  { name: 'tint / surface', fg: 'apple-color-tint', bg: 'apple-color-surface', target: 3.0, kind: 'ui' },
  { name: 'red / bg', fg: 'apple-color-red', bg: 'apple-color-bg', target: 3.0, kind: 'ui' },
  { name: 'green / bg', fg: 'apple-color-green', bg: 'apple-color-bg', target: 2.0, kind: 'status accent' },
  { name: 'orange / bg', fg: 'apple-color-orange', bg: 'apple-color-bg', target: 2.0, kind: 'status accent' }
];

function resolveColor(set, name) {
  const value = set[name];
  if (!value) return null;
  return parseColor(value);
}

function checkSet(label, set, baseBgName) {
  const baseBg = resolveColor(set, baseBgName) || { r: 1, g: 1, b: 1, a: 1 };
  return PAIRS.map((pair) => {
    const fg = resolveColor(set, pair.fg);
    const bg = resolveColor(set, pair.bg) || baseBg;
    if (!fg || !bg) {
      return { ...pair, theme: label, ratio: null, pass: false, error: 'unresolved token' };
    }
    const ratio = contrastRatio(fg, bg);
    return {
      ...pair,
      theme: label,
      ratio: Number(ratio.toFixed(2)),
      pass: ratio >= pair.target,
      error: null
    };
  });
}

const results = [
  ...checkSet('light', source.light, 'apple-color-bg'),
  ...checkSet('dark', source.dark, 'apple-color-bg')
];
const failures = results.filter((result) => !result.pass);

if (asJson) {
  console.log(JSON.stringify({ source: path.basename(inputPath), results, failures: failures.length }, null, 2));
} else {
  console.log('Apple design contrast check');
  console.log(`Source: ${inputPath}`);
  console.log('');
  for (const result of results) {
    const ratio = result.ratio === null ? 'n/a' : `${result.ratio.toFixed(2)}:1`;
    const mark = result.pass ? 'PASS' : 'FAIL';
    console.log(`${mark}  ${result.theme.padEnd(5)} ${result.name.padEnd(24)} ${ratio.padEnd(8)} target ${result.target.toFixed(1)} (${result.kind})`);
  }
  console.log('');
  console.log(`Pairs: ${results.length}`);
  console.log(`Failures: ${failures.length}`);
}

if (strict && failures.length > 0) process.exit(1);
process.exit(0);
