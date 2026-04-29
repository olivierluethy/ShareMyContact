"use client"

import { useRef, type ReactNode } from "react"
import { useHoverTracking, useSectionView } from "@/hooks/use-tracking"

interface TrackedSectionProps {
  name: string
  className?: string
  trackHover?: boolean
  threshold?: number
  children: ReactNode
}

export function TrackedSection({
  name,
  className,
  trackHover = false,
  threshold = 0.4,
  children,
}: TrackedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  useSectionView(ref, name, { threshold })
  useHoverTracking(ref, name, trackHover ? 600 : Number.POSITIVE_INFINITY)

  return (
    <div ref={ref} className={className} data-track-section={name}>
      {children}
    </div>
  )
}
