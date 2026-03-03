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
