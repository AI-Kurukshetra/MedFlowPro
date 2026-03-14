export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar skeleton */}
      <div className="bg-white border-b border-gray-200 h-16 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-32 h-4 bg-gray-200 rounded" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="w-20 h-4 bg-gray-100 rounded" />
            <div className="w-20 h-4 bg-gray-100 rounded" />
            <div className="w-20 h-4 bg-gray-100 rounded" />
          </div>
          <div className="w-20 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-7 bg-gray-200 rounded w-64 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-48" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-28" />
                  <div className="h-8 bg-gray-200 rounded w-10 mt-2" />
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-24 mt-4" />
            </div>
          ))}
        </div>

        {/* Content panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="h-5 bg-gray-200 rounded w-40 mb-5" />
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </div>
                  <div className="h-5 w-14 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
