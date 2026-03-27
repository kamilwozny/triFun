import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { auth } from '@/app/auth';
import { getAllNotifications, markAllAsRead } from '@/actions/notifications';
import { getServerTranslation } from '@/localization/server';
import type { NotificationWithActor } from '@/actions/notifications';

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const { t } = await getServerTranslation();

  const allNotifications = await getAllNotifications();
  await markAllAsRead();

  const unread = allNotifications.filter((n) => !n.isRead);
  const read = allNotifications.filter((n) => n.isRead);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('notifications')}</h1>

      {allNotifications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">{t('noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-1">
                {t('unread')}
              </h2>
              <ul className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                {unread.map((n) => (
                  <NotificationRow key={n.id} notification={n} />
                ))}
              </ul>
            </section>
          )}

          {read.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-1">
                {t('earlier')}
              </h2>
              <ul className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                {read.map((n) => (
                  <NotificationRow key={n.id} notification={n} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  notification: n,
}: {
  notification: NotificationWithActor;
}) {
  return (
    <li>
      <Link
        href={n.href}
        className={`flex items-start gap-3 px-4 py-4 hover:bg-accent transition-colors ${
          !n.isRead ? 'bg-accent/30' : ''
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {n.actor?.image ? (
            <Image
              src={n.actor.image}
              alt={n.actor.name ?? ''}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-foreground text-white text-sm font-semibold flex items-center justify-center">
              {n.actor?.name?.charAt(0) ?? '?'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug">{n.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
          </p>
        </div>
        {!n.isRead && (
          <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-blue-500" />
        )}
      </Link>
    </li>
  );
}
