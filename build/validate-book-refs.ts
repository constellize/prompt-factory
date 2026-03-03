#!/usr/bin/env npx ts-node

/**
 * Validate book prompt references against prompt-factory content
 *
 * Checks:
 * 1. All book :prompt-ref URLs point to existing prompts
 * 2. Reports prompts not referenced in the book
 */

import * as fs from 'fs';
import * as path from 'path';
import { loadPrompts } from './lib/parser';

const BOOK_DIR = '../book';

interface ValidationResult {
  bookRefs: string[];
  promptFactoryIds: string[];
  missingInPromptFactory: string[];
  notReferencedInBook: string[];
}

function extractBookPromptRefs(): string[] {
  const refs: Set<string> = new Set();

  // Read all markdown files in book directory
  const bookFiles = fs.readdirSync(BOOK_DIR)
    .filter(f => f.endsWith('.md'));

  for (const file of bookFiles) {
    const content = fs.readFileSync(path.join(BOOK_DIR, file), 'utf-8');

    // Match pattern: prompts/v1/{prompt-id}
    const matches = content.matchAll(/prompts\/v1\/([a-z0-9-]+)/g);
    for (const match of matches) {
      refs.add(match[1]);
    }
  }

  return Array.from(refs).sort();
}

function validate(): ValidationResult {
  // Get book references
  const bookRefs = extractBookPromptRefs();

  // Get prompt-factory prompts
  const prompts = loadPrompts('content');
  const promptFactoryIds = prompts.map(p => p.frontmatter.id).sort();

  // Find mismatches
  const missingInPromptFactory = bookRefs.filter(ref => !promptFactoryIds.includes(ref));
  const notReferencedInBook = promptFactoryIds.filter(id => !bookRefs.includes(id));

  return {
    bookRefs,
    promptFactoryIds,
    missingInPromptFactory,
    notReferencedInBook
  };
}

function main() {
  console.log('Validating book prompt references...\n');

  if (!fs.existsSync(BOOK_DIR)) {
    console.error(`Book directory not found: ${BOOK_DIR}`);
    process.exit(1);
  }

  const result = validate();

  console.log(`Book references: ${result.bookRefs.length}`);
  console.log(`Prompt-factory prompts: ${result.promptFactoryIds.length}\n`);

  // Report missing in prompt-factory (critical errors)
  if (result.missingInPromptFactory.length > 0) {
    console.log('❌ BROKEN REFS - Book references prompts that do not exist:');
    for (const ref of result.missingInPromptFactory) {
      console.log(`   - ${ref}`);
    }
    console.log('');
  } else {
    console.log('✓ All book references point to existing prompts\n');
  }

  // Report prompts not in book (informational)
  if (result.notReferencedInBook.length > 0) {
    console.log('ℹ Prompts not referenced in book:');
    for (const id of result.notReferencedInBook) {
      console.log(`   - ${id}`);
    }
    console.log('');
  }

  // Exit with error if there are broken refs
  if (result.missingInPromptFactory.length > 0) {
    console.log('--- VALIDATION FAILED ---');
    process.exit(1);
  }

  console.log('--- VALIDATION PASSED ---');
}

main();
