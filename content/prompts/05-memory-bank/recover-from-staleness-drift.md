---
# === Identity ===
id: recover-from-staleness-drift
name: Recover memory bank from staleness where docs describe past not present
version: v1

# === Classification ===
chapter: 5
category: memory-bank
subcategory: failure
tags:
  - documentation
  - memory-bank
  - failure-recovery
  - staleness-recovery
  - documentation-debt
  - accuracy-restoration
  - validation
  - prevention
  - code-documentation-sync
  - recovery-patterns

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Recover memory bank from staleness where docs describe past not present.
    Reconcile documentation with reality when memory bank has drifted from actual codebase state.
  argument-hint: "[project_name] [staleness_indicators]"
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
  - name: project_name
    description: The specific project to recover memory bank for
    example: "E-commerce Platform"
    maps-to: "$0"
  - name: staleness_indicators
    description: Specific signs of staleness observed
    example: "Memory bank references removed authentication service, describes old API structure"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 5
    description: |
      **Recover from staleness drift** where documentation describes the system as it was. Identify stale entries by comparing against current code, audit actual code structure and active patterns, update entries to match reality, and implement prevention measures.
    preview: |
      "...compare memory bank to current codebase identifying stale references, obsolete decisions, outdated patterns..."
  website:
    include: true
    path: /prompts/recover-from-staleness-drift
  marketplace:
    plugin: constellize-memory-bank

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Recover memory bank for {{project_name}} from staleness drift where documentation describes the system as it was rather than as it is.

Identify stale entries by comparing memory bank documentation against current codebase reality, finding references to non-existent files, obsolete architectural decisions, and patterns that no longer match implementation. Audit current state systematically by examining actual code structure, active patterns in use, recent changes not documented, and gaps between described and actual architecture. Update entries to match reality by rewriting outdated sections with current information, marking what changed and when, removing references to deleted code, and adding missing recent developments. Validate accuracy through code cross-reference checks ensuring every file mentioned exists, architectural descriptions match implementation, patterns documented are actually in use, and recent features are captured.

Treat staleness recovery as reconciliation between documentation and reality rather than starting from scratch, preserving historical context while correcting current state. This approach maintains the value of past decisions and evolution while ensuring the memory bank accurately reflects today's system.

Follow this process:

1. **Identify stale entries:**
   - Compare memory bank to current codebase structure
   - Find references to deleted or moved files
   - Identify obsolete architectural decisions
   - Note patterns described but not implemented
   - Check if recent features are documented

2. **Audit current reality:**
   - Examine actual code organization
   - Document patterns actively in use
   - Review recent commits for undocumented changes
   - Interview team about current practices
   - Map actual vs documented architecture

3. **Update to match reality:**
   - Rewrite stale sections with current information
   - Mark evolution: "Previously X, now Y as of [date]"
   - Remove dead code references
   - Add missing recent developments
   - Preserve historical context where valuable

4. **Validate accuracy:**
   - Cross-reference every file path mentioned
   - Verify architectural descriptions match code
   - Confirm patterns are actually in use
   - Check that recent work is captured
   - Test: Could new engineer follow these docs successfully?
</task>

<context>
Project to recover memory bank:
{{project_name}}

Staleness indicators observed:
{{staleness_indicators}}

**Standard Construction Folder Structure:**
This prompt updates:
- `memory-bank/systemPatterns.md` (correct architectural patterns)
- `memory-bank/techContext.md` (update file paths, tools, conventions)
- `memory-bank/activeContext.md` (current state, not past state)
- `memory-bank/progress.md` (mark completed work, add missing items)
- `memory-bank/productContext.md` (current user needs and metrics)
- `memory-bank/projectbrief.md` (if scope or requirements evolved)
</context>

<thinking>
Before recovering from staleness, analyze:
1. How far has the codebase diverged from documentation?
2. Which areas are most critical to update first?
3. What recent changes are completely undocumented?
4. Can we preserve any historical context while updating?
5. What validation will prove accuracy restored?
6. How do we prevent this from recurring?
</thinking>

<output-format>
Create staleness recovery following these patterns:

**Staleness Detection Pattern:**

Systematically identify stale documentation:

**Detection Checklist:**
```
File Reference Validation:
□ Check every file path mentioned in memory bank exists
□ Verify file locations match documentation
□ Find moved files and update references
□ Remove references to deleted files

Architectural Accuracy:
□ Compare described architecture to actual structure
□ Verify component relationships match implementation
□ Check that patterns documented are patterns used
□ Identify architectural changes not captured

Pattern Currency:
□ Confirm coding patterns match current practice
□ Verify conventions described are conventions followed
□ Check that newer patterns aren't missing
□ Identify obsolete patterns still documented

Feature Completeness:
□ List recent features (last 3 months)
□ Check each has memory bank entry
□ Verify feature descriptions match implementation
□ Add missing feature documentation

Decision Validity:
□ Review documented decisions still apply
□ Check if circumstances that drove decisions changed
□ Verify technical choices match current implementation
□ Update superseded decisions
```

**Detection Tools:**
```
Automated checks:
- Script to verify all file paths in memory bank exist
- Git diff between last memory bank update and current
- Grep for component names in code vs memory bank
- Dead link detection in cross-references

Manual validation:
- Code review of recent PRs vs memory bank entries
- Team interview: "Does memory bank match reality?"
- New engineer test: Follow docs, note confusion
- Spot check: Random memory bank section vs actual code
```

---

**Reality Audit Pattern:**

Document current state systematically:

**Audit Procedure:**
```
1. Current Architecture (2 hours):
   - Draw actual system diagram from code
   - List all services/components that exist
   - Document data flow as implemented
   - Map dependencies between components
   - Compare to memory bank architecture

2. Active Patterns (1 hour):
   - Review recent PRs for patterns used
   - Identify coding conventions in practice
   - Document error handling approach (actual)
   - Note testing patterns being followed
   - List patterns in docs but not in code

3. Recent Changes (1 hour):
   - Review git log since last memory bank update
   - List features added
   - Note refactorings completed
   - Document migrations performed
   - Identify breaking changes

4. File Inventory (30 minutes):
   - List all source files by area
   - Note configuration files
   - Document key entry points
   - Map file organization
   - Compare to memory bank file references

5. Team Knowledge (1 hour):
   - Interview engineers about current state
   - Ask: "What's confusing in memory bank?"
   - Collect: "What changed recently?"
   - Gather: "What's missing from docs?"
   - Document: "What do new engineers ask?"
```

**Reality Documentation Template:**
```
Current State Audit: [Date]

Architecture Reality:
- Services: [List actual services]
- Components: [List actual components]
- Data flow: [Actual flow description]
- Differs from memory bank: [Key differences]

Active Patterns:
- Error handling: [Actual pattern]
- Testing: [Actual approach]
- State management: [Actual implementation]
- API design: [Actual pattern]
- Differs from memory bank: [Key differences]

Recent Undocumented Changes (last 3 months):
1. [Feature/change]: [What was done] - [Date]
2. [Feature/change]: [What was done] - [Date]
...

File Organization:
- src/: [Actual structure]
- config/: [Actual structure]
- Differs from memory bank: [Key differences]

Team Feedback:
- Most confusing: [What's wrong in docs]
- Most missing: [What should be added]
- Most outdated: [What's stale]
```

---

**Update Pattern:**

Correct stale entries systematically:

**Update Template:**
```
For each stale entry:

[Original stale content]

**Updated ([date]):**

Current Reality:
[Accurate description of current state]

What Changed:
- [Change 1] (as of [date])
- [Change 2] (as of [date])

Why Changed:
- [Reason for change]

Historical Context:
The original description above was accurate from [start date]
to [end date]. [Brief explanation of evolution].

Current Location:
- [Actual file paths]
- [Actual component names]
```

**Example Stale Entry Update:**
```
BEFORE (Stale):

## Authentication Service

Location: src/services/auth/AuthService.js

We use session-based authentication with Redis session storage.
The AuthService handles login, logout, and session validation.

Key components:
- AuthService: Main authentication logic
- SessionStore: Redis session management
- SessionMiddleware: Express middleware for session validation

(This is stale - we migrated to JWT months ago)

---

AFTER (Updated):

## Authentication Service

**Updated (2026-01-21):**

Current Reality:
We use hybrid JWT + refresh token authentication supporting
web and mobile clients. Short-lived JWTs (15 min) for API
authentication, long-lived refresh tokens (7 days) with
server-side revocation.

Current Location:
- src/auth/JWTService.js: JWT generation and validation
- src/auth/RefreshTokenService.js: Refresh token management
- src/middleware/authMiddleware.js: JWT verification middleware
- src/models/RefreshToken.js: Refresh token database model

What Changed:
- Migrated from sessions to JWT (March 2026)
- Added refresh token system (March 2026)
- Removed Redis session store (March 2026)
- AuthService.js renamed to JWTService.js (March 2026)

Why Changed:
Mobile app requirements necessitated stateless authentication.
Session cookies don't work well in mobile context. JWT enables
offline capability and cross-platform support.

Historical Context:
The session-based approach above was accurate from June 2025
to March 2026 (9 months). See memory-bank/archived/2026/session-auth/
for complete history and lessons learned from migration.

Related:
- systemPatterns.md: "Hybrid Authentication Architecture"
- techContext.md: "JWT Configuration"
```

---

**Bulk Update Pattern:**

Efficiently update multiple stale entries:

**Priority-Based Update Strategy:**
```
Priority 1 (Update immediately - actively misleading):
- Architectural descriptions that are wrong
- File paths that don't exist
- Patterns that contradict current practice
- Security procedures that are outdated

Priority 2 (Update soon - causes confusion):
- Missing recent major features
- Obsolete tooling documentation
- Incomplete current state descriptions
- Outdated team practices

Priority 3 (Update when possible - low impact):
- Historical context improvements
- Minor file path updates
- Enhanced examples
- Additional cross-references
```

**Batch Update Workflow:**
```
1. Triage all stale entries by priority (30 min)
   - Create list of Priority 1 items (must fix now)
   - List Priority 2 items (fix this week)
   - Note Priority 3 items (fix this month)

2. Fix Priority 1 entries (4-6 hours)
   - Update each with current reality
   - Mark evolution clearly
   - Cross-reference to current docs
   - Validate accuracy

3. Fix Priority 2 entries (3-4 hours)
   - Add missing recent features
   - Update tooling docs
   - Correct current state
   - Update practices

4. Schedule Priority 3 updates (ongoing)
   - Add to backlog
   - Update during slow periods
   - Assign to team members

Total recovery time: 1-2 days for critical items
Ongoing: Lower priority items over 2-4 weeks
```

---

**File Reference Update Pattern:**

Correct file paths systematically:

**File Path Correction Process:**
```
1. Extract all file paths from memory bank:
   grep -r "src/" memory-bank/ > file-references.txt

2. Validate each path exists:
   for path in $(cat file-references.txt); do
     [ -f "$path" ] || echo "Missing: $path"
   done

3. For missing paths, find where they moved:
   git log --all --full-history -- "old/path/file.js"

4. Update memory bank with correct paths:
   - Replace old path with new path
   - Add note: "Moved from X to Y (date)"

5. Remove references to deleted files:
   - Note in memory bank: "Removed (date)"
   - Explain why removed if significant
   - Link to replacement if exists
```

**File Reference Template:**
```
Component: [Name]

Current Location: [Actual path]
Previous Location: [Old path] (moved [date])
Related Files:
- [File 1]: [Current path]
- [File 2]: [Current path]

If file was deleted:
Component: [Name]
Status: Removed ([date])
Reason: [Why removed]
Replacement: [What replaced it, if anything]
```

---

**Validation Pattern:**

Ensure accuracy restored:

**Validation Checklist:**
```
File Path Validation:
□ Every file path mentioned exists
□ No references to deleted files (unless marked "Removed")
□ Moved files have updated paths with move notes
□ All file paths tested (automated script passes)

Architectural Validation:
□ Architecture diagram matches actual system
□ Component descriptions match implementation
□ Data flows described match actual flows
□ Dependencies listed are actual dependencies

Pattern Validation:
□ Coding patterns match recent PRs
□ Conventions described are conventions followed
□ Testing approaches match actual tests
□ Error handling matches implementation

Feature Completeness:
□ All features from last 3 months documented
□ Feature descriptions match actual implementation
□ No major missing features
□ Recent architectural changes captured

Decision Currency:
□ Documented decisions still apply
□ Superseded decisions marked as such
□ New decisions captured
□ Rationale still valid

New Engineer Test:
□ Give memory bank to new engineer
□ Ask them to explain system
□ Note confusion points
□ Fix anything misleading
```

**Automated Validation Script:**
```bash
#!/bin/bash
# validate-memory-bank.sh

echo "Validating memory bank accuracy..."

# Check file references
echo "Checking file references..."
grep -r "src/" memory-bank/ | grep -o 'src/[^ ]*' | sort -u | while read path; do
  if [ ! -f "$path" ] && [ ! -d "$path" ]; then
    echo "❌ Missing: $path"
  fi
done

# Check for common staleness indicators
echo "Checking for staleness indicators..."
if grep -r "TODO" memory-bank/ >/dev/null; then
  echo "⚠️  Found TODO markers in memory bank"
fi

# Check last update date
last_update=$(git log -1 --format=%cd --date=short memory-bank/)
days_since=$(( ($(date +%s) - $(date -d "$last_update" +%s)) / 86400 ))
if [ $days_since -gt 30 ]; then
  echo "⚠️  Memory bank not updated in $days_since days"
fi

# Check for recently added files not in memory bank
recent_files=$(git diff --name-only HEAD~20 HEAD | grep "^src/")
for file in $recent_files; do
  if ! grep -r "$file" memory-bank/ >/dev/null; then
    echo "⚠️  Recent file not in memory bank: $file"
  fi
done

echo "Validation complete"
```

---

**Prevention Pattern:**

Prevent future staleness:

**Staleness Prevention Strategies:**
```
1. Update Triggers:
   - After every feature: Update memory bank
   - After refactoring: Update affected patterns
   - After architecture change: Update systemPatterns.md
   - Weekly: Review activeContext.md for accuracy

2. Validation Automation:
   - Pre-commit hook: Check file references
   - CI check: Validate memory bank (script above)
   - Weekly cron: Report staleness indicators
   - Monthly: Full memory bank accuracy review

3. Team Practices:
   - PR template: "Memory bank updated? Y/N"
   - Code review: Check memory bank updated
   - Sprint retrospective: Review memory bank accuracy
   - Onboarding: New engineer reads memory bank, notes issues

4. Responsibility Assignment:
   - Rotating "memory bank steward" role (weekly)
   - Steward reviews all PRs for memory bank impact
   - Steward ensures updates happen
   - Steward runs validation weekly

5. Visibility:
   - Dashboard: Days since last memory bank update
   - Slack reminder: Weekly memory bank check
   - Team metric: Memory bank accuracy score
   - Celebrate: Recognize good memory bank maintenance
```

**Memory Bank Accuracy Score:**
```
Calculate weekly accuracy score:

File References: (valid refs / total refs) × 25 points
Feature Coverage: (documented features / total features) × 25 points
Recency: 25 points if updated <7 days, 15 if <14 days, 0 if >30 days
Team Confidence: (team survey: 1-10) × 2.5 points

Total: 0-100 points

>90: Excellent (green)
70-90: Good (yellow)
<70: Needs attention (red)

Display on team dashboard, track over time
```

</output-format>

<instructions>
CRITICAL: Staleness recovery reconciles documentation with reality.

NEVER recover by:
- Deleting entire memory bank and starting over (history lost)
- Updating without marking what changed (evolution lost)
- Removing historical context (learning lost)
- Fixing symptoms without addressing causes (recurrence inevitable)
- Batch updating without validation (new errors introduced)

DO NOT:
- Just delete stale entries
- Update without noting evolution
- Skip validation of updates
- Ignore root causes of staleness
- Fix only what's obviously broken
- Forget to prevent recurrence

ALWAYS:
- Compare memory bank to actual codebase systematically
- Update stale entries with current reality
- Mark what changed and when
- Preserve valuable historical context
- Validate all updates against actual code
- Implement prevention measures
- Test with new engineer perspective

REPEAT: Staleness recovery is reconciliation, not deletion. Update to match reality while preserving history and preventing recurrence.
</instructions>

<examples>
✅ GOOD Staleness Recovery (systematic, validated, prevents recurrence):

**Pattern demonstrates:**
- Systematic staleness detection
- Current reality audit
- Updates with evolution marking
- Comprehensive validation
- Prevention measures implemented

**Example recovery:**
```
Staleness Recovery: E-commerce Platform
Date: 2026-01-21
Issue: Memory bank describes system as of March 2025,
       codebase evolved significantly

---

DETECTION PHASE (2 hours):

Ran validation script:
❌ 23 file paths don't exist
❌ Authentication service description wrong
❌ Last 15 features undocumented
❌ API architecture completely changed
❌ Last update: 4 months ago

Manual audit identified:
- GraphQL migration not documented (April 2025)
- Microservices split not captured (May 2025)
- New payment system missing (June 2025)
- Frontend rewrite not mentioned (July-Sept 2025)

Priority Triage:
P1 (Fix now):
- Authentication docs (completely wrong, security concern)
- API architecture (misleading, prevents understanding)
- File paths (23 broken references)

P2 (Fix this week):
- Missing 15 features
- Microservices documentation
- Payment system docs

P3 (Fix this month):
- Enhanced examples
- Additional cross-references
- Historical context improvements

---

REALITY AUDIT PHASE (4 hours):

Current Architecture Documented:
- 5 microservices (was monolith)
- GraphQL API (was REST)
- Event-driven communication (was HTTP)
- Distributed data stores (was single database)

Active Patterns Identified:
- Error handling: Structured logging + APM traces
- Testing: Integration tests per service + E2E
- State management: Event sourcing for orders
- API design: GraphQL schema-first

Recent Changes Captured:
1. GraphQL migration (April 2025) - 6 week project
2. Microservice split (May 2025) - 3 services extracted
3. Payment v2 (June 2025) - Stripe Connect integration
4. Frontend rewrite (July-Sept 2025) - React to Next.js
5. Event sourcing (Oct 2025) - Order service refactoring

File Inventory:
- services/api-gateway/: GraphQL gateway
- services/order-service/: Order management
- services/payment-service/: Payment processing
- services/catalog-service/: Product catalog
- services/user-service/: User management
- web-app/: Next.js frontend

---

UPDATE PHASE (8 hours):

Updated systemPatterns.md:

BEFORE (Stale):
## System Architecture

Monolithic Node.js application with REST API.
Frontend is React SPA making API calls.

AFTER (Updated):

## System Architecture

**Updated (2026-01-21):**

Current Reality:
Microservices architecture with 5 services communicating
via events. GraphQL API gateway for client requests.
Next.js web application for frontend.

Architecture:
- api-gateway: GraphQL gateway, routes to services
- order-service: Order management, event-sourced
- payment-service: Stripe Connect integration
- catalog-service: Product catalog, read-optimized
- user-service: User management, authentication

Communication:
- Client → Gateway: GraphQL over HTTPS
- Gateway → Services: gRPC
- Service → Service: Event bus (RabbitMQ)

What Changed:
- April 2025: Migrated REST to GraphQL
- May 2025: Split monolith into microservices
- Oct 2025: Event sourcing for orders
- Nov 2025: Service mesh added (Istio)

Why Changed:
- Scale requirements exceeded monolith capacity
- Team wanted service-level ownership
- GraphQL better for mobile performance
- Event sourcing enables audit requirements

Historical Context:
Monolithic architecture above was accurate from project
start (June 2024) to microservices migration (May 2025).
Migration took 3 months. See memory-bank/archived/2025/
monolith-architecture/ for complete history and lessons.

Current Diagrams:
- docs/architecture/microservices-overview.png
- docs/architecture/event-flow.png
- docs/architecture/deployment-topology.png

---

Updated techContext.md:

Fixed 23 broken file paths:
src/auth/AuthService.js → services/user-service/src/auth/JWTService.js
src/api/routes/products.js → services/catalog-service/src/graphql/resolvers/product.js
(... 21 more path updates)

Added missing tools:
- RabbitMQ (event bus)
- gRPC (service communication)
- Istio (service mesh)
- Apollo Federation (GraphQL)

Updated conventions:
- Shared types: services/shared/types/
- Proto files: services/shared/proto/
- Event schemas: services/shared/events/

---

Added 15 missing features to progress.md:

- [x] GraphQL API (April 2025)
  Details: Migrated from REST, Apollo Server, 95% feature parity
  Location: services/api-gateway/
  Performance: 60% latency reduction

- [x] Order service extraction (May 2025)
  Details: First microservice split from monolith
  Location: services/order-service/
  Learning: Database migration was hardest part

(... 13 more features)

---

VALIDATION PHASE (2 hours):

Automated validation:
✓ All file paths exist
✓ No missing references
✓ Recent commits referenced in memory bank
✓ All services documented

Manual validation:
✓ New engineer (hired last week) read memory bank
✓ Reported: "Makes sense, matches what I see"
✓ Only confusion: Some event names unclear (fixed)

Team validation:
✓ 5 engineers reviewed updates
✓ Confirmed accuracy
✓ Added 3 clarifications
✓ Approved updates

---

PREVENTION PHASE (1 hour):

Implemented prevention measures:

1. Automated validation:
   - Added validate-memory-bank.sh to CI
   - Pre-commit hook checks file references
   - Weekly cron reports staleness

2. Team practices:
   - Updated PR template: "Memory bank updated?"
   - Added memory bank check to code review checklist
   - Sprint retros include memory bank accuracy review

3. Responsibility:
   - Created rotating "memory bank steward" role
   - Weekly rotation, tracked in wiki
   - Steward reviews all PRs for memory bank impact

4. Visibility:
   - Added memory bank accuracy to team dashboard
   - Slack reminder: "Weekly memory bank check"
   - Celebrate good maintenance in standups

5. Success metrics:
   - Accuracy score: 94/100 (was 45/100)
   - Days since update: 0 (was 120)
   - Team confidence: 9/10 (was 4/10)
   - New engineer success: High (was low)

---

RESULT:

Time invested: 17 hours (detection, audit, update, validation, prevention)
Recovery: Complete
Accuracy: 94/100 (from 45/100)
Team feedback: "Memory bank actually useful now"
New engineer feedback: "Docs match reality, very helpful"
Prevention: Measures in place to prevent recurrence

Memory bank recovered from staleness. Now reflects reality
and has systems to stay current.
```

**Why this works:**
- Systematic detection of all staleness
- Complete audit of current reality
- Updates marked with evolution
- Comprehensive validation
- Prevention measures implemented
- Team confidence restored
- New engineers can rely on docs

---

❌ BAD Staleness Recovery (incomplete, unvalidated, will recur):

**Anti-pattern characteristics:**
- Fixed only obvious issues
- No validation
- No prevention measures
- Will be stale again soon

**Bad recovery:**
```
Fixed some broken links in memory bank.
Updated a few file paths that were wrong.
Removed some old stuff.

(No systematic detection)
(No current reality audit)
(No evolution marking)
(No validation)
(No prevention measures)
(Many issues remain)
```

**Why this fails:**
```
What happened:
- Fixed 5 file paths, missed 18 others
- Updated one section, left rest stale
- No validation that fixes are correct
- No prevention measures implemented

Result after 1 month:
- Still 18 broken file paths
- Still missing 15 features
- Still outdated architecture docs
- New staleness accumulated
- Back to square one

Team still doesn't trust memory bank.
New engineers still confused.
Time wasted on partial fix.
```

**Impact:**
```
Time wasted: 3 hours on partial fix
Recovery: Incomplete (30% done)
Accuracy: 55/100 (was 45/100, minimal improvement)
Recurrence: Inevitable (no prevention)
Team trust: Still low

"We tried fixing it but it's still wrong. Why bother?"

→ Memory bank abandoned
→ Knowledge lost
→ Team relies on tribal knowledge
→ New engineers struggle
→ Could have been prevented with systematic recovery
```
</examples>
