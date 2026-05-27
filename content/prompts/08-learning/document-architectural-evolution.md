---
# === Identity ===
id: document-architectural-evolution
name: Preserve architectural context enabling confident system evolution
version: v1

# === Classification ===
chapter: 8
category: learning
subcategory: system-health
tags:
  - architecture
  - architectural-evolution
  - design-decisions
  - trade-offs
  - migration
  - system-design
  - preserved-context
  - adr
  - decision-documentation

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Preserve architectural context enabling confident system evolution.
    Document architectural changes with full context—original design rationale, evolution triggers, new decisions, trade-offs, migration path, and lessons learned—so future architects understand not just current state but the journey that led there and reasons that shaped each decision.
  argument-hint: "[system_name] [evolution_reason] [memory_bank_location]"
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
  - name: system_name
    description: System or service undergoing architectural change
    example: "PaymentAPI"
    maps-to: "$0"
  - name: evolution_reason
    description: What triggered the architectural change
    example: "Scaling requirements increased"
    maps-to: "$1"
  - name: memory_bank_location
    description: Where to document architectural evolution
    example: "memory-bank/architectural-evolution/"
    maps-to: "$2"

# === Output Targets ===
outputs:
  book:
    chapter: 8
    description: |
      **Preserve architectural context by documenting design decisions, evolution triggers, and migration paths** so future architects understand not just current state but the journey and constraints that shaped each architectural decision.
    preview: |
      "...Original monolithic architecture right at 500 tx/sec (simple, fast TTM, all-in-one codebase). By Q1 2025, needed 5000+ tx/sec (business growth + cascading failure incident). New event-driven architecture: 10x scalability (parallelized Stripe calls), better reliability (decoupled notification service), better UX (immediate payment confirmation), accepted tradeoff: operational complexity (RabbitMQ, idempotency handling)..."
  website:
    include: true
    path: /prompts/document-architectural-evolution
  marketplace:
    plugin: constellize:grow

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Document architectural evolution of {{system_name}} by capturing original architecture decision and rationale, explaining what triggered evolution, recording new decision with full context, documenting migration path and trade-offs, and preserving reasoning—enabling future architects to understand not just current state but the journey and constraints that shaped decisions.
</task>

<context>
System: {{system_name}}
Evolution Trigger: {{evolution_reason}}
Documentation: {{memory_bank_location}}

Architectural evolution documentation preserves context that gets lost when architecture changes. Without it, future engineers inherit architecture without understanding how it got there or why—leading to second-guessing decisions without knowing the constraints that shaped them.

This differs from operational design (Chapter 7):
- Operational design: How the system behaves at runtime
- Architectural evolution: Why the system is structured this way, how it changed, what constraints shaped decisions

Connects to Chapter 8 theme of preserved context enabling confident evolution.
</context>

<thinking>
Before documenting architectural evolution:
1. What was the original architecture and rationale?
2. What constraints existed when originally designed?
3. What changed to trigger evolution?
4. What new architecture was chosen and why?
5. What trade-offs were accepted?
6. What alternatives were considered and rejected?
7. What lessons learned for future evolution?
</thinking>

<output-format>

## Architectural Evolution Document Structure

```
# Architectural Evolution: {{system_name}}

System: {{system_name}}
Evolution Date: [YYYY-MM-DD]
Evolution Trigger: {{evolution_reason}}
Documented By: [Name]

## Executive Summary

What changed: [High-level description]
Why it changed: [Business/technical drivers]
Impact: [System behavior, maintainability, scalability, operations]
Timeline: [Original deployed → Evolution deployed]

---

## Part 1: Original Architecture

### Overview

Design pattern: [Monolithic / Layered / Microservices / Event-driven / etc.]
Key components: [List with responsibilities]
Data flow: [How requests flow through system]
Dependencies: [What system depends on]

### Why Original Was Right at the Time

Constraints when designed:
- [Constraint 1]: [Why existed]
- [Constraint 2]: [Why existed]

Design goals:
- [Goal 1]: [Why mattered]

Key decisions:
- Decision: [Choice made]
  - Rationale: [Why chosen]
  - Alternatives rejected: [What else considered]

Trade-offs accepted:
- [Trade-off]: [What sacrificed]
  - Accepted because: [Why acceptable at the time]
  - With assumption: [What had to be true]

### Strengths and Limitations

Strengths: [What worked well, evidence of effectiveness]
Longevity: [How long served well, when stopped being optimal]

Limitations that emerged:
- [Limitation 1]: [When discovered, impact]

---

## Part 2: Evolution Trigger

### Business Drivers

Business need: [What changed]
- Timeline: [When urgent]
- Impact if not addressed: [Consequences]

### Technical Drivers

Technical problem: [Issue discovered]
- Root cause: [What's wrong]
- Impact: [Performance, reliability, maintainability, scalability]
- Severity: [LOW / MEDIUM / HIGH / CRITICAL]

### Capacity Concerns

Current capacity: [System handles X]
Projected need: [System needs Y by when]
Gap: [Y - X and why horizontal scaling won't work]

---

## Part 3: New Architecture

### Overview

Design pattern: [Pattern chosen]
Key components: [List with responsibilities]
Data flow: [How requests flow now]
Key differences: [What changed and why]

### Design Decisions

Decision: [Choice made]
- Why chosen: [Reasoning]
- What it solves: [How addresses evolution trigger]
- Trade-offs: [What sacrificed]
- Alternatives rejected: [What considered, why not chosen]

### Strengths and Limitations

Strengths: [What new architecture does well]
Expected improvements: [Performance, reliability, scalability, maintainability]

Limitations:
- [Trade-off]: [What given up]
  - Why acceptable: [Justification]
  - With assumption: [What must be true]

---

## Part 4: Migration Path

Strategy: [Parallel run / Blue-green / Gradual rollout / etc.]
Rationale: [Why this strategy]

Phases:
- Phase 1: [Name, duration, what migrates, risk level, success criteria]
- Phase 2: [Same structure]

Rollback plan: [How to rollback if problems]

---

## Part 5: Lessons Learned

What went well: [Successes, how to replicate]
What was harder: [Challenges, solutions, what to do differently]

Architectural insights:
- [Insight]: [What learned, why matters, how applies]

Trade-off learnings:
- Original assumption: [What assumed]
- What happened: [Reality]
- Adjusted understanding: [How thinking changed]

---

## Documentation Updates

ADR created: [adr-XXX-title.md]
Memory bank updates: [systemPatterns.md sections, techContext.md sections, runbooks]
Cross-references: [Links from old to new docs, assumptions documented]
```

</output-format>

<instructions>
CRITICAL: Architectural evolution documentation is not a technical blueprint. It's a history that preserves reasoning and context.

DO NOT:
- Skip the "why" of original architecture (assume we'll remember—we won't)
- Treat evolution as failure of original design (it was successful until it wasn't)
- Document only technical details (also document constraints and trade-offs)
- Lose rationale for new architecture decisions
- Assume future architects will remember why alternatives were rejected

ALWAYS:
- Document constraints that originally shaped architecture
- Preserve reasoning for why original was right at the time
- Explain clearly what changed to trigger evolution
- Document new trade-offs accepted
- Explain migration path and why chosen
- Capture lessons learned
- Link to ADRs and decision records

REMEMBER: The most valuable architectural documentation isn't what the system looks like today, but why it looks that way and how it got here.
</instructions>

<examples>

## Example: PaymentAPI Event-Driven Migration

```
# Architectural Evolution: PaymentAPI Event-Driven Migration

System: PaymentAPI
Evolution Date: 2025-02-15
Evolution Trigger: Scaling requirements exceeded monolithic capacity
Documented By: Casey Brown (Architect)

## Executive Summary

What changed: Migrated from monolithic synchronous processing to event-driven architecture with async queue-based processing.

Why it changed:
- Original monolith hit 1000 tx/sec capacity limit
- Projected Q2 2025 traffic: 5000+ tx/sec (5x capacity)
- Jan 2025 incident: notification service failure cascaded to payment processing

Impact:
- System handles 10,000+ tx/sec (10x improvement)
- Payment failures no longer cascade to notifications
- Users see immediate confirmation (processing happens async)

Timeline: Original deployed Q3 2024 → Evolution deployed Feb 2025

---

## Part 1: Original Architecture

### Overview

Design pattern: Layered monolithic
Key components: PaymentController → PaymentService → StripeClient → PaymentRepository → NotificationService
Data flow: Synchronous request-response, user waits for full payment flow

### Why Monolith Was Right (Q3 2024)

Constraints:
- Payment volume ~500 tx/sec (well below machine limits)
- Team comfortable with monolithic architecture
- Budget: Simplest possible solution

Trade-offs accepted:
- Scalability: Can't scale beyond machine capacity
  - Accepted because: 500 tx/sec well below limits
- Blast radius: Notification failure cascades to payment
  - Accepted because: Both services reliable

Strengths: Simple, easy debugging, low operational overhead
Longevity: Served well ~6 months until traffic grew 5x

Limitations emerged:
- Oct 2024: Load testing showed 1000 tx/sec limit
- Jan 2025: Cascading failure incident confirmed need for change

---

## Part 2: Evolution Trigger

Business drivers:
- Q2 2025 traffic projection: 5000+ tx/sec (3 months away)
- Need async payment confirmation for checkout UX

Technical drivers:
- Capacity limit: 1000 tx/sec (need 5000+)
- Cascading failures: Notification slowdown caused payment timeouts (CRITICAL)

Gap: Current 3000 tx/sec → Need 5000+ (67% short, horizontal scaling insufficient)

---

## Part 3: New Architecture

Design pattern: Event-driven with async queue-based processing
Key components: PaymentController → CommandQueue → PaymentProcessor → EventPublish → NotificationQueue → NotificationService
Data flow: Immediate validation response, async payment processing

Key decision: Async queue-based processing
- Why: Removes Stripe call from request path, enables horizontal scaling
- Trade-off: Adds RabbitMQ infrastructure, operational complexity
- Alternatives rejected: Webhook-only (too dependent on Stripe), batch (too slow)

Strengths: 10x scalability, decoupled failure domains, better UX (immediate confirmation)
Accepted limitations: Operational complexity (RabbitMQ, idempotency), debugging complexity (distributed tracing needed)

---

## Part 4: Migration Path

Strategy: Parallel run with feature flags (validate new system before cutover)

Phases:
- Phase 1 (2 weeks): Shadow mode validation (new system doesn't affect users)
- Phase 2 (1 week): 5% canary traffic
- Phase 3 (1 week): Gradual rollout 10% → 50%
- Phase 4 (3 days): Full migration to 100%

Rollback: Feature flag to 0% instantly sends all traffic back to old system

---

## Part 5: Lessons Learned

What went well: Shadow mode caught 2 response format issues before cutover
What was harder: Idempotency handling, event ordering guarantees

Architectural insight: Event-driven trades operational complexity for scalability—at certain scale thresholds, complexity becomes necessary investment.

Trade-off learning:
- Assumed: Decoupling would make flow slower
- Reality: Removing Stripe from request path improved latency (200ms vs 1000ms)
- Adjusted: Smart decoupling can improve multiple concerns simultaneously
```

</examples>
