"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/gtag"

interface TrackedLinkProps {
  href: string
  eventCategory: string
  eventLabel: string
  children: React.ReactNode
  className?: string
}

export function TrackedLink({
  href,
  eventCategory,
  eventLabel,
  children,
  className,
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => trackEvent("click", eventCategory, eventLabel)}
      className={className}
    >
      {children}
    </Link>
  )
}
