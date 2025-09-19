import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function UnsubscribeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <Skeleton className="h-4 w-full mx-auto" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-32 mx-auto" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-48 mx-auto" />
                <Skeleton className="h-3 w-44 mx-auto" />
                <Skeleton className="h-3 w-40 mx-auto" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <Skeleton className="h-3 w-56 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
