import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-dvh w-full bg-zinc-50 font-sans text-zinc-800 antialiased dark:bg-zinc-950 dark:text-zinc-100 flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-2">My Bookings</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">View and manage your upcoming reservations for halls and labs.</p>
            <button className="text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-lg dark:text-violet-300 dark:bg-violet-500/10 dark:hover:bg-violet-500/20">View Bookings</button>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-2">Maintenance Tickets</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Report an issue with equipment or a facility, or track status.</p>
            <button className="text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg dark:text-amber-300 dark:bg-amber-500/10 dark:hover:bg-amber-500/20">Open Tickets</button>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Check recent updates for your tickets and booking requests.</p>
            <button className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg dark:text-blue-300 dark:bg-blue-500/10 dark:hover:bg-blue-500/20">Check Alerts</button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
