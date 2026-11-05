---
# === Identity ===
id: implement-rollback-capability
name: Build rollback capability to recover quickly when deployments fail
version: v1

# === Classification ===
chapter: 4
category: deployment
subcategory: gate-3
tags:
  - quality
  - rollback
  - deployment
  - recovery
  - gate-3

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Build rollback capability to recover quickly when deployments fail.
    Creating rollback procedures for fast recovery (Gate 3: Deployment Readiness).
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
    description: The specific component to implement rollback capability for
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
      **Build rollback capability** to recover quickly when deployments fail. The previous version must be restorable within 5 minutes to minimize downtime during incidents. Database migrations require reversibility so schema changes can be undone safely. Configuration changes need revert procedures that restore previous working state. Test rollback procedures regularly and document them so any team member can execute them under pressure.
    preview: |
      "...enable version rollback tagging all images and keeping previous versions available. Document and test rollback procedures quarterly with step-by-step runbooks..."
  website:
    include: true
    path: /prompts/implement-rollback-capability
  marketplace:
    plugin: constellize:deliver

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Implement rollback capability for {{component_name}} in {{system_name}} to recover quickly when deployments fail.

The previous version must be restorable within 5 minutes to minimize downtime during incidents. Database migrations require reversibility so schema changes can be undone safely. Configuration changes need revert procedures that restore previous working state. Test rollback procedures regularly and document them so any team member can execute them under pressure.

Follow this process:

1. **Enable version rollback:**
   - Tag all container images with semantic versions
   - Keep previous versions available in registry
   - Document rollback command for orchestrator
   - Test rollback in staging before production
   - Automated rollback on health check failures (optional)

2. **Implement reversible migrations:**
   - Every migration has corresponding down() function
   - Test rollback in staging before production
   - Document manual rollback steps
   - Handle data migrations carefully (backup before destructive changes)
   - Lock database during rollback to prevent conflicts

3. **Create configuration rollback:**
   - Version all configuration changes (Git commits, etcd revisions)
   - Document previous working configuration
   - Provide rollback commands for each config system
   - Test configuration rollback in staging
   - Separate application rollback from config rollback

4. **Document and test rollback procedures:**
   - Create runbook with step-by-step rollback instructions
   - Include rollback time estimate (should be under 5 minutes)
   - Test rollback quarterly (not just during incidents)
   - Verify service returns to working state after rollback
   - Document known issues and workarounds
</task>

<context>
Component to implement rollback for:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt creates:
- Rollback documentation/runbook
- Kubernetes rollback commands
- Database migration rollback scripts
- Configuration rollback procedures
- Automated rollback triggers (optional)
</context>

<thinking>
Before implementing rollback, analyze:
1. What versions need to be kept available (how far back)?
2. What database schema changes are reversible vs irreversible?
3. What configuration changes affect system behavior?
4. How long does rollback take (should be under 5 minutes)?
5. What data loss is acceptable during rollback?
</thinking>

<output-format>
Create rollback runbook:

```markdown
# ROLLBACK RUNBOOK: {{component_name}}
# Purpose: Restore previous working version within 5 minutes
# When to use: Deployment failures, critical bugs, performance degradation
# Estimated time: 3-5 minutes

## Prerequisites
- Access to Kubernetes cluster (kubectl configured)
- Access to container registry
- Database admin credentials
- Previous version identifier (image tag)

## Rollback Steps

### Step 1: Identify Previous Version (30 seconds)
Find the last known good version:

\`\`\`bash
# List recent deployments
kubectl rollout history deployment/{{component_name}} -n production

# Output shows revision history:
# REVISION  CHANGE-CAUSE
# 1         Initial deployment (v1.0.0)
# 2         Feature release (v1.1.0)
# 3         Bug fix (v1.1.1) <-- Current (broken)
\`\`\`

Previous version: Revision 2 (v1.1.0)

### Step 2: Roll Back Application (2 minutes)

\`\`\`bash
# Option A: Roll back to previous revision (FASTEST)
kubectl rollout undo deployment/{{component_name}} -n production

# Option B: Roll back to specific revision
kubectl rollout undo deployment/{{component_name}} -n production --to-revision=2

# Option C: Update to specific version (if rollout history unavailable)
kubectl set image deployment/{{component_name}} \
  {{component_name}}=registry.example.com/{{component_name}}:v1.1.0 \
  -n production

# Watch rollback progress
kubectl rollout status deployment/{{component_name}} -n production --timeout=2m
\`\`\`

Expected output:
\`\`\`
deployment "{{component_name}}" successfully rolled out
\`\`\`

### Step 3: Roll Back Database Migration (1-2 minutes)

**CRITICAL**: Only if migration ran in current deployment

\`\`\`bash
# Connect to database
psql $DATABASE_URL

# Check current migration version
SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1;

# Rollback last migration
npm run migrate:down

# Verify rollback
SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1;
\`\`\`

### Step 4: Roll Back Configuration (30 seconds)

**If configuration changed:**

\`\`\`bash
# Kubernetes ConfigMap
kubectl rollout undo configmap/{{component_name}}-config -n production

# Or apply previous version from Git
kubectl apply -f config/{{component_name}}-config-v1.1.0.yaml

# Restart pods to pick up config change
kubectl rollout restart deployment/{{component_name}} -n production
\`\`\`

### Step 5: Verify Rollback (1 minute)

\`\`\`bash
# Check pod status
kubectl get pods -n production -l app={{component_name}}

# Check health endpoint
curl https://{{component_name}}.example.com/health

# Check logs for errors
kubectl logs -n production -l app={{component_name}} --tail=50

# Check metrics/dashboards
# - Error rate back to normal?
# - Response time back to normal?
# - Request throughput stable?
\`\`\`

## Success Criteria
- [ ] All pods running and healthy
- [ ] Health check returns 200 OK
- [ ] Error rate < 1%
- [ ] Response time < p95 threshold
- [ ] No critical errors in logs

## Post-Rollback Actions
1. Notify team in incident channel
2. Update incident timeline
3. Create post-mortem ticket
4. Document what failed and why
5. Plan fix for rolled-back version

## Troubleshooting

**Pod stuck in CrashLoopBackOff:**
- Check logs: \`kubectl logs -n production <pod-name>\`
- Check events: \`kubectl describe pod -n production <pod-name>\`
- Verify image exists: \`docker pull registry.example.com/{{component_name}}:v1.1.0\`

**Health check still failing:**
- Check dependency status (database, cache)
- Verify configuration is correct
- Check for incomplete database rollback

**Database rollback failed:**
- Check migration logs
- Manually restore from backup if needed
- Contact database admin

## Emergency Contacts
- On-call engineer: Pager duty
- Database admin: #database-team
- Platform team: #platform-team
```

Create automated rollback trigger (optional):

```yaml
# AUTOMATED ROLLBACK: {{component_name}}
# Purpose: Automatically rollback on health check failures
# Requires: Argo Rollouts, Flagger, or similar progressive delivery tool

apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: {{component_name}}
  namespace: production
spec:
  replicas: 3
  revisionHistoryLimit: 5

  # CRITICAL: Automated rollback on failure
  strategy:
    canary:
      # Deploy to 20% of pods first
      steps:
      - setWeight: 20
      - pause: { duration: 2m }
      - setWeight: 50
      - pause: { duration: 2m }
      - setWeight: 100

      # CRITICAL: Automatically rollback on failure
      analysis:
        templates:
        - templateName: success-rate
        startingStep: 1
        successCondition: result[0] >= 0.99
        failureCondition: result[0] < 0.95

---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
  namespace: production
spec:
  metrics:
  - name: success-rate
    interval: 30s
    count: 4
    successCondition: result >= 0.99
    failureCondition: result < 0.95
    provider:
      prometheus:
        address: http://prometheus:9090
        query: |
          sum(rate(http_requests_total{status!~"5..",app="{{component_name}}"}[1m]))
          /
          sum(rate(http_requests_total{app="{{component_name}}"}[1m]))
```

Create database migration rollback:

```[language]
// DATABASE MIGRATION ROLLBACK: {{component_name}}
// Purpose: Safely reverse database schema changes
// Usage: npm run migrate:down

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentStatusIndex1705484400000 implements MigrationInterface {
  name = 'AddPaymentStatusIndex1705484400000';

  // UP: Apply migration
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "idx_payments_status"
      ON "payments" ("status")
    `);
  }

  // DOWN: Rollback migration
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_payments_status"
    `);
  }
}

// Migration runner with rollback support
class MigrationManager {
  async rollbackLastMigration(): Promise<void> {
    // CRITICAL: Lock to prevent concurrent rollbacks
    await this.acquireLock();

    try {
      // Get last applied migration
      const lastMigration = await this.getLastAppliedMigration();

      if (!lastMigration) {
        console.log('No migrations to rollback');
        return;
      }

      console.log(`Rolling back migration: ${lastMigration.name}`);

      // Execute down() function
      await lastMigration.down(this.queryRunner);

      // Remove from migration tracking table
      await this.queryRunner.query(`
        DELETE FROM migrations
        WHERE name = $1
      `, [lastMigration.name]);

      console.log(`✓ Migration rolled back: ${lastMigration.name}`);
    } catch (error) {
      console.error('✗ Migration rollback failed:', error);
      console.error('Manual intervention required');
      console.error('Contact database admin or restore from backup');
      throw error;
    } finally {
      await this.releaseLock();
    }
  }

  private async acquireLock(): Promise<void> {
    // PostgreSQL advisory lock
    await this.queryRunner.query('SELECT pg_advisory_lock(123456)');
  }

  private async releaseLock(): Promise<void> {
    await this.queryRunner.query('SELECT pg_advisory_unlock(123456)');
  }
}
```

Create configuration rollback script:

```bash
#!/bin/bash
# CONFIGURATION ROLLBACK: {{component_name}}
# Purpose: Restore previous working configuration
# Usage: ./rollback-config.sh <previous-version>

set -e

COMPONENT="{{component_name}}"
NAMESPACE="production"
PREVIOUS_VERSION="${1:-}"

if [ -z "$PREVIOUS_VERSION" ]; then
  echo "Usage: $0 <previous-version>"
  echo "Example: $0 v1.1.0"
  exit 1
fi

echo "Rolling back configuration to $PREVIOUS_VERSION"

# Rollback ConfigMap
echo "Rolling back ConfigMap..."
kubectl apply -f config/configmap-${PREVIOUS_VERSION}.yaml -n $NAMESPACE

# Rollback Secret (if changed)
if [ -f "config/secret-${PREVIOUS_VERSION}.yaml" ]; then
  echo "Rolling back Secret..."
  kubectl apply -f config/secret-${PREVIOUS_VERSION}.yaml -n $NAMESPACE
fi

# Restart pods to pick up new config
echo "Restarting pods to pick up configuration..."
kubectl rollout restart deployment/$COMPONENT -n $NAMESPACE

# Wait for rollout
echo "Waiting for rollout to complete..."
kubectl rollout status deployment/$COMPONENT -n $NAMESPACE --timeout=2m

echo "✓ Configuration rolled back to $PREVIOUS_VERSION"
```

## Gate 3: Deployment Readiness Status

### Requirements
- [ ] The change can be reverted without a manual data repair
- [ ] Any state migration the change introduced is reversible, or its forward-only nature is stated with the reason
- [ ] The previous version can still run against the state this version writes
- [ ] The rollback procedure is written down, naming the command and the check that it worked
- [ ] The rollback was exercised, not asserted

**Gate Status:** ✅ PASS / ❌ FAIL

**Blockers:** [List any failing requirements]
</output-format>

<instructions>
CRITICAL: Rollback capability is essential for production readiness. Must be tested regularly.

NEVER implement rollback by:
- Deleting old container images (can't rollback)
- Making irreversible database migrations (can't undo)
- Skipping rollback testing (discover issues during incident)
- Creating rollback procedures without documentation (can't execute under pressure)
- Assuming rollback always works (test quarterly)
- Taking more than 5 minutes to rollback (too much downtime)

DO NOT:
- Use :latest tag (can't identify version)
- Forget down() function for migrations
- Skip database backup before destructive changes
- Assume configuration rollback is automatic
- Forget to test rollback in staging
- Create complex multi-step rollbacks

ALWAYS:
- Tag images with semantic versions (v1.2.3)
- Keep last 5-10 versions in registry
- Document rollback command for orchestrator
- Create down() function for every migration
- Test rollback in staging before production
- Time rollback procedures (should be under 5 minutes)
- Document rollback steps in runbook
- Test rollback quarterly (not just during incidents)
- Verify service works after rollback
- Consider automated rollback on health failures
- FAIL the gate if any requirement above is unmet
- NEVER report PASS with an unmet requirement — "close enough" is a FAIL
- ALWAYS report the verdict, even when this skill was run outside a feature verification

REPEAT: Rollback MUST be fast (<5 minutes), documented, and tested regularly. Every migration needs down() function. Keep old versions available.
</instructions>

<examples>
✅ GOOD rollback procedure (fast, documented, tested):

```bash
# ROLLBACK: Fast one-command rollback
kubectl rollout undo deployment/payment-processor -n production

# Verify
kubectl rollout status deployment/payment-processor -n production --timeout=2m

# Check health
curl https://payment-processor.example.com/health

# Total time: ~2 minutes
```

**Why this is GOOD:**
- Single command (fast)
- Built-in Kubernetes feature (reliable)
- Timeout specified (fails fast if stuck)
- Health check verification
- Under 5 minutes total
- Documented in runbook

---

❌ BAD rollback procedure (slow, manual, complex):

```bash
# Step 1: SSH to each server
# Step 2: Stop service manually
# Step 3: Download old version from S3
# Step 4: Extract and copy files
# Step 5: Update symlinks
# Step 6: Start service manually
# Step 7: Check logs on each server
# Total time: ~30 minutes, error-prone
```

**Why this is BAD:**
- Multiple manual steps (error-prone)
- Requires SSH access (slow)
- Manual file operations (risky)
- Takes 30 minutes (too slow)
- Hard to execute under pressure
- Not repeatable

---

✅ GOOD migration with rollback (reversible, safe):

```typescript
export async function up(queryRunner: QueryRunner): Promise<void> {
  // Add column with default
  await queryRunner.query(`
    ALTER TABLE payments
    ADD COLUMN refund_reason TEXT DEFAULT NULL
  `);
}

export async function down(queryRunner: QueryRunner): Promise<void> {
  // Remove column safely
  await queryRunner.query(`
    ALTER TABLE payments
    DROP COLUMN IF EXISTS refund_reason
  `);
}
```

**Why this is GOOD:**
- Has down() function (reversible)
- Uses IF EXISTS (safe)
- Non-destructive up (adds column)
- Can rollback safely
- No data loss

---

❌ BAD migration (irreversible, destructive):

```typescript
export async function up(queryRunner: QueryRunner): Promise<void> {
  // Destructive change with no way back!
  await queryRunner.query(`
    DROP COLUMN old_payment_id;
    ALTER TABLE payments DROP COLUMN amount;
  `);
}

// No down() function - CAN'T ROLLBACK!
```

**Why this is BAD:**
- No down() function (can't rollback)
- Destructive changes (data loss)
- No backup taken
- Can't recover from failure
- Violates rollback requirement

---

✅ GOOD automated rollback (progressive, safe):

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: payment-processor
spec:
  strategy:
    canary:
      steps:
      - setWeight: 20  # Deploy to 20% first
      - pause: { duration: 2m }  # Watch for errors
      - setWeight: 100  # Deploy to all if healthy

      analysis:
        templates:
        - templateName: success-rate
        failureCondition: result < 0.95  # Auto-rollback if errors
```

**Why this is GOOD:**
- Progressive deployment (20% first)
- Automated health monitoring
- Automatic rollback on failure (< 95% success)
- Limits blast radius
- Fast detection and rollback

---

❌ BAD deployment (all-at-once, no rollback):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-processor
spec:
  replicas: 10
  strategy:
    type: Recreate  # Kill all, then start new
```

**Why this is BAD:**
- All-at-once deployment (risky)
- No progressive rollout
- No automated rollback
- Full downtime during deployment
- Can't detect issues early
</examples>
