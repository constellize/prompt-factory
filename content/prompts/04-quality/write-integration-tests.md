---
# === Identity ===
id: write-integration-tests
name: Write comprehensive integration tests with constellation stars using real dependencies
version: v1

# === Classification ===
chapter: 4
category: quality
subcategory: gate-1
tags:
  - quality
  - testing
  - integration-tests
  - constellation
  - contracts

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Write comprehensive integration tests with constellation stars using real dependencies.
    After code generation plan, write integration tests (Gate 1: Test Integrity).
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
    description: The specific component to write integration tests for
    example: "RateLimitMiddleware"
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
      **Implement integration tests** that verify your component works correctly with its dependencies. Database interactions need validation to ensure queries execute properly and transactions maintain data integrity. External API calls require testing to confirm request formatting and response handling work as expected. Service-to-service communication patterns should be verified to catch protocol mismatches or serialization issues early. Don't forget configuration loading and validation tests—misconfiguration is one of the most common production failure modes.
    preview: |
      "...validate integration with constellation stars using real dependencies. Integration tests verify your component works correctly with external systems—databases, APIs, services..."
  website:
    include: true
    path: /prompts/write-integration-tests
  marketplace:
    plugin: constellize-quality

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Write comprehensive integration tests for {{component_name}} in {{system_name}} that validate integration with constellation stars using real dependencies.

Integration tests verify your component works correctly with external systems—databases, APIs, services—documented in your constellation map. These tests use real dependencies (or realistic test doubles) to validate contracts, failure modes, and data flows between your component and constellation stars.

Follow this process:

1. **Review constellation integration points:**
   - Read constellation map at `construction/requirements/constellation-map.md` for stars this integrates with
   - Read code generation plan from `construction/design/code-generation-plan-*.md` for integration details
   - Extract specific contracts, protocols, schemas, and failure modes to test

2. **Write database integration tests:**
   - Use real test database (or test container) matching constellation schema
   - Test queries match constellation contracts
   - Test failure modes from constellation map

3. **Write external API integration tests:**
   - Test API calls match constellation contracts (headers, body, auth)
   - Test rate limits from constellation documentation
   - Test failure handling (429, 5xx) per constellation

4. **Write service communication tests:**
   - Test message formats match constellation contracts
   - Test protocol usage per constellation
   - Test error propagation

5. **Write configuration tests:**
   - Test configuration loading and validation
   - Test missing/invalid configuration handling
</task>

<context>
Component to test:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from:
- `construction/requirements/constellation-map.md` (star catalog with contracts)
- `construction/design/code-generation-plan-*.md` (integration specifications)

And outputs integration tests to standard test file location.
</context>

<thinking>
Before writing integration tests, analyze:
1. What constellation stars does this component integrate with?
2. What are the specific contracts (APIs, schemas, protocols)?
3. What failure modes are documented in constellation map?
4. What data flows between component and stars?
5. What configuration is required?
</thinking>

<output-format>
Write integration tests following these patterns:

**Integration Test File Structure:**

1. **File Header:**
   - Component under test
   - Purpose: validate constellation star integrations
   - Constellation map reference
   - Stars being integrated with
   - Coverage summary by integration type
   - Failure modes being tested

2. **Test Organization:**
   - Group by constellation star
   - Use real dependencies where possible
   - Use realistic test doubles when necessary
   - Test contracts, failure modes, data flows

**File Header Pattern:**
```
INTEGRATION TESTS: {{component_name}}
Purpose: Validate integration with constellation stars
Constellation map: [reference to map document]

Stars Integrated:
- [Star Name]: [Integration contract tested]
- [Star Name]: [Integration contract tested]

Test Coverage:
- Database: [Scenarios tested]
- APIs: [Contracts tested]
- Services: [Communications tested]
- Configuration: [Validation tested]

Failure Modes Tested:
- [Mode from constellation-map]
- [Mode from constellation-map]
```

**Real Dependencies Pattern:**

Use actual infrastructure matching production:
- **Databases:** Test containers or test instances with real schemas
- **External APIs:** Sandbox endpoints or contract-accurate mocks
- **Services:** Test instances or contract-based stubs
- **Infrastructure:** Local equivalents (cache, queue, storage)

**Contract Testing Pattern:**

Validate integration contracts explicitly:
```
Test: [Integration point]
Contract elements to verify:
- Request/message format
- Response/result format
- Headers/metadata
- Authentication/authorization
- Error responses
- Rate limits/constraints
```

**Failure Mode Testing Pattern:**

Test all documented failure scenarios:
```
Failure mode: [From constellation map]
Test scenarios:
- Connection loss
- Timeout
- Rate limit exceeded
- Authentication failure
- Invalid data
- Resource exhausted

Verify:
- Graceful degradation
- Error propagation
- Recovery mechanism
- Fallback behavior
```

**Test Lifecycle Pattern:**
```
Setup (beforeAll):
- Start test infrastructure
- Initialize connections
- Load test schema/data

Cleanup (afterAll):
- Stop test infrastructure
- Close connections
- Clean up resources

Per-test (beforeEach/afterEach):
- Reset to known state
- Clear transient data
```
</output-format>

<instructions>
CRITICAL: Integration tests MUST use real dependencies or realistic test doubles that match constellation contracts.

NEVER write integration tests that:
- Mock everything (that's a unit test, not integration test)
- Skip testing failure modes from constellation map
- Use fake contracts not matching constellation documentation
- Ignore rate limits or constraints from stars
- Skip configuration validation
- Test against local mocks when real test environments exist

DO NOT:
- Use in-memory mocks for database tests (use test containers)
- Skip testing 429/5xx errors from external APIs
- Forget to test connection failures
- Use unrealistic data that doesn't match star schemas
- Skip testing contract changes (breaking changes MUST be caught)
- Write slow tests (integration tests MUST be < 1s per test)

ALWAYS:
- Use real test database matching constellation schema
- Test exact API contracts from constellation map (headers, auth, body format)
- Test ALL failure modes documented in constellation-map.md
- Test rate limits and constraints from stars
- Test configuration loading and validation
- Validate data flows match constellation specifications
- Use realistic test data matching star schemas
- Clean up resources after tests (no test pollution)

REPEAT: Integration tests validate constellation contracts. Use REAL dependencies matching constellation documentation. Test ALL failure modes from constellation-map.md.
</instructions>

<examples>
✅ GOOD integration test (real dependencies):

```typescript
// INTEGRATION TESTS: RateLimitMiddleware
// Purpose: Validate integration with constellation stars
// Constellation map: construction/requirements/constellation-map.md
//
// Stars Integrated:
// - Redis Cache: Sorted set operations (ZADD, ZCOUNT, ZPOPMIN)
// - Stripe API: Rate limit awareness (100 req/sec)
// - API Gateway: Middleware integration (Express)
//
// Test Coverage:
// - Redis operations: tracking requests, queueing, cleanup
// - Rate limit enforcement: respecting Stripe 100 req/sec limit
// - Failure handling: Redis connection loss, network errors
//
// Failure Modes Tested:
// - Redis connection failure (constellation-map.md: "fail open")
// - Network timeout (constellation-map.md: "30s timeout")

describe('RateLimitMiddleware - Redis Cache Star Integration', () => {
  let redis: Redis;

  beforeAll(async () => {
    // Use real Redis (Docker test container matching constellation)
    redis = await createTestRedisContainer({
      schema: 'constellation-redis-schema.json', // From constellation map
      port: 6380 // Test port
    });
  });

  afterAll(async () => {
    await redis.quit();
    await stopTestContainer('redis');
  });

  afterEach(async () => {
    // Clean up test data
    await redis.flushdb();
  });

  it('tracks requests using ZADD per Redis Cache star contract', async () => {
    // Test EXACT contract from constellation-map.md
    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process request
    await middleware.handle(req, res, next);

    // Assert: Uses ZADD command per constellation contract
    const requests = await redis.zrange('stripe:requests', 0, -1, 'WITHSCORES');
    expect(requests).toHaveLength(2); // Key and score

    // Assert: Key format matches constellation pattern
    expect(requests[0]).toMatch(/^stripe:ratelimit:\d+$/);

    // Assert: Score is timestamp (constellation contract)
    const timestamp = parseInt(requests[1]);
    expect(timestamp).toBeGreaterThan(Date.now() - 1000);
  });

  it('respects Redis connection pool limit from constellation', async () => {
    // Constellation-map.md documents: "max 10 connections"
    const middleware = new RateLimitMiddleware(redis);
    const requests = Array(20).fill(null).map(() =>
      middleware.handle(createMockRequest(), createMockResponse(), jest.fn())
    );

    // Act: Process 20 concurrent requests
    await Promise.all(requests);

    // Assert: Never exceeds 10 concurrent connections
    const maxConnections = redis.getMaxConnections();
    expect(maxConnections).toBeLessThanOrEqual(10);
  });

  it('handles Redis connection failure per constellation failure mode', async () => {
    // Constellation-map.md documents: "Connection failures → fail open"
    const middleware = new RateLimitMiddleware(redis);

    // Simulate connection failure
    await redis.quit(); // Close connection

    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process request with Redis down
    await middleware.handle(req, res, next);

    // Assert: Fails open (allows request through per constellation spec)
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(500);
  });
});

describe('RateLimitMiddleware - Stripe API Star Rate Limit Awareness', () => {
  it('enforces 100 req/sec limit documented in Stripe API star', async () => {
    // Constellation-map.md documents: "Stripe enforces 100 req/sec"
    const redis = await createTestRedisContainer();
    const middleware = new RateLimitMiddleware(redis);

    // Simulate 100 requests in current second
    await redis.zadd(
      'stripe:requests',
      ...Array(100).fill(null).map((_, i) => [Date.now(), `req:${i}`]).flat()
    );

    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Try to process 101st request
    await middleware.handle(req, res, next);

    // Assert: Request queued (not allowed through)
    expect(res.status).toHaveBeenCalledWith(202);
    expect(next).not.toHaveBeenCalled();

    // Assert: Respects Stripe limit (doesn't allow 101st through)
    const currentCount = await redis.zcount('stripe:requests', '-inf', '+inf');
    expect(currentCount).toBe(100); // Still at limit, not 101
  });
});

describe('RateLimitMiddleware - API Gateway Star Integration', () => {
  it('integrates with Express middleware chain per Gateway star', async () => {
    // Constellation-map.md documents: "Express middleware pattern (req, res, next)"
    const redis = await createTestRedisContainer();
    const middleware = new RateLimitMiddleware(redis);

    // Use real Express app (not mock)
    const app = express();
    app.locals.redisClient = redis;
    app.use(middleware.handle.bind(middleware));
    app.post('/test', (req, res) => res.json({ success: true }));

    // Act: Make real HTTP request through Express
    const response = await request(app)
      .post('/test')
      .send({ amount: 1000 })
      .expect(200);

    // Assert: Middleware processes in chain
    expect(response.body).toEqual({ success: true });

    // Assert: Request tracked in Redis
    const count = await redis.zcount('stripe:requests', '-inf', '+inf');
    expect(count).toBe(1);
  });

  it('respects 30s timeout from API Gateway star', async () => {
    // Constellation-map.md documents: "30s request timeout"
    const redis = await createTestRedisContainer();
    const middleware = new RateLimitMiddleware(redis);

    // Simulate slow Redis operation (> 30s would timeout)
    const slowRedis = new Proxy(redis, {
      get(target, prop) {
        if (prop === 'zcount') {
          return () => new Promise(resolve => setTimeout(() => resolve(0), 31000));
        }
        return target[prop];
      }
    });

    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process with slow Redis
    const startTime = Date.now();
    await middleware.handle(req, res, next);
    const duration = Date.now() - startTime;

    // Assert: Times out before 30s (fails open per constellation)
    expect(duration).toBeLessThan(30000);
    expect(next).toHaveBeenCalled(); // Failed open
  });
});

describe('RateLimitMiddleware - Configuration', () => {
  it('loads Redis connection string from environment', () => {
    // Test configuration loading
    process.env.REDIS_URL = 'redis://localhost:6379';

    const config = RateLimitMiddleware.loadConfig();

    expect(config.redisUrl).toBe('redis://localhost:6379');
    expect(config.rateLimit).toBe(100); // From constellation (Stripe limit)
  });

  it('rejects invalid configuration', () => {
    // Missing required configuration
    delete process.env.REDIS_URL;

    expect(() => {
      RateLimitMiddleware.loadConfig();
    }).toThrow('REDIS_URL environment variable is required');
  });
});
```

**Why this is GOOD:**
- Uses REAL Redis (Docker test container)
- Tests EXACT contracts from constellation-map.md (ZADD, ZCOUNT)
- Tests failure mode documented in constellation (fail open)
- Tests constraints from stars (10 connection limit, 100 req/sec)
- Tests with real Express app (not mocked)
- Validates against constellation specifications
- Cleans up resources (afterEach, afterAll)
- Fast enough (< 1s per test with test container)

---

❌ BAD integration test (everything mocked):

```typescript
describe('integration tests', () => {
  it('works with Redis', () => {
    const redis = { zadd: jest.fn(), zcount: jest.fn() };
    const middleware = new RateLimitMiddleware(redis);

    expect(middleware).toBeTruthy();
  });

  it('calls API', () => {
    const api = { call: jest.fn() };
    expect(api).toBeTruthy();
  });
});
```

**Why this is BAD:**
- Everything is mocked (not testing real integration)
- No constellation contracts tested
- No failure modes tested
- Trivial assertions (toBeTruthy)
- No real dependencies used
- Doesn't validate constellation specifications
- This is a unit test, not integration test

---

✅ GOOD external API integration test:

```typescript
describe('StripePaymentProcessor - Stripe API Star Integration', () => {
  let stripeTestClient: Stripe;

  beforeAll(() => {
    // Use Stripe test/sandbox environment (real API, test mode)
    stripeTestClient = new Stripe(process.env.STRIPE_TEST_KEY, {
      apiVersion: '2023-10-16', // Version from constellation-map.md
    });
  });

  it('creates charge with contract matching Stripe API star', async () => {
    // Constellation-map.md documents exact request format
    const processor = new StripePaymentProcessor(stripeTestClient);

    // Act: Make real API call to Stripe test environment
    const charge = await processor.createCharge({
      amount: 1000,
      currency: 'usd',
      source: 'tok_visa', // Stripe test token
    });

    // Assert: Response matches constellation contract
    expect(charge.object).toBe('charge');
    expect(charge.amount).toBe(1000);
    expect(charge.currency).toBe('usd');
    expect(charge.status).toBe('succeeded');

    // Assert: Request included required headers from constellation
    // (Stripe SDK handles this, validate in SDK spy)
  });

  it('handles 429 rate limit response from Stripe API star', async () => {
    // Constellation-map.md documents: "Stripe returns 429 at 100 req/sec"
    const processor = new StripePaymentProcessor(stripeTestClient);

    // Trigger rate limit by making many rapid requests
    const requests = Array(105).fill(null).map(() =>
      processor.createCharge({ amount: 100, currency: 'usd', source: 'tok_visa' })
    );

    // Act: Make rapid requests
    const results = await Promise.allSettled(requests);

    // Assert: Some requests got 429 (rate limited)
    const rateLimited = results.filter(r =>
      r.status === 'rejected' && r.reason.statusCode === 429
    );
    expect(rateLimited.length).toBeGreaterThan(0);

    // Assert: Processor handles 429 per constellation spec (retry with backoff)
    // Verify retry behavior...
  });

  it('handles network timeout per constellation failure mode', async () => {
    // Constellation-map.md documents: "Network timeouts → retry 3 times"
    const processor = new StripePaymentProcessor(stripeTestClient);

    // Simulate network issue
    const timeoutClient = new Stripe(process.env.STRIPE_TEST_KEY, {
      timeout: 100, // Very short timeout
    });

    // Act: Try to create charge with timeout
    await expect(
      processor.createChargeWithTimeout(timeoutClient, {
        amount: 1000,
        currency: 'usd'
      })
    ).rejects.toThrow('timeout');

    // Assert: Retried 3 times per constellation spec
    // (Check retry count in processor logs/metrics)
  });
});
```

**Why this is GOOD:**
- Uses REAL Stripe API (test/sandbox mode)
- Tests exact contract from constellation (API version, request format)
- Tests failure mode (429 rate limit) from constellation-map.md
- Tests error handling per constellation spec (retry 3 times)
- Validates against real external system

---

✅ GOOD database integration test:

```typescript
describe('UserRepository - PostgreSQL Star Integration', () => {
  let db: PostgresContainer;
  let repository: UserRepository;

  beforeAll(async () => {
    // Use real PostgreSQL (Docker test container)
    db = await new PostgresContainer()
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_pass')
      .start();

    // Apply schema from constellation-map.md
    await db.runMigrations('constellation-schema.sql');

    repository = new UserRepository(db.getConnectionString());
  });

  afterAll(async () => {
    await db.stop();
  });

  it('queries match PostgreSQL star schema from constellation', async () => {
    // Constellation-map.md documents exact schema
    const user = await repository.create({
      email: 'test@example.com',
      name: 'Test User',
      created_at: new Date(),
    });

    // Assert: All required columns from constellation schema present
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('created_at');
    expect(user).toHaveProperty('updated_at');

    // Assert: Types match constellation schema
    expect(typeof user.id).toBe('number'); // SERIAL per schema
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Valid email
  });

  it('handles connection failure per PostgreSQL star failure mode', async () => {
    // Constellation-map.md documents: "Connection failure → exponential backoff"
    const repository = new UserRepository('postgresql://invalid:5432/test');

    // Act: Try to query with bad connection
    await expect(
      repository.findById(1)
    ).rejects.toThrow('connection');

    // Assert: Retried with exponential backoff per constellation
    // (Check retry timing in logs)
  });
});
```

**Why this is GOOD:**
- Uses REAL PostgreSQL (Docker test container)
- Tests exact schema from constellation-map.md
- Tests failure mode (connection failure) from constellation
- Validates query structure against constellation contract
- Uses realistic data
</examples>
