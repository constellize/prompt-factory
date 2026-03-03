---
# === Identity ===
id: maintain-dependency-hygiene
name: Maintain dependency hygiene to keep codebase secure and maintainable
version: v1

# === Classification ===
chapter: 4
category: excellence
subcategory: gate-4
tags:
  - quality
  - dependencies
  - security
  - npm
  - hygiene
  - gate-4

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Maintain dependency hygiene to keep codebase secure and maintainable.
    Managing dependencies with justification and security scanning (Gate 4: Maintainability in Context).
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
    description: The specific component to maintain dependency hygiene for
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
      **Maintain dependency hygiene** to keep your codebase secure and maintainable. Every dependency should be justified and documented—explain why it's needed and what alternatives were considered. Regularly scan for known security vulnerabilities in the dependency chain and address them promptly. Keep dependencies current with security patches without blindly upgrading everything. Minimize your dependency footprint by avoiding unnecessary libraries that add weight without clear value.
    preview: |
      "...audit and justify dependencies. Scan for security vulnerabilities. Keep dependencies current with security patches. Minimize footprint..."
  website:
    include: true
    path: /prompts/maintain-dependency-hygiene
  marketplace:
    plugin: constellize-excellence

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Maintain dependency hygiene for {{component_name}} in {{system_name}} to keep your codebase secure and maintainable.

Every dependency should be justified and documented—explain why it's needed and what alternatives were considered. Regularly scan for known security vulnerabilities in the dependency chain and address them promptly. Keep dependencies current with security patches without blindly upgrading everything. Minimize your dependency footprint by avoiding unnecessary libraries that add weight without clear value.

Follow this process:

1. **Audit and justify dependencies:**
   - List all direct dependencies (not transitive)
   - Document purpose for each dependency
   - Explain why chosen over alternatives
   - Remove unused dependencies
   - Question dependencies with large footprints

2. **Scan for security vulnerabilities:**
   - Run security scanner regularly (npm audit, Snyk, Dependabot)
   - Review and triage vulnerability reports
   - Prioritize critical and high severity issues
   - Apply security patches promptly
   - Document any accepted risks with rationale

3. **Keep dependencies current:**
   - Update dependencies with security patches (patch versions)
   - Review breaking changes before major upgrades
   - Test after dependency updates
   - Pin dependency versions (no wildcards in production)
   - Automate dependency update PRs (Dependabot, Renovate)

4. **Minimize dependency footprint:**
   - Prefer standard library over external dependencies
   - Evaluate size and maintenance status of dependencies
   - Avoid dependencies with large transitive dependency trees
   - Consider implementing simple utilities instead of dependencies
   - Remove dev dependencies from production builds
</task>

<context>
Component to maintain dependency hygiene:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates/updates:
- `docs/dependencies.md` (dependency justifications)
- Security scan reports
- Dependency update procedures
- Memory bank entries for dependency decisions
</context>

<thinking>
Before maintaining dependency hygiene, analyze:
1. What dependencies are actually used vs listed?
2. What security vulnerabilities exist in the dependency chain?
3. What dependencies have many transitive dependencies?
4. What dependencies are unmaintained or deprecated?
5. What functionality could use standard library instead?
</thinking>

<output-format>
Create dependency justification document following this pattern:

**Dependency Documentation Structure:**

1. **Per-Dependency Justification:**
   - Package name and version
   - Purpose (what functionality it provides)
   - Why needed (specific use cases)
   - Alternatives considered (with rejection reasons)
   - Impact metrics (transitive deps, bundle size)
   - Security status (last audit, vulnerabilities)
   - Maintenance status (update frequency, community health)

2. **Removed Dependencies Log:**
   - Package name and removal date
   - Reason for removal
   - Replacement approach
   - Impact of removal
   - Decision reference

3. **Dependency Policies:**
   - Security policy (vulnerability response times)
   - Update policy (patch/minor/major handling)
   - Addition policy (approval and evaluation criteria)

4. **Security Scan Results:**
   - Last scan date
   - Current vulnerability count
   - Historical scan archive location

**Dependency Justification Pattern:**
```
Package: [name] [version]
Purpose: [Core functionality provided]

Why needed:
- [Specific capability 1]
- [Specific capability 2]
- [Business/technical requirement]

Alternatives considered:
- [Option A]: [Why rejected]
- [Option B]: [Why rejected]
- [Build ourselves]: [Why rejected]

Impact:
- Transitive dependencies: [N]
- Bundle size: [X]KB
- Security: [Clean/Issues]
- Maintenance: [Active/Inactive frequency]
```

**Security Scanning Pattern:**

Implement automated vulnerability scanning:

**Scanning Approach:**
1. **Regular Schedule:** Run before deployments and on regular cadence
2. **Vulnerability Detection:** Use ecosystem-native tools
3. **Severity Triage:** Define response times per severity
4. **Remediation Actions:** Update, document exception, or mitigate
5. **Historical Tracking:** Archive scan results

**Scan Workflow Pattern:**
```
1. Run vulnerability scanner
2. Parse results by severity
3. For each critical/high:
   - Attempt automatic fix
   - If no fix: Document risk acceptance
   - Block deployment if unresolved
4. Schedule review for medium/low
5. Archive results with timestamp
6. Generate statistics report
```

**Scanning Metrics to Capture:**
- Vulnerability count by severity
- Outdated package count
- Deprecated package list
- Direct vs transitive dependency count
- Bundle size analysis

**Dependency Update Automation Pattern:**

Implement automated dependency update workflow:

**Update Workflow Elements:**
1. **Schedule:** Regular interval (e.g., weekly)
2. **Automation Scope:**
   - Auto-merge: Security patches only
   - Group review: Minor/patch updates
   - Manual review: Major version bumps
3. **PR Management:**
   - Limit concurrent update PRs
   - Auto-assign reviewers
   - Label for filtering
4. **Safety Controls:**
   - Test suite must pass
   - Manual review for breaking changes
   - Rollback capability

**Update Policy Pattern:**
```
Patch versions (x.y.Z):
- Auto-merge after tests pass
- Security fixes prioritized

Minor versions (x.Y.z):
- Group with patches for review
- Test before merging
- Check for deprecations

Major versions (X.y.z):
- Always manual review
- Evaluate breaking changes
- Test thoroughly
- Update documentation
```

**Dependency Decision Template Pattern:**

Document decision to add new dependency:

**Decision Structure:**
1. **Context:** What problem needs solving
2. **Options:** Build vs buy vs alternative
3. **Decision:** Clear choice statement
4. **Justification:** Why this dependency specifically
5. **Alternative Evaluation:** What else considered and why rejected
6. **Impact Analysis:**
   - Bundle size impact
   - Security posture
   - Maintenance burden
   - Transitive dependency impact
7. **Acceptance Criteria:** Checklist before adding
8. **References:** Links to package, alternatives, related decisions

**Decision Pattern:**
```
Decision: Add [package-name]
Status: [Proposed/Accepted/Rejected]

Context: Need [functionality] for [use case]

Options evaluated:
1. Build ourselves: [Time/maintenance cost]
2. Package A: [This choice]
3. Package B: [Alternative]

Justification for Package A:
- [Capability match]
- [Community/maintenance status]
- [Security posture]
- [Performance characteristics]

Why not alternatives:
- Build ourselves: [Resource constraint]
- Package B: [Specific limitation]

Impact:
- Bundle: +[X]KB
- Transitive deps: +[N]
- Security: [Assessment]
- Maintenance: [Effort estimate]

Acceptance criteria:
□ No critical vulnerabilities
□ Maintained within 6 months
□ Bundle impact acceptable
□ Team approval obtained
□ Docs updated
```
</output-format>

<instructions>
CRITICAL: Dependency hygiene prevents security vulnerabilities and dependency bloat.

NEVER maintain dependencies by:
- Adding dependencies without justification (bloat)
- Ignoring security vulnerabilities (risk)
- Using wildcard version ranges in production (unpredictable)
- Keeping unused dependencies (attack surface)
- Blindly auto-updating everything (breaks production)
- Adding dependencies without checking alternatives (premature)

DO NOT:
- Skip dependency justification documentation
- Ignore npm audit warnings
- Use deprecated packages
- Add dependencies with large transitive trees
- Forget to remove dev dependencies from production
- Auto-merge major version updates without testing

ALWAYS:
- Document why each dependency is needed
- Scan for security vulnerabilities before deployment
- Update security patches promptly (within days)
- Pin exact versions in lock file
- Remove unused dependencies
- Evaluate bundle impact before adding
- Check maintenance status (updated recently?)
- Consider implementing simple utilities yourself
- Review transitive dependency count
- Test after dependency updates

REPEAT: Every dependency is justified and documented. Scan for vulnerabilities regularly. Keep patches current. Minimize footprint.
</instructions>

<examples>
✅ GOOD Dependency Justification Pattern (thorough, considered):

**Pattern demonstrates:**
- Clear purpose and specific use cases
- Alternatives evaluated with rejection reasons
- Impact metrics quantified
- Maintenance status verified
- Decision documented and traceable

**Justification structure:**
```
Purpose: [What it provides]
Why needed: [Specific requirements]
Alternatives: [What else considered + why rejected]
Impact: [Bundle/deps/security/maintenance metrics]
Decision reference: [Traceability]
```

**Why this works:**
- Informed decision making
- Can re-evaluate later
- Impact understood upfront
- Alternatives documented
- Maintainability assessed

---

❌ BAD Dependency Anti-pattern (no justification):

**Anti-pattern characteristics:**
- Dependency added without documentation
- No alternative evaluation
- Impact unknown
- Maintenance status unchecked
- Wildcard versions
- No decision traceability

**Why this fails:**
- Can't evaluate if still needed
- Unknown impact on bundle/security
- No rationale for choice
- Dependency bloat accumulates
- Security posture unclear

---

✅ GOOD Security Scanning Pattern (regular, actionable):

**Pattern demonstrates:**
- Regular automated scanning schedule
- Clear severity-based response times
- Deployment gates for critical issues
- Exception documentation process
- Historical tracking

**Scanning workflow:**
```
Schedule: [Before deployment + regular cadence]
Severity response:
- Critical/High: Block deployment
- Medium: Review within [N] days
- Low: Review within [N] days
Exception handling: Document accepted risks
```

**Why this works:**
- Vulnerabilities caught early
- Clear remediation path
- Risk-based prioritization
- Audit trail maintained
- Compliance enabled

---

❌ BAD Security Scanning Anti-pattern (ignored):

**Anti-pattern characteristics:**
- No regular scanning
- Vulnerabilities ignored
- No severity-based response
- No exception process
- No historical tracking

**Why this fails:**
- Unknown security exposure
- Compliance violations
- Incident response delays
- No risk management
- Trust erosion

---

✅ GOOD Dependency Minimization Pattern (intentional, justified):

**Pattern demonstrates:**
- Active dependency removal
- Removal rationale documented
- Impact quantified
- Replacement approach described
- Decision traceable

**Removal documentation:**
```
Package removed: [Name + date]
Reason: [Why no longer needed]
Replacement: [Alternative approach]
Impact: [Bundle/deps reduced]
Decision: [Reference]
```

**Why this works:**
- Attack surface reduced
- Bundle size minimized
- Maintenance burden decreased
- Dependency count controlled
- Rationale preserved

---

❌ BAD Dependency Bloat Anti-pattern (unchecked):

**Anti-pattern characteristics:**
- Redundant packages (multiple HTTP clients)
- Deprecated packages included
- Unmaintained packages
- Trivial packages for simple functions
- Wildcard versions
- No removal process

**Why this fails:**
- Large bundle size
- Security vulnerabilities
- Maintenance burden
- No clear ownership
- Technical debt accumulates

---

✅ GOOD Dependency Update Policy Pattern (balanced):

**Pattern demonstrates:**
- Automated security patch merging
- Grouped minor updates for efficiency
- Manual major version review
- Test suite gating
- Risk-based automation

**Update policy structure:**
```
Patch (x.y.Z): Auto-merge after tests
Minor (x.Y.z): Group and review
Major (X.y.z): Manual review + thorough testing
Safety: Tests required + rollback capability
```

**Why this works:**
- Fast security response
- Breaking changes caught
- Review burden managed
- Risk balanced with currency
- Automation with safety

---

❌ BAD Dependency Update Anti-pattern (extremes):

**Extreme 1 - Never Update:**
- Manual updates only
- No automation
- Dependencies grow stale
- Vulnerabilities accumulate

**Extreme 2 - Auto-merge Everything:**
- All updates auto-merged
- Including major versions
- No testing gates
- Production breaks

**Why both fail:**
- No risk balance
- Either too slow (security risk) or too fast (stability risk)
- No consideration of change magnitude
- Testing bypassed or absent
</examples>
