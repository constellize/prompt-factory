import { generateMarketplaceJson } from '../../generate-marketplace';
import { loadPluginsConfig } from '../parser';
import { PluginsConfig } from '../types';

describe('generateMarketplaceJson', () => {
  let output: string;
  let catalog: any;

  // Loaded here, not at module scope, so an invalid config fails a test rather than
  // the import. The path is relative to the repo root, where jest runs.
  beforeAll(() => {
    output = generateMarketplaceJson(loadPluginsConfig('content'));
    catalog = JSON.parse(output);
  });

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
      'constellize-feature',
      'constellize-harness'
    ]);
  });

  it('gives each entry name, source "./plugins/<name>" and description, and nothing else', () => {
    for (const entry of catalog.plugins) {
      expect(Object.keys(entry)).toEqual(['name', 'source', 'description']);
      expect(entry.source).toBe(`./plugins/${entry.name}`);
    }
    expect(catalog.plugins[6]).toEqual({
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

describe('generateMarketplaceJson on a hand-built config', () => {
  function fixture(): PluginsConfig {
    return {
      $schema: 'ignored',
      extraTopLevel: 'leaked?',
      marketplace: { name: 'm', description: 'md', owner: { name: 'o' }, extraMarketplace: 'leaked?' },
      plugins: [
        { id: 'a:one', version: '9.9.9', name: 'One', description: 'first', chapter: 3, extraPlugin: 'leaked?' },
        { id: 'a:two', version: '1.0.0', name: 'Two', description: 'second', literal: { source: 'two' } },
      ],
      renames: { zebra: 'a-one', apple: null, mango: 'a-two' },
    } as unknown as PluginsConfig;
  }

  it('does not copy unknown fields from the config or a plugin entry', () => {
    const output = generateMarketplaceJson(fixture());
    const catalog = JSON.parse(output);

    expect(Object.keys(catalog)).toEqual(['name', 'owner', 'description', 'plugins', 'renames']);
    expect(catalog.plugins[0]).toEqual({ name: 'a-one', source: './plugins/a-one', description: 'first' });
    for (const leaked of ['leaked?', 'ignored', '9.9.9', 'extraPlugin', 'extraTopLevel', '"chapter"', '"literal"']) {
      expect(output).not.toContain(leaked);
    }
  });

  it('does not mutate the config it is given', () => {
    const config = fixture();
    const before = JSON.parse(JSON.stringify(config));

    generateMarketplaceJson(config);

    expect(config).toEqual(before);
  });

  it('preserves renames key order in the serialised text', () => {
    const output = generateMarketplaceJson(fixture());

    expect(Object.keys(JSON.parse(output).renames)).toEqual(['zebra', 'apple', 'mango']);
    expect(output.indexOf('"zebra"')).toBeLessThan(output.indexOf('"apple"'));
    expect(output.indexOf('"apple"')).toBeLessThan(output.indexOf('"mango"'));
  });

  it('hyphenates ids into names and sources', () => {
    const catalog = JSON.parse(generateMarketplaceJson(fixture()));
    expect(catalog.plugins.map((p: { name: string }) => p.name)).toEqual(['a-one', 'a-two']);
    expect(catalog.plugins[1].source).toBe('./plugins/a-two');
  });
});
