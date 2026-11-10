import { loadPrompts, loadPluginsConfig, getPromptsForPlugin } from '../lib/parser';
import { assessGateResults } from '../../content/literal/constellize-harness/scripts/tier1';

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
const FEATURE_IDS = ['specify-feature', 'implement-feature', 'verify-feature'] as const;

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
  'implement-feature': [
    // the §6.2 delegation map
    'constellize-design:constellation-map',
    'constellize-design:gap-analysis',
    'constellize-design:implementation-sketch',
    'constellize-design:code-generation-plan',
    'constellize-craft:unit-tests',
    'constellize-craft:integration-tests',
    'constellize-craft:contract-tests',
    'constellize-craft:qa-engineers',
    'constellize-design:system-architects',
    'constellize-memory:update',
    // named only as the siblings a refusal points at, never invoked
    'constellize-feature:specify',
    'constellize-feature:verify',
  ],
  'verify-feature': [
    // the §6.3 gate map: gate 1
    'constellize-craft:test-coverage',
    // gate 2 — defensive-programming unconditionally, the four operational skills on the surface
    'constellize-craft:defensive-programming',
    'constellize-craft:application-health-validation',
    'constellize-craft:infrastructure-health-checks',
    'constellize-craft:operational-monitoring',
    'constellize-craft:actionable-health-reporting',
    // gate 3 — conditional on the deployment surface
    'constellize-deliver:externalize-config',
    'constellize-deliver:environment-independence',
    'constellize-deliver:reliable-containers',
    'constellize-deliver:rollback-capability',
    // gate 4
    'constellize-craft:architectural-consistency',
    'constellize-craft:dependency-hygiene',
    // the memory bank records the verification, as it does the two phases before it
    'constellize-memory:update',
    // named only as the siblings a refusal points at, never invoked
    'constellize-feature:specify',
    'constellize-feature:implement',
    // named only as the assessor that cross-checks the block it writes, never invoked
    'constellize-harness:assess',
  ],
};

// The §6.3 gate map's delegation targets, in gate order. The brief's stub says "11 targets";
// the map holds twelve — 1 for gate 1, 5 for gate 2, 4 for gate 3, 2 for gate 4 — so the count
// is asserted here rather than taken from the comment.
const GATE_SKILLS: readonly string[] = [
  'constellize-craft:test-coverage',
  'constellize-craft:defensive-programming',
  'constellize-craft:application-health-validation',
  'constellize-craft:infrastructure-health-checks',
  'constellize-craft:operational-monitoring',
  'constellize-craft:actionable-health-reporting',
  'constellize-deliver:externalize-config',
  'constellize-deliver:environment-independence',
  'constellize-deliver:reliable-containers',
  'constellize-deliver:rollback-capability',
  'constellize-craft:architectural-consistency',
  'constellize-craft:dependency-hygiene',
];

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

  // generate-marketplace substitutes {{name}} only when `variables:` is non-empty, so a
  // placeholder in a prompt that declares none ships its braces literally to the user. These
  // prompts take their argument as $ARGUMENTS and declare no variables, which only holds if
  // nothing in the body reaches for one. A whole-body negative: the examples are covered too.
  it('uses no placeholder, having declared no variables', () => {
    expect(get(id)!.frontmatter.variables).toBeUndefined();
    expect(get(id)!.content).not.toMatch(/\{\{/);
  });

  it('names llm/features/ in full, since rewriteLlmPaths does not prefix features/', () => {
    expect(instructions(id)).toContain('llm/features/');
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

describe('implement-feature', () => {
  it('delegates every phase in the §6.2 map', () => {
    const b = instructions('implement-feature');
    for (const target of [
      'constellize-design:constellation-map', 'constellize-design:gap-analysis',
      'constellize-design:implementation-sketch', 'constellize-design:code-generation-plan',
      'constellize-craft:unit-tests', 'constellize-craft:integration-tests',
      'constellize-craft:contract-tests', 'constellize-craft:qa-engineers',
      'constellize-design:system-architects', 'constellize-memory:update',
    ]) expect(b).toContain(target);
    // Presence alone would pass against a prompt that named a target in order to forbid it.
    // `names no delegation target outside its own map` pins the set; this pins the one
    // normative qualifier in the map, which otherwise nothing asserts.
    expect(b).toMatch(/constellize-craft:contract-tests[\s\S]{0,200}when the feature crosses an API boundary/);
  });

  // Anti-goal 3: duplicating a capability another plugin already provides. The §6.2 map gives
  // the star catalog to `constellation-map`, which is also why Task B1 gave it an output_path,
  // and why C4 was corrected for writing that section itself.
  it('gets the constellation map by delegation and never writes the section itself', () => {
    const b = instructions('implement-feature');
    expect(b).toContain('## Constellation Map');
    expect(b).toMatch(/constellize-design:constellation-map[\s\S]{0,600}output_path/);
    expect(b).toMatch(/(do not|never) write (that|the `?## Constellation Map`?) section yourself/i);
  });

  it('records files created and modified, which verify reads for the surface determination', () => {
    const b = instructions('implement-feature');
    expect(b).toContain('## Implementation Report');
    expect(b).toMatch(/Files created/);
    expect(b).toMatch(/Files modified/);
    // D3 fails toward more checking, so an omitted list is safe but wasteful: both are always
    // written, and an empty one is written as empty rather than dropped.
    expect(b).toMatch(/even when one is empty/i);
    expect(b).toMatch(/never drop (the|a) list/i);
  });

  // The artifact already carries C4's status line. A second one is dead text: the assessor's
  // readDeclaredStatus returns on the first unfenced match and never reaches it.
  it('rewrites the one status line in place and never appends a second', () => {
    const b = instructions('implement-feature');
    expect(b).toContain('**Status:** IMPLEMENTED');
    expect(b).toMatch(/in place/i);
    expect(b).toMatch(/first[\s\S]{0,120}not inside a fenced code block/i);
    expect(b).toMatch(/never append a second status line/i);
    // With Edit absent from allowed-tools (D1), this is a whole-file write, and four sections
    // land in the artifact between the Phase 1 read and it -- three of them other skills'.
    // Without the re-read, a literal reader writes back a stale buffer and deletes them.
    expect(b).toMatch(/re-read the whole artifact/i);
    expect(b).toMatch(/never reconstruct it from an earlier read/i);
    expect(b).toMatch(/write every other byte of the file back/i);
  });

  // The whole point of the trio: a status that precedes its evidence is the defect this
  // project exists to fix. Asserted structurally, by position within the phase list.
  it('writes the status last, after the work it attests to', () => {
    const b = instructions('implement-feature');
    const phases = b.slice(b.indexOf('### Phase 1'), b.indexOf('</task>'));
    expect(phases.length).toBeGreaterThan(0);
    const review = phases.indexOf('Adversarial test review');
    const report = phases.indexOf('## Implementation Report');
    const memory = phases.indexOf('constellize-memory:update');
    const status = phases.indexOf('**Status:** IMPLEMENTED');
    for (const i of [review, report, memory, status]) expect(i).toBeGreaterThan(-1);
    expect(status).toBeGreaterThan(review);
    expect(status).toBeGreaterThan(report);
    expect(status).toBeGreaterThan(memory);
  });

  // D9. The brief's stub was `/refuse|stop/i`, which a prompt saying the opposite would also
  // satisfy, so the Hard Rule itself is asserted instead of the word.
  it('refuses a missing, IMPLEMENTED or VERIFIED artifact and names the status', () => {
    const b = instructions('implement-feature');
    expect(b).toMatch(/NEVER implement an artifact that is not at `?\*\*Status:\*\* SPECIFIED/);
    expect(b).toMatch(/name the status you found/i);
    for (const s of ['SPECIFIED', 'IMPLEMENTED', 'VERIFIED']) expect(b).toContain(`**Status:** ${s}`);
    // a stop with no exit is not a refusal: it names the sibling skill to run instead
    expect(b).toContain('constellize-feature:specify');
    expect(b).toContain('constellize-feature:verify');
    // and the missing-artifact case names the path it looked for
    expect(b).toMatch(/llm\/features\//);
  });

  it('carries no coverage number of its own', () => {
    expect(get('implement-feature')!.content).not.toMatch(/\b(80|100)\s?%/);
  });

  it('owns no threshold and points at where one is declared', () => {
    const b = instructions('implement-feature');
    expect(b).toContain('llm/constellize.json');
    // /threshold/i alone asserts almost nothing and is carried by the line above it: the
    // requirement is the disclaimer of ownership, so that is what is asserted.
    expect(b).toMatch(/Coverage is not this skill's to judge or to number/);
    expect(b).toMatch(/The threshold in force is the project's/);
  });

  it('keeps the untestable-code rule in language-neutral form', () => {
    const b = instructions('implement-feature');
    expect(b).toMatch(/untestable/i);
    expect(b).toMatch(/justification/i);
    expect(b).toMatch(/whatever form the language provides/i);
    expect(get('implement-feature')!.content).not.toMatch(/pragma: ?no ?cover/i);
  });

  it('takes its test, lint and run commands from the project, never from this prompt', () => {
    const b = instructions('implement-feature');
    for (const key of ['testCommand', 'lintCommand', 'runCommand']) expect(b).toContain(key);
    expect(b).toMatch(/ask the user/i);
    expect(b).toMatch(/(do not|never) (guess|invent)/i);
  });

  it('is test-first per unit, and turns a revealed gap into a test first', () => {
    const b = instructions('implement-feature');
    expect(b).toMatch(/test-first/i);
    expect(b).toMatch(/becomes a (failing )?test first/i);
    expect(b).toMatch(/NEVER weaken a test/);
  });

  it('keeps the plan-confirmation turn with the user', () => {
    const b = instructions('implement-feature');
    expect(b).toMatch(/confirm/i);
    expect(b).toMatch(/\bwait\b/i);
    expect(b).toMatch(/(do not|never) (start|begin) (writing )?code before/i);
  });

  // The artifact already holds sections two other skills wrote, and C6 writes into it next.
  it('places its report section without clobbering what other skills wrote', () => {
    const b = instructions('implement-feature');
    expect(b).toMatch(/read the artifact first/i);
    expect(b).toMatch(/## Gap Analysis/);
    expect(b).toMatch(/## Implementation Sketch/);
    expect(b).toMatch(/replace (it|that section) in place/i);
    expect(b).toMatch(/next heading at the same level or above/i);
    expect(b).toMatch(/(do not|never) write a second `?## Implementation Report`?/i);
  });

  // The template emits the colon inside the bold, while the prose and the loose /Files created/
  // assertions do not care either way. C6's D3 determination parses these two markers, so the
  // exact literals are pinned here and the two sides cannot drift apart silently.
  it('pins the literal report markers that verify parses', () => {
    const b = instructions('implement-feature');
    expect(b).toContain('**Files created:**');
    expect(b).toContain('**Files modified:**');
  });

  it('has an exit for a project with no run command and nothing to run', () => {
    const b = instructions('implement-feature');
    expect(b).toMatch(/no run command and has no entry point/i);
    expect(b).toMatch(/skip the reachability check/i);
    expect(b).toMatch(/record the skip/i);
  });

  // The supersession is correct per the ruling, but the user whose record was replaced has to
  // hear it, so the closing summary carries it and not only the prompt's own prose.
  it('tells the user in the summary that the spec gap analysis was superseded', () => {
    const b = instructions('implement-feature');
    expect(b).toMatch(/closing summary[\s\S]{0,500}## Gap Analysis/);
  });

  // The sketch is the one artefact the user personally approved in specify, and Phase 3 replaces it.
  it('tells the user in the summary that the approved implementation sketch was superseded', () => {
    const b = instructions('implement-feature');
    expect(b).toMatch(/closing summary[\s\S]{0,800}replaced the `## Implementation Sketch` the user signed off/);
  });
});

// Every positive assertion below runs against `instructions('verify-feature')`, and that matters
// more here than anywhere else in this file: the <examples> block contains a gate-results record
// in both a GOOD and a BAD shape, so a whole-body match for `"schema": 1`, `"verdict"`, `PASS` or
// any of the four threshold numbers can be satisfied by the illustration of the defect alone.
describe('verify-feature', () => {
  it('delegates to every gate skill in the §6.3 map, and to no other', () => {
    const b = instructions('verify-feature');
    expect(GATE_SKILLS).toHaveLength(12);
    for (const target of GATE_SKILLS) expect(b).toContain(target);
    // The other half of "and to no other". `names no delegation target outside its own map`
    // pins the set against ALLOWED_TARGETS; this pins which of those are *gates*, so a later
    // edit cannot quietly promote a sibling or the memory bank into the gate map.
    const named = new Set(
      [...get('verify-feature')!.content.matchAll(/constellize-[a-z-]+:[a-z-]+/g)].map(m => m[0])
    );
    expect([...named].filter(t => !GATE_SKILLS.includes(t)).sort()).toEqual([
      'constellize-feature:implement',
      'constellize-feature:specify',
      'constellize-harness:assess',
      'constellize-memory:update',
    ]);
  });

  // Decision 20: a project-scope question is not a property of one feature, and running these
  // two per feature would return the same findings every time.
  it('does not call the two project-scope Gate 4 skills', () => {
    const b = get('verify-feature')!.content;
    expect(b).not.toMatch(/constellize-craft:documentation-completeness/);
    expect(b).not.toMatch(/constellize-craft:team-comprehension/);
  });

  // The assessor's ALWAYS_REQUIRED_GATES is [1, 2, 4]. The brief's stub for this had an empty
  // body, which asserts nothing; the always/conditional split is asserted here from the gate
  // map's own cells, so a prompt that made gate 1 or gate 4 conditional would fail.
  it('runs Gates 1 and 4 and defensive-programming unconditionally', () => {
    const b = instructions('verify-feature');
    expect(b).toContain('Gates 1, 2 and 4 always run');
    expect(b).toContain(
      'gate 2 because its `constellize-craft:defensive-programming` member is unconditional'
    );
    expect(b).toMatch(/\| 1\. Test integrity \| always \|/);
    expect(b).toMatch(/\| 4\. Maintainability in context \| always \|/);
    // ... and the one gate that is conditional is conditional, so "always" is not vacuous
    expect(b).toMatch(
      /\| 3\. Deployment readiness \| only when the feature touches the deployment surface \|/
    );
  });

  it('records the surface determination and its reason', () => {
    const b = instructions('verify-feature');
    // D3's three inputs, in order
    expect(b).toMatch(/Technical Notes/);
    expect(b).toMatch(/Dependencies/);
    expect(b).toContain('**Files created:**');
    expect(b).toContain('**Files modified:**');
    expect(b).toMatch(/working-tree diff/);
    // the block's members, both of which the assessor requires as booleans, plus the reason
    expect(b).toMatch(/"surface"/);
    expect(b).toMatch(/"deployment"/);
    expect(b).toMatch(/"operational"/);
    expect(b).toMatch(/"reason"/);
    // D3's fail-safe
    expect(b).toMatch(/when (the )?evidence is (absent|ambiguous)/i);
    expect(b).toMatch(/both gates run/i);
    // silence is not a determination: an absent boolean makes the evidence incomplete
    expect(b).toMatch(/silence is not/i);
  });

  it('emits the gate-results schema the assessor parses', () => {
    const b = instructions('verify-feature');
    for (const key of [
      '"schema": 2',
      '"gates"',
      '"required"',
      '"verdict"',
      '"measured"',
      '"threshold"',
      '"source"',
      '"enforced"',
    ]) {
      expect(b).toContain(key);
    }
    // One gate, one verdict: a repeated gate number makes the whole block malformed.
    expect(b).toMatch(/one gate, one verdict/i);
    expect(b).toMatch(/(never|not) record the same gate twice/i);
    // A required gate recorded SKIPPED counts as missing, not as a pass.
    expect(b).toContain('"SKIPPED"');
  });

  it('emits a schema the assessor accepts, not merely a schema number', () => {
    const emitted = /"schema":\s*(\d+)/.exec(instructions('verify-feature'));
    expect(emitted).not.toBeNull();
    const schema = Number(emitted![1]);

    const gate = (n: number) =>
      `{ "gate": ${n}, "required": true, "verdict": "PASS", "measured": "87% branch", "at": "2026-11-10T00:00:00Z" }`;
    const block = [
      '# Feature: coupling',
      '',
      '## Gate Results',
      '',
      '```json',
      '{',
      `  "schema": ${schema},`,
      '  "threshold": { "source": "default", "enforced": true, "branch": 80, "criticalLogic": 100, "errorPaths": 100, "integrationPoints": 100 },',
      '  "surface": { "operational": true, "deployment": false, "reason": "nothing deployable changed" },',
      `  "gates": [${gate(1)}, ${gate(2)}, ${gate(4)}]`,
      '}',
      '```',
      '',
    ].join('\n');

    // Not just "not malformed": a block in exactly the shape the prompt documents
    // has to substantiate a verified status, or the prompt is teaching writers to
    // produce evidence the assessor will reject.
    expect(assessGateResults(block).evidence).toBe('complete');
  });

  // The sharpest edge in the contract, and nothing else in this suite pins it: two unfenced
  // `## Gate Results` headings make the evidence `malformed` outright, not stale, and D9 makes
  // re-running on a VERIFIED artifact the ordinary case rather than the exception.
  it('writes exactly one `## Gate Results` section and replaces it in place on a re-run', () => {
    const b = instructions('verify-feature');
    expect(b).toContain('## Gate Results');
    expect(b).toMatch(/exactly one `?## Gate Results`? section/i);
    expect(b).toMatch(/(never|do not) (write|append) a second `?## Gate Results`?/i);
    expect(b).toMatch(/replace (it|that section) in place/i);
    expect(b).toMatch(/keeping its position/i);
    expect(b).toMatch(/next heading at the same level or above/i);
    // the heading's own shape, which the assessor matches anchored with nothing trailing
    expect(b).toMatch(/nothing after it/i);
    // and the consequence of getting it wrong, so the rule carries its reason
    expect(b).toMatch(/malformed/i);
  });

  // With Edit absent from allowed-tools (D1) every write to the artifact is a whole-file write,
  // and this skill writes into a file whose other sections belong to four other skills.
  it('re-reads before each write and writes back every byte it does not own', () => {
    const b = instructions('verify-feature');
    expect(b).toMatch(/re-read the whole artifact/i);
    expect(b).toMatch(/never reconstruct it from an earlier read/i);
    expect(b).toMatch(/write every other byte of the file back/i);
    // the two things it writes, and the sections it does not
    expect(b).toContain('## Implementation Report');
    expect(b).toContain('## Constellation Map');
    expect(b).toContain('## Gap Analysis');
    expect(b).toContain('## Implementation Sketch');
    expect(b).toMatch(/(never|do not) write the `?## Constellation Map`? section/i);
  });

  it('carries the default threshold and reads a declared one', () => {
    const b = instructions('verify-feature');
    expect(b).toContain('llm/constellize.json');
    expect(b).toContain('coverageThreshold');
    // the four floor numbers, each recorded by name. The brief's stub was /80/, which the
    // ISO timestamp or any other number in the block would also have satisfied.
    expect(b).toContain('"branch": 80');
    expect(b).toContain('"criticalLogic": 100');
    expect(b).toContain('"errorPaths": 100');
    expect(b).toContain('"integrationPoints": 100');
  });

  // Review Focus 1. The brief's stub was /stricter/i plus /refuse|reject|ignore/i, which a prompt
  // saying "a looser declaration is honoured, stricter ones are refused" would also satisfy.
  it('refuses a declared threshold looser than the default', () => {
    const b = instructions('verify-feature');
    expect(b).toContain('A declared threshold is honoured only where it is stricter');
    expect(b).toMatch(/refuse/i);
    expect(b).toMatch(/the default applies/i);
    expect(b).toMatch(/say so/i);
    // and relabelling cannot launder it: the floor is checked whatever the source says
    expect(b).toMatch(/whatever (it|the block) (names|records) as its `?source`?/i);
  });

  it('cannot write VERIFIED without a verdict for every required gate', () => {
    const b = instructions('verify-feature');
    expect(b).toContain(
      'NEVER write `**Status:** VERIFIED` without a verdict for every required gate'
    );
    // the prose is not the defence this time: something other than this skill checks it
    expect(b).toContain('VERIFIED (unsubstantiated)');
    // and the failing path has a defined end state, with the gate named
    expect(b).toContain('**Status:** IMPLEMENTED');
    expect(b).toMatch(/nam(e|ing) the failing gate/i);
    // The checklist a reader works from names all four of the conditions `assessGateResults`
    // checks, and `surfaceDetermined` is the one that is easy to leave out: a block missing
    // either surface boolean is incomplete even when every verdict is a PASS.
    expect(b).toMatch(/both surface booleans are recorded/i);
  });

  // D9 makes a re-run of a VERIFIED artifact ordinary, so "stays at IMPLEMENTED" and "the
  // IMPLEMENTED it started from" were both false on that path, and the most literal reading of
  // them left the VERIFIED line alone over a block holding a FAIL. The assessor would have
  // caught it as unsubstantiated, but the artifact would have been wrong, and a reader should
  // not have to infer the demotion from a NEVER sixty lines further down.
  it('demotes a VERIFIED artifact whose re-run fails', () => {
    const b = instructions('verify-feature');
    expect(b).toContain('whether it started this run at IMPLEMENTED or at VERIFIED');
    expect(b).toMatch(/demote/i);
    // the instruction is to write the status, not to describe the state the artifact was in
    expect(b).toMatch(/written to IMPLEMENTED/);
    expect(b).toMatch(/(never|not) leave a VERIFIED line standing/i);
    // whole-body: the presupposition is gone from the prompt, examples included
    expect(get('verify-feature')!.content).not.toMatch(/it started from/);
    expect(get('verify-feature')!.content).not.toMatch(/stays at IMPLEMENTED/);
  });

  // D9. The brief's stub for this had an empty body. Both halves are asserted from the status
  // gate's own bullets, so a prompt that refused the re-run or verified a SPECIFIED artifact
  // would fail rather than pass silently.
  it('re-runs on a VERIFIED artifact and refuses a SPECIFIED one', () => {
    const b = instructions('verify-feature');
    expect(b).toMatch(/\*\*Status:\*\* SPECIFIED`\*\*: refuse/);
    expect(b).toMatch(/name the status you found/i);
    expect(b).toContain('constellize-feature:implement');
    expect(b).toMatch(/\*\*Status:\*\* IMPLEMENTED`\*\*: proceed/);
    expect(b).toMatch(/\*\*Status:\*\* VERIFIED`\*\*: \*\*re-run\*\*/);
    expect(b).toMatch(/code changes after a pass/i);
    // a missing artifact is the third refusal, and it names the path it looked for
    expect(b).toMatch(/llm\/features\//);
    expect(b).toContain('constellize-feature:specify');
  });

  // Decision 4 / gate 1 consumes, never measures: `test-coverage` owns the measurement.
  it('produces no coverage itself', () => {
    expect(get('verify-feature')!.content).not.toMatch(/--cov|coverage run|nyc |go test -cover/);
    const b = instructions('verify-feature');
    expect(b).toContain('never runs a coverage command of its own');
    expect(b).toMatch(/constellize-craft:test-coverage[\s\S]{0,400}verdict/);
  });

  it('rewrites the one status line in place and never appends a second', () => {
    const b = instructions('verify-feature');
    expect(b).toContain('**Status:** VERIFIED');
    expect(b).toMatch(/in place/i);
    expect(b).toMatch(/first[\s\S]{0,120}not inside a fenced code block/i);
    expect(b).toMatch(/never append a second status line/i);
  });

  // The project's whole reason for existing: a status that precedes its evidence. Asserted
  // structurally, by position within the phase list, as it is for implement-feature.
  //
  // Each anchor is the opening of the Phase 7 step that performs the write, not a phrase that
  // also occurs in prose: `## Gate Results` on its own resolved to Phase 1's "note whether the
  // artifact already holds a ## Gate Results section", so the test used to order two sentences
  // that were not the writes it named. Anchoring on the step openings also makes the ordering
  // fail loudly if a step is renumbered or reworded, which is the point.
  it('writes the gate-results block before the status it substantiates', () => {
    const b = instructions('verify-feature');
    const phases = b.slice(b.indexOf('### Phase 1'), b.indexOf('</task>'));
    expect(phases.length).toBeGreaterThan(0);
    const block = phases.indexOf('2. **Write the `## Gate Results` section into the artifact**');
    const memory = phases.indexOf('4. **Invoke `constellize-memory:update`**');
    const status = phases.indexOf('5. **Write the status, last, and in place**');
    for (const i of [block, memory, status]) expect(i).toBeGreaterThan(-1);
    // one occurrence each, so `indexOf` cannot be pointing at a second copy of the step
    for (const anchor of [block, memory, status]) {
      expect(phases.indexOf(phases.slice(anchor, phases.indexOf('\n', anchor)), anchor + 1)).toBe(-1);
    }
    expect(status).toBeGreaterThan(block);
    expect(status).toBeGreaterThan(memory);
    expect(memory).toBeGreaterThan(block);
  });

  it('takes its lint and run commands from the project, never from this prompt', () => {
    const b = instructions('verify-feature');
    for (const key of ['lintCommand', 'runCommand']) expect(b).toContain(key);
    expect(b).toMatch(/ask the user/i);
    expect(b).toMatch(/(do not|never) (guess|invent)/i);
  });

  // The strongest assertion available here, and the one the rest of this describe block only
  // approximates: the example block is what a reader copies, so it is handed to the real
  // `assessGateResults` rather than eyeballed key by key. Every rule the parser enforces --
  // the numeric schema, both surface booleans, the four threshold numbers at or above the
  // floor, one entry per gate, a PASS for each of 1, 2 and 4 -- is checked at once, by the
  // function that decides whether a VERIFIED status stands.
  it('emits an example block the real assessor reads as complete evidence', () => {
    const b = instructions('verify-feature');
    // The section tag on its own line, not the inline `<output-format>` reference in Phase 7:
    // `indexOf('<output-format>')` matched that reference and started the slice ~75 lines early,
    // so the test would silently validate a different block the day one is added to <context>.
    const tag = b.indexOf('\n<output-format>\n');
    expect(tag).toBeGreaterThan(-1);
    expect(b.indexOf('\n<output-format>\n', tag + 1)).toBe(-1);
    const template = b.slice(tag);
    // and the slice really does begin at the section, not at a mention of it
    expect(template.slice(0, 40)).toContain('\n<output-format>\n');
    const fence = /```json\n([\s\S]*?)\n```/.exec(template);
    expect(fence).not.toBeNull();
    const artifact = [
      '# Feature: example', '', '**Status:** VERIFIED', '', 'Prose.', '',
      '## Gate Results', '', '```json', fence![1], '```', '',
    ].join('\n');
    expect(assessGateResults(artifact)).toEqual({
      evidence: 'complete',
      missingGates: [],
      failedGates: [],
    });
  });

  // Ruling 3. The two assertions used to be independent, so a prompt saying "last section of the
  // file" about anything at all would have satisfied them; each one now ties the position to the
  // section it is about, in one match.
  it('is the last section of the artifact, where the two sibling skills leave room for it', () => {
    const b = instructions('verify-feature');
    expect(b).toMatch(/`## Gate Results` section into the artifact[\s\S]{0,200}last section of the artifact/);
    expect(b).toMatch(/after `## Implementation Report`\.[\s\S]{0,80}last section of the artifact/);
  });

  // `delegates to every gate skill in the §6.3 map` pins the set and the count, and
  // `runs Gates 1 and 4 ... unconditionally` pins the When column. Neither pins which gate a
  // target belongs to: moving `constellize-deliver:rollback-capability` into gate 2's row would
  // pass both. This reads the gate map's Delegates-to cells row by row.
  it('maps each target to its own gate', () => {
    const expected: Record<number, readonly string[]> = {
      1: ['constellize-craft:test-coverage'],
      2: [
        'constellize-craft:defensive-programming',
        'constellize-craft:application-health-validation',
        'constellize-craft:infrastructure-health-checks',
        'constellize-craft:operational-monitoring',
        'constellize-craft:actionable-health-reporting',
      ],
      3: [
        'constellize-deliver:externalize-config',
        'constellize-deliver:environment-independence',
        'constellize-deliver:reliable-containers',
        'constellize-deliver:rollback-capability',
      ],
      4: ['constellize-craft:architectural-consistency', 'constellize-craft:dependency-hygiene'],
    };
    // every gate skill belongs to exactly one gate, and together they are the whole map
    expect(Object.values(expected).flat().slice().sort()).toEqual([...GATE_SKILLS].slice().sort());

    const b = instructions('verify-feature');
    // scoped to the gate map: the phase table's rows are numbered too, and 11 rows in the body
    // match a bare row regex, so an unscoped match would read the wrong table
    const header = b.indexOf('| Gate | When it runs | Delegates to |');
    expect(header).toBeGreaterThan(-1);
    const map = b.slice(header, b.indexOf('### Phase 1'));
    expect(map).toContain('| 1. Test integrity |');
    expect(map).not.toContain('| Phase |');

    const rows = [...map.matchAll(/^\| (\d)\. [^|]+\|([^|]*)\|([^|]*)\|\s*$/gm)];
    expect(rows).toHaveLength(4);
    expect(rows.map(r => Number(r[1]))).toEqual([1, 2, 3, 4]);
    for (const row of rows) {
      const targets = [...row[3].matchAll(/constellize-[a-z-]+:[a-z-]+/g)].map(m => m[0]);
      expect(targets).toEqual(expected[Number(row[1])]);
    }
  });
});

// Prose-versus-code drift found by the final whole-branch review. Positive assertions run
// against instructions(), so the BAD examples cannot satisfy them.
describe('final review fixes', () => {
  it('specify Phase 5 preserves the constellation map and implementation report on a revision', () => {
    const b = instructions('specify-feature');
    const phase5 = b.slice(b.indexOf('### Phase 5'), b.indexOf('### Phase 6'));
    expect(phase5).toMatch(/may hold two more[\s\S]{0,200}`## Constellation Map` and `## Implementation Report`/);
    expect(phase5).toMatch(/write both back \*\*unchanged\*\* after those two, in that order/);
    expect(phase5).toMatch(/nor the `## Constellation Map` or `## Implementation Report` of a revision/);
    expect(b).toMatch(/`## Constellation Map` and `## Implementation Report` sections are kept/);
  });

  it('implement report procedure does not claim unconditionally that the file ends with the map', () => {
    const b = instructions('implement-feature');
    expect(b).not.toMatch(/At this point the artifact ends with `## Constellation Map`/);
    expect(b).toMatch(/On a fresh run the artifact ends with `## Constellation Map`/);
    expect(b).toMatch(/On a revised artifact Phase 2's delegation replaced the map in place, mid-file/);
  });

  it.each(FEATURE_IDS)('%s never says the assessor returns the first unrecognised status line', (id) => {
    const b = instructions(id);
    expect(b).not.toMatch(/first\*\* `\*\*Status:\*\*` line in the file that is not inside a fenced code block/);
  });

  it('specify says the assessor reads the first recognised status line', () => {
    const b = instructions('specify-feature');
    expect(b).toMatch(/reads the \*\*first recognised\*\* `\*\*Status:\*\*` line in the file — one carrying `SPECIFIED`, `IMPLEMENTED` or `VERIFIED`/);
    expect(b).toMatch(/first recognised unfenced `\*\*Status:\*\*` line in the file \(one carrying `SPECIFIED`, `IMPLEMENTED` or `VERIFIED`\)/);
  });

  it.each(['implement-feature', 'verify-feature'])('%s rewrites the first recognised status line and gates on recognition', (id) => {
    const b = instructions(id);
    expect(b).toMatch(/Find the \*\*first recognised\*\* `\*\*Status:\*\*` line in the file — one carrying `SPECIFIED`, `IMPLEMENTED` or `VERIFIED`, not inside a fenced code block\. A line such as `\*\*Status:\*\* blocked on review` is skipped, not returned/);
    expect(b).toMatch(/no recognised `\*\*Status:\*\*` line outside a fenced block\*\* — none carrying `SPECIFIED`, `IMPLEMENTED` or `VERIFIED`, which includes one whose only status line carries some other value/);
  });

  it('verify gives a true reason for re-reading before the write', () => {
    const b = instructions('verify-feature');
    expect(b).not.toMatch(/a gate skill that writes anything of its own writes it into the same file/);
    expect(b).toMatch(/whole-file write into a file whose other sections belong to other skills, which the user may have touched between runs/);
  });

  // The Phase 1 read is the gate's own input, so an imprecise rule here reaches a state the
  // gate has no branch for: an unrecognised line first, with a recognised one below it.
  it.each(['implement-feature', 'verify-feature'])('%s reads the first RECOGNISED status line in Phase 1', (id) => {
    const b = instructions(id);
    const phase1 = b.slice(b.indexOf('Resolve the feature name'));
    expect(phase1.slice(0, 600)).toMatch(
      /read the artifact's \*\*first recognised\*\* `\*\*Status:\*\*` line — one carrying `SPECIFIED`, `IMPLEMENTED` or `VERIFIED`, not inside a fenced code block, which is the line the harness's assessor reads too\. A line such as `\*\*Status:\*\* blocked on review` is skipped, not returned/,
    );
    expect(b).not.toMatch(/read the artifact's \*\*first\*\* `\*\*Status:\*\*` line that is not inside a fenced code block/);
    expect(b).toMatch(/Rewrite the first recognised unfenced one in place/);
  });
});
