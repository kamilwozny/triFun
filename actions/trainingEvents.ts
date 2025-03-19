'use server';

import { db } from '@/db/db';
import { trainingEvents } from '@/db/schema';
import type { Location } from '../components/map/types';
import { auth } from '@/app/auth';
import { TrainingEvent, Level } from '@/types/training';
import { revalidateTrainings } from './revalidations';

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
  location: Location
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const result = await db.insert(trainingEvents).values({
      id: crypto.randomUUID(),
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
    });

    if (result) {
      revalidateTrainings();
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error('Error creating training event:', error);
    throw error;
  }
}

export async function getTrainingEvents(): Promise<TrainingEvent[]> {
  try {
    const events = await db.select().from(trainingEvents);
    return events.map((event) => {
      const userPosition = JSON.parse(event.userPosition);
      const distances = JSON.parse(event.distances);
      const activities = distances.map((d: { activity: string }) => d.activity);

      return {
        ...event,
        activities,
        location: userPosition
          ? { lat: userPosition.lat, lng: userPosition.lng }
          : undefined,
        parsedDistances: distances,
      };
    });
  } catch (error) {
    console.error('Error fetching training events:', error);
    throw new Error('Failed to fetch training events');
  }
}
