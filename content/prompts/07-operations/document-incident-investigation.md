---
# === Identity ===
id: document-incident-investigation
name: Document incident investigation in real-time to capture systematic debugging paths
version: v1

# === Classification ===
chapter: 7
category: operations
subcategory: incident
tags:
  - operations
  - incident-response
  - incident-investigation
  - debugging
  - troubleshooting
  - operational-knowledge
  - postmortem
  - root-cause-analysis
  - investigation-documentation
  - debugging-patterns
  - knowledge-capture
  - incident-timeline

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Document incident investigation in real-time to capture systematic debugging paths.
    Capture hypotheses → tests → results pattern during incidents, record dead ends and reasoning, preserve commands and outputs, extract reusable debugging patterns for future incidents.
  argument-hint: "[incident_id] [system_name] [severity] [incident_location]"
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
  - name: incident_id
    description: Unique identifier for this incident
    example: "2026-01-15-database-latency"
    maps-to: "$0"
  - name: system_name
    description: The system or service experiencing the incident
    example: "PaymentAPI"
    maps-to: "$1"
  - name: severity
    description: Incident severity level
    example: "SEV-1 (Critical outage)"
    maps-to: "$2"
  - name: incident_location
    description: Where to document this incident
    example: "operations-memory-bank/incidents/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    chapter: 7
    description: |
      **Capture systematic investigation during incidents** documenting hypotheses → tests → results pattern, recording dead ends and why they didn't work, preserving commands used and their output, linking to system architecture and design decisions, transforming live investigation into reusable debugging patterns.
    preview: |
      "...Hypothesis 1: [name] Test: [command] Result: [output] Conclusion: CONFIRMED REJECTED INCONCLUSIVE / Dead End: [What tried Why didn't work Lessons] / Extract Reusable Debugging Patterns [Add to runbook]..."
  website:
    include: true
    path: /prompts/document-incident-investigation
  marketplace:
    plugin: constellize:deliver

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Capture systematic investigation during {{incident_id}} affecting {{system_name}} by documenting hypotheses → tests → results pattern, recording dead ends and why they didn't work, preserving commands used and their output, linking to system architecture and design decisions, transforming live investigation into reusable debugging patterns for future incidents.
</task>

<context>
Incident: {{incident_id}}
System: {{system_name}}
Severity: {{severity}}
Documentation Location: {{incident_location}}

During incidents, engineers generate valuable debugging knowledge through systematic investigation. Most of this knowledge is lost—engineers fix issues but don't capture their reasoning, failed hypotheses, or the specific commands that revealed root causes. Documenting investigation in real-time captures this knowledge while it's fresh, creating a resource for future incidents and revealing systemic patterns.

Incident investigation documentation differs from post-mortems: it captures the live investigation process (including uncertainty and dead ends), while post-mortems synthesize learnings after resolution. Both are valuable; investigation documentation preserves the detailed troubleshooting path.
</context>

<thinking>
During investigation:
1. What symptoms are we observing?
2. What hypotheses explain these symptoms?
3. What tests validate or invalidate each hypothesis?
4. What did each test reveal?
5. Why did certain investigation paths fail?
6. What architecture knowledge informed investigation?
7. What commands/queries yielded critical information?
</thinking>

<output-format>

## Investigation Header Pattern

```
# Incident Investigation: {{incident_id}}

Incident ID: {{incident_id}}
System: {{system_name}}
Severity: {{severity}}
Status: [IN PROGRESS / RESOLVED / ESCALATED]
Started: [Timestamp when incident detected]
Resolved: [Timestamp when incident resolved, if applicable]
On-call Engineer(s): [Names/handles of responders]

## Quick Summary (Updated as investigation progresses)
Current hypothesis: [Most likely explanation based on evidence so far]
Current action: [What we're doing right now]
Next steps: [If hypothesis confirmed / If hypothesis rejected]

## Impact Assessment
Affected components: [List of systems/services impacted]
User impact: [How customers/users are experiencing this]
Scope: [% of users, request volume, geographic regions, etc.]
Business impact: [Revenue loss, SLA violations, customer complaints]

## Related Documentation
- System Architecture: [Link to memory-bank/systemPatterns.md relevant section]
- Design Decisions: [Link to design documentation explaining architecture choices]
- Dependencies: [Link to operational-dependencies.md]
- Runbook Used: [Link to runbook if one guided investigation]
- Related Past Incidents: [Links to similar incidents if any]
```

---

## Investigation Timeline Pattern

```
## Investigation Timeline

Document each investigation step chronologically with timestamp, hypothesis, test, result, and decision.

### [HH:MM] Initial Detection

Symptom: [What triggered incident response—alert fired, user report, monitoring dashboard]
Observable behavior: [What we're seeing in metrics, logs, user reports]

Initial assessment:
- Severity: [Why classified at this level]
- Impact: [Initial scope estimate]
- Urgency: [Why immediate investigation needed]

Runbook consulted: [If runbook exists for this scenario, link it]

---

### [HH:MM] Hypothesis 1: [Hypothesis name]

**Hypothesis**: [Clear statement of what we think is wrong and why]

**Reasoning**: [Why this hypothesis makes sense given symptoms]
- Symptom X suggests Y because [connection to architecture/past experience]
- Similar to [past incident] where [context]
- Architecture context: [Reference to memory-bank/systemPatterns.md section]

**Test**: [How we'll validate or invalidate this hypothesis]

Command(s) executed:
```
[Exact command with parameters]
```

Result:
```
[Command output—preserve actual output, don't sanitize too much]
```

**Interpretation**: [What result tells us]
- Expected if hypothesis correct: [What we'd see]
- Actually observed: [What we saw]
- Conclusion: CONFIRMED / REJECTED / INCONCLUSIVE

**Decision**: [Next action based on result]
- If confirmed → [What action to take]
- If rejected → [Which hypothesis to explore next]
- If inconclusive → [What additional test needed]

---

### [HH:MM] Hypothesis 2: [Alternative hypothesis]

[Same structure as Hypothesis 1]

---

### [HH:MM] Dead End: [Investigation path that didn't pan out]

**What we tried**: [Hypothesis or investigation approach]

**Why we tried it**: [Reasoning that seemed sound]

**What we found**: [Result that invalidated this path]

**Why this didn't work**: [Analysis of why hypothesis was wrong]
- Assumption that was incorrect: [What we assumed incorrectly]
- What we learned: [Knowledge gained even from dead end]
- Architecture clarification: [If investigation revealed misunderstanding of architecture]

**Time spent**: [Duration investigating this path]

**Lessons**: [Why this won't help in future similar incidents, or what would make this approach valid]

Note: Documenting dead ends prevents future responders from wasting time on same paths.

---

### [HH:MM] Critical Finding: [Important discovery]

**What we discovered**: [Key finding that advanced investigation]

**How we discovered it**: [Command, query, observation method]

Command(s):
```
[Exact command]
```

Output:
```
[Relevant portion of output highlighting critical information]
```

**Why this matters**: [How this finding changes our understanding]
- Narrows problem space to: [Specific component/scenario]
- Invalidates hypotheses: [Which hypotheses we can eliminate]
- Suggests root cause: [What this points to]

**Architecture connection**: [Link to design documentation explaining why this component matters]
- Design context: memory-bank/systemPatterns.md#[section]
- Design decision: [How system was designed to behave in this scenario]
- Deviation: [How actual behavior differs from design intent]

---

### [HH:MM] Root Cause Identified: [Root cause]

**Root Cause**: [Clear statement of underlying cause]

**Evidence**: [All evidence supporting this conclusion]
1. [Finding 1 from investigation]
2. [Finding 2 from investigation]
3. [Finding 3 from investigation]

**Causal Chain**: [How root cause led to symptoms]
1. [Root cause: specific condition]
2. [Immediate effect: first consequence]
3. [Cascading effect: subsequent consequences]
4. [Observable symptom: what users/monitors saw]

**Why it took this long to find**: [Analysis of investigation path]
- Complexity factors: [What made this hard to diagnose]
- Missing observability: [What monitoring/logging would have helped]
- Documentation gaps: [What documentation would have accelerated investigation]

**Architecture context**: [How this relates to system design]
- Design assumption: [What design assumed would prevent this]
- Reality: [What actually happened]
- Design implications: [Whether architecture needs rethinking]

---

### [HH:MM] Resolution Applied: [Resolution action]

**Action taken**: [Specific resolution steps]

Command(s):
```
[Exact commands used to resolve]
```

**Expected effect**: [What resolution should accomplish]

**Verification**: [How we confirmed resolution worked]
- Metric 1: [Before and after values]
- Metric 2: [Before and after values]
- Logs: [Error patterns disappeared]

**Monitoring**: [How long we monitored before declaring resolved]

**Rollback plan**: [If resolution hadn't worked, what was backup plan]

---

### [HH:MM] Incident Resolved

**Resolution confirmed**: [Final verification that incident resolved]
- All symptoms cleared: [List of symptoms, all now resolved]
- Metrics returned to baseline: [Specific metrics and baselines]
- Sustained stability: [Duration of stable operation]

**Total duration**: [Start time to resolution time]

**Follow-up required**: [Actions needed post-resolution]
- Post-mortem: [Yes/No, when scheduled]
- Preventive measures: [Tickets to be created]
- Runbook updates: [What needs updating in operational documentation]
- Architecture review: [If design changes warranted]
```

---

## Pattern Extraction Pattern

```
## Reusable Debugging Patterns

Extract patterns from this investigation to help future incidents.

### Pattern 1: [Debugging pattern name]

**When to use this pattern**: [Symptom signature that triggers this approach]
- Observable symptoms: [Specific metrics, error messages, behaviors]
- System context: [Which components/architectures this applies to]

**Investigation approach**:
1. [Step 1: What to check first]
   - Command: [Specific command]
   - Look for: [What indicates this pattern]

2. [Step 2: Follow-up based on Step 1]
   - If [result A] → [Action X]
   - If [result B] → [Action Y]

3. [Step 3: Validation]
   - How to confirm root cause
   - Expected evidence

**Resolution approach**: [How to resolve once pattern confirmed]

**Time saved**: This pattern helped us reach root cause in [N] minutes. Without it, investigation took [M] minutes in this incident.

**Add to runbook**: [Which runbook should incorporate this pattern]

---

### Pattern 2: [Another debugging pattern]

[Same structure as Pattern 1]

---

## Investigation Inefficiencies

Document what slowed investigation to improve future response.

### Inefficiency 1: [What slowed us down]

**Issue**: [Specific problem that consumed time]

**Time cost**: [How much time wasted]

**Root cause of inefficiency**: [Why this was difficult]
- Missing observability: [Metrics/logs we didn't have but needed]
- Documentation gap: [Architecture knowledge not documented]
- Tool limitation: [Debugging tool that would have helped]
- Unclear ownership: [Had to find right team to engage]

**Improvement needed**: [Specific action to prevent recurrence]
- Observability: [Metrics/logs to add]
- Documentation: [What to document in memory-bank/]
- Tooling: [Tool to build/acquire]
- Process: [Process improvement]

**Ticket created**: [Link to ticket for improvement]

---

### Inefficiency 2: [Another time sink]

[Same structure as Inefficiency 1]
```

---

## Commands Reference Pattern

```
## Key Commands Used

Preserve exact commands that were valuable during investigation for future reference.

### Discovery Commands

Commands that helped identify problem:

**Check database connection pool state**:
```bash
kubectl exec -n payment-api deployment/payment-api -- curl localhost:8081/actuator/metrics/hikaricp.connections.active
```
Purpose: See current connection pool utilization
Output interpretation:
- Value < maxPoolSize * 0.8: Normal
- Value > maxPoolSize * 0.9: Saturated, likely issue
Used at: [HH:MM] in investigation timeline
Result: [What we found]

**Check error rate in logs**:
```bash
kubectl logs -n payment-api deployment/payment-api --since=10m | grep -i "error\|exception" | wc -l
```
Purpose: Quantify error volume
Output interpretation: [How to interpret count]
Used at: [HH:MM] in investigation timeline
Result: [What we found]

[More discovery commands...]

---

### Diagnostic Commands

Commands that helped diagnose root cause:

**Analyze database slow queries**:
```sql
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 10;
```
Purpose: Identify slow queries causing performance issues
Output interpretation: [How to read results]
Used at: [HH:MM] in investigation timeline
Result: [What we found—specific query causing issue]

[More diagnostic commands...]

---

### Resolution Commands

Commands used to resolve incident:

**Increase connection pool size**:
```bash
kubectl set env deployment/payment-api -n payment-api DB_CONNECTION_POOL_SIZE=75
```
Purpose: Temporarily increase capacity
Used at: [HH:MM] in investigation timeline
Effect: [What changed after execution]
Rollback: [Command to revert]

[More resolution commands...]
```

---

## Architecture Learnings Pattern

```
## Architecture Insights

What this incident taught us about system behavior.

### Architecture Assumption 1: [Assumption]

**We assumed**: [Design assumption made during architecture]
- Documented in: memory-bank/systemPatterns.md#[section]
- Assumption: [What we believed would be true]
- Design based on: [Reasoning behind assumption]

**Reality**: [What incident revealed]
- Actual behavior: [How system actually behaved]
- Why different: [Why assumption didn't hold]
- Conditions: [Under what conditions assumption breaks]

**Implications**: [What this means for architecture]
- Design change needed: [Yes/No]
- If yes: [What architectural change required]
- Documentation update: [Update memory-bank/ with reality]
- Monitoring addition: [Alerts for when assumption breaks]

**Action required**: [Ticket to address or accept risk]

---

### Architecture Assumption 2: [Another assumption]

[Same structure as Assumption 1]

---

## Dependency Behavior

What we learned about dependencies.

### Dependency: [Dependency name]

**Expected behavior**: [How we thought dependency would behave]
- Documented in: memory-bank/operations/dependencies/operational-dependencies.md
- SLA: [Expected availability, latency]
- Failure mode: [How we expected it to fail]

**Actual behavior during incident**: [What dependency actually did]
- Availability: [What we observed]
- Latency: [Actual latency under stress]
- Failure mode: [How it actually failed]

**Impact on our system**: [How dependency behavior affected us]
- Direct impact: [Immediate effect]
- Cascading impact: [Secondary effects]
- Mitigation worked: [Yes/No] [What we did and whether it helped]

**Documentation update needed**: [Update dependency documentation with real behavior]

**Action required**: [Ticket to improve resilience to this dependency behavior]
```

---

## Cross-Reference Updates Pattern

```
## Cross-Reference Updates Needed

Based on investigation, these documents need updates:

### Update 1: System Architecture

**File**: memory-bank/systemPatterns.md#[section]

**Current content says**: [Quote or summary of current documentation]

**What incident revealed**: [New understanding from incident]

**Update needed**: [Specific content to add/change]
- Add failure mode: [Newly discovered failure mode]
- Update capacity limits: [Actual limits vs documented]
- Clarify behavior: [Unexpected behavior to document]

**Cross-reference**: Link this incident from architecture documentation as real-world example

---

### Update 2: Operational Dependencies

**File**: memory-bank/operations/dependencies/operational-dependencies.md

**Update needed**: [What to change]
- Dependency: [Which dependency]
- Behavior: [Newly observed behavior]
- Mitigation: [Mitigation strategies that worked/didn't work]

**Cross-reference**: Link this incident as example of dependency failure mode

---

### Update 3: Runbook

**File**: [Runbook path]

**What was missing**: [Investigation steps not in runbook]

**What should be added**:
- Investigation step: [New step to add]
- Resolution procedure: [New resolution to add]
- Decision point: [New decision logic]

**Cross-reference**: Link this incident from runbook as example usage

---

### Update 4: Performance Baselines

**File**: memory-bank/operations/performance/baseline-metrics.md

**What incident revealed**: [New understanding of performance characteristics]

**Update needed**:
- Metric: [Which metric]
- New baseline: [Actual baseline under load]
- Warning threshold: [When to alert]
- Critical threshold: [When to escalate]

**Cross-reference**: Link this incident as data source for baselines
```

</output-format>

<instructions>
CRITICAL: Document investigation in real-time, not just after resolution. This captures uncertainty, dead ends, and reasoning that gets lost in post-mortem summaries.

DO NOT:
- Wait until incident resolved to document (capture as you investigate)
- Sanitize failures (dead ends teach as much as successes)
- Skip command outputs (exact output is valuable reference)
- Ignore architecture connections (link operations to design)
- Forget to document why (capture reasoning, not just actions)
- Lose valuable debugging patterns (extract reusable approaches)

ALWAYS:
- Timestamp every investigation step (timeline is critical)
- Document hypotheses before testing (capture reasoning)
- Record exact commands and output (reproducibility)
- Note why dead ends didn't work (prevent future wasted time)
- Link to architecture documentation (connect to system design)
- Extract reusable patterns (turn investigation into knowledge)
- Identify documentation gaps (fix after incident)
- Update cross-references (connect incident to broader knowledge)

REMEMBER: The most valuable incident documentation captures the investigation process—the hypotheses explored, tests run, dead ends encountered, and reasoning applied. This transforms incident response from art into science.
</instructions>

<examples>

## Example: Database Connection Pool Exhaustion Investigation

```
# Incident Investigation: 2026-01-15-database-connection-pool

Incident ID: 2026-01-15-database-connection-pool
System: PaymentAPI
Severity: SEV-1 (Critical outage—payment processing down)
Status: RESOLVED
Started: 2026-01-15 14:23:00 UTC
Resolved: 2026-01-15 14:47:00 UTC
On-call Engineer(s): alex-chen, jordan-williams

## Quick Summary
Current hypothesis: Connection pool exhausted due to connection leak
Current action: Restarting pods to reset connection pool
Next steps: If restart works → Monitor for recurrence / If restart doesn't work → Increase pool size

## Impact Assessment
Affected components: PaymentAPI, payment processing pipeline
User impact: Unable to process credit card payments, seeing "Service Unavailable" errors
Scope: 100% of payment attempts failing, ~500 requests/minute affected
Business impact: ~$10K/minute revenue loss, SLA breach (99.9% availability), customer complaints escalating

## Related Documentation
- System Architecture: memory-bank/systemPatterns.md#database-layer
- Connection Pool Design: memory-bank/systemPatterns.md#connection-management (documents pool sized for 50 connections)
- Dependencies: memory-bank/operations/dependencies/operational-dependencies.md#database
- Runbook Used: memory-bank/operations/runbooks/database-connection-failure.md
- Related Past Incidents: None (first occurrence of this failure mode)

---

## Investigation Timeline

### 14:23 Initial Detection

Symptom: PagerDuty alert fired: "database_connection_errors > 5 in 1 minute"
Observable behavior:
- Grafana dashboard shows ~50 database connection errors per minute (normal: 0)
- HTTP 503 error rate spiked to 98% (normal: <1%)
- User reports: "Payment page says 'Service Unavailable'"

Initial assessment:
- Severity: SEV-1 (payment processing completely down)
- Impact: All payment attempts failing
- Urgency: Critical—revenue impact, SLA breach imminent

Runbook consulted: memory-bank/operations/runbooks/database-connection-failure.md

---

### 14:25 Hypothesis 1: Database is down

**Hypothesis**: PostgreSQL database is unavailable or not accepting connections

**Reasoning**: Connection errors typically mean database unavailable
- Symptom: "connection refused" errors in logs
- Runbook Step 4 suggests checking database availability first
- Architecture context: memory-bank/systemPatterns.md#database-layer (PaymentAPI depends on single PostgreSQL instance)

**Test**: Check database availability using pg_isready

Command(s) executed:
```bash
kubectl exec -n payment-api deployment/payment-api -- pg_isready -h payment-db.production.svc.cluster.local -p 5432
```

Result:
```
payment-db.production.svc.cluster.local:5432 - accepting connections
```

**Interpretation**: Database is up and accepting connections
- Expected if hypothesis correct: "rejecting connections" or "connection refused"
- Actually observed: "accepting connections"
- Conclusion: REJECTED

**Decision**: Database is healthy. Investigate PaymentAPI connection pool (Hypothesis 2)

---

### 14:27 Hypothesis 2: Connection pool exhausted

**Hypothesis**: PaymentAPI's connection pool is exhausted (all 50 connections in use, no available for new requests)

**Reasoning**: Database healthy but connections failing suggests pool exhaustion
- Symptom: Errors say "timeout obtaining connection" in logs (noticed just now)
- Architecture context: memory-bank/systemPatterns.md#connection-management documents HikariCP pool with maxPoolSize=50
- Runbook Step 3 suggests checking connection pool state

**Test**: Check connection pool utilization

Command(s) executed:
```bash
kubectl exec -n payment-api deployment/payment-api -c payment-api -- curl -s localhost:8081/actuator/metrics/hikaricp.connections.active
```

Result:
```json
{
  "name": "hikaricp.connections.active",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 50.0
    }
  ],
  "availableTags": [
    {
      "tag": "pool",
      "values": ["HikariPool-1"]
    }
  ]
}
```

Also checked max pool size:
```bash
kubectl exec -n payment-api deployment/payment-api -c payment-api -- curl -s localhost:8081/actuator/metrics/hikaricp.connections.max
```

Result:
```json
{
  "name": "hikaricp.connections.max",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 50.0
    }
  ]
}
```

**Interpretation**: Connection pool is completely exhausted
- Expected if hypothesis correct: active = max (50 = 50)
- Actually observed: Exactly that—50 active, 50 max
- Conclusion: CONFIRMED

**Decision**: Connection pool exhausted is root cause. Now investigate why (leak vs legitimate traffic).

---

### 14:30 Hypothesis 3: Traffic spike exhausted pool

**Hypothesis**: Traffic spike beyond normal capacity overwhelmed connection pool

**Reasoning**: Legitimate traffic surge could exhaust fixed-size pool
- Need to verify if request rate increased significantly
- Architecture assumption: Pool sized for 500 req/s (memory-bank/systemPatterns.md#connection-management)

**Test**: Check request rate over last hour

Command(s) executed:
Checked Grafana dashboard: [link to dashboard]

Result:
Request rate timeline:
- 14:00-14:20: ~450 req/s (normal)
- 14:20-14:23: ~480 req/s (still normal)
- 14:23+: Dropped to ~50 req/s (requests failing due to incident)

**Interpretation**: No traffic spike occurred
- Expected if hypothesis correct: Request rate >600 req/s before incident
- Actually observed: Normal request rate ~450-480 req/s
- Conclusion: REJECTED

**Decision**: Traffic was normal. Pool exhaustion is not due to surge. Investigate connection leak (Hypothesis 4).

---

### 14:33 Hypothesis 4: Connection leak

**Hypothesis**: Code bug causing connections to not be returned to pool (connection leak)

**Reasoning**: Pool exhausted at normal traffic suggests connections not being released
- 50 connections stuck
- Normal traffic shouldn't need all 50 connections
- Design: memory-bank/systemPatterns.md#connection-management assumes 10ms DB query time, 500 req/s = need ~5 connections average
- Reality: 50 connections all active = 10x expected

**Test**: Check how long connections have been active

Command(s) executed:
```bash
kubectl exec -n payment-api deployment/payment-api -c payment-api -- curl -s localhost:8081/actuator/metrics/hikaricp.connections.usage | jq .
```

Result:
```json
{
  "name": "hikaricp.connections.usage",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 1.0
    }
  ],
  "baseUnit": "milliseconds",
  "availableTags": []
}
```

Also checked application logs for long-running transactions:
```bash
kubectl logs -n payment-api deployment/payment-api --since=30m | grep -i "transaction" | tail -20
```

Found in logs:
```
2026-01-15 14:22:31 WARN  HikariPool-1 - Connection leak detection triggered for connection pool, (connection has been held for 30000ms)
2026-01-15 14:22:31 WARN  HikariPool-1 - Connection leak detection triggered for connection pool, (connection has been held for 30000ms)
[... 48 more similar warnings ...]
```

**Interpretation**: Clear evidence of connection leak
- Expected if hypothesis correct: Connections held for long periods (>30s)
- Actually observed: HikariCP's leak detection triggered, connections held for 30+ seconds
- Normal behavior: Connections held for ~10ms
- Conclusion: CONFIRMED

**Decision**: Connection leak confirmed. Immediate mitigation: restart pods to release leaked connections.

---

### 14:35 Dead End: Checking for database-side connection limit

**What we tried**: Verified database hasn't hit max_connections limit

**Why we tried it**: Runbook includes checking database connection limit as possible cause

**What we found**:
```bash
kubectl exec -n database-tools deployment/psql-client -- psql -h payment-db.production.svc.cluster.local -U payment_user -c "SHOW max_connections;"
```
Result: max_connections = 200

Current active connections on database:
```bash
kubectl exec -n database-tools deployment/psql-client -- psql -h payment-db.production.svc.cluster.local -U payment_user -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
```
Result: 52 active connections

**Why this didn't work**: Database has capacity for 200 connections but only 52 are active (~26% utilization). Not a database limit issue.

**Time spent**: 2 minutes

**Lessons**: This check was valuable to rule out database-side limit, but connection leak was clear from earlier findings. In future similar incidents, if HikariCP leak detection already triggered, can skip database limit check.

---

### 14:37 Critical Finding: Recent deployment introduced connection leak

**What we discovered**: Deployment 30 minutes ago introduced code change that doesn't close database connections in error path

**How we discovered it**: Checked deployment history, then reviewed changed code

Command(s):
```bash
kubectl rollout history deployment/payment-api -n payment-api
```

Output:
```
REVISION  CHANGE-CAUSE
...
47        kubectl apply --filename=payment-api-deployment.yaml (2 days ago)
48        kubectl apply --filename=payment-api-deployment.yaml (30 minutes ago)
```

Checked git log for changes in revision 48:
```bash
git log --oneline --since="1 hour ago"
```

Output:
```
a3f2d8e Fix payment validation logic
```

Reviewed commit a3f2d8e:
```java
// File: PaymentValidator.java
// Changed code:
public boolean validatePayment(Payment payment) {
    Connection conn = dataSource.getConnection();  // Gets connection
    try {
        // Validation logic...
        if (invalid) {
            return false;  // BUG: Returns without closing connection!
        }
        // Success path...
        return true;
    } finally {
        conn.close();  // Only closes on exception or success path, not on early return
    }
}
```

**Why this matters**: Code path returns early without closing connection
- Bug introduced: Early return bypasses finally block in some code paths
- Frequency: Every invalid payment leaks a connection
- Timeline: Deployed 30 minutes ago (14:00), incident started 14:23 (23 minutes to exhaust 50 connections = ~2 invalid payments/minute)
- Narrows problem space to: Specific code change in validation logic

**Architecture connection**: memory-bank/systemPatterns.md#connection-management
- Design context: Documents try-with-resources pattern for connection management
- Design intent: All connections automatically closed via try-with-resources
- Deviation: New code didn't follow try-with-resources pattern, manually managed connection incorrectly

---

### 14:40 Root Cause Identified: Connection leak in payment validation error path

**Root Cause**: Code bug in PaymentValidator.java introduced in deployment 48 (commit a3f2d8e, 30 minutes ago). Early return in validation error path doesn't close database connection, causing connection leak.

**Evidence**:
1. Connection pool exhausted (50 active = 50 max)
2. HikariCP leak detection warnings (connections held >30s)
3. No traffic spike (normal ~450 req/s)
4. Recent deployment 30 minutes ago
5. Code review found early return doesn't close connection
6. Timeline matches (23 minutes to exhaust pool at ~2 invalid payments/minute)

**Causal Chain**:
1. Root cause: Code deployed with connection leak in error path (validatePayment early return)
2. Immediate effect: Each invalid payment leaks one database connection
3. Cascading effect: Over 23 minutes, ~46 invalid payments leaked 46 connections (plus normal traffic using remaining)
4. Observable symptom: Connection pool exhausted, all payment attempts fail with "timeout obtaining connection"

**Why it took this long to find**:
- Complexity factors: Had to rule out database availability, traffic spike, database connection limit first (per runbook)
- Missing observability: No alert on connection leak warnings (HikariCP was logging warnings but no alert)
- Documentation gaps: None—runbook worked well, led us to diagnosis

**Architecture context**: memory-bank/systemPatterns.md#connection-management
- Design assumption: All code uses try-with-resources for connection management
- Reality: New code manually managed connection, missed error path
- Design implications: Need code review checklist enforcing try-with-resources, or linter rule

---

### 14:42 Resolution Applied: Rollback to previous deployment

**Action taken**: Rollback to revision 47 (before connection leak introduced)

Command(s):
```bash
kubectl rollout undo deployment/payment-api -n payment-api --to-revision=47
```

Monitored rollback:
```bash
kubectl rollout status deployment/payment-api -n payment-api
```

Output:
```
Waiting for deployment "payment-api" rollout to finish: 1 out of 3 new replicas have been updated...
Waiting for deployment "payment-api" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "payment-api" rollout to finish: 1 old replicas are pending termination...
deployment "payment-api" successfully rolled out
```

**Expected effect**:
- New pods running revision 47 (without connection leak)
- Connection pool utilization returns to normal (<20% typically)
- Payment processing resumes

**Verification**:
Checked connection pool utilization after rollback:
```bash
kubectl exec -n payment-api deployment/payment-api -c payment-api -- curl -s localhost:8081/actuator/metrics/hikaricp.connections.active
```

Result:
```json
{
  "name": "hikaricp.connections.active",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 8.0
    }
  ]
}
```

Checked error rate:
Grafana dashboard: HTTP 503 error rate dropped from 98% to <1%

Checked database connection errors:
Grafana dashboard: database_connection_errors dropped from 50/min to 0/min

**Monitoring**: Monitored for 5 minutes, connection pool stable at 6-10 active connections, error rate <1%

**Rollback plan**: If rollback hadn't worked, would have increased connection pool size temporarily while investigating further.

---

### 14:47 Incident Resolved

**Resolution confirmed**:
- All symptoms cleared:
  ✓ Database connection errors: 0/min (was 50/min)
  ✓ HTTP 503 error rate: <1% (was 98%)
  ✓ Payment processing: Successful
  ✓ Connection pool utilization: 6-10 active (was 50/50)

- Metrics returned to baseline:
  ✓ Request rate: ~460 req/s (baseline: 450 req/s)
  ✓ Connection pool active: 6-10 (baseline: 5-12)
  ✓ HTTP success rate: >99% (baseline: 99.5%)

- Sustained stability: Monitored for 5 minutes, all metrics stable

**Total duration**: 24 minutes (14:23 detection → 14:47 resolution)

**Follow-up required**:
- Post-mortem: Yes, scheduled for 2026-01-16 10:00 AM
- Preventive measures:
  - Fix connection leak in commit a3f2d8e, redeploy
  - Add alert on HikariCP connection leak warnings
  - Add code review checklist item: verify try-with-resources for all connection management
  - Consider linter rule enforcing connection management pattern
- Runbook updates: Runbook worked well, no updates needed
- Architecture review: Consider adding connection pool monitoring dashboards visible in war room

---

## Reusable Debugging Patterns

### Pattern 1: Connection pool exhaustion investigation

**When to use this pattern**:
- Observable symptoms: "timeout obtaining connection" errors, database connection errors spike, but database itself is available
- System context: Applications using connection pooling (HikariCP, c3p0, etc.)

**Investigation approach**:
1. **Verify database availability first**
   - Command: `pg_isready` (or equivalent for database type)
   - Look for: "accepting connections" vs "rejecting connections"
   - If database unavailable: Engage database team
   - If database available: Continue to step 2

2. **Check connection pool utilization**
   - Command: Query application metrics endpoint for pool active/max
   - Look for: active = max (pool exhausted)
   - If active << max: Issue is database-side
   - If active = max: Pool exhausted, continue to step 3

3. **Determine cause: traffic surge vs connection leak**
   - Command: Check request rate in observability platform
   - Look for: Traffic spike before incident
   - If traffic spike: Legitimate capacity issue
   - If normal traffic: Connection leak, continue to step 4

4. **Detect connection leak**
   - Command: Check application logs for leak warnings, check pool connection age
   - Look for: "Connection leak detection triggered", connections held for >30s
   - If leak detected: Recent code change likely cause, check deployments
   - Resolution: Rollback deployment or restart pods (temporary)

**Resolution approach**: Rollback to version before leak introduced (permanent) or restart pods (temporary mitigation)

**Time saved**: This pattern helped us reach root cause in 17 minutes (14:25-14:42). Without systematic approach, could have spent time restarting pods first (masks problem temporarily) without finding actual cause.

**Add to runbook**: memory-bank/operations/runbooks/database-connection-failure.md already includes this pattern (followed it successfully)

---

### Pattern 2: Correlating incidents with recent deployments

**When to use this pattern**:
- Observable symptoms: Incident started within 1 hour of deployment
- System context: Any system with continuous deployment

**Investigation approach**:
1. **Check deployment timeline**
   - Command: `kubectl rollout history` or equivalent
   - Look for: Deployments within 1 hour of incident start
   - If no recent deployment: Unlikely deployment-related
   - If recent deployment: Continue to step 2

2. **Review changed code**
   - Command: `git diff` between current and previous version
   - Look for: Changes in code paths related to symptoms
   - Focus: Error handling, resource management, new features

3. **Correlate timing**
   - Calculate: Time from deployment to incident vs time to exhaust resource
   - Example: If connection pool size 50, incident 23 minutes after deploy, implies ~2 leaks/minute
   - Validation: Does leak rate make sense given code change?

**Resolution approach**: Rollback deployment if correlation strong

**Time saved**: Checking deployment history took 2 minutes but immediately pointed to root cause. Without this pattern, might have investigated database, network, infrastructure issues for much longer.

**Add to runbook**: This is a general pattern, should be added as "Step 2: Check Recent Changes" in all runbooks

---

## Investigation Inefficiencies

### Inefficiency 1: No alert on connection leak warnings

**Issue**: HikariCP was logging connection leak warnings at 14:22 (1 minute before incident severity escalated) but no alert fired. We only discovered warnings when reviewing logs during investigation.

**Time cost**: Could have been alerted 1 minute earlier, potentially preventing incident escalation

**Root cause of inefficiency**:
- Missing observability: No alert rule on HikariCP leak warnings
- Monitoring gap: Logs not monitored proactively, only checked reactively

**Improvement needed**:
- Observability: Add Datadog monitor alerting on log pattern "Connection leak detection triggered"
- Alert urgency: Warning severity (not critical) since pool not exhausted yet, but prompts investigation
- Alert content: Include connection pool utilization in alert context

**Ticket created**: INFRA-2341 "Add alert for HikariCP connection leak warnings"

---

### Inefficiency 2: Manual correlation of deployment timing with incident

**Issue**: Had to manually check deployment history, then calculate timing correlation (deployment at 14:00, incident at 14:23 = 23 minutes, pool size 50 = ~2 leaks/minute). This was error-prone and time-consuming.

**Time cost**: 3-4 minutes to manually correlate

**Root cause of inefficiency**:
- Missing observability: Deployment events not visible in same dashboards as metrics/alerts
- Tool limitation: Have to switch between Grafana (metrics), Kubernetes (deployments), GitHub (code)

**Improvement needed**:
- Observability: Add deployment event markers to Grafana dashboards showing when each deployment occurred
- Tooling: Incident timeline tool that auto-correlates deployments with metric changes
- Process: Post-deployment automated checks for common issues (connection pool utilization, error rate)

**Ticket created**: INFRA-2342 "Add deployment event markers to Grafana dashboards"

---

### Inefficiency 3: Code review didn't catch connection leak

**Issue**: Connection leak bug passed code review without detection

**Time cost**: Incident wouldn't have occurred if caught in review

**Root cause of inefficiency**:
- Process: No code review checklist enforcing resource management patterns
- Tool limitation: No linter rule flagging manual connection management instead of try-with-resources

**Improvement needed**:
- Process: Add code review checklist item: "Verify database connections use try-with-resources pattern"
- Tooling: Add custom PMD/Checkstyle rule flagging manual connection management
- Documentation: Update memory-bank/systemPatterns.md#connection-management with clear guidance on required pattern

**Ticket created**: DEV-4523 "Add code review checklist and linter rule for connection management"

---

## Key Commands Used

### Discovery Commands

**Check connection pool active connections**:
```bash
kubectl exec -n payment-api deployment/payment-api -c payment-api -- curl -s localhost:8081/actuator/metrics/hikaricp.connections.active
```
Purpose: See how many connections currently in use
Output interpretation:
- Compare "value" to max pool size
- Value < maxPoolSize * 0.8: Normal
- Value > maxPoolSize * 0.9: Pool saturated
- Value = maxPoolSize: Pool exhausted (all connections in use)
Used at: 14:27 in investigation timeline
Result: 50.0 (exhausted—50 active, 50 max)

**Check connection pool max connections**:
```bash
kubectl exec -n payment-api deployment/payment-api -c payment-api -- curl -s localhost:8081/actuator/metrics/hikaricp.connections.max
```
Purpose: Verify configured max pool size
Output interpretation: Max value determines capacity
Used at: 14:27 in investigation timeline
Result: 50.0

**Check database availability**:
```bash
kubectl exec -n payment-api deployment/payment-api -- pg_isready -h payment-db.production.svc.cluster.local -p 5432
```
Purpose: Verify database is up and accepting connections
Output interpretation:
- "accepting connections": Database healthy
- "rejecting connections": Database in maintenance or starting up
- "connection refused": Database down or network issue
Used at: 14:25 in investigation timeline
Result: "accepting connections" (database healthy)

**Check deployment history**:
```bash
kubectl rollout history deployment/payment-api -n payment-api
```
Purpose: See recent deployments that might have introduced issue
Output interpretation: Look for deployments within last hour before incident
Used at: 14:37 in investigation timeline
Result: Found deployment 30 minutes before incident (revision 48)

---

### Diagnostic Commands

**Check application logs for connection leak warnings**:
```bash
kubectl logs -n payment-api deployment/payment-api --since=30m | grep -i "connection leak"
```
Purpose: Find HikariCP connection leak detection warnings
Output interpretation:
- No results: No detected leaks
- "Connection leak detection triggered": Leak detected, connection held too long
Used at: 14:33 in investigation timeline
Result: 48+ warnings about connections held for >30s

**Check database active connections from database side**:
```bash
kubectl exec -n database-tools deployment/psql-client -- psql -h payment-db.production.svc.cluster.local -U payment_user -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
```
Purpose: Verify how many connections database sees
Output interpretation: Compare to application's reported active connections
Used at: 14:35 in investigation timeline
Result: 52 active connections (matches application's 50, plus 2 from other services)

**Review git log for recent changes**:
```bash
git log --oneline --since="1 hour ago"
```
Purpose: See what code changed in recent deployment
Output interpretation: Look for changes in code paths related to symptoms
Used at: 14:37 in investigation timeline
Result: Found commit a3f2d8e "Fix payment validation logic" with connection leak bug

---

### Resolution Commands

**Rollback deployment**:
```bash
kubectl rollout undo deployment/payment-api -n payment-api --to-revision=47
```
Purpose: Rollback to previous deployment version
Used at: 14:42 in investigation timeline
Effect: Connection pool utilization dropped from 50 to 6-10, error rate dropped from 98% to <1%
Rollback: None needed (rollback is already the undo action)

**Monitor rollback status**:
```bash
kubectl rollout status deployment/payment-api -n payment-api
```
Purpose: Watch rollback progress, confirm completion
Used at: 14:42 in investigation timeline
Effect: Confirmed rollback completed successfully

---

## Architecture Insights

### Architecture Assumption 1: Try-with-resources pattern universally followed

**We assumed**: All code uses try-with-resources for connection management
- Documented in: memory-bank/systemPatterns.md#connection-management
- Assumption: "All database access uses try-with-resources to guarantee connection closure"
- Design based on: Java best practice, automatic resource management

**Reality**: New code introduced manually managed connection
- Actual behavior: Developer used manual connection management in PaymentValidator.java
- Why different: Code review didn't enforce pattern, no linter rule flagged violation
- Conditions: Manual connection management with early return bypasses finally block

**Implications**:
- Design change needed: No (pattern is correct)
- Documentation update: memory-bank/systemPatterns.md#connection-management should emphasize enforcement mechanisms
- Monitoring addition: Alert on connection leak warnings (INFRA-2341)
- Process change: Code review checklist, linter rule (DEV-4523)

**Action required**:
- Update memory-bank/systemPatterns.md: Add section on enforcement (code review, linters)
- INFRA-2341: Add alert on connection leak warnings
- DEV-4523: Add code review checklist and linter rule

---

### Architecture Assumption 2: Connection pool sized for peak traffic

**We assumed**: 50 connection pool size adequate for peak traffic
- Documented in: memory-bank/systemPatterns.md#connection-management
- Assumption: "Peak traffic 500 req/s × 10ms query time = 5 connections needed, sized to 50 for 10x headroom"
- Design based on: Load testing at 2x peak, connection pool formula

**Reality**: Assumption held (pool sizing was correct)
- Actual behavior: Normal traffic ~450 req/s used 5-12 connections (as designed)
- Incident caused by: Connection leak, not undersized pool
- Validation: After rollback, pool utilization returned to 6-10 connections (design assumption confirmed)

**Implications**:
- Design change needed: No (pool sizing correct)
- Documentation update: None needed (assumption validated)
- Monitoring addition: Alert on pool utilization >70% for early warning (INFRA-2343)

**Action required**: INFRA-2343 "Add alert for connection pool utilization >70%"

---

## Dependency Behavior

### Dependency: PostgreSQL Database

**Expected behavior**: Database handles up to 200 connections, pool uses up to 50
- Documented in: memory-bank/operations/dependencies/operational-dependencies.md#database
- SLA: 99.9% availability, <10ms query latency p95
- Failure mode: If database down, health checks fail, requests fail fast

**Actual behavior during incident**: Database remained healthy throughout incident
- Availability: 100% (no downtime)
- Latency: <10ms p95 (within SLA)
- Failure mode: Didn't fail—issue was application-side connection leak

**Impact on our system**:
- Direct impact: None (database was healthy)
- Cascading impact: None (issue isolated to PaymentAPI connection pool)
- Mitigation worked: N/A (didn't need database-side mitigation)

**Documentation update needed**: None (database behaved as expected)

**Action required**: None related to database dependency

---

## Cross-Reference Updates Needed

### Update 1: System Architecture

**File**: memory-bank/systemPatterns.md#connection-management

**Current content says**:
"Connection Management:
- HikariCP connection pool, max 50 connections
- All database access uses try-with-resources to guarantee connection closure
- Pool sized for 500 req/s peak traffic (5 connections needed, 50 for headroom)"

**What incident revealed**: Need to enforce try-with-resources pattern, not just document it

**Update needed**: Add enforcement section
```markdown
Connection Management:
- HikariCP connection pool, max 50 connections
- All database access MUST use try-with-resources to guarantee connection closure
  - NEVER manually manage connections (getConnection() + finally block)
  - Code review checklist enforces this (see DEV-4523)
  - PMD linter rule flags manual connection management (see DEV-4523)
- Pool sized for 500 req/s peak traffic (5 connections needed, 50 for headroom)
- Monitoring: Alert on connection leak warnings, alert on pool utilization >70%

Related incidents:
- 2026-01-15-database-connection-pool: Connection leak caused by manual connection management
```

**Cross-reference**: Link this incident from architecture documentation as cautionary example

---

### Update 2: Operational Dependencies

**File**: memory-bank/operations/dependencies/operational-dependencies.md#database

**Update needed**: Add note about connection pool management criticality
```markdown
## PostgreSQL Database

Dependency type: Critical (payment processing requires database)
SLA: 99.9% availability, <10ms query latency p95

Failure modes:
1. Database unavailable: Health checks fail, requests fail fast, engage database team
2. Database slow: Query latency increases, timeout errors, investigate slow queries
3. **Application-side connection pool exhaustion**: Connections leak or pool undersized
   - Symptom: "timeout obtaining connection" errors, but database itself healthy
   - Investigation: Check connection pool utilization, look for leak warnings
   - Related incident: 2026-01-15-database-connection-pool (connection leak in validation code)
```

**Cross-reference**: Link this incident as example of application-side failure mode

---

### Update 3: Runbook

**File**: memory-bank/operations/runbooks/database-connection-failure.md

**What was missing**: Nothing—runbook worked perfectly

**What should be added**: Add this incident to "Related Past Incidents" section
```markdown
Related Past Incidents:
- 2026-01-15-database-connection-pool: Connection leak in payment validation error path caused pool exhaustion. Runbook successfully guided investigation to root cause in 17 minutes. Rollback resolved incident.
```

**Cross-reference**: Link this incident from runbook as successful example usage

---

### Update 4: Performance Baselines

**File**: memory-bank/operations/performance/baseline-metrics.md

**What incident revealed**: Connection pool utilization baseline confirmed

**Update needed**: Document validated baseline
```markdown
## Connection Pool Utilization

Metric: hikaricp.connections.active (PaymentAPI)
Baseline (validated 2026-01-15): 5-12 active connections under normal load (450 req/s)
Max capacity: 50 connections
Warning threshold: 35 connections (70% utilization) - investigate before exhaustion
Critical threshold: 45 connections (90% utilization) - imminent exhaustion

Validation: Incident 2026-01-15 confirmed baseline (pool returned to 6-10 connections after issue resolved)
```

**Cross-reference**: Link this incident as data source validating baselines
```

Why this works:
- Real-time documentation captured uncertainty and reasoning (not sanitized)
- Hypotheses documented before testing (shows thought process)
- Dead ends preserved (prevents future wasted time)
- Exact commands and outputs (reproducible investigation)
- Architecture connections throughout (links operations to design)
- Reusable patterns extracted (investigation becomes knowledge)
- Cross-reference updates identified (incident improves broader documentation)
- Total timeline preserved (24 minutes, every step timestamped)

This investigation documentation serves multiple purposes:
1. Post-mortem input: Provides complete timeline and evidence
2. Runbook validation: Confirms runbook worked as designed
3. Knowledge transfer: New engineers can learn debugging approach
4. Pattern library: Reusable investigation techniques for similar incidents
5. Documentation improvement: Identifies specific updates needed across memory bank

</examples>
