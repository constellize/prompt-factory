# Prompt Writer - Usage Guide

## What Is This?

A tool to help you CREATE prompts that will be embedded in your book chapters as examples for readers. These prompts follow best practices (CAPITALIZATION, XML tags) and include metadata for later extraction.

## The Workflow

### Scenario: Adding a Prompt to Chapter 5

You're writing Chapter 5 about microservices and want to include a prompt readers can use with their AI assistant.

**Step 1: Create the prompt**

```bash
npm run create-prompt -- \
  --purpose "Identify service boundaries for microservices architecture" \
  --chapter "Chapter 5" \
  --category "Architecture" \
  --useCase "When designing a microservices system" \
  --tags "microservices,boundaries,design" \
  --output ./prompts/ch5
```

**Step 2: Review generated files**

Three files are created:
- `ch5-identify-service-boundaries-...-prompt.txt` - Raw prompt
- `ch5-identify-service-boundaries-...-book-markdown.md` - Ready to paste into book
- `ch5-identify-service-boundaries-...-metadata.json` - For extraction later

**Step 3: Paste into your book**

Open the `-book-markdown.md` file and copy it into your chapter:

```markdown
## Chapter 5: Microservices Architecture

When identifying service boundaries, use this prompt:

<!-- PROMPT START -->
> **Prompt: Identify Service Boundaries For Microservices Architecture**
>
> **Purpose:** Identify service boundaries for microservices architecture
>
> **Use when:** When designing a microservices system
>
> **Category:** Architecture

\`\`\`
<task>
Identify service boundaries for microservices architecture
</task>

<output-format>
Provide your design proposal in this structure:

1. **Design Approach**
   - Core architectural decisions
   - Key components or services
   - Rationale for choices

2. **Trade-offs**
   - Benefits of this approach
   - Limitations or costs
   - Alternative approaches considered

3. **Implementation Guidance**
   - Recommended first steps
   - Critical dependencies
   - Success criteria
</output-format>

<thinking>
Before responding:
1. Analyze the current situation
2. Consider constraints and trade-offs
3. Identify potential approaches
4. Evaluate pros and cons
</thinking>
\`\`\`

<!-- PROMPT END -->
<!-- METADATA: {"id":"ch5-...","chapter":"Chapter 5",...} -->
```

**Step 4: Later extraction**

The metadata comments allow automatic extraction to merge into website-starter.

---

## Command Reference

### Required Arguments

```bash
--purpose "What the prompt does"
--chapter "Chapter X"
--category "Architecture|Analysis|Design|Review"
--useCase "When to use this prompt"
```

### Optional Arguments

```bash
--context "Additional background information"
--tags "tag1,tag2,tag3"
--output ./output/dir
```

---

## Complete Examples

### Example 1: Architecture Prompt

```bash
npm run create-prompt -- \
  --purpose "Identify service boundaries for microservices architecture" \
  --chapter "Chapter 5" \
  --category "Architecture" \
  --useCase "When designing a microservices system and need to determine logical service boundaries" \
  --tags "microservices,boundaries,design" \
  --output ./prompts/ch5
```

**Generates:**
- Uses Architecture template (Design Approach, Trade-offs, Implementation Guidance)
- Includes `<thinking>` framework
- ID: `ch5-identify-service-boundaries-for-microservices-arch`

---

### Example 2: Analysis Prompt

```bash
npm run create-prompt -- \
  --purpose "Analyze technical debt in legacy codebase" \
  --chapter "Chapter 7" \
  --category "Analysis" \
  --useCase "When evaluating a legacy system for refactoring" \
  --context "Focus on maintainability, test coverage, and architectural issues" \
  --tags "technical-debt,legacy,analysis" \
  --output ./prompts/ch7
```

**Generates:**
- Uses Analysis template (Current State, Analysis, Recommendations)
- Includes context section
- ID: `ch7-analyze-technical-debt-in-legacy-codebase`

---

### Example 3: Review Prompt

```bash
npm run create-prompt -- \
  --purpose "Review API design for consistency and best practices" \
  --chapter "Chapter 6" \
  --category "Review" \
  --useCase "When reviewing API specifications before implementation" \
  --tags "api,review,rest,design" \
  --output ./prompts/ch6
```

**Generates:**
- Uses Review template (Assessment, Specific Feedback, Overall Recommendation)
- ID: `ch6-review-api-design-for-consistency-and-best-practice`

---

### Example 4: Design Prompt

```bash
npm run create-prompt -- \
  --purpose "Design a caching strategy for high-traffic API" \
  --chapter "Chapter 4" \
  --category "Design" \
  --useCase "When optimizing API performance under load" \
  --context "Consider read/write patterns, cache invalidation, and consistency requirements" \
  --tags "caching,performance,design" \
  --output ./prompts/ch4
```

**Generates:**
- Uses Design template (similar to Architecture)
- Includes context
- ID: `ch4-design-a-caching-strategy-for-high-traffic-api`

---

## Output Files Explained

### 1. `{id}-prompt.txt` (Raw Prompt)

The actual prompt text with XML tags:

```
<task>
Identify service boundaries for microservices architecture
</task>

<output-format>
...
</output-format>

<thinking>
...
</thinking>
```

Use this to:
- Test the prompt directly with Claude
- Modify and refine
- Share with collaborators

---

### 2. `{id}-book-markdown.md` (Book-Ready)

Formatted markdown ready to paste into your book:

```markdown
<!-- PROMPT START -->
> **Prompt: Title**
>
> **Purpose:** ...
> **Use when:** ...
> **Category:** ...

\`\`\`
[raw prompt]
\`\`\`

<!-- PROMPT END -->
<!-- METADATA: {...} -->
```

Use this to:
- Paste directly into chapter
- Preview how it looks
- Edit surrounding prose

---

### 3. `{id}-metadata.json` (Extraction Data)

Structured metadata for later extraction:

```json
{
  "id": "ch5-identify-service-boundaries...",
  "chapter": "Chapter 5",
  "category": "Architecture",
  "purpose": "...",
  "useCase": "...",
  "tags": ["microservices", "boundaries"],
  "created": "2026-01-11"
}
```

Use this to:
- Extract prompts later
- Merge into website-starter
- Track which prompts exist
- Generate index/catalog

---

## Prompt Categories and Templates

The tool automatically selects the right template based on category:

### Architecture / Design

**Structure:**
1. Design Approach
2. Trade-offs
3. Implementation Guidance

**Best for:**
- System design
- Service boundaries
- Architecture decisions
- Technology selection

---

### Analysis

**Structure:**
1. Current State
2. Analysis (strengths, weaknesses, opportunities)
3. Recommendations

**Best for:**
- Technical debt assessment
- Code reviews
- System evaluation
- Gap analysis

---

### Review / Evaluate

**Structure:**
1. Assessment
2. Specific Feedback
3. Overall Recommendation

**Best for:**
- Code reviews
- API design review
- Architecture review
- Documentation review

---

### General (Default)

**Structure:**
- Task
- Thinking framework

**Best for:**
- Custom prompts
- Specific scenarios
- Quick prompts

---

## Tips & Best Practices

### Writing Good Purposes

**Good:**
```bash
--purpose "Identify service boundaries for microservices architecture"
```

**Bad:**
```bash
--purpose "Help with microservices"  # Too vague
```

---

### Choosing Categories

- **Architecture** - Designing systems, components, patterns
- **Analysis** - Evaluating existing code/systems
- **Design** - Creating new features, APIs, interfaces
- **Review** - Assessing quality, finding issues

---

### Writing Use Cases

**Good:**
```bash
--useCase "When designing a new microservices system and need to determine logical service boundaries"
```

**Bad:**
```bash
--useCase "Microservices"  # Too short, not contextual
```

---

### Organizing Outputs

```bash
# Organize by chapter
./prompts/
├── ch1/
├── ch2/
├── ch3/
├── ch4/
└── ch5/
    ├── ch5-identify-service-boundaries-...-prompt.txt
    ├── ch5-identify-service-boundaries-...-book-markdown.md
    └── ch5-identify-service-boundaries-...-metadata.json
```

---

## Workflow Integration

### Full Book Writing Workflow

```bash
# 1. You're writing Chapter 5
vim ../constellize/book/ch5.md

# 2. You realize you need a prompt about service boundaries
npm run create-prompt -- \
  --purpose "Identify service boundaries..." \
  --chapter "Chapter 5" \
  --category "Architecture" \
  --useCase "When designing microservices" \
  --output ./prompts/ch5

# 3. Review the generated book-markdown.md
cat ./prompts/ch5/ch5-*-book-markdown.md

# 4. Paste into your chapter
# (copy from book-markdown.md into ch5.md)

# 5. Continue writing, add context around the prompt

# 6. Repeat for other prompts as needed
```

---

### Batch Creation

If you know you need multiple prompts:

```bash
# Create multiple prompts for Chapter 5
npm run create-prompt -- \
  --purpose "Identify service boundaries" \
  --chapter "Chapter 5" \
  --category "Architecture" \
  --useCase "When designing microservices" \
  --output ./prompts/ch5

npm run create-prompt -- \
  --purpose "Design API contracts between services" \
  --chapter "Chapter 5" \
  --category "Design" \
  --useCase "When defining service interfaces" \
  --output ./prompts/ch5

npm run create-prompt -- \
  --purpose "Evaluate service coupling and cohesion" \
  --chapter "Chapter 5" \
  --category "Analysis" \
  --useCase "When reviewing microservices architecture" \
  --output ./prompts/ch5
```

---

## Later: Extraction & Merging

Once your book is complete, you'll use the metadata to:

1. **Extract** all prompts from the book
2. **Convert** to TypeScript format for website-starter
3. **Merge** with existing prompts
4. **Prune** unused prompts

This workflow is separate and will be documented in EXTRACTION-USAGE.md.

---

## Customizing Prompts

The generated prompts are starting points. You should:

1. **Review** the generated text
2. **Add specifics** relevant to your chapter
3. **Adjust examples** to match your book's context
4. **Test** the prompt with Claude to ensure it works
5. **Refine** based on results

Example customization:

**Generated:**
```
<task>
Identify service boundaries for microservices architecture
</task>
```

**After customization:**
```
<task>
Based on the CodePromptu domain model (User, Prompt, Evaluation, Team),
identify logical service boundaries that would:
- Minimize cross-service transactions
- Align with team structure
- Support independent deployment
</task>
```

---

## Troubleshooting

### "Missing required fields" error

All four required fields must be provided:
```bash
npm run create-prompt -- \
  --purpose "..." \
  --chapter "..." \
  --category "..." \
  --useCase "..."
```

### ID too long

The generated ID might be shortened. Check the output files:
```bash
ls prompts/ch5/
# Shows actual filenames with truncated IDs
```

### Wrong template selected

Categories are matched by keywords:
- "Analysis" → Analysis template
- "Architecture" or "Design" → Design template
- "Review" or "Evaluate" → Review template

Be specific with your category.

---

## Related Documentation

- **PROMPT-GENERATION-PREFERENCES.md** - How prompts should be structured
- **guidelines.md** - Overall prompt engineering principles
- **WORKFLOW.md** - Full book → website-starter workflow

---

**Created:** 2026-01-11
**Purpose:** Create prompts for book inclusion
**Status:** Ready to use
