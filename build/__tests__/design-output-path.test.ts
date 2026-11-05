import { loadPrompts } from '../lib/parser';

const prompts = loadPrompts('content');
const get = (id: string) => prompts.find(p => p.frontmatter.id === id)!;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// [id, default path, owned heading, prerequisite sibling headings]
const SPECS: Array<[string, string, string, string[]]> = [
  ['constellation-map', 'construction/requirements/constellation-map.md', '## Constellation Map', []],
  ['gap-analysis', 'construction/requirements/gap-analysis.md', '## Gap Analysis', ['## Constellation Map']],
  ['implementation-sketch', 'construction/design/implementation-sketches.md', '## Implementation Sketch', ['## Gap Analysis', '## Constellation Map']],
];

describe.each(SPECS)('%s', (id, defaultPath, heading, prereqs) => {
  const body = () => get(id).content;
  const h = esc(heading);

  it('declares output_path as its last variable, mapped to an argument slot', () => {
    const vars = get(id).frontmatter.variables!;
    expect(vars[vars.length - 1].name).toBe('output_path');
    expect(vars[vars.length - 1]['maps-to']).toMatch(/^\$\d+$/);
  });
  it('mentions output_path in its argument hint', () => {
    expect(get(id).frontmatter.skill!['argument-hint']).toContain('output_path');
  });
  it('still names its default path, so an existing caller is unaffected', () => {
    expect(body()).toContain(defaultPath);
  });
  it('says the artifact goes to output_path instead of the default path, owning one section', () => {
    expect(body()).toMatch(new RegExp(`goes there instead of the default path: this skill owns the one section in that file titled \`${h}\``));
    expect(body()).toMatch(/replaces that section in place and leaves the rest of the file untouched/i);
  });
  it('states where the owned section ends', () => {
    expect(body()).toMatch(new RegExp(`runs from its \`${h}\` line to the next heading at the same level or the end of the file`));
  });
  it('demotes the artifact headings so the section cannot split itself', () => {
    expect(body()).toMatch(/headings are demoted one level \(`###` and deeper, never a second `##`\)/);
  });
  it('appends a missing section and creates a missing file with only that section', () => {
    expect(body()).toMatch(/not present in the file, it is appended; if `output_path` itself does not exist, it is created with that one section and nothing else/);
  });
  it('never creates a project-level file it was not asked for, and never scaffolds llm/construction/', () => {
    expect(body()).toMatch(/never creates a project-level file it was not asked for/);
    expect(body()).toMatch(/never scaffolds `llm\/construction\/`/);
  });
  if (prereqs.length > 0) {
    it.each(prereqs)('reads prerequisite %s from a sibling section of the same file', (p) => {
      expect(body()).toMatch(new RegExp(`sibling \`${esc(p)}\` section`));
    });
    it('says so and proceeds on the caller\'s inline context when a prerequisite section is absent', () => {
      expect(body()).toMatch(/when (that|a prerequisite) section is absent it says so and proceeds with the context the caller supplied inline/);
    });
  } else {
    it('says it has no prerequisite artifact and proceeds on the caller\'s inline context', () => {
      expect(body()).toMatch(/has no prerequisite artifact; it proceeds with the context the caller supplied inline/);
    });
  }
});
