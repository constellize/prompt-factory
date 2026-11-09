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
