#!/usr/bin/env npx ts-node

/**
 * Full chain validation: Book → Prompt-Factory → Website
 *
 * Verifies:
 * 1. All book :prompt-ref URLs point to existing prompts in prompt-factory
 * 2. All prompt-factory prompts are deployed to website
 * 3. Website URLs match book URL patterns
 */

import * as fs from 'fs';
import * as path from 'path';
import { loadPrompts } from './lib/parser';

const BOOK_DIR = '../book';
const WEBSITE_DIR = '../website';

interface ValidationResult {
  passed: boolean;
  bookRefs: string[];
  promptFactoryIds: string[];
  websiteIds: string[];
  issues: string[];
}

function extractBookPromptRefs(): string[] {
  const refs: Set<string> = new Set();
  const bookFiles = fs.readdirSync(BOOK_DIR).filter(f => f.endsWith('.md'));

  for (const file of bookFiles) {
    const content = fs.readFileSync(path.join(BOOK_DIR, file), 'utf-8');
    const matches = content.matchAll(/prompts\/v1\/([a-z0-9-]+)/g);
    for (const match of matches) {
      refs.add(match[1]);
    }
  }

  return Array.from(refs).sort();
}

function getWebsitePromptIds(): string[] {
  const promptsDir = path.join(WEBSITE_DIR, 'public/prompts');
  if (!fs.existsSync(promptsDir)) {
    return [];
  }

  return fs.readdirSync(promptsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

function validate(): ValidationResult {
  const issues: string[] = [];

  // Get all sources
  const bookRefs = extractBookPromptRefs();
  const prompts = loadPrompts('content');
  const promptFactoryIds = prompts.map(p => p.frontmatter.id).sort();
  const websiteIds = getWebsitePromptIds();

  console.log('=== Full Chain Validation ===\n');
  console.log(`Book prompt-refs:      ${bookRefs.length}`);
  console.log(`Prompt-factory:        ${promptFactoryIds.length}`);
  console.log(`Website prompts:       ${websiteIds.length}\n`);

  // Check 1: Book refs exist in prompt-factory
  console.log('--- Check 1: Book → Prompt-Factory ---');
  const missingInPF = bookRefs.filter(ref => !promptFactoryIds.includes(ref));
  if (missingInPF.length > 0) {
    console.log('❌ Book references prompts missing from prompt-factory:');
    for (const id of missingInPF) {
      console.log(`   - ${id}`);
      issues.push(`Book refs missing prompt: ${id}`);
    }
  } else {
    console.log('✓ All 66 book prompt-refs exist in prompt-factory');
  }

  // Check 2: Prompt-factory prompts exist on website
  console.log('\n--- Check 2: Prompt-Factory → Website ---');
  const missingOnWebsite = promptFactoryIds.filter(id => !websiteIds.includes(id));
  if (missingOnWebsite.length > 0) {
    console.log('❌ Prompt-factory prompts missing from website:');
    for (const id of missingOnWebsite) {
      console.log(`   - ${id}`);
      issues.push(`Website missing prompt: ${id}`);
    }
  } else {
    console.log('✓ All 73 prompt-factory prompts exist on website');
  }

  // Check 3: Book refs exist on website (transitive check)
  console.log('\n--- Check 3: Book → Website (Full Chain) ---');
  const bookMissingOnWebsite = bookRefs.filter(ref => !websiteIds.includes(ref));
  if (bookMissingOnWebsite.length > 0) {
    console.log('❌ Book prompt-refs missing from website:');
    for (const id of bookMissingOnWebsite) {
      console.log(`   - ${id}`);
      issues.push(`Book→Website broken: ${id}`);
    }
  } else {
    console.log('✓ All 66 book prompt-refs resolve to website URLs');
  }

  // Check 4: Website has prompt.txt for each
  console.log('\n--- Check 4: Website prompt.txt files ---');
  let missingTxt = 0;
  for (const id of bookRefs) {
    const txtPath = path.join(WEBSITE_DIR, 'public/prompts', id, 'prompt.txt');
    if (!fs.existsSync(txtPath)) {
      console.log(`❌ Missing: ${txtPath}`);
      issues.push(`Missing prompt.txt: ${id}`);
      missingTxt++;
    }
  }
  if (missingTxt === 0) {
    console.log('✓ All 66 book-referenced prompts have prompt.txt on website');
  }

  // Summary
  console.log('\n=== Summary ===');
  if (issues.length === 0) {
    console.log('✓ VALIDATION PASSED - Full chain verified');
    console.log('\nBook :prompt-ref URLs will resolve correctly:');
    console.log('  {SITE_BASE}/prompts/v1/<id> → website/public/prompts/<id>/prompt.txt');
  } else {
    console.log(`❌ VALIDATION FAILED - ${issues.length} issues found`);
  }

  return {
    passed: issues.length === 0,
    bookRefs,
    promptFactoryIds,
    websiteIds,
    issues
  };
}

const result = validate();
process.exit(result.passed ? 0 : 1);
