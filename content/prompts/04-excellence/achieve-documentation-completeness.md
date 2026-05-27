---
# === Identity ===
id: achieve-documentation-completeness
name: Achieve documentation completeness that helps any team member understand and contribute
version: v1

# === Classification ===
chapter: 4
category: excellence
subcategory: gate-4
tags:
  - quality
  - documentation
  - readme
  - comments
  - api-docs
  - gate-4

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Achieve documentation completeness that helps any team member understand and contribute.
    Creating comprehensive documentation for maintainability (Gate 4: Maintainability in Context).
  argument-hint: "[component_name] [system_name]"
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
  - name: component_name
    description: The specific component to achieve documentation completeness for
    example: "PaymentProcessor"
    maps-to: "$0"
  - name: system_name
    description: The name of your system
    example: "Payment Processing System"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 4
    description: |
      **Achieve documentation completeness** that helps any team member understand and contribute to the codebase. README files should explain purpose, setup, and usage clearly without assuming prior knowledge. Code comments must explain why decisions were made, not just what the code does—the code itself shows what. API documentation needs to stay current as interfaces evolve. Decision rationale belongs in memory bank entries so future maintainers understand the context behind choices.
    preview: |
      "...create comprehensive README with setup and troubleshooting. Write comments that document WHY, not WHAT. Capture decision rationale in memory bank..."
  website:
    include: true
    path: /prompts/achieve-documentation-completeness
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Achieve documentation completeness for {{component_name}} in {{system_name}} that helps any team member understand and contribute to the codebase.

README files should explain purpose, setup, and usage clearly without assuming prior knowledge. Code comments must explain why decisions were made, not just what the code does—the code itself shows what. API documentation needs to stay current as interfaces evolve. Decision rationale belongs in memory bank entries so future maintainers understand the context behind choices.

Follow this process:

1. **Create comprehensive README:**
   - Explain component purpose and responsibilities
   - Document setup requirements (dependencies, environment variables)
   - Provide quick start guide (installation, first run)
   - Explain development workflow (build, test, deploy)
   - Include troubleshooting section for common issues

2. **Write explanatory code comments:**
   - Explain WHY decisions were made (not WHAT code does)
   - Document non-obvious business logic and domain rules
   - Clarify complex algorithms with rationale
   - Note any workarounds or temporary solutions
   - Explain performance optimizations and trade-offs

3. **Maintain current API documentation:**
   - Document all public endpoints with examples
   - Specify request/response schemas (OpenAPI/Swagger)
   - Include error responses and codes
   - Provide authentication requirements
   - Update docs when interfaces change (not after)

4. **Capture decision rationale in memory bank:**
   - Document why this approach was chosen
   - Record alternatives considered and why they were rejected
   - Explain trade-offs and constraints
   - Note assumptions and future considerations
   - Reference related decisions and components
</task>

<context>
Component to document:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates/updates:
- `README.md` in component directory
- Code comments in implementation files
- API documentation (OpenAPI spec, JSDoc, etc.)
- `memory-bank/decisions/[component-name]-*.md` entries
</context>

<thinking>
Before documenting, analyze:
1. Who will read this documentation? (new team members, operators, API consumers)
2. What knowledge can we assume? (general programming, domain knowledge)
3. What questions will readers have? (how to set up, why this approach, what errors mean)
4. What changes frequently? (APIs need versioning and change logs)
5. What decisions need preservation? (architectural choices, trade-off analysis)
</thinking>

<output-format>
Create comprehensive README following this pattern:

**README Structure Pattern:**

1. **Purpose Section:**
   - Clear statement of component responsibilities
   - What it DOES handle (positive list)
   - What it DOES NOT handle (negative list with delegation)
   - Architectural context (constellation/domain membership)

2. **Architecture Section:**
   - System dependencies (databases, caches, external services)
   - Consumer components (who uses this)
   - Integration points

3. **Setup Section:**
   - Prerequisites (runtime, tools, accounts)
   - Environment variables (required vs optional, with examples)
   - Step-by-step installation commands
   - Verification procedure

4. **Development Section:**
   - Build commands
   - Test commands (all types: unit, integration, coverage)
   - Local development workflow
   - Hot reload capabilities

5. **API Section:**
   - Link to full documentation
   - Quick reference examples
   - Key endpoint patterns

6. **Deployment Section:**
   - Link to detailed procedures
   - Quick deployment examples

7. **Troubleshooting Section:**
   - Common issues with symptoms
   - Solutions with concrete commands
   - Where to get help

**Example README Pattern:**
```
# [Component Name]

Purpose: [Single sentence] + constellation context
Responsibilities: [Bulleted list]
NOT responsibilities: [Bulleted list with ownership]

Prerequisites: [Runtime/tools/accounts needed]
Environment: [Variables with examples and defaults]
Installation: [Numbered steps with commands]
Verification: [How to confirm it works]

Development: [Build/test/run commands]
API: [Link + quick examples]
Deployment: [Link + quick command]
Troubleshooting: [Symptom → Solution pairs]
```

**Code Comment Pattern:**

Document WHY decisions were made, not WHAT code does:

**Pattern Elements:**
- **Business Requirements:** Reference ticket/requirement ID
- **Alternatives Considered:** What else was evaluated
- **Trade-offs:** Why this approach over others
- **Constraints:** Business rules, regulatory requirements
- **Non-obvious Logic:** Domain knowledge embedded in code
- **Recovery Patterns:** How failures are handled
- **Performance Decisions:** Optimization rationale

**Comment Pattern Template:**
```
// WHY: [Primary reason for this approach]
// [Business context or requirement source]
// Alternative considered: [What else was evaluated]
// [Trade-off explanation if applicable]
[Code implementing the pattern]
```

**Example Patterns:**

Rate Limiting Pattern:
```
// WHY: Rate limit per [entity] to prevent [specific problem]
// Business requirement from [source]
// Alternative: [Other approach] but [reason for rejection]
[Rate limiting implementation]
```

Validation Before External Call Pattern:
```
// WHY: Validate BEFORE [external service] to avoid [cost/problem]
// [External service] charges for [what operations]
[Validation logic]
```

Error Wrapping Pattern:
```
// WHY: Wrap [external] errors in [standard error] for consistency
// Maps [external codes] to [internal format]
[Error transformation logic]
```

State Persistence Pattern:
```
// WHY: Store [entity] BEFORE returning to ensure [guarantee]
// Recovery pattern: [how to recover from failures]
[Persistence logic]
```

**API Documentation Pattern:**

Use OpenAPI/Swagger or equivalent structured format:

**Required Elements:**
- Endpoint purpose and description
- Request schema with constraints
- Response schemas for all status codes
- Error response examples
- Authentication requirements
- Concrete examples for common cases

**Documentation Pattern:**
```
Endpoint: [HTTP method] [path]
Description: [What it does] + [special behaviors]
Authentication: [Required scheme]
Request Schema:
  - Field: [Type] [Constraints] [Purpose]
Response Codes:
  - [Code]: [Meaning] + [when it occurs]
  - Error examples with codes and details
Examples:
  - [Common use case with request/response]
```

**Memory Bank Decision Pattern:**

Capture architectural decisions with full context:

**Decision Template Structure:**
1. **Metadata:** Date, component, status, deciders
2. **Context:** What problem needs solving, what options exist
3. **Decision:** Clear statement of chosen approach
4. **Rationale:** Why chosen (benefits, requirements met)
5. **Why Not Alternatives:** What else considered and why rejected
6. **Consequences:** Positive, negative, neutral impacts
7. **Alternatives:** Full list with rejection reasons
8. **References:** Links to docs, related decisions
9. **Notes:** Implementation requirements, follow-up items

**Decision Pattern:**
```
Decision: [Clear statement of choice]
Date: [When decided]
Status: [Proposed/Accepted/Deprecated]

Context: [Problem description] + [Options available]

Rationale:
- [Primary driver 1 with evidence]
- [Primary driver 2 with evidence]
- [Constraints that guided decision]

Alternatives Considered:
- [Option A]: [Why rejected]
- [Option B]: [Why deferred]

Consequences:
+ Positive: [Benefits gained]
- Negative: [Costs incurred]
± Neutral: [Other impacts]

References: [Links to supporting material]
```
</output-format>

<instructions>
CRITICAL: Documentation completeness helps any team member understand and contribute.

NEVER document by:
- Writing README without setup instructions (can't onboard)
- Commenting WHAT code does instead of WHY (code already shows what)
- Letting API docs drift from implementation (misleading)
- Forgetting to document decisions (context lost)
- Assuming tribal knowledge (not transferable)
- Writing documentation after the fact (inaccurate)

DO NOT:
- Skip troubleshooting section in README
- Write comments that just restate code
- Forget to update API docs when changing endpoints
- Make decisions without documenting rationale
- Use jargon without explanation
- Write documentation for yourself (write for newcomers)

ALWAYS:
- Write README with clear setup and troubleshooting
- Comment WHY decisions were made (not what code does)
- Keep API documentation current (update with code changes)
- Document decision rationale in memory bank
- Write for team members who don't have context
- Include examples in documentation
- Explain non-obvious business logic
- Document assumptions and constraints
- Reference related decisions and components
- Update docs when code changes (not after)

REPEAT: Documentation helps team members understand and contribute. README explains setup. Comments explain WHY. API docs stay current. Decisions captured in memory bank.
</instructions>

<examples>
✅ GOOD README Pattern (comprehensive, actionable):

**Structure demonstrates:**
- Clear purpose with single responsibility
- Complete prerequisites list
- Step-by-step setup with verification
- Troubleshooting with symptom/solution pairs
- No assumptions about prior knowledge

**Key elements:**
```
Purpose: [What it does] + [Architectural context]
Prerequisites: [All requirements listed]
Setup: [Numbered steps with commands]
Verification: [How to confirm success]
Troubleshooting: [Common issues with solutions]
```

**Why this works:**
- New team member can onboard independently
- Nothing assumed about environment
- Verification confirms correct setup
- Troubleshooting prevents support bottleneck

---

❌ BAD README Anti-pattern (vague, incomplete):

**Missing elements:**
- Vague purpose without context
- No prerequisite list
- Single-line setup without steps
- No verification procedure
- No troubleshooting guidance

**Why this fails:**
- Can't onboard without tribal knowledge
- Unknown dependencies block progress
- No way to verify correct setup
- Team bottleneck answering same questions

---

✅ GOOD Code Comment Pattern (explains WHY):

**Pattern demonstrates:**
- Business requirement reference
- Alternative approaches considered
- Trade-off rationale
- Decision document linkage
- Non-obvious choice explanation

**Comment structure:**
```
// WHY: [Business/technical reason]
// [Requirement source or ticket]
// Alternative: [Other option] but [rejection reason]
// [Trade-off explanation if relevant]
```

**Why this works:**
- Future maintainers understand context
- Can evaluate if decision still valid
- Business knowledge preserved
- Technical rationale documented

---

❌ BAD Code Comment Anti-pattern (states WHAT):

**Anti-pattern characteristics:**
- Restates what code does
- No business context
- No alternatives mentioned
- No decision rationale
- No value beyond reading code

**Why this fails:**
- Adds no information
- Business context lost
- Can't evaluate alternatives
- Maintenance harder without context

---

✅ GOOD API Documentation Pattern (complete, current):

**Pattern demonstrates:**
- Complete request/response schemas
- Business constraints explained
- Error cases documented
- Concrete examples provided
- Special behaviors noted

**Documentation structure:**
```
Purpose: [What endpoint does]
Special behaviors: [Non-standard patterns]
Request schema: [All fields with constraints]
Response codes: [All codes with meanings]
Error examples: [Concrete error responses]
Use case examples: [Common scenarios]
```

**Why this works:**
- API consumers can integrate independently
- Constraints prevent invalid requests
- Error handling clear
- Examples accelerate integration

---

❌ BAD API Documentation Anti-pattern (incomplete, outdated):

**Missing elements:**
- No field schemas
- No examples
- Missing error documentation
- Wrong status codes
- No constraint documentation

**Why this fails:**
- Can't use API without source code
- Trial-and-error integration
- Error handling guesswork
- Maintenance burden from questions

---

✅ GOOD Memory Bank Decision Pattern (complete rationale):

**Pattern demonstrates:**
- Problem context clearly stated
- Decision explicitly declared
- Full rationale with evidence
- Alternatives evaluated
- Consequences acknowledged
- References provided

**Decision structure:**
```
Context: [Problem] + [Options available]
Decision: [Clear choice statement]
Rationale: [Why chosen with evidence]
Alternatives: [What else considered + rejection reasons]
Consequences: [Positive/negative/neutral impacts]
References: [Supporting documentation]
```

**Why this works:**
- Future maintainers understand context
- Can re-evaluate if context changes
- Alternative paths documented
- Trade-offs acknowledged

---

❌ BAD Memory Bank Decision Anti-pattern (missing rationale):

**Missing elements:**
- No problem context
- No rationale explanation
- No alternatives considered
- No consequences evaluated
- No references provided

**Why this fails:**
- Context lost to team
- Can't evaluate if still appropriate
- Alternatives unknown
- Can't assess impact
- Knowledge not transferable
</examples>
