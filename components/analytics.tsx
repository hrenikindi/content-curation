"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function Analytics() {
  const pathname = usePathname()
  const [url, setUrl] = useState<string>("")

  useEffect(() => {
    // This would be where you'd track page views with a real analytics service
    // We're avoiding useSearchParams() completely
    setUrl(pathname || "")

    // For demonstration purposes only - in a real app you'd use a proper analytics service
    console.log(`📊 Page view: ${pathname}`)
  }, [pathname])

  return null
}
