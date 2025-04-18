import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { OnboardingProvider } from "@/components/onboarding-provider"
import { Suspense } from "react"
import { Analytics } from "@/components/analytics"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <OnboardingProvider>
        {children}
        <Toaster />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </OnboardingProvider>
    </ThemeProvider>
  )
}
