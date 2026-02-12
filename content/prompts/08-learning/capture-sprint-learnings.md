---
# === Identity ===
id: capture-sprint-learnings
name: Document sprint learnings for compound organizational knowledge
version: v1

# === Classification ===
chapter: 8
category: learning
subcategory: organizational
tags:
  - sprint-learning
  - organizational-learning
  - compound-learning
  - knowledge-capture
  - technical-insights
  - process-improvement
  - cross-sprint-patterns
  - memory-bank-updates

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Document sprint learnings for compound organizational knowledge.
    Transform individual sprint experiences into permanent organizational knowledge by capturing achievements, challenges, technical insights, organizational insights, and cross-sprint learning patterns that accelerate future development.
  argument-hint: "[sprint_id] [team_name] [sprint_duration] [memory_bank_location]"
  allowed-tools:
    - Read
    - Glob
    - Grep
    - Write
    - Bash
  model: sonnet
  context: inline
  user-invocable: true
  disable-model-invocation: false

# === Variables ===
variables:
  - name: sprint_id
    description: Sprint identifier or number
    example: "Sprint 23"
    maps-to: "$0"
  - name: team_name
    description: Team or squad name
    example: "PaymentAPI Team"
    maps-to: "$1"
  - name: sprint_duration
    description: Sprint timeframe
    example: "Jan 15-29, 2026"
    maps-to: "$2"
  - name: memory_bank_location
    description: Where to document sprint learnings
    example: "memory-bank/organizational/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/capture-sprint-learnings
  marketplace:
    plugin: constellize-learning

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Document {{sprint_id}} achievements, challenges, and lessons learned for {{team_name}} by capturing technical insights (patterns discovered, anti-patterns avoided), organizational insights (process improvements, communication patterns), and cross-sprint learning patterns—transforming individual sprint experiences into compound organizational learning.
</task>

<context>
Sprint: {{sprint_id}}
Team: {{team_name}}
Duration: {{sprint_duration}}
Documentation: {{memory_bank_location}}

Sprint learning capture transforms temporal work cycles into permanent organizational knowledge. This differs from retrospectives (which focus on process and team dynamics) by extracting transferable technical and organizational knowledge for future reference.

Connects to Chapter 9 adoption practices—sprint learning documents become training materials for new team members.
</context>

<thinking>
Before documenting sprint learnings:
1. What were the significant achievements this sprint?
2. What challenges slowed progress or created uncertainty?
3. What patterns emerged (technical, organizational, communication)?
4. What knowledge would benefit future sprints or other teams?
5. What assumptions were validated or invalidated?
6. How does this sprint's learning connect to previous sprints?
</thinking>

<output-format>

## Sprint Learning Document Structure

```
# Sprint {{sprint_id}} Learnings: {{team_name}}

Sprint: {{sprint_id}} | Team: {{team_name}} | Duration: {{sprint_duration}}
Date Captured: [YYYY-MM-DD] | Captured By: [Names]

## Sprint Summary

Scope: [Brief description of sprint goals]
Achievements: [Major accomplishments]
Challenges: [Significant obstacles]
Key Learnings: [Technical, organizational, process insights]

## Achievements

### Achievement: [Name]

What was delivered: [Description]
Why it matters: [Business/technical value]
Approach taken: [Design decisions, technologies, collaboration]
Timeline: Estimated [X days] → Actual [Y days]
Learnings: [What we learned while building this]
Memory bank updates: [Documents updated with this learning]

## Challenges

### Challenge: [Name]

What happened: [Description]
Impact: [Schedule, scope, quality, team effects]
Root cause: [Why this occurred]
Resolution: [What worked, time to resolve]
Lessons learned:
- Technical: [System/technology learning]
- Process: [How we work learning]
- Prevention: [How to avoid in future]
Memory bank updates: [Documents updated]

## Technical Insights

### Pattern Discovered: [Name]

Pattern: [Description]
Context: [When/where it applies]
Benefits: [Why valuable]
Tradeoffs: [Costs or limitations]
Implementation guidance: [When to use, when not to use]
Memory bank location: [Where documented]

### Anti-Pattern Avoided: [Name]

Anti-pattern: [Problematic approach]
Why problematic: [Consequences]
Better alternative: [What we did instead]
Warning signs: [How to recognize]

## Organizational Insights

### Process Improvement: [Name]

Previous process: [How we used to do this]
Problem: [What wasn't working]
New process: [What we changed]
Results: [Effectiveness, adoption, metrics if available]
Continue/adjust/abandon: [Decision and rationale]

## Cross-Sprint Learning

### Compound Learning: [Pattern]

Sprint history:
- Sprint N-2: [Earlier learning]
- Sprint N-1: [Related learning]
- This sprint: [Current learning building on previous]

Compound effect: [How earlier learnings accelerated this sprint]

Example:
- Sprint 21: 2 days to fix slow query (reactive)
- Sprint 22: 4 hours to fix (applied documented approach, 75% faster)
- Sprint 23: 0 issues (prevented via code review)

## Memory Bank Updates

Documents updated: [List with sections and rationale]
New documents created: [List with purpose]
Knowledge gaps identified: [What we discovered we don't know]

## Action Items

Immediate actions: [Before next sprint, with owners]
Process changes: [For next sprint trial]
Technical debt created: [With payback plan]
Follow-up investigations: [Questions to research]
```

</output-format>

<instructions>
CRITICAL: Sprint learning capture is not a task list or status report. Focus on knowledge gained, patterns discovered, and lessons learned that will accelerate future work.

DO NOT:
- List completed tickets without learning context
- Document only problems (also capture successes and why they succeeded)
- Skip the "why" (always explain rationale)
- Write generic insights ("communication is important")—be specific
- Create documents that will never be referenced

ALWAYS:
- Capture specific, actionable technical and organizational insights
- Connect learnings to memory bank updates
- Identify compound learning effects (how prior learnings accelerated this sprint)
- Document both what worked and what didn't (balanced view)
- Include enough context for someone not on the team to understand
- Link challenges to prevention strategies

REMEMBER: The goal is compound learning. Each sprint's documented learnings should make subsequent sprints faster and more effective.
</instructions>

<examples>

## Example: Sprint 23 Learning Summary

```
# Sprint 23 Learnings: PaymentAPI Team

Sprint: Sprint 23 | Team: PaymentAPI Team | Duration: Jan 15-29, 2026
Date Captured: 2026-01-29 | Captured By: alex-chen, jordan-williams, morgan-lee

## Sprint Summary

Scope: Payment retry logic with circuit breaker, Stripe V2→V3 migration
Achievements: 40% reduction in user-visible payment failures, zero-downtime migration
Challenges: Database migration backward compatibility, circuit breaker threshold tuning
Key Learnings: Circuit breaker thresholds require empirical tuning; migrations need N-1 compatibility

## Achievements

### Achievement: Payment Retry with Circuit Breaker

What was delivered: Automatic retry with exponential backoff and circuit breaker for payment provider calls
Why it matters: Reduces user-visible failures by 40% during transient provider issues
Approach: Resilience4j library, circuit breaker per provider, dual thresholds (base + fast-fail)
Timeline: Estimated 3 days → Actual 4 days (+1 day threshold tuning)
Learnings: Theoretical thresholds don't work—need production-like load testing to tune
Memory bank updates: systemPatterns.md#resilience, operations/performance/load-testing.md

## Challenges

### Challenge: Database Migration Broke Dev Environments

What happened: Migration added required column incompatible with previous app version
Impact: ~4 hours lost across team (3 engineers × 90 min troubleshooting)
Root cause: Migration wasn't backward compatible (N-1 compatibility not considered)
Resolution: Made column nullable, updated migration docs with compatibility checklist
Lessons learned:
- Technical: Migrations must be N-1 compatible with previous app version
- Process: Code review checklist needs migration compatibility check
- Prevention: Added checklist item, documented pattern
Memory bank updates: systemPatterns.md#database-migrations, code-review-checklist.md

## Technical Insights

### Pattern Discovered: Circuit Breaker Dual Thresholds

Pattern: Use base threshold (50% errors over 10 requests) + fast-fail (3 consecutive errors)
Context: Dependencies with both transient and sustained failure modes
Benefits: Responsive to outages (3 requests), tolerant of transient failures
Tradeoffs: Slightly more complex configuration
Implementation: Base threshold for normal operation, fast-fail catches total outages immediately
Memory bank location: systemPatterns.md#circuit-breaker-dual-thresholds

## Cross-Sprint Learning

### Compound Learning: Database Performance Mastery

Sprint history:
- Sprint 21: 2 days to fix slow query (reactive, no prior knowledge)
- Sprint 22: 4 hours to fix (applied documented approach, 75% faster)
- Sprint 23: 0 production issues (prevented via code review + automated tests)

Compound effect: Moved from reactive debugging to proactive prevention. Each sprint's learning accelerated the next.

## Action Items

Immediate: Create automated N-1 compatibility detection (Owner: Platform lead)
Process change: Add knowledge retrospective after sprint retrospective (trial 2 sprints)
Technical debt: Circuit breaker manual tuning (research auto-tuning if implementing 3+ circuit breakers)
```

</examples>
