::: {.promptref title="Design Proactive Operational Architecture" url="{SITE_BASE}/prompts/v1/design-proactive-operational-architecture"}
**Design proactive operational architecture during development** by planning health checks, failure modes, observability, graceful degradation, and deployment procedures before first production deployment. Build resilience into system design rather than discovering operational requirements through incidents.

"...DEPENDENCY FAILURE MODE: Database unreachable → Fail fast, return 503 / Cache unreachable → Degrade gracefully, bypass cache, continue processing (slower but functional) / Rationale: Cache is performance optimization not critical path, payments must succeed even if slower..."
:::
