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

// The authored instructions only: the body up to the <examples> block.
//
// Every POSITIVE wording assertion below runs against this, never against the whole body,
// because the GOOD/BAD examples quote the failure modes in full -- the BAD one contains
// "Q: Definition of done? A: Tests pass." and a transcript of an interview held inside an
// agent. A `/definition of done/i` match against the whole body is therefore satisfied by
// the file's own illustration of the defect it is meant to forbid, and would still pass with
// every required question deleted from the instructions. A test that an example of the
// failure can satisfy is not a test. NEGATIVE assertions keep running against the whole
// body, where the examples must be covered too.
const instructions = (promptId: string): string => {
  const body = get(promptId)!.content;
  const examples = body.indexOf('<examples>');
  expect(examples).toBeGreaterThan(0);
  return body.slice(0, examples);
};

// Every `constellize-<plugin>:<name>` string each prompt is allowed to name: its own
// delegation map (§6.1 for specify), plus the sibling skills it names as readers of the
// status line and never invokes. Without this, the "nothing outside the map belongs in the
// skill" half of the map is unguarded. C5 and C6 add a row each.
const ALLOWED_TARGETS: Record<string, readonly string[]> = {
  'specify-feature': [
    // the §6.1 delegation map
    'constellize-harness:assess',
    'constellize-design:gap-analysis',
    'constellize-design:requirements-analysts',
    'constellize-design:implementation-sketch',
    'constellize-design:system-architects',
    'constellize-craft:qa-engineers',
    'constellize-memory:update',
    // named only as readers of the status line
    'constellize-feature:implement',
    'constellize-feature:verify',
  ],
};

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
    expect(tools).toEqual(expect.arrayContaining(['Read', 'Glob', 'Grep', 'Write', 'Bash', 'Skill', 'Task', 'Agent']));
  });

  // context: fork would run the skill in a subagent, which has no channel to the user, so the
  // interview these prompts exist for could not happen at all. This is the one frontmatter
  // field whose flip silently defeats the design, and the prose cannot defend it.
  it('runs inline, not forked', () => {
    expect(get(id)!.frontmatter.skill!.context).toBe('inline');
  });

  it('names llm/features/ in full, since rewriteLlmPaths does not prefix features/', () => {
    expect(get(id)!.content).toContain('llm/features/');
    // any unprefixed features/, not just features/<feature...: rewriteLlmPaths would ship it as is
    expect(get(id)!.content).not.toMatch(/(^|[^/])\bfeatures\//m);
  });

  it('describes the advisory fallback and names what is missing', () => {
    const i = instructions(id);
    expect(i).toMatch(/advisor/i);
    // the word alone is not the requirement: the fallback must say what is missing, by name
    expect(i).toMatch(/\bmissing\b/i);
    expect(i).toMatch(/tool name/i);
    expect(i).toMatch(/plugin/i);
  });

  it('names no delegation target outside its own map', () => {
    const allowed = ALLOWED_TARGETS[id];
    expect(allowed).toBeDefined();
    const named = new Set(
      [...get(id)!.content.matchAll(/constellize-[a-z-]+:[a-z-]+/g)].map(m => m[0])
    );
    expect(named.size).toBeGreaterThan(0);
    for (const target of named) {
      expect(allowed).toContain(target);
    }
  });

  it('is not Python-shaped', () => {
    for (const banned of [/\buv (run|sync)\b/, /\bpytest\b/, /\bruff\b/, /llm\/memory_bank\//, /\/constellize:feature:/]) {
      expect(get(id)!.content).not.toMatch(banned);
    }
  });
});

describe('specify-feature', () => {
  it('delegates every phase in the §6.1 map', () => {
    const b = instructions('specify-feature');
    for (const target of [
      'constellize-harness:assess', 'constellize-design:gap-analysis',
      'constellize-design:requirements-analysts', 'constellize-design:implementation-sketch',
      'constellize-design:system-architects', 'constellize-craft:qa-engineers',
      'constellize-memory:update',
    ]) expect(b).toContain(target);
  });

  // This asserts that the sentence is there, not that the structure holds: whether a build
  // actually keeps the interview in the skill is a property of the running skill, not of its
  // text, and no assertion over a prompt body can reach it. Said plainly rather than implied.
  it('keeps the interview with the skill, not the agent', () => {
    const b = instructions('specify-feature');
    expect(b).toMatch(/one (question )?at a time/i);
    expect(b).toMatch(/never (run|conduct) the interview (inside|in) (a )?subagent/i);
  });

  it('always asks the two required questions', () => {
    const b = instructions('specify-feature');
    expect(b).toMatch(/definition of done/i);
    expect(b).toMatch(/how will this be verified/i);
  });

  it('writes the status as prose', () => {
    expect(instructions('specify-feature')).toContain('**Status:** SPECIFIED');
  });

  // Review Focus 5
  it('refuses an unsafe feature name and a case-only collision', () => {
    const b = instructions('specify-feature');
    expect(b).toMatch(/kebab-case/i);
    // the rule's own content: `..` alone is matched by the template's `...` ellipses, so it
    // would pass with no name-safety rule in the file at all
    expect(b).toMatch(/path separator/i);
    expect(b).toMatch(/\.\.\//);
    expect(b).toMatch(/case-insensitiv/i);
  });

  it('drafts around the delegated sections instead of over them', () => {
    const b = instructions('specify-feature');
    expect(b).toMatch(/read the artifact first/i);
    expect(b).toMatch(/verbatim/i);
    expect(b).toMatch(/## Gap Analysis/);
    expect(b).toMatch(/## Implementation Sketch/);
  });

  // D9
  it('revises an existing artifact only after confirmation, and clears stale evidence', () => {
    const b = instructions('specify-feature');
    expect(b).toMatch(/## Gate Results/);
    expect(b).toMatch(/delete|remove/i);
    // the whole section, not just a fenced block: C6 has not fixed its shape yet
    expect(b).toMatch(/next heading at the same level or above/i);
  });
});
