/**
 * Type definitions for unified content format
 */

// === Prompt Types ===

export interface PromptSkillConfig {
  description: string;
  'argument-hint'?: string;
  'allowed-tools'?: string[];
  model?: 'haiku' | 'sonnet' | 'opus' | 'inherit';
  context?: 'inline' | 'fork';
  'user-invocable'?: boolean;
  'disable-model-invocation'?: boolean;
}

export interface PromptVariable {
  name: string;
  description: string;
  example?: string;
  'maps-to'?: string;
}

export interface PromptOutputs {
  book?: {
    chapter?: number;
    description?: string;
    preview?: string;
    // Legacy fields
    include?: boolean;
    format?: 'callout' | 'section' | 'appendix';
  };
  website?: {
    include?: boolean;
    path?: string;
  };
  marketplace?: {
    plugin?: string;
  };
}

export interface PromptRelated {
  personas?: string[];
  skills?: string[];
}

export interface PromptFrontmatter {
  id: string;
  name: string;
  version?: string;
  chapter: number;
  category: string;
  subcategory?: string;
  tags?: string[];
  skill?: PromptSkillConfig;
  variables?: PromptVariable[];
  outputs?: PromptOutputs;
  related?: PromptRelated;
}

export interface Prompt {
  frontmatter: PromptFrontmatter;
  content: string;
  sourcePath: string;
}

// === Persona Types ===

export interface PersonaAgentConfig {
  description: string;
  tools?: string[];
  'disallowed-tools'?: string[];
  model?: 'haiku' | 'sonnet' | 'opus' | 'inherit';
  skills?: string[];
  'max-turns'?: number;
  'permission-mode'?: 'default' | 'acceptEdits' | 'dontAsk' | 'delegate' | 'bypassPermissions' | 'plan';
}

export interface PersonaVariant {
  id: string;
  focus: string;
  model?: string;
}

export interface PersonaOutputs {
  website?: {
    include?: boolean;
    aggregate?: boolean;
  };
  marketplace?: {
    plugin?: string;
  };
}

export interface PersonaFrontmatter {
  id: string;
  name: string;
  title: string;
  version?: string;
  category: string;
  subcategory: string;
  expertise?: string[];
  'use-with'?: string[];
  agent?: PersonaAgentConfig;
  'is-aggregate'?: boolean;
  'synthesized-from'?: string[];
  variants?: PersonaVariant[];
  outputs?: PersonaOutputs;
}

export interface Persona {
  frontmatter: PersonaFrontmatter;
  content: string;
  sourcePath: string;
}

// === Plugin Types ===

export interface PluginDefinition {
  id: string;
  version: string;
  name: string;
  description: string;
  chapter?: number;
  skills?: {
    category?: string;
    include?: string[];
  };
  agents?: {
    subcategories?: string[];
    custom?: string[];
  };
}

export interface MarketplaceConfig {
  name: string;
  owner: {
    name: string;
    url?: string;
  };
  description: string;
}

export interface PluginsConfig {
  marketplace: MarketplaceConfig;
  plugins: PluginDefinition[];
}

// === Output Types ===

export interface WebsitePromptOutput {
  id: string;
  promptTxt: string;
  metadata: {
    id: string;
    chapter: string;
    category: string;
    purpose: string;
    useCase: string;
    tags: string[];
    created: string;
    version: string;
  };
}

export interface WebsitePersonaOutput {
  id: string;
  category: string;
  subcategory: string;
  content: string;
  metadata: {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    title: string;
    description: string;
    expertise: string[];
    useWith: string[];
  };
}

export interface MarketplaceSkillOutput {
  skillPath: string;
  skillMd: string;
}

export interface MarketplaceAgentOutput {
  agentPath: string;
  agentMd: string;
}

export interface MarketplacePluginOutput {
  pluginId: string;
  pluginJson: object;
  skills: MarketplaceSkillOutput[];
  agents: MarketplaceAgentOutput[];
}
