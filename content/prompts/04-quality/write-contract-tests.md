---
# === Identity ===
id: write-contract-tests
name: Write comprehensive contract tests to ensure API contracts maintained and detect breaking changes
version: v1

# === Classification ===
chapter: 4
category: quality
subcategory: gate-1
tags:
  - quality
  - testing
  - contract-tests
  - api-contracts
  - breaking-changes

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Write comprehensive contract tests to ensure API contracts maintained and detect breaking changes.
    After code generation plan, write contract tests (Gate 1: Test Integrity).
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
    description: The specific component to write contract tests for
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
      **Create contract tests** that protect the boundaries between components. API contracts should be explicitly tested and maintained across versions so that consumers can rely on consistent behavior. Breaking changes should be detected automatically by your test suite, not discovered in production. Backward compatibility deserves dedicated attention—even when adding new features, existing functionality must continue to work for all current consumers.
    preview: |
      "...ensure API contracts are maintained across versions and breaking changes are detected automatically..."
  website:
    include: true
    path: /prompts/write-contract-tests
  marketplace:
    plugin: constellize-quality

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Write comprehensive contract tests for {{component_name}} in {{system_name}} that ensure API contracts with constellation stars are maintained across versions and breaking changes are detected automatically.

Contract tests validate that your component's API contracts remain stable and compatible with constellation stars. These tests catch breaking changes BEFORE they reach production, ensuring backward compatibility and detecting contract violations automatically.

Follow this process:

1. **Review constellation contracts:**
   - Read constellation map at `construction/requirements/constellation-map.md` for star contracts
   - Read code generation plan from `construction/design/code-generation-plan-*.md` for API specifications
   - Extract exact contracts (request/response formats, schemas, protocols)

2. **Write API contract tests:**
   - Validate response schemas match constellation contracts EXACTLY
   - Test request formats match star expectations EXACTLY
   - Document contract version from constellation

3. **Write breaking change detection tests:**
   - Load previous contract version
   - Compare current implementation against previous
   - FAIL if breaking changes detected without version bump

4. **Write backward compatibility tests:**
   - Test old client code still works
   - Test deprecated fields still supported
   - Verify graceful handling of old requests
</task>

<context>
Component to test:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from:
- `construction/requirements/constellation-map.md` (star contracts)
- `construction/design/code-generation-plan-*.md` (API specifications)

And outputs contract tests to standard test file location.
</context>

<thinking>
Before writing contract tests, analyze:
1. What API contracts does this component expose or consume?
2. What are the exact schemas from constellation map?
3. What contract versions are documented?
4. What would constitute a breaking change?
5. What backward compatibility is required?
</thinking>

<output-format>
Write contract tests following these patterns:

**Contract Test File Structure:**

1. **File Header:**
   - Component under test
   - Purpose: maintain API contract stability
   - Constellation map reference
   - Contracts being validated
   - Breaking change detection approach
   - Backward compatibility strategy

2. **Contract Validation Categories:**
   - Schema exactness (request/response structures)
   - Breaking change detection (version comparison)
   - Backward compatibility (old client support)
   - Field requirements (required vs optional)

**File Header Pattern:**
```
CONTRACT TESTS: {{component_name}}
Purpose: Ensure API contracts maintained across versions
Constellation map: [reference]

Contracts Under Test:
- [Contract Name] v[X]: [Specification]
- [Contract Name] v[X]: [Specification]

Breaking Change Detection:
- Schema validation: [Approach]
- Version comparison: [Method]
- Failure policy: [When to fail]

Backward Compatibility:
- Supported versions: [List]
- Deprecated fields: [Handling]
```

**Schema Validation Pattern:**

Validate contract schemas exactly:
```
Contract: [API endpoint or message type]
Version: [X.Y.Z]

Required fields:
- [field]: [type] - [constraint]
- [field]: [type] - [constraint]

Optional fields:
- [field]: [type] - [default]

Validation approach:
- Schema definition: [JSON Schema/Proto/OpenAPI]
- Validation tool: [Validator used]
- Failure on mismatch: [Yes/No]
```

**Breaking Change Detection Pattern:**

Compare current against previous version:
```
Detection method:
1. Load previous contract version
2. Compare schemas:
   - New required fields → BREAKING
   - Removed fields → BREAKING
   - Type changes → BREAKING
   - New optional fields → NON-BREAKING
   - Deprecated fields → NON-BREAKING
3. Fail if breaking without version bump

Version policy:
- Major bump: Breaking changes allowed
- Minor bump: Backward compatible additions
- Patch bump: No contract changes
```

**Backward Compatibility Testing Pattern:**

Test old clients still work:
```
Test scenario: [Old client version]
Test approach:
1. Create request using old contract
2. Send to current implementation
3. Verify:
   - Request accepted
   - Response parseable by old client
   - Deprecated fields still present
   - New fields optional

Deprecated field handling:
- Field: [name]
- Deprecated since: [version]
- Removal planned: [version]
- Current behavior: [Still supported/warning/error]
```

**Contract Version Documentation Pattern:**

Document contract evolution:
```
Contract: [Name]
Current version: [X.Y.Z]

Version history:
- v[X.Y.Z]: [Changes made]
- v[X.Y.Z-1]: [Previous version]

Breaking changes:
- v[X.0.0]: [What broke]
- v[X-1.0.0]: [What broke]

Deprecations:
- v[X.Y.Z]: Deprecated [field]
- Removal: v[X+1.0.0]
```
</output-format>

<instructions>
CRITICAL: Contract tests MUST catch breaking changes BEFORE production. Use schema validation and version comparison.

NEVER write contract tests that:
- Skip schema validation (contracts MUST be exact)
- Allow breaking changes without version bump
- Forget to test backward compatibility
- Use loose assertions (contracts are STRICT)
- Skip testing old client compatibility
- Miss required fields or data types

DO NOT:
- Use toBeTruthy or generic assertions (schemas MUST match exactly)
- Skip testing request AND response contracts
- Forget to document contract versions
- Allow nullable fields without constellation documentation
- Skip testing error response contracts
- Forget to test content-type headers

ALWAYS:
- Validate exact schema match (use JSON Schema or similar)
- Test ALL required fields are present
- Test data types match contract EXACTLY
- Detect breaking changes automatically
- Test old client code still works
- Document contract version in tests
- Fail tests on any contract violation
- Test error responses match contract

REPEAT: Contract tests prevent breaking changes. Use STRICT schema validation. Test EXACT contracts from constellation-map.md. Breaking changes MUST fail tests.
</instructions>

<examples>
✅ GOOD contract test (strict schema validation):

```typescript
// CONTRACT TESTS: RateLimitMiddleware
// Purpose: Ensure API contracts maintained across versions
// Constellation map: construction/requirements/constellation-map.md
//
// Contracts Under Test:
// - Queue Response v1.0: 202 Accepted with status field
// - Rate Limit Headers v1.0: X-RateLimit-* headers
//
// Breaking Change Detection:
// - Compares against v1.0 schema
// - Fails on missing required fields
// - Fails on type changes
//
// Backward Compatibility:
// - Tests v1.0 clients still work
// - Validates deprecated field support (none yet)

import Ajv from 'ajv';

describe('RateLimitMiddleware - API Gateway Star Contract', () => {
  const ajv = new Ajv({ strict: true });

  // Load contract schema from constellation-map.md
  const queueResponseSchema = {
    type: 'object',
    required: ['status', 'message'], // REQUIRED fields from constellation
    properties: {
      status: { type: 'string', enum: ['queued'] }, // EXACT value from constellation
      message: { type: 'string' },
      queuePosition: { type: 'number' }, // Optional per constellation
    },
    additionalProperties: false, // STRICT: no extra fields allowed
  };

  const validateQueueResponse = ajv.compile(queueResponseSchema);

  it('returns 202 response matching constellation contract EXACTLY', async () => {
    // Constellation-map.md documents: "Return 202 with {status: 'queued', message: string}"
    const redis = createMockRedisAtLimit();
    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Queue request
    await middleware.handle(req, res, next);

    // Assert: Status code EXACT match
    expect(res.status).toHaveBeenCalledWith(202);

    // Assert: Response body matches contract EXACTLY
    const responseBody = res.json.mock.calls[0][0];
    const isValid = validateQueueResponse(responseBody);

    if (!isValid) {
      console.log('Contract violation:', validateQueueResponse.errors);
    }

    expect(isValid).toBe(true);

    // Assert: Required fields present
    expect(responseBody).toHaveProperty('status');
    expect(responseBody).toHaveProperty('message');

    // Assert: Types match contract
    expect(typeof responseBody.status).toBe('string');
    expect(responseBody.status).toBe('queued'); // EXACT value
    expect(typeof responseBody.message).toBe('string');
  });

  it('includes rate limit headers per constellation contract', async () => {
    // Constellation-map.md documents: "X-RateLimit-Limit: 100, X-RateLimit-Remaining: N"
    const redis = createMockRedis();
    const middleware = new RateLimitMiddleware(redis);
    const req = createMockRequest({ body: { amount: 1000 } });
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process request
    await middleware.handle(req, res, next);

    // Assert: Headers match contract EXACTLY
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
    expect(res.setHeader).toHaveBeenCalledWith(
      'X-RateLimit-Remaining',
      expect.stringMatching(/^\d+$/) // Must be numeric string
    );
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(String));
  });
});

describe('RateLimitMiddleware - Breaking Change Detection', () => {
  it('detects breaking changes from v1.0 contract', () => {
    // Load v1.0 contract (previous version)
    const v1Contract = {
      queueResponse: {
        required: ['status', 'message'],
        properties: {
          status: { type: 'string', enum: ['queued'] },
          message: { type: 'string' },
        },
      },
    };

    // Get current implementation response
    const currentResponse = {
      status: 'queued',
      message: 'Request queued',
      // No extra fields added
    };

    // Validate current against v1 contract
    const validator = ajv.compile(v1Contract.queueResponse);
    const isBackwardCompatible = validator(currentResponse);

    // Assert: Current version maintains v1.0 contract
    expect(isBackwardCompatible).toBe(true);

    // If this fails, you've introduced a BREAKING CHANGE
    // Either: fix the change OR bump version to v2.0
  });

  it('FAILS when required field removed (breaking change)', () => {
    // Simulate removing 'message' field (BREAKING CHANGE)
    const brokenResponse = {
      status: 'queued',
      // message: 'Request queued', // REMOVED (breaking change)
    };

    const v1Schema = {
      type: 'object',
      required: ['status', 'message'],
      properties: {
        status: { type: 'string' },
        message: { type: 'string' },
      },
    };

    const validator = ajv.compile(v1Schema);
    const isValid = validator(brokenResponse);

    // Assert: Test FAILS (breaking change detected)
    expect(isValid).toBe(false);
    expect(validator.errors).toContainEqual(
      expect.objectContaining({
        keyword: 'required',
        params: { missingProperty: 'message' },
      })
    );
  });

  it('FAILS when field type changed (breaking change)', () => {
    // Simulate changing 'status' from string to number (BREAKING CHANGE)
    const brokenResponse = {
      status: 1, // Changed from 'queued' string to number (BREAKING)
      message: 'Request queued',
    };

    const v1Schema = {
      type: 'object',
      required: ['status', 'message'],
      properties: {
        status: { type: 'string' }, // Contract specifies string
        message: { type: 'string' },
      },
    };

    const validator = ajv.compile(v1Schema);
    const isValid = validator(brokenResponse);

    // Assert: Test FAILS (type change detected)
    expect(isValid).toBe(false);
    expect(validator.errors).toContainEqual(
      expect.objectContaining({
        keyword: 'type',
        params: { type: 'string' },
      })
    );
  });

  it('ALLOWS adding optional fields (non-breaking)', () => {
    // Adding optional field is OK (non-breaking change)
    const enhancedResponse = {
      status: 'queued',
      message: 'Request queued',
      queuePosition: 5, // NEW optional field (non-breaking)
    };

    const v1Schema = {
      type: 'object',
      required: ['status', 'message'], // queuePosition not required
      properties: {
        status: { type: 'string' },
        message: { type: 'string' },
        queuePosition: { type: 'number' }, // Optional
      },
      additionalProperties: false,
    };

    const validator = ajv.compile(v1Schema);
    const isValid = validator(enhancedResponse);

    // Assert: Test PASSES (optional field is non-breaking)
    expect(isValid).toBe(true);
  });
});

describe('RateLimitMiddleware - Backward Compatibility', () => {
  it('accepts v1.0 request format from old clients', async () => {
    // Simulate old client sending v1.0 request
    const middleware = new RateLimitMiddleware(createMockRedis());

    const oldClientRequest = createMockRequest({
      body: {
        amount: 1000, // v1.0 field
        // New fields not sent by old client
      },
    });

    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process old client request
    await middleware.handle(oldClientRequest, res, next);

    // Assert: Old client request still works
    expect(next).toHaveBeenCalled();
    // Should not throw or return error
  });

  it('supports deprecated fields for backward compatibility', async () => {
    // If we deprecated a field, old clients may still send it
    const middleware = new RateLimitMiddleware(createMockRedis());

    const requestWithDeprecated = createMockRequest({
      body: {
        amount: 1000,
        // deprecated_field: 'old_value', // If we had deprecated fields
      },
    });

    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process request with deprecated field
    await middleware.handle(requestWithDeprecated, res, next);

    // Assert: Deprecated field ignored gracefully (not error)
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(400);
  });
});

describe('RateLimitMiddleware - Error Response Contract', () => {
  it('returns 400 error matching constellation error contract', async () => {
    // Constellation-map.md documents error format
    const errorSchema = {
      type: 'object',
      required: ['error', 'message'],
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
        details: { type: 'object' }, // Optional
      },
      additionalProperties: false,
    };

    const validator = ajv.compile(errorSchema);

    const middleware = new RateLimitMiddleware(createMockRedis());
    const req = createMockRequest({ body: null }); // Invalid request
    const res = createMockResponse();
    const next = jest.fn();

    // Act: Process invalid request
    await middleware.handle(req, res, next);

    // Assert: Error response matches contract
    expect(res.status).toHaveBeenCalledWith(400);

    const errorBody = res.json.mock.calls[0][0];
    const isValid = validator(errorBody);

    expect(isValid).toBe(true);
    expect(errorBody).toHaveProperty('error');
    expect(errorBody).toHaveProperty('message');
  });
});
```

**Why this is GOOD:**
- Uses JSON Schema for STRICT validation
- Tests EXACT contract from constellation (required fields, types, values)
- Detects breaking changes automatically (compares against v1.0)
- Tests backward compatibility (old clients still work)
- Tests error contracts too
- Fails on any contract violation
- Documents contract version

---

❌ BAD contract test (loose validation):

```typescript
describe('contract tests', () => {
  it('returns response', () => {
    const res = { status: 'queued', message: 'test' };
    expect(res).toBeTruthy();
  });

  it('has fields', () => {
    const res = { status: 'queued' };
    expect(res.status).toBeDefined();
  });
});
```

**Why this is BAD:**
- No schema validation (loose)
- Doesn't test EXACT contract
- No breaking change detection
- toBeTruthy is too vague
- Doesn't test required fields
- Doesn't validate types
- Doesn't test backward compatibility
- Would miss contract violations

---

✅ GOOD contract test for consumer (API client):

```typescript
describe('StripeClient - Stripe API Star Contract Compliance', () => {
  it('sends request matching Stripe API contract EXACTLY', async () => {
    // Constellation-map.md documents Stripe API request contract
    const expectedRequestSchema = {
      type: 'object',
      required: ['amount', 'currency'],
      properties: {
        amount: { type: 'integer', minimum: 1 },
        currency: { type: 'string', pattern: '^[a-z]{3}$' },
        source: { type: 'string' },
        description: { type: 'string' },
      },
    };

    const validator = ajv.compile(expectedRequestSchema);

    const client = new StripeClient(mockStripeAPI);

    // Spy on outgoing request
    const requestSpy = jest.spyOn(mockStripeAPI, 'post');

    // Act: Make API call
    await client.createCharge({
      amount: 1000,
      currency: 'usd',
      source: 'tok_visa',
    });

    // Assert: Request body matches Stripe contract EXACTLY
    const sentRequest = requestSpy.mock.calls[0][1]; // Request body
    const isValid = validator(sentRequest);

    expect(isValid).toBe(true);

    // Assert: Required fields sent
    expect(sentRequest).toHaveProperty('amount');
    expect(sentRequest).toHaveProperty('currency');

    // Assert: Types correct
    expect(typeof sentRequest.amount).toBe('number');
    expect(typeof sentRequest.currency).toBe('string');
    expect(sentRequest.currency).toMatch(/^[a-z]{3}$/); // ISO currency code
  });

  it('handles Stripe API response contract changes', async () => {
    // Load Stripe API contract version from constellation
    const stripeContractV1 = loadContract('stripe-api-v2023-10-16');

    const client = new StripeClient(mockStripeAPI);

    // Mock Stripe response
    mockStripeAPI.post.mockResolvedValue({
      id: 'ch_123',
      object: 'charge',
      amount: 1000,
      currency: 'usd',
      status: 'succeeded',
    });

    // Act: Process Stripe response
    const result = await client.createCharge({ amount: 1000, currency: 'usd' });

    // Assert: Can parse Stripe response per contract
    expect(result.id).toMatch(/^ch_/);
    expect(result.object).toBe('charge');

    // If this fails, Stripe changed their contract (need to update)
  });
});
```

**Why this is GOOD:**
- Tests outgoing request matches external API contract
- Uses schema validation for EXACT match
- Tests handling of external API contract
- Would catch if we send wrong format to Stripe
</examples>
