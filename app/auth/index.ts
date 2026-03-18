import { db } from '@/db/db';
import NextAuth, { User, NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Strava from 'next-auth/providers/strava';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { accounts, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { utapi } from '@/server/uploadthing';

export const BASE_PATH = '/api/auth';

const authOptions: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Strava({
      clientId: process.env.STRAVA_ID,
      clientSecret: process.env.STRAVA_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        const users = [
          {
            id: 'test-user-1',
            userName: 'test1',
            name: 'Test 1',
            password: 'pass',
            email: 'test1@donotreply.com',
          },
          {
            id: 'test-user-2',
            userName: 'test2',
            name: 'Test 2',
            password: 'pass',
            email: 'test2@donotreply.com',
          },
        ];
        const user = users.find(
          (user) =>
            user.userName === credentials.username &&
            user.password === credentials.password,
        );
        return user
          ? { id: user.id, name: user.name, email: user.email }
          : null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (!user?.id || !user.image) return;
      const upload = await utapi.uploadFilesFromUrl(user.image);
      const file = upload.data?.ufsUrl;
      await db
        .update(users)
        .set({
          customAvatar: file,
        })
        .where(eq(users.id, user.id));
    },
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === 'strava' && profile && user.id) {
        const p = profile as Record<string, unknown>;
        const location = [p.city, p.country]
          .filter(Boolean)
          .join(', ');
        if (location) {
          const [existing] = await db
            .select({ location: users.location })
            .from(users)
            .where(eq(users.id, user.id));
          if (!existing?.location) {
            await db
              .update(users)
              .set({ location })
              .where(eq(users.id, user.id));
          }
        }
      }
    },
  },
  session: {
    strategy: 'database',
  },
  adapter: DrizzleAdapter(db, { usersTable: users, accountsTable: accounts }),
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
export default NextAuth(authOptions);
