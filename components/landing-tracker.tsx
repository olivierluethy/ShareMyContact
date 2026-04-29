"use client"

import { useScrollDepth, usePageEngagement } from "@/hooks/use-tracking"

export function LandingTracker() {
  useScrollDepth()
  usePageEngagement("landing")
  return null
}
