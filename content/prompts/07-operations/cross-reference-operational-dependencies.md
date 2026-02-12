---
# === Identity ===
id: cross-reference-operational-dependencies
name: Map runtime dependencies and establish bidirectional cross-references between operational and development knowledge
version: v1

# === Classification ===
chapter: 7
category: operations
subcategory: foundation
tags:
  - operations
  - dependencies
  - cross-references
  - runbooks
  - incidents
  - system-architecture
  - operational-knowledge
  - bidirectional-links
  - knowledge-integration
  - sre

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Map runtime dependencies and establish bidirectional cross-references between operational and development knowledge.
    Connect operational runbooks to system design, incident reports to architectural decisions, ensuring operational and development knowledge remain coherent as systems evolve.
  argument-hint: "[system_name] [dependency_scope] [memory_bank_location] [operations_memory_location]"
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
    description: The system or service being mapped
    example: "PaymentAPI"
    maps-to: "$0"
  - name: dependency_scope
    description: Which dependencies to map
    example: "Direct runtime dependencies"
    maps-to: "$1"
  - name: memory_bank_location
    description: Where development knowledge lives
    example: "memory-bank/"
    maps-to: "$2"
  - name: operations_memory_location
    description: Where operational knowledge lives
    example: "operations-memory-bank/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/cross-reference-operational-dependencies
  marketplace:
    plugin: constellize-operations

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Map runtime dependencies for {{system_name}} and establish bidirectional cross-references connecting operational runbooks to system design documentation, incident reports to architectural decisions, and performance baselines to capacity-related design choices, ensuring operational and development knowledge remain coherent as systems evolve.
</task>

<context>
System: {{system_name}}
Dependency Scope: {{dependency_scope}}
Development Memory: {{memory_bank_location}}
Operations Memory: {{operations_memory_location}}

Operational dependencies include runtime service dependencies, data flow dependencies, infrastructure dependencies, and shared resource dependencies. These must connect to design documentation explaining why dependencies exist, what constraints they impose, and how they affect operational behavior.

Cross-references enable engineers to traverse from operational context (runbook, incident) to development context (architecture, design decisions) and back, supporting rapid understanding during incidents and ensuring operational knowledge evolves with system changes.
</context>

<thinking>
Before mapping dependencies:
1. What services does this system call at runtime?
2. What services call this system?
3. What shared infrastructure does this system depend on?
4. Where are design decisions documenting these dependencies?
5. What operational constraints do dependencies impose?
</thinking>

<output-format>

## Discovery Pattern

```
Runtime Dependency Discovery:

Upstream Dependencies (Systems this service calls):
Service: [Name]
- Purpose: [Why dependency exists]
- Criticality: [CRITICAL / HIGH / MEDIUM / LOW]
- Failure mode: [What happens if unavailable]
- Documentation: [Where design documented]
- Operational runbook: [Where operational procedures documented]

Downstream Dependencies (Systems calling this service):
Service: [Name]
- Usage: [How they depend on this service]
- Criticality: [Impact if this service fails]
- SLO impact: [How this service's SLO affects theirs]
- Documentation: [Where their design documented]
- Operational runbook: [Where their runbooks reference this service]

Infrastructure Dependencies:
Component: [Database, cache, message queue, etc.]
- Purpose: [Why needed]
- Criticality: [CRITICAL / HIGH / MEDIUM / LOW]
- Failure mode: [What happens if unavailable]
- Configuration: [Where documented]
- Operational procedures: [Backup, recovery, scaling]

Shared Resource Dependencies:
Resource: [Shared service, data store, rate limit, etc.]
- Usage: [How this system uses resource]
- Contention: [Other systems competing for resource]
- Limits: [Capacity constraints]
- Impact: [What happens when limit reached]
```

---

## Dependency Map Pattern

```
Dependency Map for {{system_name}}:

┌─────────────────┐
│  Client Apps    │ (Downstream)
└────────┬────────┘
         ↓ HTTP/gRPC
┌─────────────────────────┐
│    {{system_name}}      │ ← THIS SERVICE
└─────┬──────────┬────────┘
      ↓          ↓
  ┌────────┐  ┌──────────┐ (Upstream)
  │Database│  │Cache API │
  └────────┘  └──────────┘

Critical Path:
Client → {{system_name}} → Database (CRITICAL: 100% of requests)
Client → {{system_name}} → Cache API (HIGH: 80% of requests, degrades without)

Operational Impact:
- Database failure: Complete outage
- Cache API failure: 3x latency increase, degraded performance
- {{system_name}} failure: Impacts [downstream services]

Documentation Links:
Architecture: {{memory_bank_location}}/systemPatterns.md#dependencies
Design Decisions: {{memory_bank_location}}/systemPatterns.md#cache-strategy
Operational Runbooks: {{operations_memory_location}}/runbooks/incident-response.md#dependency-failures
```

---

## Cross-Reference Pattern (Development → Operations)

```
File: {{memory_bank_location}}/systemPatterns.md

## System Architecture

### Dependencies

**Database (PostgreSQL):**
Design rationale: [Why this dependency exists]
Constraints: [Performance characteristics, limitations]
Operational context:
- Runbook: {{operations_memory_location}}/runbooks/database-procedures.md
- Performance baseline: {{operations_memory_location}}/performance/database-metrics.md
- Recent incidents: {{operations_memory_location}}/incidents/2026-01-15-db-connection-pool.md
- Failover procedures: {{operations_memory_location}}/runbooks/database-failover.md

**Cache API (Redis):**
Design rationale: [Why this dependency exists]
Constraints: [Cache invalidation strategy, TTLs]
Operational context:
- Runbook: {{operations_memory_location}}/runbooks/cache-procedures.md
- Performance baseline: {{operations_memory_location}}/performance/cache-metrics.md
- Degradation behavior: {{operations_memory_location}}/runbooks/incident-response.md#cache-failure

**Downstream Impact:**
This service is depended on by:
- [ServiceA]: {{operations_memory_location}}/dependencies/downstream-impacts.md#serviceA
- [ServiceB]: {{operations_memory_location}}/dependencies/downstream-impacts.md#serviceB

SLO implications documented: {{operations_memory_location}}/dependencies/service-level-objectives.md
```

---

## Cross-Reference Pattern (Operations → Development)

```
File: {{operations_memory_location}}/dependencies/operational-dependencies.md

# Operational Dependencies for {{system_name}}

## Upstream Dependencies (We call these)

### Database (PostgreSQL)
Criticality: CRITICAL
Failure Mode: Complete service outage

Design Context:
- Architecture: {{memory_bank_location}}/systemPatterns.md#database-layer
- Connection pooling design: {{memory_bank_location}}/systemPatterns.md#connection-management
- Schema design: {{memory_bank_location}}/techContext.md#database-schema

Operational Procedures:
- Connection failures: {{operations_memory_location}}/runbooks/database-procedures.md#connection-troubleshooting
- Performance degradation: {{operations_memory_location}}/runbooks/database-procedures.md#performance-investigation
- Failover: {{operations_memory_location}}/runbooks/database-failover.md

Recent Incidents:
- 2026-01-15: Connection pool exhaustion
  - Incident: {{operations_memory_location}}/incidents/2026-01-15-db-connection-pool.md
  - Root cause: Design assumption about connection reuse
  - Design updated: {{memory_bank_location}}/systemPatterns.md#connection-management (see revision note)

Performance Baseline:
- Query latency: {{operations_memory_location}}/performance/database-metrics.md
- Connection pool usage: {{operations_memory_location}}/performance/database-metrics.md#connection-pool

### Cache API (Redis)
Criticality: HIGH (degrades without, does not fail)
Failure Mode: 3x latency increase, increased database load

Design Context:
- Caching strategy: {{memory_bank_location}}/systemPatterns.md#caching-strategy
- Invalidation design: {{memory_bank_location}}/systemPatterns.md#cache-invalidation
- Degradation handling: {{memory_bank_location}}/systemPatterns.md#graceful-degradation

Operational Procedures:
- Cache unavailable: {{operations_memory_location}}/runbooks/incident-response.md#cache-failure
- Cache warming: {{operations_memory_location}}/runbooks/deployment-runbook.md#cache-warming
- Performance monitoring: {{operations_memory_location}}/performance/cache-metrics.md

---

## Downstream Dependencies (These call us)

### Client Mobile App
Impact if we fail: CRITICAL (payment processing blocked)
SLO Requirements: 99.9% availability, <200ms p95 latency

Their Documentation:
- How they use us: [Link to their memory bank if accessible]
- Their degradation: [How they handle our failures]

Our SLO:
- Documented: {{operations_memory_location}}/dependencies/service-level-objectives.md
- Monitoring: [Link to SLO dashboard]

Operational Coordination:
- On-call contact: [PagerDuty rotation or contact method]
- Incident escalation: {{operations_memory_location}}/runbooks/incident-response.md#escalation

### Analytics Service
Impact if we fail: MEDIUM (delayed analytics, not real-time critical)
SLO Requirements: 99.5% availability, <1s p95 latency acceptable

Their Documentation:
- How they use us: [Link or description]
- Their degradation: Queue events, replay later

Our SLO:
- Documented: {{operations_memory_location}}/dependencies/service-level-objectives.md#analytics

---

## Infrastructure Dependencies

### Container Orchestration (Kubernetes/ECS/etc.)
- Deployment procedures: {{operations_memory_location}}/runbooks/deployment-runbook.md
- Design decisions: {{memory_bank_location}}/techContext.md#deployment-architecture
- Scaling policies: {{operations_memory_location}}/performance/capacity-planning.md

### Load Balancer
- Health check design: {{memory_bank_location}}/systemPatterns.md#health-checks
- Routing policies: {{operations_memory_location}}/runbooks/deployment-runbook.md#traffic-routing
- Failover behavior: {{operations_memory_location}}/runbooks/incident-response.md#load-balancer-issues

### Monitoring & Observability
- Metrics design: {{memory_bank_location}}/systemPatterns.md#observability
- Alert thresholds: {{operations_memory_location}}/runbooks/alert-response.md
- Logging strategy: {{memory_bank_location}}/techContext.md#logging
```

---

## Bidirectional Validation Pattern

```
Cross-Reference Validation Checklist:

For Each Upstream Dependency:
□ Development memory bank documents design rationale
□ Development memory bank links to operational runbooks
□ Operations memory bank documents operational procedures
□ Operations memory bank links back to design documentation
□ Bidirectional references verified (both directions exist)

For Each Downstream Dependency:
□ This service's SLO documented in operations memory bank
□ This service's development memory bank acknowledges downstream impacts
□ Operations memory bank documents coordination procedures
□ Escalation paths documented

For Each Infrastructure Dependency:
□ Design decisions documented in development memory bank
□ Operational procedures documented in operations memory bank
□ Cross-references bidirectional

For Each Incident Referencing Dependencies:
□ Incident links to relevant design documentation
□ Design documentation updated if incident revealed assumption
□ Operational runbooks updated with lessons learned

Automated Validation (if applicable):
□ CI check verifies all cross-reference links resolve
□ Periodic review scheduled (monthly) for cross-reference currency
□ Broken link detection configured
```

---

## Incident Integration Pattern

```
File: {{operations_memory_location}}/incidents/2026-01-15-db-connection-pool.md

# Incident: Database Connection Pool Exhaustion

Date: 2026-01-15
Severity: SEV-1 (Complete outage)
Duration: 47 minutes

## Dependency Context

Affected Dependency: Database (PostgreSQL)
Dependency Criticality: CRITICAL
Design Documentation: {{memory_bank_location}}/systemPatterns.md#database-layer

## Root Cause

Design assumption: Connection pool size adequate based on traffic estimates
Reality: Traffic pattern changed, connection reuse assumption violated

Design Documentation Impact:
- UPDATED: {{memory_bank_location}}/systemPatterns.md#connection-management
  - Added: Connection pool sizing calculation
  - Added: Traffic pattern considerations
  - Added: Monitoring requirements

## Operational Changes

Runbook Updates:
- {{operations_memory_location}}/runbooks/database-procedures.md#connection-troubleshooting
  - Added: Connection pool exhaustion detection
  - Added: Emergency pool size increase procedure

Performance Baseline Updates:
- {{operations_memory_location}}/performance/database-metrics.md#connection-pool
  - Added: Connection pool utilization alerting thresholds

## Cross-Reference Updates

Development → Operations:
- {{memory_bank_location}}/systemPatterns.md now references this incident as example

Operations → Development:
- {{operations_memory_location}}/runbooks/database-procedures.md now references updated design

Bidirectional: ✓ Verified
```

---

## Maintenance Pattern

```
Weekly Cross-Reference Review:

New Incidents:
- [ ] Extract dependency failures from incidents
- [ ] Check if design assumptions need updating
- [ ] Verify cross-references added to incident documentation
- [ ] Update runbooks with lessons learned

Development Changes:
- [ ] Review merged PRs for new dependencies
- [ ] Check if operational runbooks need updates
- [ ] Verify cross-references added to design docs
- [ ] Update dependency map if topology changed

Monthly Dependency Audit:

Upstream Dependencies:
- [ ] All upstream dependencies documented
- [ ] Design rationale current
- [ ] Operational runbooks current
- [ ] Bidirectional cross-references validated

Downstream Dependencies:
- [ ] All downstream dependencies identified
- [ ] SLO commitments documented
- [ ] Operational coordination procedures current

Infrastructure Dependencies:
- [ ] Infrastructure changes reflected in docs
- [ ] Deployment procedures current
- [ ] Scaling policies validated

Quarterly Deep Review:

Dependency Map Accuracy:
- [ ] Validate dependency map matches production reality
- [ ] Check for undocumented dependencies (observability data)
- [ ] Review criticality assessments (still accurate?)
- [ ] Update failure mode documentation

Cross-Reference Health:
- [ ] Automated link checking results reviewed
- [ ] Broken references fixed
- [ ] Obsolete references removed
- [ ] New cross-references added where needed

Team Feedback:
- [ ] On-call engineers can navigate cross-references effectively
- [ ] Incident responders find cross-references helpful
- [ ] Development team uses operational context during design
```

</output-format>

<instructions>
CRITICAL: Cross-references must be bidirectional and maintained continuously.

DO NOT:
- Document dependencies without linking to design rationale
- Create runbooks without linking to system architecture
- Document incidents without linking to affected design decisions
- Assume dependencies are obvious (document even "obvious" ones)
- Let cross-references become stale

ALWAYS:
- Map both upstream and downstream dependencies
- Establish bidirectional cross-references (both directions)
- Link incidents to design documentation
- Update design docs when incidents reveal assumptions
- Validate cross-references remain accurate over time
- Document operational constraints imposed by dependencies

REMEMBER: Cross-references are only valuable if they're current. A broken link during an incident is worse than no link—it wastes critical time and erodes trust in documentation.
</instructions>

<examples>

## Example 1: Payment API Dependency Mapping

```
System: PaymentAPI
Dependency Scope: Direct runtime dependencies
Development Memory: memory-bank/
Operations Memory: memory-bank/operations/

Discovery:

UPSTREAM DEPENDENCIES:

Database (PostgreSQL):
- Purpose: Store payment transactions, account data
- Criticality: CRITICAL (100% of operations require database)
- Failure mode: Complete service outage, no degraded mode
- Documentation: memory-bank/systemPatterns.md#database-layer
- Operational runbook: memory-bank/operations/runbooks/database-procedures.md

Card Processing API (Stripe):
- Purpose: Process credit card payments
- Criticality: CRITICAL (payment processing requires this)
- Failure mode: Cannot process card payments (can still process ACH)
- Documentation: memory-bank/systemPatterns.md#payment-providers
- Operational runbook: memory-bank/operations/runbooks/payment-provider-failures.md

Cache (Redis):
- Purpose: Cache account lookups, rate limit tracking
- Criticality: HIGH (degrades performance without, does not fail)
- Failure mode: 5x increase in database load, 3x latency increase
- Documentation: memory-bank/systemPatterns.md#caching-strategy
- Operational runbook: memory-bank/operations/runbooks/cache-procedures.md

DOWNSTREAM DEPENDENCIES:

Mobile App:
- Usage: Primary payment interface for customers
- Criticality: CRITICAL (customer-facing payment flow)
- SLO impact: Our 200ms p95 directly affects their checkout UX
- Documentation: [Mobile team's memory bank - separate repo]
- Operational coordination: memory-bank/operations/dependencies/downstream-impacts.md#mobile-app

Analytics Service:
- Usage: Async payment event processing
- Criticality: MEDIUM (not real-time critical)
- SLO impact: Our availability affects their data freshness, not correctness
- Documentation: [Analytics team's memory bank]
- Operational coordination: memory-bank/operations/dependencies/downstream-impacts.md#analytics

INFRASTRUCTURE DEPENDENCIES:

Kubernetes Cluster:
- Purpose: Container orchestration, scaling, health management
- Criticality: CRITICAL (deployment platform)
- Failure mode: Cannot scale, deploy, or recover from node failures
- Configuration: memory-bank/techContext.md#deployment-architecture
- Operational procedures: memory-bank/operations/runbooks/deployment-runbook.md

Application Load Balancer:
- Purpose: Traffic routing, health checks, TLS termination
- Criticality: CRITICAL (entry point for all traffic)
- Failure mode: No traffic reaches service
- Configuration: memory-bank/techContext.md#load-balancer-configuration
- Operational procedures: memory-bank/operations/runbooks/traffic-management.md

Dependency Map:

┌──────────────┐
│  Mobile App  │ (Downstream - CRITICAL)
└──────┬───────┘
       ↓ HTTPS
┌──────────────────────────────────┐
│   Application Load Balancer      │
└──────┬───────────────────────────┘
       ↓
┌──────────────────────────────────┐
│   PaymentAPI (THIS SERVICE)      │
└───┬────────┬────────┬─────────┬──┘
    ↓        ↓        ↓         ↓
┌────────┐ ┌─────┐ ┌─────────┐ ┌──────────┐
│Database│ │Redis│ │ Stripe  │ │Analytics │
│(CRIT)  │ │(HIGH)│ │  API    │ │ Service  │
└────────┘ └─────┘ │(CRIT)   │ │(MEDIUM)  │
                   └─────────┘ └──────────┘

Cross-References (Development → Operations):

File: memory-bank/systemPatterns.md

## Database Layer

Architecture: PostgreSQL with connection pooling (pgbouncer)

Design Rationale:
- ACID transactions required for payment consistency
- Connection pooling for efficient resource usage
- Read replicas for analytics queries (not implemented yet)

Constraints:
- Connection pool size: 50 (based on expected concurrency)
- Query timeout: 5 seconds (prevents long-running queries)
- Max connections per replica: 100

Operational Context:
- Procedures: memory-bank/operations/runbooks/database-procedures.md
- Performance baseline: memory-bank/operations/performance/database-metrics.md
- Connection troubleshooting: memory-bank/operations/runbooks/database-procedures.md#connection-troubleshooting
- Recent incidents:
  - 2026-01-15: Connection pool exhaustion - memory-bank/operations/incidents/2026-01-15-db-connection-pool.md
  - Root cause required design update (connection pool sizing strategy revised)

## Caching Strategy

Architecture: Redis for account lookups and rate limiting

Design Rationale:
- Account lookups hot path (80% cache hit rate target)
- Rate limiting requires atomic operations (Redis INCR)
- Graceful degradation: System functions without cache, just slower

Constraints:
- Cache TTL: 5 minutes (balance freshness vs load)
- Eviction policy: LRU (least recently used)
- No critical data in cache (always backed by database)

Operational Context:
- Procedures: memory-bank/operations/runbooks/cache-procedures.md
- Cache failure behavior: memory-bank/operations/runbooks/incident-response.md#cache-failure
- Performance impact: memory-bank/operations/performance/cache-metrics.md
- Degraded mode: System bypasses cache, increases database load 5x

## Payment Provider Integration

Architecture: Stripe API for card processing

Design Rationale:
- PCI compliance via Stripe (we don't store card numbers)
- Idempotency keys prevent duplicate charges
- Webhook handling for async payment confirmations

Constraints:
- Rate limits: 100 requests/second per API key
- Timeout: 30 seconds for payment API calls
- Retry strategy: Exponential backoff, max 3 retries

Operational Context:
- Procedures: memory-bank/operations/runbooks/payment-provider-failures.md
- API failure handling: memory-bank/operations/runbooks/incident-response.md#stripe-api-failures
- Webhook monitoring: memory-bank/operations/performance/webhook-metrics.md

Cross-References (Operations → Development):

File: memory-bank/operations/dependencies/operational-dependencies.md

# Operational Dependencies for PaymentAPI

## Upstream: Database (PostgreSQL)
Criticality: CRITICAL
Failure Mode: Complete outage

Design Context:
- Architecture: memory-bank/systemPatterns.md#database-layer
- Connection pooling: memory-bank/systemPatterns.md#connection-management
- Schema design: memory-bank/techContext.md#database-schema

Operational Procedures:
- Connection failures: memory-bank/operations/runbooks/database-procedures.md#connection-troubleshooting
- Performance degradation: memory-bank/operations/runbooks/database-procedures.md#performance-investigation
- Query timeouts: memory-bank/operations/runbooks/database-procedures.md#timeout-investigation

Recent Incidents:
- 2026-01-15: Connection pool exhaustion (SEV-1, 47 minutes)
  - Incident: memory-bank/operations/incidents/2026-01-15-db-connection-pool.md
  - Root cause: Design assumption about connection reuse violated
  - Design updated: memory-bank/systemPatterns.md#connection-management (see 2026-01-16 update)
  - Runbook updated: Connection pool monitoring added

Performance Baseline:
- Query latency p95: 15ms (baseline: memory-bank/operations/performance/database-metrics.md)
- Connection pool utilization: 40-60% normal (alert at 80%)

## Upstream: Cache (Redis)
Criticality: HIGH (degrades without, does not fail)
Failure Mode: 5x database load, 3x API latency

Design Context:
- Caching strategy: memory-bank/systemPatterns.md#caching-strategy
- Graceful degradation: memory-bank/systemPatterns.md#graceful-degradation
- Cache invalidation: memory-bank/systemPatterns.md#cache-invalidation

Operational Procedures:
- Cache unavailable: memory-bank/operations/runbooks/incident-response.md#cache-failure
- Degraded mode operation: memory-bank/operations/runbooks/incident-response.md#operating-without-cache
- Cache warming on deployment: memory-bank/operations/runbooks/deployment-runbook.md#cache-warming

Performance Impact:
- With cache: 50ms p95 latency
- Without cache: 150ms p95 latency (degraded but acceptable)
- Database load increase: 5x (monitor database carefully during cache outages)

## Downstream: Mobile App
Impact if PaymentAPI fails: CRITICAL (customer payments blocked)
SLO Requirements: 99.9% availability, <200ms p95 latency

Our SLO Commitment:
- Documented: memory-bank/operations/dependencies/service-level-objectives.md#mobile-app
- Current performance: 99.95% availability, 120ms p95 latency
- Monitoring: [Dashboard link]

Operational Coordination:
- On-call contact: Mobile team PagerDuty rotation
- Incident escalation: memory-bank/operations/runbooks/incident-response.md#downstream-impact-notification
- Communication channel: #payments-incidents Slack channel

Bidirectional Validation:

✓ Database dependency:
  - Development memory documents design: memory-bank/systemPatterns.md#database-layer
  - Development memory links to operations: ✓ (runbooks, incidents, performance)
  - Operations memory documents procedures: memory-bank/operations/runbooks/database-procedures.md
  - Operations memory links to design: ✓ (architecture, connection management, schema)
  - Bidirectional: ✓

✓ Cache dependency:
  - Development memory documents design: memory-bank/systemPatterns.md#caching-strategy
  - Development memory links to operations: ✓ (degraded mode, procedures)
  - Operations memory documents procedures: memory-bank/operations/runbooks/cache-procedures.md
  - Operations memory links to design: ✓ (strategy, invalidation, degradation)
  - Bidirectional: ✓

✓ Stripe API dependency:
  - Development memory documents design: memory-bank/systemPatterns.md#payment-provider-integration
  - Development memory links to operations: ✓ (failure handling, webhooks)
  - Operations memory documents procedures: memory-bank/operations/runbooks/payment-provider-failures.md
  - Operations memory links to design: ✓ (idempotency, retry strategy, webhooks)
  - Bidirectional: ✓

✓ Mobile App downstream:
  - Our SLO documented: memory-bank/operations/dependencies/service-level-objectives.md
  - Our development memory acknowledges impact: memory-bank/systemPatterns.md#downstream-consumers
  - Operations memory documents coordination: ✓
  - Escalation procedures: ✓
  - Bidirectional: ✓

Incident Integration Example:

File: memory-bank/operations/incidents/2026-01-15-db-connection-pool.md

# Incident: Database Connection Pool Exhaustion

Date: 2026-01-15 14:23 UTC
Severity: SEV-1 (Complete outage)
Duration: 47 minutes
Responders: @alice (primary), @bob (secondary)

## Timeline
14:23 - Alerts fire: API requests timing out
14:25 - @alice paged, begins investigation
14:28 - Database connection pool exhaustion identified
14:35 - Emergency connection pool size increase applied
14:42 - Service recovery begins
15:10 - Full recovery confirmed, incident closed

## Dependency Context

Affected Dependency: Database (PostgreSQL)
Dependency Criticality: CRITICAL (per memory-bank/operations/dependencies/operational-dependencies.md#database)
Design Documentation: memory-bank/systemPatterns.md#database-layer

## Root Cause Analysis

Design Assumption: Connection pool size of 50 adequate based on traffic estimates from memory-bank/systemPatterns.md#connection-management

Assumption Violated: Traffic pattern changed (mobile app retry behavior during network issues created connection surge)

Contributing Factors:
- Mobile app exponential backoff not coordinated with API (design gap)
- No alerting on connection pool utilization approaching capacity
- Connection pool sizing calculation didn't account for retry amplification

## Design Documentation Impact

UPDATED: memory-bank/systemPatterns.md#connection-management
Changes:
- Added connection pool sizing calculation accounting for retry amplification
- Added traffic pattern considerations (retry behavior, network issues)
- Added monitoring requirements (connection pool utilization alerting)
- Cross-referenced this incident as example

UPDATED: memory-bank/systemPatterns.md#graceful-degradation
Changes:
- Added backpressure signaling to mobile app during high load
- Added circuit breaker pattern for database connections

## Operational Runbook Updates

UPDATED: memory-bank/operations/runbooks/database-procedures.md#connection-troubleshooting
Added:
- Connection pool exhaustion detection procedure
- Emergency connection pool size increase procedure (used in this incident)
- Connection pool utilization monitoring setup

UPDATED: memory-bank/operations/performance/database-metrics.md#connection-pool
Added:
- Connection pool utilization alerting thresholds (alert at 80%, critical at 90%)
- Historical connection pool usage patterns
- Correlation with traffic patterns

## Cross-Reference Updates

Development → Operations:
- memory-bank/systemPatterns.md#connection-management now references:
  - This incident as example: memory-bank/operations/incidents/2026-01-15-db-connection-pool.md
  - Updated runbook: memory-bank/operations/runbooks/database-procedures.md#connection-troubleshooting

Operations → Development:
- memory-bank/operations/runbooks/database-procedures.md now references:
  - Updated design: memory-bank/systemPatterns.md#connection-management
  - Updated graceful degradation: memory-bank/systemPatterns.md#graceful-degradation

Bidirectional Validation: ✓ Verified 2026-01-16

## Action Items
- [DONE] Increase connection pool size to 100
- [DONE] Add connection pool utilization alerting
- [DONE] Update design documentation with lessons learned
- [IN PROGRESS] Coordinate with mobile team on retry behavior
- [TODO] Implement backpressure signaling to mobile app
```

Why this works:
- Complete dependency mapping (upstream, downstream, infrastructure)
- Bidirectional cross-references (development ↔ operations)
- Incident integrated with design documentation
- Design assumptions documented and validated through incidents
- Cross-references updated when reality differs from design
- Validation checklist ensures cross-references remain current

</examples>
