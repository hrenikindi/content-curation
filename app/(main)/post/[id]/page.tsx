import { Suspense } from "react"
import PostDetailContent from "@/components/post-detail-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetailContent id={params.id} />
    </Suspense>
  )
}

function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b bg-background/95 backdrop-blur"></div>
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-32 mb-6" />

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-row md:flex-col items-center gap-2 md:gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>

              <Skeleton className="h-10 w-3/4 mb-4" />

              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <Skeleton className="h-1 w-full my-8" />

              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />

                <Skeleton className="h-32 w-full rounded-xl" />

                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
