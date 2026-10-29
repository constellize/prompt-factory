#!/usr/bin/env npx ts-node

/**
 * Generate website output from unified content
 *
 * Outputs:
 * - ../website/public/prompts/<id>/prompt.txt
 * - ../website/public/personas/<category>/<subcategory>/<name>.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { loadPrompts, loadPersonas, getAggregatePersonas } from './lib/parser';
import { Prompt, Persona } from './lib/types';

const DEFAULT_WEBSITE_DIR = '../website';

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
function generatePromptOutput(prompt: Prompt, websiteDir: string): void {
  const id = prompt.frontmatter.id;
  const outputDir = path.join(websiteDir, 'public/prompts', id);

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
function generatePersonaOutput(persona: Persona, websiteDir: string): void {
  const category = categoryToFolder(persona.frontmatter.category);
  const subcategory = subcategoryToFolder(persona.frontmatter.subcategory);

  // Skip if not marked for website output
  if (persona.frontmatter.outputs?.website?.include === false) {
    return;
  }

  const outputDir = path.join(websiteDir, 'public/personas', category, subcategory);
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
 * Main execution
 */
export function generate(websiteDir: string): void {
  console.log('Generating website output...\n');

  // Check if website exists
  if (!fs.existsSync(websiteDir)) {
    console.error(`website not found at: ${websiteDir}`);
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
    generatePromptOutput(prompt, websiteDir);
  }

  // Generate persona outputs (aggregates only)
  console.log('\n--- Personas (Aggregates Only) ---');
  for (const persona of aggregatePersonas) {
    generatePersonaOutput(persona, websiteDir);
  }

  console.log('\n--- Complete ---');
  console.log(`Generated ${prompts.length} prompts and ${aggregatePersonas.length} aggregate personas for website`);
}

if (require.main === module) {
  generate(DEFAULT_WEBSITE_DIR);
}
