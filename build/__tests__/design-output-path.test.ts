import { loadPrompts } from '../lib/parser';

const prompts = loadPrompts('content');
const get = (id: string) => prompts.find(p => p.frontmatter.id === id)!;

const SPECS: Array<[string, string, string]> = [
  ['constellation-map', 'construction/requirements/constellation-map.md', '## Constellation Map'],
  ['gap-analysis', 'construction/requirements/gap-analysis.md', '## Gap Analysis'],
  ['implementation-sketch', 'construction/design/implementation-sketches.md', '## Implementation Sketch'],
];

describe.each(SPECS)('%s', (id, defaultPath, heading) => {
  it('declares output_path as its last variable, mapped to an argument slot', () => {
    const vars = get(id).frontmatter.variables!;
    expect(vars[vars.length - 1].name).toBe('output_path');
    expect(vars[vars.length - 1]['maps-to']).toMatch(/^\$\d+$/);
  });
  it('mentions output_path in its argument hint', () => {
    expect(get(id).frontmatter.skill!['argument-hint']).toContain('output_path');
  });
  it('still names its default path, so an existing caller is unaffected', () => {
    expect(get(id).content).toContain(defaultPath);
  });
  it('names the section it owns and the rule that the rest of the file is untouched', () => {
    expect(get(id).content).toContain(heading);
    expect(get(id).content).toMatch(/leav\w* the rest of the file untouched/i);
  });
  it('never scaffolds a project-level file it was not asked for', () => {
    expect(get(id).content).toMatch(/never (create|scaffold)/i);
  });
});
