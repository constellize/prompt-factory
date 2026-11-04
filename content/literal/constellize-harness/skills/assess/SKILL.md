---
name: assess
description: Evaluate project state and present findings. Use when starting work on any project, resuming after a break, or getting oriented in an unfamiliar codebase.
allowed-tools: Read, Glob, Grep, Bash
metadata:
  argument-hint: "[--deep]"
  model: sonnet
---

<task>
Assess the current project state and present a readable profile.

Run the assessor script from the project root:

```
node <skill-dir>/../../scripts/assess.mjs --format json
```

Requires Node 22.18+ (or 23.6+/24+).

Parse the JSON output and render a human-readable summary following this format:

```
Project: <name> (<project-type>)
Branch: <branch> (<ahead> ahead, <behind> behind <default-branch>)

  Memory Bank:    <progress-bar>  <present>/<total> files <details>
  Construction:   <progress-bar>  <present>/<total> artifacts <next-step>
  Codebase:       <progress-bar>  <summary>
  Freshness:      <progress-bar>  <summary>

  Flags: <comma-separated flags>
```

Progress bars use filled blocks and empty blocks, 10 characters wide. Scale proportionally (e.g., 3/6 = 5 filled, 5 empty).

After presenting the summary, ask the user:

"What are you trying to do?"

Offer options based on the flags and situation detected:

- If greenfield or brownfield: "(A) Start building from scratch"
- If mid-build: "(A) Continue building where I left off"
- If stale-docs: "(A) Refresh documentation to match current state"
- Always include: "(B) Add a new feature"
- Always include: "(C) Fix a bug or respond to an incident"
- Always include: "(D) Get oriented — I'm new to this project"
- Always include: "(E) Something else"

Do NOT take any action beyond presenting the assessment and asking the question. This skill is purely diagnostic.
</task>
