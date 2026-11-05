import { loadPrompts, loadPluginsConfig, getPromptsForPlugin } from '../lib/parser';

const prompts = loadPrompts('content');
const config = loadPluginsConfig('content');
const byId = (id: string) => prompts.find(p => p.frontmatter.id === id);
const get = byId;

describe('defensive-programming', () => {
  it('exists and is a member of constellize:craft', () => {
    expect(byId('implement-defensive-programming')).toBeDefined();
    const craft = getPromptsForPlugin(prompts, 'constellize:craft', config.plugins);
    expect(craft.map(p => p.frontmatter.id)).toContain('implement-defensive-programming');
  });

  it('carries no outputs.book block, so it can never become a book output', () => {
    expect(byId('implement-defensive-programming')!.frontmatter.outputs?.book).toBeUndefined();
  });

  it('names no language or tool', () => {
    const body = byId('implement-defensive-programming')!.content;
    for (const banned of [/\bexcept:/, /\bpytest\b/, /\bruff\b/, /\buv run\b/, /\bnpm\b/, /\bPython\b/i, /\btry\s*\{/]) {
      expect(body).not.toMatch(banned);
    }
  });

  it('asserts a verdict', () => {
    const body = byId('implement-defensive-programming')!.content;
    expect(body).toContain('**Gate Status:** ✅ PASS / ❌ FAIL');
    expect(body).toMatch(/FAIL the gate/);
  });

  it('declares every placeholder its body uses, so none ships unsubstituted', () => {
    const prompt = byId('implement-defensive-programming')!;
    const used = new Set([...prompt.content.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map(m => m[1]));
    const declared = new Set((prompt.frontmatter.variables ?? []).map((v: { name: string }) => v.name));
    expect(used.size).toBeGreaterThan(0);
    for (const name of used) {
      expect(declared).toContain(name);
    }
  });
});

// The shared table covers every constellize:feature prompt. It is built up one id per task:
// Task C4 seeds it with specify-feature; Task C5 appends implement-feature and Task C6
// appends verify-feature, each alongside the prompt it writes, so the suite stays green.
const FEATURE_IDS = ['specify-feature'] as const;

describe.each(FEATURE_IDS)('%s', (id) => {
  it('exists and belongs to constellize:feature', () => {
    expect(get(id)).toBeDefined();
    const feature = getPromptsForPlugin(prompts, 'constellize:feature', config.plugins);
    expect(feature.map(p => p.frontmatter.id)).toContain(id);
  });

  it('carries no outputs.book block', () => {
    expect(get(id)!.frontmatter.outputs?.book).toBeUndefined();
  });

  it('publishes no website page', () => {
    expect(get(id)!.frontmatter.outputs!.website!.include).toBe(false);
  });

  it('declares the invocation tools', () => {
    const tools = get(id)!.frontmatter.skill!['allowed-tools']!;
    expect(tools).toEqual(expect.arrayContaining(['Read', 'Glob', 'Grep', 'Write', 'Bash', 'Skill']));
  });

  it('names llm/features/ in full, since rewriteLlmPaths does not prefix features/', () => {
    expect(get(id)!.content).toContain('llm/features/');
    expect(get(id)!.content).not.toMatch(/(^|[^/])\bfeatures\/<feature/m);
  });

  it('describes the advisory fallback and names what is missing', () => {
    expect(get(id)!.content).toMatch(/advisor/i);
  });

  it('is not Python-shaped', () => {
    for (const banned of [/\buv (run|sync)\b/, /\bpytest\b/, /\bruff\b/, /llm\/memory_bank\//, /\/constellize:feature:/]) {
      expect(get(id)!.content).not.toMatch(banned);
    }
  });
});

describe('specify-feature', () => {
  it('delegates every phase in the §6.1 map', () => {
    const b = get('specify-feature')!.content;
    for (const target of [
      'constellize-harness:assess', 'constellize-design:gap-analysis',
      'constellize-design:requirements-analysts', 'constellize-design:implementation-sketch',
      'constellize-design:system-architects', 'constellize-craft:qa-engineers',
      'constellize-memory:update',
    ]) expect(b).toContain(target);
  });

  it('keeps the interview with the skill, not the agent', () => {
    expect(get('specify-feature')!.content).toMatch(/one (question )?at a time/i);
    expect(get('specify-feature')!.content).toMatch(/never (run|conduct) the interview (inside|in) (a )?subagent/i);
  });

  it('always asks the two required questions', () => {
    const b = get('specify-feature')!.content;
    expect(b).toMatch(/definition of done/i);
    expect(b).toMatch(/how will this be verified/i);
  });

  it('writes the status as prose', () => {
    expect(get('specify-feature')!.content).toContain('**Status:** SPECIFIED');
  });

  // Review Focus 5
  it('refuses an unsafe feature name and a case-only collision', () => {
    const b = get('specify-feature')!.content;
    expect(b).toMatch(/kebab-case/i);
    expect(b).toMatch(/path separator|\.\./);
    expect(b).toMatch(/case-insensitiv/i);
  });

  // D9
  it('revises an existing artifact only after confirmation, and clears stale evidence', () => {
    const b = get('specify-feature')!.content;
    expect(b).toMatch(/## Gate Results/);
    expect(b).toMatch(/delete|remove/i);
  });
});
