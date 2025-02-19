import { z } from 'zod';

export const loginAuthSchema = z.object({
  emailOrLogin: z.string().min(4),
  password: z.string().min(6),
});

export const registerAuthSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(6),
});
