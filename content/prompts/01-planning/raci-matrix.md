---
# === Identity ===
id: raci-matrix
name: Generate RACI matrix
version: v1

# === Classification ===
chapter: 1
category: planning

tags:
  - requirements
  - RACI
  - stakeholders

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Generate RACI matrix.
    When defining stakeholder responsibilities.
  argument-hint: "[product_name] [product_description]"
  allowed-tools:
    - Read
    - Glob
    - Grep
    - Bash
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
    path: /prompts/raci-matrix
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
Identify stakeholders by name and build a RACI matrix for {{product_name}} showing which stakeholders are Responsible, Accountable, Consulted, or Informed (Morris 2022).

Think for a minute, and break the implementation phase of {{product_name}} into smaller modules, to be developed iteratively, called the implementation plan. Output the titled modules.

Each cell in the matrix MAY be labelled with a subset of labels "R", "A", "C", or "I".
Make sure there are blank cells - not every stakeholder is involved in every module.
There should be an "A" accountable on each row.
If necessary develop more detailed list of tasks or stakeholders.

The columns of the matrix MUST be labelled with the stakeholder names.
The rows of the matrix MUST be labelled with the module titles from the implementation plan.
</task>

<output-format>
Format this description as a markdown document.
</output-format>

<reference>
Morris, R. 2022. The RACI Matrix: Your Blueprint for Project Success. Boca Raton, FL: CRC Press.
</reference>
