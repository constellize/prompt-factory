/**
 * Parser for unified content format
 * Reads prompts and personas from content/ directory
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Prompt,
  PromptFrontmatter,
  Persona,
  PersonaFrontmatter,
  PluginsConfig,
  PluginDefinition
} from './types';

/**
 * Simple YAML frontmatter parser
 * Handles nested objects and arrays
 */
function parseYamlFrontmatter(yamlContent: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlContent.split('\n');

  let currentKey: string | null = null;
  let currentIndent = 0;
  let inArray = false;
  let arrayKey: string | null = null;
  let nestedObject: Record<string, any> | null = null;
  let nestedKey: string | null = null;

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
      continue;
    }

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith('- ')) {
      const value = trimmed.slice(2).trim();
      if (arrayKey) {
        if (!result[arrayKey]) {
          result[arrayKey] = [];
        }
        // Check if it's a nested object in array
        if (value.includes(': ')) {
          const [k, v] = value.split(': ').map(s => s.trim());
          const obj: Record<string, any> = {};
          obj[k] = parseValue(v);
          result[arrayKey].push(obj);
        } else {
          result[arrayKey].push(parseValue(value));
        }
      } else if (nestedKey && nestedObject) {
        if (!nestedObject[nestedKey]) {
          nestedObject[nestedKey] = [];
        }
        nestedObject[nestedKey].push(parseValue(value));
      }
      continue;
    }

    // Key-value pair
    if (trimmed.includes(': ')) {
      const colonIndex = trimmed.indexOf(': ');
      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 2).trim();

      if (indent === 0) {
        // Top-level key
        if (value === '' || value === '>') {
          // Start of nested object or multiline
          currentKey = key;
          currentIndent = indent;
          nestedObject = {};
          result[key] = nestedObject;
          arrayKey = null;
          nestedKey = null;
        } else if (value === '[]') {
          result[key] = [];
          arrayKey = null;
        } else {
          result[key] = parseValue(value);
          arrayKey = null;
          nestedObject = null;
        }
      } else if (indent > 0 && nestedObject) {
        // Nested key
        if (value === '' || value === '[]') {
          nestedKey = key;
          if (value === '[]') {
            nestedObject[key] = [];
          }
          arrayKey = null;
        } else {
          nestedObject[key] = parseValue(value);
          nestedKey = null;
        }
      }
    } else if (trimmed.endsWith(':')) {
      // Key without value (start of array or nested object)
      const key = trimmed.slice(0, -1).trim();
      if (indent === 0) {
        arrayKey = key;
        result[key] = [];
        nestedObject = null;
        nestedKey = null;
      } else if (nestedObject) {
        nestedKey = key;
        nestedObject[key] = [];
        arrayKey = null;
      }
    }
  }

  return result;
}

function parseValue(value: string): any {
  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Number
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);

  // Null/empty
  if (value === 'null' || value === '~' || value === '') return null;

  // Array shorthand
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map(s => parseValue(s.trim()));
  }

  return value;
}

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

  const frontmatter = parseYamlFrontmatter(yamlContent);

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

/**
 * Load plugins configuration from content/schemas/plugins.json
 */
export function loadPluginsConfig(contentDir: string = 'content'): PluginsConfig {
  const configPath = path.join(contentDir, 'schemas', 'plugins.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Plugins config not found: ${configPath}`);
  }

  const content = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(content) as PluginsConfig;
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
