---
# === Identity ===
id: validate-ai-changes
name: Validate AI-generated changes to ensure correctness, alignment, and safety
version: v1

# === Classification ===
chapter: 4
category: ai-workflow
subcategory: practices
tags:
  - quality
  - ai-validation
  - code-review
  - memory-bank
  - integration-testing
  - context-verification
  - architectural-alignment
  - best-practices
  - safety
  - correctness

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Validate AI-generated changes to ensure correctness, alignment, and safety.
    Rigorously validate AI code changes before integration (Best Practices).
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
    description: The specific component to validate AI changes for
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
      **Validate AI-generated changes** rigorously before integration to ensure correctness, alignment, and safety. Perform line-by-line comparison for refactoring changes, comparing original and AI-modified code section by section to verify all original logic has been preserved or explicitly replaced, checking for silently omitted code that AI removed without documentation. Execute memory bank cross-validation ensuring AI changes align with documented architectural decisions, verifying modifications don't violate system constraints and that AI understands the business context behind the code. Conduct integration testing requirements by testing all AI-modified code in realistic system environments, verifying performance characteristics haven't degraded and security boundaries remain intact. Apply context reinforcement checks to verify AI was provided with complete memory bank context, confirming AI understood system constraints and followed established patterns.
    preview: |
      "...perform line-by-line comparison checking for preserved logic and silently omitted code. Execute memory bank cross-validation ensuring architectural alignment..."
  website:
    include: true
    path: /prompts/validate-ai-changes
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Validate AI-generated changes for {{component_name}} in {{system_name}} to ensure correctness, alignment, and safety before integration.

Validate AI-generated code changes rigorously before integration. Perform line-by-line comparison for refactoring changes, comparing original and AI-modified code section by section to verify all original logic has been preserved or explicitly replaced, checking for silently omitted code that AI removed without documentation. Execute memory bank cross-validation ensuring AI changes align with documented architectural decisions, verifying modifications don't violate system constraints and that AI understands the business context behind the code. Conduct integration testing requirements by testing all AI-modified code in realistic system environments, verifying performance characteristics haven't degraded and security boundaries remain intact. Apply context reinforcement checks to verify AI was provided with complete memory bank context, confirming AI understood system constraints and followed established patterns.

Follow this process:

1. **Perform line-by-line comparison for refactoring changes:**
   - Compare original and AI-modified code section by section
   - Verify that all original logic has been preserved or explicitly replaced
   - Check for silently omitted code that AI removed without documentation
   - Validate that error handling, edge cases, and business rules remain intact
   - Confirm that performance characteristics are maintained or improved

2. **Execute memory bank cross-validation:**
   - Ensure AI changes align with documented architectural decisions
   - Verify that AI modifications don't violate system constraints
   - Check that AI understands the business context behind the code
   - Confirm that AI changes support, not undermine, system goals
   - Validate consistency with established patterns in memory bank

3. **Conduct integration testing requirements:**
   - Test all AI-modified code in realistic system environments
   - Verify performance characteristics haven't degraded
   - Confirm security boundaries remain intact
   - Validate that downstream systems continue to function correctly
   - Test failure modes and error propagation

4. **Apply context reinforcement checks:**
   - Verify AI was provided with complete memory bank context
   - Confirm AI understood system constraints and quality requirements
   - Check that AI followed established coding patterns and conventions
   - Validate that AI changes don't create context drift across components
   - Ensure AI changes maintain architectural coherence
</task>

<context>
Component to validate AI changes:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates/updates:
- `docs/ai-validation/` (validation checklists and reports)
- Comparison diffs and analysis documents
- Integration test results
- Context alignment reports
- Memory bank reference documents
</context>

<thinking>
Before validating AI changes, analyze:
1. What original logic exists and must be preserved?
2. What architectural decisions constrain this code?
3. What integration points could be affected?
4. What context did AI have when making changes?
5. What risks exist if validation is incomplete?
</thinking>

<output-format>
Create AI change validation workflow following these patterns:

**Line-by-Line Comparison Pattern:**

Rigorous code-level validation:

**Comparison Process:**

1. **Side-by-Side Diff:**
   - Original code: Left side
   - AI-modified code: Right side
   - Line-by-line alignment
   - Highlight changes: Additions, deletions, modifications
   - Section markers: Group related changes

2. **Logic Preservation Check:**
   - Identify original logic blocks
   - Verify each block in modified code
   - Explicitly replaced: New implementation with same effect
   - Silently omitted: Logic removed without explanation
   - Edge case handling: Preserved or improved

3. **Business Rule Validation:**
   - Extract business rules from original code
   - Verify each rule in modified code
   - Check validation logic: Input constraints
   - Verify calculation logic: Formulas and algorithms
   - Confirm state transitions: Workflow steps

4. **Error Handling Audit:**
   - List error paths in original
   - Verify each path in modified
   - Check error messages: Clarity and accuracy
   - Validate recovery logic: Cleanup and rollback
   - Confirm logging: Error context captured

**Comparison Checklist Pattern:**
```
Line-by-line validation checklist:

□ All functions from original present or replaced
□ All business logic preserved
□ All edge cases handled
□ All error paths covered
□ All validation rules intact
□ All state transitions correct
□ All calculations accurate
□ All logging maintained
□ All comments preserved or updated
□ No silent omissions without explanation

For each change:
□ Change purpose documented
□ Original behavior preserved or intentionally changed
□ Tests verify changed behavior
□ Performance impact assessed
```

**Silently Omitted Code Detection:**
```
Detect AI code removal without justification:

1. Identify removed sections:
   - Functions deleted
   - Validation removed
   - Error handling removed
   - Logging removed
   - Comments removed

2. For each removal, verify:
   - Was it intentional? (documented in change notes)
   - Was it replaced? (equivalent logic elsewhere)
   - Was it truly unused? (no callers, no side effects)
   - Was it safe to remove? (no breaking changes)

3. Red flags:
   ⚠️ Error handling removed without explanation
   ⚠️ Validation logic deleted
   ⚠️ Edge case handling missing
   ⚠️ Business rule checking removed
   ⚠️ Logging statements deleted

4. Action for silent omissions:
   - Request explanation from AI
   - Restore removed code if necessary
   - Add tests for removed behavior
   - Document intentional changes
```

**Business Logic Validation Pattern:**
```
Validate business rules preserved:

1. Extract business rules from original:
   Rule 1: [Description]
   Location: [File:line in original]
   Logic: [How implemented]

2. Locate in AI-modified code:
   Found: [Yes/No]
   Location: [File:line in modified]
   Logic: [How implemented now]
   Preserved: [Yes/No/Modified]

3. If modified:
   Original logic: [What it did]
   New logic: [What it does now]
   Equivalent: [Yes/No]
   Improvement: [Better/Same/Worse]
   Justification: [AI's explanation]

4. Validation:
   - Test original scenario
   - Test edge cases
   - Test error cases
   - Verify output matches
   - Check performance
```

**Performance Comparison Pattern:**
```
Validate performance maintained or improved:

1. Measure original performance:
   - Response time: [Baseline]
   - Memory usage: [Baseline]
   - CPU usage: [Baseline]
   - Database queries: [Count and complexity]

2. Measure modified performance:
   - Response time: [Current]
   - Memory usage: [Current]
   - CPU usage: [Current]
   - Database queries: [Count and complexity]

3. Compare:
   - Faster: ✓ Improvement
   - Same: ✓ Acceptable
   - Slower: ⚠️ Investigate

4. If degraded:
   - Identify cause
   - Determine if justified
   - Optimize if possible
   - Accept if necessary trade-off
```

---

**Memory Bank Cross-Validation Pattern:**

Ensure architectural alignment:

**Architectural Decision Alignment:**

1. **Retrieve Relevant Decisions:**
   - List architectural decisions affecting component
   - Extract system constraints from memory bank
   - Review established patterns and conventions
   - Identify quality requirements

2. **Validate Against Decisions:**
   - Does change follow decision guidance?
   - Does change violate any constraints?
   - Does change match established patterns?
   - Does change support system goals?

3. **Business Context Verification:**
   - Extract business context from memory bank
   - Verify AI understood context
   - Check if change supports business objectives
   - Confirm change doesn't break business rules

4. **Pattern Consistency Check:**
   - Compare to similar code in codebase
   - Verify consistent approach
   - Check naming conventions match
   - Validate structure follows patterns

**Memory Bank Validation Checklist:**
```
Cross-validate with memory bank:

Architectural Decisions:
□ Change aligns with documented decisions
□ No constraint violations
□ Follows established patterns
□ Supports system goals
□ Maintains architectural integrity

Business Context:
□ AI understood business requirements
□ Change supports business objectives
□ Business rules preserved
□ Domain concepts used correctly
□ Terminology matches domain language

System Constraints:
□ Performance requirements met
□ Scalability considerations addressed
□ Security requirements maintained
□ Compliance requirements satisfied
□ Integration contracts honored

Pattern Consistency:
□ Naming matches conventions
□ Structure follows templates
□ Error handling consistent
□ Logging format standard
□ Code organization conventional
```

**Constraint Violation Detection:**
```
Identify memory bank violations:

1. Load system constraints:
   - From memory-bank/systemPatterns.md
   - From memory-bank/decisions/*.md
   - From memory-bank/constraints.md

2. Check each constraint:
   Constraint: [Name]
   Description: [What it requires]
   Location: [Memory bank reference]
   Violated: [Yes/No]
   Details: [How violated if yes]

3. For each violation:
   Severity: [Critical/High/Medium/Low]
   Impact: [What breaks]
   Action: [Reject change / Request fix / Document exception]

Example violations:
❌ Change uses synchronous blocking in async context
   Constraint: "All I/O operations must be async"
   Reference: memory-bank/decisions/async-architecture.md

❌ Change adds direct database access from API layer
   Constraint: "API layer calls service layer only"
   Reference: memory-bank/systemPatterns.md

❌ Change exceeds maximum function complexity
   Constraint: "Functions must have cyclomatic complexity < 10"
   Reference: memory-bank/quality-standards.md
```

**Business Context Understanding Test:**
```
Verify AI understands business context:

1. Ask AI to explain change:
   Prompt: "Explain the business purpose of this change"
   AI response: [Capture response]
   Accurate: [Yes/No]

2. Test domain knowledge:
   Prompt: "What business rule does this code implement?"
   AI response: [Capture response]
   Accurate: [Yes/No]

3. Verify edge case understanding:
   Prompt: "Why does this code handle [edge case]?"
   AI response: [Capture response]
   Accurate: [Yes/No]

4. Validate if AI explanations match:
   - Memory bank business context
   - Documented requirements
   - Domain expert knowledge

If AI lacks understanding:
→ Reject change
→ Provide more context
→ Have AI regenerate with context
```

---

**Integration Testing Requirements Pattern:**

Validate system-level correctness:

**Realistic Environment Testing:**

1. **Test Environment Setup:**
   - Production-like configuration
   - Real dependencies (databases, caches, services)
   - Realistic data volumes
   - Typical load patterns
   - Network conditions

2. **Integration Test Scenarios:**
   - Happy path: Typical workflows
   - Edge cases: Boundary conditions
   - Error paths: Failure scenarios
   - Load testing: Performance under stress
   - Chaos testing: Resilience to failures

3. **Downstream Impact Testing:**
   - Identify dependent systems
   - Test each dependency
   - Verify contracts maintained
   - Check data format compatibility
   - Validate error propagation

4. **End-to-End Validation:**
   - Complete user workflows
   - Cross-component interactions
   - Data consistency checks
   - Transaction integrity
   - State management

**Integration Test Checklist:**
```
Validate AI changes in integration:

Functional Testing:
□ All workflows complete successfully
□ Data flows correctly through system
□ State transitions work properly
□ Error handling functions correctly
□ Edge cases handled appropriately

Performance Testing:
□ Response times within acceptable range
□ Throughput meets requirements
□ Resource usage acceptable
□ No memory leaks introduced
□ Database queries efficient

Security Testing:
□ Authentication still works
□ Authorization boundaries intact
□ Input validation functioning
□ No new security vulnerabilities
□ Audit logging preserved

Compatibility Testing:
□ Downstream systems function correctly
□ API contracts maintained
□ Data format compatibility preserved
□ Version compatibility maintained
□ Breaking changes documented
```

**Performance Degradation Detection:**
```
Identify performance regressions:

1. Baseline measurements (before AI changes):
   - Response time: P50/P95/P99
   - Throughput: Requests per second
   - Resource usage: CPU/Memory/Disk
   - Database: Query count and duration

2. Current measurements (after AI changes):
   - Response time: P50/P95/P99
   - Throughput: Requests per second
   - Resource usage: CPU/Memory/Disk
   - Database: Query count and duration

3. Comparison:
   Metric: Response Time P95
   Before: 120ms
   After: 280ms
   Change: +133% ❌ REGRESSION

4. Regression analysis:
   - Profile AI-modified code
   - Identify bottleneck
   - Determine if acceptable
   - Optimize if possible
   - Reject if severe

Acceptable thresholds:
- Response time: <20% increase
- Throughput: <15% decrease
- Memory: <25% increase
- Queries: Same or fewer
```

**Security Boundary Validation:**
```
Verify security integrity:

1. Authentication checks:
   □ User authentication still required
   □ Token validation functioning
   □ Session management intact
   □ No authentication bypass introduced

2. Authorization checks:
   □ Permission checks preserved
   □ Role-based access functioning
   □ Resource ownership validated
   □ No privilege escalation possible

3. Input validation:
   □ All inputs validated
   □ SQL injection prevention maintained
   □ XSS prevention functioning
   □ Command injection prevented

4. Data protection:
   □ Sensitive data encrypted
   □ Secrets not exposed
   □ PII handled correctly
   □ Audit logging preserved

5. Security testing:
   - Run security scanner
   - Test common vulnerabilities
   - Verify security headers
   - Check error messages (no info leakage)
```

**Downstream System Validation:**
```
Test dependent systems:

1. Identify dependencies:
   - Systems that call this component
   - Systems this component calls
   - Shared data stores
   - Message queues
   - Event streams

2. For each dependency:
   System: [Name]
   Relationship: [Calls us / We call / Shared resource]
   Contract: [API/Data format/Event schema]
   Test: [Verification approach]
   Status: [Pass/Fail]

3. Contract testing:
   - Request/response format unchanged
   - Data types compatible
   - Required fields present
   - Optional fields handled
   - Error format consistent

4. Integration smoke tests:
   - End-to-end workflow test
   - Verify data flow
   - Check error propagation
   - Validate transaction integrity

If downstream breaks:
→ Reject AI change
→ Fix compatibility issue
→ Coordinate breaking change
```

---

**Context Reinforcement Checks Pattern:**

Ensure AI had proper context:

**Context Completeness Verification:**

1. **Memory Bank Context:**
   - System patterns document provided
   - Architectural decisions provided
   - Business context provided
   - Quality standards provided
   - Similar code examples provided

2. **Component Context:**
   - Component purpose explained
   - Dependencies documented
   - Integration points described
   - Business rules listed
   - Edge cases noted

3. **Change Context:**
   - Why change needed
   - What should be preserved
   - What can be modified
   - What success looks like
   - What risks exist

4. **Team Conventions:**
   - Coding standards shared
   - Naming conventions provided
   - Pattern templates shown
   - Error handling style documented
   - Logging format specified

**Context Checklist:**
```
Verify AI received complete context:

Memory Bank Documents:
□ memory-bank/systemPatterns.md provided
□ memory-bank/decisions/*.md relevant ones included
□ memory-bank/constraints.md provided
□ memory-bank/businessContext.md provided
□ Similar code examples from codebase shown

Component Information:
□ Component responsibilities documented
□ Dependencies and integrations listed
□ Business rules explained
□ Edge cases described
□ Performance requirements stated

Team Conventions:
□ Coding standards referenced
□ Naming conventions shown with examples
□ Pattern templates provided
□ Error handling approach documented
□ Logging format with examples

Change Requirements:
□ Purpose clearly stated
□ Success criteria defined
□ Constraints specified
□ Risks identified
□ Validation approach described
```

**Context Understanding Validation:**
```
Test AI's context comprehension:

1. Ask AI to explain context:
   Q: "What are the key constraints for this component?"
   AI: [Response]
   Accurate: [Yes/No]

   Q: "What architectural pattern does this follow?"
   AI: [Response]
   Accurate: [Yes/No]

   Q: "What business rule is most critical here?"
   AI: [Response]
   Accurate: [Yes/No]

2. Check against memory bank:
   - AI's understanding vs documented constraints
   - AI's patterns vs established patterns
   - AI's business knowledge vs business context

3. If understanding is lacking:
   - Identify missing context
   - Provide additional information
   - Request AI explain new understanding
   - Regenerate code with better context
```

**Context Drift Detection:**
```
Identify architectural inconsistency:

1. Compare change to established patterns:
   Pattern: [Name from memory bank]
   Usage in codebase: [How it's used elsewhere]
   AI implementation: [How AI used it]
   Consistent: [Yes/No]
   Deviation: [Description if inconsistent]

2. Check naming consistency:
   Concept: [Business concept]
   Term in codebase: [What it's called everywhere]
   Term in AI code: [What AI called it]
   Consistent: [Yes/No]

3. Verify structure consistency:
   File organization: [Standard pattern]
   AI's organization: [How AI structured it]
   Consistent: [Yes/No]

4. Validate approach consistency:
   Error handling: [Standard approach]
   AI's approach: [How AI handled errors]
   Consistent: [Yes/No]

Context drift examples:
❌ Codebase uses "Customer", AI used "User"
❌ Codebase uses camelCase, AI used snake_case
❌ Codebase uses try-catch, AI used error codes
❌ Codebase uses async/await, AI used promises.then()

Action for drift:
→ Request AI align with conventions
→ Provide more examples
→ Show exact pattern to follow
```

**Pattern Compliance Validation:**
```
Ensure AI followed established patterns:

1. Extract patterns from memory bank:
   Pattern: [Name]
   Description: [What it is]
   Usage: [When to use]
   Example: [Code example]
   Reference: [Memory bank location]

2. Verify AI followed pattern:
   Pattern: Error Handling
   Expected: Custom error types extending base Error
   AI used: [What AI did]
   Compliant: [Yes/No]

3. Check all applicable patterns:
   □ Error handling pattern followed
   □ Logging pattern followed
   □ Naming pattern followed
   □ Structure pattern followed
   □ Testing pattern followed

4. For non-compliance:
   Pattern violated: [Name]
   How violated: [Description]
   Impact: [What this affects]
   Action: Request compliance or justify deviation
```

---

**AI Change Validation Workflow:**

Integrate all validation steps:

**Complete Validation Process:**

```
Step 1: Initial Review (10 minutes)
□ Quick scan of changes
□ Identify scope and complexity
□ List critical areas to validate
□ Gather necessary context

Step 2: Line-by-Line Comparison (30-60 minutes)
□ Side-by-side diff analysis
□ Logic preservation check
□ Business rule validation
□ Error handling audit
□ Document silent omissions

Step 3: Memory Bank Cross-Validation (20 minutes)
□ Load relevant memory bank documents
□ Check architectural alignment
□ Verify constraint compliance
□ Validate pattern consistency
□ Test business context understanding

Step 4: Integration Testing (60-90 minutes)
□ Set up test environment
□ Run integration test suite
□ Measure performance
□ Check security boundaries
□ Validate downstream systems

Step 5: Context Reinforcement (15 minutes)
□ Verify AI had complete context
□ Check for context drift
□ Validate pattern compliance
□ Test AI's understanding

Step 6: Final Decision (5 minutes)
□ Review all validation results
□ List any issues found
□ Determine if change is acceptable
□ Document decision and rationale

Total time: 2-3 hours for significant changes
```

**Validation Report Pattern:**
```markdown
# AI Change Validation Report

**Component:** [Name]
**Change Description:** [Brief summary]
**Validation Date:** [Date]
**Validator:** [Name]

## Change Summary
- Files modified: [Count]
- Lines added: [Count]
- Lines removed: [Count]
- Functions changed: [List]

## Line-by-Line Validation
✓ All original logic preserved or explicitly replaced
✓ No silent omissions detected
✓ Business rules intact
✓ Error handling maintained
⚠️ Performance: Response time increased 15% (acceptable)

## Memory Bank Alignment
✓ Architectural decisions followed
✓ System constraints respected
✓ Business context understood
✓ Patterns consistent
✓ No violations detected

## Integration Testing
✓ All integration tests pass
✓ Downstream systems function correctly
✓ Security boundaries intact
⚠️ One performance regression (minor, acceptable)

## Context Verification
✓ AI had complete memory bank context
✓ AI understood system constraints
✓ AI followed team conventions
✓ No context drift detected

## Issues Found
1. **Minor performance regression**
   - Severity: Low
   - Description: Response time +15%
   - Cause: Additional validation step
   - Action: Accept (validation needed)

## Decision
**Status:** ✅ Approved for integration

**Rationale:**
- All critical validations passed
- Minor performance trade-off justified
- Code quality improved
- No breaking changes
- Security maintained

**Next Steps:**
- Merge AI changes
- Monitor performance in production
- Update documentation
- Share learnings with team
```

**Rejection Criteria:**
```
Automatically reject AI changes if:

❌ Critical: Reject immediately
- Business logic silently removed
- Security vulnerability introduced
- Breaking change to API contract
- Data corruption possible
- Performance degradation >50%

⚠️ High: Reject unless justified
- Constraint violation without explanation
- Pattern inconsistency without reason
- Integration test failures
- Performance degradation >20%
- Missing error handling

⚠️ Medium: Review carefully
- Performance degradation 10-20%
- Minor pattern deviations
- Documentation gaps
- Test coverage decrease

Action for rejection:
1. Document specific issues
2. Provide feedback to AI
3. Request regeneration with fixes
4. Re-validate after changes
```

</output-format>

<instructions>
CRITICAL: Validating AI changes prevents defects, security issues, and architectural drift.

NEVER validate AI changes by:
- Skipping line-by-line review (miss silent omissions)
- Ignoring memory bank alignment (architectural drift)
- Testing only in local environment (miss integration issues)
- Assuming AI had proper context (incomplete information)
- Rushing validation process (quality issues slip through)
- Trusting AI output without verification (blind acceptance)

DO NOT:
- Accept changes without diff review
- Skip memory bank cross-validation
- Deploy without integration testing
- Assume AI understood all constraints
- Ignore performance regressions
- Accept security boundary violations

ALWAYS:
- Compare original and modified code line-by-line
- Check for silently omitted code
- Validate against memory bank decisions
- Test in realistic environments
- Verify AI had complete context
- Check for context drift
- Measure performance impact
- Test security boundaries
- Validate downstream systems
- Document validation results

REPEAT: Validate AI changes rigorously. Line-by-line comparison. Memory bank alignment. Integration testing. Context verification. Never skip validation steps.
</instructions>

<examples>
✅ GOOD AI Change Validation (thorough, caught issues):

**Pattern demonstrates:**
- Complete validation process
- Issues detected
- Specific feedback
- Proper decision

**Validation example:**
```
Component: PaymentProcessor
Change: AI refactored processPayment() method
Validator: Alice

Step 1: Line-by-line comparison
Original method (50 lines):
- Validates amount
- Checks rate limit
- Calls gateway
- Handles errors
- Logs result

AI-modified method (35 lines):
- Validates amount ✓
- Checks rate limit ✓
- Calls gateway ✓
- Handles errors ⚠️
- Logs result ⚠️

Issues found:
1. Error handling simplified:
   Original: Try-catch with specific error types
   AI: Generic catch-all
   Status: ❌ Regression

2. Logging reduced:
   Original: Structured logs with context
   AI: Simple console.log
   Status: ❌ Regression

3. Silent omission:
   Original: Retry logic for transient failures
   AI: Removed without mention
   Status: ❌ Critical omission

Step 2: Memory Bank validation
✓ Architectural pattern followed
❌ Violates logging standard (structured logs required)
❌ Violates error handling pattern (custom error types required)
✓ Business rules preserved

Step 3: Integration testing
❌ Test failure: Transient errors not retried
✓ Performance maintained
✓ Security intact
⚠️ Error propagation changed (less specific)

Step 4: Context check
Review of context provided to AI:
❌ Error handling pattern not included
❌ Logging standard not provided
✓ Business rules provided
✓ Architectural constraints provided

Decision: ❌ REJECTED

Feedback to AI:
"Changes rejected due to three issues:

1. Error handling must use custom error types per
   memory-bank/systemPatterns.md:
   [Show error handling pattern]

2. Logging must be structured per logging standard:
   [Show logging example]

3. Retry logic was removed. This is critical for
   handling gateway transient failures. Must be preserved.

Please regenerate with:
- Custom error types as shown
- Structured logging as shown
- Retry logic preserved from original

Here's the complete context you need:
[Attach error handling pattern]
[Attach logging standard]
[Attach retry logic explanation]"

AI regenerates with fixes...

Second validation:
✓ All issues addressed
✓ Error handling pattern followed
✓ Structured logging implemented
✓ Retry logic preserved
✓ Integration tests pass

Decision: ✅ APPROVED
```

**Why this works:**
- Thorough line-by-line review
- Silent omission detected (retry logic)
- Memory bank violations caught
- Integration testing revealed issues
- Context gaps identified
- Specific feedback provided
- Re-validation after fixes
- Quality maintained

---

❌ BAD AI Change Validation (superficial, missed issues):

**Anti-pattern characteristics:**
- Quick glance, no deep review
- No memory bank check
- No integration testing
- Blind approval

**Bad validation:**
```
Component: PaymentProcessor
Change: AI refactored processPayment() method
Validator: Bob

Review:
"Looked at the code. Looks cleaner. Approved."

*Merged without testing*

Production incidents:
1. Hour 1: Payments failing on transient errors
   Root cause: Retry logic removed by AI
   Impact: 500 failed payments

2. Hour 2: Can't debug payment issues
   Root cause: Logging reduced by AI
   Impact: No visibility into failures

3. Hour 3: Error monitoring broken
   Root cause: Generic errors don't match alerting rules
   Impact: Alerts not firing

Total impact:
- 3 hours downtime
- 500+ failed payments
- Emergency rollback required
- Customer complaints
- Revenue loss
```

**Why this fails:**
- No line-by-line comparison (missed omissions)
- No memory bank validation (violations undetected)
- No integration testing (failures not caught)
- No context verification (AI lacked info)
- Superficial review ("looks cleaner")
- Rushed approval process
- Quality issues shipped to production
- Expensive incidents resulted

---

✅ GOOD Memory Bank Cross-Validation (architectural alignment verified):

**Pattern demonstrates:**
- Memory bank documents loaded
- Constraints checked
- Violations detected
- Alignment enforced

**Validation example:**
```
Component: OrderService
Change: AI added caching layer
Validator: Carol

Memory Bank Cross-Validation:

1. Load relevant documents:
   - memory-bank/systemPatterns.md
   - memory-bank/decisions/caching-strategy.md
   - memory-bank/decisions/data-consistency.md

2. Check constraints:

Constraint 1: "Caching only at API gateway layer"
Source: memory-bank/decisions/caching-strategy.md
Rationale: Centralized cache management, avoid inconsistency
AI change: Added caching in service layer
Violation: ❌ YES

Constraint 2: "Real-time data required for orders"
Source: memory-bank/decisions/data-consistency.md
Rationale: Order status must be current
AI change: Caches order data for 5 minutes
Violation: ❌ YES

3. Architectural pattern check:

Pattern: "API Gateway → Service Layer → Repository"
AI change: Added cache between service and repository
Pattern violated: ⚠️ New layer not in pattern

4. Business context verification:

Ask AI: "Why is caching appropriate for order data?"
AI: "To improve performance"
Check context: Orders require real-time data
AI understanding: ❌ INCOMPLETE

Decision: ❌ REJECTED

Feedback:
"Changes violate two architectural constraints:

1. Caching strategy (memory-bank/decisions/caching-strategy.md):
   'Caching only at API gateway layer'
   Your change adds caching at service layer.

2. Data consistency (memory-bank/decisions/data-consistency.md):
   'Orders require real-time data'
   Your change caches order data.

Context: Orders must show current status because:
- Users need to see live payment/shipping status
- Customer service needs accurate info
- Inventory depends on current order state

Caching orders would show stale data, breaking these requirements.

If performance is a concern, please suggest alternatives that
don't violate these constraints."

AI responds with read-replica approach instead...
→ Aligns with constraints
→ Maintains real-time data
→ Improves performance
→ Approved
```

**Why this works:**
- Memory bank documents loaded
- All constraints checked
- Violations caught before integration
- Business context verified
- AI's understanding tested
- Specific feedback with references
- Alternative solution requested
- Architectural integrity maintained

---

❌ BAD Memory Bank Validation (constraints ignored):

**Anti-pattern characteristics:**
- Memory bank not consulted
- Constraints unknown
- Violations undetected
- Architectural drift

**Bad validation:**
```
Component: OrderService
Change: AI added caching layer
Validator: Dan

Review:
"Caching sounds good for performance. Approved."

*No memory bank check*

Post-deployment issues:
1. Order status showing stale data
2. Customer service giving wrong info
3. Inventory calculations incorrect
4. Architecture now inconsistent
5. Team confused about caching strategy

Root causes:
- Violated "caching at gateway only" constraint
- Violated "real-time order data" requirement
- Ignored architectural pattern
- Created inconsistency with other services

Impact:
- Wrong data shown to users
- Customer service complaints
- Inventory errors
- Architectural debt
- Emergency fix required
```

**Why this fails:**
- No memory bank consultation
- Constraints not checked
- Business context ignored
- Architectural violations undetected
- Performance prioritized over correctness
- Inconsistency introduced
- Technical debt created
- Quality issues in production

---

✅ GOOD Integration Testing (realistic, comprehensive):

**Pattern demonstrates:**
- Realistic environment
- Comprehensive tests
- Performance measured
- Issues detected

**Testing example:**
```
Component: PaymentProcessor
Change: AI optimized database queries
Validator: Eve

Integration Testing:

1. Test environment:
   - Staging environment (production-like)
   - Real database with prod-scale data (1M orders)
   - Real payment gateway (test mode)
   - Actual cache instance
   - Production configuration

2. Functional tests:
   Test: Process payment happy path
   Result: ✓ Pass

   Test: Handle declined card
   Result: ✓ Pass

   Test: Handle gateway timeout
   Result: ⚠️ Fail - Times out faster than before

   Test: Process refund
   Result: ✓ Pass

3. Performance tests:
   Baseline (before AI changes):
   - P95 latency: 180ms
   - Throughput: 500 req/s
   - DB queries: 3 per transaction

   Current (after AI changes):
   - P95 latency: 95ms ✓ (47% improvement)
   - Throughput: 750 req/s ✓ (50% improvement)
   - DB queries: 1 per transaction ✓ (67% reduction)

4. Load test:
   Simulated: 1000 concurrent users
   Result: ✓ System stable
   Errors: ✓ None
   Resource usage: ✓ Within limits

5. Failure mode test:
   Scenario: Database connection lost
   Result: ❌ Application crashes (was graceful before)

Issues found:
1. Gateway timeout handling regressed ⚠️
2. Database failure handling broken ❌

Analysis:
Issue 1: AI's optimization changed timeout value
Fix: Restore original timeout (3 seconds)

Issue 2: AI removed connection error handling
Fix: Restore error handling with retry logic

Re-test after fixes:
✓ All tests pass
✓ Performance maintained
✓ Failure handling restored

Decision: ✅ APPROVED (after fixes)
```

**Why this works:**
- Realistic test environment
- Comprehensive test coverage
- Performance measured
- Failure modes tested
- Issues detected before production
- Specific fixes applied
- Re-tested after fixes
- Quality assured

---

❌ BAD Integration Testing (local only, superficial):

**Anti-pattern characteristics:**
- Tested only locally
- Tiny test data
- No performance measurement
- No failure testing

**Bad testing:**
```
Component: PaymentProcessor
Change: AI optimized database queries
Validator: Frank

Testing:
"Ran unit tests on my laptop. All pass. Looks good."

*No integration testing*
*No realistic environment*
*No performance measurement*

Production deployment:

Hour 1: Performance excellent ✓
Hour 2: First database hiccup → application crashes ❌
Hour 3: Gateway timeout → application hangs ❌
Hour 4: Emergency rollback

Root causes missed by inadequate testing:
- Database connection error handling removed
- Gateway timeout logic changed
- Only tested with perfect conditions
- Never tested failure modes
- No realistic load testing

Impact:
- 4 hours downtime
- Failed transactions
- Emergency rollback
- Loss of optimization benefits
- Team trust in AI reduced
```

**Why this fails:**
- Local testing insufficient
- No integration environment used
- No realistic data volumes
- No failure mode testing
- No performance measurement
- False confidence from unit tests
- Production became the test environment
- Preventable issues caused outage
</examples>
