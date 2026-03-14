export function PageLoader() {
  return (
    <div className="app-shell flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-sky-300/20 border-t-sky-300 animate-spin" />
        <p className="animate-pulse text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

export function CardLoader({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="h-10 w-10 rounded-full bg-white/10 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-white/10" />
            <div className="h-3 w-1/2 rounded bg-white/5" />
          </div>
          <div className="h-6 w-16 rounded-full bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export function StatCardLoader() {
  return (
    <div className="grid grid-cols-1 gap-6 animate-pulse md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-8 w-12 rounded bg-white/10" />
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/5" />
          </div>
          <div className="mt-4 h-3 w-20 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}
