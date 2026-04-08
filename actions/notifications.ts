'use server';

import { db } from '@/db/db';
import { notifications, users, type NotificationType } from '@/db/schema';
import { auth } from '@/app/auth';
import { eq, and, desc } from 'drizzle-orm';

export type NotificationWithActor = {
  id: string;
  type: NotificationType;
  entityId: string;
  entityType: 'event' | 'review';
  message: string;
  href: string;
  isRead: boolean;
  createdAt: string;
  actor: { id: string; name: string | null; image: string | null } | null;
};

export async function getNotificationPreview(
  limit = 3,
): Promise<{ count: number; items: NotificationWithActor[] }> {
  const session = await auth();
  if (!session?.user?.id) return { count: 0, items: [] };

  const userId = session.user.id;

  const [unread, rows] = await Promise.all([
    db
      .select({ id: notifications.id })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
        ),
      ),
    db
      .select({
        id: notifications.id,
        type: notifications.type,
        entityId: notifications.entityId,
        entityType: notifications.entityType,
        message: notifications.message,
        href: notifications.href,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        actorId: notifications.actorId,
        actorName: users.name,
        actorImage: users.image,
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.actorId, users.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit),
  ]);

  return {
    count: unread.length,
    items: rows.map((r) => ({
      id: r.id,
      type: r.type,
      entityId: r.entityId,
      entityType: r.entityType,
      message: r.message,
      href: r.href,
      isRead: r.isRead,
      createdAt: r.createdAt,
      actor: r.actorId
        ? { id: r.actorId, name: r.actorName ?? null, image: r.actorImage ?? null }
        : null,
    })),
  };
}

export async function getNotificationCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const result = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false),
      ),
    );

  return result.length;
}

export async function getRecentNotifications(
  limit = 3,
): Promise<NotificationWithActor[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      entityId: notifications.entityId,
      entityType: notifications.entityType,
      message: notifications.message,
      href: notifications.href,
      isRead: notifications.isRead,
      createdAt: notifications.createdAt,
      actorId: notifications.actorId,
      actorName: users.name,
      actorImage: users.image,
    })
    .from(notifications)
    .leftJoin(users, eq(notifications.actorId, users.id))
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    entityId: r.entityId,
    entityType: r.entityType,
    message: r.message,
    href: r.href,
    isRead: r.isRead,
    createdAt: r.createdAt,
    actor: r.actorId
      ? { id: r.actorId, name: r.actorName ?? null, image: r.actorImage ?? null }
      : null,
  }));
}

export async function getAllNotifications(): Promise<NotificationWithActor[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      entityId: notifications.entityId,
      entityType: notifications.entityType,
      message: notifications.message,
      href: notifications.href,
      isRead: notifications.isRead,
      createdAt: notifications.createdAt,
      actorId: notifications.actorId,
      actorName: users.name,
      actorImage: users.image,
    })
    .from(notifications)
    .leftJoin(users, eq(notifications.actorId, users.id))
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt));

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    entityId: r.entityId,
    entityType: r.entityType,
    message: r.message,
    href: r.href,
    isRead: r.isRead,
    createdAt: r.createdAt,
    actor: r.actorId
      ? { id: r.actorId, name: r.actorName ?? null, image: r.actorImage ?? null }
      : null,
  }));
}

export async function markAllAsRead(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false),
      ),
    );
}

export async function createNotification(data: {
  userId: string;
  actorId?: string;
  type: NotificationType;
  entityId: string;
  entityType: 'event' | 'review';
  message: string;
  href: string;
}): Promise<void> {
  await db.insert(notifications).values({
    userId: data.userId,
    actorId: data.actorId ?? null,
    type: data.type,
    entityId: data.entityId,
    entityType: data.entityType,
    message: data.message,
    href: data.href,
    isRead: false,
  });
}
