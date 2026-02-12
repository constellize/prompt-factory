---
# === Identity ===
id: evolve-requirements-from-implementation
name: Document how requirements evolved through implementation learnings
version: v1

# === Classification ===
chapter: 8
category: learning
subcategory: personal
tags:
  - requirements
  - requirement-evolution
  - implementation-learning
  - discovered-constraints
  - requirements-management
  - learning-feedback-loop
  - informed-decisions

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Document how requirements evolved through implementation learnings.
    Capture original assumptions, implementation discoveries, and evolved requirements—preserving requirement history and reasoning to enable future projects to benefit from past learning rather than repeating same discoveries.
  argument-hint: "[feature_name] [original_requirement] [memory_bank_location]"
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
  - name: feature_name
    description: Feature or requirement being evolved
    example: "Payment retry logic"
    maps-to: "$0"
  - name: original_requirement
    description: What was originally required
    example: "Process payments synchronously"
    maps-to: "$1"
  - name: memory_bank_location
    description: Where to document requirement evolution
    example: "memory-bank/requirements/"
    maps-to: "$2"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/evolve-requirements-from-implementation
  marketplace:
    plugin: constellize-learning

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Document requirement evolution for {{feature_name}} by capturing original assumptions and what changed, recording implementation feedback and discoveries, updating requirements with evolved understanding, preserving both original and evolved requirements with reasoning, creating feedback loop for future requirement gathering—transforming implementation learnings into improved requirements while maintaining history of how understanding evolved.
</task>

<context>
Feature: {{feature_name}}
Original Requirement: {{original_requirement}}
Documentation: {{memory_bank_location}}

Requirement evolution happens constantly during implementation. Engineers discover:
1. Original requirements were incomplete
2. Technical constraints change what's feasible
3. User feedback suggests different approach
4. Implementation reveals simpler alternative

Systematically documenting this evolution captures organizational learning about requirements. This differs from requirements drift:
- Requirements drift: Requirements change haphazardly, history lost
- Requirement evolution: Deliberate changes based on learning, history preserved

Both occur, but evolution is manageable while drift is chaotic.

Connects to Chapter 8 theme of preserving context. By documenting why requirements evolved, we enable future projects to benefit from past learning rather than repeating same discoveries.
</context>

<thinking>
Before documenting requirement evolution:
1. What were original requirements? What was the reasoning?
2. What assumptions were made initially?
3. What did we discover during implementation?
4. How did these discoveries change our understanding?
5. What requirements changed and why?
6. What stayed the same and why?
7. What does evolved requirement look like?
8. How should we handle future similar situations?
</thinking>

<output-format>

## Requirement Evolution Documentation Pattern

```
# Requirement Evolution: {{feature_name}}

Feature: {{feature_name}}
Original Requirement: {{original_requirement}}
Date Documented: [YYYY-MM-DD]
Documented By: [Names]

## Evolution Summary

**Original requirement:**
- [What was originally required]
- [Rationale at the time]
- [Assumptions made]

**What changed:**
- [How requirement evolved]
- [Key discoveries that drove change]

**Evolved requirement:**
- [Updated requirement reflecting learning]
- [How it differs from original]
- [Why evolved requirement better]

## Original Requirements

### Requirement 1: [Name]

**Original specification:**
- [What was required]
- [Success criteria]
- [Constraints assumed]

**Rationale:**
- [Why this requirement made sense]
- [Business reasoning]
- [Technical reasoning]
- [Assumptions made]

**Who decided:**
- [Who created requirement]
- [Who approved]

**Trade-offs accepted:**
- [What was sacrificed for this requirement]

### Requirement 2: [Name]
- [Same structure]

## Implementation Discoveries

### Discovery 1: [What we learned]

**What we discovered:**
- [What turned out different from assumption]

**When discovered:**
- [During which implementation phase]
- [What revealed this discovery]

**Impact:**
- [How this discovery changes our approach]
- [What this means for requirements]

**Decision point:**
- Could we work around this? [Yes / No]
- If yes: What would that cost?
- How this affected final requirement

### Discovery 2: [What we learned]
- [Same structure]

## Evolved Requirements

### Requirement 1 (Evolved): [Name]

**Updated specification:**
- [How requirement changed]
- [New success criteria]
- [New constraints]

**What changed and why:**
- [Specific change 1]: [Why]
- [Specific change 2]: [Why]

**Rationale for evolved requirement:**
- [Why evolved version better]
- [Learning from implementation]

**Comparison to original:**
- Original: [Original version]
- Evolved: [Evolved version]
- Benefits of change: [What improved]
- Costs of change: [What we traded]

## Requirement History

Create timeline showing evolution:

**Phase 1 (Original):** [Original requirement description]
- Date: [When decided]
- Rationale: [Why this made sense]

**Phase 2 (First adjustment):** [How it changed]
- Date: [When changed]
- Trigger: [What prompted change]

**Phase 3 (Final):** [Final evolved requirement]
- Date: [When finalized]

## Lessons for Future Requirements

**About requirement gathering:**
- [Lesson 1]: [Insight about how requirements should be gathered]
- [Lesson 2]: [Insight about what to watch for]

**About this domain:**
- [Domain-specific learning about requirements]

**Process improvement:**
- [How should we improve requirement process based on this?]
- [What should we ask next time?]

## Example: Payment Retry Logic Evolution

```markdown
# Requirement Evolution: Payment Retry Logic

Feature: PaymentAPI retry logic
Original Requirement: Process payments synchronously with immediate user response
Date Documented: 2026-01-29
Documented By: Alex Chen, Morgan Lee

## Evolution Summary

**Original requirement:**
- Process all payments synchronously in single request
- User sees payment success/failure immediately
- Rationale: Simple, predictable user experience, quick implementation

**What changed:**
- Discovered synchronous processing limited to ~1000 tx/sec (capacity bottleneck)
- Load testing revealed parallelized retry logic wouldn't fit in request window
- User research showed users prefer immediate confirmation + async processing over waiting

**Evolved requirement:**
- Process payments asynchronously with immediate confirmation
- User sees "payment processing" confirmation immediately
- Actual payment processing happens in background with retries

## Original Requirements

### Requirement 1: Synchronous Payment Processing

**Original specification:**
- All payment processing happens during HTTP request
- User receives success/failure in response
- No background processing
- Success criteria: User sees result < 2 seconds

**Rationale:**
- Simplicity: All code in request context, easy to reason about
- Predictability: User always knows payment status before response
- Technical: Stripe API available, no async infrastructure needed
- Business: Good UX to show result immediately

**Trade-offs accepted:**
- Latency: User waits for full payment flow (Stripe API call in request path)
- Scalability: Single machine's Stripe connection capacity is limit
- Coupling: Payment and notification tightly coupled (both in request)

### Requirement 2: Synchronous Notifications

**Original specification:**
- Payment confirmation emails/SMS sent immediately after successful payment
- Email delivery success included in payment response

**Rationale:**
- Simplicity: Tight coupling means payment doesn't complete until notification sent
- User expectation: Payment succeeded = notification sent
- Technical: Simple to implement, no queue infrastructure

## Implementation Discoveries

### Discovery 1: Synchronous Processing Creates Capacity Bottleneck

**What we discovered:**
- Single Stripe connection has 8 concurrent request limit
- With 200 payment processor threads, requests serialize on Stripe connection
- Capacity limit: ~1000 transactions/second per pod
- Scaling beyond this requires fundamentally different architecture

**When discovered:**
- Oct 2024 load testing before launch
- Later confirmed in production: Nov-Dec 2024 Black Friday (traffic approached 1000 tx/sec)

**Impact:**
- Projected Q2 2025 traffic: 5000+ tx/sec (5x over capacity)
- Can't solve with horizontal scaling (still limited by Stripe connection)
- Current architecture can't support business requirements

**Decision point:**
- Could we work around: Use connection pooling, request queuing?
- Investigation: Stripe API still has connection limits, would help but not enough
- Result: Fundamental requirement change needed

### Discovery 2: User Preferences Favor Async

**What we discovered:**
- User research showed users prefer immediate confirmation + async processing
- Users don't want to wait for full payment flow (Stripe latency variable, 200ms-2s)
- Users expect "payment received, processing it" immediately
- Notification timing less critical (users check status, don't wait for email)

**When discovered:**
- During Checkout redesign discussions (Sep 2024)
- Confirmed through user testing of payment flow mockups

**Impact:**
- Synchronous requirement not actually required for good UX
- Async processing could be better UX (immediate response + background work)

### Discovery 3: Retry Logic Needs Different Approach

**What we discovered:**
- Retries don't work well in synchronous request context (timeout budget)
- Exponential backoff requires multiple seconds, request might timeout
- Can't reliably retry in request window with good latency

**When discovered:**
- During architecture discussions (Dec 2024)
- Confirmed in load testing

**Impact:**
- Can't implement effective retry logic synchronously
- Need async approach to enable proper retry strategy

## Evolved Requirements

### Requirement 1 (Evolved): Asynchronous Payment Processing

**Updated specification:**
- User immediately receives confirmation ("payment received, processing")
- Actual payment processing happens asynchronously (background job)
- User can check status via API or gets email when complete
- User-facing latency: <200ms (validation only)
- Payment processing latency: 1-30 seconds depending on Stripe

**What changed and why:**
- Change 1: Async instead of sync processing
  - Why: Enables better latency (remove Stripe from request path), enables retries, enables scaling
- Change 2: Immediate confirmation instead of delayed response
  - Why: User research preferred UX, better perceived performance
- Change 3: Background job instead of request context
  - Why: Enables exponential backoff retries, parallelization

**Rationale for evolved requirement:**
- Solves capacity bottleneck (async parallelizes Stripe calls)
- Improves user experience (immediate confirmation)
- Enables effective retry logic (time budget not constrained)
- Better business alignment (async is business growth enabler)

**Comparison to original:**
- Original: Sync payment processing, 1000 tx/sec capacity, 200ms-2s latency, tight coupling
- Evolved: Async payment processing, 10,000+ tx/sec capacity, <200ms user-facing latency, decoupled
- Benefits: 10x capacity, better UX, better reliability
- Costs: Operational complexity (queue management), idempotency handling

### Requirement 2 (Evolved): Asynchronous Notifications

**Updated specification:**
- Notifications sent asynchronously after payment succeeds
- Payment success doesn't block on notification delivery
- Notifications can retry independently if delivery fails

**What changed and why:**
- Notifications now independent from payment
- Notification failures don't cascade to payment failures

## Requirement History

**Phase 1 (Original): Synchronous Payment Processing**
- Date: Sep 2024 (requirement design)
- Rationale: Simple, easy to implement, good for initial launch

**Phase 2 (Discovery Period): Capacity Concerns**
- Date: Oct-Dec 2024
- Trigger: Load testing showed 1000 tx/sec limit, Q2 projections predicted 5x growth

**Phase 3 (Evolved): Asynchronous Payment Processing**
- Date: Jan 2025 (architecture redesign)
- Trigger: Capacity bottleneck, user research, retry logic needs

## Lessons for Future Requirements

**About requirement gathering:**
- Gather requirements in context of projected scale (don't assume initial scale is permanent)
- Validate assumptions through user research (what feels synchronous vs async to users?)
- Consider operational implications early (retries, failure handling, etc.)

**About this domain (payments):**
- External API limits significantly constrain architecture (Stripe connection limits)
- Async processing is enabler, not limitation, for payment systems
- User experience doesn't require synchronous payment processing

**Process improvement:**
- For future requirement gathering: Include capacity projections and growth assumptions
- For future technical requirements: Include load testing results in requirement validation
- For user-facing requirements: Include user research in validation phase
```
```

</output-format>

<instructions>
CRITICAL: Requirement evolution documentation is about learning, not admitting failure.

DO NOT:
- Treat evolved requirements as wrong initial requirements (original requirements were right for original constraints)
- Skip the reasoning (show thinking process)
- Lose the history (original requirements matter for context)
- Treat as blame (nobody "messed up," we learned)
- Assume requirement only evolves once (may evolve through multiple phases)

ALWAYS:
- Document original requirements and why they made sense
- Clearly show what changed and what prompted change
- Explain tradeoffs in evolved requirements
- Preserve requirement history (original + all evolution)
- Connect to implementation discoveries that drove evolution
- Identify lessons for future requirement gathering
- Compare original vs evolved to show learning

REMEMBER: Organizations that document requirement evolution build better systems and make smarter decisions next time. Those that don't repeat the same requirement discoveries over and over.
</instructions>

<examples>

[See template example above showing Payment Retry Logic evolution - demonstrates original synchronous requirement → discoveries about capacity and UX → evolved async requirement with clear history and lessons]

</examples>
