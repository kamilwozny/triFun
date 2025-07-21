import { db } from '@/db/db';
import { revalidateTrainings } from './revalidations';
import { reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createReviews(
  reviewData: {
    targetUserId: string;
    rating: number;
    reviewerId: string;
    eventId: string;
    comment?: string;
  }[]
) {
  try {
    console.log('Creating reviews:', reviewData);
    const result = await db.insert(reviews).values(reviewData);

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
