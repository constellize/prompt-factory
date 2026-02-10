<!-- PROMPT START -->
> **Prompt: Generate Vision Statement Using For/who/the/is/that/unlike T**
>
> **Purpose:** Generate vision statement using For/Who/The/Is/That/Unlike template
>
> **Use when:** When creating a vision statement that articulates product value proposition
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
```

<!-- PROMPT END -->
<!-- METADATA: {"id":"ch1-generate-vision-statement-using-for-who-the-is-tha","chapter":"Chapter 1","category":"Analysis","tags":["requirements","vision-statement","template"]} -->