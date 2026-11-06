import { readFileSync } from 'fs';

const FEATURE_HEADER = '**Any situation + "Add a new feature":**';
const ROUTE_HEADER = /^\*\*.*:\*\*$/;

const EXPECTED_HEADERS = [
  '**Greenfield + "Start building":**',
  '**Brownfield + "Start building" or "Get oriented":**',
  '**Stale docs + "Refresh documentation":**',
  '**Mid-build + "Continue building":**',
  FEATURE_HEADER,
  '**Any situation + "Fix a bug or incident":**',
  '**Any situation + "Get oriented":**',
  '**Maintenance (stable codebase, complete docs):**',
];

function headers(body: string): string[] {
  return body.split('\n').filter(l => ROUTE_HEADER.test(l));
}

/** The feature route only: from its own header to the next bold route header (or EOF). */
function featureRoute(body: string): string {
  const lines = body.split('\n');
  const start = lines.indexOf(FEATURE_HEADER);
  expect(start).toBeGreaterThanOrEqual(0);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (ROUTE_HEADER.test(lines[i])) { end = i; break; }
  }
  const route = lines.slice(start, end).join('\n');
  expect(route.startsWith(FEATURE_HEADER)).toBe(true);
  return route;
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
    const targets = route.match(/constellize-[a-z]+:[a-z-]+/g) ?? [];
    expect(new Set(targets)).toEqual(new Set([
      'constellize-feature:specify', 'constellize-feature:implement', 'constellize-feature:verify',
    ]));
  });
  it('carries the status-resume rule, set apart from the list', () => {
    const route = featureRoute(body);
    expect(route).toContain('\n3. constellize-feature:verify\n\nResume at the step');
    for (const status of ['SPECIFIED', 'IMPLEMENTED', '`VERIFIED (unsubstantiated)`', '`unknown`', 'VERIFIED needs nothing']) {
      expect(route).toContain(status);
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
    expect(headers(body)).toEqual(EXPECTED_HEADERS);
    expect(body).toContain('constellize-deliver:incident-investigation');
    expect(body).toContain('constellize-design:gap-analysis');  // elsewhere, just not in this route
  });
});
