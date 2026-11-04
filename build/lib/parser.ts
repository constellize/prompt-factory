/**
 * Parser for unified content format
 * Reads prompts and personas from content/ directory
 */

import * as fs from 'fs';
import * as path from 'path';
import YAML from 'yaml';
import {
  Prompt,
  PromptFrontmatter,
  Persona,
  PersonaFrontmatter,
  PluginsConfig,
  PluginDefinition
} from './types';

/**
 * Parse a markdown file with YAML frontmatter
 */
function parseMarkdownWithFrontmatter(filePath: string): { frontmatter: Record<string, any>; content: string } {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Check for frontmatter
  if (!fileContent.startsWith('---')) {
    return {
      frontmatter: {},
      content: fileContent
    };
  }

  // Find end of frontmatter
  const endIndex = fileContent.indexOf('\n---', 3);
  if (endIndex === -1) {
    return {
      frontmatter: {},
      content: fileContent
    };
  }

  const yamlContent = fileContent.slice(4, endIndex);
  const content = fileContent.slice(endIndex + 5).trim();

  // Use proper YAML parser for multiline strings, etc.
  const frontmatter = YAML.parse(yamlContent) || {};

  return { frontmatter, content };
}

/**
 * Load all prompts from content/prompts/
 */
export function loadPrompts(contentDir: string = 'content'): Prompt[] {
  const promptsDir = path.join(contentDir, 'prompts');
  const prompts: Prompt[] = [];

  if (!fs.existsSync(promptsDir)) {
    console.warn(`Prompts directory not found: ${promptsDir}`);
    return prompts;
  }

  // Recursively find all .md files
  function findMarkdownFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMarkdownFiles(fullPath));
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const markdownFiles = findMarkdownFiles(promptsDir);

  for (const filePath of markdownFiles) {
    try {
      const { frontmatter, content } = parseMarkdownWithFrontmatter(filePath);

      if (!frontmatter.id) {
        console.warn(`Skipping ${filePath}: missing id in frontmatter`);
        continue;
      }

      prompts.push({
        frontmatter: frontmatter as PromptFrontmatter,
        content,
        sourcePath: filePath
      });
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
    }
  }

  return prompts;
}

/**
 * Load all personas from content/personas/
 */
export function loadPersonas(contentDir: string = 'content'): Persona[] {
  const personasDir = path.join(contentDir, 'personas');
  const personas: Persona[] = [];

  if (!fs.existsSync(personasDir)) {
    console.warn(`Personas directory not found: ${personasDir}`);
    return personas;
  }

  // Recursively find all .md files
  function findMarkdownFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMarkdownFiles(fullPath));
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const markdownFiles = findMarkdownFiles(personasDir);

  for (const filePath of markdownFiles) {
    try {
      const { frontmatter, content } = parseMarkdownWithFrontmatter(filePath);

      if (!frontmatter.id) {
        console.warn(`Skipping ${filePath}: missing id in frontmatter`);
        continue;
      }

      personas.push({
        frontmatter: frontmatter as PersonaFrontmatter,
        content,
        sourcePath: filePath
      });
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
    }
  }

  return personas;
}

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Validate a parsed plugins.json before the generators consume it.
 *
 * This exists because every field below reaches generated output that nothing else checks.
 * A plugin entry missing `version` is the dangerous one: the generator would emit a
 * plugin.json with no version key, the marketplace's version-bump check would compare
 * `undefined` against the previous value and see a difference, CI would pass, and the
 * release would reach no reader -- Claude Code only re-installs a plugin when its version
 * changes. `claude plugin validate` does not catch it either. Fail at the source instead.
 */
export function validatePluginsConfig(
  config: PluginsConfig,
  configPath: string,
  contentDir: string = 'content'
): void {
  const errors: string[] = [];

  const marketplace = config?.marketplace;
  if (!marketplace || typeof marketplace !== 'object') {
    errors.push('"marketplace" is missing or not an object');
  } else {
    if (!isNonEmptyString(marketplace.name)) {
      errors.push('marketplace.name must be a non-empty string');
    }
    if (!isNonEmptyString(marketplace.description)) {
      errors.push('marketplace.description must be a non-empty string');
    }
    if (!marketplace.owner || !isNonEmptyString(marketplace.owner.name)) {
      errors.push('marketplace.owner.name must be a non-empty string');
    }
  }

  const renames: unknown = config?.renames;
  if (!renames || typeof renames !== 'object' || Array.isArray(renames)) {
    errors.push('"renames" must be an object mapping old plugin names to new names or null');
  } else {
    for (const [oldName, newName] of Object.entries(renames)) {
      if (newName !== null && !isNonEmptyString(newName)) {
        errors.push(`renames["${oldName}"] must be a non-empty string or null`);
      }
    }
  }

  if (!Array.isArray(config?.plugins)) {
    errors.push('"plugins" must be an array');
  } else if (config.plugins.length === 0) {
    errors.push('"plugins" is empty, so the generator would produce no plugins at all');
  } else {
    const seen = new Set<string>();
    config.plugins.forEach((plugin, index) => {
      const where = isNonEmptyString(plugin?.id)
        ? `plugins[${index}] ("${plugin.id}")`
        : `plugins[${index}]`;

      for (const field of ['id', 'name', 'description'] as const) {
        if (!isNonEmptyString(plugin?.[field])) {
          errors.push(`${where}: "${field}" must be a non-empty string`);
        }
      }

      if (!isNonEmptyString(plugin?.version)) {
        errors.push(
          `${where}: "version" must be a non-empty string -- without it the generated ` +
            'plugin.json has no version key and the release reaches no reader'
        );
      } else if (!SEMVER.test(plugin.version)) {
        errors.push(
          `${where}: "version" is "${plugin.version}", which is not semver ` +
            '(MAJOR.MINOR.PATCH); Claude Code compares versions to decide whether to update'
        );
      }

      if (plugin?.literal !== undefined) {
        const source = plugin.literal?.source;
        if (!isNonEmptyString(source)) {
          errors.push(`${where}: "literal.source" must be a non-empty string naming a directory under ${contentDir}/literal/`);
        } else {
          const literalRoot = path.resolve(contentDir, 'literal');
          const sourceDir = path.resolve(literalRoot, source);
          if (path.dirname(sourceDir) !== literalRoot) {
            errors.push(
              `${where}: "literal.source" "${source}" must be a single directory name directly under ${contentDir}/literal/`
            );
          } else if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
            errors.push(
              `${where}: "literal.source" "${source}" does not exist: expected a directory at ${path.join(contentDir, 'literal', source)}`
            );
          }
        }
      }

      if (!plugin?.skills && !plugin?.agents && !plugin?.literal) {
        errors.push(
          `${where}: must define at least one of "skills", "agents" or "literal", ` +
            'otherwise the generated plugin is empty'
        );
      }

      if (isNonEmptyString(plugin?.id)) {
        if (seen.has(plugin.id)) {
          errors.push(`${where}: duplicate id, which would generate the same plugin twice`);
        }
        seen.add(plugin.id);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid ${configPath}:\n${errors.map(e => `  - ${e}`).join('\n')}`
    );
  }
}

/**
 * Load plugins configuration from content/schemas/plugins.json
 */
export function loadPluginsConfig(contentDir: string = 'content'): PluginsConfig {
  const configPath = path.join(contentDir, 'schemas', 'plugins.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Plugins config not found: ${configPath}`);
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  let parsed: PluginsConfig;
  try {
    parsed = JSON.parse(content) as PluginsConfig;
  } catch (error) {
    throw new Error(
      `Plugins config is not valid JSON: ${configPath}\n  ${(error as Error).message}`
    );
  }

  validatePluginsConfig(parsed, configPath, contentDir);
  return parsed;
}

/**
 * Get prompts for a specific plugin using plugin definition
 */
export function getPromptsForPlugin(prompts: Prompt[], pluginId: string, plugins: PluginDefinition[]): Prompt[] {
  const plugin = plugins.find(p => p.id === pluginId);
  if (!plugin) return [];

  const skillsDef = plugin.skills;
  if (!skillsDef) return [];

  return prompts.filter(p => {
    // If include list is specified, check if prompt ID is in it
    if (skillsDef.include && skillsDef.include.length > 0) {
      return skillsDef.include.includes(p.frontmatter.id);
    }
    // Otherwise match by category
    if (skillsDef.category) {
      return p.frontmatter.category === skillsDef.category;
    }
    return false;
  });
}

/**
 * Get personas for a specific plugin using plugin definition
 */
export function getPersonasForPlugin(personas: Persona[], pluginId: string, plugins: PluginDefinition[]): Persona[] {
  const plugin = plugins.find(p => p.id === pluginId);
  if (!plugin) return [];

  const agentsDef = plugin.agents;
  if (!agentsDef) return [];

  return personas.filter(p => {
    // Check subcategories
    if (agentsDef.subcategories && agentsDef.subcategories.length > 0) {
      return agentsDef.subcategories.includes(p.frontmatter.subcategory);
    }
    // Check custom agent IDs
    if (agentsDef.custom && agentsDef.custom.length > 0) {
      return agentsDef.custom.includes(p.frontmatter.id);
    }
    return false;
  });
}

/**
 * Get aggregate personas only
 */
export function getAggregatePersonas(personas: Persona[]): Persona[] {
  return personas.filter(p => p.frontmatter['is-aggregate'] === true);
}
