import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { generate } from '../../generate-marketplace';

let tmp: string;
let outDir: string;

beforeEach(() => {
  // A fresh directory per test: copyFileSync keeps an existing destination's mode,
  // so a reused directory could make the executable-bit assertion pass for the wrong reason.
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'github-literal-'));
  outDir = path.join(tmp, 'marketplace');
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  generate(outDir);
});

afterEach(() => {
  jest.restoreAllMocks();
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe('generated .github', () => {
  it('emits drift.yml and check-version-bump.sh', () => {
    expect(fs.existsSync(path.join(outDir, '.github', 'workflows', 'drift.yml'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, '.github', 'scripts', 'check-version-bump.sh'))).toBe(true);
  });

  it('preserves the shell script executable bit', () => {
    const script = path.join(outDir, '.github', 'scripts', 'check-version-bump.sh');
    expect(fs.statSync(script).mode & 0o111).not.toBe(0);
  });
});
