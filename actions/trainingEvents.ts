'use server';

import { db } from '@/db/db';
import { eventAttendees, trainingEvents } from '@/db/schema';
import type { Location } from '../components/map/types';
import { LatLng } from 'leaflet';
import { auth } from '@/app/auth';
import { TrainingEvent, Level } from '@/types/training';

interface DistanceData {
  activity: string;
  distance: number;
  unit: 'meters' | 'kilometers';
}

interface FormData {
  name: string;
  description: string;
  activities: string[];
  distances: DistanceData[];
  level: Level;
  date: string;
  isPrivate: boolean;
}

export const createNewTrainingEvent = async (
  data: FormData,
  location: Location
) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  if (!location.city || !location.country || !location.position) {
    throw new Error(
      'Location information is incomplete. Please select a location on the map.'
    );
  }

  try {
    const [event] = await db
      .insert(trainingEvents)
      .values({
        description: data.description,
        name: data.name,
        city: location.city,
        country: location.country,
        userPosition: JSON.stringify(location.position),
        distances: JSON.stringify(data.distances),
        date: data.date,
        level: data.level,
        isPrivate: data.isPrivate,
        createdBy: session.user.id,
      })
      .returning({ id: trainingEvents.id });

    await db.insert(eventAttendees).values({
      eventId: event.id,
      attendeeId: session.user.id,
      status: 'confirmed' as const,
      createdAt: new Date(),
    });

    return { success: true, eventId: event.id };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

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
