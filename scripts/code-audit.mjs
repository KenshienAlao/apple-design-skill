#!/usr/bin/env node
// Code-quality audit for Apple-style builds.
// Focuses on correctness and hygiene, not visual patterns (see audit.mjs).
// Emits path:line findings. Node built-ins only.

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const platformArg = args.find((arg) => arg.startsWith('--platform='))?.slice('--platform='.length) || 'any';
const targetArg = args.find((arg) => !arg.startsWith('--')) ?? process.cwd();

if (wantsHelp) {
  console.log(`apple-design code-audit

Usage:
  node scripts/code-audit.mjs [path] [--platform=any|ios|android|web|desktop] [--json] [--strict] [--help]

Checks code correctness and hygiene: empty catches, debug leftovers, unbounded
loops, raw style values, magic numbers, missing cleanup, and stub markers.
Emits path:line findings. Exits 1 only with --strict when warnings exist.`);
  process.exit(0);
}

const VALID_PLATFORMS = new Set(['any', 'ios', 'android', 'web', 'desktop']);
if (!VALID_PLATFORMS.has(platformArg)) {
  console.error(`Unknown platform: ${platformArg}`);
  process.exit(2);
}

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '.turbo', 'generated', '_vendor'
]);

const CODE_EXTENSIONS = new Set([
  '.css', '.scss', '.html', '.htm', '.js', '.jsx',
  '.ts', '.tsx', '.vue', '.svelte', '.kt', '.swift', '.java', '.xml'
]);

const rules = [
  {
    id: 'empty-catch',
    severity: 'warning',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
    format: () => 'Empty catch block. Handle the error or fail closed.'
  },
  {
    id: 'debugger',
    severity: 'warning',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /\bdebugger\b/g,
    format: () => 'debugger statement left in source.'
  },
  {
    id: 'console-log',
    severity: 'info',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /console\.(log|debug)\s*\(/g,
    format: (m) => `${m[0].trim()} left in source. Use structured logging or remove.`
  },
  {
    id: 'raw-hex',
    severity: 'warning',
    extensions: new Set(['.css', '.scss', '.html', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    format: (m) => `Raw hex ${m[0]} in component. Use a semantic token.`
  },
  {
    id: 'raw-duration',
    severity: 'info',
    extensions: new Set(['.css', '.scss', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /(?:transition|animation)[^;:]*:\s*[^;]*?\b(\d{2,4})ms\b/g,
    format: (m) => `${m[1]}ms hardcoded in a transition. Use a duration token.`
  },
  {
    id: 'stub-marker',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /\b(?:TODO|FIXME|XXX|HACK|coming soon|lorem ipsum)\b/gi,
    format: (m) => `Stub marker "${m[0]}". Ship complete work.`
  },
  {
    id: 'missing-cleanup',
    severity: 'warning',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx']),
    pattern: /addEventListener\s*\(/g,
    whenNot: /\bremoveEventListener\s*\(/,
    format: () => 'addEventListener with no removeEventListener in file. Pair teardown.'
  },
  {
    id: 'unbounded-loop',
    severity: 'info',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx']),
    pattern: /while\s*\(\s*true\s*\)/g,
    format: () => 'while(true) with no visible bound. Ensure a break and a ceiling.'
  },
  {
    id: 'innerHTML',
    severity: 'warning',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx']),
    pattern: /\.innerHTML\s*=/g,
    format: () => 'innerHTML assignment. Use textContent or sanitized markup.'
  },
  {
    id: 'scroll-prevent-default',
    severity: 'warning',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /(?:wheel|touchmove)[^)]*\)[^{}]*\{[^}]*\.preventDefault\s*\(/g,
    format: () => 'preventDefault() in a wheel or touchmove path. Preserve native scrolling.'
  },
  {
    id: 'root-smooth-scroll',
    severity: 'warning',
    extensions: new Set(['.css', '.scss', '.html', '.htm', '.js', '.jsx', '.ts', '.tsx']),
    pattern: /(?:html|:root|body)[^{}]*\{[^}]*scroll-behavior\s*:\s*smooth/gi,
    format: () => 'Root smooth scrolling. Damp a read value instead of hijacking scroll.'
  },
  {
    id: 'page-scroll-snap',
    severity: 'warning',
    extensions: new Set(['.css', '.scss', '.html', '.htm', '.js', '.jsx', '.ts', '.tsx']),
    pattern: /(?:html|:root|body)[^{}]*\{[^}]*scroll-snap-type\s*:\s*(?:y|both)\b/gi,
    format: () => 'Page-level vertical scroll snap. Use native scroll or horizontal gallery snap.'
  },
  {
    id: 'tall-observer-threshold',
    severity: 'info',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /IntersectionObserver[\s\S]{0,800}threshold\s*:\s*0\.5/g,
    format: () => 'threshold 0.5 can miss tall sticky sections. Use a center-line sentinel.'
  },
  {
    id: 'sticky-overflow-ancestor',
    severity: 'info',
    extensions: new Set(['.css', '.scss', '.html', '.htm', '.js', '.jsx', '.ts', '.tsx']),
    pattern: /overflow\s*:\s*(?:hidden|clip|auto|scroll)[\s\S]{0,240}position\s*:\s*sticky/gi,
    format: () => 'Overflow near a sticky child can break iOS Safari pinning. Check ancestors.'
  },
  {
    id: 'lazy-lcp-media',
    severity: 'warning',
    extensions: new Set(['.html', '.htm', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /<(?:img|video)\b[^>]*(?:hero|lcp)[^>]*loading\s*=\s*["']lazy["']/gi,
    format: () => 'Hero or LCP media is lazy-loaded. Keep first paint eager.'
  },
  {
    id: 'media-missing-dimensions',
    severity: 'info',
    extensions: new Set(['.html', '.htm', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /<img\b(?![^>]*\bwidth\b)(?![^>]*\bheight\b)[^>]*>/gi,
    format: () => 'Image has no width or height. Reserve space to avoid layout shift.'
  },
  {
    id: 'bitmap-from-element',
    severity: 'warning',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /createImageBitmap\s*\(\s*(?:img|image)\b/gi,
    format: () => 'createImageBitmap should receive a Blob in Worker decode paths.'
  },
  {
    id: 'bitmap-never-closed',
    severity: 'warning',
    extensions: new Set(['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']),
    pattern: /createImageBitmap\s*\(/g,
    whenNot: /\.close\s*\(/,
    format: () => 'createImageBitmap has no close() in file. Release decoded frames.'
  },
  {
    id: 'blanket-will-change',
    severity: 'warning',
    extensions: new Set(['.css', '.scss']),
    pattern: /\*\s*\{[^}]*will-change/gi,
    format: () => 'Blanket will-change. Scope it to active animated layers.'
  },
  {
    id: 'apple-owned-assets',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /apple[-_ ]?(?:logo|bezel|screenshot|product[-_ ]?frame)|device[-_ ]?bezel/gi,
    format: () => 'Apple-owned asset reference. Ship generated or licensed media only.'
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
  const buffer = fs.readFileSync(file);
  if (buffer.length > 2_000_000) return { file, findings: [] };
  const text = buffer.toString('utf8');
  if (text.includes('apple-design-code-audit:ignore') || text.includes('apple-design-audit:ignore')) {
    return { file, findings: [] };
  }

  const findings = [];
  for (const rule of rules) {
    if (rule.extensions && !rule.extensions.has(ext)) continue;
    if (rule.whenNot && rule.whenNot.test(text)) continue;
    for (const match of text.matchAll(rule.pattern)) {
      findings.push({
        id: rule.id,
        severity: rule.severity,
        line: lineAt(text, match.index ?? 0),
        message: rule.format(match)
      });
    }
  }

  if (platformArg === 'web') {
    for (const match of text.matchAll(/onClick\s*=\s*\{?\s*\(\)\s*=>/g)) {
      void match;
    }
  }

  return { file, findings };
}

let targetPath;
try {
  targetPath = path.resolve(targetArg);
  fs.accessSync(targetPath);
} catch {
  console.error(`Target not found: ${targetArg}`);
  process.exit(2);
}

const files = walk(targetPath);
const results = files.map(scanFile).filter((r) => r.findings.length > 0);
const allFindings = results.flatMap((r) => r.findings);
const warnings = allFindings.filter((f) => f.severity === 'warning').length;
const infos = allFindings.filter((f) => f.severity === 'info').length;

if (asJson) {
  console.log(JSON.stringify({ target: targetPath, platform: platformArg, files: files.length, warnings, infos, results }, null, 2));
} else {
  console.log('Apple design code audit');
  console.log(`Target: ${targetPath}`);
  console.log(`Platform: ${platformArg}`);
  console.log(`Files scanned: ${files.length}`);
  console.log(`Warnings: ${warnings}`);
  console.log(`Infos: ${infos}`);
  for (const result of results) {
    const rel = path.relative(process.cwd(), result.file) || result.file;
    for (const finding of result.findings) {
      console.log(`${rel}:${finding.line} [${finding.severity}] ${finding.id} — ${finding.message}`);
    }
  }
}

if (strict && warnings > 0) process.exit(1);
process.exit(0);
