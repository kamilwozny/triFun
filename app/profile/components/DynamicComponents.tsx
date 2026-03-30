'use client';

import dynamic from 'next/dynamic';

export const ActivityChart = dynamic(
  () => import('./ActivityChart').then((m) => m.ActivityChart),
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[220px] w-full bg-neutral-200 animate-pulse rounded-lg" />
    ),
  },
);

export const UserReviewsClient = dynamic(
  () => import('@/components/reviews/UserReviews').then((m) => m.UserReviewsClient),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="skeleton h-24 w-full bg-neutral-200 animate-pulse rounded-xl" />
        <div className="skeleton h-10 w-full bg-neutral-200 animate-pulse rounded-xl" />
        <div className="skeleton h-20 w-full bg-neutral-200 animate-pulse rounded-xl" />
        <div className="skeleton h-20 w-full bg-neutral-200 animate-pulse rounded-xl" />
      </div>
    ),
  },
);
