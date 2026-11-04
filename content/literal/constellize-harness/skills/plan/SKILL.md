---
name: plan
description: Propose a sequence of constellize skills based on project assessment and user intent. Use after running assess to get an actionable plan.
allowed-tools: Read, Glob, Grep, Bash
metadata:
  argument-hint: "[intent]"
  model: sonnet
---

<task>
Given the project assessment and the user's stated intent, propose an ordered sequence of constellize skills to execute.

First, run the assessor if no recent assessment is available:

```
node <skill-dir>/../../scripts/assess.mjs --format json
```

Requires Node 22.18+ (or 23.6+/24+).

Then map the situation + intent to a skill sequence using this routing table:

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
1. constellize-design:gap-analysis (feature-scoped)
2. constellize-design:implementation-sketch
3. constellize-design:code-generation-plan
4. constellize-craft:unit-tests
5. constellize-craft:integration-tests
6. constellize-memory:update

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

Present the plan in this format:

```
Based on: <situation>, <intent>

Proposed plan:
  1. <plugin>:<skill>  — <one-line reason>
  2. <plugin>:<skill>  — <one-line reason>
  ...

Approve this plan? (y/edit/n)
```

If the user says "edit", let them remove, reorder, or add steps. If "y", output the finalized plan as a numbered list that the orchestrate skill can consume.
</task>
