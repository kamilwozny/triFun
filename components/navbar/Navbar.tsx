'use client';

import Link from 'next/link';
import { useState } from 'react';

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="navbar bg-neutral mb-16 shadow-xl text-base-100 px-24">
      <div className="navbar-start">
        <div>
          <div className="drawer">
            <input
              id="my-drawer"
              type="checkbox"
              className="drawer-toggle"
              checked={drawerOpen}
              onChange={() => setDrawerOpen(!drawerOpen)}
            />
            <div className="drawer-content">
              <label
                htmlFor="my-drawer"
                className="drawer-button hover:cursor-pointer p-1"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-neutral text-white min-h-full w-60 p-4 font-semibold text-base">
                <li>
                  <Link href="/events" onClick={closeDrawer}>
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/trainings" onClick={closeDrawer}>
                    Trainings
                  </Link>
                </li>
                <li>
                  <Link href="/events" onClick={closeDrawer}>
                    Stats
                  </Link>
                </li>
                <li>
                  <Link href="/events" onClick={closeDrawer}>
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/dashboard" className="btn btn-ghost text-3xl">
          TriFun
        </Link>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {/* for the future (notifications) */}
          {/* <span className="badge badge-xs badge-primary indicator-item"></span> */}
        </button>
      </div>
    </div>
  );
};
