#!/usr/bin/env npx ts-node

/**
 * Migration script to convert existing prompts to the new unified format
 *
 * Reads from: prompts/<chapter>/<name>-prompt.txt and <name>-metadata.json
 * Writes to: content/prompts/<chapter>/<name>.md (unified format)
 */

import * as fs from 'fs';
import * as path from 'path';

// Category mapping from old chapter structure to new categories
const chapterToCategory: Record<string, string> = {
  'ch1': 'planning',
  'ch3': 'architecture',
  'ch4': 'quality', // default, but has subcategories
  'ch5': 'memory-bank',
  'ch6': 'organization',
  'ch7': 'operations',
  'ch8': 'learning',
  'ch9': 'adoption',
  'general': 'meta',
  'meta': 'meta'
};

// Subcategory mappings for ch4
const ch4Subcategories: Record<string, string> = {
  'gate-1': 'quality',
  'gate-2': 'quality',
  'gate-3': 'deployment',
  'gate-4': 'excellence',
  'maintenance': 'excellence',
  'practices': 'ai-workflow',
  'review': 'ai-workflow'
};

// Plugin mapping
const categoryToPlugin: Record<string, string> = {
  'planning': 'constellize-planning',
  'architecture': 'constellize-architecture',
  'quality': 'constellize-quality',
  'deployment': 'constellize-deployment',
  'excellence': 'constellize-excellence',
  'ai-workflow': 'constellize-ai-workflow',
  'memory-bank': 'constellize-memory-bank',
  'operations': 'constellize-operations',
  'organization': 'constellize-organization',
  'learning': 'constellize-learning',
  'evolution': 'constellize-evolution',
  'adoption': 'constellize-adoption',
  'meta': 'constellize-internal'
};

// Tool recommendations based on prompt content
function inferTools(promptContent: string): string[] {
  const tools: string[] = ['Read', 'Glob', 'Grep'];

  if (promptContent.includes('create') || promptContent.includes('establish') ||
      promptContent.includes('write') || promptContent.includes('generate')) {
    tools.push('Write');
  }

  if (promptContent.includes('test') || promptContent.includes('build') ||
      promptContent.includes('run') || promptContent.includes('execute')) {
    tools.push('Bash');
  }

  return tools;
}

// Extract chapter number from string like "Chapter 1" or "ch1"
function extractChapterNumber(chapter: string): number {
  const match = chapter.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

interface OldMetadata {
  id: string;
  chapter: string;
  category: string;
  purpose: string;
  useCase: string;
  tags: string[];
  created?: string;
  version?: string;
}

interface MigrationResult {
  success: boolean;
  source: string;
  target: string;
  error?: string;
}

function migratePrompt(
  promptPath: string,
  metadataPath: string,
  chapter: string,
  subcategory?: string
): MigrationResult {
  const baseName = path.basename(promptPath, '-prompt.txt');

  try {
    // Read source files
    const promptContent = fs.readFileSync(promptPath, 'utf-8');

    let metadata: OldMetadata;
    if (fs.existsSync(metadataPath)) {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    } else {
      // Create minimal metadata if missing
      metadata = {
        id: baseName,
        chapter: chapter,
        category: 'General',
        purpose: `${baseName.replace(/-/g, ' ')}`,
        useCase: '',
        tags: []
      };
    }

    // Determine category
    let category = chapterToCategory[chapter] || 'meta';
    if (chapter === 'ch4' && subcategory) {
      category = ch4Subcategories[subcategory] || 'quality';
    }

    const chapterNum = extractChapterNumber(metadata.chapter || chapter);
    const plugin = categoryToPlugin[category] || 'constellize-internal';
    const tools = inferTools(promptContent);

    // Parse existing YAML frontmatter from prompt if present
    let existingVars: any[] = [];
    let cleanPromptContent = promptContent;

    const yamlMatch = promptContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (yamlMatch) {
      const yamlContent = yamlMatch[1];
      cleanPromptContent = yamlMatch[2];

      // Extract template_variables if present
      const varsMatch = yamlContent.match(/template_variables:\n([\s\S]*?)(?=\n[a-z]|$)/);
      if (varsMatch) {
        // Simple parsing of variables
        const varMatches = varsMatch[1].matchAll(/- name: (\S+)\n\s+description: ([^\n]+)(?:\n\s+example: "([^"]+)")?/g);
        for (const match of varMatches) {
          existingVars.push({
            name: match[1],
            description: match[2],
            example: match[3] || ''
          });
        }
      }
    }

    // Build new unified format
    const newContent = `---
# === Identity ===
id: ${metadata.id}
name: ${metadata.purpose || metadata.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
version: ${metadata.version || '1.0.0'}

# === Classification ===
chapter: ${chapterNum}
category: ${category}
${subcategory ? `subcategory: ${subcategory}` : ''}
tags:
${metadata.tags.map(t => `  - ${t}`).join('\n') || '  - general'}

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    ${metadata.purpose || metadata.id.replace(/-/g, ' ')}.
    ${metadata.useCase ? metadata.useCase + '.' : ''}
  argument-hint: "${existingVars.length > 0 ? existingVars.map(v => `[${v.name}]`).join(' ') : ''}"
  allowed-tools:
${tools.map(t => `    - ${t}`).join('\n')}
  model: sonnet
  context: inline
  user-invocable: true
  disable-model-invocation: false

# === Variables ===
variables:
${existingVars.length > 0 ? existingVars.map((v, i) => `  - name: ${v.name}
    description: ${v.description}
    example: "${v.example}"
    maps-to: "$${i}"`).join('\n') : '  []'}

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/${metadata.id}
  marketplace:
    plugin: ${plugin}

# === Related ===
related:
  personas: []
  skills: []
---

${cleanPromptContent.trim()}
`;

    // Determine output path
    const chapterDir = chapterNum > 0 ? `${String(chapterNum).padStart(2, '0')}-${category}` : category;
    const outputDir = path.join('content/prompts', chapterDir);
    const outputPath = path.join(outputDir, `${metadata.id}.md`);

    // Create directory if needed
    fs.mkdirSync(outputDir, { recursive: true });

    // Write new file
    fs.writeFileSync(outputPath, newContent);

    return {
      success: true,
      source: promptPath,
      target: outputPath
    };

  } catch (error) {
    return {
      success: false,
      source: promptPath,
      target: '',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function findPrompts(dir: string, chapter: string, subcategory?: string): MigrationResult[] {
  const results: MigrationResult[] = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectory
      results.push(...findPrompts(fullPath, chapter, entry.name));
    } else if (entry.name.endsWith('-prompt.txt')) {
      const baseName = entry.name.replace('-prompt.txt', '');
      const metadataPath = path.join(dir, `${baseName}-metadata.json`);
      results.push(migratePrompt(fullPath, metadataPath, chapter, subcategory));
    }
  }

  return results;
}

// Main execution
function main() {
  console.log('Migrating prompts to new unified format...\n');

  const promptsDir = 'prompts';
  const chapters = fs.readdirSync(promptsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const chapter of chapters) {
    const chapterPath = path.join(promptsDir, chapter);
    const results = findPrompts(chapterPath, chapter);

    for (const result of results) {
      if (result.success) {
        console.log(`✓ ${result.source} → ${result.target}`);
        totalSuccess++;
      } else {
        console.log(`✗ ${result.source}: ${result.error}`);
        totalFailed++;
      }
    }
  }

  console.log(`\n--- Migration Complete ---`);
  console.log(`Success: ${totalSuccess}`);
  console.log(`Failed: ${totalFailed}`);
}

main();
