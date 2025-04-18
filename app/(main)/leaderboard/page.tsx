import { Suspense } from "react"
import LeaderboardContent from "@/components/leaderboard-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardContent />
    </Suspense>
  )
}

function LeaderboardSkeleton() {
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
            <Skeleton className="h-[600px] w-full rounded-xl" />
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
