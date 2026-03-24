import { formatDate, formatDateLong, parseDistances, getTodayMidnight } from '@/lib/utils';

describe('formatDate', () => {
  it('formats a date string to short format', () => {
    expect(formatDate('2024-01-15')).toBe('Mon, Jan 15, 2024');
  });

  it('formats another date correctly', () => {
    expect(formatDate('2024-07-04')).toBe('Thu, Jul 4, 2024');
  });
});

describe('formatDateLong', () => {
  it('formats a date string to long format', () => {
    expect(formatDateLong('2024-01-15')).toBe('Monday, January 15, 2024');
  });

  it('formats another date correctly', () => {
    expect(formatDateLong('2024-07-04')).toBe('Thursday, July 4, 2024');
  });
});

describe('parseDistances', () => {
  it('returns empty array for empty JSON array', () => {
    expect(parseDistances('[]')).toEqual([]);
  });

  it('parses a valid distances JSON string', () => {
    const input = JSON.stringify([{ activity: 'Run', distance: 5, unit: 'km' }]);
    expect(parseDistances(input)).toEqual([{ activity: 'Run', distance: 5, unit: 'km' }]);
  });

  it('parses multiple distances', () => {
    const input = JSON.stringify([
      { activity: 'Run', distance: 10, unit: 'km' },
      { activity: 'Bike', distance: 40, unit: 'km' },
    ]);
    expect(parseDistances(input)).toHaveLength(2);
  });

  it('returns empty array for invalid JSON', () => {
    expect(parseDistances('not valid json')).toEqual([]);
  });

  it('returns empty array for partially valid JSON', () => {
    expect(parseDistances('{broken')).toEqual([]);
  });
});

describe('getTodayMidnight', () => {
  it('returns a Date with time set to midnight', () => {
    const result = getTodayMidnight();
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('returns today\'s date', () => {
    const result = getTodayMidnight();
    const today = new Date();
    expect(result.getFullYear()).toBe(today.getFullYear());
    expect(result.getMonth()).toBe(today.getMonth());
    expect(result.getDate()).toBe(today.getDate());
  });
});
