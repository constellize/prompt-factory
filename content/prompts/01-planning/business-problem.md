---
# === Identity ===
id: business-problem
name: Generate business problem statement using SPIIBV template
version: v1

# === Classification ===
chapter: 1
category: planning

tags:
  - requirements
  - business-problem
  - SPIIBV

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Generate business problem statement using SPIIBV template.
    When documenting business problems and opportunities.
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
    path: /prompts/business-problem
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
Write a business problem statement for {{product_name}} following the SPIIBV template:

Situation
Describe the background, context, and environment.

Problem
Describe the business problems or opportunities as you now understand them.

Implication
Describe the likely results if the problem isn't solved.

Benefit
State the business value of solving the problem.

Vision
Describe what the desired future state would look like.
</task>

<output-format>
Format this description as a markdown document.
</output-format>
