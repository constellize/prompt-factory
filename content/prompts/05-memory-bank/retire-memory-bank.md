---
# === Identity ===
id: retire-memory-bank
name: Retire outdated memory bank documentation gracefully with preservation
version: v1

# === Classification ===
chapter: 5
category: memory-bank
subcategory: evolution
tags:
  - documentation
  - memory-bank
  - knowledge-retirement
  - archival
  - lesson-extraction
  - historical-preservation
  - institutional-memory
  - evolution-tracking
  - graceful-deprecation
  - learning-preservation

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Retire outdated memory bank documentation gracefully with preservation.
    Archive obsolete knowledge while preserving lessons and maintaining complete system evolution history.
  argument-hint: "[project_name] [retirement_trigger]"
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
    description: The specific project to retire memory bank entries for
    example: "E-commerce Platform"
    maps-to: "$0"
  - name: retirement_trigger
    description: What prompted the need to retire knowledge
    example: "Migrated from REST to GraphQL, REST patterns no longer relevant"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 5
    description: |
      **Retire outdated documentation gracefully** while preserving historical context. Archive obsolete entries with explanations of what changed, cross-reference deprecated approaches with current solutions, and document lessons learned from abandoned approaches.
    preview: |
      "...create retirement notice documenting what this was, why retired, what replaced it, and lessons learned..."
  website:
    include: true
    path: /prompts/retire-memory-bank
  marketplace:
    plugin: constellize:memory

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Retire outdated memory bank documentation for {{project_name}} gracefully to maintain historical context while preventing confusion.

Archive obsolete entries with explanations of what changed, ensuring future engineers understand why approaches were abandoned rather than simply deleting knowledge. Cross-reference deprecated approaches with current solutions, creating clear migration paths from old to new understanding. Preserve historical context for future reference, maintaining the complete evolution of system thinking even for approaches no longer in use. Document lessons learned from abandoned approaches, capturing valuable insights about what didn't work and why to prevent future teams from repeating mistakes.

Treat retirement as knowledge preservation rather than deletion, recognizing that understanding why something was abandoned is often as valuable as knowing the current approach. This creates institutional memory that helps future engineers avoid rehashing old debates, understand system evolution, and make informed decisions based on complete history.

Follow this process:

1. **Identify retirement candidates:**
   - Recognize patterns no longer in use
   - Identify replaced decisions and technologies
   - Note approaches proven ineffective
   - Find documentation for removed code
   - Detect superseded architectural patterns

2. **Document retirement rationale:**
   - Explain what changed that makes this obsolete
   - Document why new approach is superior
   - Capture what was learned from old approach
   - Note when transition occurred
   - Link to replacement documentation

3. **Archive with preservation:**
   - Move to archived knowledge location
   - Add retirement metadata (date, reason, replacement)
   - Create cross-references to current solutions
   - Preserve lessons learned section
   - Maintain searchability for historical research

4. **Update production knowledge:**
   - Remove obsolete entries from active documentation
   - Add deprecation notices with migration guidance
   - Update related decisions referencing retired knowledge
   - Create "what we used to do" context sections
   - Link to archived knowledge for history
</task>

<context>
Project to retire memory bank entries:
{{project_name}}

Retirement trigger:
{{retirement_trigger}}

**Standard Construction Folder Structure:**
This prompt moves to:
- `memory-bank/archived/[year]/[topic]/` (preserved historical knowledge)

This prompt updates:
- `memory-bank/systemPatterns.md` (remove obsolete, add deprecation notices)
- `memory-bank/techContext.md` (remove old tools, note what replaced them)
- `memory-bank/progress.md` (mark migrations complete)
- `memory-bank/activeContext.md` (remove old approaches from current focus)
</context>

<thinking>
Before retiring memory bank entries, analyze:
1. What knowledge is truly obsolete vs temporarily unused?
2. Why did we move away from this approach?
3. What lessons should be preserved?
4. Who might need historical context in future?
5. What's the replacement and how to find it?
6. Are there cross-references that need updating?
</thinking>

<output-format>
Create memory bank retirement following these patterns:

**Retirement Identification Pattern:**

Recognize what should be retired:

**Retirement Triggers:**
```
Retire knowledge when:

1. Code has been removed:
   - Technology migrated away from
   - Pattern no longer in use
   - Feature completely replaced
   - System component decommissioned

2. Approach proven ineffective:
   - Tried and failed
   - Better alternative found
   - Performance inadequate
   - Maintenance burden too high

3. Requirements changed:
   - User needs evolved
   - Business direction shifted
   - Compliance requirements changed
   - Scale demands different approach

4. Technology obsolete:
   - Tool deprecated by vendor
   - Library no longer maintained
   - Framework reached end-of-life
   - Better alternatives emerged

5. Knowledge is actively misleading:
   - Would confuse new team members
   - Conflicts with current approach
   - References non-existent code
   - Describes abandoned patterns
```

**When NOT to retire:**
```
Keep knowledge that:
- Temporarily unused (might return)
- Explains why current approach exists (context)
- Documents failed experiments (learning)
- Describes exploration still possible (future option)
- Provides historical context for decisions

Note: "Temporarily unused" stays active
      "No longer relevant" gets archived
```

---

**Retirement Documentation Pattern:**

Document why retiring:

**Retirement Notice Template:**
```
# RETIRED: [Topic Name]

**Status:** Retired
**Retired Date:** [Date]
**Active Period:** [Start date] - [End date]
**Reason:** [Why retired]
**Replacement:** [What replaced this]

---

## What This Was

[Original documentation preserved exactly as it was]

---

## Why Retired

**What Changed:**
[Specific change that made this obsolete]

**Why Change Occurred:**
- [Reason 1]
- [Reason 2]

**Trigger:**
[Event that prompted retirement]

---

## What Replaced This

**Current Approach:**
[Brief description of current solution]

**Location:**
[Where to find current documentation]

**Migration:**
[How we transitioned from old to new]

---

## Lessons Learned

**What Worked:**
- [Aspect 1 that was successful]
- [Aspect 2 that was successful]

**What Didn't Work:**
- [Problem 1 with old approach]
- [Problem 2 with old approach]

**Key Insights:**
- [Learning 1 to preserve]
- [Learning 2 to preserve]

**Warning Signs:**
[Indicators that this approach was failing]

**For Future:**
[Guidance for anyone considering similar approach]

---

## Historical Context

**Why We Originally Chose This:**
[Original rationale - important for understanding evolution]

**What We Learned Using It:**
[Experience gained during active period]

**Evolution of Understanding:**
[How thinking changed over time]

---

## References

**Replacement Documentation:**
- systemPatterns.md: [Current approach section]
- [Other relevant current docs]

**Related Archived Knowledge:**
- [Other retired approaches that relate]

**Git History:**
- Removal commit: [commit hash]
- Last active: [commit hash]

**Timeline:**
- Adopted: [Date]
- Problems emerged: [Date]
- Investigation started: [Date]
- Decision to replace: [Date]
- Migration completed: [Date]
- Documentation retired: [Date]
```

**Example Retirement Notice:**
```
# RETIRED: Session-Based Authentication

**Status:** Retired
**Retired Date:** 2026-03-15
**Active Period:** 2025-06-10 - 2026-03-15 (9 months)
**Reason:** Migrated to JWT-based authentication for mobile support
**Replacement:** Hybrid JWT + Refresh Token Authentication

---

## What This Was

**Original Documentation:**

Session-Based Authentication Pattern

We use server-side sessions stored in Redis with session cookies
for browser authentication. When user logs in, we create a session
object containing user ID and metadata, store in Redis, and return
session ID cookie to browser.

Implementation:
- Express session middleware
- Redis for session storage (7-day expiry)
- HTTP-only secure cookies
- CSRF protection with tokens

Files:
- src/auth/sessionAuth.js
- src/middleware/sessionMiddleware.js
- src/config/sessionConfig.js

Benefits:
- Server-side revocation (immediate logout)
- Familiar pattern (team expertise)
- Secure (HTTP-only cookies)
- Simple implementation

---

## Why Retired

**What Changed:**
Mobile app development started, requiring stateless authentication
that works across platforms. Session cookies don't work well in
mobile context, and mobile apps need offline capability.

**Why Change Occurred:**
- Mobile app added to roadmap (business priority)
- Session cookies problematic in mobile apps
- Stateless auth enables offline operation
- JWT industry standard for mobile APIs
- Security audit recommended token-based auth

**Trigger:**
Product team committed to mobile app with Q2 launch deadline.
Technical evaluation confirmed session-based auth insufficient
for mobile requirements.

---

## What Replaced This

**Current Approach:**
Hybrid JWT + Refresh Token Authentication

- Short-lived JWT (15 min) for API authentication
- Long-lived refresh tokens (7 days) with server-side revocation
- JWTs are stateless, refresh tokens stored in database
- Both web and mobile use same auth system

**Location:**
- systemPatterns.md: "Hybrid Authentication Architecture"
- techContext.md: "JWT Setup and Configuration"

**Migration:**
Phased migration over 6 weeks:
1. Deployed JWT system alongside sessions (dual support)
2. Migrated web frontend to JWT
3. Built mobile app with JWT
4. Deprecated session endpoints
5. Removed session code

Migration completed: 2026-03-15
All clients now using JWT.

---

## Lessons Learned

**What Worked:**
- Session-based auth was reliable for web-only period
- Redis storage performed well (sub-millisecond session lookups)
- Server-side revocation valuable (instant logout)
- Team comfortable with pattern (smooth operation)

**What Didn't Work:**
- Not forward-looking (assumed web-only forever)
- Stateful nature problematic for horizontal scaling
- Mobile requirements broke assumptions
- Cross-domain issues emerged with CDN

**Key Insights:**

1. **Don't assume single client type**
   - We designed for web browsers only
   - Mobile requirements forced complete rearchitecture
   - Should have anticipated multiple platforms
   - Stateless auth more flexible for future platforms

2. **Stateful auth has scaling limitations**
   - Redis session store became single point of dependency
   - Cross-region deployment complex with shared session state
   - Stateless JWT scales more naturally
   - Consider future scale requirements upfront

3. **Mobile changes everything**
   - Session cookies work poorly in mobile apps
   - Offline capability requires different patterns
   - HTTP-only cookies problematic for native apps
   - Mobile-first design would have chosen differently

4. **Security complexity moves, doesn't disappear**
   - Sessions: Simple security, complex revocation
   - JWT: Complex security, simple scaling
   - No free lunch, just different trade-offs
   - Hybrid approach balances both concerns

**Warning Signs:**
- Cross-domain auth issues (CDN, subdomains)
- Mobile team requesting API-only auth
- Scaling concerns with Redis session state
- Logout delays due to session replication lag

**For Future:**
If considering session-based auth:
- ✅ Good for web-only applications
- ✅ Good when immediate revocation critical
- ✅ Good for small-scale single-region deployment
- ❌ Bad for mobile + web
- ❌ Bad for large-scale multi-region
- ❌ Bad for offline-capable apps

If these constraints don't apply, sessions can work well.
But JWT-based auth is more future-proof for most modern apps.

---

## Historical Context

**Why We Originally Chose This:**

Original Decision (2025-06-10):

"Use session-based authentication for web application. Industry
standard for server-rendered web apps, team has experience,
Redis available for storage. Simple and secure with HTTP-only
cookies and CSRF protection."

Context: MVP for web-only B2B application, no mobile plans.

**What We Learned Using It:**

During 9-month active period:
- Sessions worked reliably (99.9% uptime)
- Performance excellent (Redis sub-ms lookups)
- Security solid (no auth incidents)
- Developer experience good (middleware simple)

Problems emerged:
- Month 3: Cross-domain issues with CDN (workaround added)
- Month 5: Mobile app announced (concern raised)
- Month 6: Scaling discussions (Redis replication concerns)
- Month 7: Security audit suggested token-based auth
- Month 8: Decision to migrate to JWT
- Month 9: Migration completed

**Evolution of Understanding:**

Initial: "Sessions are standard for web apps, we're building
web app, therefore sessions make sense."

Month 5: "Mobile app coming, sessions won't work well there.
Need to think about mobile-friendly auth."

Month 7: "JWT is better fit for mobile + web. More complex
but necessary. Should migrate before mobile launch."

Month 9: "JWT + refresh tokens gives us best of both worlds:
stateless scaling + revocation capability. Should have
designed for this from start."

Current: "Hybrid JWT approach supports all platforms and
scales well. Slightly more complex but worth it. Future
apps should start with JWT unless web-only guaranteed."

---

## References

**Replacement Documentation:**
- systemPatterns.md: "Hybrid Authentication Architecture"
- techContext.md: "JWT Setup and Configuration"
- techContext.md: "Refresh Token Rotation"

**Related Archived Knowledge:**
- memory-bank/archived/2026/csrf-protection/ (also retired with sessions)
- memory-bank/archived/2026/redis-session-store/ (configuration details)

**Git History:**
- Original implementation: commit abc123 (2025-06-10)
- CSRF addition: commit def456 (2025-07-15)
- Last session bugfix: commit ghi789 (2026-02-20)
- JWT implementation: commit jkl012 (2026-03-01)
- Session removal: commit mno345 (2026-03-15)

**Timeline:**
- 2025-06-10: Session auth adopted
- 2025-11-15: Mobile app announced
- 2026-01-10: Decision to migrate to JWT
- 2026-02-01: JWT implementation started
- 2026-03-01: JWT deployed alongside sessions
- 2026-03-15: Session code removed, documentation retired

---

**Archived Location:**
/memory-bank/archived/2026/session-based-auth/

**Access:**
This knowledge is preserved for historical reference. If you're
researching auth evolution or considering session-based auth,
this provides context about our experience.
```

---

**Cross-Reference Pattern:**

Connect archived to current:

**Cross-Reference Template:**
```
In current documentation, add deprecation notice:

## Authentication Evolution

**Current Approach (since [date]):**
[Brief current approach description]

**Previous Approach ([date range]):**
We used [old approach]. Migrated to current approach because
[brief reason]. See archived documentation for complete history:
memory-bank/archived/[year]/[topic]/

**Why Changed:**
[One-sentence summary of key reason]

**Lessons Carried Forward:**
- [Learning 1 that influenced current approach]
- [Learning 2 that influenced current approach]
```

**Example Cross-Reference:**
```
=== In systemPatterns.md ===

## Authentication Architecture

**Current Approach (since 2026-03-15):**

Hybrid JWT + Refresh Token system supporting web and mobile
clients with stateless access tokens and revocable refresh tokens.

**Previous Approach (2025-06-10 to 2026-03-15):**

We used session-based authentication with Redis storage. Migrated
to JWT because mobile app requirements needed stateless auth and
offline capability. See complete history and lessons learned:
memory-bank/archived/2026/session-based-auth/

**Why Changed:**
Mobile platform requirements made stateless authentication necessary,
and JWT better supports our multi-platform strategy.

**Lessons Carried Forward:**
- Server-side revocation is critical (influenced refresh token design)
- Immediate logout must work (refresh token revocation provides this)
- Security simplicity matters (HTTP-only cookies for refresh tokens)

[Current authentication documentation continues...]
```

---

**Archive Organization Pattern:**

Structure archived knowledge:

**Archive Structure:**
```
memory-bank/archived/
├── README.md (explains archive purpose and how to use)
├── INDEX.md (searchable index of all archived knowledge)
├── 2025/
│   ├── [topic-1]/
│   │   ├── RETIRED.md (retirement notice)
│   │   ├── original-docs/ (preserved documentation)
│   │   └── lessons.md (extracted lessons)
│   └── [topic-2]/
└── 2026/
    ├── session-based-auth/
    │   ├── RETIRED.md
    │   ├── original-docs/
    │   │   ├── patterns.md
    │   │   ├── implementation.md
    │   │   └── configuration.md
    │   └── lessons.md
    └── rest-api/
        ├── RETIRED.md
        └── ...
```

**Archive Index Template:**
```
# Archived Knowledge Index

This index helps find retired knowledge for historical research.

## By Year

### 2026

**Session-Based Authentication** (Retired 2026-03-15)
- Active: 2025-06-10 to 2026-03-15
- Reason: Migrated to JWT for mobile support
- Replacement: Hybrid JWT + Refresh Tokens
- Location: archived/2026/session-based-auth/
- Key lessons: Don't assume single platform, mobile changes auth needs

**REST API Architecture** (Retired 2026-04-01)
- Active: 2025-06-01 to 2026-04-01
- Reason: Migrated to GraphQL for performance
- Replacement: GraphQL API
- Location: archived/2026/rest-api/
- Key lessons: Multiple requests hurt mobile, self-documenting APIs win

### 2025

**PostgreSQL Single Instance** (Retired 2025-12-10)
- Active: 2025-06-01 to 2025-12-10
- Reason: Scale required horizontal sharding
- Replacement: Sharded PostgreSQL cluster
- Location: archived/2025/postgres-single-instance/
- Key lessons: Plan for 10x scale, vertical limits reached faster than expected

---

## By Category

### Authentication & Authorization
- Session-Based Authentication (2026)

### API Design
- REST API Architecture (2026)

### Data Storage
- PostgreSQL Single Instance (2025)

---

## How to Use This Archive

**When researching system evolution:**
Read retirement notices to understand why approaches changed.

**When proposing similar approaches:**
Check if we tried this before and why it was retired.

**When onboarding new engineers:**
Review evolution to understand how system developed.

**When debugging legacy code:**
Find old patterns that might still exist in corners of codebase.
```

---

**Retirement Workflow Pattern:**

Systematic retirement process:

**Retirement Checklist:**
```
□ Identify what to retire
  → Code removed, pattern obsolete, or approach proven ineffective

□ Create retirement notice
  → Document what, why, when, and what replaced it

□ Extract lessons learned
  → What worked, what didn't, key insights, warnings

□ Create archive location
  → memory-bank/archived/[year]/[topic]/

□ Move original documentation
  → Preserve exactly as it was, don't edit

□ Update production documentation
  → Remove obsolete entries, add "previous approach" notes

□ Create cross-references
  → Link current to archived, archived to current

□ Update index
  → Add to archived knowledge index for searchability

□ Update related documentation
  → Any docs referencing retired knowledge

□ Validate completeness
  → Can someone understand the evolution?

□ Preserve in git
  → Commit with clear message about retirement
```

**Retirement Process Timeline:**
```
1. Identify retirement candidate (Day 1)
   - Confirm code removed or obsolete
   - Check for lingering references

2. Draft retirement notice (Day 1)
   - What, why, when, replacement
   - Extract lessons learned

3. Create archive structure (Day 1)
   - Create folder: archived/[year]/[topic]/
   - Move original docs preserving structure

4. Update production docs (Day 2)
   - Remove obsolete sections
   - Add "previous approach" context
   - Create cross-references

5. Update archive index (Day 2)
   - Add entry with summary
   - Categorize appropriately

6. Review and validate (Day 2)
   - Check all cross-references work
   - Verify lessons captured
   - Ensure evolution is clear

7. Commit and announce (Day 2)
   - Git commit with retirement message
   - Team notification if significant

Total time: 2-3 hours for typical retirement
Benefit: Complete knowledge preservation
```

---

**Lesson Extraction Pattern:**

Preserve valuable insights:

**Lesson Extraction Template:**
```
# Lessons from [Retired Approach]

## What Worked Well

### [Aspect 1]
**Description:** [What worked]
**Why It Worked:** [Reason]
**Applicable To:** [Where this lesson applies]
**Carry Forward:** [How to use in future]

### [Aspect 2]
...

---

## What Didn't Work

### [Problem 1]
**Description:** [What failed]
**Why It Failed:** [Root cause]
**Warning Signs:** [How to detect this problem]
**Prevention:** [How to avoid in future]

### [Problem 2]
...

---

## Key Insights

### Insight 1: [Title]
**Observation:** [What we learned]
**Implication:** [What this means]
**Guidance:** [How to apply this]
**Examples:** [When this lesson applies]

### Insight 2: [Title]
...

---

## Decision Heuristics

**When to use [retired approach]:**
- Condition 1 applies
- Condition 2 applies
- Avoid if: [Anti-conditions]

**When NOT to use [retired approach]:**
- Situation 1
- Situation 2
- Use alternative if: [Better options]

---

## For Future Engineers

**If considering this approach:**
1. [Question to ask yourself]
2. [Condition to verify]
3. [Trade-off to consider]

**Red flags that indicate problems:**
- [Warning sign 1]
- [Warning sign 2]

**Better alternatives to consider:**
- [Alternative 1]: [When appropriate]
- [Alternative 2]: [When appropriate]
```

**Example Lesson Extraction:**
```
# Lessons from Session-Based Authentication

## What Worked Well

### Server-Side Revocation
**Description:** Ability to immediately invalidate sessions on server
**Why It Worked:** Redis delete operation instant, logout truly immediate
**Applicable To:** Any auth system requiring instant revocation
**Carry Forward:** We kept this benefit with refresh token revocation

### Simple Security Model
**Description:** HTTP-only secure cookies, CSRF tokens
**Why It Worked:** Browser handles cookie security, well-understood patterns
**Applicable To:** Web-only applications with traditional architecture
**Carry Forward:** We use HTTP-only cookies for refresh tokens

### Developer Familiarity
**Description:** Team knew session patterns from previous experience
**Why It Worked:** No learning curve, fast implementation, confident debugging
**Applicable To:** Initial MVPs, time-constrained projects
**Carry Forward:** Consider team expertise when choosing patterns

---

## What Didn't Work

### Single-Platform Assumption
**Description:** Designed only for web browsers, assumed no other clients
**Why It Failed:** Business priorities changed, mobile app became critical
**Warning Signs:** Product roadmap discussions mentioning mobile/API
**Prevention:** Design for multiple platforms from start unless truly impossible

### Stateful Architecture
**Description:** Session state in Redis required by all requests
**Why It Failed:** Created scaling bottleneck, cross-region complexity
**Warning Signs:** Redis CPU spikes, replication lag, regional latency concerns
**Prevention:** Prefer stateless when scale uncertain, stateful when revocation critical

### Cross-Domain Complexity
**Description:** Cookies don't work well across domains (CDN, subdomains)
**Why It Failed:** Workarounds brittle, increased complexity
**Warning Signs:** Feature requests involving multiple domains
**Prevention:** Consider token-based auth if multi-domain likely

---

## Key Insights

### Insight 1: Mobile Requirements Transform Auth Needs
**Observation:** Mobile apps need fundamentally different auth patterns than web
**Implication:** Session cookies don't work in native mobile apps
**Guidance:** If mobile is possibility, start with token-based auth
**Examples:** iOS/Android apps, offline capability, cross-platform sync

### Insight 2: Future Platforms Are Unpredictable
**Observation:** We didn't plan for mobile, it emerged mid-project
**Implication:** "Web-only" assumptions often prove incorrect
**Guidance:** Design for flexibility even if current requirements are narrow
**Examples:** Mobile apps, public APIs, third-party integrations

### Insight 3: Revocation vs Statelessness Trade-off
**Observation:** Session auth trades statelessness for instant revocation
**Implication:** No perfect solution, only trade-offs
**Guidance:** Hybrid approaches can get benefits of both
**Examples:** JWT + refresh tokens, short-lived stateless + revocable long-lived

### Insight 4: Migration Cost Is Real
**Observation:** Moving from sessions to JWT took 6 weeks, all clients affected
**Implication:** Initial architecture choice has long-term lock-in
**Guidance:** Choose carefully upfront, migration is expensive
**Examples:** Auth changes, API paradigm shifts, database changes

---

## Decision Heuristics

**When session-based auth is appropriate:**
- Web-only application (guaranteed no mobile)
- Small scale (single region, < 1M users)
- Immediate revocation critical (security requirement)
- Team expertise with sessions (fast implementation)
- Traditional server-rendered architecture

**When NOT to use session-based auth:**
- Mobile app exists or planned
- Public API for third parties
- Large scale or multi-region
- Offline capability needed
- Microservices architecture (stateless preferred)

---

## For Future Engineers

**If considering session-based auth:**

1. **Ask: Will this ever need mobile support?**
   - If yes: Choose JWT instead
   - If no: Are you really sure? Most apps eventually do

2. **Verify: Is immediate revocation truly required?**
   - Security audit says yes: Sessions good fit
   - Just nice to have: JWT with refresh tokens sufficient

3. **Consider: What's the scale trajectory?**
   - Small and staying small: Sessions fine
   - Growth expected: Plan for stateless from start

**Red flags that indicate problems ahead:**
- Product team mentions "mobile-first"
- Roadmap includes public API
- Multi-region deployment planned
- Microservices architecture discussed
- Scale projections >100K users

**Better alternatives to consider:**
- JWT + refresh tokens: Mobile-friendly, scalable, revocable
- OAuth 2.0: Third-party integration, standard protocol
- Hybrid: Sessions for web, tokens for mobile (if must support both)
```

---

**Validation Pattern:**

Ensure retirement quality:

**Retirement Quality Checklist:**
```
□ Original knowledge fully preserved
  → Nothing deleted, exact state archived

□ Retirement rationale clear
  → Obvious why this was retired, not just "we changed"

□ Replacement identified
  → Clear pointer to current approach

□ Lessons extracted
  → What worked, what didn't, key insights

□ Cross-references complete
  → Current docs reference archived, vice versa

□ Searchable
  → Added to archive index, findable by keywords

□ Complete evolution story
  → Can understand journey from old to new

□ Future-useful
  → Someone considering similar approach can learn from this
```

</output-format>

<instructions>
CRITICAL: Retirement preserves knowledge by archiving, not deleting.

NEVER retire by:
- Deleting obsolete documentation (history lost)
- Removing without explanation (context lost)
- Ignoring lessons learned (wisdom lost)
- Forgetting cross-references (navigation lost)
- Making archived knowledge unsearchable (practically lost)

DO NOT:
- Just delete old docs because they're outdated
- Retire without documenting why
- Forget to link replacement
- Skip extracting lessons
- Leave archived knowledge unorganized
- Remove references without replacement

ALWAYS:
- Archive rather than delete
- Document why retired and when
- Identify replacement clearly
- Extract and preserve lessons
- Create bidirectional cross-references
- Maintain searchable archive index
- Preserve complete context
- Make evolution story clear

REPEAT: Retirement is preservation, not deletion. Archive with context so future engineers learn from complete history.
</instructions>

<examples>
✅ GOOD Retirement (complete preservation, clear context):

**Pattern demonstrates:**
- Full original documentation preserved
- Clear retirement rationale
- Comprehensive lessons extracted
- Cross-references to current approach
- Searchable archive organization

**Example retirement:**
```
Retired session-based auth documentation shown in examples above.

Result of good retirement:

6 months later, new engineer proposes sessions:

Engineer: "Why don't we use session-based auth? It's simpler."

Tech lead: "Let's check if we tried that before."

Searches archive index → Finds session-based auth entry

Reads retirement notice:
- Sees we used it for 9 months
- Understands why we migrated (mobile requirements)
- Reviews lessons learned
- Notes warning signs we encountered
- Sees hybrid JWT+refresh tokens as replacement

Engineer: "Ah, I see. We did use sessions but mobile made JWT necessary.
The lessons show that mobile fundamentally changes auth needs. Since
we're planning iOS app next quarter, JWT makes sense. Also interesting
that they got server-side revocation with refresh tokens, so we still
have that benefit."

Time saved: 6 weeks of exploration we already did
Decision: Evidence-based, informed by experience
Knowledge: Successfully transferred across time
```

**Why this works:**
- Complete context preserved
- Lessons explicitly extracted
- Future engineer learns from experience
- Avoids repeating exploration
- Makes informed decision quickly
- Knowledge successfully preserved

---

❌ BAD Retirement (deletion, no context):

**Anti-pattern characteristics:**
- Documentation just deleted
- No explanation why
- No lessons preserved
- No cross-references
- Knowledge lost

**Bad retirement:**
```
git rm src/docs/session-auth.md
git commit -m "Remove old auth docs"

(No archive created)
(No retirement notice)
(No lessons extracted)
(No cross-references)
(Documentation just gone)
```

**Why this fails:**
```
6 months later, new engineer proposes sessions:

Engineer: "Why don't we use session-based auth? It's simpler."

Tech lead: "I think we tried that? Not sure what happened."

Searches docs → Nothing
Searches git history → Deleted commit, no context
Asks team → Half remember, details fuzzy

Engineer: "Well, no one seems sure. Let me research sessions..."

→ Spends 2 weeks researching sessions
→ Proposes implementation plan
→ Team debates for week (remembered concerns but not specifics)
→ Builds prototype (2 weeks)
→ Discovers same problems we already knew about
→ Realizes mobile incompatibility (we already learned this)
→ Has to migrate to JWT (we already did this)

Time wasted: 6 weeks relearning what we knew
Frustration: High (team feels incompetent)
Knowledge: Lost, had to be rediscovered painfully
```

**Impact of bad retirement:**
- Complete waste of 6 weeks
- Team morale hurt (feel like they're going in circles)
- Same lessons learned twice
- Same mistakes repeated
- No institutional memory
- Could have been prevented with proper retirement

---

✅ GOOD Lesson Extraction (actionable insights):

**Pattern demonstrates:**
- Specific what worked/didn't
- Clear warning signs
- Actionable guidance
- Decision heuristics

**Example lesson extraction:**
(Session auth lessons shown in examples above)

**How it helps future engineers:**
```
Engineer considering similar choice can:

1. Read what worked:
   - "Server-side revocation was valuable"
   - Know: If I need instant revocation, this is a plus

2. Read what didn't work:
   - "Single-platform assumption failed"
   - Know: I must consider future platforms

3. Review warning signs:
   - "Product mentions mobile"
   - Know: That's a red flag for sessions

4. Apply decision heuristics:
   - "Sessions appropriate for web-only, small scale"
   - Know: My context determines appropriateness

5. Make informed decision:
   - Based on real experience, not theory
   - Avoiding known pitfalls
   - Understanding trade-offs

Result: Better decision in 1 hour vs 6 weeks exploration
```

---

❌ BAD Lesson Extraction (vague, not actionable):

**Anti-pattern characteristics:**
- Generic observations
- No specific guidance
- No decision help
- Not actionable

**Bad lesson extraction:**
```
# Lessons from Session-Based Auth

Sessions didn't work for us.

JWT is better.

(No specifics)
(No context)
(No guidance)
(Not helpful)
```

**Why this fails:**
- Doesn't explain what didn't work
- Doesn't say why JWT is better
- Doesn't provide decision criteria
- Doesn't help future choices
- Completely unhelpful

**Impact:**
Future engineer: "This says sessions didn't work and JWT is better,
but doesn't say why. Not helpful. I'll have to research from scratch."

→ No value from lesson extraction
→ Might as well not exist
→ Time wasted creating useless documentation
</examples>
