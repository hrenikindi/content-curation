"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"
import { allPosts } from "@/data/posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowBigUp, ArrowUp, Flame, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function TrendingContent() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Sort posts by different metrics
  const trendingPosts = [...allPosts].sort((a, b) => b.upvotes - a.upvotes)
  const recentPosts = [...allPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const discussedPosts = [...allPosts].sort((a, b) => {
    // If comments is a number, use it directly
    const commentsA = typeof a.comments === "number" ? a.comments : 0
    const commentsB = typeof b.comments === "number" ? b.comments : 0
    return commentsB - commentsA
  })

  // Get top contributors
  const contributors = allPosts.reduce(
    (acc, post) => {
      const { name, avatar } = post.author
      if (!acc[name]) {
        acc[name] = {
          name,
          avatar,
          posts: 0,
          upvotes: 0,
        }
      }
      acc[name].posts += 1
      acc[name].upvotes += post.upvotes
      return acc
    },
    {} as Record<string, { name: string; avatar: string; posts: number; upvotes: number }>,
  )

  const topContributors = Object.values(contributors)
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5)

  // Get trending categories
  const categories = allPosts.reduce(
    (acc, post) => {
      const { category } = post
      if (!acc[category]) {
        acc[category] = {
          name: category,
          posts: 0,
          upvotes: 0,
        }
      }
      acc[category].posts += 1
      acc[category].upvotes += post.upvotes
      return acc
    },
    {} as Record<string, { name: string; posts: number; upvotes: number }>,
  )

  const trendingCategories = Object.values(categories)
    .sort((a, b) => b.upvotes / b.posts - a.upvotes / a.posts)
    .slice(0, 5)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tech: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300",
      design: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      business: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      lifestyle: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      health: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
            <Flame className="h-8 w-8 text-red-500" />
            Trending Now
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover what's popular, recent, and generating discussion in the community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="popular">
              <TabsList className="mb-4">
                <TabsTrigger value="popular" className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Popular</span>
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex items-center gap-1">
                  <ArrowUp className="h-4 w-4" />
                  <span>Recent</span>
                </TabsTrigger>
                <TabsTrigger value="discussed" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Most Discussed</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <Skeleton className="h-12 w-12 rounded-full skeleton" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4 skeleton" />
                                <Skeleton className="h-4 w-full skeleton" />
                                <div className="flex gap-2 mt-2">
                                  <Skeleton className="h-6 w-20 rounded-full skeleton" />
                                  <Skeleton className="h-6 w-20 rounded-full skeleton" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                    {trendingPosts.slice(0, 10).map((post, index) => (
                      <motion.div key={post.id} variants={item}>
                        <TrendingPostCard post={post} index={index} type="popular" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <Skeleton className="h-12 w-12 rounded-full skeleton" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4 skeleton" />
                                <Skeleton className="h-4 w-full skeleton" />
                                <div className="flex gap-2 mt-2">
                                  <Skeleton className="h-6 w-20 rounded-full skeleton" />
                                  <Skeleton className="h-6 w-20 rounded-full skeleton" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                    {recentPosts.slice(0, 10).map((post, index) => (
                      <motion.div key={post.id} variants={item}>
                        <TrendingPostCard post={post} index={index} type="recent" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="discussed" className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <Skeleton className="h-12 w-12 rounded-full skeleton" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4 skeleton" />
                                <Skeleton className="h-4 w-full skeleton" />
                                <div className="flex gap-2 mt-2">
                                  <Skeleton className="h-6 w-20 rounded-full skeleton" />
                                  <Skeleton className="h-6 w-20 rounded-full skeleton" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                    {discussedPosts.slice(0, 10).map((post, index) => (
                      <motion.div key={post.id} variants={item}>
                        <TrendingPostCard post={post} index={index} type="discussed" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full skeleton" />
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-24 skeleton" />
                            <Skeleton className="h-3 w-16 skeleton" />
                          </div>
                          <Skeleton className="h-8 w-16 rounded-md skeleton" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={contributor.name} className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                            <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          {index < 3 && (
                            <div
                              className={cn(
                                "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                                index === 0
                                  ? "bg-yellow-500 text-yellow-950"
                                  : index === 1
                                    ? "bg-gray-300 text-gray-800"
                                    : "bg-amber-700 text-amber-100",
                              )}
                            >
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{contributor.name}</p>
                          <p className="text-xs text-muted-foreground">{contributor.posts} posts</p>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <ArrowBigUp className="h-3 w-3" />
                          {contributor.upvotes}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trending Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  Trending Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-8 w-32 rounded-full skeleton" />
                          <Skeleton className="h-6 w-16 skeleton" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trendingCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={`/?category=${category.name}`}
                        className="flex items-center justify-between group"
                      >
                        <Badge
                          variant="secondary"
                          className={cn(
                            "transition-all text-sm py-1.5",
                            getCategoryColor(category.name),
                            "group-hover:scale-105",
                          )}
                        >
                          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(category.upvotes / category.posts)} avg. upvotes
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Digest Signup */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle>Weekly Digest</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Get the best content delivered to your inbox every week. Stay updated with the latest trends and
                  popular posts.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium"
                >
                  Subscribe Now
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

interface TrendingPostCardProps {
  post: (typeof allPosts)[0]
  index: number
  type: "popular" | "recent" | "discussed"
}

function TrendingPostCard({ post, index, type }: TrendingPostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted relative">
              <span className="text-lg font-bold">{index + 1}</span>
              {index < 3 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Link href={`/post/${post.id}`} className="group">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{post.title}</h3>
              </Link>
              <div className="flex items-center gap-2 flex-wrap">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{post.author.name}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className={cn(getCategoryColor(post.category))}>
                  {post.category}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <ArrowBigUp className="h-3 w-3" />
                  {post.upvotes}
                </Badge>
                {type === "discussed" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {post.comments}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    tech: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300",
    design: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    business: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    lifestyle: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    health: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  }
  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
}
