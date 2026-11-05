import { loadPrompts } from '../lib/parser';

const GATES: Record<string, [number, string]> = {
  'implement-application-health-validation': [2, 'Health Check Completeness'],
  'implement-infrastructure-health-checks': [2, 'Health Check Completeness'],
  'implement-operational-monitoring': [2, 'Health Check Completeness'],
  'implement-actionable-health-reporting': [2, 'Health Check Completeness'],
  'externalize-configuration': [3, 'Deployment Readiness'],
  'achieve-environment-independence': [3, 'Deployment Readiness'],
  'build-reliable-containers': [3, 'Deployment Readiness'],
  'implement-rollback-capability': [3, 'Deployment Readiness'],
  'ensure-architectural-consistency': [4, 'Maintainability in Context'],
  'maintain-dependency-hygiene': [4, 'Maintainability in Context'],
  'achieve-documentation-completeness': [4, 'Maintainability in Context'],
  'ensure-team-comprehension': [4, 'Maintainability in Context'],
};

const prompts = loadPrompts('content');
const body = (id: string) => prompts.find(p => p.frontmatter.id === id)!.content;

describe.each(Object.entries(GATES))('%s', (id, [gate, name]) => {
  it('declares its gate heading', () => {
    expect(body(id)).toContain(`## Gate ${gate}: ${name} Status`);
  });
  it('asserts a verdict inside output-format', () => {
    const of = body(id).match(/<output-format>([\s\S]*?)<\/output-format>/)![1];
    expect(of).toContain('**Gate Status:** ✅ PASS / ❌ FAIL');
    expect(of).toContain('**Blockers:**');
  });
  it('instructs a FAIL', () => {
    const ins = body(id).match(/<instructions>([\s\S]*?)<\/instructions>/)![1];
    expect(ins).toMatch(/FAIL the gate/);
  });
  it('has at least four requirement checkboxes in its verdict section', () => {
    const section = body(id).split(`## Gate ${gate}: ${name} Status`)[1].split('**Gate Status:**')[0];
    expect((section.match(/^- \[ \] /gm) || []).length).toBeGreaterThanOrEqual(4);
  });
  it('names no language or tool in the verdict section', () => {
    const section = body(id).split(`## Gate ${gate}: ${name} Status`)[1].split('**Blockers:**')[0];
    for (const banned of [/\bpytest\b/, /\bruff\b/, /\buv\b/, /\bnpm\b/, /\bdocker\b/i, /\bkubectl\b/, /\bPython\b/i]) {
      expect(section).not.toMatch(banned);
    }
  });
});
