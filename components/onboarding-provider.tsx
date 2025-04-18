"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

type OnboardingTips = Record<string, boolean>

interface OnboardingContextType {
  showOnboardingTip: (id: string, message: string) => void
  isFirstVisit: boolean
  dismissOnboarding: () => void
}

// Create a default context value to avoid the "must be used within a provider" error
const defaultContextValue: OnboardingContextType = {
  showOnboardingTip: () => {},
  isFirstVisit: false,
  dismissOnboarding: () => {},
}

const OnboardingContext = createContext<OnboardingContextType>(defaultContextValue)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [tips, setTips] = useState<OnboardingTips>({})
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)

    // Check if user has visited before
    const hasVisited = localStorage.getItem("curator:visited")
    if (hasVisited) {
      setIsFirstVisit(false)
    } else {
      localStorage.setItem("curator:visited", "true")
      setIsFirstVisit(true)

      // Show welcome toast on first visit
      toast({
        title: "Welcome to Curator!",
        description: "Discover and share the best content from around the web.",
        duration: 5000,
      })
    }

    // Load previously seen tips
    const savedTips = localStorage.getItem("curator:tips")
    if (savedTips) {
      setTips(JSON.parse(savedTips))
    }
  }, [toast])

  const showOnboardingTip = (id: string, message: string) => {
    if (mounted && isFirstVisit && !tips[id]) {
      // Show the tip
      toast({
        title: "Tip",
        description: message,
        duration: 5000,
      })

      // Mark as seen
      const updatedTips = { ...tips, [id]: true }
      setTips(updatedTips)
      localStorage.setItem("curator:tips", JSON.stringify(updatedTips))
    }
  }

  const dismissOnboarding = () => {
    setIsFirstVisit(false)
  }

  return (
    <OnboardingContext.Provider value={{ showOnboardingTip, isFirstVisit, dismissOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  return useContext(OnboardingContext)
}

export function OnboardingTooltip({
  id,
  message,
  children,
}: {
  id: string
  message: string
  children: React.ReactNode
}) {
  const { isFirstVisit, showOnboardingTip } = useOnboarding()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (isFirstVisit && !shown) {
      showOnboardingTip(id, message)
      setShown(true)
    }
  }, [id, message, isFirstVisit, showOnboardingTip, shown])

  return children
}
