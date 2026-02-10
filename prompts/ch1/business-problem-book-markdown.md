<!-- PROMPT START -->
> **Prompt: Generate Business Problem Statement Using Spiibv Template**
>
> **Purpose:** Generate business problem statement using SPIIBV template
>
> **Use when:** When documenting business problems and opportunities for a product
>
> **Category:** Analysis

```
---
template_variables:
  - name: product_name
    description: The name of your product
    example: "CodePromptu"
  - name: product_description
    description: A description of your product
    example: "An AI-powered code generation tool for enterprise teams that integrates with existing IDEs"
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
```

<!-- PROMPT END -->
<!-- METADATA: {"id":"ch1-generate-business-problem-statement-using-spiibv-t","chapter":"Chapter 1","category":"Analysis","tags":["requirements","business-problem","SPIIBV","template"]} -->