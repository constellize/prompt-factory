# Prompt Factory

A system for generating effective AI prompts from book content, following best practices from Anthropic's context engineering research and Cline's modular prompt architecture.

> **Quick Reference:** See [CURRENT-STATE.md](./CURRENT-STATE.md) for what's working now and what's next.

## Project Goal

Extract prompts being written into a book, merge them with existing prompts in `../constellize/website-starter`, and provide tooling to later prune prompts that aren't mentioned in the final book. This maintains sync between the book content and the website's prompt collection.

**Current website-starter structure:** TypeScript-based prompts organized by chapter in `src/data/prompts/`

## System Overview

```
Book Markdown → Extract Prompts → Validate → Merge with Existing → Update website-starter
     ↓              ↓                 ↓              ↓                      ↓
  Chapters     Parse & Convert    Check Quality   Dedupe & Combine    TypeScript files
  being edited   to TS format    (guidelines.md)  (by ID)             src/data/prompts/
```

**Later:** Prune unused prompts based on final book content

## Core Principles

Based on `guidelines.md`, all prompts follow these principles:

1. **Context Economy** - Minimal viable token sets, no redundancy
2. **Structural Clarity** - Clear sections, appropriate list types
3. **Precision & Examples** - Concrete code examples, positive/negative patterns
4. **Behavioral Guidance** - Strategic emphasis, structured thinking
5. **Context-Awareness** - Dynamic adaptation to runtime conditions
6. **Modularity** - Composable, reusable components
7. **Tool Design** - Self-contained, clear purpose, token-efficient
8. **Iteration Strategy** - Start minimal, add based on failures

## Architecture

### Components

1. **Source Material**
   - Book content (provided by user)
   - Domain-specific knowledge
   - Examples and use cases

2. **Context Extractor**
   - Identifies relevant sections from books
   - Summarizes key concepts
   - Extracts examples and patterns
   - Maintains token economy

3. **Prompt Templates**
   - Reusable prompt structures
   - Model-specific variants (inspired by Cline architecture)
   - Component-based assembly
   - Placeholder system for dynamic content

4. **Prompt Builder**
   - Assembles templates + context
   - Validates against guidelines
   - Optimizes for token efficiency
   - Generates multiple variants

5. **Output Collection**
   - Organized prompt library
   - Metadata (purpose, model, tokens)
   - Usage documentation
   - Test cases

### Directory Structure

```
prompt-factory/
├── README.md                    # This file
├── PROMPT-WRITER-USAGE.md       # Complete usage guide
├── guidelines.md                # Prompt engineering best practices
├── PROMPT-GENERATION-PREFERENCES.md  # How to write good prompts
├── bin/
│   └── create-prompt           # Main tool
├── src/
│   └── harness/
│       └── prompt-writer-harness.ts
├── prompts/                    # Generated prompts go here
│   ├── ch1/
│   ├── ch2/
│   └── ch5/
│       ├── ch5-*-prompt.txt
│       ├── ch5-*-book-markdown.md
│       └── ch5-*-metadata.json
└── examples/
    └── prompt-output/          # Test outputs
```

## Integration with website-starter

### Target Location
```
../constellize/website-starter/prompts/
```

### Output Format
Each prompt will include:
- **prompt.md** - The actual prompt text
- **metadata.json** - Purpose, tags, model recommendations, token count
- **examples.md** - Usage examples and expected outputs
- **tests.json** - Test cases for validation

### Integration Workflow
```bash
# Build prompts
npm run build:prompts

# Validate output
npm run validate

# Copy to website-starter
npm run deploy:constellize
```

## Prompt Categories

Based on common use cases with book content:

### 1. **Comprehension Prompts**
- Summarize chapters
- Explain concepts
- Extract key insights
- Compare ideas

### 2. **Application Prompts**
- Apply concepts to problems
- Generate examples
- Create exercises
- Build implementations

### 3. **Analysis Prompts**
- Critical analysis
- Pattern recognition
- Cross-reference ideas
- Synthesize concepts

### 4. **Interactive Prompts**
- Q&A about content
- Socratic dialogue
- Guided exploration
- Progressive disclosure

### 5. **Creative Prompts**
- Generate analogies
- Create visualizations
- Develop scenarios
- Build narratives

## Quick Start

### Create Prompts for Your Book

You're writing the Constellize book and want to add prompts as examples for readers.

**Step 1: Create a prompt**

```bash
npm run create-prompt -- \
  --purpose "Identify service boundaries for microservices architecture" \
  --chapter "Chapter 5" \
  --category "Architecture" \
  --useCase "When designing a microservices system" \
  --tags "microservices,boundaries,design" \
  --output ./prompts/ch5
```

**Step 2: Review generated files**
- `ch5-identify-service-boundaries-...-prompt.txt` - Raw prompt
- `ch5-identify-service-boundaries-...-book-markdown.md` - **Ready to paste into book**
- `ch5-identify-service-boundaries-...-metadata.json` - For extraction later

**Step 3: Paste into your chapter**

Copy the markdown file into your chapter where you want the prompt example.

**Full documentation:** See [PROMPT-WRITER-USAGE.md](./PROMPT-WRITER-USAGE.md)

---

## Development Workflow

### Phase 1: Foundation (Current)
- [x] Create guidelines.md from Anthropic + Cline wisdom
- [ ] Define project structure
- [ ] Create basic template system
- [ ] Build first proof-of-concept prompt

### Phase 2: Builder System
- [ ] Implement context extractors
- [ ] Create template engine
- [ ] Build prompt assembler
- [ ] Add validation system

### Phase 3: Prompt Library
- [ ] Generate core prompts
- [ ] Test with real book content
- [ ] Iterate based on results
- [ ] Document usage patterns

### Phase 4: Integration
- [ ] Format for website-starter
- [ ] Create deployment scripts
- [ ] Add integration tests
- [ ] Document integration process

## Design Decisions

### Why Modular Architecture?
Following Cline's pattern, we use composable components because:
- Easy to test individual parts
- Can optimize per model/use case
- Simple to add new prompt types
- Clear separation of concerns

### Why Focus on Guidelines?
Anthropic's research shows that:
- Context economy is critical for performance
- Structure matters more than verbosity
- Examples are more effective than descriptions
- Iteration beats perfection on first try

### Why Multiple Variants?
Different models need different prompts:
- Claude Opus 4: Can handle complex, detailed instructions
- Smaller models: Need concise, focused guidance
- Specialized models: Benefit from domain-specific optimization

## Usage Examples

### Creating a New Prompt

```javascript
// Example: Create a "Summarize Chapter" prompt
const prompt = await promptBuilder
  .template('comprehension/summarize')
  .context(bookChapter)
  .variant('claude-opus-4')
  .build();

// Save to output
await prompt.save('output/constellize/summarize-chapter.md');
```

### Using Book Content

```javascript
// Extract relevant context from book
const context = await extractor
  .fromBook('./content/books/software-architecture.md')
  .chapter(5)
  .extract(['key-concepts', 'examples', 'patterns']);

// Build prompt with extracted context
const prompt = await promptBuilder
  .template('analysis/patterns')
  .context(context)
  .build();
```

## Quality Standards

All prompts must:
- [ ] Follow guidelines.md principles
- [ ] Include concrete examples
- [ ] Be token-efficient
- [ ] Have clear structure
- [ ] Be model-appropriate
- [ ] Include test cases
- [ ] Have usage documentation

## Next Steps

1. **Immediate:**
   - Design template system
   - Create first prompt template
   - Test with sample book content

2. **Short-term:**
   - Build context extraction tools
   - Implement prompt builder
   - Generate initial prompt collection

3. **Long-term:**
   - Integration with website-starter
   - Automated testing pipeline
   - Continuous improvement based on usage

## Context Restoration

To restore context in a new session:

1. Read this README.md for project overview
2. Review guidelines.md for prompt engineering principles
3. Check PROJECT.md for detailed design decisions
4. Look at prompts/ directory for examples
5. Review recent git commits for latest changes

## Related Documentation

- `guidelines.md` - Comprehensive prompt engineering guidelines
- `PROJECT.md` - Detailed design and architecture (to be created)
- `../constellize/website-starter` - Integration target

---

*This project combines Anthropic's context engineering research with Cline's modular architecture to create effective, maintainable prompts for book-based AI interactions.*
