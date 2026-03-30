// Mock React's useMemo so hooks can run outside React without a renderer
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: (fn: () => unknown) => fn(),
}));

// Mock getTodayMidnight to control the date boundary
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  getTodayMidnight: jest.fn(),
}));

import { useTrainingEventsFilter } from '@/hooks/useTrainingEvents';
import { getTodayMidnight } from '@/lib/utils';
import { TrainingEvent } from '@/types/training';

// Fixed today: 2024-06-15T00:00:00.000Z
const TODAY = new Date('2024-06-15T00:00:00.000Z');

beforeEach(() => {
  (getTodayMidnight as jest.Mock).mockReturnValue(TODAY);
});

const makeEvent = (overrides: Partial<TrainingEvent> = {}): TrainingEvent => ({
  id: 'evt-1',
  name: 'Test Event',
  description: '',
  city: 'Warsaw',
  country: 'Poland',
  userPosition: '52.2297,21.0122',
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
  ...overrides,
});

describe('useTrainingEventsFilter — upcomingEvents', () => {
  it('event date == today (midnight) → included in upcoming', () => {
    // TODAY is 2024-06-15T00:00:00.000Z, new Date('2024-06-15') >= TODAY
    const events = [makeEvent({ id: '1', date: '2024-06-15' })];
    const { upcomingEvents } = useTrainingEventsFilter(events);
    expect(upcomingEvents).toHaveLength(1);
  });

  it('event date < today → excluded from upcoming', () => {
    const events = [makeEvent({ id: '1', date: '2024-01-01' })];
    const { upcomingEvents } = useTrainingEventsFilter(events);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('event date > today → included in upcoming', () => {
    const events = [makeEvent({ id: '1', date: '2099-01-01' })];
    const { upcomingEvents } = useTrainingEventsFilter(events);
    expect(upcomingEvents).toHaveLength(1);
  });
});

describe('useTrainingEventsFilter — pastEvents', () => {
  it('event date < today → included in past', () => {
    const events = [makeEvent({ id: '1', date: '2024-01-01' })];
    const { pastEvents } = useTrainingEventsFilter(events);
    expect(pastEvents).toHaveLength(1);
  });

  it('event date == today → excluded from past (boundary: strict <)', () => {
    const events = [makeEvent({ id: '1', date: '2024-06-15' })];
    const { pastEvents } = useTrainingEventsFilter(events);
    expect(pastEvents).toHaveLength(0);
  });

  it('event date > today → excluded from past', () => {
    const events = [makeEvent({ id: '1', date: '2099-01-01' })];
    const { pastEvents } = useTrainingEventsFilter(events);
    expect(pastEvents).toHaveLength(0);
  });
});

describe('useTrainingEventsFilter — userEvents', () => {
  const userId = 'user-1';

  it('no userId → userEvents is empty', () => {
    const events = [makeEvent({ id: '1', createdBy: userId })];
    const { userEvents } = useTrainingEventsFilter(events);
    expect(userEvents).toHaveLength(0);
  });

  it('userId matches createdBy → included in userEvents (host)', () => {
    const events = [makeEvent({ id: '1', createdBy: userId, date: '2099-01-01' })];
    const { userEvents } = useTrainingEventsFilter(events, userId);
    expect(userEvents).toHaveLength(1);
  });

  it('userId matches attendee.attendeeId → included in userEvents', () => {
    const attendee = { eventId: 'evt-1', attendeeId: userId, status: 'confirmed', createdAt: new Date() };
    const events = [makeEvent({ id: '1', createdBy: 'other-user', date: '2099-01-01', attendees: [attendee] })];
    const { userEvents } = useTrainingEventsFilter(events, userId);
    expect(userEvents).toHaveLength(1);
  });

  it('past event where user is host → NOT in userEvents (userEvents only includes upcoming)', () => {
    const events = [makeEvent({ id: '1', createdBy: userId, date: '2024-01-01' })];
    const { userEvents } = useTrainingEventsFilter(events, userId);
    expect(userEvents).toHaveLength(0);
  });

  it('user not host or attendee → excluded from userEvents', () => {
    const events = [makeEvent({ id: '1', createdBy: 'other-user', date: '2099-01-01', attendees: [] })];
    const { userEvents } = useTrainingEventsFilter(events, userId);
    expect(userEvents).toHaveLength(0);
  });
});

describe('useTrainingEventsFilter — empty input', () => {
  it('empty events list → all three arrays empty', () => {
    const { upcomingEvents, userEvents, pastEvents } = useTrainingEventsFilter([]);
    expect(upcomingEvents).toHaveLength(0);
    expect(userEvents).toHaveLength(0);
    expect(pastEvents).toHaveLength(0);
  });
});

describe('useTrainingEventsFilter — mixed events', () => {
  it('correctly splits upcoming, past, and user events', () => {
    const userId = 'user-1';
    const attendee = { eventId: 'planned', attendeeId: userId, status: 'confirmed', createdAt: new Date() };
    const events = [
      makeEvent({ id: 'upcoming-other', date: '2099-01-01', createdBy: 'other' }),
      makeEvent({ id: 'past-other', date: '2024-01-01', createdBy: 'other' }),
      makeEvent({ id: 'host-upcoming', date: '2099-01-01', createdBy: userId }),
      makeEvent({ id: 'planned-upcoming', date: '2099-01-01', createdBy: 'other', attendees: [attendee] }),
    ];
    const { upcomingEvents, pastEvents, userEvents } = useTrainingEventsFilter(events, userId);

    expect(upcomingEvents.map((e) => e.id)).toEqual(
      expect.arrayContaining(['upcoming-other', 'host-upcoming', 'planned-upcoming']),
    );
    expect(pastEvents.map((e) => e.id)).toEqual(['past-other']);
    expect(userEvents.map((e) => e.id)).toEqual(
      expect.arrayContaining(['host-upcoming', 'planned-upcoming']),
    );
    expect(userEvents.map((e) => e.id)).not.toContain('upcoming-other');
  });
});
