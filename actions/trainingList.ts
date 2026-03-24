import { db } from '@/db/db';
import { eventAttendees, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getTrainingList = async (eventId: string) => {
  const attendeesList = await db
    .select({
      id: users.id,
      name: users.name,
      status: eventAttendees.status,
      isHost: eventAttendees.isHost,
      joinedDate: eventAttendees.createdAt,
    })
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId))
    .leftJoin(users, eq(users.id, eventAttendees.attendeeId));

  return attendeesList;
};
