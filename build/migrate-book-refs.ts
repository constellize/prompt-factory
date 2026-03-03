#!/usr/bin/env npx ts-node

/**
 * Migration script to extract :prompt-ref content from book chapters
 * and add to prompt-factory frontmatter as outputs.book
 *
 * Extracts:
 * - chapter number (from filename)
 * - description (editorial text)
 * - preview (quoted text with ellipsis)
 *
 * Updates prompt files with outputs.book section
 */

import * as fs from 'fs';
import * as path from 'path';

const BOOK_DIR = '../book';
const PROMPTS_DIR = 'content/prompts';

interface BookRef {
  promptId: string;
  title: string;
  chapter: number;
  description: string;
  preview: string;
  sourceFile: string;
}

interface ExtractionResult {
  refs: BookRef[];
  errors: string[];
}

/**
 * Extract all :prompt-ref blocks from book markdown files
 */
function extractBookRefs(): ExtractionResult {
  const refs: BookRef[] = [];
  const errors: string[] = [];

  const bookFiles = fs.readdirSync(BOOK_DIR)
    .filter(f => f.match(/^ch\d+\.md$/));

  for (const file of bookFiles) {
    const chapterMatch = file.match(/^ch(\d+)\.md$/);
    if (!chapterMatch) continue;

    const chapter = parseInt(chapterMatch[1], 10);
    const content = fs.readFileSync(path.join(BOOK_DIR, file), 'utf-8');

    // Match ::: {.promptref ...} blocks
    const blockRegex = /:::\s*\{\.promptref\s+title="([^"]+)"\s+url="[^"]*\/prompts\/v1\/([^"]+)"\}\s*([\s\S]*?):::/g;

    let match;
    while ((match = blockRegex.exec(content)) !== null) {
      const [, title, promptId, blockContent] = match;

      // Split content into description and preview
      // Preview is the last paragraph, usually starts with "...
      const paragraphs = blockContent.trim().split(/\n\n+/);

      let description = '';
      let preview = '';

      if (paragraphs.length >= 2) {
        // Last paragraph is preview (in quotes)
        preview = paragraphs[paragraphs.length - 1].trim();
        // Everything else is description
        description = paragraphs.slice(0, -1).join('\n\n').trim();
      } else if (paragraphs.length === 1) {
        // Single paragraph - check if it's a preview (starts with ")
        const single = paragraphs[0].trim();
        if (single.startsWith('"')) {
          preview = single;
        } else {
          description = single;
        }
      }

      refs.push({
        promptId,
        title,
        chapter,
        description,
        preview,
        sourceFile: file
      });
    }
  }

  return { refs, errors };
}

/**
 * Find prompt file by ID
 */
function findPromptFile(promptId: string): string | null {
  const categories = fs.readdirSync(PROMPTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const category of categories) {
    const categoryPath = path.join(PROMPTS_DIR, category);
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'));

    for (const file of files) {
      if (file === `${promptId}.md`) {
        return path.join(categoryPath, file);
      }
    }
  }

  return null;
}

/**
 * Update prompt file with book outputs
 */
function updatePromptFile(filePath: string, bookRef: BookRef): boolean {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find the outputs section or create one
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`  ✗ No frontmatter found: ${filePath}`);
    return false;
  }

  const frontmatter = frontmatterMatch[1];
  const bodyContent = content.slice(frontmatterMatch[0].length);

  // Build the new book output section
  const bookOutput = `  book:
    chapter: ${bookRef.chapter}
    description: |
${bookRef.description.split('\n').map(line => `      ${line}`).join('\n')}
    preview: |
${bookRef.preview.split('\n').map(line => `      ${line}`).join('\n')}`;

  let newFrontmatter: string;

  // Check if there's an existing book: section to replace
  const existingBookMatch = frontmatter.match(/  book:\n(?:    [^\n]+\n)*/);

  if (existingBookMatch) {
    // Replace existing book section
    newFrontmatter = frontmatter.replace(existingBookMatch[0], bookOutput + '\n');
  } else if (frontmatter.includes('outputs:')) {
    // Add book to existing outputs before website/marketplace
    if (frontmatter.includes('  website:')) {
      newFrontmatter = frontmatter.replace(
        /(outputs:\n)([\s\S]*?)(  website:)/,
        `$1${bookOutput}\n$3`
      );
    } else if (frontmatter.includes('  marketplace:')) {
      newFrontmatter = frontmatter.replace(
        /(outputs:\n)([\s\S]*?)(  marketplace:)/,
        `$1${bookOutput}\n$3`
      );
    } else {
      newFrontmatter = frontmatter.replace(
        /(outputs:\n)/,
        `$1${bookOutput}\n`
      );
    }
  } else {
    // Create outputs section at end of frontmatter
    newFrontmatter = frontmatter + `\noutputs:\n${bookOutput}`;
  }

  const newContent = `---\n${newFrontmatter}\n---${bodyContent}`;
  fs.writeFileSync(filePath, newContent);

  return true;
}

/**
 * Generate report of extraction
 */
function generateReport(refs: BookRef[]): void {
  console.log('\n=== Extraction Report ===\n');

  // Group by chapter
  const byChapter = new Map<number, BookRef[]>();
  for (const ref of refs) {
    const list = byChapter.get(ref.chapter) || [];
    list.push(ref);
    byChapter.set(ref.chapter, list);
  }

  for (const [chapter, chapterRefs] of Array.from(byChapter.entries()).sort((a, b) => a[0] - b[0])) {
    console.log(`Chapter ${chapter}: ${chapterRefs.length} prompt-refs`);
    for (const ref of chapterRefs) {
      console.log(`  - ${ref.promptId}`);
    }
  }

  console.log(`\nTotal: ${refs.length} prompt-refs across ${byChapter.size} chapters`);
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reportOnly = args.includes('--report');

  console.log('Extracting book prompt-refs...\n');

  if (!fs.existsSync(BOOK_DIR)) {
    console.error(`Book directory not found: ${BOOK_DIR}`);
    process.exit(1);
  }

  const { refs, errors } = extractBookRefs();

  if (reportOnly) {
    generateReport(refs);
    return;
  }

  console.log(`Found ${refs.length} prompt-refs in book\n`);

  let updated = 0;
  let notFound = 0;
  let skipped = 0;

  for (const ref of refs) {
    const promptFile = findPromptFile(ref.promptId);

    if (!promptFile) {
      console.log(`✗ Prompt not found: ${ref.promptId}`);
      notFound++;
      continue;
    }

    if (dryRun) {
      console.log(`Would update: ${ref.promptId} (ch${ref.chapter})`);
      console.log(`  Description: ${ref.description.slice(0, 60)}...`);
      console.log(`  Preview: ${ref.preview.slice(0, 60)}...`);
      updated++;
    } else {
      if (updatePromptFile(promptFile, ref)) {
        console.log(`✓ Updated: ${ref.promptId} (ch${ref.chapter})`);
        updated++;
      } else {
        skipped++;
      }
    }
  }

  console.log('\n--- Migration Summary ---');
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Not found: ${notFound}`);

  if (dryRun) {
    console.log('\n(Dry run - no files modified)');
  }
}

main();
