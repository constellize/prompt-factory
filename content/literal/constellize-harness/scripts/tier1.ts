import { execSync } from "child_process";
import {
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
} from "fs";
import { join } from "path";
import type {
  LlmArtifacts,
  CodebaseState,
  GitTopology,
  ProjectType,
  TemporalState,
} from "./types.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function git(cmd: string, cwd: string): string {
  try {
    return execSync(`git ${cmd}`, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function exists(root: string, ...parts: string[]): boolean {
  return existsSync(join(root, ...parts));
}

function readJson(root: string, ...parts: string[]): Record<string, unknown> | null {
  const p = join(root, ...parts);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function listDir(root: string, ...parts: string[]): string[] {
  const p = join(root, ...parts);
  if (!existsSync(p)) return [];
  try {
    return readdirSync(p);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// assessLlmArtifacts
// ---------------------------------------------------------------------------

const MEMORY_BANK_FILES = [
  "projectbrief.md",
  "productContext.md",
  "systemPatterns.md",
  "techContext.md",
  "activeContext.md",
  "progress.md",
];

const DESIGN_ARTIFACTS = [
  "business-problem.md",
  "vision-statement.md",
  "ecosystem-map.md",
  "raci-matrix.md",
  "constellation-map.md",
  "gap-analysis.md",
  "lock-constellation.md",
  "implementation-sketch.md",
  "code-generation-plan.md", // also matched by wildcard code-generation-plan-*.md
];

export function assessLlmArtifacts(root: string): LlmArtifacts {
  // Memory bank
  const mbDir = join(root, "llm", "memory-bank");
  const mbPresent: string[] = [];
  const mbMissing: string[] = [];
  for (const f of MEMORY_BANK_FILES) {
    if (existsSync(join(mbDir, f))) {
      mbPresent.push(f);
    } else {
      mbMissing.push(f);
    }
  }
  const mbStatus =
    mbPresent.length === 0
      ? "absent"
      : mbPresent.length === MEMORY_BANK_FILES.length
      ? "complete"
      : "partial";

  // Construction design artifacts
  const designDir = join(root, "llm", "construction", "design");
  const designFiles = existsSync(designDir) ? readdirSync(designDir) : [];

  const completedArtifacts: string[] = [];
  const missingArtifacts: string[] = [];

  for (const artifact of DESIGN_ARTIFACTS) {
    if (artifact === "code-generation-plan.md") {
      // Support wildcard: code-generation-plan.md OR code-generation-plan-*.md
      const found = designFiles.some(
        (f) => f === "code-generation-plan.md" || /^code-generation-plan-.+\.md$/.test(f)
      );
      if (found) {
        // Record whichever actual file matched
        const match = designFiles.find(
          (f) => f === "code-generation-plan.md" || /^code-generation-plan-.+\.md$/.test(f)
        )!;
        completedArtifacts.push(match);
      } else {
        missingArtifacts.push(artifact);
      }
    } else if (designFiles.includes(artifact)) {
      completedArtifacts.push(artifact);
    } else {
      missingArtifacts.push(artifact);
    }
  }

  const constructionStatus =
    completedArtifacts.length === 0
      ? "absent"
      : completedArtifacts.length === DESIGN_ARTIFACTS.length
      ? "complete"
      : "in-progress";

  // Features: count subdirectories under llm/features/
  const featuresDir = join(root, "llm", "features");
  const featureEntries: string[] = [];
  if (existsSync(featuresDir)) {
    try {
      const items = readdirSync(featuresDir);
      for (const item of items) {
        const full = join(featuresDir, item);
        try {
          if (statSync(full).isDirectory()) {
            featureEntries.push(item);
          }
        } catch {
          // ignore stat errors
        }
      }
    } catch {
      // ignore read errors
    }
  }

  return {
    memoryBank: {
      status: mbStatus,
      present: mbPresent,
      missing: mbMissing,
    },
    construction: {
      status: constructionStatus,
      completedArtifacts,
      missingArtifacts,
    },
    features: {
      count: featureEntries.length,
      entries: featureEntries,
    },
  };
}

// ---------------------------------------------------------------------------
// assessCodebase
// ---------------------------------------------------------------------------

const SOURCE_DIRS = ["src", "lib", "app", "cmd", "pkg", "internal"];
const TEST_DIRS = ["test", "tests", "__tests__", "spec"];

const LANGUAGE_INDICATORS: Array<[string, string]> = [
  ["package.json", "typescript"], // refined below if tsconfig present
  ["pyproject.toml", "python"],
  ["setup.py", "python"],
  ["go.mod", "go"],
  ["Cargo.toml", "rust"],
  ["pom.xml", "java"],
  ["build.gradle", "java"],
  ["*.gemspec", "ruby"],
  ["Gemfile", "ruby"],
];

const LOCKFILES: Array<[string, string]> = [
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
  ["bun.lockb", "bun"],
  ["Pipfile.lock", "pipenv"],
  ["poetry.lock", "poetry"],
  ["Cargo.lock", "cargo"],
  ["go.sum", "go modules"],
];

export function assessCodebase(root: string): CodebaseState {
  const hasSource = SOURCE_DIRS.some((d) => exists(root, d));

  // Languages
  const languages: string[] = [];
  if (exists(root, "package.json")) {
    // Distinguish JS vs TS by tsconfig presence
    if (exists(root, "tsconfig.json") || exists(root, "tsconfig.base.json")) {
      languages.push("typescript");
    } else {
      languages.push("javascript");
    }
  }
  if (exists(root, "pyproject.toml") || exists(root, "setup.py")) languages.push("python");
  if (exists(root, "go.mod")) languages.push("go");
  if (exists(root, "Cargo.toml")) languages.push("rust");
  if (exists(root, "pom.xml") || exists(root, "build.gradle")) languages.push("java");
  if (exists(root, "Gemfile") || listDir(root).some((f) => f.endsWith(".gemspec"))) {
    languages.push("ruby");
  }

  const hasTests = TEST_DIRS.some((d) => exists(root, d));

  const hasCiCd =
    exists(root, ".github", "workflows") ||
    exists(root, ".gitlab-ci.yml") ||
    exists(root, "Jenkinsfile") ||
    exists(root, ".circleci");

  let packageManager: string | null = null;
  for (const [lockfile, pm] of LOCKFILES) {
    if (exists(root, lockfile)) {
      packageManager = pm;
      break;
    }
  }

  return { hasSource, languages, hasTests, hasCiCd, packageManager };
}

// ---------------------------------------------------------------------------
// assessGitTopology
// ---------------------------------------------------------------------------

export function assessGitTopology(root: string): GitTopology {
  const branch = git("rev-parse --abbrev-ref HEAD", root) || "unknown";

  // Detect default branch: prefer main, fall back to master, then remote HEAD
  let defaultBranch = "main";
  const remoteHead = git("symbolic-ref refs/remotes/origin/HEAD --short", root);
  if (remoteHead) {
    defaultBranch = remoteHead.replace(/^origin\//, "");
  } else if (git("rev-parse --verify master", root)) {
    defaultBranch = "main"; // keep main as default if both exist
  }

  const isDefault = branch === defaultBranch;

  // Commits ahead / behind relative to default branch
  let commitsAhead = 0;
  let commitsBehind = 0;
  if (!isDefault) {
    const aheadBehind = git(`rev-list --left-right --count ${defaultBranch}...${branch}`, root);
    const parts = aheadBehind.split(/\s+/);
    if (parts.length === 2) {
      commitsBehind = parseInt(parts[0], 10) || 0;
      commitsAhead = parseInt(parts[1], 10) || 0;
    }
  }

  // Branch age: date of first commit on this branch not on default branch
  let branchAgeDays = 0;
  if (!isDefault) {
    const firstCommitDate = git(
      `log ${defaultBranch}..${branch} --format=%ci --reverse`,
      root
    )
      .split("\n")
      .find((l) => l.trim() !== "");

    if (firstCommitDate) {
      const age = Date.now() - new Date(firstCommitDate).getTime();
      branchAgeDays = Math.floor(age / (1000 * 60 * 60 * 24));
    }
  } else {
    // On default branch: age since first commit
    const firstCommit = git("log --format=%ci --reverse", root).split("\n").find((l) => l.trim() !== "");
    if (firstCommit) {
      const age = Date.now() - new Date(firstCommit).getTime();
      branchAgeDays = Math.floor(age / (1000 * 60 * 60 * 24));
    }
  }

  // Whether llm/ directory differs from default branch
  let llmDiffFromMain = false;
  if (!isDefault) {
    const diff = git(`diff ${defaultBranch}...${branch} --name-only -- llm/`, root);
    llmDiffFromMain = diff.trim().length > 0;
  }

  // Uncommitted changes count (staged + unstaged, excluding untracked)
  const statusOutput = git("status --porcelain", root);
  const uncommittedChanges = statusOutput
    ? statusOutput.split("\n").filter((l) => l.trim() !== "").length
    : 0;

  return {
    branch,
    isDefault,
    commitsAhead,
    commitsBehind,
    branchAgeDays,
    llmDiffFromMain,
    uncommittedChanges,
  };
}

// ---------------------------------------------------------------------------
// assessProjectType
// ---------------------------------------------------------------------------

const MONOREPO_INDICATORS = [
  "pnpm-workspace.yaml",
  "lerna.json",
  "nx.json",
  "turbo.json",
  "go.work",
];

export function assessProjectType(root: string): ProjectType {
  // Check for explicit monorepo config files
  for (const indicator of MONOREPO_INDICATORS) {
    if (exists(root, indicator)) return "monorepo";
  }

  // package.json workspaces
  const pkg = readJson(root, "package.json");
  if (pkg && pkg["workspaces"]) return "monorepo";

  // Cargo.toml [workspace]
  if (exists(root, "Cargo.toml")) {
    try {
      const cargo = readFileSync(join(root, "Cargo.toml"), "utf8");
      if (/^\[workspace\]/m.test(cargo)) return "monorepo";
    } catch {
      // ignore
    }
  }

  // Library: package.json with main/module/exports/types fields
  if (pkg) {
    if (pkg["main"] || pkg["module"] || pkg["exports"] || pkg["types"]) {
      return "library";
    }
  }

  // Application: has source directories
  const SOURCE_DIRS_CHECK = ["src", "lib", "app", "cmd", "pkg", "internal"];
  if (SOURCE_DIRS_CHECK.some((d) => exists(root, d))) return "application";

  return "unknown";
}

// ---------------------------------------------------------------------------
// assessTemporal
// ---------------------------------------------------------------------------

export function assessTemporal(root: string): TemporalState {
  const lastCommitRaw = git("log -1 --format=%ci", root);
  const lastCommit = lastCommitRaw || null;

  const lastLlmRaw = git("log -1 --format=%ci -- llm/", root);
  const lastLlmUpdate = lastLlmRaw || null;

  let staleDays = 0;
  const referenceDate = lastLlmUpdate || lastCommit;
  if (referenceDate) {
    const ms = Date.now() - new Date(referenceDate).getTime();
    staleDays = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  }

  return { lastCommit, lastLlmUpdate, staleDays };
}
