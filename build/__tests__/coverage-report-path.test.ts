import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { generatePlugin } from '../generate-marketplace';
import { loadPersonas, loadPluginsConfig, loadPrompts } from '../lib/parser';

// Acceptance 6 of project 2 came back SPLIT because this skill, delegated by
// `constellize-feature:verify` with no positional arguments, wrote its report to
// `llm/construction/quality/coverage-report-$0.md` in 7 of 12 live verify runs --
// once as `coverage-report-expand-codes:.md`, with a colon in the filename.
//
// These assertions run against the real generated SKILL.md, because `$0` is the
// generated form of `{{component_name}}` and the undefined path only exists there.
//
// 2026-11-11: the 2026-11-09 fix pointed every argument-less run at ONE fixed filename,
// which acceptance 6 then failed on its second clause -- "two features never share an
// artifact path" (spec §6.6b). Two features verified in one project both wrote
// `llm/construction/quality/coverage-report.md`, so the second erased the evidence the
// first was verified on. Three live runs refused the rule rather than destroy evidence,
// each inventing its own filename, which made the evidence path non-deterministic too.
// The fix mirrors the sibling `constellize-design:code-generation-plan`: a per-subject
// slug taken from the argument or from what the caller described inline, with the fixed
// path kept only for the case where nothing at all can be named. `verify` now also
// SUPPLIES the feature name, so the common path is deterministic rather than inferred.

const CRAFT = 'constellize:craft';
const PROMPT_ID = 'validate-test-coverage';
const SKILL = path.join('plugins', 'constellize-craft', 'skills', 'test-coverage', 'SKILL.md');

let skill: string;
let out: string;

beforeAll(() => {
  out = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-report-path-'));
  const plugins = loadPluginsConfig('content').plugins;
  const craft = plugins.find(p => p.id === CRAFT)!;
  generatePlugin(craft, loadPrompts('content'), loadPersonas('content'), plugins, out, 'content');
  skill = fs.readFileSync(path.join(out, SKILL), 'utf-8');
});

afterAll(() => {
  fs.rmSync(out, { recursive: true, force: true });
});

describe('the generated test-coverage skill names a defined report path', () => {
  it('names a fixed report path that carries no argument placeholder', () => {
    expect(skill).toContain('`llm/construction/quality/coverage-report.md`');
    expect('llm/construction/quality/coverage-report.md').not.toMatch(/\$/);
  });

  it('reaches the fixed path only when nothing at all can be named', () => {
    expect(skill).toMatch(
      /Only when no component or feature can be identified at all does the report go to the fixed path `llm\/construction\/quality\/coverage-report\.md`/
    );
    // The rule that failed acceptance 6: the fixed path as the ORDINARY outcome of a
    // delegated run. It must not come back in any form.
    expect(skill).not.toMatch(/When no component name was supplied the slug is empty/);
    expect(skill).not.toMatch(/That is the ordinary case when another skill delegates to this one/);
  });

  it('takes the name from the inline description when no argument was supplied', () => {
    expect(skill).toMatch(
      /otherwise from \*\*the component or feature the caller described inline\*\*/
    );
    // The mechanism, stated correctly: an unsupplied placeholder stays literal. A delegated
    // skill CAN be given positionals -- the Skill tool takes an args parameter -- so the old
    // wording ("receives no positional arguments at all") was false and must not come back.
    expect(skill).toMatch(
      /an indexed placeholder that receives no argument stays in the text literally/
    );
    expect(skill).toMatch(/means no name arrived, not that there is nothing to name/);
    expect(skill).not.toMatch(/receives no positional arguments at all/);
  });

  // The clause acceptance 6 exists to enforce, in the words of §6.6b.
  it('keeps one report per subject, and forbids one feature overwriting another', () => {
    expect(skill).toMatch(/One report per subject is the point of the per-subject filename/);
    expect(skill).toMatch(
      /two features must never slug to the same name, and a report must never overwrite another feature's/
    );
  });

  it('forbids the literal argument placeholder in the report filename', () => {
    expect(skill).toContain('Never write a report whose filename contains a literal `\\$0`');
    expect(skill).toMatch(/a `\$` followed by a digit/);
  });

  // The defect this guards: `$N` is substituted even inside a backtick code span, so an
  // UNESCAPED `$0` here reached the model as the component's real name, making the sentence
  // forbid the very filename the slug rule requires. The escape is a single backslash.
  it('escapes the placeholder it names, so the sentence survives substitution', () => {
    expect(skill).toContain('a literal `\\$0`');
    expect(skill).not.toContain('a literal `$0`');
  });

  it('treats prose passed where a component name belongs as a fragment', () => {
    expect(skill).toMatch(/Arguments are split on whitespace/);
    expect(skill).toMatch(/prefer what the caller described inline/);
    expect(skill).not.toMatch(/treat it as absent and use the fixed path/);
  });

  it('forbids the stray characters that produced coverage-report-expand-codes:.md', () => {
    expect(skill).toMatch(/or any character the slug rule removes — a colon, for instance/);
  });

  it('states the slug rule the component name is reduced by', () => {
    expect(skill).toMatch(
      /every character that is not a letter, a digit or a hyphen replaced by a hyphen and any leading or trailing hyphens removed/
    );
  });

  // The output format is the section a model writing the report reads last, and in the
  // live runs it is the instruction the report path came from. It must carry both paths
  // on its own, not defer the fixed one to a block further up.
  it('names both paths in the output-format instruction, not only in the context block', () => {
    const outputFormat = skill.slice(skill.indexOf('<output-format>'), skill.indexOf('</output-format>'));
    expect(outputFormat).toContain('`llm/construction/quality/coverage-report-<slug>.md`');
    expect(outputFormat).toMatch(
      /or `llm\/construction\/quality\/coverage-report\.md` only when none can be identified at all/
    );
  });

  it('states the per-subject path in the context block as the default', () => {
    expect(skill).toContain(
      'And outputs coverage report to `llm/construction/quality/coverage-report-<slug>.md`'
    );
  });

  // The shape that produced the defect: a documented path with the placeholder still in it.
  // 7 of 12 live runs copied it verbatim. It must not survive anywhere in the skill.
  it('never documents the report path with the placeholder still in it', () => {
    expect(skill).not.toContain('coverage-report-$0.md');
    expect(skill).not.toMatch(/coverage-report-\$\d/);
  });
});

describe('the sentence the printed book quotes', () => {
  // book/ch4.md:50 carries this threshold sentence, lower-cased, from this prompt's
  // `outputs.book.preview`. A typesetting round is in flight, so neither the preview
  // nor the body sentence it tracks may move while fixing the report path.
  const THRESHOLDS =
    'Test coverage validation ensures your tests actually verify behavior. ' +
    'Minimum thresholds: 80% branch coverage overall, 100% coverage of CRITICAL business logic, ' +
    '100% of error paths. Coverage is necessary but NOT sufficient—you must also validate test quality.';

  it('is still line 14 of the generated skill, byte for byte', () => {
    expect(skill.split('\n')[13]).toBe(THRESHOLDS);
  });

  it('is still the book preview the chapter quotes', () => {
    const prompt = loadPrompts('content').find(p => p.frontmatter.id === PROMPT_ID)!;
    expect(prompt.frontmatter.outputs!.book!.preview!.trim()).toBe(
      '"...minimum thresholds: 80% branch coverage overall, 100% coverage of critical business logic, 100% of error paths..."'
    );
  });
});

// `constellize-design:code-generation-plan` has the same shape of defect: its output path
// interpolates `{{gap_to_implement}}` (`$1` once generated), and `implement-feature.md:78`
// hands it the gap *inline* while taking no `output_path`. Not observed failing in the
// 2026-11-06 acceptance runs, but it is the same cause. Fixed 2026-11-09.
//
// The fix here is NOT the fixed name `test-coverage` got: this skill is invoked once per gap
// and each plan is read back, so collapsing every argument-less run onto one filename would
// make gaps overwrite each other. The slug comes from the gap however it was supplied.

describe('the generated code-generation-plan skill names a defined plan path', () => {
  const DESIGN = 'constellize:design';
  const PLAN = path.join('plugins', 'constellize-design', 'skills', 'code-generation-plan', 'SKILL.md');

  let plan: string;
  let planOut: string;

  beforeAll(() => {
    planOut = fs.mkdtempSync(path.join(os.tmpdir(), 'plan-path-'));
    const plugins = loadPluginsConfig('content').plugins;
    const design = plugins.find(p => p.id === DESIGN)!;
    generatePlugin(design, loadPrompts('content'), loadPersonas('content'), plugins, planOut, 'content');
    plan = fs.readFileSync(path.join(planOut, PLAN), 'utf-8');
  });

  afterAll(() => {
    fs.rmSync(planOut, { recursive: true, force: true });
  });

  it('no longer names the raw interpolated path as the output format', () => {
    expect(plan).not.toContain('Format your output as `llm/construction/design/code-generation-plan-$1.md`');
  });

  it('names the slug form as the output path', () => {
    expect(plan).toMatch(
      /Format your output as `llm\/construction\/design\/code-generation-plan-<slug>\.md`, where `<slug>` names/
    );
  });

  it('takes the gap name from the inline description when no argument was supplied', () => {
    expect(plan).toMatch(/otherwise from \*\*the gap the caller described inline\*\*/);
    expect(plan).toMatch(
      /a skill reached by delegation may or may not be given that argument/
    );
    expect(plan).toMatch(/means no gap name arrived, not that there is no gap/);
    expect(plan).not.toMatch(/receives no positional arguments at all/);
  });

  // The guard that matters most: the per-gap behaviour spec §6.6b requires must survive the fix.
  it('keeps one plan per gap, and forbids one gap overwriting another', () => {
    expect(plan).toMatch(/One plan per gap is the point of the per-gap filename/);
    expect(plan).toMatch(
      /two gaps must never slug to the same name, and a plan must never overwrite another gap's/
    );
  });

  it('falls back to a fixed path only when no gap can be identified at all', () => {
    expect(plan).toMatch(
      /Only when no gap can be identified at all does the plan go to the fixed path `llm\/construction\/design\/code-generation-plan\.md`/
    );
  });

  it('forbids the literal argument placeholder in the plan filename', () => {
    expect(plan).toContain('Never write a filename containing a literal `\\$1`');
    expect(plan).toMatch(/a `\$` followed by a digit/);
  });

  // Same defect as on the craft side: unescaped, this named the gap's real name and inverted
  // the slug rule. Both places that NAME a placeholder must escape it; places that USE its
  // value must not.
  it('escapes both placeholders it names, so neither sentence inverts its own rule', () => {
    expect(plan).toContain('a literal `\\$1`');
    expect(plan).not.toContain('a literal `$1`');
    expect(plan).toContain('Take the gap name from the `\\$1` argument when one was supplied');
  });

  it('treats prose passed where the gap name belongs as a fragment', () => {
    expect(plan).toMatch(/Arguments are split on whitespace/);
    expect(plan).toMatch(/prefer the gap the caller described inline/);
  });

  // The fallback name is the assessor's existing contract, not a new convention:
  // tier1.ts accepts `code-generation-plan.md` OR `code-generation-plan-*.md`.
  it('uses a fallback name the harness assessor already accepts', () => {
    const tier1 = fs.readFileSync(
      path.join('content', 'literal', 'constellize-harness', 'scripts', 'tier1.ts'),
      'utf-8'
    );
    expect(tier1).toContain('f === "code-generation-plan.md" || /^code-generation-plan-.+\\.md$/.test(f)');
  });
});

describe('the sentences the printed book quotes from code-generation-plan', () => {
  // book/ch3.md:335 quotes this prompt's `outputs.book.preview` verbatim, and that preview
  // contains the literal `{{gap_to_implement}}` and `{{system_name}}` placeholders. The body
  // sentence it excerpts is the prompt's opening line. A typesetting round is in flight, so
  // the report-path fix must leave both exactly where they are.
  const prompt = () => loadPrompts('content').find(p => p.frontmatter.id === 'code-generation-plan')!;

  it('keeps the book preview byte-identical, placeholders included', () => {
    expect(prompt().frontmatter.outputs!.book!.preview!.trim()).toBe(
      '"Create a detailed implementation plan for \\"{{gap_to_implement}}\\" in {{system_name}} that is shaped by constellation context, not generic patterns. When filling gaps, AI-assisted development works best with a detailed plan that bridges design and code..."'
    );
  });

  it('keeps the body sentence the preview excerpts', () => {
    expect(prompt().content).toContain(
      'Create a detailed implementation plan for "{{gap_to_implement}}" in {{system_name}} that is shaped by constellation context, not generic patterns.'
    );
  });
});

// The determinism half of the fix. Inline derivation alone leaves the filename to the
// delegate's judgement, and three live runs picked three different names for the same
// report -- the fixture's own progress.md ended up citing two of them. `verify` knows the
// feature name (it resolved `llm/features/<name>.md` in Phase 1), so it passes it, and the
// per-feature path becomes a consequence of the call rather than an inference about it.
describe('constellize-feature:verify supplies the name the report path is built from', () => {
  const FEATURE = 'constellize:feature';
  const VERIFY = path.join('plugins', 'constellize-feature', 'skills', 'verify', 'SKILL.md');

  let verify: string;
  let verifyOut: string;

  beforeAll(() => {
    verifyOut = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-path-'));
    const plugins = loadPluginsConfig('content').plugins;
    const feature = plugins.find(p => p.id === FEATURE)!;
    generatePlugin(feature, loadPrompts('content'), loadPersonas('content'), plugins, verifyOut, 'content');
    verify = fs.readFileSync(path.join(verifyOut, VERIFY), 'utf-8');
  });

  afterAll(() => {
    fs.rmSync(verifyOut, { recursive: true, force: true });
  });

  it('passes the feature name as the first argument of the gate 1 delegation', () => {
    expect(verify).toMatch(
      /Invoke `constellize-craft:test-coverage`, \*\*passing the feature name as its first argument\*\*/
    );
  });

  it('says what the argument is for, so a later edit cannot drop it as decoration', () => {
    expect(verify).toMatch(/keeps the report it writes at a per-feature path/);
    expect(verify).toMatch(
      /two features verified in one project would otherwise write the same report and overwrite each other's evidence/
    );
  });

  // Gate 1 still consumes the verdict rather than re-measuring: the argument changes where
  // the delegate WRITES, not who measures.
  it('still delegates the measurement rather than taking it over', () => {
    expect(verify).toMatch(
      /Gate 1 consumes that verdict; it never runs a coverage command of its own/
    );
  });
});
