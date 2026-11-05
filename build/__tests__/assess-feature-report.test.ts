import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { execFileSync } from 'child_process';

// The acceptance-11 fixture: a real scratch project whose llm/features/ holds one
// artifact per case, run through the shipped assess.mjs. The rendering itself is
// prose in the skill, so what is tested here is (a) the JSON the skill renders from
// carries each case correctly, and (b) the skill tells the renderer how to treat
// each evidence class.

const HARNESS = join(__dirname, '..', '..', 'content', 'literal', 'constellize-harness');
const ASSESS = join(HARNESS, 'scripts', 'assess.mjs');
const SKILL = join(HARNESS, 'skills', 'assess', 'SKILL.md');

const created: string[] = [];
afterAll(() => {
  for (const root of created) rmSync(root, { recursive: true, force: true });
  created.length = 0;
});

const FENCE = '```';
const gate = (n: number, verdict = 'PASS') =>
  `{ "gate": ${n}, "required": true, "verdict": "${verdict}", "measured": "m", "at": "2026-11-05T09:06:00Z" }`;
const gates = (list: string[]) =>
  [
    '{',
    '  "schema": 1,',
    '  "threshold": { "source": "default", "branch": 80, "criticalLogic": 100, "errorPaths": 100, "integrationPoints": 100 },',
    '  "surface": { "operational": true, "deployment": false },',
    `  "gates": [${list.join(', ')}]`,
    '}',
  ].join('\n');

function artifact(status: string, gateJson?: string): string {
  const lines = ['# Feature', '', `**Status:** ${status}`, '', 'Prose.', ''];
  if (gateJson !== undefined) lines.push('## Gate Results', '', `${FENCE}json`, gateJson, FENCE, '');
  return lines.join('\n');
}

const FILES: Record<string, string> = {
  'specified.md': artifact('SPECIFIED'),
  'implemented.md': artifact('IMPLEMENTED'),
  'verified-ok.md': artifact('VERIFIED', gates([gate(1), gate(2), gate(4)])),
  'verified-bare.md': artifact('VERIFIED', gates([gate(1), gate(2)])),
  'broken.md': artifact('VERIFIED', '{ not json'),
  'failing.md': artifact('VERIFIED', gates([gate(1), gate(2, 'FAIL'), gate(4)])),
};

function run(): any {
  const root = mkdtempSync(join(tmpdir(), 'assess-feature-report-'));
  created.push(root);
  const dir = join(root, 'llm', 'features');
  mkdirSync(dir, { recursive: true });
  for (const [name, body] of Object.entries(FILES)) writeFileSync(join(dir, name), body, 'utf8');
  const out = execFileSync('node', [ASSESS, '--format', 'json', '--root', root], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return JSON.parse(out);
}

describe('assess.mjs feature report data (acceptance 11)', () => {
  const profile = run();
  const state = profile.dimensions.llmArtifacts.features;
  const by = (name: string) => state.features.find((f: any) => f.name === name);

  it('reports every artifact, malformed included', () => {
    expect(state.count).toBe(6);
    expect(state.features.map((f: any) => f.name).sort()).toEqual(Object.keys(FILES).map((n) => n.replace('.md', '')).sort());
  });

  it('reports SPECIFIED and IMPLEMENTED with absent evidence', () => {
    expect(by('specified')).toMatchObject({ status: 'SPECIFIED', evidence: 'absent' });
    expect(by('implemented')).toMatchObject({ status: 'IMPLEMENTED', evidence: 'absent' });
  });

  it('reports a substantiated VERIFIED as VERIFIED with complete evidence', () => {
    expect(by('verified-ok')).toEqual({ name: 'verified-ok', status: 'VERIFIED', evidence: 'complete', missingGates: [], failedGates: [] });
  });

  it('reports an unsubstantiated VERIFIED with the gate that did not run', () => {
    expect(by('verified-bare')).toEqual({ name: 'verified-bare', status: 'VERIFIED (unsubstantiated)', evidence: 'incomplete', missingGates: [4], failedGates: [] });
  });

  it('reports a malformed artifact as malformed, with no gate numbers', () => {
    expect(by('broken')).toEqual({ name: 'broken', status: 'VERIFIED (unsubstantiated)', evidence: 'malformed', missingGates: [], failedGates: [] });
  });

  it('reports a failed gate separately from a missing one', () => {
    expect(by('failing')).toEqual({ name: 'failing', status: 'VERIFIED (unsubstantiated)', evidence: 'incomplete', missingGates: [], failedGates: [2] });
  });
});

describe('assess SKILL.md feature table instructions', () => {
  const skill = readFileSync(SKILL, 'utf8');

  it.each([
    'dimensions.llmArtifacts.features.features',
    'VERIFIED (unsubstantiated)',
    'missingGates',
    'failedGates',
    'gates not run',
    'gates failed',
    'no gate results recorded',
    'gate results malformed',
    'never omit it',
  ])('mentions %s', (phrase) => {
    expect(skill).toContain(phrase);
  });

  it('tells the renderer to branch on evidence, not list length', () => {
    expect(skill).toMatch(/from `evidence`, never from the length/);
  });
});
