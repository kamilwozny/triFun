// Mock React's useMemo so hooks can run outside React without a renderer
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: (fn: () => unknown) => fn(),
}));

// Mock getTodayMidnight so we can control the 'today' boundary
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  getTodayMidnight: jest.fn(),
}));

import { useAdvancedEventFiltering, getDefaultFilters, AllFilters } from '@/hooks/useAdvancedEventFiltering';
import { getTodayMidnight } from '@/lib/utils';
import { TrainingEvent } from '@/types/training';

// Fixed "today" for all tests: 2024-06-15
const TODAY = new Date('2024-06-15T00:00:00.000Z');
const PAST_DATE = '2024-01-01';
const FUTURE_DATE = '2099-01-01';

beforeEach(() => {
  (getTodayMidnight as jest.Mock).mockReturnValue(TODAY);
});

const makeEvent = (overrides: Partial<TrainingEvent> = {}): TrainingEvent => ({
  id: 'evt-1',
  name: 'Test Event',
  description: 'A test event',
  city: 'Warsaw',
  country: 'Poland',
  userPosition: '52.2297,21.0122',
  distances: '[]',
  date: FUTURE_DATE,
  level: 'Beginner',
  createdBy: 'user-1',
  createdAt: '2024-01-01',
  isPrivate: false,
  startTime: '09:00',
  activities: ['Run'],
  parsedDistances: [],
  location: { lat: 52.2297, lng: 21.0122 },
  attendees: [],
  ...overrides,
});

const defaultFilters = (): AllFilters => ({
  eventType: { showHostEvents: false, showPlannedEvents: false, showPastEvents: false },
  sports: [],
  location: { city: '', distanceKm: 0 },
});

// ─── Event Type Filtering ────────────────────────────────────────────────────

describe('useAdvancedEventFiltering — event type filters', () => {
  const userId = 'user-1';

  it('no filters active → all events shown', () => {
    const events = [
      makeEvent({ id: '1', createdBy: userId }),
      makeEvent({ id: '2', createdBy: 'other-user' }),
      makeEvent({ id: '3', date: PAST_DATE }),
    ];
    const result = useAdvancedEventFiltering(events, defaultFilters(), userId);
    expect(result).toHaveLength(3);
  });

  it('showHostEvents: true → only events created by userId', () => {
    const events = [
      makeEvent({ id: '1', createdBy: userId }),
      makeEvent({ id: '2', createdBy: 'other-user' }),
    ];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: true, showPlannedEvents: false, showPastEvents: false } };
    const result = useAdvancedEventFiltering(events, filters, userId);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('showHostEvents: true + event by different user → excluded', () => {
    const events = [makeEvent({ id: '1', createdBy: 'other-user' })];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: true, showPlannedEvents: false, showPastEvents: false } };
    const result = useAdvancedEventFiltering(events, filters, userId);
    expect(result).toHaveLength(0);
  });

  it('showPlannedEvents: true → only upcoming events where user is attendee', () => {
    const attendee = { eventId: 'evt', attendeeId: userId, status: 'confirmed', createdAt: new Date() };
    const events = [
      makeEvent({ id: '1', date: FUTURE_DATE, createdBy: 'other-user', attendees: [attendee] }),
      makeEvent({ id: '2', date: FUTURE_DATE, createdBy: 'other-user', attendees: [] }),
    ];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: false, showPlannedEvents: true, showPastEvents: false } };
    const result = useAdvancedEventFiltering(events, filters, userId);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('showPlannedEvents: true + past event where user is attendee → excluded (must be upcoming)', () => {
    const attendee = { eventId: 'evt', attendeeId: userId, status: 'confirmed', createdAt: new Date() };
    const events = [
      makeEvent({ id: '1', date: PAST_DATE, attendees: [attendee], createdBy: 'other-user' }),
    ];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: false, showPlannedEvents: true, showPastEvents: false } };
    const result = useAdvancedEventFiltering(events, filters, userId);
    expect(result).toHaveLength(0);
  });

  it('showPastEvents: true → only events where date < today', () => {
    const events = [
      makeEvent({ id: '1', date: PAST_DATE }),
      makeEvent({ id: '2', date: FUTURE_DATE }),
    ];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: false, showPlannedEvents: false, showPastEvents: true } };
    const result = useAdvancedEventFiltering(events, filters, userId);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('showPastEvents: true + upcoming event → excluded', () => {
    const events = [makeEvent({ id: '1', date: FUTURE_DATE })];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: false, showPlannedEvents: false, showPastEvents: true } };
    const result = useAdvancedEventFiltering(events, filters, userId);
    expect(result).toHaveLength(0);
  });

  it('showHostEvents + showPastEvents both true → host events UNION all past events', () => {
    const events = [
      makeEvent({ id: 'host-upcoming', date: FUTURE_DATE, createdBy: userId }),
      makeEvent({ id: 'past-other', date: PAST_DATE, createdBy: 'other-user' }),
      makeEvent({ id: 'other-upcoming', date: FUTURE_DATE, createdBy: 'other-user' }),
    ];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: true, showPlannedEvents: false, showPastEvents: true } };
    const result = useAdvancedEventFiltering(events, filters, userId);
    const ids = result.map((e) => e.id);
    expect(ids).toContain('host-upcoming');
    expect(ids).toContain('past-other');
    expect(ids).not.toContain('other-upcoming');
  });

  it('userId undefined + showHostEvents: true → no host events matched', () => {
    const events = [makeEvent({ id: '1', createdBy: 'user-1' })];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: true, showPlannedEvents: false, showPastEvents: false } };
    const result = useAdvancedEventFiltering(events, filters, undefined);
    expect(result).toHaveLength(0);
  });

  it('userId undefined + showPlannedEvents: true → no planned events matched', () => {
    const attendee = { eventId: 'evt', attendeeId: 'user-1', status: 'confirmed', createdAt: new Date() };
    const events = [makeEvent({ id: '1', attendees: [attendee], createdBy: 'user-1' })];
    const filters = { ...defaultFilters(), eventType: { showHostEvents: false, showPlannedEvents: true, showPastEvents: false } };
    const result = useAdvancedEventFiltering(events, filters, undefined);
    expect(result).toHaveLength(0);
  });
});

// ─── Sports Filtering ────────────────────────────────────────────────────────

describe('useAdvancedEventFiltering — sports filters', () => {
  const events = [
    makeEvent({ id: 'run', activities: ['Run'] }),
    makeEvent({ id: 'bike', activities: ['Bike'] }),
    makeEvent({ id: 'swim', activities: ['Swim'] }),
    makeEvent({ id: 'run-bike', activities: ['Run', 'Bike'] }),
  ];

  it('sports: [] → all events (no sport filter)', () => {
    const result = useAdvancedEventFiltering(events, defaultFilters());
    expect(result).toHaveLength(4);
  });

  it('sports: [Run] → only Run events', () => {
    const filters = { ...defaultFilters(), sports: ['Run' as const] };
    const result = useAdvancedEventFiltering(events, filters);
    const ids = result.map((e) => e.id);
    expect(ids).toContain('run');
    expect(ids).toContain('run-bike');
    expect(ids).not.toContain('bike');
    expect(ids).not.toContain('swim');
  });

  it('sports: [Run, Bike] → events with Run OR Bike', () => {
    const filters = { ...defaultFilters(), sports: ['Run' as const, 'Bike' as const] };
    const result = useAdvancedEventFiltering(events, filters);
    const ids = result.map((e) => e.id);
    expect(ids).toContain('run');
    expect(ids).toContain('bike');
    expect(ids).toContain('run-bike');
    expect(ids).not.toContain('swim');
  });

  it('sports: [Swim] + event has [Run, Swim] → matches (partial overlap)', () => {
    const mixed = [makeEvent({ id: 'mixed', activities: ['Run', 'Swim'] })];
    const filters = { ...defaultFilters(), sports: ['Swim' as const] };
    const result = useAdvancedEventFiltering(mixed, filters);
    expect(result).toHaveLength(1);
  });

  it('sports: [Swim] + event has [Run] only → excluded', () => {
    const runOnly = [makeEvent({ id: 'run-only', activities: ['Run'] })];
    const filters = { ...defaultFilters(), sports: ['Swim' as const] };
    const result = useAdvancedEventFiltering(runOnly, filters);
    expect(result).toHaveLength(0);
  });
});

// ─── Location / City Filtering ───────────────────────────────────────────────

describe('useAdvancedEventFiltering — location filters', () => {
  it('city: "", distanceKm: 0 → all events pass (no location filter)', () => {
    const events = [makeEvent({ id: '1', city: 'Warsaw' }), makeEvent({ id: '2', city: 'Berlin' })];
    const result = useAdvancedEventFiltering(events, defaultFilters());
    expect(result).toHaveLength(2);
  });

  it('city name match is case-insensitive', () => {
    const events = [makeEvent({ id: '1', city: 'Warsaw' })];
    const filters = { ...defaultFilters(), location: { city: 'warsaw', distanceKm: 0 } };
    const result = useAdvancedEventFiltering(events, filters);
    expect(result).toHaveLength(1);
  });

  it('city name partial match → included', () => {
    const events = [makeEvent({ id: '1', city: 'Warsaw' })];
    const filters = { ...defaultFilters(), location: { city: 'War', distanceKm: 0 } };
    const result = useAdvancedEventFiltering(events, filters);
    expect(result).toHaveLength(1);
  });

  it('city name matches country field → included', () => {
    const events = [makeEvent({ id: '1', city: 'Kraków', country: 'Poland' })];
    const filters = { ...defaultFilters(), location: { city: 'Poland', distanceKm: 0 } };
    const result = useAdvancedEventFiltering(events, filters);
    expect(result).toHaveLength(1);
  });

  it('city name not found → excluded', () => {
    const events = [makeEvent({ id: '1', city: 'Warsaw', country: 'Poland' })];
    const filters = { ...defaultFilters(), location: { city: 'Tokyo', distanceKm: 0 } };
    const result = useAdvancedEventFiltering(events, filters);
    expect(result).toHaveLength(0);
  });

  it('city + distanceKm > 0, reference point found → distance filter replaces name match', () => {
    // Warsaw center: 52.2297, 21.0122
    // Event 2km away should be included, event 200km away should not
    const warsawRef = makeEvent({ id: 'ref', city: 'Warsaw', location: { lat: 52.2297, lng: 21.0122 } });
    const nearWarsaw = makeEvent({ id: 'near', city: 'Other City', location: { lat: 52.24, lng: 21.01 } }); // ~1.2km away
    const farFromWarsaw = makeEvent({ id: 'far', city: 'Kraków', location: { lat: 50.0647, lng: 19.945 } }); // ~252km away
    const filters = { ...defaultFilters(), location: { city: 'Warsaw', distanceKm: 50 } };
    const result = useAdvancedEventFiltering([warsawRef, nearWarsaw, farFromWarsaw], filters);
    const ids = result.map((e) => e.id);
    expect(ids).toContain('ref');
    expect(ids).toContain('near');
    expect(ids).not.toContain('far');
  });

  it('city + distanceKm > 0, no event in that city → no referencePoint → name-match fallback', () => {
    // city 'Unknown' doesn't match any event → referencePoint = undefined
    // With no referencePoint and distanceKm > 0, distance filter is skipped
    // And city name filter applies by name (event city doesn't match 'Unknown')
    const events = [makeEvent({ id: '1', city: 'Warsaw' })];
    const filters = { ...defaultFilters(), location: { city: 'Unknown', distanceKm: 50 } };
    const result = useAdvancedEventFiltering(events, filters);
    expect(result).toHaveLength(0);
  });

  it('city: "", distanceKm > 0, userPosition set → uses GPS as reference', () => {
    const userPosition = { lat: 52.2297, lng: 21.0122 }; // Warsaw
    const nearEvent = makeEvent({ id: 'near', location: { lat: 52.24, lng: 21.01 } }); // ~1.2km
    const farEvent = makeEvent({ id: 'far', location: { lat: 50.0647, lng: 19.945 } }); // ~252km
    const filters = { ...defaultFilters(), location: { city: '', distanceKm: 50 } };
    const result = useAdvancedEventFiltering([nearEvent, farEvent], filters, undefined, userPosition);
    expect(result.map((e) => e.id)).toContain('near');
    expect(result.map((e) => e.id)).not.toContain('far');
  });

  it('city: "", no userPosition → distance filter disabled (all pass)', () => {
    const events = [
      makeEvent({ id: '1', location: { lat: 52.2297, lng: 21.0122 } }),
      makeEvent({ id: '2', location: { lat: 50.0647, lng: 19.945 } }),
    ];
    const filters = { ...defaultFilters(), location: { city: '', distanceKm: 50 } };
    const result = useAdvancedEventFiltering(events, filters);
    expect(result).toHaveLength(2);
  });

  it('event without .location field → passes distance filter', () => {
    const eventNoLocation = makeEvent({ id: '1', location: undefined });
    const filters = { ...defaultFilters(), location: { city: '', distanceKm: 50 } };
    const userPosition = { lat: 52.2297, lng: 21.0122 };
    const result = useAdvancedEventFiltering([eventNoLocation], filters, undefined, userPosition);
    expect(result).toHaveLength(1);
  });
});

// ─── Combined Filters ────────────────────────────────────────────────────────

describe('useAdvancedEventFiltering — combined filters', () => {
  it('sports + location both active → intersection required', () => {
    const events = [
      makeEvent({ id: 'match', activities: ['Run'], city: 'Warsaw', country: 'Poland' }),
      makeEvent({ id: 'wrong-sport', activities: ['Bike'], city: 'Warsaw', country: 'Poland' }),
      makeEvent({ id: 'wrong-city', activities: ['Run'], city: 'Berlin', country: 'Germany' }),
    ];
    const filters = {
      ...defaultFilters(),
      sports: ['Run' as const],
      location: { city: 'Warsaw', distanceKm: 0 },
    };
    const result = useAdvancedEventFiltering(events, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('match');
  });

  it('all three filter types active → strict intersection', () => {
    const userId = 'user-1';
    const events = [
      // Matches all: past event, user is host, Run, Warsaw
      makeEvent({ id: 'past-host-run-warsaw', date: PAST_DATE, createdBy: userId, activities: ['Run'], city: 'Warsaw' }),
      // Fails sport filter
      makeEvent({ id: 'past-host-bike-warsaw', date: PAST_DATE, createdBy: userId, activities: ['Bike'], city: 'Warsaw' }),
      // Fails city filter
      makeEvent({ id: 'past-host-run-berlin', date: PAST_DATE, createdBy: userId, activities: ['Run'], city: 'Berlin' }),
    ];
    const filters: AllFilters = {
      eventType: { showHostEvents: true, showPlannedEvents: false, showPastEvents: false },
      sports: ['Run' as const],
      location: { city: 'Warsaw', distanceKm: 0 },
    };
    const result = useAdvancedEventFiltering(events, filters, userId);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('past-host-run-warsaw');
  });
});

// ─── getDefaultFilters ───────────────────────────────────────────────────────

describe('getDefaultFilters', () => {
  it('returns all event type flags as false', () => {
    const f = getDefaultFilters();
    expect(f.eventType.showHostEvents).toBe(false);
    expect(f.eventType.showPlannedEvents).toBe(false);
    expect(f.eventType.showPastEvents).toBe(false);
  });

  it('returns empty sports array', () => {
    expect(getDefaultFilters().sports).toEqual([]);
  });

  it('returns empty city and 0 distanceKm', () => {
    const f = getDefaultFilters();
    expect(f.location.city).toBe('');
    expect(f.location.distanceKm).toBe(0);
  });
});
