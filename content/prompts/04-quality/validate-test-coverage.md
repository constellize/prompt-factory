---
# === Identity ===
id: validate-test-coverage
name: Validate test coverage meets thresholds: 80% branch, 100% critical logic and error paths
version: v1

# === Classification ===
chapter: 4
category: quality
subcategory: gate-1
tags:
  - quality
  - testing
  - coverage
  - validation
  - gate-1

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Validate test coverage meets thresholds: 80% branch, 100% critical logic and error paths.
    After writing all tests, validate coverage (Gate 1: Test Integrity).
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
    description: The specific component to validate test coverage for
    example: "RateLimitMiddleware"
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
    path: /prompts/validate-test-coverage
  marketplace:
    plugin: constellize-quality

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Validate test coverage for {{component_name}} in {{system_name}} to ensure comprehensive testing meets Gate 1: Test Integrity requirements.

Test coverage validation ensures your tests actually verify behavior. Minimum thresholds: 80% branch coverage overall, 100% coverage of CRITICAL business logic, 100% of error paths. Coverage is necessary but NOT sufficient—you must also validate test quality.

Follow this process:

1. **Run coverage analysis:**
   - Generate branch coverage report (NOT just line coverage)
   - Identify uncovered branches
   - Locate untested error paths

2. **Validate coverage thresholds:**
   - Overall: ≥ 80% branch coverage (REQUIRED)
   - Critical business logic: 100% branch coverage (REQUIRED)
   - Error paths: 100% coverage (REQUIRED)
   - Constellation integration points: 100% coverage (REQUIRED)

3. **Identify coverage gaps:**
   - Find uncovered branches
   - Locate untested error conditions
   - Detect missing edge case tests

4. **Validate test quality:**
   - Tests validate behavior (not just execute code)
   - Tests use realistic data
   - Tests are independent and deterministic
   - Tests serve as documentation

5. **Generate coverage report:**
   - Document coverage percentages
   - List any justified exclusions
   - Identify areas needing more tests
</task>

<context>
Component to validate:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from:
- Test files for {{component_name}}
- Code generation plan from `construction/design/code-generation-plan-*.md`
- Gap analysis from `construction/requirements/gap-analysis.md`

And outputs coverage report to `construction/quality/coverage-report-{{component_name}}.md`
</context>

<thinking>
Before validating coverage, analyze:
1. What is the minimum coverage threshold? (80% branch overall, 100% critical)
2. What code is CRITICAL business logic? (requires 100% coverage)
3. What are ALL error paths? (must be 100% covered)
4. What integration points exist? (must be 100% covered)
5. Are there justified exclusions? (generated code, third-party)
</thinking>

<output-format>
Generate coverage report to `construction/quality/coverage-report-{{component_name}}.md`:

# Test Coverage Report: {{component_name}}

## Coverage Summary

**Overall Branch Coverage:** [X]% (Target: ≥ 80%)
**Critical Logic Coverage:** [X]% (Target: 100%)
**Error Path Coverage:** [X]% (Target: 100%)
**Integration Point Coverage:** [X]% (Target: 100%)

**Status:** ✅ PASS / ❌ FAIL

---

## Coverage by Category

### Critical Business Logic (MUST be 100%)

**File:** `[path]`
**Function:** `[critical-function-name]`
**Coverage:** [X]%
**Status:** ✅ / ❌

**Uncovered Branches:**
- Line [X]: [Description of uncovered branch]
- Line [Y]: [Description]

**Action Required:**
[If <100%, list tests needed to cover missing branches]

---

### Error Paths (MUST be 100%)

**Error Condition:** [Specific error scenario]
**Coverage:** [X]%
**Status:** ✅ / ❌

**Uncovered Error Paths:**
- [Error path not tested]
- [Error path not tested]

**Action Required:**
[List tests needed]

---

### Constellation Integration Points (MUST be 100%)

**Star:** [Star name from constellation-map.md]
**Integration Point:** [Specific integration]
**Coverage:** [X]%
**Status:** ✅ / ❌

**Uncovered Integration Paths:**
- [Integration scenario not tested]

---

## Coverage Gaps

### Uncovered Branches
1. **File:** `[path]` **Line:** [X]
   - **Branch:** [Description]
   - **Why Uncovered:** [Reason]
   - **Test Needed:** [What test would cover this]

### Untested Error Conditions
1. **Error:** [Specific error condition]
   - **Location:** [File:Line]
   - **Test Needed:** [What test would cover this]

---

## Justified Exclusions

### Excluded from Coverage
1. **Code:** [Description]
   - **Reason:** [Why excluded - e.g., generated code, third-party]
   - **Justification:** [Detailed justification]

---

## Test Quality Assessment

### Test Quality Metrics
- [ ] Tests validate behavior (not just execute code)
- [ ] Tests use realistic data from constellation
- [ ] Tests are independent (no order dependencies)
- [ ] Tests are deterministic (no flaky tests)
- [ ] Tests serve as documentation (readable names)
- [ ] Critical logic has 100% branch coverage
- [ ] Error paths have 100% coverage

### Areas for Improvement
[List any test quality issues found]

---

## Gate 1: Test Integrity Status

### Requirements
- [ ] ≥ 80% overall branch coverage
- [ ] 100% critical business logic coverage
- [ ] 100% error path coverage
- [ ] 100% constellation integration coverage
- [ ] All tests pass
- [ ] No flaky tests
- [ ] Tests are self-documenting

**Gate Status:** ✅ PASS / ❌ FAIL

**Blockers:** [List any failing requirements]
</output-format>

<instructions>
CRITICAL: Coverage thresholds are MINIMUM requirements. 80% branch coverage overall, 100% for CRITICAL logic and error paths.

NEVER validate coverage that:
- Uses line coverage instead of branch coverage (branch REQUIRED)
- Skips critical business logic (100% REQUIRED)
- Skips error paths (100% REQUIRED)
- Allows flaky tests (tests MUST be deterministic)
- Counts trivial tests that don't validate behavior
- Excludes code without justification

DO NOT:
- Accept <80% branch coverage (FAIL the gate)
- Accept <100% critical logic coverage (FAIL the gate)
- Accept <100% error path coverage (FAIL the gate)
- Count tests that just execute code without assertions
- Skip test quality assessment (coverage alone is not enough)
- Allow coverage to drop below thresholds

ALWAYS:
- Use branch coverage (NOT line coverage)
- Require 100% coverage of CRITICAL business logic
- Require 100% coverage of error paths
- Require 100% coverage of constellation integration points
- Identify ALL uncovered branches
- Document justified exclusions with reasons
- Assess test quality (not just coverage percentage)
- FAIL the gate if thresholds not met

REPEAT: 80% branch coverage overall, 100% CRITICAL logic, 100% error paths. Coverage is NECESSARY but NOT SUFFICIENT—validate test quality too.
</instructions>

<examples>
✅ GOOD coverage report (detailed, actionable):

```markdown
# Test Coverage Report: RateLimitMiddleware

## Coverage Summary

**Overall Branch Coverage:** 92% ✅ (Target: ≥ 80%)
**Critical Logic Coverage:** 100% ✅ (Target: 100%)
**Error Path Coverage:** 100% ✅ (Target: 100%)
**Integration Point Coverage:** 100% ✅ (Target: 100%)

**Status:** ✅ PASS

---

## Coverage by Category

### Critical Business Logic (MUST be 100%)

**File:** `src/middleware/rateLimitMiddleware.ts`
**Function:** `makeQueueDecision`
**Coverage:** 100% ✅

**Branches Covered:**
- ✅ Line 45: count < 100 (allow request)
- ✅ Line 47: count >= 100 (queue request)
- ✅ Line 50: Redis error (fail open)
- ✅ Line 53: count > 100 (queue request)

**All 4 branches covered by tests:**
- `allows when count < 100 (under limit branch)`
- `queues when count >= 100 (at/over limit branch)`
- `queues when count > 100 (over limit branch)`
- `allows on Redis error (fail-open branch)`

---

### Error Paths (MUST be 100%)

**Error Condition:** Redis connection failure
**Coverage:** 100% ✅
**Test:** `handles Redis connection failure per constellation failure mode`

**Error Condition:** Invalid request body (null)
**Coverage:** 100% ✅
**Test:** `validates request has required amount field`

**Error Condition:** Queue full (>1000 requests)
**Coverage:** 100% ✅
**Test:** `handles maximum queue depth (1000 requests)`

**All error paths covered.**

---

### Constellation Integration Points (MUST be 100%)

**Star:** Redis Cache
**Integration Point:** ZADD/ZCOUNT operations
**Coverage:** 100% ✅
**Tests:**
- `tracks requests using ZADD per Redis Cache star contract`
- `respects Redis connection pool limit from constellation`

**Star:** API Gateway
**Integration Point:** Express middleware chain
**Coverage:** 100% ✅
**Test:** `integrates with Express middleware chain per Gateway star`

**Star:** Stripe API
**Integration Point:** Rate limit awareness
**Coverage:** 100% ✅
**Test:** `enforces 100 req/sec limit documented in Stripe API star`

**All integration points covered.**

---

## Coverage Gaps

### Uncovered Branches
1. **File:** `src/middleware/rateLimitMiddleware.ts` **Line:** 78
   - **Branch:** `if (queueDepth > 500) { logWarning() }`
   - **Why Uncovered:** Warning branch for high queue depth (not critical)
   - **Test Needed:** Add test: `it('logs warning when queue depth exceeds 500')`
   - **Priority:** Low (warning only, not critical path)

2. **File:** `src/middleware/rateLimitMiddleware.ts` **Line:** 92
   - **Branch:** `if (process.env.DEBUG) { logDebug() }`
   - **Why Uncovered:** Debug logging (excluded from coverage requirements)
   - **Test Needed:** None (excluded)
   - **Priority:** N/A (justified exclusion)

**Total uncovered:** 2 branches (8%)
- 1 non-critical warning (acceptable)
- 1 debug logging (excluded)

---

## Justified Exclusions

### Excluded from Coverage
1. **Code:** Debug logging statements
   - **Reason:** Development-only code, not executed in production
   - **Justification:** Debug code behind `process.env.DEBUG` flag. Does not affect production behavior. Coverage of debug logging provides minimal value.
   - **Lines:** 92-95

---

## Test Quality Assessment

### Test Quality Metrics
- ✅ Tests validate behavior (uses specific assertions, not toBeTruthy)
- ✅ Tests use realistic data from constellation (Redis keys, timestamps, amounts)
- ✅ Tests are independent (each test has own setup)
- ✅ Tests are deterministic (no flaky tests, no random data)
- ✅ Tests serve as documentation (descriptive names with Given/When/Then)
- ✅ Critical logic has 100% branch coverage
- ✅ Error paths have 100% coverage

### Test Quality Score: 10/10 ✅

**Strengths:**
- Excellent use of AAA pattern
- Realistic test data shaped by constellation
- All tests have descriptive names
- Good coverage of edge cases (boundary conditions)
- No flaky tests detected

**No quality issues found.**

---

## Gate 1: Test Integrity Status

### Requirements
- ✅ ≥ 80% overall branch coverage (achieved: 92%)
- ✅ 100% critical business logic coverage (achieved: 100%)
- ✅ 100% error path coverage (achieved: 100%)
- ✅ 100% constellation integration coverage (achieved: 100%)
- ✅ All tests pass (212/212 passing)
- ✅ No flaky tests (all deterministic)
- ✅ Tests are self-documenting (descriptive names, AAA pattern)

**Gate Status:** ✅ PASS

**No blockers. Component meets all Test Integrity requirements.**
```

**Why this is GOOD:**
- Detailed breakdown by category (critical, errors, integration)
- Lists EXACT branches covered and tests that cover them
- Documents uncovered branches with justification
- Includes test quality assessment (not just coverage %)
- Clear PASS/FAIL status
- Actionable (lists what tests needed for gaps)
- Justified exclusions documented

---

❌ BAD coverage report (vague, not actionable):

```markdown
# Coverage Report

Coverage: 85%

Status: Pass

Some lines not covered. Add more tests.
```

**Why this is BAD:**
- No breakdown by category (critical vs non-critical)
- Line coverage not branch coverage
- Doesn't identify WHAT is uncovered
- No test quality assessment
- Not actionable (doesn't say what tests needed)
- Missing critical logic validation
- Missing error path validation
- No constellation integration validation

---

✅ GOOD coverage failure report (clear blockers):

```markdown
# Test Coverage Report: PaymentProcessor

## Coverage Summary

**Overall Branch Coverage:** 72% ❌ (Target: ≥ 80%)
**Critical Logic Coverage:** 85% ❌ (Target: 100%)
**Error Path Coverage:** 60% ❌ (Target: 100%)
**Integration Point Coverage:** 100% ✅ (Target: 100%)

**Status:** ❌ FAIL

---

## Coverage by Category

### Critical Business Logic (MUST be 100%)

**File:** `src/services/paymentProcessor.ts`
**Function:** `processPayment` (CRITICAL)
**Coverage:** 85% ❌
**Status:** ❌ FAIL - BLOCKER

**Uncovered Branches:**
1. Line 156: `if (amount > 10000) { requireManagerApproval() }`
   - **CRITICAL:** Large amount approval path NOT TESTED
   - **Risk:** High-value payments might bypass approval
   - **Test Needed:** `it('requires manager approval for amounts over $10000')`
   - **Priority:** CRITICAL - MUST FIX

2. Line 178: `if (fraudScore > 0.8) { blockPayment() }`
   - **CRITICAL:** Fraud detection path NOT TESTED
   - **Risk:** Fraudulent payments might not be blocked
   - **Test Needed:** `it('blocks payments with high fraud scores')`
   - **Priority:** CRITICAL - MUST FIX

**Action Required:** ADD TESTS for both critical branches before passing gate.

---

### Error Paths (MUST be 100%)

**Error Condition:** Payment gateway timeout
**Coverage:** 0% ❌
**Status:** ❌ FAIL - BLOCKER

**Uncovered Error Paths:**
- Payment gateway network timeout (30s)
- Payment gateway 503 service unavailable
- Payment gateway invalid response format

**Test Needed:**
- `it('handles payment gateway timeout with retry')`
- `it('handles 503 errors from payment gateway')`
- `it('handles invalid response from payment gateway')`

**Action Required:** ADD ERROR PATH TESTS before passing gate.

---

## Gate 1: Test Integrity Status

### Requirements
- ❌ ≥ 80% overall branch coverage (achieved: 72%) - **BLOCKER**
- ❌ 100% critical business logic coverage (achieved: 85%) - **BLOCKER**
- ❌ 100% error path coverage (achieved: 60%) - **BLOCKER**
- ✅ 100% constellation integration coverage (achieved: 100%)
- ✅ All tests pass (147/147 passing)
- ✅ No flaky tests
- ✅ Tests are self-documenting

**Gate Status:** ❌ FAIL

**BLOCKERS:**
1. CRITICAL: Large payment approval path untested (Line 156)
2. CRITICAL: Fraud detection path untested (Line 178)
3. CRITICAL: Payment gateway error paths untested
4. Overall coverage below 80% threshold

**Required Actions:**
1. Add test for manager approval on large payments
2. Add test for fraud score blocking
3. Add tests for all payment gateway error scenarios
4. Re-run coverage and validate ≥80% overall

**DO NOT proceed to next gate until all blockers resolved.**
```

**Why this is GOOD:**
- Clear FAIL status
- Lists EXACT blockers (critical branches untested)
- Explains risk of missing coverage
- Lists EXACTLY what tests needed
- Prioritizes critical gaps (manager approval, fraud detection)
- Actionable (developer knows what to fix)
- Emphasizes CRITICAL nature of missing tests

---

✅ GOOD critical logic identification:

```markdown
### Critical Business Logic Identification

**What qualifies as CRITICAL:**
1. Money calculations (MUST be 100% covered)
2. Authorization decisions (MUST be 100% covered)
3. Fraud detection logic (MUST be 100% covered)
4. Rate limiting decisions (MUST be 100% covered)
5. Error handling that affects data integrity (MUST be 100% covered)

**Critical Functions in {{component_name}}:**

**Function:** `calculateTotalAmount`
- **Why Critical:** Determines money charged to customer
- **Coverage Required:** 100%
- **Coverage Achieved:** 100% ✅
- **Branches Covered:** All 6 branches (tax, discount, fees, rounding)

**Function:** `authorizePayment`
- **Why Critical:** Decides if payment allowed
- **Coverage Required:** 100%
- **Coverage Achieved:** 100% ✅
- **Branches Covered:** All 5 branches (amount limits, fraud check, balance check)

**All critical business logic has 100% coverage.**
```

**Why this is GOOD:**
- Clearly defines what is CRITICAL
- Lists all critical functions
- Justifies why each is critical
- Validates 100% coverage for each
- Lists exact branches covered
</examples>
