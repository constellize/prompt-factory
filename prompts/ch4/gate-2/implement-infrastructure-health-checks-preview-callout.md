::: {.promptref title="Implement Infrastructure Health Checks For Databases, Caches, APIs, And Filesystems" url="{SITE_BASE}/prompts/v1/implement-infrastructure-health-checks"}
**Implement infrastructure health checks** that verify your system's foundational dependencies are functioning correctly. Database connectivity should be tested with response time measurements to detect degradation before it becomes failure. Cache connectivity for systems like Redis needs performance metrics that reveal latency issues. External API reachability requires timeout detection to distinguish between slow responses and complete outages. File system access and disk space monitoring catch storage issues before they cause cascade failures.

"Implement infrastructure health checks for {{component_name}} in {{system_name}} that verify your system's foundational dependencies are functioning correctly. A system that can't report its own health is a system waiting to fail silently..."
:::
