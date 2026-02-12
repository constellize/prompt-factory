---
# === Identity ===
id: ecosystem-map
name: Generate linear ecosystem map
version: v1

# === Classification ===
chapter: 1
category: planning

tags:
  - requirements
  - stakeholders
  - ecosystem

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Generate linear ecosystem map.
    When mapping stakeholders and actors.
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
    path: /prompts/ecosystem-map
  marketplace:
    plugin: constellize-planning

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
Write a linear ecosystem map for {{product_name}} (Beatty and Chen 2012).

Include multiple internal and external actors affecting {{product_name}}.
</task>

<output-format>
Format this description as a markdown document.
</output-format>

<reference>
Beatty, J., and Chen, A. 2012. Visual Models for Software Requirements. Redmond, WA: Microsoft Press.
</reference>
