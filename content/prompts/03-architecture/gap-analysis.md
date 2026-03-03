---
# === Identity ===
id: gap-analysis
name: Identify gaps between trusted components and document missing capabilities
version: v1

# === Classification ===
chapter: 3
category: architecture

tags:
  - architecture
  - gaps
  - requirements
  - PRD
  - generation

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Identify gaps between trusted components and document missing capabilities.
    After constellation mapping, when identifying what needs to be built.
  argument-hint: "[system_name] [stakeholder_requirements]"
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
    description: The name of your system
    example: "Payment Processing System"
    maps-to: "$0"
  - name: stakeholder_requirements
    description: Key stakeholder needs and requirements
    example: "Real-time fraud detection, PCI compliance, multi-currency support"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 3
    description: |
      Identify and document architectural gaps
    preview: |
      "Identify gaps between trusted components and document missing capabilities..."
  website:
    include: true
    path: /prompts/gap-analysis
  marketplace:
    plugin: constellize-architecture

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Identify gaps in {{system_name}} between existing trusted components ("stars") and document the missing capabilities that need to be built.

Even with a rich constellation of reusable stars, there will be gaps—missing pieces that prevent your constellation from forming a working system. Generate only what's missing. Each new component must be shaped by the known systems around it, not generic boilerplate dropped in with no awareness of your constellation.

Follow this process:

1. **Review the constellation map** at `construction/requirements/constellation-map.md`:
   - List all documented stars
   - Identify integration points between stars
   - Note architectural seams

2. **Identify gaps** by asking:
   - What capabilities are needed but missing?
   - Where do stars fail to connect?
   - What middleware, adapters, or bridges are needed?
   - Which stakeholder requirements have no supporting component?

3. **For each gap, document:**
   - The missing capability (specific, not vague)
   - Constraints that must shape it
   - Which stars it must connect to
   - Integration points (contracts, schemas, protocols)
   - Success criteria for completion

4. **Validate each gap:**
   - Does this gap close a real need from stakeholder analysis?
   - Is there truly no existing star that satisfies this?
   - Is the scope precise, not vague?
   - Have we defined clear integration points?
</task>

<context>
**Standard Construction Folder Structure:**
This prompt reads from `construction/requirements/constellation-map.md` and outputs to `construction/requirements/gap-analysis.md`.

Stakeholder requirements:
{{stakeholder_requirements}}
</context>

<thinking>
Before identifying gaps, analyze:
1. What capabilities do stakeholders need?
2. Which of these are already covered by existing stars?
3. Where are the true gaps vs. gaps we can fill with existing components?
4. What would happen if we built something that doesn't fit the constellation?
</thinking>

<output-format>
Format your output as `construction/requirements/gap-analysis.md`:

# Gap Analysis: {{system_name}}

## Executive Summary
[Brief overview of the gap analysis findings]

## Constellation Review

### Existing Stars
- Star 1: [Name and capability]
- Star 2: [Name and capability]
- Star 3: [Name and capability]

### Integration Points Covered
- [Star A] ↔ [Star B]: [What works]
- [Star C] ↔ [Star D]: [What works]

## Identified Gaps

### Gap 1: [Specific Missing Capability]
**Status:** 🔴 Missing
**Priority:** [Critical/High/Medium/Low]

**Missing Capability:**
[Precise description of what's missing - not vague]

**Why This Gap Exists:**
[Explain why existing stars don't cover this]

**Constraints That Must Shape It:**
- Technical constraint 1
- Business constraint 2
- Integration constraint 3

**Must Connect To:**
- **Star A** via [protocol/contract]
- **Star B** via [protocol/contract]

**Integration Points:**
- Input: [What it receives, from where, format]
- Output: [What it produces, goes where, format]
- Error handling: [How failures propagate]

**Success Criteria:**
- [ ] Criterion 1 (measurable)
- [ ] Criterion 2 (measurable)
- [ ] Criterion 3 (measurable)

**Stakeholder Need:**
[Which stakeholder requirement does this address?]

---

### Gap 2: [Next Missing Capability]
[Repeat structure]

---

## Non-Gaps (Already Covered)

### ❌ Initially Thought Missing: [Capability]
**Actually Covered By:** Star [Name]
**Why We Don't Need New Code:** [Explanation]

---

## Gap Validation Checklist

For each gap above:
- [ ] Closes a real need from stakeholder analysis
- [ ] No existing star satisfies this
- [ ] Scope is precise, not vague
- [ ] Clear integration points defined
- [ ] Success criteria are measurable

## Summary

**Total Gaps Identified:** [Number]
**Critical:** [Number]
**High Priority:** [Number]
**Medium/Low Priority:** [Number]

**Validation Status:**
- [ ] All gaps validated against stakeholder needs
- [ ] All gaps validated against constellation map
- [ ] All integration points specified
- [ ] All success criteria measurable
- [ ] Ready for generation phase
</output-format>

<instructions>
CRITICAL: Only identify true gaps. Do not invent problems or build components because they "might be useful."

NEVER:
- Document vague gaps like "better logging" or "improved performance"
- Identify gaps without checking if existing stars can handle it
- Skip validation against stakeholder requirements
- Define gaps without clear integration points
- Build generic components without constellation awareness

DO NOT:
- List gaps that can be solved by configuring existing stars
- Create gaps to justify familiar patterns from other projects
- Skip the "Non-Gaps" section - documenting what you DON'T need is as important
- Forget to trace each gap back to stakeholder needs

ALWAYS:
- Be specific about missing capabilities
- Define constraints that shape the solution
- Document which stars the gap must connect to
- Provide measurable success criteria
- Complete the validation checklist

REPEAT: Only generate if all validation checks pass. If you can't justify the gap with documented stakeholder needs, don't build it.
</instructions>

<examples>
✅ Good gap documentation:
### Gap: API Rate Limiter Between Gateway and Stripe API
**Status:** 🔴 Missing
**Priority:** Critical

**Missing Capability:**
Rate limiting middleware that prevents Stripe API quota exhaustion (100 req/sec limit) while queuing overflow requests.

**Why This Gap Exists:**
- API Gateway (Star) has no rate limiting
- Stripe API (Star) enforces hard limits
- No middleware exists to bridge this mismatch

**Constraints That Must Shape It:**
- Must handle 500 req/sec peak load
- Stripe enforces 100 req/sec limit
- Queueing delay <2 seconds acceptable
- Must integrate with existing Redis instance

**Must Connect To:**
- **API Gateway** via HTTP middleware (input)
- **Stripe API** via REST client wrapper (output)
- **Redis Cache** for distributed queue state

**Integration Points:**
- Input: HTTP requests from API Gateway (JSON, auth headers)
- Output: Throttled Stripe API calls (official SDK format)
- Error handling: 429 responses queued, 5xx fail fast

**Success Criteria:**
- [ ] Handles 500 req/sec without dropping requests
- [ ] Maintains 100 req/sec limit to Stripe
- [ ] Queue delay <2 seconds at 90th percentile
- [ ] Graceful degradation if Redis unavailable

**Stakeholder Need:**
Addresses CFO requirement for "no payment failures due to rate limits" and Engineering requirement for "Stripe integration reliability"

---

❌ Bad gap documentation:
### Gap: Better Error Handling
**Status:** Missing
**Priority:** High

**Missing Capability:**
The system needs better error handling across components.

**Why This Gap Exists:**
Current error handling isn't good enough.

**Must Connect To:**
Everything

**Success Criteria:**
- Errors handled better
- Fewer bugs

[This is too vague - no specific capability, constraints, integration points, or measurable criteria. Which component? What protocol? What does "better" mean?]

---

✅ Good non-gap documentation:
### ❌ Initially Thought Missing: User Authentication Service
**Actually Covered By:** Star "AuthService"
**Why We Don't Need New Code:**
AuthService (Star) already provides JWT-based auth with OAuth2 support. Constellation map shows it's proven in production for 2 years with 99.9% uptime. Handles SSO requirements from stakeholder analysis. No gap exists.

---

❌ Bad non-gap:
### ❌ Auth stuff
Already have something for this.

[Too vague - doesn't explain what was initially considered, which star covers it, or why it's not a gap]
</examples>
