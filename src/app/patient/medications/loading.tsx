export default function PatientMedicationsLoading() {
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
        <div className="mb-6 h-7 w-48 rounded bg-white/10" />
        <div className="mb-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
          {[1, 2].map((i) => (
            <div key={i} className="mb-4 rounded-[24px] border border-white/10 p-5 last:mb-0">
              <div className="mb-3 h-5 w-40 rounded bg-white/10" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-4 rounded bg-white/5" />
                <div className="h-4 rounded bg-white/5" />
                <div className="h-4 rounded bg-white/5" />
                <div className="h-4 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
