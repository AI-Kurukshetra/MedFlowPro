export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export function CardLoader({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function StatCardLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-8 bg-gray-200 rounded w-12" />
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl" />
          </div>
          <div className="h-3 bg-gray-100 rounded w-20 mt-4" />
        </div>
      ))}
    </div>
  );
}
