import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CommerceLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="grid w-full grid-cols-4 gap-1 rounded-lg bg-muted p-1">
          <Skeleton className="h-9 rounded-md" />
          <Skeleton className="h-9 rounded-md" />
          <Skeleton className="h-9 rounded-md" />
          <Skeleton className="h-9 rounded-md" />
        </div>

        {/* Tab Content */}
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
              <div>
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-80 mx-auto" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-10 w-40 mx-auto" />
                <Skeleton className="h-4 w-72 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
