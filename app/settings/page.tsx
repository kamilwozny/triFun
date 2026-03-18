import { auth } from '@/app/auth';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { EditableField } from '@/components/settings/EditableField';
import { getServerTranslation } from '@/localization/server';

export default async function SettingsPage() {
  const session = await auth();
  const { t } = await getServerTranslation();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      bio: users.bio,
      location: users.location,
      customAvatar: users.customAvatar,
      image: users.image,
    })
    .from(users)
    .where(eq(users.id, session.user.id));

  if (!user) {
    redirect('/signin');
  }

  const avatarSrc = user.customAvatar ?? user.image;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('settings')}</h1>

      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
          {t('profile')}
        </h2>

        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-base-300">
          {avatarSrc ? (
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-base-300 shrink-0">
              <Image
                src={avatarSrc}
                alt={user.name ?? 'Avatar'}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="avatar placeholder shrink-0">
              <div className="bg-neutral text-neutral-content rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                </span>
              </div>
            </div>
          )}
          <div>
            <p className="font-semibold">{user.name ?? 'Anonymous'}</p>
            <p className="text-sm text-base-content/50">{user.email}</p>
          </div>
        </div>

        <div>
          <EditableField
            field="name"
            label="Display Name"
            value={user.name ?? ''}
            placeholder="Your name"
          />
          <EditableField
            field="bio"
            label="Bio"
            value={user.bio ?? ''}
            placeholder="Tell others about yourself..."
            multiline
          />
          <EditableField
            field="location"
            label="Location"
            value={user.location ?? ''}
            placeholder="City, Country"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-4">
          {t('account')}
        </h2>
        <div className="py-3">
          <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wider block mb-1">
            {t('email')}
          </label>
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <Lock className="h-3.5 w-3.5 shrink-0 text-base-content/30" />
            <span>{user.email}</span>
          </div>
          <p className="text-xs text-base-content/40 mt-1">
            {t('managedByProvider')}
          </p>
        </div>
      </div>
    </div>
  );
}
