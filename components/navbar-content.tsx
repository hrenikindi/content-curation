"use client"

import type React from "react"

import Link from "next/link"
import { Menu, Bell, User, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useOnboarding } from "@/components/onboarding-provider"

export default function NavbarContent() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const { toast } = useToast()
  const { showOnboardingTip } = useOnboarding()

  const routes = [
    { href: "/", label: "Home" },
    { href: "/trending", label: "Trending" },
    { href: "/submit", label: "Submit" },
    { href: "/leaderboard", label: "Leaderboard" },
  ]

  // Show onboarding tip for navbar on first visit
  useEffect(() => {
    showOnboardingTip("navbar", "Welcome to Curator! Use the navigation to explore content.")
  }, [showOnboardingTip])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // '/' to focus search
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setSearchOpen(true)
      }

      // 'Escape' to close search
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, you would redirect to search results
      toast({
        title: "Search submitted",
        description: `You searched for: ${searchQuery}`,
      })
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <motion.span
                  className="font-bold text-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Curator
                </motion.span>
              </Link>
              <nav className="grid gap-6 text-lg font-medium">
                {routes.map((route, index) => (
                  <motion.div
                    key={route.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                        pathname === route.href && "text-foreground font-semibold",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {route.label}
                      {route.label === "Trending" && (
                        <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500/20">
                          Hot
                        </Badge>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              className="font-bold text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Curator
            </motion.span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route, index) => (
              <motion.div
                key={route.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80 relative",
                    pathname === route.href
                      ? "text-foreground after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-foreground"
                      : "text-foreground/60",
                  )}
                >
                  {route.label}
                  {route.label === "Trending" && (
                    <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500/20">
                      Hot
                    </Badge>
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" onClick={() => setSearchOpen(!searchOpen)}>
            <SearchIcon className="h-5 w-5" />
            <span className="sr-only">Search</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              /
            </kbd>
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Bookmarks</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild className="hidden md:flex">
            <Link href="/submit">Submit Content</Link>
          </Button>
        </div>
      </div>

      {/* Global search overlay */}
      {searchOpen && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            className="w-full max-w-2xl bg-card border rounded-lg shadow-lg overflow-hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="p-4">
              <div className="flex items-center border-b pb-4">
                <SearchIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for posts, tags, or users..."
                  className="border-none shadow-none focus-visible:ring-0 flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <kbd className="hidden sm:flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  ESC
                </kbd>
              </div>

              {/* Quick links */}
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["react", "design", "productivity", "ai", "webdev"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => setSearchQuery(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </header>
  )
}
