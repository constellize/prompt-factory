# Constellize Generation Guide

This document explains how to generate all outputs from the prompt-factory source of truth.

## Overview

**prompt-factory** is the single source of truth for:
- **73 prompts** with editorial descriptions for book, website, and marketplace
- **12 aggregate personas** for website and marketplace

All other repositories consume generated content from prompt-factory.

## Quick Start

```bash
cd prompt-factory

# Generate everything
npm run generate:all

# Validate book references
npm run validate:book
```

## Generation Commands

| Command | Output | Destination |
|---------|--------|-------------|
| `npm run generate:website` | 73 prompts + 12 personas | `../website/public/` |
| `npm run generate:marketplace` | 69 skills + 12 agents | `../marketplace/plugins/` |
| `npm run generate:book` | 66 prompt-ref blocks | `../book/generated/` |
| `npm run generate:all` | All of the above | All destinations |
| `npm run validate:book` | Validation report | Console output |

## What Gets Generated

### Website (`../website/`)

```
public/prompts/<id>/prompt.txt       # 73 prompt files
public/personas/<cat>/<sub>/*.md     # 12 aggregate personas
src/data/prompts/generated-metadata.json
src/data/personas/generated-metadata.ts
```

### Marketplace (`../marketplace/`)

```
plugins/<plugin-id>/
  .claude-plugin/plugin.json
  skills/<skill-id>/SKILL.md         # 69 skills total
  agents/<agent-id>.md               # 12 agents total
```

### Book (`../book/`)

```
generated/
  prompt-refs.md                     # All 66 prompt-refs combined
  ch1-prompt-refs.md                 # Chapter 1 (1 prompt)
  ch2-prompt-refs.md                 # Chapter 2 (1 prompt)
  ch3-prompt-refs.md                 # Chapter 3 (5 prompts)
  ch4-prompt-refs.md                 # Chapter 4 (24 prompts)
  ch5-prompt-refs.md                 # Chapter 5 (11 prompts)
  ch6-prompt-refs.md                 # Chapter 6 (4 prompts)
  ch7-prompt-refs.md                 # Chapter 7 (8 prompts)
  ch8-prompt-refs.md                 # Chapter 8 (7 prompts)
  ch9-prompt-refs.md                 # Chapter 9 (5 prompts)
```

## Full Sync Workflow

When editing prompts, follow this workflow to keep everything in sync:

### 1. Edit Source Content

```bash
cd prompt-factory

# Edit a prompt (includes book description/preview)
vim content/prompts/04-quality/write-unit-tests.md
```

### 2. Validate Book References

```bash
npm run validate:book
```

Expected output:
```
✓ All book references point to existing prompts
```

### 3. Generate All Outputs

```bash
npm run generate:all
```

### 4. Commit All Repositories

```bash
# prompt-factory
git add . && git commit -m "Update prompt content"
git push

# website
cd ../website
git add . && git commit -m "Regenerate from prompt-factory"
git push

# marketplace
cd ../marketplace
git add . && git commit -m "Regenerate from prompt-factory"
git push

# book (if prompt-refs changed)
cd ../book
git add generated/ && git commit -m "Regenerate prompt-refs"
git push
```

## Prompt Frontmatter Structure

Each prompt in `content/prompts/` has this structure:

```yaml
---
id: write-unit-tests
name: Write comprehensive unit tests
chapter: 4
category: quality

skill:                              # Claude Code marketplace
  description: ...
  allowed-tools: [Read, Write, Bash]
  model: sonnet

outputs:
  book:                             # Book prompt-ref content
    chapter: 4
    description: |
      **Write comprehensive unit tests** that cover...
    preview: |
      "...validate behavior in isolation..."
  website:
    include: true
  marketplace:
    plugin: constellize-quality
---
[Actual prompt content]
```

## Book Prompt-Ref Format

Generated prompt-refs use this format (matching existing book style):

```markdown
::: {.promptref title="Prompt Title" url="{SITE_BASE}/prompts/v1/prompt-id"}
**Bold opening** followed by editorial description tailored to chapter context.

"...preview excerpt with ellipsis showing selected content from actual prompt..."
:::
```

## Validation

### Book → Prompt-Factory → Website Chain

The validation script ensures all links work:

```
Book chapter (:prompt-ref URL)
    ↓
prompt-factory/content/prompts/<id>.md
    ↓
website/public/prompts/<id>/prompt.txt
```

Run validation:
```bash
npm run validate:book
```

### Current Status

| Source | Count | Status |
|--------|-------|--------|
| Book prompt-refs | 66 | ✓ All valid |
| Prompt-factory prompts | 73 | Source of truth |
| Website prompts | 73 | ✓ Generated |
| Marketplace skills | 69 | ✓ Generated |

7 prompts not in book (internal tools):
- `book-editor-constellize`, `book-review`, `generate-prompt` (meta)
- `business-problem`, `ecosystem-map`, `specification` (candidates for future chapters)

## Adding New Prompts

1. Create prompt file in `content/prompts/<category>/<id>.md`
2. Add full frontmatter including `outputs.book` if referenced in book
3. Run `npm run generate:all`
4. If adding to book, add `:prompt-ref` block to chapter or use generated file
5. Run `npm run validate:book` to verify

## Troubleshooting

### YAML Parse Error
If you see YAML errors, check for unquoted colons in values:
```yaml
# Bad
name: Something: with colon

# Good
name: "Something: with colon"
```

### Missing Book Description
If `generate:book` shows 0 prompts, ensure the prompt has:
```yaml
outputs:
  book:
    chapter: N
    description: |
      ...
    preview: |
      ...
```

### Validation Fails
If `validate:book` fails, a book chapter references a prompt that doesn't exist.
Check the prompt ID in the `:prompt-ref` URL matches a file in `content/prompts/`.
