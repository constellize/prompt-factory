::: {.promptref title="Document Architectural Evolution" url="{SITE_BASE}/prompts/v1/document-architectural-evolution"}
**Preserve architectural context by documenting design decisions, evolution triggers, and migration paths** so future architects understand not just current state but the journey and constraints that shaped each architectural decision.

"...Original monolithic architecture right at 500 tx/sec (simple, fast TTM, all-in-one codebase). By Q1 2025, needed 5000+ tx/sec (business growth + cascading failure incident). New event-driven architecture: 10x scalability (parallelized Stripe calls), better reliability (decoupled notification service), better UX (immediate payment confirmation), accepted tradeoff: operational complexity (RabbitMQ, idempotency handling)..."
:::
