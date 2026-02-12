---
# === Identity ===
id: diagnose-adoption-obstacles
name: Diagnose and resolve adoption obstacles systematically
version: v1

# === Classification ===
chapter: 9
category: adoption
subcategory: adoption
tags:
  - adoption-obstacles
  - root-cause-analysis
  - obstacle-resolution
  - challenge-diagnosis
  - solution-patterns
  - context-adaptation
  - adoption-debugging

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Diagnose and resolve adoption obstacles systematically.
    Identify specific adoption challenges, diagnose root causes, match to proven solutions, create action plans—removing friction and enabling successful adoption despite real obstacles teams face.
  argument-hint: "[team_name] [obstacle_description] [memory_bank_location]"
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
  - name: team_name
    description: Team experiencing adoption challenges
    example: "PaymentAPI Team"
    maps-to: "$0"
  - name: obstacle_description
    description: What's making adoption hard
    example: "Team not using memory bank"
    maps-to: "$1"
  - name: memory_bank_location
    description: Where team memory bank lives
    example: "memory-bank/"
    maps-to: "$2"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/diagnose-adoption-obstacles
  marketplace:
    plugin: constellize-adoption

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Diagnose {{team_name}} adoption obstacles by identifying specific challenges team facing, diagnosing root causes (not just symptoms), matching obstacles to solution patterns, creating action plan for addressing obstacles, adapting Constellize practices to team context, measuring progress on adoption goals, celebrating early wins and momentum—removing friction from adoption path and enabling successful team adoption despite real obstacles.
</task>

<context>
Team: {{team_name}}
Challenge: {{obstacle_description}}
Location: {{memory_bank_location}}

Adoption obstacles are normal and expected. Common obstacles:
1. "Doesn't feel necessary"—insufficient early wins
2. "Too much upfront"—complexity perception
3. "Documentation gets outdated"—maintenance perception
4. "Not time"—prioritization challenge
5. "Doesn't fit our process"—adaptation needed

Diagnosing obstacles well:
- Separate symptoms from root causes
- Find solutions proven for this obstacle
- Adapt practices to team context
- Measure progress

Connects to Chapter 9 theme: Use frustration as debugging information, not failure.
</context>

<thinking>
Before diagnosing obstacles:
1. What's the obstacle (specific, observable)?
2. Why is team experiencing this (root cause)?
3. Is this normal friction (keep going) or blocking issue (fix)?
4. What adaptations might help?
5. How to measure progress?
</thinking>

<output-format>

## Obstacle Diagnosis Pattern

```
# Adoption Obstacle Diagnosis: {{team_name}}

Team: {{team_name}}
Challenge: {{obstacle_description}}
Diagnosis Date: [YYYY-MM-DD]
Diagnosed By: [Names]

## Obstacle Identification

**What team is experiencing:**
- [Observable symptom 1]
- [Observable symptom 2]
- [Observable symptom 3]

**How it manifests:**
- [When people encounter this]
- [What they do instead]

**How it affects adoption:**
- [Impact on team usage]
- [Impact on value realization]

## Root Cause Analysis

### Possible Root Causes

Hypothesis 1: [Possible cause]
- Evidence: [What suggests this]
- Severity: [HIGH / MEDIUM / LOW]
- Frequency: [Always / Sometimes / Rarely]

Hypothesis 2: [Possible cause]
- Evidence: [What suggests this]
- Severity: [HIGH / MEDIUM / LOW]

Most likely: [Which cause is most probable]
- Reasoning: [Why this cause most likely]

## Obstacle Pattern Matching

**This obstacle matches pattern: [Pattern name]**
- Description: [What this pattern is]
- Why it applies: [How this matches]
- Solution patterns available: [Options]

## Solution Adaptation

### Solution 1: [Potential solution]

**What it involves:**
- [Specific change]
- [Specific change]

**How it addresses obstacle:**
- [How this solves root cause]
- [Why this should work]

**Effort:** [LOW / MEDIUM / HIGH]
**Timeline:** [When to implement]
**Owner:** [Who leads]

### Solution 2: [Potential solution]
- [Same structure]

**Chosen Solution:** [Which solution(s) to pursue]
- Rationale: [Why these]
- Expected impact: [What should improve]

## Action Plan

### Immediate Actions

Action 1: [What to do now]
- Owner: [Name]
- Timeline: [When]
- Success: [How we'll know it worked]

### Medium-term Adaptations

Adaptation 1: [How we'll adjust practices]
- Current: [How we do it now]
- Evolved: [How we'll change it]
- Timeline: [When to try]

### Measurement and Progress

Metrics to track:
- [Metric 1]: [Baseline → Target]
- [Metric 2]: [Baseline → Target]

Check-in schedule: [When to review progress]

## Example: "Team Not Updating Memory Bank"

```markdown
# Adoption Obstacle: Memory Bank Updates Lapsing

Team: PaymentAPI
Challenge: Memory bank not being updated regularly (no updates in 2 weeks)
Diagnosis Date: 2026-02-01

---

## Obstacle Identification

**What team experiencing:**
- No memory bank updates for 2 weeks despite new patterns discovered
- Updates only happen after sprint retrospective (not during work)
- Junior engineers don't know what to document

**Manifestation:**
- During sprint: Questions not answered by memory bank
- Post-sprint: Retrospective suggests "we should add X," added later (or not)
- Outcome: Documentation always behind reality

**Impact on adoption:**
- Memory bank perceived as "historical record," not "current reference"
- Team doesn't trust it, doesn't check it
- Adoption stalling

---

## Root Cause Analysis

Hypothesis 1: Updates feel like homework (not part of real work)
- Evidence: Updates only in dedicated "documentation time" (post-sprint)
- Severity: HIGH
- Frequency: Always

Hypothesis 2: Unclear who updates what
- Evidence: Junior engineer asked "can I update?" → felt like special task
- Severity: MEDIUM
- Frequency: Sometimes

Hypothesis 3: Too much process overhead
- Evidence: Updates require code review, PR, approval
- Severity: MEDIUM
- Frequency: Sometimes

**Most likely root cause:** Hypothesis 1
- Updates feel separate from real work, not integrated
- Happens in dedicated time, not naturally during development
- Perceived as additional burden

---

## Obstacle Pattern

**Pattern name:** Documentation maintenance burden

**Description:** Documentation feels like housekeeping chore, not integral to work

**Why it applies:** Team treats memory bank updates as "separate work" rather than "part of developing"

**Solution patterns available:**
- Pattern A: Integrate updates into code review process
- Pattern B: Make updates part of Definition of Done
- Pattern C: Dedicate one person to update immediately after discovery
- Pattern D: Make memory bank first-class development tool (AI prompts reference it)

---

## Solution Adaptation

**Solution A: Integrate into Code Review**

What involves:
1. Code review checklist includes: "Does this need memory bank update?"
2. Reviewer checks: "Is this a new pattern? Existing pattern change? Tech decision?"
3. If yes: PR not approved until memory bank updated

How addresses obstacle:
- Updates happen naturally during code review (not separate)
- Updates become part of work, not additional
- Ownership clear (whoever knows implementation best)

Effort: LOW (just adding checklist item)
Timeline: Next sprint adoption
Owner: Morgan (team lead)

**Solution B: Make updates part of Definition of Done**

What involves:
1. Feature acceptance criteria includes memory bank update if pattern new
2. Feature not considered done until memory bank reflects new knowledge
3. Sprint planning checks: "This feature has X new patterns, need Y memory bank updates"

How addresses obstacle:
- Updates mandatory, not optional
- Prevents "we'll document later" (which never happens)
- Raises awareness during planning

Effort: MEDIUM (need to identify patterns early)
Timeline: Next sprint
Owner: Team lead + team agreement

**Chosen Solutions:**
1. Immediate: Add code review checklist item (LOW effort, prevents future updates)
2. Medium-term: Make Definition of Done explicit about memory bank (ensure updates happen)

---

## Action Plan

### Immediate Actions (This Week)

Action 1: Update code review checklist
- Owner: Morgan
- Timeline: By Friday
- Success: Checklist item added, team trained on it
- Impact: New PRs checked for memory bank updates

Action 2: Catch up on missed updates
- Owner: Alex + Jordan (pair update)
- Timeline: This week (2 hours)
- Success: Memory bank current with last 2 weeks learning
- Impact: Memory bank trustworthy again

### Medium-term Adaptations (Next Sprint)

Adaptation 1: Definition of Done update
- Current: Features must pass tests, code review, deploy to staging
- Evolved: Features must pass tests, code review, update memory bank if pattern new, deploy
- Timeline: Introduce in Sprint 24
- Measurement: % of feature PRs with memory bank updates related to them

Adaptation 2: Highlight during planning
- Current: Feature planning doesn't explicitly mention memory bank
- Evolved: When planning features, identify what's new (pattern/tech decision) and plan for memory bank update
- Timeline: Start in next sprint planning
- Measurement: Memory bank updated during sprint (not post-sprint)

### Measurement and Progress

Metrics to track:
- Memory bank freshness: % of docs current [Baseline: 60% → Target: 95%]
- Updates during sprint: % of sprints with 5+ updates [Baseline: 0% → Target: 100%]
- Code review checklist compliance: % of PRs checked [Baseline: 0% → Target: 100%]
- Team perception: "Memory bank is current" [Baseline: 3/5 → Target: 4.5/5]

Check-in: Weekly for first month, then bi-weekly

Early wins to celebrate:
- Week 1: First PR with memory bank update (checklist works!)
- Week 2: Memory bank catches question during sprint (working as intended)
- Sprint 24: Feature planned with memory bank update built-in

---

## Why This Works

Root cause addressed: Updates integrated into normal workflow (not separate homework)
Clear ownership: Code reviewer responsible for catching documentation needs
Sustainable: Once integrated into process, becomes natural habit
Measurable: Can track compliance and see improvement

Expected outcome: By end of Sprint 24, memory bank updated 5+ times per sprint, team views it as current reference not historical archive.

```

```

</output-format>

<instructions>
CRITICAL: Use frustration as debugging information. Obstacles are telling you something.

DO NOT:
- Blame team ("Team not using memory bank")
- Force harder ("Everyone must document")
- Assume one solution works for all teams
- Skip root cause analysis (fix symptoms, not causes)
- Give up after one attempt

ALWAYS:
- Diagnose before treating (understand root cause)
- Match solutions to obstacles (not generic advice)
- Adapt practices to team context (don't impose)
- Make updates easy (remove friction)
- Celebrate progress (momentum)
- Measure impact (know if fixing works)
- Adjust approach (if not working, try something else)

REMEMBER: Adoption obstacles don't mean adoption will fail. They mean practices need adjustment. Smart teams solve obstacles systematically.
</instructions>

<examples>

[See template example above showing memory bank update obstacle diagnosis and solution - demonstrates root cause analysis, pattern matching, and context-appropriate solutions]

</examples>
