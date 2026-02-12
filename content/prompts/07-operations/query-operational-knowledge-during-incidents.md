---
# === Identity ===
id: query-operational-knowledge-during-incidents
name: Query operational knowledge efficiently during incidents to accelerate investigation
version: v1

# === Classification ===
chapter: 7
category: operations
subcategory: incident
tags:
  - operations
  - incident-response
  - knowledge-retrieval
  - operational-knowledge
  - incident-investigation
  - time-pressure
  - knowledge-filtering
  - dependency-traversal
  - runbooks
  - past-incidents
  - performance-baselines
  - architecture-context

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Query operational knowledge efficiently during incidents to accelerate investigation.
    Filter knowledge to incident-specific scope, pull targeted context without information overload, traverse dependencies, support time-sensitive decision making under pressure.
  argument-hint: "[incident_context] [incident_severity] [time_constraint] [memory_bank_structure]"
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
  - name: incident_context
    description: Current incident context for scoped querying
    example: "Database latency spike affecting PaymentAPI"
    maps-to: "$0"
  - name: incident_severity
    description: Incident severity level affecting query urgency
    example: "SEV-1 (Critical outage)"
    maps-to: "$1"
  - name: time_constraint
    description: How much time available for information gathering
    example: "5 minutes (active outage)"
    maps-to: "$2"
  - name: memory_bank_structure
    description: Whether operational knowledge is separate or integrated
    example: "Separate: operations-memory-bank/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/query-operational-knowledge-during-incidents
  marketplace:
    plugin: constellize-operations

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Query relevant operational context across federated memory banks during {{incident_context}} incident by filtering knowledge to incident-specific scope, pulling targeted context without information overload, traversing operational dependencies for system-wide impact, supporting time-sensitive decision making under {{time_constraint}} time pressure.
</task>

<context>
Incident Context: {{incident_context}}
Severity: {{incident_severity}}
Time Constraint: {{time_constraint}}
Memory Bank Structure: {{memory_bank_structure}}

During incidents, engineers need rapid access to relevant operational knowledge: which runbooks apply, what similar incidents occurred, what dependencies might be affected, what architectural constraints matter. The challenge is filtering vast operational knowledge to incident-specific context without information overload while under time pressure.

Effective operational knowledge querying during incidents requires:
1. Scoping to relevant context (service, component, failure mode)
2. Prioritizing by recency and relevance (recent incidents > old incidents)
3. Traversing dependencies (upstream/downstream impact)
4. Connecting operations to architecture (why systems behave this way)
5. Filtering noise (exclude irrelevant knowledge)
</context>

<thinking>
Before querying operational knowledge:
1. What is the specific failure mode we're experiencing?
2. Which services/components are directly affected?
3. What dependencies might be involved (upstream/downstream)?
4. What timeframe is relevant (recent incidents, current configuration)?
5. What knowledge would accelerate diagnosis?
6. How much time do we have to gather information?
</thinking>

<output-format>

## Query Scoping Pattern

```
Incident-Specific Scope:

AFFECTED COMPONENT(S):
Primary: [Service/system directly experiencing failure]
Secondary: [Components showing symptoms as consequence]

FAILURE MODE:
Symptom category: [Availability / Performance / Data / Security]
Specific symptom: [Exact behavior observed]
Timeframe: [When symptoms started]

RELEVANT KNOWLEDGE DOMAINS:
□ Runbooks: [Which operational procedures apply]
□ Past incidents: [Similar failure modes in last 3 months]
□ Dependencies: [Upstream/downstream services]
□ Architecture: [Relevant design decisions]
□ Performance baselines: [Metrics to compare against]
□ Recent changes: [Deployments, config changes]

TIME BUDGET:
Available for information gathering: {{time_constraint}}
Query priority: [High-priority queries first, skip low-priority if time-constrained]
```

---

## Runbook Query Pattern

```
## Query: Relevant Runbooks

Scope: {{incident_context}}

Query targets:
- {{memory_bank_structure}}runbooks/

Filter criteria:
- Runbook scenario matches observed symptoms
- Runbook applies to affected component
- Runbook severity matches incident severity

Query method:
1. Check runbook index/README for scenario mapping
2. Search runbook filenames for component name + failure mode keywords
3. Grep runbook content for symptom keywords

Example queries:
```bash
# Find runbooks for specific component
ls {{memory_bank_structure}}runbooks/ | grep -i "payment-api\|database"

# Find runbooks mentioning specific symptom
grep -r "connection timeout\|503 error\|latency spike" {{memory_bank_structure}}runbooks/ -l

# Check runbook index
cat {{memory_bank_structure}}runbooks/README.md
```

Results format:
- Runbook: [Filename and path]
- Scenario: [What scenario runbook addresses]
- Relevance: [Why relevant to current incident]
- When to use: [Conditions that match current incident]
- Quick access: [Direct link to runbook]

Prioritization:
1. Exact match (component + symptom)
2. Component match (general troubleshooting)
3. Symptom match (similar failure mode, different component)

Time budget: 2 minutes maximum for runbook identification
```

---

## Past Incidents Query Pattern

```
## Query: Similar Past Incidents

Scope: {{incident_context}}

Query targets:
- {{memory_bank_structure}}incidents/
- {{memory_bank_structure}}postmortems/

Filter criteria:
- Incidents affecting same component (within last 3 months)
- Incidents with similar symptoms (any timeframe)
- Incidents with same failure mode (any timeframe)

Query method:
1. List recent incidents for component
2. Grep incident content for symptom keywords
3. Check postmortem learnings

Example queries:
```bash
# Find recent incidents for component (last 3 months)
ls -lt {{memory_bank_structure}}incidents/ | grep -i "payment-api\|database" | head -10

# Find incidents with similar symptoms
grep -r "connection timeout\|latency spike" {{memory_bank_structure}}incidents/ -l

# Check if postmortems exist for similar issues
grep -r "connection pool\|database latency" {{memory_bank_structure}}postmortems/ -l
```

Results format:
For each relevant incident:
- Incident ID: [YYYY-MM-DD-description]
- Date: [How long ago]
- Symptoms: [What was observed]
- Root cause: [What caused it]
- Resolution: [How resolved]
- Resolution time: [How long to resolve]
- Recurrence: [One-time or recurring issue]
- Relevance: [Why similar to current incident]
- Quick access: [Direct link to incident documentation]

Prioritization:
1. Exact symptom match (highest relevance)
2. Same component, different symptom (component-specific context)
3. Similar component, similar symptom (pattern match)

Insights to extract:
- Did similar incident recur? (Suggests systemic issue)
- What resolution worked? (Try same approach)
- What investigation paths failed? (Avoid dead ends)
- What monitoring helped? (Check same metrics)

Time budget: 3 minutes maximum for past incident review
```

---

## Dependency Traversal Pattern

```
## Query: Affected Dependencies

Scope: {{incident_context}}

Query targets:
- {{memory_bank_structure}}dependencies/operational-dependencies.md
- memory-bank/systemPatterns.md (architecture dependencies)

Filter criteria:
- Services that depend on affected component (downstream impact)
- Services that affected component depends on (upstream cause)
- Shared infrastructure (cluster, network, database)

Query method:
1. Read operational-dependencies.md for affected component
2. Identify upstream dependencies (could be cause)
3. Identify downstream dependencies (may be impacted)
4. Check if dependencies have recent incidents

Example queries:
```bash
# Find dependency documentation for affected component
grep -A 20 "^## PaymentAPI" {{memory_bank_structure}}dependencies/operational-dependencies.md

# Find what depends on affected component (downstream)
grep -r "depends on.*PaymentAPI\|calls.*PaymentAPI" {{memory_bank_structure}}dependencies/ -A 5

# Find what affected component depends on (upstream)
grep -r "PaymentAPI.*depends on\|PaymentAPI.*calls" {{memory_bank_structure}}dependencies/ -A 5

# Check architecture for dependency graph
grep -A 30 "dependency\|integration" memory-bank/systemPatterns.md
```

Results format:

Upstream dependencies (potential causes):
- Dependency: [Service/system name]
- Relationship: [How affected component depends on it]
- Failure mode: [How dependency failure would manifest]
- Current health: [Check if dependency healthy—query separately]
- SLA: [Expected availability/latency]

Downstream dependencies (impact assessment):
- Dependent: [Service/system name]
- Relationship: [How it depends on affected component]
- Impact: [How affected component's failure impacts dependent]
- User-facing: [Yes/No—does this reach end users?]
- Notification needed: [Should we notify dependent team?]

Shared infrastructure:
- Infrastructure: [Database, cluster, network, etc.]
- Scope: [What else shares this infrastructure]
- Blast radius: [If infrastructure issue, what else affected]

Prioritization:
1. Upstream dependencies (potential root cause)
2. User-facing downstream dependencies (impact severity)
3. Internal downstream dependencies (impact scope)

Time budget: 3 minutes maximum for dependency traversal
```

---

## Architecture Context Query Pattern

```
## Query: Relevant Architecture Context

Scope: {{incident_context}}

Query targets:
- memory-bank/systemPatterns.md
- memory-bank/techContext.md
- Design decision documents

Filter criteria:
- Architecture sections describing affected component
- Design decisions explaining current behavior
- Constraints or assumptions relevant to failure mode

Query method:
1. Read systemPatterns.md section for affected component
2. Identify design decisions relevant to symptoms
3. Check if incident violates design assumptions

Example queries:
```bash
# Find architecture description of affected component
grep -A 50 "^## PaymentAPI\|^### PaymentAPI" memory-bank/systemPatterns.md

# Find design decisions about connection management (if connection issue)
grep -r "connection pool\|connection management" memory-bank/ -A 10

# Find capacity/performance assumptions
grep -r "capacity\|throughput\|scaling" memory-bank/systemPatterns.md -A 10

# Find technology constraints
grep -A 20 "^## Database\|^## Infrastructure" memory-bank/techContext.md
```

Results format:

Architecture overview:
- Component role: [What component does in system]
- Key characteristics: [Stateless/stateful, sync/async, critical/non-critical]
- Architecture diagram: [Reference to diagram if exists]

Relevant design decisions:
- Decision: [Design choice made]
- Rationale: [Why chosen]
- Constraints: [Limits imposed by design]
- Assumptions: [What design assumes]
- Failure modes: [Known failure scenarios]

Design vs Reality:
- Design expectation: [How system should behave]
- Observed behavior: [How system actually behaving]
- Deviation: [Gap between design and reality]
- Implication: [Does deviation suggest design issue or implementation bug?]

Critical constraints:
- Performance: [Capacity limits, latency requirements]
- Availability: [SLA, acceptable downtime]
- Data: [Consistency requirements, data durability]
- Dependencies: [Required upstream services]

Prioritization:
1. Design decisions directly related to symptoms (e.g., connection pool sizing if connection issue)
2. Known failure modes matching symptoms
3. General architecture context

Time budget: 2 minutes maximum for architecture context
```

---

## Performance Baseline Query Pattern

```
## Query: Performance Baselines

Scope: {{incident_context}}

Query targets:
- {{memory_bank_structure}}performance/baseline-metrics.md
- {{memory_bank_structure}}performance/capacity-planning.md

Filter criteria:
- Metrics for affected component
- Baselines for observed symptoms (latency, error rate, throughput)

Query method:
1. Read baseline-metrics.md for affected component
2. Extract normal ranges for symptoms being observed
3. Compare current metrics to baselines

Example queries:
```bash
# Find baselines for affected component
grep -A 30 "^## PaymentAPI" {{memory_bank_structure}}performance/baseline-metrics.md

# Find specific metric baselines (e.g., latency)
grep -r "latency.*baseline\|p95\|p99" {{memory_bank_structure}}performance/ -A 5

# Find capacity limits
grep -A 20 "PaymentAPI" {{memory_bank_structure}}performance/capacity-planning.md
```

Results format:

Baseline metrics (normal behavior):
- Metric: [Metric name]
- Normal range: [Expected value range]
- Warning threshold: [When to alert]
- Critical threshold: [When to escalate]
- Last updated: [When baseline established]

Current vs Baseline:
- Metric: [Metric name]
- Baseline: [Normal value]
- Current: [Observed value during incident]
- Deviation: [How far from baseline—percentage or absolute]
- Severity: [Minor / Moderate / Severe deviation]

Capacity limits:
- Component: [Affected component]
- Max throughput: [Requests/second or transactions/second]
- Current load: [Actual load during incident]
- Headroom: [Distance to capacity limit]

Insights:
- Is current load within designed capacity? [Yes/No]
- Are metrics within normal range? [Yes/No]
- Which metrics deviate most? [Prioritized list]

Time budget: 2 minutes maximum for baseline comparison
```

---

## Recent Changes Query Pattern

```
## Query: Recent Changes

Scope: {{incident_context}}

Query targets:
- memory-bank/progress.md (development changes)
- {{memory_bank_structure}}runbooks/ (deployment history)
- Deployment logs
- Configuration change logs

Filter criteria:
- Changes to affected component (last 24 hours)
- Changes to dependencies (last 24 hours)
- Infrastructure changes (last 24 hours)

Query method:
1. Check progress.md for recent development changes
2. Query deployment system for recent deployments
3. Check configuration management for recent config changes

Example queries:
```bash
# Check recent development activity
tail -50 memory-bank/progress.md | grep -i "payment-api\|database"

# Check deployment history
kubectl rollout history deployment/payment-api -n payment-api

# Check recent commits (if git-based)
git log --oneline --since="24 hours ago" --grep="PaymentAPI\|payment" -i

# Check configuration changes (if version-controlled)
git log --oneline --since="24 hours ago" -- config/payment-api/
```

Results format:

Recent deployments:
- Service: [Which service deployed]
- Version: [New version]
- Time: [When deployed]
- Changes: [What changed—link to git commit/PR]
- Timing correlation: [Did symptoms start after deployment?]

Recent configuration changes:
- Component: [What was configured]
- Change: [What changed]
- Time: [When changed]
- Timing correlation: [Did symptoms start after change?]

Recent infrastructure changes:
- Infrastructure: [What changed—cluster, network, database]
- Change: [Description]
- Time: [When changed]
- Scope: [What services affected]

Timing analysis:
- Incident started: [Timestamp]
- Most recent change: [What changed, when]
- Time delta: [Minutes/hours between change and incident]
- Correlation strength: [High / Medium / Low]

Prioritization:
1. Changes to affected component in last 2 hours (highest correlation)
2. Changes to dependencies in last 2 hours
3. Infrastructure changes in last 24 hours

Time budget: 2 minutes maximum for recent changes review
```

---

## Query Synthesis Pattern

```
## Synthesize Query Results

Combine information from all queries into actionable incident response.

### Knowledge Summary

Relevant runbooks:
- Primary: [Most relevant runbook]
- Secondary: [Backup runbooks if primary doesn't resolve]

Similar past incidents:
- Most similar: [Incident ID, date, resolution]
- Pattern: [One-time or recurring?]
- Resolution that worked: [Specific action]

Dependency status:
- Upstream suspect: [Potential dependency cause]
- Downstream impact: [Services affected by this incident]

Architecture context:
- Component design: [Key architectural facts]
- Relevant constraints: [Limits or assumptions]
- Design deviation: [If behavior doesn't match design]

Performance baselines:
- Most deviated metric: [Metric, baseline, current, deviation]
- Capacity status: [Within/exceeding capacity]

Recent changes:
- Likely trigger: [Change that may have caused incident]
- Timing correlation: [Strong/weak]

### Recommended Investigation Path

Based on synthesized knowledge:

Step 1: [First investigation step]
- Why: [Rationale based on knowledge]
- How: [Specific action from runbook or past incident]
- Expected finding: [What to look for]

Step 2: [Second investigation step]
- Conditional: [When to proceed to this step]
- Why: [Rationale]
- How: [Specific action]

Step 3: [Third investigation step]
- [Continue pattern]

### High-Confidence Hypotheses

Hypothesis 1: [Most likely cause]
- Confidence: [High/Medium/Low]
- Evidence:
  1. [Supporting fact from queries]
  2. [Supporting fact from queries]
- Test: [How to validate]
- Resolution if confirmed: [Action from runbook or past incident]

Hypothesis 2: [Alternative cause]
- Confidence: [High/Medium/Low]
- Evidence: [Supporting facts]
- Test: [How to validate]
- Resolution if confirmed: [Action]

### Knowledge Gaps Identified

Missing information:
- Gap: [What knowledge would help but doesn't exist]
- Impact: [How gap affects investigation]
- Workaround: [How to proceed without this knowledge]
- Follow-up: [Document this after incident]

### Time Checkpoint

Time spent on knowledge gathering: [X minutes]
Time remaining in budget: [Y minutes]
Decision: [Proceed with investigation / Gather more context / Escalate]
```

---

## Query Optimization Pattern

```
## Optimize Queries for Time Constraints

Adjust query depth based on available time.

### Ultra-Fast Mode (<2 minutes available)

Priority 1 only:
□ Check if runbook exists for this scenario (30 seconds)
□ Check if past incident with exact symptoms (30 seconds)
□ Check recent deployments (30 seconds)
□ Identify upstream dependencies (30 seconds)

Skip:
- Deep past incident analysis
- Detailed architecture review
- Performance baseline comparison
- Extensive dependency traversal

Rationale: Under severe time pressure, focus on immediate action (runbook) and obvious causes (recent change, past exact match).

---

### Standard Mode (3-5 minutes available)

Priority 1 (quick wins):
□ Relevant runbooks (1 minute)
□ Similar past incidents (1 minute)
□ Recent changes (1 minute)

Priority 2 (context):
□ Dependency traversal (1 minute)
□ Architecture context (1 minute)

Skip if time runs out:
- Detailed performance baseline analysis
- Exhaustive past incident review

Rationale: Balance action and context. Get enough information to make informed decisions without analysis paralysis.

---

### Deep Mode (10+ minutes available)

Full query suite:
□ Relevant runbooks (2 minutes)
□ Similar past incidents (3 minutes)
□ Dependency traversal (3 minutes)
□ Architecture context (2 minutes)
□ Performance baselines (2 minutes)
□ Recent changes (2 minutes)
□ Synthesize findings (2 minutes)

Rationale: Incident in degraded state (not total outage) allows thorough investigation. Gather comprehensive context to avoid misdiagnosis.

---

### Parallel Query Pattern

If multiple responders available, parallelize:

Responder 1: Runbooks + Past incidents
Responder 2: Dependencies + Architecture
Responder 3: Recent changes + Performance baselines

Synchronize: Reconvene after 3 minutes to share findings

Time saved: 3x faster than serial queries
```

</output-format>

<instructions>
CRITICAL: Time pressure during incidents makes query efficiency paramount. Prioritize high-signal queries, filter noise aggressively, and know when to stop gathering information and start acting.

DO NOT:
- Read entire documents during incidents (scan for relevant sections)
- Explore tangentially related knowledge (stay focused on incident scope)
- Analyze old incidents exhaustively (recent > old)
- Get lost in architecture details (get key facts only)
- Spend more time than budgeted on information gathering
- Query without clear intent (know what you're looking for)

ALWAYS:
- Scope queries to incident-specific context (component + failure mode)
- Prioritize by relevance and recency (recent exact matches first)
- Set time budgets for each query (2-3 minutes max per domain)
- Extract actionable insights (not just raw information)
- Synthesize findings into investigation path (connect dots)
- Identify knowledge gaps (what's missing that would help)
- Know when to stop querying and start investigating (avoid analysis paralysis)

REMEMBER: The goal is not comprehensive knowledge review—it's targeted context retrieval to accelerate incident investigation. Query enough to inform next steps, then act.
</instructions>

<examples>

## Example: Querying Knowledge During Database Latency Incident

```
Incident Context: PaymentAPI experiencing database query timeouts, 503 errors
Severity: SEV-1 (Critical outage—payment processing down)
Time Constraint: 5 minutes (active outage)
Memory Bank Structure: Integrated: memory-bank/operations/

---

## Query Scoping

Incident-Specific Scope:

AFFECTED COMPONENT(S):
Primary: PaymentAPI
Secondary: Checkout service (depends on PaymentAPI)

FAILURE MODE:
Symptom category: Performance (timeouts) → Availability (503 errors)
Specific symptom: Database query timeouts after 5s, "connection timeout" errors
Timeframe: Started 14:23 UTC (3 minutes ago)

RELEVANT KNOWLEDGE DOMAINS:
☑ Runbooks: Database connection failure, performance issues
☑ Past incidents: Database-related incidents last 3 months
☑ Dependencies: Upstream (database), downstream (checkout)
☑ Architecture: Database connection pool configuration
☑ Performance baselines: Normal database query latency
☐ Recent changes: (will query if time permits)

TIME BUDGET:
Available for information gathering: 5 minutes (SEV-1, must act quickly)
Query priority: Ultra-Fast Mode (runbooks, past incidents, dependencies only)

---

## Query 1: Relevant Runbooks (Budget: 1 minute)

Query:
```bash
# Find runbooks mentioning database or PaymentAPI
ls memory-bank/operations/runbooks/ | grep -i "database\|payment"
```

Result:
```
database-connection-failure.md
deployment-procedures.md
payment-api-incident-response.md
performance-degradation.md
```

Deep dive on most relevant:
```bash
# Check database connection failure runbook for symptoms match
grep -A 5 "When to use" memory-bank/operations/runbooks/database-connection-failure.md
```

Result:
```
When to use this runbook:
- Alert: "database_connection_errors > 5 in 1 minute"
- Symptom: HTTP 503 errors, logs show "connection refused" or "connection timeout"
- Impact: Payment processing fails
```

Analysis:
- Runbook: memory-bank/operations/runbooks/database-connection-failure.md
- Scenario: Database connection failures
- Relevance: HIGH—symptoms match exactly ("connection timeout", 503 errors, payment processing fails)
- When to use: Now—alert fired, symptoms present
- Quick access: memory-bank/operations/runbooks/database-connection-failure.md

**Decision**: Follow database-connection-failure.md runbook

Time spent: 45 seconds

---

## Query 2: Similar Past Incidents (Budget: 1 minute)

Query:
```bash
# Find recent PaymentAPI incidents
ls -lt memory-bank/operations/incidents/ | grep -i "payment\|database" | head -5
```

Result:
```
2026-01-10-payment-api-slow-queries.md
2025-12-15-database-connection-pool.md
2025-11-20-payment-timeout.md
```

Deep dive on most recent/relevant:
```bash
# Quick scan of most recent database incident
head -30 memory-bank/operations/incidents/2025-12-15-database-connection-pool.md
```

Result:
```
# Incident: Database Connection Pool Exhaustion
Symptoms: Connection timeout errors, 503 responses
Root cause: Connection pool sized too small (20 connections, needed 50)
Resolution: Increased pool size to 50, restarted pods
Resolution time: 15 minutes
```

Analysis:
- Incident ID: 2025-12-15-database-connection-pool
- Date: 6 weeks ago
- Symptoms: Connection timeout, 503 errors (EXACT MATCH)
- Root cause: Connection pool too small
- Resolution: Increased pool size
- Resolution time: 15 minutes
- Recurrence: First time (no earlier incidents)
- Relevance: HIGH—exact symptom match, same component

**Insight**: Check connection pool size configuration. Past incident resolved by increasing pool.

Time spent: 1 minute (cumulative: 1:45)

---

## Query 3: Dependency Traversal (Budget: 1 minute)

Query:
```bash
# Find PaymentAPI dependencies
grep -A 20 "^## PaymentAPI" memory-bank/operations/dependencies/operational-dependencies.md
```

Result:
```
## PaymentAPI

Depends on (upstream):
- PostgreSQL Database (payment-db.production): CRITICAL
  - SLA: 99.9% availability, <10ms query latency p95
  - Failure mode: If database down, PaymentAPI health checks fail
  - Mitigation: None (no fallback, database required)

Depended on by (downstream):
- Checkout Service: Uses PaymentAPI to process payments
  - Impact if PaymentAPI fails: Checkout fails, users cannot complete purchases
  - User-facing: Yes (critical customer impact)
```

Analysis:

Upstream dependencies (potential causes):
- Dependency: PostgreSQL Database
- Relationship: PaymentAPI requires database for all payment operations
- Failure mode: Database unavailable or slow → PaymentAPI timeouts
- Current health: UNKNOWN (need to check)
- SLA: <10ms query latency p95

Downstream dependencies (impact assessment):
- Dependent: Checkout Service
- Relationship: Checkout calls PaymentAPI to process payments
- Impact: Checkout failing, users cannot purchase
- User-facing: YES (critical)
- Notification needed: Checkout team likely already paged (their service failing too)

**Insight**: Database is critical upstream dependency. Check database health immediately per runbook.

Time spent: 1 minute (cumulative: 2:45)

---

## Query 4: Architecture Context (Budget: 1 minute)

Query:
```bash
# Find PaymentAPI architecture, focus on database connection
grep -A 30 "^## PaymentAPI" memory-bank/systemPatterns.md | grep -A 15 "database\|connection"
```

Result:
```
## PaymentAPI

Architecture:
- Stateless service, 3 replicas
- Database: PostgreSQL (payment-db.production)
- Connection pool: HikariCP, max 50 connections (increased from 20 in Dec 2025)
- Expected load: 500 req/s, each request ~1 database query, 10ms query time
- Connection pool sizing: 500 req/s × 0.01s query time = 5 connections needed, 50 for 10x headroom
```

Analysis:

Architecture overview:
- Component role: Payment processing service
- Key characteristics: Stateless, 3 replicas, database-dependent

Relevant design decisions:
- Decision: Connection pool max 50 connections
- Rationale: 500 req/s peak × 10ms query time = 5 connections needed, 50 for headroom
- Constraints: Pool size fixed (not auto-scaling)
- Assumptions: 10ms query time, 500 req/s peak

Design vs Reality:
- Design expectation: 10ms query time, 50 connections sufficient
- Observed behavior: Timeouts after 5s (500x slower than expected!)
- Deviation: Query latency is 500x expected, causing pool exhaustion or timeouts
- Implication: Either database slow or queries themselves slow

**Insight**: Design assumes 10ms queries. If queries taking 5s, pool will exhaust quickly OR connections timing out. Check database query latency immediately.

Time spent: 1 minute (cumulative: 3:45)

---

## Query 5: Performance Baselines (Budget: 30 seconds)

Query:
```bash
# Find database latency baseline
grep -A 10 "PaymentAPI.*latency\|database.*latency" memory-bank/operations/performance/baseline-metrics.md
```

Result:
```
## PaymentAPI Database Query Latency

Metric: database_query_duration_seconds (p95)
Baseline: 8-12ms
Warning threshold: 50ms
Critical threshold: 100ms
Last validated: 2026-01-10
```

Analysis:

Baseline metrics:
- Metric: database_query_duration_seconds (p95)
- Normal range: 8-12ms
- Warning threshold: 50ms
- Critical threshold: 100ms

Current vs Baseline:
- Baseline: 8-12ms
- Current: 5000ms (timeouts—queries not completing in 5s)
- Deviation: 500x baseline (SEVERE)
- Severity: CRITICAL (far exceeds critical threshold)

**Insight**: Current query latency is 500x normal. This is severe performance degradation, not minor slowdown.

Time spent: 30 seconds (cumulative: 4:15)

---

## Query Synthesis (Budget: 45 seconds)

### Knowledge Summary

Relevant runbooks:
- Primary: memory-bank/operations/runbooks/database-connection-failure.md (exact symptom match)

Similar past incidents:
- Most similar: 2025-12-15-database-connection-pool (exact symptoms)
- Pattern: Previously caused by undersized pool (resolved by increasing to 50)
- Resolution that worked: Increased pool size to 50 connections

Dependency status:
- Upstream suspect: PostgreSQL Database (critical dependency, likely slow)
- Downstream impact: Checkout Service (user-facing, cannot complete purchases)

Architecture context:
- Component design: Stateless, HikariCP pool max 50 connections
- Relevant constraints: Pool sized for 10ms queries, 500 req/s
- Design deviation: Queries taking 5000ms (500x design assumption)

Performance baselines:
- Most deviated metric: database_query_duration_seconds, baseline 8-12ms, current 5000ms, deviation 500x
- Capacity status: Exceeding all thresholds (critical threshold 100ms, currently 5000ms)

Recent changes:
- Skipped due to time constraint (can query later if investigation doesn't find obvious cause)

---

### Recommended Investigation Path

Based on synthesized knowledge, follow database-connection-failure.md runbook:

Step 1: Check database availability
- Why: Database is critical upstream dependency, query latency 500x normal suggests database issue
- How: `pg_isready -h payment-db.production.svc.cluster.local -p 5432` (from runbook Step 4)
- Expected finding: Either database down or database slow

Step 2: Check connection pool utilization
- Why: Past incident (2025-12-15) had same symptoms, caused by pool exhaustion
- How: `curl localhost:8081/actuator/metrics/hikaricp.connections.active` (from runbook Step 3)
- Expected finding: If pool exhausted (active = max = 50), confirms pool exhaustion; if pool not exhausted, issue is database latency

Step 3: Check database query performance
- Why: Queries taking 5000ms (500x normal) suggests slow queries or database overload
- How: Check database monitoring dashboard for slow queries (from runbook Step 4)
- Expected finding: Slow queries, database CPU/memory saturation, or lock contention

---

### High-Confidence Hypotheses

Hypothesis 1: Database experiencing performance degradation (slow queries)
- Confidence: HIGH
- Evidence:
  1. Query latency 5000ms (500x baseline of 10ms)
  2. Connection timeouts (queries not completing within timeout)
  3. Database is critical upstream dependency
  4. Symptoms match database-related failure mode
- Test: Check database metrics (CPU, query latency, locks)
- Resolution if confirmed: Engage database team, investigate slow queries, possibly restart database or scale up

Hypothesis 2: Connection pool exhausted due to slow queries holding connections
- Confidence: MEDIUM
- Evidence:
  1. Past incident (2025-12-15) had exact symptoms, caused by pool exhaustion
  2. If queries taking 5s each, pool of 50 exhausts quickly (50 connections / 5s query time = 10 req/s max throughput)
  3. Normal load 500 req/s would exhaust pool in seconds
- Test: Check connection pool active vs max
- Resolution if confirmed: If database healthy, temporarily increase pool size; if database slow, fix database performance (increasing pool won't help)

---

### Knowledge Gaps Identified

Missing information:
- Gap: Real-time database metrics (CPU, query latency, active queries)
- Impact: Can't confirm database health without checking database directly
- Workaround: Follow runbook Step 4 to check database metrics via monitoring dashboard
- Follow-up: Ensure database metrics included in PaymentAPI incident dashboard

---

### Time Checkpoint

Time spent on knowledge gathering: 4:15 minutes
Time remaining in budget: 45 seconds
Decision: PROCEED WITH INVESTIGATION (have runbook, high-confidence hypotheses, clear investigation path)

**Next action**: Execute runbook database-connection-failure.md starting at Step 4 (Check Database Health)

---

## Time Budget Analysis

Total time: 4 minutes 15 seconds (within 5-minute budget)

Breakdown:
- Runbooks: 45s (found exact match quickly)
- Past incidents: 1m (found similar incident with resolution)
- Dependencies: 1m (identified critical upstream dependency)
- Architecture: 1m (understood design assumptions and deviation)
- Performance baselines: 30s (confirmed severe deviation)
- Synthesis: 45s (connected findings into action plan)

Skipped:
- Recent changes (time-constrained, can check later)
- Exhaustive past incident review (found relevant match quickly)

Result: Sufficient context to begin investigation with high-confidence hypotheses in <5 minutes
```

Why this works:
- Scoped to incident context (PaymentAPI + database timeouts)
- Time-budgeted each query (no single query took >1 minute)
- Prioritized high-signal queries (runbooks, past incidents, dependencies)
- Extracted actionable insights (not just raw information)
- Synthesized findings into clear investigation path
- Identified specific next steps from runbook
- Stayed within time constraint (4:15 of 5:00 budget)

Query efficiency techniques used:
1. Grep for exact symptom matches (not reading entire documents)
2. Used `head -30` for quick scanning (not full document reads)
3. Focused on most recent/relevant past incidents (not comprehensive history)
4. Extracted key facts from architecture (not full architectural review)
5. Skipped low-priority queries when time-constrained (recent changes can wait)

This query approach provided enough context to proceed confidently without analysis paralysis. Engineer can now execute runbook with understanding of:
- What runbook to follow (database-connection-failure.md)
- What to expect (database slow or pool exhausted)
- What worked before (past incident resolution)
- What dependencies are involved (database upstream, checkout downstream)
- What normal looks like (baseline metrics)

</examples>
