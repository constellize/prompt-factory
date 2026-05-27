#!/usr/bin/env npx ts-node

/**
 * Generate Claude Code marketplace output from unified content
 *
 * Outputs to: ../marketplace/
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

const MARKETPLACE_DIR = '../marketplace';

/**
 * Derive a short skill directory name from a prompt ID.
 * Strips common verb prefixes that are redundant with the plugin context.
 */
function deriveShortSkillName(promptId: string, pluginId: string): string {
  // Check special cases first (complex IDs that need manual mapping)
  const specialCases: Record<string, string> = {
    'recover-from-staleness-drift': 'recover-staleness',
    'recover-from-noise-accumulation': 'recover-noise',
    'recover-from-abandonment': 'recover-abandonment',
    'ch1-system-prompt-for-requirements-engineering-analysi': 'requirements-analysis',
    'establish-stewardship-practices': 'establish-stewardship',
    'pre-commit-review': 'pre-commit',
    'pre-merge-review': 'pre-merge',
    'pre-deployment-review': 'pre-deployment',
    'externalize-configuration': 'externalize-config',
    'query-operational-knowledge-during-incidents': 'incident-query',
    'cross-reference-operational-dependencies': 'cross-reference',
    'discover-organizational-knowledge-connections': 'knowledge-connections',
    'document-personal-learning-journey': 'personal-learning',
    'evolve-requirements-from-implementation': 'evolve-requirements',
    'create-memory-bank-training-exercise': 'training-exercise',
    'guide-first-week-adoption': 'first-week',
    'onboard-team-to-memory-banks': 'onboard-team',
    'grow-memory-bank-organically': 'grow-organically',
    'assess-system-health-over-time': 'health-assessment',
    'assess-operational-knowledge-health': 'knowledge-health',
    'design-proactive-operational-architecture': 'proactive-architecture',
    'establish-operational-memory-bank': 'operational-memory-bank',
  };

  if (specialCases[promptId]) {
    return specialCases[promptId];
  }

  // Extract the domain from plugin ID (e.g., "constellize:memory" -> "memory")
  const domain = pluginId.split(':').pop() || '';

  // Strip domain-specific suffixes
  const domainSuffixes: Record<string, string[]> = {
    memory: ['-memory-bank'],
    deliver: ['-operational', '-operation'],
  };

  let name = promptId;
  for (const suffix of domainSuffixes[domain] || []) {
    if (name.endsWith(suffix)) {
      name = name.slice(0, -suffix.length);
      break;
    }
  }

  // Strip common verb prefixes that add no information
  const verbPrefixes = [
    'write-', 'implement-', 'validate-', 'achieve-', 'ensure-',
    'maintain-', 'establish-', 'foster-', 'track-', 'leverage-',
    'build-', 'create-', 'document-', 'capture-', 'conduct-',
    'discover-', 'detect-', 'surface-', 'design-', 'assess-',
    'query-', 'diagnose-', 'guide-', 'onboard-', 'grow-',
    'evolve-', 'cross-reference-'
  ];

  for (const prefix of verbPrefixes) {
    if (name.startsWith(prefix) && name.length > prefix.length + 1) {
      name = name.slice(prefix.length);
      break;
    }
  }

  return name;
}

/**
 * Generate SKILL.md content from a prompt
 */
function generateSkillMd(prompt: Prompt, pluginId: string): string {
  const fm = prompt.frontmatter;
  const skill = fm.skill;

  // Build YAML frontmatter for SKILL.md
  const shortName = deriveShortSkillName(fm.id, pluginId);
  const frontmatter = [
    '---',
    `name: ${pluginId}:${shortName}`,
    `description: ${(skill?.description || fm.name || '').replace(/\n/g, ' ').trim()}`,
    `prompt-id: ${fm.id}`
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
    `description: ${String(description).replace(/\n/g, ' ').trim()}`,
    `persona-id: ${fm.id}`
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
function generatePluginJson(plugin: PluginDefinition): object {
  return {
    name: plugin.id,
    version: '1.0.0',
    description: plugin.description,
    author: {
      name: 'Constellize'
    }
  };
}

/**
 * Generate marketplace.json for the marketplace root
 */
function generateMarketplaceJson(plugins: PluginDefinition[]): object {
  return {
    name: 'constellize-plugins-official',
    owner: {
      name: 'Constellize'
    },
    description: 'Official Constellize methodology plugins for Claude Code',
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
    const shortName = deriveShortSkillName(prompt.frontmatter.id, plugin.id);
    const skillDir = path.join(skillsDir, shortName);
    fs.mkdirSync(skillDir, { recursive: true });

    const skillMd = generateSkillMd(prompt, plugin.id);
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillMd);
  }

  // Generate agents
  for (const persona of aggregatePersonas) {
    const agentId = persona.frontmatter.subcategory;
    const agentMd = generateAgentMd(persona);
    fs.writeFileSync(path.join(agentsDir, `${agentId}.md`), agentMd);
  }

  // Generate plugin.json
  const pluginJson = generatePluginJson(plugin);
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
- **${totalSkills} Skills** across ${plugins.length} plugins
- **${totalAgents} Agents** for expert-in-role consultation

## Installation

Add this marketplace to Claude Code:

\`\`\`bash
/plugin marketplace add constellize/marketplace
\`\`\`

Then install individual plugins:

\`\`\`bash
/plugin install constellize:memory
/plugin install constellize:craft
\`\`\`

## Available Plugins

| Plugin | Description |
|--------|-------------|
${plugins.map(p => `| \`${p.id}\` | ${p.description} |`).join('\n')}

## Source

Generated from [prompt-factory](https://github.com/constellize/prompt-factory).

## License

MIT
`;
}

main();
