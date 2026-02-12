---
# === Identity ===
id: revise-memory-bank
name: Revise memory bank documentation when circumstances change
version: v1

# === Classification ===
chapter: 5
category: memory-bank
subcategory: evolution
tags:
  - documentation
  - memory-bank
  - knowledge-evolution
  - revision-tracking
  - assumption-validation
  - decision-evolution
  - constraint-changes
  - learning-capture
  - historical-preservation
  - living-documentation

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Revise memory bank documentation when circumstances change.
    Maintain accurate knowledge as constraints, priorities, and understanding evolve.
  argument-hint: "[project_name] [change_trigger]"
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
    description: The specific project to revise memory bank for
    example: "E-commerce Platform"
    maps-to: "$0"
  - name: change_trigger
    description: What prompted the need to revise knowledge
    example: "User feedback revealed performance requirements were underestimated"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/revise-memory-bank
  marketplace:
    plugin: constellize-memory-bank

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Revise memory bank documentation for {{project_name}} when circumstances change to maintain accuracy and relevance.

Update entries when constraints or priorities shift, ensuring documentation reflects current reality rather than outdated assumptions. Annotate decisions with new information that affects their validity, showing how understanding has evolved without erasing original reasoning. Mark assumptions that have been validated or invalidated by experience, creating a record of what was learned through implementation. Document evolution of understanding rather than just current state, preserving the progression of knowledge that helps future engineers understand not just what decisions were made, but how thinking evolved over time.

Treat revisions as additions to knowledge history rather than replacements, showing the journey from initial understanding to current state. This approach creates living documentation that captures not just facts but the learning process, making it easier for future team members to understand why certain paths were taken and what was discovered along the way.

Follow this process:

1. **Identify what changed:**
   - Scan for constraint changes (performance, security, scale, budget)
   - Identify priority shifts (features reprioritized, timelines adjusted)
   - Note invalidated assumptions (proven wrong by implementation or testing)
   - Recognize validated assumptions (proven correct through experience)
   - Detect new information affecting previous decisions

2. **Locate affected documentation:**
   - Find decisions based on changed circumstances
   - Identify patterns that may need adjustment
   - Locate assumptions stated in documentation
   - Review related technical choices
   - Check for cascading impacts on other decisions

3. **Revise with evolution tracking:**
   - Preserve original reasoning with clear "as of" dates
   - Add annotations showing what changed and when
   - Document why change occurred and what triggered it
   - Mark assumptions as validated or invalidated
   - Link to new decisions influenced by revised understanding

4. **Validate revision quality:**
   - Original context preserved (can still understand initial thinking)
   - Evolution clearly documented (can see progression of understanding)
   - Current state accurate (reflects reality)
   - Future-reader clarity (makes sense to someone new)
   - Cross-references updated (linked decisions revised as needed)
</task>

<context>
Project to revise memory bank:
{{project_name}}

Change trigger:
{{change_trigger}}

**Standard Construction Folder Structure:**
This prompt revises:
- `memory-bank/systemPatterns.md` (architectural decisions affected by changes)
- `memory-bank/productContext.md` (user needs or metrics that shifted)
- `memory-bank/techContext.md` (technical constraints that changed)
- `memory-bank/projectbrief.md` (requirements or scope adjustments)
- `memory-bank/activeContext.md` (current understanding updates)
- `memory-bank/progress.md` (timeline or priority adjustments)
</context>

<thinking>
Before revising memory bank, analyze:
1. What specifically changed (constraints, priorities, assumptions)?
2. Which decisions were based on what changed?
3. Is the original reasoning still valuable to preserve?
4. What new information affects previous conclusions?
5. Are there cascading impacts on related decisions?
6. How should evolution be documented without losing history?
</thinking>

<output-format>
Create memory bank revision following these patterns:

**Change Identification Pattern:**

Systematically identify what changed:

**Change Analysis:**
```
Scan for changes in:

1. Constraints:
   - Performance requirements changed?
   - Security requirements tightened?
   - Scale expectations adjusted?
   - Budget constraints shifted?
   - Technology limitations discovered?

2. Priorities:
   - Features reprioritized?
   - Timeline compressed or extended?
   - User needs reordered?
   - Business goals adjusted?
   - Success metrics changed?

3. Assumptions:
   - Initial assumptions proven wrong?
   - Hypotheses validated by testing?
   - Expected patterns not observed?
   - Complexity higher/lower than assumed?
   - Dependencies different than expected?

4. New Information:
   - User feedback contradicts assumptions?
   - Performance testing reveals issues?
   - Security audit identifies gaps?
   - Market research changes direction?
   - Technology evaluation alters choices?

5. Experience Gained:
   - Implementation harder than expected?
   - Patterns emerged during development?
   - Integration more complex than assumed?
   - Team capabilities different than thought?
   - Tool limitations discovered?
```

---

**Decision Revision Pattern:**

Revise decisions while preserving history:

**Revision Template:**
```
Decision: [Original decision statement]

Original Rationale (as of [date]):
- [Original reason 1]
- [Original reason 2]
- [Original context]

Status: [Revised / Partially Invalidated / Under Review]

**Revision ([date]):**

What Changed:
- [Specific change that affects this decision]
- [New information discovered]
- [Constraint that shifted]

Impact on Decision:
- [How change affects validity]
- [What aspects remain valid]
- [What aspects need reconsideration]

Updated Understanding:
- [Current thinking based on new information]
- [Adjustments to approach]
- [New considerations]

Actions Taken:
- [What was changed in implementation]
- [How system was adjusted]
- [New decisions made as result]

Lessons Learned:
- [What this taught about assumptions]
- [What to do differently next time]
- [How to validate earlier in future]

Original Decision Preserved For:
- [Historical context]
- [Understanding thought process]
- [Learning from evolution]
```

**Example Decision Revision:**
```
Decision: Cache user profiles in memory for fast access

Original Rationale (as of 2026-01-10):
- Profile lookups are frequent (20% of all requests)
- User profiles rarely change (update rate < 1%/day)
- In-memory cache provides sub-millisecond access
- Memory footprint manageable (100 bytes per user, 10K users = 1MB)

Status: Partially Invalidated

**Revision (2026-01-20):**

What Changed:
- User base grew from 10K to 100K users (10x)
- Memory footprint now 10MB and growing
- Profile update rate increased to 15%/day (users personalizing more)
- Cache invalidation becoming complex

Impact on Decision:
- Original assumption of "rarely change" proven wrong
- Memory footprint assumption underestimated growth
- In-memory cache still fast but harder to keep consistent
- Stale data issues affecting user experience

Updated Understanding:
- Cache is still valuable but needs different strategy
- Cannot cache all profiles in memory at scale
- Need cache eviction policy (LRU) to manage memory
- Need better invalidation strategy for frequent updates
- Consider distributed cache (Redis) for shared state

Actions Taken:
- Implemented LRU eviction limiting cache to 20MB
- Added cache invalidation on profile updates
- Monitoring cache hit rate (currently 85%)
- Evaluating Redis for future scale (500K+ users)

Lessons Learned:
- Validate growth assumptions with realistic projections
- Monitor actual usage patterns vs assumptions
- Design for 10x scale from start
- Profile update rates can change with feature additions

Original Decision Preserved For:
- Shows initial thinking was sound for initial scale
- Demonstrates how requirements evolved
- Teaches importance of scalability assumptions
- Provides context for current caching strategy
```

---

**Assumption Tracking Pattern:**

Track validation of assumptions:

**Assumption Status Template:**
```
Assumption: [Statement of assumption]

Made: [Date]
Context: [Why this was assumed]
Based On: [Data or reasoning]

Status: [Validated / Invalidated / Partially True / Unknown]

**Validation ([date]):**

Evidence:
- [Data that confirms or refutes]
- [Testing results]
- [User feedback]
- [Performance measurements]
- [Real-world observations]

Verdict:
- [Validated]: [Why proven correct]
- [Invalidated]: [Why proven wrong]
- [Partially True]: [What parts are correct, what aren't]

Impact on System:
- [How this affects architecture]
- [What needs to change]
- [What can stay as-is]

Adjustments Made:
- [Changes to implementation]
- [Updated decisions]
- [New patterns adopted]

Learning:
- [What to assume differently next time]
- [How to validate assumptions earlier]
- [Warning signs that were missed]
```

**Example Assumption Tracking:**
```
Assumption: Users will primarily access system during business hours (9am-5pm)

Made: 2026-01-10
Context: Designing scaling strategy for backend services
Based On: Similar business software usage patterns

Status: Invalidated

**Validation (2026-01-25):**

Evidence:
- Analytics show 24/7 usage pattern
- Peak usage: 9am-11am (35%), 7pm-10pm (30%), overnight (20%)
- International users across time zones
- Mobile app enables evening usage
- Users doing personal planning outside work hours

Verdict:
Invalidated - Usage is 24/7, not business hours

Impact on System:
- Cannot scale down services at night
- Need full capacity around the clock
- Cost implications: 24/7 operations more expensive
- Monitoring must cover all time zones
- On-call rotation needs global coverage

Adjustments Made:
- Removed auto-scaling schedule (was scaling down at night)
- Provisioned full capacity for 24/7
- Implemented follow-the-sun on-call rotation
- Added time-zone-aware monitoring dashboards
- Adjusted cost projections (+40% for 24/7 capacity)

Learning:
- Don't assume B2B means business-hours usage
- Mobile apps change usage patterns dramatically
- International user base means 24/7 by definition
- Validate usage assumptions with analytics early
- Business hours assumption is dangerous for modern apps

Warning Signs Missed:
- Mobile app in requirements should have triggered 24/7 assumption
- International expansion plans should have indicated time zones
- Similar products may not be truly similar
```

---

**Constraint Update Pattern:**

Document constraint changes:

**Constraint Revision Template:**
```
Constraint: [Name of constraint]

Original Value (as of [date]):
[Original constraint specification]

Current Value (as of [date]):
[Updated constraint specification]

**Change Details:**

What Changed:
- [Specific change to constraint]
- [New limits or requirements]

Why Changed:
- [Business reason]
- [Technical discovery]
- [User feedback]
- [Market conditions]

Impact on Architecture:
- [Systems affected]
- [Decisions that need revisiting]
- [Patterns that may need adjustment]

Affected Decisions:
- [Decision 1]: [How it's affected]
- [Decision 2]: [How it's affected]

Actions Required:
1. [Specific action to address change]
2. [Specific action to address change]

Timeline:
- [When change takes effect]
- [When actions must be completed]
```

**Example Constraint Update:**
```
Constraint: API Response Time

Original Value (as of 2026-01-10):
- Target: < 500ms for 95th percentile
- Max: < 1000ms for 99th percentile
- Rationale: "Good enough" for business users

Current Value (as of 2026-01-22):
- Target: < 200ms for 95th percentile
- Max: < 500ms for 99th percentile
- Rationale: Mobile users demand faster responses

**Change Details:**

What Changed:
- Performance requirements tightened by 60%
- Mobile-first strategy prioritizes speed
- User satisfaction scores correlate strongly with speed

Why Changed:
- User surveys show speed is #1 complaint
- Competitive analysis shows we're slowest in category
- Mobile analytics show 40% user drop-off on slow loads
- Business impact: Speed directly affects conversion rate

Impact on Architecture:
- Current caching insufficient for new targets
- Database queries need optimization
- API design may need rework for fewer round-trips
- CDN strategy needs expansion
- Monitoring must track mobile performance separately

Affected Decisions:
- Database choice: Still valid, but indexes need review
- Caching strategy: Needs expansion (current 60% hit rate insufficient)
- API design: REST may need GraphQL for efficient mobile queries
- Infrastructure: May need geographic distribution
- Third-party services: Some are too slow, need alternatives

Actions Required:
1. Performance audit of all critical endpoints (by 2026-01-30)
2. Implement query optimization plan (by 2026-02-15)
3. Expand caching to 90% hit rate target (by 2026-02-20)
4. Evaluate GraphQL migration for mobile (by 2026-02-28)
5. Add CDN endpoints in 3 more regions (by 2026-03-10)

Timeline:
- Change takes effect: 2026-03-01 (new SLA in contracts)
- All actions must complete: 2026-03-10
- 2-week buffer for testing and validation
```

---

**Evolution Documentation Pattern:**

Show progression of understanding:

**Evolution Entry Template:**
```
[Topic]: Evolution of Understanding

**Initial Understanding ([date]):**
[What was believed initially]

**First Revision ([date]):**
What Changed: [What new information emerged]
New Understanding: [How thinking evolved]
Trigger: [What prompted revision]

**Second Revision ([date]):**
What Changed: [Further information]
New Understanding: [Current thinking]
Trigger: [What prompted this revision]

**Current State ([date]):**
[Summary of current understanding]

**Evolution Summary:**
Journey: [How understanding progressed over time]
Key Learnings: [Most important lessons from evolution]
Future Watch: [What might change this further]
```

**Example Evolution Documentation:**
```
User Authentication: Evolution of Understanding

**Initial Understanding (2026-01-10):**
"Session-based authentication is sufficient. Users log in, we create
a server-side session, they get a session cookie. Standard approach
for web applications."

**First Revision (2026-01-18):**
What Changed: Mobile app requirements emerged
New Understanding: Mobile apps need stateless auth (JWT) for
offline capability and simplified state management. Session cookies
don't work well in mobile context.
Trigger: Product team added mobile app to roadmap

Implications:
- Need JWT implementation alongside sessions
- Increased complexity managing two auth methods
- Security considerations different for JWT vs sessions

**Second Revision (2026-01-25):**
What Changed: Security audit raised concerns about JWT
New Understanding: JWT alone is risky (token stealing, no server-side
revocation). Hybrid approach best: Short-lived JWT + refresh tokens
with server-side revocation capabilities.
Trigger: Security audit findings

Implications:
- More complex but more secure
- Can revoke refresh tokens server-side
- Short JWT lifetime limits damage from theft
- Need refresh token rotation strategy

**Third Revision (2026-02-03):**
What Changed: International deployment requires GDPR compliance
New Understanding: Auth tokens contain user data, subject to GDPR.
Need data minimization in tokens, clear retention policies, and
user ability to revoke all tokens.
Trigger: Legal review for EU launch

Implications:
- Token payload must be minimal (just user ID)
- Need token revocation UI for users
- Audit logging for all auth events
- Data retention policy for refresh tokens

**Current State (2026-02-10):**
Hybrid authentication system:
- Short-lived JWT (15 min) for API authentication
- Refresh tokens (7 days) with server-side revocation
- Minimal payload (user ID only)
- User-facing token management UI
- Complete audit logging
- GDPR-compliant data handling

**Evolution Summary:**

Journey:
Simple sessions → JWT for mobile → Hybrid for security → GDPR compliance

Key Learnings:
1. Initial simplicity rarely survives real requirements
2. Each platform (web, mobile) has different auth needs
3. Security and compliance add significant complexity
4. Hybrid approaches balance competing concerns
5. "Standard approach" must adapt to specific context

What Drove Changes:
- Mobile requirements exposed session limitations
- Security audit caught JWT risks
- International expansion brought compliance needs
- Each change was reactive to new information

Future Watch:
- Biometric auth for mobile (iOS/Android support)
- WebAuthn for passwordless (better UX and security)
- OAuth integration for social login (user requests)
- Zero-trust architecture (if security model changes)

Lessons for Future Projects:
- Don't assume simple solutions will stay simple
- Design for multiple clients from the start (web, mobile, API)
- Include security review earlier in process
- Consider compliance requirements before implementation
- Build flexibility for authentication evolution
```

---

**Cascading Impact Pattern:**

Track how changes ripple through system:

**Impact Analysis Template:**
```
Primary Change: [What changed]

Direct Impacts (immediate):
- [System A]: [How affected]
- [Decision B]: [How affected]
- [Pattern C]: [How affected]

Secondary Impacts (downstream):
- [System X] (depends on A): [How affected]
- [Decision Y] (based on B): [How affected]

Tertiary Impacts (further downstream):
- [System Z] (depends on X): [How affected]

Timeline for Updates:
1. [Date]: Update primary documentation
2. [Date]: Revise direct impacts
3. [Date]: Address secondary impacts
4. [Date]: Validate tertiary impacts resolved
```

**Example Impact Analysis:**
```
Primary Change: Database scaling strategy revised from vertical to horizontal

Direct Impacts (immediate):
- systemPatterns.md "Data Architecture":
  Must document new sharding approach

- techContext.md "Database Setup":
  Setup instructions need update for multi-node cluster

- Decision "Use single PostgreSQL instance":
  Invalidated by scale requirements, need sharding

Secondary Impacts (downstream):
- API design (depends on data architecture):
  Some queries need redesign for shard-aware access

- Caching strategy (based on database performance):
  Less critical now with read replicas, can simplify

- Backup procedures (based on database setup):
  Single backup → per-shard backups, more complex

- Deployment process (depends on infrastructure):
  Must handle rolling updates across shards

Tertiary Impacts (further downstream):
- Monitoring dashboards (based on deployment):
  Need per-shard metrics, not just single instance

- Cost projections (based on infrastructure):
  Multiple nodes vs single large instance, different cost model

- Disaster recovery (based on backup procedures):
  Recovery time longer, need different RTO/RPO targets

Timeline for Updates:
1. 2026-02-15: Update systemPatterns.md data architecture
2. 2026-02-15: Revise database scaling decision with evolution
3. 2026-02-16: Update techContext.md setup for sharding
4. 2026-02-17: Revise API design implications
5. 2026-02-17: Simplify caching strategy documentation
6. 2026-02-18: Update backup and deployment docs
7. 2026-02-19: Update monitoring, cost, DR documentation
8. 2026-02-20: Validate all impacts addressed and cross-referenced
```

---

**Validation Pattern:**

Ensure revision quality:

**Revision Quality Checklist:**
```
□ Original reasoning preserved
  → Can someone understand initial thinking?
  → Is historical context maintained?

□ Evolution clearly documented
  → Is it clear what changed and when?
  → Is the trigger for change documented?

□ Current state accurate
  → Does documentation reflect reality?
  → Are dates current?

□ Future-reader clarity
  → Would someone new understand the progression?
  → Are all terms explained?

□ Cross-references updated
  → Are linked decisions revised?
  → Are related patterns updated?

□ Lessons captured
  → What was learned from evolution?
  → What to do differently next time?

□ Actions documented
  → What changed in implementation?
  → What remains to be done?
```

</output-format>

<instructions>
CRITICAL: Revisions preserve history while updating current understanding.

NEVER revise by:
- Overwriting original reasoning (history lost)
- Deleting invalidated assumptions (learning lost)
- Updating without explaining what changed (context lost)
- Forgetting to mark dates (timeline unclear)
- Ignoring cascading impacts (incomplete revision)
- Revising in isolation (related decisions not updated)

DO NOT:
- Just change text without showing evolution
- Delete original rationale when updating
- Update one decision without checking related ones
- Forget to document trigger for change
- Skip marking assumption validation status
- Leave dates ambiguous (which version is this?)

ALWAYS:
- Preserve original reasoning with "as of" dates
- Show progression from old to new understanding
- Document what triggered the revision
- Mark assumptions as validated/invalidated
- Track cascading impacts on related decisions
- Update all affected documentation
- Capture lessons learned from evolution
- Make revision history clear to future readers

REPEAT: Treat revisions as additions to knowledge history, not replacements. Show the journey of understanding, not just the destination.
</instructions>

<examples>
✅ GOOD Revision (preserves history, shows evolution):

**Pattern demonstrates:**
- Original reasoning preserved with dates
- Clear documentation of what changed
- Evolution progression visible
- Lessons learned captured
- Related decisions updated

**Example revision:**
```
=== In systemPatterns.md ===

## Data Caching Strategy

Decision: Implement Redis for distributed caching

Original Rationale (as of 2026-01-15):
- Application servers are stateless (need shared cache)
- Frequent database queries for product catalog (90% reads)
- Sub-millisecond access time required
- Redis handles 100K ops/sec easily (sufficient for our scale)
- Team familiar with Redis from previous projects

Status: Revised (Performance requirements changed)

**Revision (2026-02-05):**

What Changed:
- Performance requirements tightened: 500ms → 200ms (95th percentile)
- User base grew faster than projected: 10K → 50K users in one month
- Cache hit rate only 60% (below 80% target)
- Redis single instance becoming bottleneck (CPU at 85%)

Impact on Decision:
- Redis still correct choice (proven reliable)
- Single instance no longer sufficient
- Cache strategy needs optimization
- Need Redis cluster for horizontal scaling

Updated Understanding:
- Redis Cluster for horizontal scaling (3 master + 3 replica nodes)
- Improved cache key design to increase hit rate
- Added cache warming for product catalog (hot data preloaded)
- Implemented cache monitoring and alerting
- Prepared for 100K users scale

Actions Taken:
1. Deployed Redis Cluster (3 masters, 3 replicas) - 2026-02-08
2. Redesigned cache keys for better hit rates - 2026-02-10
3. Implemented cache warming on deployment - 2026-02-12
4. Added Datadog monitoring for cache metrics - 2026-02-13

Results:
- Cache hit rate: 60% → 88%
- 95th percentile response: 480ms → 180ms
- Redis CPU utilization: 85% → 45% per node
- Ready for 100K+ user scale

Lessons Learned:
- Validate scaling assumptions with realistic load testing
- Monitor cache hit rates from day one (caught issue late)
- Plan for cluster setup earlier (single instance is temporary)
- User growth can exceed projections significantly

Original Decision Preserved For:
- Shows Redis was correct foundational choice
- Documents evolution from simple to scaled architecture
- Teaches importance of monitoring assumptions
- Provides context for cluster architecture

Related Updates:
- techContext.md: Updated Redis setup to cluster configuration
- activeContext.md: Removed "investigate caching" (now resolved)
- progress.md: Marked caching optimization complete
```

**Why this works:**
- Original rationale clearly dated and preserved
- Evolution shows thoughtful progression, not panic
- Specific metrics show what triggered change
- Actions taken are documented with dates
- Results prove revision was successful
- Lessons help future decision-making
- Related documentation cross-referenced
- Future reader understands complete journey

---

❌ BAD Revision (overwrites history, no context):

**Anti-pattern characteristics:**
- Original reasoning deleted
- No explanation of what changed
- No dates on revisions
- No lessons learned
- Looks like original decision was wrong

**Bad revision:**
```
=== In systemPatterns.md ===

## Data Caching Strategy

Decision: Use Redis Cluster for distributed caching

Rationale:
- Need distributed cache for scalability
- Redis Cluster handles high throughput
- Team knows Redis

(Original single-instance rationale deleted)
(No date)
(No explanation of what changed)
(No lessons learned)
```

**Why this fails:**
- Original thinking completely erased
- Can't understand evolution
- Looks like initial decision was wrong (it wasn't)
- No context for why cluster vs single instance
- No timeline of changes
- No lessons for future decisions
- Loses valuable knowledge about progression
- Future reader thinks: "Why didn't they use cluster from start?"

**Impact of bad revision:**
```
Future engineer reads documentation:

Questions:
- Why didn't they use cluster from the start?
- Was the initial decision wrong?
- What problems did they hit?
- How do I avoid similar mistakes?
- When did this change?

Cannot answer from documentation.

Must:
- Ask team members (if still around)
- Read git history (time-consuming)
- Rediscover lessons already learned
- Potentially repeat same evolution

Time wasted: Hours to days
Knowledge lost: Complete learning journey
```

---

✅ GOOD Assumption Tracking (clear validation):

**Pattern demonstrates:**
- Assumption clearly stated
- Evidence documented
- Status unambiguous
- Impact analyzed
- Actions taken

**Example:**
```
=== In productContext.md ===

## User Behavior Assumptions

Assumption: Users will create 1-5 projects each, archive old projects

Made: 2026-01-12
Context: Designing data model and storage strategy
Based On: Survey of similar project management tools

Status: Partially True (Validated 2026-02-10)

**Validation:**

Evidence (from 30 days of production data):
- Average projects per user: 3.2 (within predicted 1-5)
- Median projects per user: 2 (typical user pattern as expected)
- 90th percentile: 12 projects (power users beyond prediction)
- 95th percentile: 28 projects (extreme users way beyond prediction)
- Archive rate: 5% per month (much lower than hoped)

Verdict: Partially True
- Typical users: Assumption correct (1-5 projects, some archiving)
- Power users: Assumption wrong (10-30 projects, rarely archive)
- Archive behavior: Assumption wrong (users don't archive much)

Impact on System:
- Data model: Still correct for typical users
- Storage: Power users causing more storage cost than projected
- UI performance: Project lists slow for power users (30 items)
- Backup size: Larger than estimated (no archiving reducing data)

User Segments Emerged:
1. Casual users (60%): 1-3 projects, matches assumption
2. Regular users (30%): 4-8 projects, within tolerance
3. Power users (10%): 10-30 projects, beyond assumption

Adjustments Made:
1. UI: Implement pagination for project lists (2026-02-15)
2. Storage: Revised projections upward 40% (2026-02-16)
3. Archive: Added "archive suggestions" feature to encourage archiving
4. Monitoring: Added alerts for users > 20 projects (support intervention)
5. Pricing: Considering project-based pricing tier for power users

Learning:
- User behavior has long tail (power users are significantly different)
- Surveys of similar tools may miss power user patterns
- Need telemetry earlier to validate assumptions
- Design for power users from start (they're vocal, influential)
- Archive features must be prompted (users won't do it unprompted)

Future: Watch for super power users (50+ projects), may need limits
```

**Why this works:**
- Evidence is concrete (real data)
- Status is nuanced (partially true, not binary)
- Impact clearly analyzed
- User segments identified
- Actions address all findings
- Learning applicable to future
- Monitoring in place for continued validation
</examples>
