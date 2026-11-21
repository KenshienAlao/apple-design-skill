#!/usr/bin/env node
// Static accessibility audit for HTML/JSX/TSX/Vue/Svelte sources.
// Catches common structural defects. Not a replacement for screen reader testing.
// Node built-ins only.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const platformArg = args.find((arg) => arg.startsWith('--platform='))?.slice('--platform='.length) || 'any';
const positional = args.filter((arg) => !arg.startsWith('--'));
const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, '..');
const targetArg = path.resolve(positional[0] || process.cwd());

const VALID_PLATFORMS = new Set(['any', 'ios', 'android', 'web', 'desktop']);
if (!VALID_PLATFORMS.has(platformArg)) {
  console.error(`Unknown platform: ${platformArg}`);
  process.exit(2);
}

if (wantsHelp) {
  console.log(`apple-design a11y-audit

Usage:
  node scripts/a11y-audit.mjs [path] [--platform=any|ios|android|web|desktop] [--json] [--strict]

Static checks: document language, main landmark, image alt, control names,
label association, heading order, positive tabindex, clickable divs, Reduce
Motion hooks, plus cross-platform naming (aria-label, contentDescription,
accessibilityLabel). Exits 1 only with --strict when warnings exist.`);
  process.exit(0);
}

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '.turbo', 'generated', '_vendor'
]);

const CODE_EXTENSIONS = new Set([
  '.html', '.htm', '.jsx', '.tsx', '.vue', '.svelte',
  '.swift', '.kt', '.xml'
]);

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

function walk(target) {
  const found = [];
  let stat;
  try {
    stat = fs.statSync(target);
  } catch {
    return found;
  }
  if (stat.isFile()) return [target];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
    const next = path.join(target, entry.name);
    if (entry.isDirectory()) found.push(...walk(next));
    else if (entry.isFile()) found.push(next);
  }
  return found;
}

function addFinding(findings, text, index, id, message, severity = 'warning') {
  findings.push({ id, severity, line: lineAt(text, index), message });
}

function scanFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!CODE_EXTENSIONS.has(ext)) return { file, findings: [] };

  const buffer = fs.readFileSync(file);
  if (buffer.length > 2_000_000) return { file, findings: [] };
  const text = buffer.toString('utf8');
  if (text.includes('apple-design-audit:ignore')) return { file, findings: [] };

  const findings = [];
  const isHtml = ext === '.html' || ext === '.htm';

  if (isHtml) {
    const htmlTag = /<html\b([^>]*)>/i.exec(text);
    if (!htmlTag || !/\blang\s*=/.test(htmlTag[1])) {
      addFinding(findings, text, htmlTag?.index ?? 0, 'missing-lang', 'Document has no html lang attribute.');
    }
    if (!/<main\b/i.test(text)) {
      addFinding(findings, text, 0, 'missing-main', 'No main landmark found.');
    }
  }

  for (const match of text.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt\s*=/.test(match[1])) {
      addFinding(findings, text, match.index, 'img-alt', 'Image has no alt attribute.');
    }
  }

  for (const match of text.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attrs = match[1] || '';
    const inner = match[2] || '';
    const hasName = /\baria-label\s*=/.test(attrs)
      || /\baria-labelledby\s*=/.test(attrs)
      || /\btitle\s*=/.test(attrs)
      || /[^\s<]/.test(inner.replace(/<[^>]+>/g, ''));
    if (!hasName) {
      addFinding(findings, text, match.index, 'button-name', 'Button has no accessible name.');
    }
  }

  for (const match of text.matchAll(/<input\b([^>]*)>/gi)) {
    const attrs = match[1] || '';
    if (/\btype\s*=\s*["'](?:hidden|submit|button|image)["']/i.test(attrs)) continue;
    const hasName = /\baria-label\s*=/.test(attrs)
      || /\baria-labelledby\s*=/.test(attrs)
      || /\bplaceholder\s*=/.test(attrs)
      || /\bid\s*=/.test(attrs);
    if (!hasName) {
      addFinding(findings, text, match.index, 'input-name', 'Input has no label or accessible name.');
    }
  }

  for (const match of text.matchAll(/<h([1-6])\b/gi)) {
    const level = Number(match[1]);
    const previous = findings.length;
    const prevHeading = text.slice(0, match.index).match(/<h([1-6])\b/gi);
    if (prevHeading) {
      const prevLevel = Number(prevHeading[prevHeading.length - 1].slice(2));
      if (level > prevLevel + 1) {
        addFinding(findings, text, match.index, 'heading-order', `Heading jumps from h${prevLevel} to h${level}.`);
      }
    }
    void previous;
  }

  for (const match of text.matchAll(/tabindex\s*=\s*["']?([1-9]\d*)["']?/gi)) {
    addFinding(findings, text, match.index, 'positive-tabindex', `Positive tabindex ${match[1]} breaks natural focus order.`);
  }

  for (const match of text.matchAll(/<(div|span)\b([^>]*)\bonClick\b([^>]*)>/gi)) {
    const attrs = `${match[2] || ''}${match[3] || ''}`;
    const tagWindow = text.slice(match.index, match.index + 300);
    if (/\baria-hidden\s*=\s*["']true["']/.test(tagWindow)) continue;
    if (!/\brole\s*=/.test(attrs) || !/\btabIndex\b|\btabindex\s*=/.test(attrs)) {
      addFinding(findings, text, match.index, 'clickable-noncontrol', 'Clickable div/span lacks role and keyboard focus.');
    }
  }

  const usesMotion = /(transition|animation|@keyframes|animate-|framer-motion)/i.test(text);
  const hasReduced = /prefers-reduced-motion|accessibilityReduceMotion|useReducedMotion/i.test(text);
  if (usesMotion && !hasReduced) {
    addFinding(findings, text, 0, 'reduce-motion', 'Motion detected with no Reduce Motion hook.');
  }

  // Cross-platform naming. Controls with visible text are already named;
  // graphics and label-less toggles need an explicit platform API.
  if (ext === '.swift') {
    for (const match of text.matchAll(/\bImage\s*\(/g)) {
      const window = text.slice(match.index, match.index + 240);
      if (!/\.accessibility(Label|Hidden)/.test(window)) {
        addFinding(findings, text, match.index, 'swift-image-name', 'SwiftUI Image has no accessibilityLabel or accessibilityHidden.');
      }
    }
    for (const match of text.matchAll(/\bToggle\s*\(/g)) {
      const window = text.slice(match.index, match.index + 300);
      if (!/\.accessibilityLabel\s*\(/.test(window) && !/\{\s*Text\s*\(/.test(window)) {
        addFinding(findings, text, match.index, 'swift-toggle-name', 'SwiftUI Toggle has no name. Add accessibilityLabel or a visible Text label.');
      }
    }
  }

  if (ext === '.kt') {
    for (const match of text.matchAll(/\b(?:Icon|Image)\s*\(/g)) {
      const window = text.slice(match.index, match.index + 300);
      if (!/\bcontentDescription\b/.test(window)) {
        addFinding(findings, text, match.index, 'compose-graphic-name', 'Compose Icon/Image has no contentDescription. Use null when decorative.');
      }
    }
  }

  if (ext === '.xml') {
    for (const match of text.matchAll(/<(?:ImageView|ImageButton)\b([^>]*)>/gi)) {
      if (!/android:contentDescription\s*=/.test(match[1])) {
        addFinding(findings, text, match.index, 'xml-graphic-name', 'Image view has no android:contentDescription. Use @null when decorative.');
      }
    }
  }

  return { file, findings };
}

let stat;
try {
  stat = fs.statSync(targetArg);
} catch {
  console.error(`Target not found: ${targetArg}`);
  process.exit(2);
}
if (!stat.isFile() && !stat.isDirectory()) {
  console.error(`Target is not a file or directory: ${targetArg}`);
  process.exit(2);
}

const files = walk(targetArg);
const results = files.map(scanFile).filter((result) => result.findings.length > 0);
const allFindings = results.flatMap((result) => result.findings);
const warnings = allFindings.filter((finding) => finding.severity === 'warning').length;

if (asJson) {
  console.log(JSON.stringify({ target: targetArg, platform: platformArg, files: files.length, warnings, results }, null, 2));
} else {
  console.log('Apple design accessibility audit');
  console.log(`Target: ${targetArg}`);
  console.log(`Platform: ${platformArg}`);
  console.log(`Files scanned: ${files.length}`);
  console.log(`Warnings: ${warnings}`);
  for (const result of results) {
    const rel = path.relative(process.cwd(), result.file) || result.file;
    for (const finding of result.findings) {
      console.log(`${rel}:${finding.line} [${finding.severity}] ${finding.id} — ${finding.message}`);
    }
  }
}

if (strict && warnings > 0) process.exit(1);
process.exit(0);
