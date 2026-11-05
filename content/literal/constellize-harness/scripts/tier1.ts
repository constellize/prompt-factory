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
// carrying `**Status:** SPECIFIED`. The status ends where the word ends, so
// `VERIFIED-ish` is not VERIFIED, while `VERIFIED (unsubstantiated)` still reads
// as VERIFIED — that qualifier is re-derived from the evidence, never trusted.
const STATUS_LINE = /^\*\*Status:\*\*[ \t]*(SPECIFIED|IMPLEMENTED|VERIFIED)(?=\s|$)/;
// A fence line: up to three spaces of indent, the marker, then its info string.
const FENCE_LINE = /^ {0,3}(`{3,}|~{3,})([^\n]*)$/;

// The gate-results section, written by constellize-feature:verify: a `## Gate
// Results` heading, and the one ```json fence between it and the next heading at
// the same level or above. A `###` is inside the section; a `##` or a `#` ends it.
const GATE_RESULTS_HEADING = /^##[ \t]+Gate Results[ \t]*$/;
const SECTION_HEADING = /^#{1,2}[ \t]/;

// The only gate-results schema this assessor can read. A block that does not
// record it records a shape this assessor cannot vouch for.
const GATE_RESULTS_SCHEMA = 1;

// Gates 1, 2 and 4 always have to run — gate 2 because its defensive-programming
// member is unconditional. Gate 3 follows the recorded surface determination, and
// any gate the block itself marks required is required too.
const ALWAYS_REQUIRED_GATES = [1, 2, 4];

// The default coverage threshold. A recorded threshold looser than this in any
// dimension is refused — whatever it names as its source — so a project cannot
// lower the bar it was measured against. Only a stricter threshold is an opt-in.
const THRESHOLD_FLOOR: Array<[string, number]> = [
  ["branch", 80],
  ["criticalLogic", 100],
  ["errorPaths", 100],
  ["integrationPoints", 100],
];

/**
 * The fence marker still open after `line`, given the one open before it, and the
 * info string when `line` is what opened it. A fence is closed only by the same
 * character, at least as long, and carrying no info string — CommonMark forbids an
 * info string on a closing fence, so a ```json line inside an open block is
 * content, not a close. A fence that is never closed stays open to the end of the
 * file, which hides the rest of it rather than reading an author's example as the
 * artifact's own text.
 */
function trackFence(
  openFence: string | null,
  line: string,
): { open: string | null; openedWith: string | null } {
  const fence = FENCE_LINE.exec(line);
  if (!fence) return { open: openFence, openedWith: null };
  if (openFence === null) return { open: fence[1], openedWith: fence[2].trim() };
  if (fence[1][0] === openFence[0] && fence[1].length >= openFence.length && fence[2].trim() === "") {
    return { open: null, openedWith: null };
  }
  return { open: openFence, openedWith: null };
}

/**
 * The status a feature artifact declares: the first `**Status:**` line that is not
 * inside a fenced code block, or null when it declares none.
 */
export function readDeclaredStatus(
  text: string,
): "SPECIFIED" | "IMPLEMENTED" | "VERIFIED" | null {
  let openFence: string | null = null;
  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    const { open } = trackFence(openFence, line);
    const fenced = openFence !== null || open !== null;
    openFence = open;
    if (fenced) continue; // inside a fence, or the line that opens or closes one
    const status = line.match(STATUS_LINE);
    if (status) {
      return status[1] as "SPECIFIED" | "IMPLEMENTED" | "VERIFIED";
    }
  }
  return null;
}

/**
 * The verdict a feature artifact's gate-results block carries, read from the
 * artifact text: whether it substantiates a VERIFIED status, and which required
 * gates have no verdict or a verdict that is not a pass.
 */
export function assessGateResults(
  text: string,
): Pick<FeatureEntry, "evidence" | "missingGates" | "failedGates"> {
  const missingGates: number[] = [];
  const failedGates: number[] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  // Which `## Gate Results` heading the evidence is read from. The heading has to
  // be outside a fence — a fenced example of a gate-results section is an example,
  // not a record — and two of them are two records, one of which is wrong.
  const headings: number[] = [];
  const sections: number[] = [];
  let scanFence: string | null = null;
  for (let i = 0; i < lines.length; i++) {
    const { open } = trackFence(scanFence, lines[i]);
    const fenced = scanFence !== null || open !== null;
    scanFence = open;
    if (fenced) continue;
    if (SECTION_HEADING.test(lines[i])) {
      sections.push(i);
      if (GATE_RESULTS_HEADING.test(lines[i])) headings.push(i);
    }
  }
  if (headings.length > 1) return { evidence: "malformed", missingGates, failedGates };
  if (headings.length === 0) return { evidence: "absent", missingGates, failedGates };

  // The section runs from its heading to the next heading at the same level or
  // above — a `###` stays inside it, a `##` or a `#` ends it — so a heading that
  // carries only prose cannot reach forward to a later json fence.
  const start = headings[0] + 1;
  const nextSection = sections.find((line) => line > headings[0]);
  const end = nextSection === undefined ? lines.length : nextSection;

  // The first ```json fence inside that section, skipping any other fence whole.
  let json: string | null = null;
  let openFence: string | null = null;
  let collecting = false;
  const collected: string[] = [];
  for (let i = start; i < end && json === null; i++) {
    const { open, openedWith } = trackFence(openFence, lines[i]);
    if (openFence === null) {
      if (open !== null) {
        collecting = openedWith === "json";
        collected.length = 0;
      }
    } else if (open === null) {
      if (collecting) json = collected.join("\n"); // the fence closed
      collecting = false;
    } else if (collecting) {
      collected.push(lines[i]);
    }
    openFence = open;
  }
  // An unclosed json fence records nothing readable, so it is no evidence at all.
  if (json === null) return { evidence: "absent", missingGates, failedGates };

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    parsed = undefined; // unparseable evidence is not evidence, and never propagates
  }
  const results =
    parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  const gates =
    results && Array.isArray(results["gates"]) ? (results["gates"] as unknown[]) : null;
  if (!results || !gates) return { evidence: "malformed", missingGates, failedGates };

  // The schema has to be recorded, and be one this assessor knows: a block with no
  // schema is not read as though it were this one, any more than a block naming a
  // schema this assessor cannot read is.
  if (results["schema"] !== GATE_RESULTS_SCHEMA) {
    return { evidence: "malformed", missingGates, failedGates };
  }

  // Gate 3's `required` follows the surface determination, so a block that records
  // no determination has nothing for it to follow. Both surfaces have to be stated
  // as booleans; silence is not "no deployment surface". Nothing follows from
  // `operational` — gate 2 is required either way — but it is a member of the
  // schema, and an unvalidated member is one a writer can drift on.
  const surface = results["surface"];
  const recordedSurface =
    surface !== null && typeof surface === "object" && !Array.isArray(surface)
      ? (surface as Record<string, unknown>)
      : null;
  const deployment = recordedSurface === null ? undefined : recordedSurface["deployment"];
  const operational = recordedSurface === null ? undefined : recordedSurface["operational"];
  const surfaceDetermined = typeof deployment === "boolean" && typeof operational === "boolean";

  const required = new Set<number>(ALWAYS_REQUIRED_GATES);
  if (deployment === true) required.add(3);

  const verdicts = new Map<number, unknown>();
  for (const entry of gates) {
    if (entry === null || typeof entry !== "object") continue;
    const gate = entry as Record<string, unknown>;
    const gateNumber = gate["gate"];
    if (typeof gateNumber !== "number" || !Number.isInteger(gateNumber) || gateNumber <= 0) continue;
    // One gate, one verdict. A record that says two things about the same gate is
    // not a record, and no merge rule for it would be worth reasoning about.
    if (verdicts.has(gateNumber)) {
      return { evidence: "malformed", missingGates, failedGates };
    }
    if (gate["required"] === true) required.add(gateNumber);
    verdicts.set(gateNumber, gate["verdict"]);
  }

  for (const gate of [...required].sort((a, b) => a - b)) {
    const verdict = verdicts.get(gate);
    // A required gate recorded as SKIPPED carries no verdict for a gate that had
    // to run, so it counts as missing, not as failed.
    if (typeof verdict !== "string" || verdict === "" || verdict === "SKIPPED") {
      missingGates.push(gate);
    } else if (verdict !== "PASS") {
      // The verdict is present but is not a pass. FAIL is the vocabulary's other
      // value; anything unrecognised cannot substantiate a status either, so it is
      // read as not a pass rather than ignored.
      failedGates.push(gate);
    }
  }

  // The block has to record all four numbers, each at or above the floor, whatever
  // it labels their source: the floor *is* the default, so an honest block records
  // exactly the default and cannot be refused, while a loose number cannot escape
  // by being relabelled "default" — or by being left out.
  const threshold = results["threshold"];
  const recordedThreshold =
    threshold !== null && typeof threshold === "object" && !Array.isArray(threshold)
      ? (threshold as Record<string, unknown>)
      : null;
  const thresholdHoldsFloor =
    recordedThreshold !== null &&
    THRESHOLD_FLOOR.every(([field, floor]) => {
      const value = recordedThreshold[field];
      return typeof value === "number" && value >= floor;
    });

  const evidence =
    missingGates.length === 0 && failedGates.length === 0 && thresholdHoldsFloor && surfaceDetermined
      ? "complete"
      : "incomplete";
  return { evidence, missingGates, failedGates };
}

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
    // Mid-migration a feature has both an artifact and its pre-2.0 directory. The
    // artifact is the feature; the directory beside it is not a second one.
    const artifactNames = new Set(
      items.filter((item) => item.endsWith(".md")).map((item) => item.slice(0, -".md".length)),
    );
    for (const item of items) {
      const full = join(featuresDir, item);
      let isDirectory = false;
      try {
        isDirectory = statSync(full).isDirectory();
      } catch {
        continue; // ignore stat errors
      }

      if (isDirectory) {
        if (artifactNames.has(item)) continue;
        featureEntries.push(item);
        featureDetails.push({
          name: item,
          status: "unknown",
          evidence: "absent",
          missingGates: [],
          failedGates: [],
        });
        continue;
      }

      if (!item.endsWith(".md")) continue;
      const name = item.slice(0, -".md".length);
      featureEntries.push(name);

      let text: string;
      try {
        text = readFileSync(full, "utf8");
      } catch {
        featureDetails.push({
          name,
          status: "unknown",
          evidence: "absent",
          missingGates: [],
          failedGates: [],
        });
        continue;
      }

      const declared = readDeclaredStatus(text);
      const results = assessGateResults(text);

      const status: FeatureStatus =
        declared === null
          ? "unknown"
          : declared === "VERIFIED" && results.evidence !== "complete"
          ? "VERIFIED (unsubstantiated)"
          : declared;

      featureDetails.push({ name, status, ...results });
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
