"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Share2, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/gtag"
import { useState } from "react"
import Image from 'next/image'

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)


  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" onClick={() => trackEvent("click", "navigation", "logo_home")} className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary">
            <Image
              src="/favicon.svg"
              alt="ShareMyContact logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
            ShareMyContact
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => trackEvent("click", "navigation", `desktop_nav_${link.label.toLowerCase()}`)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => { trackEvent("click", "navigation", mobileOpen ? "mobile_menu_close" : "mobile_menu_open"); setMobileOpen(!mobileOpen) }}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 sm:px-6 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => { trackEvent("click", "navigation", `mobile_nav_${link.label.toLowerCase()}`); setMobileOpen(false) }}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
