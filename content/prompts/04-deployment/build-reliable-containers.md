---
# === Identity ===
id: build-reliable-containers
name: Build container reliability with clean builds, predictable starts, and graceful shutdowns
version: v1

# === Classification ===
chapter: 4
category: deployment
subcategory: gate-3
tags:
  - quality
  - containers
  - docker
  - deployment
  - gate-3

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Build container reliability with clean builds, predictable starts, and graceful shutdowns.
    Creating Docker containers that deploy reliably (Gate 3: Deployment Readiness).
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
    description: The specific component to containerize
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
      **Build container reliability** that ensures Docker images build cleanly and containers start predictably. Images should build without errors or warnings that might hide problems. Containers need to start successfully with minimal resource requirements, avoiding resource exhaustion. Health checks must pass within acceptable timeframes so orchestrators know when services are ready. Graceful shutdown handling enables clean restarts without dropped connections or data loss.
    preview: |
      "...create clean Dockerfile using official base images and multi-stage builds. Implement graceful shutdown handling SIGTERM signals..."
  website:
    include: true
    path: /prompts/build-reliable-containers
  marketplace:
    plugin: constellize-deployment

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Build container reliability for {{component_name}} in {{system_name}} that ensures Docker images build cleanly and containers start predictably.

Images should build without errors or warnings that might hide problems. Containers need to start successfully with minimal resource requirements, avoiding resource exhaustion. Health checks must pass within acceptable timeframes so orchestrators know when services are ready. Graceful shutdown handling enables clean restarts without dropped connections or data loss.

Follow this process:

1. **Create clean Dockerfile:**
   - Use official base images (not latest tags)
   - Multi-stage builds to minimize image size
   - Run as non-root user for security
   - Clear WORKDIR and explicit COPY instructions
   - No secrets in image layers

2. **Implement minimal resource requirements:**
   - Define CPU and memory limits (not just requests)
   - Test startup with minimum resources (512MB RAM, 0.5 CPU)
   - Optimize dependencies (remove dev dependencies)
   - Verify startup time under 30 seconds

3. **Add container health checks:**
   - HEALTHCHECK instruction in Dockerfile
   - HTTP endpoint that returns 200 when ready
   - Initial delay allows for startup (10-30s)
   - Timeout under 5 seconds
   - 3 consecutive failures trigger restart

4. **Implement graceful shutdown:**
   - Handle SIGTERM signal for shutdown notification
   - Close connections cleanly (drain in-flight requests)
   - Shutdown timeout under 30 seconds
   - Save state if needed before exit
   - Return exit code 0 on clean shutdown
</task>

<context>
Component to containerize:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates:
- `Dockerfile` (or updates existing)
- `.dockerignore` file
- Container health check endpoint in component code
- Shutdown handler in component code
</context>

<thinking>
Before containerizing, analyze:
1. What are minimum resource requirements for this component?
2. What dependencies are needed at runtime vs build time?
3. How long does startup take (database connections, cache warming)?
4. What constitutes "ready" for this component?
5. What cleanup is needed during shutdown (connections, file handles)?
</thinking>

<output-format>
Create Dockerfile for component:

```dockerfile
# CONTAINER RELIABILITY: {{component_name}}
# Purpose: Clean builds, predictable starts, graceful shutdowns
# Build: docker build -t {{component_name}}:v1.0.0 .
# Run: docker run -d --name {{component_name}} {{component_name}}:v1.0.0

# ============================================================
# Stage 1: Build
# ============================================================
FROM node:20-alpine AS builder

# Install build dependencies only
WORKDIR /build
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

COPY src/ ./src/
COPY tsconfig.json ./
RUN npm run build

# ============================================================
# Stage 2: Runtime
# ============================================================
FROM node:20-alpine

# CRITICAL: Run as non-root user
RUN addgroup -g 1001 app && \
    adduser -u 1001 -G app -s /bin/sh -D app

WORKDIR /app

# Copy only production dependencies and built code
COPY --from=builder --chown=app:app /build/node_modules ./node_modules
COPY --from=builder --chown=app:app /build/dist ./dist
COPY --chown=app:app package.json ./

# Switch to non-root user
USER app

# Define resource expectations
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=384"

# Expose port
EXPOSE 3000

# CRITICAL: Health check for orchestrator
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["node", "dist/main.js"]
```

Create .dockerignore:

```
# DOCKER IGNORE: Exclude files from image
node_modules
npm-debug.log
.env
.env.*
*.log
.git
.gitignore
README.md
test/
coverage/
.vscode/
.idea/
*.md
```

Add health check endpoint to component:

```[language]
// CONTAINER HEALTH CHECK: {{component_name}}
// Purpose: Signal to orchestrator when ready for traffic
//
// Returns:
// - 200 OK: All dependencies initialized, ready for traffic
// - 503 Service Unavailable: Still starting up or unhealthy

app.get('/health', async (req, res) => {
  // CRITICAL: Health check must be fast (< 5s timeout)

  try {
    // Check if all required dependencies are initialized
    const isReady = await Promise.race([
      checkAllDependencies(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Health check timeout')), 4000)
      )
    ]);

    if (isReady) {
      res.status(200).json({ status: 'UP', message: 'Ready for traffic' });
    } else {
      res.status(503).json({ status: 'DOWN', message: 'Dependencies not ready' });
    }
  } catch (error) {
    res.status(503).json({ status: 'DOWN', message: error.message });
  }
});

async function checkAllDependencies() {
  // Quick checks - NEVER expensive operations
  const dbConnected = await database.ping(); // Simple SELECT 1
  const cacheConnected = await cache.ping(); // Simple PING
  return dbConnected && cacheConnected;
}
```

Add graceful shutdown handler:

```[language]
// GRACEFUL SHUTDOWN: {{component_name}}
// Purpose: Clean shutdown when container stops
//
// Process:
// 1. Receive SIGTERM from orchestrator
// 2. Stop accepting new requests
// 3. Drain in-flight requests (up to 30s)
// 4. Close connections cleanly
// 5. Exit with code 0

const server = app.listen(3000);

// CRITICAL: Handle SIGTERM for graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received: starting graceful shutdown');

  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed');

    try {
      // Close database connections
      await database.close();
      console.log('Database connections closed');

      // Close cache connections
      await cache.quit();
      console.log('Cache connections closed');

      // Exit cleanly
      console.log('Graceful shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 30s if still running
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
});
```
</output-format>

<instructions>
CRITICAL: Container reliability requires clean builds, minimal resources, health checks, and graceful shutdowns.

NEVER create containers that:
- Use :latest tags (not reproducible)
- Run as root user (security risk)
- Include secrets in image layers (leak credentials)
- Have no health checks (orchestrator can't determine readiness)
- Ignore SIGTERM (forced kills lose data)
- Require more than 1GB RAM to start (resource inefficient)

DO NOT:
- Copy node_modules into image (use multi-stage builds)
- Install dev dependencies in production image
- Use RUN commands without cleaning up in same layer
- Forget .dockerignore (bloated images)
- Skip health check timeout testing
- Allow shutdown to take more than 30s

ALWAYS:
- Use specific base image tags (node:20-alpine, not node:latest)
- Run as non-root user (create app user)
- Use multi-stage builds (builder + runtime stages)
- Define resource limits (memory and CPU)
- Add HEALTHCHECK instruction to Dockerfile
- Return 200 only when truly ready for traffic
- Handle SIGTERM for graceful shutdown
- Close connections before exit
- Test container startup with minimum resources
- Verify health checks work (docker inspect)

REPEAT: Containers MUST build cleanly, start predictably, signal readiness, and shutdown gracefully. Use non-root user. Define resource limits. Test with minimum resources.
</instructions>

<examples>
✅ GOOD Dockerfile (clean, minimal, secure):

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY src/ ./src/
RUN npm run build

FROM node:20-alpine
RUN addgroup -g 1001 app && adduser -u 1001 -G app -s /bin/sh -D app
WORKDIR /app
COPY --from=builder --chown=app:app /build/node_modules ./node_modules
COPY --from=builder --chown=app:app /build/dist ./dist
USER app
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"
CMD ["node", "dist/main.js"]
```

**Why this is GOOD:**
- Multi-stage build (build dependencies separate from runtime)
- Specific base image tag (node:20-alpine, not latest)
- Non-root user (app user with UID 1001)
- Clean layers (cache clean in same RUN)
- Health check defined (orchestrator knows when ready)
- Simple CMD (direct node execution)

---

❌ BAD Dockerfile (bloated, insecure, unreliable):

```dockerfile
FROM node:latest
COPY . .
RUN npm install
CMD npm start
```

**Why this is BAD:**
- Uses :latest tag (not reproducible)
- Runs as root (security risk)
- Copies everything (no .dockerignore, bloated)
- Installs dev dependencies (larger image)
- No health check (orchestrator can't determine readiness)
- Uses npm start (extra process, harder to signal)
- No resource limits
- No multi-stage build

---

✅ GOOD health check endpoint (fast, accurate):

```typescript
app.get('/health', async (req, res) => {
  try {
    // Fast checks with timeout
    const ready = await Promise.race([
      checkDependencies(),
      timeout(4000)
    ]);

    if (ready) {
      res.status(200).json({ status: 'UP' });
    } else {
      res.status(503).json({ status: 'DOWN', message: 'Dependencies not ready' });
    }
  } catch (error) {
    res.status(503).json({ status: 'DOWN', message: error.message });
  }
});

async function checkDependencies() {
  // CRITICAL: Lightweight checks only
  const db = await database.query('SELECT 1'); // Fast
  const cache = await redis.ping(); // Fast
  return db && cache;
}
```

**Why this is GOOD:**
- Returns 200 only when truly ready
- Returns 503 when not ready (orchestrator won't route traffic)
- Has timeout (under 5s for orchestrator)
- Lightweight checks (SELECT 1, PING - not heavy queries)
- Clear status messages

---

❌ BAD health check endpoint (slow, misleading):

```typescript
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
```

**Why this is BAD:**
- Always returns 200 (even during startup)
- Doesn't check dependencies (misleading)
- No timeout protection
- Orchestrator routes traffic before ready
- No status information

---

✅ GOOD graceful shutdown (clean, safe):

```typescript
process.on('SIGTERM', async () => {
  console.log('SIGTERM: starting shutdown');

  // Stop accepting new requests
  server.close(async () => {
    // Close connections cleanly
    await database.close();
    await cache.quit();

    console.log('Shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 30s
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 30000);
});
```

**Why this is GOOD:**
- Handles SIGTERM (orchestrator signal)
- Stops accepting new requests (server.close)
- Drains in-flight requests
- Closes connections cleanly
- Has timeout (30s max)
- Exits with proper code (0 for success)

---

❌ BAD shutdown (abrupt, data loss):

```typescript
// No SIGTERM handler
// Orchestrator sends SIGTERM, waits 30s, sends SIGKILL
// Connections dropped mid-request
// Data loss possible
```

**Why this is BAD:**
- No SIGTERM handler (forced kill)
- Connections dropped (client errors)
- In-flight requests lost
- Data corruption possible
- No cleanup opportunity
</examples>
