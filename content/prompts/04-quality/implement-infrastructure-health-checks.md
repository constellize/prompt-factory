---
# === Identity ===
id: implement-infrastructure-health-checks
name: Implement infrastructure health checks for databases, caches, APIs, and filesystems
version: v1

# === Classification ===
chapter: 4
category: quality
subcategory: gate-2
tags:
  - quality
  - health-checks
  - infrastructure
  - monitoring
  - gate-2

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Implement infrastructure health checks for databases, caches, APIs, and filesystems.
    After component implementation, add infrastructure health checks (Gate 2: Health Check Completeness).
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
    description: The specific component to add infrastructure health checks for
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
      **Implement infrastructure health checks** that verify your system's foundational dependencies are functioning correctly. Database connectivity should be tested with response time measurements to detect degradation before it becomes failure. Cache connectivity for systems like Redis needs performance metrics that reveal latency issues. External API reachability requires timeout detection to distinguish between slow responses and complete outages. File system access and disk space monitoring catch storage issues before they cause cascade failures.
    preview: |
      "...verify your system's foundational dependencies are functioning correctly. A system that can't report its own health is a system waiting to fail silently..."
  website:
    include: true
    path: /prompts/implement-infrastructure-health-checks
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Implement infrastructure health checks for {{component_name}} in {{system_name}} that verify your system's foundational dependencies are functioning correctly.

A system that can't report its own health is a system waiting to fail silently. Comprehensive health checks provide visibility into system state and enable proactive problem resolution.

Follow this process:

1. **Review constellation dependencies:**
   - Read constellation map at `construction/requirements/constellation-map.md` for infrastructure stars
   - Read code generation plan from `construction/design/code-generation-plan-*.md` for dependencies
   - Extract ALL infrastructure dependencies (databases, caches, APIs, filesystems)

2. **Implement database health checks:**
   - Test connectivity with actual queries (not just connection pool)
   - Measure response times to detect degradation
   - Verify read AND write capabilities
   - Report connection pool status

3. **Implement cache health checks:**
   - Test connectivity with actual operations (SET/GET)
   - Measure latency to reveal performance issues
   - Verify cache hit rates are reasonable
   - Report connection pool status

4. **Implement external API health checks:**
   - Test reachability with lightweight requests
   - Implement timeout detection (<5s for health checks)
   - Distinguish between slow responses and complete outages
   - Report last successful call timestamp

5. **Implement file system health checks:**
   - Verify read/write access to required directories
   - Check disk space availability (warn at 80%, fail at 95%)
   - Test file creation and deletion
   - Report mount status for network filesystems
</task>

<context>
Component to add health checks:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from:
- `construction/requirements/constellation-map.md` (infrastructure stars)
- `construction/design/code-generation-plan-*.md` (dependencies)

And adds health check code to the component implementation.
</context>

<thinking>
Before implementing health checks, analyze:
1. What infrastructure dependencies does this component have?
2. What failure modes from constellation map need detection?
3. What response times are acceptable for each dependency?
4. What would indicate degraded (not failed) state?
5. How can checks avoid impacting production traffic?
</thinking>

<output-format>
Add health check endpoints/functions to component implementation:

```[language]
// INFRASTRUCTURE HEALTH CHECKS: {{component_name}}
// Purpose: Verify foundational dependencies are functioning
// Constellation map: construction/requirements/constellation-map.md
//
// Dependencies Monitored:
// - [Infrastructure Star 1]: [What we check]
// - [Infrastructure Star 2]: [What we check]
//
// Health Check Criteria:
// - UP: All infrastructure healthy, response times < threshold
// - DEGRADED: Infrastructure reachable but slow (> threshold)
// - DOWN: Infrastructure unreachable or error rate > 50%

class HealthCheckService {
  // CRITICAL: Health checks MUST NOT impact production traffic
  // Use lightweight queries, short timeouts, cached results

  async checkInfrastructureHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCache(),
      this.checkExternalAPIs(),
      this.checkFileSystem(),
    ]);

    return this.aggregateResults(checks);
  }
}
```

Structure health checks with:
- Lightweight queries (SELECT 1 for databases, not full table scans)
- Short timeouts (5s max for health checks)
- Cached results (cache health status for 30s-60s)
- Independent checks (one failure doesn't block other checks)

## Gate 2: Health Check Completeness Status

### Requirements
- [ ] Every external dependency the change introduced has a health check
- [ ] Each check has a bounded timeout and cannot hang its caller
- [ ] Each check distinguishes healthy from degraded from unavailable
- [ ] Checks are read-only and safe to call repeatedly
- [ ] Any dependency deliberately left without a check is listed with the reason

**Gate Status:** ✅ PASS / ❌ FAIL

**Blockers:** [List any failing requirements]
</output-format>

<instructions>
CRITICAL: Health checks MUST be lightweight and MUST NOT impact production traffic. Use short timeouts and cache results.

NEVER implement health checks that:
- Run expensive queries (no table scans, aggregations, or joins)
- Block on slow dependencies (timeout MUST be < 5s)
- Impact production traffic (use separate read-only connections)
- Return only UP/DOWN (need DEGRADED state for slow responses)
- Check only connection pools (must verify actual operations)
- Skip timeout detection (distinguish slow from down)

DO NOT:
- Use production connection pools for health checks
- Run health checks synchronously on request path
- Skip measuring response times (degradation MUST be detected)
- Return generic errors (must specify which dependency failed)
- Check all dependencies every request (cache results for 30-60s)
- Forget to close connections after health checks

ALWAYS:
- Use lightweight queries (SELECT 1, PING, simple GET)
- Implement short timeouts (5s MAXIMUM for health checks)
- Cache health status for 30-60s (don't check every request)
- Test actual operations (not just connection pool status)
- Measure response times (detect degradation before failure)
- Return specific errors (which dependency, what failed)
- Use separate connections (don't impact production pool)
- Report DEGRADED state (not just UP/DOWN binary)
- FAIL the gate if any requirement above is unmet
- NEVER report PASS with an unmet requirement — "close enough" is a FAIL
- ALWAYS report the verdict, even when this skill was run outside a feature verification

REPEAT: Health checks MUST be lightweight. Use short timeouts (5s max). Cache results (30-60s). Test actual operations, not just connections. Report DEGRADED for slow responses.
</instructions>

<examples>
✅ GOOD infrastructure health check (lightweight, specific):

```typescript
// INFRASTRUCTURE HEALTH CHECKS: PaymentProcessor
// Purpose: Verify foundational dependencies functioning
// Constellation map: construction/requirements/constellation-map.md
//
// Dependencies Monitored:
// - PostgreSQL Database: Connectivity, response time, read/write
// - Redis Cache: Connectivity, latency, operations
// - Stripe API: Reachability, timeout detection
// - File System: /var/data/payments - read/write access, disk space
//
// Health Check Criteria:
// - UP: All dependencies healthy, response times < 1s
// - DEGRADED: Dependencies reachable but slow (1s-5s response)
// - DOWN: Dependencies unreachable, error, or timeout > 5s

class InfrastructureHealthCheck {
  private readonly HEALTH_CACHE_TTL = 60000; // 60 seconds
  private cachedHealth: CachedHealthResult | null = null;

  async checkHealth(): Promise<HealthCheckResult> {
    // CRITICAL: Cache results to avoid health check stampede
    if (this.cachedHealth && Date.now() - this.cachedHealth.timestamp < this.HEALTH_CACHE_TTL) {
      return this.cachedHealth.result;
    }

    // Run checks in parallel with timeout
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCache(),
      this.checkStripeAPI(),
      this.checkFileSystem(),
    ]);

    const result = this.aggregateResults(checks);

    // Cache result
    this.cachedHealth = { result, timestamp: Date.now() };

    return result;
  }

  private async checkDatabase(): Promise<ComponentHealth> {
    const startTime = Date.now();

    try {
      // CRITICAL: Use separate health check connection (not production pool)
      const healthConn = await this.getHealthCheckConnection('postgresql');

      // Lightweight query - just verify connectivity
      // NEVER run expensive queries in health checks
      const result = await healthConn.query('SELECT 1 AS health', [], { timeout: 5000 });

      const responseTime = Date.now() - startTime;

      // Test write capability too (some failures only affect writes)
      await healthConn.query(
        'CREATE TEMP TABLE IF NOT EXISTS health_check (id int); DROP TABLE health_check',
        [],
        { timeout: 5000 }
      );

      await healthConn.release();

      // Report status based on response time
      if (responseTime < 1000) {
        return {
          name: 'PostgreSQL Database',
          status: 'UP',
          responseTime,
          message: `Database healthy (${responseTime}ms)`,
        };
      } else if (responseTime < 5000) {
        return {
          name: 'PostgreSQL Database',
          status: 'DEGRADED',
          responseTime,
          message: `Database slow (${responseTime}ms) - may need investigation`,
        };
      } else {
        return {
          name: 'PostgreSQL Database',
          status: 'DOWN',
          responseTime,
          message: `Database timeout (${responseTime}ms)`,
        };
      }
    } catch (error) {
      return {
        name: 'PostgreSQL Database',
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        message: `Database error: ${error.message}`,
        error: error.stack,
      };
    }
  }

  private async checkCache(): Promise<ComponentHealth> {
    const startTime = Date.now();

    try {
      // Test actual cache operation (not just connection)
      const testKey = `health:check:${Date.now()}`;
      const testValue = 'ok';

      // Test SET operation
      await this.redis.set(testKey, testValue, 'EX', 60, { timeout: 5000 });

      // Test GET operation
      const retrieved = await this.redis.get(testKey, { timeout: 5000 });

      if (retrieved !== testValue) {
        throw new Error('Cache returned incorrect value');
      }

      // Clean up
      await this.redis.del(testKey);

      const responseTime = Date.now() - startTime;

      // Check connection pool status
      const poolStatus = this.redis.status; // 'ready', 'connect', 'reconnecting', 'end'

      if (responseTime < 100 && poolStatus === 'ready') {
        return {
          name: 'Redis Cache',
          status: 'UP',
          responseTime,
          message: `Cache healthy (${responseTime}ms)`,
          metadata: { poolStatus },
        };
      } else if (responseTime < 1000) {
        return {
          name: 'Redis Cache',
          status: 'DEGRADED',
          responseTime,
          message: `Cache slow (${responseTime}ms)`,
          metadata: { poolStatus },
        };
      } else {
        return {
          name: 'Redis Cache',
          status: 'DOWN',
          responseTime,
          message: `Cache timeout (${responseTime}ms)`,
        };
      }
    } catch (error) {
      return {
        name: 'Redis Cache',
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        message: `Cache error: ${error.message}`,
        error: error.stack,
      };
    }
  }

  private async checkStripeAPI(): Promise<ComponentHealth> {
    const startTime = Date.now();

    try {
      // Lightweight API health check (not a real charge)
      // Use Stripe's balance endpoint (read-only, lightweight)
      const balance = await this.stripe.balance.retrieve({ timeout: 5000 });

      const responseTime = Date.now() - startTime;

      // Track last successful call
      this.lastStripeSuccess = Date.now();

      if (responseTime < 1000) {
        return {
          name: 'Stripe API',
          status: 'UP',
          responseTime,
          message: `Stripe API healthy (${responseTime}ms)`,
          metadata: {
            lastSuccess: this.lastStripeSuccess,
            availableBalance: balance.available[0]?.amount,
          },
        };
      } else if (responseTime < 5000) {
        return {
          name: 'Stripe API',
          status: 'DEGRADED',
          responseTime,
          message: `Stripe API slow (${responseTime}ms)`,
        };
      } else {
        return {
          name: 'Stripe API',
          status: 'DOWN',
          responseTime,
          message: `Stripe API timeout (${responseTime}ms)`,
        };
      }
    } catch (error) {
      const timeSinceLastSuccess = Date.now() - this.lastStripeSuccess;

      return {
        name: 'Stripe API',
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        message: `Stripe API error: ${error.message}`,
        metadata: {
          lastSuccess: this.lastStripeSuccess,
          timeSinceLastSuccess,
        },
        error: error.stack,
      };
    }
  }

  private async checkFileSystem(): Promise<ComponentHealth> {
    const startTime = Date.now();
    const paymentDataDir = '/var/data/payments';

    try {
      // Check directory exists and is accessible
      const stats = await fs.promises.stat(paymentDataDir);

      if (!stats.isDirectory()) {
        throw new Error('Payment data path is not a directory');
      }

      // Test write capability
      const testFile = path.join(paymentDataDir, `.health-check-${Date.now()}`);
      await fs.promises.writeFile(testFile, 'health check', { timeout: 5000 });

      // Test read capability
      const content = await fs.promises.readFile(testFile, 'utf8');
      if (content !== 'health check') {
        throw new Error('File read verification failed');
      }

      // Clean up
      await fs.promises.unlink(testFile);

      // Check disk space
      const diskUsage = await this.checkDiskSpace(paymentDataDir);

      const responseTime = Date.now() - startTime;

      // Warn at 80%, fail at 95%
      if (diskUsage.percentUsed >= 95) {
        return {
          name: 'File System',
          status: 'DOWN',
          responseTime,
          message: `Disk space critical: ${diskUsage.percentUsed}% used`,
          metadata: diskUsage,
        };
      } else if (diskUsage.percentUsed >= 80) {
        return {
          name: 'File System',
          status: 'DEGRADED',
          responseTime,
          message: `Disk space low: ${diskUsage.percentUsed}% used`,
          metadata: diskUsage,
        };
      } else {
        return {
          name: 'File System',
          status: 'UP',
          responseTime,
          message: `File system healthy (${diskUsage.percentUsed}% used)`,
          metadata: diskUsage,
        };
      }
    } catch (error) {
      return {
        name: 'File System',
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        message: `File system error: ${error.message}`,
        error: error.stack,
      };
    }
  }

  private aggregateResults(checks: PromiseSettledResult<ComponentHealth>[]): HealthCheckResult {
    const components: ComponentHealth[] = [];
    let overallStatus: HealthStatus = 'UP';

    for (const check of checks) {
      if (check.status === 'fulfilled') {
        components.push(check.value);

        // Aggregate status (DOWN > DEGRADED > UP)
        if (check.value.status === 'DOWN') {
          overallStatus = 'DOWN';
        } else if (check.value.status === 'DEGRADED' && overallStatus !== 'DOWN') {
          overallStatus = 'DEGRADED';
        }
      } else {
        // Health check itself failed (shouldn't happen)
        components.push({
          name: 'Unknown',
          status: 'DOWN',
          message: `Health check failed: ${check.reason}`,
        });
        overallStatus = 'DOWN';
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      components,
    };
  }
}
```

**Why this is GOOD:**
- Uses lightweight queries (SELECT 1, simple Redis ops)
- Implements short timeouts (5s max)
- Caches results (60s TTL) to avoid health check stampede
- Tests actual operations (not just connection pools)
- Measures response times (detects degradation)
- Returns DEGRADED state (not just UP/DOWN)
- Uses separate health check connections
- Specific error messages (which dependency, what failed)
- Runs checks in parallel with Promise.allSettled

---

❌ BAD infrastructure health check (expensive, impacts production):

```typescript
class HealthCheck {
  async check() {
    // Query entire users table (EXPENSIVE!)
    const users = await db.query('SELECT * FROM users');

    // No timeout (could hang forever)
    const cache = await redis.get('key');

    // Check on every request (no caching)
    if (users && cache) {
      return { status: 'ok' };
    }
    return { status: 'error' };
  }
}
```

**Why this is BAD:**
- Expensive query (SELECT * FROM users scans entire table)
- No timeout (could hang indefinitely)
- No caching (runs on every request)
- Uses production connections (impacts traffic)
- No response time measurement (can't detect degradation)
- Binary status (no DEGRADED state)
- No specific errors (which dependency failed?)
- No separation of concerns (checks all in one function)
- Synchronous (blocks on each check)

---

✅ GOOD disk space check:

```typescript
private async checkDiskSpace(path: string): Promise<DiskUsage> {
  const { stdout } = await execPromise(`df -k ${path}`);

  // Parse df output:
  // Filesystem 1K-blocks Used Available Use% Mounted on
  // /dev/sda1  100000000 80000000 20000000 80% /var/data

  const lines = stdout.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Unable to parse df output');
  }

  const parts = lines[1].split(/\s+/);
  const totalKB = parseInt(parts[1]);
  const usedKB = parseInt(parts[2]);
  const availableKB = parseInt(parts[3]);
  const percentUsed = parseInt(parts[4].replace('%', ''));

  return {
    path,
    totalBytes: totalKB * 1024,
    usedBytes: usedKB * 1024,
    availableBytes: availableKB * 1024,
    percentUsed,
  };
}
```

**Why this is GOOD:**
- Actually checks disk space (not just file access)
- Returns specific metrics (bytes used, available, percent)
- Can detect degraded state (80% full = warning)
- Platform-specific but practical
</examples>
