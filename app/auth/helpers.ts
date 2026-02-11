'use server';
import { db } from '@/db/db';
import { auth, signIn as naSignIn, signOut as naSignOut } from '.';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function signIn() {
  await naSignIn();
  const session = await auth();
  console.log(session);
}

export async function signOut() {
  await naSignOut();
}
