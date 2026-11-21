#!/usr/bin/env node
// Generates token outputs from references/tokens-apple-style.md.
// Supports css, json, swift, tailwind, kotlin, and xml. Node built-ins only.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  camelCase,
  categoryOf,
  commaArgs,
  parseColor,
  readTokenSource,
  writeIfChanged
} from './lib/tokens.mjs';

const args = commaArgs();
const wantsHelp = args.includes('--help') || args.includes('-h');
const formatArg = args.find((arg) => arg.startsWith('--format='));
const outArg = args.find((arg) => arg.startsWith('--out='));
const positional = args.filter((arg) => !arg.startsWith('--'));
const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, '..');
const defaultInput = path.join(skillRoot, 'references', 'tokens-apple-style.md');
const inputPath = path.resolve(positional[0] || defaultInput);
const format = formatArg?.slice('--format='.length) || 'all';
const outDir = path.resolve(outArg?.slice('--out='.length) || path.join(skillRoot, 'generated'));

const formats = new Set(['css', 'json', 'swift', 'tailwind', 'kotlin', 'xml']);
const selected = format === 'all' ? [...formats] : [format];

if (wantsHelp) {
  console.log(`apple-design generate-tokens

Usage:
  node scripts/generate-tokens.mjs [input.md] [--format=css|json|swift|tailwind|kotlin|xml|all] [--out=dir]

Reads token declarations from references/tokens-apple-style.md and writes:
  tokens.css
  tokens.json
  AppleTokens.swift
  tailwind.tokens.cjs
  Theme.kt
  colors.xml

Defaults:
  input: references/tokens-apple-style.md
  format: all
  out: generated/`);
  process.exit(0);
}

for (const item of selected) {
  if (!formats.has(item)) {
    console.error(`Unknown format: ${item}`);
    process.exit(2);
  }
}

let source;
try {
  source = readTokenSource(inputPath, fs);
} catch {
  console.error(`Token source not found: ${inputPath}`);
  process.exit(2);
}

function cssBlock(vars, indent = '  ') {
  return Object.entries(vars)
    .map(([name, value]) => `${indent}--${name}: ${value};`)
    .join('\n');
}

function generateCSS() {
  return `/* Generated from ${path.basename(inputPath)}. Do not edit by hand. */
:root {
${cssBlock(source.light)}
}

@media (prefers-color-scheme: dark) {
  :root {
${cssBlock(source.dark, '    ')}
  }
}
`;
}

function generateJSON() {
  return `${JSON.stringify({
    source: path.basename(inputPath),
    light: source.light,
    dark: source.dark,
    order: source.order
  }, null, 2)}\n`;
}

function memberName(tokenName) {
  const withoutPrefix = tokenName.replace(/^apple-/, '');
  const category = categoryOf(tokenName);
  const categoryPrefix = `${category}-`;
  const base = withoutPrefix.startsWith(categoryPrefix)
    ? withoutPrefix.slice(categoryPrefix.length)
    : withoutPrefix;
  return base === 'hairline' ? 'hairline' : camelCase(base);
}

function swiftLiteral(name, rawValue) {
  const value = rawValue.trim();

  if (categoryOf(name) === 'color') {
    const color = parseColor(value);
    if (color) {
      return `SwiftUI.Color(uiColor: UIColor(red: ${color.r.toFixed(3)}, green: ${color.g.toFixed(3)}, blue: ${color.b.toFixed(3)}, alpha: ${color.a.toFixed(3)}))`;
    }
  }

  const number = /^(-?[\d.]+)(px|ms|s|deg)?$/.exec(value);
  if (number) {
    const numeric = Number(number[1]);
    if (number[2] === 'ms') return `TimeInterval(${(numeric / 1000).toFixed(3)})`;
    if (number[2] === 's') return `TimeInterval(${numeric.toFixed(3)})`;
    if (number[2] === 'px') return `CGFloat(${numeric})`;
    if (number[2] === 'deg') return `Angle(degrees: ${numeric})`;
    return `Int(${numeric})`;
  }

  if (/^\d+$/.test(value)) return `Int(${value})`;
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function generateSwift() {
  const lines = [
    '// Generated from ' + path.basename(inputPath) + '. Do not edit by hand.',
    'import SwiftUI',
    '',
    'enum AppleTokens {'
  ];

  const grouped = new Map();
  for (const name of source.order) {
    const cat = categoryOf(name);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(name);
  }

  const enumNames = {
    color: 'Color',
    font: 'Font',
    type: 'Type',
    space: 'Space',
    radius: 'Radius',
    duration: 'Duration',
    ease: 'Ease',
    spring: 'Spring',
    shadow: 'Shadow',
    size: 'Size',
    z: 'Layer'
  };

  for (const [cat, names] of grouped) {
    lines.push(`  enum ${enumNames[cat] || 'Other'} {`);
    for (const name of names) {
      lines.push(`    static let ${memberName(name)} = ${swiftLiteral(name, source.all[name])}`);
    }
    lines.push('  }', '');
  }

  lines.push('}');
  return `${lines.join('\n')}\n`;
}

function tailwindGroup(name) {
  const cat = categoryOf(name);
  const suffix = name.replace(/^apple-[a-z]+-?/, '');
  if (cat === 'color') return ['colors', suffix];
  if (cat === 'font') return ['fontFamily', suffix];
  if (cat === 'space') return ['spacing', suffix];
  if (cat === 'radius') return ['borderRadius', suffix];
  if (cat === 'duration') return ['transitionDuration', suffix];
  if (cat === 'ease' || cat === 'spring') return ['transitionTimingFunction', suffix];
  if (cat === 'size') {
    if (suffix.startsWith('icon-')) return ['width', suffix];
    if (suffix === 'target-min') return ['minWidth', suffix];
    return ['maxWidth', suffix];
  }
  if (cat === 'type') {
    if (suffix.endsWith('-size')) return ['fontSize', suffix.replace(/-size$/, '')];
    if (suffix.endsWith('-line')) return ['lineHeight', suffix.replace(/-line$/, '')];
    if (suffix.endsWith('-weight')) return ['fontWeight', suffix.replace(/-weight$/, '')];
  }
  return [null, null];
}

function generateTailwind() {
  const grouped = new Map();

  for (const name of source.order) {
    const [group, key] = tailwindGroup(name);
    if (!group) continue;
    if (!grouped.has(group)) grouped.set(group, {});
    grouped.get(group)[key] = `var(--${name})`;
  }

  const body = [...grouped.entries()]
    .map(([group, values]) => `      ${group}: ${JSON.stringify(values, null, 2).replace(/\n/g, '\n      ')}`)
    .join(',\n');

  return `// Generated from ${path.basename(inputPath)}. Do not edit by hand.
module.exports = {
  theme: {
    extend: {
${body}
    }
  }
};
`;
}

function androidArgb(rawValue) {
  const color = parseColor(rawValue.trim());
  if (!color) return null;
  const hex = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, '0').toUpperCase();
  return `0x${hex(color.a)}${hex(color.r)}${hex(color.g)}${hex(color.b)}`;
}

function androidXml(rawValue) {
  const color = parseColor(rawValue.trim());
  if (!color) return null;
  const hex = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${hex(color.a)}${hex(color.r)}${hex(color.g)}${hex(color.b)}`;
}

function colorNames() {
  return source.order.filter((name) => categoryOf(name) === 'color');
}

function generateKotlin() {
  const lines = [
    '// Generated from ' + path.basename(inputPath) + '. Do not edit by hand.',
    'package design.tokens',
    '',
    'import androidx.compose.ui.graphics.Color',
    '',
    'object AppleTokens {'
  ];
  for (const name of colorNames()) {
    const value = androidArgb(source.light[name] || source.all[name]);
    if (value) lines.push(`  val ${memberName(name)} = Color(${value})`);
  }
  lines.push('', '  object Dark {');
  for (const name of colorNames()) {
    const value = source.dark[name] ? androidArgb(source.dark[name]) : null;
    if (value) lines.push(`    val ${memberName(name)} = Color(${value})`);
  }
  lines.push('  }', '}');
  return `${lines.join('\n')}\n`;
}

function generateAndroidXml() {
  const lines = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!-- Generated from ' + path.basename(inputPath) + '. Do not edit by hand. -->',
    '<resources>'
  ];
  for (const name of colorNames()) {
    const value = androidXml(source.light[name] || source.all[name]);
    if (!value) continue;
    const resName = 'apple_' + name.replace(/^apple-color-/, '').replace(/-/g, '_');
    lines.push(`  <color name="${resName}">${value}</color>`);
  }
  lines.push('</resources>');
  return `${lines.join('\n')}\n`;
}

const outputs = {
  css: ['tokens.css', generateCSS()],
  json: ['tokens.json', generateJSON()],
  swift: ['AppleTokens.swift', generateSwift()],
  tailwind: ['tailwind.tokens.cjs', generateTailwind()],
  kotlin: ['Theme.kt', generateKotlin()],
  xml: ['colors.xml', generateAndroidXml()]
};

fs.mkdirSync(outDir, { recursive: true });
const written = [];

for (const item of selected) {
  const [fileName, content] = outputs[item];
  const target = path.join(outDir, fileName);
  const changed = writeIfChanged(target, content, fs, path);
  written.push(`${changed ? 'wrote' : 'unchanged'} ${target}`);
}

console.log(`Token source: ${inputPath}`);
for (const line of written) console.log(line);
