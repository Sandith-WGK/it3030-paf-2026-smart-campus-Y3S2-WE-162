import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      await authService.forgotPassword(email);
      setSuccessMsg("If an account exists, a reset code has been sent to your email.");
      setTimeout(() => {
        // Pass email to reset page via state so they don't have to type it again
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-gradient-to-br from-zinc-50 via-violet-50/90 to-fuchsia-100/80 font-sans text-zinc-800 antialiased dark:from-zinc-950 dark:via-violet-950/30 dark:to-zinc-950 dark:text-zinc-100">
      
      {/* Left Pane - Branding & Welcome */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-20 relative overflow-hidden bg-violet-600 dark:bg-violet-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative z-10 max-w-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md mb-8">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Reset your password</h1>
          <p className="text-violet-200 text-lg leading-relaxed">
            Don't worry, even the smartest hubs need a reset sometimes. Enter your email and we'll send you a recovery code.
          </p>
        </div>
      </div>

      {/* Right Pane - Form Container */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-8 relative backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl border border-violet-200/90 bg-white/85 p-10 shadow-2xl shadow-violet-500/[0.12] backdrop-blur-md dark:border-violet-500/25 dark:bg-zinc-900/75 dark:shadow-violet-900/20">
          
          <div className="lg:hidden flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-inner mb-6 mx-auto">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Forgot password?
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              No problem! It happens.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 font-medium">
              {successMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                placeholder="you@university.edu"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-600/30 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-70 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              {isLoading ? "Sending code..." : "Send Reset Code"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <Link to="/" className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
