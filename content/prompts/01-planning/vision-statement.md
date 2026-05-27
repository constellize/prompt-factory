---
# === Identity ===
id: vision-statement
name: Generate vision statement using For/Who/The/Is/That/Unlike template
version: v1

# === Classification ===
chapter: 1
category: planning

tags:
  - requirements
  - vision

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Generate vision statement using For/Who/The/Is/That/Unlike template.
    When creating product vision statements.
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
    chapter: 1
    description: |
      Generate product vision statement
    preview: |
      "Write a vision statement for {{product_name}} using the following template: For..."
  website:
    include: true
    path: /prompts/vision-statement
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

<context>
You are analyzing a product named {{product_name}}.

Product description:
{{product_description}}
</context>

<task>
Write a vision statement for {{product_name}} using the following template:

For
[target customers]

Who
[statement of the business need or opportunity]

The
[name of the product or project]

Is
[type of product or project]

That
[major product capabilities; core benefits it will provide; compelling reason to buy the product or undertake the project]

Unlike
[current business reality, alternative products, or the competition]
</task>

<output-format>
Format this as a structured vision statement.
</output-format>
