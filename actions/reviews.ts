import { db } from '@/db/db';
import { revalidateTrainings } from './revalidations';
import { reviews } from '@/db/schema';

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
