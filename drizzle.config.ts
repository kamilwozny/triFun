import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
  schema: './db/schema.ts',
  out: './migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
  },
  verbose: true,
  strict: true,
} satisfies Config;
