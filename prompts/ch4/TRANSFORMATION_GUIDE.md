# Chapter 4 Prompts - Method-Focused Transformation Guide

## Transformation Completed (4/16)

### Gate 4 (Complete):
- ✅ achieve-documentation-completeness-prompt.txt
- ✅ maintain-dependency-hygiene-prompt.txt
- ✅ ensure-team-comprehension-prompt.txt

### Gate 1 (1/4):
- ✅ write-unit-tests-prompt.txt
- ⏳ write-integration-tests-prompt.txt
- ⏳ write-contract-tests-prompt.txt
- ⏳ validate-test-coverage-prompt.txt

### Gate 2 (0/4):
- ⏳ implement-application-health-validation-prompt.txt
- ⏳ implement-operational-monitoring-prompt.txt
- ⏳ implement-infrastructure-health-checks-prompt.txt
- ⏳ implement-actionable-health-reporting-prompt.txt

### Gate 3 (0/4):
- ⏳ build-reliable-containers-prompt.txt
- ⏳ externalize-configuration-prompt.txt
- ⏳ achieve-environment-independence-prompt.txt
- ⏳ implement-rollback-capability-prompt.txt

## Transformation Principles

### Keep As-Is:
- `<task>` section - already method-focused
- `<context>` section - file structure references
- `<thinking>` section - analysis questions
- `<instructions>` section - guidelines and warnings

### Transform:
1. **`<output-format>`** - Convert from specific code examples to PATTERNS
2. **`<examples>`** - Convert from implementation to pattern demonstrations

## Pattern Template for output-format

```
<output-format>
[Action] following these patterns:

**[Category] Pattern:**

[Description of the pattern approach]

**[Pattern Name]:**
```
[Abstract template showing structure]
```

**[Another Pattern Name]:**
- Element 1: [Purpose]
- Element 2: [Purpose]
- Element 3: [Purpose]

**[Pattern] Guidelines:**
- Do: [Best practice]
- Don't: [Anti-pattern]
</output-format>
```

## Pattern Template for examples

```
<examples>
✅ GOOD [Concept] Pattern:

**Pattern demonstrates:**
- Key characteristic 1
- Key characteristic 2
- Key characteristic 3

**[Pattern structure]:**
```
[Abstract template]
```

**Why this pattern works:**
- Benefit 1
- Benefit 2
- Benefit 3

---

❌ BAD [Concept] Anti-pattern:

**Anti-pattern characteristics:**
- Problem 1
- Problem 2
- Problem 3

**Why this pattern fails:**
- Issue 1
- Issue 2
- Issue 3
</examples>
```

## Key Transformations

### Before (Implementation-Specific):
```typescript
class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}
```

### After (Method-Focused):
```
**Error Handling Pattern:**

Define standard error object with:
- Machine-readable code
- Human-readable message
- HTTP status code
- Additional context/details

Serialized format:
```
{
  "error": {
    "code": "[CODE]",
    "message": "[Description]",
    "statusCode": [STATUS]
  }
}
```
```

## Technology-Agnostic Language

### Replace:
- TypeScript/JavaScript specific → Language-agnostic patterns
- `npm install` → Package manager commands
- `Jest/describe/it` → Test framework patterns
- `Express` → HTTP framework concepts
- `Docker` → Container platform

### With:
- Pattern descriptions that work in any language
- Conceptual approaches
- Universal principles
- Technology-independent best practices

## Success Criteria

Each transformed prompt should:
1. Teach PATTERNS not CODE
2. Work for Python/Java/Go/Node.js/etc.
3. Focus on "what to achieve" and "why"
4. Show universal principles
5. Remain actionable and specific
6. Maintain same depth and quality
