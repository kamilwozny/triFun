'use client';

import Link from 'next/link';
import { useState } from 'react';

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="navbar bg-neutral shadow-xl text-base-100 px-4 md:px-8 lg:px-24 mb-20">
      <div className="navbar-start">
        <div className="lg:hidden">
          <div className="drawer">
            <input
              id="my-drawer"
              type="checkbox"
              className="drawer-toggle"
              checked={drawerOpen}
              onChange={() => setDrawerOpen(!drawerOpen)}
              aria-label="Toggle navigation menu"
            />
            <div className="drawer-content">
              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="drawer-button hover:cursor-pointer p-1"
                aria-expanded={drawerOpen}
                aria-controls="mobile-menu"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                <span className="sr-only">Open main menu</span>
              </button>
            </div>
            <div
              className="drawer-side z-20"
              id="mobile-menu"
              role="navigation"
            >
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <nav className="menu bg-neutral text-white min-h-full w-60 font-semibold text-xl items-center p-0">
                <ul>
                  <li className="w-full hover:bg-neutral-focus focus:bg-neutral-focus p-2 text-center">
                    <Link
                      href="/events"
                      onClick={closeDrawer}
                      className="focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      Events
                    </Link>
                  </li>
                  <li className="w-full hover:bg-neutral-focus focus:bg-neutral-focus p-2 text-center">
                    <Link
                      href="/trainings"
                      onClick={closeDrawer}
                      className="focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      Trainings
                    </Link>
                  </li>
                  <li className="w-full hover:bg-neutral-focus focus:bg-neutral-focus p-2 text-center">
                    <Link
                      href="/stats"
                      onClick={closeDrawer}
                      className="focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      Stats
                    </Link>
                  </li>
                  <li className="w-full hover:bg-neutral-focus focus:bg-neutral-focus p-2 text-center">
                    <Link
                      href="/about"
                      onClick={closeDrawer}
                      className="focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <nav className="hidden lg:flex space-x-4" role="navigation">
          <Link
            href="/events"
            className="hover:bg-neutral-focus focus:bg-neutral-focus p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            Events
          </Link>
          <Link
            href="/trainings"
            className="hover:bg-neutral-focus focus:bg-neutral-focus p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            Trainings
          </Link>
          <Link
            href="/stats"
            className="hover:bg-neutral-focus focus:bg-neutral-focus p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            Stats
          </Link>
          <Link
            href="/about"
            className="hover:bg-neutral-focus focus:bg-neutral-focus p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
      <div className="navbar-center">
        <Link
          href="/dashboard"
          className="btn btn-ghost text-2xl md:text-3xl focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Go to dashboard"
        >
          TriFun
        </Link>
      </div>
      <div className="navbar-end">
        <Link
          href="/profile"
          className="btn btn-ghost btn-circle focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Go to profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="h-5 w-5 md:h-6 md:w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </Link>
        <button
          className="btn btn-ghost btn-circle focus:outline-none focus:ring-2 focus:ring-primary"
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
      </div>
    </div>
  );
};
