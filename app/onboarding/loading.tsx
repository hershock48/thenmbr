import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-full" />
                {i < 4 && <Skeleton className="w-16 h-0.5 mx-2" />}
              </div>
            ))}
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}
