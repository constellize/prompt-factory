import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { generatePlugin } from '../generate-marketplace';
import { loadPersonas, loadPluginsConfig, loadPrompts } from '../lib/parser';

// `memory_bank_location` and `operations_memory_location` are the OTHER root variables --
// 68 uses across 12 prompts -- and they were used in two shapes that wanted opposite
// conventions from one value:
//
//   50 PREFIX uses, all in cross-reference-operational-dependencies.md, written
//      `{{memory_bank_location}}/systemPatterns.md` -- the use supplied its own separator,
//      so the documented example `memory-bank/` produced `llm/memory-bank//systemPatterns.md`,
//      and an example naming a file (`memory-bank/systemPatterns.md`) produced nonsense.
//   18 LABEL uses across all 12, written `Documentation: {{memory_bank_location}}` -- the
//      variable IS the value, so an unsupplied index renders `Documentation: $2`, a bare
//      placeholder offered to the model AS the location.
//
// The fix adopts the convention already shipped for `memory_bank_structure`: a root ends in a
// slash and a use appends a relative path directly. That removes the double separator rather
// than documenting around it, so one rule now covers every root variable in this family.
// The label shape keeps no separator convention -- it only needs the fallback -- which is why
// the two shapes are asserted separately below.

const DELIVER = 'constellize:deliver';
const GROW = 'constellize:grow';

const WHITESPACE_RULE =
  /Arguments are split on whitespace, so a (?:root|location) that arrives with a colon in it, or as a single word of prose, is a label passed where a path belongs/;

let out: string;
const read = (plugin: string, skill: string) =>
  fs.readFileSync(path.join(out, 'plugins', plugin, 'skills', skill, 'SKILL.md'), 'utf-8');

beforeAll(() => {
  out = fs.mkdtempSync(path.join(os.tmpdir(), 'location-root-variables-'));
  const plugins = loadPluginsConfig('content').plugins;
  const prompts = loadPrompts('content');
  const personas = loadPersonas('content');
  for (const id of [DELIVER, GROW]) {
    generatePlugin(plugins.find(p => p.id === id)!, prompts, personas, plugins, out, 'content');
  }
});

afterAll(() => {
  fs.rmSync(out, { recursive: true, force: true });
});

// ---------------------------------------------------------------- the prefix shape

describe('the generated cross-reference skill, the only prefix user', () => {
  const skill = () => read('constellize-deliver', 'cross-reference');

  it('states that both locations are roots prefixed to relative paths', () => {
    expect(skill()).toContain(
      'Both memory locations are roots: every path below is formed by prefixing one of them to a relative path'
    );
    expect(skill()).toContain('A root is not a label and not a single file.');
  });

  it('names both real roots, llm/-prefixed as the generator rewrites them', () => {
    expect(skill()).toContain('`llm/memory-bank/`');
    expect(skill()).toContain('`llm/operations-memory-bank/`');
    expect(skill()).not.toContain('`operations-memory-bank/`');
  });

  it('gives a fallback for each root, operational falling through to the scaffolded one', () => {
    expect(skill()).toMatch(
      /fall back to `llm\/memory-bank\/` for development knowledge, and for operational knowledge to `llm\/operations-memory-bank\/` when that directory exists and `llm\/memory-bank\/` otherwise/
    );
  });

  it('escapes each placeholder where it NAMES it, so the sentence survives substitution', () => {
    expect(skill()).toContain('a bare `\\$2` or `\\$3` surviving where a root belongs');
    expect(skill()).not.toContain('a bare `$2` or `$3` surviving');
  });

  // The counts are pinned to literals: a derived count would be satisfied by zero uses.
  it('leaves every prefix use unescaped -- 17 development, 33 operational', () => {
    expect((skill().match(/[^\\]\$2[A-Za-z]/g) || []).length).toBe(17);
    expect((skill().match(/[^\\]\$3[A-Za-z]/g) || []).length).toBe(33);
    expect(skill()).not.toMatch(/\\\$[23][A-Za-z]/);
  });

  // The defect itself: the use must not supply a separator the root already carries.
  it('never doubles the separator', () => {
    expect(skill()).not.toMatch(/\$[23]\//);
    expect(skill()).not.toMatch(/llm\/(?:operations-)?memory-bank\/\//);
  });

  it('treats a colon or a lone word of prose as a label passed where a path belongs', () => {
    expect(skill()).toMatch(WHITESPACE_RULE);
  });
});

// ---------------------------------------------------------------- the label shape

const LABEL_SKILLS: [string, string, string, string][] = [
  // plugin,                skill,                      label,           index
  ['constellize-deliver', 'proactive-architecture', 'Documentation', '$3'],
  ['constellize-grow', 'health-assessment', 'Documentation', '$2'],
  ['constellize-grow', 'sprint-learnings', 'Documentation', '$3'],
  ['constellize-grow', 'knowledge-retrospective', 'Documentation', '$3'],
  ['constellize-grow', 'knowledge-contribution', 'Location', '$3'],
  ['constellize-grow', 'architectural-evolution', 'Documentation', '$2'],
  ['constellize-grow', 'personal-learning', 'Documentation', '$3'],
  ['constellize-grow', 'evolve-requirements', 'Documentation', '$2'],
  ['constellize-grow', 'adoption-obstacles', 'Location', '$2'],
  ['constellize-grow', 'grow-organically', 'Location', '$2'],
  ['constellize-grow', 'onboard-team', 'Documentation', '$3'],
];

describe.each(LABEL_SKILLS)('the generated %s/%s skill labels its location', (plugin, name, label, idx) => {
  const skill = () => read(plugin, name);

  it('states that the location is a path rather than a label', () => {
    expect(skill()).toContain('This location is a path, not a label');
  });

  it(`names its own placeholder ${idx}, escaped, and falls back to the scaffolded root`, () => {
    expect(skill()).toContain(`a bare \`\\${idx}\` surviving where the location belongs`);
    expect(skill()).toContain('fall back to `llm/memory-bank/` and state that you did');
  });

  // The fallback sentence is only reachable if the placeholder it describes is the one the
  // label line actually carries -- an index typo would leave the sentence true but inert.
  it(`uses ${idx} unescaped on the ${label} line itself`, () => {
    expect(skill()).toContain(`${label}: ${idx}\n`);
  });

  it('treats a colon or a lone word of prose as a label passed where a path belongs', () => {
    expect(skill()).toMatch(WHITESPACE_RULE);
  });
});

// ---------------------------------------------------------------- what a caller is told

describe('the location variables a caller reads before invoking', () => {
  const vars = (id: string) => {
    const prompt = loadPrompts('content').find(p => p.frontmatter.id === id)!;
    return prompt.frontmatter.variables!;
  };
  const named = (id: string, n: string) =>
    vars(id).find((v: { name: string }) => v.name === n)!;

  it('documents the prefix pair as path prefixes, not as vague places', () => {
    const dev = named('cross-reference-operational-dependencies', 'memory_bank_location');
    const ops = named('cross-reference-operational-dependencies', 'operations_memory_location');
    expect(dev.description).toBe('Development knowledge root, as a path prefix ending in a slash');
    expect(ops.description).toBe('Operational knowledge root, as a path prefix ending in a slash');
    expect(dev['maps-to']).toBe('$2');
    expect(ops['maps-to']).toBe('$3');
    expect(dev.example).toBe('memory-bank/');
    expect(ops.example).toBe('operations-memory-bank/');
  });

  // Arguments split on whitespace and a colon is the character class that produced
  // `coverage-report-expand-codes:.md`, so every example has to be passable verbatim.
  it('gives every one of the 12 prompts an example a caller can pass verbatim', () => {
    const ids = LABEL_SKILLS.map(([, name]) => name);
    expect(ids).toHaveLength(11);
    const examples: string[] = [];
    for (const prompt of loadPrompts('content')) {
      for (const v of prompt.frontmatter.variables || []) {
        if (v.name === 'memory_bank_location' || v.name === 'operations_memory_location') {
          examples.push(v.example as string);
        }
      }
    }
    expect(examples).toHaveLength(13);
    for (const e of examples) {
      expect(e).not.toMatch(/[\s:]/);
      expect(e).toMatch(/^[A-Za-z0-9_.\/-]+$/);
    }
  });
});
