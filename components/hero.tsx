import { Badge } from "@/components/ui/badge"
import { Shield, Zap, UserX } from "lucide-react"

export function Hero() {
  return (
    <section className="flex flex-col items-center px-4 pt-10 pb-8 text-center sm:px-6 sm:pt-16 sm:pb-10 md:pt-24 md:pb-14">
      <Badge variant="secondary" className="mb-5 gap-1.5 px-3 py-1 text-xs font-medium sm:mb-6">
        <Shield className="h-3 w-3" />
        Privacy-first by design
      </Badge>

      <h1 className="max-w-3xl text-balance text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
        {"The world's simplest way to "}
        <span className="text-primary">share your contacts</span>
      </h1>

      <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base md:text-lg">
        No accounts. No apps to install. No profiles. One beautiful link — instant, private, yours forever.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:mt-8 sm:gap-6 sm:text-sm">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <UserX className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
          No accounts
        </span>
        <span className="flex items-center gap-1.5 sm:gap-2">
          <Zap className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
          Instant sharing
        </span>
        <span className="flex items-center gap-1.5 sm:gap-2">
          <Shield className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
          Zero server storage
        </span>
      </div>
    </section>
  )
}
