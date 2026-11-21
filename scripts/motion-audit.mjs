#!/usr/bin/env node
// Static motion audit for Apple-style/animation-driven UI. Node built-ins only.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const platformArg = (args.find(a => a.startsWith('--platform=')) || '').split('=')[1] || 'any';
const targetArg = args.find(a => !a.startsWith('--')) ?? process.cwd();

if (wantsHelp) {
  console.log(`apple-design motion-audit\n\nUsage:\n  node scripts/motion-audit.mjs [path] [--platform=ios|android|web|desktop|any] [--json] [--strict]\n\nChecks code files for common motion anti-patterns and missing Reduce Motion handling.\nExits 1 only with --strict when warnings are found.`);
  process.exit(0);
}

const CODE_EXT = new Set(['.css','.scss','.less','.js','.jsx','.ts','.tsx','.mjs','.cjs','.swift','.kt','.kts','.java','.dart','.vue','.svelte','.html','.htm']);
const SKIP_DIRS = new Set(['node_modules','.git','dist','build','generated','_vendor','.next','.svelte-kit','.output','coverage','vendor','references','examples','demo','docs','.vault','scripts','showcase']);
const SKIP_FILE_RE = /(motion-audit\.mjs|animations-apple-style\.md|tokens-apple-style\.md)$/i;

function walk(dir) {
  const out = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name) || e.name.startsWith('.DS_Store')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (!e.name.startsWith('.git')) out.push(...walk(full)); continue; }
    if (e.isFile() && CODE_EXT.has(path.extname(e.name).toLowerCase()) && !SKIP_FILE_RE.test(e.name)) out.push(full);
  }
  return out;
}
function lineAt(text, idx) { let l=1; for (let i=0;i<idx;i++) if (text.charCodeAt(i)===10) l++; return l; }
function push(findings, file, root, id, severity, index, message, text) {
  findings.push({ file: path.relative(root,file)||file, line: lineAt(text,index), id, severity, message });
}

const RULES = [
  { id:'linear-motion', severity:'warning', re:/transition(?:-timing-function)?\s*:[^;]*\blinear\b/gi, msg:'Linear easing on UI motion. Prefer spring/curve tokens or meaningful ease; reserve linear for progress/mechanical cases.' , skip:(t)=>/progress|spinner|skeleton|marquee|ticker/i.test(t) },
  { id:'long-duration', severity:'warning', re:/\b(?:transition(?:-duration)?|animation(?:-duration)?|duration)\s*[:=]\s*(?:0*\.)?[6-9]\d{2,}ms\b|\b(?:transition(?:-duration)?|animation(?:-duration)?|duration)\s*[:=]\s*[1-9]\d*(?:\.\d+)?s\b/gi, msg:'Motion duration looks long (>600ms). Keep most UI motion 150-500ms unless cinematic and intentional.' },
  { id:'layout-animation', severity:'warning', re:/transition\s*:[^;]*(?:\btop\b|\bleft\b|\bright\b|\bbottom\b|\bwidth\b|\bheight\b)/gi, msg:'Animating layout properties can cause jank. Prefer transform/opacity.', skip:(m, text)=>/height/.test(m) && /interpolate-size\s*:\s*allow-keywords/.test(text) },
  { id:'bounce-overshoot', severity:'info', re:/cubic-bezier\(\s*[^,]+,\s*-[^,]+,|cubic-bezier\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[1]\.[3-9]/g, msg:'Strong overshoot curve detected. Ensure it is intentional, short, and disabled/softened for Reduce Motion.' },
];

const files = walk(path.resolve(targetArg));
const findings = [];
let sawMotion = false;
let sawReduce = false;
for (const file of files) {
  let text; try { text = fs.readFileSync(file,'utf8'); } catch { continue; }
  if (/\btransition|animation|spring|keyframes|motion|withAnimation|UIViewPropertyAnimator\b/i.test(text)) sawMotion = true;
  if (/prefers-reduced-motion|accessibilityReduceMotion|isReduceMotionEnabled|Reduce Motion/i.test(text)) sawReduce = true;
  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text))) {
      if (rule.skip && rule.skip(m[0], text)) continue;
      push(findings, file, path.resolve(targetArg), rule.id, rule.severity, m.index, rule.msg, text);
      if (m.index === rule.re.lastIndex) rule.re.lastIndex++;
    }
  }
}
if (sawMotion && !sawReduce) {
  findings.push({ file: path.relative(path.resolve(targetArg), path.resolve(targetArg)) || '.', line: 1, id:'missing-reduce-motion', severity:'warning', message:'Motion detected but no Reduce Motion handling token/string found. Add prefers-reduced-motion/accessibilityReduceMotion fallback.' });
}
const warnings = findings.filter(f=>f.severity==='warning').length;
const infos = findings.filter(f=>f.severity==='info').length;
const result = { target: path.resolve(targetArg), platform: platformArg, filesScanned: files.length, warnings, infos, findings };
if (asJson) console.log(JSON.stringify(result,null,2));
else {
  console.log('Apple design motion audit');
  console.log(`Target: ${result.target}`);
  console.log(`Platform: ${platformArg}`);
  console.log(`Files scanned: ${files.length}`);
  console.log(`Warnings: ${warnings}`);
  console.log(`Infos: ${infos}`);
  for (const f of findings) console.log(`${f.file}:${f.line} [${f.severity}] ${f.id} — ${f.message}`);
}
if (strict && warnings > 0) process.exit(1);
process.exit(0);
