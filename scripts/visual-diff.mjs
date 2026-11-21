#!/usr/bin/env node
// Optional visual diff harness for Apple-style fidelity checks.
// Requires dev dependencies: playwright, pixelmatch, pngjs.
// The core skill remains dependency-free; this script is opt-in.

import fs from 'node:fs';
import path from 'node:path';
import { commaArgs } from './lib/tokens.mjs';

const args = commaArgs();

if (args.includes('--help') || args.includes('-h')) {
  console.log(`apple-design visual-diff (optional)

Install dev dependencies first:
  npm i -D playwright pixelmatch pngjs
  npx playwright install chromium

Usage:
  node scripts/visual-diff.mjs --url=http://localhost:3000 \\
    --routes=/,/settings --baseline=./baseline --out=./visual-diff \\
    [--update] [--threshold=0.01] [--width=390] [--height=844]

Modes:
  --update   capture baseline screenshots instead of comparing
  default    capture candidate screenshots and compare against baseline

Exit code is 1 when any route exceeds the pixel threshold.`);
  process.exit(0);
}

function argValue(name, fallback) {
  const found = args.find((arg) => arg.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : fallback;
}

const url = argValue('url', 'http://localhost:3000');
const routes = argValue('routes', '/').split(',').map((item) => item.trim()).filter(Boolean);
const baselineDir = path.resolve(argValue('baseline', './visual-baseline'));
const outDir = path.resolve(argValue('out', './visual-diff'));
const threshold = Number(argValue('threshold', '0.01'));
const width = Number(argValue('width', '390'));
const height = Number(argValue('height', '844'));
const update = args.includes('--update');

if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
  console.error('Threshold must be between 0 and 1.');
  process.exit(2);
}

let chromium;
let pixelmatch;
let PNG;
try {
  ({ chromium } = await import('playwright'));
  ({ default: pixelmatch } = await import('pixelmatch'));
  ({ PNG } = await import('pngjs'));
} catch (error) {
  console.error('Optional dependencies missing. Install with:');
  console.error('  npm i -D playwright pixelmatch pngjs');
  console.error('  npx playwright install chromium');
  console.error(error.message);
  process.exit(2);
}

function safeName(route) {
  return route
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'root';
}

function decode(buffer) {
  return PNG.sync.read(buffer);
}

function encode(png) {
  return PNG.sync.write(png);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference'
});
const page = await context.newPage();

fs.mkdirSync(update ? baselineDir : outDir, { recursive: true });

const report = {
  url,
  routes,
  threshold,
  viewport: { width, height },
  mode: update ? 'update' : 'compare',
  results: []
};

for (const route of routes) {
  const target = new URL(route, url).toString();
  await page.goto(target, { waitUntil: 'networkidle' });
  const buffer = await page.screenshot({ animations: 'disabled' });
  const name = `${safeName(route)}.png`;

  if (update) {
    fs.writeFileSync(path.join(baselineDir, name), buffer);
    report.results.push({ route, name, mode: 'captured' });
    continue;
  }

  const baselinePath = path.join(baselineDir, name);
  if (!fs.existsSync(baselinePath)) {
    report.results.push({ route, name, error: 'baseline missing' });
    continue;
  }

  const expected = decode(fs.readFileSync(baselinePath));
  const actual = decode(buffer);
  if (expected.width !== actual.width || expected.height !== actual.height) {
    report.results.push({
      route,
      name,
      error: 'dimension mismatch',
      expected: `${expected.width}x${expected.height}`,
      actual: `${actual.width}x${actual.height}`
    });
    continue;
  }

  const diff = new PNG({ width: expected.width, height: expected.height });
  const mismatched = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    expected.width,
    expected.height,
    { threshold: 0.2 }
  );
  const ratio = mismatched / (expected.width * expected.height);
  const pass = ratio <= threshold;

  fs.writeFileSync(path.join(outDir, name), buffer);
  if (!pass) fs.writeFileSync(path.join(outDir, `${safeName(route)}-diff.png`), encode(diff));

  report.results.push({
    route,
    name,
    mismatchedPixels: mismatched,
    ratio: Number(ratio.toFixed(5)),
    pass
  });
}

await context.close();
await browser.close();

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(`Visual diff ${report.mode}`);
for (const result of report.results) {
  if (result.mode === 'captured') console.log(`CAPTURED ${result.route} -> ${result.name}`);
  else if (result.error) console.log(`ERROR    ${result.route} — ${result.error}`);
  else console.log(`${result.pass ? 'PASS' : 'FAIL'}     ${result.route} — ${(result.ratio * 100).toFixed(2)}% pixels`);
}
console.log(`Report: ${path.join(outDir, 'report.json')}`);

const failed = report.results.some((result) => result.error || result.pass === false);
if (failed) process.exit(1);
process.exit(0);
