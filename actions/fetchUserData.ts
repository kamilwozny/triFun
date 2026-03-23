import { auth } from '@/app/auth';
import { db } from '@/db/db';
import { eventAttendees, trainingEvents, users } from '@/db/schema';
import { eq, sql, InferSelectModel } from 'drizzle-orm';

type Count = {
  count: number;
}[];

type FetchUserDataResult = {
  hostedEvents: Count;
  attendedEvents: Count;
  userData: InferSelectModel<typeof users>;
} | null;

export const fetchUserData = async (): Promise<FetchUserDataResult> => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [userData] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id));

  if (!userData) return null;

  const hostedEvents = await db
    .select({ count: sql<number>`count(*)` })
    .from(trainingEvents)
    .where(eq(trainingEvents.createdBy, session.user.id));

  const attendedEvents = await db
    .select({ count: sql<number>`count(*)` })
    .from(eventAttendees)
    .where(eq(eventAttendees.attendeeId, session.user.id));

  return { hostedEvents, attendedEvents, userData };
};
