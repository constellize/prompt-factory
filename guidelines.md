# Prompt Writing Guidelines

This document contains guidelines and best practices for writing effective prompts for AI agents, drawn from Anthropic's research and the Cline system prompt architecture.

---

## Part 1: Effective Context Engineering for AI Agents
*Source: Anthropic Engineering*

### Core Definition

Context engineering represents how to curate and manage tokens during LLM inference, including system instructions, tools, external data, and message history. It differs from prompt engineering by focusing on the entire context state across multiple inference turns rather than just crafting individual prompts.

### Key Principles

**Treat context as finite:** "LLMs have an 'attention budget' that they draw on when parsing large volumes of context" - similar to human working memory limitations. As context grows, model performance degrades through what researchers call "context rot."

**Find the minimal viable set:** The guiding principle is discovering "the smallest set of high-signal tokens that maximize the likelihood of your desired outcome."

### System Prompt Guidance

System prompts should strike a balance at the "right altitude" - specific enough to guide behavior effectively, yet flexible enough to provide strong heuristics. Avoid two extremes:
- Hardcoding complex, brittle logic (creates fragility)
- Providing vague guidance (fails to give concrete signals)

Organize into distinct sections using XML tags or Markdown headers.

### Tools Design

Tools should be:
- Self-contained and robust to error
- Extremely clear regarding intended use
- Minimally overlapping in functionality
- Token-efficient in their outputs

Bloated tool sets with unclear decision points harm agent performance.

### Context Retrieval Strategies

**Just-in-time approach:** Maintain lightweight identifiers (file paths, URLs, queries) and dynamically load data at runtime using tools, mirroring human cognition of external organization systems.

**Progressive disclosure:** Agents incrementally discover relevant context through exploration, with metadata providing signals about file purpose, complexity, and relevance.

**Hybrid strategy:** Retrieve some data upfront for speed while enabling autonomous exploration as needed - effectiveness depends on task characteristics.

### Long-Horizon Task Techniques

**Compaction:** Summarize conversations nearing context limits and reinitiate with compressed context, preserving architectural decisions and unresolved issues while discarding redundant outputs.

**Structured note-taking:** Agents maintain persistent notes outside context windows (like CLAUDE.md files or NOTES.md) to track progress, maintain dependencies, and enable coherence across context resets.

**Sub-agent architectures:** Specialized agents handle focused tasks with clean context windows, with main agents coordinating high-level plans. Sub-agents return condensed summaries rather than exhaustive details.

### Implementation Guidance

Start with minimal prompts using the best available model, then add instructions based on failure modes. As models improve, they require less prescriptive engineering and can operate with greater autonomy. The consistent advice remains: "do the simplest thing that works."

---

## Part 2: Cline System Prompt Architecture Analysis
*Source: Detailed architectural documentation*

### 30-Second Overview

**The Problem:** Different AI models need different instructions. Claude 4 can handle complexity; smaller models need concise prompts. A single prompt wastes tokens or provides insufficient guidance.

**The Solution:** Cline uses a modular architecture that generates model-specific prompts. Think: Registry (picks the right template) → Builder (assembles components) → Template Engine (fills in values) → Clean prompt.

**Why It Matters:** This architecture enables 8,500 token prompts for advanced models or 3,500 token prompts for small models, all from the same codebase with zero duplication.

---

### Table of Contents
1. The Problem: Why Not Just One Prompt?
2. The Solution: Architecture Overview
3. Process Flow: Request to Prompt
4. Core Components
5. Design Patterns Used
6. Example Walkthrough Summary
7. Extension Points
8. Prompt Engineering Techniques
9. Key Takeaways
10. Complete Example Walkthrough

---

### 0. The Problem: Why Not Just One Prompt?

#### The Naive Approach (What NOT to Do)

```javascript
// ❌ Single monolithic prompt
const systemPrompt = `
You are Cline, a software engineer.

TOOLS:
- execute_command: Run CLI commands...
- read_file: Read files...
- write_to_file: Write files...
[... 15 more tools with full documentation ...]

RULES:
- Rule 1 with detailed explanation...
- Rule 2 with detailed explanation...
[... 50 more rules ...]

CAPABILITIES:
- Capability 1 explained...
[... long list ...]
`;
```

**Problems:**
- **Token Waste:** Small models (32K context) get 8K tokens of unnecessary instructions
- **Insufficient Guidance:** Advanced models don't get specialized instructions they can handle
- **Maintenance Nightmare:** One typo affects all models; can't A/B test
- **No Customization:** Can't adapt to runtime context (MCP servers, browser support)

#### Real-World Impact

| Model | Context Window | Naive Prompt | Optimal Prompt | Wasted |
|-------|---------------|--------------|----------------|---------|
| Qwen 2.5 Coder (local) | 32K | 8.5K tokens | 3.5K tokens | 59% waste |
| GPT-4 | 128K | 8.5K tokens | 7.2K tokens | 15% waste |
| Claude Opus 4 | 200K | 8.5K tokens | 8.5K tokens | ✓ Optimal |

**Costs:** At $15 per 1M tokens (input/output), wasted tokens cost real money at scale.

#### The Core Challenge

How do you maintain ONE codebase that generates DIFFERENT prompts for DIFFERENT models while:
- Avoiding code duplication
- Enabling easy updates
- Supporting runtime customization
- Maintaining type safety
- Testing each variation

This is what Cline's architecture solves.

---

### 1. The Solution: Architecture Overview

#### Mental Model: Assembly Line

Think of prompt generation as an assembly line:

```
Request → Registry (Route) → Variant (Template) → Builder (Assemble) → Engine (Fill) → Prompt
```

1. Request arrives with model ID + context
2. Registry routes to correct variant (Generic/Next-Gen/XS/GPT-5)
3. Variant provides template + component list + tool list
4. Builder assembles by executing components in order
5. Engine fills placeholders with actual values
6. Clean prompt ready for API

#### Key Insight

Instead of ONE giant prompt, we have:
- **4 variants** (templates for model families)
- **12 components** (reusable sections like AGENT_ROLE, TOOLS, RULES)
- **17 tools** (with context-aware filtering)
- **Dynamic placeholders** (runtime values like CWD, user settings)

Mix and match to generate the right prompt for each model.

---

### 2. Process Flow: Request to Prompt

```
┌─────────────────────────────────────────────────────────────────┐
│ REQUEST: Generate prompt for "claude-opus-4-20250514"           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   getSystemPrompt()    │ Entry point
            └────────────┬───────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  PromptRegistry.get()  │ Singleton manager
            └────────────┬───────────┘
                         │
                    ┌────┴────┐
                    │ DECIDE  │ Which model family?
                    └────┬────┘
                         │
                         ├─ Model ID contains "claude" + "-4-" ?
                         ├─ YES → ModelFamily.NEXT_GEN
                         │
                         ▼
            ┌────────────────────────┐
            │ Load NEXT_GEN variant  │ Get template + config
            └────────────┬───────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  new PromptBuilder()   │ Orchestrator
            └────────────┬───────────┘
                         │
                    ┌────┴────┐
                    │ EXECUTE │ Build prompt
                    └────┬────┘
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
      ▼                  ▼                  ▼
┌──────────┐      ┌──────────┐      ┌──────────┐
│ Execute  │      │  Merge   │      │ Resolve  │
│Components│ →    │Placehol- │  →   │ Template │
│(12 funcs)│      │ders (4   │      │Engine    │
│          │      │ sources) │      │          │
└──────────┘      └──────────┘      └──────────┘
      │                  │                  │
      │                  │                  │
      └──────────────────┴──────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   postProcess()        │ Clean formatting
            └────────────┬───────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ RESULT: 8,500 token prompt optimized for Claude 4              │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Decision Points

- **Model Detection:** Pattern matching on model ID determines variant
- **Component Filtering:** Context determines which components appear
- **Tool Filtering:** `supportsBrowserUse: true` → BROWSER tool included
- **Placeholder Priority:** Runtime > Components > Standard > Variant defaults

---

### 3. Core Components

#### 3.1 The Four Building Blocks

| Component | Purpose | Example |
|-----------|---------|---------|
| Registry | Routes requests to correct variant | `registry.get(context)` → selects NEXT_GEN |
| Variant | Template + component list + tools | NEXT_GEN: 12 components, 17 tools |
| Components | Generate prompt sections | AGENT_ROLE → "You are Cline..." |
| Builder | Assembles everything | Executes components → merges → resolves |

#### 3.2 Available Components (12 total)

1. **AGENT_ROLE:** Identity ("You are Cline...")
2. **TOOL_USE:** All 17 tools with XML schemas
3. **MCP:** Connected MCP servers (context-dependent)
4. **EDITING_FILES:** File operation guidelines
5. **ACT_VS_PLAN:** Mode explanation
6. **TODO:** Task tracking system
7. **CAPABILITIES:** What Cline can do
8. **FEEDBACK:** Self-improvement (Next-Gen only)
9. **RULES:** Behavioral constraints
10. **SYSTEM_INFO:** OS, shell, CWD
11. **OBJECTIVE:** Task execution framework
12. **USER_INSTRUCTIONS:** Custom .clinerules

#### 3.3 How Components Work

```javascript
// Component = Function that generates text
type ComponentFunction = (variant, context) => Promise<string>

// Example: SYSTEM_INFO component
async function getSystemInfo(variant, context) {
  return `# SYSTEM INFORMATION
Operating System: ${info.os}
Current Working Directory: ${context.cwd}`;
}
```

**Key Points:**
- Each component is independent
- Components can contain placeholders (e.g., `{{CWD}}`)
- Order matters (defined in `variant.componentOrder`)
- Components can be variant-specific or shared

---

### 4. Design Patterns Used

#### 4.1 Quick Reference

| Pattern | Where Used | Why |
|---------|-----------|-----|
| Singleton | PromptRegistry | One instance, global access, lazy load |
| Builder | PromptBuilder | Step-by-step construction, testable stages |
| Strategy | Components | Interchangeable section generators |
| Template Method | TemplateEngine | Consistent `{{placeholder}}` resolution |

#### 4.2 Why These Patterns?

**Singleton (Registry)**
- ✓ Variants loaded once at startup
- ✓ Consistent state across all requests
- ✗ Testing requires disposal method

**Builder (PromptBuilder)**
- ✓ Clear construction stages (components → placeholders → resolve → clean)
- ✓ Easy to debug step-by-step
- ✗ More verbose than single function

**Strategy (Components)**
- ✓ Add new components without changing core code
- ✓ Reorder or override per variant
- ✗ Many small functions to manage

**Template Method (Engine)**
- ✓ Standard `{{placeholder}}` syntax
- ✓ Supports nested access (e.g., `{{user.name}}`)
- ✗ Runtime resolution (not compile-time)

---

### 5. Extension Points

#### 5.1 Adding a New Variant

**When:** Supporting a new model family (e.g., Gemini 2.0)

**Steps:**
1. Create `variants/gemini-2/config.ts` with components & tools
2. Create `variants/gemini-2/template.ts` with base template
3. Update `getModelFamily()` to detect "gemini-2" in model ID
4. Write snapshot tests

**Result:** New model automatically gets optimized prompts

#### 5.2 Adding a New Component

**When:** Need a new prompt section (e.g., SECURITY_POLICY)

**Steps:**
1. Add `SECURITY_POLICY_SECTION` to enum
2. Create `components/security_policy.ts` function
3. Register in component index
4. Add to variant configs that need it
5. Add `{{SECURITY_POLICY_SECTION}}` to templates

**Result:** Reusable section across variants

#### 5.3 Adding a New Tool

**When:** Exposing new capability to the AI (e.g., `database_query`)

**Steps:**
1. Add `DATABASE_QUERY` to tools enum
2. Create tool spec with parameters & `contextRequirements`
3. Register in tool init
4. Add to variant tool lists

**Result:** Tool appears in prompts when context allows

---

### 6. Prompt Engineering Techniques

This section analyzes the writing techniques used throughout Cline's component templates. These patterns represent best practices for instructing language models effectively.

#### 6.1 Structural Patterns

**1. Numbered Lists for Sequential Processes**

Used when order matters (workflows, algorithms):

```
1. Analyze the user's task and set clear goals
2. Work through these goals sequentially
3. Remember, you have extensive capabilities...
4. Once you've completed the task, use attempt_completion
5. The user may provide feedback...
```

**Why it works:** Numbers create clear sequence expectations and make it easy to reference specific steps.

**2. Bullet Points for Non-Sequential Items**

Used for independent rules or features:

```
- Your current working directory is: {{CWD}}
- You cannot cd into a different directory
- Do not use the ~ character or $HOME
- Before using execute_command, think about SYSTEM INFORMATION
```

**Why it works:** Bullets don't imply order, making it clear items are independent constraints.

**3. Nested Structure for Complex Information**

Combines lists with sub-points:

```
This approach allows you to:
1. Confirm the success of each step before proceeding.
2. Address any issues or errors that arise immediately.
3. Adapt your approach based on new information.
4. Ensure that each action builds correctly on previous ones.
```

**Why it works:** Shows relationships between main points and supporting details.

#### 6.2 Emphasis Techniques

**1. Strategic Capitalization**

```
ALWAYS wait for user confirmation after each tool use
NEVER end attempt_completion result with a question
STRICTLY FORBIDDEN from starting messages with "Great"
```

**Why it works:** Catches attention for critical rules. Use sparingly to maintain impact.

**2. Repetition of Critical Instructions**

The "wait for confirmation" pattern appears in multiple places:
- In guidelines: "ALWAYS wait for user confirmation"
- In rules: "It is critical you wait for the user's response"
- In objective: "You will be informed on the work completed"

**Why it works:** Redundancy reinforces critical behaviors that models tend to violate.

**3. Visual Separators**

```
# RULES

- Rule 1...
- Rule 2...
```

**Why it works:** Headers and spacing create cognitive boundaries between sections.

#### 6.3 Clarity Techniques

**1. Concrete Examples with Code**

Instead of: "Use the correct directory"

Better:
```
For example, if you needed to run `npm install` in a project outside of
'/Users/project', you would need to prepend with a `cd` i.e. pseudocode
for this would be `cd (path to project) && (command, in this case npm install)`
```

**Why it works:** Removes ambiguity by showing exactly what's expected.

**2. Negative Examples (What NOT to Do)**

```
❌ "Great, I've updated the CSS"
✅ "I've updated the CSS"

❌ This is INVALID: ------- SEARCH>
✅ This is VALID: ------- SEARCH
```

**Why it works:** Models learn as much from what to avoid as what to do.

**3. Explicit Forbidden Behaviors**

```
You are STRICTLY FORBIDDEN from starting your messages with
"Great", "Certainly", "Okay", "Sure"
```

**Why it works:** Models have strong tendencies toward certain patterns. Explicit prohibition helps override them.

**4. Pseudocode and Placeholders**

```
cd (path to project) && (command, in this case npm install)
```

**Why it works:** Parenthetical placeholders make the pattern clear while showing where to substitute actual values.

#### 6.4 Context-Aware Patterns

**1. Conditional Text Insertion**

```javascript
const rulesText = context.yoloModeToggled
  ? "Use your best judgment without asking followup questions"
  : "Ask the user questions using the ask_followup_question tool";
```

**Why it works:** Single template adapts to different operating modes without duplication.

**2. Feature-Gated Sections**

```javascript
const browserRules = context.supportsBrowserUse
  ? BROWSER_RULES
  : "";
```

**Why it works:** Only includes instructions for available features, reducing prompt size and confusion.

**3. Dynamic Value Injection**

```
- Your current working directory is: {{CWD}}
```

**Why it works:** Grounds the model in specific runtime context rather than abstractions.

#### 6.5 Behavioral Shaping

**1. Structured Thinking Pattern**

```
Before calling a tool, do some analysis within <thinking></thinking> tags.
First, analyze X. Then, think about Y. Next, go through Z.
```

**Why it works:** Forces step-by-step reasoning before action, reducing impulsive mistakes.

**2. Iterative Process Enforcement**

```
Use one tool at a time per message, with each tool use being informed
by the result of the previous tool use. Do not assume the outcome.
```

**Why it works:** Prevents the model from "hallucinating" tool results and proceeding with incorrect assumptions.

**3. Explicit Permission and Prohibition**

- **Permission:** "You have extensive capabilities with access to a wide range of tools"
- **Prohibition:** "DO NOT use commands like echo or cat that merely print text"

**Why it works:** Balances empowerment with constraint, guiding behavior toward desired patterns.

#### 6.6 Error Prevention

**1. Common Mistake Callouts**

```
When using replace_in_file, you must include complete lines in your
SEARCH blocks, not partial lines. For example, if you want to match
a line containing "const x = 5;", your SEARCH block must include
the entire line, not just "x = 5" or other fragments.
```

**Why it works:** Addresses observed failure modes directly in the prompt.

**2. Format Validation Hints**

```
Do NOT add extra characters to the markers (e.g., ------- SEARCH> is INVALID)
Do NOT forget to use the closing +++++++ REPLACE marker
Do NOT modify the marker format in any way
```

**Why it works:** Prevents syntax errors by pre-emptively addressing common formatting mistakes.

**3. Edge Case Handling**

```
The user may provide a file's contents directly in their message,
in which case you shouldn't use the read_file tool to get the file
contents again since you already have it.
```

**Why it works:** Reduces redundant operations and token waste.

#### 6.7 Meta-Communication Patterns

**1. Explaining System Behavior**

```
At the end of each user message, you will automatically receive
environment_details. This information is not written by the user
themselves, but is auto-generated to provide potentially relevant
context about the project structure and environment.
```

**Why it works:** Helps the model understand the full interaction context, including automated elements.

**2. Purpose Statements**

```
Your goal is to try to accomplish the user's task, NOT engage in
a back and forth conversation.
```

**Why it works:** Clarifies the fundamental objective when model tendencies might pull in different directions.

#### 6.8 Lessons for Prompt Engineers

**Do's:**
- ✓ Use numbered lists for sequences, bullets for independent items
- ✓ Provide concrete examples with actual code
- ✓ Show both positive and negative examples
- ✓ Repeat critical instructions in multiple places
- ✓ Use conditional text to adapt to runtime context
- ✓ Structure thinking with explicit patterns (e.g., `<thinking>` tags)
- ✓ Address common mistakes pre-emptively
- ✓ Use strategic emphasis (ALWAYS, NEVER) sparingly

**Don'ts:**
- ✗ Don't rely on vague instructions ("be careful")
- ✗ Don't assume the model will infer critical constraints
- ✗ Don't overuse emphasis (loses impact)
- ✗ Don't write ambiguous examples (always use concrete values)
- ✗ Don't include instructions for unavailable features
- ✗ Don't forget to explain meta-elements (automated messages, etc.)

#### 6.9 Pattern Combinations

The most effective prompts combine multiple techniques:

```
# RULES                                          # Header + emphasis

- Before using execute_command, you must       # Imperative statement
  first think about the SYSTEM INFORMATION     # References other section

  For example, if you needed to run            # Concrete example
  `npm install` in a project outside of        # Code formatting
  '{{CWD}}', you would need to prepend         # Dynamic value
  with a `cd` i.e. pseudocode for this         # Explicit format label
  would be `cd (path) && (command)`            # Placeholder pattern
```

This combines:
- Structural (header)
- Emphasis (capitalization)
- Clarity (example with code)
- Context-awareness (`{{CWD}}`)
- Format hints (pseudocode label)

#### 6.10 Technology-Agnostic Prompt Design

When creating prompts for software engineering tasks, focus on teaching **methods and patterns** rather than specific implementations. This ensures prompts work across any technology stack (Python, Java, Go, Node.js, Ruby, etc.) and remain valuable as technologies evolve.

**Core Principle: Method Over Implementation**

Prompts should teach the "what" and "why" of patterns, not the "how" of specific syntax. This approach:
- Works across any programming language or framework
- Remains relevant as technologies evolve
- Helps agents understand principles, not memorize code
- Reduces token usage by avoiding language-specific details

**Pattern-Based Output Formats**

Instead of generating specific code, prompts should output pattern templates that show structure and intent:

❌ **Implementation-Specific (Bad):**
```typescript
class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

✅ **Method-Focused Pattern (Good):**
```markdown
**Error Handling Pattern:**

Structure requirements:
- Machine-readable error code
- Human-readable message
- HTTP status code
- Contextual details for debugging

Serialization format:
{
  "error": {
    "code": "[MACHINE_READABLE_CODE]",
    "message": "[Human readable description]",
    "statusCode": [HTTP_STATUS],
    "details": { "[field]": "[value]" }
  }
}

Implementation approach:
1. Extend/wrap language-native exception types
2. Include required fields in constructor
3. Implement serialization to standard format
```

**Universal Language Guidelines**

Use generic terminology instead of tool-specific names:

| ❌ Avoid | ✅ Use Instead |
|---------|----------------|
| npm, pip, cargo | package manager |
| Docker | container runtime |
| TypeScript | statically-typed language |
| Jest, pytest | testing framework |
| Express, Flask | web framework |
| PostgreSQL | relational database |
| Redis | cache/key-value store |

**Example Transformation: Dependency Management**

❌ **Before (Tool-Specific):**
```bash
# Run npm audit to check for vulnerabilities
npm audit

# Update dependencies
npm update

# Install with exact versions
npm install --save-exact lodash@4.17.21
```

✅ **After (Method-Focused):**
```markdown
**Vulnerability Scanning Pattern:**

Schedule:
- Before deployments
- Regular intervals (e.g., weekly)

Process:
1. Run security scanner from package manager
2. Parse results by severity (critical/high/medium/low)
3. For critical/high: Block deployment until resolved
4. For medium/low: Schedule review

**Dependency Update Pattern:**

Version policy:
- Patch versions (x.y.Z): Auto-merge after tests pass
- Minor versions (x.Y.z): Review and test before merging
- Major versions (X.y.z): Manual review of breaking changes

Lock file approach:
- Pin exact versions in lock file
- Document version in dependency manifest
- Use lock file for reproducible builds
```

**Conceptual Examples Over Code**

Show structure and relationships rather than syntax:

❌ **Code-Heavy Example:**
```typescript
@Controller('/customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    return await this.customerService.findById(id);
  }

  @Post()
  async createCustomer(@Body() dto: CreateCustomerDto) {
    return await this.customerService.create(dto);
  }
}
```

✅ **Pattern-Focused Example:**
```markdown
**API Layer Pattern:**

Organization:
- Controller/Handler: Receives HTTP requests
- Service: Contains business logic
- Repository: Handles data access

Request flow:
1. Controller receives request → extracts parameters
2. Controller calls Service with validated data
3. Service executes business logic → calls Repository
4. Repository queries database → returns data
5. Service transforms data → returns to Controller
6. Controller serializes response → returns HTTP

Endpoint structure:
GET    /[resource]/:id     → Retrieve single item
GET    /[resource]         → List items
POST   /[resource]         → Create new item
PUT    /[resource]/:id     → Update item
DELETE /[resource]/:id     → Delete item
```

**When to Use Technology-Agnostic Patterns**

✅ **Always use for:**
- Architecture and design patterns
- API structure and conventions
- Error handling approaches
- Testing strategies
- Security patterns
- Documentation standards
- Development workflows

❌ **Can use specific tech when:**
- Teaching a specific framework (e.g., "React patterns")
- Debugging tool-specific issues
- Configuring particular tools
- User explicitly requests specific tech

**Benefits of This Approach**

1. **Future-proof**: Patterns outlive specific tools
2. **Cross-stack**: Same prompt works for Python, Java, Go, Node.js teams
3. **Educational**: Teaches principles that transfer between technologies
4. **Token-efficient**: Avoids verbose code examples
5. **Maintainable**: Less updating as tools evolve

---

### 7. Key Takeaways

#### For AI System Designers

**Architecture Lessons:**
- **Modularity:** Break complex systems into independent, composable parts
- **Type Safety:** TypeScript prevents config errors at compile-time
- **Patterns:** Singleton + Builder + Strategy solve real problems
- **Testing:** Snapshot tests enable confident refactoring

**NLP System Design:**
- **Model-Aware:** Different models need different prompts
- **Context-Dependent:** Runtime context (MCP servers, browser) affects output
- **Token Efficiency:** Save costs by optimizing for each model's capabilities
- **Maintainability:** One codebase, multiple optimized outputs

#### Performance Metrics

- **Generation:** <100ms
- **Components:** ~10ms each
- **Template Resolution:** ~5ms
- **Memory:** Efficient (singleton, no duplication)

#### Real-World Impact

| Metric | Value |
|--------|-------|
| Token savings (XS) | 59% vs naive |
| Variants supported | 4 (Generic, Next-Gen, XS, GPT-5) |
| Components | 12 reusable sections |
| Tools | 17 with context filtering |
| Cost at scale | Significant savings |

---

### 8. Complete Example Walkthrough

Let's trace a complete request through the system, generating a prompt for Claude 4 (Opus). We'll follow the actual execution path from start to finish.

#### 8.1 The Request

A Controller requests a system prompt for Claude 4:

```javascript
// Entry point: index.ts
export async function getSystemPrompt(context: SystemPromptContext): Promise<string> {
  const registry = PromptRegistry.getInstance();
  return await registry.get(context);
}

// Controller provides context
const context: SystemPromptContext = {
  providerInfo: {
    model: { id: "claude-opus-4-20250514" }
  },
  cwd: "/Users/student/projects/my-app",
  supportsBrowserUse: true,
  mcpHub: mcpHubInstance, // Has GitHub MCP connected
  globalClineRulesFileInstructions: "Always write tests for new functions."
};

const prompt = await getSystemPrompt(context);
```

#### 8.2 Registry: Model Family Detection & Variant Selection

The registry's `get()` method first determines which model family this is:

```javascript
// In PromptRegistry.get()
async get(context: SystemPromptContext): Promise<string> {
  await this.load(); // Ensure variants are loaded

  // Step 1: Detect model family from model ID
  const modelFamily = getModelFamily(context.providerInfo);

  // Step 2: Get variant for that family
  let variant = this.variants.get(modelFamily);

  // Step 3: Fallback to GENERIC if needed
  if (!variant && modelFamily !== ModelFamily.GENERIC) {
    variant = this.variants.get(ModelFamily.GENERIC);
  }

  // Step 4: Build prompt with selected variant
  const builder = new PromptBuilder(variant, context, this.components);
  return await builder.build();
}
```

Model Family Detection uses pattern matching on the model ID:

```javascript
// In getModelFamily()
function getModelFamily(providerInfo: ApiProviderInfo): ModelFamily {
  // Check for Claude 4 family
  if (providerInfo.model.id.includes("claude") &&
      providerInfo.model.id.includes("-4-")) {
    return ModelFamily.NEXT_GEN; // ✓ Matched!
  }
  // ... other checks
  return ModelFamily.GENERIC;
}

// For our example:
// Input: "claude-opus-4-20250514"
// Output: ModelFamily.NEXT_GEN
```

#### 8.3 Variant Configuration

The NEXT_GEN variant provides the template and configuration:

```javascript
{
  id: "next-gen",
  componentOrder: [
    "AGENT_ROLE_SECTION",
    "TOOL_USE_SECTION",
    "MCP_SECTION",
    "EDITING_FILES_SECTION",
    "ACT_VS_PLAN_SECTION",
    "TODO_SECTION",
    "CAPABILITIES_SECTION",
    "FEEDBACK_SECTION",     // ← Next-gen specific
    "RULES_SECTION",
    "SYSTEM_INFO_SECTION",
    "OBJECTIVE_SECTION",
    "USER_INSTRUCTIONS_SECTION"
  ],
  tools: [
    ClineDefaultTool.BASH,
    ClineDefaultTool.BROWSER,
    ClineDefaultTool.WEB_FETCH,  // ← Next-gen specific
    // ... 14 more tools
  ]
}
```

#### 8.4 Component Execution

The builder executes all components in order:

```javascript
sections["AGENT_ROLE_SECTION"] = "You are Cline...";
sections["TOOL_USE_SECTION"] = "# Tool Use\n\n[17 tools]...";
sections["MCP_SECTION"] = "# MCP SERVERS\n\n## github-mcp...";
sections["RULES_SECTION"] = "# RULES\n\n- Your current working directory is: {{CWD}}...";
// ... 8 more components
```

#### 8.5 Placeholder Merging

Four sources merged by priority (highest to lowest):

```javascript
placeholders = {
  // Runtime (if provided)
  // Component sections
  AGENT_ROLE_SECTION: "You are Cline...",
  // Standard
  CWD: "/Users/student/projects/my-app",
  // Variant
  MODEL_FAMILY: "next-gen"
}
```

#### 8.6 Template Resolution & Output

The template engine replaces all `{{placeholders}}` with actual values, then post-processing cleans up formatting.

**Result:** 8,500 token prompt in ~87ms.

---

## Summary: Core Principles for Prompt Writing

Based on both sources, here are the essential principles for writing effective prompts:

### 1. **Context Economy**
- Treat context as finite - every token matters
- Find the minimal viable set of instructions
- Remove redundancy and overlap
- Use progressive disclosure for large information spaces

### 2. **Structural Clarity**
- Use clear sectioning (XML tags or Markdown headers)
- Numbered lists for sequential processes
- Bullet points for independent constraints
- Visual separators between sections

### 3. **Precision & Examples**
- Provide concrete examples with actual code
- Show both positive and negative patterns
- Use pseudocode with clear placeholders
- Address common mistakes explicitly

### 4. **Behavioral Guidance**
- Balance specificity with flexibility (right altitude)
- Use strategic emphasis (ALWAYS, NEVER) sparingly
- Repeat critical instructions in multiple contexts
- Structure thinking patterns explicitly

### 5. **Context-Awareness**
- Adapt to runtime conditions dynamically
- Gate features based on availability
- Ground in specific values (paths, dates)
- Explain meta-elements and system behavior

### 6. **Modularity**
- Independent, composable components
- Clear separation of concerns
- Reusable patterns across variants
- Model-specific optimizations

### 7. **Tool Design**
- Self-contained and error-robust
- Extremely clear intended use
- Minimal overlap in functionality
- Token-efficient outputs

### 8. **Iteration Strategy**
- Start minimal with best model
- Add instructions based on failure modes
- "Do the simplest thing that works"
- Test and snapshot each variant

---

*This document should serve as the foundation for designing prompts that are efficient, maintainable, and effective across different models and contexts.*
