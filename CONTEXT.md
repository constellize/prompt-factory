# Quick Context Restoration

> **TL;DR:** Extract prompts from book being edited → Merge with existing website-starter prompts → Later prune to keep only book-mentioned prompts

## What We're Building

A **prompt factory** that:
1. **✅ Prompt writer** - Creates well-formatted prompts for book inclusion (DONE)
2. Extracts prompts from the finished book chapters
3. Merges them with existing prompts in `../constellize/website-starter`
4. Validates against guidelines from Anthropic + Cline
5. Provides tooling to prune prompts not mentioned in the book
6. Maintains sync between book content and website prompts

### Quick Start

```bash
npm run create-prompt -- \
  --purpose "Identify service boundaries for microservices" \
  --chapter "Chapter 5" \
  --category "Architecture" \
  --useCase "When designing microservices" \
  --output ./prompts/ch5
```

Then paste generated markdown into your chapter. See [PROMPT-WRITER-USAGE.md](./PROMPT-WRITER-USAGE.md)

## Key Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview, architecture, workflow |
| `PROJECT.md` | Detailed design, implementation plan, technical decisions |
| `guidelines.md` | Prompt engineering best practices (Anthropic + Cline) |
| `CONTEXT.md` | This file - quick restoration |

## Current Status

**Phase:** Foundation / Planning
**Last Session:** 2026-01-11

**Completed:**
- ✅ Created guidelines.md with Anthropic + Cline wisdom
- ✅ Documented project vision and architecture
- ✅ Defined integration target (../constellize/website-starter)
- ✅ Built prompt writer tool (create-prompt)
- ✅ Documented prompt generation preferences

**Next Steps:**
- [ ] Create prompt extractor (parses book chapters, finds prompts)
- [ ] Build merge system (combines with website-starter prompts)
- [ ] Create pruning tool (removes unused prompts)

## Core Concept - Actual Workflow

```
┌──────────────────────┐
│ Book Being Edited    │  ← You're adding prompts to chapters
│ (with prompt examples)│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Extract Prompts      │  ← Find prompts mentioned in book
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Existing Prompts     │  ← Current website-starter/prompts/
│ + New Book Prompts   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Validate & Format    │  ← Ensure quality, consistent format
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Merged Collection    │  ← All prompts in website-starter
└──────────┬───────────┘
           │
           │ (Later, after book finalized)
           ▼
┌──────────────────────┐
│ Prune                │  ← Keep only book-mentioned prompts
└──────────────────────┘
```

## Architecture Pattern

Based on **Cline's modular system**:
- **Registry** → Routes to right template
- **Variant** → Model-specific configs (Claude 4 vs Haiku vs GPT-4)
- **Components** → Reusable sections (ROLE, OBJECTIVE, INSTRUCTIONS, etc.)
- **Builder** → Assembles components + resolves placeholders
- **Validator** → Ensures quality

## Key Principles (from guidelines.md)

1. **Context Economy** - Treat tokens as finite, find minimal viable set
2. **Structural Clarity** - Clear sections, appropriate list types
3. **Concrete Examples** - Show don't tell, include negative examples
4. **Modularity** - Composable, reusable components
5. **Model-Aware** - Different prompts for different model capabilities

## Output Format

Each prompt → directory with 4 files:

```
output/constellize/comprehension/summarize-chapter/
├── prompt.md        # The actual prompt
├── metadata.json    # Model info, tokens, tags
├── examples.md      # Usage examples
└── tests.json       # Validation test cases
```

## Integration Target

```bash
../constellize/website-starter/prompts/
├── comprehension/
├── application/
├── analysis/
├── interactive/
└── creative/
```

## Prompt Categories

1. **Comprehension** - Summarize, explain, extract insights
2. **Application** - Apply concepts, generate examples, create exercises
3. **Analysis** - Critical analysis, pattern recognition, synthesis
4. **Interactive** - Q&A, Socratic dialogue, guided exploration
5. **Creative** - Analogies, visualizations, scenarios

## Example Usage (Future)

```javascript
// Extract context from book
const context = await extractor
  .fromBook('./content/books/clean-architecture.md')
  .chapter(5)
  .withExamples(2)
  .extract();

// Build prompt
const prompt = await builder
  .template('comprehension/summarize')
  .context(context)
  .variant('claude-opus-4')
  .build();

// Save for website-starter
await prompt.save('output/constellize/');
```

## Mental Model

Think of it as an **assembly line for prompts**:
- Input: Raw book content (potentially thousands of tokens)
- Extract: Smart extraction (reduce to essential context)
- Template: Pre-built structure (following best practices)
- Build: Assemble (components + context + placeholders)
- Validate: Quality check (against guidelines)
- Output: Production-ready prompt (optimized for target model)

## Design Inspiration

- **Anthropic's Context Engineering** → Token economy, progressive disclosure
- **Cline's Prompt Architecture** → Modular components, model variants
- **Builder Pattern** → Step-by-step construction, testable
- **Template Method** → Consistent placeholder resolution

## Quick Commands (Future)

```bash
# Generate all prompts
npm run build

# Generate specific category
npm run build:comprehension

# Validate prompts
npm run validate

# Deploy to website-starter
npm run deploy

# Test with sample book
npm run test:book ./content/books/example.md
```

## Important Constraints

- **Token Efficiency:** Aim for < 2000 tokens per prompt (standard)
- **Model Support:** Initially Claude Opus 4, Sonnet 4, Haiku 4
- **Validation:** Must pass all guidelines.md checks
- **Structure:** Clear sections, concrete examples, no vague language

## Related Projects

- `../constellize/website-starter` - Integration target
- Anthropic's Claude API - Primary model target
- Cline project - Architectural inspiration

## Questions to Resolve

1. How much book content per prompt? (balance context vs tokens)
2. Real-time extraction or pre-processing?
3. How will website-starter consume these? (static files? API?)
4. What quality metrics? (how to measure effectiveness?)

---

**To Restore Context:**
1. Read this file first (CONTEXT.md)
2. Check README.md for detailed overview
3. Review PROJECT.md for implementation details
4. Scan guidelines.md for prompt engineering principles
5. Look at directory structure to see progress

**Current Focus:** Phase 1 - Foundation (setting up basic infrastructure)
