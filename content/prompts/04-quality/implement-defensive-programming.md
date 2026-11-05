---
id: implement-defensive-programming
name: "Implement defensive programming: validate every input, surface every failure"
version: v1
chapter: 4
category: quality
subcategory: gate-2
skill:
  description: >
    Review and harden a change's defensive programming: every external input validated,
    no swallowed failures, actionable error messages, graceful degradation.
    After implementation, before verification (Gate 2: Health Check Completeness).
  argument-hint: "[component_name] [system_name]"
  allowed-tools: [Read, Glob, Grep, Write, Bash]
  model: sonnet
  context: inline
outputs:
  website:
    include: false
  marketplace:
    plugin: constellize:craft
---

<task>
Review and harden the defensive programming of {{component_name}} in {{system_name}}: every external input is validated, no failure is swallowed, every error tells the user what to do next, and bad input degrades gracefully.

Defensive programming is the code-level half of Gate 2. Health checks tell you the service is alive; defensive programming makes sure a single bad input or a single failed call cannot silently corrupt it. This check applies to every change, whatever the language or framework.

Follow this process:

1. **Find the boundaries of the change:**
   - List every place {{component_name}} accepts external input: requests, messages, files, environment, configuration, results returned by other components
   - List every operation that can fail: calls across a process or network boundary, file and storage access, parsing, conversion
   - Treat anything that crosses a boundary as untrusted until validated

2. **Check input validation:**
   - Is each input validated for presence, type, format, range and size BEFORE it is used?
   - Does validation reject bad input, or merely log it and continue?
   - Are defaults applied only where a default is genuinely safe?

3. **Check failure handling:**
   - Find every handler that catches failures broadly, and every place an error result is ignored
   - A handler must either recover for a stated reason or pass the failure on with context
   - An empty handler, a handler that only discards the failure, and an ignored error return are all swallowed failures

4. **Check error messages:**
   - Every error a user can see must name what failed and what to do next
   - Internal detail (stack traces, file paths, query text, secrets) goes to the log, never to the user

5. **Check graceful degradation:**
   - Bad input must produce a clear refusal, not a crash and not a partial write
   - Where a dependency fails, state what the component does instead

6. **Check test coverage of the defences:**
   - Each validation and each error path needs a test that triggers it
   - Defensive code that genuinely cannot be triggered must carry a comment saying why it is kept; unmarked dead defence is a finding

7. **Fix what you find, then report the verdict.**
</task>

<context>
Component to review:
{{component_name}}

System:
{{system_name}}

Read the change under review, the code generation plan in `construction/design/code-generation-plan-*.md` if it exists, and the memory bank for existing error-handling conventions. Follow the conventions the project already uses; do not introduce a second style.
</context>

<thinking>
Before judging the change, analyze:
1. Where does untrusted data enter this component?
2. What is the worst thing each input could contain, and where would it first do harm?
3. Which failures are currently caught, and what happens next in each case?
4. What does a user see when each of those failures occurs?
5. Which defences have a test, and which have none?
</thinking>

<output-format>
Report findings, then the verdict:

## Defensive Programming Review: {{component_name}}

### Boundaries Reviewed
| Boundary | Kind (input / operation) | Validated or handled? | Evidence (file:line) |
|----------|--------------------------|-----------------------|----------------------|

### Findings
For each defect: location, what is wrong, the fix applied (or why none), and the test that now covers it.

## Gate 2: Health Check Completeness Status

### Requirements
- [ ] Every external input the change accepts is validated before use
- [ ] No failure is swallowed: no empty catch-all handler, no ignored error return
- [ ] Every error a user can see names what failed and what to do next
- [ ] Bad input degrades gracefully: no crash, and no internal trace reaches the user
- [ ] Each validation and each error path has a test
- [ ] Defensive code that cannot be triggered is marked with a justification, not left unmarked

**Gate Status:** ✅ PASS / ❌ FAIL

**Blockers:** [List any failing requirements]
</output-format>

<instructions>
CRITICAL: Every external input MUST be validated before use, and no failure may be swallowed.

NEVER:
- Accept input on the strength of "the caller will have checked it"
- Leave a catch-all handler empty, or let it discard the failure without recovery or context
- Ignore an error return value
- Show a user an internal trace, path, query or secret
- Report a message such as "something went wrong" with no cause and no next step
- Add a defence and leave it without a test

DO NOT:
- Validate after use
- Log a warning where the input should be rejected
- Substitute a default for a missing required value
- Pile up redundant checks of the same value at every layer; validate once at the boundary

ALWAYS:
- Validate at the boundary: presence, type, format, range, size
- Pass failures on with context, or recover for a stated reason
- Write error messages that name what failed and what to do next
- Write a test for every validation and every error path
- Mark defensive code that cannot be triggered with a justification
- FAIL the gate if any requirement above is unmet
- NEVER report PASS with an unmet requirement — "close enough" is a FAIL
- ALWAYS report the verdict, even when this skill was run outside a feature verification

REPEAT: Validate every input. Surface every failure. Report a verdict, and a missing requirement is a FAIL.
</instructions>

<examples>
✅ GOOD defensive handling (language-neutral pseudocode):

```
function createOrder(request):
    if request.quantity is missing or not an integer:
        return Rejected("quantity must be a whole number, e.g. 3")
    if request.quantity < 1 or request.quantity > 1000:
        return Rejected("quantity must be between 1 and 1000; got " + request.quantity)

    result = inventory.reserve(request.itemId, request.quantity)
    if result is failure:
        log.error("reserve failed", itemId, result.cause)
        return Rejected("Could not reserve stock for this item. Try again in a minute.")

    return Accepted(result.reservationId)
```

**Why this is GOOD:**
- Input is validated before use, at the boundary
- The failed call is logged with its cause, and not discarded
- The user message names what failed and what to do; the cause stays in the log
- Bad input is refused cleanly, with no crash and no partial write

---

❌ BAD defensive handling:

```
function createOrder(request):
    try:
        inventory.reserve(request.itemId, request.quantity)
    catch anything:
        pass
    return Accepted()
```

**Why this is BAD:**
- No input validation at all
- The catch-all swallows every failure, so a failed reservation is reported as success
- Nothing is logged, so the failure is invisible
- No test could distinguish success from failure
</examples>
