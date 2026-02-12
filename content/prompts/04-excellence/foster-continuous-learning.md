---
# === Identity ===
id: foster-continuous-learning
name: Foster continuous learning through structured reflection and proactive improvement
version: v1

# === Classification ===
chapter: 4
category: excellence
subcategory: maintenance
tags:
  - quality
  - maintenance
  - continuous-learning
  - post-incident-review
  - architecture-review
  - technology-evaluation
  - team-development
  - knowledge-sharing
  - blameless-culture
  - continuous-improvement

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Foster continuous learning through structured reflection and proactive improvement.
    Build learning culture through post-incident reviews, architecture reviews, and team development (Gate 6: Continuous Improvement).
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
    description: The specific component to foster continuous learning for
    example: "PaymentProcessor"
    maps-to: "$0"
  - name: system_name
    description: The name of your system
    example: "Payment Processing System"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/foster-continuous-learning
  marketplace:
    plugin: constellize-excellence

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Foster continuous learning for {{component_name}} in {{system_name}} through structured reflection and proactive improvement.

Foster continuous learning through structured reflection and proactive improvement. Post-incident reviews extract lessons from failures without blame, building organizational resilience. Architecture reviews provide regular assessment of system design decisions, ensuring they remain aligned with current needs. Technology updates involve evaluating and adopting new tools and practices that improve effectiveness. Team development through skill building and knowledge sharing strengthens the collective capability.

Follow this process:

1. **Conduct post-incident reviews:**
   - Blameless retrospectives after incidents (what happened, not who caused it)
   - Timeline reconstruction (events leading to and during incident)
   - Root cause analysis (underlying factors, not just proximate cause)
   - Action item definition (specific improvements to prevent recurrence)
   - Knowledge sharing (document and share learnings across team)

2. **Perform architecture reviews:**
   - Regular assessment schedule (quarterly or bi-annual reviews)
   - Design decision evaluation (do choices still make sense?)
   - Technical debt assessment (what accumulated, what to address)
   - Scalability analysis (can architecture handle growth?)
   - Technology alignment (using appropriate tools for current needs)

3. **Evaluate technology updates:**
   - Monitoring ecosystem (new tools, framework updates, best practices)
   - Evaluation criteria (value vs cost, risk vs reward)
   - Pilot programs (test before full adoption)
   - Migration planning (phased approach, rollback capability)
   - Documentation updates (reflect new tools and practices)

4. **Invest in team development:**
   - Skill gap identification (what capabilities does team need?)
   - Learning opportunities (training, conferences, workshops)
   - Knowledge sharing sessions (brown bags, tech talks, demos)
   - Mentoring and coaching (pair programming, code reviews, shadowing)
   - Documentation culture (write things down, share widely)
</task>

<context>
Component to foster continuous learning:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates/updates:
- `docs/incidents/` (post-incident review documents)
- `docs/architecture/reviews/` (architecture review records)
- `docs/decisions/` (technology adoption decisions)
- `docs/learning/` (training materials, knowledge base)
- Team development plans
</context>

<thinking>
Before fostering continuous learning, analyze:
1. What incidents have occurred and what did we learn?
2. When was the last architecture review and what changed since?
3. What new technologies could improve our effectiveness?
4. What skills does the team need to develop?
5. How do we capture and share knowledge effectively?
</thinking>

<output-format>
Create continuous learning framework following these patterns:

**Post-Incident Review Pattern:**

Extract learning from failures without blame:

**Review Structure:**

1. **Incident Summary:**
   - What happened: Brief description
   - When: Start and end time
   - Impact: Users affected, duration, revenue impact
   - Severity: Critical, high, medium, low
   - Detection: How was it discovered

2. **Timeline:**
   - Leading events: What preceded incident
   - Detection: When/how noticed
   - Response: Actions taken during incident
   - Resolution: How issue was resolved
   - Recovery: Return to normal operation

3. **Root Cause Analysis:**
   - Proximate cause: Immediate trigger
   - Contributing factors: Conditions enabling incident
   - Root cause: Underlying system weakness
   - Why happened now: What changed recently

4. **Action Items:**
   - Immediate: Short-term fixes (bandaids)
   - Short-term: Improvements within weeks
   - Long-term: Systemic changes (months)
   - Owners: Who responsible for each action
   - Timeline: When actions will complete

5. **Lessons Learned:**
   - What worked well: Response strengths
   - What could improve: Response weaknesses
   - Systemic insights: Broader implications
   - Knowledge gaps: What we didn't know

**Blameless Culture Pattern:**
```
Blameless review principles:

1. Prime directive:
   "Everyone did the best they could with the information
   they had at the time, in the circumstances they were in,
   with the resources they had available."

2. Focus on systems, not people:
   ❌ "Bob deployed broken code"
   ✅ "Deployment process didn't catch breaking change"

   ❌ "Alice ignored the alert"
   ✅ "Alert wasn't routed to on-call person"

3. Avoid counterfactuals:
   ❌ "We should have noticed earlier"
   ✅ "How can we improve detection?"

   ❌ "Why didn't we have better monitoring"
   ✅ "What monitoring would have helped?"

4. Embrace failure as learning:
   - Incidents reveal system weaknesses
   - Each incident improves resilience
   - Hiding incidents prevents learning
   - Blame prevents honest discussion

5. Action-oriented outcomes:
   - Every incident → concrete improvements
   - Track action completion
   - Measure effectiveness
   - Iterate on processes
```

**Post-Incident Review Template:**
```markdown
# Post-Incident Review: [Brief Description]

**Date:** YYYY-MM-DD
**Duration:** X hours
**Severity:** Critical/High/Medium/Low
**Impact:** [Users affected, services down, revenue impact]

## Summary
[2-3 sentence description of what happened]

## Timeline
| Time (UTC) | Event |
|------------|-------|
| 14:00 | [Normal operation] |
| 14:23 | [First sign of issue] |
| 14:30 | [Alert triggered] |
| 14:35 | [Investigation started] |
| 14:52 | [Root cause identified] |
| 15:10 | [Fix deployed] |
| 15:15 | [Monitoring confirmed resolution] |

## What Happened
[Detailed narrative of the incident]

## Root Cause
**Proximate cause:** [Immediate trigger]
**Contributing factors:**
- [Factor 1]
- [Factor 2]

**Root cause:** [Underlying system weakness]

**Why now:** [What changed to trigger this]

## Resolution
[How the incident was resolved]

## Impact
- **Users affected:** [Number/percentage]
- **Duration:** [How long]
- **Revenue impact:** [If applicable]
- **Services affected:** [Which services]

## What Went Well
- [Response strength 1]
- [Response strength 2]

## What Could Be Better
- [Response weakness 1]
- [Response weakness 2]

## Action Items

### Immediate (< 1 week)
- [ ] [Action 1] - Owner: [@person] - Due: [date]
- [ ] [Action 2] - Owner: [@person] - Due: [date]

### Short-term (< 1 month)
- [ ] [Action 3] - Owner: [@person] - Due: [date]

### Long-term (< 3 months)
- [ ] [Action 4] - Owner: [@person] - Due: [date]

## Lessons Learned
- [Lesson 1]
- [Lesson 2]
- [Lesson 3]

## Related Incidents
- [Link to similar past incident]
```

---

**Architecture Review Pattern:**

Regularly assess system design decisions:

**Review Scope:**

1. **Design Decisions:**
   - Component boundaries: Still appropriate?
   - Communication patterns: Still efficient?
   - Data models: Still serving needs?
   - Scaling strategies: Still effective?
   - Technology choices: Still best fit?

2. **Technical Debt:**
   - Accumulated shortcuts: What needs addressing?
   - Outdated patterns: What to modernize?
   - Code quality: Where has it degraded?
   - Documentation gaps: What's undocumented?
   - Testing gaps: Where is coverage weak?

3. **Scalability:**
   - Current capacity: How much headroom?
   - Growth projections: Future demands?
   - Bottlenecks: Where will we hit limits?
   - Cost efficiency: Optimizing resource usage?
   - Performance trends: Degrading over time?

4. **Quality Attributes:**
   - Reliability: Meeting SLAs?
   - Performance: Meeting latency targets?
   - Security: Addressing threats?
   - Maintainability: Easy to change?
   - Observability: Easy to debug?

**Architecture Review Process:**
```
Review cadence and approach:

1. Regular schedule:
   - Quarterly: Quick health check
   - Annually: Deep dive review
   - Ad-hoc: Major changes or incidents

2. Review preparation (1 week before):
   - Gather metrics: Performance, reliability, cost
   - Collect feedback: Team pain points, tech debt
   - Review decisions: Past architectural choices
   - Prepare questions: Areas of concern

3. Review session (2-4 hours):
   - Review current state: What exists today
   - Assess fitness: Does architecture serve needs?
   - Identify issues: What's not working well?
   - Discuss options: Potential improvements
   - Prioritize actions: What to address first

4. Documentation (1 week after):
   - Record findings: What was discovered
   - Document decisions: What will change
   - Track actions: Who, what, when
   - Share learnings: Communicate to team

5. Follow-up (ongoing):
   - Execute actions: Implement improvements
   - Track progress: Monitor completion
   - Measure impact: Did changes help?
   - Next review: Assess progress made
```

**Architecture Review Template:**
```markdown
# Architecture Review: [Component/System Name]

**Date:** YYYY-MM-DD
**Participants:** [Names]
**Review Type:** Quarterly/Annual

## Current State
**Purpose:** [What this component/system does]
**Key metrics:**
- Traffic: [Requests/sec, users/day]
- Performance: [P95 latency, throughput]
- Reliability: [Uptime, error rate]
- Cost: [Monthly infrastructure spend]

## Architecture Overview
[Diagram or description of current architecture]

## Design Decisions Assessment

### Decision 1: [Decision name]
**Original rationale:** [Why chosen]
**Current assessment:** Still appropriate / Needs revision
**Issues:** [Any problems it causes]
**Action:** Keep / Modify / Replace

[Repeat for each major decision]

## Technical Debt Assessment

### High Priority
- [Debt item 1] - Impact: [How it affects team]
- [Debt item 2] - Impact: [How it affects team]

### Medium Priority
- [Debt item 3]

### Low Priority
- [Debt item 4]

## Scalability Analysis

**Current capacity:** [What we can handle]
**Projected growth:** [Expected increase]
**Bottlenecks identified:**
- [Bottleneck 1]: Projected to hit limit in [timeframe]
- [Bottleneck 2]: Projected to hit limit in [timeframe]

**Scaling actions needed:**
- [Action 1] - Timeline: [When needed]

## Quality Attributes Assessment

| Attribute | Target | Current | Status | Action Needed |
|-----------|--------|---------|--------|---------------|
| Reliability | 99.9% | 99.7% | ⚠️ | Improve error handling |
| P95 Latency | <200ms | 180ms | ✓ | Monitor |
| Security | No critical | 2 high | ❌ | Address vulnerabilities |
| Maintainability | Good | Fair | ⚠️ | Refactor hotspots |

## Action Items

### Immediate (< 1 month)
- [ ] [Action 1] - Owner: [@person]

### Short-term (< 3 months)
- [ ] [Action 2] - Owner: [@person]

### Long-term (< 6 months)
- [ ] [Action 3] - Owner: [@person]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

## Next Review
**Date:** [Schedule next review]
**Focus areas:** [What to emphasize next time]
```

---

**Technology Evaluation Pattern:**

Assess and adopt new tools and practices:

**Evaluation Process:**

1. **Discovery:**
   - Monitor ecosystem: New releases, tools, practices
   - Conference learnings: Industry trends
   - Team suggestions: Developer interest
   - Problem areas: Current pain points
   - Vendor outreach: Product demos

2. **Initial Assessment:**
   - Problem fit: Does it solve our problem?
   - Maturity: Production-ready?
   - Community: Active development and support?
   - Cost: Licensing, infrastructure, training
   - Risk: What could go wrong?

3. **Deep Evaluation:**
   - Proof of concept: Build simple prototype
   - Performance testing: Meets requirements?
   - Integration testing: Works with existing systems?
   - Team feedback: Developer experience?
   - Documentation review: Adequate resources?

4. **Decision:**
   - Adopt: Plan migration/integration
   - Trial: Pilot in low-risk area
   - Defer: Revisit in future
   - Reject: Not suitable for our needs

5. **Adoption:**
   - Pilot program: Limited deployment
   - Training: Team skill development
   - Documentation: Internal guides
   - Rollout: Gradual expansion
   - Evaluation: Measure outcomes

**Technology Decision Template:**
```markdown
# Technology Decision: [Technology Name]

**Date:** YYYY-MM-DD
**Status:** Proposed/Approved/Rejected/Deferred
**Decision Maker:** [Name/Team]

## Context
**Problem:** [What problem are we trying to solve?]
**Current solution:** [How we solve it today]
**Pain points:** [What's not working well]

## Proposal
**Technology:** [Name and version]
**Purpose:** [How it solves the problem]
**Use case:** [Where/how we'll use it]

## Evaluation

### Pros
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

### Cons
- [Drawback 1]
- [Drawback 2]
- [Drawback 3]

### Alternatives Considered
- [Alternative 1]: [Why not chosen]
- [Alternative 2]: [Why not chosen]
- [Keep current]: [Why not sufficient]

### Proof of Concept Results
**What we tested:** [Scope of POC]
**Findings:**
- [Finding 1]
- [Finding 2]
**Performance:** [Metrics from testing]
**Developer experience:** [Team feedback]

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | Low/Med/High | Low/Med/High | [How to mitigate] |
| [Risk 2] | Low/Med/High | Low/Med/High | [How to mitigate] |

## Cost Analysis
- **Licensing:** [Annual cost]
- **Infrastructure:** [Additional resources needed]
- **Training:** [Time and cost to skill up]
- **Migration:** [Effort to adopt]
- **Ongoing:** [Maintenance burden]

**Total first year:** [$X]
**Ongoing annual:** [$Y]

## Decision
**Status:** [Approved/Rejected/Deferred]
**Rationale:** [Why this decision]
**Next steps:** [If approved, what happens next]

## Adoption Plan (if approved)

### Phase 1: Pilot (Month 1-2)
- Scope: [Limited use case]
- Team: [Who involved]
- Success criteria: [How to measure]

### Phase 2: Expand (Month 3-4)
- Scope: [Broader adoption]
- Training: [Team enablement]
- Migration: [From old to new]

### Phase 3: Full Adoption (Month 5-6)
- Complete rollout
- Deprecate old solution
- Documentation complete

## Review Date
[When to assess if adoption was successful]
```

---

**Team Development Pattern:**

Invest in team capability growth:

**Development Areas:**

1. **Skill Assessment:**
   - Current capabilities: What team can do now
   - Skill gaps: What's needed but missing
   - Individual interests: What team wants to learn
   - Business needs: What will deliver value
   - Technology trends: What's becoming important

2. **Learning Opportunities:**
   - Training courses: Online or in-person classes
   - Conferences: Industry events, learning, networking
   - Workshops: Hands-on skill building
   - Certifications: Formal credentials
   - Books and resources: Self-directed learning

3. **Knowledge Sharing:**
   - Brown bag sessions: Informal team learning
   - Tech talks: Present on topics
   - Show and tell: Demo new work
   - Documentation: Write it down
   - Mentoring: One-on-one knowledge transfer

4. **Practice Opportunities:**
   - Pair programming: Learn while working
   - Code reviews: Teaching moments
   - Stretch assignments: Challenging work
   - Side projects: Experimentation
   - Open source: Community contribution

**Knowledge Sharing Format:**
```
Knowledge sharing sessions:

1. Brown bag (30-45 minutes):
   - Informal lunch learning
   - Team member presents
   - Topic: Recent learning, new technology, useful pattern
   - Q&A and discussion
   - Recorded for later viewing

2. Tech talk (45-60 minutes):
   - More formal presentation
   - Deeper dive on topic
   - Prepared slides/demo
   - Company-wide or team-specific
   - Followed by discussion

3. Show and tell (15-30 minutes):
   - Demo recent work
   - Show new feature or refactoring
   - Explain approach and decisions
   - Get feedback from team
   - Share learnings

4. Code walkthrough (30-45 minutes):
   - Walk through complex code
   - Explain design decisions
   - Discuss trade-offs
   - Answer questions
   - Document for future reference

5. Post-mortem sharing:
   - Share incident learnings across teams
   - Present at all-hands
   - Write blog post (internal or external)
   - Update documentation
```

**Team Learning Plan Template:**
```markdown
# Team Development Plan: Q[X] YYYY

## Team Skill Assessment

### Current Strengths
- [Skill 1]: [Team proficiency level]
- [Skill 2]: [Team proficiency level]

### Skill Gaps
- [Gap 1]: [Why needed]
- [Gap 2]: [Why needed]

### Individual Development Goals
- **[Team member 1]:** [Learning goal]
- **[Team member 2]:** [Learning goal]

## Learning Initiatives

### Training
- **Course:** [Course name]
  - **Who:** [Team members attending]
  - **When:** [Timeline]
  - **Cost:** [$X]
  - **Goal:** [What we'll learn]

### Conferences
- **Conference:** [Name]
  - **Who:** [Attendees]
  - **When:** [Date]
  - **Cost:** [$X]
  - **Goal:** [Learning objectives]

### Knowledge Sharing
- **Brown bags:** Bi-weekly, rotating presenters
- **Tech talks:** Monthly, volunteer basis
- **Show and tell:** Weekly in sprint review

### Practice
- **Pair programming:** 2 hours/week minimum
- **Code reviews:** All PRs reviewed by 2+ people
- **Stretch assignments:** Rotate complex tasks

## Budget
**Total allocated:** [$X]
**Spent to date:** [$Y]
**Remaining:** [$Z]

## Success Metrics
- Team skill assessments: Before and after
- Training completion rate: Target 90%
- Knowledge sharing sessions: 2+ per month
- Team satisfaction: Quarterly survey

## Review
**Next review:** [Date]
**Adjustments:** [Based on progress and needs]
```

---

**Learning Culture Pattern:**

Create environment that encourages learning:

**Cultural Elements:**

1. **Psychological Safety:**
   - Safe to admit not knowing
   - Okay to make mistakes
   - Questions encouraged
   - Learning celebrated
   - Failure seen as teaching opportunity

2. **Time Allocation:**
   - Dedicated learning time (10-20% of work time)
   - Conference attendance budget
   - Book/course budget
   - Hackathons and innovation time
   - Cross-training opportunities

3. **Knowledge Management:**
   - Documentation culture: Write things down
   - Searchable knowledge base
   - Runbooks for operations
   - Decision records for context
   - Regular updates as things change

4. **Recognition:**
   - Celebrate learning achievements
   - Share successes widely
   - Recognize knowledge sharing
   - Value teaching and mentoring
   - Promote growth mindset

**Documentation Culture Pattern:**
```
Effective documentation practices:

1. What to document:
   - Why decisions were made (context)
   - How things work (architecture)
   - How to operate (runbooks)
   - How to develop (setup, workflows)
   - What we learned (post-mortems, retros)

2. Where to document:
   - Architecture decisions: `docs/decisions/`
   - Runbooks: `docs/runbooks/`
   - Processes: `docs/processes/`
   - Incidents: `docs/incidents/`
   - Learning: `docs/learning/`

3. When to document:
   - As you work: Capture decisions when made
   - Before forgetting: Document while fresh
   - After incidents: Capture learnings
   - During reviews: Record assessments
   - When onboarding: Fill knowledge gaps

4. How to document:
   - Clear and concise: Easy to understand
   - Context included: Why, not just what
   - Examples provided: Concrete illustrations
   - Up to date: Review and update regularly
   - Searchable: Easy to find when needed

5. Documentation maintenance:
   - Assign owners: Who keeps it current
   - Regular review: Quarterly check for accuracy
   - Deprecation: Remove outdated docs
   - Versioning: Track changes over time
   - Feedback: Easy way to suggest improvements
```

</output-format>

<instructions>
CRITICAL: Continuous learning builds organizational resilience and capability.

NEVER foster learning by:
- Blaming individuals for incidents (creates fear, hides problems)
- Skipping post-mortems (missing learning opportunity)
- Ignoring action items from reviews (feedback without action)
- Treating learning as luxury (it's essential investment)
- Hoarding knowledge (creating single points of failure)
- Adopting technology without evaluation (blind following)

DO NOT:
- Use incidents to punish people
- Skip post-mortems for "small" incidents
- Create action items without owners or timelines
- Expect learning to happen only on personal time
- Keep knowledge in individuals' heads
- Adopt new technology just because it's trendy

ALWAYS:
- Conduct blameless post-incident reviews
- Create specific action items with owners
- Schedule regular architecture reviews
- Evaluate technology with POCs before adopting
- Allocate time for learning and development
- Share knowledge widely through documentation
- Celebrate learning and growth
- Make it safe to admit not knowing
- Turn failures into learning opportunities
- Track and complete improvement actions

REPEAT: Learning from incidents builds resilience. Architecture reviews keep systems aligned. Technology evaluation prevents blind adoption. Team development strengthens capability. Share knowledge widely.
</instructions>

<examples>
✅ GOOD Post-Incident Review (blameless, actionable, learning-focused):

**Pattern demonstrates:**
- Blameless language
- Detailed timeline
- Root cause analysis
- Specific action items
- Knowledge sharing

**Post-incident review:**
```
# Post-Incident Review: Payment Service Outage

**Date:** 2026-01-15
**Duration:** 43 minutes
**Severity:** High
**Impact:** ~2,000 users unable to complete payments

## Summary
Payment service became unresponsive due to database connection
pool exhaustion. Service recovered after increasing pool size and
restarting instances.

## Timeline (UTC)
| Time | Event |
|------|-------|
| 14:00 | Normal operation, ~200 req/s |
| 14:23 | Traffic spike to 450 req/s (promotion announced) |
| 14:27 | P95 latency increased 120ms → 850ms |
| 14:30 | Alert: High latency detected |
| 14:31 | On-call engineer notified |
| 14:35 | Investigation started |
| 14:42 | Database connection pool exhaustion identified |
| 14:45 | Decision: Increase pool size |
| 14:48 | Configuration updated, services restarting |
| 14:52 | Services healthy, latency returned to normal |
| 14:55 | Monitoring confirmed resolution |

## What Happened
Marketing launched a promotion without notifying engineering.
Traffic doubled from 200 req/s to 450 req/s. Database connection
pool (max 50 connections) was sized for normal traffic. Under
increased load, connection pool exhausted, causing requests to
queue and timeout.

## Root Cause
**Proximate cause:** Database connection pool too small for traffic spike

**Contributing factors:**
- No communication between marketing and engineering about promotion
- Connection pool sized for average load, not peak load
- No load testing before promotions
- Insufficient monitoring (didn't alert on connection pool usage)

**Root cause:** Lack of coordination between teams on events that
affect system load

## Resolution
1. Increased connection pool size from 50 to 150
2. Restarted service instances to pick up new configuration
3. Verified latency returned to normal
4. Verified no payment failures during recovery

## Impact
- **Users affected:** ~2,000 attempted payments during outage
- **Duration:** 43 minutes (14:27 to 15:10)
- **Revenue impact:** Estimated $15K in delayed transactions
- **Services affected:** Payment processing only

## What Went Well ✓
- Alert fired quickly (3 minutes after latency spike)
- On-call responded immediately
- Root cause identified within 11 minutes
- Fix was straightforward
- Recovery was clean (no data loss)
- Team communication was effective

## What Could Be Better ⚠️
- No advance warning of promotion
- Connection pool usage not monitored
- No load testing before traffic events
- Alert threshold could be lower (catch earlier)
- Didn't have pre-approved scale-up procedure

## Action Items

### Immediate (< 1 week)
- [x] Add connection pool usage monitoring - @alice - Done
- [x] Lower latency alert threshold 850ms → 300ms - @bob - Done
- [ ] Document connection pool scaling procedure - @bob - Due Jan 22

### Short-term (< 1 month)
- [ ] Establish marketing/eng communication for promotions - @carol - Due Feb 15
- [ ] Load test before all major promotions - @alice - Due Feb 15
- [ ] Auto-scaling for database connections - @dave - Due Feb 28

### Long-term (< 3 months)
- [ ] Predictive load monitoring and alerting - @team - Due April 15
- [ ] Quarterly capacity planning process - @carol - Due April 15

## Lessons Learned
1. Connection pool sizing must account for peak, not average load
2. Cross-team coordination essential for events affecting load
3. Monitoring gaps can delay detection and diagnosis
4. Need runbooks for common scaling operations
5. Load testing should precede traffic-driving events

## Shared With
- Engineering all-hands presentation (Jan 18)
- Blog post: "What we learned from our payment outage" (Jan 20)
- Updated runbook: Database connection scaling
- Added to onboarding materials

## Related Incidents
- Similar issue in Oct 2025 with API rate limiting
- Shares theme: Insufficient capacity planning for traffic events
```

**Why this works:**
- Blameless language (system focus, not people)
- Detailed timeline (clear sequence of events)
- Root cause goes beyond immediate trigger
- Specific action items with owners and dates
- Celebrates what went well
- Learning shared widely
- Related incidents linked

---

❌ BAD Post-Incident Review Anti-pattern (blame-focused, vague, no actions):

**Anti-pattern characteristics:**
- Blames individuals
- Vague description
- No specific actions
- No follow-through
- Knowledge not shared

**Bad post-mortem:**
```
# Post-Mortem: Outage

**Date:** 2026-01-15

## What Happened
Bob deployed code that broke the payment service.
Alice didn't catch it in code review.
Carol's marketing promotion caused traffic spike
without telling anyone.

## Root Cause
- Bob's code had a bug
- Alice should have reviewed better
- Carol should have communicated

## Actions
- Bob: Be more careful
- Alice: Review more thoroughly
- Carol: Communicate better

## Conclusion
Everyone needs to do better.
```

**Why this fails:**
- Blames individuals by name
- Creates fear and defensiveness
- No learning about systems
- Vague actions ("be more careful")
- No owners or timelines
- Not shared (only team sees it)
- Won't prevent recurrence
- Damages psychological safety

---

✅ GOOD Architecture Review (thorough assessment, specific findings, actionable):

**Pattern demonstrates:**
- Comprehensive assessment
- Data-driven findings
- Prioritized recommendations
- Specific action items
- Follow-up plan

**Architecture review excerpt:**
```
# Architecture Review: Payment Service Q1 2026

**Date:** 2026-01-20
**Participants:** Engineering team, Tech Lead, Architect

## Current State
**Purpose:** Process customer payments for e-commerce platform
**Scale:** 10M payments/month, 250 req/s peak
**Uptime:** 99.7% last quarter (target: 99.9%)

## Key Findings

### 1. Database Scaling Approaching Limits ⚠️
**Finding:** Database CPU at 65% average, 85% peak
**Projection:** Will hit 100% in ~4 months at current growth
**Impact:** High - system slowdown when limit reached
**Recommendation:** Implement read replicas within 2 months
**Effort:** 2-3 weeks
**Priority:** High

### 2. Monolithic Codebase Slowing Development 📉
**Finding:** Average PR review time increased 45min → 2.5hrs
**Root cause:** Single codebase for all payment functionality
**Impact:** Medium - slower feature delivery
**Recommendation:** Extract fraud detection to separate service
**Effort:** 6-8 weeks
**Priority:** Medium

### 3. Technical Debt in Error Handling 🔧
**Finding:** 23 different error handling patterns across codebase
**Impact:** Low - inconsistent but functional
**Recommendation:** Standardize on error handling pattern
**Effort:** 3-4 weeks
**Priority:** Low (but worthwhile)

## Action Plan

### Q1 (Jan-Mar)
- [ ] Implement database read replicas - @alice - Feb 28
- [ ] Standardize error handling - @bob - Mar 31

### Q2 (Apr-Jun)
- [ ] Extract fraud detection service - @team - Jun 30
- [ ] Load test new architecture - @alice - Jun 30

### Q3 (Jul-Sep)
- [ ] Migrate 50% of fraud checks to new service
- [ ] Monitor performance and reliability

## Success Metrics
- Database CPU < 70% peak after read replicas
- PR review time < 1 hour after extraction
- Uptime improves to 99.9%

## Next Review
**Date:** July 2026 (Q3)
**Focus:** Assess read replica impact, fraud extraction progress
```

**Why this works:**
- Data-driven findings (CPU usage, PR times)
- Prioritized by impact and effort
- Specific recommendations
- Clear owners and timelines
- Success metrics defined
- Follow-up scheduled

---

❌ BAD Architecture Review Anti-pattern (vague assessment, no priorities, no action):

**Anti-pattern characteristics:**
- Vague observations
- No data
- No prioritization
- No specific actions
- No follow-up

**Bad architecture review:**
```
# Architecture Review

## Findings
- Database could be better
- Code is getting messy
- Tests are slow
- Should consider microservices
- Technical debt is accumulating

## Recommendations
- Improve database
- Clean up code
- Speed up tests
- Maybe split into microservices
- Address technical debt

(No data, no owners, no timelines, no follow-up)
```

**Why this fails:**
- No specific findings ("could be better")
- No data to support claims
- No prioritization (what's urgent?)
- Vague recommendations ("clean up code")
- No owners or timelines
- No success metrics
- No follow-up plan
- Team doesn't know what to do next
</examples>
