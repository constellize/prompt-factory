#!/usr/bin/env npx ts-node

/**
 * Generate website output from unified content
 *
 * Outputs:
 * - ../website/public/prompts/<id>/prompt.txt
 * - ../website/public/personas/<category>/<subcategory>/<name>.md
 * - ../website/src/data/prompts/index.ts (metadata)
 * - ../website/src/data/personas/metadata.ts (metadata)
 */

import * as fs from 'fs';
import * as path from 'path';
import { loadPrompts, loadPersonas, getAggregatePersonas } from './lib/parser';
import { Prompt, Persona } from './lib/types';

const WEBSITE_DIR = '../website';
const PROMPTS_OUTPUT = path.join(WEBSITE_DIR, 'public/prompts');
const PERSONAS_OUTPUT = path.join(WEBSITE_DIR, 'public/personas');

/**
 * Extract just the prompt content (removing frontmatter sections for website)
 */
function extractPromptContent(prompt: Prompt): string {
  // The content after frontmatter is the actual prompt
  // We want to keep it as-is for the website
  return prompt.content;
}

/**
 * Generate website prompt output
 */
function generatePromptOutput(prompt: Prompt): void {
  const id = prompt.frontmatter.id;
  const outputDir = path.join(PROMPTS_OUTPUT, id);

  // Skip if not marked for website output
  if (prompt.frontmatter.outputs?.website?.include === false) {
    return;
  }

  // Create directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Write prompt.txt
  const promptContent = extractPromptContent(prompt);
  fs.writeFileSync(path.join(outputDir, 'prompt.txt'), promptContent);

  console.log(`✓ Prompt: ${id}`);
}

/**
 * Generate prompts metadata for website
 */
function generatePromptsMetadata(prompts: Prompt[]): object[] {
  return prompts
    .filter(p => p.frontmatter.outputs?.website?.include !== false)
    .map(p => ({
      id: p.frontmatter.id,
      chapter: `Chapter ${p.frontmatter.chapter}`,
      category: p.frontmatter.category,
      purpose: p.frontmatter.name || p.frontmatter.id,
      useCase: p.frontmatter.skill?.description || '',
      tags: p.frontmatter.tags || [],
      created: new Date().toISOString().split('T')[0],
      version: p.frontmatter.version || '1.0.0'
    }));
}

/**
 * Extract persona content (without frontmatter)
 */
function extractPersonaContent(persona: Persona): string {
  return persona.content;
}

/**
 * Convert category to website folder structure
 */
function categoryToFolder(category: string): string {
  return category.replace(/-/g, '_');
}

/**
 * Convert subcategory to website folder structure
 */
function subcategoryToFolder(subcategory: string): string {
  return subcategory.replace(/-/g, '_');
}

/**
 * Generate website persona output
 */
function generatePersonaOutput(persona: Persona): void {
  const category = categoryToFolder(persona.frontmatter.category);
  const subcategory = subcategoryToFolder(persona.frontmatter.subcategory);

  // Skip if not marked for website output
  if (persona.frontmatter.outputs?.website?.include === false) {
    return;
  }

  const outputDir = path.join(PERSONAS_OUTPUT, category, subcategory);
  fs.mkdirSync(outputDir, { recursive: true });

  // Determine filename
  let fileName: string;
  if (persona.frontmatter['is-aggregate']) {
    fileName = 'Aggregate_Expert_Synthesis.md';
  } else {
    // Convert id back to original filename format
    const name = persona.frontmatter.name || persona.frontmatter.id;
    fileName = name.replace(/\s+/g, '-') + '.md';
  }

  // Write content (without frontmatter for website)
  const content = extractPersonaContent(persona);
  fs.writeFileSync(path.join(outputDir, fileName), content);

  console.log(`✓ Persona: ${category}/${subcategory}/${fileName}`);
}

/**
 * Generate personas metadata TypeScript file
 */
function generatePersonasMetadata(personas: Persona[]): string {
  const aggregates = getAggregatePersonas(personas);

  const metadata = aggregates.map(p => {
    const category = categoryToFolder(p.frontmatter.category);
    const subcategory = subcategoryToFolder(p.frontmatter.subcategory);

    return {
      id: p.frontmatter.subcategory,
      name: p.frontmatter.name.replace(' (Aggregate)', ''),
      category: p.frontmatter.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' & '),
      subcategory: p.frontmatter.subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      title: p.frontmatter.title,
      description: p.frontmatter.agent?.description || '',
      expertise: p.frontmatter.expertise || [],
      useWith: p.frontmatter['use-with'] || [],
      filePath: `/personas/${category}/${subcategory}/Aggregate_Expert_Synthesis.md`
    };
  });

  return `import { PersonaMetadata } from '../../types/personas';

const personasBasePath = '/personas';

export const personaMetadata: PersonaMetadata[] = ${JSON.stringify(metadata, null, 2)};

// Helper to get persona by ID
export const getPersonaById = (id: string): PersonaMetadata | undefined => {
  return personaMetadata.find(p => p.id === id);
};

// Helper to get personas by category
export const getPersonasByCategory = (category: string): PersonaMetadata[] => {
  return personaMetadata.filter(p => p.category === category);
};

// Get all categories
export const getAllPersonaCategories = (): string[] => {
  return Array.from(new Set(personaMetadata.map(p => p.category)));
};

// Get all subcategories
export const getAllPersonaSubcategories = (): string[] => {
  return Array.from(new Set(personaMetadata.map(p => p.subcategory)));
};
`;
}

/**
 * Main execution
 */
function main() {
  console.log('Generating website output...\n');

  // Check if website exists
  if (!fs.existsSync(WEBSITE_DIR)) {
    console.error(`website not found at: ${WEBSITE_DIR}`);
    process.exit(1);
  }

  // Load content
  const prompts = loadPrompts('content');
  const personas = loadPersonas('content');

  // Filter to only aggregate personas for website
  const aggregatePersonas = getAggregatePersonas(personas);

  console.log(`Loaded ${prompts.length} prompts and ${personas.length} personas (${aggregatePersonas.length} aggregates)\n`);

  // Generate prompt outputs
  console.log('--- Prompts ---');
  for (const prompt of prompts) {
    generatePromptOutput(prompt);
  }

  // Generate persona outputs (aggregates only)
  console.log('\n--- Personas (Aggregates Only) ---');
  for (const persona of aggregatePersonas) {
    generatePersonaOutput(persona);
  }

  // Generate metadata files
  console.log('\n--- Metadata ---');

  // Prompts metadata (JSON for now, could be TypeScript)
  const promptsMetadata = generatePromptsMetadata(prompts);
  const promptsMetadataPath = path.join(WEBSITE_DIR, 'src/data/prompts/generated-metadata.json');
  fs.mkdirSync(path.dirname(promptsMetadataPath), { recursive: true });
  fs.writeFileSync(promptsMetadataPath, JSON.stringify(promptsMetadata, null, 2));
  console.log(`✓ Prompts metadata: ${promptsMetadataPath}`);

  // Personas metadata (TypeScript)
  const personasMetadataContent = generatePersonasMetadata(personas);
  const personasMetadataPath = path.join(WEBSITE_DIR, 'src/data/personas/generated-metadata.ts');
  fs.mkdirSync(path.dirname(personasMetadataPath), { recursive: true });
  fs.writeFileSync(personasMetadataPath, personasMetadataContent);
  console.log(`✓ Personas metadata: ${personasMetadataPath}`);

  console.log('\n--- Complete ---');
  console.log(`Generated ${prompts.length} prompts and ${aggregatePersonas.length} aggregate personas for website`);
}

main();
