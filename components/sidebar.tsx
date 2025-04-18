"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { allPosts } from "@/data/posts"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useOnboarding } from "@/components/onboarding-provider"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

// Get trending posts from all posts
const trendingPosts = [...allPosts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3)

// Calculate category counts
const categoryData = allPosts.reduce(
  (acc, post) => {
    const category = post.category
    if (!acc[category]) {
      acc[category] = {
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        count: 0,
        color: getCategoryColor(category),
      }
    }
    acc[category].count += 1
    return acc
  },
  {} as Record<string, { id: string; name: string; count: number; color: string }>,
)

const categories = Object.values(categoryData)

// Calculate popular tags
const tagCounts: Record<string, number> = {}
allPosts.forEach((post) => {
  post.tags.forEach((tag) => {
    if (!tagCounts[tag]) tagCounts[tag] = 0
    tagCounts[tag] += 1
  })
})

const popularTags = Object.entries(tagCounts)
  .map(([name, count]) => ({ id: name, name, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 8)

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

export default function Sidebar({ className }: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const { showOnboardingTip } = useOnboarding()
  const { toast } = useToast()

  // Handle mounting state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show onboarding tip
  useEffect(() => {
    if (!mounted) return

    showOnboardingTip("sidebar", "Explore trending content and popular categories here.")
  }, [showOnboardingTip, mounted])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 },
  }

  // Don't render animations until mounted
  if (!mounted) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Top Posts This Week</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {trendingPosts.map((post, index) => (
              <Link key={post.id} href={`/post/${post.id}`} className="flex items-start gap-3 group">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">{post.upvotes} upvotes</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.id}`}
                  className="flex items-center justify-between group"
                >
                  <Badge variant="secondary" className={cn("transition-all", category.color, "group-hover:scale-105")}>
                    {category.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{category.count} posts</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link key={tag.id} href={`/?tag=${tag.id}`}>
                  <Badge variant="outline" className="hover:bg-secondary transition-colors hover:scale-105">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Newsletter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Subscribe to our weekly newsletter to get the latest content directly to your inbox.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                toast({
                  title: "Subscribed!",
                  description: "Thank you for subscribing to our newsletter.",
                })
              }}
            >
              Subscribe
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div className={cn("space-y-6", className)} variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Top Posts This Week</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  toast({
                    title: "Weekly digest",
                    description: "You've subscribed to the weekly digest!",
                  })
                }}
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {trendingPosts.map((post, index) => (
              <Link key={post.id} href={`/post/${post.id}`} className="flex items-start gap-3 group">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">{post.upvotes} upvotes</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.id}`}
                  className="flex items-center justify-between group"
                >
                  <Badge variant="secondary" className={cn("transition-all", category.color, "group-hover:scale-105")}>
                    {category.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{category.count} posts</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link key={tag.id} href={`/?tag=${tag.id}`}>
                  <Badge variant="outline" className="hover:bg-secondary transition-colors hover:scale-105">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Newsletter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Subscribe to our weekly newsletter to get the latest content directly to your inbox.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                toast({
                  title: "Subscribed!",
                  description: "Thank you for subscribing to our newsletter.",
                })
              }}
            >
              Subscribe
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
