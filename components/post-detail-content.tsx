"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import { allPosts } from "@/data/posts"
import { motion } from "framer-motion"

export default function PostDetailContent({ id }: { id: string }) {
  // Find the post from our data
  const post = allPosts.find((p) => p.id === id) || allPosts[0]

  const [votes, setVotes] = useState(post.upvotes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState(post.comments ? (Array.isArray(post.comments) ? post.comments : []) : [])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleVote = (direction: "up" | "down") => {
    if (userVote === direction) {
      // User is removing their vote
      setVotes(direction === "up" ? votes - 1 : votes + 1)
      setUserVote(null)
    } else {
      // User is changing their vote or voting for the first time
      const voteChange = userVote ? 2 : 1
      setVotes(direction === "up" ? votes + voteChange : votes - voteChange)
      setUserVote(direction)

      toast({
        title: direction === "up" ? "Upvoted!" : "Downvoted",
        description: `You ${direction === "up" ? "upvoted" : "downvoted"} this post.`,
        duration: 1500,
      })
    }
  }

  const handleCommentVote = (commentId: string, direction: "up" | "down") => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            upvotes: direction === "up" ? comment.upvotes + 1 : comment.upvotes - 1,
          }
        }
        return comment
      }),
    )

    toast({
      title: direction === "up" ? "Comment upvoted!" : "Comment downvoted",
      duration: 1500,
    })
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return

    const newComment = {
      id: `c${comments.length + 1}`,
      content: commentText,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date().toISOString(),
      upvotes: 0,
    }

    setComments([newComment, ...comments])
    setCommentText("")

    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    })
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

  // Generate a simple content if none exists
  const postContent =
    post.content ||
    `
    <p>${post.description}</p>
    <p>This is an expanded view of the post. The full content would be displayed here, including any formatting, images, or other media that might be part of the article.</p>
    <p>Users can read the complete article and engage with it through comments and voting.</p>
  `

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <motion.div
            className="flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-row md:flex-col items-center gap-2 md:gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote("up")}
                className={cn("rounded-full", userVote === "up" && "text-green-500")}
              >
                <ArrowBigUp className="h-6 w-6" />
                <span className="sr-only">Upvote</span>
              </Button>
              <motion.span
                className="font-bold text-xl"
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
                onClick={() => handleVote("down")}
                className={cn("rounded-full", userVote === "down" && "text-red-500")}
              >
                <ArrowBigDown className="h-6 w-6" />
                <span className="sr-only">Downvote</span>
              </Button>
              <Separator className="hidden md:block my-2" />
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className={cn(getCategoryColor(post.category))}>
                  {post.category}
                </Badge>
                <span className="text-sm text-muted-foreground">{formattedDate}</span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>

              <div
                className="prose dark:prose-invert max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: postContent }}
              />

              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments.length})
                </h2>

                <Card>
                  <CardContent className="p-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mb-4 min-h-[100px]"
                    />
                    <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                      Post Comment
                    </Button>
                  </CardContent>
                </Card>

                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No comments yet</h3>
                    <p className="text-muted-foreground">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10 mt-1">
                              <AvatarImage
                                src={comment.author.avatar || "/placeholder.svg"}
                                alt={comment.author.name}
                              />
                              <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium">{comment.author.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleCommentVote(comment.id, "up")}
                                  >
                                    <ArrowBigUp className="h-4 w-4" />
                                  </Button>
                                  <span className="text-sm font-medium">{comment.upvotes}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleCommentVote(comment.id, "down")}
                                  >
                                    <ArrowBigDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
