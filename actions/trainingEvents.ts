'use server';

import { db } from '@/db/db';
import { eventAttendees, trainingEvents } from '@/db/schema';
import type { Location } from '../components/map/types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getUserIdFromToken } from '@/helpers/auth';
import { LatLng } from 'leaflet';

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
  const userId = getUserIdFromToken();
  try {
    await db.insert(trainingEvents).values({
      description: data.description,
      name: data.name,
      city: location.city,
      country: location.country,
      userPosition: JSON.stringify(userPosition),
      distances: JSON.stringify(data.distances),
      date: data.date,
      level: data.level,
      isPublic: true,
      createdBy: userId,
    });
    await db.insert(eventAttendees).values({
      eventId: trainingEvents.id,
      userId: userId,
    });
    revalidateTag('trainings');
  } catch (error) {
    console.error('Error creating event:', error);
  }
};
