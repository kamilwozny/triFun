import { haversineDistance } from '@/hooks/useAdvancedEventFiltering';

describe('haversineDistance', () => {
  it('returns 0 for the same point', () => {
    expect(haversineDistance(52.2297, 21.0122, 52.2297, 21.0122)).toBe(0);
  });

  it('calculates Warsaw to Kraków distance (~252 km)', () => {
    // Warsaw: 52.2297° N, 21.0122° E
    // Kraków: 50.0647° N, 19.9450° E
    const distance = haversineDistance(52.2297, 21.0122, 50.0647, 19.945);
    expect(distance).toBeGreaterThan(247);
    expect(distance).toBeLessThan(257);
  });

  it('is symmetric (A→B equals B→A)', () => {
    const d1 = haversineDistance(52.2297, 21.0122, 50.0647, 19.945);
    const d2 = haversineDistance(50.0647, 19.945, 52.2297, 21.0122);
    expect(d1).toBeCloseTo(d2, 5);
  });

  it('calculates a short distance correctly', () => {
    // ~1.1 km apart in Warsaw
    const distance = haversineDistance(52.23, 21.01, 52.22, 21.01);
    expect(distance).toBeGreaterThan(1.0);
    expect(distance).toBeLessThan(1.2);
  });

  it('returns positive value for non-identical points', () => {
    const distance = haversineDistance(0, 0, 1, 1);
    expect(distance).toBeGreaterThan(0);
  });
});
