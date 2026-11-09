---
# === Identity ===
id: code-generation-plan
name: Create implementation plan for code generation shaped by constellation context
version: v1

# === Classification ===
chapter: 3
category: architecture

tags:
  - architecture
  - implementation
  - code-generation
  - planning
  - constellation

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Create implementation plan for code generation shaped by constellation context.
    After implementation sketches, before writing code for a specific gap.
  argument-hint: "[system_name] [gap_to_implement]"
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
  - name: system_name
    description: The name of your system
    example: "Payment Processing System"
    maps-to: "$0"
  - name: gap_to_implement
    description: The specific gap from gap analysis to implement
    example: "API Rate Limiter Between Gateway and Stripe API"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 3
    description: |
      Create detailed implementation plan before writing code
    preview: |
      "Create a detailed implementation plan for \"{{gap_to_implement}}\" in {{system_name}} that is shaped by constellation context, not generic patterns. When filling gaps, AI-assisted development works best with a detailed plan that bridges design and code..."
  website:
    include: true
    path: /prompts/code-generation-plan
  marketplace:
    plugin: constellize:design

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Create a detailed implementation plan for "{{gap_to_implement}}" in {{system_name}} that is shaped by constellation context, not generic patterns.

When filling gaps, AI-assisted development works best with a detailed plan that bridges design and code. This plan describes what to build, how it integrates with constellation stars, and what patterns to follow—but stops short of writing the actual code. The plan ensures code generation (whether by AI or humans) stays grounded in constellation knowledge.

Follow this process:

1. **Review shaping knowledge:**
   - Read implementation sketch for {{gap_to_implement}} from `construction/design/implementation-sketches.md`
   - Read constellation map at `construction/requirements/constellation-map.md` for stars this connects to
   - Read gap analysis at `construction/requirements/gap-analysis.md` for constraints and success criteria
   - Extract specific contracts, schemas, protocols from referenced stars

2. **Plan code structure:**
   - Identify files and modules to create
   - Define key functions/classes with signatures
   - Specify integration points with constellation stars
   - Document patterns to follow from existing stars

3. **Plan integration validation:**
   - Define test strategy for star integration points
   - Specify what failure modes to test
   - Map tests to gap success criteria

4. **Document constellation dependencies:**
   - Cite shaping knowledge throughout plan
   - Link to constellation map for star references
   - Reference gap analysis for constraints
   - Connect to sketch decisions
</task>

<context>
Gap to implement:
{{gap_to_implement}}

**Standard Construction Folder Structure:**
This prompt reads from:
- `construction/requirements/constellation-map.md` (star catalog)
- `construction/requirements/gap-analysis.md` (identified gaps)
- `construction/design/implementation-sketches.md` (design approaches)

And outputs a detailed implementation plan shaped by this constellation knowledge.
</context>

<thinking>
Before creating the plan, analyze:
1. What shaping knowledge from the constellation map applies to this gap?
2. What contracts, schemas, protocols must the code integrate with?
3. What patterns from existing stars should the code follow?
4. What files, functions, and structures are needed?
5. How will we validate integration with stars?
</thinking>

<output-format>
Format your output as `construction/design/code-generation-plan-<slug>.md`, where `<slug>` names the gap:

**The plan's filename.** `<slug>` is the gap name lowercased, with every character that is not a letter, a digit or a hyphen replaced by a hyphen and any leading or trailing hyphens removed. Take the gap name from `{{gap_to_implement}}` when it was supplied as an argument, and otherwise from **the gap the caller described inline** — a delegated skill is invoked by name and receives no positional arguments at all, so an absent argument does not mean an absent gap, and this skill is normally reached by delegation. **One plan per gap is the point of the per-gap filename:** `constellize-feature:implement` invokes this skill once for each gap worth planning and reads each plan back, so two gaps must never slug to the same name, and a plan must never overwrite another gap's. Only when no gap can be identified at all does the plan go to the fixed path `construction/design/code-generation-plan.md` — a name the harness assessor already recognises alongside the per-gap one — and then say in the session that the gap was unnamed. Never write a filename containing a literal `$1`, a `$` followed by a digit, or any character the slug rule removes — a colon, for instance. A placeholder surviving into a path means the gap name was taken from the wrong place, not that there was no gap.

# Code Generation Plan: {{gap_to_implement}}

## Overview

**Gap Being Addressed:** {{gap_to_implement}}
**System:** {{system_name}}
**Sketch Reference:** [Section from implementation-sketches.md]

**Shaping Knowledge Sources:**
- Constellation map: `construction/requirements/constellation-map.md`
- Gap analysis: `construction/requirements/gap-analysis.md`
- Implementation sketch: `construction/design/implementation-sketches.md`

---

## Component 1: [Component Name]

### Purpose
[What this component does, referencing gap analysis]

### Constellation Context
**Implements:** [Gap name from gap analysis]
**Sketch Reference:** [Specific section in implementation-sketches.md]

**Stars This Integrates With:**
- **[Star Name]** (from constellation-map.md)
  - Uses: [Specific contract/API/protocol]
  - Integration point: [Specific interface]
  - Pattern to follow: [Naming/auth/error pattern from this star]

- **[Star Name]** (from constellation-map.md)
  - Uses: [Specific capability]
  - Integration point: [Interface]
  - Pattern to follow: [Pattern from this star]

### File Structure

**File:** `[path/to/component.ext]`

**Purpose:** [What this file does]

**Key Imports/Dependencies:**
- [Star package/module]: [Why we need it]
- [Other dependency]: [Justification from constellation]

### Function/Class Signatures

#### Function: `[functionName]`
**Purpose:** [What it does]
**Signature:**
```
function functionName(
  param1: Type1,  // From [Star Name] contract
  param2: Type2   // Shaped by [constraint from gap analysis]
): ReturnType     // Matches [Star Name] pattern
```

**Implementation Approach:**
- Step 1: [Action] using [Star Name]'s [capability]
- Step 2: [Action] following [Star Name]'s [pattern]
- Step 3: [Action] to satisfy [constraint from gap analysis]

**Error Handling:**
- [Error case 1]: [How to handle, following Star pattern]
- [Error case 2]: [How to handle, per constellation map]

**Constellation Patterns to Follow:**
- Naming: [Pattern from Star] (e.g., "verbNoun" from API Gateway star)
- Auth: [Pattern from Star] (e.g., "JWT bearer tokens" from Auth star)
- Errors: [Pattern from Star] (e.g., "return 202 for async" from Gateway star)

#### Class: `[ClassName]`
**Purpose:** [What it manages]
**Signature:**
```
class ClassName {
  // Properties shaped by constellation
  private starClient: StarClient;  // From [Star Name]

  // Methods following star patterns
  public methodName(params): ReturnType;
}
```

**Implementation Approach:**
[Describe class structure and key methods]

### Data Structures

**Interface/Type:** `[InterfaceName]`
```
interface InterfaceName {
  field1: Type1;  // From [Star Name] schema
  field2: Type2;  // Matches [Star Name] contract
}
```

**Alignment with Constellation:**
- This structure aligns with [Star Name]'s [schema/contract]
- Field names follow [Star Name]'s [naming convention]

### Integration Points

**Input:**
- Receives: [Data type/format from Star A]
- Via: [Protocol/interface from constellation map]
- Example: [Concrete example from constellation]

**Output:**
- Produces: [Data type/format for Star B]
- Via: [Protocol/interface from constellation map]
- Example: [Concrete example from constellation]

**Side Effects:**
- Updates [Star C] via [mechanism from constellation]
- Triggers [event/callback per Star pattern]

### Constraints Shaping This Implementation

**From Gap Analysis:**
- [Constraint 1 with reference to gap-analysis.md]
- [Constraint 2 with reference]
- [Constraint 3 with reference]

**From Constellation Stars:**
- [Star Name]: [Constraint, e.g., "30s timeout"]
- [Star Name]: [Constraint, e.g., "100 req/sec limit"]

**These Constraints Mean:**
- Implementation choice 1: [Rationale]
- Implementation choice 2: [Rationale]

---

## Component 2: [Next Component Name]

[Repeat structure for each component from sketch]

---

## Test Strategy

### Integration Tests

**Purpose:** Validate integration with constellation stars

**Test File:** `[path/to/component.test.ext]`

#### Test 1: Integration with [Star Name]
**What to Test:**
- [Component] correctly uses [Star]'s [specific API/contract]
- [Specific behavior from constellation map]

**Test Approach:**
```
describe('[Component] integration with [Star Name]', () => {
  it('uses [Star API] as documented in constellation-map.md', () => {
    // Setup: [How to mock/setup Star]
    // Action: [What to test]
    // Assert: [Expected behavior from constellation map]
  });
});
```

**Success Criteria:**
- Validates [success criterion from gap analysis]
- Confirms [integration point from constellation map]

#### Test 2: Failure Mode from [Star Name]
**What to Test:**
- [Component] handles [Star]'s [documented failure mode]
- [Expected behavior from constellation map]

**Test Approach:**
```
describe('handles [Star Name] failure', () => {
  it('gracefully handles [failure mode] per constellation-map.md', () => {
    // Setup: Mock failure scenario from constellation
    // Action: Trigger failure
    // Assert: Expected degradation per sketch decision
  });
});
```

**Success Criteria:**
- Validates [constraint from gap analysis]
- Confirms [failure handling from constellation map]

### Success Criteria Validation

Map each test to gap analysis success criteria:

- [ ] Success Criterion 1 (from gap-analysis.md): [Test that validates this]
- [ ] Success Criterion 2: [Test that validates this]
- [ ] Success Criterion 3: [Test that validates this]

---

## Implementation Checklist

### Constellation Alignment
- [ ] All star references cite constellation-map.md sections
- [ ] All patterns follow documented star conventions
- [ ] All integration points match constellation contracts
- [ ] All constraints from gap-analysis.md are addressed

### Code Structure
- [ ] File structure aligns with sketch decisions
- [ ] Function signatures follow star patterns
- [ ] Data structures match star schemas
- [ ] Error handling follows star patterns

### Testing
- [ ] Tests cover integration with each star
- [ ] Tests validate failure modes from constellation
- [ ] Tests map to gap success criteria
- [ ] Test strategy is executable (not vague)

### Documentation
- [ ] Every component cites constellation context
- [ ] Every pattern choice references a star
- [ ] Every constraint traces to gap analysis
- [ ] Plan is detailed enough for code generation

---

## Code Generation Guidance

When generating code from this plan:

**ALWAYS:**
- Include CONSTELLATION CONTEXT comment block at file top
- Cite specific stars and constellation-map.md sections
- Follow patterns exactly as specified in plan
- Use actual types/interfaces from star contracts
- Include integration tests as specified

**NEVER:**
- Generate generic code without constellation context
- Invent interfaces not documented in constellation
- Skip constellation citation comments
- Deviate from patterns without justification
- Generate code without corresponding tests

**CRITICAL:** Every generated file must cite:
1. Which gap it implements (from gap-analysis.md)
2. Which stars it integrates with (from constellation-map.md)
3. Which constraints shape it (from gap-analysis.md)
4. Which sketch decisions it follows (from implementation-sketches.md)
</output-format>

<instructions>
CRITICAL: Create a detailed plan, not generic "TODO" lists. Be specific about what to build and how it integrates with stars.

NEVER create plans that:
- Reference stars not in constellation map
- Use generic interfaces without star grounding
- Skip specifying function signatures
- Ignore constellation patterns
- Lack concrete integration details
- Forget to cite shaping knowledge

DO NOT:
- Write actual implementation code (this is a plan, not code)
- Create vague "implement X" tasks without detail
- Skip constellation context documentation
- Assume integration points without checking stars
- Forget to map tests to success criteria

ALWAYS:
- Read all three source documents before planning
- Specify exact functions/classes needed
- Define signatures shaped by star contracts
- Document which star patterns to follow
- Plan integration tests for each star
- Cite constellation map throughout
- Make plan detailed enough for straightforward code generation
- Connect every decision to constellation knowledge

REPEAT: This is a plan FOR code generation, not the code itself. Be detailed about WHAT to build and HOW it integrates, but stop short of writing actual code.
</instructions>

<examples>
✅ Good implementation plan:

## Component: RateLimitMiddleware

### Purpose
Express middleware that intercepts requests and enforces Stripe API rate limits (100 req/sec) by queuing overflow requests.

### Constellation Context
**Implements:** Gap 1 "API Rate Limiter Between Gateway and Stripe API" (gap-analysis.md)
**Sketch Reference:** implementation-sketches.md, Sketch 1

**Stars This Integrates With:**
- **API Gateway** (constellation-map.md, section "API Gateway Star")
  - Uses: Express middleware chain (req, res, next)
  - Integration point: Middleware function signature
  - Pattern to follow: Middleware naming convention (verbNounMiddleware)

- **Redis Cache** (constellation-map.md, section "Redis Cache Star")
  - Uses: Sorted sets (ZADD, ZPOPMIN) for distributed queue
  - Integration point: ioredis client from app.locals
  - Pattern to follow: Connection pooling pattern

- **Stripe API** (constellation-map.md, section "Stripe API Star")
  - Uses: Rate limit knowledge (100 req/sec hard limit)
  - Integration point: Respects documented limits
  - Pattern to follow: Returns 202 Accepted for queued requests (Gateway async pattern)

### File Structure

**File:** `src/middleware/rateLimitMiddleware.ts`

**Purpose:** Enforce rate limits before requests reach Stripe API

**Key Imports/Dependencies:**
- express: Types for Request, Response, NextFunction (from API Gateway star)
- ioredis: Redis client for queue management (from Redis Cache star)

### Function Signatures

#### Function: `rateLimitMiddleware`
**Purpose:** Check current rate, queue if over limit, or allow through
**Signature:**
```typescript
export async function rateLimitMiddleware(
  req: Request,      // Express types from API Gateway star
  res: Response,     // Express types
  next: NextFunction // Express middleware pattern
): Promise<void>     // Async per Gateway star convention
```

**Implementation Approach:**
- Step 1: Get Redis client from req.app.locals (per Redis Cache star pooling pattern)
- Step 2: Check current request count using ZCOUNT (Redis Cache star: sorted sets)
- Step 3: If count >= 100 (Stripe API star limit):
  - Queue using ZADD with timestamp (Redis Cache star)
  - Store request context with SETEX (2sec TTL per gap constraint)
  - Return 202 Accepted (API Gateway star async pattern)
- Step 4: Otherwise track request and call next() (Gateway star middleware pattern)

**Error Handling:**
- Redis connection failure: Fail open, call next(), log warning (sketch decision: graceful degradation)
- ZADD failure: Return 503, don't proceed (can't guarantee rate limit)

**Constellation Patterns to Follow:**
- Naming: verbNounMiddleware (from API Gateway star)
- Auth: Inherits from upstream Gateway middleware (no auth needed here)
- Errors: 202 for queued, 503 for failures (API Gateway star async patterns)
- Redis: Use existing connection pool (Redis Cache star: "never create new connections in middleware")

### Data Structures

**Type:** `QueuedRequest`
```typescript
interface QueuedRequest {
  body: any;           // Preserves req.body structure
  headers: Record<string, string>;  // HTTP headers per Gateway star
  timestamp: number;   // For queue ordering (Redis sorted set score)
}
```

**Alignment with Constellation:**
- Structure matches API Gateway star's Request interface
- Serializable for Redis storage (Redis Cache star requirement)

### Integration Points

**Input:**
- Receives: HTTP Request object from Express (API Gateway star)
- Via: Middleware chain (req, res, next pattern)
- Example: POST /api/stripe/charge with JSON body

**Output:**
- Success: Calls next() to continue middleware chain (Gateway star)
- Queued: Returns 202 Accepted with JSON body (Gateway star async pattern)
- Example response: `{ status: 'queued', message: 'Request queued due to rate limit' }`

**Side Effects:**
- Updates Redis sorted set 'stripe:requests' (Redis Cache star)
- Updates Redis key-value store for queued requests (Redis Cache star)
- Respects connection pool limits (Redis Cache star: max 10 connections)

### Constraints Shaping This Implementation

**From Gap Analysis:**
- Must handle 500 req/sec peak load (gap-analysis.md, Gap 1)
  - **Means:** Can't block on queue operations, must be fast
- Stripe enforces 100 req/sec limit (gap-analysis.md, Gap 1)
  - **Means:** Hard check at count >= 100
- Queueing delay <2 seconds acceptable (gap-analysis.md, Gap 1)
  - **Means:** SETEX with 120sec TTL, queue processor drains every 100ms
- Must integrate with existing Redis instance (gap-analysis.md, Gap 1)
  - **Means:** Use req.app.locals.redisClient, no new connections

**From Constellation Stars:**
- API Gateway: 30s request timeout (constellation-map.md)
  - **Means:** Must respond within 30s (202 is immediate)
- Redis Cache: Connection pooling with max 10 connections (constellation-map.md)
  - **Means:** Reuse connections, never create new ones
- Stripe API: 100 req/sec hard limit, returns 429 on violations (constellation-map.md)
  - **Means:** Must prevent 429s by queuing at 100

---

## Test Strategy

### Integration Tests

**Test File:** `src/middleware/rateLimitMiddleware.test.ts`

#### Test 1: Integration with Redis Cache Star
**What to Test:**
- Middleware correctly uses Redis sorted sets as documented in constellation-map.md
- ZADD and ZCOUNT operations follow Redis Cache star patterns

**Test Approach:**
```typescript
describe('rateLimitMiddleware - Redis Cache Integration', () => {
  it('uses Redis sorted sets as documented in constellation-map.md', async () => {
    // Setup: Real Redis instance (or ioredis-mock)
    const redis = new Redis();
    const req = mockRequest({ app: { locals: { redisClient: redis } } });

    // Action: Call middleware
    await rateLimitMiddleware(req, res, next);

    // Assert: Sorted set updated correctly
    const count = await redis.zcount('stripe:requests', '-inf', '+inf');
    expect(count).toBe(1);

    // Cleanup
    await redis.del('stripe:requests');
  });
});
```

**Success Criteria:**
- Validates integration with Redis Cache star's sorted sets
- Confirms ZADD/ZCOUNT usage per constellation-map.md

#### Test 2: Failure Mode from API Gateway Star
**What to Test:**
- Middleware returns 202 when rate limit hit (Gateway async pattern)
- Request queued in Redis per sketch decision

**Test Approach:**
```typescript
describe('rate limit enforcement', () => {
  it('returns 202 Accepted when limit reached per Gateway async pattern', async () => {
    // Setup: Simulate 100 existing requests
    const redis = mockRedis();
    await redis.zadd('stripe:requests', ...Array(100).fill(Date.now()));

    const req = mockRequest({ app: { locals: { redisClient: redis } } });
    const res = mockResponse();

    // Action: Call middleware at limit
    await rateLimitMiddleware(req, res, next);

    // Assert: 202 response (API Gateway async pattern from constellation-map.md)
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      status: 'queued',
      message: 'Request queued due to rate limit'
    });

    // Assert: Request queued (sketch decision)
    const queueDepth = await redis.zcount('stripe:queue', '-inf', '+inf');
    expect(queueDepth).toBe(1);
  });
});
```

**Success Criteria:**
- Validates gap success criterion: "Handles 500 req/sec without dropping"
- Confirms API Gateway star's 202 async pattern
- Validates sketch decision to queue overflow

### Success Criteria Validation

- [ ] Handles 500 req/sec without dropping requests (Test: "handles high load")
- [ ] Maintains 100 req/sec limit to Stripe (Test: "enforces rate limit")
- [ ] Queue delay <2 seconds at 90th percentile (Test: "queue performance")
- [ ] Graceful degradation if Redis unavailable (Test: "Redis failure handling")

---

❌ Bad implementation plan:

## Component: RateLimiter

### Purpose
Add rate limiting

### Implementation
- Create a rate limiter middleware
- Use Redis for state
- Return errors when limit hit

### Testing
- Test that it works
- Test edge cases

[This is wrong because:]
- No constellation context (which stars? which contracts?)
- No function signatures (what does "create middleware" mean?)
- No specific patterns to follow (generic "use Redis")
- No integration details (how does it connect to stars?)
- Vague testing ("test that it works" - test what specifically?)
- No citations to constellation map or gap analysis
- Not detailed enough for code generation

---

✅ Good function signature specification:

#### Function: `queueRequest`
**Purpose:** Store request in Redis queue for deferred processing
**Signature:**
```typescript
async function queueRequest(
  redis: Redis,                    // From Redis Cache star
  requestKey: string,              // Format: `stripe:ratelimit:${timestamp}`
  requestData: QueuedRequest,      // Structure defined above
  ttl: number = 120                // 2sec per gap constraint
): Promise<void>
```

**Implementation Approach:**
1. Serialize requestData to JSON (Redis Cache star requires string values)
2. Call redis.zadd('stripe:queue', Date.now(), requestKey) - sorted by timestamp
3. Call redis.setex(requestKey, ttl, JSON.stringify(requestData)) - store data
4. Both operations succeed or function throws (no partial state)

**Error Handling:**
- Redis connection error: Throw (caller handles)
- Serialization error: Log and throw with context
- ZADD failure: Clean up SETEX if possible, throw

**Why These Choices:**
- Sorted set for queue: Redis Cache star documents ZADD/ZPOPMIN for ordered queues
- Separate key-value storage: Can't store complex data in sorted set scores
- 120sec TTL: Gap analysis allows <2s delay, 120s gives buffer for processing

[This is good because:]
- Exact signature with types from constellation stars
- Detailed implementation steps referencing star capabilities
- Error handling follows star patterns
- Every choice justified with constellation reference
- Concrete examples (key format, redis commands)

---

❌ Bad function specification:

#### Function: `queueRequest`
**Purpose:** Queue the request
**Signature:**
```
function queueRequest(data): Promise
```

**Implementation:**
- Store in queue
- Return promise

[This is wrong because:]
- No type information (what is 'data'? What Promise type?)
- No constellation context (queue where? Using what?)
- Vague steps ("store in queue" - how?)
- No error handling
- No justification for choices
- Not implementable without major assumptions
</examples>
