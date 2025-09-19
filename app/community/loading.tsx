import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CommunityLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Community Stats */}
            <Card className="mb-6">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="mb-6">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-6 mb-1" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="group">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-12 rounded-full" />
                          </div>
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {[...Array(4)].map((_, j) => (
                            <Skeleton key={j} className="h-5 w-16 rounded-full" />
                          ))}
                        </div>
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-6">
                          <Skeleton className="h-8 w-12" />
                          <Skeleton className="h-8 w-12" />
                          <Skeleton className="h-8 w-12" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
