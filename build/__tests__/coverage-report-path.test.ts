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

  it('says the fixed path is for when no component name was supplied', () => {
    expect(skill).toMatch(
      /When no component name was supplied the slug is empty, and the report goes to the fixed path `llm\/construction\/quality\/coverage-report\.md`/
    );
  });

  it('explains why a delegated run has no component name, so the rule is not arbitrary', () => {
    expect(skill).toMatch(
      /a delegated skill is invoked by name and receives no positional arguments at all/
    );
  });

  it('forbids the literal argument placeholder in the report filename', () => {
    expect(skill).toMatch(
      /Never write a report whose filename contains a literal `\$0`, a `\$` followed by a digit/
    );
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
    expect(outputFormat).toContain('`llm/construction/quality/coverage-report-$0.md`');
    expect(outputFormat).toMatch(
      /or `llm\/construction\/quality\/coverage-report\.md` when no component name was supplied/
    );
  });

  // The default path is unchanged: a caller that does supply a component still gets
  // the per-component report it got before the fix.
  it('keeps the per-component default path for a caller that supplies one', () => {
    expect(skill).toContain(
      'And outputs coverage report to `llm/construction/quality/coverage-report-$0.md`'
    );
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
      /a delegated skill is invoked by name and receives no positional arguments at all, so an absent argument does not mean an absent gap/
    );
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
    expect(plan).toMatch(
      /Never write a filename containing a literal `\$1`, a `\$` followed by a digit/
    );
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
