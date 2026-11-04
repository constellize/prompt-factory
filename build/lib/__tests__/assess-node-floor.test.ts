import { spawnSync } from 'child_process';
import * as path from 'path';

const ASSESS = path.resolve(
  __dirname,
  '../../../content/literal/constellize-harness/scripts/assess.mjs'
);

// The preflight reads CONSTELLIZE_NODE_VERSION in place of the running Node's version.
// Only the rejection path is exercised: the accept path runs the real assessor.
describe('assess.mjs Node floor', () => {
  it.each(['22.17.0', '23.5.0', '21.9.0'])('refuses Node %s with one clear line', (version) => {
    const result = spawnSync(process.execPath, [ASSESS], {
      env: { ...process.env, CONSTELLIZE_NODE_VERSION: version },
      encoding: 'utf-8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toBe(
      `constellize-harness needs Node 22.18+ (or 23.6+/24+) to run the assessor; this is Node ${version}.\n`
    );
    expect(result.stdout).toBe('');
  });
});
