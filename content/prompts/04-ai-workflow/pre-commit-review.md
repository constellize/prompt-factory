---
# === Identity ===
id: pre-commit-review
name: Enforce pre-commit quality gates to prevent issues from entering repository
version: v1

# === Classification ===
chapter: 4
category: ai-workflow
subcategory: review
tags:
  - quality
  - review
  - pre-commit
  - static-analysis
  - unit-tests
  - security
  - dependencies

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Enforce pre-commit quality gates to prevent issues from entering repository.
    Before code enters shared repository, run automated checks (Gate 5: Review Process).
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
    description: The specific component to enforce pre-commit quality gates for
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
      **Pre-commit review** prevents quality issues from entering the shared repository. Static analysis tools catch code style violations and potential bugs before they reach other developers. Unit tests must pass with appropriate coverage, ensuring that individual components behave correctly in isolation. Security scans identify high-severity vulnerabilities that could compromise the system. Dependency checks verify that no known vulnerable libraries are being introduced into the codebase.
    preview: |
      "...configure static analysis checks. Enforce unit test requirements. Run security scans and validate dependency safety..."
  website:
    include: true
    path: /prompts/pre-commit-review
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Enforce pre-commit quality gates for {{component_name}} in {{system_name}} to prevent quality issues from entering the shared repository.

Before code enters the shared repository, it must pass through automated checks that catch issues early. Static analysis tools catch code style violations and potential bugs before they reach other developers. Unit tests must pass with appropriate coverage, ensuring that individual components behave correctly in isolation. Security scans identify high-severity vulnerabilities that could compromise the system. Dependency checks verify that no known vulnerable libraries are being introduced into the codebase.

Follow this process:

1. **Configure static analysis checks:**
   - Set up linting for code style consistency
   - Enable bug detection patterns (unused variables, potential null references)
   - Configure complexity thresholds (cyclomatic complexity, function length)
   - Define code formatting rules
   - Fail commit on critical violations

2. **Enforce unit test requirements:**
   - Require unit tests to pass before commit
   - Set minimum code coverage threshold (e.g., 80%)
   - Verify new code has corresponding tests
   - Check that tests run quickly (fast feedback)
   - Prevent commits that break existing tests

3. **Run security vulnerability scans:**
   - Scan for high and critical severity vulnerabilities
   - Check for hardcoded secrets (API keys, passwords, tokens)
   - Detect common security anti-patterns
   - Block commits with critical security issues
   - Document any accepted risks with justification

4. **Validate dependency safety:**
   - Check for known vulnerabilities in dependencies
   - Detect deprecated or unmaintained packages
   - Verify license compatibility
   - Block introduction of vulnerable dependencies
   - Require security patch updates for critical issues
</task>

<context>
Component to enforce pre-commit gates:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates/updates:
- `.git/hooks/pre-commit` or CI pre-commit configuration
- `docs/quality-gates/pre-commit.md` (gate documentation)
- Static analysis configuration files
- Test coverage configuration
- Security scan configuration
</context>

<thinking>
Before enforcing pre-commit gates, analyze:
1. What static analysis tools are appropriate for the language/framework?
2. What unit test coverage threshold is realistic and valuable?
3. What security vulnerabilities should block commits immediately?
4. What dependency vulnerabilities are critical vs low priority?
5. How fast can these checks run to maintain developer flow?
</thinking>

<output-format>
Create pre-commit gate configuration following these patterns:

**Static Analysis Gate Pattern:**

Configure linting and code analysis:

**Analysis Categories:**
1. **Code Style:**
   - Formatting consistency (indentation, spacing, naming)
   - Import organization
   - Comment quality

2. **Bug Detection:**
   - Unused variables and imports
   - Potential null/undefined references
   - Type errors (if applicable)
   - Logic errors (unreachable code, infinite loops)

3. **Complexity Metrics:**
   - Cyclomatic complexity threshold
   - Function length limits
   - Nesting depth limits
   - Parameter count limits

**Configuration Pattern:**
```
Static Analysis Rules:
- Severity levels: error (block), warning (notify), info (suggest)
- Auto-fix: Enable for style issues when safe
- Ignore patterns: Generated code, vendor files
- Performance: Should complete in <10 seconds
```

**Enforcement Pattern:**
```
Severity handling:
- Error: Block commit, require fix
- Warning: Allow commit with notification
- Info: Allow commit, display suggestion

Bypass mechanism:
- Allow bypass for emergencies with flag/reason
- Log all bypasses for audit
- Require review comment when bypassing
```

---

**Unit Test Gate Pattern:**

Enforce test execution and coverage:

**Test Execution Requirements:**

1. **Test Passing:**
   - All unit tests must pass
   - No skipped/disabled tests without justification
   - Test output must be clean (no errors/warnings)

2. **Coverage Thresholds:**
   - Line coverage: Minimum percentage (e.g., 80%)
   - Branch coverage: Minimum percentage (e.g., 75%)
   - New code coverage: Higher threshold (e.g., 90%)

3. **Performance Requirements:**
   - Unit tests complete in <30 seconds
   - Individual tests run in <100ms
   - Slow tests flagged for optimization

**Coverage Pattern:**
```
Coverage Requirements:
- Overall: [minimum]% line coverage
- New code: [higher]% line coverage
- Critical paths: 100% coverage
- Generated code: Excluded from metrics

Measurement approach:
1. Run tests with coverage instrumentation
2. Generate coverage report
3. Compare against thresholds
4. Block commit if below threshold
5. Report coverage delta (+/- from previous)
```

**Test Quality Pattern:**
```
Quality checks:
- No commented-out tests
- No tests that always pass (no assertions)
- No overly broad try-catch blocks hiding failures
- Meaningful test names describing behavior
- Arrange-Act-Assert structure maintained
```

---

**Security Vulnerability Gate Pattern:**

Scan for security issues before commit:

**Scanning Categories:**

1. **Code Security Patterns:**
   - SQL injection vulnerabilities
   - Cross-site scripting (XSS) risks
   - Path traversal vulnerabilities
   - Insecure cryptography usage
   - Authentication/authorization bypasses

2. **Secret Detection:**
   - API keys and tokens
   - Passwords and credentials
   - Private keys and certificates
   - Connection strings with credentials
   - OAuth client secrets

3. **Dependency Vulnerabilities:**
   - Known CVEs in direct dependencies
   - High/critical severity vulnerabilities
   - Exploitability assessment
   - Available patches/fixes

**Scanning Workflow Pattern:**
```
Scan execution:
1. Static security analysis on changed code
2. Secret pattern matching across all changes
3. Dependency vulnerability check
4. Aggregate results by severity

Severity-based handling:
- Critical: Block commit immediately
- High: Block commit, require justification to bypass
- Medium: Allow with warning, create tracking issue
- Low: Allow with notification
```

**Secret Detection Pattern:**
```
Detection approach:
- Pattern matching: API key formats, credential patterns
- Entropy analysis: High-entropy strings that look like secrets
- Historical checking: Secrets in git history (not just latest)

Action on detection:
1. Block commit
2. Alert developer with specific location
3. Provide remediation guidance:
   - Remove secret from code
   - Move to environment variables
   - Rotate compromised credential
   - Check if secret was pushed to remote
```

---

**Dependency Safety Gate Pattern:**

Validate dependency changes:

**Dependency Checks:**

1. **Vulnerability Scanning:**
   - Query vulnerability databases
   - Check direct and transitive dependencies
   - Assess severity and exploitability
   - Verify patch availability

2. **Maintenance Status:**
   - Check last update date
   - Verify active maintenance
   - Detect deprecated packages
   - Check for security response process

3. **License Compliance:**
   - Extract license information
   - Check against allowed licenses
   - Detect license conflicts
   - Flag GPL/copyleft in proprietary code

**Validation Workflow Pattern:**
```
Dependency validation:
1. Extract changed dependencies from manifest
2. For each new/updated dependency:
   - Check vulnerability databases
   - Assess maintenance status
   - Verify license compatibility
3. Aggregate risk assessment
4. Block or warn based on findings

Severity thresholds:
- Critical vulnerability: Block commit
- High vulnerability: Require justification
- Deprecated package: Warn, suggest alternative
- License conflict: Block commit
- Unmaintained (>1 year): Warn
```

**Risk Documentation Pattern:**
```
When accepting risk:
- Document specific vulnerability ID
- Explain why accepting risk (no alternative, low exploitability)
- Set review date for reassessment
- Link to tracking issue
- Require security team approval for critical issues
```

---

**Pre-Commit Hook Implementation Pattern:**

Configure automated gate execution:

**Hook Structure:**
```
Pre-commit execution flow:
1. Detect changed files
2. Run applicable checks in parallel:
   - Static analysis on code files
   - Tests affected by changes
   - Security scan on all changes
   - Dependency check if manifest changed
3. Aggregate results
4. Block or allow commit based on failures
5. Display actionable feedback
```

**Performance Optimization:**
```
Fast feedback techniques:
- Run only checks relevant to changed files
- Cache results when possible
- Parallelize independent checks
- Provide progress indicators
- Timeout long-running checks
```

**Developer Experience Pattern:**
```
Feedback quality:
- Clear error messages with file:line locations
- Actionable fix suggestions
- Documentation links for complex issues
- Easy bypass for emergencies (with audit trail)
- Summary statistics (passed/failed checks)
```

---

**Gate Configuration Documentation Pattern:**

Document gate requirements and bypass procedures:

**Documentation Structure:**

1. **Gate Overview:**
   - Purpose: Why this gate exists
   - Checks performed: What gets validated
   - Timing: When checks run (pre-commit hook, CI)
   - Performance: Expected duration

2. **Check Descriptions:**
   - For each check: What it validates, why it matters
   - Severity levels and consequences
   - Common failures and solutions
   - Configuration options

3. **Bypass Procedures:**
   - When bypass is appropriate
   - How to bypass (flags, commands)
   - Audit/logging requirements
   - Approval requirements for certain bypasses

4. **Troubleshooting:**
   - Common issues and solutions
   - Performance problems
   - False positives handling
   - Support resources

**Documentation Pattern:**
```markdown
# Pre-Commit Quality Gates

## Purpose
Prevent quality issues from entering shared repository by catching:
- Code style violations → consistency
- Test failures → correctness
- Security vulnerabilities → safety
- Dependency risks → supply chain security

## Checks Performed

### Static Analysis
**What:** Linting, bug detection, complexity metrics
**Threshold:** No errors, warnings allowed
**Duration:** ~5 seconds
**Common failures:**
- Formatting issues → Run formatter
- Unused imports → Remove them
- Complexity too high → Refactor function

### Unit Tests
**What:** All unit tests execution + coverage
**Threshold:** 100% passing, 80% coverage
**Duration:** ~15 seconds
**Common failures:**
- Test failure → Fix failing test or code
- Low coverage → Add missing tests
- Slow tests → Optimize or move to integration

### Security Scan
**What:** Vulnerability detection, secret scanning
**Threshold:** No critical/high severity issues
**Duration:** ~10 seconds
**Common failures:**
- Secret detected → Remove, use env variable
- Vulnerability found → Update dependency or accept risk

### Dependency Check
**What:** Vulnerability and license scanning
**Threshold:** No critical vulnerabilities
**Duration:** ~5 seconds
**Common failures:**
- Vulnerable dependency → Update to patched version
- License conflict → Choose compatible library

## Bypass Procedures

**Emergency bypass:**
```
[command] --no-verify
```
**When to use:** Production incident fix, time-critical hotfix
**Requirements:**
- Document reason in commit message
- Create follow-up issue to fix properly
- Notify team of bypass

## Troubleshooting

**Issue:** Checks taking too long
**Solution:** Check if running on all files instead of just changed files

**Issue:** False positive in security scan
**Solution:** Add exception to configuration with justification comment

**Issue:** Coverage dropping on refactor
**Solution:** Update tests to match refactored code structure
```
</output-format>

<instructions>
CRITICAL: Pre-commit quality gates prevent issues from entering the shared repository.

NEVER implement pre-commit gates by:
- Running slow checks that break developer flow (>30 seconds)
- Blocking on low-severity issues (save those for CI)
- Checking generated or vendor code (waste of time)
- Running without clear error messages (frustrating)
- Making bypass impossible (emergencies happen)
- Skipping documentation (gates need explanation)

DO NOT:
- Run full test suite (only unit tests at pre-commit)
- Block on warnings (errors only)
- Run integration/E2E tests (too slow for pre-commit)
- Check code style if auto-fix available (just fix it)
- Require 100% coverage (unrealistic threshold)
- Block on low severity security issues (handle in CI)

ALWAYS:
- Keep checks fast (<30 seconds total)
- Run only checks relevant to changed files
- Provide clear, actionable error messages
- Allow emergency bypass with audit trail
- Auto-fix what can be safely fixed
- Document bypass procedures
- Parallelize independent checks
- Block on critical security issues
- Require unit tests to pass
- Validate dependency changes

REPEAT: Pre-commit gates catch issues early. Keep checks fast. Provide clear errors. Block on critical issues. Allow emergency bypass with documentation.
</instructions>

<examples>
✅ GOOD Pre-Commit Gate Pattern (fast, focused, actionable):

**Pattern demonstrates:**
- Fast execution (<30 seconds)
- Only checks changed files
- Clear actionable errors
- Documented bypass
- Parallelized checks

**Gate structure:**
```
Pre-commit execution (25 seconds total):
├─ Static analysis (5s) - parallel
│  └─ Changed files only
├─ Unit tests (15s) - parallel
│  └─ Tests for changed code only
├─ Security scan (3s) - parallel
│  └─ Changed files + dependency check
└─ Coverage check (2s)
   └─ New code coverage

Results:
✓ Static analysis: passed
✓ Unit tests: 127 passed
✓ Security: no issues
✓ Coverage: 87% (+2%)

Commit allowed.
```

**Error message example:**
```
❌ Pre-commit check failed: Unit tests

Failed tests:
  src/payment/processor.test.ts:45
    ✗ should process payment correctly
      Expected: 200
      Received: 500

Fix: Update test or fix payment processing logic
Run: npm test src/payment/processor.test.ts
Bypass: git commit --no-verify (document reason)
```

**Why this works:**
- Developer gets clear feedback in <30 seconds
- Errors are actionable with file:line
- Can run specific tests to debug
- Bypass available for emergencies
- Checks focused on changed code only

---

❌ BAD Pre-Commit Gate Anti-pattern (slow, unclear, blocking):

**Anti-pattern characteristics:**
- Slow execution (5+ minutes)
- Checks all files, not just changes
- Vague error messages
- No bypass mechanism
- Blocks on low-severity warnings

**Bad gate execution:**
```
Pre-commit execution (8 minutes):
├─ Lint entire codebase (2m)
├─ Run all tests including integration (5m)
├─ Full security scan (1m)
└─ Check all dependencies

Results:
✗ 15 style warnings in files you didn't touch
✗ 3 integration tests flaky
✗ Low severity issue in transitive dependency
✗ Coverage 79.8% (below 80% threshold)

Commit blocked. No bypass available.
```

**Vague error message:**
```
❌ Tests failed

Some tests didn't pass. Fix them.
```

**Why this fails:**
- 8 minutes destroys developer flow
- Blocks on issues in code you didn't change
- Vague errors don't tell you what to fix
- No bypass for legitimate emergency
- Checks slow integration tests at commit time
- Fails on 0.2% coverage difference

---

✅ GOOD Security Scan Pattern (focused, actionable):

**Pattern demonstrates:**
- Fast secret detection
- Clear severity handling
- Actionable remediation
- Risk documentation process

**Scan execution:**
```
Security scan (8 seconds):
├─ Secret detection (3s) - pattern matching + entropy
├─ Code vulnerability scan (3s) - changed files only
└─ Dependency CVE check (2s) - if manifest changed

Severity handling:
- Critical → Block commit immediately
- High → Block with bypass option (requires justification)
- Medium → Warn, create issue
- Low → Notify only
```

**Secret detection alert:**
```
❌ Security check failed: Secret detected

src/api/client.ts:12
  const apiKey = "sk_live_1234567890abcdef"

Risk: Hardcoded API key in source code
Severity: Critical

Remediation:
1. Remove the hardcoded key
2. Move to environment variable:
   const apiKey = process.env.API_KEY
3. Rotate the compromised key at provider
4. Verify key wasn't pushed to remote

Block reason: Critical secrets cannot be committed
Bypass: Not available for secret detection
```

**Why this works:**
- Fast feedback (<10 seconds)
- Specific file and line number
- Clear risk explanation
- Step-by-step remediation
- No bypass for critical secrets

---

❌ BAD Security Scan Anti-pattern (slow, noisy, unhelpful):

**Anti-pattern characteristics:**
- Slow full codebase scan
- Blocks on low-severity info
- No remediation guidance
- Can't distinguish real from false positives

**Bad scan execution:**
```
Security scan (12 minutes):
├─ Full codebase analysis
├─ All dependencies (including dev)
└─ All historical commits

Results:
✗ 150 potential issues found
  - 145 Low severity
  - 3 Medium
  - 2 False positives

Commit blocked.
```

**Unhelpful alert:**
```
❌ Security issues detected

Found 150 security issues.
Review security report.
```

**Why this fails:**
- 12 minutes unacceptable at commit
- Blocks on low severity noise
- No specific location or guidance
- Can't tell real issues from false positives
- No way to address 150 issues immediately
- No bypass for non-critical issues

---

✅ GOOD Coverage Gate Pattern (realistic, focused on new code):

**Pattern demonstrates:**
- Different thresholds for existing vs new code
- Fast coverage calculation
- Clear delta reporting
- Focused on changed code only

**Coverage check:**
```
Coverage analysis (3 seconds):

Overall coverage: 81.2% (unchanged)
New code coverage: 92.5% ✓ (exceeds 90% threshold)

Changes:
  src/payment/processor.ts
    Lines: 45/50 (90%)
    Branches: 8/10 (80%)
  src/payment/validator.ts
    Lines: 25/25 (100%)
    Branches: 6/6 (100%)

Summary: +70 lines, +63 covered (+90%)
Result: ✓ Coverage gate passed
```

**Why this works:**
- Fast (only tests affected code)
- Realistic thresholds (80% overall, 90% new)
- Clear delta reporting
- Doesn't block on existing tech debt
- Focuses on improving coverage over time

---

❌ BAD Coverage Gate Anti-pattern (unrealistic, brittle):

**Anti-pattern characteristics:**
- Requires 100% coverage
- Blocks on 0.1% drops
- Includes generated code
- No differentiation between critical and trivial code

**Bad coverage check:**
```
Coverage analysis (15 minutes):

Overall coverage: 99.89% ✗ (below 100% threshold)

Missing coverage:
  - 1 line in generated migration file
  - 1 error handler for impossible condition
  - 1 compatibility shim for ancient browser

Commit blocked.
```

**Why this fails:**
- 100% coverage unrealistic and wasteful
- Blocks on trivial uncovered lines
- Includes generated code in metrics
- Wastes time testing impossible conditions
- No consideration of code importance
</examples>
