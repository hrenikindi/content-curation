"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useOnboarding } from "@/components/onboarding-provider"
import { useEffect, useState } from "react"

const categories = [
  { id: "all", name: "All Categories" },
  { id: "tech", name: "Technology" },
  { id: "design", name: "Design" },
  { id: "business", name: "Business" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "health", name: "Health & Wellness" },
]

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [mounted, setMounted] = useState(false)
  const selectedCategoryObj = categories.find((cat) => cat.id === selectedCategory) || categories[0]
  const { showOnboardingTip } = useOnboarding()

  // Handle mounting state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show onboarding tip
  useEffect(() => {
    if (!mounted) return

    showOnboardingTip("category-filter", "Filter content by category to find what interests you.")
  }, [showOnboardingTip, mounted])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto justify-between group">
          <span>{selectedCategoryObj.name}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              className={cn(
                "flex items-center justify-between cursor-pointer",
                selectedCategory === category.id && "font-medium",
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
              {selectedCategory === category.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
