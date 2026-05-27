---
# === Identity ===
id: recover-from-abandonment
name: Recover memory bank from abandonment where updates completely stopped
version: v1

# === Classification ===
chapter: 5
category: memory-bank
subcategory: failure
tags:
  - documentation
  - memory-bank
  - failure-recovery
  - abandonment-recovery
  - restart-patterns
  - sustainable-maintenance
  - team-accountability
  - cultural-change
  - documentation-rhythm
  - prevention

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Recover memory bank from abandonment where updates completely stopped.
    Restart documentation practice after extended period without updates following deadline pressure.
  argument-hint: "[project_name] [abandonment_duration]"
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
    description: The specific project to recover memory bank for
    example: "E-commerce Platform"
    maps-to: "$0"
  - name: abandonment_duration
    description: How long since last update
    example: "3 months since last memory bank update"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 5
    description: |
      **Recover from abandonment** where teams stopped updating entirely. Assess extent by checking last update date, capture critical current state first, bootstrap missing knowledge through team interviews, and establish sustainable maintenance rhythm.
    preview: |
      "...capture critical current state documenting system today, active patterns. Bootstrap missing knowledge through team interviews..."
  website:
    include: true
    path: /prompts/recover-from-abandonment
  marketplace:
    plugin: constellize:memory

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Recover memory bank for {{project_name}} from abandonment where teams stopped updating documentation entirely after sprint crunch or major deadline.

Assess abandonment extent by checking last update date, reviewing what happened since then, identifying work completed but not documented, and understanding why updates stopped. Restart documentation practice by capturing critical current state first, documenting major changes that occurred during gap, establishing lightweight update rhythm, and creating team accountability. Bootstrap missing knowledge through team interviews about undocumented work, code review of changes since last update, extraction of decisions from code review discussions, and reconstruction of key architectural choices made. Prevent future abandonment by making updates part of workflow, reducing friction in update process, celebrating documentation maintenance, and establishing cultural expectation that memory bank stays current.

Treat abandonment recovery as restart rather than catch-up on every detail, focusing on capturing essential current knowledge and establishing sustainable maintenance rhythm. This approach prevents overwhelming the team with backlog while ensuring critical knowledge is preserved going forward.

Follow this process:

1. **Assess abandonment:**
   - Check last memory bank update date
   - Review work completed since then
   - Understand why updates stopped
   - Identify critical knowledge gaps
   - Determine severity of abandonment

2. **Capture critical current state:**
   - Document system as it exists today (priority 1)
   - Capture active architectural patterns
   - Record current team practices
   - Document critical recent decisions
   - Establish baseline to build from

3. **Bootstrap missing knowledge:**
   - Interview team about major changes
   - Review significant PRs from gap period
   - Extract decisions from code review discussions
   - Reconstruct key architectural choices
   - Focus on what matters most, not completeness

4. **Restart maintenance rhythm:**
   - Establish lightweight update triggers
   - Assign rotation responsibility
   - Reduce update friction
   - Make updates visible and celebrated
   - Build cultural expectation of currency
</task>

<context>
Project to recover memory bank:
{{project_name}}

Abandonment duration:
{{abandonment_duration}}

**Standard Construction Folder Structure:**
This prompt updates:
- `memory-bank/activeContext.md` (critical: establish current state)
- `memory-bank/progress.md` (mark what completed during gap)
- `memory-bank/systemPatterns.md` (capture current patterns)
- `memory-bank/techContext.md` (document current tools and conventions)

This prompt creates:
- Team processes for preventing future abandonment
- Lightweight update practices
- Accountability structures
</context>

<thinking>
Before recovering from abandonment, analyze:
1. Why did updates stop (sprint crunch, deadline pressure, unclear responsibility)?
2. How much work happened during abandonment period?
3. What knowledge is most critical to capture immediately?
4. How can we restart without overwhelming the team?
5. What will prevent this from happening again?
6. Can we make updates easier and more visible?
</thinking>

<output-format>
Create abandonment recovery following these patterns:

**Abandonment Assessment Pattern:**

Understand the scope of abandonment:

**Assessment Checklist:**
```
Timeline Analysis:
□ Last memory bank update: [Date]
□ Time abandoned: [Duration]
□ Work completed during gap: [Estimate]
□ Knowledge debt accumulated: [Severity]

Gap Period Analysis:
□ Number of PRs merged: [Count]
□ Major features shipped: [List]
□ Architectural changes: [List]
□ Team changes: [People joined/left]
□ Technology changes: [New tools adopted]

Abandonment Cause:
□ Sprint crunch (temporary pressure)
□ Major deadline (all hands on deck)
□ Unclear responsibility (no owner)
□ High friction (updates too hard)
□ Low perceived value (team doesn't see benefit)
□ Lack of habit (never established rhythm)

Current Impact:
□ New engineers struggling: Y/N
□ Knowledge loss: [Severity]
□ Decision-making impaired: Y/N
□ Code review confusion: Y/N
□ Architecture drift: Y/N

Recovery Difficulty:
□ Light (< 1 month gap, small team)
□ Moderate (1-3 months, medium team)
□ Severe (> 3 months, large team, high churn)
```

**Gap Period Work Inventory:**
```
Features Shipped (not documented):
1. [Feature name] - [Date] - [PR #]
2. [Feature name] - [Date] - [PR #]
...

Architectural Changes (not documented):
1. [Change description] - [Date] - [Reason]
2. [Change description] - [Date] - [Reason]
...

Technology Additions (not documented):
- [Tool/library] - [Purpose] - [Date]
- [Tool/library] - [Purpose] - [Date]
...

Team Changes:
- Joined: [Names and dates]
- Left: [Names and dates] (knowledge loss risk)

Decisions Made (not documented):
1. [Decision] - [When] - [Who] - [Where discussed]
2. [Decision] - [When] - [Who] - [Where discussed]
...
```

---

**Priority-Based Recovery Pattern:**

Focus on what matters most:

**Recovery Priority Matrix:**
```
Priority 1 (Do immediately - blocks work):
- Current system state (what exists now)
- Active architectural patterns (what we follow now)
- Critical recent decisions (major choices made)
- Current team practices (how we work now)
- Baseline: Enough for new engineer to start

Priority 2 (Do this week - valuable context):
- Major features from gap period
- Significant architectural changes
- Technology additions and why
- Important lessons learned
- Context: Understand how we got here

Priority 3 (Do eventually - nice to have):
- Complete feature list from gap
- Detailed evolution of all patterns
- Minor tool additions
- Enhanced examples
- Completeness: Full historical record

Recovery strategy:
- Day 1: Priority 1 (establish baseline)
- Week 1: Priority 2 (add context)
- Month 1: Priority 3 (fill gaps)
```

**Effort Allocation:**
```
Don't try to document everything that happened during gap.
Focus on current state and critical context.

80% effort: Current state and critical recent changes
20% effort: Historical completeness from gap period

Mantra: "Capture today, add history gradually"
```

---

**Current State Capture Pattern:**

Document system as it exists today:

**Current State Documentation:**
```
System State Snapshot: [Date]

This captures the system as it exists today. Historical
details will be added over time, but this is our baseline.

## Architecture Today

[Draw current architecture]

Services:
- [Service 1]: [Purpose] at [location]
- [Service 2]: [Purpose] at [location]
...

Data stores:
- [Database 1]: [What data] at [location]
- [Database 2]: [What data] at [location]
...

Key integrations:
- [Integration 1]: [Purpose]
- [Integration 2]: [Purpose]
...

## Active Patterns Today

Error Handling:
[Current pattern description with code example]

Testing Approach:
[Current pattern description with example]

State Management:
[Current pattern description with example]

API Design:
[Current pattern description with example]

## Current Team Practices

Development workflow:
[How features are built today]

Code review process:
[How reviews work today]

Testing requirements:
[What testing is expected today]

Deployment process:
[How deploys happen today]

## Critical Recent Decisions

Decision: [What was decided]
Date: [When] (approximate if needed)
Rationale: [Why this choice]
Impact: [How this affects system]

Decision: [What was decided]
...

## Current Tech Stack

Languages/Frameworks:
- [Language]: [Version] - [Purpose]
- [Framework]: [Version] - [Purpose]
...

Key Libraries:
- [Library]: [Version] - [Purpose]
- [Library]: [Version] - [Purpose]
...

Infrastructure:
- [Tool]: [Purpose]
- [Tool]: [Purpose]
...

## Current Focus

What we're working on now:
1. [Current initiative]
2. [Current initiative]
...

Immediate next steps:
1. [Next action]
2. [Next action]
...

Known issues:
1. [Issue] - [Impact] - [Plan]
2. [Issue] - [Impact] - [Plan]
...
```

**Baseline Test:**
```
Give current state documentation to new engineer.

Can they answer:
□ What services exist?
□ How do they communicate?
□ What patterns should I follow?
□ How do I run tests?
□ How do I deploy?
□ Who do I ask about what?

If yes: Baseline is sufficient
If no: Fill gaps before proceeding
```

---

**Knowledge Bootstrap Pattern:**

Reconstruct critical missing knowledge:

**Team Interview Process:**
```
Interview each team member (30 minutes each):

Questions to ask:
1. "What major changes happened since [last update date]?"
2. "What big decisions were made?"
3. "What patterns did we establish or change?"
4. "What tools did we add or remove?"
5. "What should a new engineer know about this period?"
6. "What caused the most confusion during this time?"
7. "What do you wish was documented?"

Aggregate responses:
- Common themes: [What multiple people mentioned]
- Unique insights: [What only one person knew]
- Conflicting accounts: [Where memories differ - investigate]

Output: Knowledge inventory for documentation
```

**PR Archaeology Process:**
```
Review significant PRs from gap period:

Selection criteria:
- Large PRs (> 500 lines changed)
- Architectural changes (patterns established)
- New features (user-facing additions)
- Breaking changes (API changes, migrations)
- PRs with extensive discussion (decisions made)

For each significant PR:
1. Read description and discussion
2. Identify decision points
3. Extract rationale from comments
4. Note patterns established
5. Document in memory bank

Example extraction:

PR #234: "Migrate to GraphQL API"
- Decision: Adopt GraphQL
- Rationale: Mobile performance, over-fetching issues
- Date: April 2025
- Impact: Complete API redesign
- Lessons: Migration took 2x estimated time
→ Document in systemPatterns.md "API Architecture"

Time investment: 15 min per significant PR
Focus: Top 20 most significant PRs, not all PRs
```

**Decision Reconstruction:**
```
Find decisions from gap period:

Sources:
- Code review comments (decisions in discussion)
- Slack/Teams history (search key terms)
- Commit messages (look for "decision:" tags)
- Architecture diagrams (changes in diagrams)
- Team meeting notes (decisions in meetings)

For each decision found:
- What was decided
- When (approximate if needed)
- Why (from available context)
- Who was involved
- Current status

Document in activeContext.md or systemPatterns.md

Example:

From Slack (April 15):
"After discussing pros/cons, we decided to use
PostgreSQL for multi-tenancy. Separate schema per tenant.
Simpler than separate DBs, scales to our needs."

→ Decision: PostgreSQL with schema-per-tenant
→ Date: April 2025
→ Rationale: Simpler than separate DBs, sufficient scale
→ Document in systemPatterns.md
```

---

**Maintenance Restart Pattern:**

Establish sustainable update rhythm:

**Lightweight Update Triggers:**
```
Update memory bank when:
□ Feature completed: Add to progress.md (2 min)
□ Decision made: Document in activeContext.md (5 min)
□ Pattern established: Add to systemPatterns.md (10 min)
□ Tool added: Update techContext.md (3 min)
□ Week ends: Review activeContext.md currency (10 min)

Keep updates small and immediate.
Don't batch - update when it happens.

Time per week: ~30 minutes (acceptable)
Not time per month: 4 hours backlog (too much)
```

**Friction Reduction:**
```
Make updates easier:

1. Templates in memory bank folders
   - decision-template.md (copy and fill)
   - pattern-template.md (copy and fill)
   - Feature-template.md (copy and fill)

2. Automation where possible
   - Script to add feature to progress.md
   - PR template includes memory bank checklist
   - Bot reminds if PR has no memory bank update

3. Clear ownership
   - "Memory bank steward" role (weekly rotation)
   - Steward responsible for week's updates
   - Steward reviews PRs for memory bank impact
   - Accountability clear

4. Visibility
   - Memory bank updates in standup
   - Celebrate good maintenance
   - Show impact (new engineer success)
   - Track accuracy score on dashboard
```

**Cultural Change:**
```
Build expectation that memory bank stays current:

1. Leadership commitment
   - Tech lead: "Memory bank is infrastructure"
   - Manager: "Updates are part of the job, not extra"
   - Skip level: "Show me your memory bank" (signal importance)

2. Process integration
   - Definition of done includes memory bank update
   - Code review asks "Memory bank updated?"
   - Sprint demos reference memory bank entries
   - Retrospectives check memory bank health

3. Recognition
   - Shout out good memory bank maintenance
   - Include in performance reviews
   - Make steward role prestigious
   - Showcase memory bank success stories

4. New engineer experience
   - First week: Read memory bank
   - Second week: Improve one section
   - Builds habit from start
   - Creates advocates

Outcome: Memory bank maintenance becomes normal,
not exceptional. Updates happen continuously.
```

---

**Recovery Workflow Pattern:**

Step-by-step recovery process:

**Week 1: Establish Baseline**
```
Day 1 (4 hours):
- Assess abandonment extent
- Inventory gap period work
- Prioritize recovery efforts
- Assign recovery responsibilities

Day 2-3 (8 hours):
- Capture current system state
- Document active patterns
- Record current team practices
- Establish baseline documentation

Day 4 (4 hours):
- Test baseline with new engineer
- Fill critical gaps identified
- Validate accuracy
- Get team approval

Day 5 (2 hours):
- Establish update rhythm
- Assign steward role
- Create update templates
- Launch restart

Total: 18 hours (can distribute across team)
Result: Current baseline established
```

**Week 2-4: Add Critical Context**
```
Focus: Major changes from gap period

Week 2:
- Interview team members (5 hours total)
- Review top 10 significant PRs (3 hours)
- Document major decisions (2 hours)

Week 3:
- Document major features from gap (4 hours)
- Capture architectural changes (3 hours)
- Add technology changes (2 hours)

Week 4:
- Fill remaining priority 2 items (4 hours)
- Validate completeness (2 hours)
- Team review and approval (2 hours)

Total: 27 hours over 3 weeks (distributed)
Result: Critical context captured
```

**Month 2-3: Ongoing Improvement**
```
Focus: Fill remaining gaps, establish habit

Monthly:
- Spend 2-4 hours filling priority 3 items
- Add enhanced examples
- Improve cross-references
- Deepen documentation

Ongoing:
- Continue update rhythm (30 min/week/person)
- Rotate steward role weekly
- Monitor accuracy score
- Celebrate good maintenance

Result: Complete recovery, sustainable practice
```

---

**Prevention Measures Pattern:**

Ensure abandonment doesn't recur:

**Abandonment Prevention Checklist:**
```
Structural Prevention:
□ Update triggers defined and visible
□ Steward role established with rotation
□ Updates in PR template
□ Code review checks memory bank
□ Definition of done includes update

Cultural Prevention:
□ Leadership commitment visible
□ Memory bank discussed in standups
□ Good maintenance celebrated
□ Impact shown to team
□ New engineers start with memory bank

Technical Prevention:
□ Automation reduces friction
□ Templates make updates easy
□ CI validates memory bank
□ Dashboard shows currency
□ Alerts if stale

Monitoring:
□ Track days since last update
□ Calculate accuracy score
□ Survey team confidence
□ Count new engineer success
□ Measure time to productivity

Response Plan:
If memory bank starts going stale:
1. Steward notices within 1 week
2. Raises in standup
3. Team discusses why
4. Addresses root cause
5. Prevents abandonment

"Catch early, fix quickly, prevent recurrence"
```

**Sustainability Metrics:**
```
Track to ensure sustainability:

Update frequency:
- Target: Updated at least weekly
- Alert: No update in 2 weeks
- Escalate: No update in 1 month

Team engagement:
- Target: All team members update monthly
- Alert: 50% of team not updating
- Escalate: Single person doing all updates

Accuracy score:
- Target: >85/100
- Alert: <75/100
- Escalate: <60/100

New engineer success:
- Target: Productive in <2 weeks
- Alert: >3 weeks to productivity
- Escalate: Memory bank cited as blocker

If metrics decline: Investigate and address
Don't let abandonment creep back in
```

</output-format>

<instructions>
CRITICAL: Abandonment recovery focuses on restart, not complete catch-up.

NEVER recover by:
- Trying to document everything from gap period (overwhelming)
- Assigning one person to do all backfill (unsustainable)
- Creating complex update processes (friction causes re-abandonment)
- Skipping root cause analysis (will recur)
- Forgetting prevention measures (inevitably abandoned again)

DO NOT:
- Try to be complete about gap period
- Create backlog pressure
- Make updates burdensome
- Assign to single person
- Skip establishing rhythm
- Forget cultural change

ALWAYS:
- Focus on current state first
- Add historical context gradually
- Make updates lightweight and immediate
- Establish rotating responsibility
- Build cultural expectation
- Monitor for early warning signs
- Celebrate maintenance

REPEAT: Abandonment recovery is restart, not complete backfill. Capture today, add history gradually, establish sustainable rhythm, prevent recurrence.
</instructions>

<examples>
✅ GOOD Abandonment Recovery (restart focused, sustainable):

**Pattern demonstrates:**
- Realistic assessment of abandonment
- Priority-based recovery
- Current state focus
- Sustainable restart
- Prevention measures

**Example recovery:**
```
Abandonment Recovery: Mobile App Project
Date: 2026-01-21
Gap: 3 months since last update (Oct 2025)
Cause: Sprint crunch for holiday launch

---

ASSESSMENT (Day 1, 4 hours):

Timeline:
- Last update: October 15, 2025
- Abandonment: 3 months (13 weeks)
- Work during gap:
  - 127 PRs merged
  - 23 features shipped
  - 2 major refactorings
  - 3 new team members joined
  - 1 senior engineer left (knowledge loss)

Why Updates Stopped:
- Holiday launch deadline (all hands coding)
- Memory bank seen as "nice to have" vs "must have"
- No one felt responsible
- Updates felt time-consuming

Impact:
- New engineers: Struggling (memory bank outdated)
- Knowledge loss: High (senior engineer left, not documented)
- Architecture drift: Moderate (patterns evolved, not captured)
- Team confidence in memory bank: Low (3/10)

Recovery Priority: HIGH
Must restart now before more knowledge lost.

---

CURRENT STATE CAPTURE (Days 2-4, 12 hours):

Created baseline documentation:

=== activeContext.md ===

System State: January 21, 2026

This captures our current state. Historical details from
Oct-Dec 2025 will be added gradually.

## Architecture Today

Mobile app (React Native) + Backend API (Node.js)

Mobile:
- React Native 0.73
- Redux for state
- Location: mobile-app/

Backend:
- Express REST API
- PostgreSQL database
- Redis cache
- Location: api-server/

## Active Patterns Now

Error Handling:
[Current pattern with example from recent code]

API Communication:
[Current pattern with example from recent code]

State Management:
[Current pattern with example from recent code]

## Current Team

Engineers:
- Alice (Senior, 2 years)
- Bob (Mid, 1 year)
- Charlie (Junior, 3 months) - new
- Diana (Junior, 2 months) - new
- Eve (Junior, 1 month) - new

## Recent Major Changes

(These are the big things from Oct-Dec, details to follow)

1. Push notifications implemented (Nov)
2. Offline mode added (Dec)
3. Payment system integrated (Dec)
4. Performance optimization (ongoing)

## Current Focus (Jan 2026)

Working on:
1. User onboarding flow redesign
2. Performance monitoring improvements
3. A/B testing framework

Next up:
1. Social sharing features
2. Analytics dashboard
3. Premium subscription tier

Known issues:
1. iOS app crashes on iPad (investigating)
2. Android background sync flaky (workaround in place)

---

Baseline test: Gave to newest engineer (Eve)

Eve feedback:
✓ "Now I understand the architecture"
✓ "Clear what patterns to follow"
✓ "Know what we're currently working on"
✓ "Still want more historical context"

Good enough baseline. Approved.

---

BOOTSTRAP KNOWLEDGE (Week 2, 10 hours):

Team interviews (30 min each × 5 engineers):

Common themes:
- Push notifications biggest feature (Nov)
- Offline mode very complex (Dec)
- Payment integration had security concerns
- Lost knowledge when senior engineer left
- New patterns for API caching

Extracted from top 20 PRs:

PR #445: "Add push notifications"
- Decision: Use Firebase Cloud Messaging
- Rationale: Cross-platform, reliable, free tier sufficient
- Date: November 2025
- Impact: New service (notification-service)
- Pattern: Event-driven notifications
→ Documented in systemPatterns.md

PR #467: "Implement offline mode"
- Decision: SQLite local cache, sync on reconnect
- Rationale: Users need offline access, sync complexity acceptable
- Date: December 2025
- Impact: Major state management change
- Pattern: Sync queue for offline changes
→ Documented in systemPatterns.md

(18 more PRs documented...)

Decisions reconstructed from Slack:

Nov 5: Decided on Firebase for push (team discussion)
Nov 22: Approved payment provider (Stripe) (security review)
Dec 8: Offline mode approach approved (architecture review)
Dec 15: Performance targets defined (product meeting)

All documented in memory bank.

---

RESTART MAINTENANCE (Week 1 Day 5, ongoing):

Established lightweight rhythm:

Update triggers:
✓ Feature done → 2 min update to progress.md
✓ Decision made → 5 min entry in activeContext.md
✓ Pattern established → 10 min in systemPatterns.md
✓ Week ends → 10 min steward review

Friction reduction:
✓ Created templates/ folder with:
  - decision-template.md
  - feature-template.md
  - pattern-template.md
✓ Added memory-bank-update.sh script
✓ Updated PR template with memory bank checkbox

Responsibility:
✓ Weekly rotating steward (starts with Alice)
✓ Steward reviews all PRs
✓ Steward ensures updates happen
✓ Rotation schedule posted

Cultural change:
✓ Tech lead: "Memory bank is infrastructure, not optional"
✓ Added to definition of done
✓ Standup includes "memory bank updates?"
✓ Celebrated first week of consistent updates

---

ONGOING IMPROVEMENT (Weeks 2-8):

Week 2-4: Added historical context
- Documented 23 features from gap period
- Captured 8 major decisions
- Added 4 new patterns
- Filled technology changes

Week 5-8: Continuous maintenance
- 100% PR compliance (all had memory bank updates)
- Steward rotation working
- Team engagement high
- New engineers succeeding

---

PREVENTION MEASURES:

Structural:
✓ Updates in PR template
✓ Code review checks
✓ Steward rotation
✓ Templates reduce friction

Cultural:
✓ Leadership committed
✓ Regular celebration
✓ Definition of done
✓ New engineer habit

Technical:
✓ CI validates file references
✓ Dashboard shows currency
✓ Alert if no update 2 weeks

Monitoring:
✓ Days since update: Average 2 (was 90)
✓ Accuracy score: 88/100 (was 35/100)
✓ Team confidence: 9/10 (was 3/10)
✓ New engineer time to productivity: 1 week (was 4 weeks)

---

RESULTS:

Time invested:
- Week 1: 18 hours (baseline)
- Weeks 2-4: 27 hours (context)
- Ongoing: 30 min/week/person (sustainable)

Recovery: Complete
Sustainability: High (rhythm established)

Team feedback:
- "Memory bank useful again"
- "New engineers succeeding"
- "Updates feel natural now"
- "Glad we restarted this"

New engineer (Eve) feedback:
- "Memory bank was crucial to onboarding"
- "Actually matches reality"
- "Helped me understand decisions"

Memory bank recovered from abandonment and won't be abandoned again.
Prevention measures ensure sustainability.
```

**Why this works:**
- Realistic about not documenting everything from gap
- Focused on current state first
- Lightweight, sustainable update rhythm
- Clear ownership and rotation
- Cultural change embedded
- Prevention measures prevent recurrence
- Team bought in

---

❌ BAD Abandonment Recovery (overwhelming, unsustainable):

**Anti-pattern characteristics:**
- Tries to document complete history from gap
- Assigns to one person
- No rhythm established
- Will be abandoned again

**Bad recovery:**
```
"Alice, can you go back and document everything that
happened in the last 3 months? Here's the 127 PRs.
Let us know when you're done."

(Assigned to single person)
(No prioritization)
(No current state focus)
(No rhythm established)
(No prevention measures)
```

**Why this fails:**
```
What happened:

Week 1: Alice tries to document all 127 PRs
- Overwhelming
- Takes all week
- No coding done
- Still incomplete

Week 2: Alice continues backfill
- Still overwhelming
- Team annoyed Alice not coding
- Alice frustrated with task
- Memory bank still incomplete

Week 3: Alice gives up
- Too much work
- No one else helping
- Backfill incomplete
- Memory bank still stale

Week 4: Back to abandonment
- Alice stopped updating
- No one else picks it up
- Same situation as before
- Time wasted

Result:
- Time wasted: 40+ hours
- Recovery: Failed
- Memory bank: Still stale
- Team morale: Damaged
- Will stay abandoned
```

**Impact:**
```
"We tried fixing the memory bank but it was too much work.
Not worth it. Just ask people instead."

→ Memory bank stays abandoned
→ Knowledge continues to be lost
→ New engineers continue struggling
→ Tribal knowledge becomes only source
→ Could have been prevented with realistic recovery approach
```
</examples>
