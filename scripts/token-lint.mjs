#!/usr/bin/env node
// Strict token lint: flags raw values that belong in tokens-apple-style.md.
// Complements audit.mjs. Node built-ins only.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const positional = args.filter((arg) => !arg.startsWith('--'));
const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, '..');
const targetArg = path.resolve(positional[0] || path.join(skillRoot, 'references'));

if (wantsHelp) {
  console.log(`apple-design token-lint

Usage:
  node scripts/token-lint.mjs [path] [--json] [--strict]

Flags raw hex, raw radius, raw duration, raw font-family, and raw shadow
values in source files. Token source files are skipped.
Exits 1 only with --strict when warnings exist.`);
  process.exit(0);
}

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '.turbo', 'generated', '_vendor'
]);

const SKIP_FILE_NAMES = new Set([
  'tokens-apple-style.md',
  'design-apple-style.md',
  'animations-apple-style.md'
]);

const CODE_EXTENSIONS = new Set([
  '.css', '.scss', '.sass', '.less',
  '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
  '.html', '.swift'
]);

const ALLOWED_RADII = new Set(['0', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '28', '999', '9999']);

const RULES = [
  {
    id: 'raw-hex',
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    format: (m) => `Raw hex ${m[0]}. Use var(--apple-color-*) or a semantic token.`,
    severity: 'warning',
    ignoreIfTokenRefNearby: true
  },
  {
    id: 'raw-radius',
    pattern: /border-radius\s*:\s*(\d+(?:\.\d+)?)px/gi,
    when: (m) => !ALLOWED_RADII.has(m[1]),
    format: (m) => `Raw radius ${m[1]}px. Use a radius token.`,
    severity: 'warning'
  },
  {
    id: 'raw-duration',
    pattern: /(?:transition|animation)[^;]*?(\d+(?:\.\d+)?)(ms|s)\b/gi,
    when: (m) => {
      const value = Number(m[1]);
      const unit = m[2].toLowerCase();
      const ms = unit === 's' ? value * 1000 : value;
      return ![80, 120, 150, 250, 300, 350, 400, 450, 500].includes(ms);
    },
    format: (m) => `Raw duration ${m[1]}${m[2]}. Use a duration token.`,
    severity: 'warning'
  },
  {
    id: 'raw-font-family',
    pattern: /font-family\s*:\s*([^;]+);/gi,
    when: (m) => !/var\(--apple-font|system-ui|-apple-system|BlinkMacSystemFont|SF Pro/.test(m[1]),
    format: () => 'Raw font-family. Use a font token or system font stack.',
    severity: 'warning'
  },
  {
    id: 'raw-shadow',
    pattern: /box-shadow\s*:\s*([^;]+);/gi,
    when: (m) => !/var\(--apple-shadow|--apple-hairline/.test(m[1]),
    format: () => 'Raw box-shadow. Use a shadow token.',
    severity: 'warning'
  }
];

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

function scanFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!CODE_EXTENSIONS.has(ext)) return { file, findings: [] };
  if (SKIP_FILE_NAMES.has(path.basename(file))) return { file, findings: [] };

  const buffer = fs.readFileSync(file);
  if (buffer.length > 2_000_000) return { file, findings: [] };
  const text = buffer.toString('utf8');
  if (text.includes('apple-design-audit:ignore') || text.includes('apple-design-token-lint:ignore')) {
    return { file, findings: [] };
  }

  const findings = [];
  for (const rule of RULES) {
    for (const match of text.matchAll(rule.pattern)) {
      if (rule.when && !rule.when(match)) continue;
      if (rule.ignoreIfTokenRefNearby) {
        const start = Math.max(0, (match.index ?? 0) - 120);
        const end = Math.min(text.length, (match.index ?? 0) + 120);
        const nearby = text.slice(start, end);
        if (/var\(--apple-color|AppleTokens\.color|Color\.uiColor/.test(nearby)) continue;
      }
      findings.push({
        id: rule.id,
        severity: rule.severity,
        line: lineAt(text, match.index ?? 0),
        message: rule.format(match)
      });
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
const files = walk(targetArg);
const results = files.map(scanFile).filter((result) => result.findings.length > 0);
const allFindings = results.flatMap((result) => result.findings);
const warnings = allFindings.filter((finding) => finding.severity === 'warning').length;

if (asJson) {
  console.log(JSON.stringify({ target: targetArg, files: files.length, warnings, results }, null, 2));
} else {
  console.log('Apple design token lint');
  console.log(`Target: ${targetArg}`);
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
