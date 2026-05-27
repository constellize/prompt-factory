---
# === Identity ===
id: leverage-ai-assistance
name: Leverage AI assistance to accelerate quality engineering without sacrificing rigor
version: v1

# === Classification ===
chapter: 4
category: ai-workflow
subcategory: practices
tags:
  - quality
  - ai-assistance
  - test-generation
  - documentation
  - code-review
  - deployment
  - automation
  - best-practices
  - collaboration
  - validation

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Leverage AI assistance to accelerate quality engineering without sacrificing rigor.
    Use AI to generate tests, automate documentation, enforce quality, and accelerate deployment (Best Practices).
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
    description: The specific component to leverage AI assistance for
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
      **Leverage AI assistance** to accelerate quality engineering without sacrificing rigor. Generate comprehensive test suites that cover edge cases you might not have considered, automatically creating test data and mock configurations with descriptive names that serve as executable documentation. Automate documentation creation by generating clear code comments explaining complex business logic, comprehensive README files with setup instructions, and current API contracts with usage examples. Enforce code quality standards through AI-powered initial code reviews before human review, automatically refactoring code to match team conventions and generating consistent error handling patterns. Accelerate deployment readiness by generating container configurations, health check implementations, monitoring setups, and rollback procedures.
    preview: |
      "...generate test suites covering edge cases. Automate documentation creation. Enforce quality standards through AI-powered reviews. Accelerate deployment readiness..."
  website:
    include: true
    path: /prompts/leverage-ai-assistance
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Leverage AI assistance for {{component_name}} in {{system_name}} to accelerate quality engineering without sacrificing rigor.

Use AI to accelerate quality engineering while maintaining high standards. Generate comprehensive test suites that cover edge cases you might not have considered, automatically creating test data and mock configurations with descriptive names that serve as executable documentation. Automate documentation creation by generating clear code comments explaining complex business logic, comprehensive README files with setup instructions, and current API contracts with usage examples. Enforce code quality standards through AI-powered initial code reviews before human review, automatically refactoring code to match team conventions and generating consistent error handling patterns. Accelerate deployment readiness by generating Docker configurations, health check implementations, monitoring setups, and rollback procedures.

Follow this process:

1. **Generate comprehensive test suites:**
   - Use AI to create test cases covering edge cases not yet considered
   - Generate realistic test data and mock configurations automatically
   - Create descriptive test names that serve as executable documentation
   - Build integration test scenarios based on system architecture
   - Generate test assertions that validate business requirements

2. **Automate documentation creation:**
   - Generate clear code comments explaining complex business logic
   - Create comprehensive README files with setup instructions
   - Document API contracts and usage examples automatically
   - Maintain current architecture decision records
   - Generate troubleshooting guides and runbooks

3. **Enforce code quality standards:**
   - Use AI for initial code reviews before human review
   - Automatically refactor code to match team conventions
   - Generate consistent error handling and logging patterns
   - Ensure architectural compliance across components
   - Identify and suggest fixes for code smells and anti-patterns

4. **Accelerate deployment readiness:**
   - Generate container configurations and deployment scripts
   - Create comprehensive health check implementations
   - Build monitoring and alerting configurations
   - Generate rollback procedures and disaster recovery plans
   - Create deployment checklists and validation scripts
</task>

<context>
Component to leverage AI assistance:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates/updates:
- Generated test suites in appropriate test directories
- Documentation files (README.md, API docs, runbooks)
- Code quality configurations (linting, formatting)
- Deployment configurations (containers, scripts, monitoring)
- `docs/ai-assistance/` (guidelines for effective AI use)
</context>

<thinking>
Before leveraging AI assistance, analyze:
1. What quality engineering tasks are repetitive and time-consuming?
2. Where does AI add value vs where human judgment is essential?
3. What context does AI need to generate useful output?
4. How do we validate AI-generated content for correctness?
5. What team conventions must AI-generated code follow?
</thinking>

<output-format>
Create AI-assisted quality engineering workflow following these patterns:

**AI-Generated Test Suite Pattern:**

Use AI to accelerate test creation while maintaining quality:

**Effective AI Test Generation:**

1. **Provide Rich Context:**
   - Business requirements: What functionality should be tested
   - Edge cases: Boundary conditions and error scenarios
   - Existing patterns: Show examples of team's test style
   - Dependencies: What needs to be mocked
   - Success criteria: What constitutes passing tests

2. **Test Categories to Generate:**
   - Unit tests: Component behavior in isolation
   - Edge case tests: Boundary values, null handling, type mismatches
   - Error tests: Exception handling, failure modes
   - Integration tests: Component interactions
   - Property-based tests: Invariants that must always hold

3. **Test Data Generation:**
   - Valid test data: Realistic examples
   - Invalid test data: Common error cases
   - Edge case data: Boundary values, empty sets, large inputs
   - Mock data: Realistic API responses, database records
   - Fixture data: Reusable test setup data

**AI Test Generation Prompt Pattern:**
```
Context: [Component description and responsibility]

Requirements: [What the component must do]

Existing test example:
[Show 1-2 existing tests demonstrating team style]

Generate tests for:
1. Happy path: [Successful operation scenario]
2. Edge cases:
   - Empty input
   - Null values
   - Maximum size input
   - Invalid format input
3. Error handling:
   - Network timeout
   - Database unavailable
   - Invalid credentials
4. Integration:
   - [Component A] interacting with [Component B]

Test framework: [Framework name]
Mocking library: [Library name if applicable]
Team conventions:
- Use AAA pattern (Arrange-Act-Assert)
- Descriptive test names: "should_[expected behavior]_when_[condition]"
- One assertion per test
```

**Test Validation Pattern:**
```
Validate AI-generated tests:

1. Correctness check:
   ✓ Tests actually test stated behavior
   ✓ Assertions validate right things
   ✓ Edge cases are genuine edge cases
   ✓ Mocks are realistic
   ✓ Tests are independent (no shared state)

2. Quality check:
   ✓ Descriptive test names
   ✓ Follows team conventions
   ✓ Clear AAA structure
   ✓ No test smells (magic numbers, unclear assertions)
   ✓ Appropriate level of mocking

3. Coverage check:
   ✓ Happy path covered
   ✓ Edge cases covered
   ✓ Error paths covered
   ✓ Integration points tested
   ✓ Business rules validated

4. Execution check:
   ✓ All tests pass
   ✓ Tests run quickly
   ✓ No flakiness
   ✓ Meaningful failures
```

**Test Improvement Iteration:**
```
Iterate with AI to improve tests:

Round 1: Generate initial tests
→ Review for correctness

Round 2: "These tests don't cover [missing scenario]. Add tests for [specific case]."
→ AI generates additional tests

Round 3: "This test is unclear. Make the test name more descriptive and add comments."
→ AI improves clarity

Round 4: "These tests are too slow. Suggest optimizations."
→ AI recommends mocking or test parallelization

Final: Human review and approval
→ Tests merged to codebase
```

---

**AI-Automated Documentation Pattern:**

Use AI to keep documentation current:

**Documentation Types:**

1. **Code Comments:**
   - Why explanations: Business logic rationale
   - Complexity explanations: Non-obvious code
   - Edge case documentation: Special handling notes
   - Assumption documentation: What code assumes
   - Link references: Related code or decisions

2. **API Documentation:**
   - Endpoint purpose: What it does
   - Request/response schemas: Structure and types
   - Error responses: What errors mean
   - Usage examples: Common scenarios
   - Authentication requirements: How to authenticate

3. **README Documentation:**
   - Purpose statement: What component does
   - Setup instructions: How to get started
   - Usage examples: Common operations
   - Configuration options: Available settings
   - Troubleshooting: Common issues and solutions

4. **Architecture Documentation:**
   - Component responsibilities: What it handles
   - Integration points: Dependencies and consumers
   - Data flow: How data moves through system
   - Design decisions: Why built this way
   - Trade-offs: What was chosen and why

**AI Documentation Generation Prompt Pattern:**
```
Context: [Component description]

Code to document:
[Paste relevant code section]

Generate:
1. Code comments explaining:
   - Why this approach was chosen
   - What business rule this implements
   - What edge cases are handled
   - What assumptions are made

2. API documentation including:
   - Endpoint purpose
   - Request schema with examples
   - Response schema with examples
   - Error responses with codes
   - Authentication requirements

3. README section for:
   - Setup instructions (prerequisites, installation)
   - Usage examples (common operations)
   - Configuration (environment variables, settings)
   - Troubleshooting (common issues, solutions)

Style: [Concise / Detailed / Beginner-friendly]
Audience: [Developers / Operators / Users]
```

**Documentation Quality Pattern:**
```
Validate AI-generated documentation:

1. Accuracy check:
   ✓ Technically correct
   ✓ Code examples work
   ✓ Configuration accurate
   ✓ Links are valid
   ✓ Instructions are complete

2. Clarity check:
   ✓ Appropriate audience level
   ✓ Clear language
   ✓ Concrete examples
   ✓ No jargon without explanation
   ✓ Logical organization

3. Completeness check:
   ✓ All edge cases mentioned
   ✓ Error scenarios covered
   ✓ Prerequisites listed
   ✓ Troubleshooting included
   ✓ Related docs linked

4. Currency check:
   ✓ Reflects current code
   ✓ No outdated references
   ✓ Version-specific notes
   ✓ Recent changes documented
```

**Documentation Maintenance Pattern:**
```
Keep documentation current with AI:

Code change detected:
→ "Code changed: [summary of change]
   Current documentation: [existing docs]
   Update documentation to reflect these changes."

New feature added:
→ "New feature: [description]
   Generate documentation including:
   - Purpose and use case
   - Setup/configuration
   - Usage examples
   - Common pitfalls"

API changed:
→ "API change: [breaking/non-breaking]
   Update API documentation
   Generate migration guide if breaking"

Edge case added:
→ "New edge case handling: [description]
   Add comment explaining why needed
   Update troubleshooting docs"
```

---

**AI Code Quality Enforcement Pattern:**

Use AI for consistent code quality:

**Pre-Human Review AI Review:**

1. **Code Convention Check:**
   - Naming conventions: Variables, functions, classes
   - Code structure: File organization, function size
   - Style consistency: Formatting, patterns
   - Error handling: Consistent approach
   - Logging: Consistent format and level

2. **Code Smell Detection:**
   - Duplicate code: Repeated logic
   - Complex functions: High cyclomatic complexity
   - Long parameter lists: Too many parameters
   - Dead code: Unused functions, variables
   - Magic numbers: Unexplained constants

3. **Anti-Pattern Identification:**
   - God objects: Classes doing too much
   - Tight coupling: Hard-to-test dependencies
   - Missing error handling: Silent failures
   - Inefficient patterns: Performance issues
   - Security issues: Common vulnerabilities

4. **Architecture Compliance:**
   - Layer violations: Boundary breaches
   - Dependency direction: Wrong dependencies
   - Abstraction level: Mixing concerns
   - Separation of concerns: Tangled responsibilities

**AI Code Review Prompt Pattern:**
```
Code to review:
[Paste code]

Team conventions:
- [Naming: camelCase for variables, PascalCase for classes]
- [Error handling: Always use custom error types]
- [Logging: Structured logs with context]
- [Testing: 80% coverage minimum]

Architecture constraints:
- [API layer should not call database directly]
- [Business logic in service layer only]
- [No circular dependencies]

Review for:
1. Convention violations
2. Code smells (duplicate code, complex functions)
3. Anti-patterns (tight coupling, god objects)
4. Architecture violations
5. Security issues
6. Missing error handling
7. Performance concerns

Provide:
- Specific line/location of issue
- Why it's a problem
- Suggested fix
- Priority (critical/high/medium/low)
```

**AI Refactoring Pattern:**
```
Use AI to refactor code:

Simple refactoring:
"Refactor this function to match team conventions:
[Paste function]
Conventions: [List conventions]"

Complex refactoring:
"Extract this logic into separate functions:
[Paste complex function]
Each function should:
- Have single responsibility
- Be < 20 lines
- Have descriptive name
- Include error handling"

Pattern application:
"Apply [pattern name] to this code:
[Paste code]
Show before and after
Explain improvements"

Consistency fix:
"Make error handling consistent across these functions:
[Paste functions]
Use this pattern: [Show example]"
```

**AI Quality Review Workflow:**
```
Pre-human review process:

1. Developer completes code
2. AI review: "Review this code for [criteria]"
3. AI provides feedback with suggestions
4. Developer addresses AI feedback
5. AI re-review: "Have these issues been resolved?"
6. Human review begins with cleaner code

Benefits:
- Faster initial feedback
- Consistent enforcement
- Human reviewers focus on design/logic
- Reduced review cycles
- Learning opportunity for developer
```

---

**AI Deployment Readiness Pattern:**

Accelerate deployment preparation with AI:

**Container Configuration Generation:**

1. **Container Definition:**
   - Base image selection: Appropriate for runtime
   - Dependency installation: Required packages
   - Application setup: Build and configuration
   - Entry point: How to start service
   - Health check: Liveness and readiness

2. **Container Optimization:**
   - Multi-stage builds: Smaller images
   - Layer caching: Faster builds
   - Security hardening: Non-root user, minimal packages
   - Resource limits: Memory and CPU constraints

3. **Orchestration Configuration:**
   - Service definition: Replicas, resources
   - Networking: Ports, service discovery
   - Storage: Volumes, persistence
   - Secrets: Credentials, API keys
   - Environment-specific: Dev, staging, production

**AI Container Configuration Prompt:**
```
Generate container configuration for:
Component: [Name]
Runtime: [Language/runtime version]
Dependencies: [Database, cache, etc.]
Port: [Application port]

Requirements:
- Multi-stage build (build + runtime stages)
- Non-root user for security
- Health check endpoint: [/health]
- Resource limits: [Memory/CPU]
- Environment variables: [List]

Generate:
1. Dockerfile with multi-stage build
2. Container orchestration config (Kubernetes/Docker Compose)
3. Health check implementation
4. Resource limit recommendations
5. Security best practices applied
```

**Health Check Generation Pattern:**
```
Generate comprehensive health checks:

Component: [Name]
Dependencies: [List services and resources]

Generate health check implementation:

1. Liveness check:
   - Is service running?
   - Return 200 if alive, 503 if not

2. Readiness check:
   - Is service ready for traffic?
   - Check dependencies: [database, cache, etc.]
   - Return 200 if ready, 503 if not

3. Startup check:
   - Has service finished initialization?
   - Longer timeout for slow starts

4. Dependency checks:
   - Database: Can connect and query
   - Cache: Can read and write
   - External API: Can reach and authenticate

5. Business health:
   - Can process transactions
   - Critical workflows functioning

Include:
- Appropriate timeouts
- Degraded state handling
- Detailed error responses
- Monitoring metrics
```

**Monitoring Configuration Pattern:**
```
Generate monitoring setup:

Component: [Name]
Technology stack: [Framework, database, etc.]

Generate:
1. Metrics collection:
   - Application metrics: Request rate, latency, errors
   - Business metrics: Transactions, conversions
   - Resource metrics: CPU, memory, disk
   - Dependency metrics: Database queries, API calls

2. Logging configuration:
   - Structured logging format
   - Log levels and filtering
   - Sensitive data redaction
   - Log aggregation setup

3. Alerting rules:
   - Error rate > threshold
   - Latency > threshold
   - Resource usage > threshold
   - Dependency failures

4. Dashboard definitions:
   - Service overview
   - Performance metrics
   - Error tracking
   - Business metrics

5. Tracing setup:
   - Distributed tracing
   - Span creation
   - Context propagation
```

**Rollback Procedure Generation:**
```
Generate rollback procedures:

Component: [Name]
Deployment method: [Blue-green / Rolling / Canary]
Database migrations: [Yes/No]

Generate:
1. Rollback decision criteria:
   - Error rate exceeds [threshold]
   - Latency exceeds [threshold]
   - Business metric drops [percentage]
   - Manual decision required

2. Rollback procedure:
   - Step-by-step commands
   - Validation after each step
   - Estimated time per step
   - Communication template

3. Database rollback:
   - Migration rollback script
   - Data verification steps
   - Backup restoration if needed

4. Validation steps:
   - Health checks pass
   - Smoke tests pass
   - Key metrics returned to baseline
   - No data loss confirmed

5. Post-rollback:
   - Incident report template
   - Root cause analysis checklist
   - Communication to stakeholders
```

---

**AI Assistance Best Practices:**

Effective AI collaboration patterns:

**Context Provision:**

1. **Provide Sufficient Context:**
   - Business requirements: What needs to be achieved
   - Technical constraints: Limitations and dependencies
   - Existing patterns: How team does things
   - Success criteria: What good looks like
   - Failure scenarios: What to avoid

2. **Show Examples:**
   - Existing code: Team's style
   - Good tests: What quality looks like
   - Documentation format: Preferred structure
   - Architecture patterns: Used approaches

3. **Be Specific:**
   - Vague: "Generate tests"
   - Specific: "Generate unit tests using AAA pattern with descriptive names covering happy path, edge cases, and error handling"

**Iterative Refinement:**

```
Iteration pattern:

Request 1: Initial generation
→ "Generate tests for [component]"
→ Review output

Request 2: Address gaps
→ "Add tests for [missing scenario]"
→ Review additions

Request 3: Improve quality
→ "Make test names more descriptive"
→ Review improvements

Request 4: Optimize
→ "These tests are slow, optimize"
→ Review optimizations

Request 5: Final polish
→ "Add comments explaining complex assertions"
→ Final review and merge
```

**Validation and Review:**

```
Always validate AI output:

1. Correctness:
   ✓ Code compiles/runs
   ✓ Tests pass
   ✓ Logic is sound
   ✓ No security issues

2. Quality:
   ✓ Follows conventions
   ✓ Clear and maintainable
   ✓ Well-documented
   ✓ No code smells

3. Completeness:
   ✓ All requirements met
   ✓ Edge cases covered
   ✓ Error handling present
   ✓ Documentation included

4. Integration:
   ✓ Works with existing code
   ✓ No breaking changes
   ✓ Dependencies correct
   ✓ Tests pass with changes
```

**Human Judgment Required:**

```
AI assists, humans decide:

AI good for:
✓ Generating boilerplate
✓ Creating test cases
✓ Writing documentation
✓ Identifying patterns
✓ Suggesting refactorings
✓ Detecting code smells

Human required for:
✓ Business logic validation
✓ Architecture decisions
✓ Security review
✓ Performance trade-offs
✓ User experience
✓ Strategic planning

Collaboration model:
AI: Accelerates repetitive tasks
Human: Validates, refines, decides
Together: Higher quality, faster delivery
```

---

**AI Assistance Workflow Integration:**

Integrate AI into quality workflow:

**Development Workflow:**

```
1. Write code
   └→ Use AI for boilerplate generation

2. Write tests
   └→ AI generates initial test suite
   └→ Developer reviews and refines

3. Document code
   └→ AI generates comments and docs
   └→ Developer validates accuracy

4. Self-review
   └→ AI reviews for conventions and smells
   └→ Developer addresses feedback

5. Commit
   └→ Pre-commit hooks run

6. Pull request
   └→ AI provides initial review
   └→ Human reviewers focus on design

7. Deployment
   └→ AI-generated configs and health checks
   └→ Team validates before deployment
```

**Quality Gates with AI:**

```
Gate 1: Code complete
→ AI generates tests
→ AI generates documentation
→ Developer reviews and refines

Gate 2: Self-review
→ AI reviews code quality
→ Developer addresses issues
→ AI re-reviews

Gate 3: Human review
→ Cleaner code due to AI review
→ Reviewers focus on design
→ Faster review cycles

Gate 4: Deployment prep
→ AI generates configs
→ AI generates health checks
→ AI generates monitoring
→ Team validates before deploy

Gate 5: Post-deployment
→ AI assists with incident analysis
→ AI generates post-mortems
→ AI suggests improvements
```

**Team Guidelines:**

```
Establish team AI usage guidelines:

1. When to use AI:
   - Boilerplate generation
   - Test case creation
   - Documentation writing
   - Code review assistance
   - Configuration generation

2. When not to use AI:
   - Security-critical logic
   - Complex business rules
   - Performance-critical code
   - Final architecture decisions
   - Without human validation

3. How to use AI effectively:
   - Provide rich context
   - Show examples
   - Be specific
   - Iterate to refine
   - Always validate output

4. Quality standards:
   - AI output must meet same standards as human-written code
   - All AI-generated code reviewed by human
   - AI-generated tests must pass and be meaningful
   - AI-generated docs must be accurate
```

</output-format>

<instructions>
CRITICAL: AI assistance accelerates quality engineering but requires human validation.

NEVER use AI assistance by:
- Blindly accepting AI output without review (quality issues)
- Using AI for security-critical logic without expert review (vulnerabilities)
- Letting AI make architectural decisions (lack of context)
- Skipping human validation of generated tests (false confidence)
- Using AI-generated docs without accuracy check (misinformation)
- Treating AI as replacement for human judgment (poor decisions)

DO NOT:
- Copy-paste AI code without understanding it
- Use AI-generated tests as only validation
- Deploy AI-generated configs without testing
- Accept AI architecture suggestions without analysis
- Skip code review because AI reviewed it
- Use AI for critical security code without expert review

ALWAYS:
- Provide rich context to AI
- Show examples of team conventions
- Iterate to refine AI output
- Validate all AI-generated content
- Use AI to accelerate, not replace, human work
- Review AI code as strictly as human code
- Test AI-generated configs in staging first
- Keep human judgment central to decisions
- Use AI for repetitive tasks, humans for critical decisions
- Document AI-assisted work like any other code

REPEAT: AI accelerates quality engineering. Provide rich context. Iterate to refine. Always validate output. Human judgment remains essential. AI assists, humans decide.
</instructions>

<examples>
✅ GOOD AI Test Generation (rich context, validated output):

**Pattern demonstrates:**
- Rich context provided
- Examples shown
- Specific request
- Output validated
- Iterated to improve

**AI interaction:**
```
Developer prompt:
"Generate unit tests for PaymentProcessor.process() method.

Context:
- Processes customer payments through external gateway
- Must validate amount > 0 and <= 10,000
- Must handle gateway timeouts gracefully
- Must log all payment attempts

Example of our test style:
```
test('should_process_payment_successfully_when_valid_amount', () => {
  // Arrange
  const processor = new PaymentProcessor();
  const payment = { amount: 100, customerId: 'cust_123' };

  // Act
  const result = processor.process(payment);

  // Assert
  expect(result.status).toBe('success');
});
```

Generate tests for:
1. Happy path (valid payment)
2. Edge cases (zero amount, negative, max amount, over max)
3. Gateway timeout handling
4. Invalid customer ID
5. Logging verification

Test framework: Jest
Mocking: Use jest.mock for gateway
Style: AAA pattern, descriptive names"

AI generates tests...

Developer validates:
✓ Tests compile and run
✓ All scenarios covered
✓ Assertions are correct
✓ Mocks are realistic
✓ Follows team style

Developer iterates:
"Test names are good, but add comments explaining
the business rule for max amount of 10,000"

AI adds comments...

Developer approves:
✓ All validations pass
✓ Merged to codebase
```

**Why this works:**
- Rich context provided (what, why, constraints)
- Example shown (team style)
- Specific scenarios requested
- Output validated thoroughly
- Iterated to improve
- Human made final decision

---

❌ BAD AI Test Generation (vague request, no validation):

**Anti-pattern characteristics:**
- Vague request
- No context
- No examples
- No validation
- Blindly accepted

**Bad interaction:**
```
Developer prompt:
"Generate tests for PaymentProcessor"

AI generates generic tests...

Developer:
"Looks good"
*Commits without review*

Production incident:
- Tests don't cover negative amounts
- Tests mock gateway unrealistically
- Edge cases missed
- Business rules not validated
```

**Why this fails:**
- No context about requirements
- No example of team style
- No specific scenarios requested
- No validation of output
- No checking if tests actually work
- No verification of coverage
- Blind trust in AI output

---

✅ GOOD AI Documentation Generation (iterative, validated):

**Pattern demonstrates:**
- Code provided
- Purpose explained
- Audience specified
- Output validated
- Accuracy verified

**AI interaction:**
```
Developer prompt:
"Generate documentation for this payment processing function:

```
function processPayment(payment, options) {
  // Validates payment amount against business rules
  if (payment.amount <= 0 || payment.amount > 10000) {
    throw new PaymentError('Invalid amount');
  }

  // Apply rate limiting to prevent abuse
  if (!rateLimiter.check(payment.customerId)) {
    throw new PaymentError('Rate limit exceeded');
  }

  // Process through gateway with retry logic
  return gateway.process(payment, { retries: 3, timeout: 5000 });
}
```

Business context:
- Max payment is $10,000 due to fraud prevention
- Rate limit is 5 payments per minute per customer
- Gateway sometimes times out, so we retry

Generate:
1. Function description explaining purpose
2. Parameter documentation
3. Return value documentation
4. Error cases with examples
5. Code comments explaining WHY (business rules)

Audience: New team members"

AI generates documentation...

Developer validates:
✓ Technically accurate
✓ Business rules explained
✓ Examples are correct
✓ Audience-appropriate
✓ Complete coverage

Developer refines:
"Add note about why we chose 3 retries specifically"

AI adds context:
"3 retries chosen based on gateway SLA (99.9% success within 3 attempts)"

Developer approves:
✓ Documentation merged
```

**Why this works:**
- Code provided with context
- Business rules explained
- Audience specified
- Output validated for accuracy
- Iterated to add missing context
- Human verified completeness

---

❌ BAD AI Documentation (no validation, inaccurate):

**Anti-pattern characteristics:**
- No context
- Output not validated
- Inaccuracies not caught
- Misleading docs

**Bad interaction:**
```
Developer prompt:
"Document this function"
*Pastes code without context*

AI generates generic documentation...

Developer:
*Commits without checking accuracy*

Result:
- Documentation says "max payment: $100,000" (wrong)
- Rate limit not mentioned
- Retry logic not explained
- New team members misled
- Time wasted debugging confusion
```

**Why this fails:**
- No business context provided
- No validation of accuracy
- No check against actual code behavior
- Blindly committed inaccurate docs
- Created misleading documentation
- New team members will be confused

---

✅ GOOD AI Code Review (pre-human review, specific feedback):

**Pattern demonstrates:**
- Specific review criteria
- Team conventions provided
- Actionable feedback
- Developer addresses issues
- Human review follows

**AI interaction:**
```
Developer prompt:
"Review this code for our team conventions:

```
function handlePayment(amt, cust) {
  if (!amt) return;
  const r = gateway.send(amt, cust);
  console.log(r);
  return r;
}
```

Team conventions:
- Descriptive variable names (no abbreviations)
- Always validate inputs explicitly
- Use structured logging, not console.log
- Handle errors with try-catch
- Add JSDoc comments for public functions
- Check for null/undefined separately

Review for:
1. Convention violations
2. Missing error handling
3. Input validation issues
4. Logging problems
5. Documentation gaps"

AI provides feedback:
"Issues found:

1. Variable naming (medium):
   - `amt` should be `amount`
   - `cust` should be `customer`
   - `r` should be `result`

2. Input validation (high):
   - `!amt` doesn't distinguish null/undefined/0
   - Should validate: `if (amount == null || amount <= 0)`
   - Missing customer validation

3. Error handling (critical):
   - No try-catch around gateway call
   - Network failures will crash

4. Logging (medium):
   - console.log should be structured logger
   - Should log payment attempt with context

5. Documentation (low):
   - Missing JSDoc comment

Suggested refactoring:
```
/**
 * Processes a payment through the payment gateway
 * @param {number} amount - Payment amount in cents
 * @param {string} customer - Customer identifier
 * @returns {PaymentResult} Result of payment processing
 * @throws {PaymentError} If payment fails
 */
function handlePayment(amount, customer) {
  // Validate inputs
  if (amount == null || amount <= 0) {
    throw new PaymentError('Amount must be positive');
  }
  if (!customer) {
    throw new PaymentError('Customer ID required');
  }

  try {
    const result = gateway.send(amount, customer);
    logger.info('Payment processed', {
      amount,
      customer,
      resultId: result.id
    });
    return result;
  } catch (error) {
    logger.error('Payment failed', { amount, customer, error });
    throw new PaymentError('Payment processing failed', error);
  }
}
```
"

Developer addresses all issues...

Human reviewer:
"Code is clean, AI caught the important issues.
Let me focus on the business logic..."
*Reviews payment validation rules and integration*

Code merged after human approval
```

**Why this works:**
- Specific review criteria provided
- Team conventions included
- AI found real issues
- Feedback was actionable
- Developer fixed issues
- Human reviewer focused on higher-level concerns
- Cleaner code reached human review

---

❌ BAD AI Code Review (vague, not used effectively):

**Anti-pattern characteristics:**
- Vague request
- No conventions specified
- Feedback ignored
- No human review
- Quality issues shipped

**Bad interaction:**
```
Developer prompt:
"Review this code"
*Pastes code*

AI:
"Code looks reasonable but could be improved"

Developer:
"Good enough"
*Merges without addressing feedback*
*Skips human review because "AI reviewed it"*

Production:
- Code crashes on null input
- Errors not logged
- Hard to debug issues
- Team fixes bugs later
```

**Why this fails:**
- No specific review criteria
- No team conventions provided
- Vague AI feedback
- Developer didn't address issues
- Skipped human review entirely
- Used AI review as replacement for human
- Quality issues shipped to production
</examples>
