---
# === Identity ===
id: implement-operational-monitoring
name: Enable operational health monitoring for memory, threads, throughput, and business metrics
version: v1

# === Classification ===
chapter: 4
category: quality
subcategory: gate-2
tags:
  - quality
  - monitoring
  - operations
  - metrics
  - gate-2

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Enable operational health monitoring for memory, threads, throughput, and business metrics.
    After component implementation, add operational monitoring (Gate 2: Health Check Completeness).
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
    description: The specific component to add operational monitoring for
    example: "PaymentProcessor"
    maps-to: "$0"
  - name: system_name
    description: The name of your system
    example: "Payment Processing System"
    maps-to: "$1"

# === Output Targets ===
outputs:
  book:
    include: true
    format: callout
  website:
    include: true
    path: /prompts/implement-operational-monitoring
  marketplace:
    plugin: constellize-quality

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Enable operational health monitoring for {{component_name}} in {{system_name}} that tracks runtime behavior over time.

Operational monitoring goes beyond startup validation—it tracks how your system behaves DURING operation. Memory leaks, thread pool exhaustion, throughput degradation, and custom business metrics reveal problems before they cause outages.

Follow this process:

1. **Review runtime requirements:**
   - Read code generation plan from `construction/design/code-generation-plan-*.md` for performance requirements
   - Read gap analysis from `construction/requirements/gap-analysis.md` for throughput expectations
   - Identify resource constraints (memory, threads, connections)

2. **Implement memory monitoring:**
   - Track heap usage and garbage collection metrics
   - Detect memory leaks (growing heap over time)
   - Monitor allocation rates
   - Report OOM risk before it happens

3. **Implement thread pool monitoring:**
   - Track thread pool status (active, idle, queued)
   - Monitor queue lengths (warn when queues growing)
   - Detect thread starvation
   - Report capacity remaining

4. **Implement throughput monitoring:**
   - Track request rates (requests/second)
   - Monitor error rates (errors/second, percentage)
   - Measure latencies (p50, p95, p99)
   - Report degradation vs baselines

5. **Implement custom business metrics:**
   - Queue depths for async processing
   - Processing rates for workflows
   - Cache hit ratios
   - Domain-specific health indicators
</task>

<context>
Component to add monitoring:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from:
- `construction/design/code-generation-plan-*.md` (performance requirements)
- `construction/requirements/gap-analysis.md` (throughput expectations)

And adds monitoring code to component implementation.
</context>

<thinking>
Before implementing monitoring, analyze:
1. What resources does this component consume (memory, threads, connections)?
2. What throughput is expected (requests/second, items/second)?
3. What would indicate degradation (slow responses, growing queues)?
4. What business metrics indicate health (queue depths, processing rates)?
5. What baselines should be compared against (p95 latency, error rate)?
</thinking>

<output-format>
Add operational monitoring to component:

```[language]
// OPERATIONAL MONITORING: {{component_name}}
// Purpose: Track runtime behavior over time
//
// Metrics Tracked:
// - Memory: Heap usage, GC frequency, allocation rate
// - Threads: Pool status, queue lengths, capacity
// - Throughput: Request rate, error rate, latencies
// - Business: [Custom metrics for this component]
//
// Alerting Thresholds:
// - Memory: Warn at 80% heap, alert at 90%
// - Threads: Warn when queue > 100, alert when > 500
// - Errors: Warn at 1% error rate, alert at 5%

class OperationalMonitor {
  // CRITICAL: Monitoring MUST NOT impact production performance
  // Use sampling, async reporting, low-overhead collection

  collectMetrics(): OperationalMetrics {
    return {
      memory: this.collectMemoryMetrics(),
      threads: this.collectThreadMetrics(),
      throughput: this.collectThroughputMetrics(),
      business: this.collectBusinessMetrics(),
      timestamp: Date.now(),
    };
  }
}
```
</output-format>

<instructions>
CRITICAL: Monitoring MUST have low overhead. Use sampling, async reporting, avoid blocking production requests.

NEVER implement monitoring that:
- Blocks production requests (monitoring MUST be async)
- Consumes significant resources (keep overhead < 1%)
- Requires expensive operations (no full GC, heap dumps on request)
- Collects every event (use sampling for high-volume metrics)
- Logs synchronously on hot path (async logging only)
- Forgets thresholds (must define what's concerning)

DO NOT:
- Collect metrics synchronously in request path
- Run full garbage collection for metrics
- Sample 100% of requests (sample at 1-10%)
- Skip defining alert thresholds (operators need baselines)
- Forget to include timestamps (metrics need time context)
- Monitor everything (focus on actionable metrics)

ALWAYS:
- Collect metrics asynchronously (don't block requests)
- Use sampling for high-volume metrics (1-10% sample rate)
- Define thresholds (warn and alert levels)
- Include timestamps (metrics need time series)
- Measure percentiles (p50, p95, p99) not just averages
- Track error rates as percentages (not just counts)
- Report capacity remaining (not just current usage)
- Export metrics to monitoring system (Prometheus, CloudWatch, etc.)

REPEAT: Monitoring MUST have low overhead (<1%). Use async collection, sampling. Define thresholds for warnings and alerts. Track percentiles, not averages.
</instructions>

<examples>
✅ GOOD operational monitoring (low overhead, actionable):

```typescript
// OPERATIONAL MONITORING: PaymentProcessor
// Purpose: Track runtime behavior over time
//
// Metrics Tracked:
// - Memory: Heap usage (80% warn, 90% alert), GC frequency
// - Threads: Worker pool status, queue length (100 warn, 500 alert)
// - Throughput: Request rate, error rate (1% warn, 5% alert), p95 latency
// - Business: Payment queue depth, processing rate, Stripe API latency
//
// Collection: Every 60 seconds, async, <1% overhead

class PaymentProcessorMonitor {
  private metrics: MetricsCollector;
  private readonly COLLECTION_INTERVAL = 60000; // 60 seconds

  startMonitoring() {
    // CRITICAL: Async collection, doesn't block requests
    setInterval(() => {
      this.collectAndReport();
    }, this.COLLECTION_INTERVAL);
  }

  private async collectAndReport() {
    try {
      const metrics = {
        memory: this.collectMemoryMetrics(),
        threads: this.collectThreadMetrics(),
        throughput: this.collectThroughputMetrics(),
        business: this.collectBusinessMetrics(),
        timestamp: Date.now(),
      };

      // Evaluate thresholds and generate alerts
      const alerts = this.evaluateThresholds(metrics);

      // Report to monitoring system (async, non-blocking)
      await this.metrics.report(metrics, alerts);

    } catch (error) {
      // Monitoring failures MUST NOT crash production
      console.error('Monitoring collection failed:', error);
    }
  }

  private collectMemoryMetrics(): MemoryMetrics {
    const usage = process.memoryUsage();

    // Heap usage percentage
    const heapUsedPercent = (usage.heapUsed / usage.heapTotal) * 100;

    // RSS (Resident Set Size) - total memory
    const rssBytes = usage.rss;

    return {
      heapUsedBytes: usage.heapUsed,
      heapTotalBytes: usage.heapTotal,
      heapUsedPercent,
      rssBytes,
      externalBytes: usage.external,

      // GC metrics (if available via monitoring library)
      gcFrequency: this.getGCFrequency(),
      gcPauseTime: this.getGCPauseTime(),
    };
  }

  private collectThreadMetrics(): ThreadMetrics {
    // Worker pool status (if using worker threads)
    const workerPool = this.paymentProcessor.getWorkerPool();

    return {
      workerPoolSize: workerPool.size,
      activeWorkers: workerPool.activeCount,
      idleWorkers: workerPool.idleCount,
      queuedTasks: workerPool.queueLength,
      completedTasks: workerPool.completedTaskCount,

      // Event loop lag (Node.js specific)
      eventLoopLag: this.measureEventLoopLag(),
    };
  }

  private collectThroughputMetrics(): ThroughputMetrics {
    const window = this.metrics.getWindow(60000); // Last 60 seconds

    // Calculate rates
    const requestRate = window.requestCount / 60;
    const errorRate = window.errorCount / 60;
    const errorPercentage = window.requestCount > 0
      ? (window.errorCount / window.requestCount) * 100
      : 0;

    // Calculate latency percentiles
    const latencies = window.latencies.sort((a, b) => a - b);
    const p50 = this.percentile(latencies, 0.50);
    const p95 = this.percentile(latencies, 0.95);
    const p99 = this.percentile(latencies, 0.99);
    const max = latencies[latencies.length - 1] || 0;

    return {
      requestRate,       // requests/second
      errorRate,         // errors/second
      errorPercentage,   // percentage
      latencyP50: p50,   // milliseconds
      latencyP95: p95,
      latencyP99: p99,
      latencyMax: max,
      totalRequests: window.requestCount,
      totalErrors: window.errorCount,
    };
  }

  private collectBusinessMetrics(): BusinessMetrics {
    // CRITICAL: Custom metrics specific to payment processing

    return {
      // Payment queue metrics
      paymentQueueDepth: this.paymentProcessor.getQueueDepth(),
      oldestQueuedPaymentAge: this.paymentProcessor.getOldestQueuedAge(),

      // Processing rate
      paymentsProcessedPerMinute: this.getPaymentsProcessedCount(60000) / 60,
      successfulPaymentsPercent: this.getSuccessRate(60000),

      // Stripe API metrics
      stripeAPILatencyP95: this.getStripeAPILatencyP95(60000),
      stripeAPIErrorRate: this.getStripeAPIErrorRate(60000),

      // Cache metrics
      cacheHitRatio: this.cache.getHitRatio(),
      cacheSize: this.cache.size(),
    };
  }

  private evaluateThresholds(metrics: OperationalMetrics): Alert[] {
    const alerts: Alert[] = [];

    // Memory thresholds
    if (metrics.memory.heapUsedPercent >= 90) {
      alerts.push({
        severity: 'CRITICAL',
        metric: 'memory.heapUsedPercent',
        value: metrics.memory.heapUsedPercent,
        threshold: 90,
        message: `Heap usage critical: ${metrics.memory.heapUsedPercent.toFixed(1)}% (threshold: 90%)`,
        remediation: 'Consider increasing heap size or investigating memory leaks',
      });
    } else if (metrics.memory.heapUsedPercent >= 80) {
      alerts.push({
        severity: 'WARNING',
        metric: 'memory.heapUsedPercent',
        value: metrics.memory.heapUsedPercent,
        threshold: 80,
        message: `Heap usage high: ${metrics.memory.heapUsedPercent.toFixed(1)}% (threshold: 80%)`,
      });
    }

    // Thread pool thresholds
    if (metrics.threads.queuedTasks >= 500) {
      alerts.push({
        severity: 'CRITICAL',
        metric: 'threads.queuedTasks',
        value: metrics.threads.queuedTasks,
        threshold: 500,
        message: `Worker queue critical: ${metrics.threads.queuedTasks} tasks queued (threshold: 500)`,
        remediation: 'Increase worker pool size or investigate slow tasks',
      });
    } else if (metrics.threads.queuedTasks >= 100) {
      alerts.push({
        severity: 'WARNING',
        metric: 'threads.queuedTasks',
        value: metrics.threads.queuedTasks,
        threshold: 100,
        message: `Worker queue growing: ${metrics.threads.queuedTasks} tasks queued (threshold: 100)`,
      });
    }

    // Error rate thresholds
    if (metrics.throughput.errorPercentage >= 5) {
      alerts.push({
        severity: 'CRITICAL',
        metric: 'throughput.errorPercentage',
        value: metrics.throughput.errorPercentage,
        threshold: 5,
        message: `Error rate critical: ${metrics.throughput.errorPercentage.toFixed(2)}% (threshold: 5%)`,
        remediation: 'Check logs for error patterns, verify downstream dependencies',
      });
    } else if (metrics.throughput.errorPercentage >= 1) {
      alerts.push({
        severity: 'WARNING',
        metric: 'throughput.errorPercentage',
        value: metrics.throughput.errorPercentage,
        threshold: 1,
        message: `Error rate elevated: ${metrics.throughput.errorPercentage.toFixed(2)}% (threshold: 1%)`,
      });
    }

    // Business metric thresholds
    if (metrics.business.paymentQueueDepth >= 1000) {
      alerts.push({
        severity: 'CRITICAL',
        metric: 'business.paymentQueueDepth',
        value: metrics.business.paymentQueueDepth,
        threshold: 1000,
        message: `Payment queue critical: ${metrics.business.paymentQueueDepth} payments queued`,
        remediation: 'Investigate processing bottleneck, consider scaling workers',
      });
    }

    return alerts;
  }

  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }
}
```

**Why this is GOOD:**
- Async collection (doesn't block requests)
- Collects every 60s (not every request)
- Defines specific thresholds (80% warn, 90% alert)
- Tracks percentiles (p50, p95, p99) not just averages
- Includes business metrics (queue depth, processing rate)
- Evaluates thresholds and generates alerts
- Provides remediation guidance
- Monitoring failures don't crash production

---

❌ BAD operational monitoring (high overhead, not actionable):

```typescript
class Monitor {
  monitor(req, res, next) {
    // Blocking on request path!
    const start = Date.now();

    // Full GC (expensive!)
    global.gc();

    const memory = process.memoryUsage();
    console.log('Memory:', memory); // Sync logging!

    next();

    const duration = Date.now() - start;
    console.log('Request time:', duration);
  }
}
```

**Why this is BAD:**
- Runs on every request (high overhead)
- Blocks request path (synchronous)
- Triggers full GC (very expensive)
- Synchronous logging (blocks)
- No thresholds (not actionable)
- No percentiles (just individual measurements)
- No business metrics
- No alerts
- Monitoring impacts production performance
</examples>
