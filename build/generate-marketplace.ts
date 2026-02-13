#!/usr/bin/env npx ts-node

/**
 * Generate Claude Code marketplace output from unified content
 *
 * Outputs to: ../constellize-marketplace/
 * Structure:
 *   plugins/
 *     <plugin-id>/
 *       .claude-plugin/plugin.json
 *       skills/<skill-id>/SKILL.md
 *       agents/<agent-id>.md
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  loadPrompts,
  loadPersonas,
  loadPluginsConfig,
  getPromptsForPlugin,
  getPersonasForPlugin,
  getAggregatePersonas
} from './lib/parser';
import { Prompt, Persona, PluginDefinition, PluginsConfig } from './lib/types';

const MARKETPLACE_DIR = '../constellize-marketplace';

/**
 * Generate SKILL.md content from a prompt
 */
function generateSkillMd(prompt: Prompt): string {
  const fm = prompt.frontmatter;
  const skill = fm.skill;

  // Build YAML frontmatter for SKILL.md
  const frontmatter = [
    '---',
    `name: ${fm.id}`,
    `description: ${(skill?.description || fm.name || '').replace(/\n/g, ' ').trim()}`
  ];

  if (skill?.['argument-hint']) {
    frontmatter.push(`argument-hint: "${skill['argument-hint']}"`);
  }

  if (skill?.['allowed-tools'] && skill['allowed-tools'].length > 0) {
    frontmatter.push(`allowed-tools: ${skill['allowed-tools'].join(', ')}`);
  }

  if (skill?.model && skill.model !== 'inherit') {
    frontmatter.push(`model: ${skill.model}`);
  }

  if (skill?.context === 'fork') {
    frontmatter.push('context: fork');
  }

  if (skill?.['user-invocable'] === false) {
    frontmatter.push('user-invocable: false');
  }

  if (skill?.['disable-model-invocation'] === true) {
    frontmatter.push('disable-model-invocation: true');
  }

  frontmatter.push('---');

  // Transform variables to $ARGUMENTS format
  let content = prompt.content;
  if (fm.variables && fm.variables.length > 0) {
    for (const v of fm.variables) {
      const placeholder = `{{${v.name}}}`;
      const argRef = v['maps-to'] || `$${fm.variables.indexOf(v)}`;
      content = content.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), argRef);
    }
  }

  return frontmatter.join('\n') + '\n\n' + content;
}

/**
 * Generate agent markdown from a persona
 */
function generateAgentMd(persona: Persona): string {
  const fm = persona.frontmatter;
  const agent = fm.agent;

  // Use subcategory as the agent name for better clarity
  const agentName = fm.subcategory;
  // Get description from agent config, or generate from name/title
  const description = agent?.description || fm.title || fm.name || agentName;

  // Build YAML frontmatter for agent
  const frontmatter = [
    '---',
    `name: ${agentName}`,
    `description: ${String(description).replace(/\n/g, ' ').trim()}`
  ];

  if (agent?.tools && agent.tools.length > 0) {
    frontmatter.push(`tools: ${agent.tools.join(', ')}`);
  }

  if (agent?.['disallowed-tools'] && agent['disallowed-tools'].length > 0) {
    frontmatter.push(`disallowedTools: ${agent['disallowed-tools'].join(', ')}`);
  }

  if (agent?.model && agent.model !== 'inherit') {
    frontmatter.push(`model: ${agent.model}`);
  }

  if (agent?.skills && agent.skills.length > 0) {
    frontmatter.push('skills:');
    for (const skill of agent.skills) {
      frontmatter.push(`  - ${skill}`);
    }
  }

  if (agent?.['max-turns']) {
    frontmatter.push(`maxTurns: ${agent['max-turns']}`);
  }

  if (agent?.['permission-mode'] && agent['permission-mode'] !== 'default') {
    frontmatter.push(`permissionMode: ${agent['permission-mode']}`);
  }

  frontmatter.push('---');

  return frontmatter.join('\n') + '\n\n' + persona.content;
}

/**
 * Generate plugin.json for a plugin
 */
function generatePluginJson(plugin: PluginDefinition, promptCount: number, agentCount: number): object {
  return {
    name: plugin.id,
    version: '1.0.0',
    description: plugin.description,
    author: {
      name: 'Constellize',
      url: 'https://constellize.com'
    },
    keywords: [
      'constellize',
      plugin.id.replace('constellize-', ''),
      ...(plugin.chapter ? [`chapter-${plugin.chapter}`] : [])
    ],
    skills: './skills/',
    agents: './agents/'
  };
}

/**
 * Generate marketplace.json for the marketplace root
 */
function generateMarketplaceJson(plugins: PluginDefinition[]): object {
  return {
    name: 'constellize-marketplace',
    owner: {
      name: 'Constellize',
      url: 'https://constellize.com'
    },
    description: 'Official Constellize methodology plugins for Claude Code - prompts become skills, personas become agents',
    plugins: plugins.map(p => ({
      name: p.id,
      source: `./plugins/${p.id}`,
      description: p.description
    }))
  };
}

/**
 * Generate a single plugin's output
 */
function generatePlugin(
  plugin: PluginDefinition,
  prompts: Prompt[],
  personas: Persona[],
  allPlugins: PluginDefinition[]
): { skillCount: number; agentCount: number } {
  const pluginDir = path.join(MARKETPLACE_DIR, 'plugins', plugin.id);
  const skillsDir = path.join(pluginDir, 'skills');
  const agentsDir = path.join(pluginDir, 'agents');

  // Create directories
  fs.mkdirSync(path.join(pluginDir, '.claude-plugin'), { recursive: true });
  fs.mkdirSync(skillsDir, { recursive: true });
  fs.mkdirSync(agentsDir, { recursive: true });

  // Get prompts and personas for this plugin
  const pluginPrompts = getPromptsForPlugin(prompts, plugin.id, allPlugins);
  const pluginPersonas = getPersonasForPlugin(personas, plugin.id, allPlugins);

  // For agents, we only want aggregates (one per subcategory)
  const aggregatePersonas = getAggregatePersonas(pluginPersonas);

  // Generate skills
  for (const prompt of pluginPrompts) {
    const skillDir = path.join(skillsDir, prompt.frontmatter.id);
    fs.mkdirSync(skillDir, { recursive: true });

    const skillMd = generateSkillMd(prompt);
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillMd);
  }

  // Generate agents
  for (const persona of aggregatePersonas) {
    const agentId = persona.frontmatter.subcategory;
    const agentMd = generateAgentMd(persona);
    fs.writeFileSync(path.join(agentsDir, `${agentId}.md`), agentMd);
  }

  // Generate plugin.json
  const pluginJson = generatePluginJson(plugin, pluginPrompts.length, aggregatePersonas.length);
  fs.writeFileSync(
    path.join(pluginDir, '.claude-plugin', 'plugin.json'),
    JSON.stringify(pluginJson, null, 2)
  );

  return {
    skillCount: pluginPrompts.length,
    agentCount: aggregatePersonas.length
  };
}

/**
 * Main execution
 */
function main() {
  console.log('Generating Claude Code marketplace output...\n');

  // Create marketplace directory
  fs.mkdirSync(MARKETPLACE_DIR, { recursive: true });

  // Load content and config
  const prompts = loadPrompts('content');
  const personas = loadPersonas('content');
  const config = loadPluginsConfig('content');

  console.log(`Loaded ${prompts.length} prompts and ${personas.length} personas`);
  console.log(`Found ${config.plugins.length} plugin definitions\n`);

  // Track totals
  let totalSkills = 0;
  let totalAgents = 0;

  // Generate each plugin
  for (const plugin of config.plugins) {
    const { skillCount, agentCount } = generatePlugin(plugin, prompts, personas, config.plugins);
    console.log(`✓ ${plugin.id}: ${skillCount} skills, ${agentCount} agents`);
    totalSkills += skillCount;
    totalAgents += agentCount;
  }

  // Generate marketplace.json at root
  const marketplaceJson = generateMarketplaceJson(config.plugins);
  fs.mkdirSync(path.join(MARKETPLACE_DIR, '.claude-plugin'), { recursive: true });
  fs.writeFileSync(
    path.join(MARKETPLACE_DIR, '.claude-plugin', 'marketplace.json'),
    JSON.stringify(marketplaceJson, null, 2)
  );
  console.log(`\n✓ marketplace.json`);

  // Generate README
  const readme = generateReadme(config.plugins, totalSkills, totalAgents);
  fs.writeFileSync(path.join(MARKETPLACE_DIR, 'README.md'), readme);
  console.log(`✓ README.md`);

  console.log('\n--- Complete ---');
  console.log(`Generated ${config.plugins.length} plugins with ${totalSkills} skills and ${totalAgents} agents`);
}

/**
 * Generate README for the marketplace
 */
function generateReadme(plugins: PluginDefinition[], totalSkills: number, totalAgents: number): string {
  return `# Constellize Marketplace

Official Constellize methodology plugins for Claude Code.

## Overview

This marketplace provides the complete Constellize methodology as Claude Code plugins:
- **${totalSkills} Skills** - Prompts become slash commands (\`/establish-memory-bank\`)
- **${totalAgents} Agents** - Personas become expert consultants (\`@system-architect\`)

## Installation

Add this marketplace to Claude Code:

\`\`\`bash
/plugin marketplace add constellize/constellize-marketplace
\`\`\`

Then install individual plugins:

\`\`\`bash
/plugin install constellize-memory-bank
/plugin install constellize-architecture
\`\`\`

## Available Plugins

| Plugin | Description | Skills | Agents |
|--------|-------------|--------|--------|
${plugins.map(p => `| ${p.id} | ${p.description} | ✓ | ✓ |`).join('\n')}

## Usage

### Skills (Prompts)

Skills are invoked with slash commands:

\`\`\`
/establish-memory-bank "My Project"
/constellation-map
/write-unit-tests
\`\`\`

### Agents (Personas)

Agents are invoked with @ mentions:

\`\`\`
@system-architect review this architecture
@qa-engineer what test cases am I missing?
@devops-engineer how should I deploy this?
\`\`\`

### Combined Usage

Combine skills with agents for expert-guided execution:

\`\`\`
@system-architect /constellation-map
\`\`\`

## Source

This marketplace is generated from [prompt-factory](https://github.com/constellize/prompt-factory), which serves as the single source of truth for all Constellize prompts and personas.

## License

MIT
`;
}

main();
