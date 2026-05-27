---
# === Identity ===
id: recover-from-noise-accumulation
name: Recover memory bank from noise where obsolete entries obscure current information
version: v1

# === Classification ===
chapter: 5
category: memory-bank
subcategory: failure
tags:
  - documentation
  - memory-bank
  - failure-recovery
  - noise-reduction
  - information-architecture
  - consolidation
  - pruning
  - conflict-resolution
  - duplicate-removal
  - signal-to-noise

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Recover memory bank from noise where obsolete entries obscure current information.
    Prune accumulated noise to restore signal-to-noise ratio when documentation has conflicting or duplicate information.
  argument-hint: "[project_name] [noise_indicators]"
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
  - name: noise_indicators
    description: Specific signs of noise observed
    example: "Five conflicting explanations for authentication, obsolete entries mixed with current ones"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 5
    description: |
      **Recover from noise accumulation** where obsolete entries pile up making information hard to find. Identify conflicting entries and duplicates, prune by retiring superseded entries, consolidate duplicates, and restructure for clarity.
    preview: |
      "...identify noise sources finding conflicts and duplicates. Prune systematically, consolidate to single authoritative entry..."
  website:
    include: true
    path: /prompts/recover-from-noise-accumulation
  marketplace:
    plugin: constellize:memory

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Recover memory bank for {{project_name}} from noise accumulation where obsolete entries pile up alongside current ones making accurate information harder to find.

Identify noise sources by finding conflicting explanations for same components, detecting obsolete entries not marked as retired, locating duplicate information across files, and recognizing degraded signal-to-noise ratio. Prune systematically by retiring superseded entries gracefully, consolidating duplicate information, removing redundant sections, and clarifying which entry is authoritative. Restructure for clarity by establishing clear entry ownership, creating unambiguous navigation, surfacing current information first, and archiving historical context appropriately. Prevent noise accumulation by making retirement standard practice, establishing deprecation marking, conducting regular pruning, and maintaining clear information architecture.

Treat noise recovery as gardening rather than archaeology, actively cultivating useful knowledge while removing informational weeds that obscure rather than illuminate. This approach transforms overwhelming documentation into navigable knowledge infrastructure.

Follow this process:

1. **Identify noise sources:**
   - Find conflicting explanations
   - Detect unmarked obsolete entries
   - Locate duplicate information
   - Map where noise concentrates
   - Assess findability degradation

2. **Prune systematically:**
   - Retire superseded entries gracefully
   - Consolidate duplicate content
   - Remove redundant sections
   - Mark conflicts and resolve
   - Establish single source of truth

3. **Restructure for clarity:**
   - Define clear entry ownership
   - Create unambiguous paths
   - Surface current information first
   - Archive historical appropriately
   - Make search effective

4. **Prevent future accumulation:**
   - Retire obsolete entries immediately
   - Mark deprecations clearly
   - Conduct regular pruning
   - Establish noise alerts
   - Maintain clear architecture
</task>

<context>
Project to recover memory bank:
{{project_name}}

Noise indicators observed:
{{noise_indicators}}

**Standard Construction Folder Structure:**
This prompt updates:
- `memory-bank/systemPatterns.md` (remove duplicates, consolidate)
- `memory-bank/techContext.md` (retire obsolete tools, clarify current)
- `memory-bank/activeContext.md` (remove completed items, focus current)
- `memory-bank/archived/` (move obsolete entries here)

This prompt creates:
- Clear information architecture
- Pruning processes
- Noise prevention measures
</context>

<thinking>
Before recovering from noise, analyze:
1. Where does noise concentrate (which files, which topics)?
2. What types of noise exist (conflicts, obsolete, duplicates)?
3. Which information is authoritative vs superseded?
4. How has noise affected usability?
5. What will prevent re-accumulation?
6. How do we maintain signal-to-noise ratio?
</thinking>

<output-format>
Create noise recovery following these patterns:

**Noise Detection Pattern:**

Systematically identify noise:

**Noise Types and Detection:**
```
1. Conflicting Information:
   Pattern: Multiple contradictory explanations for same thing
   Detection: Search for component name, compare explanations
   Example: "Authentication uses JWT" vs "Authentication uses sessions"
   Impact: HIGH - actively misleading
   Priority: Fix immediately

2. Obsolete Entries Not Retired:
   Pattern: Outdated information mixed with current
   Detection: Entry describes non-existent code/tools
   Example: "We use Angular" when actually using React
   Impact: HIGH - misleads about current state
   Priority: Retire immediately

3. Duplicate Information:
   Pattern: Same information in multiple places
   Detection: Similar content in different files
   Example: API auth explained in 3 different sections
   Impact: MEDIUM - maintenance burden, drift risk
   Priority: Consolidate soon

4. Redundant Sections:
   Pattern: Unnecessary repetition adds no value
   Detection: Content overlap analysis
   Example: Same pattern explained 3 times with minor variations
   Impact: MEDIUM - dilutes important information
   Priority: Consolidate or remove

5. Stale Cross-References:
   Pattern: Links to renamed/moved/deleted entries
   Detection: Automated link checking
   Example: "See authentication.md" (file doesn't exist)
   Impact: LOW - breaks navigation
   Priority: Fix when found

6. Version Confusion:
   Pattern: Multiple versions of patterns without clarity on current
   Detection: "v1", "v2", "new", "old" without clear labels
   Example: "Old error handling" vs "New error handling" (which is current?)
   Impact: HIGH - unclear what to follow
   Priority: Clarify immediately
```

**Noise Audit Process:**
```
1. Create noise inventory (2-4 hours):

   For each memory bank file:
   - Read through completely
   - Note conflicting information
   - Mark obsolete entries
   - Identify duplicates
   - List redundant sections
   - Check cross-references

   Output: Spreadsheet of noise items with:
   - Type (conflict, obsolete, duplicate, redundant)
   - Location (file, section)
   - Priority (high, medium, low)
   - Action needed (retire, consolidate, remove)

2. Quantify noise (1 hour):

   Metrics:
   - Conflicting entries: [count]
   - Obsolete entries: [count]
   - Duplicate sections: [count]
   - Broken references: [count]
   - Total noise items: [count]

   Signal-to-noise ratio:
   - Current useful content: [estimate pages]
   - Noise content: [estimate pages]
   - Ratio: [useful / total]

   Target: >80% useful content
   Current: [calculate]

3. Map noise concentration (30 min):

   Which files have most noise?
   - systemPatterns.md: [noise count]
   - techContext.md: [noise count]
   - activeContext.md: [noise count]

   Which topics are most confused?
   - [Topic 1]: [confusion level]
   - [Topic 2]: [confusion level]

   Focus pruning on highest-noise areas first.
```

---

**Conflict Resolution Pattern:**

Resolve conflicting information:

**Conflict Resolution Process:**
```
For each conflict identified:

1. Find all conflicting entries:
   Topic: [What the conflict is about]
   Entry 1: [Location] says [X]
   Entry 2: [Location] says [Y]
   Entry 3: [Location] says [Z]

2. Determine authoritative truth:
   Check current code: [What's actually implemented?]
   Check recent commits: [What's current practice?]
   Ask team: "Which is correct?"
   Authority: [Entry that matches reality]

3. Resolve conflict:
   - Mark authoritative entry as canonical
   - Update other entries to point to canonical
   - OR retire incorrect entries
   - Add "See [canonical location]" cross-references

4. Prevent recurrence:
   - Establish single source of truth for topic
   - Document where this topic lives
   - Mark other locations as redirects
```

**Conflict Resolution Template:**
```
Topic: [What this is about]

**Authoritative Entry (Current):**
Location: [File and section]
Last Updated: [Date]
Validated: [How we know this is correct]

[Current correct information]

**Previous Conflicting Entries (Resolved):**

Was in: [Location 1]
Said: [Conflicting information]
Status: Retired [date] - See authoritative entry above
Reason: Superseded by current implementation

Was in: [Location 2]
Said: [Conflicting information]
Status: Retired [date] - See authoritative entry above
Reason: Based on outdated architecture

**Navigation:**
For [topic], always refer to this section.
Previous entries archived: memory-bank/archived/[year]/[topic]/
```

**Example Conflict Resolution:**
```
BEFORE (Conflicting):

In systemPatterns.md:
"We use session-based authentication with Redis."

In techContext.md:
"Authentication is JWT-based for mobile compatibility."

In activeContext.md:
"Migrating from sessions to JWT currently in progress."

(Three conflicting stories - which is correct?)

---

AFTER (Resolved):

Topic: Authentication Architecture

**Authoritative Entry (Current as of 2026-01-21):**
Location: systemPatterns.md "Authentication Architecture"
Last Updated: 2026-01-21
Validated: Matches current code (src/auth/JWTService.js)

We use hybrid JWT + refresh token authentication supporting
web and mobile clients. Short-lived JWTs (15 min) for API
authentication, long-lived refresh tokens (7 days) with
server-side revocation capability.

[Full current implementation details...]

**Previous Conflicting Entries (Resolved):**

Was in: techContext.md "Authentication Setup"
Said: "Authentication is JWT-based for mobile compatibility"
Status: Updated 2026-01-21 to redirect to canonical entry
Action: Removed detailed explanation, added "See systemPatterns.md"

Was in: activeContext.md "Current Work"
Said: "Migrating from sessions to JWT currently in progress"
Status: Removed 2026-01-21 - migration completed March 2026
Action: Marked migration complete, removed in-progress note

Previous architecture (session-based):
Archived: memory-bank/archived/2026/session-auth/RETIRED.md
Active: June 2025 - March 2026
Lessons: See archived entry

**Navigation:**
For authentication architecture, always refer to:
systemPatterns.md "Authentication Architecture"

This is the single source of truth.
Other references point here.
```

---

**Pruning Pattern:**

Remove noise systematically:

**Pruning Workflow:**
```
1. Retire obsolete entries (4-6 hours):

   For each obsolete entry:
   - Create retirement notice
   - Move to archived/[year]/[topic]/
   - Add pointer from original location
   - Update cross-references
   - Validate nothing links to obsolete entry

2. Consolidate duplicates (3-4 hours):

   For duplicate content:
   - Identify authoritative version
   - Merge useful content into authoritative
   - Remove duplicate entries
   - Add redirects to authoritative
   - Update cross-references

3. Remove redundancy (2-3 hours):

   For redundant sections:
   - Identify essential vs redundant
   - Keep most clear explanation
   - Remove redundant versions
   - Add summary if needed
   - Simplify without losing value

4. Fix broken references (1-2 hours):

   For each broken reference:
   - Find where entry moved
   - Update reference to new location
   - OR remove reference if entry retired
   - Validate all references work

Total pruning time: 10-15 hours
Result: Clean, navigable memory bank
```

**Pruning Decision Matrix:**
```
For each entry, decide:

□ Current and accurate?
  → Keep, mark as current, update if needed

□ Obsolete but historically valuable?
  → Retire gracefully, move to archived/, preserve lessons

□ Obsolete and no historical value?
  → Remove completely (rare - usually has some value)

□ Duplicate of authoritative entry?
  → Remove, add redirect to authoritative

□ Redundant (adds no new value)?
  → Remove or consolidate into clearer entry

□ Conflicting with authoritative?
  → Remove or update to match authoritative

When in doubt: Retire gracefully rather than delete
Preserve history, prevent knowledge loss
```

---

**Consolidation Pattern:**

Merge duplicates effectively:

**Consolidation Process:**
```
1. Identify duplicate content:
   Topic: [What's duplicated]
   Location 1: [File and section]
   Location 2: [File and section]
   Location 3: [File and section]

   Content comparison:
   - Unique in Location 1: [What's unique]
   - Unique in Location 2: [What's unique]
   - Unique in Location 3: [What's unique]
   - Common across all: [What's repeated]

2. Choose authoritative location:
   Criteria:
   - Most logical file for this topic
   - Most detailed/accurate version
   - Most frequently referenced
   - Best organization

   Authoritative: [Chosen location]
   Reason: [Why this one]

3. Create consolidated entry:
   - Start with authoritative version
   - Merge unique valuable content from others
   - Remove redundant repetition
   - Add cross-references
   - Make comprehensive

4. Update other locations:
   Location 1: Replace with "See [authoritative location]"
   Location 2: Replace with "See [authoritative location]"
   Location 3: Remove completely (if redundant)

5. Fix references:
   Find all links to old locations
   Update to point to authoritative
   Validate navigation works
```

**Consolidation Example:**
```
BEFORE (Duplicate):

In systemPatterns.md:
"Error Handling Pattern

We use try-catch with structured logging.
Errors are logged with context and re-thrown
as custom error types."

In techContext.md:
"Error Handling Approach

All services use try-catch blocks. We log errors
with Winston including request context. Custom
error classes extend Error base class."

In activeContext.md:
"Current Error Pattern

Try-catch in all async functions. Log with context.
Throw ServiceError or ValidationError types."

(Three places say similar things, maintenance nightmare)

---

AFTER (Consolidated):

In systemPatterns.md (authoritative):
"Error Handling Pattern

We use try-catch with structured logging and custom error types
for consistent error handling across all services.

Pattern:
```
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', { context, error });
  throw new ServiceError('User message', error);
}
```

Custom error types (extend Error):
- ServiceError: Service layer errors
- ValidationError: Input validation failures
- NotFoundError: Resource not found
- AuthenticationError: Auth failures

Logging (Winston):
- Include request context (userId, requestId, operation)
- Log at appropriate level (error, warn, info)
- Preserve error stack traces

Location: All services follow this pattern
Examples: src/services/*/
Convention: Established Dec 2025

Related:
- techContext.md: Winston setup and configuration
- Custom error classes: src/errors/

---

In techContext.md (updated):
"Error Handling

See systemPatterns.md "Error Handling Pattern" for
complete pattern description and examples.

Winston Configuration:
[Technical setup details only]

Custom Error Classes:
Location: src/errors/
[Implementation details only]

---

In activeContext.md (removed):
[Error pattern reference removed - not current focus]

---

Result:
- One authoritative entry (systemPatterns.md)
- Technical setup details in techContext.md
- No redundant duplication
- Clear navigation (see systemPatterns.md)
- Easier to maintain (one place to update)
```

---

**Information Architecture Pattern:**

Structure for clarity:

**Clear Architecture Principles:**
```
1. Single Source of Truth:
   Each topic has ONE authoritative entry
   Other references point to authoritative
   No competing explanations

2. Logical Organization:
   - systemPatterns.md: HOW we build (patterns, architecture)
   - techContext.md: WHAT we use (tools, setup, conventions)
   - productContext.md: WHY we build (user needs, metrics)
   - activeContext.md: CURRENT state (focus, decisions, next)
   - progress.md: HISTORY (what completed, what remains)
   - projectbrief.md: FOUNDATION (goals, scope, constraints)

3. Current Information First:
   Current approach prominently placed
   Historical context after current
   Archived entries in separate location
   Clear "current as of [date]" markers

4. Unambiguous Navigation:
   Cross-references clear and working
   "See X for details" links provided
   Search finds authoritative entry first
   No dead ends

5. Appropriate Detail Level:
   Overview in one place
   Details in appropriate location
   Examples where helpful
   Not excessive repetition
```

**Architecture Validation:**
```
Test information architecture:

For each major topic:
□ Single authoritative entry exists?
□ Entry in most logical file?
□ Cross-references point to authoritative?
□ Search finds authoritative first?
□ Current information clearly marked?
□ Historical context preserved separately?

For overall structure:
□ File purposes clear and distinct?
□ No overlap between file scopes?
□ Easy to know where information belongs?
□ Newcomer can navigate successfully?

If any "no": Fix architecture
Good architecture prevents noise accumulation
```

---

**Prevention Pattern:**

Prevent future noise accumulation:

**Noise Prevention Checklist:**
```
1. Immediate Retirement:
   □ When entry becomes obsolete, retire immediately
   □ Don't let obsolete entries linger
   □ Create retirement notice
   □ Move to archived/
   □ Add redirect

2. Deprecation Marking:
   □ When entry soon to be obsolete, mark "DEPRECATED"
   □ Include deprecation date
   □ Point to replacement
   □ Remove after replacement proven

3. Duplicate Prevention:
   □ Before adding, search for existing entry
   □ If exists, enhance existing vs create new
   □ If need multiple, make one authoritative
   □ Others redirect to authoritative

4. Regular Pruning:
   □ Monthly: Review for noise accumulation
   □ Quarterly: Deep prune of all files
   □ Annually: Full architecture review
   □ Ongoing: Retire immediately when obsolete

5. Clear Ownership:
   □ Each file has clear purpose
   □ Team knows where information belongs
   □ Steward watches for duplicates
   □ Architecture maintained

6. Noise Alerts:
   □ CI warns if file exceeds size threshold
   □ Script detects duplicate content
   □ Lint checks for "DEPRECATED" markers >30 days old
   □ Dashboard shows signal-to-noise ratio
```

**Automated Noise Detection:**
```bash
#!/bin/bash
# detect-noise.sh

echo "Detecting memory bank noise..."

# Check for DEPRECATED markers
deprecated=$(grep -r "DEPRECATED" memory-bank/ | wc -l)
if [ $deprecated -gt 0 ]; then
  echo "⚠️  Found $deprecated DEPRECATED markers - retire these"
fi

# Check for duplicate content (simple heuristic)
# Find paragraphs that appear in multiple files
for file in memory-bank/*.md; do
  # Extract paragraphs, check for duplicates across files
  # (simplified - use more sophisticated tool in practice)
done

# Check file sizes (large files may have noise)
find memory-bank/ -name "*.md" -size +50k | while read file; do
  size=$(du -h "$file" | cut -f1)
  echo "⚠️  Large file (may have noise): $file ($size)"
done

# Check for multiple entries on same topic
# (requires semantic analysis - future enhancement)

# Check for broken references
grep -r "See " memory-bank/ | grep -o "\[.*\]" | while read ref; do
  # Validate reference exists
  # (simplified - implement full link checking)
done

echo "Noise detection complete"
```

**Maintenance Rhythm:**
```
Daily:
- Retire obsolete entries as they occur
- Mark deprecated when decisions change

Weekly (Steward role):
- Review new entries for duplicates
- Check for entries in wrong files
- Validate information architecture

Monthly (Team review, 1 hour):
- Scan for noise accumulation
- Identify consolidation opportunities
- Prune redundant content
- Check signal-to-noise ratio

Quarterly (Deep clean, 4 hours):
- Complete noise audit
- Consolidate all duplicates
- Retire all obsolete
- Validate architecture
- Restore high signal-to-noise

Annual (Architecture review, 1 day):
- Review file structure
- Reorganize if needed
- Major consolidation effort
- Team alignment on standards
```

---

**Recovery Validation Pattern:**

Ensure noise removed:

**Noise Recovery Validation:**
```
Signal-to-Noise Metrics:

Before Recovery:
- Conflicting entries: [count]
- Obsolete entries: [count]
- Duplicate sections: [count]
- Broken references: [count]
- Total noise items: [count]
- Signal-to-noise ratio: [%]
- Team confidence: [score/10]

After Recovery:
- Conflicting entries: 0 (or very few)
- Obsolete entries: 0 (retired to archived/)
- Duplicate sections: 0 (consolidated)
- Broken references: 0 (fixed)
- Total noise items: [much lower count]
- Signal-to-noise ratio: >80%
- Team confidence: >8/10

Validation Tests:

□ Search for key topics finds ONE authoritative entry
□ No conflicting information remains
□ All entries are current or clearly marked retired
□ Cross-references all work
□ New engineer can navigate without confusion
□ Team confirms "easier to find information now"

If validation fails: More pruning needed
Don't stop until usability restored
```

</output-format>

<instructions>
CRITICAL: Noise recovery is gardening - actively cultivate signal, remove noise.

NEVER recover by:
- Deleting everything and starting over (history lost)
- Leaving conflicts unresolved (still misleading)
- Consolidating without establishing authority (still confusing)
- One-time cleanup without prevention (will recur)

DO NOT:
- Leave conflicting information
- Keep obsolete entries in active docs
- Allow duplicates to persist
- Skip establishing architecture
- Forget prevention measures
- One-time fix without ongoing maintenance

ALWAYS:
- Resolve conflicts by establishing authority
- Retire obsolete entries gracefully
- Consolidate duplicates to single source
- Establish clear information architecture
- Implement noise prevention
- Maintain regular pruning rhythm
- Monitor signal-to-noise ratio

REPEAT: Noise recovery is gardening. Prune noise, consolidate duplicates, establish clear architecture, prevent re-accumulation through regular maintenance.
</instructions>

<examples>
✅ GOOD Noise Recovery (systematic, architectural, sustainable):

**Pattern demonstrates:**
- Comprehensive noise audit
- Systematic conflict resolution
- Consolidation with authority
- Clear architecture
- Prevention measures

**Example recovery:**
```
Noise Recovery: Backend API Documentation
Date: 2026-01-21
Issue: Memory bank has 5 conflicting explanations for
       authentication, duplicates everywhere, hard to find truth

---

NOISE AUDIT (Day 1, 3 hours):

Noise inventory created:

Type: Conflicting Information (HIGH priority)
- Authentication: 5 different explanations
- Error handling: 3 different patterns
- Database connection: 2 different approaches
Total conflicting topics: 10

Type: Obsolete Entries (HIGH priority)
- References to deleted microservices (3 entries)
- Old tool documentation (MongoDB, removed 6 months ago)
- Deprecated patterns still documented
Total obsolete entries: 15

Type: Duplicates (MEDIUM priority)
- API design pattern explained in 4 places
- Testing approach in 3 places
- Deployment process in 2 places
Total duplicate topics: 8

Type: Broken References (LOW priority)
- Links to moved files: 12
- Links to retired entries: 8
Total broken references: 20

Quantification:
- Total noise items: 53
- Estimated noise content: ~40 pages
- Estimated useful content: ~60 pages
- Signal-to-noise ratio: 60% (target: >80%)

Concentration:
- systemPatterns.md: 25 noise items (worst)
- techContext.md: 18 noise items
- activeContext.md: 10 noise items

---

CONFLICT RESOLUTION (Days 2-3, 8 hours):

Resolved authentication conflict:

BEFORE:
- Entry 1 (systemPatterns.md): "Session-based auth with Redis"
- Entry 2 (techContext.md): "JWT auth for mobile"
- Entry 3 (activeContext.md): "Migrating to JWT"
- Entry 4 (README.md): "OAuth integration"
- Entry 5 (api-docs.md): "Token-based authentication"

Determined authoritative truth:
- Checked code: Uses JWT + refresh tokens (hybrid)
- Asked team: Confirmed hybrid JWT approach current
- Migration completed: March 2026
- OAuth: Only for third-party, not primary

AFTER:
Authoritative entry in systemPatterns.md:
"Authentication Architecture (current as of 2026-01-21)

We use hybrid JWT + refresh token authentication...
[Complete accurate description]

Single source of truth for authentication.
All other references point here."

Other locations updated:
- techContext.md: "See systemPatterns.md for pattern"
  + JWT configuration details only
- activeContext.md: Removed migration note (completed)
- README.md: Added "See systemPatterns.md" link
- api-docs.md: Updated to match authoritative

Session-based approach:
- Retired to archived/2026/session-auth/
- Historical context preserved
- Lessons documented

Result: ONE authoritative answer, confusion eliminated

(Repeated for 9 other conflicting topics...)

---

PRUNING (Days 4-5, 10 hours):

Retired 15 obsolete entries:

Example:
Entry: "MongoDB Data Layer"
Location: systemPatterns.md
Issue: MongoDB removed 6 months ago, using PostgreSQL now
Action:
- Created retirement notice
- Moved to archived/2025/mongodb-data-layer/
- Documented why changed (ACID requirements)
- Preserved lessons learned
- Added redirect in systemPatterns.md

(14 more obsolete entries retired similarly...)

Consolidated 8 duplicate topics:

Example:
Topic: "API Design Patterns"
Locations: systemPatterns.md, techContext.md, api-guide.md, README.md

Consolidation:
- Chose systemPatterns.md as authoritative (most logical)
- Merged unique content from other locations
- Removed duplicates
- Added redirects: "See systemPatterns.md 'API Design'"
- Updated 23 cross-references

Result: ONE comprehensive entry, easy to maintain

(7 more duplicate topics consolidated similarly...)

Fixed 20 broken references:
- Found moved files, updated links
- Removed links to retired entries
- Validated all references work

---

RESTRUCTURING (Day 6, 4 hours):

Established clear information architecture:

File purposes clarified:
- systemPatterns.md: HOW we build (patterns, practices)
- techContext.md: WHAT we use (tools, setup, config)
- activeContext.md: CURRENT state (focus, next steps)
- progress.md: HISTORY (completed, remaining)

Single source of truth defined:
Each major topic has ONE authoritative location.
Created topic index:

Authentication → systemPatterns.md "Authentication Architecture"
Error Handling → systemPatterns.md "Error Handling Pattern"
Database → systemPatterns.md "Data Architecture"
API Design → systemPatterns.md "API Patterns"
JWT Config → techContext.md "JWT Setup"
Deployment → techContext.md "Deployment Process"
(... complete index created)

Navigation improved:
- Added topic index to each file header
- Cross-references point to authoritative entries
- Search-friendly headings
- Clear "current as of" dates

---

PREVENTION (Day 7, 2 hours):

Implemented noise prevention:

1. Immediate retirement process:
   - When entry obsolete, retire same day
   - Template: memory-bank/templates/retirement-notice.md
   - Script: scripts/retire-entry.sh [topic]

2. Duplicate prevention:
   - Before adding, search existing
   - If exists, enhance vs create new
   - Steward reviews for duplicates

3. Regular pruning:
   - Monthly: Quick noise scan (30 min)
   - Quarterly: Deep prune (4 hours)
   - Annual: Architecture review (1 day)

4. Automated detection:
   - Added detect-noise.sh to CI
   - Warns if DEPRECATED markers >30 days old
   - Alerts on large files (potential noise)

5. Clear ownership:
   - Topic index shows where each topic lives
   - Team knows authoritative locations
   - Architecture maintained

6. Team practices:
   - Don't create duplicates
   - Retire obsolete immediately
   - Consolidate when found
   - Maintain signal-to-noise ratio

---

VALIDATION:

Metrics Before → After:
- Conflicting entries: 10 → 0
- Obsolete entries: 15 → 0
- Duplicate sections: 8 → 0
- Broken references: 20 → 0
- Signal-to-noise ratio: 60% → 91%
- Team confidence: 4/10 → 9/10

Validation tests:
✓ Search "authentication" → ONE authoritative entry
✓ No conflicting information
✓ All entries current or clearly retired
✓ Cross-references work
✓ New engineer navigates successfully
✓ Team: "So much easier to find things now"

---

RESULTS:

Time invested:
- Audit: 3 hours
- Conflict resolution: 8 hours
- Pruning: 10 hours
- Restructuring: 4 hours
- Prevention: 2 hours
Total: 27 hours

Recovery: Complete
Usability: Dramatically improved
Sustainability: Prevention measures in place

Team feedback:
- "Finally can find the real answer"
- "No more conflicting stories"
- "Confidence restored in memory bank"
- "Actually useful now"

Memory bank recovered from noise. Signal-to-noise ratio high.
Prevention ensures it stays clean.
```

**Why this works:**
- Systematic audit found all noise
- Conflicts resolved with clear authority
- Duplicates consolidated effectively
- Clear information architecture established
- Prevention measures prevent re-accumulation
- Team can navigate successfully
- Usability restored

---

❌ BAD Noise Recovery (incomplete, superficial, will recur):

**Anti-pattern characteristics:**
- Fixed only obvious issues
- Left conflicts unresolved
- Didn't establish architecture
- No prevention measures

**Bad recovery:**
```
Looked through memory bank, deleted some old stuff,
cleaned up a few things.

(No systematic audit)
(Conflicts still exist)
(Duplicates remain)
(No architecture defined)
(No prevention)
```

**Why this fails:**
```
What happened:
- Removed 5 obviously obsolete entries
- Missed 10 other obsolete entries
- Left conflicting authentication info
- Duplicates still everywhere
- No architecture established
- No prevention measures

Result after 1 month:
- Still 5 explanations for authentication
- Still conflicting information
- New duplicates added
- Noise re-accumulated
- Still hard to find accurate information

Team still doesn't trust memory bank.
Time wasted on superficial cleanup.
```

**Impact:**
```
Engineer searching for authentication:
Finds 5 different explanations.
"Which one is right?"
Asks in Slack instead.

Memory bank still unusable.
Team: "Tried cleaning it up but still messy.
       Not worth maintaining."

→ Memory bank stays noisy
→ Team continues not using it
→ Knowledge still lost
→ Could have been prevented with systematic recovery
```
</examples>
