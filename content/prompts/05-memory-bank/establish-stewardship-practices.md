---
# === Identity ===
id: establish-stewardship-practices
name: Establish sustainable memory bank stewardship practices
version: v1

# === Classification ===
chapter: 5
category: memory-bank
subcategory: steward
tags:
  - documentation
  - memory-bank
  - stewardship
  - sustainability
  - rotation
  - automation
  - workflow-integration
  - cultural-change
  - prevention
  - continuous-maintenance

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Establish sustainable memory bank stewardship practices.
    Create rotation, automation, and cultural practices preventing future degradation.
  argument-hint: "[project_name] [team_size]"
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
    description: The specific project to establish stewardship for
    example: "E-commerce Platform"
    maps-to: "$0"
  - name: team_size
    description: Number of engineers on team
    example: "6 engineers"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/establish-stewardship-practices
  marketplace:
    plugin: constellize-memory-bank

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Establish lightweight stewardship practices for {{project_name}} memory bank to prevent future degradation through sustainable maintenance rhythm.

Implement automated review scheduling that prompts regular memory bank currency checks without manual tracking. Integrate memory bank updates into PR checklist making documentation updates part of standard development workflow rather than separate activity. Create rotating steward role with weekly rotation ensuring distributed responsibility and preventing single-person burden. Define clear stewardship responsibilities including currency validation, update facilitation, and quality monitoring. Build cultural expectation that memory bank maintenance is infrastructure work, not optional documentation task.

Treat stewardship establishment as process design rather than individual assignment, creating systems that make good practice easy and sustainable. This approach prevents memory bank degradation through continuous light maintenance rather than periodic heavy recovery.

Follow this process:

1. **Implement automated prompts:**
   - Schedule weekly memory bank review reminders
   - Add memory bank check to PR template
   - Create CI validation for basic currency
   - Set up staleness alerts
   - Make remembering automatic

2. **Establish rotation responsibility:**
   - Define steward role clearly
   - Create weekly rotation schedule
   - Document steward duties
   - Make rotation visible to team
   - Distribute burden fairly

3. **Integrate into workflow:**
   - Add to definition of done
   - Include in code review checklist
   - Make part of sprint rituals
   - Connect to existing practices
   - Remove friction from updates

4. **Build cultural expectation:**
   - Leadership endorsement visible
   - Recognize good stewardship
   - Show impact of currency
   - Make normal, not exceptional
   - Celebrate maintenance work
</task>

<context>
Project to establish stewardship:
{{project_name}}

Team size:
{{team_size}}

**Standard Construction Folder Structure:**
This prompt creates:
- Steward role definition and rotation schedule
- Automated reminder and validation scripts
- PR template updates and checklists
- Cultural practices and recognition systems
- Monitoring dashboards for memory bank health
</context>

<thinking>
Before establishing stewardship, analyze:
1. What makes memory bank updates easy vs hard?
2. How can we automate remembering?
3. What's a sustainable rotation schedule?
4. How do we integrate with existing workflow?
5. What cultural changes need leadership support?
6. How do we measure stewardship success?
</thinking>

<output-format>
Create stewardship establishment following these patterns:

**Automated Review Pattern:**

Make remembering automatic:

**Weekly Review Reminder:**
```bash
# .github/workflows/memory-bank-reminder.yml
# Runs every Monday 9am

name: Memory Bank Weekly Review

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9am UTC

jobs:
  reminder:
    runs-on: ubuntu-latest
    steps:
      - name: Post Slack Reminder
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{
              "text": "📚 Weekly Memory Bank Review",
              "blocks": [{
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Memory Bank Weekly Review*\n\nThis week'\''s steward: @${{ env.CURRENT_STEWARD }}\n\n*Review checklist:*\n• activeContext.md reflects current sprint\n• Recent decisions documented\n• Completed work in progress.md\n• No stale entries\n\nLast update: ${{ env.DAYS_SINCE_UPDATE }} days ago"
                }
              }]
            }'

# Sends gentle weekly reminder
# Tags current steward
# Shows days since last update
# Links to review checklist
```

**PR Template Integration:**
```markdown
<!-- .github/pull_request_template.md -->

## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Memory Bank Update
**Required for: New features, architectural changes, new patterns**

- [ ] Updated relevant memory bank files
  - [ ] systemPatterns.md (if pattern added/changed)
  - [ ] techContext.md (if tools/setup changed)
  - [ ] activeContext.md (if decision made)
  - [ ] progress.md (if feature completed)
- [ ] OR No memory bank update needed (explain): ___

**For memory bank steward:**
- [ ] Reviewed memory bank updates for quality

<!-- Makes memory bank check explicit -->
<!-- Clear about when updates needed -->
<!-- Steward reviews updates -->
```

**CI Currency Validation:**
```bash
#!/bin/bash
# .github/workflows/memory-bank-validation.yml
# Runs on every PR

name: Validate Memory Bank

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Check File References
        run: |
          # Validate all file paths mentioned in memory bank exist
          echo "Checking file references..."
          grep -r "src/" memory-bank/ | \
            grep -o 'src/[^ ]*' | \
            sort -u | \
            while read path; do
              if [ ! -f "$path" ] && [ ! -d "$path" ]; then
                echo "❌ Missing file referenced: $path"
                exit 1
              fi
            done
          echo "✓ All file references valid"

      - name: Check Staleness
        run: |
          # Warn if memory bank not updated recently
          last_update=$(git log -1 --format=%cd --date=short memory-bank/)
          days_since=$(( ($(date +%s) - $(date -d "$last_update" +%s)) / 86400 ))

          if [ $days_since -gt 14 ]; then
            echo "⚠️  Memory bank last updated $days_since days ago"
            echo "Consider updating if this PR makes significant changes"
          fi

      - name: Check for Broken Links
        run: |
          # Check internal cross-references
          echo "Checking internal links..."
          grep -r "See .*\.md" memory-bank/ | \
            grep -o "[a-zA-Z]*\.md" | \
            sort -u | \
            while read file; do
              if [ ! -f "memory-bank/$file" ]; then
                echo "❌ Broken link to: $file"
                exit 1
              fi
            done
          echo "✓ All internal links valid"

# Runs automatically on every PR
# Catches common staleness issues
# Doesn't block, just warns
# Fast enough not to slow down CI
```

**Staleness Alert Dashboard:**
```javascript
// scripts/memory-bank-health.js
// Generate health dashboard

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getLastUpdate(file) {
  const cmd = `git log -1 --format=%ct ${file}`;
  const timestamp = parseInt(execSync(cmd).toString());
  return new Date(timestamp * 1000);
}

function getDaysSince(date) {
  return Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24));
}

function getMemoryBankHealth() {
  const files = [
    'projectbrief.md',
    'systemPatterns.md',
    'techContext.md',
    'productContext.md',
    'activeContext.md',
    'progress.md'
  ];

  const health = files.map(file => {
    const filePath = `memory-bank/${file}`;
    const lastUpdate = getLastUpdate(filePath);
    const daysSince = getDaysSince(lastUpdate);

    let status = 'green';
    if (file === 'activeContext.md' && daysSince > 7) status = 'yellow';
    if (file === 'activeContext.md' && daysSince > 14) status = 'red';
    if (file !== 'activeContext.md' && daysSince > 30) status = 'yellow';
    if (file !== 'activeContext.md' && daysSince > 90) status = 'red';

    return { file, daysSince, status };
  });

  return health;
}

function generateDashboard() {
  const health = getMemoryBankHealth();

  console.log('\n📊 Memory Bank Health Dashboard\n');
  console.log('File                    | Days | Status');
  console.log('------------------------|------|--------');

  health.forEach(({ file, daysSince, status }) => {
    const emoji = status === 'green' ? '✅' : status === 'yellow' ? '⚠️ ' : '❌';
    const padded = file.padEnd(23);
    const days = daysSince.toString().padStart(4);
    console.log(`${padded}| ${days} | ${emoji}`);
  });

  const overall = health.every(h => h.status === 'green') ? 'Excellent' :
                  health.some(h => h.status === 'red') ? 'Needs Attention' :
                  'Good';

  console.log(`\nOverall Status: ${overall}\n`);

  // Alert if any red
  if (health.some(h => h.status === 'red')) {
    console.log('🚨 Action needed: Some files are stale\n');
  }
}

generateDashboard();

// Run daily, post to team dashboard
// Catches degradation early
// Visual status makes issues obvious
```

---

**Steward Role Pattern:**

Define clear responsibilities:

**Steward Role Definition:**
```markdown
# Memory Bank Steward Role

## Overview
Weekly rotating role ensuring memory bank stays current and useful.

## Duration
- 1 week (Monday - Friday)
- Rotates every Monday
- ~1-2 hours per week

## Responsibilities

### Daily (10 min/day):
1. **Monitor for updates needed:**
   - Review PRs for memory bank impact
   - Flag PRs missing memory bank updates
   - Ensure PR template checkbox completed

2. **Quick currency check:**
   - Scan activeContext.md (is it current?)
   - Note any obvious staleness
   - Flag for correction if needed

### Weekly (1 hour):
1. **Memory bank review:**
   - Review each memory bank file
   - Check file references still valid
   - Verify activeContext.md reflects current sprint
   - Confirm recent decisions documented
   - Validate progress.md has completed work

2. **Update facilitation:**
   - Remind team of pending updates
   - Help engineers with memory bank questions
   - Facilitate uncertain content clarification
   - Ensure quality of updates

3. **Health reporting:**
   - Run memory bank health dashboard
   - Report status in standup
   - Escalate concerns to tech lead
   - Document issues in weekly summary

### Handoff (15 min):
1. **Transfer to next steward:**
   - Brief on current state
   - Note pending updates
   - Share learnings
   - Answer questions

## Not Responsible For:
- Writing all updates yourself (team writes, you facilitate)
- Perfection (good enough is fine)
- Historical updates (focus on keeping current)

## Success Metrics:
- Memory bank updated at least weekly
- PRs with memory bank impact have updates
- Team confidence >7/10
- No files stale >30 days

## Escalation:
If memory bank degrading despite your efforts:
→ Raise in standup
→ Ask tech lead for help
→ Discuss friction points
→ Adjust process as needed

## Tips:
- Don't do all the work yourself
- Ask questions publicly (teach team)
- Make it easy for others to contribute
- Recognize good updates
- It's okay to be imperfect

## Current Steward:
[Auto-updated by rotation script]

Week of [Date]: [Name]
```

**Rotation Schedule:**
```markdown
# Memory Bank Steward Rotation

## Schedule
Weekly rotation, every Monday.

| Week Starting | Steward | Backup |
|---------------|---------|--------|
| 2026-01-20    | Alice   | Bob    |
| 2026-01-27    | Bob     | Charlie|
| 2026-02-03    | Charlie | Diana  |
| 2026-02-10    | Diana   | Eve    |
| 2026-02-17    | Eve     | Alice  |
| 2026-02-24    | Alice   | Bob    |
| ...           | ...     | ...    |

## Rotation Order:
Alice → Bob → Charlie → Diana → Eve → (repeat)

## Backup Responsibility:
- Steps in if steward unavailable
- Helps with handoff
- Shares load for big updates

## Out of Office:
If scheduled steward OOO:
1. Backup becomes steward
2. Next in rotation becomes backup
3. Update schedule doc

## Adding New Team Members:
- Add to rotation after 2 weeks onboarding
- Pair with experienced steward first week
- Full steward second week

## Removing Team Members:
- Remove from rotation
- Adjust schedule

## Current Rotation:**
Auto-updated by `scripts/update-steward.sh`

## History:
Track good stewardship for recognition
```

**Rotation Automation:**
```bash
#!/bin/bash
# scripts/update-steward.sh
# Run every Monday via cron

# Get current date
today=$(date +%Y-%m-%d)

# Rotation list
stewards=("Alice" "Bob" "Charlie" "Diana" "Eve")

# Find current steward (weekly rotation)
week_number=$(date +%U)
index=$((week_number % ${#stewards[@]}))
current_steward=${stewards[$index]}
next_index=$(((index + 1) % ${#stewards[@]}))
backup_steward=${stewards[$next_index]}

# Update rotation schedule
echo "Updating steward rotation..."
echo "Current week: $today"
echo "Current steward: $current_steward"
echo "Backup: $backup_steward"

# Update steward file
cat > memory-bank/.steward << EOF
Current Steward: $current_steward
Backup: $backup_steward
Week of: $today
EOF

# Post to Slack
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-Type: application/json' \
  -d "{
    \"text\": \"📚 Memory Bank Steward for week of $today: @$current_steward (backup: @$backup_steward)\"
  }"

# Update GitHub issue board
# (implementation depends on your issue tracking)

echo "Steward rotation updated"
```

---

**Workflow Integration Pattern:**

Make memory bank updates natural:

**Definition of Done:**
```markdown
# Definition of Done

A story/task is done when:

## Code Complete:
- [ ] Code written and working
- [ ] Tests passing (unit, integration)
- [ ] Code reviewed and approved
- [ ] No obvious bugs

## Documentation Complete:
- [ ] Code comments where needed
- [ ] API documentation updated
- [ ] **Memory bank updated** (if applicable)

## Quality Gates:
- [ ] CI passing
- [ ] Security scan clear
- [ ] Performance acceptable

## Memory Bank Updates (when applicable):

**Update when:**
- New feature added
- Architecture changed
- Pattern established
- Tool/dependency added
- Decision made

**Which files:**
- systemPatterns.md: Architectural patterns/decisions
- techContext.md: Tools, setup, conventions
- activeContext.md: Recent decisions, current focus
- progress.md: Completed work

**Not done until memory bank updated** (if applicable)

Steward validates memory bank updates in code review.
```

**Code Review Checklist:**
```markdown
# Code Review Checklist

For Reviewer:

## Code Quality:
- [ ] Code is readable
- [ ] Tests are comprehensive
- [ ] No security issues
- [ ] Performance acceptable

## Documentation:
- [ ] Code comments sufficient
- [ ] API docs updated if needed
- [ ] **Memory bank updated if needed**

## Memory Bank Check (Steward focus):

If PR introduces:
- [ ] New architectural pattern → systemPatterns.md updated?
- [ ] New tool/library → techContext.md updated?
- [ ] Major decision → activeContext.md updated?
- [ ] Completed feature → progress.md updated?

If memory bank update needed but missing:
→ Request update before approval
→ Offer to help if author unsure

If memory bank updated:
→ Verify quality (specific, accurate, useful)
→ Check cross-references correct
→ Confirm appropriate file updated

**Steward** should focus extra attention on memory bank updates.
```

**Sprint Rituals Integration:**
```markdown
# Sprint Rituals - Memory Bank Integration

## Daily Standup (add 1 minute):
**Steward reports (30 sec):**
- "Memory bank current" OR
- "Needs: [specific update]"
- "Blocker: [if any]"

## Sprint Planning (add 5 minutes):
**Memory bank prep:**
- Review activeContext.md for accuracy
- Confirm reflects new sprint goals
- Update current focus section
- Document sprint context

## Sprint Review (add 3 minutes):
**Demo completed work:**
- Ensure demoed features in progress.md
- Document lessons learned
- Update status tracking

## Sprint Retrospective (add 5 minutes):
**Memory bank health check:**
- How accurate was memory bank this sprint?
- Did it help or hinder?
- What should we improve?
- Any degradation noticed?

**Action items** if memory bank degrading.

Total time added: ~15 min per 2-week sprint
Benefit: Continuous reinforcement, early problem detection
```

**Friction Reduction:**
```markdown
# Making Memory Bank Updates Easy

## Templates:
Location: `memory-bank/templates/`

- decision-template.md (copy, fill, paste)
- pattern-template.md (copy, fill, paste)
- feature-completion-template.md (copy, fill, paste)

Usage:
```bash
# Quick decision entry
cp memory-bank/templates/decision-template.md /tmp/decision.md
# Edit /tmp/decision.md
cat /tmp/decision.md >> memory-bank/activeContext.md
```

## Helper Scripts:
```bash
# scripts/mb-add-decision.sh
# Interactive decision entry

./scripts/mb-add-decision.sh
# Prompts for: decision, rationale, alternatives
# Auto-formats and adds to activeContext.md

# scripts/mb-mark-complete.sh <feature>
# Marks feature complete in progress.md

./scripts/mb-mark-complete.sh "Payment Integration"
# Adds completion entry with timestamp

# scripts/mb-add-pattern.sh
# Interactive pattern entry

./scripts/mb-add-pattern.sh
# Prompts for: pattern name, purpose, example
# Adds to systemPatterns.md
```

## Documentation:
- memory-bank/README.md: How to update
- memory-bank/GUIDELINES.md: What to document
- memory-bank/EXAMPLES.md: Good update examples

## Visibility:
- Pin memory-bank folder in IDE
- Bookmark in browser
- Quick access from documentation site
- Link in team wiki

Principle: Remove all excuses for not updating
Make updating faster than not updating
```

---

**Cultural Change Pattern:**

Build expectation of currency:

**Leadership Endorsement:**
```markdown
# Leadership Actions for Memory Bank Culture

## Tech Lead Actions:

1. **Visible Commitment:**
   - "Memory bank is infrastructure, not optional"
   - Include in team principles
   - Discuss in 1-on-1s
   - Ask "Have you checked the memory bank?"

2. **Process Integration:**
   - Add to definition of done
   - Review in code reviews
   - Discuss in sprint planning
   - Check in retrospectives

3. **Recognition:**
   - Shout out good updates in standup
   - Include in performance reviews
   - Thank stewards publicly
   - Share success stories

4. **Resource Allocation:**
   - Time for updates counted as work
   - Not "extra" or "if you have time"
   - Part of every sprint
   - Steward role is real responsibility

## Engineering Manager Actions:

1. **Set Expectations:**
   - Onboarding: "We maintain our memory bank"
   - Performance reviews: "Documentation quality matters"
   - Career growth: "Stewardship is leadership"

2. **Remove Barriers:**
   - Don't cut documentation time when crunching
   - Protect steward time
   - Invest in automation
   - Fix friction points

3. **Measure & Share:**
   - Memory bank health in team metrics
   - New engineer time-to-productivity
   - Team confidence surveys
   - Show impact of good documentation

## Team Actions:

1. **Peer Accountability:**
   - Remind each other in code review
   - Help with updates
   - Share templates and tips
   - Make it normal to update

2. **Positive Reinforcement:**
   - Thank stewards
   - Appreciate good updates
   - Use memory bank visibly
   - Show value in standups

3. **Continuous Improvement:**
   - Suggest process improvements
   - Fix friction when found
   - Share learnings
   - Iterate on practices

Result: Memory bank maintenance becomes "just how we work"
```

**Recognition System:**
```markdown
# Memory Bank Stewardship Recognition

## Weekly:
- Shout out in standup
- "Thanks [Name] for excellent stewardship this week"
- Specific examples: "activeContext.md was spot-on"

## Monthly:
- "Steward of the Month" recognition
- Criteria: Above-and-beyond effort
- Slack announcement, team kudos
- Optional: Small reward (coffee card, etc)

## Quarterly:
- Include in performance reviews
- "Strong documentation stewardship"
- "Helped maintain team knowledge infrastructure"
- Counts toward career growth

## Annually:
- Team award: "Best Knowledge Stewardship"
- Part of engineering excellence
- Recognition in company communications

## Success Stories:
Document and share:
- "New engineer productive in 1 week (was 4 weeks)"
- "Memory bank helped us avoid outage"
- "Caught bug by reviewing memory bank"

Make stewardship visible and valued.
Not thankless invisible work.
Real contribution to team success.
```

**Impact Demonstration:**
```markdown
# Showing Memory Bank Value

Track and share impact:

## New Engineer Onboarding:
- Before memory bank: 4 weeks to productivity
- After memory bank: 1 week to productivity
- Savings: 3 weeks per new hire

## Context Recovery:
- Without memory bank: 2-3 hours asking questions
- With memory bank: 15 minutes reading docs
- Savings: 2+ hours per context reset

## Decision Quality:
- Memory bank documents rationale
- New decisions built on past learnings
- Avoid repeating mistakes
- Value: Better decisions, less churn

## Team Confidence:
Survey team quarterly:
- "I can understand our architecture" (1-10)
- "I know why decisions were made" (1-10)
- "I trust our documentation" (1-10)

Show improvement over time.

## Incident Prevention:
- "Memory bank helped us catch X before production"
- "Remembered constraint Y, avoided outage"

Document and share these stories.

## Cost of Staleness:
When memory bank was stale:
- 2 weeks to recover
- 3 engineers' time
- New engineer struggled for month

Prevention cost: 30 min/week/engineer
Much cheaper than recovery.

**Show the ROI of stewardship.**
Makes investment obvious.
```

---

**Monitoring Pattern:**

Track stewardship success:

**Success Metrics:**
```markdown
# Memory Bank Health Metrics

## Currency Metrics:
- Days since last update (per file)
  Target: <7 days (activeContext), <30 days (others)
- Update frequency (updates per week)
  Target: ≥1 update/week
- Coverage (% of PRs with memory bank updates)
  Target: >80% of feature/architecture PRs

## Quality Metrics:
- Broken file references
  Target: 0
- Conflicting information
  Target: 0
- Team confidence score (1-10)
  Target: >7

## Usage Metrics:
- New engineer time to productivity
  Target: <2 weeks
- Questions answered by memory bank vs Slack
  Target: >60% memory bank
- Memory bank views (if hosted)
  Target: Increasing trend

## Stewardship Metrics:
- Steward completion rate
  Target: 100% (every week has steward)
- Update facilitation (updates per steward week)
  Target: ≥1
- Issues escalated
  Target: <1 per month (healthy)

## Trend Analysis:
Track monthly:
- Currency improving or degrading?
- Quality stable or declining?
- Team confidence up or down?

If degrading: Investigate and address.

Dashboard these metrics.
Review monthly in team meeting.
Celebrate improvements.
```

**Adjustment Triggers:**
```markdown
# When to Adjust Stewardship Practices

## Red Flags (act immediately):
- Memory bank not updated in >2 weeks
- Multiple files with broken references
- Team confidence <5/10
- New engineers struggling despite memory bank
- Steward role skipped 2+ weeks in row

**Action:** Team discussion, identify root cause, adjust practices

## Yellow Flags (investigate):
- Updates declining (was 3/week, now 1/week)
- Stewards reporting high burden (>3 hours/week)
- Team forgetting to update
- PR template checkbox ignored

**Action:** Discuss in retro, reduce friction, re-emphasize

## Positive Signals (scale up):
- Team confidence >8/10
- Updates happening without prompting
- New engineers productive quickly
- Memory bank cited in decision-making

**Action:** Document success, share practices, mentor other teams

## Regular Review:
Quarterly: Full practice review
- What's working well?
- What's friction?
- What should we change?
- How can we improve?

Iterate on practices.
Continuous improvement.
```

</output-format>

<instructions>
CRITICAL: Stewardship is process design, not individual heroics.

NEVER establish stewardship by:
- Assigning to one person permanently (burnout, single point of failure)
- Adding burden without automation (unsustainable)
- Making updates onerous (high friction = won't happen)
- Hoping team remembers (need systems)
- Treating as optional (will be skipped)

DO NOT:
- Make one person responsible forever
- Skip automation of reminders
- Add work without reducing friction
- Forget workflow integration
- Miss leadership endorsement
- Ignore cultural change needs

ALWAYS:
- Rotate steward responsibility
- Automate reminders and validation
- Integrate into existing workflow
- Reduce friction maximally
- Get leadership visible commitment
- Build cultural expectation
- Monitor and adjust practices

REPEAT: Stewardship is sustainable through rotation, automation, integration, and culture. Make good practice easy and normal.
</instructions>

<examples>
✅ GOOD Stewardship Establishment (sustainable, systematic, cultural):

**Pattern demonstrates:**
- Rotation prevents burnout
- Automation makes remembering easy
- Integration makes updates natural
- Culture makes stewardship normal

**Example establishment:**
```
Stewardship Establishment: API Team
Team: 6 engineers
Timeline: 2 weeks to full implementation

---

WEEK 1: AUTOMATION & PROCESS

Day 1-2: Automated Reminders (4 hours)
Set up automation:
- Weekly Slack reminder (Monday 9am)
- PR template with memory bank checkbox
- CI validation for file references
- Health dashboard script

Testing:
- Triggered manual reminder: ✓ Works
- Created test PR: ✓ Checkbox appears
- Ran CI validation: ✓ Catches broken refs
- Ran health dashboard: ✓ Shows status

Day 3-4: Rotation Setup (3 hours)
Created steward rotation:
- Documented steward role (responsibilities, time)
- Set up 6-person rotation schedule
- Created rotation automation script
- Documented handoff process

Rotation schedule:
Week 1: Alice (backup: Bob)
Week 2: Bob (backup: Charlie)
Week 3: Charlie (backup: Diana)
Week 4: Diana (backup: Eve)
Week 5: Eve (backup: Frank)
Week 6: Frank (backup: Alice)

First steward: Alice (starting Week 2)

Day 5: Friction Reduction (2 hours)
Made updates easier:
- Created templates/ folder with decision/pattern/feature templates
- Wrote helper scripts (mb-add-decision.sh, mb-mark-complete.sh)
- Added README.md with "How to Update"
- Pinned memory-bank folder in team's IDE setup docs

---

WEEK 2: INTEGRATION & CULTURE

Day 1-2: Workflow Integration (4 hours)
Updated team processes:
- Added memory bank to Definition of Done
- Updated code review checklist
- Integrated into sprint rituals:
  - Daily standup: Steward 30-sec report
  - Sprint planning: 5 min memory bank prep
  - Sprint review: 3 min ensure demos documented
  - Sprint retro: 5 min health check

Team meeting:
- Explained changes
- Demoed helper scripts
- Answered questions
- Got team buy-in ✓

Day 3-4: Leadership & Culture (3 hours)
Cultural establishment:
- Tech lead endorsement:
  "Memory bank is infrastructure. Stewardship is real work.
   Updates are part of every sprint, not optional."

- Added to team principles document
- Set up recognition:
  - Weekly shout-out in standup
  - Monthly "steward of the month"
  - Included in performance reviews

- Shared impact data:
  "New engineer Sarah productive in 1 week (was 4 weeks).
   Memory bank made the difference."

Day 5: Launch & Monitor (2 hours)
Official launch:
- Sent team announcement
- Alice started as first steward
- Ran health dashboard: Baseline metrics
  - Currency: Good (all files current)
  - Quality: Good (no broken refs)
  - Team confidence: 6/10 (room to improve)

- Set up monthly metrics review
- Created feedback mechanism

---

FIRST MONTH RESULTS:

Week 1 (Alice steward):
- 3 memory bank updates (2 PRs, 1 steward-initiated)
- Weekly review completed
- Health dashboard: Green
- Feedback: "Steward role clear, not too burdensome"

Week 2 (Bob steward):
- 2 memory bank updates
- Caught 1 PR missing update (requested before approval)
- Weekly review completed
- Feedback: "Helper scripts very useful"

Week 3 (Charlie steward):
- 4 memory bank updates
- No issues found
- Weekly review completed
- Feedback: "Starting to feel routine"

Week 4 (Diana steward):
- 3 memory bank updates
- Noticed activeContext.md outdated, updated
- Weekly review completed
- Feedback: "Felt responsibility, kept eye on it"

First Month Metrics:
- Updates per week: 3 average (target: ≥1) ✓
- PR coverage: 85% of feature PRs (target: >80%) ✓
- Broken references: 0 (target: 0) ✓
- Team confidence: 7/10 (was 6/10, target: >7) ✓
- Steward completion: 100% (all weeks covered) ✓

Team Feedback:
- "Updates feel natural now"
- "Steward role manageable"
- "Memory bank staying current"
- "Helper scripts save time"
- "Feels like normal part of work"

---

QUARTER 1 RESULTS:

Sustainability Check:
- Rotation working: ✓ No burnout, distributed load
- Automation effective: ✓ Team remembers without effort
- Integration successful: ✓ Updates part of workflow
- Culture established: ✓ "Just how we work now"

Metrics After 3 Months:
- Days since update: Avg 3 days (target: <7) ✅
- Update frequency: 3-4/week (target: ≥1) ✅
- PR coverage: 88% (target: >80%) ✅
- Broken references: 0 (target: 0) ✅
- Team confidence: 8/10 (target: >7) ✅

Impact Demonstrated:
- New engineer Frank productive in 5 days (!)
- Memory bank cited in 3 design decisions
- Prevented 1 potential outage (caught constraint)
- Team: "Memory bank is actually useful"

Adjustments Made:
- Reduced steward reporting in standup (30s → 15s)
  Reason: Became routine, less to report
- Added monthly steward appreciation
  Reason: Recognize good work
- Automated more validation checks
  Reason: Further reduce steward burden

---

SUCCESS FACTORS:

1. **Rotation:** No single person burden
   - Everyone steward 1 week per 6 weeks
   - ~1-2 hours per steward week
   - Sustainable long-term

2. **Automation:** Made remembering easy
   - Weekly reminders work
   - PR template catches at right time
   - CI validation provides safety net
   - Dashboard shows status at glance

3. **Integration:** Updates feel natural
   - Part of definition of done
   - In code review checklist
   - Connected to sprint rituals
   - Not separate activity

4. **Culture:** Team bought in
   - Leadership endorsed visibly
   - Recognition for good work
   - Impact demonstrated clearly
   - "Normal" to update

5. **Friction Reduction:** Updates easy
   - Templates provide structure
   - Scripts save time
   - Documentation clear
   - Tools accessible

Result: Sustainable stewardship established.
Memory bank stays current without heroics.
Team confidence high and stable.
New engineers productive quickly.
Knowledge infrastructure reliable.

"Stewardship just works now. It's how we operate."
- Tech Lead
```

**Why this works:**
- Systematic establishment over 2 weeks
- Automation removes remembering burden
- Rotation distributes responsibility
- Integration makes updates natural
- Culture change supported by leadership
- Friction minimized with tools
- Metrics tracked and improving
- Sustainable long-term
- Team bought in completely

---

❌ BAD Stewardship Establishment (unsustainable, individual-dependent):

**Anti-pattern characteristics:**
- Assigned to one person
- No automation
- Not integrated
- High friction
- No cultural change

**Bad establishment:**
```
"Alice, you're good at documentation. Can you keep
the memory bank updated? Thanks!"

(No rotation - Alice alone)
(No automation - Alice must remember)
(No integration - separate from workflow)
(No tools - Alice does everything manually)
(No cultural change - seen as Alice's job)
```

**Why this fails:**
```
Week 1-2: Alice tries hard
- Updates memory bank
- Reminds team to update
- Reviews all PRs for memory bank impact
- Spending 5+ hours/week

Week 3-4: Alice getting tired
- Other work piling up
- Memory bank updates slipping
- Team not helping (not their job)
- Alice frustrated

Week 5-6: Alice burns out
- Stops updating regularly
- Too much burden
- No support from team
- Memory bank degrading

Week 7: Alice on vacation
- No backup
- No updates for week
- Memory bank falls behind

Week 8+: Abandonment
- Alice can't sustain alone
- Team never adopted responsibility
- Memory bank goes stale
- Back to square one

Result:
- Alice burned out
- Memory bank failed
- Single point of failure
- Unsustainable from start
```

**Impact:**
```
"We tried having a memory bank steward but it didn't work.
Too much work for one person. We gave up."

Could have been prevented:
- Rotate responsibility (don't burn out individuals)
- Automate reminders (don't rely on memory)
- Integrate into workflow (make normal)
- Reduce friction (make easy)
- Build culture (everyone's responsibility)

Stewardship works when it's systematic, not when it's
individual heroics.
```

**Lesson:**
```
Don't assign stewardship to one person permanently.

Single person = Single point of failure
No rotation = Burnout inevitable
No automation = Won't be sustained
No integration = Seen as extra work
No culture change = Treated as optional

Good stewardship is systematic:
- Automated reminders
- Rotating responsibility
- Workflow integration
- Minimal friction
- Cultural expectation

Make it easy, distributed, and normal.
Then it works long-term.
```
</examples>
