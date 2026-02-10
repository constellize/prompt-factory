# Prompt Factory - Detailed Project Design

## Vision Statement

Create a systematic approach to generating high-quality AI prompts from book content that can be seamlessly integrated into the Constellize website-starter project. These prompts enable users to interact with book knowledge through AI in ways that are effective, efficient, and aligned with best practices in context engineering.

## Problem Statement

### Current Challenges
1. **Ad-hoc Prompt Creation:** Most prompts are written from scratch without systematic approach
2. **Inconsistent Quality:** No shared standards or guidelines across prompts
3. **Token Waste:** Prompts often include unnecessary content, wasting context budget
4. **Poor Reusability:** Difficult to adapt prompts across different books or use cases
5. **No Integration Path:** Manual process to get prompts into production systems

### What We're Solving
- **Systematic Generation:** Template-based approach with clear patterns
- **Quality Assurance:** Built-in validation against proven guidelines
- **Token Efficiency:** Minimal viable context following Anthropic's research
- **Modular Design:** Reusable components adaptable to different contexts
- **Clear Integration:** Automated pipeline to website-starter deployment

## Target: ../constellize/website-starter

### Integration Points

The website-starter project will receive prompts in this structure:

```
website-starter/
├── prompts/
│   ├── comprehension/
│   │   ├── summarize-chapter/
│   │   │   ├── prompt.md              # Main prompt text
│   │   │   ├── metadata.json          # Model, tokens, tags
│   │   │   ├── examples.md            # Usage examples
│   │   │   └── tests.json             # Validation tests
│   │   ├── explain-concept/
│   │   └── extract-insights/
│   ├── application/
│   │   ├── apply-to-problem/
│   │   ├── generate-examples/
│   │   └── create-exercises/
│   ├── analysis/
│   │   ├── critical-analysis/
│   │   ├── pattern-recognition/
│   │   └── synthesize-concepts/
│   ├── interactive/
│   │   ├── qa-dialogue/
│   │   ├── socratic-method/
│   │   └── guided-exploration/
│   └── creative/
│       ├── generate-analogies/
│       ├── create-visualizations/
│       └── build-scenarios/
└── README.md                           # Integration guide
```

### Metadata Format

Each prompt includes structured metadata:

```json
{
  "id": "summarize-chapter",
  "category": "comprehension",
  "title": "Summarize Book Chapter",
  "description": "Generates concise, structured summaries of book chapters",
  "version": "1.0.0",
  "models": {
    "recommended": ["claude-opus-4", "claude-sonnet-4"],
    "supported": ["claude-haiku-4", "gpt-4", "gpt-4-turbo"]
  },
  "tokens": {
    "prompt": 850,
    "estimated_input": 2000,
    "estimated_output": 500,
    "total_estimated": 3350
  },
  "tags": ["summary", "chapter", "comprehension", "book"],
  "inputs": [
    {
      "name": "chapter_content",
      "type": "text",
      "required": true,
      "description": "Full text of the chapter to summarize"
    },
    {
      "name": "focus_areas",
      "type": "array",
      "required": false,
      "description": "Specific topics to emphasize"
    }
  ],
  "outputs": [
    {
      "name": "summary",
      "type": "structured_text",
      "format": "markdown",
      "sections": ["overview", "key_points", "conclusions"]
    }
  ],
  "testing": {
    "test_cases": 5,
    "success_rate": 0.95,
    "last_validated": "2026-01-11"
  }
}
```

## Architecture Deep Dive

### Component Breakdown

#### 1. Context Extractor

**Purpose:** Intelligently extract relevant content from books while maintaining token economy.

**Key Functions:**
- `extractChapter(bookPath, chapterNum)` - Extract specific chapter
- `extractConcepts(bookPath, concepts[])` - Find and extract concept explanations
- `extractExamples(bookPath, topic)` - Pull relevant examples
- `extractPatterns(bookPath)` - Identify recurring patterns
- `summarizeSection(content, maxTokens)` - Compress while preserving meaning

**Design Principles:**
- Progressive disclosure: Extract metadata first, details on demand
- Token-aware: Track and optimize context usage
- Smart chunking: Respect semantic boundaries
- Cross-referencing: Maintain relationships between concepts

**Example Usage:**
```javascript
const extractor = new ContextExtractor();
const context = await extractor
  .fromBook('./content/books/clean-architecture.md')
  .chapter(5)
  .withConcepts(['dependency-inversion', 'solid-principles'])
  .withExamples(3)
  .maxTokens(1500)
  .extract();
```

#### 2. Template System

**Purpose:** Reusable prompt structures that can be populated with extracted context.

**Template Structure:**
```javascript
{
  id: 'summarize-chapter',
  category: 'comprehension',
  variants: {
    'claude-opus-4': {
      components: [
        'ROLE',           // Who the AI is
        'OBJECTIVE',      // What to accomplish
        'CONTEXT',        // Book/chapter info
        'INSTRUCTIONS',   // How to proceed
        'CONSTRAINTS',    // What to avoid
        'OUTPUT_FORMAT',  // Expected structure
        'EXAMPLES'        // Sample outputs
      ],
      placeholders: {
        '{{CHAPTER_CONTENT}}': { type: 'text', source: 'context' },
        '{{BOOK_TITLE}}': { type: 'string', source: 'metadata' },
        '{{CHAPTER_NUMBER}}': { type: 'number', source: 'metadata' }
      }
    },
    'claude-haiku-4': {
      // Simplified version for smaller model
      components: ['ROLE', 'OBJECTIVE', 'CONTEXT', 'OUTPUT_FORMAT']
    }
  }
}
```

**Component Library:**
```javascript
// ROLE component example
const ROLE = {
  comprehension: "You are an expert at analyzing and explaining complex technical content.",
  application: "You are a practical engineer who helps apply theoretical concepts to real problems.",
  analysis: "You are a critical thinker who identifies patterns and evaluates ideas.",
  interactive: "You are a thoughtful teacher who guides learners through discovery.",
  creative: "You are a creative thinker who generates novel connections and explanations."
};

// INSTRUCTIONS component example
const INSTRUCTIONS = {
  structured: `
1. Read the provided content carefully
2. Identify the main themes and arguments
3. Extract key supporting evidence
4. Organize into a coherent structure
5. Validate completeness and accuracy
`,
  concise: "Analyze the content and produce a structured summary following the format below."
};
```

#### 3. Prompt Builder

**Purpose:** Orchestrate the assembly of templates with context, following guidelines.

**Builder Pattern:**
```javascript
class PromptBuilder {
  constructor(guidelines) {
    this.guidelines = guidelines;
    this.template = null;
    this.context = null;
    this.variant = null;
    this.components = {};
  }

  template(templateId) {
    this.template = TemplateRegistry.get(templateId);
    return this;
  }

  context(contextData) {
    this.context = contextData;
    return this;
  }

  variant(modelId) {
    this.variant = this.template.selectVariant(modelId);
    return this;
  }

  withComponent(componentId, overrideValue) {
    this.components[componentId] = overrideValue;
    return this;
  }

  async build() {
    // 1. Validate context against guidelines
    await this.validate();

    // 2. Execute component assembly
    const assembled = await this.assembleComponents();

    // 3. Resolve placeholders
    const resolved = this.resolvePlaceholders(assembled);

    // 4. Post-process (formatting, cleanup)
    const processed = this.postProcess(resolved);

    // 5. Generate metadata
    const metadata = this.generateMetadata();

    return new Prompt(processed, metadata);
  }

  async validate() {
    // Check token limits
    const tokens = this.estimateTokens();
    if (tokens > this.guidelines.maxTokens) {
      throw new Error(`Prompt exceeds token limit: ${tokens}`);
    }

    // Validate structure
    if (!this.hasRequiredComponents()) {
      throw new Error('Missing required components');
    }

    // Check for anti-patterns
    const issues = this.guidelines.checkAntiPatterns(this.template);
    if (issues.length > 0) {
      console.warn('Potential issues:', issues);
    }
  }
}
```

#### 4. Validator

**Purpose:** Ensure prompts meet quality standards defined in guidelines.md

**Validation Rules:**
```javascript
const ValidationRules = {
  structure: {
    hasClearSections: (prompt) => {
      // Check for proper section headers
      return /^#+\s+\w+/gm.test(prompt);
    },
    usesAppropriateListTypes: (prompt) => {
      // Numbered for sequences, bullets for independent items
    },
    hasVisualSeparators: (prompt) => {
      // Adequate spacing between sections
    }
  },

  content: {
    includesConcreteExamples: (prompt) => {
      // At least one code block or concrete example
      return /```[\s\S]*?```/.test(prompt);
    },
    avoidsVagueInstructions: (prompt) => {
      // Flag phrases like "be careful", "try to"
      const vagueTerms = ['be careful', 'try to', 'do your best'];
      return !vagueTerms.some(term => prompt.toLowerCase().includes(term));
    },
    hasNegativeExamples: (prompt) => {
      // Check for ❌/✗ or explicit "Don't" sections
    }
  },

  tokens: {
    withinLimit: (prompt, limit) => {
      const tokens = estimateTokens(prompt);
      return tokens <= limit;
    },
    efficientForModel: (prompt, modelId) => {
      // Model-specific token efficiency checks
    }
  },

  guidelines: {
    followsContextEconomy: (prompt) => {
      // No redundant information
      // Minimal viable instruction set
    },
    hasStrategicEmphasis: (prompt) => {
      // ALWAYS/NEVER used sparingly
      const emphasisCount = (prompt.match(/\b(ALWAYS|NEVER|MUST|STRICTLY)\b/g) || []).length;
      const wordCount = prompt.split(/\s+/).length;
      return emphasisCount / wordCount < 0.02; // Less than 2%
    },
    includesErrorPrevention: (prompt) => {
      // Addresses common mistakes
    }
  }
};
```

## Data Flow

### End-to-End Example

```javascript
// 1. User provides book content
const bookPath = './content/books/clean-architecture.md';

// 2. Extract relevant context
const extractor = new ContextExtractor();
const context = await extractor
  .fromBook(bookPath)
  .chapter(5, 'Dependency Inversion Principle')
  .withExamples(2)
  .withKeyPoints(5)
  .maxTokens(1500)
  .extract();

// Result:
{
  book: {
    title: "Clean Architecture",
    author: "Robert C. Martin"
  },
  chapter: {
    number: 5,
    title: "Dependency Inversion Principle",
    content: "...", // Compressed content
    keyPoints: [...],
    examples: [...]
  },
  tokens: 1450
}

// 3. Select template
const builder = new PromptBuilder(guidelines);
const prompt = await builder
  .template('comprehension/explain-concept')
  .context(context)
  .variant('claude-opus-4')
  .build();

// 4. Validate
const validation = await validator.validate(prompt);
if (!validation.passed) {
  console.error('Validation failed:', validation.issues);
}

// 5. Save to output
await prompt.save({
  directory: './output/constellize/comprehension',
  name: 'explain-dependency-inversion',
  format: ['markdown', 'json']
});

// Generated files:
// - output/constellize/comprehension/explain-dependency-inversion/
//   - prompt.md
//   - metadata.json
//   - examples.md
//   - tests.json
```

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goal:** Basic infrastructure and first working prompt

**Tasks:**
1. Set up project structure
   - Create directory layout
   - Initialize npm package
   - Set up TypeScript configuration

2. Implement basic Context Extractor
   - File reading and parsing
   - Simple chapter extraction
   - Token counting

3. Create first template
   - "Summarize Chapter" template
   - Single variant (Claude Opus 4)
   - Basic component library

4. Basic Prompt Builder
   - Template + context merging
   - Simple placeholder resolution
   - Output generation

5. Generate first prompt
   - Test with sample book chapter
   - Manual validation
   - Iterate based on results

**Success Criteria:**
- [ ] Generate one complete prompt from book content
- [ ] Prompt follows guidelines.md principles
- [ ] Output in correct format for website-starter
- [ ] Token count within efficient range

### Phase 2: Core System (Week 3-4)

**Goal:** Complete builder system with validation

**Tasks:**
1. Enhanced Context Extractor
   - Smart concept extraction
   - Example detection
   - Cross-referencing
   - Multiple extraction strategies

2. Template System
   - Component library (10+ components)
   - Multiple variants per template
   - Template inheritance
   - Override system

3. Full Prompt Builder
   - Complete assembly pipeline
   - All component types
   - Error handling
   - Optimization passes

4. Validator Implementation
   - All validation rules from guidelines
   - Automated testing
   - Quality scoring
   - Improvement suggestions

5. Create 5 core templates
   - Comprehension: Summarize, Explain
   - Application: Apply concept
   - Analysis: Compare ideas
   - Interactive: Q&A

**Success Criteria:**
- [ ] Generate 5 different prompt types
- [ ] All prompts pass validation
- [ ] Support 2+ model variants per template
- [ ] Automated quality checks working

### Phase 3: Prompt Library (Week 5-6)

**Goal:** Comprehensive collection of production-ready prompts

**Tasks:**
1. Generate full prompt collection
   - 15-20 different prompts
   - All 5 categories covered
   - Multiple variants per prompt

2. Real book content testing
   - Test with 3+ different books
   - Validate output quality
   - Iterate based on results

3. Documentation
   - Usage guides for each prompt
   - Examples with real outputs
   - Integration instructions

4. Quality assurance
   - Manual review of all prompts
   - User testing if possible
   - Performance benchmarking

**Success Criteria:**
- [ ] 15+ production-ready prompts
- [ ] Tested with multiple books
- [ ] Complete documentation
- [ ] Quality metrics tracked

### Phase 4: Integration (Week 7-8)

**Goal:** Seamless deployment to website-starter

**Tasks:**
1. Output formatting
   - Match website-starter structure exactly
   - Generate all required files
   - Proper metadata format

2. Deployment scripts
   - Automated copy to website-starter
   - Validation in target location
   - Rollback capability

3. Integration testing
   - Test prompts in website context
   - Verify metadata parsing
   - Check examples rendering

4. CI/CD setup
   - Automated builds
   - Validation pipeline
   - Deployment automation

**Success Criteria:**
- [ ] One-command deployment
- [ ] All prompts work in website-starter
- [ ] Automated integration tests pass
- [ ] Documentation complete

## Technical Decisions

### Why TypeScript?
- Type safety prevents config errors
- Better IDE support for development
- Easier refactoring
- Self-documenting code

### Why Modular Components?
- Following proven Cline pattern
- Easy to test individually
- Reusable across templates
- Clear separation of concerns

### Why Template Variants?
- Different models have different needs
- Avoid one-size-fits-all problems
- Optimize token usage per model
- Maintain single source of truth

### Why Validation Pipeline?
- Ensure quality consistency
- Catch issues early
- Automate best practices
- Track improvements over time

## Open Questions

1. **Context Extraction Strategy**
   - How much book content to include in prompts?
   - Real-time extraction vs. pre-processed?
   - How to handle very long books?

2. **Model Variants**
   - Which models to support initially?
   - How different should variants be?
   - How to test across models?

3. **Integration Details**
   - How will website-starter consume prompts?
   - Static files vs. API?
   - Update mechanism?

4. **Quality Metrics**
   - How to measure prompt effectiveness?
   - What benchmarks to use?
   - How to A/B test prompts?

## Success Metrics

### Development Metrics
- **Prompt generation time:** < 5 seconds per prompt
- **Validation pass rate:** > 95%
- **Token efficiency:** > 40% improvement vs. naive approach
- **Code coverage:** > 80%

### Quality Metrics
- **Guideline compliance:** 100% of validation rules pass
- **Example coverage:** Every prompt has 2+ concrete examples
- **Structural clarity:** All prompts have clear section headers
- **Token efficiency:** Average < 2000 tokens for standard prompts

### Integration Metrics
- **Deployment success rate:** 100%
- **Integration test pass rate:** 100%
- **Time to deploy:** < 2 minutes
- **Zero breaking changes:** All updates backward compatible

## Future Enhancements

### V2 Features
- **Interactive prompt builder UI**
- **Real-time preview and testing**
- **A/B testing framework**
- **Analytics integration**
- **Multi-language support**

### Advanced Features
- **Prompt optimization via LLM feedback**
- **Automatic variant generation**
- **Context compression algorithms**
- **Prompt versioning and migrations**
- **Custom guideline sets per domain**

## References

- [guidelines.md](./guidelines.md) - Core principles and techniques
- [Anthropic Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Cline System Prompt Architecture](https://github.com/cline/cline) - Inspiration for modular design

---

*Last updated: 2026-01-11*
*Status: Phase 1 - Foundation*
