---
# === Identity ===
id: design-proactive-operational-architecture
name: Design proactive operational architecture during development
version: v1

# === Classification ===
chapter: 7
category: operations
subcategory: proactive
tags:
  - operations
  - proactive-design
  - health-checks
  - failure-modes
  - observability
  - graceful-degradation
  - capacity-planning
  - deployment-procedures
  - resilience
  - sre

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Design proactive operational architecture during development.
    Build resilience into system design by planning health checks, failure modes, observability, degradation patterns, and deployment procedures before first production deployment.
  argument-hint: "[system_name] [deployment_environment] [criticality] [memory_bank_location]"
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
    description: The system or service being designed
    example: "PaymentAPI"
    maps-to: "$0"
  - name: deployment_environment
    description: Target deployment environment
    example: "Kubernetes cluster"
    maps-to: "$1"
  - name: criticality
    description: System criticality level
    example: "CRITICAL (customer-facing payments)"
    maps-to: "$2"
  - name: memory_bank_location
    description: Where to document operational design
    example: "memory-bank/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    chapter: 7
    description: |
      **Design proactive operational architecture during development** by planning health checks, failure modes, observability, graceful degradation, and deployment procedures before first production deployment. Build resilience into system design rather than discovering operational requirements through incidents.
    preview: |
      "...DEPENDENCY FAILURE MODE: Database unreachable → Fail fast, return 503 / Cache unreachable → Degrade gracefully, bypass cache, continue processing (slower but functional) / Rationale: Cache is performance optimization not critical path, payments must succeed even if slower..."
  website:
    include: true
    path: /prompts/design-proactive-operational-architecture
  marketplace:
    plugin: constellize:deliver

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Design proactive operational architecture for {{system_name}} by systematically planning health checks, failure modes, observability, degradation patterns, capacity constraints, and deployment procedures during development—building resilience into system design before first production deployment rather than discovering operational requirements through incidents.
</task>

<context>
System: {{system_name}}
Deployment: {{deployment_environment}}
Criticality: {{criticality}}
Documentation: {{memory_bank_location}}

This location is a path, not a label — a directory ending in a slash, or the file to add to. An indexed placeholder that receives no argument stays in the text literally, so a bare `\$3` surviving where the location belongs means none was supplied: fall back to `memory-bank/` and state that you did. Arguments are split on whitespace, so a location that arrives with a colon in it, or as a single word of prose, is a label passed where a path belongs — apply the same fallback.

Proactive operational design captures operational concerns during architecture and implementation phases, transforming operational requirements into explicit design decisions. This prevents common operational failures (inadequate health checks, missing observability, unexpected failure modes) by making operational behavior a first-class design concern.

Connects to Chapter 4 deployment readiness quality gate—operational design decisions here become validation criteria there.
</context>

<thinking>
Before designing operational architecture:
1. What are the critical paths through this system?
2. What dependencies can fail?
3. How should system behave when dependencies unavailable?
4. What visibility do operators need into system behavior?
5. What capacity constraints exist?
6. How will system be deployed and updated?
</thinking>

<output-format>

## Health Check Design Pattern

```
Health Check Strategy for {{system_name}}:

PRIMARY HEALTH CHECK:
Endpoint: [/health or /healthz or actuator/health or platform-specific]
Purpose: Determine if service should receive traffic
Check Type: [Liveness / Readiness / Both]

Liveness Check (Is service alive?):
- Checks: [Process running, critical threads alive, no deadlocks]
- Failure means: Service should be restarted
- Interval: [30s typical]
- Timeout: [10s typical]
- Failure threshold: [3 consecutive failures typical]

Readiness Check (Is service ready for traffic?):
- Checks:
  - Dependencies available: [Database, cache, upstream APIs]
  - Warmup complete: [Connection pools initialized, caches warm]
  - Resource capacity: [Memory available, disk not full]
- Failure means: Service should not receive traffic (but don't restart)
- Interval: [30s typical]
- Timeout: [10s typical]
- Failure threshold: [3 consecutive failures typical]

Startup Period:
Duration: [40s typical, adjust based on initialization time]
Rationale: Allow service to complete initialization before health checks enforce
Examples:
- Database connection pool initialization: [5-10s]
- Configuration loading: [2-5s]
- Cache warming: [20-30s]
- Total + buffer: [40s]

Health Check Implementation:
- Lightweight: Health checks should not add significant load
- Fast: Complete within timeout (typically <10s)
- Accurate: False positives cause unnecessary restarts, false negatives leave broken service in rotation

Rationale Documentation:
Document why each health check exists and what operational problem it prevents.
```

---

## Failure Mode Design Pattern

```
Failure Mode Planning for {{system_name}}:

DEPENDENCY FAILURE MODES:

Dependency: [Name]
Failure Scenario: [Unavailable, slow, returning errors]

System Behavior:
Option 1: [Fail fast - return error immediately]
Option 2: [Degrade gracefully - reduced functionality]
Option 3: [Retry with backoff]
Option 4: [Circuit breaker pattern]

Chosen Approach: [Option #]
Rationale:
- [Why this approach chosen]
- [Tradeoffs accepted]
- [Impact on system behavior]
- [Impact on upstream callers]

Implementation:
- Timeout: [Duration]
- Retry policy: [Strategy]
- Circuit breaker thresholds: [If applicable]
- Fallback behavior: [If applicable]

Observability:
- Metrics: [What to measure]
- Logs: [What to log at failure]
- Alerts: [When to alert operators]

---

RESOURCE EXHAUSTION FAILURE MODES:

Resource: [Memory, CPU, Disk, Network, File Descriptors, etc.]
Failure Scenario: [Resource exhausted or near capacity]

System Behavior:
Option 1: [Reject new requests (load shedding)]
Option 2: [Degrade service quality]
Option 3: [Fail completely]

Chosen Approach: [Option #]
Rationale:
- [Why this prevents cascading failures]
- [How system recovers when resource available]

Implementation:
- Detection threshold: [When to trigger behavior]
- Backpressure signaling: [How to signal upstream]
- Recovery strategy: [How to return to normal]

Observability:
- Metrics: [Resource utilization tracking]
- Alerts: [Warning and critical thresholds]

---

CASCADING FAILURE PREVENTION:

Timeout Strategy:
- Request timeout: [Duration]
- Rationale: [Prevent resource hogging]
- Implementation: [How enforced]

Rate Limiting:
- Incoming request limits: [Requests per second]
- Per-client limits: [If applicable]
- Rationale: [Protect system from overload]

Bulkhead Pattern:
- Resource isolation: [Separate thread pools, connection pools, etc.]
- Rationale: [Prevent one failure mode from affecting others]

Back Pressure:
- How system signals overload to callers
- How system responds to back pressure from dependencies
```

---

## Observability Design Pattern

```
Observability Architecture for {{system_name}}:

METRICS:

Business Metrics (What matters to users):
- [Metric name]: [What it measures]
  - Type: [Counter / Gauge / Histogram]
  - Purpose: [Why operators need this]
  - Alert threshold: [When to alert]

System Metrics (What matters to operators):
- Request rate: [Requests per second]
- Error rate: [Errors per second, by type]
- Latency: [p50, p95, p99 response times]
- Saturation: [CPU, memory, network, disk utilization]

Dependency Metrics:
- [Dependency name]:
  - Availability: [Success rate calling dependency]
  - Latency: [Response time from dependency]
  - Error types: [Categorized errors]

Custom Metrics:
- [Application-specific metrics]
- Rationale: [Why these matter for this system]

LOGS:

Structured Logging:
- Format: [JSON, key-value pairs, etc.]
- Essential fields: [timestamp, level, request_id, user_id, etc.]
- Correlation IDs: [How to trace requests across services]

Log Levels:
- ERROR: [What constitutes error-level log]
- WARN: [What constitutes warning-level log]
- INFO: [What constitutes info-level log]
- DEBUG: [What to log at debug level (not in production)]

Critical Log Points:
- Request entry/exit: [What to log]
- Dependency calls: [What to log before/after calls]
- Failure conditions: [What context to log at failures]
- State changes: [What state transitions to log]

Sensitive Data Handling:
- PII redaction: [What to scrub from logs]
- Credential handling: [Never log credentials]

TRACES:

Distributed Tracing:
- Trace ID propagation: [How traces connect across services]
- Span creation: [What operations become spans]
- Critical paths: [What to always trace]
- Sampling strategy: [100% for errors, X% for success]

DASHBOARDS:

Operational Dashboard:
- Purpose: Current system health at a glance
- Key metrics: [5-7 most critical metrics]
- Update frequency: [Real-time or near real-time]

Dependency Dashboard:
- Purpose: Upstream and downstream health
- Shows: [Dependency availability, latency, errors]

Capacity Dashboard:
- Purpose: Resource utilization trends
- Shows: [CPU, memory, network, disk over time]
- Helps with: Capacity planning, detecting leaks

ALERTS:

Alert Philosophy:
- Every alert must be actionable
- Alert fatigue is operational failure
- Alerts should indicate specific problem and suggest investigation path

Alert Tiers:
- CRITICAL: Immediate response required (page on-call)
  - [Define what constitutes critical]
  - [Expected response time]
- WARNING: Investigate during business hours
  - [Define what constitutes warning]
- INFO: Awareness only, no action required
  - [When to use info-level alerts]

Alert Examples:
- Error rate > [threshold] for [duration]
- Latency p95 > [threshold] for [duration]
- Dependency [name] availability < [threshold]
- Resource utilization > [threshold]
```

---

## Graceful Degradation Pattern

```
Degradation Strategy for {{system_name}}:

DEGRADATION MODES:

Full Service (Normal Operation):
- All features available
- All dependencies healthy
- Performance meets SLO

Degraded Mode 1: [Name, e.g., "Cache Unavailable"]
Trigger: [What causes this mode]
Behavior:
- Features available: [List what still works]
- Features unavailable: [List what doesn't work]
- Performance impact: [Expected degradation]
- User experience: [How users affected]
Implementation:
- Detection: [How system detects this condition]
- Transition: [How system enters degraded mode]
- Recovery: [How system returns to normal]
Rationale:
- [Why this degradation acceptable]
- [What it prevents]

Degraded Mode 2: [Name]
[Same structure as Mode 1]

Critical Mode (Minimal Service):
Trigger: [Multiple dependencies failed]
Behavior:
- Only essential features available
- [What remains functional]
- [What stops working]
Rationale: [Better than complete failure]

Failure Mode (No Service):
Trigger: [Critical dependency failed - cannot operate]
Behavior:
- Return error to callers
- Log failure reason
- Preserve state if possible
Rationale: [When failing completely is better than incorrect operation]

DEGRADATION SIGNALING:

To Upstream Callers:
- HTTP status codes: [How degradation communicated]
- Response headers: [Degradation indicators]
- Response body: [Error details]

To Operators:
- Metrics: [Degradation mode indicator]
- Logs: [Mode transition logging]
- Alerts: [When to alert on degradation]
```

---

## Capacity Planning Pattern

```
Capacity Planning for {{system_name}}:

RESOURCE CONSTRAINTS:

Compute:
- CPU requirements: [Cores needed per instance]
- Memory requirements: [RAM needed per instance]
- Baseline usage: [Idle resource consumption]
- Peak usage: [Maximum expected consumption]
- Scaling trigger: [When to add capacity]

Storage:
- Data growth rate: [GB per day/week/month]
- Retention requirements: [How long to keep data]
- Projected capacity: [6 month, 1 year projection]
- Cleanup strategy: [How to manage growth]

Network:
- Bandwidth requirements: [Mbps in/out]
- Request rate capacity: [Requests per second]
- Dependency call fan-out: [Requests generated per incoming request]

CONCURRENCY LIMITS:

Thread Pools:
- Size: [Number of threads]
- Rationale: [Why this size]
- Behavior when exhausted: [Queue or reject]

Connection Pools:
- Size: [Number of connections]
- Per-dependency limits: [Breakdown by dependency]
- Rationale: [Based on expected concurrency]
- Timeout: [How long to wait for connection]

Rate Limits:
- Global limit: [Total requests per second]
- Per-client limit: [Requests per second per client]
- Burst capacity: [Short-term spike handling]

SCALING STRATEGY:

Horizontal Scaling:
- Minimum instances: [Count]
- Maximum instances: [Count]
- Scaling trigger: [CPU > X%, latency > Y, etc.]
- Scale-up time: [How long to provision new instance]
- Scale-down criteria: [When to remove instance]

Vertical Scaling:
- When applicable: [Conditions favoring vertical over horizontal]
- Limits: [Maximum instance size]

CAPACITY TESTING:

Load Testing:
- Target load: [Requests per second]
- Sustained duration: [How long to maintain load]
- Success criteria: [Latency, error rate thresholds]

Stress Testing:
- Overload scenario: [Load beyond capacity]
- Goal: Understand failure mode
- Success criteria: [Graceful degradation, no data loss]

Spike Testing:
- Sudden load increase: [Simulate traffic spike]
- Goal: Validate auto-scaling
- Success criteria: [System scales appropriately]
```

---

## Deployment Procedures Pattern

```
Deployment Strategy for {{system_name}}:

DEPLOYMENT APPROACH:

Strategy: [Blue-Green / Rolling / Canary / Feature Flags]
Rationale: [Why this approach chosen]

PRE-DEPLOYMENT CHECKS:

Validation:
□ All tests passing (reference Chapter 4 quality gates)
□ Performance benchmarks within thresholds
□ Security scan passed
□ Dependencies compatible (version check)
□ Configuration validated
□ Rollback plan prepared

Operational Readiness:
□ On-call engineer available
□ Monitoring dashboards ready
□ Alert thresholds configured
□ Runbooks updated
□ Communication plan ready (if high-risk deployment)

DEPLOYMENT PROCEDURE:

Step 1: Pre-Deployment
- [ ] Notify team (if necessary)
- [ ] Verify pre-deployment checks completed
- [ ] Take snapshot/backup (if applicable)

Step 2: Deployment
- [ ] Deploy new version
- [ ] Monitor health checks
- [ ] Verify new version receiving traffic
- [ ] Monitor key metrics (error rate, latency)

Step 3: Validation
- [ ] Smoke tests passed
- [ ] Key flows validated
- [ ] Metrics within acceptable range
- [ ] No increase in errors
- [ ] Latency acceptable

Step 4: Post-Deployment
- [ ] Monitor for [duration, typically 15-30 minutes]
- [ ] Verify no delayed issues
- [ ] Update deployment log
- [ ] Communicate success (if necessary)

ROLLBACK PROCEDURE:

Rollback Triggers:
- Error rate > [threshold]
- Latency > [threshold]
- Health checks failing
- Critical functionality broken

Rollback Steps:
1. [ ] Stop deployment (if in progress)
2. [ ] Revert to previous version
3. [ ] Verify previous version healthy
4. [ ] Investigate failure
5. [ ] Document issue
6. [ ] Plan fix

Rollback Time: [Target time to complete rollback]

DEPLOYMENT RISK ASSESSMENT:

Risk Level: [LOW / MEDIUM / HIGH / CRITICAL]
Factors:
- Scope of changes: [Small / Medium / Large]
- Dependency changes: [Yes / No]
- Database migrations: [Yes / No]
- Configuration changes: [Yes / No]

Additional Precautions for High-Risk Deployments:
- [ ] Deploy during low-traffic period
- [ ] Incremental rollout (canary to small percentage first)
- [ ] Extended monitoring period
- [ ] Explicit approval from [role]
```

---

## Documentation Pattern

```
Operational Design Documentation Location: {{memory_bank_location}}

Document operational design decisions in:

systemPatterns.md:
- Health check strategy and rationale
- Failure mode designs
- Graceful degradation approach
- Cascading failure prevention

techContext.md:
- Observability architecture
- Metrics, logs, traces structure
- Monitoring tools and dashboards
- Alert configuration

operations/runbooks/ (if separate) or embedded:
- Deployment procedures
- Rollback procedures
- Common operational scenarios

operations/performance/ (if separate) or embedded:
- Capacity planning assumptions
- Resource constraints
- Scaling strategy
- Load testing results

Cross-references:
- Link deployment procedures to deployment readiness gate (Chapter 4)
- Link failure modes to system architecture
- Link observability to troubleshooting runbooks
- Link capacity planning to performance baselines
```

</output-format>

<instructions>
CRITICAL: Operational design is not an afterthought. Build resilience into architecture from the start.

DO NOT:
- Design systems without explicit health check strategy
- Ignore failure modes until they happen in production
- Add observability after system deployed
- Assume capacity without testing
- Skip deployment procedure planning

ALWAYS:
- Design health checks that accurately reflect service readiness
- Plan failure behavior for every dependency
- Build observability into system architecture
- Test capacity limits before production
- Document operational design decisions with rationale
- Connect operational design to deployment readiness (Chapter 4)

REMEMBER: Every production incident is an opportunity to improve proactive operational design. When incidents reveal missing observability or unexpected failure modes, update design documentation so future systems benefit from lessons learned.
</instructions>

<examples>

## Example: Payment API Proactive Operational Design

```
System: PaymentAPI
Deployment: Kubernetes cluster
Criticality: CRITICAL (customer-facing payments)
Documentation: memory-bank/

Health Check Design:

PRIMARY HEALTH CHECK:
Endpoint: /health
Purpose: Determine if PaymentAPI should receive traffic

Liveness Check:
- Checks: API process running, HTTP server responding
- Failure means: Pod should be restarted
- Interval: 30s
- Timeout: 5s
- Failure threshold: 3 consecutive failures
- Rationale: If HTTP server can't respond to simple ping, pod is dead

Readiness Check:
- Checks:
  1. Database connection available (pg_isready equivalent)
  2. Redis cache reachable (PING command)
  3. Stripe API reachable (lightweight test endpoint)
  4. Connection pools initialized
  5. Memory available (< 90% utilization)
- Failure means: Remove from load balancer (do not restart)
- Interval: 30s
- Timeout: 10s
- Failure threshold: 3 consecutive failures
- Rationale:
  - Database unavailable: Cannot process payments, should not receive traffic
  - Cache unavailable: Can function but degraded, should not receive traffic if alternative instance available
  - Stripe unavailable: Cannot process card payments
  - Connection pools not initialized: Will fail requests
  - Memory exhausted: Likely to fail requests

Startup Period:
Duration: 40s
Rationale:
- Database connection pool initialization: 5s
- Redis connection initialization: 2s
- Stripe API client initialization: 3s
- Configuration loading: 5s
- Cache warming (user session cache): 20s
- Buffer: 5s
- Total: 40s

Implementation:
```
# Pseudocode for readiness check
GET /health
- Check database: SELECT 1; (timeout: 2s)
- Check Redis: PING (timeout: 1s)
- Check Stripe: GET /v1/account (lightweight, timeout: 5s)
- Check pools: connectionPool.available() > 0
- Check memory: Runtime.memory() < 0.9 * Runtime.maxMemory()
- Return 200 if all pass, 503 if any fail
```

Health Check Trade-offs:
- Stripe API check adds external dependency to readiness
- Alternative: Remove Stripe from readiness, fail fast on actual payment requests
- Decision: Include Stripe in readiness because 100% of payment requests need it
- Result: If Stripe down, pod marked unready, but pod still alive for recovery

---

Failure Mode Design:

DEPENDENCY: Database
Failure Scenario: Database unreachable

System Behavior: Fail fast
- Return 503 Service Unavailable immediately
- Do NOT retry database connections during request
- Log error with correlation ID
- Remove pod from load balancer (readiness check fails)

Rationale:
- Payment system cannot function without database
- Retrying during request increases latency for client
- Better to fail fast and let client retry to healthy instance
- Prevents resource exhaustion (threads waiting on failed connections)

Implementation:
- Connection timeout: 2s (detect failure quickly)
- No retries within request
- Circuit breaker: Open after 5 consecutive failures, half-open after 30s
- Readiness check fails → traffic stops → pod recovers when database returns

Observability:
- Metric: database_connection_errors_total (counter)
- Metric: database_connection_duration_seconds (histogram)
- Log: ERROR level with correlation ID, error detail
- Alert: database_connection_errors > 5 in 1 minute (CRITICAL)

---

DEPENDENCY: Redis Cache
Failure Scenario: Cache unreachable

System Behavior: Degrade gracefully
- Bypass cache, query database directly
- Continue processing payments (slower, but functional)
- Return 200 Success (degraded, not failed)
- Log warning

Rationale:
- Cache is performance optimization, not critical path
- Payments must succeed even if slower
- Database can handle load without cache for short periods
- Better degraded service than failed service

Implementation:
- Cache operation timeout: 500ms (fail fast if cache slow)
- Fallback: Query database if cache miss or timeout
- No retries on cache operations (fail fast, use database)
- Monitor database load increase during cache outage

Observability:
- Metric: cache_hit_rate (gauge, drops to 0% during outage)
- Metric: cache_errors_total (counter)
- Metric: database_query_rate (increases during cache outage)
- Log: WARN level "Cache unavailable, using database fallback"
- Alert: cache_hit_rate < 50% for 5 minutes (WARNING)
- Alert: database_query_rate > 2x baseline (WARNING - capacity concern)

---

DEPENDENCY: Stripe API
Failure Scenario: Stripe API unavailable or slow

System Behavior: Retry with exponential backoff, then fail
- Retry: 3 attempts with exponential backoff (1s, 2s, 4s)
- Total timeout: 10s maximum (including retries)
- After retries exhausted: Return 503 Service Unavailable
- Preserve idempotency: Use Stripe idempotency keys

Rationale:
- Stripe occasionally has transient issues
- Retry with backoff handles transient failures
- 10s total timeout prevents thread exhaustion
- Idempotency keys prevent duplicate charges on retries
- Return 503 signals to client they should retry later

Implementation:
- Request timeout: 3s per attempt
- Backoff: Exponential (1s, 2s, 4s)
- Circuit breaker: Open after 10 consecutive failures (all retries), half-open after 60s
- Idempotency: Generate key from payment_id: `payment_{payment_id}_{timestamp}`

Observability:
- Metric: stripe_api_requests_total (counter, by status)
- Metric: stripe_api_duration_seconds (histogram)
- Metric: stripe_api_retries_total (counter)
- Log: INFO for successful retries, ERROR for exhausted retries
- Alert: stripe_api_error_rate > 10% for 5 minutes (CRITICAL)
- Alert: stripe_api_latency_p95 > 5s for 5 minutes (WARNING)

---

RESOURCE: Memory
Failure Scenario: Memory utilization > 90%

System Behavior: Load shedding
- Reject new requests with 503 Service Unavailable
- Continue processing in-flight requests
- Log memory pressure warning
- Alert operators

Rationale:
- Prevents JVM OutOfMemoryError (or equivalent)
- Better to reject requests than crash
- In-flight requests more valuable than new requests
- Gives system chance to recover (GC, request completion)

Implementation:
- Check memory before accepting request: if (memory > 90%) reject
- Rejection: Return 503 with Retry-After: 30 header
- Backpressure: Communicate to load balancer (readiness check fails at 95%)
- Recovery: As memory drops below 85%, resume accepting requests

Observability:
- Metric: memory_utilization_percent (gauge)
- Metric: requests_rejected_memory_pressure_total (counter)
- Log: WARN "Memory pressure, rejecting requests" (max once per minute)
- Alert: memory_utilization > 85% for 5 minutes (WARNING)
- Alert: memory_utilization > 95% for 1 minute (CRITICAL)

---

Observability Design:

METRICS:

Business Metrics:
- payments_processed_total (counter, by status: success, failed)
- payment_amount_dollars (histogram)
- payment_processing_duration_seconds (histogram, by payment_method)

System Metrics:
- http_requests_total (counter, by endpoint, status_code)
- http_request_duration_seconds (histogram, by endpoint)
- http_requests_in_flight (gauge)
- process_cpu_seconds_total (counter)
- process_memory_bytes (gauge)

Dependency Metrics:
- database_queries_total (counter, by operation)
- database_query_duration_seconds (histogram)
- redis_operations_total (counter, by operation)
- redis_operation_duration_seconds (histogram)
- stripe_api_requests_total (counter, by status)
- stripe_api_duration_seconds (histogram)

Custom Metrics:
- payment_retries_total (counter, by reason)
  - Rationale: Detect payment provider issues early
- payment_validation_failures_total (counter, by validation_error)
  - Rationale: Track why payments rejected
- fraud_checks_total (counter, by result: approved, flagged, rejected)
  - Rationale: Monitor fraud detection system health

LOGS:

Structured Logging: JSON format

Essential Fields:
- timestamp: ISO8601
- level: ERROR / WARN / INFO / DEBUG
- message: Human-readable description
- service: "payment-api"
- version: Deployment version
- request_id: UUID (correlation across logs)
- user_id: (redacted if sensitive)
- payment_id: (for payment-related logs)

Critical Log Points:
- Request entry: INFO level
  - request_id, user_id, endpoint, method
- Payment processing start: INFO
  - request_id, payment_id, amount, payment_method
- Payment success: INFO
  - request_id, payment_id, status, duration
- Payment failure: ERROR
  - request_id, payment_id, failure_reason, stripe_error_code
- Dependency calls: INFO (before) / ERROR (on failure)
  - request_id, dependency, operation, duration, status
- Retries: WARN
  - request_id, retry_attempt, reason

Sensitive Data Handling:
- Redact: Full card numbers (show last 4 digits only)
- Redact: CVV codes (never log)
- Redact: Full user emails (hash or redact)
- Redact: API keys, tokens

TRACES:

Distributed Tracing: OpenTelemetry (or similar)

Trace ID Propagation:
- Generate trace_id at API gateway
- Propagate via headers: traceparent
- Include in all logs: request_id = trace_id

Critical Spans:
- http.request (entire request lifecycle)
- payment.process (payment processing logic)
- db.query (each database query)
- redis.operation (each cache operation)
- stripe.api_call (each Stripe API call)

Sampling:
- 100% for errors (status_code >= 400)
- 100% for slow requests (duration > 1s)
- 10% for normal requests (random sampling)

DASHBOARDS:

Operational Dashboard:
- Request rate (requests per second)
- Error rate (errors per second, percentage)
- Latency (p50, p95, p99)
- Success rate (percentage)
- Dependency health (database, cache, Stripe availability)
Update: Real-time (10s refresh)

Dependency Dashboard:
- Database: Query rate, latency, error rate, connection pool usage
- Redis: Operation rate, latency, hit rate, error rate
- Stripe: Request rate, latency, error rate, retry rate

Capacity Dashboard:
- CPU utilization (per pod, average)
- Memory utilization (per pod, average)
- Pod count (current, min, max)
- Request queue depth
- Database connection pool usage

ALERTS:

Alert Philosophy:
- Every alert requires investigation
- No alert fatigue (tune thresholds carefully)
- Alerts include suggested investigation steps

CRITICAL Alerts (page on-call immediately):
- Error rate > 5% for 2 minutes
  - Investigation: Check logs for error patterns, check dependencies
- Latency p95 > 2s for 5 minutes
  - Investigation: Check database slow query log, check Stripe API latency
- Stripe API error rate > 10% for 5 minutes
  - Investigation: Check Stripe status page, check Stripe dashboard
- Database connection failures > 5 in 1 minute
  - Investigation: Check database status, check network, check connection pool
- Memory utilization > 95% for 1 minute
  - Investigation: Check for memory leak, check request volume, restart pod if necessary

WARNING Alerts (investigate during business hours):
- Latency p95 > 1s for 10 minutes (degraded but not critical)
- Cache hit rate < 50% for 5 minutes (performance impact)
- Payment retry rate > 20% (Stripe likely having issues)

---

Graceful Degradation:

FULL SERVICE:
- All features available
- Database, Redis, Stripe healthy
- Latency p95 < 200ms
- Error rate < 1%

DEGRADED MODE: Cache Unavailable
Trigger: Redis connection failures
Behavior:
- Continue processing payments
- Bypass cache, query database directly
- Latency increases to ~600ms p95 (3x normal)
- Database load increases ~5x
Implementation:
- Try cache, catch exception, fallback to database
- Log degradation: WARN level
- Metric: cache_bypass_total (counter)
Rationale: Slower payments better than no payments

DEGRADED MODE: Stripe Slow
Trigger: Stripe API latency p95 > 5s
Behavior:
- Continue processing with increased timeouts
- Request timeout extended to 15s (from 10s)
- Some requests may timeout
Implementation:
- Detect via metrics: stripe_api_duration_seconds
- Adjust circuit breaker threshold
- Log: WARN "Stripe API slow"
Rationale: Give Stripe time to recover, some payments better than none

CRITICAL MODE: Database Read Replica Failed
Trigger: Read replica unreachable
Behavior:
- Route all queries to primary database
- Increased load on primary
- Analytics queries may be slower
Implementation:
- Connection pool fallback to primary
- Monitor primary load carefully
Rationale: Read replica failure should not affect payment processing

FAILURE MODE: Database Primary Unavailable
Trigger: Primary database unreachable
Behavior:
- Return 503 Service Unavailable
- Cannot process payments
- Preserve request logs for later analysis
Implementation:
- Health check fails → pod marked unready
- All requests return 503
- Alerting: CRITICAL
Rationale: Cannot operate without database, fail fast

---

Capacity Planning:

RESOURCE CONSTRAINTS:

Compute (per pod):
- CPU: 2 cores
- Memory: 4 GB
- Baseline usage: 0.5 cores, 1 GB (idle)
- Peak usage: 1.8 cores, 3.5 GB (high traffic)
- Scaling trigger: CPU > 70% or Memory > 80%

Storage:
- Database growth: ~10 GB/month (payment records)
- Log retention: 30 days (~50 GB)
- Projected capacity (1 year): 120 GB database + 600 GB logs
- Cleanup strategy: Archive payments older than 7 years

Network:
- Bandwidth: 100 Mbps in, 100 Mbps out per pod
- Request rate capacity: 500 requests/second per pod
- Dependency fan-out: 1.5 requests per incoming request (0.8 DB, 0.5 Redis, 0.2 Stripe)

CONCURRENCY LIMITS:

Thread Pools:
- HTTP server threads: 200 (based on expected concurrency)
- Rationale: 500 req/s * 0.2s avg duration = 100 threads, 2x buffer = 200
- Behavior when exhausted: Queue for 1s, then reject with 503

Connection Pools:
- Database connections: 50
  - Rationale: 200 threads, 25% DB operations, need 50 connections
- Redis connections: 20
  - Rationale: 200 threads, 10% cache operations, need 20 connections
- Connection timeout: 5s (fail fast if pool exhausted)

Rate Limits:
- Global: 5000 requests/second (10 pods * 500 req/s)
- Per-client: 100 requests/second
- Burst capacity: 2x for 10 seconds (handle spikes)

SCALING STRATEGY:

Horizontal Scaling (Kubernetes HPA):
- Minimum pods: 3 (high availability)
- Maximum pods: 20 (cost control)
- Scale-up trigger: CPU > 70% sustained for 2 minutes
- Scale-down trigger: CPU < 30% sustained for 10 minutes
- Scale-up rate: +50% current pods (3→5→7→11...)
- Scale-down rate: -1 pod at a time (gradual)

---

Deployment Procedures:

DEPLOYMENT APPROACH: Rolling deployment with health checks

Rationale:
- Zero-downtime deployment
- Kubernetes native rolling update
- Health checks prevent traffic to unhealthy pods
- Rollback simple (previous ReplicaSet available)

PRE-DEPLOYMENT CHECKS:

□ All tests passing (unit, integration, e2e from Chapter 4)
□ Load test passed (sustained 4000 req/s for 10 min with latency < 300ms)
□ Security scan passed (no HIGH or CRITICAL vulnerabilities)
□ Database migrations tested (rollback procedure verified)
□ Configuration validated (no missing env vars)
□ Rollback plan: Previous deployment verified in staging
□ On-call engineer: @alice available via PagerDuty
□ Monitoring dashboards: Operational + Dependency dashboards open
□ Alert thresholds: Configured for new version (if changed)

DEPLOYMENT PROCEDURE:

Step 1: Pre-Deployment (5 minutes)
- [ ] Notify #payments-team Slack: "Deploying PaymentAPI v1.2.3 at 14:00 UTC"
- [ ] Verify staging deployment successful
- [ ] Verify all pre-deployment checks passed
- [ ] Database migration: Apply in read-only mode first (if applicable)

Step 2: Deployment (15 minutes)
- [ ] kubectl apply -f payment-api-deployment.yaml
- [ ] Kubernetes rolling update (maxUnavailable: 1, maxSurge: 1)
- [ ] Monitor pod rollout: kubectl rollout status deployment/payment-api
- [ ] Verify new pods passing health checks
- [ ] Verify new pods receiving traffic (load balancer)

Step 3: Validation (10 minutes)
- [ ] Smoke test: Execute payment-smoke-test.sh (creates test payment, verifies success)
- [ ] Key flows: Login → Create Payment → Process Payment → Webhook Received
- [ ] Metrics: Error rate < 1%, Latency p95 < 300ms
- [ ] No increase in errors (compare to pre-deployment baseline)
- [ ] Database migration: Verify new schema working

Step 4: Post-Deployment (30 minutes)
- [ ] Monitor operational dashboard for 30 minutes
- [ ] Check for delayed issues (memory leaks, connection pool leaks)
- [ ] Verify no alerts fired
- [ ] Update deployment log in memory-bank/progress.md
- [ ] Notify #payments-team Slack: "PaymentAPI v1.2.3 deployed successfully"

Total Deployment Time: ~60 minutes (including monitoring)

ROLLBACK PROCEDURE:

Rollback Triggers:
- Error rate > 5% for 2 minutes
- Latency p95 > 2s for 5 minutes
- Health checks failing on new pods
- Payment processing failures > 10%

Rollback Steps (Target: < 5 minutes):
1. [ ] kubectl rollout undo deployment/payment-api
2. [ ] Monitor rollback: kubectl rollout status deployment/payment-api
3. [ ] Verify previous version healthy (health checks passing)
4. [ ] Verify metrics returned to baseline
5. [ ] Database migration: Rollback migration if applied (rollback script prepared)
6. [ ] Incident report: Document rollback reason in memory-bank/operations/incidents/
7. [ ] Post-mortem: Schedule within 24 hours

Rollback Time: < 5 minutes (Kubernetes native rollback fast)

DEPLOYMENT RISK ASSESSMENT:

Risk Level: MEDIUM
Factors:
- Scope: 15 files changed, 500 lines added (medium scope)
- Dependencies: Stripe API client version upgrade (dependency change)
- Database migration: Yes (add payment_metadata column - backward compatible)
- Configuration: New env var STRIPE_WEBHOOK_SECRET (added to ConfigMap)

Additional Precautions:
- [ ] Deploy during low-traffic period (14:00-15:00 UTC, typically 50% of peak)
- [ ] Monitor extended period (30 min instead of 15 min)
- [ ] Database migration tested in staging (rollback script verified)
- [ ] Stripe API client: Backward compatible (old and new API endpoints supported)

Documentation Update:

memory-bank/systemPatterns.md:
- Updated: Health check strategy (added Stripe API check)
- Updated: Failure mode design (Stripe retry with exponential backoff)
- Updated: Graceful degradation (Stripe slow mode)

memory-bank/techContext.md:
- Updated: Observability architecture (new Stripe API metrics)
- Updated: Alert configuration (Stripe API error rate alert)

memory-bank/operations/runbooks/deployment-runbook.md:
- Updated: Pre-deployment checks (added Stripe API client version check)
- Updated: Rollback procedure (added Stripe API client rollback)

memory-bank/operations/performance/capacity-planning.md:
- Updated: Concurrency limits (Stripe connection pool considerations)

memory-bank/progress.md:
- Added: Deployment v1.2.3 on 2026-02-01 (successful, 60 min monitoring, no issues)
```

Why this works:
- Health checks accurately reflect service readiness (database, cache, Stripe)
- Failure modes explicitly designed and documented before production
- Observability built into system (metrics, logs, traces, dashboards, alerts)
- Graceful degradation planned (cache failure acceptable, database failure not)
- Capacity limits calculated and tested (load testing before deployment)
- Deployment procedures detailed with rollback plan
- All operational design connected to system architecture documentation
- Lessons from past incidents inform future operational design

</examples>
