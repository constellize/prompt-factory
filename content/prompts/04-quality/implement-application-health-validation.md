---
# === Identity ===
id: implement-application-health-validation
name: Build application health validation for startup, config, environment, and business rules
version: v1

# === Classification ===
chapter: 4
category: quality
subcategory: gate-2
tags:
  - quality
  - health-checks
  - validation
  - configuration
  - gate-2

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Build application health validation for startup, config, environment, and business rules.
    After component implementation, add application health validation (Gate 2: Health Check Completeness).
  argument-hint: "[component_name] [system_name]"
  allowed-tools:
    - Read
    - Glob
    - Grep
    - Bash
  model: sonnet
  context: inline
  user-invocable: true
  disable-model-invocation: false

# === Variables ===
variables:
  - name: component_name
    description: The specific component to add application health validation for
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
      **Build application health validation** that confirms your service is ready to handle requests. Service startup verification should confirm all dependencies are available and initialized correctly. Configuration completeness checks catch missing or invalid settings at startup rather than at runtime. Required environment variables need explicit validation with clear error messages when absent. Critical business rules should be validated to ensure the system is in a correct state to serve users.
    preview: |
      "...confirms your service is ready to handle requests. Application health goes beyond infrastructure—it validates that YOUR code is ready to serve traffic..."
  website:
    include: true
    path: /prompts/implement-application-health-validation
  marketplace:
    plugin: constellize:craft

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Build application health validation for {{component_name}} in {{system_name}} that confirms your service is ready to handle requests.

**Build application health validation** that confirms your service is ready to handle requests. Service startup verification should confirm all dependencies are available and initialized correctly. Configuration completeness checks catch missing or invalid settings at startup rather than at runtime. Required environment variables need explicit validation with clear error messages when absent. Critical business rules should be validated to ensure the system is in a correct state to serve users.

Application health goes beyond infrastructure—it validates that YOUR code is ready to serve traffic, with all required configuration and business logic properly initialized.

Follow this process:

1. **Review application requirements:**
   - Read code generation plan from `construction/design/code-generation-plan-*.md` for initialization steps
   - Read gap analysis from `construction/requirements/gap-analysis.md` for business rules
   - Extract ALL required configuration, environment variables, and business constraints

2. **Implement startup verification:**
   - Confirm all dependencies initialized (connection pools, caches, clients)
   - Verify all required services reachable at startup
   - Test critical code paths execute without error
   - Report initialization failures with specific errors

3. **Implement configuration validation:**
   - Check all required config values present
   - Validate config value formats and ranges
   - Test config combinations for conflicts
   - Report missing/invalid config with clear remediation steps

4. **Implement environment variable validation:**
   - Require ALL necessary env vars at startup (FAIL FAST if missing)
   - Validate env var formats (URLs, numbers, enums)
   - Check for conflicting env var combinations
   - Provide clear error messages naming missing vars

5. **Implement business rule validation:**
   - Verify critical business invariants hold
   - Check data integrity at startup
   - Validate licenses, quotas, or limits
   - Ensure system in correct state to serve users
</task>

<context>
Component to add health validation:
{{component_name}}

**Standard Construction Folder Structure:**
This prompt reads from:
- `construction/design/code-generation-plan-*.md` (initialization requirements)
- `construction/requirements/gap-analysis.md` (business rules to validate)

And adds health validation code to component implementation.
</context>

<thinking>
Before implementing health validation, analyze:
1. What configuration is REQUIRED for this component to function?
2. What environment variables are REQUIRED?
3. What business rules MUST hold for safe operation?
4. What would indicate component is NOT ready to serve traffic?
5. How can validation FAIL FAST at startup vs runtime?
</thinking>

<output-format>
Add readiness validation to component:

```[language]
// APPLICATION HEALTH VALIDATION: {{component_name}}
// Purpose: Confirm service ready to handle requests
// Code plan: construction/design/code-generation-plan-*.md
//
// Validation Checks:
// - Startup: All dependencies initialized
// - Configuration: Required values present and valid
// - Environment: Required env vars present and valid
// - Business Rules: Critical invariants hold
//
// Readiness Criteria:
// - READY: All validation passed, safe to serve traffic
// - NOT_READY: Validation failed, component cannot serve traffic

class ApplicationHealthValidator {
  // CRITICAL: Validation MUST FAIL FAST at startup
  // Don't wait for first request to discover missing config

  async validateReadiness(): Promise<ReadinessResult> {
    // Run all validation checks
    const results = await Promise.all([
      this.validateStartup(),
      this.validateConfiguration(),
      this.validateEnvironment(),
      this.validateBusinessRules(),
    ]);

    const failed = results.filter(r => !r.passed);

    if (failed.length > 0) {
      return {
        ready: false,
        failures: failed,
        message: 'Component not ready to serve traffic',
      };
    }

    return {
      ready: true,
      message: 'Component ready to serve traffic',
    };
  }
}
```

## Gate 2: Health Check Completeness Status

### Requirements
- [ ] Every configuration value the change reads is validated at startup, with a named failure
- [ ] The environment the change requires is checked before first use, not on first request
- [ ] Each business rule the specification states has a validation with a distinct error
- [ ] A validation failure stops startup rather than degrading silently
- [ ] The validation reports what it checked and the outcome

**Gate Status:** ✅ PASS / ❌ FAIL

**Blockers:** [List any failing requirements]
</output-format>

<instructions>
CRITICAL: Application health validation MUST FAIL FAST at startup. Don't discover missing config at runtime.

NEVER implement health validation that:
- Waits for first request to check config (MUST validate at startup)
- Returns generic "not ready" (MUST specify what's missing)
- Skips business rule validation (critical invariants MUST be checked)
- Allows partial initialization (all-or-nothing, FAIL if any check fails)
- Uses defaults for missing required config (FAIL FAST, don't guess)
- Continues serving with invalid state (MUST refuse traffic if not ready)

DO NOT:
- Start accepting requests before validation complete
- Use empty string as default for missing env vars
- Skip validating config value ranges (URLs, ports, enums)
- Forget to validate config combinations (conflicting settings)
- Return "OK" when business rules violated
- Log warnings instead of failing (REQUIRED config MUST fail startup)

ALWAYS:
- Validate ALL required config at startup (before accepting requests)
- FAIL FAST with specific error messages (which config missing, how to fix)
- Validate config formats and ranges (not just presence)
- Check business rules hold (critical invariants)
- Return NOT_READY if any validation fails
- Provide clear remediation steps in error messages
- Test validation in unit tests (ensure it catches issues)
- FAIL the gate if any requirement above is unmet
- NEVER report PASS with an unmet requirement — "close enough" is a FAIL
- ALWAYS report the verdict, even when this skill was run outside a feature verification

REPEAT: FAIL FAST at startup. Don't accept requests if validation fails. Return SPECIFIC errors with remediation steps. Required config MUST be present (no defaults).
</instructions>

<examples>
✅ GOOD application health validation (fail fast, specific):

```typescript
// APPLICATION HEALTH VALIDATION: PaymentProcessor
// Purpose: Confirm service ready to handle requests
//
// Validation Checks:
// - Startup: Stripe client initialized, database connected, cache ready
// - Configuration: Payment limits, fraud thresholds, retry config valid
// - Environment: STRIPE_SECRET_KEY, DATABASE_URL, REDIS_URL present
// - Business Rules: Stripe account verified, payment limits reasonable

class PaymentProcessorHealthValidator {
  async validateReadiness(): Promise<ReadinessResult> {
    const checks = [
      await this.validateStartup(),
      await this.validateConfiguration(),
      await this.validateEnvironment(),
      await this.validateBusinessRules(),
    ];

    const failures = checks.filter(c => !c.passed);

    if (failures.length > 0) {
      return {
        ready: false,
        checks,
        failures,
        message: 'Payment processor not ready to serve traffic',
      };
    }

    return {
      ready: true,
      checks,
      message: 'Payment processor ready',
    };
  }

  private async validateStartup(): Promise<ValidationCheck> {
    const issues: string[] = [];

    // Check Stripe client initialized
    if (!this.stripeClient) {
      issues.push('Stripe client not initialized');
    } else {
      try {
        // Verify Stripe client works (lightweight call)
        await this.stripeClient.balance.retrieve({ timeout: 5000 });
      } catch (error) {
        issues.push(`Stripe client initialization failed: ${error.message}`);
      }
    }

    // Check database connected
    if (!this.database.isConnected()) {
      issues.push('Database not connected');
    } else {
      try {
        await this.database.query('SELECT 1', [], { timeout: 5000 });
      } catch (error) {
        issues.push(`Database initialization failed: ${error.message}`);
      }
    }

    // Check cache ready
    if (!this.cache.isReady()) {
      issues.push('Cache not ready');
    } else {
      try {
        await this.cache.ping({ timeout: 5000 });
      } catch (error) {
        issues.push(`Cache initialization failed: ${error.message}`);
      }
    }

    return {
      name: 'Startup Verification',
      passed: issues.length === 0,
      issues,
      message: issues.length === 0 ? 'All dependencies initialized' : 'Dependency initialization failed',
    };
  }

  private async validateConfiguration(): Promise<ValidationCheck> {
    const issues: string[] = [];
    const config = this.config;

    // CRITICAL: Validate ALL required configuration

    // Payment limits must be reasonable
    if (!config.maxPaymentAmount || config.maxPaymentAmount <= 0) {
      issues.push('maxPaymentAmount must be > 0 (current: ' + config.maxPaymentAmount + ')');
    }

    if (config.maxPaymentAmount > 1000000) {
      issues.push('maxPaymentAmount suspiciously high: $' + config.maxPaymentAmount);
    }

    // Fraud threshold must be valid percentage
    if (config.fraudThreshold === undefined) {
      issues.push('fraudThreshold is required (missing)');
    } else if (config.fraudThreshold < 0 || config.fraudThreshold > 1) {
      issues.push('fraudThreshold must be 0-1 (current: ' + config.fraudThreshold + ')');
    }

    // Retry configuration must be valid
    if (!config.retryAttempts || config.retryAttempts < 1) {
      issues.push('retryAttempts must be >= 1 (current: ' + config.retryAttempts + ')');
    }

    if (config.retryAttempts > 10) {
      issues.push('retryAttempts too high: ' + config.retryAttempts + ' (max 10)');
    }

    // Check for conflicting settings
    if (config.enableFraudCheck && !config.fraudThreshold) {
      issues.push('enableFraudCheck requires fraudThreshold to be set');
    }

    return {
      name: 'Configuration Validation',
      passed: issues.length === 0,
      issues,
      message: issues.length === 0 ? 'Configuration valid' : 'Configuration validation failed',
    };
  }

  private async validateEnvironment(): Promise<ValidationCheck> {
    const issues: string[] = [];

    // CRITICAL: FAIL FAST if required env vars missing

    // Stripe API key required
    if (!process.env.STRIPE_SECRET_KEY) {
      issues.push(
        'STRIPE_SECRET_KEY environment variable is required. ' +
        'Set it to your Stripe secret key (starts with sk_)'
      );
    } else if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      issues.push(
        'STRIPE_SECRET_KEY has invalid format (should start with sk_). ' +
        'Current value: ' + process.env.STRIPE_SECRET_KEY.substring(0, 5) + '...'
      );
    }

    // Database URL required
    if (!process.env.DATABASE_URL) {
      issues.push(
        'DATABASE_URL environment variable is required. ' +
        'Set it to your PostgreSQL connection string (postgresql://...)'
      );
    } else {
      try {
        new URL(process.env.DATABASE_URL);
        if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
          issues.push('DATABASE_URL must start with postgresql://');
        }
      } catch (error) {
        issues.push('DATABASE_URL is not a valid URL: ' + error.message);
      }
    }

    // Redis URL required
    if (!process.env.REDIS_URL) {
      issues.push(
        'REDIS_URL environment variable is required. ' +
        'Set it to your Redis connection string (redis://...)'
      );
    }

    // Environment (dev/staging/prod) required
    if (!process.env.NODE_ENV) {
      issues.push(
        'NODE_ENV environment variable is required. ' +
        'Set it to: development, staging, or production'
      );
    } else if (!['development', 'staging', 'production'].includes(process.env.NODE_ENV)) {
      issues.push(
        'NODE_ENV has invalid value: ' + process.env.NODE_ENV + '. ' +
        'Must be: development, staging, or production'
      );
    }

    // Check for conflicting env vars
    if (process.env.NODE_ENV === 'production' && process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
      issues.push(
        'DANGER: Using Stripe test key in production environment. ' +
        'Use production key (starts with sk_live_)'
      );
    }

    return {
      name: 'Environment Validation',
      passed: issues.length === 0,
      issues,
      message: issues.length === 0 ? 'Environment valid' : 'Environment validation failed',
    };
  }

  private async validateBusinessRules(): Promise<ValidationCheck> {
    const issues: string[] = [];

    // CRITICAL: Validate business invariants hold

    try {
      // Verify Stripe account in good standing
      const account = await this.stripeClient.account.retrieve();

      if (!account.charges_enabled) {
        issues.push('Stripe account does not have charges enabled');
      }

      if (!account.payouts_enabled) {
        issues.push('Stripe account does not have payouts enabled');
      }

      if (account.requirements?.currently_due?.length > 0) {
        issues.push(
          'Stripe account has pending requirements: ' +
          account.requirements.currently_due.join(', ')
        );
      }

      // Check payment limits are reasonable
      if (this.config.maxPaymentAmount > account.settings.payments.statement_descriptor_prefix_limit) {
        issues.push(
          'maxPaymentAmount exceeds Stripe account limits'
        );
      }

    } catch (error) {
      issues.push('Unable to verify Stripe account: ' + error.message);
    }

    // Verify database schema version
    try {
      const schemaVersion = await this.database.query('SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1');

      const requiredVersion = '20240115000000'; // From code plan
      if (schemaVersion.rows[0].version < requiredVersion) {
        issues.push(
          'Database schema out of date. Current: ' + schemaVersion.rows[0].version +
          ', Required: ' + requiredVersion + '. Run migrations.'
        );
      }
    } catch (error) {
      issues.push('Unable to verify database schema: ' + error.message);
    }

    return {
      name: 'Business Rules Validation',
      passed: issues.length === 0,
      issues,
      message: issues.length === 0 ? 'Business rules valid' : 'Business rule validation failed',
    };
  }
}

// Usage at startup:
async function startServer() {
  const validator = new PaymentProcessorHealthValidator(processor);

  const result = await validator.validateReadiness();

  if (!result.ready) {
    console.error('❌ Payment processor not ready:');
    for (const failure of result.failures) {
      console.error(`  ${failure.name}:`);
      for (const issue of failure.issues) {
        console.error(`    - ${issue}`);
      }
    }

    // CRITICAL: FAIL FAST - don't start server
    process.exit(1);
  }

  console.log('✅ Payment processor ready');
  // Start accepting requests
  app.listen(3000);
}
```

**Why this is GOOD:**
- Fails fast at startup (before accepting requests)
- Validates ALL required config and env vars
- Specific error messages with remediation steps
- Tests actual connectivity (not just variable presence)
- Validates business rules (Stripe account status)
- Checks for dangerous combinations (test key in prod)
- Returns structured validation results
- Process exits if validation fails (doesn't serve broken traffic)

---

❌ BAD application health validation (allows broken state):

```typescript
class HealthCheck {
  check() {
    const stripeKey = process.env.STRIPE_KEY || 'default-key';
    const dbUrl = process.env.DB_URL || 'localhost';

    return { status: 'ok' };
  }
}
```

**Why this is BAD:**
- Uses defaults for missing config (should FAIL)
- No validation at startup (discovers issues at runtime)
- No specific error messages
- Returns "ok" even with invalid config
- Doesn't check business rules
- Doesn't validate config formats
- Doesn't fail fast (allows broken requests)
</examples>
