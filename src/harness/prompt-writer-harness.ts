import * as fs from 'fs';
import * as path from 'path';

interface PromptInput {
  purpose: string;              // What the prompt does
  chapter: string;              // e.g., "Chapter 5"
  category: string;             // e.g., "Architecture", "Analysis"
  useCase: string;              // When to use it
  context?: string;             // Additional context
  tags?: string[];              // Searchable tags
  id?: string;                  // Optional custom ID
  version?: string;             // Optional semantic version (e.g., 'v1')
  description?: string;         // Optional terse description for preview
}

interface PromptOutput {
  id: string;                   // Generated ID
  prompt: string;               // The actual prompt text
  bookMarkdown: string;         // Formatted for book inclusion (full prompt)
  previewCallout: string;       // Preview callout for referencing from other chapters
  metadata: PromptMetadata;     // For later extraction
}

interface PromptMetadata {
  id: string;
  version: string;              // Semantic version (e.g., 'v1') - used in book URLs
  dateVersion: string;          // Date-based version (e.g., '20260113') - for website mapping
  chapter: string;
  category: string;
  purpose: string;
  useCase: string;
  tags: string[];
  created: string;
}

/**
 * Prompt Writer Harness
 *
 * Helps create well-formatted prompts that will be included in the book,
 * following guidelines.md best practices.
 */
export class PromptWriterHarness {
  private guidelinesPath: string;

  constructor(guidelinesPath?: string) {
    this.guidelinesPath = guidelinesPath ||
      path.join(__dirname, '../../PROMPT-GENERATION-PREFERENCES.md');
  }

  /**
   * Generate a prompt based on input
   */
  generate(input: PromptInput): PromptOutput {
    const id = this.generateId(input);
    const prompt = this.buildPrompt(input);
    const bookMarkdown = this.formatForBook(input, prompt);
    const previewCallout = this.formatPreviewCallout(id, input, prompt);
    const metadata = this.buildMetadata(id, input);

    return {
      id,
      prompt,
      bookMarkdown,
      previewCallout,
      metadata
    };
  }

  /**
   * Generate a unique ID for the prompt
   */
  private generateId(input: PromptInput): string {
    // Use custom ID if provided
    if (input.id) {
      return input.id;
    }

    // Otherwise auto-generate from chapter and purpose
    const chapterNum = input.chapter.match(/\d+/)?.[0] || 'misc';
    const slug = input.purpose
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50);

    return `ch${chapterNum}-${slug}`;
  }

  /**
   * Build the actual prompt text following guidelines
   */
  private buildPrompt(input: PromptInput): string {
    const sections: string[] = [];

    // Add context if provided
    if (input.context) {
      sections.push(`<context>\n${input.context}\n</context>\n`);
    }

    // Main instruction
    sections.push(`<task>\n${input.purpose}\n</task>\n`);

    // Add structure based on use case
    if (input.useCase.toLowerCase().includes('analysis')) {
      sections.push(this.buildAnalysisStructure());
    } else if (input.useCase.toLowerCase().includes('design') ||
               input.useCase.toLowerCase().includes('architecture')) {
      sections.push(this.buildDesignStructure());
    } else if (input.useCase.toLowerCase().includes('review') ||
               input.useCase.toLowerCase().includes('evaluate')) {
      sections.push(this.buildReviewStructure());
    }

    // Add thinking framework
    sections.push(`<thinking>
Before responding:
1. Analyze the current situation
2. Consider constraints and trade-offs
3. Identify potential approaches
4. Evaluate pros and cons
</thinking>`);

    return sections.join('\n\n');
  }

  /**
   * Build analysis prompt structure
   */
  private buildAnalysisStructure(): string {
    return `<output-format>
Provide your analysis in this structure:

1. **Current State**
   - What exists today
   - Key characteristics
   - Constraints

2. **Analysis**
   - Strengths
   - Weaknesses
   - Opportunities for improvement

3. **Recommendations**
   - Specific actions
   - Expected benefits
   - Implementation considerations
</output-format>`;
  }

  /**
   * Build design/architecture prompt structure
   */
  private buildDesignStructure(): string {
    return `<output-format>
Provide your design proposal in this structure:

1. **Design Approach**
   - Core architectural decisions
   - Key components or services
   - Rationale for choices

2. **Trade-offs**
   - Benefits of this approach
   - Limitations or costs
   - Alternative approaches considered

3. **Implementation Guidance**
   - Recommended first steps
   - Critical dependencies
   - Success criteria
</output-format>`;
  }

  /**
   * Build review/evaluation prompt structure
   */
  private buildReviewStructure(): string {
    return `<output-format>
Provide your evaluation in this structure:

1. **Assessment**
   - What works well
   - What needs improvement
   - Critical issues

2. **Specific Feedback**
   - Issue 1: Description and suggested fix
   - Issue 2: Description and suggested fix
   - [Continue as needed]

3. **Overall Recommendation**
   - Summary judgment
   - Priority improvements
   - Long-term considerations
</output-format>`;
  }

  /**
   * Format the prompt for inclusion in the book
   */
  private formatForBook(input: PromptInput, prompt: string): string {
    const title = this.generateTitle(input.purpose);

    return `<!-- PROMPT START -->
> **Prompt: ${title}**
>
> **Purpose:** ${input.purpose}
>
> **Use when:** ${input.useCase}
>
> **Category:** ${input.category}

\`\`\`
${prompt}
\`\`\`

<!-- PROMPT END -->
<!-- METADATA: ${JSON.stringify({
  id: this.generateId(input),
  chapter: input.chapter,
  category: input.category,
  tags: input.tags || []
})} -->`;
  }

  /**
   * Generate a human-readable title
   */
  private generateTitle(purpose: string): string {
    // Capitalize first letter of each word, keep it concise
    return purpose
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .slice(0, 60) // Max 60 chars
      .replace(/\.$/, ''); // Remove trailing period
  }

  /**
   * Format a preview callout for referencing this prompt from other chapters
   */
  private formatPreviewCallout(id: string, input: PromptInput, prompt: string): string {
    const title = this.generateTitle(input.purpose);

    // Extract content from <task> tag for unique, meaningful preview
    const promptLines = prompt.split('\n');
    const previewLines: string[] = [];
    let lineCount = 0;
    let inTask = false;

    for (const line of promptLines) {
      // Detect <task> boundaries
      if (line.trim().startsWith('<task>')) {
        inTask = true;
        continue;
      }
      if (line.trim().startsWith('</task>')) {
        break;
      }

      // Extract content from within <task> tags only
      if (inTask && line.trim() && lineCount < 2) {
        previewLines.push(line.trim());
        lineCount++;
      }
      if (lineCount >= 2) break;
    }

    const preview = previewLines.join(' ');
    const semanticVersion = input.version || 'v1';
    const description = input.description || input.purpose;

    return `::: {.promptref title="${title}" url="{SITE_BASE}/prompts/${semanticVersion}/${id}"}
${description}

"${preview}..."
:::`;
  }

  /**
   * Build metadata for later extraction
   */
  private buildMetadata(id: string, input: PromptInput): PromptMetadata {
    const semanticVersion = input.version || 'v1';
    const dateVersion = new Date().toISOString().split('T')[0].replace(/-/g, '');

    return {
      id,
      version: semanticVersion,      // e.g., 'v1' - used in book URLs
      dateVersion: dateVersion,       // e.g., '20260113' - for website mapping
      chapter: input.chapter,
      category: input.category,
      purpose: input.purpose,
      useCase: input.useCase,
      tags: input.tags || [],
      created: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Save output to files
   */
  saveOutput(output: PromptOutput, outputDir: string): void {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save prompt text (raw)
    fs.writeFileSync(
      path.join(outputDir, `${output.id}-prompt.txt`),
      output.prompt
    );

    // Save book markdown (ready to paste - full prompt)
    fs.writeFileSync(
      path.join(outputDir, `${output.id}-book-markdown.md`),
      output.bookMarkdown
    );

    // Save preview callout (for referencing from other chapters)
    fs.writeFileSync(
      path.join(outputDir, `${output.id}-preview-callout.md`),
      output.previewCallout
    );

    // Save metadata (for extraction)
    fs.writeFileSync(
      path.join(outputDir, `${output.id}-metadata.json`),
      JSON.stringify(output.metadata, null, 2)
    );

    console.log(`✅ Prompt created: ${output.id}`);
    console.log('');
    console.log('Files saved:');
    console.log(`  - ${output.id}-prompt.txt          (raw prompt)`);
    console.log(`  - ${output.id}-book-markdown.md    (paste full prompt into chapter)`);
    console.log(`  - ${output.id}-preview-callout.md  (reference from other chapters)`);
    console.log(`  - ${output.id}-metadata.json       (for extraction)`);
    console.log('');
    console.log('Next steps:');
    console.log(`  1. Review ${output.id}-book-markdown.md`);
    console.log('  2. Paste into your chapter (full prompt)');
    console.log(`  3. Use ${output.id}-preview-callout.md to reference from other chapters`);
    console.log('  4. Adjust as needed for context');
  }
}

/**
 * CLI interface
 */
export async function runPromptWriter(args: {
  purpose?: string;
  chapter?: string;
  category?: string;
  useCase?: string;
  context?: string;
  tags?: string;
  output?: string;
}) {
  const harness = new PromptWriterHarness();

  // Validate required fields
  if (!args.purpose) {
    throw new Error('--purpose is required');
  }
  if (!args.chapter) {
    throw new Error('--chapter is required (e.g., "Chapter 5")');
  }
  if (!args.category) {
    throw new Error('--category is required (e.g., "Architecture", "Analysis")');
  }
  if (!args.useCase) {
    throw new Error('--useCase is required (e.g., "When designing microservices")');
  }

  // Parse tags
  const tags = args.tags ? args.tags.split(',').map(t => t.trim()) : [];

  // Generate prompt
  const output = harness.generate({
    purpose: args.purpose,
    chapter: args.chapter,
    category: args.category,
    useCase: args.useCase,
    context: args.context,
    tags
  });

  // Save or print
  if (args.output) {
    harness.saveOutput(output, args.output);
  } else {
    console.log('=== BOOK MARKDOWN (paste into your chapter) ===');
    console.log(output.bookMarkdown);
    console.log('');
    console.log('=== RAW PROMPT ===');
    console.log(output.prompt);
  }
}

// CLI entry point
if (require.main === module) {
  const args = require('minimist')(process.argv.slice(2));

  runPromptWriter(args).catch(error => {
    console.error('Error:', error.message);
    console.error('');
    console.error('Usage: create-prompt \\');
    console.error('  --purpose "Description of what this prompt does" \\');
    console.error('  --chapter "Chapter 5" \\');
    console.error('  --category "Architecture" \\');
    console.error('  --useCase "When designing microservices" \\');
    console.error('  --tags "microservices,boundaries,design" \\');
    console.error('  --output ./output');
    process.exit(1);
  });
}
