# Meta Prompts

This folder contains prompts about the Prompt Factory itself - prompts that help you create, understand, or work with the factory system.

## Available Prompts

### Generate Prompt (`generate-prompt`)

**Purpose:** Generate high-quality prompts that follow Prompt Factory guidelines

**When to use:** When you need to create a new prompt for the factory and want to ensure it follows all the established best practices (XML tags, strategic CAPITALIZATION, token efficiency, proper structure, etc.)

**How to use:**

1. Provide these inputs to the prompt:
   - `purpose`: What the new prompt should accomplish
   - `chapter`: Which book chapter it belongs to
   - `category`: Architecture, Analysis, Design, Review, Implementation, or Maintenance
   - `use_case`: When someone should use this prompt
   - `context`: (optional) Additional background information
   - `tags`: Comma-separated categorization tags

2. The prompt will generate a complete, ready-to-use prompt following factory standards

3. Review the generated prompt and make any necessary adjustments

**Example usage:**

```
Purpose: Identify service boundaries for microservices architecture
Chapter: Chapter 5
Category: Architecture
Use Case: When designing a microservices system and need to determine logical service boundaries
Context: Focus on domain-driven design principles and bounded contexts
Tags: microservices,boundaries,design,ddd
```

This would generate a well-structured prompt with:
- XML tags (`<task>`, `<thinking>`, `<output-format>`, `<warning>`)
- Template variables for system-specific inputs
- Category-appropriate output format (Design Approach, Trade-offs, Implementation Guidance)
- Thinking framework to guide reasoning
- Warnings about common mistakes
- Token-efficient structure (<1500 tokens)

## Why This Exists

Creating prompts that follow all the factory guidelines can be complex. This meta-prompt:
- Ensures consistency across all generated prompts
- Enforces best practices automatically
- Saves time by generating the complete structure
- Reduces errors from missing required sections
- Makes it easier for new contributors to create quality prompts

## Guidelines Reference

Generated prompts must follow:
- **PROMPT-GENERATION-PREFERENCES.md** - Structural patterns and conventions
- **guidelines.md** - Context engineering best practices
- Category-specific templates - Output format patterns

The `generate-prompt` prompt encodes all these requirements so you don't have to remember them all manually.
