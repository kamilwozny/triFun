'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { NavbarSearchBar } from './NavbarSearchBar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { NotificationBell } from './NotificationBell';
import type { NotificationWithActor } from '@/actions/notifications';

interface NavbarClientProps {
  initialNotificationCount: number;
  initialNotificationItems: NotificationWithActor[];
}

export const NavbarClient = ({
  initialNotificationCount,
  initialNotificationItems,
}: NavbarClientProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.prefetch('/trainings');
      router.prefetch('/notifications');
      if (session?.user?.id) {
        router.prefetch(`/profile/${session.user.id}`);
      }
    }
  }, [status, session?.user?.id, router]);

  return (
    <div className="navbar shadow-xl px-4 lg:px-24 mb-4 lg:mb-10 flex items-center gap-4">
      <Link
        href="/dashboard"
        prefetch
        className="text-foreground text-xl lg:text-3xl shrink-0"
        aria-label="Go to dashboard"
      >
        TriFun
      </Link>

      <div className="flex-1 flex justify-center px-2">
        <NavbarSearchBar />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {status === 'loading' ? (
          <div className="btn btn-ghost btn-circle focus:outline-none focus:ring-2 focus:ring-primary">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : status === 'authenticated' ? (
          <>
            <NotificationBell
              initialCount={initialNotificationCount}
              initialItems={initialNotificationItems}
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                className="btn-circle focus:outline-none hover:ring-2 hover:ring-foreground"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="avatar placeholder rounded-full">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      className="rounded-full"
                      alt="Avatar"
                      width={36}
                      height={36}
                      priority
                    />
                  ) : (
                    <div className="bg-foreground text-white text-md font-semibold rounded-full w-8">
                      <span>{session.user?.name?.charAt(0) || 'U'}</span>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="hover:bg-background hover:cursor-pointer focus:bg-background">
                  <Link
                    className="w-full"
                    href={`/profile/${session.user?.id}`}
                    prefetch
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-background hover:cursor-pointer focus:bg-background">
                  <Link
                    className="w-full"
                    href="/settings"
                    prefetch
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    signOut({ callbackUrl: '/signin' });
                    setDropdownOpen(false);
                  }}
                  className="hover:bg-background text-foreground hover:cursor-pointer focus:bg-background"
                >
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button className="bg-foreground p-4 hover:bg-white hover:text-foreground">
            <Link href="/signin">{t('signIn')}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
