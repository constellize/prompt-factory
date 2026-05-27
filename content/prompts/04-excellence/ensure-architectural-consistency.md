---
# === Identity ===
id: ensure-architectural-consistency
name: Ensure architectural consistency by following established patterns from memory bank
version: v1

# === Classification ===
chapter: 4
category: excellence
subcategory: gate-4
tags:
  - quality
  - architecture
  - consistency
  - patterns
  - gate-4

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Ensure architectural consistency by following established patterns from memory bank.
    Validating that code follows constellation patterns (Gate 4: Maintainability in Context).
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
    description: The specific component to ensure architectural consistency for
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
      **Ensure architectural consistency** by following established patterns documented in your memory bank. Code should use consistent naming conventions across the constellation, making it easy to navigate between components. Standard error handling and logging patterns reduce surprises and make debugging predictable. Authentication and authorization approaches should match existing implementations, avoiding unnecessary variation that increases cognitive load.
    preview: |
      "...review established patterns from memory-bank/systemPatterns.md. Apply naming conventions consistently. Implement standard error handling and logging patterns..."
  website:
    include: true
    path: /prompts/ensure-architectural-consistency
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Ensure architectural consistency for {{component_name}} in {{system_name}} by following established patterns documented in your memory bank.

Code should use consistent naming conventions across the constellation, making it easy to navigate between components. Standard error handling and logging patterns reduce surprises and make debugging predictable. Authentication and authorization approaches should match existing implementations, avoiding unnecessary variation that increases cognitive load.

Follow this process:

1. **Review established patterns:**
   - Read system patterns from `memory-bank/systemPatterns.md`
   - Read constellation map from `construction/requirements/constellation-map.md`
   - Extract naming conventions, error handling patterns, logging standards
   - Identify authentication/authorization patterns used by other stars

2. **Apply naming conventions:**
   - Use consistent names for similar concepts (Customer vs User vs Account)
   - Follow established casing conventions across codebase
   - Match database naming patterns (singular vs plural)
   - Align API endpoint naming schemes

3. **Implement standard error handling:**
   - Use consistent error response format across APIs
   - Follow established error codes and messages
   - Match exception/error hierarchy
   - Apply retry and timeout patterns consistently

4. **Match logging patterns:**
   - Use same logging library and configuration
   - Follow structured logging format
   - Apply consistent log levels
   - Include standard context fields

5. **Align authentication/authorization:**
   - Use same authentication mechanism
   - Follow established authorization patterns
   - Match token validation approaches
   - Apply consistent security policies
</task>

<context>
Component to ensure consistency:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from:
- `memory-bank/systemPatterns.md` (established patterns)
- `construction/requirements/constellation-map.md` (other components)
- Existing component implementations (for pattern reference)

And validates/updates the component to match patterns.
</context>

<thinking>
Before ensuring consistency, analyze:
1. What patterns are documented in the memory bank?
2. What naming conventions do other components use?
3. What error handling approaches exist in the system?
4. What logging format and levels are standard?
5. How do other components handle authentication?
</thinking>

<output-format>
## Naming Consistency Pattern

**Method:** Extract and apply naming conventions from existing components

**Convention Discovery:**
1. Review constellation map for similar components
2. Identify common naming patterns:
   - Entity names (Customer, User, Account - choose ONE)
   - Operation names (get/fetch/retrieve, create/add/insert - choose ONE)
   - Field names (customerId vs customer_id vs CustomerID - choose ONE)

**Application:**
- Class/Type names: Match casing convention (PascalCase, snake_case, etc.)
- Function/Method names: Match verb conventions
- Variable names: Match field conventions
- Database tables: Match singular/plural convention
- API endpoints: Match resource naming and versioning scheme

**Validation:**
Search codebase for naming pattern violations and create consistency checklist.

---

## Error Handling Consistency Pattern

**Method:** Standardize error representation and propagation

**Error Structure Pattern:**
Define standard error object with:
- Machine-readable code (e.g., "RESOURCE_NOT_FOUND")
- Human-readable message
- HTTP status code (for APIs)
- Additional context/details object
- Consistent serialization format

**Error Code Convention:**
Establish consistent format across constellation:
- Pattern: `RESOURCE_ACTION` or `DOMAIN_ERROR_TYPE`
- Examples: `CUSTOMER_NOT_FOUND`, `PAYMENT_DECLINED`, `INVALID_INPUT`
- Never: Generic codes, HTTP codes as error codes, inconsistent casing

**Error Response Format:**
```
Standardized error response structure:
{
  "error": {
    "code": "[MACHINE_READABLE_CODE]",
    "message": "[Human readable description]",
    "statusCode": [HTTP_STATUS],
    "details": {
      "[relevant_field]": "[context_value]"
    }
  }
}
```

**Implementation Approach:**
1. Create standard error representation in your language
2. Extend/wrap language-native exceptions
3. Centralize error-to-HTTP-response mapping
4. Apply consistently across all components

---

## Logging Consistency Pattern

**Method:** Structured logging with standard context fields

**Structured Logging Approach:**
- Use key-value pairs or structured objects (not string templates)
- Serialize to JSON or similar structured format
- Enable filtering and aggregation across services

**Standard Context Fields:**
Required in all logs:
- `timestamp`: When event occurred
- `level`: debug/info/warn/error
- `requestId`: Trace requests across services
- `component`: Which component generated log
- `action`: What operation was being performed

Resource-specific:
- `customerId`, `paymentId`, etc.: Relevant entity IDs
- `duration`: Performance metrics
- `metadata`: Additional context specific to operation

**Log Level Conventions:**
- DEBUG: Detailed information for diagnosing problems
- INFO: Normal operational events (requests, completions)
- WARN: Degraded state or unexpected but handled conditions
- ERROR: Failures requiring investigation

**Secret Handling:**
Always redact sensitive data:
- Passwords, tokens, API keys
- Credit card numbers, SSNs
- Personal information based on privacy requirements

---

## Authentication/Authorization Consistency Pattern

**Method:** Centralize auth logic and apply uniformly

**Authentication Pattern:**
1. Choose ONE authentication mechanism constellation-wide:
   - Token-based (JWT, OAuth tokens)
   - Session-based
   - Certificate-based
   - API key-based

2. Centralize token/credential validation:
   - Create shared authentication module
   - All components use same validation logic
   - Consistent token parsing and error handling

3. Standard authentication flow:
   - Extract credentials from request
   - Validate credentials
   - Build authentication context
   - Make context available to handlers

**Authorization Pattern:**
1. Choose ONE authorization model:
   - Role-Based Access Control (RBAC)
   - Attribute-Based Access Control (ABAC)
   - Permission-Based

2. Centralize authorization decisions:
   - Define roles/permissions in one place
   - Create reusable authorization checks
   - Consistent HTTP status codes (401 vs 403)

**Security Policy Consistency:**
- Same TLS/SSL requirements
- Same CORS policies
- Same rate limiting approaches
- Same security headers

---

## Pattern Validation Checklist

Create checklist to validate consistency:

**Naming:**
- [ ] Entity names match across code, API, database
- [ ] Casing convention applied consistently
- [ ] Operation names use same verbs
- [ ] No synonyms for same concept

**Errors:**
- [ ] Error codes follow constellation format
- [ ] Error responses have consistent structure
- [ ] HTTP status codes used consistently
- [ ] All errors include troubleshooting context

**Logging:**
- [ ] All logs include standard context fields
- [ ] Log levels used appropriately
- [ ] Structured format applied consistently
- [ ] Secrets redacted from logs

**Auth:**
- [ ] Authentication mechanism matches constellation
- [ ] Authorization model matches constellation
- [ ] Shared auth modules used
- [ ] Security policies applied consistently

**Deviations:**
- [ ] Any deviations documented with rationale
- [ ] Team approval obtained for deviations
- [ ] New patterns added to memory bank
</output-format>

<instructions>
CRITICAL: Architectural consistency reduces cognitive load and makes the system approachable.

NEVER ensure consistency by:
- Creating new patterns when established ones exist (unnecessary variation)
- Using different names for the same concept (cognitive overhead)
- Implementing different error formats per component (unpredictable behavior)
- Using multiple logging formats (hard to aggregate and search)
- Mixing authentication approaches (security complexity)
- Ignoring memory bank patterns (losing institutional knowledge)

DO NOT:
- Introduce new naming conventions without team agreement
- Use ad-hoc error codes without documented format
- Skip structured logging in favor of string templates
- Implement custom auth when shared module exists
- Deviate from patterns without documenting rationale
- Forget to update memory bank when patterns evolve

ALWAYS:
- Read memory bank systemPatterns.md before implementation
- Use consistent naming across the constellation
- Follow standard error response format
- Apply structured logging with standard context
- Use shared authentication/authorization modules
- Document any pattern deviations with rationale
- Update memory bank when new patterns emerge
- Validate consistency with checklist
- Review other components for pattern reference
- Ask team before introducing new patterns

REPEAT: Consistency reduces cognitive load. Follow memory bank patterns. Use same names for same concepts. Standard errors, logging, auth. Document deviations.
</instructions>

<examples>
✅ GOOD naming consistency (same concept, same name everywhere):

**Pattern: Use "Customer" across constellation**

Code: Class/Type named `Customer`, function `getCustomer(customerId)`
API: Endpoint `/api/v1/customers/:customerId`
Database: Table `customers`, column `customer_id`
Logs: Field `customerId: "cust-123"`

**Why this is GOOD:**
- ONE name for the concept (not Customer/User/Account/Client)
- Consistent casing applied to convention
- Easy to grep/search across codebase
- Navigate from API → code → database seamlessly
- No cognitive translation required

---

❌ BAD naming inconsistency (confusing mix):

**Anti-pattern: Multiple names for same concept**

Code: Class `UserService`, function `getAccount(customer_id)`
API: Endpoint `/users/:id`
Database: Table `customer`, column `CustomerID`
Logs: Field `clientId: "usr-123"`

**Why this is BAD:**
- Four different names (User/Account/Customer/Client)
- Mixed casing (customer_id vs CustomerID)
- Can't search consistently
- Hard to navigate between layers
- Constant mental translation required

---

✅ GOOD error handling consistency (predictable structure):

**Pattern: Standard error object with code, message, context**

Error representation:
- Code: "CUSTOMER_NOT_FOUND" (machine-readable, RESOURCE_ACTION format)
- Message: "Customer with ID 12345 not found" (human-readable)
- Status: 404 (HTTP semantic)
- Details: {"customerId": "12345"} (troubleshooting context)

Serialized format:
```
{
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer with ID 12345 not found",
    "statusCode": 404,
    "details": {"customerId": "12345"}
  }
}
```

**Why this is GOOD:**
- Predictable structure across all APIs
- Machine-readable codes enable programmatic handling
- Human-readable messages for debugging
- Context aids troubleshooting
- Same format whether DB error, validation error, or business logic error

---

❌ BAD error handling inconsistency (unpredictable):

**Anti-pattern: Different error formats per component**

Component A: Plain text response `"Not found"`
Component B: Object `{"error": "customer_not_found"}`
Component C: Object `{"errorCode": 404, "errorMessage": "Missing"}`

**Why this is BAD:**
- Cannot write consistent error handling in clients
- Mix of text and JSON
- Inconsistent field names
- No context for debugging
- Different components feel like different systems

---

✅ GOOD logging consistency (searchable, aggregatable):

**Pattern: Structured logs with standard context fields**

Log entry structure:
```
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "requestId": "req-123",
  "component": "CustomerService",
  "action": "createCustomer",
  "customerId": "cust-456",
  "duration": 45,
  "message": "Customer created",
  "metadata": {
    "plan": "enterprise",
    "region": "us-west-2"
  }
}
```

**Why this is GOOD:**
- Structured format enables filtering: `level=error AND component=CustomerService`
- Standard fields across all components
- Performance tracking via duration
- Request tracing via requestId
- Easy to build dashboards and alerts

---

❌ BAD logging inconsistency (unsearchable):

**Anti-pattern: Mixed string templates and formats**

Component A: `console.log("Customer created: cust-456")`
Component B: `logger.info("Created customer ${id} in ${time}ms")`
Component C: `log.write({msg: "Customer created", id: customerId})`

**Why this is BAD:**
- Can't search for all "customer created" logs
- Can't filter by level, component, or action
- Can't extract metrics (duration, error rate)
- Can't correlate logs across services (no requestId)
- Different formats prevent aggregation

---

✅ GOOD auth/authz consistency (centralized, uniform):

**Pattern: Shared authentication module and authorization model**

Authentication flow:
1. Extract credentials from request (Authorization header, session cookie, etc.)
2. Call shared `validateCredentials(credentials)` function
3. Build authentication context with userId, roles, permissions
4. Make context available to request handlers

Authorization checks:
- Centralized: `requirePermission("customer:write")` or `requireRole("admin")`
- Used consistently across all protected endpoints
- Same HTTP semantics: 401 for auth failure, 403 for authz failure

**Why this is GOOD:**
- ONE authentication implementation
- Bugs fixed in one place benefit all components
- Security policies enforced uniformly
- Consistent HTTP semantics
- Easy to audit access control

---

❌ BAD auth/authz inconsistency (security complexity):

**Anti-pattern: Each component implements own auth**

Component A: JWT validation with library X
Component B: Session cookies with library Y
Component C: API keys with custom validation
Component D: No authentication

**Why this is BAD:**
- Multiple implementations mean multiple attack surfaces
- Inconsistent security posture
- Bug fixes must be applied to each component separately
- Hard to audit which components enforce what
- Confusing for API consumers (which auth method to use?)
</examples>
