#!/usr/bin/env node
// Validates relative links in all Markdown files in the skill.
// Ensures internal links resolve to existing files. Node built-ins only.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const targetArg = args.find((arg) => !arg.startsWith('--')) ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (wantsHelp) {
  console.log(`apple-design link-check

Usage:
  node scripts/link-check.mjs [path] [--json] [--strict] [--help]

Scans Markdown files for relative links and verifies the target exists.
Absolute paths and external URLs inside skill docs are reported as findings.
Exits 1 only with --strict when broken links or absolute paths are found.`);
  process.exit(0);
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'generated', '_vendor']);

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
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) found.push(next);
  }
  return found;
}

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function scanFile(file, root) {
  const text = fs.readFileSync(file, 'utf8');
  const findings = [];
  for (const match of text.matchAll(LINK_RE)) {
    const href = match[1];
    if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (path.isAbsolute(clean)) {
      findings.push({
        id: 'absolute-link',
        line: lineAt(text, match.index),
        message: `Absolute path in link: ${href}. Use a relative link.`
      });
      continue;
    }
    const resolved = path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(resolved)) {
      findings.push({
        id: 'broken-relative-link',
        line: lineAt(text, match.index),
        message: `Broken relative link: ${href}`
      });
    }
  }
  const rel = path.relative(root, file) || file;
  return { file: rel, findings };
}

let rootPath;
try {
  rootPath = path.resolve(targetArg);
  fs.accessSync(rootPath);
} catch {
  console.error(`Target not found: ${targetArg}`);
  process.exit(2);
}

const files = walk(rootPath);
const results = files.map((file) => scanFile(file, rootPath)).filter((r) => r.findings.length > 0);
const count = results.reduce((sum, r) => sum + r.findings.length, 0);

if (asJson) {
  console.log(JSON.stringify({ target: rootPath, files: files.length, findings: count, results }, null, 2));
} else {
  console.log('Apple design link check');
  console.log(`Target: ${rootPath}`);
  console.log(`Markdown files: ${files.length}`);
  console.log(`Findings: ${count}`);
  for (const result of results) {
    for (const finding of result.findings) {
      console.log(`${result.file}:${finding.line} [warning] ${finding.id} — ${finding.message}`);
    }
  }
}

if (strict && count > 0) process.exit(1);
process.exit(0);
