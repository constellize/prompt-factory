// Node-floor preflight for the assessor. assess.ts is TypeScript run via Node's
// built-in type stripping, so on an older Node it fails at parse and cannot
// report the problem itself. This plain .mjs loads on any Node and checks first.
const version = process.env.CONSTELLIZE_NODE_VERSION ?? process.versions.node; // seam: tests only, not a supported way to run the harness
const [major, minor] = version.split('.').map(Number);
const ok = major > 23 || (major === 23 && minor >= 6) || (major === 22 && minor >= 18);

if (!ok) {
  process.stderr.write(
    `constellize-harness needs Node 22.18+ (or 23.6+/24+) to run the assessor; this is Node ${version}.\n`,
  );
  process.exit(1);
}

await import('./assess.ts');
