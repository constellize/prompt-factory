---
# === Identity ===
id: constellation-map
name: Map constellation of trusted components and their integration points
version: v1

# === Classification ===
chapter: 3
category: architecture

tags:
  - architecture
  - constellation
  - components
  - integration
  - systemPatterns

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Map constellation of trusted components and their integration points.
    When planning system architecture using existing proven components.
  argument-hint: "[system_name] [system_description] [known_components] [output_path]"
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
  - name: system_description
    description: A description of what the system does
    example: "A distributed payment processing system that handles transactions, fraud detection, and settlement"
    maps-to: "$1"
  - name: known_components
    description: Any known components, services, or constraints
    example: "Using Stripe API, PostgreSQL database, Redis cache, existing AuthService"
    maps-to: "$2"
  - name: output_path
    description: >
      Optional. A markdown file to write this artifact into as a single owned section,
      instead of the default project-level path. Prerequisites are then read from
      sibling sections of the same file.
    example: "llm/features/rate-limiting.md"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    chapter: 3
    description: |
      Map trusted components and integration points
    preview: |
      "Create a constellation map for {{system_name}} by identifying trusted components ("stars") and mapping their integration points. Treat reliable, proven components like stars in your constellation—solid points you can build around. A library you trust. A stable internal service. A tested prompt or API pattern. Instead of reinventing these, catalogue what you can trust and build upon...."
  website:
    include: true
    path: /prompts/constellation-map
  marketplace:
    plugin: constellize:design

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Create a constellation map for {{system_name}} by identifying trusted components ("stars") and mapping their integration points.

Treat reliable, proven components like stars in your constellation—solid points you can build around. A library you trust. A stable internal service. A tested prompt or API pattern. Instead of reinventing these, catalogue what you can trust and build upon.

Don't blindly bolt components together; trace the connections carefully. What assumptions do they rely on? What contracts do they expose? Where do they overlap or conflict? Rather than imposing a top-down architecture, let design emerge by drawing these connections.

Follow this process:

1. **Identify "stars" (trusted components)** from:
   - Proven libraries and frameworks
   - Stable internal services
   - Tested API patterns
   - Reliable third-party services

2. **For each star, document:**
   - Core assumptions and scaling model
   - Exposed contracts (APIs, schemas, dependencies)
   - Known overlaps or conflicts with other components
   - Authentication and error-handling patterns

3. **Map integration points** between stars:
   - How do they connect?
   - What data flows between them?
   - What happens when one fails?
   - Where are the architectural seams?

4. **Apply star identification checklist:**
   - Is this component proven in production?
   - Do we understand its failure modes?
   - Are its contracts documented and stable?
   - Can we extend it without breaking existing users?
</task>

<context>
This prompt outputs to `construction/requirements/constellation-map.md`.

**Optional output path (`{{output_path}}`):**
`output_path` is a markdown file. When it is given, this skill owns the one section in that file titled `## Constellation Map`: it replaces that section in place and leaves the rest of the file untouched. It has no prerequisite artifact; it proceeds with the context the caller supplied inline. When `output_path` is absent, every path is exactly as stated above. This skill never creates a project-level file it was not asked for, and never scaffolds `llm/construction/`.

System description:
{{system_description}}

Known components or constraints:
{{known_components}}
</context>

<output-format>
Format your output as `construction/requirements/constellation-map.md`:

**Standard Construction Folder Structure:**
```
construction/
  requirements/
    constellation-map.md      # Output of this prompt
    gap-analysis.md           # Next: Gap identification
    scope-lock.md             # Next: Scope governance
  design/
    implementation-sketches.md # Next: Design approaches
```

# System Constellation Map: {{system_name}}

## Overview
[Brief description of the system and its purpose]

## Stars (Trusted Components)

### Star: [Component Name]
**Type:** [Library/Service/API/Framework]
**Status:** [Proven in production/Stable/Well-tested]

**Core Assumptions:**
- [Assumption 1]
- [Assumption 2]

**Scaling Model:**
- [How it scales]

**Exposed Contracts:**
- API: [Endpoints/methods]
- Schema: [Data structures]
- Dependencies: [Required components]

**Authentication Pattern:**
- [How auth works]

**Error Handling:**
- [How failures manifest]
- [Recovery strategies]

**Known Conflicts/Overlaps:**
- [Conflicts with other stars]

---

### Star: [Next Component]
[Repeat structure]

---

## Integration Points

### Integration: [Star A] ↔ [Star B]
**Connection Type:** [API/Event/Data flow]
**Data Flow:** [What moves between them]
**Failure Mode:** [What happens when connection breaks]
**Dependencies:** [What must work for this to work]

---

## Architectural Seams
[Where the system can be extended or modified]

## Star Identification Checklist
- [ ] All stars are proven in production
- [ ] Failure modes are documented
- [ ] Contracts are documented and stable
- [ ] Extension points identified
- [ ] Integration points traced
- [ ] No new code until constellation is complete
</output-format>

<thinking>
Before starting, analyze:
1. What are the proven, stable components already in use?
2. What assumptions do these components make?
3. How do they currently connect (or not connect)?
4. What would break if we added new components now?
</thinking>

<instructions>
CRITICAL: Complete the constellation map BEFORE considering new components.

NEVER start coding new components until:
- All existing stars are documented
- Integration points are traced
- Failure modes are understood
- Architectural seams are identified

DO NOT:
- Impose a top-down architecture - let design emerge from connections
- Assume components will "just work" together - trace dependencies explicitly
- Skip documenting failure modes - every star must have this
- Add stars that aren't proven in production

ALWAYS:
- Document contracts before integration
- Understand what happens when connections break
- Identify conflicts between stars
- Complete the checklist at the end
</instructions>

<examples>
✅ Good star documentation:
### Star: PostgreSQL Database
**Type:** Database
**Status:** Proven in production (3 years, 10M+ queries/day)

**Core Assumptions:**
- Single-writer, multiple-readers model
- ACID transactions required
- Network latency <5ms

**Exposed Contracts:**
- API: SQL interface via pg driver
- Schema: 47 tables, foreign key constraints
- Dependencies: Requires connection pooling

**Authentication Pattern:**
- SSL certificate-based auth
- Separate read/write credentials

**Error Handling:**
- Connection failures: Automatic retry with exponential backoff
- Query timeouts: 30s hard limit, graceful degradation
- Recovery: Point-in-time recovery enabled

**Known Conflicts:**
- Blocks Redis cache updates during long transactions
- Schema migrations require downtime coordination

❌ Bad star documentation:
### Star: Database
**Type:** Database
**Status:** Works fine

Uses PostgreSQL. Has tables. Auth works.

[This is too vague - missing assumptions, contracts, failure modes, and conflicts]
</examples>
