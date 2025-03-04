import { db } from '@/db/db';
import { eventAttendees } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getTrainingList = async (eventId: string) => {
  const trainingList = await db
    .select()
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId));

  return trainingList[0] || null;
};
