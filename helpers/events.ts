import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { trainingEvents } from '@/db/schema';
import { db } from '@/db/db';
import { unstable_cache as cache } from 'next/cache';

export const getMyTrainingEvents = async (userId: string) => {
  const data = await db.query.trainingEvents.findMany({
    where: and(eq(trainingEvents.createdBy, userId)),
    columns: {
      id: true,
      name: true,
      description: true,
      city: true,
      country: true,
      distances: true,
      level: true,
      userPosition: true,
      date: true,
    },
    orderBy: [desc(trainingEvents.createdAt)],
  });
  return data ?? [];
};

export const getAllTrainingEvents = cache(async () => {
  const data = await db.query.trainingEvents.findMany({
    columns: {
      id: true,
      name: true,
      description: true,
      city: true,
      country: true,
      distances: true,
      level: true,
      userPosition: true,
      date: true,
    },
    orderBy: [desc(trainingEvents.createdAt)],
  });
  return data ?? [];
});

export const getOneEvent = async (userId: string, eventId: string) => {
  return db.query.events.findFirst({
    where: and(
      eq(trainingEvents.createdBy, userId),
      eq(trainingEvents.id, eventId)
    ),
  });
};
