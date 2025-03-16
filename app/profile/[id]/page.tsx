import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
    })
    .from(users)
    .where(eq(users.id, params.id));

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-white rounded-full w-16">
              <span className="text-2xl">{user.name?.charAt(0) || 'U'}</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              {user.name || 'Anonymous'}
            </h1>
            {user.email && <p className="text-neutral-600">{user.email}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
