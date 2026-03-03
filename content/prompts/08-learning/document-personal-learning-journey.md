---
# === Identity ===
id: document-personal-learning-journey
name: Capture individual learning journey building expertise and personal growth
version: v1

# === Classification ===
chapter: 8
category: learning
subcategory: personal
tags:
  - personal-learning
  - learning-journey
  - skill-development
  - problem-solving
  - expertise-building
  - reflection
  - growth-documentation
  - knowledge-contribution

# === Skill Configuration (for Claude Code marketplace) ===
skill:
  description: >
    Capture individual learning journey building expertise and personal growth.
    Document how individual engineer grew through specific challenge—investigation process, skills developed, lessons learned, knowledge gained—building personal expertise while creating knowledge that can be shared with team to accelerate collective capability.
  argument-hint: "[engineer_name] [challenge_description] [learning_period] [memory_bank_location]"
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
  - name: engineer_name
    description: Individual engineer documenting learning
    example: "Alex Chen"
    maps-to: "$0"
  - name: challenge_description
    description: Problem or challenge encountered
    example: "Debugging slow payment processing in production"
    maps-to: "$1"
  - name: learning_period
    description: When this learning occurred
    example: "January 2026"
    maps-to: "$2"
  - name: memory_bank_location
    description: Where to document personal learning
    example: "memory-bank/personal-learning/"
    maps-to: "$3"

# === Output Targets ===
outputs:
  book:
    chapter: 8
    description: |
      **Capture how you grew through challenges** by documenting problem encountered, investigation process, skills developed, and lessons learned—transforming personal problem-solving into expertise that accelerates team capability when shared.
    preview: |
      "...Challenge: Payment latency spike. Didn't know: Why Stripe calls serialized. Learned: Circuit breaker pattern, load testing. Skills: Empirical threshold tuning. Would share: Load testing approach, tuning guide. Growth: 2/5 → 4/5 confidence in scaling..."
  website:
    include: true
    path: /prompts/document-personal-learning-journey
  marketplace:
    plugin: constellize-learning

# === Related ===
related:
  personas: []
  skills: []
---

<task>
Document {{engineer_name}}'s personal learning journey by capturing challenge encountered and context, recording investigation process and decision points, identifying skills developed through challenge, extracting lessons learned for personal growth, transforming personal insight into potential team contribution—building individual expertise while creating knowledge that accelerates team capability.
</task>

<context>
Engineer: {{engineer_name}}
Challenge: {{challenge_description}}
Period: {{learning_period}}
Documentation: {{memory_bank_location}}

Personal learning journey documentation transforms individual problem-solving into organizational knowledge. This differs from sprint learning capture:
- Sprint learning capture: What team learned collectively
- Personal learning journey: How individual engineer grew through specific challenge

Both valuable. Personal learning documents serve multiple purposes:
1. Personal reflection: Engineer documents their own growth
2. Knowledge building: Individual expertise becomes transparent
3. Mentoring: Others learn from individual's journey
4. Career documentation: Individual tracks their own skill development over time

Connects to Chapter 8 theme of systematic problem-solving building individual expertise that strengthens team capability.
</context>

<thinking>
Before documenting personal learning journey:
1. What challenge did I encounter?
2. What did I know at the start? What didn't I know?
3. How did I investigate and learn?
4. What key decisions did I make?
5. What skills did I develop?
6. What would I do differently next time?
7. What knowledge is worth sharing with team?
</thinking>

<output-format>

## Personal Learning Journey Documentation Pattern

```
# Personal Learning Journey: {{engineer_name}}

Engineer: {{engineer_name}}
Challenge: {{challenge_description}}
Period: {{learning_period}}
Date Documented: [YYYY-MM-DD]
Location: {{memory_bank_location}}

## Learning Journey Summary

**Challenge encountered:**
- [What was the problem or challenge?]
- [Why was it significant?]
- [How much time did this take?]

**Key learnings:**
- [Learning 1]
- [Learning 2]
- [Learning 3]

**Skills developed:**
- [Skill 1]: [How developed]
- [Skill 2]: [How developed]

**Potential team contribution:**
- [What knowledge worth sharing?]
```

---

## Challenge Context Pattern

```
## Part 1: Challenge Context

### The Challenge

**What was the problem:**
- [Clear description of challenge]
- [Why it mattered]
- [Urgency level]

**Context when I started:**
- [What was already working]
- [What was broken or unclear]
- [Constraints I was working within]

**My knowledge baseline:**
- What I knew going in:
  - [Domain knowledge I had]
  - [Technical knowledge I had]
  - [Tools/technologies I knew]

- What I didn't know:
  - [Knowledge gaps I discovered]
  - [Surprises I encountered]
  - [Assumptions that proved wrong]

**Why this challenge mattered to me:**
- [Why I cared about solving this]
- [What success would mean]
- [Personal growth opportunity I saw]

### Investigation Approach

**How I started investigating:**
- [First steps I took]
- [Where I looked for information]
- [Assumptions I started with]

**Key decision points:**
- Decision 1: [Choice I had to make]
  - Options I considered: [Option A / Option B]
  - How I decided: [What helped me choose]
  - Result: [What happened after I chose]
  - Learning: [What this taught me]

- Decision 2: [Choice I had to make]
  - [Same structure]

```

---

## Learning Capture Pattern

```
## Part 2: Learning Captured

### Technical Learning

Technical insight 1: [What I learned]
- What it is: [Explanation of concept/pattern]
- Why it matters: [Relevance to work]
- How I discovered it: [Story of discovery]
- How I'll apply it: [Future applications]

Technical insight 2: [What I learned]
- [Same structure]

### Problem-Solving Approach

Approach I developed:
1. [Step in my investigation process]
2. [Step in my investigation process]
3. [Step in my investigation process]
4. [Step in my investigation process]

When to use this approach:
- [Situations where this applies]

When not to use:
- [Situations where this doesn't apply]

### Debugging/Investigation Techniques

Techniques I used:
- Technique 1: [What I used]
  - How it helped: [Benefit]
  - When to use: [When applicable]

- Technique 2: [What I used]
  - [Same structure]

### What I Got Wrong

Initial assumption 1: [What I thought]
- Why I thought it: [My reasoning]
- What actually happened: [Reality]
- How this changed my thinking: [Adjusted understanding]

Initial assumption 2: [What I thought]
- [Same structure]

```

---

## Skills Development Pattern

```
## Part 3: Skills Developed

### Skill 1: [Skill name]

**What it is:** [Definition of skill]

**How I developed it:**
- Through [activity 1]: [What this taught me]
- Through [activity 2]: [What this taught me]
- Through [activity 3]: [What this taught me]

**Evidence of development:**
- Before this challenge: [Where I started]
- After this challenge: [Where I am now]
- How I know I improved: [Measurable evidence]

**Next level of mastery:**
- What would deeper mastery look like?
- How will I continue developing this skill?

### Skill 2: [Skill name]
- [Same structure]

### Skill 3: [Skill name]
- [Same structure]

### Collaboration Learning

How I worked with others:
- Pair programming with [person]: [What I learned from collaboration]
- Code review with [person]: [Feedback I received and learned from]
- Discussion with [person]: [Insight gained from their perspective]

What this taught me about teamwork:
- [Learning 1]
- [Learning 2]

```

---

## Lessons and Reflection Pattern

```
## Part 4: Lessons and Reflection

### What I'd Do Differently

If I encountered this challenge again:
- [What I'd do differently]
- [How this would improve outcomes]
- [Why I'd make this choice differently]

What I'd do the same:
- [What worked well, keep doing]
- [Why these approaches proved effective]

### Growth Insights

How this challenge changed my thinking:
- [Belief or assumption that evolved]
- [Why my perspective shifted]
- [How this affects my approach to future work]

Confidence level on this topic:
- Before: [1-5 scale, description]
- After: [1-5 scale, description]
- What would help me gain more confidence:
  - [Experience I need]
  - [Knowledge I need]
  - [Exposure I need]

### Broader Learning

How this connects to other knowledge:
- This challenge connects to [previous learning] because [connection]
- This extends my understanding of [domain] in [way]
- This reinforces [principle or pattern]

```

---

## Knowledge Contribution Pattern

```
## Part 5: Potential Team Contribution

### Knowledge Worth Sharing

Knowledge I gained that could help teammates:
- [Knowledge 1]: [Why valuable for team]
- [Knowledge 2]: [Why valuable for team]
- [Knowledge 3]: [Why valuable for team]

### Teaching/Mentoring Opportunity

If I were teaching someone else this:
- Key concepts I'd emphasize: [Concept 1, Concept 2, Concept 3]
- Common mistakes to avoid: [Mistake 1, Mistake 2, Mistake 3]
- Hands-on exercises: [Exercise 1, Exercise 2]

### Potential Documentation

Documentation that would help team:
- [Type of documentation]
- [What it would cover]
- [Who would benefit]

### Team Pairing Opportunity

Who on team might benefit from my learning:
- [Teammate 1]: [Why, what they'd learn]
- [Teammate 2]: [Why, what they'd learn]

### Pattern for Reuse

Is this a pattern other engineers should learn?
- [Yes / No]
- If yes: How should we capture and share this?
- If no: Why not? (one-time learning vs. systematic pattern)

```

---

## Example: Personal Learning Journey

```markdown
# Personal Learning Journey: Alex Chen

Challenge: Debugging production payment processing performance issue
Period: January 2026 (Sprint 23)
Date Documented: Jan 29, 2026

## Learning Journey Summary

**Challenge encountered:**
- Payment API latency spiked from 200ms p95 to 1000ms+ during Jan 28 traffic spike
- Root cause investigation revealed serialized Stripe API calls (should have been parallelizable)
- This incident triggered major architectural rethinking about event-driven architecture
- Spent ~20 hours investigating, implementing circuit breaker solution

**Key learnings:**
- Circuit breaker pattern is empirical, not theoretical (load testing essential for tuning)
- Parallelization can be hidden opportunity in seemingly sequential processes
- Production incidents can reveal architectural blindspots

**Skills developed:**
- Load testing under realistic failure conditions
- Circuit breaker pattern implementation and tuning
- Production incident investigation and root cause analysis

**Potential team contribution:**
- Circuit breaker tuning approach could be reused for other services
- Load testing methodology for validating resilience patterns
- Investigation techniques for performance debugging

---

## Challenge Context

### The Challenge

**What was the problem:**
- Payment API latency increased from 200ms to 1000ms+ during Jan 28 traffic spike
- Issue resolved when traffic dropped, suggesting capacity/bottleneck
- Happened during critical business moment (end of day payment surge)

**Context:**
- PaymentAPI had recently scaled to handle 3000 tx/sec (from 1000)
- New Stripe integration with 8 concurrent connection limit
- System under high load during end-of-day payment surge

**My knowledge baseline:**
- Knew payment flow: Stripe API call → DB update → notification
- Didn't know: Why this would cause latency spike under load
- Didn't know: Circuit breaker patterns or resilience engineering
- Assumed: Stripe API calls naturally parallelized (they don't—connection limited)

**Why this mattered to me:**
- First time debugging production performance issue
- Opportunity to understand system under stress
- Chance to learn resilience patterns

### Investigation Approach

**How I started:**
- Checked system metrics: CPU/memory normal, database responsive
- Looked at request traces: Stripe API call taking 800ms instead of usual 100ms
- Talked to team about patterns—Morgan suggested circuit breaker

**Key decision points:**
- Decision 1: Is this load testing or production debugging?
  - Options: Fix immediately vs. understand root cause before fixing
  - Chose: Understand root cause (risk: issue could happen again)
  - Result: Found architectural issue, not just overload

- Decision 2: Should we implement circuit breaker?
  - Options: Retry with backoff / Circuit breaker / Accept degradation
  - Chose: Circuit breaker (most appropriate for dependency failures)
  - Result: Improved reliability beyond just fixing latency

- Decision 3: How to tune circuit breaker thresholds?
  - Options: Theory-based tuning / Load testing with failure injection
  - Chose: Load testing (empirical approach better)
  - Result: Discovered theory-based thresholds too aggressive

---

## Learning Captured

### Technical Insights

Technical insight 1: Circuit breaker thresholds are empirical, not theoretical
- What it is: Thresholds (error rate to open, request count to evaluate, timeout to half-open) must be tuned to actual failure modes and traffic patterns
- Why it matters: Poor thresholds cause false positives (opens unnecessarily) or false negatives (doesn't protect)
- How I discovered it: Tested circuit breaker with theoretical thresholds in load test, circuit opened during normal transient failures
- How I'll apply it: Any future circuit breaker implementation will include load testing with realistic failure injection

Technical insight 2: Stripe API connection limit is hidden bottleneck
- What it is: Stripe API has 8 concurrent connection limit, payment processing doesn't parallelize beyond 8 concurrent requests
- Why it matters: This is hard capacity limit (not CPU/memory bound), requires queue-based solution to exceed
- How I discovered it: Found in Stripe documentation during investigation, confirmed in load tests
- How I'll apply it: Future scale planning will account for external API limits, not just internal resources

### Problem-Solving Approach

Approach I developed:
1. Check system metrics first (CPU/memory/disk normal?)
2. Check request traces (where does latency come from?)
3. Check dependency performance (are external services slow?)
4. Reproduce in load test (can I replicate issue?)
5. Implement fix incrementally (test each change)

When to use:
- Any latency spike issue
- When cause isn't obvious from metrics

When not to use:
- Availability issues (different approach)
- Data correctness issues (different approach)

### Debugging Techniques

- Technique 1: Request tracing with correlation IDs
  - How it helped: Could follow single request through payment system, saw where time spent
  - When to use: When investigating request latency

- Technique 2: Load testing with failure injection
  - How it helped: Reproduced issue safely in test environment, could tune thresholds
  - When to use: When validating resilience patterns

### What I Got Wrong

Initial assumption 1: Stripe API calls naturally parallelize
- Why I thought it: Assumed load balancer would handle parallelization
- What actually happened: Load balancer distributes across payment processors, but each processor serializes Stripe calls
- How this changed my thinking: Parallelization requires architectural decision (async queues), not automatic

Initial assumption 2: Circuit breaker is simple pattern
- Why I thought it: Seemed straightforward in textbooks
- What actually happened: Threshold tuning is complex, empirical approach necessary
- How this changed my thinking: Patterns work differently in practice than in theory

---

## Skills Developed

### Skill 1: Load Testing Under Realistic Conditions

**What it is:** Ability to design and execute load tests that reproduce realistic failure modes and traffic patterns

**How I developed it:**
- Through pair programming with Casey (architect) who taught load testing approach
- Through iterating thresholds based on test results (failed 3 times before getting right configuration)
- Through analyzing load test metrics (latency distribution, error patterns, resource utilization)

**Evidence of development:**
- Before: Never designed load test, didn't know how to inject failures
- After: Designed load test that caught circuit breaker threshold issues before production
- How I know I improved: Successfully predicted production circuit breaker behavior based on load test results

**Next level:**
- Automated load testing in CI pipeline
- Performance regression testing
- Chaos engineering approaches

### Skill 2: Circuit Breaker Pattern Implementation

**What it is:** Ability to implement circuit breaker pattern for resilience, including design decisions and threshold tuning

**How I developed it:**
- Through implementing circuit breaker with Resilience4j (tried 3 different configurations)
- Through code review with Morgan who explained pattern tradeoffs
- Through debugging production incidents related to circuit breaker

**Evidence of development:**
- Before: Didn't know what circuit breaker was
- After: Implemented circuit breaker, tuned thresholds, explained pattern to team
- How I know: Team now uses my implementation as reference for future circuit breakers

### Skill 3: Production Incident Investigation

**What it is:** Ability to systematically investigate production issues and identify root causes

**How I developed it:**
- Through investigating this specific incident (20 hours investigation)
- Through working with Morgan and Casey who asked good diagnostic questions
- Through analyzing traces and metrics systematically

**Evidence:**
- Before: Hadn't investigated production issue before
- After: Led incident investigation from detection to resolution
- How I know: Team asked me to lead subsequent investigation in Feb

---

## Lessons and Reflection

### What I'd Do Differently

If I encountered latency issue again:
- Start with load testing earlier (don't wait for production issue)
- Involve architecture team in investigation from start (not after finding issue)

What I'd do the same:
- Take time to understand root cause (not just fix symptom)
- Involve team in investigation (learned from different perspectives)

### Growth Insights

How this changed my thinking:
- Production incidents aren't failures—they're learning opportunities
- System design becomes visible under production stress (theoretical understanding != production reality)
- Resilience patterns require empirical validation, not just theoretical design

Confidence level:
- Before: 2/5 (knew payment flow, didn't understand scale challenges)
- After: 4/5 (understand circuit breaker, load testing, Stripe limits)
- What would help more: Experience implementing other resilience patterns (timeouts, bulkheads, etc.)

### Knowledge Worth Sharing

- Circuit breaker tuning approach (how to empirically determine thresholds)
- Load testing methodology for resilience validation
- Stripe API limits and implications for architecture

### Team Pairing Opportunity

- Jordan (implementing different service) could learn circuit breaker pattern
- Casey could get load testing feedback on my approach
```
```

</output-format>

<instructions>
CRITICAL: Personal learning journey is about individual growth and reflection, not just documenting what happened.

DO NOT:
- Make it purely technical (focus on learning and growth)
- Skip the mistakes and wrong assumptions (learning includes course-correction)
- Treat as individual achievement (frame as collective learning opportunity)
- Forget to reflect on growth (compare before/after)
- Miss opportunity to contribute learnings to team

ALWAYS:
- Focus on what you learned and how you grew
- Document decision points and why you chose each path
- Capture techniques you developed
- Reflect on what you'd do differently
- Identify knowledge worth sharing with team
- Connect to broader patterns and principles
- Be honest about what you didn't know

REMEMBER: Personal learning journeys are most valuable when honest about starting point, investigation process, and growth trajectory. They become team assets when you identify learnings worth sharing.
</instructions>

<examples>

[See template example above showing Alex Chen's circuit breaker learning journey - demonstrates challenge context, investigation approach, technical insights, skills developed, growth reflection, and knowledge contribution]

</examples>
