import { GEN_RANGES, TYPE_COLORS } from '@/utils/constants';

describe('Constants', () => {
  it('should have correct generation ranges', () => {
    expect(GEN_RANGES['Gen 1']).toEqual([1, 151]);
    expect(GEN_RANGES['Gen 9']).toEqual([906, 1025]);
  });

  it('should have correct type colors', () => {
    expect(TYPE_COLORS['fire']).toBe('bg-orange-500');
    expect(TYPE_COLORS['water']).toBe('bg-blue-500');
  });
});
