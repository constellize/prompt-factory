import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { generatePlugin } from '../generate-marketplace';
import { loadPersonas, loadPluginsConfig, loadPrompts } from '../lib/parser';

// `memory_bank_structure` maps to `$3` -- the FOURTH positional argument -- and is used
// 28 times across these two prompts as a bare path prefix (`$3runbooks/`,
// `$3dependencies/operational-dependencies.md`). It used to be declared as a MODE
// ("Whether operational knowledge is separate or integrated") with the example
// "Separate: operations-memory-bank/". No argument value satisfied both readings:
//
//   omitted            -> `$3runbooks/`                             (unsupplied index stays literal)
//   example, split     -> `Separate:runbooks/`                      (args split on whitespace)
//   example, whole     -> `Separate: operations-memory-bank/runbooks/`
//
// so every one of the 28 paths was wrong however the skill was called. The variable is now
// the path prefix itself, and the skill body states the fallback when nothing arrives.
//
// Note the split of responsibilities these tests encode: a variable's `description` and
// `example` do NOT reach the generated SKILL.md -- they are website/docs metadata telling a
// human caller what to pass -- so the frontmatter assertions and the skill-body assertions
// guard two different readers and neither substitutes for the other.

const DELIVER = 'constellize:deliver';
const QUERY_PROMPT = 'query-operational-knowledge-during-incidents';
const ASSESS_PROMPT = 'assess-operational-knowledge-health';
const QUERY_SKILL = path.join('plugins', 'constellize-deliver', 'skills', 'incident-query', 'SKILL.md');
const ASSESS_SKILL = path.join('plugins', 'constellize-deliver', 'skills', 'knowledge-health', 'SKILL.md');

let query: string;
let assess: string;
let out: string;

beforeAll(() => {
  out = fs.mkdtempSync(path.join(os.tmpdir(), 'operations-root-variable-'));
  const plugins = loadPluginsConfig('content').plugins;
  const deliver = plugins.find(p => p.id === DELIVER)!;
  generatePlugin(deliver, loadPrompts('content'), loadPersonas('content'), plugins, out, 'content');
  query = fs.readFileSync(path.join(out, QUERY_SKILL), 'utf-8');
  assess = fs.readFileSync(path.join(out, ASSESS_SKILL), 'utf-8');
});

afterAll(() => {
  fs.rmSync(out, { recursive: true, force: true });
});

describe.each([
  ['incident-query', () => query],
  ['knowledge-health', () => assess],
])('the generated %s skill defines its operational root', (_name, skill) => {
  it('states that the root is a path prefix, not a label', () => {
    expect(skill()).toContain('Every operational path below is formed by prefixing this root to a relative path');
    expect(skill()).toMatch(/The root encodes that distinction; it is not a label/);
  });

  // The two roots the generator actually produces: `paths.ts` rewrites a bare
  // `operations-memory-bank/` to `llm/operations-memory-bank/` and a bare `memory-bank/`
  // to `llm/memory-bank/`. Only the latter is scaffolded by `constellize-harness:init`,
  // which is why it is the fallback of last resort rather than the first choice.
  it('names both real roots, llm/-prefixed as the generator rewrites them', () => {
    expect(skill()).toContain('`llm/operations-memory-bank/`');
    expect(skill()).toContain('`llm/memory-bank/`');
    expect(skill()).not.toContain('`operations-memory-bank/`');
  });

  it('gives the fallback for an argument that never arrives', () => {
    expect(skill()).toMatch(
      /fall back to `llm\/operations-memory-bank\/` when that directory exists and `llm\/memory-bank\/` otherwise/
    );
  });

  // The defect that made the old wording unfixable by argument: an unsupplied indexed
  // placeholder stays in the text, so the skill has to recognise its own placeholder.
  it('escapes the placeholder where it NAMES it, so the sentence survives substitution', () => {
    expect(skill()).toContain('a bare `\\$3` surviving where the root belongs');
    expect(skill()).not.toContain('a bare `$3` surviving');
  });

  // ...but must NOT escape it where it USES the value, or every path would break.
  it('leaves the placeholder unescaped where it USES the value as a prefix', () => {
    expect(skill()).toMatch(/[^\\]\$3[a-z]/);
    expect(skill()).not.toMatch(/\\\$3[a-z]/);
  });

  it('treats a colon or a lone word of prose as a label passed where a path belongs', () => {
    expect(skill()).toMatch(/Arguments are split on whitespace/);
    expect(skill()).toMatch(
      /a root that arrives with a colon in it, or as a single word of prose, is a label passed where a path belongs/
    );
  });

  // The old example, `Separate: operations-memory-bank/`, is the one value a caller was
  // actually told to pass, and it is named here so nobody reinstates it.
  it('calls the old mode-label value out as wrong', () => {
    expect(skill()).toContain('a value such as `Separate: llm/operations-memory-bank/` is wrong');
  });
});

describe.each([
  ['query-operational-knowledge-during-incidents', QUERY_PROMPT],
  ['assess-operational-knowledge-health', ASSESS_PROMPT],
])('the %s variable a caller reads before invoking', (_name, id) => {
  const variable = () => {
    const prompt = loadPrompts('content').find(p => p.frontmatter.id === id)!;
    return prompt.frontmatter.variables!.find((v: { name: string }) => v.name === 'memory_bank_structure')!;
  };

  it('is documented as a path prefix rather than as a mode', () => {
    expect(variable().description).toMatch(/path prefix ending in a slash/);
    expect(variable().description).not.toMatch(/Whether operational knowledge is separate or integrated/);
  });

  // Arguments split on whitespace, so an example containing a space can never arrive whole,
  // and the slug/path rules reject a colon. The example must be passable verbatim.
  it('has an example a caller can actually pass, with no space and no colon', () => {
    const example = variable().example as string;
    expect(example).toBe('operations-memory-bank/');
    expect(example).not.toMatch(/[\s:]/);
  });

  it('still maps to the fourth positional argument', () => {
    expect(variable()['maps-to']).toBe('$3');
  });
});
