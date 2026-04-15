import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdmin } from '../../utils/auth';
import {
  LayoutDashboard,
  CalendarDays,
  PlusSquare,
  ClipboardList,
  X,
} from 'lucide-react';

const navItem = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors';
const activeClass = 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300';
const inactiveClass =
  'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100';

export default function Sidebar({ open, onClose }) {
  const admin = isAdmin();

  // Keep Sidebar positioned *after* the top Navbar.
  // Navbar height is ~72px (py-4 + content). If you change Navbar vertical padding, adjust this.
  const NAVBAR_OFFSET = 'top-[72px]';

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className={`fixed inset-x-0 bottom-0 ${NAVBAR_OFFSET} z-20 bg-black/40 lg:hidden`}
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-x-0 left-0 z-30 flex w-64 flex-col bg-white border-r border-zinc-200',
          `bottom-0 ${NAVBAR_OFFSET}`,
          'dark:bg-zinc-950 dark:border-zinc-800',
          'transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
          // Desktop: sidebar in normal flow, sticky below Navbar
          'lg:sticky lg:translate-x-0 lg:flex lg:top-[72px] lg:h-[calc(100dvh-72px)]',
        ].join(' ')}
      >
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Mobile close button (kept inside nav to avoid empty header space) */}
          <div className="flex justify-end lg:hidden pb-2">
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}
            onClick={onClose}
          >
            <CalendarDays size={18} />
            My Bookings
          </NavLink>

          <NavLink
            to="/bookings/new"
            className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}
            onClick={onClose}
          >
            <PlusSquare size={18} />
            New Booking
          </NavLink>

          {admin && (
            <>
              <div className="pt-4 pb-1 px-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Admin
                </p>
              </div>

              <NavLink
                to="/admin/bookings"
                className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}
                onClick={onClose}
              >
                <ClipboardList size={18} />
                Manage Bookings
              </NavLink>
            </>
          )}
        </nav>

        {/* Footer intentionally omitted: Sign out lives in top header */}
      </aside>
    </>
  );
}
