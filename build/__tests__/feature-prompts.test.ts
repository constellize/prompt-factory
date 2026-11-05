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
});
