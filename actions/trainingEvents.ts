'use server';

import { db } from '@/db/db';
import { eventAttendees, trainingEvents } from '@/db/schema';
import type { Location } from '../components/map/types';
import { LatLng } from 'leaflet';
import { auth } from '@/app/auth';

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
  level: string;
  date: string;
}

export const createNewTrainingEvent = async (
  data: FormData,
  location: Location,
  userPosition: LatLng | null
) => {
  const session = await auth();

  try {
    const [event] = await db
      .insert(trainingEvents)
      .values({
        // @ts-ignore
        description: data.description,
        name: data.name,
        city: location.city,
        country: location.country,
        userPosition: JSON.stringify(userPosition),
        distances: JSON.stringify(data.distances),
        date: data.date,
        level: data.level,
        isPublic: true,
        createdBy: session?.user?.id,
      })
      .returning({ id: trainingEvents.id });
    // @ts-ignore
    await db.insert(eventAttendees).values({
      eventId: event.id,
      attendeeId: session?.user?.id,
    });
  } catch (error) {
    console.error('Error creating event:', error);
  }
};
