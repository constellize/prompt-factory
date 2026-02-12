---
# === Identity ===
id: discover-organizational-knowledge-connections
name: Discover knowledge islands and connections across organizational memory banks
version: v1

# === Classification ===
chapter: 6
category: organization

tags:
  - documentation
  - memory-bank
  - organizational-scale
  - knowledge-islands
  - systemic-risks
  - decision-traceability
  - strategic-alignment
  - meta-constellation
  - cross-team-coordination
  - knowledge-connectivity

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Discover knowledge islands and connections across organizational memory banks.
    Build meta-constellation view revealing systemic risks, strategic alignment gaps, and connection opportunities at organizational scale.
  argument-hint: "[organization_name] [repository_scope]"
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
  - name: organization_name
    description: The organization or company name
    example: "Acme Corp"
    maps-to: "$0"
  - name: repository_scope
    description: Which repositories to analyze
    example: "All repositories in github.com/acme-corp organization"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/discover-organizational-knowledge-connections
  marketplace:
    plugin: constellize-organization

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Discover knowledge connections and gaps across {{organization_name}} memory banks to build organizational meta-constellation showing how team knowledge interconnects.

Analyze memory banks across repositories identifying conceptual overlaps where teams solve similar problems, terminology drift where different names describe same concepts, runtime dependencies where systems interact but documentation disconnected, and knowledge islands where isolated expertise lacks organizational links. Detect systemic risks including conflicting assumptions, duplicated effort, integration gaps, and cascade impacts where decisions affect teams unknowingly. Generate specific cross-reference recommendations with concrete file locations and rationale.

Treat organizational knowledge as constellation of constellations rather than isolated repositories, building meta-view that enables proactive coordination impossible from individual team perspectives alone.
</task>

<context>
Organization: {{organization_name}}
Repository scope: {{repository_scope}}

**Expected Structure:**
- Each repo may contain `memory-bank/` folder
- Standard files: projectbrief.md, systemPatterns.md, techContext.md, etc.

**Analysis Output:**
- Knowledge island identification
- Systemic risk assessment
- Connection recommendations with locations
- Strategic alignment report
</context>

<thinking>
Before analyzing:
1. How many teams/repositories in scope?
2. What are known system interactions?
3. Which teams likely have overlapping concerns?
4. What organizational initiatives span teams?
5. Where have integration problems occurred?
</thinking>

<output-format>
Create organizational knowledge analysis following these patterns:

**Discovery Pattern:**

```
For each repository:
1. Check for memory-bank/
2. Extract: Team, system, domain, dependencies
3. Index topics: patterns, technologies, decisions
4. Identify gaps: missing, incomplete, stale

Results:
- Repos scanned: [count]
- Memory banks found: [count] ([%])
- Teams identified: [list with domains]
- System dependency map: [who depends on who]
```

---

**Knowledge Island Pattern:**

```
For each memory bank, assess connectivity:

Team X: [System]
Topics: [Key topics]
Cross-references OUT: [count]
Cross-references IN: [count]
Runtime dependencies: [Who uses this]
Documentation dependencies: [Actual links]

Assessment: [ISLAND / MODERATE / WELL-CONNECTED]
Risk: [HIGH / MEDIUM / LOW]
Reason: [Why this matters]

Island Summary:
- Severe islands (0-1 connections): [teams]
- Priority for connection: [ranked list with rationale]
```

---

**Systemic Risk Pattern:**

```
Risk: [Name]
Type: [Conflicting Assumptions / Duplicated Effort / Integration Gap]
Severity: [CRITICAL / HIGH / MEDIUM]

Team A: [Their understanding]
Location: [file]#[section]
Date: [when]

Team B: [Their understanding]
Location: [file]#[section]
Date: [when]

Conflict Analysis:
- Mismatch: [Specific difference]
- Teams aware: [Yes/No]
- Runtime impact: [What happens]
- Status: [Latent bug / Active issue / Pre-production]

Recommendation:
1. [Immediate action]
2. [Cross-reference to add]
3. [Process improvement]

Top Risks:
[Prioritized list with severity and actions]
```

---

**Connection Recommendation Pattern:**

```
Recommendation #[N]
Type: [Integration Doc / Risk Mitigation / Duplication Prevention]
Priority: [CRITICAL / HIGH / MEDIUM]
Effort: [time estimate]

From: [Team A] - [System]
To: [Team B] - [System]

Rationale:
[Why these should be linked - specific reason]

Cross-Reference 1:
File: [repo-a]/memory-bank/[file]#[section]
Add: "[Team B's topic]: [repo-b]/memory-bank/[file]#[section]
      [One sentence why relevant]"

Cross-Reference 2:
File: [repo-b]/memory-bank/[file]#[section]
Add: "[Team A's dependency]: [repo-a]/memory-bank/[file]#[section]
      [One sentence explaining connection]"

Impact:
- Risk reduced: [Specific risk]
- Efficiency gain: [How this helps]

Example:
From: API Gateway - Authentication
To: Mobile App - Client Auth
Rationale: Token lifetime mismatch (15min vs 60min expectation)
Priority: CRITICAL (prevents 401 errors)
```

---

**Decision Traceability Pattern:**

```
Decision: [Name]
Origin: [Team]
Date: [Date]
Source: [file location]

Direct Impact (documented): [teams affected]
Indirect Impact (not documented): [teams likely affected]

Cascade Analysis:
- First-order: [count] teams (documented)
- Second-order: [count] teams (discovered)
- Total affected: [count]+ teams

Current traceability: [%] documented

Recommendation:
- Document full cascade in origin memory bank
- Add cross-references in all affected teams
- Track adoption status
```

---

**Strategic Alignment Pattern:**

```
Initiative: [Name]
Source: [Strategy document]
Target: [Organizational goal]

Team Alignment:
ALIGNED ([count]): [teams explicitly pursuing]
MISALIGNED ([count]): [teams not prioritizing]
NOT ASSESSED ([count]): [unclear applicability]

Alignment Score: [%] (target: [%])

Gaps:
1. [Team]: [Specific misalignment]
2. [Team]: [Missing awareness]

Recommendation:
- Share initiative with all teams
- Document impact in each memory bank
- Quarterly alignment review
- Track metrics
```

---

**Meta-Constellation Pattern:**

```
Organizational Knowledge Layers:

Product Layer: [teams]
- Focus: User features, UX
- Maturity: [Level 1-4]

Platform Layer: [teams]
- Focus: Shared services, APIs
- Maturity: [Level 1-4]

Operations Layer: [teams]
- Focus: Reliability, infrastructure
- Maturity: [Level 1-4]

Cross-Layer Connectivity:
- Product ↔ Platform: [%] documented
- Platform ↔ Operations: [%] documented

Health Score: [X]/100
- Coverage: [%] repos with memory banks
- Connectivity: [%] cross-references
- Alignment: [%] strategic adoption
- Maturity: [Avg level]

Top Improvements:
1. [Action with highest impact]
2. [Action with highest impact]
```

</output-format>

<instructions>
CRITICAL: Analyze as constellation of constellations, not isolated repos.

DO NOT:
- Analyze repositories in isolation
- Ignore implicit dependencies
- Assume terminology is shared
- Skip risk analysis
- Generate vague recommendations

ALWAYS:
- Scan all memory banks systematically
- Compare across teams for overlaps
- Detect terminology inconsistencies
- Identify knowledge islands
- Analyze systemic risks
- Generate specific cross-references with locations
- Map decision cascades
- Check strategic alignment
- Build meta-constellation view

REPEAT: Find islands, suggest bridges, detect risks, ensure coherence. Be specific with locations and rationale.
</instructions>

<examples>
✅ GOOD Analysis (specific, actionable):

```
Discovery: Acme Corp (15 repos)
Memory banks: 12 found (80%)
Missing: Teams P, Q, R

KNOWLEDGE ISLANDS:

Critical: Team C (Auth Service)
- Cross-refs: 0 out, 0 in
- Runtime deps: ALL teams use this
- Risk: Breaking changes surprise everyone
- Action: URGENT - connect to all consumers

SYSTEMIC RISKS:

Risk #1: Token Lifetime Mismatch
Severity: CRITICAL

API Gateway (api-gateway/memory-bank/systemPatterns.md#auth):
- JWT expires 15 minutes
- Date: 2025-10-15

Mobile App (mobile-app/memory-bank/techContext.md#api):
- Expects tokens valid 60 minutes
- Date: 2025-11-20

Analysis:
- Conflict: 15min vs 60min (4x mismatch)
- Impact: Mobile gets 401s after 15min
- Status: LATENT BUG (caught in docs)

Action:
1. URGENT: Notify both teams
2. Add cross-refs in both memory banks
3. Align on 15min with refresh flow
4. Add integration test

Risk #2: Duplicated Caching
Severity: MEDIUM

Team D: Building Redis cache (in progress, 2 weeks)
Team E: Built cache library (complete, 3 months ago, production)

Action:
1. Connect teams immediately
2. Evaluate Team E's library for reuse
3. Save 2 weeks if reusable

CONNECTIONS (23 total):

#1: Auth Service ↔ Mobile App
Type: Integration + Risk
Priority: CRITICAL
Add to api-gateway/memory-bank/systemPatterns.md#auth:
"Mobile integration: mobile-app/memory-bank/techContext.md#auth
 Critical: JWT 15min lifetime, mobile must refresh"
Add to mobile-app/memory-bank/techContext.md#auth:
"API auth: api-gateway/memory-bank/systemPatterns.md#auth
 Tokens expire 15 minutes, implement refresh flow"
Impact: Prevents 401 errors, clarifies integration

#2: Search ↔ Analytics
Type: Duplication Prevention
Priority: HIGH
Add to search/memory-bank/activeContext.md:
"Before building: Team E caching library proven in prod
 analytics/memory-bank/systemPatterns.md#caching"
Impact: Save 2 weeks, use proven solution

STRATEGIC ALIGNMENT:

Mobile-First Initiative:
- Aligned: 4/10 teams (40%)
- Misaligned: 3 teams (Web, API Gateway, Search)
- Not assessed: 3 teams
- Target: 80% by Q2
- Action: Share strategy, document impacts

META-CONSTELLATION:

Product Layer (3 teams): Level 3 maturity
Platform Layer (4 teams): Level 2 maturity
Operations Layer (3 teams): Level 3 maturity

Cross-layer connectivity: 55% documented

Health: 60/100
Improvements:
1. Connect Auth Service island (critical)
2. Align mobile-first (10 teams)
3. Map event architecture cascade (5 teams)

ROI:
- Prevented incidents: 3
- Prevented duplication: 2 weeks
- Improved alignment: 10 teams
```

**Why this works:**
- Specific evidence and locations
- Concrete actions with priority
- Risk assessment with severity
- Measurable outcomes
- Strategic view for leadership
</examples>
