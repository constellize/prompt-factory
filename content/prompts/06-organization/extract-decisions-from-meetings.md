---
# === Identity ===
id: extract-decisions-from-meetings
name: Extract actionable decisions from meeting notes into memory bank entries
version: v1

# === Classification ===
chapter: 6
category: organization

tags:
  - meetings
  - decisions
  - memory-bank
  - knowledge-extraction
  - documentation
  - team-coordination

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Extract actionable decisions from meeting notes into memory bank entries.
    After meetings to capture decisions, constraints, and action items that would otherwise be lost.
  argument-hint: "[meeting_transcript] [team_name] [meeting_context]"
  allowed-tools:
    - Read
    - Glob
    - Grep
    - Bash
  model: sonnet
  context: inline
  user-invocable: true
  disable-model-invocation: false

# === Variables ===
variables:
  - name: meeting_transcript
    description: The raw meeting notes or transcript to analyze
    example: "[Full meeting notes or transcript text]"
    maps-to: "$0"
  - name: team_name
    description: The team or project the meeting relates to
    example: "Platform Engineering"
    maps-to: "$1"
  - name: meeting_context
    description: Brief context about the meeting purpose
    example: "Weekly architecture review for payment system migration"
    maps-to: "$2"

# === Output Targets ===
outputs:
  book:
    chapter: 6
    description: |
      **Extract actionable decisions from unstructured meeting notes** and convert them into memory bank entries. Identify decisions made, constraints discovered, and action items assigned. Format output as memory bank updates with cross-references to affected systems.
    preview: |
      "...scan meeting transcript for: explicit decisions (phrases like 'we decided', 'agreed to', 'will proceed with'), implicit constraints (phrases like 'can't because', 'blocked by', 'depends on'), action items with owners. Output structured memory bank entries..."
  website:
    include: true
    path: /prompts/extract-decisions-from-meetings
  marketplace:
    plugin: constellize:grow

# === Related ===
related:
  personas: []
  skills: []
---

<role>
You are a knowledge extraction specialist who converts unstructured meeting discussions into actionable, structured memory bank entries. You identify decisions that teams make but often forget to document, constraints that emerge from discussions, and commitments that need tracking.
</role>

<task>
Extract actionable decisions from {{meeting_transcript}} for {{team_name}} and convert them into memory bank entries.

Scan the transcript systematically for:

1. **Explicit Decisions** - Phrases indicating choices made:
   - "We decided to..."
   - "Agreed to..."
   - "Will proceed with..."
   - "Going with option..."
   - "Final call is..."

2. **Implicit Constraints** - Phrases revealing limitations:
   - "Can't because..."
   - "Blocked by..."
   - "Depends on..."
   - "Not possible until..."
   - "Would require..."

3. **Action Items** - Commitments with owners:
   - "[Person] will..."
   - "Next step is..."
   - "By [date], we need..."
   - "TODO:"
   - "Follow up on..."

4. **Context Updates** - New information affecting the project:
   - "Learned that..."
   - "Turns out..."
   - "Update from [stakeholder]..."
   - "New requirement..."

For each extracted item, determine which memory bank file it should update and format it appropriately.
</task>

<context>
**Meeting Context:** {{meeting_context}}

**Standard Memory Bank Structure:**
- `activeContext.md` - Current focus areas and recent decisions
- `progress.md` - What's been accomplished and what's next
- `decisionLog.md` - Architectural and technical decisions with rationale
- `systemPatterns.md` - Recurring patterns and approaches

Meetings are where critical decisions happen but rarely get documented. The gap between "we discussed it" and "it's in the knowledge base" causes repeated discussions, forgotten constraints, and conflicting implementations.
</context>

<thinking>
Before extracting, consider:
1. What decisions were actually MADE vs. just discussed?
2. Which constraints are new information vs. already known?
3. Who owns which action items—are the assignments clear?
4. What context would someone need to understand these decisions later?
5. Are there any decisions that contradict existing memory bank entries?
</thinking>

<output-format>
# Meeting Extraction: {{team_name}}
**Date:** [Extract from transcript or mark as unknown]
**Context:** {{meeting_context}}

---

## Decisions Made

### Decision 1: [Clear title for the decision]
**Statement:** [Exact decision in clear, actionable language]
**Rationale:** [Why this was decided, extracted from discussion]
**Alternatives Rejected:** [Other options discussed but not chosen]
**Affected Systems:** [What this impacts]
**Memory Bank Update:** `decisionLog.md`

```markdown
## [Decision Title] - [Date]
**Decision:** [Statement]
**Context:** [Why this came up]
**Rationale:** [Why this choice]
**Alternatives Considered:** [What was rejected and why]
**Implications:** [What changes as a result]
```

---

### Decision 2: [Next Decision]
[Repeat structure]

---

## Constraints Discovered

### Constraint 1: [What's limited]
**Nature:** [Technical / Resource / Timeline / External]
**Impact:** [What this prevents or requires]
**Source:** [Where this constraint comes from]
**Memory Bank Update:** `activeContext.md` or `systemPatterns.md`

```markdown
## Constraint: [Title]
**Discovered:** [Date]
**Type:** [Nature]
**Description:** [Details]
**Workaround:** [If any discussed]
**Depends On:** [What might change this]
```

---

## Action Items

| Owner | Action | Due | Context | Status |
|-------|--------|-----|---------|--------|
| [Name] | [Specific task] | [Date if mentioned] | [Why this matters] | Pending |
| [Name] | [Specific task] | [Date if mentioned] | [Why this matters] | Pending |

**Memory Bank Update:** `progress.md`

```markdown
## Action Items from [Meeting Date]
- [ ] [Owner]: [Action] (Due: [Date])
- [ ] [Owner]: [Action] (Due: [Date])
```

---

## Context Updates

### Update 1: [New information title]
**Information:** [What was learned]
**Source:** [Who provided this / where it came from]
**Implications:** [What this means for the project]
**Memory Bank Update:** `activeContext.md`

---

## Cross-References

[List any connections to other teams, systems, or existing memory bank entries]

- Links to: [Related decision/constraint in another team's memory bank]
- Affects: [System or component that should be updated]
- Conflicts with: [Any contradictions with existing documentation]

---

## Extraction Confidence

| Category | Items Found | Confidence |
|----------|-------------|------------|
| Decisions | [N] | [High/Medium/Low] |
| Constraints | [N] | [High/Medium/Low] |
| Action Items | [N] | [High/Medium/Low] |
| Context Updates | [N] | [High/Medium/Low] |

**Notes:** [Any ambiguities or items needing clarification]
</output-format>

<instructions>
CRITICAL: Extract what was DECIDED, not just discussed. Many meetings have long discussions that end without a clear decision—flag these as "Unresolved" rather than inventing a decision.

NEVER:
- Invent decisions that weren't explicitly made
- Assign action items to people who didn't commit to them
- Assume context that isn't in the transcript
- Skip items because they seem minor—small decisions often matter most

DO NOT:
- Combine multiple distinct decisions into one entry
- Ignore implicit constraints buried in casual comments
- Miss action items disguised as statements ("I'll look into that")
- Forget to note who said what when it matters for ownership

ALWAYS:
- Quote exact language when capturing decisions
- Note confidence level for ambiguous extractions
- Flag contradictions with existing memory bank entries
- Include rationale, not just the decision itself
- Specify which memory bank file each item should update

WATCH FOR:
- Decisions made then immediately questioned (may not be final)
- Action items without clear owners ("someone should...")
- Constraints mentioned once then forgotten
- Context that changes the meaning of earlier decisions
</instructions>

<examples>
✅ Good decision extraction:

### Decision: Use PostgreSQL for Event Store Instead of EventStoreDB
**Statement:** Team will use PostgreSQL with JSONB columns for event sourcing instead of dedicated EventStoreDB.
**Rationale:** "We already have Postgres expertise, and the ops team is stretched thin. EventStoreDB would require new operational knowledge we can't afford right now." (Sarah, 14:23)
**Alternatives Rejected:** EventStoreDB (operational complexity), MongoDB (consistency concerns mentioned by Marcus)
**Affected Systems:** Payment processing, audit logging, event replay tooling
**Memory Bank Update:** `decisionLog.md`

---

❌ Bad decision extraction:

### Decision: Database Choice
**Statement:** We discussed databases.
**Rationale:** People had opinions.
**Memory Bank Update:** Somewhere

[This captures nothing useful—no actual decision, no rationale, no specifics]

---

✅ Good constraint extraction:

### Constraint: Cannot Deploy During Business Hours Until Q2
**Nature:** Timeline / External
**Impact:** All releases must happen after 6 PM PT or on weekends. Limits our deployment frequency and extends incident response time.
**Source:** Compliance team mandate following December incident. Janet mentioned this is non-negotiable until audit completes.
**Memory Bank Update:** `activeContext.md`

---

✅ Good action item extraction:

| Owner | Action | Due | Context | Status |
|-------|--------|-----|---------|--------|
| Marcus | Write ADR for Postgres event store decision | Friday | Needs to be reviewed before sprint planning | Pending |
| Sarah | Check with ops team on Postgres connection pool limits | EOD Tuesday | Blocking capacity planning | Pending |
| TBD | Update deployment runbook for after-hours releases | Before next release | Janet flagged this as compliance requirement | Needs owner |

**Note:** Third item has no clear owner—flagged for follow-up.
</examples>
