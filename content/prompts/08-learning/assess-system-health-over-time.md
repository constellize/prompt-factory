---
# === Identity ===
id: assess-system-health-over-time
name: Track long-term system health trends enabling informed evolution decisions
version: v1

# === Classification ===
chapter: 8
category: learning
subcategory: system-health
tags:
  - system-health
  - health-assessment
  - metrics-tracking
  - debt-management
  - trend-analysis
  - quality-assessment
  - long-term-health
  - informed-decisions

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Track long-term system health trends enabling informed evolution decisions.
    Periodically assess system health across multiple dimensions—architectural debt, documentation currency, complexity trends, maintenance burden, quality metrics—to understand whether system is improving or degrading and identify priorities for health improvements that enable confident system evolution.
  argument-hint: "[system_name] [assessment_period] [memory_bank_location]"
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
    description: System or service being assessed
    example: "PaymentAPI"
    maps-to: "$0"
  - name: assessment_period
    description: Timeframe for health assessment
    example: "Last 6 months"
    maps-to: "$1"
  - name: memory_bank_location
    description: Where to document system health assessment
    example: "memory-bank/system-health/"
    maps-to: "$2"

# === Output Targets ===
outputs:
  book:
    chapter: 8
    description: |
      **Track system health trends across architectural debt, code quality, complexity, and operational burden** to understand whether system is improving or degrading and identify priorities for health improvements enabling confident evolution.
    preview: |
      "...Q4 trend: Throughput exceeding projections (positive), but test coverage declining 91%→82%, operational complexity growing. Priorities: Automate RabbitMQ management, restore test coverage, decouple services..."
  website:
    include: true
    path: /prompts/assess-system-health-over-time
  marketplace:
    plugin: constellize:grow

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Assess {{system_name}} system health over {{assessment_period}} by systematically evaluating architectural debt accumulation, knowledge currency (documentation matches reality), areas of increasing complexity, maintenance burden trends, system quality metrics—tracking health across time to enable confident evolution decisions and identify health improvement priorities.
</task>

<context>
System: {{system_name}}
Assessment Period: {{assessment_period}}
Documentation: {{memory_bank_location}}

This location is a path, not a label — a directory ending in a slash, or the file to add to. An indexed placeholder that receives no argument stays in the text literally, so a bare `\$2` surviving where the location belongs means none was supplied: fall back to `memory-bank/` and state that you did. Arguments are split on whitespace, so a location that arrives with a colon in it, or as a single word of prose, is a label passed where a path belongs — apply the same fallback.

System health assessment preserves historical understanding of system state. Without this history, we lose crucial context: Did we get better or worse? Are we improving or declining? This perspective enables confident planning for future evolution.

System health assessment answers:
1. Is architectural debt growing or shrinking?
2. Do our documentation and understanding match reality?
3. Which areas growing more complex?
4. Is maintenance burden stable, increasing, or decreasing?
5. What quality metrics trend up/down?
6. What health improvements should we prioritize?

Connects to Chapter 8 theme of long-term system health—preserved health assessments enable informed evolution decisions rather than guessing about system state.
</context>

<thinking>
Before assessing system health:
1. What was system state at start of assessment period?
2. What has changed (architecturally, operationally)?
3. What debt was incurred, what was paid down?
4. How current is our documentation?
5. Which areas more complex now?
6. What's our maintenance burden trend?
7. Are quality metrics improving or degrading?
8. What health concerns should we address?
</thinking>

<output-format>

## System Health Assessment Pattern

```
# System Health Assessment: {{system_name}}

Assessment Period: {{assessment_period}}
Assessment Date: [YYYY-MM-DD]
Assessed By: [Names]
System: {{system_name}}
Documentation: {{memory_bank_location}}

## Executive Summary

**Overall health:** [Improving / Stable / Declining / Mixed]

**Key findings:**
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Priorities for improvement:**
- [Priority 1]
- [Priority 2]
- [Priority 3]

## Assessment Dimensions

```

---

## Health Dimensions Pattern

```
### 1. Architectural Debt Assessment

Current debt level: [LOW / MEDIUM / HIGH / CRITICAL]
Trend: [Increasing / Stable / Decreasing]
Evidence: [What indicates this debt level]

Debt categories:
- Category 1: [Description]
  - Examples: [Specific debt items]
  - Impact: [Performance/maintainability/scalability impact]
  - Priority to address: [HIGH / MEDIUM / LOW]

- Category 2: [Description]
  - [Same structure]

Debt accumulation rate:
- Created this period: [How much debt created]
- Paid down this period: [How much debt addressed]
- Net change: [Growing/stable/shrinking]

---

### 2. Documentation Currency

Memory bank assessment:
- Does documentation match current system reality? [% confidence]
- Are architectural decisions documented? [Yes / Partially / No]
- Are operational procedures current? [Yes / Partially / No]
- Are technical decisions (ADRs) up to date? [Yes / Partially / No]

Documentation gaps:
- Critical gaps: [Missing documentation that blocks decisions]
- Important gaps: [Documentation that would help but not critical]
- Nice-to-have gaps: [Helpful but lower priority]

---

### 3. Complexity Assessment

Areas increasing in complexity:
- [Area 1]: [Why increasing, impact]
- [Area 2]: [Why increasing, impact]

Areas decreasing in complexity:
- [Area 1]: [Why decreasing, impact]
- [Area 2]: [Why decreasing, impact]

Complexity hot spots:
- [Complex area 1]: [Why complex, maintenance burden]
- [Complex area 2]: [Why complex, maintenance burden]

---

### 4. Maintenance Burden Trends

Metrics indicating maintenance burden:
- Production incidents: [Number this period vs previous period]
- Time-to-resolve incidents: [Trend]
- Code review cycle time: [Trend]
- Deployment frequency: [Trend]
- Deployment risk: [Trend]

Maintenance burden drivers:
- [Driver 1]: [How it affects maintenance]
- [Driver 2]: [How it affects maintenance]

---

### 5. Quality Metrics

Performance:
- Latency p95: [Current vs target]
- Throughput: [Current vs capacity]
- Error rate: [Current baseline]

Reliability:
- Availability: [Uptime %]
- MTBF (Mean Time Between Failures): [Trend]
- MTTR (Mean Time To Recover): [Trend]

Code quality:
- Test coverage: [% and trend]
- Linting/static analysis: [Issues trend]
- Code review rejection rate: [Trend]

---

### 6. Operational Health

Observability:
- Monitoring coverage: [% of critical paths monitored]
- Alert effectiveness: [Are alerts actionable]
- Runbook completeness: [Can we follow procedures]

Deployment safety:
- Deployment testing: [Test coverage]
- Rollback capability: [Can we rollback?]
- Deployment incidents: [Number and severity]

Capacity management:
- Headroom: [% of capacity in use]
- Growth trajectory: [When will capacity constrain]
- Scaling capability: [Can we scale if needed]

```

---

## Historical Comparison Pattern

```
## Comparison to Previous Assessment

If previous health assessment exists:

**Previous assessment date:** [Date]
**Previous overall health:** [Improving / Stable / Declining / Mixed]

### What Changed

**Improvements:**
- [Area that improved, evidence]
- [Area that improved, evidence]

**Regressions:**
- [Area that degraded, evidence]
- [Area that degraded, evidence]

**Stable areas:**
- [Area unchanged, why it's important]

### Trends

Multi-period trend analysis:
- Assessment 3 periods ago: [State]
- Assessment 2 periods ago: [State]
- Previous assessment: [State]
- This assessment: [State]

Trend interpretation:
- Is system getting healthier long-term? [Yes / No / Mixed]
- Rate of change: [Improving rapidly / Gradually / Degrading]

```

---

## Health Improvement Plan Pattern

```
## Health Improvement Priorities

### Priority 1: [Health concern]

**Current state:** [Description of current problem]
**Desired state:** [What healthy state looks like]
**Impact of improvement:** [Why fix this]
**Effort estimate:** [Rough effort to improve]
**Timeline:** [When to address]
**Owner:** [Who leads this]

Action items:
1. [Specific action]
2. [Specific action]

Success criteria:
- [How we know improvement worked]

### Priority 2: [Health concern]
- [Same structure]

### Priority 3: [Health concern]
- [Same structure]

```

---

## Example: System Health Assessment

```markdown
# System Health Assessment: PaymentAPI

Assessment Period: Q4 2025 (Oct - Dec 2025)
Assessment Date: 2026-01-05
Assessed By: Casey Brown, Morgan Lee
Documentation: memory-bank/system-health/

## Executive Summary

**Overall health:** Improving (but with concerning trends in certain areas)

**Key findings:**
- Event-driven architecture proving more scalable than anticipated (handling 8000 tx/sec, 60% above projected 5000)
- Operational complexity now visible (RabbitMQ management, service orchestration becoming challenge)
- Code quality declining (test coverage 87% → 82%, code review cycle time increasing)
- Documentation staying current (system changes reflected in memory-bank within 1-2 sprints)

**Priorities for improvement:**
1. Reduce operational complexity (RabbitMQ management automation)
2. Improve code quality practices (re-establish test coverage targets)
3. Address growing service coupling in notification system

---

## Assessment Dimensions

### Architectural Debt

Current debt level: MEDIUM (was LOW)
Trend: Increasing (but acceptable)

Debt categories:
- Debt 1: RabbitMQ cluster management increasingly complex (autofailover not working, manual interventions)
  - Examples: Had to manually reset RabbitMQ queue 2 times, connection pool optimization incomplete
  - Impact: Operational burden, manual work that should be automated
  - Priority: HIGH (operational burden)

- Debt 2: Notification service coupling to payment service still high (shared EventBus, shared config)
  - Examples: Changes to payment events require notification service awareness, shared database tables
  - Impact: Harder to evolve notification service independently than intended
  - Priority: MEDIUM (maintainability impact, not critical)

- Debt 3: Test coverage declined from 91% to 82% (new edge cases in async processing not covered)
  - Examples: Webhook delivery retry scenarios under-tested, idempotency edge cases under-tested
  - Impact: Higher risk of bugs in payment processing
  - Priority: HIGH (quality impact)

Debt accumulation:
- Created this period: Medium (RabbitMQ operational complexity, test coverage gaps, service coupling)
- Paid down this period: Some (addressed database connection pool issues)
- Net change: Increasing (2 items created vs 1 paid down)

### Documentation Currency

Memory-bank assessment:
- Does documentation match current system? 85% (most current, some outdated)
- Architectural decisions documented? Yes (all major decisions have ADRs)
- Operational procedures current? Partially (RabbitMQ runbook needs updates)
- Technical decisions up to date? Yes

Documentation gaps:
- Critical gap: RabbitMQ operational procedures (cluster management, failover, recovery)
- Important gap: Notification service architecture documentation (coupling issues not documented)
- Nice-to-have gap: Migration runbook from monolith to event-driven (for future reference)

### Complexity Assessment

Areas increasing in complexity:
- Service orchestration: Multiple services coordinating via events (payment → notification), added lifecycle management
- RabbitMQ cluster management: Queue depths, connection management, disaster recovery becoming visible challenges
- Idempotency handling: More edge cases discovered, retry logic more complex than initially designed

Areas decreasing in complexity:
- Payment processing logic: Separated from notifications, simpler to understand
- Deployment process: Easier to deploy services independently

Complexity hotspots:
- RabbitMQ cluster: Configuration, tuning, monitoring increasingly complex
- Webhook integration: Stripe webhook reconciliation adds complexity, duplicate detection logic not trivial

### Maintenance Burden Trends

Metrics:
- Production incidents: 3 incidents (vs 2 previous period)
  - Nov incident: RabbitMQ connection pool exhaustion
  - Dec incident: Notification service webhook timeout
  - Dec incident: Duplicate payment processing from webhook retry
- Time-to-resolve: Avg 2 hours (slightly higher than 1.5 hour baseline)
- Code review cycle time: Increasing (3 hours → 4 hours average)
- Deployment frequency: 2-3 per week (stable)
- Deployment risk: Increasing (more services to coordinate)

Maintenance drivers:
- More services to monitor and manage (payment, notification, event orchestration)
- More operational concerns (RabbitMQ tuning, webhook management)

### Quality Metrics

Performance:
- Latency p95: 150ms (target: <200ms, OK)
- Throughput: 8000 tx/sec (target: 5000+, exceeding)
- Error rate: 0.5% (target: <1%, OK)

Reliability:
- Availability: 99.8% (down from 99.9% previous period)
- MTBF: Increasing (longer time between incidents, good)
- MTTR: 2 hours (slightly up from 1.5 hours)

Code quality:
- Test coverage: 82% (target: 90%+, declining)
- Static analysis issues: +15% new issues (vs previous period)
- Code review rejection: 8% (up from 5%)

### Operational Health

Observability:
- Monitoring coverage: 85% (most critical paths, some gaps in notification service)
- Alert effectiveness: 70% (30% false positives, noise level high)
- Runbook completeness: 75% (missing RabbitMQ procedures)

Deployment safety:
- Test coverage: 82% (declining, concerning)
- Rollback capability: Feature flags work, infrastructure rollback takes ~15 minutes
- Deployment incidents: 1 deployment issue (webhook handler deployed with race condition)

Capacity:
- Headroom: 20% (8000 tx/sec actual, 10000 tx/sec capacity estimate)
- Scaling: Can scale with more RabbitMQ nodes and payment processor instances
- Timeline: 1-2 more quarters before capacity concern

---

## Comparison to Previous Assessment

**Previous assessment:** Sept 2025
**Previous overall health:** Stable (new event-driven system just deployed)

### What Changed

**Improvements:**
- Throughput exceeding expectations (8000 vs 5000 projected capacity)
- Deployed smoothly with 0 incidents during 3-month stabilization
- Team learned event-driven patterns, confidence improving
- Documentation staying current with system changes

**Regressions:**
- Operational complexity more visible than anticipated (RabbitMQ becoming management burden)
- Test coverage declining (82% vs 91% after deployment)
- Code review cycle time increasing (3 → 4 hours)
- Service coupling not reduced as much as hoped (notification service more coupled than intended)

**Stable areas:**
- Reliability good (99.8% is healthy)
- Deployment process working
- Team velocity maintaining (able to add features while managing operational issues)

### Trends

- 3 periods ago (July 2025): Event-driven system being designed, monolith running
- 2 periods ago (Aug 2025): Migration in progress, parallel systems running
- Previous (Sept 2025): Event-driven deployed, stable but new complexity visible
- This assessment (Q4): Systems stabilizing, some debt accumulation but generally positive trend

Long-term trend: System improving overall (scaling well, running reliably), but operational complexity and code quality need attention.

---

## Health Improvement Priorities

### Priority 1: Reduce Operational Complexity - RabbitMQ Management

**Current state:** Manual RabbitMQ cluster management, required 2 interventions this quarter

**Desired state:** Automated RabbitMQ management (cluster formation, failover, recovery)

**Impact:** Reduce operational burden from 2-3 manual interventions per quarter to near-zero, improve reliability

**Effort:** Medium (2-3 sprints for automation tooling)

**Timeline:** Q1 2026

**Owner:** Platform team

Action items:
1. Evaluate RabbitMQ cluster orchestration tools (Kubernetes operator, etc.)
2. Implement automated failover and recovery
3. Add monitoring for cluster health

Success criteria:
- 0 manual RabbitMQ interventions in Q1 2026
- Cluster automatically recovers from failures

---

### Priority 2: Improve Code Quality - Restore Test Coverage

**Current state:** Test coverage declined from 91% to 82%, quality metrics concerning

**Desired state:** Restore test coverage to 90%+, address specific gaps in async/webhook scenarios

**Impact:** Reduce bug risk in payment processing, improve confidence in changes

**Effort:** Medium (1-2 sprints for focus on test coverage)

**Timeline:** Q1 2026

**Owner:** PaymentAPI team

Action items:
1. Identify test coverage gaps (async scenarios, webhook handling, idempotency edge cases)
2. Add tests for identified gaps
3. Re-establish code review checklist for test coverage verification

Success criteria:
- Test coverage restored to 90%+ by end of Q1
- 0 test coverage regressions in subsequent quarters

---

### Priority 3: Address Service Coupling - Decouple Notification Service

**Current state:** Notification service coupled to payment service (shared events, shared config, shared DB tables)

**Desired state:** Notification service decoupled (independent events, independent config, independent DB)

**Desired state:** Notification service independent, can evolve separately

**Impact:** Easier to modify notification service without affecting payment processing

**Effort:** High (3-4 sprints for full decoupling)

**Timeline:** Q1-Q2 2026

**Owner:** Notification service team + Platform architecture

Action items:
1. Design event schema for payment → notification (currently tightly coupled)
2. Migrate notification to independent database
3. Separate configuration management

Success criteria:
- Notification service can deploy independently without affecting payment processing
- 0 dependency on payment service schema changes

```
```

</output-format>

<instructions>
CRITICAL: System health assessment is about understanding long-term trends, not finding problems to fix.

DO NOT:
- Treat as problem discovery process (it's trend analysis)
- Ignore areas that are improving (celebrate improvements)
- Make recommendations without understanding root causes
- Skip historical comparison (trends matter more than snapshots)
- Assume all debt is bad (some debt is acceptable trade-off)

ALWAYS:
- Compare to previous assessments (trends reveal pattern)
- Distinguish between growing debt and temporary fluctuations
- Connect health metrics to system performance and reliability
- Document both current state and trajectory
- Provide context for why health is trending certain direction
- Identify what decisions enabled health improvements or contributed to decline
- Link improvements to specific actions taken (what worked?)

REMEMBER: System health assessment enables informed evolution decisions. "Should we refactor this service?" "Should we invest in automation?" These decisions require understanding not just current state but historical trend. Improving systems warrant different decisions than declining ones.
</instructions>

<examples>

[See template example above - demonstrates PaymentAPI health assessment Q4 2025 with quarterly comparisons, specific metrics, trend analysis, and prioritized improvements]

</examples>
