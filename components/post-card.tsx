"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark, BookmarkCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Post {
  id: string
  title: string
  description: string
  upvotes: number
  comments: number
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
  createdAt: string
}

interface PostCardProps {
  post: Post
  variant: "grid" | "list"
}

export default function PostCard({ post, variant }: PostCardProps) {
  const [votes, setVotes] = useState(post.upvotes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { toast } = useToast()
  const cardRef = useRef<HTMLDivElement>(null)

  const handleVote = (direction: "up" | "down") => {
    if (userVote === direction) {
      // User is removing their vote
      setVotes(direction === "up" ? votes - 1 : votes + 1)
      setUserVote(null)
    } else {
      // User is changing their vote or voting for the first time
      const voteChange = userVote ? 2 : 1
      const newVotes = direction === "up" ? votes + voteChange : votes - voteChange
      setVotes(newVotes)
      setUserVote(direction)

      // Show confetti animation for significant upvotes
      if (direction === "up" && newVotes % 50 === 0) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      toast({
        title: direction === "up" ? "Upvoted!" : "Downvoted",
        description: `You ${direction === "up" ? "upvoted" : "downvoted"} this post.`,
        duration: 1500,
      })
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked
        ? "This post has been removed from your bookmarks."
        : "This post has been saved to your bookmarks.",
      duration: 1500,
    })
  }

  const handleShare = () => {
    // In a real app, this would use the Web Share API or copy to clipboard
    toast({
      title: "Link copied!",
      description: "Post link has been copied to clipboard.",
      duration: 1500,
    })
  }

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const ripple = document.createElement("span")
    const rect = button.getBoundingClientRect()

    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.className = "ripple"

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

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

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  // Create confetti elements
  const renderConfetti = () => {
    if (!showConfetti) return null

    const confetti = []
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100
      const animationDuration = 3 + Math.random() * 2
      const color = colors[Math.floor(Math.random() * colors.length)]

      confetti.push(
        <div
          key={i}
          className="confetti"
          style={{
            left: `${left}%`,
            top: "-20px",
            backgroundColor: color,
            width: `${5 + Math.random() * 5}px`,
            height: `${5 + Math.random() * 5}px`,
            animationDuration: `${animationDuration}s`,
          }}
        />,
      )
    }

    return confetti
  }

  if (variant === "list") {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md" ref={cardRef}>
          <div className="flex flex-col sm:flex-row">
            <div className="flex flex-col items-center justify-center p-4 border-r bg-muted/20">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  handleVote("up")
                  createRipple(e)
                }}
                className={cn("rounded-full relative overflow-hidden tooltip", userVote === "up" && "text-green-500")}
                data-tooltip="Upvote"
              >
                <ArrowBigUp className="h-5 w-5" />
                <span className="sr-only">Upvote</span>
              </Button>
              <motion.span
                className="font-bold text-lg"
                key={votes}
                initial={{ scale: 1 }}
                animate={userVote ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {votes}
              </motion.span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  handleVote("down")
                  createRipple(e)
                }}
                className={cn("rounded-full relative overflow-hidden tooltip", userVote === "down" && "text-red-500")}
                data-tooltip="Downvote"
              >
                <ArrowBigDown className="h-5 w-5" />
                <span className="sr-only">Downvote</span>
              </Button>
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className={cn(getCategoryColor(post.category))}>
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
              </div>
              <Link href={`/post/${post.id}`} className="group">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{post.title}</h3>
                <p className="text-muted-foreground line-clamp-2">{post.description}</p>
              </Link>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 tooltip relative overflow-hidden"
                    data-tooltip="Comments"
                    onClick={createRipple}
                    asChild
                  >
                    <Link href={`/post/${post.id}#comments`}>
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="tooltip relative overflow-hidden"
                    data-tooltip="Share"
                    onClick={(e) => {
                      handleShare()
                      createRipple(e)
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="tooltip relative overflow-hidden"
                    data-tooltip={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    onClick={(e) => {
                      handleBookmark()
                      createRipple(e)
                    }}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {showConfetti && renderConfetti()}
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col" ref={cardRef}>
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <Badge variant="secondary" className={cn(getCategoryColor(post.category))}>
              {post.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Link href={`/post/${post.id}`} className="group">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{post.title}</h3>
            <p className="text-muted-foreground line-clamp-3">{post.description}</p>
          </Link>
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs hover:bg-secondary transition-colors">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                handleVote("up")
                createRipple(e)
              }}
              className={cn("tooltip relative overflow-hidden", userVote === "up" && "text-green-500")}
              data-tooltip="Upvote"
            >
              <ArrowBigUp className="h-4 w-4 mr-1" />
              <motion.span
                key={votes}
                initial={{ scale: 1 }}
                animate={userVote ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {votes}
              </motion.span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                handleVote("down")
                createRipple(e)
              }}
              className={cn("tooltip relative overflow-hidden", userVote === "down" && "text-red-500")}
              data-tooltip="Downvote"
            >
              <ArrowBigDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 tooltip relative overflow-hidden"
              data-tooltip="Comments"
              onClick={createRipple}
              asChild
            >
              <Link href={`/post/${post.id}#comments`}>
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="tooltip relative overflow-hidden"
                  data-tooltip="More actions"
                  onClick={createRipple}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>Share link</DropdownMenuItem>
                <DropdownMenuItem onClick={handleBookmark}>
                  {isBookmarked ? "Remove bookmark" : "Bookmark"}
                </DropdownMenuItem>
                <DropdownMenuItem>Report content</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
        {showConfetti && renderConfetti()}
      </Card>
    </motion.div>
  )
}
