'use server';

import { db } from '@/db/db';
import { eventAttendees, trainingEvents } from '@/db/schema';
import type { Location } from '../components/map/types';
import { auth } from '@/app/auth';
import { TrainingEvent, Level } from '@/types/training';
import { revalidateTrainings } from './revalidations';
import { and, SQL, lte, gte, like, inArray, eq } from 'drizzle-orm';

interface CreateTrainingEventData {
  name: string;
  description: string;
  activities: string[];
  level: Level;
  date: string;
  startTime: string;
  distances: Array<{
    activity: string;
    distance: number;
    unit: string;
  }>;
  isPrivate: boolean;
}

export async function createNewTrainingEvent(
  data: CreateTrainingEventData,
  location: Location,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const resultId = await db
      .insert(trainingEvents)
      .values({
        name: data.name,
        description: data.description,
        city: location.city || '',
        country: location.country || '',
        userPosition: `${location.position?.lat},${location.position?.lng}`,
        distances: JSON.stringify(data.distances),
        date: data.date,
        startTime: data.startTime,
        level: data.level,
        createdBy: session.user.id,
        isPrivate: data.isPrivate,
      })
      .returning({ id: trainingEvents.id });

    if (resultId) {
      const insertHostResult = await db.insert(eventAttendees).values({
        eventId: resultId[0].id,
        attendeeId: session.user.id,
        status: 'confirmed',
        isHost: true,
        createdAt: new Date(),
      });
      if (resultId && insertHostResult) {
        revalidateTrainings();
        return { success: true };
      }

      return { success: false };
    }
  } catch (error) {
    console.error('Error creating training event:', error);
    throw error;
  }
}

type SearchParamsProps = {
  search?: string;
  userEvents?: boolean;
  joinedEvents?: boolean;
  pastEvents?: boolean;
  levels?: string[];
  location?: string;
  radius?: string;
  categorySport?: string;
};

export async function getTrainingEvents({
  search,
  userEvents,
  joinedEvents,
  pastEvents,
  levels,
  location,
  radius,
  categorySport,
}: SearchParamsProps): Promise<TrainingEvent[]> {
  const conditions: SQL[] = [];
  try {
    if (search) {
      conditions.push(like(trainingEvents.name, `%${search}%`));
    }

    if (categorySport) {
      conditions.push(eq(trainingEvents.distances, categorySport));
    }

    if (levels?.length) {
      conditions.push(inArray(trainingEvents.level, levels));
    }

    if (pastEvents !== undefined) {
      const now = new Date();
      if (pastEvents) {
        conditions.push(lte(trainingEvents.date, now));
      } else {
        conditions.push(gte(trainingEvents.date, now));
      }
    }

    const events = await db
      .select()
      .from(trainingEvents)
      .where(conditions.length ? and(...conditions) : undefined);

    return events.map((event) => {
      const userPosition = event.userPosition.split(',').map(Number);
      const distances = JSON.parse(event.distances);
      const activities = distances.map((d: { activity: string }) => d.activity);

      return {
        ...event,
        activities,
        location: userPosition
          ? { lat: userPosition[0], lng: userPosition[1] }
          : undefined,
        parsedDistances: distances,
      };
    });
  } catch (error) {
    console.error('Error fetching training events:', error);
    throw new Error('Failed to fetch training events');
  }
}
