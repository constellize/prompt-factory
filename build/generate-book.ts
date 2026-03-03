#!/usr/bin/env npx ts-node

/**
 * Generate book prompt-ref blocks from unified content
 *
 * Outputs:
 * - ../book/generated/prompt-refs.md - All prompt-refs organized by chapter
 * - Can be used to validate/update book chapters
 */

import * as fs from 'fs';
import * as path from 'path';
import { loadPrompts } from './lib/parser';
import { Prompt } from './lib/types';

const BOOK_DIR = '../book';
const OUTPUT_DIR = path.join(BOOK_DIR, 'generated');

interface BookPrompt {
  id: string;
  chapter: number;
  description: string;
  preview: string;
  name: string;
}

/**
 * Extract prompts with book output configuration
 */
function getBookPrompts(prompts: Prompt[]): BookPrompt[] {
  const bookPrompts: BookPrompt[] = [];

  for (const prompt of prompts) {
    const book = prompt.frontmatter.outputs?.book;
    if (book && book.chapter && book.description) {
      bookPrompts.push({
        id: prompt.frontmatter.id,
        chapter: book.chapter,
        description: book.description.trim(),
        preview: book.preview?.trim() || '',
        name: prompt.frontmatter.name || prompt.frontmatter.id
      });
    }
  }

  // Sort by chapter, then by id
  return bookPrompts.sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.id.localeCompare(b.id);
  });
}

/**
 * Generate a single prompt-ref block
 */
function generatePromptRef(prompt: BookPrompt): string {
  // Title case the name
  const title = prompt.name
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `::: {.promptref title="${title}" url="{SITE_BASE}/prompts/v1/${prompt.id}"}
${prompt.description}

${prompt.preview}
:::`;
}

/**
 * Generate all prompt-refs organized by chapter
 */
function generateAllPromptRefs(bookPrompts: BookPrompt[]): string {
  const byChapter = new Map<number, BookPrompt[]>();

  for (const prompt of bookPrompts) {
    const list = byChapter.get(prompt.chapter) || [];
    list.push(prompt);
    byChapter.set(prompt.chapter, list);
  }

  const sections: string[] = [
    '# Generated Prompt References',
    '',
    'This file is auto-generated from prompt-factory.',
    'Use these blocks to update book chapters.',
    ''
  ];

  for (const [chapter, prompts] of Array.from(byChapter.entries()).sort((a, b) => a[0] - b[0])) {
    sections.push(`## Chapter ${chapter}`);
    sections.push('');

    for (const prompt of prompts) {
      sections.push(generatePromptRef(prompt));
      sections.push('');
    }
  }

  return sections.join('\n');
}

/**
 * Generate individual chapter files
 */
function generateChapterFiles(bookPrompts: BookPrompt[]): void {
  const byChapter = new Map<number, BookPrompt[]>();

  for (const prompt of bookPrompts) {
    const list = byChapter.get(prompt.chapter) || [];
    list.push(prompt);
    byChapter.set(prompt.chapter, list);
  }

  for (const [chapter, prompts] of byChapter) {
    const content = prompts.map(p => generatePromptRef(p)).join('\n\n');
    const filePath = path.join(OUTPUT_DIR, `ch${chapter}-prompt-refs.md`);
    fs.writeFileSync(filePath, content);
    console.log(`✓ ch${chapter}-prompt-refs.md (${prompts.length} prompts)`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('Generating book prompt-refs...\n');

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load prompts
  const prompts = loadPrompts('content');
  const bookPrompts = getBookPrompts(prompts);

  console.log(`Found ${bookPrompts.length} prompts with book configuration\n`);

  // Generate combined file
  const allRefs = generateAllPromptRefs(bookPrompts);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'prompt-refs.md'), allRefs);
  console.log(`✓ prompt-refs.md (all chapters)\n`);

  // Generate per-chapter files
  generateChapterFiles(bookPrompts);

  // Summary
  const byChapter = new Map<number, number>();
  for (const p of bookPrompts) {
    byChapter.set(p.chapter, (byChapter.get(p.chapter) || 0) + 1);
  }

  console.log('\n--- Summary ---');
  for (const [ch, count] of Array.from(byChapter.entries()).sort((a, b) => a[0] - b[0])) {
    console.log(`Chapter ${ch}: ${count} prompts`);
  }
  console.log(`\nTotal: ${bookPrompts.length} prompt-refs generated`);
}

main();
