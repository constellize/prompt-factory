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
  FeatureEntry,
  FeatureStatus,
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

// A feature artifact's status line, matched at the start of a line and only
// outside fenced code blocks: the spec template itself contains a fenced example
// carrying `**Status:** SPECIFIED`.
const STATUS_LINE = /^\*\*Status:\*\*\s*(SPECIFIED|IMPLEMENTED|VERIFIED)\b/;
const FENCE_LINE = /^ {0,3}(`{3,}|~{3,})/;

// The one ```json block under `## Gate Results`, written by constellize-feature:verify.
const GATE_RESULTS_BLOCK =
  /^##[ \t]+Gate Results[ \t]*$\n[\s\S]*?^```[ \t]*json[ \t]*$\n([\s\S]*?)^```/m;

// Gates 1, 2 and 4 always have to run — gate 2 because its defensive-programming
// member is unconditional. Gate 3 follows the recorded surface determination, and
// any gate the block itself marks required is required too.
const ALWAYS_REQUIRED_GATES = [1, 2, 4];

// The default coverage threshold. A declared threshold looser than this in any
// dimension is refused, so a project cannot lower the bar it was measured against.
const THRESHOLD_FLOOR: Array<[string, number]> = [
  ["branch", 80],
  ["criticalLogic", 100],
  ["errorPaths", 100],
  ["integrationPoints", 100],
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

  // Features: the *.md artifacts under llm/features/, plus any pre-2.0 directory
  // (discovery moved from directories to files; an existing project must not lose
  // its count). Each artifact's status is read, and a VERIFIED status is checked
  // against the gate-results block it is supposed to point at.
  const featuresDir = join(root, "llm", "features");
  const featureEntries: string[] = [];
  const featureDetails: FeatureEntry[] = [];
  if (existsSync(featuresDir)) {
    let items: string[] = [];
    try {
      items = readdirSync(featuresDir);
    } catch {
      items = []; // ignore read errors
    }
    for (const item of items) {
      const full = join(featuresDir, item);
      let isDirectory = false;
      try {
        isDirectory = statSync(full).isDirectory();
      } catch {
        continue; // ignore stat errors
      }

      if (isDirectory) {
        featureEntries.push(item);
        featureDetails.push({
          name: item,
          status: "unknown",
          evidence: "absent",
          missingGates: [],
        });
        continue;
      }

      if (!item.endsWith(".md")) continue;
      const name = item.slice(0, -".md".length);
      featureEntries.push(name);

      let text: string;
      try {
        text = readFileSync(full, "utf8").replace(/\r\n/g, "\n");
      } catch {
        featureDetails.push({
          name,
          status: "unknown",
          evidence: "absent",
          missingGates: [],
        });
        continue;
      }

      // Status: the first status line that is not inside a fenced code block.
      let declared: string | null = null;
      let openFence: string | null = null;
      for (const line of text.split("\n")) {
        const fence = line.match(FENCE_LINE);
        if (openFence !== null) {
          if (fence && fence[1][0] === openFence[0] && fence[1].length >= openFence.length) {
            openFence = null;
          }
          continue;
        }
        if (fence) {
          openFence = fence[1];
          continue;
        }
        const status = line.match(STATUS_LINE);
        if (status) {
          declared = status[1];
          break;
        }
      }

      // Evidence: the gate-results block, if it is there and parses.
      let evidence: FeatureEntry["evidence"] = "absent";
      const missingGates: number[] = [];
      const block = text.match(GATE_RESULTS_BLOCK);
      if (block) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(block[1]);
        } catch {
          parsed = undefined; // unparseable evidence is not evidence, and never propagates
        }
        const results =
          parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
            ? (parsed as Record<string, unknown>)
            : null;
        const gates =
          results && Array.isArray(results["gates"]) ? (results["gates"] as unknown[]) : null;

        if (!results || !gates) {
          evidence = "malformed";
        } else {
          const required = new Set<number>(ALWAYS_REQUIRED_GATES);
          const surface = results["surface"];
          if (
            surface !== null &&
            typeof surface === "object" &&
            (surface as Record<string, unknown>)["deployment"] === true
          ) {
            required.add(3);
          }

          const verdicts = new Map<number, unknown>();
          for (const entry of gates) {
            if (entry === null || typeof entry !== "object") continue;
            const gate = entry as Record<string, unknown>;
            const gateNumber = gate["gate"];
            if (typeof gateNumber !== "number") continue;
            if (gate["required"] === true) required.add(gateNumber);
            verdicts.set(gateNumber, gate["verdict"]);
          }

          for (const gate of [...required].sort((a, b) => a - b)) {
            const verdict = verdicts.get(gate);
            // A required gate recorded as SKIPPED carries no verdict for a gate
            // that had to run, so it counts as missing.
            if (typeof verdict !== "string" || verdict === "" || verdict === "SKIPPED") {
              missingGates.push(gate);
            }
          }

          let loosened = false;
          const threshold = results["threshold"];
          if (
            threshold !== null &&
            typeof threshold === "object" &&
            (threshold as Record<string, unknown>)["source"] === "declared"
          ) {
            const declaredThreshold = threshold as Record<string, unknown>;
            for (const [field, floor] of THRESHOLD_FLOOR) {
              const value = declaredThreshold[field];
              if (typeof value === "number" && value < floor) loosened = true;
            }
          }

          evidence = missingGates.length === 0 && !loosened ? "complete" : "incomplete";
        }
      }

      const status: FeatureStatus =
        declared === null
          ? "unknown"
          : declared === "VERIFIED" && evidence !== "complete"
          ? "VERIFIED (unsubstantiated)"
          : (declared as FeatureStatus);

      featureDetails.push({ name, status, evidence, missingGates });
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
      features: featureDetails,
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
