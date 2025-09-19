export default function WidgetOrgLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Widget Container Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <div className="h-48 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
