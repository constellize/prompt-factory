# Prompt Generation Preferences

> **Context:** Lessons learned from creating and testing the book editor prompt

## Core Preferences for All Future Prompts

### 1. Strategic CAPITALIZATION

Use CAPITALIZATION for critical instructions, boundaries, and warnings.

**Why it works:** Catches attention for critical rules. Creates visual hierarchy.

**Where to use:**
- Critical constraints: NEVER, ALWAYS, MUST, CRITICAL
- Warnings: IMPORTANT, WARNING, CAUTION
- Absolute requirements: REQUIRED, MANDATORY, FORBIDDEN
- Boundaries: DO NOT, STRICTLY PROHIBITED

**How much to use:** Sparingly (< 2% of words) to maintain impact

<example>
✅ Good usage:
"NEVER rewrite the author's voice. ALWAYS preserve the conversational tone."

❌ Overuse:
"You MUST ALWAYS CAREFULLY CHECK EVERY SINGLE WORD and NEVER MAKE MISTAKES."
</example>

### 2. XML Tags for Structure

Use XML-style tags to create clear boundaries and structure.

**Why it works:**
- Clear demarcation of sections
- Models understand XML structure well
- Easy to parse programmatically
- Visually distinct from content

**Common tags to use:**
- `<thinking>` - For reasoning/analysis sections
- `<example>` - For code/text examples
- `<good-example>` / `<bad-example>` - For contrasts
- `<reasoning>` - For rationale/explanation
- `<warning>` - For critical cautions
- `<checklist>` - For validation lists
- `<output-format>` - For expected response structure

<example>
✅ Good usage:
```
<thinking>
Before suggesting an edit, consider:
1. Does this preserve the author's voice?
2. Is this change necessary for this edition?
3. Will readers understand this better?
</thinking>

<example>
**Original:** "AI is very powerful"
**Edited:** "AI excels at pattern matching within constraints"
</example>
```

❌ Without structure:
```
Before suggesting an edit, consider: Does this preserve the author's voice? Is this change necessary? Will readers understand this better?

Example:
Original: "AI is very powerful"
Edited: "AI excels at pattern matching within constraints"
```
</example>

### 3. Numbered Lists for Sequential Processes

Use numbered lists when ORDER matters.

<example>
✅ For workflows:
1. Read the section carefully
2. Identify specific issues
3. Propose targeted changes
4. Explain rationale for each change
</example>

### 4. Bullet Points for Independent Items

Use bullets when items are independent constraints or features.

<example>
✅ For rules:
- NEVER change the author's core message
- Preserve conversational tone
- Fix typos and grammar issues
- Suggest improvements with rationale
</example>

### 5. Visual Separators

Use clear section breaks and headers.

<example>
✅ Good:
```
# ROLE

You are an experienced technical editor...

# CONSTRAINTS

CRITICAL: You must NOT make large structural changes...

# PROCESS

When editing content:

1. Read carefully
2. Identify issues
3. Propose changes
```
</example>

### 6. Concrete Examples with Before/After

ALWAYS show concrete examples, especially for complex instructions.

<example>
✅ Good - Shows exactly what to do:
```
<bad-example>
**Original:** "This thing helps teams work better"
**Why bad:** Vague terms ("thing", "work better")
</bad-example>

<good-example>
**Edited:** "This approach helps teams maintain context across sprints"
**Why good:** Specific terms, concrete benefit
</good-example>
```

❌ Vague - Just describes:
"Avoid vague terms like 'thing' and 'better'. Be more specific."
</example>

### 7. Explicit Forbidden Behaviors

Use clear ❌ markers for anti-patterns.

<example>
✅ Clear prohibitions:
```
❌ FORBIDDEN: Rewriting entire sections
❌ FORBIDDEN: Changing the author's voice to formal/academic
❌ FORBIDDEN: Adding new concepts not in the original
```
</example>

### 8. Success Criteria and Checklists

Use XML-tagged checklists for validation.

<example>
✅ Actionable checklist:
```
<success-criteria>
A successful edit must:
- [ ] Fix clear errors and inconsistencies
- [ ] Improve readability without changing voice
- [ ] Maintain author's intent and style
- [ ] Feel like a polished version of same text
</success-criteria>
```
</example>

### 9. Template Variables with YAML Front Matter

When your prompt uses template variables (placeholders that users fill in), document them using YAML front matter and Claude-compatible `{{variable}}` syntax.

**Why this works:**
- Standard YAML front matter is widely recognized
- `{{variable}}` syntax is Claude-native (similar to Handlebars/Mustache)
- Includes examples to guide users
- Separates metadata from prompt content
- Easy to parse programmatically

**Format:**
```markdown
---
template_variables:
  - name: variable_name
    description: What this variable represents
    example: "A concrete example value"
  - name: another_variable
    description: Another placeholder
    example: "Another example"
---

<role>
Your prompt content using {{variable_name}} and {{another_variable}}
</role>
```

<example>
✅ Good usage - Requirements engineering system prompt:
```markdown
---
template_variables:
  - name: product_name
    description: The name of your product
    example: "CodePromptu"
  - name: product_description
    description: A description of your product
    example: "An AI-powered code generation tool for enterprise teams"
---

<role>
You are an expert in requirements engineering.
</role>

<task>
Your job is to learn and understand the following text about a product named {{product_name}}.

```
{{product_description}}
```
</task>
```

❌ Bad - Using unclear syntax:
```markdown
<task>
Your job is to learn about {product_name}.

Context: {product_description}
</task>

Note: Replace {product_name} and {product_description} with your values.
```
</example>

**When to use:**
- Prompts that work across multiple products/contexts
- Reusable prompt templates
- Prompts where users provide specific input

**When NOT to use:**
- One-off prompts for specific tasks
- Prompts with no variable content
- Context that's always the same

**Key benefits:**
- Claude understands `{{variable}}` natively
- Front matter provides clear documentation
- Examples show users what to fill in
- Separates metadata from instructions

## Template Structure for Future Prompts

```markdown
# System Prompt: [Name]

---
template_variables:  # OPTIONAL: Include only if prompt uses template variables
  - name: variable_name
    description: What this represents
    example: "Example value"
---

## ROLE

<role>
You are [clear identity]...
</role>

## CRITICAL CONSTRAINTS

<constraints>
MUST:
- [Requirement 1]
- [Requirement 2]

MUST NOT:
- [Prohibition 1]
- [Prohibition 2]
</constraints>

## CONTEXT

<context>
[Background information]
[Current situation]
[Key facts]
</context>

## PROCESS

<process>
When [triggering condition]:

1. [First step]
2. [Second step]
3. [Third step]
</process>

## EXAMPLES

<good-example>
[Show what TO do]
**Why this works:** [Explanation]
</good-example>

<bad-example>
[Show what NOT to do]
**Why this fails:** [Explanation]
</bad-example>

## OUTPUT FORMAT

<output-format>
Your response must include:

1. [Required element 1]
2. [Required element 2]
3. [Required element 3]
</output-format>

## SUCCESS CRITERIA

<success-criteria>
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
</success-criteria>

## WARNINGS

<warning type="critical">
NEVER [critical prohibition]
</warning>

<warning type="common-mistake">
Watch out for [common error]
</warning>
```

## Application to Book Editor Prompt

The book editor prompt should be restructured to:

1. **Use CAPITALIZATION** for critical rules:
   - "NEVER rewrite the author's voice"
   - "ALWAYS preserve conversational tone"
   - "CRITICAL: No large structural changes"

2. **Use XML tags** for structure:
   - `<role>` for identity
   - `<constraints>` for boundaries
   - `<process>` for workflow
   - `<good-example>` / `<bad-example>` for examples
   - `<thinking>` for decision framework
   - `<output-format>` for response structure

3. **Visual hierarchy** with headers and separators

4. **Concrete examples** showing before/after

## Guidelines Compliance

These preferences align with guidelines.md principles:

✓ **Structural Clarity** - XML tags create clear sections
✓ **Emphasis Techniques** - CAPITALIZATION for critical points
✓ **Clarity Techniques** - Concrete examples, explicit prohibitions
✓ **Behavioral Shaping** - Structured thinking patterns
✓ **Error Prevention** - Common mistake callouts

## For Future Prompt Generation

When creating any new prompt:

1. **Start with structure** - Use XML tags to organize
2. **Mark critical items** - Use CAPITALIZATION sparingly but strategically
3. **Show, don't tell** - Include concrete examples
4. **Define boundaries** - Explicit DO/DON'T lists
5. **Provide checklists** - Help model validate its own output
6. **Include thinking framework** - Guide reasoning process

<checklist>
Before finalizing any prompt:
- [ ] Uses CAPITALIZATION for critical instructions (< 2% of words)
- [ ] Uses XML tags for structure and examples
- [ ] Includes concrete before/after examples
- [ ] Has clear success criteria
- [ ] Defines explicit boundaries (NEVER/ALWAYS)
- [ ] Includes common mistake warnings
- [ ] Provides output format expectations
- [ ] Uses visual hierarchy (headers, separators)
</checklist>

---

**Date Created:** 2026-01-11
**Source:** Lessons from book editor prompt testing
**Status:** Active guidelines for all future prompts
