---
# === Identity ===
id: create-operational-runbook
name: Create operational runbook for common operational scenarios
version: v1

# === Classification ===
chapter: 7
category: operations
subcategory: proactive
tags:
  - operations
  - runbooks
  - troubleshooting
  - incident-response
  - procedures
  - on-call
  - investigation
  - rollback
  - sre
  - operational-knowledge

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Create operational runbook for common operational scenarios.
    Structure effective runbooks with step-by-step troubleshooting procedures, decision trees, prerequisite checks, rollback procedures, and success criteria enabling on-call engineers to respond effectively during incidents.
  argument-hint: "[scenario_name] [system_name] [severity] [runbook_location]"
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
  - name: scenario_name
    description: The operational scenario this runbook addresses
    example: "Database connection failures"
    maps-to: "$0"
  - name: system_name
    description: The system or service this runbook applies to
    example: "PaymentAPI"
    maps-to: "$1"
  - name: severity
    description: Typical severity when this scenario occurs
    example: "SEV-1 (Critical outage)"
    maps-to: "$2"
  - name: runbook_location
    description: Where to document this runbook
    example: "operations-memory-bank/runbooks/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/create-operational-runbook
  marketplace:
    plugin: constellize-operations

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Create operational runbook for {{scenario_name}} in {{system_name}} providing step-by-step troubleshooting procedures, decision trees guiding investigation, prerequisite checks before taking action, rollback procedures for corrective actions, and clear success criteria, enabling on-call engineers to respond effectively during high-pressure incidents.
</task>

<context>
Scenario: {{scenario_name}}
System: {{system_name}}
Typical Severity: {{severity}}
Documentation Location: {{runbook_location}}

Operational runbooks translate system knowledge into actionable procedures for responding to incidents. Effective runbooks provide systematic investigation paths, not just command lists, helping engineers understand what to check, why checks matter, and how to interpret results. Runbooks connect to system architecture (why dependencies matter) and incident history (what has failed before).
</context>

<thinking>
Before creating runbook:
1. What are the symptoms that trigger this runbook?
2. What are the most common root causes?
3. What checks help narrow down the cause?
4. What actions can resolve the issue?
5. What risks do corrective actions carry?
6. How do we know when the issue is resolved?
</thinking>

<output-format>

## Runbook Header Pattern

```
# Runbook: {{scenario_name}}

System: {{system_name}}
Typical Severity: {{severity}}
Expected Time to Resolve: [Time estimate]
Last Updated: [Date]
Last Reviewed: [Date]

## Quick Reference
When to use this runbook: [Symptoms that trigger this runbook]
Prerequisites: [Access, tools, permissions needed]
Emergency Contacts: [On-call rotation, escalation contacts]

## Overview
[One paragraph explaining what this scenario is, why it matters, and general approach]

## Related Documentation
- System Architecture: [Link to memory-bank/systemPatterns.md relevant section]
- Dependencies: [Link to operational-dependencies.md]
- Recent Incidents: [Links to incidents that used this runbook]
- Design Decisions: [Links to relevant design documentation]
```

---

## Investigation Pattern

```
## Investigation Procedure

Follow this systematic investigation path. Do not skip steps—each narrows the problem space.

### Step 1: Verify Symptoms

Objective: Confirm the reported issue matches expected symptoms

Checks:
□ [Specific symptom check 1]
  - Command: [How to check]
  - Expected result: [Normal behavior]
  - Observed result: [What you see during issue]
  - Interpretation: [What this tells you]

□ [Specific symptom check 2]
  - Command: [How to check]
  - Expected result: [Normal behavior]
  - Observed result: [What you see during issue]
  - Interpretation: [What this tells you]

Decision Point:
- If symptoms NOT confirmed → Investigate alternative scenarios
- If symptoms confirmed → Continue to Step 2

### Step 2: Check Recent Changes

Objective: Identify if recent changes contributed to issue

Checks:
□ Recent deployments
  - Command: [How to check deployment history]
  - Look for: Deployments in last [timeframe]
  - Questions: Did symptoms start after deployment? New code or config?

□ Recent configuration changes
  - Command: [How to check config history]
  - Look for: Changes to [specific configs]
  - Questions: Did resource limits change? New feature flags?

□ Recent traffic pattern changes
  - Command: [How to check traffic patterns]
  - Look for: Unusual spikes, new clients, different request types
  - Questions: Did traffic exceed capacity? New usage pattern?

Decision Point:
- If recent change identified → Likely cause found, proceed to resolution
- If no recent change → Continue to Step 3

### Step 3: Check System Health

Objective: Identify unhealthy components

Checks:
□ Service health checks
  - Command: [How to check service health]
  - Look for: Failed health checks, unhealthy pods/instances
  - Interpretation: [What each health check failure means]

□ Resource utilization
  - Command: [How to check CPU, memory, disk, network]
  - Look for: Resource saturation (>80% utilization)
  - Interpretation: [What each resource saturation means]

□ Error rates
  - Command: [How to check error metrics]
  - Look for: Elevated error rates, specific error types
  - Interpretation: [What each error type indicates]

Decision Point:
- If specific component unhealthy → Investigate that component (Step 4)
- If all components healthy → Check dependencies (Step 5)

### Step 4: Investigate Unhealthy Component

Objective: Diagnose why specific component is unhealthy

Checks (adapt based on component type):
□ Application logs
  - Command: [How to access logs]
  - Look for: Errors, warnings, stack traces
  - Common patterns: [List common error patterns and meanings]

□ Resource exhaustion
  - Command: [How to check resource usage for component]
  - Look for: Out of memory, CPU throttling, disk full, file descriptors exhausted
  - Actions: [How to free resources if safe]

□ Configuration issues
  - Command: [How to verify configuration]
  - Look for: Missing env vars, incorrect values, typos
  - Verification: [How to test configuration]

Decision Point:
- If cause identified → Proceed to Resolution
- If cause unclear → Escalate (Step 7)

### Step 5: Check Dependency Health

Objective: Identify if upstream dependency is causing issue

Checks:
□ [Dependency 1]
  - Command: [How to check dependency health]
  - Look for: Availability, latency, error rate
  - Interpretation: [What dependency failure means for system]
  - Impact: [How this dependency failure manifests in symptoms]

□ [Dependency 2]
  - Command: [How to check dependency health]
  - Look for: Availability, latency, error rate
  - Interpretation: [What dependency failure means for system]
  - Impact: [How this dependency failure manifests in symptoms]

Decision Point:
- If dependency failed → Investigate dependency or engage dependency team
- If dependencies healthy → Check for cascading issues (Step 6)

### Step 6: Check for Cascading Issues

Objective: Identify if issue is cascading effect from elsewhere

Checks:
□ Upstream services
  - Command: [How to check upstream service health]
  - Look for: Are upstream services experiencing issues?
  - Impact: Could upstream retry storms be overwhelming this service?

□ Downstream services
  - Command: [How to check downstream service health]
  - Look for: Are downstream services slow or failing?
  - Impact: Could slow downstream response cause resource exhaustion here?

□ Shared infrastructure
  - Command: [How to check cluster/network/platform health]
  - Look for: Platform-wide issues affecting multiple services
  - Impact: Is this service one of many affected?

Decision Point:
- If cascading issue identified → Address root cause or coordinate with teams
- If no cascading issue → Escalate (Step 7)

### Step 7: Escalation

If investigation hasn't identified root cause after Steps 1-6:

Escalation Path:
1. Senior on-call engineer: [Contact method]
2. Team lead: [Contact method]
3. Architect: [Contact method] (for architectural questions)

Information to provide when escalating:
- Timeline: When did issue start?
- Symptoms: What exactly is failing?
- Investigation completed: Which steps above were completed?
- Findings: What was discovered (even if inconclusive)?
- Current state: Is issue getting worse, stable, or improving?
- Impact: How many users/requests affected?
```

---

## Resolution Pattern

```
## Resolution Procedures

Based on root cause identified, follow appropriate resolution procedure.

### Resolution 1: [Common Cause Name]

When to use: [Symptoms + investigation findings that indicate this cause]

Prerequisites:
□ [Required access/permissions]
□ [Required tools/scripts]
□ [Backup/snapshot if applicable]
□ [Communication to stakeholders if high-risk action]

Procedure:

Step 1: [Action name]
Command: [Specific command or procedure]
Expected result: [What should happen]
Verification: [How to confirm step succeeded]
Rollback: [How to undo this step if necessary]

Step 2: [Action name]
Command: [Specific command or procedure]
Expected result: [What should happen]
Verification: [How to confirm step succeeded]
Rollback: [How to undo this step if necessary]

Step 3: Verify Resolution
□ Check symptom: [Command to verify original symptom resolved]
□ Check metrics: [Verify error rate, latency return to normal]
□ Check logs: [Verify no new errors introduced]
□ Monitor: [Duration to monitor before considering resolved]

Success Criteria:
□ [Specific metric 1] returned to baseline
□ [Specific metric 2] within acceptable range
□ No new errors introduced
□ Sustained for [duration, typically 15-30 minutes]

If resolution unsuccessful: Revert changes, escalate

### Resolution 2: [Another Common Cause Name]

[Same structure as Resolution 1]

### Resolution 3: Emergency Mitigation (When Root Cause Unknown)

When to use: Severity critical, resolution urgent, root cause still under investigation

Purpose: Reduce impact while investigation continues

Mitigation Options:

Option A: Restart Service
Risk: Brief service interruption (30-60 seconds)
When to use: Service in degraded state, restart likely to clear issue
Procedure:
1. [Command to restart]
2. [Monitor restart process]
3. [Verify service healthy after restart]
Note: Document symptoms before restart for post-incident analysis

Option B: Scale Up Resources
Risk: Increased infrastructure cost
When to use: Resource saturation evident, scaling will relieve pressure
Procedure:
1. [Command to increase replicas/instances]
2. [Monitor scaling process]
3. [Verify additional capacity helps]
Note: Remember to scale down after issue resolved

Option C: Reroute Traffic
Risk: Increased load on alternative service/region
When to use: Issue isolated to specific instance/region
Procedure:
1. [Command to reroute traffic]
2. [Monitor alternative destination can handle load]
3. [Verify traffic successfully rerouted]
Note: Investigate affected instance/region after traffic rerouted

Option D: Enable Degraded Mode
Risk: Reduced functionality for users
When to use: Dependency failed, system has degraded mode
Procedure:
1. [How to enable degraded mode]
2. [Verify system functioning in degraded mode]
3. [Communicate degraded mode to users/stakeholders]
Note: Monitor for when dependency recovers

```

---

## Post-Resolution Pattern

```
## Post-Resolution Steps

After issue resolved, complete these steps before closing incident:

### Step 1: Verify Full Resolution

□ All symptoms resolved (not just masked)
□ Metrics returned to baseline
  - [Metric 1]: [Expected baseline value]
  - [Metric 2]: [Expected baseline value]
  - [Metric 3]: [Expected baseline value]
□ No related errors in logs
□ System stable for [duration, typically 30 minutes]

### Step 2: Document Findings

□ Update incident report: [Link to incident template]
  - Timeline of events
  - Investigation steps taken
  - Root cause identified
  - Resolution applied
  - Lessons learned

□ Update this runbook if gaps found:
  - Were symptoms accurately described?
  - Did investigation steps lead to root cause?
  - Did resolution procedure work as documented?
  - Should new resolution procedure be added?

### Step 3: Communicate

□ Notify stakeholders issue resolved
  - [Communication channel/method]
  - Include: What happened, impact, resolution, prevention

□ Update status page (if applicable)
  - Mark incident resolved
  - Include brief summary

### Step 4: Follow-Up Actions

□ Create tickets for preventive measures:
  - Improved monitoring/alerting
  - Improved documentation
  - Code/config changes to prevent recurrence
  - Capacity increases if needed

□ Schedule post-mortem (for SEV-1 and SEV-2 incidents)
  - Within 24-48 hours
  - Include all responders
  - Focus on systemic improvements

### Step 5: Cross-Reference Updates

□ Link incident to relevant documentation:
  - memory-bank/systemPatterns.md: If design assumptions revealed incorrect
  - memory-bank/operations/dependencies/: If dependency behavior surprised us
  - memory-bank/operations/performance/: If capacity assumptions wrong

□ Update cross-references:
  - This runbook → incident report
  - Incident report → this runbook
  - Design docs → operational learnings
```

---

## Runbook Maintenance Pattern

```
## Maintenance

Runbook Currency:
Review Frequency: [Monthly recommended for critical runbooks, quarterly for others]
Last Reviewed: [Date]
Next Review: [Date]

Review Checklist:
□ Commands still accurate (no deprecated tools/APIs)
□ Access procedures current (no changed permissions)
□ Contact information up to date
□ Recent incidents validate runbook (or reveal gaps)
□ Cross-references still valid (linked docs not moved/deleted)
□ Severity assessment still accurate
□ Time estimates still realistic

Update Triggers:
- After each incident using this runbook (lessons learned)
- After system architecture changes (new dependencies, components)
- After deployment procedure changes (new tools, platforms)
- When investigation steps don't lead to resolution
- When resolution procedures don't work as documented

Version History:
[Date]: [Change description]
[Date]: [Change description]
```

</output-format>

<instructions>
CRITICAL: Runbooks must be actionable under pressure. Write for on-call engineers at 3 AM with systems failing.

DO NOT:
- Write vague procedures ("check if system healthy")
- Skip verification steps ("assume this worked")
- Ignore rollback procedures (every action needs undo path)
- Write procedures you haven't tested
- Use jargon without explanation
- Assume knowledge (make prerequisites explicit)

ALWAYS:
- Provide specific commands with expected output
- Include decision points (if X then Y, else Z)
- Document why each step matters (not just what to do)
- Specify success criteria (how do you know it worked?)
- Plan for rollback (how to undo if action fails)
- Link to system architecture (connect operations to design)
- Update after each incident (continuous improvement)

REMEMBER: A runbook used during an incident and found lacking should be updated immediately while experience is fresh. Every incident that deviates from the runbook is an opportunity to improve it.
</instructions>

<examples>

## Example: Database Connection Failure Runbook

```
# Runbook: Database Connection Failures

System: PaymentAPI
Typical Severity: SEV-1 (Critical outage—cannot process payments without database)
Expected Time to Resolve: 15-30 minutes (typical), escalate if longer
Last Updated: 2026-01-16
Last Reviewed: 2026-01-16

## Quick Reference
When to use this runbook:
- Alert: "database_connection_errors > 5 in 1 minute"
- Symptom: HTTP 503 errors, logs show "connection refused" or "connection timeout"
- Impact: Payment processing fails

Prerequisites:
- Access: Kubernetes cluster (kubectl), database monitoring dashboard
- Tools: kubectl, psql (or equivalent database client), curl
- Permissions: Read pods, exec into pods, read database metrics
- Emergency Contacts: Database team on-call via #database-oncall Slack

## Overview
Database connection failures prevent PaymentAPI from processing payments, causing immediate customer impact. Most common causes: database overload, connection pool exhaustion, network issues, or database maintenance. This runbook guides systematic investigation to identify cause and restore service.

## Related Documentation
- System Architecture: memory-bank/systemPatterns.md#database-layer
- Connection Pool Design: memory-bank/systemPatterns.md#connection-management
- Dependencies: memory-bank/operations/dependencies/operational-dependencies.md#database
- Recent Incidents:
  - 2026-01-15: Connection pool exhaustion - memory-bank/operations/incidents/2026-01-15-db-connection-pool.md

---

## Investigation Procedure

### Step 1: Verify Symptoms

Objective: Confirm database connection failures are occurring

Checks:

□ Check error metrics
  - Command: Open Grafana dashboard [link], view "Database Connection Errors" panel
  - Expected result: 0 errors per minute (normal)
  - Observed result: >5 errors per minute (indicates issue)
  - Interpretation: Database connections are failing

□ Check application logs
  - Command: kubectl logs -n payment-api deployment/payment-api --tail=50 | grep -i "database\|connection"
  - Look for:
    - "connection refused" → Database not accepting connections
    - "connection timeout" → Network issue or database overloaded
    - "too many connections" → Database hit max connections
    - "connection pool exhausted" → Local pool exhausted
  - Interpretation: Error message indicates failure mode

□ Check HTTP error rate
  - Command: Open Grafana dashboard [link], view "HTTP 5xx Error Rate" panel
  - Expected result: <1% error rate (normal)
  - Observed result: >5% error rate with 503 status codes
  - Interpretation: Service returning 503 due to database unavailable (per health check design)

Decision Point:
- If symptoms NOT confirmed → False alarm, check alert threshold
- If symptoms confirmed → Continue to Step 2

### Step 2: Check Recent Changes

Objective: Identify if recent changes contributed

Checks:

□ Recent PaymentAPI deployments
  - Command: kubectl rollout history deployment/payment-api -n payment-api
  - Look for: Deployments in last 2 hours
  - Questions:
    - Did symptoms start immediately after deployment?
    - Was connection pool configuration changed?
    - Was query behavior changed (new queries, query frequency)?

□ Recent database changes
  - Check: #database-changes Slack channel or database team dashboard
  - Look for: Schema migrations, index changes, vacuum operations, upgrades
  - Questions: Could database maintenance affect connections?

□ Recent traffic pattern changes
  - Command: Open Grafana dashboard [link], view "Request Rate" panel
  - Look for: Traffic spikes above normal (>2x baseline)
  - Questions: Did traffic surge overwhelm connection pool?

Decision Point:
- If recent PaymentAPI deployment → Likely connection pool config or query issue, skip to Resolution 1
- If recent database maintenance → Database likely recovering, monitor (Step 5)
- If traffic spike → Connection pool exhausted, skip to Resolution 2
- If no recent change → Continue to Step 3

### Step 3: Check PaymentAPI Health

Objective: Verify PaymentAPI itself is healthy (not just database)

Checks:

□ Pod health
  - Command: kubectl get pods -n payment-api -l app=payment-api
  - Expected result: All pods "Running" and "Ready 1/1"
  - Observed result during issue: Pods running but "Ready 0/1" (failed readiness check due to database)
  - Interpretation: Pods alive but marked unready due to failed database health check

□ Connection pool state
  - Command: kubectl exec -n payment-api deployment/payment-api -- curl localhost:8081/actuator/metrics/hikaricp.connections.active
    (adjust for your application/metrics endpoint)
  - Look for: Active connections count
  - Interpretation:
    - Active = Max → Pool exhausted
    - Active << Max → Pool healthy, issue is database-side
  - Note: If connection pool exhausted (active = max), proceed to Resolution 1

□ Resource utilization
  - Command: kubectl top pods -n payment-api -l app=payment-api
  - Look for: CPU and memory usage
  - Interpretation:
    - CPU/Memory normal → Issue is database connection, not resource exhaustion
    - CPU/Memory high → Possible resource contention, investigate separately

Decision Point:
- If connection pool exhausted → Resolution 1
- If connection pool healthy → Continue to Step 4

### Step 4: Check Database Health

Objective: Determine if database is healthy

Checks:

□ Database availability
  - Command: kubectl exec -n payment-api deployment/payment-api -- pg_isready -h <database_host> -p 5432
    (adjust command for your database type)
  - Expected result: "accepting connections"
  - Observed results:
    - "rejecting connections" → Database in maintenance mode or recovering
    - "connection refused" → Database not running or network issue
    - "timeout" → Network issue or database severely overloaded
  - Interpretation: Database state determines next steps

□ Database connections (from database perspective)
  - Command: psql -h <database_host> -U <user> -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
    (adjust for your database type)
  - Expected result: <80% of max_connections (e.g., <80 if max is 100)
  - Observed result: >90% of max_connections → Database near connection limit
  - Interpretation: Database may be rejecting new connections due to limit

□ Database performance
  - Command: Check database monitoring dashboard [link to Datadog/Grafana]
  - Look for:
    - Query latency: >2x normal → Database struggling
    - Lock waits: >10 locks waiting → Database contention
    - CPU/Memory: >80% → Database resource exhaustion
  - Interpretation: Database performance impacts connection acceptance

Decision Point:
- If database unavailable (not accepting connections) → Resolution 3 (engage database team)
- If database near connection limit → Resolution 2 (scale down connection pool or scale up database)
- If database slow but available → Resolution 4 (investigate query performance)
- If database healthy → Continue to Step 5

### Step 5: Check Network

Objective: Identify if network issue prevents connections

Checks:

□ Network connectivity
  - Command: kubectl exec -n payment-api deployment/payment-api -- ping -c 3 <database_host>
  - Expected result: Packets received
  - Observed result: Packet loss or timeout → Network issue
  - Interpretation: Network between PaymentAPI and database broken

□ DNS resolution
  - Command: kubectl exec -n payment-api deployment/payment-api -- nslookup <database_host>
  - Expected result: IP address returned
  - Observed result: "Non-existent domain" → DNS issue
  - Interpretation: Cannot resolve database hostname

□ Firewall/Security group
  - Check: Review recent network security changes
  - Look for: Firewall rule changes, security group modifications
  - Interpretation: Security rule change may have blocked connections

Decision Point:
- If network issue identified → Resolution 5 (engage network/platform team)
- If network healthy → Escalate (Step 6)

### Step 6: Escalation

If investigation hasn't identified root cause:

Escalation Path:
1. Senior on-call engineer: Page via PagerDuty "PaymentAPI Database Connections"
2. Database team: #database-oncall Slack channel with @oncall tag
3. Platform team (for network/Kubernetes issues): #platform-oncall Slack channel

Information to provide when escalating:
- Timeline: "Database connection errors started at [timestamp]"
- Symptoms: "[N] errors per minute, HTTP 503 responses, [specific error messages from logs]"
- Investigation completed: "Completed steps 1-5 of database connection failure runbook"
- Findings:
  - PaymentAPI pod health: [State]
  - Connection pool state: [Active/Max connections]
  - Database availability: [Result of pg_isready]
  - Database connections: [Current/Max]
  - Network connectivity: [Result]
- Current state: "Issue [getting worse/stable/improving]"
- Impact: "~[N] payment requests per minute failing"

---

## Resolution Procedures

### Resolution 1: Connection Pool Exhausted (PaymentAPI side)

When to use: Investigation found connection pool active = max, database healthy

Prerequisites:
□ Access to modify PaymentAPI configuration
□ Approval to restart pods (brief service interruption per pod)

Procedure:

Step 1: Verify connection pool configuration
Command: kubectl get configmap payment-api-config -n payment-api -o yaml | grep -i "connection\|pool"
Expected result: See current connection pool size (e.g., maxPoolSize: 50)
Verification: Compare to design: memory-bank/systemPatterns.md#connection-management (documents intended size)

Step 2: Determine if pool size increase appropriate
Analysis:
- Current traffic: [requests per second from metrics]
- Connection requirements: [Calculate based on traffic * avg request duration * DB call percentage]
- Database capacity: [Check with database team—can database handle more connections?]
Decision:
- If calculated need < current pool size: Issue is connection leak, proceed to Step 4 (restart)
- If calculated need > current pool size: Increase pool size (Step 3)

Step 3: Increase connection pool size (temporary mitigation)
Command: kubectl set env deployment/payment-api -n payment-api DB_CONNECTION_POOL_SIZE=75
  (increases from 50 to 75—adjust as needed)
Expected result: Deployment triggers rolling restart
Verification: kubectl rollout status deployment/payment-api -n payment-api
Monitoring: Watch "Database Connection Errors" metric—should drop to zero
Rollback: kubectl set env deployment/payment-api -n payment-api DB_CONNECTION_POOL_SIZE=50
Note: This is temporary mitigation. Update configuration in code/config repo and investigate root cause (why pool exhausted).

Step 4: Restart pods (if connection leak suspected)
Command: kubectl rollout restart deployment/payment-api -n payment-api
Expected result: Pods restart, connection pool reset
Verification: kubectl rollout status deployment/payment-api -n payment-api
Monitoring: Watch "Connection Pool Active" metric—should return to normal range
Rollback: Not needed (restart is safe operation)
Note: If connections exhaust again quickly, connection leak confirmed—requires code investigation.

Step 5: Verify Resolution
□ Database connection errors: Dropped to zero
□ HTTP 503 error rate: Dropped to <1%
□ Connection pool utilization: <80% of max
□ Payment processing: Successful payments resumed
□ Monitor: 30 minutes to confirm stability

Success Criteria:
□ No database connection errors for 30 minutes
□ Error rate <1%
□ Connection pool utilization stable <80%

If resolution unsuccessful: Revert changes (if config changed), escalate to database team

### Resolution 2: Database Near Connection Limit

When to use: Investigation found database using >90% of max_connections

Prerequisites:
□ Coordination with database team
□ Understanding of database connection capacity

Procedure:

Step 1: Confirm database connection limit
Command: psql -h <database_host> -U <user> -c "SHOW max_connections;"
Expected result: See max_connections setting (e.g., 100)
Verification: Compare to current active connections from Step 4 check

Step 2: Option A - Temporarily reduce PaymentAPI connection pool
When: Database cannot increase max_connections immediately
Command: kubectl set env deployment/payment-api -n payment-api DB_CONNECTION_POOL_SIZE=30
  (reduce from 50 to 30 to give database breathing room)
Expected result: Fewer connections from PaymentAPI
Verification: Check database active connections after 2 minutes—should decrease
Monitoring: Watch PaymentAPI metrics—ensure reducing pool doesn't cause internal queueing
Rollback: kubectl set env deployment/payment-api -n payment-api DB_CONNECTION_POOL_SIZE=50
Note: This may degrade PaymentAPI throughput. Coordinate with database team for permanent fix.

Step 2: Option B - Database team increases max_connections
When: Database can safely increase max_connections (more capacity available)
Action: Coordinate with database team (#database-oncall)
Request: "Increase max_connections to [N] to accommodate PaymentAPI load"
Expected: Database team assesses and increases limit if safe
Verification: Recheck max_connections after change applied
Note: Requires database team action, not directly controllable by PaymentAPI on-call

Step 3: Verify Resolution
□ Database connection errors: Dropped to zero
□ Database active connections: <80% of max_connections
□ PaymentAPI throughput: Maintained (if pool reduced, watch for queueing)
□ Monitor: 30 minutes

Success Criteria:
□ No database connection errors for 30 minutes
□ Database connections stable <80% of max

If resolution unsuccessful: Coordinate with database team for capacity increase or investigate connection leak

### Resolution 3: Database Unavailable

When to use: Investigation found database not accepting connections

Prerequisites:
□ Coordination with database team

Procedure:

Step 1: Engage database team immediately
Action: Post in #database-oncall Slack: "@oncall PaymentAPI cannot connect to database <database_host>. pg_isready returns [result]. SEV-1 impact: Payment processing down."
Expected: Database team responds within 5 minutes (per their SLA)

Step 2: Gather information for database team
Provide:
- Database host: <database_host>
- Error messages: [From kubectl logs]
- When started: [Timestamp]
- Recent changes: [Any database maintenance from Step 2]
- Impact: "PaymentAPI completely offline, ~[N] payments per minute failing"

Step 3: Monitor database recovery
- Database team will investigate and resolve database-side issue
- Continue monitoring PaymentAPI connection errors
- When database recovers, PaymentAPI health checks should start passing automatically

Step 4: Verify Resolution
□ Database accepting connections: pg_isready succeeds
□ PaymentAPI readiness checks: Pods marked ready
□ Database connection errors: Dropped to zero
□ Payment processing: Resumed
□ Monitor: 30 minutes

Success Criteria:
□ Database available and stable for 30 minutes
□ PaymentAPI error rate <1%

Note: Root cause is database-side. Coordinate with database team on post-mortem.

### Resolution 4: Database Slow (High Query Latency)

When to use: Investigation found database available but query latency >2x normal

Prerequisites:
□ Access to database slow query log
□ Coordination with database team if needed

Procedure:

Step 1: Identify slow queries
Command: Check database monitoring dashboard for slowest queries [link]
Look for: Queries taking >1s (normally <100ms)
Analysis: Are slow queries from PaymentAPI recognizable?

Step 2: Option A - Temporary mitigation (increase timeouts)
When: Database experiencing temporary load, expected to recover
Command: kubectl set env deployment/payment-api -n payment-api DB_QUERY_TIMEOUT=10s
  (increase from 5s to 10s—gives database more time)
Expected result: Fewer timeout errors
Risk: Threads wait longer, possible resource exhaustion if database doesn't recover
Monitoring: Watch connection pool utilization and thread pool utilization
Rollback: kubectl set env deployment/payment-api -n payment-api DB_QUERY_TIMEOUT=5s
Note: This is temporary. If database remains slow, proceed to Step 3.

Step 3: Engage database team for query optimization
Action: Post in #database-oncall Slack: "@oncall PaymentAPI queries experiencing high latency. Queries [list slowest queries] taking >2s (normally <100ms). Need query optimization or index review."
Provide: Slow query log excerpt, query text, table names
Expected: Database team investigates query plans, missing indexes, table stats

Step 4: Verify Resolution
□ Query latency: Returned to <100ms p95
□ Database connection errors: Zero
□ Connection pool utilization: Normal range
□ Monitor: 30 minutes

Success Criteria:
□ Query latency p95 <100ms for 30 minutes
□ No connection errors

If resolution unsuccessful: Escalate to architect for query design review

### Resolution 5: Network Issue

When to use: Investigation found network connectivity failure

Prerequisites:
□ Coordination with platform/network team

Procedure:

Step 1: Engage platform team
Action: Post in #platform-oncall Slack: "@oncall PaymentAPI cannot reach database <database_host>. Network connectivity failed: [ping/nslookup results]. SEV-1 impact."
Expected: Platform team responds within 5 minutes

Step 2: Provide network diagnostics
Share:
- Source: PaymentAPI pods (namespace payment-api)
- Destination: <database_host> (IP: <database_ip>, port 5432)
- Symptom: Ping fails, connection timeout, DNS not resolving
- Recent changes: [Any network/security changes from Step 2]

Step 3: Monitor network restoration
- Platform team will investigate firewall rules, security groups, DNS, network routing
- Continue monitoring PaymentAPI connection attempts

Step 4: Verify Resolution
□ Network connectivity: Ping succeeds
□ DNS resolution: nslookup returns IP
□ Database connectivity: pg_isready succeeds
□ PaymentAPI: Connection errors dropped to zero
□ Monitor: 30 minutes

Success Criteria:
□ Network stable for 30 minutes
□ PaymentAPI error rate <1%

Note: Root cause is network/platform-side. Coordinate with platform team on post-mortem.

---

## Post-Resolution Steps

### Step 1: Verify Full Resolution

□ Database connection errors: Zero for 30 minutes (metric: database_connection_errors_total)
□ HTTP 5xx error rate: <1% for 30 minutes (metric: http_requests_total{status="5xx"})
□ Connection pool utilization: <80% and stable (metric: hikaricp.connections.active)
□ Payment processing success rate: >99% (metric: payments_processed_total{status="success"})
□ Database query latency: <100ms p95 (metric: database_query_duration_seconds)

### Step 2: Document Findings

□ Create incident report: memory-bank/operations/incidents/2026-XX-XX-database-connection-failure.md
  - Use template: memory-bank/operations/incidents/incident-template.md
  - Timeline: When started, investigation steps, resolution applied, when resolved
  - Root cause: [Specific cause identified]
  - Resolution: [Specific actions taken]
  - Impact: [Number of failed requests, duration]
  - Lessons learned: [What could be improved]

□ Update this runbook if gaps found:
  - Did investigation steps lead to root cause? [If no, add missing steps]
  - Did resolution procedure work? [If no, update procedure]
  - Should new resolution be added? [If novel solution found]

### Step 3: Communicate

□ Notify stakeholders:
  - Post in #payments-team Slack: "Database connection issue resolved. Root cause: [cause]. Impact: [duration], [failed requests]. Resolution: [actions]. Monitoring for recurrence."
  - If customer-facing impact: Update status page

### Step 4: Follow-Up Actions

Create tickets for preventive measures:

□ If connection pool exhausted:
  - Ticket: Review connection pool sizing calculation (memory-bank/systemPatterns.md#connection-management)
  - Ticket: Add alert for connection pool utilization >70% (early warning)
  - Ticket: Investigate if connection leak exists (connections not released)

□ If database near connection limit:
  - Ticket: Coordinate with database team on increasing max_connections
  - Ticket: Review if PaymentAPI connection pool size can be reduced safely

□ If database unavailable:
  - Ticket: Database team post-mortem (why unavailable, prevention)
  - Ticket: Review PaymentAPI graceful degradation (could we have degraded instead of failed?)

□ If database slow:
  - Ticket: Query optimization (specific queries identified)
  - Ticket: Database team review indexes, query plans
  - Ticket: Consider read replica for specific query types

□ If network issue:
  - Ticket: Platform team post-mortem (why network failed, prevention)
  - Ticket: Review network monitoring (could we detect this sooner?)

□ Schedule post-mortem (SEV-1 requires post-mortem within 24 hours):
  - Include: On-call responders, database team (if involved), platform team (if involved)
  - Focus: Systemic improvements (not blame)

### Step 5: Cross-Reference Updates

□ Link incident to design documentation:
  - memory-bank/systemPatterns.md#database-layer: Add cross-reference to incident if design assumption revealed incorrect
  - memory-bank/systemPatterns.md#connection-management: Add cross-reference if connection pool sizing needs revision

□ Update operational dependencies:
  - memory-bank/operations/dependencies/operational-dependencies.md#database: Add incident as example of dependency failure

□ Update cross-references:
  - This runbook: Add incident to "Recent Incidents" section
  - Incident report: Reference this runbook as resolution guide used

---

## Maintenance

Runbook Currency:
Review Frequency: Monthly (critical runbook)
Last Reviewed: 2026-01-16
Next Review: 2026-02-16

Review Checklist:
□ Commands still accurate: kubectl commands, psql commands
□ Metrics/dashboard links still valid
□ Contact information current: #database-oncall, #platform-oncall
□ Recent incidents validate runbook: 2026-01-15 incident used this runbook, connection pool exhaustion resolution worked
□ Cross-references valid: Links to memory-bank/ still correct
□ Severity assessment accurate: Still SEV-1 (payment processing critical)
□ Time estimate realistic: 15-30 minutes was accurate for 2026-01-15 incident

Update Triggers:
- After each database connection failure incident (incorporate lessons)
- After database upgrade or migration (verify commands still work)
- After PaymentAPI architecture changes (new connection pool library, etc.)
- After monitoring tool changes (new dashboard links)
- When investigation steps don't lead to resolution

Version History:
2026-01-16: Updated after 2026-01-15 incident (added connection pool exhaustion resolution, improved investigation steps)
2025-12-10: Initial creation
```

Why this works:
- Systematic investigation path (don't skip steps)
- Specific commands with expected output (not vague)
- Decision points guide investigation (if X then Y, else Z)
- Multiple resolution procedures (different root causes)
- Rollback procedures for every action (safety)
- Success criteria explicit (know when resolved)
- Cross-references to architecture (connect operations to design)
- Post-resolution documentation (continuous learning)
- Maintenance section (keep runbook current)

</examples>
