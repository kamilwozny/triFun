import { z } from 'zod';

export const loginAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const registerAuthSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(6),
});
