'use server';

import { db } from '@/db/db';
import { eventAttendees, trainingEvents, users } from '@/db/schema';
import { auth } from '@/app/auth';
import { eq, and } from 'drizzle-orm';
import { getTrainingEvent } from './getTrainingEvent';
import { revalidateTraining } from './revalidations';
import { createNotification } from './notifications';

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
      .select({ eventId: eventAttendees.eventId })
      .from(eventAttendees)
      .where(
        and(
          eq(eventAttendees.eventId, eventId),
          eq(eventAttendees.attendeeId, session.user.id),
        ),
      )
      .limit(1)
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

    // Notify the event host
    const hostId = event.createdBy;
    if (hostId && hostId !== session.user.id) {
      const actor = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
        .execute();
      const actorName = actor[0]?.name ?? 'Someone';

      if (event.isPrivate) {
        await createNotification({
          userId: hostId,
          actorId: session.user.id,
          type: 'join_request',
          entityId: eventId,
          entityType: 'event',
          message: `${actorName} requested to join your event "${event.name}"`,
          href: `/trainings/${eventId}`,
        });
      } else {
        await createNotification({
          userId: hostId,
          actorId: session.user.id,
          type: 'joined',
          entityId: eventId,
          entityType: 'event',
          message: `${actorName} joined your event "${event.name}"`,
          href: `/trainings/${eventId}`,
        });
      }
    }

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

export async function approveAttendee(
  eventId: string,
  attendeeId: string,
  action: 'confirm' | 'decline',
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const event = await db
      .select({ name: trainingEvents.name, createdBy: trainingEvents.createdBy })
      .from(trainingEvents)
      .where(eq(trainingEvents.id, eventId))
      .limit(1)
      .execute();

    if (!event[0]) {
      return { success: false, error: 'Event not found' };
    }

    if (event[0].createdBy !== session.user.id) {
      return { success: false, error: 'Not authorized' };
    }

    const newStatus = action === 'confirm' ? 'confirmed' : 'declined';

    await db
      .update(eventAttendees)
      .set({ status: newStatus })
      .where(
        and(
          eq(eventAttendees.eventId, eventId),
          eq(eventAttendees.attendeeId, attendeeId),
        ),
      );

    // Notify the attendee
    const host = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
      .execute();
    const hostName = host[0]?.name ?? 'The host';

    await createNotification({
      userId: attendeeId,
      actorId: session.user.id,
      type: action === 'confirm' ? 'join_confirmed' : 'join_declined',
      entityId: eventId,
      entityType: 'event',
      message:
        action === 'confirm'
          ? `${hostName} approved your request to join "${event[0].name}"`
          : `${hostName} declined your request to join "${event[0].name}"`,
      href: `/trainings/${eventId}`,
    });

    revalidateTraining(eventId);

    return { success: true };
  } catch (error) {
    console.error('Error approving attendee:', error);
    return { success: false, error: 'Failed to update attendee status' };
  }
}

export async function signUpEventAction(formData: FormData) {
  const eventId = formData.get('eventId');

  if (!eventId || typeof eventId !== 'string') {
    return { success: false, error: 'Invalid event ID' };
  }

  return signUpForEvent(eventId);
}
