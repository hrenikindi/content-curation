"use client"

import { useState, useEffect } from "react"
import PostCard from "@/components/post-card"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List, ArrowDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { allPosts } from "@/data/posts"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useInView } from "react-intersection-observer"
import { useOnboarding } from "@/components/onboarding-provider"

interface PostGridProps {
  selectedCategory: string
  searchQuery: string
  isLoading?: boolean
  sortBy?: "featured" | "recent" | "popular"
}

export default function PostGrid({
  selectedCategory,
  searchQuery,
  isLoading = false,
  sortBy = "featured",
}: PostGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [displayedPosts, setDisplayedPosts] = useState<typeof allPosts>([])
  const { showOnboardingTip } = useOnboarding()
  const postsPerPage = 6

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  // Show onboarding tip
  useEffect(() => {
    showOnboardingTip("post-grid", "Click on posts to read more, or use the view toggles to change the layout.")
  }, [showOnboardingTip])

  // Filter and sort posts
  useEffect(() => {
    // Reset pagination when filters change
    setPage(1)
    setHasMore(true)

    // Filter posts based on category and search query
    let filtered = [...allPosts].filter((post) => {
      // Filter by category
      if (selectedCategory !== "all" && post.category !== selectedCategory) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      }

      return true
    })

    // Sort posts based on sortBy parameter
    switch (sortBy) {
      case "recent":
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "popular":
        filtered = filtered.sort((a, b) => b.upvotes - a.upvotes)
        break
      case "featured":
      default:
        // Mix of recent and popular
        filtered = filtered.sort((a, b) => {
          const scoreA = b.upvotes * 0.7 + new Date(b.createdAt).getTime() * 0.3
          const scoreB = a.upvotes * 0.7 + new Date(a.createdAt).getTime() * 0.3
          return scoreA - scoreB
        })
    }

    // Get first page of posts
    setDisplayedPosts(filtered.slice(0, postsPerPage))

    // Check if there are more posts
    setHasMore(filtered.length > postsPerPage)
  }, [selectedCategory, searchQuery, sortBy])

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMorePosts()
    }
  }, [inView, isLoading])

  const loadMorePosts = () => {
    // Filter posts again (same logic as above)
    let filtered = [...allPosts].filter((post) => {
      if (selectedCategory !== "all" && post.category !== selectedCategory) {
        return false
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      }

      return true
    })

    // Sort posts based on sortBy parameter
    switch (sortBy) {
      case "recent":
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "popular":
        filtered = filtered.sort((a, b) => b.upvotes - a.upvotes)
        break
      case "featured":
      default:
        filtered = filtered.sort((a, b) => {
          const scoreA = b.upvotes * 0.7 + new Date(b.createdAt).getTime() * 0.3
          const scoreB = a.upvotes * 0.7 + new Date(a.createdAt).getTime() * 0.3
          return scoreA - scoreB
        })
    }

    const nextPage = page + 1
    const startIndex = (nextPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const nextPosts = filtered.slice(startIndex, endIndex)

    if (nextPosts.length > 0) {
      setDisplayedPosts((prev) => [...prev, ...nextPosts])
      setPage(nextPage)
      setHasMore(endIndex < filtered.length)
    } else {
      setHasMore(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {selectedCategory === "all"
            ? `${sortBy === "recent" ? "Latest" : sortBy === "popular" ? "Popular" : "Featured"} Posts`
            : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Posts`}
        </h2>
        <TabsList>
          <TabsTrigger
            value="grid"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
          >
            <Grid2X2 className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger
            value="list"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
          >
            <List className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4 skeleton" />
                        <Skeleton className="h-4 w-full skeleton" />
                        <Skeleton className="h-4 w-5/6 skeleton" />
                        <div className="flex items-center gap-4 pt-4">
                          <Skeleton className="h-10 w-10 rounded-full skeleton" />
                          <Skeleton className="h-4 w-24 skeleton" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-6">
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-3/4 skeleton" />
                        <Skeleton className="h-4 w-full skeleton" />
                        <div className="flex items-center gap-4 pt-2">
                          <Skeleton className="h-10 w-10 rounded-full skeleton" />
                          <Skeleton className="h-4 w-24 skeleton" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </motion.div>
        ) : displayedPosts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 border rounded-lg bg-card"
          >
            <h3 className="text-lg font-medium">No posts found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search query</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                window.location.href = "/"
              }}
            >
              Reset filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={`${viewMode}-${selectedCategory}-${sortBy}`}
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPosts.map((post, index) => (
                  <motion.div key={post.id} variants={item} custom={index}>
                    <PostCard post={post} variant="grid" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedPosts.map((post, index) => (
                  <motion.div key={post.id} variants={item} custom={index}>
                    <PostCard post={post} variant="list" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load more button/indicator */}
            <div ref={loadMoreRef} className="w-full flex justify-center mt-8">
              {hasMore ? (
                <Button variant="outline" onClick={loadMorePosts} className="group" disabled={isLoading}>
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      Load more
                      <ArrowDown className="ml-2 h-4 w-4 group-hover:animate-bounce" />
                    </>
                  )}
                </Button>
              ) : displayedPosts.length > postsPerPage ? (
                <p className="text-muted-foreground text-sm py-4">You've reached the end</p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
