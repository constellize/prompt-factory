# Usage Guide: Book Editor System Prompt

## Quick Start

1. **Load the system prompt** into your LLM conversation
2. **Provide the chapter or section** you want edited
3. **Review the suggested changes** with rationale
4. **Apply accepted edits** to your manuscript
5. **Iterate** with follow-up questions or refinements

## Example Session 1: Editing a Chapter Section

### User Message

```markdown
Please edit this section from Chapter 3:

---

## Memory Banks and Construction Zones

Memory banks are where you store knowledge. Their really important for keeping
track of what you know. Construction zones are where you build stuff. You use
the things from memory banks in construction zones to make new things.

This is very powerful because it helps teams alot. Teams can reuse knowlege
instead of starting from scratch every time.
---
```

### AI Response

```markdown
## Section: Memory Banks and Construction Zones

### Issues Found

1. **Typo** (Para 1): "Their" should be "They're"
2. **Typo** (Para 2): "alot" should be "a lot"
3. **Typo** (Para 2): "knowlege" should be "knowledge"
4. **Clarity** (Para 1): Vague description of memory banks and construction zones
5. **Precision** (Para 2): "very powerful" and "helps teams alot" are vague
6. **Tone** (Overall): Too casual, lacks the grounded precision expected

### Suggested Changes

#### Change 1: Clarify Memory Banks definition
**Current:**
> Memory banks are where you store knowledge. Their really important for keeping
> track of what you know.

**Proposed:**
> Memory Banks store captured knowledge — insights, constraints, decisions, and
> context that inform system design. They're the foundation for preserving intent
> across time and team changes.

**Rationale:** More precise definition, fixes typo, aligns with book's terminology
(capitalized "Memory Banks"), and grounds the concept in the book's core theme
of preserving intent.

---

#### Change 2: Clarify Construction Zones definition
**Current:**
> Construction zones are where you build stuff. You use the things from memory
> banks in construction zones to make new things.

**Proposed:**
> Construction Zones are where active development happens — where engineers build
> new components by drawing on Memory Bank knowledge to ensure implementations
> align with captured intent.

**Rationale:** More professional tone, clearer explanation of the relationship,
consistent capitalization, removes vague "stuff" and "things."

---

#### Change 3: Strengthen the value proposition
**Current:**
> This is very powerful because it helps teams alot. Teams can reuse knowlege
> instead of starting from scratch every time.

**Proposed:**
> This separation enables teams to build from understanding rather than assumptions.
> By reusing documented knowledge, teams avoid duplicating research, repeating
> mistakes, or losing context when requirements evolve.

**Rationale:** Removes vague "very powerful" and "helps alot," fixes typos, and
provides specific benefits that align with the book's themes. More concrete and
grounded.

---

### Complete Revised Section

## Memory Banks and Construction Zones

Memory Banks store captured knowledge — insights, constraints, decisions, and
context that inform system design. They're the foundation for preserving intent
across time and team changes.

Construction Zones are where active development happens — where engineers build
new components by drawing on Memory Bank knowledge to ensure implementations
align with captured intent.

This separation enables teams to build from understanding rather than assumptions.
By reusing documented knowledge, teams avoid duplicating research, repeating
mistakes, or losing context when requirements evolve.
```

## Example Session 2: Consistency Check

### User Message

```markdown
Check this paragraph for consistency with the rest of the book:

"The memory bank is a revolutionary new way to store information. It's absolutely
amazing how it transforms your workflow! You'll love using the Memory Bank to
keep track of everything."
```

### AI Response

```markdown
## Consistency Issues Found

### Tone Problems
This paragraph has several tone issues that don't align with the book's style:

1. **"Revolutionary new way"** — Too marketing-oriented. The book avoids hype.
2. **"Absolutely amazing"** — Over-enthusiastic. Conflicts with Australian understatement.
3. **"You'll love using"** — Sales pitch tone, not conversational-technical.

### Terminology Inconsistency
- Switches between "memory bank" (lowercase) and "Memory Bank" (capitalized)
- Should consistently use "Memory Bank" when referring to the concept

### Suggested Revision

**Proposed:**
> The Memory Bank captures knowledge where it emerges — close to decisions,
> constraints, and context. By storing this information systematically, teams
> maintain clarity about why systems work the way they do, even as requirements
> shift.

**Why this works:**
- Removes hype ("revolutionary", "amazing", "you'll love")
- Explains the concept clearly without overselling
- Grounds the value in practical benefits
- Maintains conversational but precise tone
- Uses consistent capitalization
- Focuses on what it does, not how readers will feel about it
```

## Example Session 3: Clarifying Unclear Reference

### User Message

```markdown
This paragraph feels unclear. Can you help?

"When you build the system, it needs to connect to them. This ensures everything
works properly and they can communicate effectively."
```

### AI Response

```markdown
## Clarity Issue: Ambiguous References

### Problem
Multiple unclear antecedents:
- "the system" — which system?
- "them" — connects to what?
- "This" — refers to what action?
- "they" — what entities are communicating?

### Context Needed
Without surrounding context, I can suggest general improvements, but the specific
terms need to match your chapter's topic.

**If this is about Memory Banks and Construction Zones:**
> When you build components in a Construction Zone, they need to connect to the
> relevant Memory Banks. This ensures implementations align with documented
> constraints and teams can trace decisions back to their source.

**If this is about services/microservices:**
> When you build a new service, it needs to connect to existing services through
> defined APIs. This ensures the system works cohesively and services can
> communicate through established contracts.

**Recommendation:**
Please provide the surrounding paragraph or let me know what "the system" and
"them" refer to, and I'll provide a more precise revision.
```

## Example Session 4: Checking Examples

### User Message

```markdown
Does this example work well?

"For example, if you're using Python, you might write:

```python
def process_data(data):
    result = data.map(lambda x: x * 2)
    return result
```

This shows how to use the Constellize method in practice."
```

### AI Response

```markdown
## Example Review: Issues Found

### Technical Accuracy
The code example has problems:
- Python lists don't have a `.map()` method (that's JavaScript syntax)
- Should use list comprehension or `map()` function

### Connection to Constellize
The example doesn't clearly illustrate Constellize principles:
- No mention of Memory Banks, Construction Zones, or intent
- Just shows generic Python code
- Claim that it "shows how to use the Constellize method" is unsupported

### Suggested Revision

**Option 1: Fix the code only**
```python
def process_data(data):
    result = [x * 2 for x in data]
    return result
```

**Option 2: Better example aligned with Constellize**

> For example, when implementing a data transformation for CodePromptu, we might
> document our intent in a Memory Bank entry:
>
> ```markdown
> # Decision: Data Normalization Approach
> **Context:** Prompt evaluation requires consistent input format
> **Decision:** Transform all prompt inputs to normalized schema before evaluation
> **Rationale:** Enables consistent scoring regardless of input source
> **Constraints:** Must preserve original metadata for audit trail
> ```
>
> This captured intent then guides implementation in the Construction Zone:
>
> ```python
> def normalize_prompt(raw_prompt: dict) -> NormalizedPrompt:
>     """Transform raw prompt to normalized schema.
>
>     See Memory Bank: decisions/data-normalization-approach.md
>     """
>     return NormalizedPrompt(
>         text=raw_prompt['content'],
>         metadata=preserve_original_metadata(raw_prompt),
>         schema_version='1.0'
>     )
> ```

**Recommendation:** Use Option 2 — it connects the code to Constellize concepts
and uses the CodePromptu example consistently.
```

## Best Practices

### Do's
- ✓ Provide surrounding context when possible
- ✓ Ask specific questions about unclear suggestions
- ✓ Request alternatives if you disagree with a suggestion
- ✓ Verify technical accuracy of code changes
- ✓ Review multiple sections for consistency

### Don'ts
- ✗ Don't accept all suggestions blindly
- ✗ Don't provide tiny snippets without context
- ✗ Don't forget to maintain your voice
- ✗ Don't let the editor change your core message

## Common Commands

### Check terminology consistency
```
"Check this chapter for consistent use of 'Memory Bank' vs 'memory bank'"
```

### Review tone alignment
```
"Does this section maintain the conversational but precise tone from tone.md?"
```

### Verify cross-references
```
"Check if all references to 'Chapter 5' in this section are accurate"
```

### Quick polish
```
"Please do a quick polish pass on this section — typos, grammar, and obvious issues only"
```

### Detailed edit
```
"Please do a comprehensive edit of this section, checking for consistency, clarity, precision, and polish"
```

## Interpreting Suggestions

### When the editor suggests changes, consider:

1. **Severity:** Is this a critical fix (typo, unclear) or stylistic preference?
2. **Voice:** Does the change maintain your voice?
3. **Accuracy:** Is the suggestion technically correct?
4. **Necessity:** Is this change needed for this edition?

### You can always:
- Accept the suggestion fully
- Accept parts and reject others
- Ask for alternatives
- Explain why you prefer the original
- Request clarification on rationale

## Workflow Integration

### Daily Editing Session
```bash
1. Open Claude with system prompt loaded
2. Copy section from chapter file
3. Paste and request edit
4. Review suggestions
5. Apply accepted changes
6. Move to next section
```

### Chapter Review
```bash
1. Edit chapter in passes:
   - Pass 1: Major clarity issues
   - Pass 2: Consistency check
   - Pass 3: Polish (typos, grammar)
2. Take breaks between passes
3. Read edited chapter aloud
4. Final verification pass
```

### Pre-Preview Checklist
```bash
□ All chapters edited for consistency
□ Technical terms defined on first use
□ CodePromptu example consistent throughout
□ Cross-references verified
□ Callout formatting consistent
□ Tone check against tone.md
□ Final typo sweep
```

## Troubleshooting

### "The suggestions change my voice too much"
→ Remind the editor: "Please preserve my conversational tone more closely"

### "The edits are too minor"
→ Request: "Please focus on more significant clarity and consistency issues"

### "The edits are too major"
→ Remind: "Remember, this is final polish only — no large structural changes"

### "I disagree with a suggestion"
→ Say: "I prefer the original phrasing because [reason]. Can you suggest an alternative that addresses [specific issue]?"

## Quick Reference

| Need | Command |
|------|---------|
| Typo check | "Quick typo and grammar check" |
| Consistency | "Check terminology consistency" |
| Clarity | "Identify unclear sentences" |
| Tone check | "Does this match our tone.md style?" |
| Full edit | "Comprehensive edit with rationale" |
| Code review | "Check this code example" |
| Cross-refs | "Verify chapter references" |

---

*Remember: You're the author. The editor suggests; you decide.*
