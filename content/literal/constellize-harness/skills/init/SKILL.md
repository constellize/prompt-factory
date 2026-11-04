---
name: init
description: Scaffold the llm/ directory structure for a project. Use when starting a new project or adding constellize to an existing codebase.
allowed-tools: Read, Glob, Grep, Write, Bash
metadata:
  model: sonnet
---

<task>
Scaffold the llm/ directory structure for this project.

First, run the assessor to understand the current state:

Run this from the project root:
```
node <skill-dir>/../../scripts/assess.mjs --format json
```

Requires Node 22.18+ (or 23.6+/24+).

Where `<skill-dir>` is the directory containing this SKILL.md file.

Then create any missing directories and template files under `llm/`:

1. **Create directory structure** (skip any that already exist):
   - `llm/memory-bank/`
   - `llm/construction/design/`
   - `llm/construction/requirements/`
   - `llm/construction/archive/`
   - `llm/features/`

2. **Create memory bank template files** (skip any that already exist):
   - `llm/memory-bank/projectbrief.md` — project objectives, requirements, scope
   - `llm/memory-bank/productContext.md` — why this project exists, user needs, success metrics
   - `llm/memory-bank/systemPatterns.md` — architecture, design patterns, technical decisions
   - `llm/memory-bank/techContext.md` — technologies, setup, constraints, dependencies
   - `llm/memory-bank/activeContext.md` — current focus, recent changes, next steps
   - `llm/memory-bank/progress.md` — completed work, known issues, timeline

   Each template file should have a heading matching its purpose and placeholder sections for the user to fill in.

3. **Pre-populate techContext.md** using assessment data:
   - Detected languages
   - Package manager
   - Project type (application/library/monorepo)
   - CI/CD presence

4. **Report what was created** — list new directories and files, note any that were skipped because they already existed.

This skill is idempotent — safe to run multiple times. It fills gaps without overwriting existing content.
</task>
