---
# === Identity ===
id: ch1-system-prompt-for-requirements-engineering-analysi
name: System prompt for requirements engineering analysis
version: 1.0.0

# === Classification ===
chapter: 1
category: planning
subcategory: archived
tags:
  - requirements
  - system-prompt
  - template

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    System prompt for requirements engineering analysis.
    Use as system prompt when generating requirements documents for a product.
  argument-hint: "[product_name] [product_description]"
  allowed-tools:
    - Read
    - Glob
    - Grep
  model: sonnet
  context: inline
  user-invocable: true
  disable-model-invocation: false

# === Variables ===
variables:
  - name: product_name
    description: The name of your product
    example: "CodePromptu"
    maps-to: "$0"
  - name: product_description
    description: A description of your product
    example: "An AI-powered code generation tool for enterprise teams that integrates with existing IDEs"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/ch1-system-prompt-for-requirements-engineering-analysi
  marketplace:
    plugin: constellize:design

# === Related ===
related:
  personas: []
  skills: []
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

<instructions>
IMPORTANT: Use this as a system prompt. After setting this context, use one of the following requirement-type prompts:
- Business Problem Statement
- Vision Statement
- Ecosystem Map
- RACI Matrix
</instructions>
