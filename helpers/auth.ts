import jwt from 'jsonwebtoken';
import { COOKIE_NAME, SECRET_AUTH } from './contants';
import { cookies } from 'next/headers';

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
