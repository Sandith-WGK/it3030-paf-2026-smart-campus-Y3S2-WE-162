import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  CalendarDays, Wrench, Bell, BookOpen,
  Users, ClipboardList, Package, AlertCircle,
  Briefcase
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import bookingService from '../services/api/bookingService';
import { userService } from '../services/api/userService';
import resourceService from '../services/api/resourceService';
import { ticketService } from '../services/api/ticketService';
import { useAuth } from '../context/AuthContext';

const userCards = [
  {
    title: 'My Bookings',
    description: 'View and manage your upcoming reservations for halls, labs, and equipment.',
    icon: CalendarDays,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    border: 'border-violet-100 dark:border-violet-500/20',
    btnClass:
      'text-violet-600 bg-violet-50 hover:bg-violet-100 dark:text-violet-300 dark:bg-violet-500/10 dark:hover:bg-violet-500/20',
    btnLabel: 'View Bookings',
    href: '/bookings',
  },
  {
    title: 'Browse Resources',
    description: 'Explore available lecture halls, labs, meeting rooms, and equipment to book.',
    icon: BookOpen,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    border: 'border-indigo-100 dark:border-indigo-500/20',
    btnClass:
      'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20',
    btnLabel: 'View Resources',
    href: '/resources',
  },
  {
    title: 'Maintenance Tickets',
    description: 'Report issues with equipment or facilities, or track existing tickets.',
    icon: Wrench,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-100 dark:border-amber-500/20',
    btnClass:
      'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-300 dark:bg-amber-500/10 dark:hover:bg-amber-500/20',
    btnLabel: 'Open Tickets',
    href: '/tickets',
  },
  {
    title: 'Notifications',
    description: 'Check recent updates for your tickets and booking requests.',
    icon: Bell,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-100 dark:border-blue-500/20',
    btnClass:
      'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-500/10 dark:hover:bg-blue-500/20',
    btnLabel: 'Check Alerts',
    href: '/notifications',
  },
];

// eslint-disable-next-line no-unused-vars
function StatCard({ label, value, icon: StatIcon, color, bg, loading: busy }) {
  return (
    <div className={`rounded-xl ${bg} border border-zinc-200 dark:border-zinc-800 px-5 py-4 flex items-center gap-4`}>
      <div className={`rounded-lg p-2.5 ${bg}`}>
        <StatIcon size={20} className={color} />
      </div>
      <div>
        <p className={`text-2xl font-bold ${color}`}>
          {busy ? <span className="inline-block w-8 h-6 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" /> : value}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

const adminCards = [
  {
    title: 'Manage Bookings',
    description: 'Review pending booking requests, approve or reject them with a reason.',
    icon: ClipboardList,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-100 dark:border-amber-500/20',
    btnClass:
      'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-300 dark:bg-amber-500/10 dark:hover:bg-amber-500/20',
    btnLabel: 'Booking Queue',
    href: '/admin/bookings',
    countKey: 'pendingBookings',
  },
  {
    title: 'Manage Users',
    description: 'View, create, edit and manage user accounts and roles.',
    icon: Users,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    border: 'border-violet-100 dark:border-violet-500/20',
    btnClass:
      'text-violet-600 bg-violet-50 hover:bg-violet-100 dark:text-violet-300 dark:bg-violet-500/10 dark:hover:bg-violet-500/20',
    btnLabel: 'User Management',
    href: '/admin/users',
    countKey: 'totalUsers',
  },
  {
    title: 'Manage Resources',
    description: 'Add, edit or remove bookable resources from the campus catalogue.',
    icon: Package,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-100 dark:border-emerald-500/20',
    btnClass:
      'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20',
    btnLabel: 'Resource Catalogue',
    href: '/admin/resources',
    countKey: 'totalResources',
  },
  {
    title: 'Manage Tickets',
    description: 'Overview and manage campus-wide maintenance issues.',
    icon: Wrench,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-100 dark:border-blue-500/20',
    btnClass:
      'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-500/10 dark:hover:bg-blue-500/20',
    btnLabel: 'Ticketing Center',
    href: '/admin/tickets',
    countKey: 'totalTickets',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const admin = String(user?.role || '').trim().toUpperCase() === 'ADMIN';
  const technician = String(user?.role || '').trim().toUpperCase() === 'TECHNICIAN';

  const [counts, setCounts] = useState({
    pendingBookings: 0,
    totalUsers: 0,
    totalResources: 0,
    todayBookings: 0,
    totalTickets: 0,
    myOpenTasks: 0,
    myCompletedTasks: 0,
  });
  const [countsLoading, setCountsLoading] = useState(admin || technician);

  useEffect(() => {
    if (!admin && !technician) return;
    const today = new Date().toISOString().split('T')[0];

    const promises = [];
    if (admin) {
      promises.push(
        bookingService.getAllBookings({ status: 'PENDING' }),
        userService.getAllUsers(),
        resourceService.getResources(),
        bookingService.getAllBookings({ date: today }),
        ticketService.getAllTickets({ status: 'OPEN' })
      );
    } else if (technician) {
      promises.push(ticketService.getMyTasks());
    }

    Promise.allSettled(promises).then((results) => {
      const extract = (r) => {
        if (r?.status !== 'fulfilled') return [];
        const d = r.value?.data?.data ?? r.value?.data ?? r.value;
        return Array.isArray(d) ? d : [];
      };

      if (admin) {
        setCounts(prev => ({
          ...prev,
          pendingBookings: extract(results[0]).length,
          totalUsers: extract(results[1]).length,
          totalResources: extract(results[2]).length,
          todayBookings: extract(results[3]).length,
          totalTickets: extract(results[4]).length,
        }));
      } else if (technician) {
        const tasks = extract(results[0]);
        setCounts(prev => ({
          ...prev,
          myOpenTasks: tasks.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
          myCompletedTasks: tasks.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
        }));
      }
      setCountsLoading(false);
    });
  }, [admin, technician]);

  const displayedUserCards = userCards.filter(card => !technician || (card.title !== 'My Bookings' && card.title !== 'Maintenance Tickets'));
  if (technician) {
    displayedUserCards.unshift({
      title: 'Technician Tasks',
      description: 'View and manage the maintenance tickets assigned to you for resolution.',
      icon: Briefcase,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      border: 'border-violet-100 dark:border-violet-500/20',
      btnClass: 'text-violet-600 bg-violet-50 hover:bg-violet-100 dark:text-violet-300 dark:bg-violet-500/10 dark:hover:bg-violet-500/20',
      btnLabel: 'View My Tasks',
      href: '/technician/tasks',
    });
  }

  return (
    <Layout title="Dashboard">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {admin ? 'Operations Overview' : 'Welcome back 👋'}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
          {admin
            ? 'Platform health at a glance — manage bookings, users, and resources.'
            : "Here's a quick overview of your Smart Campus activity."}
        </p>
      </div>
     
      
      {technician && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard label="Active Tasks" value={counts.myOpenTasks} icon={Wrench} color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-500/10" loading={countsLoading} />
          <StatCard label="Completed Tasks" value={counts.myCompletedTasks} icon={ClipboardList} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10" loading={countsLoading} />
        </div>
      )}

      {/* ── Admin: live stats strip ── */}
      {admin && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard label="Pending Approvals" value={counts.pendingBookings} icon={AlertCircle} color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-500/10" loading={countsLoading} />
          <StatCard label="Today's Bookings" value={counts.todayBookings} icon={CalendarDays} color="text-violet-600 dark:text-violet-400" bg="bg-violet-50 dark:bg-violet-500/10" loading={countsLoading} />
          <StatCard label="Total Users" value={counts.totalUsers} icon={Users} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-500/10" loading={countsLoading} />
          <StatCard label="Total Resources" value={counts.totalResources} icon={Package} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10" loading={countsLoading} />
        </div>
      )}

      {/* ── Admin: operations cards (shown first) ── */}
      {admin && (
        <>
          <div className="mb-5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Admin Operations</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Core platform management — bookings, users, and resources.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {adminCards.map((card, i) => {
              const count = card.countKey ? counts[card.countKey] : null;
              return (
                <Motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border ${card.border} bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex rounded-xl ${card.bg} p-3`}>
                      <card.icon size={22} className={card.color} />
                    </div>
                    {count != null && count > 0 && (
                      <span className={`inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-bold ${card.bg} ${card.color}`}>
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                    {card.description}
                  </p>
                  <button
                    onClick={() => navigate(card.href)}
                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${card.btnClass}`}
                  >
                    {card.btnLabel}
                  </button>
                </Motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Personal tools (all users see this; label changes for admin) ── */}
      {admin && (
        <div className="mb-5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Personal Tools</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Your own bookings, resources, and alerts.
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {displayedUserCards
          .map((card, i) => (
          <Motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (admin ? 0.21 : 0) + i * 0.07 }}
            className={`rounded-2xl border ${card.border} bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`inline-flex rounded-xl ${card.bg} p-3 mb-4`}>
              <card.icon size={22} className={card.color} />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              {card.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
              {card.description}
            </p>
            <button
              onClick={() => navigate(card.href)}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${card.btnClass}`}
            >
              {card.btnLabel}
            </button>
          </Motion.div>
        ))}
      </div>
    </Layout>
  );
}
