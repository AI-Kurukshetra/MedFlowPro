export default function PatientsLoading() {
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
            <div className="mb-2 h-7 w-28 rounded bg-white/10" />
            <div className="h-4 w-36 rounded bg-white/5" />
          </div>
          <div className="h-9 w-28 rounded-lg bg-white/10" />
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04]">
          <div className="flex gap-8 border-b border-white/10 bg-slate-900/70 px-6 py-3">
            {["Patient", "Date of Birth", "Contact", "Prescriptions", "Added", ""].map((_, i) => (
              <div key={i} className="h-3 flex-1 rounded bg-white/10" />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-8 border-b border-white/5 px-6 py-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-white/10" />
                <div className="h-4 w-28 rounded bg-white/10" />
              </div>
              <div className="h-4 w-20 flex-1 rounded bg-white/5" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-32 rounded bg-white/5" />
                <div className="h-3 w-20 rounded bg-white/5" />
              </div>
              <div className="h-4 w-16 flex-1 rounded bg-white/5" />
              <div className="h-4 w-16 flex-1 rounded bg-white/5" />
              <div className="h-4 w-20 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
