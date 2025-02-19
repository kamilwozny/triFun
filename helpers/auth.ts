import jwt from 'jsonwebtoken';
import { COOKIE_NAME, SECRET_AUTH } from './contants';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export const hashPW = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW);
};

export const createTokenForUser = (userId: string) => {
  return jwt.sign({ id: userId }, SECRET_AUTH, { expiresIn: '1d' });
};

export const getTokenFromUser = async (token: {
  name: string;
  value: string;
}) => {
  const payload = jwt.verify(token.value, SECRET_AUTH) as { id: string };

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.id),
    columns: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
  return user;
};
export const signIn = async ({
  emailOrLogin,
  password,
}: {
  emailOrLogin: string;
  password: string;
}) => {
  const match = await db.query.users.findFirst({
    where: or(eq(users.email, emailOrLogin), eq(users.username, emailOrLogin)),
  });

  if (!match) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePW(password, match.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = createTokenForUser(match.id);
  const { password: pw, ...user } = match;
  console.log(token);
  return { user, token };
};

export const signUp = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  const hashedPW = await hashPW(password);
  const newUser = await db
    .insert(users)
    .values({
      email,
      password: hashedPW,
      username,
    })
    .returning();
  const user = newUser[0];
  const token = createTokenForUser(user.id);
  return { user, token };
};

export const getUserIdFromToken = (): string | null => {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) {
    console.error('Token not found');
    return 'null';
  }
  try {
    const payload = jwt.verify(token, SECRET_AUTH) as { id: string };
    return payload.id;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};
