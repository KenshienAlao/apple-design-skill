#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const platformArg = args.find((arg) => arg.startsWith('--platform='))?.slice('--platform='.length) || 'any';
const targetArg = args.find((arg) => !arg.startsWith('--')) ?? process.cwd();

const VALID_PLATFORMS = new Set(['any', 'ios', 'android', 'web', 'desktop']);
if (!VALID_PLATFORMS.has(platformArg)) {
  console.error(`Unknown platform: ${platformArg}`);
  process.exit(2);
}

const TARGET_MIN = { ios: 44, android: 48, web: 44, desktop: 32, any: 44 };
const targetMin = TARGET_MIN[platformArg];

if (wantsHelp) {
  console.log(`apple-design audit

Usage:
  node scripts/audit.mjs [path] [--platform=any|ios|android|web|desktop] [--json] [--strict] [--help]

Scans CSS/JS/HTML-like files for common anti-patterns.
Target-size check uses the platform minimum: iOS 44, Android 48, web 44, desktop 32.
Add "apple-design-audit:ignore" to a file to skip it.
Exits 1 only with --strict when warnings exist.`);
  process.exit(0);
}

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  '.svelte-kit',
  '.turbo',
  '_vendor'
]);

const CODE_EXTENSIONS = new Set([
  '.css',
  '.scss',
  '.html',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.vue',
  '.svelte'
]);

const ALLOWED_RADII = new Set(['0', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '28', '999', '9999']);

const rules = [
  {
    id: 'raw-radius',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /border-radius\s*:\s*(\d+)px/gi,
    when: (match) => !ALLOWED_RADII.has(match[1]),
    format: (match) => `Raw radius ${match[1]}px. Use a radius token.`
  },
  {
    id: 'heavy-shadow',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /box-shadow\s*:\s*([^;]+);/gi,
    when: (match) => /0\s+\d{2,}px/.test(match[1]) || /rgba\([^)]*,\s*0?\.[3-9]\)/.test(match[1]),
    format: () => 'Heavy shadow. Use hairline + material or a named shadow token.'
  },
  {
    id: 'gradient-background',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /background(?:-image)?\s*:\s*linear-gradient/gi,
    format: () => 'Gradient background. Use a solid semantic surface.'
  },
  {
    id: 'transition-all',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /transition\s*:\s*all/gi,
    format: () => 'transition: all. Animate named properties only.'
  },
  {
    id: 'tiny-target',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /\b(min-height|height|min-width|width)\s*:\s*(\d{1,2})px/gi,
    when: (match) => Number(match[2]) < targetMin,
    format: (match) => `${match[1]} ${match[2]}px is under the ${targetMin} target minimum for ${platformArg}.`
  },
  {
    id: 'emoji-icon',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
    format: (match) => `Emoji icon "${match[0]}". Use a consistent icon set.`
  },
  {
    id: 'lorem-ipsum',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /lorem ipsum/gi,
    format: () => 'Lorem ipsum. Use real content or an empty state.'
  },
  {
    id: 'stub-marker',
    severity: 'warning',
    extensions: CODE_EXTENSIONS,
    pattern: /\b(?:TODO|FIXME|coming soon|placeholder text)\b/gi,
    format: (match) => `Stub marker "${match[0]}". Ship complete work.`
  },
  {
    id: 'raw-hex',
    severity: 'info',
    extensions: CODE_EXTENSIONS,
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    format: (match) => `Raw hex ${match[0]}. Use a semantic color token in components.`
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
  const stat = fs.statSync(target);

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

  let buffer;
  try {
    buffer = fs.readFileSync(file);
  } catch {
    return { file, findings: [] };
  }

  if (buffer.length > 2_000_000) return { file, findings: [] };

  const text = buffer.toString('utf8');
  if (text.includes('apple-design-audit:ignore')) return { file, findings: [] };

  const findings = [];

  for (const rule of rules) {
    for (const match of text.matchAll(rule.pattern)) {
      if (rule.when && !rule.when(match)) continue;
      findings.push({
        id: rule.id,
        severity: rule.severity,
        line: lineAt(text, match.index ?? 0),
        message: rule.format(match)
      });
    }
  }

  const usesMotion = /(transition|animation|@keyframes)/i.test(text);
  const hasReduced = /prefers-reduced-motion|accessibilityReduceMotion/i.test(text);
  if (usesMotion && !hasReduced) {
    findings.push({
      id: 'missing-reduce-motion',
      severity: 'warning',
      line: 1,
      message: 'Motion detected with no Reduce Motion path.'
    });
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
const results = files.map(scanFile).filter((result) => result.findings.length > 0);
const allFindings = results.flatMap((result) => result.findings);
const warnings = allFindings.filter((finding) => finding.severity === 'warning').length;
const infos = allFindings.filter((finding) => finding.severity === 'info').length;

if (asJson) {
  console.log(JSON.stringify({ target: targetPath, platform: platformArg, files: files.length, warnings, infos, results }, null, 2));
} else {
  console.log('Apple design audit');
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
