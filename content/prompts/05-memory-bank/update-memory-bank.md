---
# === Identity ===
id: update-memory-bank
name: Update memory bank documentation to capture session knowledge
version: v1

# === Classification ===
chapter: 5
category: memory-bank
subcategory: maintenance
tags:
  - documentation
  - memory-bank
  - knowledge-capture
  - decision-documentation
  - pattern-documentation
  - progress-tracking
  - learning-capture
  - context-preservation
  - stewardship
  - session-review

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Update memory bank documentation to capture session knowledge.
    Preserve decisions, patterns, progress, and learnings after each work session.
  argument-hint: "[project_name] [work_completed]"
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
    description: The specific project to update memory bank for
    example: "E-commerce Platform"
    maps-to: "$0"
  - name: work_completed
    description: Brief summary of work completed this session
    example: "Implemented payment processing"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 5
    description: |
      **Update memory bank documentation** to capture decisions, patterns, and learnings from current work. Document decisions with rationale, capture technical patterns with code examples, track progress with specific details, and record learnings with actionable insights.
    preview: |
      "...capture patterns with concrete examples. Track completions with dates and locations. Record insights with actionable takeaways..."
  website:
    include: true
    path: /prompts/update-memory-bank
  marketplace:
    plugin: constellize:memory

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Update memory bank documentation for {{project_name}} to capture decisions, patterns, progress, and learnings from current work session.

Review conversation history and significant work completed to extract knowledge that must survive context resets. Focus on capturing new decisions made with their rationale, technical patterns discovered or established, progress completed showing what's done and what remains, important learnings and insights gained, and current state with clear next steps. Update memory bank files following established structure and guidelines, being specific and actionable as if writing for someone with complete context loss. Ensure documentation reflects current reality, decisions include rationale, patterns are concrete with examples, progress tracking is accurate, and next steps are clear and actionable.

Follow this process:

1. **Review session for extractable knowledge:**
   - Scan conversation for technical decisions made
   - Identify patterns established or discovered
   - List work completed and status changes
   - Note important learnings and insights
   - Determine current state and blockers

2. **Update appropriate memory bank files:**
   - activeContext.md: Recent decisions, current focus, next steps
   - progress.md: Completed work, status changes, timeline updates
   - systemPatterns.md: New patterns, architectural changes
   - techContext.md: Tool changes, setup updates, new conventions
   - productContext.md: User need clarifications, metric updates
   - projectbrief.md: Requirement changes, scope adjustments (rare)

3. **Document with precision and context:**
   - Decisions include rationale and alternatives considered
   - Patterns include concrete examples from actual code
   - Progress shows specific completions with timestamps
   - Learnings capture insights with actionable takeaways
   - Next steps are specific, not vague

4. **Validate documentation quality:**
   - Context reset test: Could someone continue from these docs?
   - Completeness check: Are all significant items captured?
   - Accuracy check: Does documentation match reality?
   - Actionability check: Are next steps clear and specific?
   - Cross-reference check: Are file links correct?
</task>

<context>
Project to update memory bank:
{{project_name}}

Work completed:
{{work_completed}}

**Standard Construction Folder Structure:**
This prompt updates:
- `memory-bank/activeContext.md` (always updated)
- `memory-bank/progress.md` (always updated)
- `memory-bank/systemPatterns.md` (if patterns added)
- `memory-bank/techContext.md` (if tools changed)
- `memory-bank/productContext.md` (if user needs clarified)
- `memory-bank/projectbrief.md` (rarely, if scope changed)
</context>

<thinking>
Before updating memory bank, analyze:
1. What decisions were made and why?
2. What patterns emerged or were established?
3. What work was completed and what's the new status?
4. What was learned that should be preserved?
5. What are the specific next steps?
6. Which memory bank files need updates?
</thinking>

<output-format>
Create memory bank update following these patterns:

**Session Review Pattern:**

Extract knowledge systematically:

**Conversation Analysis:**
```
Scan conversation for:

1. Decision points:
   - Look for: "We'll use...", "Changed to...", "Decided that..."
   - Extract: What was decided, why, alternatives considered
   - Capture: Date, rationale, trade-offs

2. Pattern establishment:
   - Look for: "Always do...", "Pattern is...", "Approach is..."
   - Extract: What pattern, when to use, why chosen
   - Capture: Code examples, usage guidance

3. Work completion:
   - Look for: "Completed...", "Implemented...", "Finished..."
   - Extract: What was done, how it works, where it lives
   - Capture: Status change, validation performed

4. Learning moments:
   - Look for: "Discovered that...", "Learned...", "Found out..."
   - Extract: What was learned, why it matters
   - Capture: Actionable insight, preventive guidance

5. State transitions:
   - Look for: "Now working on...", "Next is...", "Blocked by..."
   - Extract: Current focus, immediate next steps, blockers
   - Capture: Specific actions, priorities, dependencies
```

**Knowledge Categorization:**
```
Sort extracted knowledge by target file:

activeContext.md updates:
- Decisions made this session
- Current work focus
- Immediate next steps (1-3 items)
- Recent learnings
- Current blockers

progress.md updates:
- Tasks completed with dates
- Status changes (in progress → done)
- New issues discovered
- Timeline adjustments

systemPatterns.md updates:
- New architectural patterns
- Design decisions with rationale
- Code structure patterns
- Integration patterns

techContext.md updates:
- New dependencies added
- Setup procedure changes
- New code conventions
- Debugging discoveries

productContext.md updates:
- User need clarifications
- Success metric changes
- User story additions

projectbrief.md updates:
- Requirement changes (rare)
- Scope adjustments (rare)
```

---

**Decision Documentation Pattern:**

Capture decisions with full context:

**Decision Template:**
```
Decision: [Clear statement of what was decided]

Rationale:
- [Primary reason 1]
- [Primary reason 2]
- [Business/technical driver]

Alternatives Considered:
- [Option A]: [Why not chosen]
- [Option B]: [Why not chosen]

Trade-offs:
- Gained: [Benefits of this choice]
- Cost: [What we gave up]

Date: [When decided]
Context: [What prompted this decision]
Reference: [Related code or documentation]
```

**Example Decision Documentation:**
```
Decision: Use PostgreSQL as primary database

Rationale:
- ACID transactions required for payment processing
- Team has PostgreSQL expertise
- Excellent performance for our data model
- Strong ecosystem and community support

Alternatives Considered:
- MongoDB: No transactions, not suitable for payments
- MySQL: Less feature-rich than PostgreSQL
- SQLite: Not suitable for production scale

Trade-offs:
- Gained: Data integrity, transactions, reliability
- Cost: More complex setup than simpler databases

Date: 2026-01-17
Context: Selecting database for payment system
Reference: systemPatterns.md "Data Architecture"
```

**Where to Document:**
```
- Recent decision (< 1 week): activeContext.md "Recent Decisions"
- Architectural decision: systemPatterns.md + reference in activeContext.md
- Tool selection: techContext.md + reference in activeContext.md
- Process decision: progress.md or appropriate file
```

---

**Pattern Documentation Pattern:**

Capture patterns with concrete examples:

**Pattern Template:**
```
Pattern: [Name of pattern]

Purpose: [What problem it solves]

When to Use:
- [Scenario 1]
- [Scenario 2]

Structure:
[Code or architectural structure]

Example:
[Concrete example from actual code]

Benefits:
- [Benefit 1]
- [Benefit 2]

Considerations:
- [Trade-off or caution]

Location: [Where this pattern is used]
Reference: [Related patterns or documentation]
```

**Example Pattern Documentation:**
```
Pattern: Service Layer Error Handling

Purpose: Consistent error handling across all service methods

When to Use:
- All service layer methods
- Any operation that can fail
- External API calls
- Database operations

Structure:
```
try {
  // Service logic
  return result;
} catch (error) {
  logger.error('Operation failed', { context, error });
  throw new ServiceError('User-friendly message', error);
}
```

Example from PaymentService:
```
async processPayment(orderId, amount) {
  try {
    const result = await gateway.charge(amount);
    logger.info('Payment processed', { orderId, transactionId: result.id });
    return result;
  } catch (error) {
    logger.error('Payment failed', { orderId, amount, error });
    throw new PaymentError('Payment processing failed', error);
  }
}
```

Benefits:
- Consistent error format across services
- Proper error logging with context
- User-friendly error messages
- Error chain preserved for debugging

Considerations:
- Always log before throwing
- Include relevant context in logs
- Use specific error types

Location: src/services/*.js
Reference: techContext.md "Error Handling Conventions"
```

---

**Progress Documentation Pattern:**

Track work completion accurately:

**Completion Entry Template:**
```
- [x] Task completed (YYYY-MM-DD)
  - Details: [What was done]
  - Validation: [How it was tested]
  - Location: [Where code lives]
  - Related: [Dependencies or follow-ups]
```

**Status Transition Pattern:**
```
From: [ ] Not started
To:   [/] In progress
To:   [x] Completed

OR

From: [/] In progress
To:   [!] Blocked
Note: [Blocker description]
```

**Example Progress Updates:**
```
## Completed This Session

- [x] Implemented payment processing (2026-01-17)
  - Details: Created PaymentService with Stripe integration
  - Validation: Unit tests pass, manual testing in Stripe test mode
  - Location: src/services/paymentService.js
  - Related: Need webhook handling next

- [x] Added error handling patterns (2026-01-17)
  - Details: Standardized service layer error handling
  - Validation: All existing services updated and tested
  - Location: src/services/*.js, src/errors/ServiceError.js
  - Related: Updated documentation in techContext.md

## Status Changes

Payment Integration: [ ] → [x] Completed
Error Standardization: [/] → [x] Completed
Webhook Handling: [ ] → [/] In Progress
Testing Suite: [ ] → Not started (next priority)

## New Issues Discovered

- Issue: Stripe rate limiting in test mode
  Severity: Low
  Impact: Slows down development testing
  Workaround: Add delays between test API calls
  Resolution: Use Stripe's fixture data instead

## Timeline Updates

Originally: Payment integration by 2026-01-15
Actual: Completed 2026-01-17 (2 days late)
Reason: Stripe API complexity higher than estimated
Adjustment: Added 3 days buffer to remaining tasks
```

---

**Learning Documentation Pattern:**

Capture insights for future benefit:

**Learning Entry Template:**
```
Learning: [What was discovered]

Context: [Situation that led to learning]

Insight: [Why it matters]

Actionable Takeaway:
- [What to do differently]
- [What to watch for]

Prevention:
- [How to avoid related issues]

Date: [When learned]
```

**Example Learning Documentation:**
```
Learning: Stripe API requires webhook signature verification

Context: Implementing payment webhooks, initially accepting
all webhook POSTs without verification

Insight: Without signature verification, malicious actors
could send fake payment confirmations, causing financial fraud

Actionable Takeaway:
- Always verify webhook signatures before processing
- Use Stripe's provided verification libraries
- Store webhook signing secret securely
- Log verification failures

Prevention:
- Add security checklist to all external integrations
- Review API documentation security sections first
- Have security review before production deployment

Date: 2026-01-17
Reference: systemPatterns.md "Webhook Security"
```

---

**Current State Documentation Pattern:**

Capture immediate next steps:

**Active Context Update Template:**
```
## Current Focus
[One sentence describing current work phase]

## Immediate Next Steps
1. [Specific action with clear completion criteria]
2. [Specific action with clear completion criteria]
3. [Specific action with clear completion criteria]

## Current Blockers
[None / List specific blockers with resolution approaches]

## Open Questions
- Question 1: [Specific question]
  Investigation: [How to answer it]
- Question 2: [Specific question]
  Investigation: [How to answer it]
```

**Specificity Pattern:**
```
❌ Vague:
"Work on webhooks"

✅ Specific:
"Implement Stripe webhook signature verification
 in src/webhooks/stripeWebhook.js following the
 pattern in systemPatterns.md 'Webhook Security'"

❌ Vague:
"Fix the bug"

✅ Specific:
"Debug payment timeout issue when amount > $1000,
 add logging to PaymentService.processPayment(),
 check Stripe dashboard for failed requests"

❌ Vague:
"Write tests"

✅ Specific:
"Write integration tests for PaymentService covering:
 - Successful payment flow
 - Declined card handling
 - Network timeout handling
 - Invalid amount validation"
```

---

**File Update Decision Pattern:**

Determine which files need updates:

**Update Decision Matrix:**
```
Did you make a technical decision?
  → Yes: Update activeContext.md "Recent Decisions"
  → If architectural: Also update systemPatterns.md

Did you complete a task or milestone?
  → Yes: Update progress.md "Completed This Session"
  → Mark task [x] completed
  → Add completion details

Did you establish or discover a pattern?
  → Yes: Update systemPatterns.md with pattern
  → Also add reference in activeContext.md

Did you add/change tools or setup?
  → Yes: Update techContext.md
  → Document installation and configuration

Did user needs or metrics change?
  → Yes: Update productContext.md
  → Rare but important when happens

Did requirements or scope change?
  → Yes: Update projectbrief.md
  → Very rare, requires user confirmation

What are you working on next?
  → Always: Update activeContext.md "Immediate Next Steps"
  → Be specific and actionable
```

**Update Frequency:**
```
Every session:
✓ activeContext.md (always)
✓ progress.md (always)

When relevant:
✓ systemPatterns.md (if patterns added/changed)
✓ techContext.md (if tools added/changed)

Occasionally:
✓ productContext.md (if user needs clarified)

Rarely:
✓ projectbrief.md (if scope changed)
```

---

**Quality Validation Pattern:**

Ensure update quality:

**Context Reset Test:**
```
Ask: "If I reset right now, could I continue effectively?"

Test by checking:
□ Can I understand what was done?
  → Check progress.md completions

□ Can I understand current decisions?
  → Check activeContext.md recent decisions with rationale

□ Do I know specific next steps?
  → Check activeContext.md immediate next steps

□ Can I understand why decisions were made?
  → Check rationale is documented

□ Can I find code that was changed?
  → Check file locations are documented

If "No" to any: Update the relevant section
```

**Completeness Check:**
```
Review conversation for:

□ Every decision has rationale documented
□ Every pattern has example documented
□ Every completion has location documented
□ Every learning has takeaway documented
□ Next steps are specific and actionable
□ Blockers are documented with context
□ Questions are documented with investigation approach

If unchecked: Add missing documentation
```

**Accuracy Check:**
```
Verify documentation matches reality:

□ Completed tasks are actually done
□ Next steps are actually the priority
□ Blockers are current (not resolved)
□ Decisions reflect final choice (not outdated)
□ File locations are correct
□ Code examples compile/run

If inaccurate: Correct the documentation
```

**Actionability Check:**
```
Test each next step:

❌ "Work on payments" - Too vague
✅ "Implement webhook signature verification
    in src/webhooks/stripeWebhook.js" - Specific

❌ "Fix bugs" - Not actionable
✅ "Debug timeout in PaymentService.processPayment()
    when amount > $1000" - Specific

❌ "Improve code" - Not measurable
✅ "Refactor PaymentService to extract validation
    logic into PaymentValidator class" - Clear
```

---

**Update Workflow Pattern:**

Systematic update process:

**Step-by-Step Update:**
```
1. Review conversation (5 min)
   - Scan for decisions
   - Identify patterns
   - List completions
   - Note learnings
   - Determine next steps

2. Update activeContext.md (3 min)
   - Add recent decisions with rationale
   - Update current focus
   - Update immediate next steps (specific)
   - Document blockers or open questions
   - Add recent learnings

3. Update progress.md (2 min)
   - Mark completed tasks [x] with date
   - Update status ([ ] → [/] → [x])
   - Add completion details
   - Document new issues
   - Adjust timeline if needed

4. Update systemPatterns.md (if needed, 5 min)
   - Add new patterns with examples
   - Update architectural decisions
   - Add code structure patterns
   - Document integration patterns

5. Update techContext.md (if needed, 3 min)
   - Add new dependencies
   - Update setup instructions
   - Add code conventions
   - Document debugging techniques

6. Update other files (if needed, 2-5 min)
   - productContext.md for user needs
   - projectbrief.md for scope (rare)

7. Validate update (2 min)
   - Run context reset test
   - Check completeness
   - Verify accuracy
   - Ensure actionability

Total time: 10-20 minutes depending on session complexity
Benefit: Full context preserved for next session
```

---

**Update Automation Triggers:**

Know when to update:

**Automatic Triggers:**
```
Trigger: Task completed
Action: Update progress.md, mark [x] completed

Trigger: Decision made
Action: Update activeContext.md with decision and rationale

Trigger: Pattern discovered
Action: Update systemPatterns.md with pattern and example

Trigger: Tool added
Action: Update techContext.md with installation and usage

Trigger: Work session ending
Action: Update activeContext.md next steps and current state

Trigger: Blocker encountered
Action: Update activeContext.md current blockers

Trigger: Learning gained
Action: Update activeContext.md or relevant file with insight
```

**User-Triggered Update:**
```
User says: "update memory bank"

Process:
1. Scan conversation history
2. Extract all decisions, patterns, completions, learnings
3. Update ALL relevant files
4. Validate completeness and accuracy
5. Confirm update with summary

Expected output:
"Updated memory bank with:
- 3 decisions documented
- 2 patterns added
- 5 tasks marked completed
- 2 learnings captured
- Next steps updated
All files current and context reset ready."
```

</output-format>

<instructions>
CRITICAL: Memory bank updates preserve knowledge across context resets.

NEVER update memory bank by:
- Writing vague, abstract summaries (not actionable)
- Documenting decisions without rationale (context lost)
- Omitting completed work (progress unclear)
- Forgetting to update next steps (direction lost)
- Copying generic templates without specifics (useless)
- Updating randomly without reviewing conversation (incomplete)

DO NOT:
- Write "worked on payments" without specifics
- Document decisions without explaining why
- Skip documenting patterns discovered
- Forget to mark completed tasks
- Leave next steps vague or generic
- Update only one file when multiple need updates

ALWAYS:
- Review entire conversation for extractable knowledge
- Document decisions with rationale and alternatives
- Include concrete examples for patterns
- Mark completed work with dates and locations
- Write specific, actionable next steps
- Capture learnings with actionable takeaways
- Update ALL relevant files, not just one
- Validate with context reset test
- Be specific about file locations
- Include timestamps for completions

REPEAT: Update memory bank after every significant work session. Review conversation systematically. Document decisions with rationale. Include concrete examples. Write specific next steps. Validate with context reset test.
</instructions>

<examples>
✅ GOOD Memory Bank Update (comprehensive, specific, actionable):

**Pattern demonstrates:**
- Systematic conversation review
- Decisions with full rationale
- Patterns with concrete examples
- Specific next steps
- Multiple files updated

**Example update:**
```
Session: Implemented payment processing (2 hours)

Conversation review extracted:

Decisions made:
1. Use Stripe for payment processing
2. Store encrypted payment tokens
3. Retry failed payments 3 times

Patterns established:
1. Service layer error handling pattern
2. Webhook signature verification pattern

Work completed:
1. PaymentService implementation
2. Error handling standardization
3. Unit tests for payment flows

Learnings:
1. Stripe requires signature verification
2. Test mode rate limits require delays

Current state:
- Payment processing complete
- Next: Implement webhooks

---

Updated files:

=== activeContext.md ===

## Current Focus
Payment integration complete, moving to webhook implementation

## Immediate Next Steps
1. Implement Stripe webhook signature verification in
   src/webhooks/stripeWebhook.js using pattern from
   systemPatterns.md "Webhook Security"

2. Add webhook event handlers for:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - charge.refunded

3. Write integration tests for webhook handlers with
   Stripe fixture data

## Recent Decisions

**Decision:** Use Stripe for payment processing
**Rationale:**
- Market leader with excellent API
- Strong security and compliance
- Team already familiar with Stripe
- Test mode excellent for development
**Alternatives:**
- PayPal: Less developer-friendly API
- Square: Limited international support
**Trade-offs:** Higher fees but better DX
**Date:** 2026-01-17

**Decision:** Store encrypted payment tokens in database
**Rationale:**
- Required for refunds and recurring payments
- Stripe tokens are reusable
- Encryption protects sensitive data
**Security:** AES-256, keys in environment variables
**Date:** 2026-01-17
**Reference:** systemPatterns.md "Data Security"

**Decision:** Retry failed payments 3 times with exponential backoff
**Rationale:**
- Stripe recommends for transient errors
- Exponential backoff prevents overwhelming gateway
**Pattern:** 1s, 2s, 4s delays
**Date:** 2026-01-17

## Key Learnings

**Learning:** Stripe webhooks require signature verification
**Context:** Initially accepting POSTs without verification
**Insight:** Without verification, fake confirmations possible
**Takeaway:** Always verify webhook signatures
**Prevention:** Security checklist for all integrations
**Date:** 2026-01-17

**Learning:** Stripe test mode has rate limits
**Context:** Integration tests failing with rate limit errors
**Insight:** Test mode: 100 req/minute, production: 5000 req/minute
**Takeaway:** Use fixture data instead of live API calls
**Date:** 2026-01-17

## Current Blockers
None

## Open Questions
- Should we support multiple payment methods?
  Investigation: Check product requirements, user feedback

=== progress.md ===

## Completed This Session (2026-01-17)

- [x] Implemented PaymentService (2026-01-17)
  - Details: Core payment processing with Stripe integration
  - Features: Charge, refund, retry logic
  - Validation: Unit tests pass, manual test successful
  - Location: src/services/paymentService.js
  - Related: Need webhook handling next

- [x] Standardized error handling (2026-01-17)
  - Details: All services use consistent error pattern
  - Pattern: Try-catch, log, throw custom error
  - Validation: All services updated, tests pass
  - Location: src/services/*.js, src/errors/ServiceError.js
  - Related: Documented in techContext.md

- [x] Added payment unit tests (2026-01-17)
  - Details: 12 tests covering happy path, errors, edge cases
  - Coverage: 95% of PaymentService
  - Location: tests/services/paymentService.test.js

## Status Changes

Payment Integration: [ ] → [x] Completed (2026-01-17)
Error Standardization: [/] → [x] Completed (2026-01-17)
Webhook Handling: [ ] → [/] In Progress
Testing Suite: [ ] → Not started

## In Progress

- [/] Webhook implementation
  Started: 2026-01-17
  Next: Signature verification
  Blocker: None

## Remaining

- [ ] Webhook testing
- [ ] Payment UI integration
- [ ] Production deployment

=== systemPatterns.md ===

## Service Layer Error Handling

**Pattern:** Consistent error handling across all service methods

**Structure:**
```
try {
  // Service logic
  const result = await operation();
  logger.info('Operation succeeded', { context });
  return result;
} catch (error) {
  logger.error('Operation failed', { context, error });
  throw new ServiceError('User-friendly message', error);
}
```

**Example from PaymentService:**
```javascript
async processPayment(orderId, amount) {
  try {
    this.validateAmount(amount);
    const result = await this.stripe.charge(amount);
    logger.info('Payment processed', {
      orderId,
      transactionId: result.id
    });
    return result;
  } catch (error) {
    logger.error('Payment failed', {
      orderId,
      amount,
      error: error.message
    });
    throw new PaymentError('Payment processing failed', error);
  }
}
```

**When to Use:**
- All service layer methods
- Any operation that can fail
- External API calls

**Benefits:**
- Consistent error format
- Proper logging with context
- User-friendly messages
- Error chain preserved

**Location:** src/services/*.js
**Date Added:** 2026-01-17

## Webhook Security Pattern

**Pattern:** Verify webhook signatures before processing

**Structure:**
```
1. Extract signature from request header
2. Verify signature using provider's library
3. If invalid: Log, return 400, don't process
4. If valid: Process webhook event
```

**Example for Stripe:**
```javascript
const signature = req.headers['stripe-signature'];
let event;

try {
  event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    webhookSecret
  );
} catch (err) {
  logger.error('Webhook signature verification failed', { err });
  return res.status(400).send('Invalid signature');
}

// Process verified event
await handleWebhookEvent(event);
res.status(200).send('Webhook received');
```

**Why Important:**
- Prevents fake webhook attacks
- Ensures events from legitimate source
- Security best practice

**Reference:** Stripe webhook documentation
**Date Added:** 2026-01-17

=== techContext.md ===

## Dependencies

### Stripe
**Version:** 12.0.0
**Purpose:** Payment processing
**Installation:** `npm install stripe`
**Configuration:**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

**Environment Variables:**
- `STRIPE_SECRET_KEY`: API secret key (live or test)
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret

**Test Mode:**
- Use keys starting with `sk_test_`
- Rate limit: 100 requests/minute
- Use fixture data for tests to avoid rate limits

**Documentation:** https://stripe.com/docs/api

**Added:** 2026-01-17

## Code Conventions

### Error Handling
**Convention:** All service methods use try-catch pattern

**Pattern:**
```javascript
try {
  // operation
} catch (error) {
  logger.error('Message', { context, error });
  throw new CustomError('User message', error);
}
```

**Custom Error Types:**
- ServiceError: Base service error
- PaymentError: Payment-specific errors
- ValidationError: Input validation errors

**Location:** src/errors/
**Established:** 2026-01-17

---

Result: Comprehensive update capturing all knowledge
Time spent: 15 minutes
Benefit: Next session has full context to continue
```

**Why this works:**
- Reviewed entire conversation systematically
- Documented all decisions with rationale
- Included concrete code examples
- Marked completed work with specifics
- Captured learnings with takeaways
- Updated multiple files appropriately
- Specific next steps provided
- Context reset ready

---

❌ BAD Memory Bank Update (vague, incomplete, not actionable):

**Anti-pattern characteristics:**
- Generic summaries
- No rationale for decisions
- No concrete examples
- Vague next steps
- Only one file updated

**Bad update:**
```
Session: Worked on payments

Updated activeContext.md:

## Current Focus
Working on payment stuff

## Next Steps
- Continue with payments
- Fix bugs
- Write tests

## Recent Decisions
- Used Stripe (it's good)
- Added error handling (important)

(No other files updated)
```

**Why this fails:**
- "Payment stuff" - not specific
- "Continue with payments" - what specifically?
- "Fix bugs" - which bugs?
- "Write tests" - which tests?
- "Used Stripe (it's good)" - no rationale
- "Added error handling (important)" - no pattern
- No progress.md update (what was completed?)
- No systemPatterns.md update (patterns not documented)
- No learning captured
- No concrete examples
- Can't continue work from this

**Context reset result:**
```
Next session reads activeContext.md:

Questions:
- What payment work was done?
- What specifically should I work on?
- Why was Stripe chosen?
- What error handling pattern?
- What tests are needed?
- Where is the code?

Must:
- Review git commits to see what happened
- Ask team what's current status
- Rediscover why decisions made
- Figure out next steps from code

Time wasted: 2-3 hours
Could have been prevented: 15 minutes updating properly
```

---

✅ GOOD Decision Documentation (complete context):

**Pattern demonstrates:**
- Clear decision statement
- Full rationale
- Alternatives considered
- Trade-offs acknowledged
- Date and reference

**Example:**
```
Decision: Use PostgreSQL as primary database

Rationale:
- ACID transactions essential for payment processing
- Team has 3 years PostgreSQL experience
- Excellent JSON support for flexible data
- Strong performance for our data access patterns
- Proven reliability at our expected scale

Alternatives Considered:
- MongoDB:
  Rejected: No ACID transactions
  Impact: Can't guarantee payment data integrity

- MySQL:
  Rejected: Less advanced features than PostgreSQL
  Impact: Would need workarounds for JSON queries

- SQLite:
  Rejected: Not production-scale
  Impact: Can't handle our user load

Trade-offs:
- Gained: Data integrity, reliability, team expertise
- Cost: More complex setup than simpler databases
- Cost: Vertical scaling limits (can be worked around)

Migration Impact:
- Setup time: 2 days for production environment
- Learning curve: None (team already knows it)
- Hosting cost: ~$50/month for our scale

Date: 2026-01-17
Context: Selecting database for payment system build
Reference: systemPatterns.md "Data Architecture"
Implementation: src/database/connection.js
```

**Why this works:**
- Decision is clear
- Rationale explains why
- Each alternative explained with rejection reason
- Trade-offs are honest (gains and costs)
- Date provides timeline context
- Reference shows where to learn more
- Implementation location provided
- Next person has full context

---

❌ BAD Decision Documentation (no context):

**Anti-pattern characteristics:**
- Just states decision
- No rationale
- No alternatives
- No trade-offs
- No reference

**Bad example:**
```
Decision: Use PostgreSQL

(No rationale)
(No alternatives)
(No trade-offs)
(No date)
(No reference)
```

**Why this fails:**
- Why PostgreSQL? (Unknown)
- What else was considered? (Unknown)
- What did we give up? (Unknown)
- When was this decided? (Unknown)
- Where to learn more? (Unknown)
- If requirements change, can't re-evaluate
- If someone questions decision, can't explain
- Context completely lost
</examples>
