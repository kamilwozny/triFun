'use server';

import { db } from '@/db/db';
import { revalidateTrainings } from './revalidations';
import { reviews } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { auth } from '@/app/auth';

export async function createReviews(
  reviewData: {
    targetUserId: string;
    rating: number;
    reviewerId: string;
    eventId: string;
    comment?: string;
  }[]
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const safeData = reviewData
    .filter((r) => r.targetUserId !== session.user!.id)
    .map((r) => ({ ...r, reviewerId: session.user!.id }));

  if (safeData.length === 0) return { success: false };

  try {
    const result = await db.insert(reviews).values(safeData);

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

export async function getReviewsForEvent(eventId: string) {
  try {
    const reviewsList = await db
      .select()
      .from(reviews)
      .where(eq(reviews.eventId, eventId));

    return reviewsList;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

export async function getReviewedEventIds(eventIds: string[]): Promise<string[]> {
  if (eventIds.length === 0) return [];
  const rows = await db
    .selectDistinct({ eventId: reviews.eventId })
    .from(reviews)
    .where(inArray(reviews.eventId, eventIds));
  return rows.map((r) => r.eventId);
}
