function App() {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-zinc-50 via-violet-50/90 to-fuchsia-100/80 font-sans text-zinc-800 antialiased dark:from-zinc-950 dark:via-violet-950/30 dark:to-zinc-950 dark:text-zinc-100">
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
        <div className="max-w-md rounded-2xl border border-violet-200/90 bg-white/85 p-10 shadow-xl shadow-violet-500/[0.12] backdrop-blur-md dark:border-violet-500/25 dark:bg-zinc-900/75 dark:shadow-violet-900/20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
            Smart Campus
          </p>
          <h1 className="mt-3 text-center text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Frontend running
          </h1>
          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            React, Vite, and Tailwind are connected. Hook up the API when you are ready.
          </p>
          <div className="mt-8 flex justify-center" aria-hidden>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 ring-4 ring-emerald-500/15 dark:ring-emerald-400/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
