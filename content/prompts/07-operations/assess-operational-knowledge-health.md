---
# === Identity ===
id: assess-operational-knowledge-health
name: Assess operational memory bank health through systematic evaluation
version: v1

# === Classification ===
chapter: 7
category: operations
subcategory: health
tags:
  - operations
  - operational-knowledge
  - knowledge-health
  - assessment
  - runbook-currency
  - cross-reference-integrity
  - knowledge-gaps
  - incident-effectiveness
  - resolution-time-trends
  - maintenance
  - knowledge-decay
  - continuous-improvement

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Assess operational memory bank health through systematic evaluation.
    Evaluate runbook currency, check cross-reference integrity, identify knowledge gaps, assess incident response effectiveness, measure time-to-resolution trends, recommend knowledge updates based on recent incidents.
  argument-hint: "[system_name] [assessment_scope] [time_period] [memory_bank_structure]"
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
    description: The system or service being assessed
    example: "PaymentAPI"
    maps-to: "$0"
  - name: assessment_scope
    description: Scope of operational knowledge assessment
    example: "Single service"
    maps-to: "$1"
  - name: time_period
    description: Timeframe for assessing knowledge currency
    example: "Last 3 months"
    maps-to: "$2"
  - name: memory_bank_structure
    description: Whether operational knowledge is separate or integrated
    example: "Separate: operations-memory-bank/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    chapter: 7
    description: |
      **Assess operational memory bank health through systematic evaluation** evaluating runbook currency (commands still valid? access procedures current? system state matches?), checking cross-reference integrity between operational and development knowledge, identifying knowledge gaps from recent incidents (missing runbooks, undocumented failure modes), assessing incident response effectiveness, measuring time-to-resolution trends, recommending prioritized knowledge updates.
    preview: |
      "...Assessment Domains: 1.Runbook Currency [Commands Access System Dependencies] Rating: Current Minor updates Major updates Obsolete / 2.Cross-Reference Integrity [Bidirectional completeness] / 3.Knowledge Gaps [P0 Critical P1 High P2 Medium] / 4.Incident Response Effectiveness / 5.Resolution Time Trends..."
  website:
    include: true
    path: /prompts/assess-operational-knowledge-health
  marketplace:
    plugin: constellize-operations

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Assess operational memory bank health for {{system_name}} by evaluating operational memory bank currency (are runbooks accurate?), checking cross-reference integrity between operational and development knowledge, identifying knowledge gaps (missing runbooks, undocumented failure modes), assessing incident response effectiveness using knowledge, measuring time-to-resolution trends, recommending knowledge updates based on recent incidents.
</task>

<context>
System: {{system_name}}
Assessment Scope: {{assessment_scope}}
Time Period: {{time_period}}
Memory Bank Structure: {{memory_bank_structure}}

Operational memory banks decay without maintenance: runbooks become outdated as systems evolve, cross-references break as documents move, knowledge gaps emerge as new failure modes appear. Regular health assessments identify decay before it impacts incident response, ensuring operational knowledge remains accurate and actionable.

Assessment differs from ad-hoc updates:
- Ad-hoc: Update specific document after specific incident
- Assessment: Systematic review of entire operational knowledge base for currency, completeness, effectiveness

Both are necessary for knowledge health.
</context>

<thinking>
Before assessing operational knowledge:
1. When was operational knowledge last comprehensively reviewed?
2. How many incidents occurred since last assessment?
3. Have incidents revealed knowledge gaps?
4. Are runbooks being used effectively during incidents?
5. Are cross-references still valid?
6. Have system architectures evolved since documentation?
7. Are incident resolution times trending up or down?
</thinking>

<output-format>

## Assessment Scope Pattern

```
Operational Knowledge Health Assessment

System: {{system_name}}
Scope: {{assessment_scope}}
Assessment Period: {{time_period}}
Assessment Date: [YYYY-MM-DD]
Assessor: [Who conducted assessment]
Memory Bank Structure: {{memory_bank_structure}}

Purpose: Systematic evaluation of operational knowledge currency, completeness, and effectiveness

Assessment Domains:
1. Runbook Currency (Are runbooks accurate and up-to-date?)
2. Cross-Reference Integrity (Are links between operational and development knowledge valid?)
3. Knowledge Gaps (What operational knowledge is missing?)
4. Incident Response Effectiveness (Is knowledge being used effectively during incidents?)
5. Resolution Time Trends (Are incidents being resolved faster or slower?)
6. Recent Incident Learnings (What did recent incidents teach us about knowledge gaps?)

Review Trigger: [Scheduled quarterly review / Post-incident spike / System evolution]
```

---

## Runbook Currency Assessment Pattern

```
## Domain 1: Runbook Currency

Evaluate whether runbooks accurately reflect current systems and procedures.

### Runbook Inventory

List all runbooks in scope:

```bash
# Find all runbooks
ls {{memory_bank_structure}}runbooks/
```

Total runbooks: [N]
- Critical runbooks (SEV-1 scenarios): [N]
- Important runbooks (SEV-2 scenarios): [N]
- Reference runbooks (SEV-3 scenarios): [N]

---

### Currency Check: Runbook-by-Runbook

For each critical runbook:

#### Runbook: [runbook-name.md]

**Basic Information**:
- Scenario: [What scenario runbook addresses]
- Severity: [SEV level]
- Last updated: [Date from file metadata or version history]
- Last reviewed: [Date from runbook's "Last Reviewed" field]
- Age: [Months since last update]

**Currency Assessment**:

□ Commands still valid
  - Test: [Execute sample commands from runbook in non-prod]
  - Result: ✓ All work / ⚠ Some deprecated / ✗ Major changes needed
  - Details: [Which commands need updates, if any]

□ Access procedures current
  - Test: [Verify access instructions work]
  - Result: ✓ Correct / ⚠ Partially outdated / ✗ Significantly changed
  - Details: [What changed—permissions, tools, processes]

□ System state matches documentation
  - Test: [Compare runbook's system description to actual architecture]
  - Reference: memory-bank/systemPatterns.md
  - Result: ✓ Accurate / ⚠ Minor drift / ✗ Significant drift
  - Details: [Architecture changes not reflected in runbook]

□ Dependencies still accurate
  - Test: [Verify dependency list matches operational-dependencies.md]
  - Reference: {{memory_bank_structure}}dependencies/operational-dependencies.md
  - Result: ✓ Accurate / ⚠ Some changes / ✗ Major changes
  - Details: [New dependencies, removed dependencies]

□ Contact information current
  - Test: [Verify on-call rotations, team names, Slack channels]
  - Result: ✓ Current / ⚠ Some stale / ✗ Significantly outdated
  - Details: [What needs updating]

□ Monitoring/dashboards valid
  - Test: [Click dashboard links, verify metrics still exist]
  - Result: ✓ All valid / ⚠ Some broken / ✗ Many broken
  - Details: [Which links broken, why]

**Recent Usage**:
- Used in incidents: [List incidents that used this runbook in {{time_period}}]
- Effectiveness: [Did runbook successfully guide investigation?]
- Gaps identified: [What was missing during incident usage?]

**Currency Rating**: ✓ Current / ⚠ Needs minor updates / ✗ Needs major updates / ⊗ Obsolete

**Action required**:
- If ⚠: [Specific updates needed, owner, due date]
- If ✗: [Major revision needed, owner, due date]
- If ⊗: [Deprecate or completely rewrite, owner, due date]

---

### Currency Summary

Total runbooks assessed: [N]

Currency breakdown:
- ✓ Current (no updates needed): [N] ([%])
- ⚠ Needs minor updates: [N] ([%])
- ✗ Needs major updates: [N] ([%])
- ⊗ Obsolete (deprecate or rewrite): [N] ([%])

Overall currency health: [Excellent / Good / Fair / Poor]
- Excellent: >90% current
- Good: 75-90% current
- Fair: 50-75% current
- Poor: <50% current

Priority updates:
1. [Runbook name] - [Why priority, due date, owner]
2. [Runbook name] - [Why priority, due date, owner]
3. [Runbook name] - [Why priority, due date, owner]

Common decay patterns observed:
- [Pattern 1, e.g., "Dashboard links broken due to Grafana migration"]
- [Pattern 2, e.g., "Commands outdated due to Kubernetes version upgrade"]
- [Pattern 3, e.g., "Contact information stale due to team reorganization"]

Systemic improvements needed:
- [How to prevent this decay, e.g., "Automated link checking in CI"]
```

---

## Cross-Reference Integrity Assessment Pattern

```
## Domain 2: Cross-Reference Integrity

Evaluate bidirectional cross-references between operational and development knowledge.

### Cross-Reference Mapping

If separate operational memory bank:
- File: {{memory_bank_structure}}cross-references.md (operations → development)
- File: memory-bank/operational-overview.md (development → operations)

If integrated:
- Cross-references: Within memory-bank/ (internal links)

---

### Forward References: Operations → Development

Check references from operational knowledge to development knowledge.

```bash
# Find all cross-references from operations to development
grep -r "memory-bank/" {{memory_bank_structure}} -n
```

Total references found: [N]

Sample verification (check 10-20 representative references):

| Source Document | Target Document | Status | Issue |
|-----------------|-----------------|--------|-------|
| runbooks/database-connection-failure.md:15 | memory-bank/systemPatterns.md#database-layer | ✓ Valid | - |
| incidents/2026-01-15.md:45 | memory-bank/systemPatterns.md#connection-management | ✓ Valid | - |
| dependencies/operational-dependencies.md:20 | memory-bank/techContext.md#database | ✗ Broken | Section renamed |
| postmortems/2025-12-10.md:80 | memory-bank/systemPatterns.md#api-gateway | ⚠ Warning | Section moved |

Integrity assessment:
- ✓ Valid references: [N] ([%])
- ⚠ Working but warnings (section moved, renamed): [N] ([%])
- ✗ Broken references (404, section doesn't exist): [N] ([%])

Forward reference health: [Excellent / Good / Fair / Poor]
- Excellent: >95% valid
- Good: 85-95% valid
- Fair: 70-85% valid
- Poor: <70% valid

---

### Backward References: Development → Operations

Check references from development knowledge to operational knowledge.

```bash
# Find all cross-references from development to operations
grep -r "operations/" memory-bank/ -n
grep -r "operations-memory-bank/" memory-bank/ -n
```

Total references found: [N]

Sample verification:

| Source Document | Target Document | Status | Issue |
|-----------------|-----------------|--------|-------|
| memory-bank/systemPatterns.md:120 | operations/runbooks/deployment.md | ✓ Valid | - |
| memory-bank/systemPatterns.md:250 | operations/performance/baselines.md | ✗ Broken | File moved |

Integrity assessment:
- ✓ Valid references: [N] ([%])
- ⚠ Working but warnings: [N] ([%])
- ✗ Broken references: [N] ([%])

Backward reference health: [Excellent / Good / Fair / Poor]

---

### Bidirectional Completeness

Check if cross-references are bidirectional (A references B, B references A).

Sample check:

**Example: Database architecture ↔ Database runbook**

Forward (architecture → runbook):
- memory-bank/systemPatterns.md#database-layer references operations/runbooks/database-connection-failure.md
- Status: ✓ Present

Backward (runbook → architecture):
- operations/runbooks/database-connection-failure.md references memory-bank/systemPatterns.md#database-layer
- Status: ✓ Present

Bidirectional: ✓ Complete

Test cases checked: [N]
- ✓ Bidirectional: [N] ([%])
- ⊘ Unidirectional (reference exists one way only): [N] ([%])
- ✗ No connection (should be linked but isn't): [N] ([%])

Bidirectional completeness: [Excellent / Good / Fair / Poor]

---

### Cross-Reference Action Items

Broken references to fix:
1. [Source] → [Target]: [Issue description] - [Owner, due date]
2. [Source] → [Target]: [Issue description] - [Owner, due date]

Missing bidirectional references to add:
1. [Document A] ↔ [Document B]: [Why should be linked] - [Owner, due date]

Systemic improvements:
- [How to maintain cross-reference integrity, e.g., "Weekly automated link checker"]
```

---

## Knowledge Gaps Assessment Pattern

```
## Domain 3: Knowledge Gaps

Identify missing operational knowledge exposed by recent incidents.

### Incident-Driven Gap Analysis

For each incident in {{time_period}}:

#### Incident: [incident-id]

**Basic Information**:
- Date: [YYYY-MM-DD]
- System: [System name]
- Severity: [SEV level]
- Duration: [Time to resolve]
- Root cause: [Brief description]

**Knowledge Gap Analysis**:

□ Was runbook available for this scenario?
  - Result: ✓ Yes / ✗ No
  - If no: [Gap: Missing runbook for [scenario]]
  - Priority: [High / Medium / Low based on severity and recurrence likelihood]

□ Was past incident documentation available for similar scenario?
  - Result: ✓ Yes / ✗ No
  - If no: [Gap: No historical precedent documented]
  - Priority: [High / Medium / Low]

□ Were dependencies documented accurately?
  - Result: ✓ Yes / ⚠ Partially / ✗ No
  - If no or partial: [Gap: [Specific dependency not documented or inaccurate]]
  - Priority: [High / Medium / Low]

□ Was performance baseline documented?
  - Result: ✓ Yes / ✗ No
  - If no: [Gap: No baseline for [metric] to compare against]
  - Priority: [High / Medium / Low]

□ Was failure mode documented?
  - Result: ✓ Yes / ✗ No
  - If no: [Gap: [Failure mode] not documented, responders surprised]
  - Priority: [High / Medium / Low]

□ Were debugging commands/procedures documented?
  - Result: ✓ Yes / ⚠ Partially / ✗ No
  - If no or partial: [Gap: Responders had to discover [investigation approach] ad-hoc]
  - Priority: [High / Medium / Low]

**Gaps identified for this incident**: [N]
**Highest priority gap**: [Gap description]

---

### Gap Inventory

Aggregate all gaps across incidents:

Total unique gaps identified: [N]

#### Gap Category: Missing Runbooks

Scenarios lacking runbooks:
1. [Scenario 1]: [Description, identified in incident [ID], severity [SEV-X]]
2. [Scenario 2]: [Description, identified in incident [ID], severity [SEV-X]]
3. [Scenario 3]: [Description, identified in incident [ID], severity [SEV-X]]

Priority: [N] high-priority missing runbooks (SEV-1 scenarios)

---

#### Gap Category: Undocumented Failure Modes

Failure modes that surprised responders:
1. [Failure mode 1]: [Description, system, incident [ID]]
   - Why unexpected: [What we thought vs what happened]
   - Where to document: [memory-bank/systemPatterns.md#[section] + runbook]
2. [Failure mode 2]: [Description, system, incident [ID]]

Priority: [N] high-priority undocumented failure modes

---

#### Gap Category: Missing Performance Baselines

Metrics lacking documented baselines:
1. [Metric 1]: [System, incident [ID] couldn't compare to baseline]
   - Where to document: {{memory_bank_structure}}performance/baseline-metrics.md
2. [Metric 2]: [System, incident [ID]]

Priority: [N] high-priority missing baselines

---

#### Gap Category: Incomplete Dependency Documentation

Dependencies not accurately documented:
1. [Dependency 1]: [System, what was missing, incident [ID]]
   - Where to document: {{memory_bank_structure}}dependencies/operational-dependencies.md
2. [Dependency 2]: [System, what was missing, incident [ID]]

Priority: [N] high-priority dependency gaps

---

#### Gap Category: Missing Debugging Procedures

Investigation approaches not documented:
1. [Procedure 1]: [What responders had to figure out, incident [ID]]
   - Where to document: [Runbook or create new runbook]
2. [Procedure 2]: [What responders had to figure out, incident [ID]]

Priority: [N] high-priority missing procedures

---

### Gap Prioritization

All gaps ranked by priority:

| Gap | Category | System | Severity Impact | Recurrence Likelihood | Priority |
|-----|----------|--------|-----------------|----------------------|----------|
| [Gap 1] | Missing runbook | PaymentAPI | SEV-1 | High (monthly) | P0 (Critical) |
| [Gap 2] | Undocumented failure mode | AuthService | SEV-2 | Medium (quarterly) | P1 (High) |
| [Gap 3] | Missing baseline | Database | SEV-2 | Low (rare) | P2 (Medium) |

Priority definitions:
- P0 (Critical): SEV-1 scenarios, high recurrence, or multiple incidents revealed gap
- P1 (High): SEV-2 scenarios, medium recurrence, or significant impact
- P2 (Medium): SEV-3 scenarios, low recurrence, or minor impact
- P3 (Low): Edge cases, very rare, or low impact

Gap closure plan:
- P0 gaps: Close within 1 week (blocking incidents)
- P1 gaps: Close within 1 month (impacting response)
- P2 gaps: Close within 1 quarter (nice to have)
- P3 gaps: Close opportunistically (backlog)

Action items:
1. [Gap] - [Owner, due date, tracking ticket]
2. [Gap] - [Owner, due date, tracking ticket]
3. [Gap] - [Owner, due date, tracking ticket]
```

---

## Incident Response Effectiveness Assessment Pattern

```
## Domain 4: Incident Response Effectiveness

Assess how effectively operational knowledge is being used during incidents.

### Runbook Usage Analysis

Analyze runbook effectiveness during incidents:

#### Incidents Using Runbooks ([N] incidents)

| Incident | Runbook Used | Effective? | Time Saved | Gaps Found |
|----------|--------------|------------|------------|------------|
| 2026-01-15-db-conn | database-connection-failure.md | ✓ Yes | ~10 min | None |
| 2026-01-20-api-latency | performance-degradation.md | ⚠ Partial | ~5 min | Missing step for cache investigation |
| 2026-01-25-auth-503 | incident-response.md (generic) | ✗ No | 0 min | Too generic, didn't help |

Runbook effectiveness:
- ✓ Highly effective (guided to resolution): [N] ([%])
- ⚠ Partially effective (helped but incomplete): [N] ([%])
- ✗ Not effective (didn't help): [N] ([%])

Time saved by runbooks:
- Total time saved: [N] minutes across [M] incidents
- Average time saved per incident: [X] minutes
- Value: Runbooks save an average of [X] minutes per incident

Runbook improvements identified:
1. [Runbook name]: [What needs improvement based on incident usage]
2. [Runbook name]: [What needs improvement]

---

#### Incidents Without Runbooks ([N] incidents)

| Incident | Scenario | Severity | Time to Resolve | Runbook Needed? |
|----------|----------|----------|-----------------|-----------------|
| 2026-01-18-cache-invalidation | Cache invalidation failures | SEV-2 | 45 min | ✓ Yes (new runbook) |
| 2026-01-22-network-partition | Network partition | SEV-1 | 60 min | ✓ Yes (new runbook) |

Impact of missing runbooks:
- Average resolution time with runbook: [X] minutes
- Average resolution time without runbook: [Y] minutes
- Delta: [Y - X] minutes additional time without runbook

New runbooks needed (prioritized):
1. [Scenario] - [Severity, frequency, avg resolution time without runbook]
2. [Scenario] - [Severity, frequency, avg resolution time]

---

### Past Incident Documentation Usage

How often do responders consult past incident documentation?

Query incidents for references to past incidents:
```bash
grep -r "Similar to" {{memory_bank_structure}}incidents/ | wc -l
grep -r "Related incident" {{memory_bank_structure}}incidents/ | wc -l
```

Incidents referencing past incidents: [N] of [M] total ([%])

Effectiveness of past incident references:
- Accelerated resolution: [N] incidents benefited from past incident knowledge
- Time saved: [Estimated minutes saved per incident]

Improvement: [If usage is low, why? Are past incidents discoverable? Searchable?]

---

### Architecture Documentation Usage

How often do responders consult architecture documentation during incidents?

Query incidents for references to architecture:
```bash
grep -r "memory-bank/systemPatterns.md" {{memory_bank_structure}}incidents/ | wc -l
```

Incidents referencing architecture: [N] of [M] total ([%])

Effectiveness:
- Architecture context helped: [N] incidents (understanding why system behaved unexpectedly)
- Architecture revealed assumptions: [N] incidents (design assumption violated)

Improvement: [If usage is low, why? Is architecture documentation linked from runbooks?]

---

### Knowledge Accessibility During Incidents

Assess whether knowledge is easily accessible under pressure:

Questions to evaluate:
□ Can on-call engineers find relevant runbooks within 1 minute?
  - Test: Simulate incident, time how long to locate runbook
  - Result: ✓ Yes / ⚠ Sometimes / ✗ No
  - Improvement: [If no, what's the barrier? Naming? Organization? Search?]

□ Are cross-references easy to follow?
  - Test: Follow cross-reference chain during incident simulation
  - Result: ✓ Yes / ⚠ Sometimes / ✗ No
  - Improvement: [If no, what's the barrier? Broken links? Unclear references?]

□ Is knowledge in actionable format (commands, not just concepts)?
  - Test: Review runbooks for command specificity
  - Result: ✓ Yes / ⚠ Mixed / ✗ No
  - Improvement: [If no, which runbooks need more specific commands?]

□ Are performance baselines easy to compare against?
  - Test: During incident, how long to find baseline for metric?
  - Result: ✓ <1 minute / ⚠ 1-3 minutes / ✗ >3 minutes
  - Improvement: [If slow, what's the barrier? Organization? Format?]

Overall accessibility: [Excellent / Good / Fair / Poor]

Action items to improve accessibility:
1. [Improvement] - [Owner, due date]
2. [Improvement] - [Owner, due date]
```

---

## Resolution Time Trends Assessment Pattern

```
## Domain 5: Resolution Time Trends

Measure whether incidents are being resolved faster or slower over time.

### Incident Resolution Time Data

Collect resolution times for incidents in {{time_period}}:

| Incident | Date | Severity | Time to Resolve | Runbook Used | Knowledge Gap |
|----------|------|----------|-----------------|--------------|---------------|
| INC-001 | 2026-01-05 | SEV-2 | 30 min | ✓ Yes | None |
| INC-002 | 2026-01-10 | SEV-1 | 45 min | ✗ No | Missing runbook |
| INC-003 | 2026-01-15 | SEV-1 | 24 min | ✓ Yes | None |
| INC-004 | 2026-01-20 | SEV-2 | 38 min | ⚠ Partial | Incomplete runbook |
| INC-005 | 2026-01-25 | SEV-1 | 60 min | ✗ No | Undocumented failure mode |

Total incidents: [N]
Average resolution time: [X] minutes

---

### Trend Analysis

Compare resolution times across time periods:

**Current period ({{time_period}})**:
- Average resolution time: [X] minutes
- Median resolution time: [Y] minutes
- SEV-1 average: [Z] minutes
- SEV-2 average: [W] minutes

**Previous period (same duration)**:
- Average resolution time: [X'] minutes
- Median resolution time: [Y'] minutes
- SEV-1 average: [Z'] minutes
- SEV-2 average: [W'] minutes

**Change**:
- Average: [X - X'] minutes ([+/-][%] change)
- Median: [Y - Y'] minutes ([+/-][%] change)
- SEV-1: [Z - Z'] minutes ([+/-][%] change)
- SEV-2: [W - W'] minutes ([+/-][%] change)

Trend: ✓ Improving (faster resolution) / ⚠ Stable (no change) / ✗ Degrading (slower resolution)

---

### Correlation: Knowledge Quality ↔ Resolution Time

Analyze correlation between knowledge availability and resolution time:

**Incidents with runbooks**:
- Count: [N]
- Average resolution time: [X] minutes

**Incidents without runbooks**:
- Count: [M]
- Average resolution time: [Y] minutes

**Delta**: [Y - X] minutes ([%] slower without runbook)

Statistical significance: [Significant / Not significant / Needs more data]

**Incidents with documented past similar incidents**:
- Count: [N]
- Average resolution time: [X] minutes

**Incidents without past precedent**:
- Count: [M]
- Average resolution time: [Y] minutes

**Delta**: [Y - X] minutes ([%] slower without precedent)

---

### Trend Drivers

What's driving resolution time trends?

If improving:
- ✓ More runbooks created (coverage increased from [X%] to [Y%])
- ✓ Runbooks updated (currency improved from [X%] to [Y%])
- ✓ Responders more familiar with operational knowledge (training)
- ✓ Fewer novel failure modes (system stability improving)

If stable:
- ⚠ Runbook coverage constant
- ⚠ New failure modes offset by better runbooks
- ⚠ Responder familiarity plateaued

If degrading:
- ✗ Runbooks becoming outdated (currency declining from [X%] to [Y%])
- ✗ More novel failure modes (system complexity increasing)
- ✗ Responder turnover (new on-call engineers unfamiliar)
- ✗ Knowledge gaps accumulating

Action items based on trend:
1. [Action to sustain improvement or reverse degradation] - [Owner, due date]
2. [Action] - [Owner, due date]

---

### Resolution Time Targets

Set targets for future periods:

**Current performance**:
- SEV-1 average: [X] minutes
- SEV-2 average: [Y] minutes

**Targets for next period**:
- SEV-1 target: [X - N] minutes ([improvement %])
- SEV-2 target: [Y - M] minutes ([improvement %])

**How to achieve targets**:
- Close [N] P0 knowledge gaps (expected impact: -[M] minutes per SEV-1)
- Update [N] critical runbooks (expected impact: -[M] minutes per incident)
- Create [N] missing runbooks (expected impact: -[M] minutes per incident)
- Train on-call engineers on operational knowledge (expected impact: -[M] minutes per incident)

Target review date: [Next assessment date]
```

---

## Recommendations Pattern

```
## Assessment Summary and Recommendations

Based on domains 1-5, synthesize findings and prioritize actions.

### Overall Health Rating

| Domain | Rating | Key Issues | Priority Actions |
|--------|--------|------------|------------------|
| Runbook Currency | [Excellent/Good/Fair/Poor] | [Top issue] | [Top action] |
| Cross-Reference Integrity | [Excellent/Good/Fair/Poor] | [Top issue] | [Top action] |
| Knowledge Gaps | [Excellent/Good/Fair/Poor] | [Top issue] | [Top action] |
| Incident Response Effectiveness | [Excellent/Good/Fair/Poor] | [Top issue] | [Top action] |
| Resolution Time Trends | [Improving/Stable/Degrading] | [Top issue] | [Top action] |

**Overall operational knowledge health**: [Excellent / Good / Fair / Poor]

Overall health rating:
- Excellent: All domains Excellent or Good, resolution time improving
- Good: Most domains Good, resolution time stable or improving
- Fair: Some domains Fair or Poor, resolution time stable or degrading
- Poor: Multiple domains Poor, resolution time degrading

---

### Critical Actions (Within 1 Week)

Priority 0 actions addressing most critical gaps:

1. **[Action 1]**
   - Issue: [What's wrong]
   - Impact: [How it's affecting incident response]
   - Owner: [Who responsible]
   - Due date: [Date]
   - Tracking: [Ticket number]
   - Success criteria: [How to verify completion]

2. **[Action 2]**
   [Same structure]

3. **[Action 3]**
   [Same structure]

---

### High-Priority Actions (Within 1 Month)

Priority 1 actions addressing important gaps:

1. **[Action 1]**
   [Same structure as critical actions]

2. **[Action 2]**
   [Same structure]

---

### Medium-Priority Actions (Within 1 Quarter)

Priority 2 actions for continuous improvement:

1. **[Action 1]**
   [Same structure]

2. **[Action 2]**
   [Same structure]

---

### Systemic Improvements

Long-term initiatives to prevent decay:

1. **Automated runbook validation**
   - Initiative: CI pipeline testing runbook commands in non-prod
   - Purpose: Catch outdated commands before incidents
   - Effort: [Estimated effort]
   - Owner: [Who responsible]
   - Timeline: [When to implement]

2. **Automated cross-reference checking**
   - Initiative: Weekly CI job validating all internal links
   - Purpose: Catch broken cross-references immediately
   - Effort: [Estimated effort]
   - Owner: [Who responsible]
   - Timeline: [When to implement]

3. **Quarterly operational knowledge health reviews**
   - Initiative: Scheduled assessment every quarter
   - Purpose: Proactive maintenance, prevent decay accumulation
   - Effort: [Estimated effort per quarter]
   - Owner: [Who responsible]
   - Timeline: [Next review date]

---

### Success Metrics

How to measure improvement over next period:

**Knowledge Currency**:
- Current: [X%] of runbooks current
- Target: [Y%] of runbooks current
- Measurement: Next quarterly assessment

**Cross-Reference Integrity**:
- Current: [X%] of references valid
- Target: [Y%] of references valid
- Measurement: Weekly automated check

**Knowledge Gap Closure**:
- Current: [N] P0 gaps
- Target: [M] P0 gaps (reduce by [N-M])
- Measurement: Track gap inventory

**Resolution Time**:
- Current: [X] minutes average SEV-1 resolution
- Target: [Y] minutes average SEV-1 resolution
- Measurement: Incident metrics dashboard

Review these metrics at next assessment: [Date]

---

### Follow-Up Schedule

Next scheduled actions:

- 1 week: Review critical action completion
- 1 month: Review high-priority action completion
- 1 quarter: Full operational knowledge health assessment (repeat this process)

Next assessment date: [YYYY-MM-DD]
```

</output-format>

<instructions>
CRITICAL: Operational knowledge decays without regular maintenance. Systematic health assessments catch decay before it impacts incident response.

DO NOT:
- Wait for incidents to reveal knowledge gaps (proactive assessment prevents issues)
- Assess without testing (verify runbook commands actually work)
- Skip cross-reference validation (broken links frustrate responders)
- Ignore resolution time trends (early warning of knowledge degradation)
- Create assessment without action plan (assessment without action is wasted effort)
- Assess in isolation (involve on-call engineers who use knowledge)

ALWAYS:
- Test runbook commands in non-prod (don't assume they still work)
- Validate cross-references automatically (broken links decay quickly)
- Analyze incident trends (what gaps do incidents reveal?)
- Measure resolution time correlation with knowledge availability
- Prioritize gap closure by impact (SEV-1 scenarios first)
- Create actionable recommendations with owners and dates
- Schedule next assessment (quarterly recommended for critical systems)
- Involve on-call engineers in assessment (they know what's missing)

REMEMBER: Operational knowledge is infrastructure. Like any infrastructure, it requires regular maintenance to remain reliable. Assessment without action is theater; assessment with prioritized action prevents future incident pain.
</instructions>

<examples>

## Example: PaymentAPI Operational Knowledge Health Assessment

```
Operational Knowledge Health Assessment

System: PaymentAPI
Scope: Single service (critical payment processing service)
Assessment Period: Last 3 months (2025-11-01 to 2026-02-01)
Assessment Date: 2026-02-01
Assessor: sam-patel (Platform Lead)
Memory Bank Structure: Integrated: memory-bank/operations/

Purpose: Quarterly operational knowledge health review

Assessment Domains:
1. Runbook Currency
2. Cross-Reference Integrity
3. Knowledge Gaps
4. Incident Response Effectiveness
5. Resolution Time Trends
6. Recent Incident Learnings

Review Trigger: Scheduled quarterly review

---

## Domain 1: Runbook Currency

### Runbook Inventory

```bash
ls memory-bank/operations/runbooks/
```

Result:
- database-connection-failure.md
- deployment-procedures.md
- performance-degradation.md
- rollback-procedures.md
- incident-response.md (generic)

Total runbooks: 5
- Critical runbooks (SEV-1 scenarios): 2 (database-connection-failure, incident-response)
- Important runbooks (SEV-2 scenarios): 2 (performance-degradation, rollback-procedures)
- Reference runbooks (SEV-3 scenarios): 1 (deployment-procedures)

---

### Currency Check: database-connection-failure.md

**Basic Information**:
- Scenario: Database connection failures causing payment processing failures
- Severity: SEV-1
- Last updated: 2026-01-16 (updated after recent incident)
- Last reviewed: 2026-01-16
- Age: 2 weeks since last update

**Currency Assessment**:

✓ Commands still valid
  - Test: Executed sample commands in staging environment
  - Result: ✓ All work
  - Details: `kubectl exec`, `pg_isready`, `curl` commands all function as documented

✓ Access procedures current
  - Test: Verified kubectl access, database access, metrics dashboard access
  - Result: ✓ Correct
  - Details: All access instructions accurate

✓ System state matches documentation
  - Test: Compared runbook's description to memory-bank/systemPatterns.md#database-layer
  - Reference: memory-bank/systemPatterns.md
  - Result: ✓ Accurate
  - Details: Recent incident prompted runbook update, now reflects current architecture (connection pool size 50, HikariCP, etc.)

✓ Dependencies still accurate
  - Test: Verified dependency list matches memory-bank/operations/dependencies/operational-dependencies.md
  - Reference: memory-bank/operations/dependencies/operational-dependencies.md#database
  - Result: ✓ Accurate
  - Details: PostgreSQL dependency correctly documented

✓ Contact information current
  - Test: Verified #database-oncall, #platform-oncall Slack channels exist
  - Result: ✓ Current
  - Details: All contact information accurate

✓ Monitoring/dashboards valid
  - Test: Clicked Grafana dashboard links
  - Result: ✓ All valid
  - Details: All dashboard links work, metrics exist

**Recent Usage**:
- Used in incidents: 2026-01-15-database-connection-pool (SEV-1)
- Effectiveness: ✓ Highly effective (guided investigation to root cause in 17 minutes)
- Gaps identified: None (runbook worked perfectly, updated after incident)

**Currency Rating**: ✓ Current

**Action required**: None (recently updated, highly effective)

---

### Currency Check: performance-degradation.md

**Basic Information**:
- Scenario: Performance issues (high latency, throughput degradation)
- Severity: SEV-2
- Last updated: 2025-09-10
- Last reviewed: 2025-09-10
- Age: 5 months since last update

**Currency Assessment**:

⚠ Commands still valid
  - Test: Executed sample commands in staging
  - Result: ⚠ Some deprecated
  - Details:
    - Query latency check: `curl localhost:8080/metrics` → Now should be `localhost:8081/actuator/metrics` (port changed)
    - Profiling command: References old profiling tool → Now use new APM tool

⚠ Access procedures current
  - Test: Verified access instructions
  - Result: ⚠ Partially outdated
  - Details: APM dashboard URL changed (Datadog migration in Dec 2025)

✓ System state matches documentation
  - Test: Compared to memory-bank/systemPatterns.md
  - Result: ✓ Accurate
  - Details: Architecture description still accurate

✓ Dependencies still accurate
  - Test: Verified dependency list
  - Result: ✓ Accurate
  - Details: Dependency list correct

⚠ Contact information current
  - Test: Verified contact info
  - Result: ⚠ Some stale
  - Details: Team Slack channel renamed (#payments-team → #payment-api-team in Jan 2026)

⚠ Monitoring/dashboards valid
  - Test: Clicked dashboard links
  - Result: ⚠ Some broken
  - Details: 2 of 5 dashboard links broken (dashboards reorganized in Datadog migration)

**Recent Usage**:
- Used in incidents: 2026-01-20-api-latency (SEV-2)
- Effectiveness: ⚠ Partially effective (helped identify latency, but missing APM investigation step)
- Gaps identified: Missing step for APM-based investigation (old profiling tool no longer used)

**Currency Rating**: ⚠ Needs minor updates

**Action required**:
- Update commands (metrics port, APM tool) - sam-patel, 2026-02-08
- Update dashboard links - sam-patel, 2026-02-08
- Update contact information - sam-patel, 2026-02-08
- Add APM investigation step - alex-chen, 2026-02-15

---

### Currency Check: deployment-procedures.md

**Basic Information**:
- Scenario: Deployment and rollback procedures
- Severity: SEV-3 (reference, not incident response)
- Last updated: 2025-06-15
- Last reviewed: 2025-06-15
- Age: 8 months since last update

**Currency Assessment**:

✗ Commands still valid
  - Test: Executed sample deployment commands in staging
  - Result: ✗ Major changes needed
  - Details:
    - Deployment uses old manifest files (now use Helm charts as of Nov 2025)
    - Rollback procedure uses manual kubectl (now have automated rollback script)
    - Environment variables specified in wrong format (now use ConfigMaps)

✗ Access procedures current
  - Test: Verified access instructions
  - Result: ✗ Significantly changed
  - Details: CI/CD tool changed (Jenkins → GitHub Actions in Oct 2025)

✗ System state matches documentation
  - Test: Compared to memory-bank/systemPatterns.md
  - Result: ✗ Significant drift
  - Details: Deployment architecture changed significantly (now use Helm, GitOps, automated pipelines)

✓ Dependencies still accurate
  - Test: Verified dependency list
  - Result: ✓ Accurate
  - Details: Core dependencies unchanged

✗ Contact information current
  - Test: Verified contact info
  - Result: ✗ Significantly outdated
  - Details: Platform team contact changed (team reorganized in Dec 2025)

✗ Monitoring/dashboards valid
  - Test: Clicked dashboard links
  - Result: ✗ Many broken
  - Details: Deployment monitoring dashboard completely reorganized

**Recent Usage**:
- Used in incidents: None in assessment period (deployments routine, not incidents)
- Effectiveness: N/A (not used during incidents)
- Gaps identified: Runbook so outdated it's not useful

**Currency Rating**: ✗ Needs major updates

**Action required**:
- Complete rewrite for Helm-based deployments - platform-team, 2026-02-28
- Update to reflect GitHub Actions CI/CD - platform-team, 2026-02-28
- Update contact information - platform-team, 2026-02-28
- Update monitoring dashboard links - platform-team, 2026-02-28

---

### Currency Summary

Total runbooks assessed: 5

Currency breakdown:
- ✓ Current (no updates needed): 2 (40%) [database-connection-failure, incident-response]
- ⚠ Needs minor updates: 2 (40%) [performance-degradation, rollback-procedures]
- ✗ Needs major updates: 1 (20%) [deployment-procedures]
- ⊗ Obsolete: 0 (0%)

Overall currency health: Good (60% current, 40% needs updates)

Priority updates:
1. deployment-procedures.md - Major rewrite needed, outdated by 8 months due to Helm migration - platform-team, 2026-02-28
2. performance-degradation.md - Minor updates for APM tool change - sam-patel/alex-chen, 2026-02-15
3. rollback-procedures.md - Minor updates for automated rollback script - sam-patel, 2026-02-15

Common decay patterns observed:
- Tool migrations (Datadog, APM, GitHub Actions) not reflected in runbooks
- Dashboard reorganizations broke links
- Team reorganizations made contact info stale
- Port changes (8080 → 8081) not updated

Systemic improvements needed:
- Automated link checking in CI (catch broken dashboard links)
- Runbook review trigger on major tool migrations (Helm, APM, etc.)
- Quarterly runbook review schedule (prevent 8-month staleness)

---

## Domain 2: Cross-Reference Integrity

### Forward References: Operations → Development

```bash
grep -r "memory-bank/" memory-bank/operations/ -n | head -20
```

Total references found: 43

Sample verification (checked 20 references):

| Source Document | Target Document | Status | Issue |
|-----------------|-----------------|--------|-------|
| runbooks/database-connection-failure.md:15 | memory-bank/systemPatterns.md#database-layer | ✓ Valid | - |
| runbooks/database-connection-failure.md:18 | memory-bank/systemPatterns.md#connection-management | ✓ Valid | - |
| incidents/2026-01-15-db-conn-pool.md:45 | memory-bank/systemPatterns.md#connection-management | ✓ Valid | - |
| postmortems/2026-01-15-postmortem.md:80 | memory-bank/systemPatterns.md#database-layer | ✓ Valid | - |
| runbooks/performance-degradation.md:25 | memory-bank/systemPatterns.md#api-architecture | ✓ Valid | - |
| runbooks/performance-degradation.md:40 | memory-bank/techContext.md#observability | ⚠ Warning | Section renamed to #monitoring-tools |
| dependencies/operational-dependencies.md:20 | memory-bank/techContext.md#database-stack | ✗ Broken | Section doesn't exist |

Integrity assessment:
- ✓ Valid references: 17 (85%)
- ⚠ Working but warnings (section moved/renamed): 2 (10%)
- ✗ Broken references (404, section doesn't exist): 1 (5%)

Forward reference health: Good (85% valid, 15% need attention)

Issues to fix:
1. memory-bank/operations/dependencies/operational-dependencies.md:20 → memory-bank/techContext.md#database-stack (broken)
   - Fix: Update to #database-infrastructure (section renamed in Nov 2025)
   - Owner: sam-patel, 2026-02-08

2. memory-bank/operations/runbooks/performance-degradation.md:40 → memory-bank/techContext.md#observability (warning)
   - Fix: Update to #monitoring-tools (section renamed)
   - Owner: sam-patel, 2026-02-08

---

### Backward References: Development → Operations

```bash
grep -r "operations/" memory-bank/ -n
```

Total references found: 15

Sample verification:

| Source Document | Target Document | Status | Issue |
|-----------------|-----------------|--------|-------|
| memory-bank/systemPatterns.md:120 | operations/runbooks/database-connection-failure.md | ✓ Valid | - |
| memory-bank/systemPatterns.md:125 | operations/runbooks/deployment-procedures.md | ✓ Valid | - |
| memory-bank/systemPatterns.md:250 | operations/performance/baseline-metrics.md | ✓ Valid | - |
| memory-bank/systemPatterns.md:280 | operations/dependencies/operational-dependencies.md | ✓ Valid | - |

Integrity assessment:
- ✓ Valid references: 15 (100%)
- ⚠ Working but warnings: 0 (0%)
- ✗ Broken references: 0 (0%)

Backward reference health: Excellent (100% valid)

---

### Bidirectional Completeness

Tested 10 reference pairs:

**Example: Database architecture ↔ Database runbook**

Forward (architecture → runbook):
- memory-bank/systemPatterns.md#database-layer references operations/runbooks/database-connection-failure.md
- Status: ✓ Present

Backward (runbook → architecture):
- operations/runbooks/database-connection-failure.md references memory-bank/systemPatterns.md#database-layer
- Status: ✓ Present

Bidirectional: ✓ Complete

Test cases checked: 10
- ✓ Bidirectional: 9 (90%)
- ⊘ Unidirectional (reference exists one way only): 1 (10%)
- ✗ No connection (should be linked but isn't): 0 (0%)

Unidirectional case:
- memory-bank/systemPatterns.md#api-gateway → operations/performance/baseline-metrics.md (forward exists)
- operations/performance/baseline-metrics.md does NOT reference api-gateway section (backward missing)
- Action: Add backward reference - alex-chen, 2026-02-15

Bidirectional completeness: Excellent (90% bidirectional)

---

### Cross-Reference Action Items

Broken references to fix:
1. operations/dependencies/operational-dependencies.md:20 → techContext.md#database-stack: Update to #database-infrastructure - sam-patel, 2026-02-08

Warnings to address:
1. operations/runbooks/performance-degradation.md:40 → techContext.md#observability: Update to #monitoring-tools - sam-patel, 2026-02-08

Missing bidirectional references to add:
1. operations/performance/baseline-metrics.md ↔ systemPatterns.md#api-gateway: Add backward reference - alex-chen, 2026-02-15

Systemic improvements:
- Implement weekly automated link checker (CI job testing all internal links) - sam-patel, 2026-03-01

---

## Domain 3: Knowledge Gaps

### Incident-Driven Gap Analysis

Incidents in assessment period: 5

---

#### Incident: 2026-01-15-database-connection-pool

**Basic Information**:
- Date: 2026-01-15
- System: PaymentAPI
- Severity: SEV-1
- Duration: 24 minutes
- Root cause: Connection leak in payment validation code

**Knowledge Gap Analysis**:

✓ Was runbook available for this scenario?
  - Result: ✓ Yes (database-connection-failure.md)

✗ Was past incident documentation available for similar scenario?
  - Result: ✗ No (first occurrence of this failure mode)
  - Gap: No historical precedent for connection leak scenario
  - Priority: Low (now documented, won't be gap for future)

✓ Were dependencies documented accurately?
  - Result: ✓ Yes

✗ Was performance baseline documented?
  - Result: ✗ No (connection pool utilization baseline not documented)
  - Gap: Connection pool utilization baseline missing (made comparison during incident difficult)
  - Priority: High (SEV-1 scenario, would accelerate diagnosis)

✗ Was failure mode documented?
  - Result: ✗ No (connection leak failure mode not documented)
  - Gap: Connection leak failure mode not in systemPatterns.md or runbook
  - Priority: High (SEV-1 scenario, responders were surprised)

✓ Were debugging commands/procedures documented?
  - Result: ✓ Yes (runbook had excellent debugging procedures)

**Gaps identified for this incident**: 3
**Highest priority gap**: Connection pool utilization baseline missing

---

#### Incident: 2026-01-20-api-latency

**Basic Information**:
- Date: 2026-01-20
- System: PaymentAPI
- Severity: SEV-2
- Duration: 38 minutes
- Root cause: Database slow query (missing index)

**Knowledge Gap Analysis**:

✓ Was runbook available for this scenario?
  - Result: ⚠ Partially (performance-degradation.md existed but incomplete)
  - Gap: Runbook missing APM-based investigation step
  - Priority: Medium (SEV-2 scenario, would have saved ~5 minutes)

✓ Was past incident documentation available for similar scenario?
  - Result: ✓ Yes (similar slow query incident in 2025-11)

✓ Were dependencies documented accurately?
  - Result: ✓ Yes

✓ Was performance baseline documented?
  - Result: ✓ Yes (API latency baseline existed)

⚠ Was failure mode documented?
  - Result: ⚠ Partially (slow query failure mode documented, but not index-related)
  - Gap: Missing index failure mode not specifically documented
  - Priority: Low (covered by general slow query guidance)

⚠ Were debugging commands/procedures documented?
  - Result: ⚠ Partially (database query investigation documented, but APM usage not documented)
  - Gap: APM-based latency investigation not in runbook
  - Priority: Medium (SEV-2 scenario)

**Gaps identified for this incident**: 2
**Highest priority gap**: APM investigation procedure missing from runbook

---

#### Incident: 2026-01-25-auth-503

**Basic Information**:
- Date: 2026-01-25
- System: AuthService (upstream dependency)
- Severity: SEV-1
- Duration: 60 minutes
- Root cause: AuthService capacity exceeded

**Knowledge Gap Analysis**:

✗ Was runbook available for this scenario?
  - Result: ✗ No (no runbook for AuthService dependency failure)
  - Gap: No runbook for upstream AuthService failures
  - Priority: High (SEV-1 scenario, responders investigated from scratch)

✗ Was past incident documentation available for similar scenario?
  - Result: ✗ No (first occurrence)
  - Gap: No historical precedent
  - Priority: Low (now will be documented)

⚠ Were dependencies documented accurately?
  - Result: ⚠ Partially (AuthService listed as dependency, but failure modes not documented)
  - Gap: AuthService dependency failure modes not documented
  - Priority: High (SEV-1 scenario, unexpected behavior)

✗ Was performance baseline documented?
  - Result: ✗ No (no AuthService performance baseline from PaymentAPI perspective)
  - Gap: No baseline for AuthService latency/error rate
  - Priority: Medium (would help detect AuthService issues faster)

✗ Was failure mode documented?
  - Result: ✗ No (AuthService capacity exhaustion not documented as PaymentAPI failure mode)
  - Gap: Upstream dependency capacity exhaustion not documented
  - Priority: High (SEV-1 scenario, cascading failure unexpected)

✗ Were debugging commands/procedures documented?
  - Result: ✗ No (no procedure for investigating upstream dependency health)
  - Gap: No debugging procedure for upstream dependencies
  - Priority: High (SEV-1 scenario, wasted time figuring out investigation approach)

**Gaps identified for this incident**: 6
**Highest priority gap**: No runbook for upstream dependency failures

---

### Gap Inventory

Total unique gaps identified: 11 across 5 incidents

#### Gap Category: Missing Runbooks

Scenarios lacking runbooks:
1. Upstream dependency (AuthService) failures: Identified in 2026-01-25-auth-503, SEV-1, 60-minute resolution
   - Priority: P0 (Critical) - SEV-1 scenario, high impact, likely to recur
2. Cache invalidation failures: Identified in 2026-01-18-cache-invalidation, SEV-2, 45-minute resolution
   - Priority: P1 (High) - SEV-2 scenario, medium recurrence

Priority: 2 high-priority missing runbooks

---

#### Gap Category: Undocumented Failure Modes

Failure modes that surprised responders:
1. Connection leak exhausting connection pool: PaymentAPI, 2026-01-15-db-conn-pool
   - Why unexpected: Design assumed try-with-resources pattern universally followed
   - Where to document: memory-bank/systemPatterns.md#connection-management + database-connection-failure runbook
   - Priority: P0 (Critical) - SEV-1, now documented but should be in architecture

2. Upstream dependency capacity exhaustion causing cascading failure: PaymentAPI → AuthService, 2026-01-25-auth-503
   - Why unexpected: Assumed AuthService had sufficient capacity, no documented failure mode
   - Where to document: memory-bank/systemPatterns.md#dependencies + operational-dependencies.md
   - Priority: P0 (Critical) - SEV-1, major gap

Priority: 2 high-priority undocumented failure modes

---

#### Gap Category: Missing Performance Baselines

Metrics lacking documented baselines:
1. Connection pool utilization: PaymentAPI, 2026-01-15-db-conn-pool couldn't compare to baseline
   - Where to document: memory-bank/operations/performance/baseline-metrics.md
   - Priority: P0 (Critical) - SEV-1 scenario, would accelerate diagnosis

2. AuthService latency/error rate: PaymentAPI, 2026-01-25-auth-503 couldn't detect AuthService degradation early
   - Where to document: memory-bank/operations/performance/baseline-metrics.md
   - Priority: P1 (High) - SEV-1 scenario, early warning signal

Priority: 2 high-priority missing baselines

---

#### Gap Category: Incomplete Dependency Documentation

Dependencies not accurately documented:
1. AuthService failure modes: PaymentAPI, 2026-01-25-auth-503
   - What was missing: How AuthService fails, capacity limits, degradation patterns
   - Where to document: memory-bank/operations/dependencies/operational-dependencies.md#authservice
   - Priority: P0 (Critical) - SEV-1, major dependency

Priority: 1 high-priority dependency gap

---

#### Gap Category: Missing Debugging Procedures

Investigation approaches not documented:
1. APM-based latency investigation: PaymentAPI, 2026-01-20-api-latency
   - What responders had to figure out: How to use new APM tool for latency diagnosis
   - Where to document: performance-degradation.md runbook
   - Priority: P1 (High) - SEV-2, would save time

2. Upstream dependency health investigation: PaymentAPI, 2026-01-25-auth-503
   - What responders had to figure out: How to investigate upstream service health, who to contact, what metrics to check
   - Where to document: New runbook for dependency failures
   - Priority: P0 (Critical) - SEV-1, significant time wasted

Priority: 2 high-priority missing procedures

---

### Gap Prioritization

All gaps ranked by priority:

| Gap | Category | System | Severity Impact | Recurrence Likelihood | Priority |
|-----|----------|--------|-----------------|----------------------|----------|
| Upstream dependency failure runbook | Missing runbook | PaymentAPI | SEV-1 | High (quarterly) | P0 (Critical) |
| Upstream dependency failure modes | Undocumented failure | PaymentAPI | SEV-1 | High (quarterly) | P0 (Critical) |
| AuthService dependency docs | Incomplete dependency | PaymentAPI | SEV-1 | High (quarterly) | P0 (Critical) |
| Connection pool utilization baseline | Missing baseline | PaymentAPI | SEV-1 | Medium (happened once) | P0 (Critical) |
| Upstream dependency investigation procedure | Missing procedure | PaymentAPI | SEV-1 | High (quarterly) | P0 (Critical) |
| Connection leak failure mode docs | Undocumented failure | PaymentAPI | SEV-1 | Low (now prevented) | P1 (High) |
| AuthService baseline | Missing baseline | PaymentAPI | SEV-1 | High (quarterly) | P1 (High) |
| APM investigation procedure | Missing procedure | PaymentAPI | SEV-2 | Medium (monthly) | P1 (High) |
| Cache invalidation runbook | Missing runbook | PaymentAPI | SEV-2 | Medium (monthly) | P1 (High) |

Total gaps: 9
- P0 (Critical): 5 gaps
- P1 (High): 4 gaps
- P2 (Medium): 0 gaps

Gap closure plan:
- P0 gaps: Close within 1 week
- P1 gaps: Close within 1 month

Action items:
1. Create upstream dependency failure runbook - alex-chen, 2026-02-08, TICKET-001
2. Document AuthService dependency failure modes - alex-chen, 2026-02-08, TICKET-002
3. Document connection pool utilization baseline - sam-patel, 2026-02-08, TICKET-003
4. Document upstream dependency investigation procedure in new runbook - alex-chen, 2026-02-08, TICKET-001 (same)
5. Document connection leak failure mode in architecture - casey-brown, 2026-02-15, TICKET-004
6. Document AuthService performance baseline - sam-patel, 2026-02-15, TICKET-005
7. Add APM investigation procedure to performance runbook - alex-chen, 2026-02-15, TICKET-006
8. Create cache invalidation runbook - jordan-williams, 2026-02-28, TICKET-007

---

## Domain 4: Incident Response Effectiveness

### Runbook Usage Analysis

#### Incidents Using Runbooks (3 incidents)

| Incident | Runbook Used | Effective? | Time Saved | Gaps Found |
|----------|--------------|------------|------------|------------|
| 2026-01-15-db-conn | database-connection-failure.md | ✓ Yes | ~10-15 min | None (runbook perfect) |
| 2026-01-20-api-latency | performance-degradation.md | ⚠ Partial | ~5 min | Missing APM investigation step |
| 2026-01-10-deployment-issue | deployment-procedures.md | ✗ No | 0 min | Runbook outdated (Helm migration) |

Runbook effectiveness:
- ✓ Highly effective: 1 (33%)
- ⚠ Partially effective: 1 (33%)
- ✗ Not effective: 1 (33%)

Time saved by runbooks:
- Total time saved: 15-20 minutes across 3 incidents
- Average time saved per incident: ~7 minutes
- Value: Effective runbooks save 10-15 minutes per incident

Runbook improvements identified:
1. performance-degradation.md: Add APM investigation procedure (gap found in 2026-01-20)
2. deployment-procedures.md: Complete rewrite for Helm (so outdated it wasn't useful in 2026-01-10)

---

#### Incidents Without Runbooks (2 incidents)

| Incident | Scenario | Severity | Time to Resolve | Runbook Needed? |
|----------|----------|----------|-----------------|-----------------|
| 2026-01-25-auth-503 | Upstream dependency failure (AuthService) | SEV-1 | 60 min | ✓ Yes (critical) |
| 2026-01-18-cache-invalidation | Cache invalidation failures | SEV-2 | 45 min | ✓ Yes (important) |

Impact of missing runbooks:
- Average resolution time with runbook: 30 minutes (2026-01-15)
- Average resolution time without runbook: 53 minutes ((60+45)/2)
- Delta: 23 minutes additional time without runbook

New runbooks needed (prioritized):
1. Upstream dependency failures - SEV-1, quarterly frequency, 60 min avg without runbook → ~20 min with runbook (est.)
2. Cache invalidation - SEV-2, monthly frequency, 45 min avg → ~25 min with runbook (est.)

---

### Past Incident Documentation Usage

```bash
grep -r "Similar to\|Related incident" memory-bank/operations/incidents/ | wc -l
```

Result: 2 of 5 incidents (40%) referenced past incidents

Incidents referencing past incidents:
- 2026-01-20-api-latency: Referenced 2025-11-10-slow-queries (similar slow query incident)
  - Benefit: Resolution approach from past incident worked (add index)
  - Time saved: ~10 minutes (didn't have to rediscover solution)

Effectiveness of past incident references:
- Accelerated resolution: 1 incident benefited significantly
- Time saved: ~10 minutes per incident when past precedent exists

Improvement: Past incident usage is moderate (40%). Improve discoverability:
- Add incident index/search capability
- Link similar incidents more explicitly in postmortems
- Train on-call engineers to search past incidents during investigation

---

### Architecture Documentation Usage

```bash
grep -r "memory-bank/systemPatterns.md\|memory-bank/techContext.md" memory-bank/operations/incidents/ | wc -l
```

Result: 4 of 5 incidents (80%) referenced architecture

Effectiveness:
- Architecture context helped: 3 incidents (understanding system behavior, connection pool design, dependency relationships)
- Architecture revealed assumptions: 1 incident (connection leak violated design assumption about try-with-resources)

Architecture documentation is highly valuable and well-used.

---

### Knowledge Accessibility During Incidents

□ Can on-call engineers find relevant runbooks within 1 minute?
  - Test: Simulated incident, timed runbook location
  - Result: ✓ Yes (runbooks organized by scenario, clear naming)

□ Are cross-references easy to follow?
  - Test: Followed cross-reference chain from runbook → architecture → dependencies
  - Result: ⚠ Sometimes (2 broken links found, otherwise good)

□ Is knowledge in actionable format (commands, not just concepts)?
  - Test: Reviewed runbooks for command specificity
  - Result: ✓ Yes (runbooks have specific commands with expected output)

□ Are performance baselines easy to compare against?
  - Test: During incident, how long to find baseline for metric?
  - Result: ⚠ 2-3 minutes (baselines exist but not always easy to find quickly)
  - Improvement: Add baselines to incident investigation dashboard

Overall accessibility: Good (mostly accessible, minor friction points)

Action items to improve accessibility:
1. Fix 2 broken cross-reference links - sam-patel, 2026-02-08
2. Add baselines to incident investigation dashboard - sam-patel, 2026-02-28

---

## Domain 5: Resolution Time Trends

### Incident Resolution Time Data

| Incident | Date | Severity | Time to Resolve | Runbook Used | Knowledge Gap |
|----------|------|----------|-----------------|--------------|---------------|
| INC-001 | 2026-01-10 | SEV-2 | 35 min | ✗ No (outdated) | Deployment runbook outdated |
| INC-002 | 2026-01-15 | SEV-1 | 24 min | ✓ Yes | None |
| INC-003 | 2026-01-18 | SEV-2 | 45 min | ✗ No | Missing cache invalidation runbook |
| INC-004 | 2026-01-20 | SEV-2 | 38 min | ⚠ Partial | APM investigation missing |
| INC-005 | 2026-01-25 | SEV-1 | 60 min | ✗ No | Missing dependency failure runbook |

Total incidents: 5
Average resolution time: 40.4 minutes
Median resolution time: 38 minutes

---

### Trend Analysis

**Current period (Last 3 months)**:
- Average resolution time: 40.4 minutes
- Median resolution time: 38 minutes
- SEV-1 average: 42 minutes ((24+60)/2)
- SEV-2 average: 39.3 minutes ((35+45+38)/3)

**Previous period (3 months before)**:
- Average resolution time: 32 minutes
- Median resolution time: 30 minutes
- SEV-1 average: 28 minutes
- SEV-2 average: 34 minutes

**Change**:
- Average: +8.4 minutes (+26% increase)
- Median: +8 minutes (+27% increase)
- SEV-1: +14 minutes (+50% increase) ← SIGNIFICANT DEGRADATION
- SEV-2: +5.3 minutes (+16% increase)

Trend: ✗ Degrading (slower resolution, especially SEV-1)

---

### Correlation: Knowledge Quality ↔ Resolution Time

**Incidents with effective runbooks**:
- Count: 1 (2026-01-15)
- Average resolution time: 24 minutes

**Incidents without runbooks or with ineffective runbooks**:
- Count: 4 (2026-01-10, 2026-01-18, 2026-01-20, 2026-01-25)
- Average resolution time: 44.5 minutes

**Delta**: 20.5 minutes (85% slower without effective runbook)

Statistical significance: Significant (large delta, consistent pattern)

**Incidents with documented past similar incidents**:
- Count: 1 (2026-01-20)
- Average resolution time: 38 minutes

**Incidents without past precedent**:
- Count: 4
- Average resolution time: 41 minutes

**Delta**: 3 minutes (7% slower without precedent) - Less significant than runbook impact

---

### Trend Drivers

Why degrading?

✗ Knowledge gaps accumulating
- 2 critical runbooks missing (dependency failures, cache invalidation)
- 1 runbook outdated and ineffective (deployment-procedures)
- 5 undocumented failure modes
- Result: 80% of incidents lacked effective runbook (4 of 5)

✗ New failure modes
- 2 novel failure modes in period (connection leak, AuthService capacity exhaustion)
- Both SEV-1, no runbooks, long resolution times

⚠ Runbook currency declining
- 1 runbook so outdated it was useless (deployment-procedures, 8 months stale)
- 1 runbook partially outdated (performance-degradation, 5 months stale)

System complexity increasing:
- New dependency (AuthService) introduced without operational knowledge
- New APM tool introduced without updating runbooks

Action items to reverse degradation:
1. Close 5 P0 knowledge gaps (expected impact: -15 minutes per SEV-1) - Various owners, 2026-02-08
2. Update 2 outdated runbooks (expected impact: -5 minutes per incident) - Various owners, 2026-02-15
3. Quarterly runbook reviews (prevent future decay) - sam-patel, ongoing

---

### Resolution Time Targets

**Current performance**:
- SEV-1 average: 42 minutes
- SEV-2 average: 39 minutes

**Targets for next quarter**:
- SEV-1 target: 25 minutes (40% improvement)
- SEV-2 target: 30 minutes (23% improvement)

**How to achieve targets**:
- Close 5 P0 knowledge gaps (expected impact: -15 min per SEV-1, -10 min per SEV-2)
- Update 2 critical runbooks (expected impact: -5 min per incident)
- Quarterly knowledge health reviews (prevent decay)

Target review date: 2026-05-01 (next quarterly assessment)

---

## Assessment Summary and Recommendations

### Overall Health Rating

| Domain | Rating | Key Issues | Priority Actions |
|--------|--------|------------|------------------|
| Runbook Currency | Good | 1 runbook outdated (deployment), 1 partially outdated (performance) | Rewrite deployment runbook, update performance runbook |
| Cross-Reference Integrity | Excellent | 2 broken links (minor) | Fix 2 broken links |
| Knowledge Gaps | Poor | 5 P0 gaps, 4 P1 gaps (9 total) | Close 5 P0 gaps within 1 week |
| Incident Response Effectiveness | Fair | 80% of incidents lacked effective runbook | Create 2 critical missing runbooks |
| Resolution Time Trends | Degrading | +26% slower (especially SEV-1 +50%) | Reverse degradation via gap closure |

**Overall operational knowledge health**: Fair

Overall health rating rationale:
- Currency: Good (60% current, but critical runbooks need updates)
- Cross-references: Excellent (95% valid, minor issues)
- Gaps: Poor (9 significant gaps, 5 critical)
- Effectiveness: Fair (runbooks effective when they exist, but coverage gaps)
- Trends: Degrading (resolution times increasing due to knowledge gaps)

Primary issue: Knowledge gaps accumulating faster than being closed, degrading incident response effectiveness.

---

### Critical Actions (Within 1 Week)

P0 actions addressing most critical gaps:

1. **Create upstream dependency failure runbook**
   - Issue: No runbook for AuthService or other upstream dependency failures
   - Impact: 2026-01-25-auth-503 took 60 minutes (would have been ~30 min with runbook)
   - Owner: alex-chen
   - Due date: 2026-02-08
   - Tracking: TICKET-001
   - Success criteria: Runbook covers upstream dependency investigation, failure modes, escalation

2. **Document AuthService dependency failure modes and baselines**
   - Issue: AuthService dependency not adequately documented (failure modes, capacity, baselines)
   - Impact: Failure surprised responders, no baseline to detect early
   - Owner: alex-chen
   - Due date: 2026-02-08
   - Tracking: TICKET-002
   - Success criteria: operational-dependencies.md documents AuthService failure modes, baseline-metrics.md has AuthService latency/error rate baselines

3. **Document connection pool utilization baseline**
   - Issue: No baseline for connection pool utilization
   - Impact: 2026-01-15 couldn't quickly compare to baseline
   - Owner: sam-patel
   - Due date: 2026-02-08
   - Tracking: TICKET-003
   - Success criteria: baseline-metrics.md documents connection pool normal range (5-12 active, warning >35, critical >45)

4. **Fix 2 broken cross-reference links**
   - Issue: 2 broken links frustrate responders during incidents
   - Impact: Minor friction, but compounds under pressure
   - Owner: sam-patel
   - Due date: 2026-02-08
   - Tracking: TICKET-008
   - Success criteria: All cross-references valid (100%)

5. **Document connection leak failure mode in architecture**
   - Issue: Connection leak failure mode not documented in systemPatterns.md
   - Impact: Responders surprised by failure mode
   - Owner: casey-brown
   - Due date: 2026-02-08
   - Tracking: TICKET-004
   - Success criteria: systemPatterns.md#connection-management documents connection leak failure mode, prevention (try-with-resources), detection (leak warnings)

---

### High-Priority Actions (Within 1 Month)

P1 actions addressing important gaps:

1. **Update performance-degradation.md runbook**
   - Issue: Runbook outdated (old metrics port, missing APM investigation)
   - Impact: Partially effective in 2026-01-20, saved ~5 min but could have saved more
   - Owner: alex-chen
   - Due date: 2026-02-15
   - Tracking: TICKET-006
   - Success criteria: Runbook updated with APM investigation procedure, correct metrics endpoints

2. **Document AuthService performance baseline**
   - Issue: No baseline for AuthService from PaymentAPI perspective
   - Impact: Can't detect AuthService degradation early
   - Owner: sam-patel
   - Due date: 2026-02-15
   - Tracking: TICKET-005
   - Success criteria: baseline-metrics.md documents AuthService latency/error rate baselines

3. **Create cache invalidation runbook**
   - Issue: No runbook for cache invalidation scenarios
   - Impact: 2026-01-18-cache-invalidation took 45 min without runbook
   - Owner: jordan-williams
   - Due date: 2026-02-28
   - Tracking: TICKET-007
   - Success criteria: Runbook covers cache invalidation investigation, resolution

4. **Rewrite deployment-procedures.md runbook**
   - Issue: Runbook completely outdated (pre-Helm, 8 months stale)
   - Impact: Not useful during 2026-01-10 incident
   - Owner: platform-team
   - Due date: 2026-02-28
   - Tracking: TICKET-009
   - Success criteria: Runbook reflects Helm-based deployment, GitHub Actions CI/CD, current procedures

---

### Systemic Improvements

Long-term initiatives to prevent decay:

1. **Automated cross-reference checking**
   - Initiative: Weekly CI job validating all internal links
   - Purpose: Catch broken cross-references immediately (prevent 2 broken links from persisting)
   - Effort: 2 days (implement link checker, integrate CI)
   - Owner: sam-patel
   - Timeline: 2026-03-01

2. **Quarterly operational knowledge health reviews**
   - Initiative: Scheduled comprehensive assessment every quarter
   - Purpose: Proactive maintenance, catch decay early (prevent 8-month staleness)
   - Effort: 1 day per quarter
   - Owner: sam-patel (facilitator), rotate assessor
   - Timeline: Next review 2026-05-01

3. **Runbook review trigger on major tool/architecture changes**
   - Initiative: Process to trigger runbook review when tools/architecture change significantly
   - Purpose: Prevent runbooks becoming outdated due to migrations (Helm, APM, etc.)
   - Effort: Process documentation, team training (1 day)
   - Owner: morgan-lee (engineering manager)
   - Timeline: 2026-03-15

---

### Success Metrics

How to measure improvement over next period:

**Knowledge Currency**:
- Current: 60% of runbooks current
- Target: 90% of runbooks current
- Measurement: Next quarterly assessment (2026-05-01)

**Cross-Reference Integrity**:
- Current: 95% of references valid
- Target: 100% of references valid (automated checking)
- Measurement: Weekly automated check

**Knowledge Gap Closure**:
- Current: 9 gaps (5 P0, 4 P1)
- Target: 0 P0 gaps, <2 P1 gaps
- Measurement: Track gap inventory weekly

**Resolution Time**:
- Current: SEV-1 average 42 minutes, SEV-2 average 39 minutes
- Target: SEV-1 average 25 minutes, SEV-2 average 30 minutes
- Measurement: Incident metrics dashboard (continuous)

**Runbook Effectiveness**:
- Current: 33% highly effective, 33% partially effective, 33% not effective
- Target: >80% highly effective
- Measurement: Post-incident runbook effectiveness rating

Review these metrics at next assessment: 2026-05-01

---

### Follow-Up Schedule

Next scheduled actions:

- 1 week (2026-02-08): Review P0 critical action completion (5 actions)
- 1 month (2026-03-01): Review P1 high-priority action completion (4 actions), assess systemic improvement progress
- 1 quarter (2026-05-01): Full operational knowledge health assessment (repeat this process)

Next assessment date: 2026-05-01
```

Why this works:
- Systematic assessment across 5 domains (currency, cross-references, gaps, effectiveness, trends)
- Quantitative metrics (%, counts, time trends) not just qualitative assessment
- Evidence-based (tested runbook commands, validated links, analyzed incidents)
- Prioritized action items (P0/P1 based on severity and impact)
- Owned and dated (accountability for improvements)
- Trend analysis (detecting degradation before it's critical)
- Root cause focus (why are gaps accumulating? Why is resolution time increasing?)
- Systemic improvements (prevent future decay, not just fix current issues)

This assessment reveals:
- Operational knowledge health is Fair (degrading trend, significant gaps)
- Primary issue: Knowledge gaps accumulating (5 P0, 4 P1 gaps)
- Resolution time degrading +26% (SEV-1 +50%) due to knowledge gaps
- Runbooks effective when they exist (10-15 min time saved) but coverage gaps (80% of incidents lacked effective runbook)
- Action plan: Close 5 P0 gaps within 1 week, 4 P1 gaps within 1 month, implement systemic improvements to prevent decay

This transforms operational knowledge from reactive (fix after incident) to proactive (prevent knowledge decay).

</examples>
