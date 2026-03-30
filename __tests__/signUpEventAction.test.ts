/**
 * Tests for the FormData validation guard in signUpEventAction().
 *
 * signUpEventAction extracts eventId from FormData and rejects invalid inputs
 * before delegating to signUpForEvent. These tests cover only the guard path
 * (when eventId is missing/invalid), which is testable without database access.
 */

// Mock DB to prevent TURSO_URL environment variable requirement
jest.mock('@/db/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue([]),
    values: jest.fn().mockResolvedValue({ rowsAffected: 1 }),
    set: jest.fn().mockReturnThis(),
  },
}));

jest.mock('@/app/auth', () => ({
  auth: jest.fn().mockResolvedValue({ user: { id: 'user-1', name: 'Test User' } }),
}));

jest.mock('@/actions/getTrainingEvent', () => ({
  getTrainingEvent: jest.fn().mockResolvedValue(null),
}));

jest.mock('@/actions/revalidations', () => ({
  revalidateTraining: jest.fn(),
  revalidateTrainings: jest.fn(),
}));

jest.mock('@/actions/notifications', () => ({
  createNotification: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

import { signUpEventAction } from '@/actions/attendeesEvents';

describe('signUpEventAction — FormData guard', () => {
  it('missing eventId (null) → returns invalid event ID error', async () => {
    const formData = new FormData();
    // eventId not appended → formData.get('eventId') returns null

    const result = await signUpEventAction(formData);

    expect(result).toEqual({ success: false, error: 'Invalid event ID' });
  });

  it('valid string eventId → passes the guard (delegates, returns object with success key)', async () => {
    const formData = new FormData();
    formData.append('eventId', 'event-abc-123');

    // getTrainingEvent is mocked to return null → downstream returns 'Event not found'
    // The important thing is the guard did NOT short-circuit with 'Invalid event ID'
    const result = await signUpEventAction(formData);

    expect(result).toHaveProperty('success');
    expect(result).not.toEqual({ success: false, error: 'Invalid event ID' });
  });
});
