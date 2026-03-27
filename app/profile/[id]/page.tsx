import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { getProfileStats } from '@/actions/profileStats';
import { getUserReviews } from '@/actions/reviews';
import { ProfileStats } from '@/app/profile/components/ProfileStats';
import { ActivityChart } from '@/app/profile/components/ActivityChart';
import { UserReviewsClient } from '@/components/reviews/UserReviews';
import { getServerTranslation } from '@/localization/server';

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;
  const { t } = await getServerTranslation();

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      customAvatar: users.customAvatar,
      bio: users.bio,
      location: users.location,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    notFound();
  }

  const [stats, { reviews: userReviews, stats: reviewStats }] = await Promise.all([
    getProfileStats(userId),
    getUserReviews(userId),
  ]);
  const avatarSrc = user.customAvatar ?? user.image;

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex gap-4 flex-1 min-w-0">
            <div className="shrink-0">
              {avatarSrc ? (
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-base-300">
                  <Image
                    src={avatarSrc}
                    alt={user.name ?? 'Avatar'}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-3xl font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">
                {user.name ?? 'Anonymous'}
              </h1>
              {user.bio && (
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {user.bio}
                </p>
              )}
              {user.location && (
                <div className="flex items-center gap-1 text-sm text-base-content/60 mt-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-px bg-base-300" />

          <div className="lg:w-52 shrink-0">
            <ProfileStats stats={stats} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-4">
          {t('lastFourWeeks')}
        </h2>
        <ActivityChart data={stats.weeklyData} />
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6">
        <UserReviewsClient reviews={userReviews} stats={reviewStats} />
      </div>
    </div>
  );
}
