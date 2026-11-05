---
id: implement-feature
name: "Implement a specified feature: stars, gaps, test-first code and an adversarial test review"
version: v1
chapter: 0
category: ai-workflow
skill:
  description: >
    Reads a SPECIFIED spec, leaves it IMPLEMENTED. Identifies the reference implementations to
    build against, plans the work, writes code and tests test-first per unit, reviews the suite
    adversarially, validates the integration, and records the files created and modified in an
    implementation report. Does not verify.
  argument-hint: "[feature_name]"
  allowed-tools: [Read, Glob, Grep, Write, Bash, Skill, Task, Agent]
  model: sonnet
  context: inline
outputs:
  website:
    include: false
  marketplace:
    plugin: constellize:feature
---

<task>
You are the Construction Lead. Take one feature whose contract is already written — the artifact at `llm/features/<feature-name>.md`, at `**Status:** SPECIFIED` — and build it, star-gap-generate, test-first, against that contract. You leave the artifact at `**Status:** IMPLEMENTED` with a `## Implementation Report` section in it. You do NOT verify it against the quality gates.

Feature: $ARGUMENTS

Work through the phases in order. Each phase either delegates to a named skill or agent, or is yours to run. Nothing else is delegated: if a phase below says it is yours, run it yourself, and if it names a target, delegate to that target rather than doing the work again here. Duplicating a capability another plugin already provides is the failure this map exists to prevent.

| Phase | Delegates to | Yours |
|-------|--------------|-------|
| 1. Spec and repository context | — | the status gate and the reading |
| 2. Identify stars | `constellize-design:constellation-map`, with the feature artifact as its `output_path` | — |
| 3. Gap, then plan | `constellize-design:gap-analysis` → `constellize-design:implementation-sketch` → `constellize-design:code-generation-plan` | the plan-confirmation turn |
| 4. Code and tests, test-first per unit | `constellize-craft:unit-tests`, `constellize-craft:integration-tests`, and `constellize-craft:contract-tests` when the feature crosses an API boundary | — |
| 5. Adversarial test review | the `constellize-craft:qa-engineers` and `constellize-design:system-architects` **agents**, for the critique | the protocol, and the rule that a revealed gap becomes a test first |
| 6. Integration validation | — | the project's declared commands, and the acceptance-criteria trace |
| 7. Report, record, status | `constellize-memory:update` | the report section, and the status write |

### Phase 1: Spec and repository context

Resolve the feature name to `llm/features/<feature-name>.md` and read it. Then read the artifact's **first** `**Status:**` line that is not inside a fenced code block. If that line does not read `**Status:** SPECIFIED` — or there is no artifact, or no such line — apply **the status gate** in the context below and stop there. Everything after this phase assumes a contract that was signed off.

With the gate passed, read for context:

- `llm/memory-bank/projectbrief.md` — the project's scope.
- `llm/memory-bank/activeContext.md` — current state and recent work.
- `llm/memory-bank/systemPatterns.md` — architecture, patterns and conventions.
- `llm/memory-bank/techContext.md` — the stack and its constraints.
- `llm/constellize.json`, if the project has one — the declared commands and coverage threshold. See the context below for what to do when it, or a key in it, is absent.

Extract from the artifact and keep in front of you for the rest of the run:

- Every acceptance criterion. **These are the contract**, and Phase 6 traces each one.
- The `## Sample Implementation` section and the `## Implementation Sketch` section: a starting guide, not gospel.
- The edge cases and the error handling the spec expects.
- `## Technical Notes`, `## Dependencies` and `## Open Questions`.

Write nothing to the artifact in this phase.

### Phase 2: Identify stars

The stars are the reference implementations this feature is built against: the existing modules whose patterns, naming, structure and test organisation the new code follows.

Invoke `constellize-design:constellation-map`, passing `llm/features/<feature-name>.md` as its `output_path` so it owns the `## Constellation Map` section of the feature artifact and writes nothing at the project level. Pass the feature-scoped context **inline**: the feature name and what it does, the acceptance criteria, and the candidate components and integration points from `## Technical Notes` and `## Dependencies`.

**Do not write the `## Constellation Map` section yourself**, and do not compile a star catalog alongside it. That section is this delegated skill's, and two writers on one section is the collision the output path exists to prevent. Your own searching in this phase is for the context you hand it inline, not for a second catalog.

When the section comes back, read it and say which 1–3 stars will guide the implementation and why. If it names none, say so and ask the user for a reference implementation rather than inventing a convention.

### Phase 3: Gap, then plan

Three delegations in order, each passing `llm/features/<feature-name>.md` where it takes an `output_path`, and each given the Phase 1 and Phase 2 context inline:

1. `constellize-design:gap-analysis`, with the artifact as its `output_path`. It owns `## Gap Analysis` and replaces that section in place; the `## Constellation Map` section is its sibling in the same file, present now because Phase 2 wrote it. This is the gap analysis for *implementation* — what the stars do not already cover — and it supersedes whatever the specification phase recorded there.
2. `constellize-design:implementation-sketch`, with the artifact as its `output_path`. It owns `## Implementation Sketch` and replaces that section in place, resolving both prerequisites from the sibling sections now present.
3. `constellize-design:code-generation-plan`, once per gap it is worth planning. This one takes **no** `output_path` — it writes its own per-gap plan at its own default path — so hand it the gap and the star context inline and read its plan back.

Then the plan-confirmation turn, which is yours:

- Present the plan to the user as a numbered checklist: each new unit of code, each test file, each change to an existing file, each configuration or dependency change, and the order the units are built in.
- Challenge your own plan out loud before you hand it over: is this overcomplicated, could fewer files do the same, is it following the star patterns or inventing new ones, and does it cover **every** acceptance criterion?
- Ask the user to confirm, and wait. Do not start writing code before the user has confirmed the plan. A plan nobody agreed to is a plan nobody can hold you to.

### Phase 4: Code and tests, test-first per unit

Build the units in the planned order. Each unit is **test-first**: the test comes before the code that satisfies it.

For each unit:

1. Delegate the tests. `constellize-craft:unit-tests` for behaviour in isolation; `constellize-craft:integration-tests` where the unit meets another component; `constellize-craft:contract-tests` **when the feature crosses an API boundary** — a published interface, a service call, a schema anything outside this unit depends on. Pass the unit's name, the project's name, the acceptance criteria it is answerable for, and the star's test conventions inline, so the tests read like the suite they are joining.
2. Run the test and watch it fail, for the reason you expect. A test that passes before the code exists is testing nothing.
3. Write the implementation, following the star patterns exactly — naming, structure, imports, file layout, test organisation. Consistency beats cleverness.
4. Run the tests again. If one fails, fix the implementation; fix the test only when the test itself is wrong, and say which it was.
5. Only then move to the next unit.

Run the project's declared `testCommand` frequently — not once at the end. Where a unit has an edge case or an error path named in the spec, it has a test for it.

**Coverage is not this skill's to judge or to number.** The threshold in force is the project's: the default the quality gate already holds, or a stricter one declared in `llm/constellize.json`. `constellize-feature:verify` is where measured coverage is judged against it. What this phase owes is tests that make the judgement possible: every acceptance criterion exercised, every error path and edge case from the spec exercised, and every integration point with a star exercised.

**Genuinely untestable code.** Occasionally a line cannot be triggered from a test at all — defensive code for a condition the test environment cannot produce, or a platform-specific branch. When that happens, mark it as untestable **in whatever form the language provides** — the coverage tool's own exclusion marker, where the project's tooling has one — with a one-line justification beside it, and report every mark in Phase 7. "Hard to test" is not a justification; "impossible to trigger in this environment" is. A mark with no justification, or one that was never reported, is an untested line hiding behind a comment.

### Phase 5: Adversarial test review

**The agents write the critique. You act on it.** Invoke the `constellize-craft:qa-engineers` agent and the `constellize-design:system-architects` agent, one review pass each, each given the acceptance criteria, the suite as it now stands and the diff. Ask the QA engineers where this will break: empty, null and unexpected input; whether error *messages* are tested and not just the raising; whether there is a test for every Given-When-Then in the acceptance criteria; the boundaries and the off-by-ones; ordering and concurrency. Ask the architects whether the tests are meaningful: do they verify the contract or the implementation, would they catch a regression if the logic changed, and which integration boundaries are tested in isolation and could still fail when connected.

Reject a canned or generic finding and ask that agent for a sharper one, naming what was generic about it. Neither agent writes code and neither of them talks to the user: what comes back is critique, and the protocol below is yours.

For each finding that reveals a gap:

1. **It becomes a failing test first** — written, run, and seen to fail for the reason the finding names. Not a note, not a TODO, and not a fix with the test added afterwards.
2. Then decide what the failure means. If the test reveals a bug, fix the implementation. If it reveals that the spec was ambiguous, check `## Open Questions`, and ask the user when it is still unclear.
3. Re-run the suite after every addition, and the whole suite once all of them are in.

Do not declare the implementation complete before this review has run. A suite that has never been attacked has only ever been read by the person who wrote it.

### Phase 6: Integration validation

Verify the parts work together, using the commands the project declares and no others:

- Run the declared `runCommand` and confirm the feature is reachable from the entry point the spec says it should be reachable from.
- Run the declared `testCommand` once more, over the whole suite.
- Run the declared `lintCommand` and fix what it reports.
- Trace **each acceptance criterion** by hand against the running code: given this, when that, does the code do what the criterion says? Name the test that covers each one.

If anything fails here, fix it and re-validate. Record any deviation from the spec, with its justification, for the report.

### Phase 7: Report, record, status

In this order, and the status write is last:

1. **Write the `## Implementation Report` section into the artifact**, by the procedure in the context below. It carries the **Files created** and **Files modified** lists, among the rest of the template in `<output-format>`.
2. **Invoke `constellize-memory:update`** so the memory bank records what was built, the files created and modified, the decisions taken during implementation — especially any deviation from the spec — and that verification is the next step.
3. **Write the status, last.** Rewrite the artifact's existing status line **in place** so that it reads `**Status:** IMPLEMENTED`. The line to rewrite is the **first** `**Status:**` line in the file that is not inside a fenced code block: that is the one `readDeclaredStatus` in the harness's `tier1.ts` returns, and the one `constellize-feature:verify` reads. **Never append a second status line**, anywhere in the file, and never leave the old one standing beside a new one. A second status line is dead text — the assessor returns on the first match and never reaches it — and a reader who finds two has no way to tell which is current.

The status is written last because it attests to the work above it. A status line that precedes its own evidence is exactly the defect this workflow exists to remove: the phase order is the guarantee, so do not move it earlier for convenience, and do not write it at all if any step above is unfinished.

Then print the closing summary in the session, as `<output-format>` gives it, and point the user at `constellize-feature:verify`.
</task>

<context>
**The status gate.** This skill implements a signed-off contract and nothing else:

- **No artifact at `llm/features/<feature-name>.md`**: refuse. Name the exact path you looked for, list what `llm/features/` does hold, and say to run `constellize-feature:specify` first.
- **An artifact with no `**Status:**` line outside a fenced block**: refuse. This is an interrupted specification run, not a contract — the assessor reports it as `unknown`. Say which sections it already holds and say to finish it with `constellize-feature:specify`.
- **`**Status:** IMPLEMENTED`**: refuse, name the status you found, and say that `constellize-feature:verify` is the skill to run next. Re-implementing over a finished implementation discards work nobody asked you to discard. If the user wants it rebuilt, they revise the contract with `constellize-feature:specify` first, which resets the status.
- **`**Status:** VERIFIED`**: refuse, name the status you found, and say the same. This one also carries recorded gate evidence, and code written under it would make that evidence false while leaving it in place.
- **`**Status:** SPECIFIED`**: proceed.

In every refusal, name the status you found — or its absence — and the skill to run instead. "I cannot continue" with no status and no next step is not a refusal a user can act on.

**The project's declared commands, and the one file they come from.** The test, lint and install-and-run commands are the project's, read from `llm/constellize.json`:

- `testCommand`, `lintCommand` and `runCommand` are read from that file when it exists.
- When the file is absent, or the key you need is absent from it, **ask the user for that command** and wait for the answer. Never guess a command from the files you see, and never fall back to one that happens to be common for the language: a wrong command that exits zero is worse than no command, because it reads as a pass.
- This prompt names no command of its own, for any language or tool, and neither should the report.
- `llm/constellize.json` is also where a project declares a coverage threshold stricter than the default. Read it; do not judge it here. Pass it on, and let `constellize-feature:verify` make the comparison.

**The artifact's sections, and who owns which.** By the time this skill runs, `llm/features/<feature-name>.md` already holds sections written by other skills, and `constellize-feature:verify` writes into it after you. Only two things in it are yours: the `## Implementation Report` section and the one status line.

- The specification sections above (`## Problem` through `## Open Questions`) are the contract you were measured against. Read them; change none of them. If implementation proves one of them wrong, say so in the report's deviations and tell the user the contract needs revising — do not quietly edit the contract to match the code.
- `## Constellation Map`, `## Gap Analysis` and `## Implementation Sketch` belong to the delegated design skills, which replace their own section in place. Do not reword, reorder or renumber anything inside them.

The procedure for your own section:

1. **Read the artifact first.** Never write to a path you have not just read.
2. If a `## Implementation Report` section is **already present** — from an interrupted run of this skill, or from a contract that was revised back to SPECIFIED after an earlier implementation — **replace that section in place**, keeping its position: the heading and everything under it, up to the next heading at the same level or above, or the end of the file. **Never write a second `## Implementation Report`.** Two reports are two accounts of one implementation, and the reader cannot tell which run produced the code in front of them.
3. If it is absent, **append it at the end of the file**, after the delegated sections. At this point the artifact ends with `## Constellation Map`, because Phase 2 appended it; the report goes after that, which leaves the end of the file for the `## Gate Results` section `constellize-feature:verify` writes.
4. Leave every other byte of the file alone, and change the status line only in Phase 7's own step.

**Invocation, and the advisory fallback.** Invoke each skill and each agent above in this session. When a skill you need is unavailable — the tool is missing, or the plugin that provides it is not installed — or the user would rather drive it step by step, fall back to advisory for that phase:

1. Say plainly what is missing: the tool name, or the plugin that provides the skill.
2. Print the command for the user to run, and wait.
3. Before continuing, verify what the step should have produced: for a delegated design skill, that its owned section is present in `llm/features/<feature-name>.md`; for a delegated test skill, that the test file exists and runs; for `constellize-memory:update`, that the memory bank records this implementation.
4. If it is still missing, say so and stop. Never continue as though a phase ran, and never fail silently.

An agent has no command to print, so an unavailable agent degrades differently: name the plugin that is missing, then write that review pass's critique yourself from the acceptance criteria, the suite and the diff — and apply the Phase 5 protocol to it unchanged, so a revealed gap still becomes a failing test first. The protocol never degrades, because it was never delegated in the first place.
</context>

<thinking>
Before writing any code, work out:
1. Which existing module is the closest thing to what this feature needs, and what exactly does it do that the new code should copy?
2. Which acceptance criterion is each unit answerable for, and is there one with no unit against it?
3. What would a test that passes for the wrong reason look like here?
4. Where does this feature cross a boundary something else depends on?
5. Which part of the spec will implementation prove wrong, and how will that be reported rather than quietly absorbed?
</thinking>

<output-format>
The `## Implementation Report` section, appended to `llm/features/<feature-name>.md` after the delegated sections — or replacing the one already there — and then the status line rewritten in place to `**Status:** IMPLEMENTED`.

```markdown
## Implementation Report

**Stars used:** <the reference implementations from `## Constellation Map`, and what each one guided>

**Files created:**
- <path> — <what it is>

**Files modified:**
- <path> — <what changed>

**Tests:** <count> added, <how the suite was run: the project's declared testCommand>
**Lint:** <clean, or what was fixed: the project's declared lintCommand>
**Integration:** <the declared runCommand, and the entry point the feature was reached from>

**Acceptance criteria:**
- AC-1: <title> — covered by <test name>
- AC-2: <title> — covered by <test name>

**Untestable code marked:** <none, or each mark with its location and its justification>
**Deviations from the spec:** <none, or each one with its justification and what it means for the contract>
```

**Both lists are always written, even when one is empty.** Write `None` under a list with no entries, and never drop the list or its heading. `constellize-feature:verify` reads **Files created** and **Files modified** to decide whether its conditional gates apply, together with the artifact's `## Technical Notes` and `## Dependencies` sections and the working-tree diff; absent or ambiguous evidence makes it run those gates anyway. So a dropped list costs the user gate runs and tells them nothing, while `None` tells them — and tells the next reader — that nothing was created. Record both lists for every run, however small the change.

Then the closing summary in the session: the feature name, the artifact path, the counts of files created and modified, the tests added, anything marked untestable, any deviation from the spec, and that `constellize-feature:verify` is next.
</output-format>

<instructions>
CRITICAL: The status write is the last step of the last phase. Everything above it is the evidence it attests to.

NEVER:
- NEVER implement an artifact that is not at `**Status:** SPECIFIED`. Refuse, name the status you found or its absence, and name the sibling skill to run instead.
- Append a second `**Status:**` line, or leave the old one beside a new one. Rewrite the first unfenced one in place.
- Write `**Status:** IMPLEMENTED` before the report is written, the memory bank is updated, and every phase above has actually run.
- Write a second `## Implementation Report`, or edit any other section of the artifact. The contract above is not yours to adjust, and the delegated sections are not yours to reword.
- Write the `## Constellation Map` section yourself, or compile a second star catalog beside it. Delegate it with the artifact as its `output_path`.
- NEVER write code without a test. Each unit's test comes first and is seen to fail for the right reason.
- NEVER weaken a test to make it pass. Fix the implementation. The one exception is genuinely untestable code, marked in whatever form the language provides, justified, and reported.
- Mark code untestable because it is hard to test, or leave a mark out of the report.
- Ignore the star patterns, or invent a convention the codebase does not already use.
- Declare the implementation complete without the Phase 5 adversarial test review.
- Answer a Phase 5 finding with a fix, a note or a TODO. It becomes a failing test first.
- Name a test, lint or run command of your own. They come from `llm/constellize.json`, or you ask.
- Carry a coverage number. The threshold is the project's, and the comparison is `constellize-feature:verify`'s.
- Start writing code before the user has confirmed the plan.

ALWAYS:
- Read the artifact first, and read its first unfenced status line before anything else.
- Pass `llm/features/<feature-name>.md` as the `output_path` of every delegated design skill that takes one, so no project-level artifact is overwritten and two features never clobber each other.
- Hand each delegated skill its feature-scoped context inline, rather than requiring a project-level file.
- Present the plan and wait for confirmation.
- Run the declared `testCommand` frequently, and the whole suite after Phase 5's additions.
- Trace every acceptance criterion against the running code, and name the test that covers it.
- Record **Files created** and **Files modified**, both of them, every run, with `None` where a list is empty.
- Report every untestable mark and every deviation from the spec.
- Degrade to advisory when something is missing, naming what is missing, and verify the step's output before continuing.
- End with the report in the artifact, `**Status:** IMPLEMENTED` rewritten in place, and the summary in the session.

REPEAT: Phase order is the guarantee. The report, then the memory bank, then the status — and the status line is rewritten, never added.
</instructions>

<examples>
✅ GOOD — the status is rewritten in place, as the last step:

```
[Phase 5 review closed; two findings became failing tests, both now passing]
[Phase 6: the declared runCommand, testCommand and lintCommand all clean; all four
 acceptance criteria traced to named tests]

Skill: writes the `## Implementation Report` section at the end of
       llm/features/rate-limiting.md, with Files created (3) and Files modified (2)
Skill: invokes constellize-memory:update
Skill: reads the artifact, finds line 3 `**Status:** SPECIFIED` — the first status line
       outside a fence — and rewrites that line to `**Status:** IMPLEMENTED`
Skill → user: "rate-limiting is IMPLEMENTED. 3 files created, 2 modified, 11 tests added,
       nothing marked untestable, no deviations. Next: constellize-feature:verify."
```

**Why this is GOOD:**
- The status went in after the report, the memory update and every phase it attests to
- One status line in the file, rewritten where it already was, so the assessor reads the current one
- Both file lists are recorded, so verify can make its surface determination from evidence
- The run ends pointing at the next skill, not at itself

---

❌ BAD — a second status line, written early:

```
Skill: reads llm/features/rate-limiting.md at `**Status:** SPECIFIED`
Skill: appends to the end of the artifact:

       **Status:** IMPLEMENTED

       ## Implementation Report
       **Files created:** (omitted — small change)

[then starts Phase 4]
```

**Why this is BAD:**
- The artifact now has two status lines; the assessor returns on the first and still reports SPECIFIED, so the new line changes nothing and misleads every human reader
- The status was written before the code, the tests and the review it claims to attest to — the exact defect this workflow removes
- `Files created` was dropped as "small", so the next skill has ambiguous evidence and runs its conditional gates anyway; `None` would have been an answer, and an omission is not
- Nothing was traced to an acceptance criterion, so there is no record that the contract was met
</examples>
