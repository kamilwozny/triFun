'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '../ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

enum ActivePages {
  trainings = 'trainings',
  stats = 'stats',
  about = 'about',
  events = 'events',
}

export const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState(ActivePages.trainings);
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  return (
    <div className="navbar shadow-xl px-4 md:px-8 lg:px-24 mb-10">
      <div className="navbar-start">
        <Link
          href="/dashboard"
          className="text-foreground text-2xl md:text-3xl"
          aria-label="Go to dashboard"
        >
          TriFun
        </Link>
        {/* <NavigationMenu className="text-black">
          <NavigationMenuList>
            <NavigationMenuItem
              className={`${
                activePage === ActivePages.events && 'text-foreground'
              } text-lg font-bold hover:text-foreground`}
            >
              <Link
                href="/events"
                onClick={() => setActivePage(ActivePages.events)}
                className="p-2"
              >
                {t('events')}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`${
                activePage === ActivePages.trainings && 'text-foreground'
              } text-lg font-bold hover:text-foreground`}
            >
              <Link
                href="/trainings"
                className="p-2"
                onClick={() => setActivePage(ActivePages.trainings)}
              >
                {t('trainings')}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`${
                activePage === ActivePages.stats && 'text-foreground'
              } text-lg font-bold hover:text-foreground`}
            >
              <Link
                href="/stats"
                className="p-2"
                onClick={() => setActivePage(ActivePages.stats)}
              >
                {t('stats')}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`${
                activePage === ActivePages.about && 'text-foreground'
              } text-lg font-bold hover:text-foreground`}
            >
              <Link
                href="/about"
                className="p-2"
                onClick={() => setActivePage(ActivePages.about)}
              >
                {t('about')}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */}
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        {/* <LanguageSwitcher /> */}
        {status === 'loading' ? (
          <div className="btn btn-ghost btn-circle focus:outline-none focus:ring-2 focus:ring-primary ml-4">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : status === 'authenticated' ? (
          <>
            <button
              className="btn btn-ghost btn-circle focus:outline-none focus:ring-2 focus:ring-primary ml-4"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
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
            </button>
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
                    />
                  ) : (
                    <div className="bg-foreground text-white text-md font-semibold rounded-full w-8">
                      <span>{session.user?.name?.charAt(0) || 'U'}</span>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="hover:bg-background hover:cursor-pointe focus:bg-backgroundr">
                  <Link
                    className="w-full"
                    href={`/profile/${session.user?.id}`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-background hover:cursor-pointer focus:bg-background">
                  <Link
                    className="w-full"
                    href="/settings"
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
          <Button className="bg-foreground ml-4 p-4 hover:bg-white hover:text-foreground">
            <Link href="/signin" className="">
              {t('signin')}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
