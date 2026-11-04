import { resolve } from "path";
import {
  assessLlmArtifacts,
  assessCodebase,
  assessGitTopology,
  assessProjectType,
  assessTemporal,
} from "./tier1.ts";
import type { AssessmentProfile, Recommendation } from "./types.ts";

// ---------------------------------------------------------------------------
// Flag derivation
// ---------------------------------------------------------------------------

function deriveFlags(
  llm: ReturnType<typeof assessLlmArtifacts>,
  codebase: ReturnType<typeof assessCodebase>,
  git: ReturnType<typeof assessGitTopology>,
  temporal: ReturnType<typeof assessTemporal>
): string[] {
  const flags: string[] = [];

  // greenfield: no source, no memory bank, no construction artifacts
  if (
    !codebase.hasSource &&
    llm.memoryBank.status === "absent" &&
    llm.construction.status === "absent"
  ) {
    flags.push("greenfield");
  }

  // brownfield: has source but no LLM artifacts at all
  if (
    codebase.hasSource &&
    llm.memoryBank.status === "absent" &&
    llm.construction.status === "absent"
  ) {
    flags.push("brownfield");
  }

  // mid-build: construction artifacts present but memory bank incomplete
  if (
    llm.construction.status !== "absent" &&
    llm.memoryBank.status !== "complete"
  ) {
    flags.push("mid-build");
  }

  // partial-memory: memory bank exists but is not complete
  if (llm.memoryBank.status === "partial") {
    flags.push("partial-memory");
  }

  // no-ci: no CI/CD detected
  if (!codebase.hasCiCd) {
    flags.push("no-ci");
  }

  // behind-main: commits behind default branch
  if (git.commitsBehind > 0) {
    flags.push("behind-main");
  }

  // long-branch: feature branch older than 7 days
  if (!git.isDefault && git.branchAgeDays > 7) {
    flags.push("long-branch");
  }

  // dirty-tree: uncommitted changes present
  if (git.uncommittedChanges > 0) {
    flags.push("dirty-tree");
  }

  // stale-docs: llm/ artifacts exist but haven't been updated in 14+ days
  if (
    (llm.memoryBank.status !== "absent" || llm.construction.status !== "absent") &&
    temporal.staleDays >= 14
  ) {
    flags.push("stale-docs");
  }

  // abandoned-docs: llm/ artifacts exist but haven't been updated in 60+ days
  if (
    (llm.memoryBank.status !== "absent" || llm.construction.status !== "absent") &&
    temporal.staleDays >= 60
  ) {
    flags.push("abandoned-docs");
  }

  // no-git-history: no last commit found
  if (!temporal.lastCommit) {
    flags.push("no-git-history");
  }

  return flags;
}

// ---------------------------------------------------------------------------
// Situation derivation
// ---------------------------------------------------------------------------

function deriveSituation(flags: string[]): string {
  if (flags.includes("greenfield")) return "greenfield";
  if (flags.includes("brownfield")) return "brownfield-no-context";
  if (flags.includes("mid-build")) return "mid-build";
  if (flags.includes("stale-docs") || flags.includes("abandoned-docs")) return "stale-docs";
  return "feature-work";
}

// ---------------------------------------------------------------------------
// Recommendation derivation
// ---------------------------------------------------------------------------

function deriveRecommendations(
  situation: string,
  flags: string[],
  llm: ReturnType<typeof assessLlmArtifacts>,
  codebase: ReturnType<typeof assessCodebase>,
  git: ReturnType<typeof assessGitTopology>
): Recommendation[] {
  const recs: Recommendation[] = [];

  switch (situation) {
    case "greenfield":
      recs.push({
        action: "Run the design phase to establish project foundations",
        skill: "constellize-design",
        reason: "No LLM artifacts or source code detected; project needs a design before any build work",
      });
      recs.push({
        action: "Initialize memory bank with project brief and product context",
        skill: "constellize-memory",
        reason: "Memory bank is absent; establishing it now will anchor all future AI-assisted work",
      });
      break;

    case "brownfield-no-context":
      recs.push({
        action: "Run knowledge capture to create a memory bank for the existing codebase",
        skill: "constellize-memory",
        reason: "Source code exists but no LLM context; the AI cannot assist effectively without it",
      });
      recs.push({
        action: "Document the existing architecture in systemPatterns.md",
        skill: "constellize-memory",
        reason: "Brownfield projects need architectural documentation before any new features are added",
      });
      break;

    case "mid-build":
      recs.push({
        action: "Complete the memory bank before continuing implementation",
        skill: "constellize-memory",
        reason: `Memory bank is ${llm.memoryBank.status}; missing: ${llm.memoryBank.missing.join(", ") || "none"}`,
      });
      recs.push({
        action: "Review and finalize remaining design artifacts",
        skill: "constellize-design",
        reason: `Construction is in-progress; ${llm.construction.missingArtifacts.length} design artifacts still missing`,
      });
      break;

    case "stale-docs":
      recs.push({
        action: "Update the memory bank to reflect recent codebase changes",
        skill: "constellize-memory",
        reason: "LLM artifacts have not been updated recently and may be out of sync with the code",
      });
      if (flags.includes("abandoned-docs")) {
        recs.push({
          action: "Audit whether the project is still active and worth maintaining AI context for",
          reason: "Documentation has not been updated in 60+ days; consider archiving or refreshing",
        });
      }
      break;

    case "feature-work":
    default:
      recs.push({
        action: "Continue feature development using established memory bank context",
        skill: "constellize-craft",
        reason: "Project has complete LLM context; AI-assisted development can proceed normally",
      });
      break;
  }

  // Cross-cutting recommendations based on flags
  if (flags.includes("no-ci") && codebase.hasSource) {
    recs.push({
      action: "Add CI/CD configuration to automate testing and deployment",
      skill: "constellize-deliver",
      reason: "No CI/CD pipeline detected; automated quality gates reduce integration risk",
    });
  }

  if (flags.includes("behind-main")) {
    recs.push({
      action: `Rebase or merge from the default branch (${git.commitsBehind} commits behind)`,
      reason: "Branch is behind the default branch; conflicts will only grow over time",
    });
  }

  if (flags.includes("long-branch")) {
    recs.push({
      action: "Consider breaking this feature branch into smaller pull requests",
      reason: `Branch is ${git.branchAgeDays} days old; long-lived branches increase merge complexity`,
    });
  }

  if (flags.includes("dirty-tree")) {
    recs.push({
      action: "Commit or stash uncommitted changes before running further analysis",
      reason: `${git.uncommittedChanges} uncommitted change(s) may affect accuracy of other assessments`,
    });
  }

  if (flags.includes("partial-memory")) {
    recs.push({
      action: "Complete the missing memory bank files",
      skill: "constellize-memory",
      reason: `Missing: ${llm.memoryBank.missing.join(", ")}`,
    });
  }

  return recs;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const formatJson = args.includes("--format") && args[args.indexOf("--format") + 1] === "json";

  // Resolve root: use --root <path> or cwd
  let root = process.cwd();
  const rootIdx = args.indexOf("--root");
  if (rootIdx !== -1 && args[rootIdx + 1]) {
    root = resolve(args[rootIdx + 1]);
  }

  // Run all five assessments
  const llmArtifacts = assessLlmArtifacts(root);
  const codebase = assessCodebase(root);
  const gitTopology = assessGitTopology(root);
  const projectType = assessProjectType(root);
  const temporal = assessTemporal(root);

  // Derive higher-order outputs
  const flags = deriveFlags(llmArtifacts, codebase, gitTopology, temporal);
  const situation = deriveSituation(flags);
  const recommendations = deriveRecommendations(situation, flags, llmArtifacts, codebase, gitTopology);

  const profile: AssessmentProfile = {
    dimensions: {
      llmArtifacts,
      codebase,
      gitTopology,
      projectType,
      temporal,
    },
    flags,
    situation,
    recommendations,
  };

  if (formatJson) {
    process.stdout.write(JSON.stringify(profile, null, 2) + "\n");
  } else {
    // Human-readable summary
    console.log(`Situation:      ${situation}`);
    console.log(`Project type:   ${projectType}`);
    console.log(`Branch:         ${gitTopology.branch}${gitTopology.isDefault ? " (default)" : ""}`);
    console.log(`Flags:          ${flags.length > 0 ? flags.join(", ") : "(none)"}`);
    console.log("");
    console.log("Recommendations:");
    for (const rec of recommendations) {
      const skillTag = rec.skill ? ` [${rec.skill}]` : "";
      console.log(`  - ${rec.action}${skillTag}`);
      console.log(`    ${rec.reason}`);
    }
  }
}

main().catch((err) => {
  console.error("assess: fatal error:", err);
  process.exit(1);
});
