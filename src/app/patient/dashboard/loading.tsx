export default function PatientDashboardLoading() {
  return (
    <div className="app-shell">
      <div className="h-16 animate-pulse border-b border-white/10 bg-slate-950/70">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10" />
            <div className="h-4 w-32 rounded bg-white/10" />
          </div>
          <div className="h-8 w-20 rounded-lg bg-white/5" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 h-7 w-56 rounded bg-white/10" />
          <div className="h-4 w-44 rounded bg-white/5" />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-32 rounded bg-white/10" />
                  <div className="mt-2 h-8 w-10 rounded bg-white/10" />
                </div>
                <div className="h-12 w-12 rounded-xl bg-white/5" />
              </div>
              <div className="mt-4 h-3 w-24 rounded bg-white/5" />
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 h-5 w-40 rounded bg-white/10" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 rounded-lg border border-white/10 p-4">
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-24 rounded bg-white/5" />
                <div className="h-3 w-16 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
