import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function WidgetLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Live Activity Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </div>
            <div className="flex items-center gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1">
                  <Skeleton className="w-4 h-4 bg-white/20" />
                  <Skeleton className="h-3 w-6 bg-white/20" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-3 w-32 bg-white/20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-24" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-5 h-5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Toggle */}
        <div className="flex justify-end mb-6">
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Daily Challenges */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-6 w-36" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Stories */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-32" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
