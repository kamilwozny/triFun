'use server';

import { db } from '@/db/db';
import { revalidateTrainings } from './revalidations';
import { reviews, users, trainingEvents } from '@/db/schema';
import { alias } from 'drizzle-orm/sqlite-core';
import { and, eq, inArray } from 'drizzle-orm';
import { auth } from '@/app/auth';
import { createNotification } from './notifications';

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

  const reviewerId = session.user.id as string;

  const safeData = reviewData
    .filter((r) => r.targetUserId !== reviewerId)
    .map((r) => ({ ...r, reviewerId }));

  if (safeData.length === 0) return { success: false };

  try {
    const result = await db.insert(reviews).values(safeData);

    if (result) {
      // Fetch reviewer name and event name for notification messages
      const [reviewer, event] = await Promise.all([
        db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, reviewerId))
          .limit(1)
          .execute(),
        safeData[0]?.eventId
          ? db
              .select({ name: trainingEvents.name })
              .from(trainingEvents)
              .where(eq(trainingEvents.id, safeData[0].eventId))
              .limit(1)
              .execute()
          : Promise.resolve([]),
      ]);
      const reviewerName = reviewer[0]?.name ?? 'Someone';
      const eventName = (event as { name: string }[])[0]?.name ?? 'an event';

      await Promise.all(
        safeData.map((r) =>
          createNotification({
            userId: r.targetUserId,
            actorId: reviewerId,
            type: 'review_received',
            entityId: r.eventId,
            entityType: 'review',
            message: `${reviewerName} gave you a review after "${eventName}"`,
            href: `/profile/${r.targetUserId}`,
          }),
        ),
      );

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

export async function getReviewedEventIds(
  eventIds: string[],
  reviewerId?: string,
): Promise<string[]> {
  if (eventIds.length === 0) return [];
  const baseCondition = inArray(reviews.eventId, eventIds);
  const rows = await db
    .selectDistinct({ eventId: reviews.eventId })
    .from(reviews)
    .where(
      reviewerId
        ? and(baseCondition, eq(reviews.reviewerId, reviewerId))
        : baseCondition,
    );
  return rows.map((r) => r.eventId);
}

export async function hasCurrentUserReviewedEvent(eventId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  const rows = await db
    .select({ eventId: reviews.eventId })
    .from(reviews)
    .where(and(eq(reviews.eventId, eventId), eq(reviews.reviewerId, session.user.id)))
    .limit(1);
  return rows.length > 0;
}

export async function getUserReviews(userId: string) {
  const targetUsers = alias(users, 'target_users');

  const [received, given] = await Promise.all([
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewerId: reviews.reviewerId,
        reviewerName: users.name,
        reviewerImage: users.image,
        eventId: reviews.eventId,
        eventName: trainingEvents.name,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .leftJoin(trainingEvents, eq(reviews.eventId, trainingEvents.id))
      .where(eq(reviews.targetUserId, userId)),

    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        targetUserId: reviews.targetUserId,
        targetUserName: targetUsers.name,
        targetUserImage: targetUsers.image,
        eventId: reviews.eventId,
        eventName: trainingEvents.name,
      })
      .from(reviews)
      .leftJoin(targetUsers, eq(reviews.targetUserId, targetUsers.id))
      .leftJoin(trainingEvents, eq(reviews.eventId, trainingEvents.id))
      .where(eq(reviews.reviewerId, userId)),
  ]);

  const totalReviews = received.length;
  const averageRating =
    totalReviews > 0
      ? received.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const allReviews = [
    ...received.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment ?? '',
      createdAt: new Date(r.createdAt).toISOString(),
      isReviewer: false,
      reviewer: { id: r.reviewerId, name: r.reviewerName ?? '', image: r.reviewerImage ?? '' },
      targetUser: { id: userId, name: '', image: '' },
      event: { id: r.eventId, name: r.eventName ?? '' },
    })),
    ...given.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment ?? '',
      createdAt: new Date(r.createdAt).toISOString(),
      isReviewer: true,
      reviewer: { id: userId, name: '', image: '' },
      targetUser: {
        id: r.targetUserId,
        name: r.targetUserName ?? '',
        image: r.targetUserImage ?? '',
      },
      event: { id: r.eventId, name: r.eventName ?? '' },
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { reviews: allReviews, stats: { averageRating, totalReviews } };
}
