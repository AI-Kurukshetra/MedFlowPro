export default function PatientProfileLoading() {
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
        {/* Breadcrumb */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-6" />

        {/* Patient card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-40" />
                <div className="h-4 bg-gray-100 rounded w-48" />
              </div>
            </div>
            <div className="h-9 w-36 bg-gray-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-2 bg-gray-200 rounded w-12" />
                <div className="h-4 bg-gray-100 rounded w-28" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-5 bg-gray-200 rounded w-40 mb-5" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-28" />
                    <div className="h-3 bg-gray-100 rounded w-36" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </div>
                  <div className="h-6 w-14 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-5 bg-gray-200 rounded w-36 mb-5" />
            <div className="h-16 bg-gray-100 rounded-lg mb-3" />
            <div className="h-16 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
