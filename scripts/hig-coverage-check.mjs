#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mappingPath = path.join(root, 'references/apple-hig-mapping-apple-style.md');
const vaultDir = path.join(root, '.vault/HIG');

function fail(msg) { console.error(msg); process.exit(2); }
if (!fs.existsSync(mappingPath)) fail(`Missing ${mappingPath}`);
const text = fs.readFileSync(mappingPath, 'utf8');
const section = text.match(/## 9\. Full 173-page HIG coverage matrix[\s\S]*?\n\| HIG page \| Owning skill refs \|\n\|---\|---\|\n([\s\S]*?)\n\nThis matrix is the coverage contract\./);
if (!section) fail('Coverage matrix section not found or malformed.');
const rows = section[1].split('\n').filter(l => l.startsWith('| `'));
const slugs = [];
const badRefs = [];
for (const row of rows) {
  const m = row.match(/^\| `([^`]+)` \| (.+) \|$/);
  if (!m) { badRefs.push({ row, reason: 'malformed row' }); continue; }
  slugs.push(m[1]);
  const refs = [...m[2].matchAll(/`([^`]+)`/g)].map(x => x[1]);
  if (refs.length === 0) badRefs.push({ slug: m[1], reason: 'no owning refs' });
  for (const ref of refs) {
    const p = ref.startsWith('SKILL.md') ? path.join(root, ref) : path.join(root, 'references', ref).replace(path.join(root,'references','assets/'), path.join(root,'assets/'));
    const resolved = fs.existsSync(path.join(root, ref)) ? path.join(root, ref) : fs.existsSync(path.join(root, 'references', ref)) ? path.join(root,'references',ref) : fs.existsSync(path.join(root,'assets', path.basename(ref))) && ref.includes('assets') ? path.join(root,ref) : path.join(root,ref);
    // resolve by checking common locations
    const candidates = [path.join(root, ref), path.join(root, 'references', ref), path.join(root, 'assets', path.basename(ref))];
    const ok = candidates.some(c => fs.existsSync(c));
    if (!ok) badRefs.push({ slug: m[1], ref, reason: 'missing ref file' });
  }
}
const dupes = slugs.filter((s,i)=>slugs.indexOf(s)!==i);
const sorted = [...slugs].sort();
const unsorted = slugs.some((s,i)=>s!==sorted[i]);
let vaultSlugs = null;
let missingFromMatrix = [];
let extraInMatrix = [];
if (fs.existsSync(vaultDir)) {
  vaultSlugs = fs.readdirSync(vaultDir).filter(f=>f.endsWith('.md')).map(f=>f.replace(/\.md$/,'')).sort();
  missingFromMatrix = vaultSlugs.filter(s=>!slugs.includes(s));
  extraInMatrix = slugs.filter(s=>!vaultSlugs.includes(s));
}
const findings = [];
if (dupes.length) findings.push({id:'duplicate-slugs', severity:'error', message:`Duplicate slugs: ${[...new Set(dupes)].join(', ')}`});
if (unsorted) findings.push({id:'unsorted-matrix', severity:'warning', message:'Matrix rows are not alphabetically sorted by slug.'});
if (badRefs.length) findings.push({id:'bad-ref', severity:'error', message:`Invalid refs/rows: ${JSON.stringify(badRefs.slice(0,10))}`});
if (vaultSlugs && missingFromMatrix.length) findings.push({id:'missing-slugs', severity:'error', message:`Missing slugs: ${missingFromMatrix.join(', ')}`});
if (vaultSlugs && extraInMatrix.length) findings.push({id:'extra-slugs', severity:'error', message:`Extra slugs: ${extraInMatrix.join(', ')}`});
if (vaultSlugs && slugs.length !== 173) findings.push({id:'count', severity:'error', message:`Expected 173 slugs, got ${slugs.length}`});
if (!vaultSlugs) findings.push({id:'vault-missing', severity:'info', message:'Local .vault/HIG not present; checked matrix internal consistency only.'});

const result = { target: mappingPath, matrixRows: slugs.length, vaultPresent: !!vaultSlugs, vaultRows: vaultSlugs ? vaultSlugs.length : null, findings };
if (asJson) console.log(JSON.stringify(result, null, 2));
else {
  console.log('Apple design HIG coverage check');
  console.log(`Matrix rows: ${slugs.length}`);
  console.log(`Vault present: ${!!vaultSlugs}${vaultSlugs ? ` (${vaultSlugs.length})` : ''}`);
  for (const f of findings) console.log(`[${f.severity}] ${f.id} - ${f.message}`);
  if (!findings.filter(f=>f.severity==='error').length) console.log('Coverage check: PASS');
}
const hasErrors = findings.some(f=>f.severity==='error');
if (strict && hasErrors) process.exit(1);
process.exit(0);
