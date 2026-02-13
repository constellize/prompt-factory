#!/usr/bin/env npx ts-node

/**
 * Migration script to copy personas from website-starter and add frontmatter
 *
 * Reads from: ../website-starter/public/personas/
 * Writes to: content/personas/
 */

import * as fs from 'fs';
import * as path from 'path';

const WEBSITE_STARTER = '../website-starter';
const PERSONAS_SOURCE = path.join(WEBSITE_STARTER, 'public/personas');
const PERSONAS_TARGET = 'content/personas';

// Category mapping (folder name to schema category)
const categoryMap: Record<string, string> = {
  'design_architecture': 'design-architecture',
  'development': 'development',
  'operations_deployment': 'operations-deployment',
  'planning_requirements': 'planning-requirements',
  'quality_testing': 'quality-testing'
};

// Subcategory mapping (folder name to schema subcategory)
const subcategoryMap: Record<string, string> = {
  'system_architects': 'system-architects',
  'data_specialists': 'data-specialists',
  'ux_ui_designers': 'ux-ui-designers',
  'software_engineers': 'software-engineers',
  'specialized_engineers': 'specialized-engineers',
  'devops_engineers': 'devops-engineers',
  'release_engineers': 'release-engineers',
  'product_managers': 'product-managers',
  'requirements_analysts': 'requirements-analysts',
  'qa_engineers': 'qa-engineers',
  'security_engineers': 'security-engineers',
  'performance_engineers': 'performance-engineers'
};

// Plugin mapping
const subcategoryToPlugin: Record<string, string> = {
  'system-architects': 'constellize-architecture',
  'data-specialists': 'constellize-architecture',
  'ux-ui-designers': 'constellize-architecture',
  'software-engineers': 'constellize-development',
  'specialized-engineers': 'constellize-development',
  'devops-engineers': 'constellize-deployment',
  'release-engineers': 'constellize-deployment',
  'product-managers': 'constellize-planning',
  'requirements-analysts': 'constellize-planning',
  'qa-engineers': 'constellize-quality',
  'security-engineers': 'constellize-quality',
  'performance-engineers': 'constellize-quality'
};

// Tool recommendations based on subcategory
const subcategoryToTools: Record<string, { tools: string[], disallowed: string[] }> = {
  'system-architects': {
    tools: ['Read', 'Glob', 'Grep', 'WebSearch'],
    disallowed: ['Write', 'Edit', 'Bash']
  },
  'data-specialists': {
    tools: ['Read', 'Glob', 'Grep', 'Bash'],
    disallowed: []
  },
  'ux-ui-designers': {
    tools: ['Read', 'Glob', 'WebSearch'],
    disallowed: ['Bash']
  },
  'software-engineers': {
    tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'],
    disallowed: []
  },
  'specialized-engineers': {
    tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'],
    disallowed: []
  },
  'devops-engineers': {
    tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'],
    disallowed: []
  },
  'release-engineers': {
    tools: ['Read', 'Glob', 'Grep', 'Bash'],
    disallowed: ['Write', 'Edit']
  },
  'product-managers': {
    tools: ['Read', 'Glob', 'Grep', 'WebSearch'],
    disallowed: ['Write', 'Edit', 'Bash']
  },
  'requirements-analysts': {
    tools: ['Read', 'Glob', 'Grep'],
    disallowed: ['Write', 'Edit', 'Bash']
  },
  'qa-engineers': {
    tools: ['Read', 'Glob', 'Grep', 'Bash'],
    disallowed: ['Write', 'Edit']
  },
  'security-engineers': {
    tools: ['Read', 'Glob', 'Grep', 'Bash'],
    disallowed: ['Write', 'Edit']
  },
  'performance-engineers': {
    tools: ['Read', 'Glob', 'Grep', 'Bash'],
    disallowed: []
  }
};

// Model recommendations
const subcategoryToModel: Record<string, string> = {
  'system-architects': 'opus',
  'data-specialists': 'sonnet',
  'ux-ui-designers': 'sonnet',
  'software-engineers': 'sonnet',
  'specialized-engineers': 'opus',
  'devops-engineers': 'sonnet',
  'release-engineers': 'sonnet',
  'product-managers': 'sonnet',
  'requirements-analysts': 'sonnet',
  'qa-engineers': 'sonnet',
  'security-engineers': 'opus',
  'performance-engineers': 'sonnet'
};

// Skills to pre-load for each subcategory
const subcategoryToSkills: Record<string, string[]> = {
  'system-architects': ['constellation-map', 'gap-analysis', 'implementation-sketch'],
  'data-specialists': [],
  'ux-ui-designers': [],
  'software-engineers': ['write-unit-tests', 'write-integration-tests'],
  'specialized-engineers': [],
  'devops-engineers': ['build-reliable-containers', 'externalize-configuration'],
  'release-engineers': ['implement-rollback-capability'],
  'product-managers': ['business-problem', 'vision-statement', 'ecosystem-map'],
  'requirements-analysts': ['specification', 'raci-matrix'],
  'qa-engineers': ['write-unit-tests', 'write-integration-tests', 'validate-test-coverage'],
  'security-engineers': [],
  'performance-engineers': []
};

interface MigrationResult {
  success: boolean;
  source: string;
  target: string;
  error?: string;
}

function extractNameFromContent(content: string): string {
  // Try to extract name from first H1
  const h1Match = content.match(/^#\s+(.+?)(?:\s*-|$)/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  return 'Unknown';
}

function extractTitleFromContent(content: string): string {
  // Try to extract title from content
  const titleMatch = content.match(/(?:MEGA_PROMPT|You are (?:a |an )?)([\w\s]+?)(?:\s*who|\s*ensuring|\s*with|\.|$)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return 'Expert';
}

function generateDescription(subcategory: string, isAggregate: boolean): string {
  const descriptions: Record<string, string> = {
    'system-architects': 'Expert system architect for design decisions, architecture reviews, and technical direction. Delegate when discussing system structure, scalability, or technical trade-offs.',
    'data-specialists': 'Expert in data modeling, storage strategies, and data architecture. Delegate when designing data structures, optimizing queries, or planning data flows.',
    'ux-ui-designers': 'Expert in user experience and interface design. Delegate when discussing user flows, accessibility, or visual design patterns.',
    'software-engineers': 'Expert software engineer for implementation, code review, and best practices. Delegate when writing code, debugging, or discussing implementation details.',
    'specialized-engineers': 'Expert in specialized engineering domains. Delegate for domain-specific technical challenges.',
    'devops-engineers': 'Expert in CI/CD, infrastructure, and operational excellence. Delegate when discussing deployment, monitoring, or infrastructure automation.',
    'release-engineers': 'Expert in release management and deployment strategies. Delegate when planning releases, rollbacks, or change management.',
    'product-managers': 'Expert in product strategy and prioritization. Delegate when discussing product direction, user value, or roadmap decisions.',
    'requirements-analysts': 'Expert in requirements gathering and analysis. Delegate when clarifying requirements, writing specifications, or validating acceptance criteria.',
    'qa-engineers': 'Expert QA engineer for testing, validation, and quality assurance. Delegate when reviewing code quality, designing test strategies, or investigating bugs.',
    'security-engineers': 'Expert in security architecture and threat analysis. Delegate when reviewing security, threat modeling, or discussing vulnerabilities.',
    'performance-engineers': 'Expert in performance optimization and load testing. Delegate when profiling, optimizing, or discussing scalability.'
  };
  return descriptions[subcategory] || 'Expert consultant for specialized guidance.';
}

function migratePersona(
  sourcePath: string,
  category: string,
  subcategory: string,
  fileName: string
): MigrationResult {
  try {
    const content = fs.readFileSync(sourcePath, 'utf-8');
    const isAggregate = fileName.includes('Aggregate');

    // Convert file name to id
    const id = fileName
      .replace('.md', '')
      .replace('Aggregate_Expert_Synthesis', '_aggregate')
      .toLowerCase()
      .replace(/[_\s]+/g, '-');

    const schemaCategory = categoryMap[category] || category;
    const schemaSubcategory = subcategoryMap[subcategory] || subcategory;
    const plugin = subcategoryToPlugin[schemaSubcategory] || 'constellize-development';
    const toolConfig = subcategoryToTools[schemaSubcategory] || { tools: ['Read', 'Glob', 'Grep'], disallowed: [] };
    const model = subcategoryToModel[schemaSubcategory] || 'sonnet';
    const skills = subcategoryToSkills[schemaSubcategory] || [];

    const name = isAggregate ? `${schemaSubcategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} (Aggregate)` : extractNameFromContent(content);
    const title = isAggregate ? `Senior ${schemaSubcategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}` : extractTitleFromContent(content);

    // Build frontmatter
    const frontmatter = `---
# === Identity ===
id: ${id}
name: ${name}
title: ${title}
version: 1.0.0

# === Classification ===
category: ${schemaCategory}
subcategory: ${schemaSubcategory}
expertise: []
use-with: []

# === Agent Configuration (for Claude Code marketplace) ===
agent:
  description: >
    ${generateDescription(schemaSubcategory, isAggregate)}
  tools:
${toolConfig.tools.map(t => `    - ${t}`).join('\n')}
${toolConfig.disallowed.length > 0 ? `  disallowed-tools:\n${toolConfig.disallowed.map(t => `    - ${t}`).join('\n')}` : '  disallowed-tools: []'}
  model: ${model}
  skills:
${skills.length > 0 ? skills.map(s => `    - ${s}`).join('\n') : '    []'}
  max-turns: 15
  permission-mode: default

# === Aggregate Info ===
is-aggregate: ${isAggregate}
synthesized-from: []

# === Output Targets ===
outputs:
  website:
    include: true
    aggregate: ${isAggregate}
  marketplace:
    plugin: ${plugin}
---

`;

    const newContent = frontmatter + content;

    // Determine output path
    const targetDir = path.join(PERSONAS_TARGET, schemaCategory, schemaSubcategory);
    const targetFileName = isAggregate ? '_aggregate.md' : `${id}.md`;
    const targetPath = path.join(targetDir, targetFileName);

    // Create directory if needed
    fs.mkdirSync(targetDir, { recursive: true });

    // Write new file
    fs.writeFileSync(targetPath, newContent);

    return {
      success: true,
      source: sourcePath,
      target: targetPath
    };

  } catch (error) {
    return {
      success: false,
      source: sourcePath,
      target: '',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function main() {
  console.log('Migrating personas from website-starter...\n');

  if (!fs.existsSync(PERSONAS_SOURCE)) {
    console.error(`Source directory not found: ${PERSONAS_SOURCE}`);
    process.exit(1);
  }

  let totalSuccess = 0;
  let totalFailed = 0;

  // Iterate through category directories
  const categories = fs.readdirSync(PERSONAS_SOURCE, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const category of categories) {
    const categoryPath = path.join(PERSONAS_SOURCE, category);
    const subcategories = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const subcategory of subcategories) {
      const subcategoryPath = path.join(categoryPath, subcategory);
      const files = fs.readdirSync(subcategoryPath)
        .filter(f => f.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(subcategoryPath, file);
        const result = migratePersona(filePath, category, subcategory, file);

        if (result.success) {
          console.log(`✓ ${result.source} → ${result.target}`);
          totalSuccess++;
        } else {
          console.log(`✗ ${result.source}: ${result.error}`);
          totalFailed++;
        }
      }
    }
  }

  console.log(`\n--- Migration Complete ---`);
  console.log(`Success: ${totalSuccess}`);
  console.log(`Failed: ${totalFailed}`);
}

main();
