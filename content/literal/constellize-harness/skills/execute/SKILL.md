---
name: execute
description: Execute an approved plan of constellize skills step by step.
allowed-tools: Read, Glob, Grep, Write, Bash
metadata:
  argument-hint: "[advisory|spawn]"
  model: sonnet
---

<task>
Execute the approved plan from the plan skill.

The user specifies the mode:
- **advisory** (default): Present each step as a command to run manually
- **spawn**: Execute each step via `claude -p` (Phase 2 — not yet implemented)

**Advisory mode flow:**

For each step in the plan:

1. Present the step:
```
Step <n> of <total>: <skill description>
  /<plugin>:<skill> <arguments>

Press enter when done, or 's' to skip.
```

2. Wait for the user to confirm completion or skip.

3. After the step completes, verify the expected artifact was produced:
   - For design skills: check that the corresponding file exists in `llm/construction/design/`
   - For memory skills: check that memory bank files were updated
   - For craft skills: check that test files exist

4. Update `llm/memory-bank/activeContext.md` with progress after each completed step.

5. Move to the next step.

**On completion:**
- Run `constellize-memory:update` to capture the session
- Present a summary of what was accomplished:
```
Orchestration complete: <completed>/<total> steps

Completed:
  ✓ Step 1: <skill>
  ✓ Step 2: <skill>
  ⊘ Step 3: <skill> (skipped)

Next steps: <recommendations based on current state>
```

**Spawn mode (Phase 2):**
When implemented, each step will execute via:
```bash
claude -p "/<plugin>:<skill> <args>" \
  --allowed-tools "Read,Glob,Grep,Write,Bash" \
  --max-budget-usd 1.00
```

For now, if spawn mode is requested, inform the user it is not yet available and offer advisory mode instead.
</task>
