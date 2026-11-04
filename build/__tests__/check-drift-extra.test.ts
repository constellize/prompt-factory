import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { findExtraFiles } from '../check-drift';

let against: string;

function put(rel: string): void {
  const full = path.join(against, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, 'x');
}

beforeEach(() => {
  against = fs.mkdtempSync(path.join(os.tmpdir(), 'check-drift-extra-'));
});

afterEach(() => {
  fs.rmSync(against, { recursive: true, force: true });
});

describe('EXTRA drift', () => {
  it('flags a hand-added file under plugins/<id>/scripts/', () => {
    const generated = ['plugins/alpha/skills/one/SKILL.md', 'plugins/alpha/scripts/assess.ts'];
    generated.forEach(put);
    put('plugins/alpha/scripts/hand-written.ts');

    const problems = findExtraFiles(against, generated);

    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^EXTRA {4}plugins\/alpha\/scripts\/hand-written\.ts /);
  });

  it('flags a hand-added file under .github/', () => {
    const generated = ['.github/workflows/drift.yml', 'README.md'];
    generated.forEach(put);
    put('.github/workflows/extra.yml');

    const problems = findExtraFiles(against, generated);

    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^EXTRA {4}\.github\/workflows\/extra\.yml /);
  });

  it('does not flag docs/specs/, docs/plans/ or GENERATED_FROM', () => {
    const generated = ['README.md', 'docs/constellize-skills-infographic.html'];
    generated.forEach(put);
    put('docs/specs/a.md');
    put('docs/plans/b.md');
    put('GENERATED_FROM');

    expect(findExtraFiles(against, generated)).toEqual([]);
  });

  it('does not flag docs/releasing-1x.md', () => {
    const generated = ['README.md', 'docs/constellize-skills-infographic.html'];
    generated.forEach(put);
    put('docs/releasing-1x.md');

    expect(findExtraFiles(against, generated)).toEqual([]);
  });
});
