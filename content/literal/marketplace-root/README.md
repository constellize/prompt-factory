# Constellize Marketplace

Official Constellize methodology plugins for Claude Code.

## Overview

This marketplace provides the complete Constellize methodology as Claude Code plugins:
- **75 Skills** across 6 plugins
- **14 Agents** for expert-in-role consultation

## Quick Start

Add this marketplace to Claude Code:

```bash
/plugin marketplace add constellize/constellize-plugins-official
```

This command follows `main`, the 2.0 line. To stay on the stable 1.x line that the book and
website describe, add the `#v1` ref instead: `/plugin marketplace add constellize/constellize-plugins-official#v1`.

Then install plugins via `/plugin` and select the ones you want.

To get started on any project, run:

```
/constellize-harness:orchestrate
```

This assesses your project state, proposes a plan, and walks you through executing it.

## Available Plugins

| Plugin | Skills | Description |
|--------|--------|-------------|
| `constellize-harness` | 5 | **Start here.** Project orchestration — assess state, plan next steps, execute skills |
| `constellize-memory` | 11 | Knowledge persistence across context resets |
| `constellize-design` | 10 | Planning and architecture for software projects |
| `constellize-craft` | 21 | Code quality, testing, and continuous excellence |
| `constellize-deliver` | 12 | Deployment, operations, and incident management |
| `constellize-grow` | 16 | Team learning, system evolution, and adoption |

### Harness Skills

| Skill | Purpose |
|-------|---------|
| `orchestrate` | Main entry point — assess, plan, and execute in one flow |
| `assess` | Standalone project state diagnostic |
| `plan` | Generate a skill sequence from assessment + intent |
| `execute` | Run an approved plan step by step |
| `init` | Scaffold the `llm/` directory structure |

## Project Structure

All LLM-generated artifacts live under `llm/` in your project:

```
project-root/
  llm/
    memory-bank/      # persistent project knowledge (6 core files)
    construction/     # temporary working area for design artifacts
      design/
      requirements/
      archive/
    features/         # per-feature documentation subsets
```

## Source

Generated from [prompt-factory](https://github.com/constellize/prompt-factory).

## License

MIT
