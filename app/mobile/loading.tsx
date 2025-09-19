export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search Skeleton */}
      <div className="p-4 pb-2">
        <div className="h-10 bg-muted rounded-md animate-pulse" />
      </div>

      {/* Categories Skeleton */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Story Cards Skeleton */}
      <div className="px-4 pb-20">
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-4">
                <div className="h-5 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-3" />
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-muted rounded animate-pulse w-20" />
                  <div className="h-8 bg-muted rounded animate-pulse w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex items-center justify-around py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 px-3 py-2">
              <div className="h-5 w-5 bg-muted rounded animate-pulse" />
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
