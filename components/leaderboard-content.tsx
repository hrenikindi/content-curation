"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"
import { allPosts } from "@/data/posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowBigUp, Award, Crown, Medal, Trophy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

export default function LeaderboardContent() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

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
          comments: 0,
        }
      }
      acc[name].posts += 1
      acc[name].upvotes += post.upvotes

      // If comments is a number, add it
      if (typeof post.comments === "number") {
        acc[name].comments += post.comments
      }

      return acc
    },
    {} as Record<string, { name: string; avatar: string; posts: number; upvotes: number; comments: number }>,
  )

  const topContributorsByUpvotes = Object.values(contributors).sort((a, b) => b.upvotes - a.upvotes)

  const topContributorsByPosts = Object.values(contributors).sort((a, b) => b.posts - a.posts)

  const topContributorsByComments = Object.values(contributors).sort((a, b) => b.comments - a.comments)

  // Get top categories
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

  const topCategories = Object.values(categories).sort((a, b) => b.upvotes - a.upvotes)

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
            <Trophy className="h-8 w-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-2">Celebrating our top contributors and most popular content.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="upvotes">
              <TabsList className="mb-4">
                <TabsTrigger value="upvotes" className="flex items-center gap-1">
                  <ArrowBigUp className="h-4 w-4" />
                  <span>By Upvotes</span>
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>By Posts</span>
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-1">
                  <Medal className="h-4 w-4" />
                  <span>By Comments</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upvotes">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      Top Contributors by Upvotes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-6">
                        {Array(10)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <Skeleton className="h-8 w-8 rounded-full skeleton" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-32 skeleton" />
                                <Skeleton className="h-2 w-full skeleton" />
                              </div>
                              <Skeleton className="h-6 w-16 rounded-md skeleton" />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                        {topContributorsByUpvotes.slice(0, 10).map((contributor, index) => (
                          <motion.div key={contributor.name} variants={item} className="flex items-center gap-4">
                            <div className="relative flex items-center justify-center w-8 h-8">
                              {index < 3 ? (
                                <div
                                  className={`absolute inset-0 flex items-center justify-center rounded-full ${
                                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-300" : "bg-amber-700"
                                  }`}
                                >
                                  <span className="font-bold text-sm text-black">{index + 1}</span>
                                </div>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-muted">
                                  <span className="font-medium text-sm">{index + 1}</span>
                                </div>
                              )}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                              <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium">{contributor.name}</p>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <ArrowBigUp className="h-3 w-3" />
                                  {contributor.upvotes}
                                </Badge>
                              </div>
                              <Progress
                                value={(contributor.upvotes / topContributorsByUpvotes[0].upvotes) * 100}
                                className="h-2"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-500" />
                      Top Contributors by Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-6">
                        {Array(10)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <Skeleton className="h-8 w-8 rounded-full skeleton" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-32 skeleton" />
                                <Skeleton className="h-2 w-full skeleton" />
                              </div>
                              <Skeleton className="h-6 w-16 rounded-md skeleton" />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                        {topContributorsByPosts.slice(0, 10).map((contributor, index) => (
                          <motion.div key={contributor.name} variants={item} className="flex items-center gap-4">
                            <div className="relative flex items-center justify-center w-8 h-8">
                              {index < 3 ? (
                                <div
                                  className={`absolute inset-0 flex items-center justify-center rounded-full ${
                                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-300" : "bg-amber-700"
                                  }`}
                                >
                                  <span className="font-bold text-sm text-black">{index + 1}</span>
                                </div>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-muted">
                                  <span className="font-medium text-sm">{index + 1}</span>
                                </div>
                              )}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                              <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium">{contributor.name}</p>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Award className="h-3 w-3" />
                                  {contributor.posts} posts
                                </Badge>
                              </div>
                              <Progress
                                value={(contributor.posts / topContributorsByPosts[0].posts) * 100}
                                className="h-2"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Medal className="h-5 w-5 text-purple-500" />
                      Top Contributors by Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-6">
                        {Array(10)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <Skeleton className="h-8 w-8 rounded-full skeleton" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-32 skeleton" />
                                <Skeleton className="h-2 w-full skeleton" />
                              </div>
                              <Skeleton className="h-6 w-16 rounded-md skeleton" />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                        {topContributorsByComments.slice(0, 10).map((contributor, index) => (
                          <motion.div key={contributor.name} variants={item} className="flex items-center gap-4">
                            <div className="relative flex items-center justify-center w-8 h-8">
                              {index < 3 ? (
                                <div
                                  className={`absolute inset-0 flex items-center justify-center rounded-full ${
                                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-300" : "bg-amber-700"
                                  }`}
                                >
                                  <span className="font-bold text-sm text-black">{index + 1}</span>
                                </div>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-muted">
                                  <span className="font-medium text-sm">{index + 1}</span>
                                </div>
                              )}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                              <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium">{contributor.name}</p>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Medal className="h-3 w-3" />
                                  {contributor.comments} comments
                                </Badge>
                              </div>
                              <Progress
                                value={(contributor.comments / topContributorsByComments[0].comments) * 100}
                                className="h-2"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32 skeleton" />
                            <Skeleton className="h-4 w-16 skeleton" />
                          </div>
                          <Skeleton className="h-2 w-full skeleton" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                    {topCategories.map((category, index) => (
                      <motion.div key={category.name} variants={item} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-300" : "bg-amber-700"
                                }`}
                              >
                                <span className="font-bold text-xs text-black">{index + 1}</span>
                              </div>
                            )}
                            <p className="font-medium capitalize">{category.name}</p>
                          </div>
                          <Badge variant="outline">{category.upvotes} upvotes</Badge>
                        </div>
                        <Progress value={(category.upvotes / topCategories[0].upvotes) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {category.posts} posts • {Math.round(category.upvotes / category.posts)} avg. upvotes
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Earn badges and recognition for your contributions to the community.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                    <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                    <p className="text-sm font-medium">Top Contributor</p>
                    <p className="text-xs text-muted-foreground text-center">100+ upvotes</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                    <Award className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium">Content Creator</p>
                    <p className="text-xs text-muted-foreground text-center">10+ posts</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                    <Medal className="h-8 w-8 text-purple-500 mb-2" />
                    <p className="text-sm font-medium">Engaged Member</p>
                    <p className="text-xs text-muted-foreground text-center">50+ comments</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                    <Crown className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-sm font-medium">Trendsetter</p>
                    <p className="text-xs text-muted-foreground text-center">Featured post</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
