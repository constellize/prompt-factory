import { readFileSync } from 'fs';

/** The "Add a new feature" route only: from its header to the next route's header. */
function featureRoute(body: string): string {
  const after = body.split('"Add a new feature":')[1];
  expect(after).toBeDefined();
  return after.split('**Any situation')[0];
}

const CASES = ['plan', 'orchestrate'].map(name => [
  name,
  readFileSync(`content/literal/constellize-harness/skills/${name}/SKILL.md`, 'utf8'),
] as const);

describe.each(CASES)('%s', (_name, body) => {
  it('routes Add a new feature to the three, and to nothing else', () => {
    const route = featureRoute(body);
    for (const s of ['constellize-feature:specify', 'constellize-feature:implement', 'constellize-feature:verify']) {
      expect(route).toContain(s);
    }
  });
  it('no longer carries the six-step list', () => {
    const route = featureRoute(body);
    for (const gone of [
      'constellize-design:gap-analysis',
      'constellize-design:implementation-sketch',
      'constellize-design:code-generation-plan',
      'constellize-craft:unit-tests',
      'constellize-craft:integration-tests',
    ]) expect(route).not.toContain(gone);
  });
  it('still carries the other routes untouched', () => {
    expect(body).toContain('constellize-deliver:incident-investigation');
    expect(body).toContain('constellize-design:gap-analysis');  // elsewhere, just not in this route
  });
});
