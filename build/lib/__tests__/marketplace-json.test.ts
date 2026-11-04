import { generateMarketplaceJson } from '../../generate-marketplace';
import { loadPluginsConfig } from '../parser';

const config = loadPluginsConfig('content');
const output = generateMarketplaceJson(config);
const catalog = JSON.parse(output);

describe('generateMarketplaceJson', () => {
  it('emits owner name "Constellize" and no url', () => {
    expect(catalog.owner).toEqual({ name: 'Constellize' });
    expect(Object.keys(catalog.owner)).toEqual(['name']);
  });

  it('ends with exactly one newline', () => {
    expect(output.endsWith('}\n')).toBe(true);
    expect(output.endsWith('\n\n')).toBe(false);
  });

  it('emits keys in the committed order', () => {
    expect(Object.keys(catalog)).toEqual(['name', 'owner', 'description', 'plugins', 'renames']);
    expect(catalog.name).toBe('constellize-plugins-official');
    expect(catalog.description).toBe('Official Constellize methodology plugins for Claude Code');
  });

  it('lists plugins in plugins.json order, harness last', () => {
    expect(catalog.plugins.map((p: { name: string }) => p.name)).toEqual([
      'constellize-memory',
      'constellize-design',
      'constellize-craft',
      'constellize-deliver',
      'constellize-grow',
      'constellize-harness'
    ]);
  });

  it('gives each entry name, source "./plugins/<name>" and description, and nothing else', () => {
    for (const entry of catalog.plugins) {
      expect(Object.keys(entry)).toEqual(['name', 'source', 'description']);
      expect(entry.source).toBe(`./plugins/${entry.name}`);
    }
    expect(catalog.plugins[5]).toEqual({
      name: 'constellize-harness',
      source: './plugins/constellize-harness',
      description: 'Project orchestration: assess state, plan next steps, execute constellize skills'
    });
  });

  it('carries all 13 renames, including the null-valued constellize-ai-workflow', () => {
    expect(catalog.renames).toEqual({
      'constellize-planning': 'constellize-design',
      'constellize-architecture': 'constellize-design',
      'constellize-quality': 'constellize-craft',
      'constellize-development': 'constellize-craft',
      'constellize-excellence': 'constellize-craft',
      'constellize-deployment': 'constellize-deliver',
      'constellize-operations': 'constellize-deliver',
      'constellize-memory-bank': 'constellize-memory',
      'constellize-learning': 'constellize-grow',
      'constellize-evolution': 'constellize-grow',
      'constellize-adoption': 'constellize-grow',
      'constellize-organization': 'constellize-grow',
      'constellize-ai-workflow': null
    });
    expect(Object.keys(catalog.renames)).toHaveLength(13);
  });

  it('omits $schema', () => {
    expect(output).not.toContain('$schema');
    expect(catalog.$schema).toBeUndefined();
  });
});
