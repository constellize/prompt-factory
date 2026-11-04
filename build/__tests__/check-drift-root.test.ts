import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { findUnownedRootEntries } from '../check-drift';

let against: string;

/** The generated set the real marketplace produces at the root, by top-level name. */
const GENERATED = [
  'README.md',
  'docs/constellize-skills-infographic.html',
  '.github/workflows/drift.yml',
  '.claude-plugin/marketplace.json',
  'plugins/alpha/.claude-plugin/plugin.json',
];

function put(rel: string): void {
  const full = path.join(against, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, 'x');
}

function putDir(rel: string): void {
  fs.mkdirSync(path.join(against, rel), { recursive: true });
}

beforeEach(() => {
  against = fs.mkdtempSync(path.join(os.tmpdir(), 'check-drift-root-'));
  GENERATED.forEach(put);
  put('GENERATED_FROM');
  putDir('.git');
});

afterEach(() => {
  fs.rmSync(against, { recursive: true, force: true });
});

describe('UNOWNED root drift', () => {
  it('is silent on the real marketplace root shape', () => {
    expect(findUnownedRootEntries(against, GENERATED)).toEqual([]);
  });

  it('flags a hand-added root file (the LICENSE case this guard exists for)', () => {
    put('LICENSE');

    const problems = findUnownedRootEntries(against, GENERATED);

    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^UNOWNED {2}LICENSE /);
  });

  it('flags a hand-added root directory', () => {
    put('tools/release.sh');

    const problems = findUnownedRootEntries(against, GENERATED);

    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^UNOWNED {2}tools /);
  });

  it('flags several new root entries at once, sorted', () => {
    put('CONTRIBUTING.md');
    put('LICENSE');

    const problems = findUnownedRootEntries(against, GENERATED);

    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/^UNOWNED {2}CONTRIBUTING\.md /);
    expect(problems[1]).toMatch(/^UNOWNED {2}LICENSE /);
  });

  it('does not flag hand-written prose added under docs/', () => {
    put('docs/specs/2026-11-03-skill-factory.md');
    put('docs/releasing-1x.md');

    expect(findUnownedRootEntries(against, GENERATED)).toEqual([]);
  });

  it('does not flag .DS_Store, so a local run does not fail spuriously', () => {
    put('.DS_Store');

    expect(findUnownedRootEntries(against, GENERATED)).toEqual([]);
  });
});
