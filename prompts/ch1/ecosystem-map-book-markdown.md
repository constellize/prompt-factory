<!-- PROMPT START -->
> **Prompt: Generate Linear Ecosystem Map Identifying Internal And Exter**
>
> **Purpose:** Generate linear ecosystem map identifying internal and external actors
>
> **Use when:** When mapping stakeholders and actors affecting the product
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
Write a linear ecosystem map for {{product_name}} (Beatty and Chen 2012).

Include multiple internal and external actors affecting {{product_name}}.
</task>

<output-format>
Format this description as a markdown document.
</output-format>

<reference>
Beatty, J., and Chen, A. 2012. Visual Models for Software Requirements. Redmond, WA: Microsoft Press.
</reference>
```

<!-- PROMPT END -->
<!-- METADATA: {"id":"ch1-generate-linear-ecosystem-map-identifying-internal","chapter":"Chapter 1","category":"Analysis","tags":["requirements","ecosystem-map","stakeholders","template"]} -->