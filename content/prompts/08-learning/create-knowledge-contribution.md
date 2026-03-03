---
# === Identity ===
id: create-knowledge-contribution
name: Package personal insights for team sharing and reuse
version: v1

# === Classification ===
chapter: 8
category: learning
subcategory: personal
tags:
  - knowledge-sharing
  - knowledge-contribution
  - team-learning
  - patterns
  - templates
  - expertise-sharing
  - documentation
  - reusable-knowledge

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Package personal insights for team sharing and reuse.
    Transform individual expertise into reusable team knowledge by creating clear problem statement, documenting solution with rationale, providing patterns and templates, integrating with existing memory bank—enabling knowledge transfer from individual to team and preventing knowledge loss.
  argument-hint: "[engineer_name] [insight_title] [target_audience] [memory_bank_location]"
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
  - name: engineer_name
    description: Individual engineer creating knowledge contribution
    example: "Alex Chen"
    maps-to: "$0"
  - name: insight_title
    description: Title of insight or knowledge being shared
    example: "Circuit Breaker Tuning Approach"
    maps-to: "$1"
  - name: target_audience
    description: Who benefits from this knowledge
    example: "Team members implementing resilience patterns"
    maps-to: "$2"
  - name: memory_bank_location
    description: Where to contribute knowledge
    example: "memory-bank/systemPatterns.md"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    chapter: 8
    description: |
      **Package personal insight for team sharing** by documenting problem, solution approach, reusable patterns, and implementation guidance—transforming individual expertise into team asset that prevents knowledge loss and accelerates teammates' learning.
    preview: |
      "...Problem: Engineers guess circuit breaker thresholds. Solution: Empirical load testing with failure injection. Pattern: Load test template with baseline + failure modes. Benefit: Team doesn't reinvent threshold tuning..."
  website:
    include: true
    path: /prompts/create-knowledge-contribution
  marketplace:
    plugin: constellize-learning

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Create knowledge contribution by {{engineer_name}} packaging {{insight_title}} for team sharing—writing clear problem statement and context, documenting solution approach with rationale, creating reusable patterns or templates, adding to appropriate memory bank sections, linking to related knowledge—enabling knowledge transfer from individual to team and preventing knowledge loss when engineer moves or context is forgotten.
</task>

<context>
Engineer: {{engineer_name}}
Insight: {{insight_title}}
Audience: {{target_audience}}
Location: {{memory_bank_location}}

Knowledge contribution transforms personal insight into team asset. This differs from personal learning journey:
- Personal learning journey: Individual documents their own growth
- Knowledge contribution: Individual packages insight for team to use

Both are complementary. Personal learning can lead to knowledge contribution when engineer identifies learnings worth sharing systematically.

Knowledge contributions serve multiple purposes:
1. Knowledge transfer: Others learn and apply this knowledge
2. Knowledge preservation: Insight doesn't disappear if engineer unavailable
3. Quality consistency: Team applies same pattern rather than reimplementing
4. Onboarding: New team members learn from these contributions
5. Career growth: Engineer recognized as subject matter expert

Connects to Chapter 8 theme of individual contributions strengthening team capability.
</context>

<thinking>
Before creating knowledge contribution:
1. What insight am I sharing?
2. What problem does this solve?
3. Why is this valuable for team?
4. What's the clearest way to explain this?
5. How can team apply this?
6. What templates or patterns would help?
7. How does this connect to existing knowledge?
</thinking>

<output-format>

## Knowledge Contribution Documentation Pattern

```
# Knowledge Contribution: {{insight_title}}

Contributed by: {{engineer_name}}
Date: [YYYY-MM-DD]
Audience: {{target_audience}}
Status: [Draft / Ready for team / Active / Archived]
Related Learning: [Link to personal learning journey if applicable]

## Summary

**What is this knowledge:**
- [Clear, one-sentence definition]

**Why it matters:**
- [Business or technical value]
- [Who benefits]

**When to use:**
- [Situations where this applies]

**When not to use:**
- [Situations where this doesn't apply]

```

---

## Problem and Context Pattern

```
## Part 1: Problem and Context

### Problem We're Solving

**The problem:**
- [Clear description of problem]
- [Impact if not addressed]
- [Severity/importance]

**Why this is important:**
- [Business reason]
- [Technical reason]
- [Team impact]

### Context and Constraints

**Background:**
- [Relevant context that shapes solution]
- [Assumptions we're making]
- [Constraints we're working within]

**Who experiences this problem:**
- [Role/situation: Developer, operator, architect]
- [Frequency: How often encountered]
- [Pain level: How much it hurts]

**When this problem occurs:**
- [Scenarios where problem appears]
- [Triggers for problem]

```

---

## Solution Documentation Pattern

```
## Part 2: Solution Approach

### Solution Overview

**What we're proposing:**
- [High-level description of solution]
- [How it solves the problem]
- [Key benefits]

### Detailed Approach

**Step 1: [First component or step]**
- What: [What is this step]
- Why: [Why this step necessary]
- How: [How to implement/do this]
- Example: [Concrete example]

**Step 2: [Second component or step]**
- [Same structure]

**Step 3: [Third component or step]**
- [Same structure]

### Rationale

**Why this approach:**
- [Primary reasoning]
- [Secondary reasoning]

**Why not alternatives:**
- Alternative 1: [What we considered]
  - Why not: [Drawback]
- Alternative 2: [What we considered]
  - Why not: [Drawback]

**Trade-offs:**
- [Trade-off 1]: We're accepting [cost] to gain [benefit]
- [Trade-off 2]: We're accepting [cost] to gain [benefit]

### When to Use This

**Perfect fit scenarios:**
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

**Maybe fit scenarios:**
- [Scenario 1]: Works but not ideal because [reason]
- [Scenario 2]: Works but not ideal because [reason]

**Doesn't fit scenarios:**
- [Scenario 1]: Not applicable because [reason]
- [Scenario 2]: Not applicable because [reason]

```

---

## Patterns and Templates Pattern

```
## Part 3: Reusable Patterns and Templates

### Pattern 1: [Pattern name]

**Pattern:**
```
[Code or procedure example showing pattern]
```

**How to apply:**
- [Step 1]
- [Step 2]
- [Step 3]

**Example usage:**
- [Real example from codebase or experience]

**Common mistakes:**
- Mistake 1: [What people do wrong]
  - Fix: [How to do it right]
- Mistake 2: [What people do wrong]
  - Fix: [How to do it right]

### Template 1: [Template name]

**When to use:** [When this template applies]

**Template:**
```
[Provide template that can be copy-pasted or adapted]
```

**How to customize:**
- [Part 1]: [How to customize this]
- [Part 2]: [How to customize this]

**Example:**
- [Real example with template filled in]

### Checklist: [Checklist name]

**Use this checklist when:** [When to apply]

Checklist:
- [ ] Item 1: [What to verify]
- [ ] Item 2: [What to verify]
- [ ] Item 3: [What to verify]
- [ ] Item 4: [What to verify]

```

---

## Implementation Guide Pattern

```
## Part 4: How to Implement This

### Step-by-Step Implementation

**Phase 1: [Preparation]**
- Task 1: [What to do]
  - How: [How to do it]
  - Time: [Estimated time]
  - Owner: [Who does this]

**Phase 2: [Implementation]**
- Task 2: [What to do]
  - [Same structure]

**Phase 3: [Validation]**
- Task 3: [What to do]
  - [Same structure]

### Success Criteria

How to know if implementation worked:
- Criterion 1: [What success looks like]
- Criterion 2: [What success looks like]
- Criterion 3: [What success looks like]

### Troubleshooting

**If [problem] happens:**
- Cause: [Why this happens]
- Fix: [How to fix it]
- Prevention: [How to prevent in future]

**If [problem] happens:**
- [Same structure]

### Common Questions

**Q: [Common question]**
A: [Answer]

**Q: [Common question]**
A: [Answer]

```

---

## Integration and Cross-References Pattern

```
## Part 5: Integration with Existing Knowledge

### Related Knowledge

**Builds on:**
- [Related concept or pattern]
  - How this relates: [Connection]
  - Where documented: [Link to memory bank]

**Enables:**
- [Follow-on concept or pattern]
  - How this enables: [Connection]
  - Next steps: [What to learn next]

**Complements:**
- [Related approach]
  - Difference: [How they differ]
  - When to use each: [Guidance on choosing]

### Where to Document This

Add/update in memory bank:
- Primary location: {{memory_bank_location}}
- Secondary locations:
  - [Other memory bank sections that reference this]
  - [How to link from those sections]

### Links to Add

Add to existing documentation:
- [Doc 1]: Add link to this knowledge contribution
- [Doc 2]: Add reference where relevant
- [Doc 3]: Add cross-reference where applicable

```

---

## Example: Knowledge Contribution

```markdown
# Knowledge Contribution: Circuit Breaker Threshold Tuning

Contributed by: Alex Chen
Date: 2026-01-29
Audience: Engineers implementing resilience patterns
Status: Ready for team

## Summary

**What is this knowledge:**
Circuit breaker threshold tuning is an empirical process, not a theoretical exercise. Thresholds must be validated against actual traffic patterns and failure modes using load testing with failure injection.

**Why it matters:**
Poor thresholds cause two problems: Too sensitive (opens unnecessarily, rejects valid requests), too lenient (doesn't protect from cascading failures). Good thresholds require testing, not guessing.

**When to use:**
Whenever implementing circuit breakers for external API calls or service dependencies.

---

## Part 1: Problem and Context

### Problem We're Solving

**The problem:**
When implementing circuit breaker patterns, engineers often guess at thresholds (error rate %, request count to evaluate, timeout duration). These guesses often don't match production traffic patterns, causing either false circuit opens (too sensitive) or inability to protect from cascading failures (too lenient).

**Why important:**
- Circuit breaker is critical for resilience
- Poor thresholds undermine resilience goals
- This problem appears in every circuit breaker implementation

### Context

Engineers often reference circuit breaker textbooks or libraries for example thresholds, then apply those to their system without validation. But thresholds depend on:
- Baseline error rate of dependency (1% vs 10% normal)
- Acceptable latency for requests
- Recovery speed needed when circuit opens
- Cost of rejecting requests vs. cascading failures

All of these are system-specific, requiring empirical validation.

---

## Part 2: Solution Approach

### Detailed Approach

**Step 1: Establish baseline error rate**
- What: Measure what normal error rate looks like for this dependency
- Why: Thresholds should only trigger on abnormal error rates, not baseline noise
- How:
  1. Monitor dependency for 1-2 weeks under normal load
  2. Measure error rate distribution (p50, p95, p99)
  3. Document baseline
- Example: Stripe API has 1-2% baseline error rate under normal conditions (transient timeouts, etc.)

**Step 2: Identify failure scenarios**
- What: Define what failure modes you want to protect against
- Why: Different failure modes need different threshold configurations
- How:
  1. Transient failures: Individual requests fail, but dependency recovers quickly
  2. Cascading failures: Dependency degraded, most requests fail
  3. Sustained outages: Dependency completely down, 100% failure
- Configure thresholds for each scenario

**Step 3: Design load test with failure injection**
- What: Create load test that simulates realistic traffic + failure scenarios
- Why: Validate thresholds against realistic conditions
- How:
  1. Generate traffic at expected production load (e.g., 500 req/sec)
  2. Inject failures matching expected failure modes
  3. Measure circuit breaker behavior at each threshold configuration
- Example: Inject 30% Stripe API failure rate (simulating Stripe degradation)

**Step 4: Empirically validate thresholds**
- What: Run load tests with different threshold configurations
- Why: Find thresholds that:
  - Don't false-open during normal operation
  - Do open quickly when dependency truly degraded
  - Allow recovery when dependency recovers
- How:
  1. Start with conservative thresholds (high error rate required to open)
  2. Run load test, observe circuit behavior
  3. If false opens: Increase threshold
  4. If doesn't protect: Decrease threshold
  5. Repeat until balanced

**Step 5: Implement and monitor**
- What: Deploy circuit breaker with validated thresholds
- Why: Monitor to ensure real production behaves like load test
- How:
  1. Deploy with full monitoring of circuit state
  2. Track: How often circuit opens, how long open, how quickly recovers
  3. Compare actual behavior to load test predictions
  4. Adjust thresholds if real production differs from test

### Rationale

This empirical approach works because:
- Thresholds are system-specific (can't use generic values)
- Load testing reveals edge cases theory misses
- Validated thresholds have evidence supporting them
- Monitoring validates assumptions hold in production

Alternative approaches don't work as well:
- Theory-based tuning: Misses real failure modes and traffic patterns
- Borrowing from other systems: May not match your dependency's behavior
- Trial-and-error in production: Risks cascading failures while tuning

Trade-offs:
- Requires investment in load testing infrastructure
- Benefit: Resilience patterns actually work

---

## Part 3: Reusable Patterns and Templates

### Load Test Pattern for Circuit Breaker Validation

**Pattern:**
```
Create load test that:
1. Generates traffic matching expected production load
2. Injects failures matching known failure modes
3. Monitors circuit breaker state (open/closed/half-open)
4. Validates circuit behavior against expectations

Load test configuration:
{
  traffic: {
    requestsPerSecond: 500,
    duration: 5 minutes,
    rampUp: 1 minute
  },
  failureScenarios: [
    { name: "transient", errorRate: 10%, duration: 30s },
    { name: "degraded", errorRate: 50%, duration: 60s },
    { name: "outage", errorRate: 100%, duration: 30s }
  ],
  circuitBreakerConfig: {
    errorThreshold: 50,
    requestCount: 10,
    timeoutMs: 30000
  },
  validation: {
    shouldOpenDuring: ["degraded", "outage"],
    shouldNotOpenDuring: ["transient"],
    recoveryTime: "<10 seconds"
  }
}
```

**How to apply:**
1. Identify your dependency and its baseline error rate
2. Define failure scenarios to protect against
3. Set up load test with failure injection
4. Test different threshold configurations
5. Choose thresholds that balance false-positives and protection

**Common mistakes:**
- Mistake 1: Using textbook thresholds without testing
  - Fix: Always load test with your real traffic patterns
- Mistake 2: Tuning only for happy path (no failure injection)
  - Fix: Include realistic failure scenarios in tests

### Threshold Configuration Template

**When to use:** Starting a new circuit breaker implementation

**Template:**
```
Circuit Breaker Thresholds for [DependencyName]

Dependency baseline error rate: X% (measured over [period])

Configuration:
  Base threshold: [N]% error rate over [M] requests
  Rationale: Allows up to [N]% error rate without opening, protects at [N+10]% error rate

  Fast-fail threshold: [K] consecutive errors
  Rationale: Catches total outages (100% failure) immediately

  Half-open timeout: [T] seconds
  Rationale: Allows [estimated recovery time] for recovery

Expected behavior:
  - During transient failures (baseline +/- 5%): Circuit stays closed
  - During degraded (baseline + 30%): Circuit opens after ~30 seconds
  - During outage (100% error): Circuit opens immediately via fast-fail

Load testing results:
  - False open rate: [X]%
  - Protection effectiveness: [Y]%
```

**How to customize:**
- [Dependency name]: Replace with your dependency
- [N]%: Set based on load testing results
- [T] seconds: Set based on dependency's typical recovery time

### Checklist: Circuit Breaker Implementation

**Use when:** Implementing circuit breaker for new dependency

Checklist:
- [ ] Established baseline error rate for dependency (measured over 1-2 weeks)
- [ ] Defined failure scenarios to protect against (transient, degraded, outage)
- [ ] Created load test with failure injection matching those scenarios
- [ ] Tested multiple threshold configurations
- [ ] Documented chosen thresholds with rationale
- [ ] Deployed with full monitoring of circuit state
- [ ] Validated in production (behavior matches load test)
- [ ] Adjusted thresholds if real production differs from tests

---

## Part 4: Implementation Guide

### Step-by-Step Implementation

**Phase 1: Preparation**
1. Establish baseline: Monitor dependency for 1-2 weeks, document normal error rate
   - Time: 1-2 weeks (can start while designing circuit breaker)
   - Owner: Whoever implements circuit breaker

2. Define failure scenarios: What failures should circuit breaker protect against
   - Time: 1 day
   - Owner: Architect or tech lead

**Phase 2: Load Testing**
3. Create load test with failure injection
   - Time: 2-3 days
   - Owner: Engineer implementing circuit breaker with help from QA/test infrastructure

4. Test different threshold configurations
   - Time: 2-3 days (iterative testing)
   - Owner: Engineer implementing circuit breaker

**Phase 3: Validation**
5. Implement and deploy with monitoring
   - Time: 1-2 days
   - Owner: Engineer implementing circuit breaker

6. Monitor in production, adjust if needed
   - Time: Ongoing (first 1-2 weeks critical)
   - Owner: On-call engineer + original implementer

### Success Criteria

- Circuit breaker prevents cascading failures when dependency degrades
- False-positive open rate < 1% during normal operation
- Circuit opens within [acceptable] seconds when dependency fails
- Circuit recovers and closes within [recovery time] after dependency recovers

---

## Part 5: Integration

### Related Knowledge

**Builds on:**
- Resilience patterns (Chapter 7, Operations) - why circuit breakers are needed
- Load testing best practices - how to test under realistic conditions

**Enables:**
- Implementing other resilience patterns (retry, timeout, bulkhead) using similar empirical approach
- Operationalizing circuit breakers (monitoring, alerting)

### Where to Document

Add to memory bank:
- Primary: memory-bank/systemPatterns.md#resilience
- Secondary: memory-bank/operations/performance/load-testing.md
- Cross-reference: engineering-practices/code-review-checklist.md (add circuit breaker validation)

```
```

</output-format>

<instructions>
CRITICAL: Knowledge contributions are for sharing, not gatekeeping. Focus on clarity and usefulness, not proving expertise.

DO NOT:
- Use overly technical language (make it accessible to intended audience)
- Skip the basics (assume readers need to learn from scratch)
- Forget to explain rationale (don't just say "do this")
- Skip practical examples (make it actionable)
- Make it harder to implement than actually doing it (templates should save time)

ALWAYS:
- Lead with problem and why it matters
- Explain rationale for recommended approach
- Provide templates and checklists for reuse
- Include common mistakes and how to avoid them
- Connect to related knowledge in memory bank
- Make it actionable and implementable
- Include when NOT to use this approach
- Assume readers are smart but may not know this specific domain

REMEMBER: Good knowledge contributions save teammates time by preventing them from learning same lessons through experience. The best knowledge is clear, practical, and reusable.
</instructions>

<examples>

[See template example above showing Alex Chen's circuit breaker threshold tuning contribution - demonstrates problem, solution, patterns, templates, implementation guide, and integration]

</examples>
