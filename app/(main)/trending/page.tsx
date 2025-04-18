import { Suspense } from "react"
import TrendingContent from "@/components/trending-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function TrendingPage() {
  return (
    <Suspense fallback={<TrendingSkeleton />}>
      <TrendingContent />
    </Suspense>
  )
}

function TrendingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b bg-background/95 backdrop-blur"></div>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-full max-w-xl mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  )
}
