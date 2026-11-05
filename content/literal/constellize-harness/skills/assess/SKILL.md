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

After the summary, when `dimensions.llmArtifacts.features.count` is above 0, add a Features table: one row per entry of `dimensions.llmArtifacts.features.features`, in the order given. Render what each entry says. Do not re-read the artifact files, and do not recompute a status: `status` is already derived from the evidence.

```
  Features:
    <name>   <status>   evidence: <evidence><gate detail>
```

- Print `status` exactly as given. `VERIFIED (unsubstantiated)` is the point of this table: put `!!` at the start of that row and say plainly that the artifact claims VERIFIED but its gate results do not back the claim.
- Decide the gate detail from `evidence`, never from the length of `missingGates` or `failedGates`; both are `[]` when evidence is `absent` or `malformed`, and an empty list there does not mean nothing is wrong.
  - `complete`: no detail.
  - `incomplete`: name `missingGates` as `gates not run: 1, 4` and `failedGates` as `gates failed: 2`, each only when non-empty, as two separate phrases. A gate that did not run and a gate that ran and failed are different facts; never merge them or call either one "missing". Print the numbers in the order given.
  - `absent`: `no gate results recorded`.
  - `malformed`: `gate results malformed (contradicts itself or cannot be read)`. A malformed artifact gets a row like any other; never omit it.
- A `status` of `unknown` means the artifact declares no recognised status. Report it as `unknown`.

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
