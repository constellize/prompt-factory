import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { assessLlmArtifacts } from '../../content/literal/constellize-harness/scripts/tier1';

// Every test writes a real scratch llm/features/ and reads it back through the
// assessor, so what is under test is the parsing of real artifacts on disk.

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
  });
});

it('reports a VERIFIED artifact missing a required gate as "VERIFIED (unsubstantiated)"', () => {
  const gates = [
    '{',
    '  "schema": 1,',
    `  ${DEFAULT_THRESHOLD},`,
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
    `  "gates": [${pass(1)}, ${pass(2)},`,
    '    { "gate": 4, "name": "Maintainability in context", "required": true, "verdict": "SKIPPED" }]',
    '}',
  ].join('\n');
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED', gates) }), 'rate-limiting');
  expect(entry.missingGates).toEqual([4]);
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
});

it('reports a VERIFIED artifact with no gate-results block as "VERIFIED (unsubstantiated)", evidence absent', () => {
  const entry = named(project({ 'rate-limiting.md': artifact('VERIFIED') }), 'rate-limiting');
  expect(entry.status).toBe('VERIFIED (unsubstantiated)');
  expect(entry.evidence).toBe('absent');
  expect(entry.missingGates).toEqual([]);
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
    { name: 'README', status: 'unknown', evidence: 'absent', missingGates: [] },
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
