export interface MemoryBankState {
  status: "absent" | "partial" | "complete";
  present: string[];
  missing: string[];
}

export interface ConstructionState {
  status: "absent" | "in-progress" | "complete";
  completedArtifacts: string[];
  missingArtifacts: string[];
}

export interface FeaturesState {
  count: number;
  entries: string[];
}

export interface LlmArtifacts {
  memoryBank: MemoryBankState;
  construction: ConstructionState;
  features: FeaturesState;
}

export interface CodebaseState {
  hasSource: boolean;
  languages: string[];
  hasTests: boolean;
  hasCiCd: boolean;
  packageManager: string | null;
}

export interface GitTopology {
  branch: string;
  isDefault: boolean;
  commitsAhead: number;
  commitsBehind: number;
  branchAgeDays: number;
  llmDiffFromMain: boolean;
  uncommittedChanges: number;
}

export type ProjectType = "application" | "library" | "monorepo" | "unknown";

export interface TemporalState {
  lastCommit: string | null;
  lastLlmUpdate: string | null;
  staleDays: number;
}

export interface Recommendation {
  action: string;
  skill?: string;
  reason: string;
}

export interface AssessmentProfile {
  dimensions: {
    llmArtifacts: LlmArtifacts;
    codebase: CodebaseState;
    gitTopology: GitTopology;
    projectType: ProjectType;
    temporal: TemporalState;
  };
  flags: string[];
  situation: string;
  recommendations: Recommendation[];
}
