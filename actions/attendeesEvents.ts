'use server';

import { db } from '@/db/db';
import { eventAttendees } from '@/db/schema';
import { auth } from '@/app/auth';
import { eq, and } from 'drizzle-orm';
import { getTrainingEvent } from './getTrainingEvent';
import { revalidateTraining } from './revalidations';

export async function signUpForEvent(eventId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const event = await getTrainingEvent(eventId);
    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    const existingAttendee = await db
      .select()
      .from(eventAttendees)
      .where(
        and(
          eq(eventAttendees.eventId, eventId),
          eq(eventAttendees.attendeeId, session.user.id)
        )
      )
      .execute();

    if (existingAttendee.length > 0) {
      return { success: false, error: 'Already signed up for this event' };
    }

    const status = event.isPrivate ? 'pending' : 'confirmed';

    await db.insert(eventAttendees).values({
      eventId,
      attendeeId: session.user.id,
      status,
      createdAt: new Date(),
    });
    revalidateTraining(eventId);

    return {
      success: true,
      message: event.isPrivate
        ? 'Request sent! Waiting for host approval.'
        : 'Successfully signed up for the event!',
    };
  } catch (error) {
    console.error('Error signing up for event:', error);
    return { success: false, error: 'Failed to sign up for event' };
  }
}

export async function signUpEventAction(formData: FormData) {
  const eventId = formData.get('eventId');

  if (!eventId || typeof eventId !== 'string') {
    return { success: false, error: 'Invalid event ID' };
  }

  return signUpForEvent(eventId);
}
