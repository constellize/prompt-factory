import { deriveShortSkillName } from '../generate-marketplace';

describe('deriveShortSkillName for constellize:feature', () => {
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
});
