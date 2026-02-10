# Book Editor System Prompt (Reference)

A comprehensive system prompt for editing the Constellize book during its first author preview stage.

**Note:** This is a reference example showing how to create a well-structured system prompt following guidelines.md principles. It's not part of the `create-prompt` tool, but demonstrates best practices used in prompt generation.

## Files

- **`book-editor-system-prompt.md`** - The complete system prompt with CAPITALIZATION and XML tags (~3,200 tokens)
- **`REFINEMENT-PROCESS.md`** - Evolution of the prompt showing improvements made
- **`book-editor-metadata.json`** - Structured metadata about the prompt
- **`book-editor-usage.md`** - Detailed usage guide with examples
- **`README.md`** - This file

## Quick Start

### Load the System Prompt

Copy the contents of **`book-editor-system-prompt.md`** into your LLM's system prompt field, then provide chapter sections to edit.

The prompt uses strategic CAPITALIZATION and XML tags for effective AI instruction-following (see REFINEMENT-PROCESS.md for details).

### Example

**Your message:**
```
Please edit this section from Chapter 3 for clarity and consistency.

[paste section here]
```

**AI will respond with:**
- Issues found (categorized)
- Suggested changes with rationale
- Before/after comparisons
- Complete revised section

## Purpose

This prompt enables AI-assisted editing that:
- ✓ Maintains the author's conversational tone
- ✓ Fixes typos, grammar, and clarity issues
- ✓ Ensures terminology consistency
- ✓ Preserves the Australian-flavored understatement
- ✗ Avoids large structural changes
- ✗ Doesn't rewrite the author's voice

## Design

Built using strategic CAPITALIZATION and XML tag structure for maximum effectiveness. See `REFINEMENT-PROCESS.md` for the evolution of this approach.

## Key Features

### Tone Preservation
Maintains the book's established style:
- Conversational but precise
- Grounded in real practice
- Cautious and considered
- Direct and confident
- No hype or marketing speak

### Focus Areas
1. **Consistency** - Terminology, capitalization, examples
2. **Clarity** - Unclear references, logical flow
3. **Precision** - Vague terms, unsupported claims
4. **Polish** - Typos, grammar, phrasing

### Structured Feedback
Edits include:
- Categorized issues
- Before/after comparisons
- Clear rationale for each change
- Severity indicators

## Recommended Models

- **Primary:** Claude Opus 4, Claude Sonnet 4
- **Supported:** Claude Sonnet 3.5, GPT-4, GPT-4 Turbo

Requires strong instruction-following and tone preservation capabilities.

## Token Usage

- **System Prompt:** ~2,850 tokens
- **Typical Session:** ~8,000 tokens total (varies by chapter length)

## Guidelines Compliance

This prompt follows all principles from `guidelines.md`:

✓ **Context Economy** - Comprehensive but necessary
✓ **Structural Clarity** - Clear sections, headers, examples
✓ **Concrete Examples** - Multiple before/after samples
✓ **Behavioral Guidance** - Explicit do's and don'ts
✓ **Error Prevention** - Anti-patterns addressed
✓ **Tone Awareness** - Preserves author voice

## Usage Patterns

### Light Edit
```
"Quick polish - typos and grammar only"
```

### Full Edit
```
"Comprehensive edit: consistency, clarity, precision, and polish"
```

### Consistency Check
```
"Check this chapter for consistent use of 'Memory Bank' terminology"
```

### Tone Verification
```
"Does this section maintain our conversational but precise tone?"
```

## Context Requirements

The prompt references:
- Book location: `/Users/satkinson/Work/constellize/book/`
- Tone guide: `tone.md`
- Chapter files: `ch1.md` through `ch9.md`
- Running example: CodePromptu

## Success Metrics

A good edit:
- Improves clarity by 10%
- Fixes all typos and consistency issues
- Maintains the author's unique voice
- Feels like a polished version of the same text

## See Also

- **Usage Guide:** `book-editor-usage.md` for detailed examples
- **Metadata:** `book-editor-metadata.json` for structured info
- **Guidelines:** `../../guidelines.md` for prompt engineering principles
- **Workflow:** `../../WORKFLOW.md` for the larger context

---

**Created:** 2026-01-11
**Status:** Ready for use
