import { db } from '@/db/db';
import { trainingEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getTrainingEvent = async (eventId: string) => {
  const trainingEvent = await db
    .select()
    .from(trainingEvents)
    .where(eq(trainingEvents.id, eventId))
    .limit(1);

  return trainingEvent[0] || null;
};
