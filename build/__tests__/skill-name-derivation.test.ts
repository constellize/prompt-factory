import { deriveShortSkillName } from '../generate-marketplace';

describe('deriveShortSkillName', () => {
  it.each([
    ['specify-feature', 'specify'],
    ['implement-feature', 'implement'],
    ['verify-feature', 'verify'],
  ])('%s -> %s', (id, short) => {
    expect(deriveShortSkillName(id, 'constellize:feature')).toBe(short);
  });

  it('is unchanged for the ids it already handled', () => {
    expect(deriveShortSkillName('validate-test-coverage', 'constellize:craft')).toBe('test-coverage');
    expect(deriveShortSkillName('externalize-configuration', 'constellize:deliver')).toBe('externalize-config');
    expect(deriveShortSkillName('recover-from-noise-accumulation', 'constellize:memory')).toBe('recover-noise');
  });

  // The two halves of the `implement-` collision, asserted side by side. `implement-feature`
  // short-circuits to `implement` through specialCases; every other `implement-*` id strips the
  // prefix through verbPrefixes and keeps its tail. The contrast is the point, not either value
  // alone: turning the special case into a prefix rule, or making the lookup prefix-based, would
  // collapse all of these to `implement`, renaming skills that are already published (they are
  // listed by their short names in content/literal/marketplace-docs/constellize-skills-infographic.html
  // and named by the printed appendix, which forbids removing or renaming a skill in its table).
  it('keeps the published implement-* skill names, which verbPrefixes strips', () => {
    expect(deriveShortSkillName('implement-defensive-programming', 'constellize:craft')).toBe('defensive-programming');
    expect(deriveShortSkillName('implement-rollback-capability', 'constellize:deliver')).toBe('rollback-capability');
    expect(deriveShortSkillName('implement-operational-monitoring', 'constellize:craft')).toBe('operational-monitoring');
  });

  it('resolves implement-feature and implement-defensive-programming to different shapes', () => {
    expect(deriveShortSkillName('implement-feature', 'constellize:feature')).toBe('implement');
    expect(deriveShortSkillName('implement-defensive-programming', 'constellize:craft')).toBe('defensive-programming');
  });
});
