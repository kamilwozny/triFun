// Mock React's useMemo so hooks can run outside React without a renderer
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: (fn: () => unknown) => fn(),
}));

import { useLocationSuggestions } from '@/hooks/useLocationSuggestions';
import { TrainingEvent } from '@/types/training';

const makeEvent = (city: string, country: string, id = city): Partial<TrainingEvent> & TrainingEvent =>
  ({
    id,
    name: `Event in ${city}`,
    description: '',
    city,
    country,
    userPosition: '0,0',
    distances: '[]',
    date: '2099-01-01',
    level: 'Beginner',
    createdBy: 'user-1',
    createdAt: '2024-01-01',
    isPrivate: false,
    startTime: '09:00',
    activities: ['Run'],
    parsedDistances: [],
    attendees: [],
  } as TrainingEvent);

describe('useLocationSuggestions', () => {
  it('empty events → empty suggestions', () => {
    const result = useLocationSuggestions([]);
    expect(result).toHaveLength(0);
  });

  it('single event → 1 city suggestion + 1 country suggestion', () => {
    const result = useLocationSuggestions([makeEvent('Warsaw', 'Poland')]);
    expect(result).toHaveLength(2);
    expect(result.find((s) => s.type === 'city')?.text).toBe('Warsaw');
    expect(result.find((s) => s.type === 'country')?.text).toBe('Poland');
  });

  it('two events with the same city → only 1 city suggestion (deduplicated)', () => {
    const events = [makeEvent('Warsaw', 'Poland', '1'), makeEvent('Warsaw', 'Germany', '2')];
    const result = useLocationSuggestions(events);
    const cities = result.filter((s) => s.type === 'city');
    expect(cities).toHaveLength(1);
    expect(cities[0].text).toBe('Warsaw');
  });

  it('city deduplication is case-insensitive', () => {
    const events = [makeEvent('Warsaw', 'Poland', '1'), makeEvent('warsaw', 'Poland', '2')];
    const result = useLocationSuggestions(events);
    const cities = result.filter((s) => s.type === 'city');
    expect(cities).toHaveLength(1);
  });

  it('two events with the same country → only 1 country suggestion', () => {
    const events = [makeEvent('Warsaw', 'Poland', '1'), makeEvent('Kraków', 'Poland', '2')];
    const result = useLocationSuggestions(events);
    const countries = result.filter((s) => s.type === 'country');
    expect(countries).toHaveLength(1);
    expect(countries[0].text).toBe('Poland');
  });

  it('country deduplication is case-insensitive', () => {
    const events = [makeEvent('Warsaw', 'Poland', '1'), makeEvent('Kraków', 'POLAND', '2')];
    const result = useLocationSuggestions(events);
    const countries = result.filter((s) => s.type === 'country');
    expect(countries).toHaveLength(1);
  });

  it('3 events with 2 distinct cities and 1 country → 3 suggestions total', () => {
    const events = [
      makeEvent('Warsaw', 'Poland', '1'),
      makeEvent('Kraków', 'Poland', '2'),
      makeEvent('Warsaw', 'Poland', '3'),
    ];
    const result = useLocationSuggestions(events);
    expect(result).toHaveLength(3); // Warsaw, Kraków (cities) + Poland (country)
  });

  it('suggestion type is "city" for cities', () => {
    const result = useLocationSuggestions([makeEvent('Warsaw', 'Poland')]);
    const city = result.find((s) => s.text === 'Warsaw');
    expect(city?.type).toBe('city');
  });

  it('suggestion type is "country" for countries', () => {
    const result = useLocationSuggestions([makeEvent('Warsaw', 'Poland')]);
    const country = result.find((s) => s.text === 'Poland');
    expect(country?.type).toBe('country');
  });

  it('preserves original casing of city text in output', () => {
    const events = [makeEvent('Warsaw', 'Poland', '1'), makeEvent('warsaw', 'Poland', '2')];
    const result = useLocationSuggestions(events);
    const cities = result.filter((s) => s.type === 'city');
    // First event wins — the first occurrence's casing is kept
    expect(cities[0].text).toBe('Warsaw');
  });
});
