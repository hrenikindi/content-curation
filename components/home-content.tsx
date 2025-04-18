"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import PostGrid from "@/components/post-grid"
import Sidebar from "@/components/sidebar"
import CategoryFilter from "@/components/category-filter"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"
import { useOnboarding } from "@/components/onboarding-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function HomeContent() {
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { showOnboardingTip } = useOnboarding()
  const { toast } = useToast()
  const router = useRouter()

  // Handle mounting state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulate loading state
  useEffect(() => {
    if (!mounted) return

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [mounted])

  // Show onboarding tips
  useEffect(() => {
    if (!mounted) return

    showOnboardingTip("home", "Browse curated content or use filters to find specific topics.")
    showOnboardingTip("search", "Press '/' anywhere to quickly search for content.")
  }, [showOnboardingTip, mounted])

  // Get URL parameters on client side only
  useEffect(() => {
    if (!mounted) return

    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get("category")
    const searchParam = params.get("search")
    const tagParam = params.get("tag")

    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }

    if (searchParam) {
      setSearchQuery(searchParam)
    }

    if (tagParam) {
      setSearchQuery(tagParam)
      toast({
        title: "Filtering by tag",
        description: `Showing posts with tag: #${tagParam}`,
      })
    }
  }, [toast, mounted])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)

    // Update URL with category parameter
    const params = new URLSearchParams(window.location.search)
    params.set("category", category)
    router.push(`/?${params.toString()}`)

    // Show toast notification
    if (category !== "all") {
      toast({
        title: "Category selected",
        description: `Showing ${category} posts`,
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Update URL with search parameter
    const params = new URLSearchParams(window.location.search)
    params.set("search", searchQuery)
    router.push(`/?${params.toString()}`)

    toast({
      title: "Search results",
      description: `Showing results for: ${searchQuery}`,
    })
  }

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="h-10 w-full bg-muted rounded-md"></div>
                </div>
                <div className="h-10 w-40 bg-muted rounded-md"></div>
                <div className="h-10 w-20 bg-muted rounded-md"></div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-40 bg-muted rounded-md"></div>
                  <div className="h-8 w-20 bg-muted rounded-md"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6 space-y-4">
                          <div className="h-6 w-3/4 bg-muted rounded-md"></div>
                          <div className="h-4 w-full bg-muted rounded-md"></div>
                          <div className="h-4 w-5/6 bg-muted rounded-md"></div>
                          <div className="flex items-center gap-4 pt-4">
                            <div className="h-10 w-10 bg-muted rounded-full"></div>
                            <div className="h-4 w-24 bg-muted rounded-md"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-80 shrink-0 space-y-6">
              <div className="h-64 w-full bg-muted rounded-xl"></div>
              <div className="h-48 w-full bg-muted rounded-xl"></div>
              <div className="h-40 w-full bg-muted rounded-xl"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <motion.div
          className="flex flex-col md:flex-row gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-9 w-full focus-visible:ring-2 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
              <Button type="submit" className="sm:w-auto w-full">
                Search
              </Button>
            </form>

            <Tabs defaultValue="featured" className="mb-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="featured" className="mt-4">
                <PostGrid
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  isLoading={isLoading}
                  sortBy="featured"
                />
              </TabsContent>

              <TabsContent value="recent" className="mt-4">
                <PostGrid
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  isLoading={isLoading}
                  sortBy="recent"
                />
              </TabsContent>

              <TabsContent value="popular" className="mt-4">
                <PostGrid
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  isLoading={isLoading}
                  sortBy="popular"
                />
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            className="w-full md:w-80 shrink-0"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Sidebar className="sticky top-20" />
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
