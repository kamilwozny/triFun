'use server';

import { auth } from '@/app/auth';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type EditableField = 'name' | 'bio' | 'location';

const ALLOWED_FIELDS: EditableField[] = ['name', 'bio', 'location'];

export async function updateUserField(field: EditableField, value: string) {
  if (!ALLOWED_FIELDS.includes(field)) {
    throw new Error('Invalid field');
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  await db
    .update(users)
    .set({ [field]: value.trim(), updatedAt: new Date().toISOString() })
    .where(eq(users.id, session.user.id));

  revalidatePath('/settings');
  revalidatePath(`/profile/${session.user.id}`);
}
