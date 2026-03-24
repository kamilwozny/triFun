import { getActivityKey, getWeekIndex } from '@/lib/statsUtils';

describe('getActivityKey', () => {
  it('returns Run for exact match', () => {
    expect(getActivityKey('Run')).toBe('Run');
  });

  it('returns Bike for exact match', () => {
    expect(getActivityKey('Bike')).toBe('Bike');
  });

  it('returns Swim for exact match', () => {
    expect(getActivityKey('Swim')).toBe('Swim');
  });

  it('returns Run for lowercase "running"', () => {
    expect(getActivityKey('running')).toBe('Run');
  });

  it('returns Bike for "cycling"', () => {
    expect(getActivityKey('cycling')).toBe('Bike');
  });

  it('returns Other for "biking" (does not match "bike" substring)', () => {
    expect(getActivityKey('biking')).toBe('Other');
  });

  it('returns Swim for "swimming"', () => {
    expect(getActivityKey('swimming')).toBe('Swim');
  });

  it('returns Other for unrecognized activity', () => {
    expect(getActivityKey('yoga')).toBe('Other');
  });

  it('returns Other for empty string', () => {
    expect(getActivityKey('')).toBe('Other');
  });
});

describe('getWeekIndex', () => {
  it('returns 0 when date is exactly on cutoff', () => {
    const cutoff = new Date('2024-01-01T00:00:00.000Z');
    expect(getWeekIndex('2024-01-01', cutoff)).toBe(0);
  });

  it('returns 1 for a date 7 days after cutoff', () => {
    const cutoff = new Date('2024-01-01T00:00:00.000Z');
    expect(getWeekIndex('2024-01-08', cutoff)).toBe(1);
  });

  it('returns 2 for a date 14 days after cutoff', () => {
    const cutoff = new Date('2024-01-01T00:00:00.000Z');
    expect(getWeekIndex('2024-01-15', cutoff)).toBe(2);
  });

  it('returns 3 for a date 21 days after cutoff', () => {
    const cutoff = new Date('2024-01-01T00:00:00.000Z');
    expect(getWeekIndex('2024-01-22', cutoff)).toBe(3);
  });

  it('returns 0 for a date 6 days after cutoff (still week 0)', () => {
    const cutoff = new Date('2024-01-01T00:00:00.000Z');
    expect(getWeekIndex('2024-01-07', cutoff)).toBe(0);
  });

  it('returns negative for a date before cutoff', () => {
    const cutoff = new Date('2024-01-15T00:00:00.000Z');
    expect(getWeekIndex('2024-01-01', cutoff)).toBeLessThan(0);
  });
});
