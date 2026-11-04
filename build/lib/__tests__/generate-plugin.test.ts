import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { generatePlugin } from '../../generate-marketplace';
import { Persona, PluginDefinition, Prompt } from '../types';

let tmp: string;
let contentDir: string;
let outDir: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-test-'));
  contentDir = path.join(tmp, 'content');
  outDir = path.join(tmp, 'out');
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

const prompt = {
  frontmatter: { id: 'my-skill', name: 'My Skill', chapter: 1, category: 'cat', skill: { description: 'generated' } },
  content: 'GENERATED BODY',
  sourcePath: 'p.md',
} as unknown as Prompt;

const persona = {
  frontmatter: {
    id: 'qa',
    name: 'QA',
    title: 'QA',
    category: 'c',
    subcategory: 'qa-engineers',
    'is-aggregate': true,
    agent: { description: 'qa agent' },
  },
  content: 'persona body',
  sourcePath: 'a.md',
} as unknown as Persona;

function pluginWith(extra: object): PluginDefinition {
  return { id: 'x:y', version: '1.0.0', name: 'Y', description: 'd', ...extra } as PluginDefinition;
}

function writeLiteral(source: string, files: Record<string, string>): void {
  for (const [rel, text] of Object.entries(files)) {
    const file = path.join(contentDir, 'literal', source, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
}

describe('generatePlugin', () => {
  it('lets a literal file overwrite a generated skill at the same output path', () => {
    const plugin = pluginWith({ skills: { include: ['my-skill'] }, literal: { source: 'tree' } });
    const skill = path.join(outDir, 'plugins', 'x-y', 'skills', 'my-skill', 'SKILL.md');

    // Without the literal tree the generator emits the skill at this path.
    const generatedOnly = pluginWith({ skills: { include: ['my-skill'] } });
    generatePlugin(generatedOnly, [prompt], [], [generatedOnly], outDir, contentDir);
    expect(fs.readFileSync(skill, 'utf-8')).toContain('GENERATED BODY');

    // With it, the literal content replaces the generated skill.
    writeLiteral('tree', { 'skills/my-skill/SKILL.md': 'LITERAL WINS\n' });
    generatePlugin(plugin, [prompt], [], [plugin], outDir, contentDir);
    expect(fs.readFileSync(skill, 'utf-8')).toBe('LITERAL WINS\n');
  });

  it('lets a literal file overwrite a generated agent at the same output path', () => {
    const plugin = pluginWith({ agents: { subcategories: ['qa-engineers'] }, literal: { source: 'tree' } });
    writeLiteral('tree', { 'agents/qa-engineers.md': 'LITERAL AGENT\n' });

    generatePlugin(plugin, [], [persona], [plugin], outDir, contentDir);

    const agent = path.join(outDir, 'plugins', 'x-y', 'agents', 'qa-engineers.md');
    expect(fs.readFileSync(agent, 'utf-8')).toBe('LITERAL AGENT\n');
  });

  it('copies the literal tree from the content directory it is given', () => {
    const plugin = pluginWith({ literal: { source: 'tree' } });
    writeLiteral('tree', { 'scripts/run.mjs': 'run' });

    generatePlugin(plugin, [], [], [plugin], outDir, contentDir);

    expect(fs.readFileSync(path.join(outDir, 'plugins', 'x-y', 'scripts', 'run.mjs'), 'utf-8')).toBe('run');
  });

  it('creates no agents directory for a plugin with no personas', () => {
    const plugin = pluginWith({ literal: { source: 'tree' } });
    writeLiteral('tree', { 'scripts/run.mjs': 'run' });

    generatePlugin(plugin, [], [], [plugin], outDir, contentDir);

    expect(fs.existsSync(path.join(outDir, 'plugins', 'x-y', 'agents'))).toBe(false);
  });

  it('still creates agents/ and skills/ for a plugin that has them', () => {
    const plugin = pluginWith({ skills: { include: ['my-skill'] }, agents: { subcategories: ['qa-engineers'] } });

    generatePlugin(plugin, [prompt], [persona], [plugin], outDir, contentDir);

    const pluginDir = path.join(outDir, 'plugins', 'x-y');
    expect(fs.existsSync(path.join(pluginDir, 'agents', 'qa-engineers.md'))).toBe(true);
    expect(fs.existsSync(path.join(pluginDir, 'skills', 'my-skill', 'SKILL.md'))).toBe(true);
  });
});
