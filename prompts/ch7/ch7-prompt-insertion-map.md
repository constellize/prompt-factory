# Chapter 7: Operational Resilience - Prompt Insertion Map

This document maps where prompts should be inserted into the Chapter 7 text and what operational capabilities they should provide.

---

## Chapter 7 Structure Overview

Chapter 7 focuses on extending Constellize into operations and site reliability engineering:
- Operational memory bank structures (separate vs integrated)
- Proactive operational design during development
- Incident investigation and debugging
- Federated operational knowledge queries
- Learning from incidents through postmortems

---

## Prompt Insertion Points

### **INSERTION POINT 1: After "Practical Implementation Guidance" Section**

**Context in Text:**
After the guidance on implementing separate vs integrated operational memory banks, readers need concrete prompts to establish their operational knowledge structure.

**Prompts to Insert:**

1. **Prompt: `establish-operational-memory-bank`** (ch7/foundation/)
   - Choose between separate, integrated, or hybrid operational memory structure
   - Assess organizational factors (team structure, size, access requirements)
   - Set up operational memory bank structure and conventions
   - Define cross-referencing strategy between operational and development knowledge
   - Establish initial operational knowledge categories (runbooks, incidents, performance, dependencies)

2. **Prompt: `cross-reference-operational-dependencies`** (ch7/foundation/)
   - Map runtime dependencies between services
   - Link operational runbooks to system design documentation
   - Connect incident reports to architectural decisions
   - Establish bidirectional references between operational and development memory banks
   - Create dependency maps showing operational impact chains

**Insertion Text Marker:**
> "In Either Case: Cross-references are essential — knowledge is only valuable when connected..."

**Callout to Add After This Section:**
```
::: {.promptref title="Establish Operational Memory Bank" url="{SITE_BASE}/prompts/v1/establish-operational-memory-bank"}
[Prose about choosing operational memory structure and setting up operational knowledge foundation]
:::

::: {.promptref title="Cross-Reference Operational Dependencies" url="{SITE_BASE}/prompts/v1/cross-reference-operational-dependencies"}
[Prose about linking operational and development knowledge through explicit cross-references]
:::
```

---

### **INSERTION POINT 2: After "Proactive Operational Design Through Systematic Planning" Section**

**Context in Text:**
After showing CodePromptu's health check architecture example, readers need prompts to capture their own proactive operational design decisions.

**Prompts to Insert:**

3. **Prompt: `design-proactive-operational-architecture`** (ch7/proactive/)
   - Capture operational design decisions during development (not post-incident)
   - Document health check strategies, startup dependencies, resource constraints
   - Design for observability: metrics, logs, traces
   - Plan failure modes and degradation patterns
   - Connect to deployment readiness quality gate (Chapter 4)
   - Establish operational acceptance criteria

4. **Prompt: `create-operational-runbook`** (ch7/proactive/)
   - Structure runbooks for common operational scenarios
   - Document troubleshooting decision trees
   - Include prerequisite checks and validation steps
   - Link to related incidents and postmortems
   - Specify required permissions and access
   - Define success criteria and rollback procedures

**Insertion Text Marker:**
> "Notice how this operational documentation captures the systematic design decisions that build resilience from the start. This transforms operational planning into institutional knowledge that prevents incidents through proactive architecture."

**Callout to Add After This Section:**
```
::: {.promptref title="Design Proactive Operational Architecture" url="{SITE_BASE}/prompts/v1/design-proactive-operational-architecture"}
[Prose about capturing operational design decisions during development to prevent incidents]
:::

::: {.promptref title="Create Operational Runbook" url="{SITE_BASE}/prompts/v1/create-operational-runbook"}
[Prose about structuring effective runbooks that guide engineers through operational scenarios]
:::
```

---

### **INSERTION POINT 3: After "Systematic Debugging as Operational Knowledge" Section**

**Context in Text:**
After the pgvector debugging example showing systematic investigation, readers need a prompt to capture their own incident investigations as institutional knowledge.

**Prompt to Insert:**

5. **Prompt: `document-incident-investigation`** (ch7/incident/)
   - Capture systematic debugging paths (hypotheses → tests → results)
   - Document dead ends and why they didn't work
   - Record breakthrough moments and key insights
   - Link to related system architecture and design decisions
   - Preserve commands used and their output
   - Transform investigation into reusable debugging patterns

**Insertion Text Marker:**
> "This demonstrates how operational constellations help teams understand system behavior holistically. The systematic approach becomes reusable knowledge that accelerates future debugging sessions."

**Callout to Add After This Section:**
```
::: {.promptref title="Document Incident Investigation" url="{SITE_BASE}/prompts/v1/document-incident-investigation"}
[Prose about capturing systematic debugging paths as reusable operational knowledge]
:::
```

---

### **INSERTION POINT 4: After "Operational Context Federation" Section**

**Context in Text:**
After explaining how federated operational knowledge supports incident response, readers need a prompt to query this knowledge effectively during high-pressure situations.

**Prompt to Insert:**

6. **Prompt: `query-operational-knowledge-during-incidents`** (ch7/incident/)
   - Query relevant operational context across federated memory banks
   - Filter knowledge to incident-specific scope (recent incidents, related runbooks, current constraints)
   - Pull targeted context without information overload
   - Traverse operational dependencies to gather system-wide impact
   - Access cross-referenced development knowledge when needed
   - Support time-sensitive decision making during outages

**Insertion Text Marker:**
> "By mapping operational dependencies, CodePromptu's team transformed isolated service knowledge into system-wide understanding. This holistic view enables proactive reliability engineering rather than reactive incident response."

**Callout to Add After This Section:**
```
::: {.promptref title="Query Operational Knowledge During Incidents" url="{SITE_BASE}/prompts/v1/query-operational-knowledge-during-incidents"}
[Prose about accessing federated operational context during incidents without information overload]
:::
```

---

### **INSERTION POINT 5: Within "Preparing for the Unknown" Section**

**Context in Text:**
This section discusses preserving reasoning and investigation paths. Insert prompt after the bullet list explaining what to preserve.

**Prompt to Insert:**

7. **Prompt: `write-incident-postmortem`** (ch7/incident/)
   - Document incident timeline with key decision points
   - Capture hypotheses explored (both successful and failed)
   - Record remediation options considered and rationale for choices
   - Analyze root cause and contributing factors
   - Identify systemic improvements (not just immediate fixes)
   - Link postmortem to affected system constellations
   - Transform incident into institutional learning

**Insertion Text Marker:**
> "This historical context helps future teams build mental models of systems faster, see patterns across incidents, and improve response times — even when facing novel failures."

**Callout to Add Within This Section:**
```
::: {.promptref title="Write Incident Postmortem" url="{SITE_BASE}/prompts/v1/write-incident-postmortem"}
[Prose about transforming incidents into institutional knowledge that improves future response]
:::
```

---

### **ADDITIONAL PROMPT (Optional): Operational Health Assessment**

**Potential Insertion Point:**
Could be added at the end before "Chapter Summary" or in a separate section about maintaining operational knowledge currency.

**Prompt to Insert:**

8. **Prompt: `assess-operational-knowledge-health`** (ch7/health/)
   - Evaluate operational memory bank currency (are runbooks accurate?)
   - Check cross-reference integrity between operational and development knowledge
   - Identify knowledge gaps (missing runbooks, undocumented failure modes)
   - Assess incident response effectiveness using knowledge
   - Measure time-to-resolution trends
   - Recommend knowledge updates based on recent incidents

**Suggested New Section Before "Chapter Summary":**
Add a brief section titled **"Maintaining Operational Knowledge Currency"** that discusses how operational knowledge must evolve with systems, then insert this prompt.

---

## Recommended ch7 Folder Structure

```
ch7/
├── foundation/
│   ├── establish-operational-memory-bank-prompt.txt
│   ├── establish-operational-memory-bank-metadata.json
│   ├── establish-operational-memory-bank-preview-callout.md
│   ├── cross-reference-operational-dependencies-prompt.txt
│   ├── cross-reference-operational-dependencies-metadata.json
│   └── cross-reference-operational-dependencies-preview-callout.md
├── proactive/
│   ├── design-proactive-operational-architecture-prompt.txt
│   ├── design-proactive-operational-architecture-metadata.json
│   ├── design-proactive-operational-architecture-preview-callout.md
│   ├── create-operational-runbook-prompt.txt
│   ├── create-operational-runbook-metadata.json
│   └── create-operational-runbook-preview-callout.md
├── incident/
│   ├── document-incident-investigation-prompt.txt
│   ├── document-incident-investigation-metadata.json
│   ├── document-incident-investigation-preview-callout.md
│   ├── query-operational-knowledge-during-incidents-prompt.txt
│   ├── query-operational-knowledge-during-incidents-metadata.json
│   ├── query-operational-knowledge-during-incidents-preview-callout.md
│   ├── write-incident-postmortem-prompt.txt
│   ├── write-incident-postmortem-metadata.json
│   └── write-incident-postmortem-preview-callout.md
└── health/
    ├── assess-operational-knowledge-health-prompt.txt
    ├── assess-operational-knowledge-health-metadata.json
    └── assess-operational-knowledge-health-preview-callout.md
```

**Total: 8 prompts across 4 categories**

---

## Prompt Coverage Summary

| Category | Prompts | Purpose |
|----------|---------|---------|
| **Foundation** (2) | establish-operational-memory-bank, cross-reference-operational-dependencies | Set up operational knowledge structure and link to development knowledge |
| **Proactive** (2) | design-proactive-operational-architecture, create-operational-runbook | Capture operational design decisions and create runbooks during development |
| **Incident** (3) | document-incident-investigation, query-operational-knowledge-during-incidents, write-incident-postmortem | Support incident response and transform incidents into learning |
| **Health** (1) | assess-operational-knowledge-health | Maintain operational knowledge currency and effectiveness |

---

## Key Themes to Emphasize in Prompts

1. **Operational knowledge is development knowledge** - They must evolve together
2. **Proactive beats reactive** - Capture operational concerns during design, not just after incidents
3. **Federation enables scale** - Query targeted context across services without information overload
4. **Reasoning matters** - Preserve not just solutions but the path to discovery
5. **Cross-references are essential** - Isolated knowledge loses value
6. **Time-sensitive accessibility** - Operational knowledge must be quickly discoverable during incidents

---

## Technology-Agnostic Patterns to Follow

Following guidelines from earlier chapters, all Chapter 7 prompts should be:
- **Method-focused** - Not tied to specific tools (Kubernetes, Docker, etc.)
- **Pattern-based** - Applicable to any operational environment
- **Principle-driven** - Focus on systematic operational thinking
- **Structure-agnostic** - Work with any operational tooling (Datadog, Grafana, PagerDuty, etc.)

---

## Next Steps

1. Create ch7 folder structure
2. Generate 8 prompts following established patterns from ch4-ch6
3. Include comprehensive examples from various operational domains
4. Add prose to all preview callouts with snippet format where compelling
5. Update Chapter 7 text with prompt callout insertions at marked locations
