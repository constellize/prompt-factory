#!/usr/bin/env npx ts-node

/**
 * Drift guard: regenerate a target into a scratch directory under os.tmpdir()
 * and compare every generated file against a downstream checkout.
 *
 * Usage:
 *   npm run check:drift -- --target <marketplace|website> --against <path> [--scratch <path>]
 *
 * Exit 0: every generated file matches. Exit 1: drift (per-file list). Exit 2: usage or refusal.
 * Files in --against that the generator does not produce are ignored, with one exception:
 * for --target marketplace, a file inside a GENERATED_OWNED path that the generator did not
 * emit is EXTRA drift (a hand-written second source of truth).
 * The website generator must not write under src/ (reported as FORBIDDEN).
 * The scratch directory must live inside os.tmpdir(); anything else is refused so
 * the generators can never write into a real checkout.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type Target = 'marketplace' | 'website';

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key.startsWith('--') || value === undefined) {
      throw new Error(`Bad arguments near "${key}"`);
    }
    out[key.slice(2)] = value;
  }
  return out;
}

/** realpath that tolerates a not-yet-existing tail (resolves the nearest existing ancestor). */
function realResolve(p: string): string {
  const abs = path.resolve(p);
  const tail: string[] = [];
  let cur = abs;
  while (!fs.existsSync(cur)) {
    tail.unshift(path.basename(cur));
    cur = path.dirname(cur);
  }
  return path.join(fs.realpathSync(cur), ...tail);
}

function isInside(child: string, parent: string): boolean {
  const rel = path.relative(parent, child);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function resolveScratch(requested: string | undefined, against: string): string {
  const tmpRoot = fs.realpathSync(os.tmpdir());
  if (requested === undefined) {
    return fs.realpathSync(fs.mkdtempSync(path.join(tmpRoot, 'check-drift-')));
  }
  const scratch = realResolve(requested);
  if (!isInside(scratch, tmpRoot)) {
    throw new Error(`Refusing scratch directory outside ${tmpRoot}: ${scratch}`);
  }
  const realAgainst = realResolve(against);
  if (scratch === realAgainst || isInside(scratch, realAgainst) || isInside(realAgainst, scratch)) {
    throw new Error(`Refusing scratch directory that overlaps --against: ${scratch}`);
  }
  if (fs.existsSync(scratch) && fs.readdirSync(scratch).length > 0) {
    throw new Error(`Refusing non-empty scratch directory: ${scratch}`);
  }
  fs.mkdirSync(scratch, { recursive: true });
  return scratch;
}

function walk(dir: string, base: string = dir): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, base));
    else files.push(path.relative(base, full));
  }
  return files.sort();
}

/**
 * Paths the marketplace generator owns completely, so one place shows the boundary.
 * Directory entries are walked recursively; the two file entries are compared directly.
 */
export const GENERATED_OWNED = [
  'plugins',
  '.claude-plugin',
  '.github',
  'docs/constellize-skills-infographic.html',
  'README.md',
];

/**
 * EXTRA drift: files under `against` inside GENERATED_OWNED that the generator did not produce.
 * Pure over (against, generated): `generated` holds paths relative to the output root.
 */
export function findExtraFiles(against: string, generated: string[]): string[] {
  const posix = (r: string) => r.split(path.sep).join('/');
  const generatedSet = new Set(generated.map(posix));
  const problems: string[] = [];
  for (const owned of GENERATED_OWNED) {
    const full = path.join(against, owned);
    if (!fs.existsSync(full)) continue;
    const found = fs.statSync(full).isDirectory() ? walk(full, against).map(posix) : [owned];
    for (const rel of found) {
      if (!generatedSet.has(rel)) {
        problems.push(`EXTRA    ${rel} (hand-written file in a generator-owned path; a second source of truth)`);
      }
    }
  }
  return problems;
}

function main(): number {
  let args: Record<string, string>;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error((e as Error).message);
    return 2;
  }
  const target = args.target as Target;
  if ((target !== 'marketplace' && target !== 'website') || !args.against) {
    console.error('Usage: check-drift --target <marketplace|website> --against <path> [--scratch <path>]');
    return 2;
  }
  const against = path.resolve(args.against);
  if (!fs.existsSync(against)) {
    console.error(`--against path not found: ${against}`);
    return 2;
  }

  let scratch: string;
  try {
    scratch = resolveScratch(args.scratch, against);
  } catch (e) {
    console.error((e as Error).message);
    return 2;
  }

  // Generators are chatty; keep this tool's output to the drift report.
  const log = console.log;
  const problems: string[] = [];
  let generated: string[] = [];
  let keepScratch = false;
  try {
    console.log = () => {};
    try {
      const gen = target === 'marketplace'
        ? require('./generate-marketplace')
        : require('./generate-website');
      gen.generate(scratch);
    } finally {
      console.log = log;
    }

    generated = walk(scratch);
    if (generated.length === 0) {
      console.error(`Generator wrote no files for ${target}; refusing to report "no drift" on an empty set.`);
      return 2;
    }
    if (target === 'website') {
      // Nothing under src/ is generated: the website owns its hand-written data modules.
      for (const rel of generated.filter(r => r.split(path.sep).join('/').startsWith('src/'))) {
        problems.push(`FORBIDDEN ${rel} (website generator must not write under src/)`);
      }
    }
    for (const rel of generated) {
      const downstream = path.join(against, rel);
      if (!fs.existsSync(downstream)) {
        problems.push(`MISSING  ${rel}`);
      } else if (
        !fs.statSync(downstream).isFile() ||
        !fs.readFileSync(path.join(scratch, rel)).equals(fs.readFileSync(downstream))
      ) {
        problems.push(`CONTENT  ${rel}`);
      }
    }
    if (target === 'marketplace') {
      problems.push(...findExtraFiles(against, generated));
    }
    keepScratch = problems.length > 0;
  } catch (e) {
    console.error(`check-drift failed: ${(e as Error).stack || e}`);
    return 2;
  } finally {
    if (!keepScratch) fs.rmSync(scratch, { recursive: true, force: true });
  }

  if (problems.length === 0) {
    console.log(`No drift: ${generated.length} generated ${target} files match ${against}`);
    return 0;
  }
  console.log(`DRIFT: ${problems.length} of ${generated.length} generated ${target} files differ from ${against}`);
  problems.forEach(p => console.log(`  ${p}`));
  console.log(`Generated output kept at: ${scratch}`);
  return 1;
}

if (require.main === module) {
  process.exitCode = main();
}
