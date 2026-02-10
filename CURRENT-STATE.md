# Prompt Factory - Current State

**Last Updated:** 2026-01-11

## What's Working Now

### ✅ Prompt Writer Tool

**Purpose:** Create well-formatted prompts to include as examples in your book chapters.

**Command:**
```bash
npm run create-prompt -- \
  --purpose "What the prompt does" \
  --chapter "Chapter X" \
  --category "Architecture|Analysis|Design|Review" \
  --useCase "When to use it" \
  --tags "tag1,tag2" \
  --output ./prompts/chX
```

**Output:**
- Raw prompt text (with XML tags, following guidelines)
- Book-ready markdown (paste directly into chapter)
- Metadata JSON (for later extraction)

**Documentation:** [PROMPT-WRITER-USAGE.md](./PROMPT-WRITER-USAGE.md)

**Status:** ✅ Complete and tested

---

## What's Next

### 🔄 Prompt Extractor

**Purpose:** Parse finished book chapters, find all prompts (marked with `<!-- PROMPT START -->`), extract them with metadata.

**Will output:** JSON file with all prompts found in book

**Status:** Not started

---

### 🔄 Merge System

**Purpose:** Take extracted prompts and merge them with existing `../constellize/website-starter/src/data/prompts/` files.

**Output:** Updated TypeScript files in website-starter

**Status:** Not started

---

### 🔄 Pruning Tool

**Purpose:** After book is finalized, remove prompts from website-starter that aren't mentioned in the book.

**Status:** Not started

---

## File Structure

```
prompt-factory/
├── bin/
│   └── create-prompt           ✅ Working
├── prompts/                    ✅ Generated outputs go here
│   ├── ch1/
│   ├── ch2/
│   └── ch5/
├── examples/
│   └── prompt-output/          ✅ Test example
├── PROMPT-WRITER-USAGE.md      ✅ Complete documentation
├── guidelines.md               ✅ Prompt engineering principles
└── PROMPT-GENERATION-PREFERENCES.md  ✅ Best practices
```

---

## Workflow Today

1. **Create prompts for your book**
   ```bash
   npm run create-prompt -- [options]
   ```

2. **Review generated markdown**
   ```bash
   cat prompts/chX/chX-*-book-markdown.md
   ```

3. **Paste into chapter**
   - Open your book chapter
   - Paste the markdown where you want the prompt example

4. **Repeat** as you write more chapters

---

## Workflow Tomorrow (After Extractor/Merger Built)

1. **Write book** with prompts included ✅ (using create-prompt)

2. **Extract prompts** from finished book
   ```bash
   npm run extract -- --book ../constellize/book --output ./extracted
   ```

3. **Merge into website-starter**
   ```bash
   npm run merge -- \
     --extracted ./extracted \
     --website ../constellize/website-starter \
     --output ../constellize/website-starter/src/data/prompts
   ```

4. **Later: Prune unused**
   ```bash
   npm run prune -- \
     --book ../constellize/book \
     --website ../constellize/website-starter
   ```

---

## Key Documentation

| File | Purpose |
|------|---------|
| **PROMPT-WRITER-USAGE.md** | Complete guide to create-prompt tool |
| **guidelines.md** | Prompt engineering principles (Anthropic + Cline) |
| **PROMPT-GENERATION-PREFERENCES.md** | Best practices (CAPITALIZATION, XML tags) |
| **README.md** | Project overview |
| **CONTEXT.md** | Quick context restoration |
| **PROJECT.md** | Original detailed design doc |
| **WORKFLOW.md** | Full book → website workflow |

---

## What Was Removed

- ~~edit-book tool~~ - Not needed (was for editing prose with Claude)
- ~~book-editor-harness~~ - Not part of main workflow
- ~~HARNESS-USAGE.md~~ - Related to removed tool

---

## Quick Test

```bash
# Create a test prompt
npm run create-prompt -- \
  --purpose "Identify service boundaries for microservices" \
  --chapter "Chapter 5" \
  --category "Architecture" \
  --useCase "When designing microservices systems" \
  --tags "microservices,boundaries" \
  --output ./prompts/test

# Check output
ls prompts/test/
cat prompts/test/*-book-markdown.md
```

---

**Status:** Phase 1 complete (Prompt Writer)
**Next:** Phase 2 (Prompt Extractor)
