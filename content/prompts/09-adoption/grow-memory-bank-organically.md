---
# === Identity ===
id: grow-memory-bank-organically
name: Enable organic memory bank growth based on actual team needs
version: v1

# === Classification ===
chapter: 9
category: adoption
subcategory: adoption
tags:
  - organic-growth
  - need-driven
  - memory-bank-evolution
  - pain-point-assessment
  - documentation-curation
  - minimal-viable
  - sustainable-growth

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Enable organic memory bank growth based on actual team needs.
    Assess coverage gaps and pain points, identify what to add based on real usage patterns, expand existing docs when needed, prune obsolete content—allowing memory bank to evolve naturally with team rather than becoming bloated theoretical structure.
  argument-hint: "[team_name] [assessment_period] [memory_bank_location]"
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
  - name: team_name
    description: Team growing memory bank
    example: "PaymentAPI Team"
    maps-to: "$0"
  - name: assessment_period
    description: How often to assess growth needs
    example: "End of each sprint"
    maps-to: "$1"
  - name: memory_bank_location
    description: Where team memory bank lives
    example: "memory-bank/"
    maps-to: "$2"

# === Output Targets ===
outputs:
  book:
    chapter: 9
    description: |
      **Enable natural growth based on actual team needs** by assessing pain points where team asks repeated questions, adding documentation when needed (not upfront), keeping documentation minimal, reviewing and pruning obsolete content.
    preview: |
      "...Sprint 1: Team asks 'How tune circuit breaker thresholds?'—not documented. Spend 4 hours researching. Sprint 2: Document approach. Sprint 3: Same question asked → Found answer in memory bank (15 min). Sprint 4: Applied pattern to different service without additional research. Result: Memory bank grows with need, avoids bloat, stays useful..."
  website:
    include: true
    path: /prompts/grow-memory-bank-organically
  marketplace:
    plugin: constellize:grow

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Grow {{team_name}} memory bank organically by assessing current coverage and gaps, identifying pain points signaling need for new files, adding files based on actual need (not theory), expanding existing files with discovered patterns, avoiding premature structure (letting need emerge), balancing minimalism with completeness, periodically reviewing and pruning obsolete content—ensuring memory bank evolves with team needs rather than becoming bloated theoretical structure.
</task>

<context>
Team: {{team_name}}
Assessment Period: {{assessment_period}}
Location: {{memory_bank_location}}

Organic growth principle: Let need drive structure, not theory. The best memory banks grow when:
1. Team encounters problem
2. Searches memory bank (finds nothing or incomplete info)
3. Solves problem
4. Adds learning to memory bank
5. Next time team encounters same problem, memory bank helps

This differs from up-front planning:
- Up-front: Predict everything, create comprehensive structure
- Organic: Start minimal, grow when needed
- Organic scales better and wastes less effort on unused documentation

Connects to Chapter 9 theme: Minimize upfront, grow based on need.
</context>

<thinking>
Before growing memory bank:
1. What's currently documented well?
2. Where are gaps causing work slowdown?
3. What questions does team ask repeatedly?
4. What patterns have we discovered?
5. What's currently documented but unused?
6. What's the right amount of documentation? (Too little = gaps, too much = bloat)
7. How do we know what to add next?
</thinking>

<output-format>

## Organic Growth Assessment Pattern

```
# Memory Bank Growth Assessment: {{team_name}}

Team: {{team_name}}
Assessment Date: [YYYY-MM-DD]
Assessment Period: {{assessment_period}}
Assessed By: [Names]

## Current Memory Bank State

### Coverage Assessment

Current sections:
- [Section 1]: [Completeness: 0-100%]
  - Well covered: [Topics documented]
  - Gaps: [Topics not covered]

### Pain Point Identification

Questions team asked this period:
1. [Question]: How often? [Answer found in memory bank? Y/N]
2. [Question]: How often? [Answer found? Y/N]
3. [Question]: How often? [Answer found? Y/N]

Pattern: Questions team had to ask repeatedly = gaps to fill

### Growth Priorities

Priority 1 (HIGH): [Topic needed]
- Why: Asked X times, not documented
- Effort: [Estimate to document]
- Owner: [Who will add]
- Timeline: [When]

Priority 2 (MEDIUM): [Topic needed]
- Why: [Reasoning]
- Effort: [Estimate]
- Owner: [Who]
- Timeline: [When]

Priority 3 (LOW): [Topic needed]
- Why: [Reasoning]
- Effort: [Estimate]
- Owner: [Who]
- Timeline: [When]

## Adding New Documentation

When adding new documentation:

Step 1: Verify need
- Has team asked about this multiple times?
- Did someone solve this problem today?
- Is this a pattern we'll see again?

Step 2: Assess scope
- Is this one paragraph, one section, or new document?
- Does it fit existing structure or need new file?
- How much detail needed?

Step 3: Keep minimal
- What's the minimum info someone needs?
- Avoid: "Nice to have" details
- Include: "Need to have" specifics

Step 4: Add with examples
- Always include: When/how to use
- Always include: Real example
- Always include: Common pitfalls

Step 5: Link from related docs
- What other docs reference this?
- Add cross-references
- Update related sections

## Expansion and Refinement

Expanding existing documentation:
- Pattern 1: We discovered new approach? (Document if better than previous)
- Pattern 2: Same pattern used in different context? (Document new context)
- Section grew to 2000+ lines? (Time to split into subsections)

Reviewing and pruning:
- Quarterly: Read through memory bank
- Question: Is this still accurate?
- Question: Has anyone referenced this recently?
- If outdated: Update
- If unused: Archive or remove

## Metrics

Track organic growth:
- Documentation requests fulfilled from memory bank: [Count]
- Questions needing external search vs. memory bank answers: [Ratio]
- Documentation freshness: [% current vs % outdated]
- Team satisfaction with completeness: [Survey]

```

---

## Example: PaymentAPI Organic Growth (3 Months)

```markdown
# Memory Bank Growth: PaymentAPI Team (Jan-Mar 2026)

Team: PaymentAPI Team
Periods: 3 sprint cycles

## Sprint 1 (Jan) Baseline

Initial memory bank:
- systemPatterns.md (5 patterns)
- techContext.md (3 sections)
- decisions/ (2 ADRs)

## Sprint 2-3 (Feb) Pain Points

Questions team asked repeatedly:
1. "How do we tune circuit breaker thresholds?" (Asked 3 times, not documented)
2. "What's the Stripe API webhook structure?" (Asked 2 times, partially documented)
3. "How do we validate migrations?" (Asked 1 time, led to bug prevention)

Growth actions:
- Added: operations/performance/circuit-breaker-tuning.md (based on Q1 learning)
- Expanded: techContext.md#stripe-api (added webhook details)
- Added: engineering-practices/migration-validation-checklist.md (based on bug fix)

## Sprint 4 (Mar) Expanded Use

Team references memory bank increasingly:
- Code reviews: "Check memory bank for pattern" (3-5 times per sprint)
- Feature planning: "What patterns apply?" (1-2 times per sprint)
- Onboarding: New engineer reads core sections (2 hours vs 8 hours pair programming)

New pain points emerging:
1. "How do we handle Stripe webhook duplicates?" (1 question, new concern)
2. "What's our error handling pattern?" (Asked during feature planning)
3. "How do we monitor payment processing?" (Operational runbook gap)

Growth actions planned:
- Add: Payment webhook idempotency pattern
- Add: Error handling patterns section
- Add: Monitoring and alerting runbook

## Growth Pattern Observed

Questions → Not in memory bank → Team solves → Add to memory bank → Team reuses

Example cycle:
1. Sprint 1: Payment retry question (Q1 incident), couldn't find answer, took 4 hours to research
2. Sprint 2: Documented circuit breaker tuning (Q1 learning)
3. Sprint 3: Similar retry question asked → Found answer in memory bank (15 minutes)
4. Sprint 4: Applied pattern to different dependency without additional research (pattern proven reusable)

Growth result: Team spending less time on repeated learning, more time on new problems.

## Memory Bank Assessment

Metrics after 3 months:
- Questions answered from memory bank: 85% (up from 40%)
- New documentation created: 5 files
- Documentation freshness: 95% (1 section outdated, updated)
- Team satisfaction: 4.2/5 ("useful, current, growing when needed")

Completeness balance:
- Not too minimal: Core patterns and decisions documented
- Not bloated: Only documented what team actually needed
- Organic growth working: Memory bank evolved with team needs

```

```

</output-format>

<instructions>
CRITICAL: Organic growth principle is hardest discipline to follow—pressure always to create everything upfront.

DO NOT:
- Create comprehensive documentation before team needs it (waste)
- Let memory bank become outdated (review regularly)
- Document theory without practice examples (unused)
- Make decisions about structure without input from team using it
- Add "nice to have" when "need to have" not complete

ALWAYS:
- Wait for team to ask before documenting (need-driven)
- Assess actual pain points (questions repeated = pain)
- Keep documentation minimal (expand when needed)
- Review and prune regularly (keep current)
- Include examples and when-to-use guidance
- Balance minimalism with completeness
- Let structure emerge from need

REMEMBER: Memory banks that grow organically stay useful. Those created comprehensively upfront become organizational burden. Let need drive structure.
</instructions>

<examples>

[See template example above showing PaymentAPI growth over 3 months - demonstrates pain-point-driven growth, reluctance to document until needed, and reuse patterns]

</examples>
