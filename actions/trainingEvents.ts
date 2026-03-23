'use server';

import { db } from '@/db/db';
import { eventAttendees, trainingEvents } from '@/db/schema';
import type { Location } from '../components/map/types';
import { auth } from '@/app/auth';
import { TrainingEvent, Level } from '@/types/training';
import { revalidateTrainings } from './revalidations';
import { and, SQL, like, or } from 'drizzle-orm';

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
  routeGeoJson?: string;
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
        routeGeoJson: data.routeGeoJson ?? null,
      })
      .returning({ id: trainingEvents.id });

    if (resultId && resultId.length > 0) {
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
  location?: string;
  categorySport?: string;
};

export async function getTrainingEvents({
  search,
  location,
  categorySport,
}: SearchParamsProps): Promise<TrainingEvent[]> {
  const conditions: SQL[] = [];
  try {
    if (search) {
      conditions.push(
        or(
          like(trainingEvents.name, `%${search}%`),
          like(trainingEvents.description, `%${search}%`),
        )!,
      );
    }

    if (location) {
      conditions.push(
        or(
          like(trainingEvents.city, `%${location}%`),
          like(trainingEvents.country, `%${location}%`),
        )!,
      );
    }

    if (categorySport) {
      conditions.push(like(trainingEvents.distances, `%"activity":"${categorySport}"%`));
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
