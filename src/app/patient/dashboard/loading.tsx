export default function PatientDashboardLoading() {
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
        <div className="mb-8">
          <div className="h-7 bg-gray-200 rounded w-56 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-44" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-32" />
                  <div className="h-8 bg-gray-200 rounded w-10 mt-2" />
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-24 mt-4" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-5 bg-gray-200 rounded w-40 mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-24" />
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
