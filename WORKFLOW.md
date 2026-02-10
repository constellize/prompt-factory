# Prompt Factory - Actual Workflow

## The Real Story

You are **editing a book** and **adding specific prompts throughout different chapters**. The goal is to:

1. **Keep existing prompts** in website-starter (they're already there and working)
2. **Add new prompts** that you're writing into the book chapters
3. **Later, prune** to keep only prompts actually mentioned in the final book

## Current State

### Existing Prompts in website-starter

**Location:** `/Users/satkinson/Work/constellize/website-starter/src/data/prompts/`

**Structure:**
```
src/data/prompts/
├── chapter-1-2.ts
├── chapter-3.ts
├── chapter-4.ts
├── chapter-5.ts
├── chapter-6.ts
├── chapter-7.ts
├── constellize-practices.ts
├── requirements-engineering.ts
└── index.ts
```

**Format (TypeScript):**
```typescript
export interface Prompt {
  id: string;                    // unique identifier
  category: string;              // e.g., 'Understanding', 'Application'
  chapter: string;               // e.g., 'Chapter 1 & 2: Understanding...'
  prompt: string;                // the actual prompt text
  description?: string;          // optional longer description
  purpose: string;               // why use this prompt
  recommendedPersona?: string;   // e.g., 'requirements_analysts'
  useCase: string;               // when to use it
  scenario?: string;             // detailed scenario
  tags: string[];                // searchable tags
}
```

**Example:**
```typescript
export const chapter1_2Prompts: Prompt[] = [
  {
    id: 'understanding-problem-summary',
    category: 'Understanding',
    chapter: 'Chapter 1 & 2: Understanding the Problem and Method',
    prompt: 'Can you summarize the current problem statement, highlighting known constraints and assumptions?',
    purpose: 'Clarify the problem space and identify assumptions before building',
    recommendedPersona: 'requirements_analysts',
    useCase: 'Project kickoff, requirements gathering',
    scenario: 'Use this when starting a new feature or project to ensure shared understanding of the problem',
    tags: ['problem-definition', 'requirements', 'assumptions', 'constraints']
  }
];
```

## What We Need to Build

### Phase 1: Extract Prompts from Book

**Input:** Book markdown files with prompts written in chapters

**Expected Format in Book:**
You're adding prompts throughout chapters. They might look like:

```markdown
## Chapter 5: Architecture Patterns

When working with microservices, you can use this prompt:

> **Prompt: Identify Service Boundaries**
>
> Based on the requirements, suggest logical service boundaries that would
> minimize coupling and maximize cohesion.
>
> **Use when:** Starting microservices architecture
> **Category:** Architecture
> **Tags:** microservices, boundaries, design
```

**Tool Needed:** Extract these prompts from markdown and convert to TypeScript format

### Phase 2: Merge with Existing

**Process:**
1. Read existing prompts from website-starter
2. Read new prompts from book
3. Merge (keeping both, avoiding duplicates by ID)
4. Generate new TypeScript files
5. Update index.ts with new imports

**Output:** Updated website-starter with old + new prompts

### Phase 3: Prune (Later)

**Process:**
1. Scan final book content for all prompt references
2. Get list of prompt IDs actually mentioned
3. Remove prompts from website-starter that aren't mentioned
4. Clean up unused chapter files
5. Update index.ts

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Book Being Edited (Markdown)                                │
│ ├── Chapter 1.md  ← Contains prompt examples               │
│ ├── Chapter 2.md  ← Contains prompt examples               │
│ └── Chapter 3.md  ← Contains prompt examples               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Prompt Extractor   │  ← Find & parse prompts from markdown
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Format Converter   │  ← Convert to TypeScript Prompt format
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Validator          │  ← Check against guidelines.md
         └────────┬───────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Existing Prompts (website-starter/src/data/prompts/)       │
│ ├── chapter-1-2.ts                                          │
│ ├── chapter-3.ts                                            │
│ └── ...                                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ ┌────────────────────┐
                  ├─┤ New Prompts        │
                  │ │ from Book          │
                  │ └────────────────────┘
                  ▼
         ┌────────────────────┐
         │ Merge Engine       │  ← Combine, dedupe by ID
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ TypeScript Generator│  ← Generate .ts files
         └────────┬───────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Updated website-starter/src/data/prompts/                  │
│ ├── chapter-1-2.ts  (merged)                                │
│ ├── chapter-3.ts    (merged)                                │
│ ├── chapter-8.ts    (new!)                                  │
│ └── index.ts        (updated imports)                       │
└─────────────────────────────────────────────────────────────┘

                  │ Later, after book finalized...
                  ▼
         ┌────────────────────┐
         │ Pruning Tool       │  ← Remove unused prompts
         └────────┬───────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Final website-starter/src/data/prompts/                    │
│ (only prompts mentioned in book)                           │
└─────────────────────────────────────────────────────────────┘
```

## Tools Needed

### 1. Prompt Extractor (from Book)

**Purpose:** Find and extract prompts from markdown book chapters

**Features:**
- Parse markdown files
- Identify prompt blocks (various possible formats)
- Extract metadata (category, use case, tags)
- Generate unique IDs
- Map to chapter numbers

**Usage:**
```bash
npm run extract -- --book ./path/to/book --output ./output/extracted
```

### 2. Format Converter

**Purpose:** Convert extracted prompts to TypeScript format

**Features:**
- Take extracted prompt data (JSON)
- Generate TypeScript files matching website-starter format
- Group by chapter
- Maintain type safety

**Usage:**
```bash
npm run convert -- --input ./output/extracted --output ./output/typescript
```

### 3. Merge Tool

**Purpose:** Merge new prompts with existing website-starter prompts

**Features:**
- Read existing .ts files from website-starter
- Read new prompts
- Deduplicate by ID
- Merge maintaining chapter organization
- Update index.ts with new imports

**Usage:**
```bash
npm run merge -- \
  --existing ../constellize/website-starter/src/data/prompts \
  --new ./output/typescript \
  --output ../constellize/website-starter/src/data/prompts
```

### 4. Validator

**Purpose:** Ensure all prompts meet quality standards

**Features:**
- Check format compliance
- Validate against guidelines.md principles
- Check for duplicates
- Validate TypeScript syntax
- Ensure all required fields present

**Usage:**
```bash
npm run validate -- --prompts ../constellize/website-starter/src/data/prompts
```

### 5. Pruning Tool (Future)

**Purpose:** Remove prompts not mentioned in final book

**Features:**
- Scan book for prompt references
- Build list of used prompt IDs
- Remove unused prompts from website-starter
- Clean up empty chapter files
- Update index.ts

**Usage:**
```bash
npm run prune -- \
  --book ./path/to/book \
  --prompts ../constellize/website-starter/src/data/prompts \
  --dry-run  # preview changes first
```

## Implementation Priority

### Phase 1 (Immediate Need)
1. **Prompt Extractor** - Extract prompts from book markdown
2. **Format Converter** - Convert to TypeScript format
3. **Validator** - Ensure quality
4. **Merge Tool** - Combine with existing prompts

### Phase 2 (Later)
5. **Pruning Tool** - Remove unused prompts after book finalized
6. **Diff Tool** - Compare versions
7. **Report Generator** - Statistics on prompts

## Book Format Expectations

### Option 1: Structured Blocks

```markdown
<!-- PROMPT START -->
**ID:** architecture-service-boundaries
**Category:** Architecture
**Prompt:** Based on the requirements, suggest logical service boundaries...
**Purpose:** Identify microservice boundaries
**Use Case:** Starting microservices design
**Tags:** microservices, boundaries, design
<!-- PROMPT END -->
```

### Option 2: YAML Frontmatter

```markdown
---prompt
id: architecture-service-boundaries
category: Architecture
prompt: Based on the requirements, suggest logical service boundaries...
purpose: Identify microservice boundaries
useCase: Starting microservices design
tags: [microservices, boundaries, design]
---
```

### Option 3: Custom Markdown Extension

```markdown
:::prompt{#architecture-service-boundaries .Architecture}
Based on the requirements, suggest logical service boundaries...

**Purpose:** Identify microservice boundaries
**Use Case:** Starting microservices design
**Tags:** microservices, boundaries, design
:::
```

**Question for User:** Which format are you using (or planning to use) in your book?

## Directory Structure (Updated)

```
prompt-factory/
├── README.md
├── WORKFLOW.md           # This file
├── CONTEXT.md
├── PROJECT.md
├── guidelines.md
├── src/
│   ├── extractors/
│   │   ├── markdown-extractor.ts     # Extract from book markdown
│   │   └── prompt-parser.ts          # Parse different formats
│   ├── converters/
│   │   └── typescript-generator.ts   # Generate .ts files
│   ├── validators/
│   │   ├── format-validator.ts
│   │   └── guidelines-validator.ts
│   ├── merge/
│   │   ├── merge-engine.ts
│   │   └── deduplicator.ts
│   └── prune/
│       └── pruning-tool.ts
├── content/
│   └── book/                # Your book markdown files
│       ├── chapter-1.md
│       ├── chapter-2.md
│       └── ...
└── output/
    ├── extracted/           # Extracted prompts (JSON)
    ├── typescript/          # Generated .ts files
    └── reports/             # Validation reports
```

## Example Commands

### Extract prompts from book
```bash
npm run extract -- --book ./content/book --output ./output/extracted
```

### Validate extracted prompts
```bash
npm run validate -- --input ./output/extracted
```

### Convert to TypeScript
```bash
npm run convert -- --input ./output/extracted --output ./output/typescript
```

### Merge with existing (dry run first)
```bash
npm run merge -- \
  --existing ../constellize/website-starter/src/data/prompts \
  --new ./output/typescript \
  --dry-run

# After reviewing, actually merge
npm run merge -- \
  --existing ../constellize/website-starter/src/data/prompts \
  --new ./output/typescript \
  --output ../constellize/website-starter/src/data/prompts
```

### Future: Prune unused prompts
```bash
npm run prune -- \
  --book ./content/book \
  --prompts ../constellize/website-starter/src/data/prompts \
  --dry-run
```

## Next Steps

1. **Clarify book format:** What format are you using for prompts in the book?
2. **Provide sample:** Share a chapter or section with prompt examples
3. **Build extractor:** Create tool to extract from your specific format
4. **Test pipeline:** Extract → Convert → Validate → Merge
5. **Deploy:** Update website-starter with merged prompts

## Questions for You

1. What format are you using for prompts in your book markdown?
2. Can you share a sample chapter with some prompt examples?
3. How are chapters organized? (separate files, single file, etc.)
4. Do you want to review extracted prompts before merging?
5. Should we preserve existing prompt IDs or can we regenerate them?
