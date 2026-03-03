---
# === Identity ===
id: establish-operational-memory-bank
name: Establish operational memory bank structure for production systems
version: v1

# === Classification ===
chapter: 7
category: operations
subcategory: foundation
tags:
  - operations
  - memory-bank
  - operational-knowledge
  - structure-decision
  - runbooks
  - incident-response
  - cross-references
  - team-organization
  - access-control
  - sre

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Establish operational memory bank structure for production systems.
    Choose between separate, integrated, or hybrid operational knowledge structure based on team dynamics, access requirements, and operational coupling.
  argument-hint: "[project_name] [team_structure] [team_size] [existing_memory_bank]"
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
  - name: project_name
    description: The system or service name
    example: "PaymentAPI"
    maps-to: "$0"
  - name: team_structure
    description: How development and operations are organized
    example: "DevOps model - engineers build and operate"
    maps-to: "$1"
  - name: team_size
    description: Number of engineers involved
    example: "15 engineers"
    maps-to: "$2"
  - name: existing_memory_bank
    description: Whether development memory bank already exists
    example: "Yes, located at memory-bank/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    chapter: 7
    description: |
      **Establish operational memory bank structure** by systematically assessing organizational factors to choose between separate, integrated, or hybrid structure. Decision depends on team organization, access requirements, and how operational knowledge evolves relative to development changes.
    preview: |
      "...RECOMMENDATION: [SEPARATE / INTEGRATED / HYBRID] / REMEMBER: The structure serves engineers during incidents. If on-call engineers can't quickly find knowledge when systems are failing, the structure is wrong regardless of how elegant it seems..."
  website:
    include: true
    path: /prompts/establish-operational-memory-bank
  marketplace:
    plugin: constellize-operations

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Establish operational memory bank structure for {{project_name}} by systematically assessing organizational factors, choosing between separate integrated or hybrid structure, and setting up operational knowledge foundation with clear cross-referencing strategy connecting operational and development knowledge.
</task>

<context>
Project: {{project_name}}
Team Structure: {{team_structure}}
Team Size: {{team_size}}
Existing Memory Bank: {{existing_memory_bank}}

Operational memory captures knowledge needed to run systems reliably: runbooks, incident reports, performance baselines, failure modes, debugging procedures, and operational dependencies. This knowledge must connect to development memory banks (system architecture, design decisions) to remain coherent as systems evolve.

**Structure Choices:**

**Separate**: operations-memory-bank/ folder distinct from memory-bank/
**Integrated**: operational knowledge within unified memory-bank/
**Hybrid**: Core platform integrated, customer-specific operations separate

Decision depends on team structure, access requirements, and how operational knowledge evolves relative to development changes.
</context>

<thinking>
Before establishing structure:
1. How do development and operations interact daily?
2. Who handles incidents (same engineers or dedicated on-call)?
3. Are there compliance/access requirements for operational details?
4. How tightly coupled are operational and development changes?
5. What operational tooling exists (incident management, observability)?
</thinking>

<output-format>

## Assessment Pattern

```
Factor Analysis:

TEAM STRUCTURE:
Current: [Description of dev/ops organization]
Handoffs: [Who builds → Who operates → Who fixes]
Collaboration: [Frequency and nature of cross-functional work]
On-call: [Who carries pager, rotation structure]
→ Factor weight: [SEPARATE / INTEGRATED]

TEAM SIZE:
Engineers: [Count]
Complexity: [Number of services/systems]
Navigation: [Can engineers find knowledge quickly?]
Specialization: [Dedicated roles vs generalists]
→ Factor weight: [SEPARATE / INTEGRATED]

ACCESS REQUIREMENTS:
Compliance: [Regulatory constraints on operational knowledge]
Security: [Sensitivity of operational details]
Permissions: [Who needs access to what]
Tooling: [Existing access control systems]
→ Factor weight: [SEPARATE / INTEGRATED]

KNOWLEDGE EVOLUTION:
Change frequency: [How often operational knowledge updates]
Coupling: [Do operational changes follow code deployments?]
Drift risk: [Likelihood of docs becoming stale]
Synchronization: [How to keep knowledge aligned]
→ Factor weight: [SEPARATE / INTEGRATED]

TOOLING INTEGRATION:
Incident management: [PagerDuty, Opsgenie, etc. or N/A]
Observability: [Datadog, Grafana, etc. or N/A]
Development: [GitHub, GitLab, etc.]
Overlap: [Shared tools vs separate ecosystems]
→ Factor weight: [SEPARATE / INTEGRATED]
```

---

## Decision Pattern

```
RECOMMENDATION: [SEPARATE / INTEGRATED / HYBRID]

Rationale:
- [Primary factor driving decision]
- [Supporting factor]
- [Risk being mitigated]

Tradeoffs Accepted:
- [What this structure sacrifices]
- [Mitigation strategy]

Critical Success Factor:
[The one thing that must be maintained regardless of structure choice]
```

---

## Separate Structure Pattern

```
operations-memory-bank/
├── runbooks/
│   ├── incident-response-procedures.md
│   ├── deployment-runbook.md
│   ├── rollback-procedures.md
│   └── performance-tuning.md
├── incidents/
│   ├── incident-template.md
│   ├── 2026-01-15-database-latency.md
│   └── 2026-01-20-cache-invalidation.md
├── postmortems/
│   ├── 2025-12-10-api-outage-postmortem.md
│   └── postmortem-template.md
├── performance/
│   ├── baseline-metrics.md
│   ├── capacity-planning.md
│   └── optimization-history.md
├── dependencies/
│   ├── operational-dependencies.md
│   ├── service-level-objectives.md
│   └── integration-points.md
└── cross-references.md (Links to memory-bank/)

Cross-Reference Strategy:
- Each runbook references relevant memory-bank/ architecture
- Each incident links to memory-bank/ design decisions
- operations-memory-bank/cross-references.md maps all connections
- memory-bank/ references operations-memory-bank/ for operational context
```

---

## Integrated Structure Pattern

```
memory-bank/
├── projectbrief.md (includes operational overview)
├── systemPatterns.md (includes operational patterns)
├── techContext.md (includes operational technologies)
├── productContext.md
├── activeContext.md
├── progress.md
├── operations/
│   ├── runbooks/
│   │   ├── incident-response.md
│   │   ├── deployment-procedures.md
│   │   └── rollback-procedures.md
│   ├── incidents/
│   │   ├── 2026-01-15-database-latency.md
│   │   └── incident-template.md
│   ├── postmortems/
│   │   └── 2025-12-10-api-outage.md
│   ├── performance/
│   │   ├── baseline-metrics.md
│   │   └── capacity-planning.md
│   └── dependencies/
│       ├── operational-dependencies.md
│       └── service-level-objectives.md
└── README.md (explains organization)

Cross-Reference Strategy:
- Direct internal references (e.g., "See operations/runbooks/deployment-procedures.md")
- Unified tagging/categorization for filtering
- Operations sections in core files reference detailed operations/ content
- Single navigation entry point
```

---

## Hybrid Structure Pattern

```
Core Platform (Integrated):
platform-service/memory-bank/
├── [Standard memory bank files]
└── operations/
    └── [Operational knowledge for platform]

Customer-Specific (Separate):
customer-a/operations-memory-bank/
├── runbooks/
├── incidents/
└── cross-references-to-platform.md

customer-b/operations-memory-bank/
├── runbooks/
├── incidents/
└── cross-references-to-platform.md

Cross-Reference Strategy:
- Customer operations reference platform memory bank
- Platform memory bank tracks customer operational impacts
- Shared operational patterns documented once in platform
- Customer-specific details isolated but connected
```

---

## Initial Setup Pattern

```
Step 1: Create Structure
[Directory tree for chosen structure]
Created: [Date]
Owner: [Team/Person]

Step 2: Establish Core Files

For Separate:
- operations-memory-bank/runbooks/incident-response-procedures.md
- operations-memory-bank/cross-references.md
- operations-memory-bank/README.md

For Integrated:
- memory-bank/operations/README.md
- memory-bank/README.md (update with operations section)
- Add operations overview to projectbrief.md

For Hybrid:
- [Core platform structure]
- [Customer template structure]
- [Cross-reference conventions document]

Step 3: Define Categories

Runbooks:
- Purpose: [Step-by-step operational procedures]
- When to create: [New service, new operational scenario]
- Naming: [Convention]

Incidents:
- Purpose: [Live incident tracking during outages]
- When to create: [Severity threshold]
- Naming: [YYYY-MM-DD-brief-description.md]

Postmortems:
- Purpose: [Learning from completed incidents]
- When to create: [After significant incidents]
- Naming: [YYYY-MM-DD-incident-name-postmortem.md]

Performance:
- Purpose: [Baselines, capacity planning, optimization]
- When to update: [Performance changes, capacity reviews]
- Naming: [Topic-based]

Dependencies:
- Purpose: [Service dependencies, integration points, SLOs]
- When to update: [Dependency changes, SLO reviews]
- Naming: [Topic-based]

Step 4: Cross-Reference Foundation

Development → Operations Links:
- memory-bank/systemPatterns.md → operations runbooks
- memory-bank/techContext.md → performance baselines
- Design decision docs → related incidents/postmortems

Operations → Development Links:
- Runbooks → architecture documentation
- Incidents → design decisions and constraints
- Performance data → capacity-related design choices

Bidirectional Requirements:
- Every cross-reference must exist in both directions
- Use consistent identifiers (service names, component names)
- Include brief context explaining why reference matters

Step 5: Access & Tooling

Access Control:
- [Who can read operational knowledge]
- [Who can write/update operational knowledge]
- [Special restrictions for sensitive content]

Tool Integration:
- [How incident management tools connect]
- [How monitoring tools reference knowledge]
- [How LLM assistants will query this structure]

Step 6: Validation Checklist

Structure Validation:
□ Chosen structure documented with rationale
□ Directory structure created
□ README files explain organization
□ Cross-reference strategy defined

Content Foundation:
□ At least one runbook created (incident response or deployment)
□ Incident template created
□ Postmortem template created
□ Performance baseline document initialized

Cross-References:
□ Operations references development knowledge
□ Development references operational knowledge
□ Bidirectional cross-references verified
□ Cross-reference conventions documented

Team Alignment:
□ Team understands structure choice and rationale
□ Team knows where to find operational knowledge
□ Team knows how to add new operational knowledge
□ On-call engineers can navigate structure quickly

Tool Integration:
□ Access controls configured
□ Integration with incident management planned/implemented
□ LLM assistant access configured if applicable
```

---

## Maintenance Pattern

```
Weekly:
- Review new incidents for knowledge gaps
- Update runbooks if procedures changed
- Check cross-reference integrity

Monthly:
- Assess operational knowledge currency
- Identify missing runbooks or scenarios
- Review and update performance baselines
- Clean up obsolete operational knowledge

Quarterly:
- Reassess structure choice (still appropriate?)
- Evaluate cross-reference effectiveness
- Review access controls and compliance
- Gather feedback from on-call engineers

Signals Structure Needs Revisiting:
- On-call engineers can't find knowledge quickly
- Frequent drift between operational and development knowledge
- Excessive cross-reference maintenance burden
- Access control conflicts
- Team structure has changed significantly
```

</output-format>

<instructions>
CRITICAL: Choose structure based on actual team dynamics, not theoretical ideals.

DO NOT:
- Choose separate structure just because it "seems cleaner"
- Choose integrated structure just because it's "simpler"
- Ignore access control or compliance requirements
- Skip cross-reference strategy definition
- Create structure without team input

ALWAYS:
- Assess all organizational factors systematically
- Document rationale for structure choice
- Establish bidirectional cross-references from day one
- Create templates before first real content
- Validate with on-call engineers that structure is navigable
- Plan for structure evolution as team/system grows

REMEMBER: The structure serves engineers during incidents. If on-call engineers can't quickly find knowledge when systems are failing, the structure is wrong regardless of how elegant it seems.
</instructions>

<examples>

## Example 1: FinTech Startup (Integrated)

```
Assessment:

TEAM STRUCTURE:
Current: 15-person engineering team, no dedicated SRE
Handoffs: Engineers build → Same engineers operate → Same engineers fix
Collaboration: Daily, continuous
On-call: Weekly rotation among all engineers
→ Factor weight: INTEGRATED

TEAM SIZE:
Engineers: 15
Complexity: 5 services
Navigation: Small enough to navigate unified structure easily
Specialization: Generalists (full-stack + operations)
→ Factor weight: INTEGRATED

ACCESS REQUIREMENTS:
Compliance: Basic financial regulations, no special operational restrictions
Security: Standard access controls sufficient
Permissions: All engineers need same access
Tooling: Unified GitHub for everything
→ Factor weight: INTEGRATED

KNOWLEDGE EVOLUTION:
Change frequency: Operational knowledge updates with every deployment
Coupling: Tightly coupled (infrastructure-as-code deployed with app)
Drift risk: Low (same people update both)
Synchronization: Natural (updated together)
→ Factor weight: INTEGRATED

TOOLING INTEGRATION:
Incident management: Simple Slack + runbooks
Observability: Datadog (docs in GitHub)
Development: GitHub
Overlap: Everything in GitHub
→ Factor weight: INTEGRATED

RECOMMENDATION: INTEGRATED

Rationale:
- Small team means everyone needs access to everything
- Same engineers build and operate (need unified view)
- Operational changes deploy with code (tightly coupled)
- No access control requirements justify separation

Tradeoffs Accepted:
- Slightly harder to filter "just operational" knowledge
- Mitigation: Clear operations/ subdirectory + tagging

Critical Success Factor:
Maintain clear operational knowledge organization within unified structure so on-call engineers can filter to relevant runbooks quickly.

Structure:

payment-api/memory-bank/
├── projectbrief.md (includes operational overview)
├── systemPatterns.md (includes operational patterns)
├── techContext.md (includes observability stack)
├── productContext.md
├── activeContext.md
├── progress.md
├── operations/
│   ├── README.md
│   ├── runbooks/
│   │   ├── incident-response.md
│   │   ├── deployment-procedures.md
│   │   ├── rollback-procedures.md
│   │   └── database-recovery.md
│   ├── incidents/
│   │   ├── incident-template.md
│   │   ├── 2026-01-15-payment-timeout.md
│   │   └── 2026-01-18-database-connection-pool.md
│   ├── postmortems/
│   │   ├── postmortem-template.md
│   │   └── 2025-12-20-card-processing-outage.md
│   ├── performance/
│   │   ├── baseline-metrics.md
│   │   ├── capacity-planning.md
│   │   └── query-optimization-history.md
│   └── dependencies/
│       ├── operational-dependencies.md
│       └── service-level-objectives.md
└── README.md

Cross-References:

memory-bank/systemPatterns.md:
"## Payment Processing Architecture
...design details...

Operational Context:
- Deployment: operations/runbooks/deployment-procedures.md
- Incident Response: operations/runbooks/incident-response.md
- Performance: operations/performance/baseline-metrics.md
- Related Incidents: operations/incidents/2026-01-15-payment-timeout.md"

memory-bank/operations/runbooks/incident-response.md:
"# Incident Response Procedures

## Payment Timeout Investigation
When payment timeouts occur, systematic investigation:

1. Check Architecture: memory-bank/systemPatterns.md#payment-processing
2. Review Recent Changes: memory-bank/progress.md
3. Compare Baselines: operations/performance/baseline-metrics.md
4. Check Dependencies: operations/dependencies/operational-dependencies.md

Related Incidents: operations/incidents/2026-01-15-payment-timeout.md"

Validation:

✓ Chosen structure: Integrated (documented rationale)
✓ Directory structure created
✓ README files explain organization
✓ Cross-reference strategy: Internal references using relative paths

✓ Runbooks: incident-response.md, deployment-procedures.md created
✓ Incident template created
✓ Postmortem template created
✓ Performance baseline initialized

✓ Operations references memory-bank/ core files
✓ Core files reference operations/ content
✓ Bidirectional cross-references verified
✓ Cross-reference convention: relative paths with section anchors

✓ Team reviewed structure (approved in team meeting 2026-01-10)
✓ On-call engineers trained on navigation (2026-01-12)
✓ Update procedures documented in operations/README.md

✓ Access: All engineers have full access via GitHub
✓ Incident tooling: Slack bot links to runbooks
✓ No LLM assistant currently, structure supports future integration
```

---

## Example 2: Healthcare Platform (Separate with Cross-references)

```
Assessment:

TEAM STRUCTURE:
Current: 200 engineers, 20-person dedicated SRE team
Handoffs: Developers build → SRE operates → SRE pages developers for fixes
Collaboration: Regular but not continuous, defined interfaces
On-call: SRE primary, developer secondary
→ Factor weight: SEPARATE

TEAM SIZE:
Engineers: 220 total (200 dev + 20 SRE)
Complexity: 50+ services
Navigation: Separate structures easier to navigate at scale
Specialization: Dedicated SRE with specialized skills
→ Factor weight: SEPARATE

ACCESS REQUIREMENTS:
Compliance: HIPAA - operational details include PHI access patterns
Security: Operational runbooks contain sensitive infrastructure details
Permissions: Different access levels (SRE vs developers)
Tooling: Separate operational tooling ecosystem
→ Factor weight: SEPARATE (STRONG)

KNOWLEDGE EVOLUTION:
Change frequency: Operational knowledge updates independently
Coupling: Loosely coupled (SRE manages infrastructure separately)
Drift risk: Moderate (separate teams must synchronize)
Synchronization: Requires explicit cross-reference maintenance
→ Factor weight: SEPARATE

TOOLING INTEGRATION:
Incident management: PagerDuty (SRE only)
Observability: Datadog + internal tools (SRE-managed)
Development: GitHub (shared)
Overlap: GitHub shared, other tools separate
→ Factor weight: SEPARATE

RECOMMENDATION: SEPARATE with explicit cross-reference maintenance

Rationale:
- HIPAA compliance requires restricted access to operational details
- Dedicated SRE team needs focused, navigable operational knowledge
- Large scale makes separate structures more manageable
- Different tooling ecosystems for dev vs operations

Tradeoffs Accepted:
- Risk of drift between development and operational knowledge
- Mitigation: Mandatory cross-reference reviews, automated link checking

Critical Success Factor:
Maintain rigorous bidirectional cross-references between memory banks with regular validation to prevent knowledge drift.

Structure:

patient-api/memory-bank/
├── [Standard development memory bank]
├── projectbrief.md
├── systemPatterns.md (references operations-memory-bank/)
├── techContext.md
└── operational-overview.md (high-level, links to ops memory bank)

patient-api/operations-memory-bank/
├── README.md
├── cross-references-to-dev.md (All links to memory-bank/)
├── runbooks/
│   ├── incident-response-procedures.md
│   ├── deployment-runbook.md
│   ├── rollback-procedures.md
│   ├── database-failover.md
│   └── hipaa-compliance-procedures.md
├── incidents/
│   ├── incident-template.md
│   └── [YYYY-MM-DD-incident files]
├── postmortems/
│   ├── postmortem-template.md
│   └── [completed postmortems]
├── performance/
│   ├── baseline-metrics.md
│   ├── capacity-planning.md
│   └── optimization-history.md
├── dependencies/
│   ├── operational-dependencies.md
│   ├── service-level-objectives.md
│   └── integration-points.md
└── access-control.md

Cross-Reference Strategy:

operations-memory-bank/cross-references-to-dev.md:
"# Cross-References to Development Memory Bank

## Architecture → Operations Mappings

memory-bank/systemPatterns.md#api-gateway:
- Runbook: operations-memory-bank/runbooks/incident-response-procedures.md#api-gateway
- Performance: operations-memory-bank/performance/baseline-metrics.md#api-latency
- Dependencies: operations-memory-bank/dependencies/operational-dependencies.md#upstream

memory-bank/systemPatterns.md#database-layer:
- Runbook: operations-memory-bank/runbooks/database-failover.md
- Performance: operations-memory-bank/performance/baseline-metrics.md#database
- Recent Incident: operations-memory-bank/incidents/2026-01-15-db-connection-pool.md

[Comprehensive mapping of all architecture → operations links]

## Incident → Design Decision Mappings

operations-memory-bank/incidents/2026-01-15-db-connection-pool.md:
- Related Design: memory-bank/systemPatterns.md#connection-pooling
- Architecture Context: memory-bank/techContext.md#database-configuration

[All incidents mapped to relevant design documentation]"

memory-bank/operational-overview.md:
"# Operational Overview

For detailed operational procedures, see operations-memory-bank/ (SRE access required)

## High-Level Operational Architecture

[Public operational overview suitable for developer access]

## Developer-Relevant Operational Links

Deployment Procedures: operations-memory-bank/runbooks/deployment-runbook.md
- What developers need to know: [summary]
- When to coordinate with SRE: [criteria]

Incident Response: operations-memory-bank/runbooks/incident-response-procedures.md
- Developer on-call responsibilities: [summary]
- Escalation procedures: [details]

Service Level Objectives: operations-memory-bank/dependencies/service-level-objectives.md
- Current SLOs: [list]
- How SLOs inform design: [guidance]

## Recent Operational Changes Affecting Development

[Maintained by SRE, reviewed weekly]
- 2026-01-20: Database connection pool size increased (affects connection handling)
- 2026-01-15: New monitoring alerts (see operations-memory-bank/...)
"

Validation:

✓ Chosen structure: Separate (documented rationale including HIPAA)
✓ Directory structure created: memory-bank/ and operations-memory-bank/
✓ README files explain organization and access requirements
✓ Cross-reference strategy: Explicit bidirectional mapping files

✓ Runbooks: 5 core runbooks created by SRE team
✓ Incident template created with HIPAA-compliant fields
✓ Postmortem template created
✓ Performance baseline initialized

✓ operations-memory-bank/cross-references-to-dev.md created (68 links)
✓ memory-bank/operational-overview.md created with public operational summary
✓ Bidirectional cross-references validated (automated check script)
✓ Cross-reference conventions documented in both READMEs

✓ SRE team understands structure (training session 2026-01-08)
✓ Developers understand where to find operational knowledge (doc published)
✓ On-call SRE can navigate quickly (validated in drill)
✓ Developer on-call knows escalation procedures

✓ Access controls: SRE full access, developers read-only to operations-memory-bank/
✓ PagerDuty integration links to runbooks
✓ Automated cross-reference validation in CI (weekly)
```

Why this works:
- Respects compliance boundaries while maintaining knowledge connections
- SRE gets focused operational knowledge structure
- Developers get necessary operational context without sensitive details
- Explicit cross-reference maintenance prevents drift
- Automated validation catches broken links

</examples>
