---
# === Identity ===
id: implement-actionable-health-reporting
name: Design actionable health reporting with status indicators, errors, thresholds, and dependency mapping
version: v1

# === Classification ===
chapter: 4
category: quality
subcategory: gate-2
tags:
  - quality
  - health-checks
  - reporting
  - observability
  - gate-2

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Design actionable health reporting with status indicators, errors, thresholds, and dependency mapping.
    After health checks implemented, create actionable reporting (Gate 2: Health Check Completeness).
  argument-hint: "[component_name] [system_name]"
  allowed-tools:
    - Read
    - Glob
    - Grep
    - Write
    - Bash
  model: sonnet
  context: inline
  user-invocable: true
  disable-model-invocation: false

# === Variables ===
variables:
  - name: component_name
    description: The specific component to add actionable health reporting for
    example: "PaymentProcessor"
    maps-to: "$0"
  - name: system_name
    description: The name of your system
    example: "Payment Processing System"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    chapter: 4
    description: |
      **Design actionable health reporting** that enables operators to respond effectively. Status indicators should be clear and meaningful: UP, DOWN, or DEGRADED, not just HTTP status codes. Error messages must include specific troubleshooting hints that guide operators toward resolution. Performance metrics should include acceptable thresholds so operators know when values are concerning. Dependencies should be mapped individually with their own status, so a single downstream failure doesn't obscure the health of other components.
    preview: |
      "...health reports MUST be actionable—operators need to understand WHAT failed, WHY it matters, and HOW to fix it..."
  website:
    include: true
    path: /prompts/implement-actionable-health-reporting
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Design actionable health reporting for {{component_name}} in {{system_name}} that enables operators to respond effectively.

Health reports MUST be actionable—operators need to understand WHAT failed, WHY it matters, and HOW to fix it. Status indicators, error messages, thresholds, and dependency mapping turn health checks from data into decisions.

CRITICAL: Use dependency chaining to paint a complete picture during incidents. Each health check should report the health of services it depends on, creating a cascade view that reveals root causes. When a database is down because disk is full, report BOTH failures so operators can trace the problem to its source.

Follow this process:

1. **Review health check implementation:**
   - Infrastructure health checks (database, cache, API, filesystem)
   - Application health validation (startup, config, environment, business rules)
   - Operational monitoring (memory, threads, throughput, business metrics)

2. **Design status indicators:**
   - Use clear states: UP, DEGRADED, DOWN (not just HTTP codes)
   - Report overall status AND component statuses
   - Include status reasons (why DEGRADED or DOWN)
   - Provide status history (when did degradation start)

3. **Design error messages:**
   - Include specific troubleshooting hints (HOW to fix)
   - Name the failing dependency (WHAT failed)
   - Explain impact (WHY it matters)
   - Provide remediation steps (actionable guidance)

4. **Design performance reporting:**
   - Include acceptable thresholds (what's concerning)
   - Report actual vs expected values
   - Indicate capacity remaining
   - Show trends (improving or degrading)

5. **Design dependency mapping:**
   - Map each dependency individually with own status
   - Show dependency tree (upstream/downstream)
   - Isolate failures (single downstream failure visible separately)
   - Report last success timestamp for failed dependencies
   - CRITICAL: Include recursive dependency health (cascade view)
   - Each component reports health of its own dependencies
   - Create full dependency chain showing root cause
   - Enable operators to trace failures to source
</task>

<context>
Component to add health reporting:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from existing health check implementations and creates reporting format.
</context>

<thinking>
Before implementing health reporting, analyze:
1. Who consumes health reports? (operators, monitoring systems, load balancers)
2. What decisions do they need to make? (restart, scale, investigate)
3. What information enables those decisions? (which dependency, how to fix)
4. What format is consumed? (JSON for machines, human-readable for ops)
5. How can reports be actionable vs just informational?
</thinking>

<output-format>
Add health reporting endpoint to component:

```[language]
// ACTIONABLE HEALTH REPORTING: {{component_name}}
// Purpose: Enable operators to respond effectively
//
// Report Format:
// - Status: UP, DEGRADED, DOWN (clear states)
// - Components: Individual status for each dependency
// - Errors: Specific troubleshooting hints
// - Thresholds: What values are concerning
//
// Consumers:
// - Load balancers: Use status for routing decisions
// - Monitoring: Use for alerting and dashboards
// - Operators: Use error messages for troubleshooting

app.get('/health', async (req, res) => {
  const health = await healthCheck.check();

  // Status code for load balancers
  const statusCode = health.status === 'UP' ? 200
    : health.status === 'DEGRADED' ? 200 // Still route traffic
    : 503; // DOWN - don't route traffic

  res.status(statusCode).json(health);
});
```

Structure health reports with:
- Clear status (UP/DEGRADED/DOWN)
- Component breakdown (each dependency separate)
- Specific errors (what failed, how to fix)
- Thresholds (what's concerning)
- Timestamps (when failure started)
</output-format>

<instructions>
CRITICAL: Health reports MUST be actionable. Include HOW to fix, not just WHAT failed.

NEVER implement health reporting that:
- Returns only HTTP status codes (use UP/DEGRADED/DOWN words)
- Returns generic "unhealthy" (specify WHICH dependency failed)
- Skips remediation guidance (operators need HOW to fix)
- Hides component statuses (show each dependency separately)
- Forgets timestamps (operators need WHEN failure started)
- Returns same response for all failures (isolate dependencies)

DO NOT:
- Return 200 for DOWN state (use 503)
- Return binary healthy/unhealthy (need DEGRADED state)
- Skip naming failing dependencies (be specific)
- Forget to include thresholds (what's concerning)
- Return errors without context (explain impact)
- Hide successful dependencies (show all statuses)

ALWAYS:
- Use clear statuses (UP, DEGRADED, DOWN - not HTTP codes)
- Report each dependency individually (isolate failures)
- Include specific error messages (which dependency, what error)
- Provide troubleshooting hints (HOW to fix)
- Explain impact (WHY failure matters)
- Include thresholds (what values are concerning)
- Report timestamps (when failure/degradation started)
- Show capacity remaining (not just current usage)
- Report dependencies recursively (each component includes its own dependency health)
- Create cascade view showing full dependency chain (trace to root cause)

REPEAT: Health reports MUST be actionable. Include WHAT failed, WHY it matters, HOW to fix it. Use UP/DEGRADED/DOWN. Report each dependency separately.
</instructions>

<examples>
✅ GOOD actionable health report (specific, helpful):

```json
{
  "status": "DEGRADED",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.2.3",
  "uptime": 86400,
  "message": "System degraded: Database responding slowly",

  "components": [
    {
      "name": "PostgreSQL Database",
      "status": "DEGRADED",
      "responseTime": 2500,
      "threshold": {
        "warn": 1000,
        "critical": 5000,
        "unit": "ms"
      },
      "message": "Database response time elevated (2500ms, threshold: 1000ms)",
      "troubleshooting": "Check database load, review slow query log, consider adding indexes",
      "lastSuccess": "2024-01-15T10:29:00.000Z",
      "metadata": {
        "connectionPoolUsage": "45/50",
        "activeConnections": 45,
        "queuedRequests": 12
      },
      "dependencies": [
        {
          "name": "Disk I/O",
          "status": "DEGRADED",
          "responseTime": 450,
          "threshold": {
            "warn": 100,
            "critical": 1000,
            "unit": "ms"
          },
          "message": "Disk I/O latency elevated (450ms, threshold: 100ms)",
          "troubleshooting": "Check disk utilization, review I/O wait time, consider faster storage",
          "metadata": {
            "iowait": 35,
            "queueDepth": 12
          }
        },
        {
          "name": "Database Disk Space",
          "status": "UP",
          "percentUsed": 72,
          "threshold": {
            "warn": 80,
            "critical": 95,
            "unit": "percent"
          },
          "message": "Database disk space healthy (72% used)",
          "metadata": {
            "path": "/var/lib/postgresql",
            "totalBytes": 536870912000,
            "usedBytes": 386547056640,
            "availableBytes": 150323855360
          }
        }
      ]
    },
    {
      "name": "Redis Cache",
      "status": "UP",
      "responseTime": 15,
      "threshold": {
        "warn": 100,
        "critical": 1000,
        "unit": "ms"
      },
      "message": "Cache healthy (15ms)",
      "lastSuccess": "2024-01-15T10:30:00.000Z",
      "metadata": {
        "hitRatio": 0.92,
        "memoryUsed": "512MB/2GB",
        "evictions": 0
      }
    },
    {
      "name": "Stripe API",
      "status": "UP",
      "responseTime": 450,
      "threshold": {
        "warn": 1000,
        "critical": 5000,
        "unit": "ms"
      },
      "message": "Stripe API healthy (450ms)",
      "lastSuccess": "2024-01-15T10:30:00.000Z",
      "metadata": {
        "rateLimit": "95/100",
        "rateLimitRemaining": 5,
        "rateLimitReset": "2024-01-15T10:31:00.000Z"
      }
    },
    {
      "name": "File System",
      "status": "UP",
      "responseTime": 5,
      "threshold": {
        "warn": 80,
        "critical": 95,
        "unit": "percent"
      },
      "message": "File system healthy (65% used)",
      "metadata": {
        "path": "/var/data/payments",
        "totalBytes": 107374182400,
        "usedBytes": 69793218560,
        "availableBytes": 37580963840,
        "percentUsed": 65
      }
    }
  ],

  "applicationHealth": {
    "status": "UP",
    "checks": [
      {
        "name": "Startup Verification",
        "passed": true,
        "message": "All dependencies initialized"
      },
      {
        "name": "Configuration Validation",
        "passed": true,
        "message": "Configuration valid"
      },
      {
        "name": "Environment Validation",
        "passed": true,
        "message": "Environment valid"
      },
      {
        "name": "Business Rules Validation",
        "passed": true,
        "message": "Business rules valid"
      }
    ]
  },

  "operationalMetrics": {
    "memory": {
      "heapUsedPercent": 72,
      "threshold": {
        "warn": 80,
        "critical": 90
      },
      "status": "UP",
      "message": "Memory usage normal (72%, threshold: 80%)"
    },
    "threads": {
      "queuedTasks": 45,
      "threshold": {
        "warn": 100,
        "critical": 500
      },
      "status": "UP",
      "message": "Thread pool healthy (45 queued, threshold: 100)"
    },
    "throughput": {
      "requestRate": 150.5,
      "errorRate": 0.3,
      "errorPercentage": 0.2,
      "threshold": {
        "warn": 1.0,
        "critical": 5.0
      },
      "status": "UP",
      "message": "Error rate normal (0.2%, threshold: 1.0%)",
      "latency": {
        "p50": 45,
        "p95": 120,
        "p99": 250,
        "max": 890
      }
    },
    "business": {
      "paymentQueueDepth": 234,
      "threshold": {
        "warn": 500,
        "critical": 1000
      },
      "status": "UP",
      "message": "Payment queue normal (234 queued, threshold: 500)",
      "processingRate": 180.5,
      "successRate": 99.8
    }
  },

  "alerts": [
    {
      "severity": "WARNING",
      "metric": "PostgreSQL Database response time",
      "value": 2500,
      "threshold": 1000,
      "message": "Database response time elevated: 2500ms (threshold: 1000ms)",
      "impact": "Payment processing may be slower than expected",
      "remediation": "Check database load, review slow query log, consider adding indexes or scaling database",
      "firstSeen": "2024-01-15T10:25:00.000Z",
      "occurrences": 5
    }
  ],

  "capacityRemaining": {
    "database": "10% connection pool capacity remaining (45/50 connections)",
    "cache": "75% memory capacity remaining (512MB/2GB used)",
    "stripeAPI": "5% rate limit capacity remaining (95/100 req/sec)",
    "disk": "35% disk capacity remaining (65% used)"
  }
}
```

**Why this is GOOD:**
- Clear status (DEGRADED) with reason
- Each component has individual status
- Specific error messages with context
- Troubleshooting hints provided
- Thresholds included (know what's concerning)
- Timestamps for tracking (lastSuccess, firstSeen)
- Capacity remaining reported
- Metadata provides context
- Alerts section highlights issues
- **Dependency chaining shows cascade (Database → Disk I/O → root cause)**
- Actionable (operator knows database is slow and how to investigate)

---

❌ BAD health report (not actionable):

```json
{
  "status": "unhealthy",
  "code": 500
}
```

**Why this is BAD:**
- Generic "unhealthy" (what's unhealthy?)
- No component breakdown (which dependency failed?)
- No error messages (what happened?)
- No troubleshooting hints (how to fix?)
- No thresholds (is this bad?)
- No timestamps (when did it fail?)
- Not actionable (operator can't do anything with this)

---

✅ GOOD error message (actionable):

```json
{
  "name": "PostgreSQL Database",
  "status": "DOWN",
  "message": "Database connection failed: connection refused on localhost:5432",
  "impact": "Unable to process payments - all payment requests will fail",
  "troubleshooting": [
    "1. Check if PostgreSQL is running: systemctl status postgresql",
    "2. Verify connection string in DATABASE_URL environment variable",
    "3. Check network connectivity to database host",
    "4. Review PostgreSQL logs: /var/log/postgresql/postgresql-*.log"
  ],
  "remediation": "Start PostgreSQL service or update DATABASE_URL to correct host",
  "error": "Error: connect ECONNREFUSED 127.0.0.1:5432",
  "lastSuccess": "2024-01-15T10:15:00.000Z",
  "timeSinceLastSuccess": 900000
}
```

**Why this is GOOD:**
- Specific error (connection refused, which port)
- Explains impact (payments will fail)
- Step-by-step troubleshooting
- Clear remediation
- Includes error details
- Shows last success time

---

❌ BAD error message (not actionable):

```json
{
  "error": "Database error"
}
```

**Why this is BAD:**
- Vague ("Database error" - what error?)
- No troubleshooting steps
- No impact explanation
- No remediation guidance
- No context (which database? what operation?)

---

✅ GOOD dependency cascade (traces to root cause):

```json
{
  "name": "PaymentProcessor",
  "status": "DOWN",
  "message": "Unable to process payments: database unavailable",
  "impact": "All payment operations failing",
  "dependencies": [
    {
      "name": "PostgreSQL Database",
      "status": "DOWN",
      "message": "Connection failed: server closed connection",
      "error": "Error: server closed the connection unexpectedly",
      "troubleshooting": "Database may have crashed or run out of resources",
      "dependencies": [
        {
          "name": "Database Disk Space",
          "status": "DOWN",
          "percentUsed": 98,
          "threshold": {
            "warn": 80,
            "critical": 95,
            "unit": "percent"
          },
          "message": "Disk full (98% used, threshold: 95%)",
          "impact": "Database cannot write transaction logs or data files",
          "troubleshooting": [
            "1. Check disk usage: df -h /var/lib/postgresql",
            "2. Clean up old WAL files: pg_archivecleanup",
            "3. Increase disk space or move data to larger volume",
            "4. Review table bloat: SELECT * FROM pg_stat_user_tables"
          ],
          "remediation": "Free up disk space immediately to allow database to resume operations",
          "metadata": {
            "path": "/var/lib/postgresql",
            "totalBytes": 107374182400,
            "usedBytes": 105226418176,
            "availableBytes": 2147764224,
            "percentUsed": 98
          }
        }
      ]
    },
    {
      "name": "Redis Cache",
      "status": "UP",
      "message": "Cache operational (fallback mode active)",
      "dependencies": []
    }
  ]
}
```

**Why this is GOOD for incident response:**
- **Root cause immediately visible**: Operator sees disk space is the problem
- **Cascade view shows impact**: Disk full → Database down → Payment processor down
- **Trace path clear**: PaymentProcessor depends on Database, Database depends on Disk
- **Specific remediation at root**: Free disk space to fix entire cascade
- **Isolates unaffected dependencies**: Redis still UP, not involved in cascade
- **Actionable at every level**: Each component has troubleshooting steps
- **Impact explained**: Operator understands why disk affects payments

This cascade view enables operators to:
1. Skip investigating Database connection (it's fine, disk is the problem)
2. Skip investigating PaymentProcessor code (it's fine, database is the problem)
3. **Go directly to root cause**: Free up disk space on database server
4. Understand blast radius: Only database-dependent operations affected
</examples>
