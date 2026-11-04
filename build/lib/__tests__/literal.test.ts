import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { copyLiteralTree } from '../../generate-marketplace';
import { validatePluginsConfig } from '../parser';
import { PluginsConfig } from '../types';

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'literal-test-'));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe('copyLiteralTree', () => {
  it('copies a file with no trailing newline unchanged', () => {
    const src = path.join(tmp, 'src');
    const dest = path.join(tmp, 'dest');
    fs.mkdirSync(src);
    const bytes = Buffer.from('{\n  "a": 1\n}', 'utf-8');
    fs.writeFileSync(path.join(src, 'plugin.json'), bytes);

    copyLiteralTree(src, dest);

    const copied = fs.readFileSync(path.join(dest, 'plugin.json'));
    expect(copied.equals(bytes)).toBe(true);
    expect(copied[copied.length - 1]).toBe(0x7d);
  });

  it('copies a file containing CRLF unchanged', () => {
    const src = path.join(tmp, 'src');
    const dest = path.join(tmp, 'dest');
    fs.mkdirSync(src);
    const bytes = Buffer.from('one\r\ntwo\r\nthree\r\n', 'utf-8');
    fs.writeFileSync(path.join(src, 'crlf.md'), bytes);

    copyLiteralTree(src, dest);

    expect(fs.readFileSync(path.join(dest, 'crlf.md')).equals(bytes)).toBe(true);
  });

  it('copies bytes that are not valid UTF-8 unchanged', () => {
    const src = path.join(tmp, 'src');
    const dest = path.join(tmp, 'dest');
    fs.mkdirSync(src);
    const bytes = Buffer.from([0xff, 0xfe, 0x00, 0x80, 0x0d, 0x0a]);
    fs.writeFileSync(path.join(src, 'blob.bin'), bytes);

    copyLiteralTree(src, dest);

    expect(fs.readFileSync(path.join(dest, 'blob.bin')).equals(bytes)).toBe(true);
  });

  it('copies nested directories and returns sorted relative paths', () => {
    const src = path.join(tmp, 'src');
    const dest = path.join(tmp, 'dest');
    fs.mkdirSync(path.join(src, 'skills', 'b'), { recursive: true });
    fs.mkdirSync(path.join(src, 'skills', 'a'), { recursive: true });
    fs.mkdirSync(path.join(src, 'scripts'), { recursive: true });
    const files: Record<string, Buffer> = {
      'skills/b/SKILL.md': Buffer.from('b'),
      'skills/a/SKILL.md': Buffer.from('a\n'),
      'scripts/run.mjs': Buffer.from('run'),
    };
    for (const [rel, bytes] of Object.entries(files)) {
      fs.writeFileSync(path.join(src, rel), bytes);
    }

    const written = copyLiteralTree(src, dest);

    expect(written).toEqual(['scripts/run.mjs', 'skills/a/SKILL.md', 'skills/b/SKILL.md']);
    for (const [rel, bytes] of Object.entries(files)) {
      expect(fs.readFileSync(path.join(dest, rel)).equals(bytes)).toBe(true);
    }
  });

  it('preserves the executable bit', () => {
    const src = path.join(tmp, 'src');
    const dest = path.join(tmp, 'dest');
    fs.mkdirSync(src);
    fs.writeFileSync(path.join(src, 'run.sh'), '#!/bin/sh\n', { mode: 0o755 });
    fs.chmodSync(path.join(src, 'run.sh'), 0o755);

    copyLiteralTree(src, dest);

    expect(fs.statSync(path.join(dest, 'run.sh')).mode & 0o777).toBe(0o755);
  });
});

describe('copyLiteralTree edge cases', () => {
  it('returns [] for an empty source directory instead of throwing', () => {
    const src = path.join(tmp, 'src');
    fs.mkdirSync(src);
    expect(copyLiteralTree(src, path.join(tmp, 'dest'))).toEqual([]);
  });

  it('throws naming the path and kind when the tree contains a symlink', () => {
    const src = path.join(tmp, 'src');
    fs.mkdirSync(path.join(src, 'scripts'), { recursive: true });
    fs.writeFileSync(path.join(src, 'real.md'), 'real');
    fs.symlinkSync(path.join(src, 'real.md'), path.join(src, 'scripts', 'link.md'));

    expect(() => copyLiteralTree(src, path.join(tmp, 'dest'))).toThrow(
      /scripts[\\/]link\.md: it is a symbolic link; literal trees may contain only regular files and directories/
    );
  });
});

describe('validatePluginsConfig', () => {
  function configWith(plugin: object): PluginsConfig {
    return {
      marketplace: { name: 'm', description: 'd', owner: { name: 'o' } },
      renames: {},
      plugins: [{ id: 'x:y', version: '1.0.0', name: 'Y', description: 'd', ...plugin }],
    } as PluginsConfig;
  }

  function contentDirWithLiteral(name: string): string {
    const contentDir = path.join(tmp, 'content');
    fs.mkdirSync(path.join(contentDir, 'literal', name), { recursive: true });
    return contentDir;
  }

  it('accepts a literal.source directory that exists', () => {
    const contentDir = contentDirWithLiteral('tree');
    expect(() =>
      validatePluginsConfig(configWith({ literal: { source: 'tree' } }), 'plugins.json', contentDir)
    ).not.toThrow();
  });

  it('rejects a literal.source directory that does not exist', () => {
    const contentDir = contentDirWithLiteral('tree');
    expect(() =>
      validatePluginsConfig(configWith({ literal: { source: 'missing' } }), 'plugins.json', contentDir)
    ).toThrow(/"literal\.source" "missing" does not exist/);
  });

  it('rejects an empty literal.source', () => {
    const contentDir = contentDirWithLiteral('tree');
    expect(() =>
      validatePluginsConfig(configWith({ literal: { source: '' } }), 'plugins.json', contentDir)
    ).toThrow(/"literal\.source" must be a non-empty string/);
  });

  it('rejects a literal.source that escapes content/literal', () => {
    const contentDir = contentDirWithLiteral('tree');
    expect(() =>
      validatePluginsConfig(configWith({ literal: { source: '..' } }), 'plugins.json', contentDir)
    ).toThrow(/"literal\.source" "\.\." must be a single directory/);
  });

  it('rejects a plugin with neither skills, agents nor literal', () => {
    expect(() => validatePluginsConfig(configWith({}), 'plugins.json', tmp)).toThrow(
      /must define at least one of "skills", "agents" or "literal"/
    );
  });

  it('reports a bad literal and a missing version together', () => {
    const contentDir = contentDirWithLiteral('tree');
    let message = '';
    try {
      validatePluginsConfig(
        configWith({ version: '', literal: { source: 'missing' } }),
        'plugins.json',
        contentDir
      );
    } catch (e) {
      message = (e as Error).message;
    }
    expect(message).toMatch(/"version" must be a non-empty string/);
    expect(message).toMatch(/does not exist/);
  });

  function validate(config: object): string {
    try {
      validatePluginsConfig(config as PluginsConfig, 'plugins.json', tmp);
    } catch (e) {
      return (e as Error).message;
    }
    return '';
  }

  function withoutRenames(): object {
    const { renames: _renames, ...rest } = configWith({ skills: {} });
    return rest;
  }

  it('rejects a config with no renames key', () => {
    expect(validate(withoutRenames())).toMatch(/"renames" must be an object mapping old plugin names to new names or null/);
  });

  it('rejects a renames that is not a plain object', () => {
    for (const bad of [['a'], 'x', null, 42]) {
      expect(validate({ ...configWith({ skills: {} }), renames: bad })).toMatch(/"renames" must be an object/);
    }
  });

  it('rejects a renames value that is neither a non-empty string nor null', () => {
    for (const bad of [42, '', undefined, {}]) {
      expect(validate({ ...configWith({ skills: {} }), renames: { old: bad } })).toMatch(
        /renames\["old"\] must be a non-empty string or null/
      );
    }
  });

  it('accepts string and null renames values', () => {
    expect(validate({ ...configWith({ skills: {} }), renames: { a: 'b', c: null } })).toBe('');
  });

  it('reports a bad renames value together with another error', () => {
    const message = validate({ ...configWith({ version: '', skills: {} }), renames: { old: 42 } });
    expect(message).toMatch(/"version" must be a non-empty string/);
    expect(message).toMatch(/renames\["old"\] must be a non-empty string or null/);
  });
});
