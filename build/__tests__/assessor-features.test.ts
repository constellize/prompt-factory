import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  assessLlmArtifacts,
  readDeclaredStatus,
  assessGateResults,
} from '../../content/literal/constellize-harness/scripts/tier1';

// The project-level tests write a real scratch llm/features/ and read it back
// through the assessor, so what is under test is the parsing of real artifacts on
// disk. The two parsers are also exercised directly, on text, at the end.

const created: string[] = [];

afterAll(() => {
  for (const root of created) rmSync(root, { recursive: true, force: true });
  created.length = 0;
});

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'assessor-features-'));
  created.push(root);
  return root;
}

/** A project whose `llm/features/` holds `files` and `dirs`. */
function project(files: Record<string, string> = {}, dirs: string[] = []): string {
  const root = tempRoot();
  const featuresDir = join(root, 'llm', 'features');
  mkdirSync(featuresDir, { recursive: true });
  for (const [name, body] of Object.entries(files)) {
    writeFileSync(join(featuresDir, name), body, 'utf8');
  }
  for (const dir of dirs) mkdirSync(join(featuresDir, dir));
  return root;
}

const features = (root: string) => assessLlmArtifacts(root).features;
const named = (root: string, name: string) =>
  features(root).features.find((f) => f.name === name)!;

const FENCE = '```';

const DEFAULT_THRESHOLD =
  '"threshold": { "source": "default", "branch": 80, "criticalLogic": 100, "errorPaths": 100, "integrationPoints": 100 }';

const DEFAULT_SURFACE =
  '"surface": { "operational": true, "deployment": false, "reason": "no deployment artifact changed" }';

const pass = (gate: number) =>
  `{ "gate": ${gate}, "required": true, "verdict": "PASS", "measured": "87% branch, 100% critical, 100% error paths", "at": "2026-11-05T09:06:00Z" }`;

/** Gate results carrying a verdict for every always-required gate. */
const COMPLETE_GATES = [
  '{',
  '  "schema": 1,',
  '  "feature": "example",',
  `  ${DEFAULT_THRESHOLD},`,
  '  "surface": { "operational": true, "deployment": false, "reason": "no deployment artifact changed" },',
  `  "gates": [${pass(1)}, ${pass(2)}, ${pass(4)}]`,
  '}',
].join('\n');

/** Gate results with a declared threshold and all required gates passing. */
const declaredThreshold = (fields: string) =>
  [
    '{',
    '  "schema": 1,',
    `  "threshold": { "source": "declared", ${fields} },`,
    '  "surface": { "operational": true, "deployment": false },',
    `  "gates": [${pass(1)}, ${pass(2)}, ${pass(4)}]`,
    '}',
  ].join('\n');

/** A feature artifact: an optional status line, prose, an optional gate-results block. */
function artifact(status: string | null, gateJson?: string): string {
  const lines = ['# Feature: example', ''];
  if (status !== null) lines.push(`**Status:** ${status}`, '');
  lines.push('Prose about the feature.', '');
  if (gateJson !== undefined) {
    lines.push('## Gate Results', '', `${FENCE}json`, gateJson, FENCE, '');
  }
  return lines.join('\n');
}

it('reads each of the three statuses', () => {
  const root = project({
    'specified.md': artifact('SPECIFIED'),
    'implemented.md': artifact('IMPLEMENTED'),
    'verified.md': artifact('VERIFIED', COMPLETE_GATES),
  });
  expect(named(root, 'specified').status).toBe('SPECIFIED');
  expect(named(root, 'implemented').status).toBe('IMPLEMENTED');
  expect(named(root, 'verified').status).toBe('VERIFIED');
});

it('reports a VERIFIED artifact with a complete block as VERIFIED, evidence complete', () => {
  const root = project({ 'rate-limiting.md': artifact('VERIFIED', COMPLETE_GATES) });
  expect(named(root, 'rate-limiting')).toEqual({
    name: 'rate-limiting',
    status: 'VERIFIED',
    evidence: 'complete',
    missingGates: [],
    failedGates: [],
  });
});

it('reports a VERIFIED artifact missing a required gate as "VERIFIED (unsubstantiated)"', () => {
  const gates = [
    '{',
    '  "schema": 1,',
    `  ${DEFAULT_THRESHOLD},`,
    `  ${DEFAULT_SURFACE},`,
    `  "gates": [${pass(1)}]`,
    '}',
  ].join('\n');
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED', gates) }), 'rate-limiting');
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
  expect(entry.evidence).toBe('incomplete');
  expect(entry.missingGates).toContain(4);
});

it('counts gate 3 as required when the surface determination says deployment, and not otherwise', () => {
  const withSurface = (deployment: boolean) =>
    [
      '{',
      '  "schema": 1,',
      `  ${DEFAULT_THRESHOLD},`,
      `  "surface": { "operational": true, "deployment": ${deployment} },`,
      `  "gates": [${pass(1)}, ${pass(2)}, ${pass(4)},`,
      '    { "gate": 3, "name": "Deployment readiness", "required": false, "verdict": "SKIPPED",',
      '      "skill": null, "measured": null, "threshold": null, "source": "surface determination" }]',
      '}',
    ].join('\n');
  const root = project({
    'deploys.md': artifact('VERIFIED', withSurface(true)),
    'no-deploy.md': artifact('VERIFIED', withSurface(false)),
  });
  expect(named(root, 'deploys').missingGates).toEqual([3]);
  expect(named(root, 'deploys').status).toBe('VERIFIED (unsubstantiated)');
  expect(named(root, 'no-deploy').missingGates).toEqual([]);
  expect(named(root, 'no-deploy').status).toBe('VERIFIED');
});

it('treats a required gate recorded as SKIPPED as carrying no verdict', () => {
  const gates = [
    '{',
    '  "schema": 1,',
    `  ${DEFAULT_THRESHOLD},`,
    `  ${DEFAULT_SURFACE},`,
    `  "gates": [${pass(1)}, ${pass(2)},`,
    '    { "gate": 4, "name": "Maintainability in context", "required": true, "verdict": "SKIPPED" }]',
    '}',
  ].join('\n');
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED', gates) }), 'rate-limiting');
  expect(entry.missingGates).toEqual([4]);
  expect(entry.failedGates).toEqual([]); // SKIPPED is an absent verdict, not a failing one
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
});

it('reports a required gate recorded FAIL in failedGates, not in missingGates', () => {
  const gates = [
    '{',
    '  "schema": 1,',
    `  ${DEFAULT_THRESHOLD},`,
    `  ${DEFAULT_SURFACE},`,
    '  "gates": [',
    '    { "gate": 1, "name": "Test integrity", "required": true, "verdict": "FAIL",',
    '      "measured": "18% branch", "threshold": "80/100/100/100" },',
    `    ${pass(2)}, ${pass(4)}]`,
    '}',
  ].join('\n');
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED', gates) }), 'rate-limiting');
  expect(entry.failedGates).toEqual([1]);
  expect(entry.missingGates).toEqual([]); // the verdict is present, so it is not missing
  expect(entry.evidence).toBe('incomplete');
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
});

it('treats an unrecognised verdict on a required gate as not a pass', () => {
  const gates = [
    '{',
    '  "schema": 1,',
    `  ${DEFAULT_THRESHOLD},`,
    `  ${DEFAULT_SURFACE},`,
    '  "gates": [',
    '    { "gate": 1, "name": "Test integrity", "required": true, "verdict": "PARTIAL" },',
    `    ${pass(2)}, ${pass(4)}]`,
    '}',
  ].join('\n');
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED', gates) }), 'rate-limiting');
  expect(entry.failedGates).toEqual([1]);
  expect(entry.missingGates).toEqual([]);
  expect(entry.evidence).toBe('incomplete');
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
});

it('does not report a gate that was not required as failed', () => {
  const gates = [
    '{',
    '  "schema": 1,',
    `  ${DEFAULT_THRESHOLD},`,
    `  ${DEFAULT_SURFACE},`,
    `  "gates": [${pass(1)}, ${pass(2)}, ${pass(4)},`,
    '    { "gate": 3, "name": "Deployment readiness", "required": false, "verdict": "FAIL" }]',
    '}',
  ].join('\n');
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED', gates) }), 'rate-limiting');
  expect(entry.failedGates).toEqual([]);
  expect(entry.missingGates).toEqual([]);
  expect(entry.evidence).toBe('complete');
  expect(entry.status).toBe('VERIFIED');
});

it('reads an all-PASS block as complete, with both gate lists empty', () => {
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED', COMPLETE_GATES) }), 'rate-limiting');
  expect(entry.missingGates).toEqual([]);
  expect(entry.failedGates).toEqual([]);
  expect(entry.evidence).toBe('complete');
  expect(entry.status).toBe('VERIFIED');
});

it('reports a VERIFIED artifact with no gate-results block as "VERIFIED (unsubstantiated)", evidence absent', () => {
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED') }), 'rate-limiting');
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
  expect(entry.evidence).toBe('absent');
  expect(entry.missingGates).toEqual([]);
  expect(entry.failedGates).toEqual([]);
});

// Review Focus 2
it('reports malformed JSON as "VERIFIED (unsubstantiated)", evidence malformed, and does not throw', () => {
  const root = project({
    'truncated.md': artifact('VERIFIED', '{ "schema": 1, "gates": [ '),
    'not-an-object.md': artifact('VERIFIED', '"just a string"'),
    'healthy.md': artifact('VERIFIED', COMPLETE_GATES),
  });
  expect(() => assessLlmArtifacts(root)).not.toThrow();
  for (const name of ['truncated', 'not-an-object']) {
    expect(named(root, name).status).toBe('VERIFIED (unsubstantiated)');
    expect(named(root, name).evidence).toBe('malformed');
    expect(named(root, name).missingGates).toEqual([]);
    expect(named(root, name).failedGates).toEqual([]);
  }
  // and the rest of the project is still assessed
  expect(named(root, 'healthy').status).toBe('VERIFIED');
  expect(features(root).count).toBe(3);
});

// Review Focus 3
it('ignores a status line inside a fenced code block and reads the real one', () => {
  const body = [
    '# Feature: example',
    '',
    '**Status:** IMPLEMENTED',
    '',
    'A fresh spec looks like this:',
    '',
    `${FENCE}markdown`,
    '# Feature: <name>',
    '',
    '**Status:** SPECIFIED',
    FENCE,
    '',
  ].join('\n');
  expect(named(project({ 'rate-limiting.md': body }), 'rate-limiting').status).toBe('IMPLEMENTED');
});

it('reports status "unknown" when there is no status line outside a fence', () => {
  const body = [
    '# Feature template',
    '',
    'Copy the block below into a new artifact:',
    '',
    `${FENCE}markdown`,
    '**Status:** SPECIFIED',
    FENCE,
    '',
  ].join('\n');
  const entry = named(project({ 'template.md': body }), 'template');
  expect(entry.status).toBe('unknown');
  expect(entry.evidence).toBe('absent');
});

it('takes the first status line when an artifact carries two', () => {
  const body = [
    '# Feature: example',
    '',
    '**Status:** IMPLEMENTED',
    '',
    'An earlier revision said:',
    '',
    '**Status:** SPECIFIED',
    '',
  ].join('\n');
  expect(named(project({ 'rate-limiting.md': body }), 'rate-limiting').status).toBe('IMPLEMENTED');
});

// Review Focus 4
it('reports a non-feature .md (a README with no status) as unknown rather than counting it silently', () => {
  const root = project({
    'README.md': '# Features\n\nScratch notes about what lives in this directory.\n',
  });
  expect(features(root).features).toEqual([
    { name: 'README', status: 'unknown', evidence: 'absent', missingGates: [], failedGates: [] },
  ]);
  expect(features(root).count).toBe(1);
});

it('still reports a pre-2.0 directory entry, so an existing project does not lose its count', () => {
  const root = project({ 'rate-limiting.md': artifact('SPECIFIED') }, ['legacy-feature']);
  expect(features(root).count).toBe(2);
  expect(features(root).entries).toContain('legacy-feature');
  expect(named(root, 'legacy-feature')).toEqual({
    name: 'legacy-feature',
    status: 'unknown',
    evidence: 'absent',
    missingGates: [],
    failedGates: [],
  });
});

it('leaves entries[] as the names, unchanged in shape', () => {
  const root = project({ 'alpha.md': artifact('SPECIFIED'), 'notes.txt': 'not a feature' }, ['beta']);
  const state = features(root);
  expect([...state.entries].sort()).toEqual(['alpha', 'beta']);
  expect(state.entries.every((e) => typeof e === 'string')).toBe(true);
  expect(state.entries).toHaveLength(state.count);
  expect([...state.features.map((f) => f.name)].sort()).toEqual([...state.entries].sort());
});

it('does not throw when llm/features/ is absent', () => {
  const root = tempRoot();
  expect(() => assessLlmArtifacts(root)).not.toThrow();
  expect(features(root)).toEqual({ count: 0, entries: [], features: [] });
});

// Review Focus 1
it('refuses a declared threshold looser than the default, and accepts a stricter one', () => {
  const root = project({
    'loose-branch.md': artifact(
      'VERIFIED',
      declaredThreshold('"branch": 50, "criticalLogic": 100, "errorPaths": 100, "integrationPoints": 100'),
    ),
    'loose-error-paths.md': artifact(
      'VERIFIED',
      declaredThreshold('"branch": 80, "criticalLogic": 100, "errorPaths": 50, "integrationPoints": 100'),
    ),
    'stricter.md': artifact(
      'VERIFIED',
      declaredThreshold('"branch": 100, "criticalLogic": 100, "errorPaths": 100, "integrationPoints": 100'),
    ),
  });
  for (const name of ['loose-branch', 'loose-error-paths']) {
    expect(named(root, name).status).toBe('VERIFIED (unsubstantiated)');
    expect(named(root, name).evidence).toBe('incomplete');
  }
  expect(named(root, 'stricter').status).toBe('VERIFIED');
  expect(named(root, 'stricter').evidence).toBe('complete');
});

// Review Focus 1, continued: the floor cannot be escaped by relabelling the source.
it('refuses a threshold looser than the default even when it is labelled "default"', () => {
  const gates = [
    '{',
    '  "schema": 1,',
    '  "threshold": { "source": "default", "branch": 50, "criticalLogic": 100, "errorPaths": 100, "integrationPoints": 100 },',
    '  "surface": { "operational": true, "deployment": false },',
    `  "gates": [${pass(1)}, ${pass(2)}, ${pass(4)}]`,
    '}',
  ].join('\n');
  const entry = named(project({ 'relabelled.md': artifact('VERIFIED', gates) }), 'relabelled');
  expect(entry.evidence).toBe('incomplete');
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
  expect(entry.missingGates).toEqual([]);
});

// ---------------------------------------------------------------------------
// readDeclaredStatus — the fence machine, exercised directly on text
// ---------------------------------------------------------------------------

describe('readDeclaredStatus', () => {
  it('skips a tilde fence', () => {
    const text = ['# Feature template', '', '~~~markdown', '**Status:** SPECIFIED', '~~~', ''].join('\n');
    expect(readDeclaredStatus(text)).toBeNull();
  });

  it('skips a four-backtick fence whose content includes a three-backtick line', () => {
    const text = [
      '# Feature template',
      '',
      '````markdown',
      '```json',
      '{ "schema": 1 }',
      '```',
      '',
      '**Status:** SPECIFIED',
      '````',
      '',
    ].join('\n');
    expect(readDeclaredStatus(text)).toBeNull();
  });

  it('does not close a fence on a line that carries an info string', () => {
    // CommonMark forbids an info string on a closing fence, so the ```json line is
    // content: the outer fence stays open and the status line in it stays hidden.
    const text = ['# Feature template', '', '```markdown', '```json', '**Status:** SPECIFIED', '```', ''].join('\n');
    expect(readDeclaredStatus(text)).toBeNull();
  });

  it('closes a fence on a bare marker, so text after it is read', () => {
    const text = ['```markdown', '**Status:** SPECIFIED', '```', '', '**Status:** IMPLEMENTED', ''].join('\n');
    expect(readDeclaredStatus(text)).toBe('IMPLEMENTED');
  });

  it('skips a fence indented by up to three spaces', () => {
    const text = ['# Feature template', '', '   ```markdown', '   **Status:** SPECIFIED', '   ```', ''].join('\n');
    expect(readDeclaredStatus(text)).toBeNull();
  });

  it('treats an unclosed fence as open to the end of the file', () => {
    // Conservative on purpose: an artifact that opens a fence and never closes it
    // hides the rest of itself, which reports `unknown` rather than reading a
    // status out of what the author marked as an example.
    const text = ['# Feature template', '', '```markdown', '**Status:** SPECIFIED', ''].join('\n');
    expect(readDeclaredStatus(text)).toBeNull();
  });

  it('reads a status line written with CRLF line endings', () => {
    expect(readDeclaredStatus('# Feature: example\r\n\r\n**Status:** IMPLEMENTED\r\n')).toBe('IMPLEMENTED');
  });

  it('reads the status from a CRLF file whose example fence hides another', () => {
    const text = '# Feature: example\r\n\r\n**Status:** IMPLEMENTED\r\n\r\n```markdown\r\n**Status:** SPECIFIED\r\n```\r\n';
    expect(readDeclaredStatus(text)).toBe('IMPLEMENTED');
  });
});

// ---------------------------------------------------------------------------
// assessGateResults — which section the evidence is read from
// ---------------------------------------------------------------------------

const gateResultsSection = (json: string) => ['## Gate Results', '', '```json', json, '```', ''].join('\n');

describe('assessGateResults', () => {
  it('reads the block in its own section as evidence', () => {
    expect(assessGateResults(`# Feature: example\n\n${gateResultsSection(COMPLETE_GATES)}`)).toEqual({
      evidence: 'complete',
      missingGates: [],
      failedGates: [],
    });
  });

  it('ignores a gate-results block that is only a fenced example', () => {
    const text = [
      '# Feature: example',
      '',
      'The verify skill writes a section like this one:',
      '',
      '````markdown',
      gateResultsSection(COMPLETE_GATES),
      '````',
      '',
    ].join('\n');
    expect(assessGateResults(text).evidence).toBe('absent');
  });

  it('does not reach past the end of the section for a json fence', () => {
    const text = [
      '# Feature: example',
      '',
      '## Gate Results',
      '',
      'The gates have not been run yet.',
      '',
      '## Appendix',
      '',
      '```json',
      COMPLETE_GATES,
      '```',
      '',
    ].join('\n');
    expect(assessGateResults(text).evidence).toBe('absent');
  });

  it('reads the first json fence in the section, past a fence that is not json', () => {
    const text = [
      '# Feature: example',
      '',
      '## Gate Results',
      '',
      '```text',
      'the command that was run',
      '```',
      '',
      '```json',
      COMPLETE_GATES,
      '```',
      '',
    ].join('\n');
    expect(assessGateResults(text).evidence).toBe('complete');
  });

  it('reports two gate-results sections as malformed', () => {
    const text = [
      '# Feature: example',
      '',
      gateResultsSection(COMPLETE_GATES),
      '',
      gateResultsSection(COMPLETE_GATES),
    ].join('\n');
    expect(assessGateResults(text).evidence).toBe('malformed');
  });

  it('keeps a deeper heading inside the section', () => {
    const text = [
      '# Feature: example',
      '',
      '## Gate Results',
      '',
      '### Gate 1',
      '',
      '```json',
      COMPLETE_GATES,
      '```',
      '',
    ].join('\n');
    expect(assessGateResults(text).evidence).toBe('complete');
  });
});

it('reports a VERIFIED artifact that only quotes the template example as unsubstantiated', () => {
  const body = [
    '# Feature: example',
    '',
    '**Status:** VERIFIED',
    '',
    'The verify skill writes a section like this one:',
    '',
    '````markdown',
    gateResultsSection(COMPLETE_GATES),
    '````',
    '',
  ].join('\n');
  const entry = named(project({ 'quoted.md': body }), 'quoted');
  expect(entry.evidence).toBe('absent');
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
});

// ---------------------------------------------------------------------------
// assessGateResults — the schema's mandatory shape
// ---------------------------------------------------------------------------

describe('a block that does not record the schema has not substantiated anything', () => {
  /** A record whose gates all pass, so only the member under test decides the verdict. */
  const allPassWith = (members: string[], gates = `${pass(1)}, ${pass(2)}, ${pass(4)}`) =>
    `# Feature: example\n\n` +
    gateResultsSection(['{', ...members.map((m) => `  ${m},`), `  "gates": [${gates}]`, '}'].join('\n'));

  it('reads the fully recorded block as complete, so the tightenings are not blanket refusals', () => {
    expect(assessGateResults(allPassWith(['"schema": 1', DEFAULT_THRESHOLD, DEFAULT_SURFACE]))).toEqual({
      evidence: 'complete',
      missingGates: [],
      failedGates: [],
    });
  });

  it('refuses a block with no threshold at all', () => {
    expect(assessGateResults(allPassWith(['"schema": 1', DEFAULT_SURFACE])).evidence).toBe('incomplete');
  });

  it('refuses a threshold that records no numbers', () => {
    expect(
      assessGateResults(allPassWith(['"schema": 1', '"threshold": { "source": "default" }', DEFAULT_SURFACE]))
        .evidence,
    ).toBe('incomplete');
  });

  it('refuses a threshold whose numbers are not numbers', () => {
    const threshold =
      '"threshold": { "source": "default", "branch": "80", "criticalLogic": 100, "errorPaths": 100, "integrationPoints": 100 }';
    expect(assessGateResults(allPassWith(['"schema": 1', threshold, DEFAULT_SURFACE])).evidence).toBe(
      'incomplete',
    );
  });

  it('refuses a threshold that omits one of the four dimensions', () => {
    const threshold = '"threshold": { "source": "default", "branch": 80, "errorPaths": 100, "integrationPoints": 100 }';
    expect(assessGateResults(allPassWith(['"schema": 1', threshold, DEFAULT_SURFACE])).evidence).toBe(
      'incomplete',
    );
  });

  it('refuses a block with no surface determination, since gate 3 follows it', () => {
    expect(assessGateResults(allPassWith(['"schema": 1', DEFAULT_THRESHOLD])).evidence).toBe('incomplete');
  });

  it('refuses a surface that does not say whether there is a deployment surface', () => {
    const surface = '"surface": { "operational": true, "reason": "adds a cache dependency" }';
    expect(assessGateResults(allPassWith(['"schema": 1', DEFAULT_THRESHOLD, surface])).evidence).toBe(
      'incomplete',
    );
  });

  it('refuses a surface whose deployment is not a boolean', () => {
    const surface = '"surface": { "operational": true, "deployment": "no" }';
    expect(assessGateResults(allPassWith(['"schema": 1', DEFAULT_THRESHOLD, surface])).evidence).toBe(
      'incomplete',
    );
  });

  it('reports a schema it does not know as malformed', () => {
    expect(assessGateResults(allPassWith(['"schema": 2', DEFAULT_THRESHOLD, DEFAULT_SURFACE])).evidence).toBe(
      'malformed',
    );
  });

  it('reports a repeated gate number as malformed, so a second entry cannot launder a FAIL', () => {
    const gates =
      '{ "gate": 1, "required": true, "verdict": "FAIL" }, { "gate": 1, "verdict": "PASS" }, ' +
      `${pass(2)}, ${pass(4)}`;
    expect(
      assessGateResults(allPassWith(['"schema": 1', DEFAULT_THRESHOLD, DEFAULT_SURFACE], gates)).evidence,
    ).toBe('malformed');
  });

  it('ignores a gate entry whose number is not a positive integer', () => {
    const gates =
      `${pass(1)}, ${pass(2)}, ${pass(4)}, ` +
      '{ "gate": 1.5, "required": true, "verdict": "FAIL" }, ' +
      '{ "gate": -1, "required": true, "verdict": "FAIL" }, ' +
      '{ "gate": 0, "required": true, "verdict": "FAIL" }';
    expect(
      assessGateResults(allPassWith(['"schema": 1', DEFAULT_THRESHOLD, DEFAULT_SURFACE], gates)),
    ).toEqual({ evidence: 'complete', missingGates: [], failedGates: [] });
  });
});
