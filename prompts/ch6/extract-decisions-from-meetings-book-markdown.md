<!-- PROMPT START -->
> **Prompt: Extract Decisions from Meeting Notes**
>
> **Purpose:** Extract actionable decisions from meeting notes into memory bank entries
>
> **Use when:** After meetings to capture decisions, constraints, and action items that would otherwise be lost
>
> **Category:** Knowledge Management

```
---
template_variables:
  - name: meeting_transcript
    description: The raw meeting notes or transcript to analyze
    example: "[Full meeting notes or transcript text]"
  - name: team_name
    description: The team or project the meeting relates to
    example: "Platform Engineering"
  - name: meeting_context
    description: Brief context about the meeting purpose
    example: "Weekly architecture review for payment system migration"
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

---

## Constraints Discovered

### Constraint 1: [What's limited]
**Nature:** [Technical / Resource / Timeline / External]
**Impact:** [What this prevents or requires]
**Source:** [Where this constraint comes from]
**Memory Bank Update:** `activeContext.md` or `systemPatterns.md`

---

## Action Items

| Owner | Action | Due | Context | Status |
|-------|--------|-----|---------|--------|
| [Name] | [Specific task] | [Date if mentioned] | [Why this matters] | Pending |

**Memory Bank Update:** `progress.md`

---

## Cross-References

- Links to: [Related decision/constraint in another team's memory bank]
- Affects: [System or component that should be updated]
- Conflicts with: [Any contradictions with existing documentation]
</output-format>

<instructions>
CRITICAL: Extract what was DECIDED, not just discussed. Many meetings have long discussions that end without a clear decision—flag these as "Unresolved" rather than inventing a decision.

NEVER:
- Invent decisions that weren't explicitly made
- Assign action items to people who didn't commit to them
- Assume context that isn't in the transcript
- Skip items because they seem minor—small decisions often matter most

ALWAYS:
- Quote exact language when capturing decisions
- Note confidence level for ambiguous extractions
- Flag contradictions with existing memory bank entries
- Include rationale, not just the decision itself
- Specify which memory bank file each item should update
</instructions>
```

<!-- PROMPT END -->
<!-- METADATA: {"id": "extract-decisions-from-meetings", "chapter": "Chapter 6", "category": "Knowledge Management", "tags": ["meetings", "decisions", "memory-bank", "knowledge-extraction", "documentation", "team-coordination"]} -->
