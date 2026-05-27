---
# === Identity ===
id: write-incident-postmortem
name: Write incident postmortems that transform incidents into institutional learning
version: v1

# === Classification ===
chapter: 7
category: operations
subcategory: incident
tags:
  - operations
  - incident-response
  - postmortem
  - root-cause-analysis
  - lessons-learned
  - systemic-improvements
  - blameless-culture
  - operational-knowledge
  - incident-prevention
  - organizational-learning
  - remediation
  - action-items

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Write incident postmortems that transform incidents into institutional learning.
    Document incident timeline with decision points, capture hypotheses explored, record remediation options and rationale, analyze root cause vs contributing factors, identify systemic improvements, link to affected systems, create organizational learning.
  argument-hint: "[incident_id] [system_name] [severity] [postmortem_location]"
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
    description: The system or service that experienced the incident
    example: "PaymentAPI"
    maps-to: "$1"
  - name: severity
    description: Incident severity level
    example: "SEV-1 (Critical outage)"
    maps-to: "$2"
  - name: postmortem_location
    description: Where to document this postmortem
    example: "operations-memory-bank/postmortems/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    chapter: 7
    description: |
      **Write incident postmortem transforming incidents into institutional learning** by documenting timeline with key decision points, capturing hypotheses explored (successful and failed), recording remediation options considered and rationale, analyzing root cause and contributing factors, identifying systemic improvements (not just immediate fixes), linking to affected system constellations.
    preview: |
      "...Root Cause Analysis: Immediate Cause → Contributing Factors → Root Cause [Design assumption violated] / Causal Chain [Root cause → Enabled → Immediate cause → Effects → Symptoms] / Prevention: Immediate Short-term Medium-term Long-term Strategic [Addresses root cause] / REMEMBER: The goal is not to prevent this exact incident—it's to make the system more resilient against entire classes of failures..."
  website:
    include: true
    path: /prompts/write-incident-postmortem
  marketplace:
    plugin: constellize:deliver

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Write incident postmortem for {{incident_id}} affecting {{system_name}} by documenting incident timeline with key decision points, capturing hypotheses explored (successful and failed), recording remediation options considered and rationale, analyzing root cause and contributing factors, identifying systemic improvements (not just immediate fixes), linking postmortem to affected system constellations, transforming incident into institutional learning.
</task>

<context>
Incident: {{incident_id}}
System: {{system_name}}
Severity: {{severity}}
Documentation Location: {{postmortem_location}}

Postmortems transform incidents from isolated failures into organizational learning. Effective postmortems go beyond root cause analysis to identify systemic improvements, examining not just what failed but why systems allowed failure, what made detection/resolution slow, and how to prevent entire classes of similar incidents.

Postmortems differ from incident investigation documentation:
- Investigation captures real-time troubleshooting (hypotheses, commands, uncertainty)
- Postmortems synthesize learnings after resolution (patterns, improvements, prevention)

Both are valuable and complementary.
</context>

<thinking>
Before writing postmortem:
1. What was the root cause and contributing factors?
2. What worked well during incident response?
3. What slowed detection or resolution?
4. What systemic improvements would prevent recurrence?
5. What assumptions were violated?
6. What knowledge gaps were exposed?
7. What patterns apply beyond this specific incident?
</thinking>

<output-format>

## Postmortem Header Pattern

```
# Incident Postmortem: {{incident_id}}

Incident ID: {{incident_id}}
System: {{system_name}}
Severity: {{severity}}
Incident Date: [YYYY-MM-DD]
Postmortem Date: [YYYY-MM-DD]
Postmortem Participants: [Names/teams involved]
Postmortem Facilitator: [Who led postmortem discussion]

## Executive Summary

One paragraph summarizing: what failed, impact, root cause, immediate fix, systemic improvements.

What failed: [Brief description of failure]
Impact: [User/business impact]
Root cause: [Underlying cause]
Immediate resolution: [How incident was resolved]
Duration: [Detection to resolution]
Systemic improvements: [Key preventive measures identified]

## Metadata

Impact severity: {{severity}}
User impact: [Number of users affected, % of traffic, geographic scope]
Duration: [Start time → Detection time → Resolution time → Total duration]
Time to detect: [How long from failure start to detection]
Time to resolve: [How long from detection to resolution]
Business impact: [Revenue loss, SLA breach, customer complaints, regulatory implications]
Related systems: [Other systems affected or involved]

## Related Documentation

- Incident investigation: [Link to real-time investigation documentation if exists]
- Runbook used: [Link to runbook that guided response]
- System architecture: [Link to memory-bank/systemPatterns.md relevant section]
- Design decisions: [Link to design documentation]
- Similar past incidents: [Links to related postmortems]
```

---

## Timeline Pattern

```
## Incident Timeline

Document key events with timestamps, focusing on decision points and state changes.

### [YYYY-MM-DD HH:MM UTC] Failure Started (Undetected)

Event: [What actually failed, even if undetected]
State: System began failing
Evidence: [How we know this was the start—logs, metrics, deployment timestamp]
User impact: [What users experienced, if any]
Detection: Not yet detected

Context:
- Preceding events: [What happened before that contributed]
- System state: [Relevant system state at this time]

---

### [YYYY-MM-DD HH:MM UTC] Failure Detected

Event: [How failure was detected—alert, user report, monitoring]
Detection method: [Specific alert, dashboard, report]
Detection lag: [Time from failure start to detection]

Initial assessment:
- Symptoms observed: [What responders saw]
- Severity assessment: [How severity was determined]
- Responders paged: [Who was notified, how]

Decision point: [What responders decided to do first]

---

### [YYYY-MM-DD HH:MM UTC] Investigation Started

Event: Investigation began
Responders: [Who was investigating]
Initial hypothesis: [First theory about cause]
Actions taken: [First investigation steps]

Resources consulted:
- Runbook: [Which runbook, if any]
- Past incidents: [Similar incidents referenced]
- Documentation: [Architecture docs consulted]

---

### [YYYY-MM-DD HH:MM UTC] Key Finding #1

Event: [Important discovery during investigation]
Finding: [What was discovered]
Impact on investigation: [How this changed understanding]

Hypothesis update: [How hypothesis evolved]
Decision point: [What responders decided to do next]

---

### [YYYY-MM-DD HH:MM UTC] Mitigation Attempted #1

Event: [First mitigation action]
Action: [Specific action taken]
Rationale: [Why responders chose this action]
Expected outcome: [What responders expected to happen]

Result: [What actually happened]
Effectiveness: [Successful / Partially successful / Unsuccessful]

If unsuccessful:
- Why it didn't work: [Analysis]
- Next action: [What responders tried next]

---

### [YYYY-MM-DD HH:MM UTC] Root Cause Identified

Event: Root cause determined
Root cause: [Underlying cause]
Evidence: [What confirmed this was the cause]

Causal chain understood:
1. [Root cause]
2. [Immediate effect]
3. [Cascading effects]
4. [Observable symptoms]

Decision point: [How to resolve based on root cause]

---

### [YYYY-MM-DD HH:MM UTC] Resolution Applied

Event: Resolution action taken
Action: [Specific resolution steps]
Rationale: [Why this approach chosen]

Alternative approaches considered:
- Alternative 1: [Other option considered]
  - Why not chosen: [Rationale]
- Alternative 2: [Another option]
  - Why not chosen: [Rationale]

Resolution execution:
- Steps taken: [Detailed actions]
- Verification: [How responders confirmed it worked]

---

### [YYYY-MM-DD HH:MM UTC] Incident Resolved

Event: Incident declared resolved
Resolution confirmed by:
- Symptom clearance: [All symptoms gone]
- Metrics normalized: [Specific metrics returned to baseline]
- Sustained stability: [Monitored for X minutes]

Total duration: [Start to resolution]
- Time to detect: [Start to detection]
- Time to diagnose: [Detection to root cause]
- Time to resolve: [Root cause to resolution]

Post-resolution actions:
- Monitoring: [Extended monitoring plan]
- Communication: [Stakeholder notification]
- Documentation: [Incident report filed]

---

### [YYYY-MM-DD HH:MM UTC] Postmortem Scheduled

Event: Postmortem meeting scheduled
Participants: [Who will attend]
Focus: [Key questions to answer]
```

---

## Root Cause Analysis Pattern

```
## Root Cause Analysis

### Immediate Cause

What directly caused the failure:
[Clear statement of proximate cause]

Evidence:
- [Supporting fact 1]
- [Supporting fact 2]
- [Supporting fact 3]

How immediate cause led to symptoms:
[Causal chain from immediate cause to observable failure]

---

### Contributing Factors

What made the incident possible or worse:

#### Contributing Factor 1: [Factor name]

Factor: [Description of contributing condition]
How it contributed: [Relationship to incident]
Preventability: [Could this factor have been prevented?]

Example: If immediate cause was "database connection leak in code," contributing factor might be "code review didn't catch resource management issue"

---

#### Contributing Factor 2: [Factor name]

[Same structure]

---

### Root Cause

Why the system allowed this failure:
[Underlying systemic cause]

This is deeper than immediate cause—it answers "why was this failure possible?"

Analysis:
- Design assumption violated: [What did we assume that wasn't true?]
- Process gap: [What process should have prevented this?]
- Systemic condition: [What organizational/technical condition enabled this?]

Why root cause matters:
Fixing immediate cause prevents this specific incident from recurring. Addressing root cause prevents entire classes of similar incidents.

---

### Causal Chain

Complete chain from root cause → observable failure:

1. **Root cause**: [Systemic issue]
   ↓
2. **Enabled**: [How root cause enabled immediate cause]
   ↓
3. **Immediate cause**: [Proximate cause of failure]
   ↓
4. **Direct effect**: [First consequence]
   ↓
5. **Cascading effects**: [Subsequent consequences]
   ↓
6. **Observable symptoms**: [What users/monitors saw]

---

### What Worked (Protective Factors)

What prevented incident from being worse:

Protective factor 1: [What helped]
- How it helped: [Specific benefit]
- Example: "Automatic rollback prevented prolonged outage"

Protective factor 2: [What helped]
- How it helped: [Specific benefit]

Preserve these: These factors should be maintained and expanded.

---

### What Failed (Vulnerability Factors)

What made incident worse than necessary:

Vulnerability factor 1: [What failed to protect us]
- How it hurt: [Specific harm]
- Example: "Lack of alert on connection leak warnings delayed detection by 5 minutes"

Vulnerability factor 2: [What failed to protect us]
- How it hurt: [Specific harm]

Address these: These factors should be eliminated or mitigated.
```

---

## Response Evaluation Pattern

```
## Incident Response Evaluation

### What Went Well

Aspects of incident response that were effective:

#### Detection

Detection method: [How incident was detected]
Detection time: [How quickly detected after failure started]
Effectiveness: [Good / Could be faster]

What worked:
- [Positive aspect 1]
- [Positive aspect 2]

Example: "Alert fired within 1 minute of error threshold, PagerDuty escalation worked as designed"

---

#### Investigation

Investigation approach: [Systematic / Ad-hoc / Guided by runbook]
Time to root cause: [How long from detection to diagnosis]
Effectiveness: [Efficient / Slow / Moderate]

What worked:
- [Positive aspect 1—e.g., "Runbook guided investigation systematically"]
- [Positive aspect 2—e.g., "Past incident documentation provided resolution approach"]

---

#### Resolution

Resolution approach: [What was done]
Time to resolve: [How long from diagnosis to resolution]
Effectiveness: [Quick / Slow / Moderate]

What worked:
- [Positive aspect 1]
- [Positive aspect 2]

---

#### Communication

Communication during incident: [How stakeholders were informed]
Effectiveness: [Clear / Confusing / Timely / Delayed]

What worked:
- [Positive aspect 1]
- [Positive aspect 2]

---

### What Could Be Improved

Aspects of incident response that slowed resolution:

#### Detection Gaps

Gap: [What delayed detection]
Impact: [How much time lost]
Improvement: [How to detect faster]

Example: "Connection leak warnings logged but not alerted. Caused 5-minute detection delay. Add alert on leak warnings."

---

#### Investigation Inefficiencies

Inefficiency: [What slowed investigation]
Impact: [How much time lost]
Improvement: [How to investigate faster]

Example: "Had to manually correlate deployment timing with incident. Took 3 minutes. Add deployment markers to dashboards."

---

#### Resolution Delays

Delay: [What slowed resolution]
Impact: [How much time lost]
Improvement: [How to resolve faster]

Example: "Rollback required manual kubectl command. Took 2 minutes to find correct revision. Create one-click rollback script."

---

#### Communication Gaps

Gap: [What communication was missing or unclear]
Impact: [Consequence of communication gap]
Improvement: [How to communicate better]

Example: "Didn't notify dependent team (Checkout) that PaymentAPI was failing. They paged separately. Create automatic dependent service notification."

---

### Response Timeline Analysis

Total incident duration: [X minutes]

Breakdown:
- Detection lag: [X minutes] ([Y%] of total)
- Investigation time: [X minutes] ([Y%] of total)
- Resolution time: [X minutes] ([Y%] of total)
- Verification time: [X minutes] ([Y%] of total)

Optimization opportunities:
Priority 1 (biggest time savings): [Which phase to optimize]
Priority 2: [Next phase to optimize]

Target for similar future incidents: [X minutes total]
```

---

## Prevention and Remediation Pattern

```
## Prevention and Remediation

### Immediate Actions (Already Completed)

Actions taken during/immediately after incident:

Action 1: [What was done]
- Purpose: [Why]
- Status: ✓ Completed [Date]
- Effectiveness: [Prevents immediate recurrence]

Example: "Rolled back deployment to remove connection leak bug. ✓ Completed 2026-01-15. Prevents this specific leak from recurring."

---

### Short-term Remediation (Within 1 week)

Actions to prevent immediate recurrence and address obvious gaps:

#### Remediation 1: [Action name]

Action: [What to do]
Purpose: [Why—what this prevents]
Owner: [Who is responsible]
Due date: [When to complete]
Tracking: [Ticket/issue number]

Success criteria: [How to verify this worked]

Example:
"Add alert on HikariCP connection leak warnings
Purpose: Detect connection leaks before pool exhaustion (would have saved 5 minutes)
Owner: Platform team
Due date: 2026-01-22
Tracking: INFRA-2341
Success criteria: Alert fires when leak warning logged, pages on-call"

---

#### Remediation 2: [Action name]

[Same structure]

---

### Medium-term Improvements (Within 1 month)

Actions to address contributing factors and systemic gaps:

#### Improvement 1: [Action name]

Action: [What to do]
Purpose: [Why—what this prevents]
Owner: [Who is responsible]
Due date: [When to complete]
Tracking: [Ticket/issue number]

Impact: [How this reduces risk]
Effort: [Estimated effort]
Priority: [High / Medium / Low]

Example:
"Add code review checklist enforcing try-with-resources pattern
Purpose: Prevent similar resource management bugs from passing review
Owner: Engineering manager
Due date: 2026-02-15
Tracking: DEV-4523
Impact: Prevents entire class of resource leak bugs
Effort: 1 day (create checklist, train team)
Priority: High"

---

#### Improvement 2: [Action name]

[Same structure]

---

### Long-term Strategic Improvements (Within 1 quarter)

Actions addressing root causes and systemic vulnerabilities:

#### Strategic Improvement 1: [Action name]

Action: [What to do]
Purpose: [Why—what class of incidents this prevents]
Owner: [Who is responsible]
Due date: [When to complete]
Tracking: [Ticket/issue number]

Impact: [Broad impact on system resilience]
Effort: [Estimated effort]
Priority: [High / Medium / Low]

Rationale: [Why this addresses root cause]

Example:
"Implement automated static analysis for resource management
Purpose: Catch resource leaks in CI before code review (prevents human error)
Owner: Platform team
Due date: 2026-03-31
Tracking: INFRA-2350
Impact: Prevents resource management bugs from reaching production
Effort: 2 weeks (research tools, configure, integrate CI)
Priority: High
Rationale: Addresses root cause (code review process gap) with automated enforcement"

---

#### Strategic Improvement 2: [Action name]

[Same structure]

---

### Risk Acceptance

Risks we're accepting (not fixing):

#### Accepted Risk 1: [Risk name]

Risk: [What we're not fixing]
Rationale: [Why we're accepting this risk]
Mitigation: [How we'll monitor/handle if occurs]

Example:
"Connection pool size remains fixed (not auto-scaling)
Rationale: Auto-scaling connection pool adds complexity, fixed pool adequate for current/projected load
Mitigation: Monitor pool utilization, alert at 70%, manual intervention if needed"

---

### Action Item Summary

Total action items: [N]
- Immediate (completed): [N]
- Short-term (1 week): [N]
- Medium-term (1 month): [N]
- Long-term (1 quarter): [N]

Priority breakdown:
- High priority: [N items]
- Medium priority: [N items]
- Low priority: [N items]

Review schedule:
- 1 week: Review short-term remediation completion
- 1 month: Review medium-term improvements
- 1 quarter: Review long-term strategic improvements
```

---

## Lessons Learned Pattern

```
## Lessons Learned

### Technical Lessons

Lesson 1: [Technical insight]
- What we learned: [Specific knowledge gained]
- How it changes our understanding: [Impact on mental models]
- Application: [Where else this applies]

Example:
"Connection pool exhaustion can occur at normal traffic if queries are slow
What we learned: Pool sizing must account for query latency, not just request rate
How it changes understanding: Pool size = (requests/sec × query latency), not just requests/sec
Application: Review all connection pool sizing calculations across all services"

---

Lesson 2: [Technical insight]

[Same structure]

---

### Operational Lessons

Lesson 1: [Operational insight]
- What we learned: [Specific knowledge gained]
- How it improves incident response: [Impact on future incidents]
- Application: [Where else this applies]

Example:
"Database connection failure runbook was highly effective
What we learned: Systematic investigation procedures reduce time to diagnosis
How it improves response: Future similar incidents will follow same efficient path
Application: Create runbooks for other common failure modes"

---

Lesson 2: [Operational insight]

[Same structure]

---

### Organizational Lessons

Lesson 1: [Organizational insight]
- What we learned: [Specific knowledge gained]
- How it affects processes: [Impact on how we work]
- Application: [Changes to implement]

Example:
"Code review didn't catch resource management bug
What we learned: Human code review alone is insufficient for complex bug classes
How it affects processes: Automated checks required for critical patterns
Application: Implement static analysis for resource management, error handling, security"

---

Lesson 2: [Organizational insight]

[Same structure]

---

### Assumptions Challenged

Assumption 1: [What we assumed]
- We assumed: [Belief we held]
- Reality: [What incident revealed]
- Impact: [How this changes approach]

Example:
"We assumed all engineers follow try-with-resources pattern
Reality: Pattern not consistently followed, no enforcement
Impact: Document patterns and enforce via automation, not just convention"

---

Assumption 2: [What we assumed]

[Same structure]

---

### Knowledge Gaps Identified

Gap 1: [Missing knowledge]
- What was missing: [Specific knowledge gap]
- How it affected incident: [Impact during incident]
- How to fill gap: [Documentation to create]

Example:
"No alert on connection leak warnings
What was missing: Awareness that HikariCP logs leak warnings before pool exhausted
How it affected incident: Delayed detection by 5 minutes
How to fill gap: Document HikariCP monitoring best practices, implement alerts"

---

Gap 2: [Missing knowledge]

[Same structure]
```

---

## Cross-Reference Updates Pattern

```
## Cross-Reference Updates

Based on postmortem, these documents need updates:

### Update 1: System Architecture

**File**: memory-bank/systemPatterns.md#connection-management

**Current state**: Documents connection pool configuration and sizing formula

**Update needed**: Add enforcement mechanisms and lessons from incident
```markdown
Connection Management:
[Existing content...]

Enforcement:
- All database connections MUST use try-with-resources (Java) or equivalent RAII pattern
- Code review checklist includes resource management verification
- Static analysis configured to flag manual resource management
- See postmortem: 2026-01-15-database-connection-pool for incident caused by violation

Monitoring:
- Alert on connection leak warnings (pool-specific mechanism)
- Alert on pool utilization >70% (early warning)
- Dashboard shows pool utilization trends

Related incidents:
- 2026-01-15-database-connection-pool: Connection leak caused SEV-1 outage, 24-minute duration
```

**Ticket**: DOC-1234 "Update systemPatterns.md with connection management lessons"

---

### Update 2: Operational Dependencies

**File**: memory-bank/operations/dependencies/operational-dependencies.md

**Update needed**: Add application-side failure mode for database dependency
```markdown
## PostgreSQL Database

[Existing content...]

Failure modes:
[Existing failure modes...]

3. Application-side connection pool exhaustion
   - Symptom: "timeout obtaining connection" errors, but database itself healthy
   - Cause: Connection leak, queries slower than expected, pool undersized
   - Detection: Connection pool utilization metrics, leak warnings in logs
   - Investigation: Check pool active/max, check query latency, check for leak warnings
   - Mitigation: Fix leak (restart), increase pool temporarily (if query latency issue), optimize queries
   - Related incident: 2026-01-15-database-connection-pool (connection leak in code)
```

**Ticket**: DOC-1235 "Update operational-dependencies.md with app-side pool failure mode"

---

### Update 3: Runbook Validation

**File**: memory-bank/operations/runbooks/database-connection-failure.md

**Update needed**: Add success story and timing benchmark
```markdown
Recent Incidents Using This Runbook:
- 2026-01-15-database-connection-pool: Successfully guided investigation to root cause in 17 minutes
  - Runbook effectiveness: Investigation steps 1-4 led directly to diagnosis
  - Resolution approach: Rollback deployment (Resolution 1)
  - Time benchmark: Total incident duration 24 minutes (detection to resolution)
  - Gaps identified: None—runbook worked as designed
```

**Ticket**: DOC-1236 "Update database-connection-failure runbook with incident reference"

---

### Update 4: Performance Baselines

**File**: memory-bank/operations/performance/baseline-metrics.md

**Update needed**: Add connection pool utilization baseline (validated by incident)

Already updated during incident. No further action needed.

---

### New Document: Code Review Checklist

**File**: NEW - engineering-practices/code-review-checklist.md

**Content needed**: Checklist including resource management verification
```markdown
# Code Review Checklist

## Resource Management
□ Database connections use try-with-resources or equivalent RAII pattern
  - No manual connection.close() in finally blocks
  - No early returns bypassing cleanup
  - Related incident: 2026-01-15-database-connection-pool
□ File handles properly closed
□ Network connections properly closed
□ Thread pools properly shut down

[Other checklist items...]
```

**Ticket**: DEV-4523 "Create code review checklist"

---

### Cross-Reference Summary

Documents to update: 4
- memory-bank/systemPatterns.md (architecture lessons)
- memory-bank/operations/dependencies/operational-dependencies.md (dependency behavior)
- memory-bank/operations/runbooks/database-connection-failure.md (runbook validation)
- engineering-practices/code-review-checklist.md (NEW—process improvement)

All updates link to this postmortem: 2026-01-15-database-connection-pool
```

---

## Appendices Pattern

```
## Appendix A: Detailed Timeline

[Link to incident investigation documentation if exists—much more detailed than postmortem timeline]

Link: memory-bank/operations/incidents/2026-01-15-database-connection-pool.md

---

## Appendix B: Metrics and Dashboards

Relevant metrics during incident:

**Connection Pool Utilization**:
- Normal: 5-12 active connections (10-24% of max)
- During incident: 50 active connections (100% of max)
- Dashboard: [Link to Grafana dashboard]

**HTTP Error Rate**:
- Normal: <1% (5xx errors)
- During incident: 98% (503 errors)
- Dashboard: [Link to Grafana dashboard]

**Database Query Latency**:
- Normal: 8-12ms p95
- During incident: Unable to complete (5s timeout)
- Dashboard: [Link to database monitoring]

---

## Appendix C: Communication Log

Communication during incident:

14:23 UTC: PagerDuty page sent to on-call (alex-chen)
14:24 UTC: Alex acknowledged page, joined incident Slack channel #incident-2026-01-15
14:25 UTC: Status page updated: "Investigating payment processing issues"
14:35 UTC: Jordan-williams joined incident as secondary responder
14:40 UTC: Root cause identified, posted to Slack channel
14:42 UTC: Resolution applied (rollback), posted to Slack
14:47 UTC: Incident resolved, status page updated: "Payment processing restored"
14:50 UTC: Post-incident summary posted to #payments-team

---

## Appendix D: Action Item Tracking

| Action | Owner | Due Date | Status | Ticket |
|--------|-------|----------|--------|--------|
| Fix connection leak in code | Dev team | 2026-01-16 | ✓ Done | DEV-4520 |
| Add alert on connection leak warnings | Platform | 2026-01-22 | In Progress | INFRA-2341 |
| Add deployment markers to dashboards | Platform | 2026-01-22 | In Progress | INFRA-2342 |
| Create code review checklist | Eng Mgr | 2026-02-15 | Not Started | DEV-4523 |
| Implement static analysis for resource mgmt | Platform | 2026-03-31 | Not Started | INFRA-2350 |

---

## Appendix E: References

Related documentation:
- System architecture: memory-bank/systemPatterns.md#connection-management
- Database dependency: memory-bank/operations/dependencies/operational-dependencies.md#database
- Incident investigation: memory-bank/operations/incidents/2026-01-15-database-connection-pool.md
- Runbook used: memory-bank/operations/runbooks/database-connection-failure.md

Related past incidents:
- None—first incident of this type

Follow-up postmortem review:
- Date: 2026-02-15 (1 month after incident)
- Purpose: Review action item completion, assess effectiveness of improvements
```

</output-format>

<instructions>
CRITICAL: Postmortems are learning opportunities, not blame sessions. Focus on systemic improvements, not individual failures. Create blameless culture by emphasizing what the system can do better.

DO NOT:
- Blame individuals (focus on system failures that allowed human error)
- Stop at immediate cause (dig deeper to root cause)
- Propose only tactical fixes (identify strategic improvements)
- Skip "what went well" (reinforce effective practices)
- Create action items without owners/dates (makes them aspirational, not actionable)
- Write postmortem without team input (facilitate collaborative discussion)

ALWAYS:
- Conduct postmortem within 24-48 hours (while memory fresh)
- Include all responders and relevant stakeholders (diverse perspectives)
- Document full timeline with decision points (not just facts)
- Distinguish immediate cause from root cause (different levels)
- Identify systemic improvements (prevent classes of incidents)
- Assign owners and due dates to all action items (accountability)
- Link postmortem to broader documentation (update knowledge base)
- Schedule follow-up review (verify improvements implemented)
- Focus on system gaps, not individual mistakes (blameless culture)

REMEMBER: The goal of postmortems is not to prevent this exact incident from recurring—it's to make the system more resilient against entire classes of failures and to improve incident response capabilities.
</instructions>

<examples>

## Example: Database Connection Pool Exhaustion Postmortem

```
# Incident Postmortem: 2026-01-15-database-connection-pool

Incident ID: 2026-01-15-database-connection-pool
System: PaymentAPI
Severity: SEV-1 (Critical outage—payment processing down)
Incident Date: 2026-01-15
Postmortem Date: 2026-01-16
Postmortem Participants: alex-chen (on-call), jordan-williams (secondary responder), morgan-lee (eng manager), casey-brown (architect), sam-patel (platform lead)
Postmortem Facilitator: morgan-lee

## Executive Summary

PaymentAPI experienced a critical outage on January 15, 2026, lasting 24 minutes and preventing all payment processing. Root cause was a connection leak bug introduced in a deployment 30 minutes before the incident. The bug caused database connections to not be released in error paths, exhausting the connection pool within 23 minutes. Immediate resolution was rolling back the deployment. Systemic improvements include adding alerts on connection leak warnings, implementing code review checklists for resource management, and configuring static analysis to catch resource management bugs before production.

What failed: PaymentAPI database connection pool exhausted due to connection leak in payment validation code
Impact: 100% of payment attempts failed for 24 minutes, ~$240K revenue loss, 99.9% SLA breach
Root cause: Code review process didn't enforce resource management patterns; no automated detection of resource leaks
Immediate resolution: Rolled back deployment to remove buggy code
Duration: 24 minutes (14:23 detection → 14:47 resolution)
Systemic improvements: Alert on leak warnings, code review checklist, static analysis for resource management

## Metadata

Impact severity: SEV-1 (Critical outage)
User impact: 100% of payment attempts failed (~500 requests/minute × 24 minutes = ~12,000 failed payments)
Duration:
- Failure started: 14:00 UTC (deployment with bug)
- Failure detected: 14:23 UTC (alert fired)
- Root cause identified: 14:40 UTC
- Resolution applied: 14:42 UTC
- Incident resolved: 14:47 UTC
- Total duration: 47 minutes (failure start to resolution)
- Detection lag: 23 minutes (failure start to detection)
- Resolution time: 24 minutes (detection to resolution)

Time to detect: 23 minutes
Time to resolve: 24 minutes
Business impact:
- Revenue loss: ~$240K (500 payments/min × $20 avg × 24 minutes)
- SLA breach: 99.9% SLA violated (99.96% actual for the day)
- Customer complaints: 47 support tickets filed
- Regulatory implications: None (no payment data lost, just availability issue)

Related systems:
- Affected: Checkout Service (depends on PaymentAPI, also failed)
- Involved: PostgreSQL Database (healthy throughout, not the issue)

## Related Documentation

- Incident investigation: memory-bank/operations/incidents/2026-01-15-database-connection-pool.md
- Runbook used: memory-bank/operations/runbooks/database-connection-failure.md
- System architecture: memory-bank/systemPatterns.md#connection-management
- Design decisions: memory-bank/systemPatterns.md#database-layer
- Similar past incidents: None (first connection pool incident)

---

## Incident Timeline

### 2026-01-15 14:00 UTC - Failure Started (Undetected)

Event: Deployment revision 48 deployed to production with connection leak bug
State: System began accumulating leaked connections
Evidence: kubectl rollout history shows revision 48 deployed at 14:00; git log shows commit a3f2d8e introduced leak
User impact: None initially (pool not exhausted yet)
Detection: Not yet detected

Context:
- Preceding events: Developer committed fix for payment validation logic (commit a3f2d8e), code review approved, CI passed, deployment automated
- System state: PaymentAPI healthy, 3 replicas running, connection pool 50 max connections, normal traffic ~450 req/s

Bug introduced:
```java
// PaymentValidator.java
public boolean validatePayment(Payment payment) {
    Connection conn = dataSource.getConnection();
    try {
        if (invalid) {
            return false;  // BUG: Early return doesn't close connection
        }
        return true;
    } finally {
        conn.close();  // Only closes on exception or success path, not early return
    }
}
```

---

### 2026-01-15 14:23 UTC - Failure Detected

Event: PagerDuty alert fired: "database_connection_errors > 5 in 1 minute"
Detection method: Automated alert based on connection error metric threshold
Detection lag: 23 minutes (14:00 deployment → 14:23 detection)

Why 23 minutes lag:
- Connection pool size: 50 connections
- Invalid payment rate: ~2 per minute (based on traffic analysis)
- Math: 50 connections / 2 leaks per minute ≈ 25 minutes to exhaust pool
- Alert threshold: 5 errors in 1 minute (triggered when pool saturated, requests started failing)

Initial assessment:
- Symptoms observed: High connection error rate (50/min), HTTP 503 error rate 98%
- Severity assessment: SEV-1 (payment processing completely down, immediate customer impact)
- Responders paged: alex-chen (on-call), auto-escalated to jordan-williams after 2 minutes

Decision point: Alex consulted database-connection-failure.md runbook and began systematic investigation

---

### 2026-01-15 14:25 UTC - Investigation Started

Event: Investigation began following runbook procedure
Responders: alex-chen (primary), jordan-williams (joined at 14:27)
Initial hypothesis: Database unavailable or unhealthy
Actions taken: Checked database availability (Step 1 of runbook)

Resources consulted:
- Runbook: memory-bank/operations/runbooks/database-connection-failure.md
- Past incidents: Searched for similar symptoms (found none initially)
- Documentation: memory-bank/systemPatterns.md#database-layer for architecture context

Result: Database healthy, accepting connections (hypothesis rejected)

---

### 2026-01-15 14:27 UTC - Key Finding #1: Connection Pool Exhausted

Event: Checked connection pool utilization (Step 2 of runbook)
Finding: Connection pool completely exhausted (50 active = 50 max)
Impact on investigation: Confirmed connection pool exhaustion, shifted focus to why pool exhausted

Command used:
```bash
kubectl exec -n payment-api deployment/payment-api -- curl localhost:8081/actuator/metrics/hikaricp.connections.active
```
Result: 50 active connections (100% utilization)

Hypothesis update: Pool exhausted due to traffic surge OR connection leak
Decision point: Check if traffic spiked (Step 3 of runbook)

---

### 2026-01-15 14:30 UTC - Key Finding #2: No Traffic Spike

Event: Checked traffic rate for anomalies
Finding: Traffic normal (~450 req/s), no spike occurred
Impact on investigation: Ruled out capacity issue, connection leak highly likely

Hypothesis update: Connection leak is cause
Decision point: Look for evidence of connection leak (Step 4 of runbook)

---

### 2026-01-15 14:33 UTC - Key Finding #3: Connection Leak Detected

Event: Checked application logs for leak warnings
Finding: HikariCP logged 48+ "Connection leak detection triggered" warnings starting at 14:22
Impact on investigation: Confirmed connection leak, shifted focus to finding source of leak

Hypothesis update: Recent code change likely introduced leak
Decision point: Check deployment history for recent changes

---

### 2026-01-15 14:37 UTC - Key Finding #4: Recent Deployment Identified

Event: Checked deployment history and git log
Finding: Deployment 30 minutes ago (revision 48, commit a3f2d8e) changed PaymentValidator.java
Impact on investigation: Timing correlation strong (deployment → 23 min → incident), reviewed code

Code review revealed bug: Early return in validation error path doesn't close connection

Hypothesis update: Deployment introduced connection leak, each invalid payment leaks one connection
Decision point: Rollback deployment to remove buggy code

---

### 2026-01-15 14:40 UTC - Root Cause Identified

Event: Root cause confirmed through code review and timeline correlation
Root cause: Connection leak in PaymentValidator.java early return path (commit a3f2d8e, deployed at 14:00)
Evidence:
1. Code review shows early return doesn't close connection
2. HikariCP leak warnings confirm connections not released
3. Timing: Deployment 14:00 + 23 minutes = 14:23 incident (matches 50 conn / 2 leaks/min)
4. Connection pool exhausted (50 active = 50 max)

Causal chain understood:
1. Code deployed with connection leak in error path
2. Each invalid payment executed early return, leaked one connection
3. Over 23 minutes, ~46 invalid payments leaked 46 connections
4. Connection pool exhausted (all 50 connections leaked or in use)
5. New payment requests couldn't obtain connections (pool exhausted)
6. PaymentAPI returned 503 errors (service unavailable)

Decision point: Rollback to revision 47 (before leak introduced)

---

### 2026-01-15 14:42 UTC - Resolution Applied

Event: Rolled back deployment to revision 47
Action: `kubectl rollout undo deployment/payment-api -n payment-api --to-revision=47`
Rationale: Rollback removes buggy code, restores previous stable version

Alternative approaches considered:
- Alternative 1: Increase connection pool size temporarily
  - Why not chosen: Doesn't fix leak, only delays exhaustion; leak would continue
- Alternative 2: Restart pods without rollback
  - Why not chosen: Pods would restart with same buggy code, leak would resume
- Alternative 3: Deploy fixed code (corrected validation logic)
  - Why not chosen: Requires code fix, review, build, deploy (20+ minutes); rollback faster (2 minutes)

Resolution execution:
- Triggered rollback at 14:42
- Kubernetes rolling update: ~2 minutes for all 3 replicas to restart with revision 47
- Verified new pods running revision 47 (without bug)

---

### 2026-01-15 14:47 UTC - Incident Resolved

Event: Incident declared resolved after verification
Resolution confirmed by:
- Symptom clearance: Database connection errors dropped to 0/min, HTTP 503 errors dropped to <1%
- Metrics normalized:
  - Connection pool utilization: 6-10 active (12-20% of max)
  - HTTP success rate: >99%
  - Payment processing success rate: >99%
- Sustained stability: Monitored for 5 minutes, all metrics stable

Total duration: 47 minutes (14:00 failure start → 14:47 resolution)
- Time to detect: 23 minutes (14:00 → 14:23)
- Time to diagnose: 17 minutes (14:23 → 14:40)
- Time to resolve: 7 minutes (14:40 → 14:47)

Post-resolution actions:
- Monitoring: Extended monitoring for 30 minutes to ensure no recurrence
- Communication: Updated status page, notified stakeholders in #payments-team
- Documentation: Filed incident report memory-bank/operations/incidents/2026-01-15-database-connection-pool.md

---

### 2026-01-15 16:00 UTC - Postmortem Scheduled

Event: Postmortem meeting scheduled
Participants: alex-chen, jordan-williams, morgan-lee (eng manager), casey-brown (architect), sam-patel (platform lead)
Focus: Root cause analysis, systemic improvements, action items

---

## Root Cause Analysis

### Immediate Cause

Connection leak in PaymentValidator.java introduced in commit a3f2d8e, deployed at 14:00 UTC

Evidence:
- Code review shows early return in validation error path doesn't close database connection
- HikariCP leak warnings logged starting 14:22 (connections held >30s)
- Timeline correlation: Deployment 14:00 + 23 minutes = 14:23 incident (matches pool exhaustion rate)

How immediate cause led to symptoms:
1. Each invalid payment executed validation code
2. Validation code took early return path (invalid payment)
3. Early return bypassed connection cleanup
4. Connection leaked (not returned to pool)
5. After ~46 invalid payments over 23 minutes, pool exhausted
6. Subsequent payment requests couldn't obtain connections
7. PaymentAPI returned 503 (service unavailable)

---

### Contributing Factors

#### Contributing Factor 1: Code review didn't catch resource management bug

Factor: Code review process relies on human reviewers to catch all bugs, no checklist for critical patterns like resource management
How it contributed: Reviewer approved code without noticing early return bypassed connection cleanup
Preventability: Yes—code review checklist or automated static analysis would have caught this

Impact: Allowed buggy code to reach production

---

#### Contributing Factor 2: No alert on connection leak warnings

Factor: HikariCP logs connection leak warnings but no alert configured
How it contributed: Leak warnings logged at 14:22 (1 minute before alert fired) but no alert, delaying detection
Preventability: Yes—alert could have been configured to fire on leak warnings

Impact: Delayed detection by ~1 minute (minor but preventable)

---

#### Contributing Factor 3: CI tests didn't exercise error path

Factor: Unit tests and integration tests focused on success path, didn't test invalid payment scenarios that triggered early return
How it contributed: Bug wasn't caught in testing because error path not exercised
Preventability: Yes—test coverage should include error paths

Impact: Allowed bug to pass CI without detection

---

### Root Cause

Code review process gap: Resource management patterns not enforced through checklist or automated tooling

This is deeper than "code had a bug"—bugs happen. Root cause is: why did the process allow this bug to reach production?

Analysis:
- Design assumption violated: Assumed all engineers would consistently follow try-with-resources pattern (assumption violated)
- Process gap: Code review relies on human memory to check critical patterns, no checklist or automation
- Systemic condition: No automated enforcement of resource management best practices

Why root cause matters:
- Fixing immediate cause: Fix this specific connection leak bug (prevents THIS incident)
- Addressing root cause: Add code review checklist + static analysis (prevents ALL resource leak bugs)

---

### Causal Chain

1. **Root cause**: Code review process doesn't enforce resource management patterns
   ↓
2. **Enabled**: Developers can introduce resource leaks that pass review
   ↓
3. **Immediate cause**: Connection leak bug deployed in commit a3f2d8e
   ↓
4. **Direct effect**: Each invalid payment leaked one database connection
   ↓
5. **Cascading effect**: Connection pool exhausted after 23 minutes
   ↓
6. **Observable symptoms**: Payment requests failed with 503 errors (connection pool exhausted)

---

### What Worked (Protective Factors)

Protective factor 1: Runbook guided investigation systematically
- How it helped: Led to root cause in 17 minutes (detection → diagnosis), prevented wasted time on wrong hypotheses
- Preserve: Runbook worked perfectly, continue creating runbooks for common scenarios

Protective factor 2: HikariCP's built-in leak detection
- How it helped: Logged warnings when connections held too long, provided evidence of leak
- Preserve: Continue using connection pool libraries with leak detection, consider enabling for other resource types

Protective factor 3: Rollback capability
- How it helped: Fast resolution (7 minutes to rollback vs 20+ minutes to fix and redeploy)
- Preserve: Maintain rollback capability for all deployments, ensure team knows how to execute

Protective factor 4: Automated alerting
- How it helped: Detected incident within 1 minute of threshold breach, paged on-call immediately
- Preserve: Continue using automated alerting, expand coverage

---

### What Failed (Vulnerability Factors)

Vulnerability factor 1: No automated enforcement of resource management patterns
- How it hurt: Allowed resource leak bug to reach production
- Fix: Static analysis + code review checklist (address root cause)

Vulnerability factor 2: No alert on connection leak warnings
- How it hurt: Delayed detection by ~1 minute (leak warnings logged but not alerted)
- Fix: Add alert on leak warnings (short-term remediation)

Vulnerability factor 3: Test coverage didn't exercise error paths
- How it hurt: Bug not caught in CI
- Fix: Expand test coverage to include error paths (medium-term improvement)

Vulnerability factor 4: Detection lag (23 minutes)
- How it hurt: Incident undetected for 23 minutes while connections leaked
- Fix: Earlier detection would require monitoring connection pool utilization proactively (not just errors)
- Note: Alert on pool utilization >70% would provide 7-8 minute warning before exhaustion

---

## Incident Response Evaluation

### What Went Well

#### Detection

Detection method: Automated alert on connection error threshold
Detection time: <1 minute after errors exceeded threshold
Effectiveness: Good for detecting pool exhaustion; could be faster with proactive pool monitoring

What worked:
- Alert fired immediately when threshold breached
- PagerDuty escalation worked (paged on-call, auto-escalated to secondary)

#### Investigation

Investigation approach: Systematic, guided by runbook
Time to root cause: 17 minutes (14:23 detection → 14:40 diagnosis)
Effectiveness: Efficient—runbook prevented wasted time

What worked:
- Runbook provided clear investigation steps that led directly to root cause
- Past incident search (though found none) didn't waste much time
- Architecture documentation provided context (connection pool design, sizing rationale)
- HikariCP leak warnings provided clear evidence

#### Resolution

Resolution approach: Rollback deployment
Time to resolve: 7 minutes (14:40 diagnosis → 14:47 resolution)
Effectiveness: Quick—rollback much faster than fix-and-redeploy

What worked:
- Rollback capability allowed fast resolution
- Kubernetes rolling update minimized disruption during rollback
- Verification confirmed resolution effective

#### Communication

Communication during incident: Slack incident channel, status page updates
Effectiveness: Clear and timely

What worked:
- Incident Slack channel created immediately, kept stakeholders informed
- Status page updated at detection and resolution
- Post-incident summary shared with team

---

### What Could Be Improved

#### Detection Gaps

Gap: No proactive monitoring of connection pool utilization
Impact: Incident undetected for 23 minutes while pool leaked connections
Improvement: Add alert on connection pool utilization >70% (would provide ~7 minute early warning before exhaustion)

Gap: No alert on connection leak warnings
Impact: Leak warnings logged at 14:22 but not alerted, causing ~1 minute additional delay
Improvement: Add alert when HikariCP logs leak warnings (immediate detection of leaks)

---

#### Investigation Inefficiencies

Inefficiency: Manual correlation of deployment timing with incident
Impact: Took 3 minutes to check deployment history and correlate with incident timing
Improvement: Add deployment event markers to Grafana dashboards (visual correlation)

Inefficiency: No single pane of glass for investigation
Impact: Had to switch between Grafana (metrics), Kubernetes (deployments), logs, GitHub (code)
Improvement: Create incident investigation dashboard with all relevant context

---

#### Resolution Delays

Delay: Manual kubectl command for rollback
Impact: Minor (~30 seconds to find correct revision number, execute command)
Improvement: Create one-click rollback script or dashboard button

---

#### Communication Gaps

Gap: Didn't proactively notify Checkout team that PaymentAPI was failing
Impact: Checkout team paged separately (their service also failed), duplicated effort
Improvement: Automatic notification to dependent services when critical dependency fails

---

### Response Timeline Analysis

Total incident duration: 47 minutes (failure start to resolution)

Breakdown:
- Detection lag: 23 minutes (49% of total)
- Investigation time: 17 minutes (36% of total)
- Resolution time: 7 minutes (15% of total)

Optimization opportunities:
Priority 1 (biggest time savings): Detection lag (23 minutes → target 5 minutes)
- Add alert on pool utilization >70% (early warning)
- Add alert on leak warnings (immediate detection)
- Estimated savings: 18 minutes

Priority 2: Investigation time (17 minutes → target 10 minutes)
- Add deployment markers to dashboards (faster correlation)
- Create incident investigation dashboard (single pane of glass)
- Estimated savings: 7 minutes

Priority 3: Resolution time (7 minutes → target 5 minutes)
- One-click rollback capability
- Estimated savings: 2 minutes

Target for similar future incidents: 15-20 minutes total (with proactive monitoring and streamlined investigation)

---

## Prevention and Remediation

### Immediate Actions (Already Completed)

Action 1: Fixed connection leak bug in code
- Purpose: Ensure bug doesn't redeploy
- Status: ✓ Completed 2026-01-15 (same day as incident)
- Ticket: DEV-4520
- Effectiveness: Prevents this specific leak from recurring

Code fix:
```java
// PaymentValidator.java - FIXED
public boolean validatePayment(Payment payment) {
    try (Connection conn = dataSource.getConnection()) {  // try-with-resources
        if (invalid) {
            return false;  // Connection auto-closes on return
        }
        return true;
    }  // Connection auto-closes here too
}
```

Action 2: Deployed fixed code after code review
- Purpose: Restore functionality that was in buggy deployment
- Status: ✓ Completed 2026-01-15
- Ticket: DEV-4520
- Effectiveness: Restores payment validation feature without leak

---

### Short-term Remediation (Within 1 week)

#### Remediation 1: Add alert on HikariCP connection leak warnings

Action: Configure Datadog monitor to alert when "Connection leak detection triggered" appears in logs
Purpose: Detect connection leaks immediately when leak warnings logged (would have saved 1 minute in this incident)
Owner: sam-patel (platform team)
Due date: 2026-01-22
Tracking: INFRA-2341

Implementation:
- Datadog log pattern match: "Connection leak detection triggered"
- Alert severity: Warning
- Notification: Page on-call
- Context: Include connection pool utilization in alert

Success criteria: Alert fires when HikariCP logs leak warning, tested with intentional leak in staging

---

#### Remediation 2: Add alert on connection pool utilization >70%

Action: Configure Datadog monitor to alert when connection pool utilization exceeds 70%
Purpose: Early warning before pool exhaustion (would have provided 7-8 minute warning in this incident)
Owner: sam-patel (platform team)
Due date: 2026-01-22
Tracking: INFRA-2343

Implementation:
- Metric: hikaricp.connections.active / hikaricp.connections.max
- Threshold: >0.7 (70% utilization)
- Alert severity: Warning
- Notification: Page on-call

Success criteria: Alert fires when pool utilization >70%, verified in staging by simulating load

---

#### Remediation 3: Add deployment markers to Grafana dashboards

Action: Annotate Grafana dashboards with deployment events
Purpose: Visual correlation of deployments with metric changes (would have saved 3 minutes investigation time)
Owner: sam-patel (platform team)
Due date: 2026-01-22
Tracking: INFRA-2342

Implementation:
- Kubernetes deployment events → Grafana annotations
- Show deployment revision, time, commit hash
- Visible on all PaymentAPI dashboards

Success criteria: Deployment annotations visible on dashboards within 1 minute of deployment

---

### Medium-term Improvements (Within 1 month)

#### Improvement 1: Create code review checklist

Action: Document code review checklist including resource management verification
Purpose: Ensure reviewers check critical patterns (prevents similar bugs from passing review)
Owner: morgan-lee (engineering manager)
Due date: 2026-02-15
Tracking: DEV-4523

Implementation:
- Document checklist in engineering-practices/code-review-checklist.md
- Include items:
  - Database connections use try-with-resources
  - File handles properly closed
  - Network connections properly closed
  - Error paths properly clean up resources
- Train team on checklist usage
- Add checklist to PR template

Impact: Prevents resource management bugs from passing code review
Effort: 1 day (create checklist, train team)
Priority: High

Success criteria: All PRs reviewed using checklist starting 2026-02-15

---

#### Improvement 2: Expand test coverage to include error paths

Action: Add test cases exercising error paths (invalid payments, error conditions)
Purpose: Catch bugs in error paths during CI (would have caught this bug)
Owner: alex-chen (developer)
Due date: 2026-02-15
Tracking: DEV-4524

Implementation:
- Add test case: Invalid payment validation
- Add test case: Database connection failure handling
- Add test case: Timeout scenarios
- Verify connections released in error paths

Impact: Catches bugs in error paths before production
Effort: 2 days (write tests, integrate CI)
Priority: High

Success criteria: Test coverage includes all error paths, CI fails if connections leak

---

#### Improvement 3: Create incident investigation dashboard

Action: Build Grafana dashboard consolidating all context for incident investigation
Purpose: Single pane of glass for investigation (reduces context switching, saves time)
Owner: sam-patel (platform team)
Due date: 2026-02-28
Tracking: INFRA-2344

Implementation:
- Dashboard panels:
  - Connection pool utilization
  - HTTP error rate
  - Database query latency
  - Recent deployment annotations
  - Recent configuration changes
  - Dependency health (database, upstream/downstream services)
- One dashboard per critical service

Impact: Faster investigation (all context in one place)
Effort: 1 week (design, build, validate)
Priority: Medium

Success criteria: Incident responders use dashboard during next incident, provides all needed context

---

### Long-term Strategic Improvements (Within 1 quarter)

#### Strategic Improvement 1: Implement automated static analysis for resource management

Action: Configure PMD/SpotBugs/SonarQube to detect resource management violations
Purpose: Catch resource leaks in CI before code review (prevents human error from reaching production)
Owner: sam-patel (platform team)
Due date: 2026-03-31
Tracking: INFRA-2350

Implementation:
- Evaluate static analysis tools (PMD, SpotBugs, SonarQube)
- Configure rules for:
  - Database connections not using try-with-resources
  - File handles not properly closed
  - Network connections not properly closed
- Integrate into CI pipeline
- Fail build if violations detected

Impact: Prevents entire class of resource management bugs from reaching production (addresses root cause)
Effort: 2 weeks (research tools, configure, integrate CI)
Priority: High

Rationale: Addresses root cause (code review process gap) with automated enforcement. Humans forget checklist items; automation doesn't.

Success criteria: CI fails if resource management violations detected, tested with intentional violation

---

#### Strategic Improvement 2: Automatic dependent service notification

Action: Implement automatic notification to downstream services when critical dependency fails
Purpose: Coordinate incident response across teams (prevents duplicated paging/investigation)
Owner: sam-patel (platform team)
Due date: 2026-03-31
Tracking: INFRA-2351

Implementation:
- Map service dependencies (already in operational-dependencies.md)
- When SEV-1 alert fires for service, automatically notify dependent teams
- Notification includes: what failed, impact on dependents, incident Slack channel

Impact: Improves cross-team coordination during incidents
Effort: 2 weeks (build notification service, integrate with PagerDuty)
Priority: Medium

Success criteria: When PaymentAPI SEV-1 fires, Checkout team auto-notified without separate page

---

### Risk Acceptance

#### Accepted Risk 1: Connection pool size remains fixed (not auto-scaling)

Risk: Connection pool size remains fixed at 50, doesn't auto-scale based on load
Rationale: Auto-scaling connection pool adds complexity; fixed pool adequate for current/projected load (validated by incident—normal load uses 5-12 connections, 50 provides 4-10x headroom)
Mitigation: Monitor pool utilization, alert at 70%, manual intervention if needed

---

#### Accepted Risk 2: Rollback is manual kubectl command

Risk: Rollback requires manual kubectl command, not one-click automation
Rationale: Automation would save ~30 seconds; manual rollback worked effectively
Mitigation: Document rollback procedure in runbook, ensure on-call engineers know how to execute

Note: This may be automated later (INFRA-2345, low priority) but not critical given effective manual process.

---

### Action Item Summary

Total action items: 10
- Immediate (completed): 2
- Short-term (1 week): 3
- Medium-term (1 month): 3
- Long-term (1 quarter): 2

Priority breakdown:
- High priority: 4 items (static analysis, code review checklist, connection pool alerts, test coverage)
- Medium priority: 3 items (investigation dashboard, dependent service notification)
- Low priority: 1 item (one-click rollback)

Review schedule:
- 1 week (2026-01-22): Review short-term remediation completion (alerts, deployment markers)
- 1 month (2026-02-15): Review medium-term improvements (checklist, test coverage, dashboard)
- 1 quarter (2026-03-31): Review long-term strategic improvements (static analysis, notifications)

---

## Lessons Learned

### Technical Lessons

Lesson 1: Connection pool sizing depends on query latency, not just request rate
- What we learned: Pool size = (requests/sec × query latency); if queries slow, pool exhausts
- How it changes understanding: Pool sizing formula must account for worst-case query latency, not just normal
- Application: Review all connection pool sizing calculations across services, ensure headroom for slow queries

Lesson 2: Resource management bugs are hard to spot in code review
- What we learned: Early returns, error paths, and exception handling can bypass cleanup code
- How it changes understanding: Can't rely on human code review alone for critical patterns
- Application: Automate enforcement of resource management patterns via static analysis

Lesson 3: HikariCP's leak detection is valuable
- What we learned: Connection pool logged leak warnings before pool exhausted (early indicator)
- How it changes understanding: Pool libraries provide telemetry; we should alert on it
- Application: Alert on all connection pool warnings/errors, not just exhaustion

---

### Operational Lessons

Lesson 1: Runbooks are highly effective when they exist
- What we learned: database-connection-failure.md runbook guided investigation systematically, prevented wasted time
- How it improves incident response: Systematic investigation procedures reduce time to diagnosis
- Application: Create runbooks for other common failure modes (high latency, high error rate, deployment failures)

Lesson 2: Deployment correlation is critical for incident investigation
- What we learned: Correlating incident timing with deployment timing quickly identified cause
- How it improves incident response: Recent change is often the cause; check deployments first
- Application: Make deployment timeline easily visible in monitoring dashboards

Lesson 3: Proactive monitoring (utilization) better than reactive (errors)
- What we learned: Could have detected pool exhaustion 7-8 minutes earlier by monitoring pool utilization
- How it improves incident response: Early warning allows proactive mitigation before customer impact
- Application: Monitor resource utilization for all critical resources (connection pools, thread pools, memory)

---

### Organizational Lessons

Lesson 1: Code review alone is insufficient for complex bug classes
- What we learned: Human reviewers miss subtle bugs in error paths, resource management, edge cases
- How it affects processes: Need layered approach (automated checks + human review)
- Application: Implement static analysis for critical patterns (resource management, security, error handling)

Lesson 2: Test coverage should include error paths
- What we learned: Tests focused on success path; error path not exercised, bug not caught
- How it affects processes: Test coverage should explicitly include error paths, not just happy path
- Application: Review test coverage for all services, add error path tests

Lesson 3: Incident response effectiveness depends on documentation
- What we learned: Runbook, architecture docs, past incidents all accelerated investigation
- How it affects processes: Must maintain operational knowledge; stale docs worse than no docs
- Application: Regular review of runbooks, architecture docs, operational dependencies

---

### Assumptions Challenged

Assumption 1: All engineers consistently follow try-with-resources pattern
- We assumed: Engineers know and use try-with-resources for all resource management
- Reality: Pattern not consistently followed; new code used manual connection management
- Impact: Document patterns AND enforce via automation, not just convention

Assumption 2: Code review catches all critical bugs
- We assumed: Code review by experienced engineers catches resource leaks
- Reality: Reviewers miss subtle bugs, especially in error paths
- Impact: Can't rely solely on human review for critical patterns; need automated checks

Assumption 3: CI tests catch bugs before production
- We assumed: Test suite catches bugs during CI
- Reality: Test coverage incomplete (error paths not tested)
- Impact: Expand test coverage to include error paths, edge cases, failure scenarios

---

### Knowledge Gaps Identified

Gap 1: No alert on connection leak warnings
- What was missing: Awareness that HikariCP logs leak warnings before pool exhausted
- How it affected incident: Delayed detection by ~1 minute (leak warnings logged but not alerted)
- How to fill gap: Document HikariCP monitoring best practices, implement alert on leak warnings (INFRA-2341)

Gap 2: No proactive monitoring of connection pool utilization
- What was missing: Alert when pool utilization high (before exhaustion)
- How it affected incident: Incident undetected for 23 minutes while pool leaked
- How to fill gap: Add alert on pool utilization >70% for early warning (INFRA-2343)

Gap 3: Resource management best practices not documented for all engineers
- What was missing: Clear documentation of resource management patterns, enforcement mechanisms
- How it affected incident: Developer didn't use try-with-resources pattern, reviewer didn't catch it
- How to fill gap: Document resource management patterns, create code review checklist (DEV-4523)

---

## Cross-Reference Updates

Based on postmortem, these documents need updates:

### Update 1: System Architecture

**File**: memory-bank/systemPatterns.md#connection-management

**Current state**: Documents connection pool configuration and sizing formula

**Update needed**: Add enforcement mechanisms and lessons from incident

[Content shown in output-format section above]

**Ticket**: DOC-1234 "Update systemPatterns.md with connection management lessons"
**Owner**: casey-brown (architect)
**Due date**: 2026-01-22
**Status**: Completed 2026-01-17

---

### Update 2: Operational Dependencies

**File**: memory-bank/operations/dependencies/operational-dependencies.md

**Update needed**: Add application-side failure mode for database dependency

[Content shown in output-format section above]

**Ticket**: DOC-1235 "Update operational-dependencies.md with app-side pool failure mode"
**Owner**: alex-chen
**Due date**: 2026-01-22
**Status**: Completed 2026-01-17

---

### Update 3: Runbook Validation

**File**: memory-bank/operations/runbooks/database-connection-failure.md

**Update needed**: Add success story and timing benchmark

[Content shown in output-format section above]

**Ticket**: DOC-1236 "Update database-connection-failure runbook with incident reference"
**Owner**: jordan-williams
**Due date**: 2026-01-22
**Status**: Completed 2026-01-16

---

### New Document: Code Review Checklist

**File**: NEW - engineering-practices/code-review-checklist.md

**Content needed**: Checklist including resource management verification

[Content shown in output-format section above]

**Ticket**: DEV-4523 "Create code review checklist"
**Owner**: morgan-lee (engineering manager)
**Due date**: 2026-02-15
**Status**: In Progress

---

### Cross-Reference Summary

Documents updated: 3 (systemPatterns.md, operational-dependencies.md, runbook)
Documents to create: 1 (code-review-checklist.md)

All updates link to this postmortem: memory-bank/operations/postmortems/2026-01-15-database-connection-pool-postmortem.md

---

## Appendix A: Detailed Timeline

For detailed real-time investigation documentation (hypotheses, commands, outputs, dead ends), see:

memory-bank/operations/incidents/2026-01-15-database-connection-pool.md

Postmortem timeline (above) is synthesized summary. Incident investigation captures full detail.

---

## Appendix B: Metrics and Dashboards

Relevant metrics during incident:

**Connection Pool Utilization** (hikaricp.connections.active):
- Normal: 5-12 active connections (10-24% of max 50)
- During incident: 50 active connections (100% of max)
- Dashboard: [PaymentAPI Grafana Dashboard](https://grafana.example.com/dashboards/payment-api)

**HTTP Error Rate** (http_requests_total{status="5xx"}):
- Normal: <1% (5xx errors)
- During incident: 98% (503 errors—service unavailable)
- Dashboard: [PaymentAPI Grafana Dashboard](https://grafana.example.com/dashboards/payment-api)

**Database Query Latency** (database_query_duration_seconds):
- Normal: 8-12ms p95
- During incident: Unable to complete (5s timeout—no connections available)
- Dashboard: [Database Monitoring Dashboard](https://datadog.example.com/database)

---

## Appendix C: Communication Log

Communication during incident:

14:23 UTC: PagerDuty page sent to on-call (alex-chen)
14:24 UTC: Alex acknowledged page, joined incident Slack channel #incident-2026-01-15
14:25 UTC: Status page updated: "Investigating payment processing issues"
14:27 UTC: Posted to #incident-2026-01-15: "Database healthy, connection pool exhausted, investigating cause"
14:30 UTC: Posted to #incident-2026-01-15: "No traffic spike, likely connection leak"
14:35 UTC: jordan-williams joined incident as secondary responder
14:37 UTC: Posted to #incident-2026-01-15: "Recent deployment identified (revision 48), reviewing code"
14:40 UTC: Posted to #incident-2026-01-15: "Root cause identified: connection leak in PaymentValidator, rolling back"
14:42 UTC: Resolution applied (rollback), posted to #incident-2026-01-15
14:47 UTC: Incident resolved, status page updated: "Payment processing restored"
14:50 UTC: Post-incident summary posted to #payments-team
16:00 UTC: Postmortem meeting scheduled (2026-01-16 10:00 AM)

---

## Appendix D: Action Item Tracking

| Action | Owner | Due Date | Status | Ticket |
|--------|-------|----------|--------|--------|
| Fix connection leak in code | alex-chen | 2026-01-15 | ✓ Done | DEV-4520 |
| Deploy fixed code | alex-chen | 2026-01-15 | ✓ Done | DEV-4520 |
| Add alert on connection leak warnings | sam-patel | 2026-01-22 | ✓ Done | INFRA-2341 |
| Add alert on pool utilization >70% | sam-patel | 2026-01-22 | ✓ Done | INFRA-2343 |
| Add deployment markers to dashboards | sam-patel | 2026-01-22 | ✓ Done | INFRA-2342 |
| Update systemPatterns.md | casey-brown | 2026-01-22 | ✓ Done | DOC-1234 |
| Update operational-dependencies.md | alex-chen | 2026-01-22 | ✓ Done | DOC-1235 |
| Update runbook | jordan-williams | 2026-01-22 | ✓ Done | DOC-1236 |
| Create code review checklist | morgan-lee | 2026-02-15 | In Progress | DEV-4523 |
| Expand test coverage (error paths) | alex-chen | 2026-02-15 | In Progress | DEV-4524 |
| Create incident investigation dashboard | sam-patel | 2026-02-28 | Not Started | INFRA-2344 |
| Implement static analysis | sam-patel | 2026-03-31 | Not Started | INFRA-2350 |
| Automatic dependent service notification | sam-patel | 2026-03-31 | Not Started | INFRA-2351 |

Follow-up review scheduled: 2026-02-15 (1 month post-incident)

---

## Appendix E: References

Related documentation:
- System architecture: memory-bank/systemPatterns.md#connection-management
- Database dependency: memory-bank/operations/dependencies/operational-dependencies.md#database
- Incident investigation: memory-bank/operations/incidents/2026-01-15-database-connection-pool.md
- Runbook used: memory-bank/operations/runbooks/database-connection-failure.md

Related past incidents:
- None—first incident of this type (connection pool exhaustion due to leak)

Follow-up postmortem review:
- Date: 2026-02-15 (1 month after incident)
- Purpose: Review action item completion, assess effectiveness of improvements implemented
- Participants: Same as original postmortem
```

Why this works:
- Blameless (focuses on system gaps, not individual mistakes)
- Comprehensive timeline (key decision points, not just facts)
- Root cause vs immediate cause (different levels of depth)
- Systemic improvements (not just tactical fixes)
- Actionable (owners, dates, tracking for all action items)
- Cross-referenced (links to broader documentation, updates knowledge base)
- Learning-focused (lessons learned, assumptions challenged, knowledge gaps)
- Measurable (timeline analysis, optimization opportunities, target metrics)

This postmortem transforms incident from isolated failure into organizational learning:
- Immediate actions prevent recurrence
- Short-term remediation addresses obvious gaps
- Medium-term improvements address contributing factors
- Long-term strategic improvements address root cause
- Cross-reference updates improve broader documentation
- Lessons learned apply beyond this specific incident

</examples>
