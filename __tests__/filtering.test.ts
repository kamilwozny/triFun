// Mock React's useMemo so hooks can run outside React without a renderer
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: (fn: () => unknown) => fn(),
}));

import { useEventFiltering } from '@/hooks/useTrainingEvents';
import { TrainingEvent } from '@/types/training';

const makeEvent = (overrides: Partial<TrainingEvent>): TrainingEvent =>
  ({
    id: 'evt-1',
    name: 'Test Event',
    city: 'Warsaw',
    country: 'Poland',
    activities: ['Run'],
    date: '2099-01-01',
    createdBy: 'user-1',
    attendees: [],
    ...overrides,
  } as TrainingEvent);

describe('useEventFiltering (search + activity)', () => {
  const events = [
    makeEvent({ id: '1', city: 'Warsaw', country: 'Poland', activities: ['Run'] }),
    makeEvent({ id: '2', city: 'Berlin', country: 'Germany', activities: ['Bike'] }),
    makeEvent({ id: '3', city: 'Kraków', country: 'Poland', activities: ['Swim'] }),
  ];

  it('returns all events when no query and no activity', () => {
    const result = useEventFiltering(events, '', null);
    expect(result).toHaveLength(3);
  });

  it('filters by city (case-insensitive)', () => {
    const result = useEventFiltering(events, 'warsaw', null);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by country', () => {
    const result = useEventFiltering(events, 'Poland', null);
    expect(result).toHaveLength(2);
  });

  it('returns empty array when no city/country matches', () => {
    const result = useEventFiltering(events, 'Tokyo', null);
    expect(result).toHaveLength(0);
  });

  it('filters by activity', () => {
    const result = useEventFiltering(events, '', 'Bike');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns all events when activity is "All"', () => {
    const result = useEventFiltering(events, '', 'All');
    expect(result).toHaveLength(3);
  });

  it('combines search query and activity filter', () => {
    const result = useEventFiltering(events, 'Poland', 'Swim');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('returns empty when activity matches but city does not', () => {
    const result = useEventFiltering(events, 'Berlin', 'Run');
    expect(result).toHaveLength(0);
  });
});
