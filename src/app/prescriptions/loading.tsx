export default function PrescriptionsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 h-16 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-32 h-4 bg-gray-200 rounded" />
          </div>
          <div className="w-20 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-7 bg-gray-200 rounded w-40 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-32" />
          </div>
          <div className="h-9 w-36 bg-gray-200 rounded-lg" />
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 py-4 px-6 text-center">
              <div className="h-8 bg-gray-200 rounded w-8 mx-auto mb-2" />
              <div className="h-3 bg-gray-100 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-3 bg-gray-200 rounded flex-1" />
            ))}
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 flex items-center gap-6">
              <div className="h-4 bg-gray-200 rounded w-24 flex-1" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-24 flex-1" />
              <div className="h-4 bg-gray-100 rounded w-16 flex-1" />
              <div className="h-5 bg-gray-100 rounded-full w-14 flex-1" />
              <div className="h-4 bg-gray-100 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
