'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getNotificationCount,
  getRecentNotifications,
  markAllAsRead,
  type NotificationWithActor,
} from '@/actions/notifications';
import { useTranslation } from 'react-i18next';

export function NotificationBell() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationWithActor[]>(
    [],
  );
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const refreshCount = () => {
    startTransition(async () => {
      const c = await getNotificationCount();
      setCount(c);
    });
  };

  useEffect(() => {
    refreshCount();
    window.addEventListener('focus', refreshCount);
    return () => window.removeEventListener('focus', refreshCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      startTransition(async () => {
        const [recent] = await Promise.all([
          getRecentNotifications(3),
          markAllAsRead(),
        ]);
        setNotifications(recent);
        setCount(0);
      });
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpen} open={open}>
      <DropdownMenuTrigger
        className="btn btn-ghost btn-circle relative focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={t('notifications')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 lg:h-6 lg:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {count > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 overflow-hidden"
        sideOffset={8}
      >
        <div className="px-4 py-3 border-b border-border">
          <p className="font-semibold text-sm">{t('notifications')}</p>
        </div>

        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            {t('noNotifications')}
          </div>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors ${
                    !n.isRead ? 'bg-accent/40' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {n.actor?.image ? (
                      <Image
                        src={n.actor.image}
                        alt={n.actor.name ?? ''}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-foreground text-white text-sm font-semibold flex items-center justify-center">
                        {n.actor?.name?.charAt(0) ?? '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-border">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-sm py-3 text-primary hover:underline font-medium"
          >
            {t('seeAllNotifications')} →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
