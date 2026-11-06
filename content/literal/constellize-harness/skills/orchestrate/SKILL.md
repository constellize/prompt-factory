---
name: orchestrate
description: Main entry point for constellize. Assess project state, propose a plan, and execute it. Use when starting work on any project or resuming after a break.
allowed-tools: Read, Glob, Grep, Write, Bash
metadata:
  argument-hint: "[advisory|spawn]"
  model: sonnet
---

<task>
Orchestrate a constellize session by running the full flow: assess → plan → execute.

## Step 1: Assess

Run the assessor script from the project root:

```
node <skill-dir>/../../scripts/assess.mjs --format json
```

Requires Node 22.18+ (or 23.6+/24+).

Parse the JSON output and render a human-readable summary:

```
Project: <name> (<project-type>)
Branch: <branch> (<ahead> ahead, <behind> behind <default-branch>)

  Memory Bank:    <progress-bar>  <present>/<total> files <details>
  Construction:   <progress-bar>  <present>/<total> artifacts <next-step>
  Codebase:       <progress-bar>  <summary>
  Freshness:      <progress-bar>  <summary>

  Flags: <comma-separated flags>
```

Progress bars use filled (█) and empty (░) blocks, 10 characters wide.

Then ask: "What are you trying to do?"

Offer options based on the situation:
- If greenfield or brownfield: "(A) Start building from scratch"
- If mid-build: "(A) Continue building where I left off"
- If stale-docs: "(A) Refresh documentation to match current state"
- Always: "(B) Add a new feature"
- Always: "(C) Fix a bug or respond to an incident"
- Always: "(D) Get oriented — I'm new to this project"
- Always: "(E) Something else"

## Step 2: Plan

Based on the user's chosen intent, map to a skill sequence using this routing table:

**Greenfield + "Start building":**
1. constellize-harness:init
2. constellize-memory:establish
3. constellize-design:business-problem
4. constellize-design:vision-statement
5. constellize-design:ecosystem-map
6. constellize-design:constellation-map
7. constellize-design:gap-analysis
8. constellize-design:lock-constellation
9. constellize-design:implementation-sketch
10. constellize-design:code-generation-plan

**Brownfield + "Start building" or "Get oriented":**
1. constellize-harness:init
2. constellize-memory:establish (pre-populate from codebase scan)
3. constellize-harness:assess --deep

**Stale docs + "Refresh documentation":**
1. constellize-memory:triage-salvageable-knowledge
2. constellize-memory:recover-staleness
3. constellize-memory:update

**Mid-build + "Continue building":**
Resume at the next missing construction artifact. Filter out completed steps based on artifact presence in `llm/construction/design/`.

**Any situation + "Add a new feature":**
1. constellize-feature:specify
2. constellize-feature:implement
3. constellize-feature:verify

Resume at the step the feature's status implies: `unknown` or no status starts at specify, SPECIFIED goes to implement, IMPLEMENTED and `VERIFIED (unsubstantiated)` go to verify. VERIFIED needs nothing unless code changed since, then re-run verify.

**Any situation + "Fix a bug or incident":**
1. constellize-deliver:incident-investigation
2. (user fixes the issue)
3. constellize-deliver:incident-postmortem
4. constellize-memory:update

**Any situation + "Get oriented":**
1. constellize-grow:first-week
2. constellize-harness:assess
3. constellize-memory:update

**Maintenance (stable codebase, complete docs):**
1. constellize-grow:health-assessment
2. constellize-craft:dependency-hygiene
3. constellize-grow:grow-organically

Present the plan:

```
Based on: <situation>, <intent>

Proposed plan:
  1. <plugin>:<skill>  — <one-line reason>
  2. <plugin>:<skill>  — <one-line reason>
  ...

Approve this plan? (y/edit/n)
```

If "edit", let the user modify. If "n", stop. If "y", proceed to execute.

## Step 3: Execute

For each step in the approved plan, in advisory mode (default):

1. Present the step:
```
Step <n> of <total>: <skill description>
  /<plugin>:<skill> <arguments>

Press enter when done, or 's' to skip.
```

2. Wait for user to confirm or skip.

3. After completion, verify expected artifacts were produced.

4. Update `llm/memory-bank/activeContext.md` with progress.

On completion, present summary:
```
Orchestration complete: <completed>/<total> steps

Completed:
  ✓ Step 1: <skill>
  ✓ Step 2: <skill>
  ⊘ Step 3: <skill> (skipped)

Next steps: <recommendations>
```

If spawn mode is requested, inform user it is Phase 2 and offer advisory mode instead.
</task>
