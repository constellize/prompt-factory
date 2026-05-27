---
# === Identity ===
id: establish-feedback-loops
name: Establish feedback loops to surface issues quickly and guide improvement
version: v1

# === Classification ===
chapter: 4
category: excellence
subcategory: maintenance
tags:
  - quality
  - maintenance
  - feedback-loops
  - automation
  - code-review
  - retrospectives
  - user-feedback
  - monitoring
  - observability
  - continuous-improvement

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Establish feedback loops to surface issues quickly and guide improvement.
    Build automated, team, user, and system feedback mechanisms (Gate 6: Continuous Improvement).
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
    description: The specific component to establish feedback loops for
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
      **Establish feedback loops** to surface issues quickly and guide continuous improvement. Automated feedback from CI/CD pipeline results and monitoring alerts provides instant visibility into system health. Team feedback through code reviews, retrospectives, and pair programming strengthens collective knowledge and catches issues early. User feedback via bug reports, feature requests, and usage analytics reveals how the system performs in real usage. System feedback from performance data, error logs, and health check results exposes operational patterns and potential problems.
    preview: |
      "...configure automated feedback from CI/CD pipelines and monitoring alerts. Establish team feedback through code reviews and retrospectives. Collect user and system feedback..."
  website:
    include: true
    path: /prompts/establish-feedback-loops
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Establish feedback loops for {{component_name}} in {{system_name}} to surface issues quickly and guide continuous improvement.

Build feedback loops that surface issues quickly and guide improvement. Automated feedback from CI/CD pipeline results and monitoring alerts provides instant visibility into system health. Team feedback through code reviews, retrospectives, and pair programming strengthens collective knowledge and catches issues early. User feedback via bug reports, feature requests, and usage analytics reveals how the system performs in real usage. System feedback from performance data, error logs, and health check results exposes operational patterns and potential problems.

Follow this process:

1. **Configure automated feedback:**
   - CI/CD pipeline notifications (build failures, deployment status)
   - Monitoring alerts (performance degradation, error rate spikes)
   - Test failure reports (which tests failed, failure patterns)
   - Security scan results (vulnerabilities detected, severity levels)
   - Dependency update notifications (new versions, breaking changes)

2. **Establish team feedback mechanisms:**
   - Code review process (review checklist, approval criteria)
   - Retrospectives (what went well, what to improve, action items)
   - Pair programming sessions (knowledge sharing, real-time feedback)
   - Daily standups (blockers, progress, team coordination)
   - Architecture reviews (design decisions, trade-off discussions)

3. **Collect user feedback:**
   - Bug reporting system (easy submission, triage process)
   - Feature request tracking (voting, prioritization)
   - Usage analytics (feature adoption, user flows, drop-off points)
   - User satisfaction surveys (NPS, CSAT, qualitative feedback)
   - Support ticket analysis (common issues, resolution time)

4. **Gather system feedback:**
   - Performance monitoring (response times, throughput, resource usage)
   - Error logging (error rates, stack traces, error patterns)
   - Health check results (service status, dependency health)
   - Audit logs (security events, access patterns, anomalies)
   - Cost metrics (infrastructure spend, resource efficiency)
</task>

<context>
Component to establish feedback loops:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates/updates:
- CI/CD notification configuration
- `docs/processes/feedback-loops.md` (feedback mechanisms)
- Monitoring and alerting rules
- Retrospective templates
- User feedback collection setup
</context>

<thinking>
Before establishing feedback loops, analyze:
1. What feedback channels already exist and how effective are they?
2. What gaps exist where feedback is slow or missing?
3. How quickly do we need different types of feedback?
4. Who needs to receive which feedback?
5. How do we avoid alert fatigue and feedback overload?
</thinking>

<output-format>
Create feedback loop configuration following these patterns:

**Automated Feedback Loop Pattern:**

Configure instant feedback from automated systems:

**Feedback Categories:**

1. **CI/CD Pipeline Feedback:**
   - Build status: Success, failure, duration
   - Test results: Passed, failed, flaky tests
   - Deployment status: Started, completed, rolled back
   - Quality gates: Coverage drops, complexity increases
   - Security scans: Vulnerabilities found, severity levels

2. **Monitoring Alerts:**
   - Performance: Latency spikes, throughput drops
   - Errors: Error rate increases, new error types
   - Resources: High CPU, memory leaks, disk full
   - Dependencies: External service failures, timeouts
   - Business: Transaction failures, conversion drops

3. **Security Notifications:**
   - Vulnerability detection: New CVEs in dependencies
   - Secret exposure: API keys, passwords in code
   - Compliance: Policy violations, audit failures
   - Access anomalies: Unusual login patterns, privilege escalation

**Notification Routing Pattern:**
```
Feedback routing by urgency:

Critical (immediate action):
- Production outage → Page on-call
- Security breach → Alert security team
- Data loss → Escalate to leadership
- Delivery: Phone call, SMS, page

High (quick response):
- Build failure on main branch → Notify committer
- Deployment failure → Alert team channel
- Performance degradation → Notify on-call
- Delivery: Team chat, email

Medium (timely response):
- Test failure on feature branch → Notify PR author
- Coverage drop in PR → Comment on PR
- Dependency update available → Weekly digest
- Delivery: PR comment, chat notification

Low (awareness):
- Successful deployment → Log to channel
- Nightly build success → Dashboard update
- Weekly metrics summary → Email digest
- Delivery: Dashboard, email summary
```

**Feedback Loop Timing Pattern:**
```
Response time expectations:

Instant (<1 minute):
- Build failure: Developer needs immediate feedback
- Deployment failure: Team needs to know quickly
- Production alert: On-call must respond

Fast (<15 minutes):
- PR review request: Don't block progress
- Test failure investigation: Keep flow
- Performance regression: Detect before users complain

Timely (<1 hour):
- Code review completion: Balance quality and velocity
- Security scan results: Risk assessment window
- Incident response: Mitigation timeframe

Regular (daily/weekly):
- Metrics review: Trends emerge over time
- Retrospective scheduling: Reflection requires distance
- Usage analytics: Patterns need aggregation
```

---

**Team Feedback Loop Pattern:**

Build human feedback mechanisms:

**Feedback Mechanisms:**

1. **Code Review:**
   - Review request: Author submits for review
   - Review process: Reviewers provide feedback
   - Discussion: Author and reviewers align
   - Approval: Code quality threshold met
   - Merge: Changes integrated

2. **Retrospectives:**
   - Regular cadence: Every sprint/iteration
   - Safe environment: Blameless discussion
   - Structured format: What worked, what didn't, actions
   - Action tracking: Follow up on improvements
   - Continuous: Adapt based on feedback

3. **Pair Programming:**
   - Real-time feedback: Immediate course correction
   - Knowledge sharing: Skills transfer
   - Quality improvement: Two perspectives on solution
   - Collective ownership: Shared understanding
   - Reduced silos: Team-wide knowledge

**Code Review Feedback Pattern:**
```
Effective code review process:

1. Review request:
   - Clear description: What changed and why
   - Test evidence: How was it validated
   - Checklist completed: Self-review done
   - Appropriate reviewers: Domain experts included

2. Review feedback types:
   - Blocking: Must fix before merge
   - Non-blocking: Nice to have improvements
   - Questions: Clarification needed
   - Learning: Educational comments
   - Praise: Recognize good work

3. Feedback quality:
   - Specific: Point to exact lines/files
   - Constructive: Explain why, suggest alternatives
   - Timely: Don't leave PRs hanging
   - Balanced: Acknowledge good parts
   - Kind: Assume positive intent

4. Resolution:
   - Discussion: Align on approach
   - Changes: Author implements feedback
   - Re-review: Verify changes address feedback
   - Approval: Quality threshold met
   - Merge: Changes integrated
```

**Retrospective Feedback Pattern:**
```
Retrospective structure:

1. Set the stage (5 min):
   - Create safe environment
   - Remind of prime directive (everyone did their best)
   - Set tone for blameless discussion

2. Gather data (15 min):
   - What happened this iteration?
   - Metrics review: Deployment frequency, incidents, velocity
   - Events timeline: Significant moments
   - Feelings check: Team morale

3. Generate insights (20 min):
   - What went well? (Keep doing)
   - What didn't go well? (Stop doing)
   - What should we try? (Start doing)
   - Group similar themes
   - Vote on priorities

4. Decide actions (15 min):
   - Pick top 2-3 improvements
   - Define specific actions
   - Assign owners
   - Set completion timeframe
   - Make actions SMART (Specific, Measurable, Achievable, Relevant, Time-bound)

5. Close (5 min):
   - Summarize actions
   - Review previous actions (were they completed?)
   - Appreciate contributions
   - Schedule next retrospective

Action tracking:
- Document actions in shared location
- Review at next retrospective
- Celebrate completed actions
- Adjust if actions not working
```

**Pair Programming Feedback Pattern:**
```
Pairing approaches:

1. Driver-Navigator:
   - Driver: Writes code
   - Navigator: Reviews, suggests, thinks ahead
   - Switch roles: Every 15-30 minutes
   - Communication: Continuous dialogue

2. Ping-Pong:
   - Developer A: Writes failing test
   - Developer B: Writes code to pass test
   - Developer B: Writes next failing test
   - Developer A: Writes code to pass test
   - Repeat: Test-driven development flow

3. Strong-Style:
   - Navigator: Decides what to write
   - Driver: Implements navigator's intent
   - Learning: Navigator teaches through direction
   - Trust: Driver trusts navigator's guidance

Pairing benefits:
- Immediate feedback: Catch issues as they're written
- Knowledge sharing: Learn from each other
- Focus: Two minds on same problem
- Quality: Built-in code review
- Reduced blocking: Work through obstacles together
```

---

**User Feedback Loop Pattern:**

Collect and act on user feedback:

**Feedback Channels:**

1. **Bug Reports:**
   - Easy submission: Low-friction reporting
   - Structured format: Steps to reproduce, expected vs actual
   - Triage process: Severity, priority, assignment
   - Resolution tracking: Status updates to reporter
   - Follow-up: Verify fix resolved issue

2. **Feature Requests:**
   - Collection point: Centralized tracking
   - Voting mechanism: User-driven prioritization
   - Context capture: Why needed, use case
   - Evaluation process: Feasibility, effort, value
   - Communication: Decision and timeline shared

3. **Usage Analytics:**
   - Instrumentation: Track user interactions
   - Funnel analysis: Where users drop off
   - Feature adoption: Which features are used
   - Performance impact: User-perceived latency
   - Cohort analysis: User behavior patterns

**Bug Report Feedback Pattern:**
```
Bug reporting workflow:

1. User submission:
   - Easy access: In-app or web form
   - Structured template:
     * What were you doing?
     * What did you expect?
     * What actually happened?
     * Screenshots/logs if available
   - Automatic capture: Browser, version, user context

2. Triage (within 24 hours):
   - Severity assessment:
     * Critical: Data loss, security, complete failure
     * High: Major feature broken, many users affected
     * Medium: Feature partially broken, workaround exists
     * Low: Cosmetic, edge case, few users affected
   - Priority setting: Based on severity + user impact
   - Assignment: To appropriate team/person

3. Investigation:
   - Reproduce: Follow steps to reproduce
   - Root cause: Find underlying issue
   - Solution: Determine fix approach
   - Communication: Update reporter on progress

4. Resolution:
   - Fix implementation: Code changes
   - Testing: Verify fix works
   - Deployment: Release to production
   - Verification: Confirm issue resolved
   - Closure: Thank reporter, close ticket

5. Learning:
   - Pattern detection: Similar bugs clustering
   - Prevention: How to avoid in future
   - Monitoring: Add alerts for similar issues
```

**Feature Request Feedback Pattern:**
```
Feature request process:

1. Submission:
   - Template:
     * What problem does this solve?
     * Who is affected?
     * Current workaround?
     * Proposed solution?
   - Categorization: Area of product

2. Evaluation:
   - Voting: How many users want this
   - Alignment: Fits product vision?
   - Effort: How much work required
   - Value: How much benefit delivered
   - Dependencies: Requires other work?

3. Prioritization:
   - High value, low effort: Do soon (quick wins)
   - High value, high effort: Plan carefully (strategic)
   - Low value, low effort: Consider if time allows
   - Low value, high effort: Decline politely

4. Communication:
   - Accepted: Roadmap timeline shared
   - Declined: Reasoning explained
   - Deferred: Conditions for reconsideration
   - Updates: Progress communicated

5. Delivery:
   - Implementation: Build the feature
   - Testing: Validate solution
   - Release: Deploy to users
   - Follow-up: Check if solved problem
```

**Usage Analytics Feedback Pattern:**
```
Analytics collection and analysis:

1. Instrumentation:
   - Events: User actions tracked
   - Properties: Context captured (user segment, device, etc.)
   - Respect privacy: Anonymize, aggregate
   - Consent: User permission obtained

2. Analysis:
   - Adoption: How many users use feature
   - Frequency: How often used
   - Flow: User journey through system
   - Drop-off: Where users abandon flow
   - Performance: Load times, responsiveness

3. Insights:
   - Popular features: Invest in improvement
   - Unused features: Deprecation candidates
   - Drop-off points: UX issues to fix
   - User segments: Different behavior patterns
   - Trends: Growing or declining usage

4. Actions:
   - Improve: High-use features
   - Simplify: Complex flows with drop-off
   - Promote: Valuable but under-used features
   - Remove: Unused features adding complexity
   - Experiment: A/B test improvements
```

---

**System Feedback Loop Pattern:**

Gather operational feedback automatically:

**Feedback Sources:**

1. **Performance Monitoring:**
   - Response time distribution: P50, P95, P99
   - Throughput: Requests per second
   - Resource utilization: CPU, memory, disk, network
   - Bottleneck identification: Where time is spent

2. **Error Logging:**
   - Error rates: Count of errors per time window
   - Error types: Categorized by cause
   - Stack traces: Debug information
   - Impact assessment: Users affected

3. **Health Checks:**
   - Service availability: Is service running
   - Dependency health: Are dependencies reachable
   - Resource health: Disk space, memory, connections
   - Business health: Are transactions succeeding

**Observability Pattern:**
```
Three pillars of observability:

1. Metrics (aggregated):
   - Counters: Total requests, errors
   - Gauges: Current memory, CPU
   - Histograms: Request duration distribution
   - Timeseries: Values over time

2. Logs (individual events):
   - Structured: JSON with fields
   - Context: Request ID, user ID, timestamp
   - Levels: Debug, info, warn, error
   - Searchable: Filter and aggregate

3. Traces (request flow):
   - Distributed: Across multiple services
   - Spans: Individual operations
   - Parent-child: Call hierarchy
   - Timing: Duration of each operation

Correlation:
- Metrics show "what": Error rate increased
- Logs show "which": Specific errors occurring
- Traces show "where": Which service/operation failing
```

**Error Feedback Pattern:**
```
Error detection and response:

1. Error occurs:
   - Logged: Captured with context
   - Tagged: Categorized by type
   - Aggregated: Counted and grouped
   - Alerted: If threshold exceeded

2. Alert triggered:
   - Notification: Team receives alert
   - Context: Error details, frequency, affected users
   - Runbook: Link to troubleshooting guide
   - Incident: Create if needed

3. Investigation:
   - Log search: Find specific errors
   - Trace analysis: Understand request flow
   - Metric correlation: Related symptoms
   - Root cause: Identify underlying issue

4. Resolution:
   - Fix: Implement solution
   - Deploy: Release fix
   - Monitor: Verify error rate decreases
   - Document: Update runbook

5. Prevention:
   - Test: Add test to prevent regression
   - Alert: Refine alert threshold
   - Code: Improve error handling
   - Learn: Share with team
```

**Health Check Feedback Pattern:**
```
Health check implementation:

1. Service health:
   - Liveness: Is service running?
   - Readiness: Is service ready for traffic?
   - Startup: Has service finished initializing?

2. Dependency health:
   - Database: Can connect and query
   - Cache: Can read and write
   - External APIs: Are they reachable
   - Message queues: Can send and receive

3. Resource health:
   - Disk space: Sufficient available
   - Memory: Not approaching limit
   - File descriptors: Not exhausted
   - Database connections: Pool not full

4. Business health:
   - Transaction success rate: Above threshold
   - Payment processing: Functioning correctly
   - Order fulfillment: Processing normally
   - User actions: Succeeding as expected

Health check response:
- Healthy: 200 OK + details
- Unhealthy: 503 Service Unavailable + details
- Degraded: 200 OK + warnings (partial health)

Actions on unhealthy:
- Load balancer: Remove from rotation
- Orchestrator: Restart service
- Alert: Notify team
- Auto-heal: Attempt recovery
```

---

**Feedback Loop Integration Pattern:**

Connect all feedback sources:

**Integration Approach:**

1. **Centralized Dashboard:**
   - All feedback sources visible
   - Real-time updates
   - Historical trends
   - Drill-down capability

2. **Notification Consolidation:**
   - Single notification system
   - Routing rules by severity
   - Deduplication: Avoid duplicates
   - Rate limiting: Prevent overload

3. **Context Correlation:**
   - Link related feedback: Deployment → Alert → Incident
   - Timeline view: Events in chronological order
   - Impact tracking: Users affected, revenue impact
   - Root cause linking: Multiple symptoms, one cause

**Feedback Effectiveness Pattern:**
```
Measure feedback loop effectiveness:

1. Speed metrics:
   - Detection time: How long to notice issue
   - Notification time: How long to alert relevant people
   - Response time: How long to start investigating
   - Resolution time: How long to fix

2. Quality metrics:
   - False positive rate: Alerts without real issues
   - False negative rate: Issues without alerts
   - Signal-to-noise: Useful alerts vs noise
   - Actionability: Percentage of feedback acted upon

3. Improvement metrics:
   - Mean time to detection (MTTD): Decreasing
   - Mean time to resolution (MTTR): Decreasing
   - Issue recurrence: Same issues repeating
   - Learning application: Feedback leading to prevention

4. Adjustments:
   - Alert thresholds: Reduce false positives
   - Routing rules: Right people notified
   - Documentation: Runbooks improved
   - Automation: Manual steps eliminated
```

</output-format>

<instructions>
CRITICAL: Feedback loops surface issues quickly and guide continuous improvement.

NEVER establish feedback loops by:
- Creating alerts without action plans (alert fatigue)
- Sending all feedback to everyone (noise, not signal)
- Making feedback collection difficult (gaps in visibility)
- Ignoring feedback received (discourages participation)
- Blaming based on feedback (creates fear, hides issues)
- Collecting feedback without analyzing it (data graveyard)

DO NOT:
- Alert on low-severity issues requiring immediate response
- Route all alerts to entire team (diffusion of responsibility)
- Collect feedback without acting on it
- Set up feedback without clear owners
- Create feedback channels without response SLAs
- Measure individual performance with feedback (creates gaming)

ALWAYS:
- Route feedback to appropriate people based on severity
- Provide actionable context with feedback
- Set clear response time expectations
- Make feedback easy to provide
- Close the loop (respond to feedback received)
- Use feedback to improve, not to blame
- Reduce alert fatigue through thoughtful thresholds
- Connect feedback sources for context
- Measure and improve feedback effectiveness
- Celebrate improvements driven by feedback

REPEAT: Feedback loops surface issues quickly. Automated, team, user, and system feedback. Route by severity. Provide context. Take action. Close the loop.
</instructions>

<examples>
✅ GOOD Automated Feedback Loop (fast, actionable, well-routed):

**Pattern demonstrates:**
- Clear severity levels
- Appropriate routing
- Actionable context
- Fast response times

**Alert example:**
```
Alert: High Error Rate Detected

Severity: High
Service: PaymentService
Time: 2026-01-17 14:32:00 UTC
Duration: 5 minutes

Metrics:
- Error rate: 12% (baseline: 1%)
- Affected requests: ~300 in last 5 minutes
- Error type: Payment gateway timeout
- P95 latency: 2500ms (baseline: 150ms)

Context:
- Recent deployment: v2.3.0 deployed 15 minutes ago
- No infrastructure changes
- Payment gateway status: Operational (per their status page)

Likely cause:
- New payment validation code (deployed in v2.3.0)
- Check: src/payment/validator.ts:67

Actions:
1. Check if error rate still increasing
2. Review recent deployment changes
3. Consider rollback if not resolved in 10 minutes

Runbook: https://wiki/runbooks/payment-service-errors
Dashboard: https://metrics/payment-service
Logs: https://logs?filter=error&service=payment&last=15m

Notified: @payment-team, @on-call-engineer
```

**Why this works:**
- Severity clear (High, not Critical)
- Team channel + on-call notified
- Rich context provided
- Likely cause suggested
- Clear actions listed
- Links to runbook, dashboard, logs
- Fast detection (5 minutes)

---

❌ BAD Automated Feedback Anti-pattern (vague, late, not actionable):

**Anti-pattern characteristics:**
- Vague alert
- No context
- Late detection
- Everyone notified
- No action guidance

**Bad alert:**
```
Alert: Something Wrong

Service: PaymentService
Status: Bad

(No metrics)
(No context)
(No suggested actions)
(No links)

Notified: @everyone
```

**Production incident:**
```
14:32 - Error rate spikes to 12%
14:47 - Alert sent (15 minute delay)
14:48 - Team confused (what's wrong?)
14:52 - No runbook found
14:58 - Trying to find logs
15:05 - Finally identify issue (33 minutes after spike)
15:20 - Issue resolved

Impact: 48 minutes of degraded service
Root cause: Alert provided no useful information
```

**Why this fails:**
- 15 minute detection delay
- No specific metrics
- No context or likely cause
- No action guidance
- No links to tools
- @everyone notification (diffusion of responsibility)
- Team wasted time understanding alert

---

✅ GOOD Code Review Feedback (specific, constructive, timely):

**Pattern demonstrates:**
- Specific line references
- Explains reasoning
- Suggests alternatives
- Balanced (praise + improvement)
- Timely (1 hour after PR)

**Code review comments:**
```
Review: Payment Processing Refactor PR #234

Overall: Good refactoring improving error handling! A few suggestions:

✓ Excellent (Praise):
Line 45-67: Nice use of early returns to reduce nesting. Much more readable!
Line 89: Good catch adding timeout to gateway call. Prevents hanging requests.

⚠️ Blocking (Must fix):
Line 112:
```
try {
  await processPayment(amount);
} catch (error) {
  // TODO: add error handling
}
```

Issue: Silently swallowing errors without logging or alerting.
Impact: Failed payments would go unnoticed.

Suggestion:
```
try {
  await processPayment(amount);
} catch (error) {
  logger.error('Payment processing failed', {
    amount,
    error: error.message,
    paymentId,
  });
  throw new PaymentError('Payment failed', error);
}
```

💡 Non-blocking (Consider):
Line 156: Consider extracting validation to separate function
Reasoning: Validation logic is 30 lines, makes main function hard to follow
Benefit: Testable in isolation, reusable
Your call: Not blocking merge, but would improve maintainability

❓ Question:
Line 203: Why retry 5 times instead of 3?
Context: Want to understand the reasoning for retry count

Response time: 1 hour after PR creation
Status: Approved pending blocking fix
```

**Why this works:**
- Specific line references
- Explains why issues matter
- Suggests concrete fixes
- Balances praise and improvement
- Clear severity levels (blocking vs non-blocking)
- Questions invite discussion
- Timely (1 hour)

---

❌ BAD Code Review Feedback Anti-pattern (vague, harsh, slow):

**Anti-pattern characteristics:**
- Vague comments
- No reasoning
- Harsh tone
- Late response
- No suggestions

**Bad code review:**
```
Review: Payment Processing Refactor PR #234

This isn't good. Please fix:

- Error handling is bad
- Code is too complex
- This won't scale
- Why did you do it this way?
- Please refactor

Status: Changes requested
Response time: 3 days after PR creation
```

**Why this fails:**
- No specific line references
- No explanation of what's wrong
- No suggestions for improvement
- Harsh tone (demoralizing)
- 3 day delay (blocks progress)
- Author doesn't know what to fix
- Creates adversarial dynamic

---

✅ GOOD User Feedback Loop (easy submission, fast triage, closed loop):

**Pattern demonstrates:**
- Low-friction reporting
- Fast triage (same day)
- Status updates
- Issue resolved
- Thank you + follow-up

**Bug report cycle:**
```
Day 1, 10:00 AM - User submits:
Title: Can't complete checkout with saved card
Steps to reproduce:
1. Add item to cart
2. Go to checkout
3. Select saved payment method
4. Click "Place Order"
5. Get error "Payment failed"

Expected: Order placed successfully
Actual: Error message, order not created

Browser: Chrome 120
Screenshot: [attached]

Day 1, 11:30 AM - Team response:
Status: Investigating
Priority: High (checkout broken)
Assigned to: @payment-team

Thank you for reporting! We're investigating now.
We'll update you as we learn more.

Day 1, 2:00 PM - Team update:
Status: Root cause found
Cause: Issue with saved card validation
Fix: In progress
ETA: Deploy today

Day 1, 4:30 PM - Resolution:
Status: Fixed
Deployed: v2.3.1 to production
Fix: Card validation logic corrected

Can you try again and confirm it's working?

Day 1, 5:15 PM - User response:
Confirmed working! Thanks for the quick fix.

Day 1, 5:20 PM - Team closure:
Status: Closed
Resolution time: 7 hours

Thank you for reporting and confirming the fix!
We also added a test to prevent this regression.
```

**Why this works:**
- Easy submission (structured form)
- Fast triage (90 minutes)
- Regular updates (every few hours)
- Quick resolution (same day)
- User confirmation requested
- Closed loop (thank you + follow-up)
- Learning captured (test added)

---

❌ BAD User Feedback Anti-pattern (difficult reporting, no response, black hole):

**Anti-pattern characteristics:**
- Hard to report bugs
- No triage
- No updates
- No resolution
- No follow-up

**Bad bug report experience:**
```
Day 1 - User tries to report:
- No obvious way to report bugs
- Eventually finds email address
- Sends unstructured email

Day 1-7 - No response:
- No acknowledgment
- No status updates
- No idea if anyone saw it
- User frustrated

Day 14 - User gives up:
- Assumes bug won't be fixed
- Starts looking for alternatives
- Tells others about bad experience

Day 30 - Bug mysteriously fixed:
- User notices bug gone
- No communication from team
- Doesn't know if it was even their report

Result:
- User feels ignored
- Lost trust in product
- Valuable feedback discouraged
- Repeat reports for same issue
```

**Why this fails:**
- Hard to submit (friction)
- No acknowledgment (black hole)
- No updates (user in dark)
- No follow-up (missed opportunity)
- Discouraged future feedback
- Damaged relationship
</examples>
