export default function PrescriptionsLoading() {
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 h-7 w-40 rounded bg-white/10" />
            <div className="h-4 w-32 rounded bg-white/5" />
          </div>
          <div className="h-9 w-36 rounded-lg bg-white/10" />
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-4 text-center">
              <div className="mx-auto mb-2 h-8 w-8 rounded bg-white/10" />
              <div className="mx-auto h-3 w-16 rounded bg-white/5" />
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04]">
          <div className="flex gap-6 border-b border-white/10 bg-slate-900/70 px-6 py-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-3 flex-1 rounded bg-white/10" />
            ))}
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-6 border-b border-white/5 px-6 py-4">
              <div className="h-4 w-24 flex-1 rounded bg-white/10" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-20 rounded bg-white/10" />
                <div className="h-3 w-16 rounded bg-white/5" />
              </div>
              <div className="h-4 w-24 flex-1 rounded bg-white/5" />
              <div className="h-4 w-16 flex-1 rounded bg-white/5" />
              <div className="h-5 w-14 flex-1 rounded-full bg-white/5" />
              <div className="h-4 w-20 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
