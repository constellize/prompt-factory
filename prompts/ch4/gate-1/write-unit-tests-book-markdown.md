<\!-- PROMPT START -->
> **Prompt: Write Comprehensive Unit Tests For Component Behavior In Isolation**
>
> **Purpose:** Write comprehensive unit tests for component behavior in isolation
>
> **Use when:** After code generation plan, write unit tests (Gate 1: Test Integrity)
>
> **Category:** Quality

```
---
template_variables:
  - name: component_name
    description: The specific component to write unit tests for
    example: "RateLimitMiddleware"
  - name: system_name
    description: The name of your system
    example: "Payment Processing System"
---

<task>
Write comprehensive unit tests for {{component_name}} in {{system_name}} that validate behavior in isolation, independent of constellation stars.

Unit tests are executable documentation—they tell the story of what your component does and why. Write tests that validate behavior, not implementation. Cover happy paths, edge cases, error conditions, and all critical business logic.

Follow this process:

1. **Review component specification:**
   - Read code generation plan from `construction/design/code-generation-plan-*.md`
   - Read gap analysis at `construction/requirements/gap-analysis.md` for success criteria
   - Extract all public methods, edge cases, and error conditions to test

2. **Write happy path tests:**
   - Test each public method with typical inputs
   - Verify expected outputs match specification
   - Use realistic data from constellation context

3. **Write edge case tests:**
   - Test boundary conditions (empty, max, min, null)
   - Test unusual but valid inputs
   - Verify graceful handling

4. **Write error condition tests:**
   - Test all error paths
   - Verify error handling per specification
   - Confirm recovery behavior

5. **Write critical logic tests:**
   - Achieve 100% branch coverage of business logic
   - Test all decision paths
   - Verify against gap success criteria
</task>

<context>
Component to test:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from:
- `construction/design/code-generation-plan-*.md` (component specification)
- `construction/requirements/gap-analysis.md` (success criteria to validate)

And outputs test code to standard test file location based on language conventions.
</context>

<thinking>
Before writing tests, analyze:
1. What are ALL public methods that need testing?
2. What edge cases exist (boundary conditions, empty inputs, null values)?
3. What error conditions must be handled?
4. What is the critical business logic that requires 100% coverage?
5. How can tests serve as executable documentation?
</thinking>

<output-format>
Write unit tests to `[test-file-path-for-component].[test-ext]`

Use standard testing framework conventions for the language:
- TypeScript/JavaScript: Jest, describe/it blocks
- Python: pytest, test functions
- Go: testing package, Test functions
- Java: JUnit, @Test annotations

Structure tests with AAA pattern (Arrange, Act, Assert):

```[language]
describe('{{component_name}} - [scenario]', () => {
  it('[specific behavior]', () => {
    // Arrange: Setup component and dependencies
    [Setup code with realistic data]

    // Act: Call method under test
    [Action that triggers behavior]

    // Assert: Verify expected behavior
    [Specific assertions matching specification]
  });
});
```

Include file header documenting what's tested:

```[language]
// UNIT TESTS: {{component_name}}
// Purpose: Validate [component] behavior in isolation
// Specification: construction/design/code-generation-plan-*.md
//
// Test Coverage:
// - Happy paths: [list scenarios]
// - Edge cases: [list boundary conditions]
// - Error conditions: [list error scenarios]
// - Critical logic: [list business logic paths]
//
// Success Criteria Validated:
// - [Gap success criterion 1 from gap-analysis.md]
// - [Gap success criterion 2]
```
</output-format>

<instructions>
CRITICAL: Write tests as executable documentation that tell the story of what your component does.

NEVER write tests that:
- Test implementation details instead of behavior
- Use vague assertions like `toBeTruthy()` or `works()`
- Skip edge cases or error conditions
- Lack descriptive test names
- Don't validate against specification
- Use unrealistic test data

DO NOT:
- Write "test that it works" - be specific about WHAT works
- Skip boundary conditions (null, empty, max, min)
- Forget to test error paths (they MUST be tested)
- Write tests that depend on other tests (tests MUST be independent)
- Skip the critical business logic (100% coverage REQUIRED)
- Use magic numbers without explanation

ALWAYS:
- Write descriptive test names that explain the scenario
- Use AAA pattern (Arrange, Act, Assert)
- Test behavior, not implementation
- Use realistic data from constellation context
- Test ALL edge cases and boundary conditions
- Test ALL error conditions and recovery
- Achieve 100% branch coverage of critical business logic
- Make tests fast (unit tests MUST be < 100ms)
- Make tests independent (no order dependencies)
- Validate against gap success criteria

REPEAT: Tests are executable documentation. Every test name should read like a specification. Use realistic data. Test behavior, not implementation. CRITICAL business logic requires 100% coverage.
</instructions>

<examples>
✅ GOOD unit test (self-documenting):

```typescript
// UNIT TESTS: RateLimitMiddleware
// Purpose: Validate rate limiting behavior in isolation
// Specification: construction/design/code-generation-plan-rate-limiter.md
//
// Test Coverage:
// - Happy paths: allows requests below limit, queues at limit
// - Edge cases: exactly at limit (100), empty queue, max queue depth
// - Error conditions: Redis failures, invalid requests
// - Critical logic: rate calculation, queue decisions
//
// Success Criteria Validated:
// - Handles 500 req/sec without dropping (gap-analysis.md, Gap 1)
// - Maintains 100 req/sec limit to Stripe (gap-analysis.md, Gap 1)

describe('RateLimitMiddleware - request allowance', () => {
  it('allows request through when under 100 req/sec limit', async () => {
    // Arrange: Setup with 50 existing requests (well under limit)
    const redis = createMockRedis();
    await redis.zadd('stripe:requests', ...createRequestEntries(50));

    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process request when under limit
    await middleware.handle(req, res, next);

    // Assert: Request allowed through (next called, no 202 response)
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(202);

    // Assert: Request tracked in Redis
    const count = await redis.zcount('stripe:requests', '-inf', '+inf');
    expect(count).toBe(51); // 50 + 1 new request
  });
});

describe('RateLimitMiddleware - edge case at exact limit', () => {
  it('queues request at exactly 100 req/sec (boundary condition)', async () => {
    // Arrange: Setup with exactly 99 requests (one below limit)
    const redis = createMockRedis();
    await redis.zadd('stripe:requests', ...createRequestEntries(99));

    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process 100th request (at exact limit)
    await middleware.handle(req, res, next);

    // Assert: Request queued (returns 202, doesn't call next)
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      status: 'queued',
      message: expect.stringContaining('rate limit')
    });
    expect(next).not.toHaveBeenCalled();

    // Assert: Request added to queue
    const queueDepth = await redis.zcount('stripe:queue', '-inf', '+inf');
    expect(queueDepth).toBe(1);
  });
});

describe('RateLimitMiddleware - error handling', () => {
  it('fails open when Redis connection unavailable', async () => {
    // Arrange: Mock Redis connection failure
    const redis = createMockRedis();
    redis.zcount = jest.fn().mockRejectedValue(new Error('Connection refused'));

    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();
    const logger = jest.spyOn(console, 'warn');

    // Act: Process request when Redis fails
    await middleware.handle(req, res, next);

    // Assert: Request continues (fail open per spec)
    expect(next).toHaveBeenCalled();
    expect(logger).toHaveBeenCalledWith('Redis unavailable, failing open');

    // Assert: No error thrown (graceful degradation)
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  it('validates request has required amount field', async () => {
    // Arrange: Request missing required field
    const redis = createMockRedis();
    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: {} }); // Missing amount
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process invalid request
    await middleware.handle(req, res, next);

    // Assert: Returns 400 validation error
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      message: expect.stringContaining('amount')
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('RateLimitMiddleware - critical business logic', () => {
  it('correctly calculates sliding window using timestamps', () => {
    // Arrange: Requests at various timestamps
    const now = Date.now();
    const requests = [
      { key: 'req1', timestamp: now - 2000 }, // 2 seconds ago (expired)
      { key: 'req2', timestamp: now - 500 },  // 0.5 seconds ago (valid)
      { key: 'req3', timestamp: now - 100 },  // 0.1 seconds ago (valid)
    ];

    const middleware = new RateLimitMiddleware(createMockRedis());

    // Act: Calculate valid requests in 1-second window
    const count = middleware.countRequestsInWindow(requests, now, 1000);

    // Assert: Only requests within 1-second window counted
    expect(count).toBe(2); // req2 and req3, not req1
  });

  it('uses FIFO ordering for queue processing', () => {
    // Arrange: Multiple queued requests with timestamps
    const queuedRequests = [
      { key: 'req1', timestamp: 1000, priority: 'low' },
      { key: 'req2', timestamp: 2000, priority: 'high' },  // Later timestamp
      { key: 'req3', timestamp: 1500, priority: 'high' },
    ];

    const middleware = new RateLimitMiddleware(createMockRedis());

    // Act: Get next request from queue
    const next = middleware.getNextQueuedRequest(queuedRequests);

    // Assert: Earliest timestamp returned (FIFO), not highest priority
    expect(next.key).toBe('req1');
    expect(next.timestamp).toBe(1000);
  });
});
```

**Why this is GOOD:**
- Descriptive test names explain exact scenario
- AAA pattern clearly separated
- Tests behavior (rate limiting) not implementation (Redis commands)
- Realistic data (request bodies, timestamps)
- Tests happy path, edge case (99→100), error (Redis failure), critical logic
- Assertions are specific (not vague toBeTruthy)
- Fast (< 100ms, uses mocks)
- Independent (each test has own setup)
- Validates gap success criteria (handles 500 req/sec, maintains 100 limit)

---

❌ BAD unit test (not self-documenting):

```typescript
describe('middleware', () => {
  it('works', () => {
    const m = new RateLimitMiddleware();
    expect(m).toBeTruthy();
  });

  it('does rate limiting', async () => {
    const m = new RateLimitMiddleware();
    const result = await m.handle({}, {}, () => {});
    expect(result).toBeTruthy();
  });

  it('tests edge case', () => {
    const m = new RateLimitMiddleware();
    // TODO: add test
  });
});
```

**Why this is BAD:**
- Vague test names ("works", "does rate limiting")
- No AAA pattern
- Trivial assertions (toBeTruthy doesn't validate behavior)
- Empty objects instead of realistic data
- Missing edge case test (just TODO comment)
- No error condition tests
- No critical business logic tests
- Doesn't validate against specification
- Not self-documenting (can't understand what component does)

---

✅ GOOD edge case test:

```typescript
describe('RateLimitMiddleware - boundary conditions', () => {
  it('handles empty queue without errors', async () => {
    // Arrange: No queued requests
    const redis = createMockRedis();
    // Queue is empty (no ZADD calls)

    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process request with empty queue
    await middleware.handle(req, res, next);

    // Assert: No errors, processes normally
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  it('handles null request body gracefully', async () => {
    // Arrange: Request with null body
    const redis = createMockRedis();
    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: null });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process null body
    await middleware.handle(req, res, next);

    // Assert: Returns 400 validation error (not 500 crash)
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      message: 'Request body is required'
    });
  });

  it('handles maximum queue depth (1000 requests)', async () => {
    // Arrange: Queue at maximum capacity
    const redis = createMockRedis();
    await redis.zadd('stripe:queue', ...createRequestEntries(1000));

    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Try to queue 1001st request
    await middleware.handle(req, res, next);

    // Assert: Returns 503 (queue full per spec)
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Service unavailable',
      message: 'Rate limit queue is full'
    });
  });
});
```

**Why this is GOOD:**
- Tests specific boundary conditions (empty, null, max)
- Clear Given/When/Then in comments
- Realistic scenarios that could happen
- Verifies graceful handling (400 not 500, no crashes)
- Tests limits from specification (1000 max queue)

---

✅ GOOD critical business logic test with 100% branch coverage:

```typescript
describe('RateLimitMiddleware - queue decision logic (CRITICAL)', () => {
  // This logic decides allow vs queue - must have 100% branch coverage

  it('allows when count < 100 (under limit branch)', async () => {
    // Branch 1: count < 100 → allow
    const redis = createMockRedis();
    await redis.zadd('stripe:requests', ...createRequestEntries(95));

    const middleware = new RateLimitMiddleware(redis);
    const decision = await middleware.makeQueueDecision(redis, 'test-req');

    expect(decision).toBe('ALLOW');
  });

  it('queues when count >= 100 (at/over limit branch)', async () => {
    // Branch 2: count >= 100 → queue
    const redis = createMockRedis();
    await redis.zadd('stripe:requests', ...createRequestEntries(100));

    const middleware = new RateLimitMiddleware(redis);
    const decision = await middleware.makeQueueDecision(redis, 'test-req');

    expect(decision).toBe('QUEUE');
  });

  it('queues when count > 100 (over limit branch)', async () => {
    // Branch 3: count > 100 → queue (shouldn't happen but test it)
    const redis = createMockRedis();
    await redis.zadd('stripe:requests', ...createRequestEntries(150));

    const middleware = new RateLimitMiddleware(redis);
    const decision = await middleware.makeQueueDecision(redis, 'test-req');

    expect(decision).toBe('QUEUE');
  });

  it('allows on Redis error (fail-open branch)', async () => {
    // Branch 4: Redis error → fail open (allow request)
    const redis = createMockRedis();
    redis.zcount = jest.fn().mockRejectedValue(new Error('Connection failed'));

    const middleware = new RateLimitMiddleware(redis);
    const decision = await middleware.makeQueueDecision(redis, 'test-req');

    expect(decision).toBe('ALLOW'); // Fail open
  });
});

// Code under test has 4 branches - all 4 tested above = 100% branch coverage
```

**Why this is GOOD:**
- Explicitly labeled CRITICAL (needs 100% coverage)
- Tests every branch in decision logic
- Comments map branches to code paths
- Confirms 100% branch coverage at end
- Each branch has independent test

---

❌ BAD critical logic test:

```typescript
it('queue logic works', () => {
  const m = new RateLimitMiddleware();
  expect(m.makeQueueDecision()).toBeTruthy();
});
```

**Why this is BAD:**
- Doesn't test all branches (missing coverage)
- Vague assertion (toBeTruthy)
- No realistic data
- Doesn't verify correct behavior per branch
- Not testing critical business logic properly
</examples>
```

<\!-- PROMPT END -->
<\!-- METADATA: {"id": "write-unit-tests", "chapter": "Chapter 4", "category": "Quality", "tags": ["quality", "testing", "unit-tests", "coverage", "tdd"]} -->
