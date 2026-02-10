# Chapter 8-9: Prompt Insertion Map

This document maps where prompts should be inserted into Chapter 8 (Growing Organizations) and Chapter 9 (Cultivating Adoption) and what capabilities they should provide.

---

## Chapter 8: Growing Organizations and Systems with Constellize

### Overview

Chapter 8 focuses on three levels of growth:
1. **Organizational Learning**: How teams learn and compound knowledge across sprints
2. **Long-Term System Health**: How preserved context enables confident system evolution
3. **Personal Developer Practice**: How individual engineers build mastery

---

## CHAPTER 8 PROMPT INSERTION POINTS

### **INSERTION POINT 1: After "Organizational Learning Through Sprint Evolution" Section**

**Context in Text:**
After showing how CodePromptu captured sprint learnings and created compound learning effects, readers need prompts to capture their own sprint learnings.

**Prompts to Insert:**

1. **Prompt: `capture-sprint-learnings`** (ch8/organizational/)
   - Document sprint achievements, challenges encountered, lessons learned
   - Extract technical insights (patterns discovered, anti-patterns avoided)
   - Identify organizational insights (process improvements, communication patterns)
   - Link learnings to affected memory bank sections
   - Synthesize cross-sprint patterns for organizational learning
   - Track knowledge transfer between sprints

2. **Prompt: `conduct-knowledge-retrospective`** (ch8/organizational/)
   - Facilitate retrospective focused on knowledge capture and sharing
   - Identify knowledge gaps revealed during sprint
   - Assess effectiveness of current knowledge practices
   - Generate action items for knowledge improvement
   - Document what knowledge helped the team succeed
   - Identify knowledge that should be shared across teams

**Insertion Text Marker:**
> "Notice how individual insights become organizational assets. By systematically capturing lessons learned, CodePromptu transformed individual debugging sessions into shared knowledge that accelerated team-wide development."

**Callout to Add After This Section:**
```
::: {.promptref title="Capture Sprint Learnings" url="{SITE_BASE}/prompts/v1/capture-sprint-learnings"}
[Prose about documenting sprint insights for organizational learning]
:::

::: {.promptref title="Conduct Knowledge Retrospective" url="{SITE_BASE}/prompts/v1/conduct-knowledge-retrospective"}
[Prose about facilitating retrospectives focused on knowledge capture]
:::
```

---

### **INSERTION POINT 2: After "System Evolution with Preserved Context" Section**

**Context in Text:**
After showing how preserved architectural reasoning enables confident evolution, readers need prompts to document their own architectural changes.

**Prompts to Insert:**

3. **Prompt: `document-architectural-evolution`** (ch8/system-health/)
   - Capture architectural changes with full context
   - Document original decision and rationale
   - Explain evolution trigger (what changed)
   - Record new decision with preserved context
   - Document migration path and trade-offs
   - Link to affected system components
   - Preserve reasoning for future evolution

4. **Prompt: `assess-system-health-over-time`** (ch8/system-health/)
   - Evaluate system health across multiple dimensions
   - Track architectural debt accumulation
   - Assess knowledge currency (docs match reality?)
   - Identify areas of increasing complexity
   - Measure maintenance burden trends
   - Recommend health improvement actions
   - Compare current health to past assessments

**Insertion Text Marker:**
> "By preserving architectural reasoning, CodePromptu enabled confident system evolution. Future engineers can understand not just the current state, but the journey that led there and the trade-offs that shaped each decision."

**Callout to Add After This Section:**
```
::: {.promptref title="Document Architectural Evolution" url="{SITE_BASE}/prompts/v1/document-architectural-evolution"}
[Prose about capturing architectural changes with preserved context]
:::

::: {.promptref title="Assess System Health Over Time" url="{SITE_BASE}/prompts/v1/assess-system-health-over-time"}
[Prose about evaluating long-term system health trends]
:::
```

---

### **INSERTION POINT 3: After "Personal Developer Practice Through Systematic Problem-Solving" Section**

**Context in Text:**
After showing how systematic problem-solving builds individual expertise and team capability, readers need prompts for their own learning journeys.

**Prompts to Insert:**

5. **Prompt: `document-personal-learning-journey`** (ch8/personal/)
   - Capture individual problem-solving approach
   - Document challenge encountered and context
   - Record investigation process and decision points
   - Identify skills developed through challenge
   - Extract lessons learned for personal growth
   - Transform personal insight into team contribution
   - Track skill development over time

6. **Prompt: `create-knowledge-contribution`** (ch8/personal/)
   - Package personal insight for team sharing
   - Write clear problem statement and context
   - Document solution approach with rationale
   - Create reusable patterns or templates
   - Add to appropriate memory bank sections
   - Link to related knowledge across constellation
   - Enable knowledge transfer to teammates

**Insertion Text Marker:**
> "This demonstrates how individual knowledge contributions strengthen team capability. Personal practice becomes organizational learning when engineers systematically capture and share their problem-solving approaches."

**Callout to Add After This Section:**
```
::: {.promptref title="Document Personal Learning Journey" url="{SITE_BASE}/prompts/v1/document-personal-learning-journey"}
[Prose about capturing individual problem-solving and skill development]
:::

::: {.promptref title="Create Knowledge Contribution" url="{SITE_BASE}/prompts/v1/create-knowledge-contribution"}
[Prose about packaging personal insights for team sharing]
:::
```

---

### **INSERTION POINT 4: After "Requirements Evolution Through Systematic Analysis" Section**

**Context in Text:**
After showing how requirements evolved through implementation feedback, readers need prompts to evolve their own requirements systematically.

**Prompts to Insert:**

7. **Prompt: `evolve-requirements-from-implementation`** (ch8/personal/)
   - Document requirements evolution based on implementation learnings
   - Capture original assumptions and what changed
   - Record implementation feedback and discoveries
   - Update requirements with evolved understanding
   - Preserve both original and evolved requirements
   - Document why evolution occurred (not just what changed)
   - Create feedback loop for future requirement gathering

**Insertion Text Marker:**
> "This systematic approach to requirements evolution creates organizational learning by preserving not just what was built, but why requirements changed and what was learned through implementation."

**Callout to Add After This Section:**
```
::: {.promptref title="Evolve Requirements from Implementation" url="{SITE_BASE}/prompts/v1/evolve-requirements-from-implementation"}
[Prose about updating requirements based on implementation learnings]
:::
```

---

## CHAPTER 9: Cultivating Adoption — From Curiosity to Competence

### Overview

Chapter 9 focuses on practical adoption of Constellize practices:
1. Teaching the plan-prompt-proceed pattern
2. Introducing memory banks to teams
3. Real development with guided practice
4. First week guidance for individuals and teams
5. Common obstacles and solutions

---

## CHAPTER 9 PROMPT INSERTION POINTS

### **INSERTION POINT 1: After "Introducing the Memory Bank to Your Team" Section**

**Context in Text:**
After explaining how to introduce memory banks, readers need prompts to onboard teams effectively.

**Prompts to Insert:**

8. **Prompt: `onboard-team-to-memory-banks`** (ch9/adoption/)
   - Create team onboarding plan for memory bank adoption
   - Develop practical exercises for first experiences
   - Structure gradual introduction (2 files → full system)
   - Create shared vocabulary and conventions
   - Set up collaborative memory bank practices
   - Address common concerns and objections
   - Measure early adoption success

9. **Prompt: `create-memory-bank-training-exercise`** (ch9/adoption/)
   - Design hands-on exercise for learning memory banks
   - Use real project context (not toy examples)
   - Structure exercise with clear learning objectives
   - Include plan-prompt-proceed pattern practice
   - Provide reflection prompts for learners
   - Create success criteria and checkpoints
   - Enable self-paced or facilitated learning

**Insertion Text Marker:**
> "This enables AI to maintain project understanding while teams reenter context quickly across sessions."

**Callout to Add After This Section:**
```
::: {.promptref title="Onboard Team to Memory Banks" url="{SITE_BASE}/prompts/v1/onboard-team-to-memory-banks"}
[Prose about creating effective team onboarding for memory banks]
:::

::: {.promptref title="Create Memory Bank Training Exercise" url="{SITE_BASE}/prompts/v1/create-memory-bank-training-exercise"}
[Prose about designing hands-on learning exercises]
:::
```

---

### **INSERTION POINT 2: After "Building Your Knowledge System" Section**

**Context in Text:**
After explaining organic growth principle ("Let need drive structure, not theory"), readers need prompts for their own knowledge system growth.

**Prompts to Insert:**

10. **Prompt: `grow-memory-bank-organically`** (ch9/adoption/)
   - Assess current memory bank coverage and gaps
   - Identify pain points that signal need for new files
   - Add memory bank files based on actual need
   - Expand existing files with discovered patterns
   - Avoid premature structure (let need emerge)
   - Balance minimalism with completeness
   - Review and prune obsolete content

**Insertion Text Marker:**
> "Key principle: Let need drive structure, not theory."

**Callout to Add After This Section:**
```
::: {.promptref title="Grow Memory Bank Organically" url="{SITE_BASE}/prompts/v1/grow-memory-bank-organically"}
[Prose about letting memory bank structure emerge from actual need]
:::
```

---

### **INSERTION POINT 3: Within "Your First Week: From Curiosity to Practice" Section**

**Context in Text:**
The five-day path is described narratively. After Day 5 "Reflect and Evolve," insert prompt.

**Prompt to Insert:**

11. **Prompt: `guide-first-week-adoption`** (ch9/adoption/)
   - Provide day-by-day guidance for first week
   - Day 1: Create minimal memory bank (2 files)
   - Day 2: Document one architectural decision
   - Day 3-4: Try plan-prompt-proceed with real task
   - Day 5: Reflect and evolve practices
   - Include checkpoints and success indicators
   - Address common first-week challenges
   - Enable solo or team adoption

**Insertion Text Marker:**
> "Add these reflections to `progress.md`. This metacognitive step—thinking about your process—builds the habits that make Constellize stick."

**Callout to Add After Day 5 Description:**
```
::: {.promptref title="Guide First Week Adoption" url="{SITE_BASE}/prompts/v1/guide-first-week-adoption"}
[Prose about structured five-day path from curiosity to practice]
:::
```

---

### **INSERTION POINT 4: After "Common First-Week Obstacles (and Solutions)" Section**

**Context in Text:**
After describing common obstacles, readers need prompt to diagnose and address their own adoption challenges.

**Prompt to Insert:**

12. **Prompt: `diagnose-adoption-obstacles`** (ch9/adoption/)
   - Identify specific adoption challenges team is facing
   - Diagnose root causes (not just symptoms)
   - Match obstacles to solution patterns
   - Create action plan for addressing obstacles
   - Adapt Constellize practices to team context
   - Measure progress on adoption goals
   - Celebrate early wins and momentum

**Insertion Text Marker:**
> "Use frustration as debugging information, not failure."

**Callout to Add After This Section:**
```
::: {.promptref title="Diagnose Adoption Obstacles" url="{SITE_BASE}/prompts/v1/diagnose-adoption-obstacles"}
[Prose about identifying and addressing adoption challenges]
:::
```

---

## Recommended Folder Structure

```
ch8/
├── organizational/
│   ├── capture-sprint-learnings-prompt.txt
│   ├── capture-sprint-learnings-metadata.json
│   ├── capture-sprint-learnings-preview-callout.md
│   ├── conduct-knowledge-retrospective-prompt.txt
│   ├── conduct-knowledge-retrospective-metadata.json
│   └── conduct-knowledge-retrospective-preview-callout.md
├── system-health/
│   ├── document-architectural-evolution-prompt.txt
│   ├── document-architectural-evolution-metadata.json
│   ├── document-architectural-evolution-preview-callout.md
│   ├── assess-system-health-over-time-prompt.txt
│   ├── assess-system-health-over-time-metadata.json
│   └── assess-system-health-over-time-preview-callout.md
└── personal/
    ├── document-personal-learning-journey-prompt.txt
    ├── document-personal-learning-journey-metadata.json
    ├── document-personal-learning-journey-preview-callout.md
    ├── create-knowledge-contribution-prompt.txt
    ├── create-knowledge-contribution-metadata.json
    ├── create-knowledge-contribution-preview-callout.md
    ├── evolve-requirements-from-implementation-prompt.txt
    ├── evolve-requirements-from-implementation-metadata.json
    └── evolve-requirements-from-implementation-preview-callout.md

ch9/
└── adoption/
    ├── onboard-team-to-memory-banks-prompt.txt
    ├── onboard-team-to-memory-banks-metadata.json
    ├── onboard-team-to-memory-banks-preview-callout.md
    ├── create-memory-bank-training-exercise-prompt.txt
    ├── create-memory-bank-training-exercise-metadata.json
    ├── create-memory-bank-training-exercise-preview-callout.md
    ├── grow-memory-bank-organically-prompt.txt
    ├── grow-memory-bank-organically-metadata.json
    ├── grow-memory-bank-organically-preview-callout.md
    ├── guide-first-week-adoption-prompt.txt
    ├── guide-first-week-adoption-metadata.json
    ├── guide-first-week-adoption-preview-callout.md
    ├── diagnose-adoption-obstacles-prompt.txt
    ├── diagnose-adoption-obstacles-metadata.json
    └── diagnose-adoption-obstacles-preview-callout.md
```

**Chapter 8 Total: 7 prompts across 3 categories**
**Chapter 9 Total: 5 prompts in 1 category**
**Combined Total: 12 prompts**

---

## Prompt Coverage Summary

### Chapter 8: Growing Organizations and Systems

| Category | Prompts | Purpose |
|----------|---------|---------|
| **Organizational Learning** (2) | capture-sprint-learnings, conduct-knowledge-retrospective | Capture team learnings and facilitate knowledge-focused retrospectives |
| **System Health** (2) | document-architectural-evolution, assess-system-health-over-time | Preserve architectural context and track long-term system health |
| **Personal Practice** (3) | document-personal-learning-journey, create-knowledge-contribution, evolve-requirements-from-implementation | Support individual mastery and contribution to team knowledge |

### Chapter 9: Cultivating Adoption

| Category | Prompts | Purpose |
|----------|---------|---------|
| **Adoption** (5) | onboard-team-to-memory-banks, create-memory-bank-training-exercise, grow-memory-bank-organically, guide-first-week-adoption, diagnose-adoption-obstacles | Enable successful adoption of knowledge-driven practices |

---

## Key Themes to Emphasize in Prompts

### Chapter 8 Themes:
1. **Compound Learning** - Each solved problem accelerates solving the next
2. **Preserved Context** - Enables confident evolution rather than fearful guessing
3. **Personal + Organizational** - Individual practice strengthens team capability
4. **Systematic Evolution** - Track how and why systems and requirements change
5. **Long-term Health** - Prevent drift through continuous knowledge maintenance

### Chapter 9 Themes:
1. **Gradual Adoption** - Start minimal, grow based on need
2. **Practical Learning** - Use real projects, not toy examples
3. **Plan-Prompt-Proceed** - Structured pattern for knowledge-driven development
4. **Organic Growth** - Let need drive structure, not theory
5. **Overcoming Friction** - Address common obstacles with practical solutions
6. **First Week Success** - Create early wins that build momentum

---

## Technology-Agnostic Patterns to Follow

All Chapter 8-9 prompts should be:
- **Method-focused** - Not tied to specific tools or technologies
- **Pattern-based** - Applicable across any development context
- **Principle-driven** - Focus on systematic knowledge practices
- **Context-appropriate** - Work for solo developers, small teams, and large organizations
- **Practical** - Emphasize doing over theorizing

---

## Next Steps

1. Create ch8 and ch9 folder structures
2. Generate 12 prompts following ch7 style and patterns
3. Include comprehensive examples from CodePromptu and other contexts
4. Add prose to all preview callouts with short snippet format (1-2 lines)
5. Update Chapter 8 and Chapter 9 text with prompt callout insertions at marked locations
6. Ensure all prompts connect to earlier chapters (reference ch5 memory banks, ch4 quality gates, etc.)
