---
# === Identity ===
id: pre-merge-review
name: Enforce pre-merge quality gates to ensure code quality before main branch
version: v1

# === Classification ===
chapter: 4
category: ai-workflow
subcategory: review
tags:
  - quality
  - review
  - pre-merge
  - integration-tests
  - performance
  - contract-tests
  - documentation

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Enforce pre-merge quality gates to ensure code quality before main branch.
    Before code joins main branch, run comprehensive validation in CI (Gate 5: Review Process).
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
    description: The specific component to enforce pre-merge quality gates for
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
      **Pre-merge review** ensures code quality before joining the main branch. Integration tests verify that new code works correctly with existing system components, catching issues that unit tests miss. Performance tests detect significant regressions that could impact user experience or system capacity. Contract tests confirm that API boundaries remain stable and existing consumers won't break. Documentation must reflect any changes—if the code changed behavior, the docs should say so.
    preview: |
      "...run integration tests with real dependencies. Execute performance tests. Validate API contracts ensuring backward compatibility..."
  website:
    include: true
    path: /prompts/pre-merge-review
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Enforce pre-merge quality gates for {{component_name}} in {{system_name}} to ensure code quality before joining the main branch.

Before code joins the main branch, comprehensive validation takes place in the CI environment. Integration tests verify that new code works correctly with existing system components, catching issues that unit tests miss. Performance tests detect significant regressions that could impact user experience or system capacity. Contract tests confirm that API boundaries remain stable and existing consumers won't break. Documentation must reflect any changes—if the code changed behavior, the docs should say so.

Follow this process:

1. **Run integration tests:**
   - Test component interactions with real dependencies
   - Verify database transactions and rollbacks
   - Test external service integrations with test instances
   - Validate message queue and event handling
   - Ensure proper error propagation across components

2. **Execute performance tests:**
   - Measure response time for critical operations
   - Test throughput under expected load
   - Detect memory leaks and resource exhaustion
   - Compare against baseline performance metrics
   - Block merge if significant regressions detected

3. **Validate API contracts:**
   - Run consumer-driven contract tests
   - Verify backward compatibility with existing consumers
   - Test request/response schema conformance
   - Validate error response formats
   - Ensure breaking changes are documented and versioned

4. **Verify documentation completeness:**
   - Check that changed code has updated documentation
   - Verify API docs match implementation
   - Ensure README reflects new features or changes
   - Validate code comments explain non-obvious logic
   - Confirm breaking changes are documented in changelog
</task>

<context>
Component to enforce pre-merge gates:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates/updates:
- CI pipeline configuration (GitHub Actions, GitLab CI, etc.)
- `docs/quality-gates/pre-merge.md` (gate documentation)
- Integration test suites
- Performance test baselines
- Contract test definitions
- Documentation validation rules
</context>

<thinking>
Before enforcing pre-merge gates, analyze:
1. What integration tests are needed to verify component interactions?
2. What performance metrics matter for user experience?
3. What API contracts must remain stable for existing consumers?
4. What documentation needs to stay synchronized with code?
5. How long can CI take before blocking developer productivity?
</thinking>

<output-format>
Create pre-merge gate configuration following these patterns:

**Integration Test Gate Pattern:**

Test component interactions in realistic environment:

**Test Categories:**

1. **Component Integration:**
   - Service-to-service communication
   - Database integration (real test database)
   - Cache interaction patterns
   - File system operations

2. **External Service Integration:**
   - API clients with test/sandbox endpoints
   - Message queue producers and consumers
   - Email/notification service integration
   - Payment gateway test mode

3. **Transaction Testing:**
   - Multi-step workflows across components
   - Database transaction commit/rollback
   - Distributed transaction handling
   - Eventual consistency verification

**Test Execution Pattern:**
```
Integration test execution:
1. Setup: Start test environment
   - Spin up test database
   - Start required services
   - Load test data fixtures
   - Configure test credentials

2. Execute: Run integration tests
   - Test component interactions
   - Verify data persistence
   - Test error scenarios
   - Validate transaction boundaries

3. Teardown: Clean up environment
   - Stop services
   - Clear test data
   - Release resources
   - Archive logs if failures

Performance target: Complete in <5 minutes
```

**Test Organization Pattern:**
```
Integration tests by scope:
- Component tests: Verify single component with real dependencies
- Service tests: Verify service integration with other services
- Contract tests: Verify API contracts with consumers
- End-to-end flows: Critical user journeys (limited set)

Isolation levels:
- Database: Separate test database per test run
- Services: Test instances isolated from production
- State: Each test independent, no shared state
- Cleanup: Automatic teardown even on failure
```

**Failure Handling Pattern:**
```
Integration test failure:
1. Capture comprehensive diagnostics:
   - Test logs with timestamps
   - Database state before/after
   - Service request/response logs
   - Stack traces with context

2. Categorize failure:
   - Test environment issue (retry)
   - Real bug (block merge)
   - Flaky test (mark, investigate)

3. Action based on category:
   - Environment issue: Auto-retry once
   - Real bug: Block merge, report failure
   - Flaky test: Block merge, fix flakiness first
```

---

**Performance Test Gate Pattern:**

Detect performance regressions:

**Performance Metrics:**

1. **Response Time:**
   - P50 (median latency)
   - P95 (95th percentile)
   - P99 (99th percentile)
   - Maximum latency

2. **Throughput:**
   - Requests per second
   - Transactions per second
   - Messages processed per second
   - Data transfer rate

3. **Resource Usage:**
   - Memory consumption (peak and average)
   - CPU utilization
   - Database connection pool usage
   - Thread/goroutine count

**Baseline Pattern:**
```
Performance baseline establishment:
1. Run tests against known-good version
2. Collect metrics over multiple runs
3. Calculate statistical baseline:
   - Mean response time
   - Standard deviation
   - Acceptable variance threshold

4. Store baseline per environment:
   - Baseline varies by hardware
   - Update baseline when intentional changes made
   - Track baseline history for trends
```

**Regression Detection Pattern:**
```
Performance regression check:
1. Run performance tests on changed code
2. Compare against baseline:
   - Response time: >20% slower → fail
   - Throughput: >15% reduction → fail
   - Memory: >25% increase → fail

3. Statistical significance:
   - Run multiple iterations
   - Calculate confidence interval
   - Require statistically significant regression to fail

4. Report findings:
   - Metric name and change percentage
   - Baseline vs current values
   - Statistical confidence level
   - Affected operations/endpoints
```

**Performance Test Execution Pattern:**
```
Test execution workflow:
1. Preparation:
   - Load realistic test data
   - Warm up caches
   - Establish baseline connections

2. Load generation:
   - Ramp up to target load gradually
   - Maintain load for measurement period
   - Vary request patterns realistically

3. Measurement:
   - Collect metrics during steady state
   - Exclude warmup and rampdown periods
   - Monitor resource usage throughout

4. Analysis:
   - Calculate percentiles
   - Compare to baseline
   - Identify outliers
   - Generate performance report

Duration: 2-5 minutes per test scenario
```

**Load Profile Pattern:**
```
Realistic load simulation:
- User behavior: Mix of operations reflecting real usage
- Think time: Delays between operations
- Concurrency: Simultaneous users/requests
- Data variance: Different inputs, not repeated data

Example profile:
- 100 concurrent users
- 70% reads, 30% writes
- 2-5 second think time
- Realistic data distribution
```

---

**API Contract Test Gate Pattern:**

Ensure backward compatibility:

**Contract Testing Approach:**

1. **Consumer-Driven Contracts:**
   - Consumers define expectations
   - Provider validates against expectations
   - Both sides test independently
   - Contract stored in shared repository

2. **Schema Validation:**
   - Request schema must accept old clients
   - Response schema must match published spec
   - Error responses follow documented format
   - Field types cannot change incompatibly

3. **Breaking Change Detection:**
   - Required field added to request (breaks old clients)
   - Field removed from response (breaks consumers)
   - Field type changed (breaks parsing)
   - Endpoint removed (breaks callers)

**Contract Definition Pattern:**
```
Contract structure:
- Consumer name and version
- Provider name and version
- Interaction scenarios:
  - Request specification
  - Expected response specification
  - State requirements

Example contract:
```json
{
  "consumer": "OrderService",
  "provider": "PaymentService",
  "interactions": [
    {
      "description": "Process payment for order",
      "request": {
        "method": "POST",
        "path": "/payments",
        "body": {
          "orderId": "string",
          "amount": "number"
        }
      },
      "response": {
        "status": 200,
        "body": {
          "paymentId": "string",
          "status": "pending|completed|failed"
        }
      }
    }
  ]
}
```
```

**Contract Verification Pattern:**
```
Provider verification workflow:
1. Load all consumer contracts
2. For each interaction:
   - Set up required state
   - Execute provider with contract request
   - Validate response matches contract
   - Verify state changes

3. Report results:
   - Which contracts passed
   - Which failed (breaking changes detected)
   - Block merge if any contract violated

Consumer verification workflow:
1. Consumer tests against contract
2. Contract broker records interaction
3. Provider verifies can satisfy contract
4. Both sides can evolve independently
```

**Versioning Strategy Pattern:**
```
API versioning for changes:
- Backward compatible: Can deploy without version bump
  - Adding optional fields
  - Adding new endpoints
  - Making required fields optional

- Breaking changes: Require new version
  - Removing fields or endpoints
  - Changing field types
  - Making optional fields required
  - Changing URL structure

Version negotiation:
- URL versioning: /v1/resource, /v2/resource
- Header versioning: Accept: application/vnd.api+json;version=2
- Support N-1 versions for transition period
```

---

**Documentation Validation Gate Pattern:**

Ensure docs stay synchronized with code:

**Documentation Checks:**

1. **API Documentation:**
   - OpenAPI/Swagger spec matches implementation
   - All endpoints documented
   - Request/response examples accurate
   - Error codes documented

2. **Code Documentation:**
   - Public interfaces have docstrings/comments
   - Complex logic explained
   - Assumptions and constraints noted
   - Links to design decisions

3. **User Documentation:**
   - README updated if behavior changed
   - Setup instructions accurate
   - Breaking changes in CHANGELOG
   - Migration guides for breaking changes

**Validation Pattern:**
```
Documentation validation workflow:
1. Detect changed code files
2. Check corresponding docs:
   - API endpoint changed → OpenAPI spec updated?
   - Public interface changed → docstring updated?
   - Behavior changed → README updated?
   - Breaking change → CHANGELOG entry added?

3. For API changes:
   - Generate spec from code (if supported)
   - Compare to committed spec
   - Flag differences as failures

4. For README/CHANGELOG:
   - Check if modified in same PR
   - If significant code change + no doc change → fail
   - Require developer confirmation if intentional
```

**API Spec Validation Pattern:**
```
OpenAPI spec validation:
1. Extract spec from code (annotations, introspection)
2. Compare to committed spec file:
   - New endpoints: Must be documented
   - Changed schemas: Must be updated
   - Removed endpoints: Must be deprecated first

3. Schema testing:
   - Request examples validate against schema
   - Response examples validate against schema
   - Error examples validate against schema

4. Breaking change detection:
   - Required fields added
   - Response fields removed
   - Types changed
   - URL patterns changed
```

**Documentation Quality Pattern:**
```
Quality checks:
- Examples are runnable (not pseudocode)
- Links are valid (not broken)
- Code snippets are current (not outdated)
- Terminology consistent
- Grammar and spelling checked

Automated validation:
- Link checker: Verify external links return 200
- Code example tester: Run documented examples
- Spell checker: Catch typos
- Consistency checker: Same terms used same way
```

---

**Pre-Merge CI Pipeline Pattern:**

Orchestrate all gates in CI environment:

**Pipeline Structure:**
```
Pre-merge pipeline:

Stage 1: Fast checks (parallel) - 2 minutes
├─ Unit tests
├─ Static analysis
└─ Security scan (quick)

Stage 2: Integration tests - 5 minutes
├─ Component integration tests
├─ Database integration tests
└─ External service integration tests

Stage 3: Quality gates (parallel) - 5 minutes
├─ Performance tests
├─ Contract tests
└─ Documentation validation

Stage 4: Security deep scan - 3 minutes
└─ Full security analysis

Total: ~15 minutes
Fail fast: Stop on first stage failure
```

**Parallel Execution Pattern:**
```
Optimize for speed:
- Run independent checks in parallel
- Fail fast on critical issues
- Cache dependencies between runs
- Reuse test environments when possible

Resource allocation:
- Fast checks: Lightweight runners
- Integration tests: Full environment
- Performance tests: Consistent hardware for baselines
```

**Result Reporting Pattern:**
```
CI feedback:
1. Status: Pass/Fail with summary
2. Details per gate:
   - What was tested
   - Pass/fail status
   - Metrics (time, coverage, performance)
   - Logs/artifacts for failures

3. Merge decision:
   - All gates pass: Approve merge
   - Any critical failure: Block merge
   - Optional warnings: Allow but notify

4. Developer notification:
   - Failed gate name
   - Error summary
   - Link to full logs
   - Suggested remediation
```

---

**Gate Bypass and Exception Pattern:**

Handle legitimate exceptions:

**Bypass Types:**

1. **Emergency Hotfix:**
   - Critical production issue
   - Requires immediate deployment
   - Can bypass non-critical gates
   - Requires post-fix validation

2. **Infrastructure Issue:**
   - Test environment down
   - Flaky infrastructure
   - Can retry or temporarily skip
   - Must be resolved before next merge

3. **Known Issue:**
   - Pre-existing flaky test
   - Performance test environment variance
   - Can bypass specific test
   - Must have tracking issue

**Bypass Process Pattern:**
```
Exception handling:
1. Developer requests bypass:
   - Specify which gate to bypass
   - Provide justification
   - Link to issue tracking fix

2. Approval requirements:
   - Hotfix: Lead/manager approval
   - Infrastructure: Platform team acknowledgment
   - Known issue: Link to tracked issue

3. Audit trail:
   - Log all bypasses
   - Track bypass frequency
   - Review bypass patterns
   - Address systemic issues

4. Follow-up:
   - Create issue if not exists
   - Set resolution timeline
   - Verify fix before closing
```

**Temporary Skip Pattern:**
```
When gate can be temporarily skipped:
- Flaky test (already tracked): Skip until fixed
- Environment issue (transient): Retry, then skip
- Unrelated failure (test env): Skip with notification

Must NOT skip:
- Failing tests for changed code
- Performance regression in changed code
- Contract violation in changed code
- Security vulnerability in changed code
```

</output-format>

<instructions>
CRITICAL: Pre-merge quality gates ensure code quality before joining main branch.

NEVER implement pre-merge gates by:
- Running tests that should be in pre-commit (duplicate work)
- Making gates take >15 minutes (blocks team productivity)
- Requiring manual approval for automated checks (defeats automation)
- Blocking on flaky tests without fix process (team learns to ignore)
- Skipping documentation validation (docs drift from code)
- Running E2E tests that belong in pre-deployment (wrong stage)

DO NOT:
- Run unit tests again (covered in pre-commit)
- Deploy to production (that's pre-deployment)
- Require 100% contract coverage day one (build up over time)
- Block on performance tests without baseline (meaningless)
- Run tests without environment isolation (flaky results)
- Skip caching (wastes time on repeated runs)

ALWAYS:
- Run integration tests with real dependencies
- Measure performance against baseline
- Validate API contracts for backward compatibility
- Verify documentation reflects code changes
- Provide clear failure diagnostics
- Cache dependencies and artifacts
- Parallelize independent checks
- Fail fast on critical issues
- Allow bypass for legitimate exceptions with audit trail
- Keep total runtime under 15 minutes

REPEAT: Pre-merge gates verify integration, performance, contracts, and documentation. Keep under 15 minutes. Fail fast. Clear diagnostics. Allow legitimate bypass.
</instructions>

<examples>
✅ GOOD Pre-Merge Pipeline Pattern (fast, comprehensive, actionable):

**Pattern demonstrates:**
- Fast execution (~12 minutes)
- Parallel execution where possible
- Fail fast on critical issues
- Clear result reporting
- Legitimate bypass process

**Pipeline execution:**
```
Pre-merge pipeline for PR #234:

Stage 1: Quick validation (2m 15s) ✓
  ✓ Unit tests: 248 passed
  ✓ Static analysis: no issues
  ✓ Security quick scan: no critical issues

Stage 2: Integration tests (4m 30s) ✓
  ✓ Component integration: 45 passed
  ✓ Database integration: 23 passed
  ✓ External service integration: 12 passed

Stage 3: Quality gates (5m 45s) ✓
  ✓ Performance: No regression
    - P95 latency: 125ms (baseline: 120ms, +4%)
    - Throughput: 1250 req/s (baseline: 1200, +4%)
  ✓ Contract tests: 8 contracts verified
  ✓ Documentation: Updated

Stage 4: Security deep scan (2m 30s) ✓
  ✓ No vulnerabilities in changes
  ✓ Dependencies validated

Total time: 12 minutes
Result: ✅ All gates passed - Ready to merge
```

**Failure reporting example:**
```
❌ Stage 2 failed: Integration tests

Failed: Component integration tests (3/45)

1. Payment processor integration
   File: tests/integration/payment.test.ts:67
   Error: Expected payment status 'completed', got 'pending'
   Cause: Payment service test instance not responding
   Logs: https://ci.example.com/logs/12345

2. Order notification integration
   File: tests/integration/notification.test.ts:34
   Error: Email not received after 30s timeout
   Cause: Test email service rate limit exceeded

Action Required:
- Fix payment service integration or verify test environment
- Increase notification timeout or check email service quota
- Re-run pipeline after fixes

Block reason: Integration tests must pass to ensure component compatibility
```

**Why this works:**
- Under 15 minutes total
- Parallel execution where possible
- Fail fast (stopped at Stage 2)
- Specific errors with file locations
- Clear action items
- Links to detailed logs

---

❌ BAD Pre-Merge Pipeline Anti-pattern (slow, sequential, vague):

**Anti-pattern characteristics:**
- Slow execution (45+ minutes)
- Sequential stages (no parallelization)
- Vague error messages
- No bypass mechanism
- Flaky tests block everything

**Bad pipeline execution:**
```
Pre-merge pipeline for PR #234:

Stage 1: All tests (35 minutes) ❌
  Running all tests sequentially...
  - Unit tests: 248 passed (5m)
  - Integration tests: 2 failed, 43 passed (15m)
  - E2E tests: 1 failed, 8 passed (12m)
  - Load tests: timeout (3m)

Stage 2: Analysis (10 minutes) ⏭ Skipped
Stage 3: Documentation (5 minutes) ⏭ Skipped

Total time: 35 minutes
Result: ❌ Failed - Cannot merge
```

**Vague error message:**
```
❌ Pipeline failed

Tests failed. Check logs.
```

**Why this fails:**
- 35+ minutes kills productivity
- Sequential execution wastes time
- Runs unit tests again (redundant with pre-commit)
- Includes E2E tests (belongs in pre-deployment)
- Vague errors don't help developer
- No bypass for flaky test
- Skips later stages even though stage 1 failure unrelated

---

✅ GOOD Performance Gate Pattern (baseline comparison, statistical significance):

**Pattern demonstrates:**
- Clear baseline comparison
- Statistical significance
- Actionable metrics
- Regression threshold

**Performance test result:**
```
Performance Test Results:

Endpoint: POST /api/payments
Load profile: 100 concurrent users, 5m duration

Metrics comparison (Baseline → Current):

Response time:
  P50: 85ms → 87ms (+2.4%) ✓
  P95: 145ms → 178ms (+22.8%) ❌ REGRESSION
  P99: 280ms → 320ms (+14.3%) ⚠️
  Max: 450ms → 890ms (+97.8%) ❌ REGRESSION

Throughput:
  Requests/sec: 1180 → 1165 (-1.3%) ✓

Resource usage:
  Memory (avg): 256MB → 268MB (+4.7%) ✓
  CPU (avg): 45% → 48% (+6.7%) ✓

Analysis:
❌ Performance regression detected
- P95 latency increased 22.8% (threshold: 20%)
- Max latency nearly doubled
- Regression statistically significant (p < 0.01)

Likely cause:
- New database query added without index
- Check: src/payments/repository.ts:145

Action: Optimize query or add database index before merge
```

**Why this works:**
- Clear baseline comparison
- Multiple percentiles (not just average)
- Statistical significance noted
- Specific regression threshold
- Likely cause identified
- Actionable remediation

---

❌ BAD Performance Gate Anti-pattern (no baseline, flaky, meaningless):

**Anti-pattern characteristics:**
- No baseline for comparison
- Single run (no statistical validity)
- Shared test environment (inconsistent)
- Blocks on arbitrary thresholds

**Bad performance result:**
```
Performance Test Results:

Response time: 234ms
Throughput: 800 req/s

Result: ❌ FAILED
Reason: Response time exceeds 200ms threshold

(No baseline data available)
(Run on shared test environment with other jobs)
```

**Why this fails:**
- No baseline to compare against
- Single run not statistically valid
- Shared environment causes variance
- 234ms could be improvement or regression
- Arbitrary threshold not based on actual requirements
- No investigation of cause

---

✅ GOOD Contract Test Pattern (consumer-driven, both sides validated):

**Pattern demonstrates:**
- Consumer defines expectations
- Provider validates compatibility
- Both sides test independently
- Breaking changes detected

**Contract test execution:**
```
Contract Test Results:

Provider: PaymentService
Consumers: OrderService, SubscriptionService

OrderService contracts (v2.1):
  ✓ Create payment: Verified
  ✓ Get payment status: Verified
  ✓ Cancel payment: Verified

SubscriptionService contracts (v1.5):
  ✓ Create recurring payment: Verified
  ❌ Update payment method: Contract violated

Contract violation details:
Consumer expectation (SubscriptionService v1.5):
  Response must include field: "cardLast4"

Provider implementation:
  Field "cardLast4" not present in response

Impact: BREAKING CHANGE for SubscriptionService
Action: Add field back or coordinate breaking change with consumer
```

**Why this works:**
- Each consumer's contracts tested
- Specific field causing violation identified
- Impact clearly stated (breaking change)
- Both maintain and coordinate approaches suggested

---

❌ BAD Contract Test Anti-pattern (provider-only, no versioning):

**Anti-pattern characteristics:**
- Only provider tests their implementation
- No consumer input
- No versioning strategy
- Breaking changes discovered in production

**Bad "contract" test:**
```
API Test Results:

Endpoints tested:
  ✓ POST /payments
  ✓ GET /payments/:id
  ✓ POST /payments/:id/cancel

All endpoints return 200 OK.
Tests passed.
```

**Problem discovered in production:**
```
Production incident:
OrderService failing after PaymentService deployment

Error: Field 'cardLast4' undefined
Cause: PaymentService removed field without coordination
Impact: All order payments failing
```

**Why this fails:**
- No consumer contracts defined
- Provider tests only their own assumptions
- Breaking change not detected until production
- No versioning or coordination process
- Downtime and emergency rollback required
</examples>
