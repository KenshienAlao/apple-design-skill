#!/usr/bin/env node
// Opt-in rendered accessibility scan using Playwright and axe-core.
// Requires: npm i -D playwright @axe-core/playwright && npx playwright install chromium
// Core skill stays dependency-free; this script loads tools lazily.

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2);
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const urlArg = args.find((arg) => arg.startsWith('--url='))?.slice('--url='.length);
const tagArg = args.find((arg) => arg.startsWith('--tags='))?.slice('--tags='.length) || 'wcag2a,wcag2aa,wcag21aa';
const here = path.dirname(fileURLToPath(import.meta.url));

if (wantsHelp) {
  console.log(`apple-design a11y-probe

Usage:
  node scripts/a11y-probe.mjs --url=http://localhost:3000 [--tags=wcag2a,wcag2aa] [--json] [--strict] [--help]

Opt-in rendered accessibility scan. Unlike a11y-audit.mjs (static, built-in only),
this runs a real browser and axe-core against a live URL.

Setup (one time):
  npm i -D playwright @axe-core/playwright
  npx playwright install chromium

Exits 1 with --strict when axe reports violations. Missing dependencies print an
install hint and exit 2.`);
  process.exit(0);
}

if (!urlArg) {
  console.error('Missing --url. See --help.');
  process.exit(2);
}

let chromium;
let AxeBuilder;
try {
  ({ chromium } = await import('playwright'));
  ({ default: AxeBuilder } = await import('@axe-core/playwright'));
} catch {
  console.error('a11y-probe needs optional dev dependencies.');
  console.error('Install: npm i -D playwright @axe-core/playwright && npx playwright install chromium');
  process.exit(2);
}

const impactOrder = ['critical', 'serious', 'moderate', 'minor'];
const tags = tagArg.split(',').map((t) => t.trim()).filter(Boolean);

let browser;
let report;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(urlArg, { waitUntil: 'networkidle', timeout: 30_000 });
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  report = {
    url: urlArg,
    tags,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 10).map((n) => n.target)
    })),
    passes: results.passes.length,
    incomplete: results.incomplete.length
  };
} catch (error) {
  console.error(`a11y-probe failed: ${error.message}`);
  process.exit(2);
} finally {
  if (browser) await browser.close();
}

const blocking = report.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').length;

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('Apple design accessibility probe');
  console.log(`URL: ${report.url}`);
  console.log(`Tags: ${report.tags.join(', ')}`);
  console.log(`Passes: ${report.passes}`);
  console.log(`Violations: ${report.violations.length}`);
  report.violations.sort((a, b) => impactOrder.indexOf(a.impact) - impactOrder.indexOf(b.impact));
  for (const v of report.violations) {
    console.log(`[${v.impact}] ${v.id} — ${v.help} (${v.nodes} nodes)`);
    for (const target of v.targets) console.log(`    ${JSON.stringify(target)}`);
  }
}

void here;
if (strict && blocking > 0) process.exit(1);
process.exit(0);
