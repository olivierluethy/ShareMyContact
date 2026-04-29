import { Badge } from "@/components/ui/badge"
import { Shield, Zap, UserX } from "lucide-react"

export function Hero() {
  return (
    <section className="flex flex-col items-center px-6 pt-16 pb-10 text-center md:pt-24 md:pb-14">
      <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium">
        <Shield className="h-3 w-3" />
        Privacy-first by design
      </Badge>

      <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
        {"The world's simplest way to "}
        <span className="text-primary">share your contacts</span>
      </h1>

      <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        No accounts. No apps to install. No profiles. One beautiful link — instant, private, yours forever.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <UserX className="h-4 w-4 text-primary" />
          No accounts
        </span>
        <span className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Instant sharing
        </span>
        <span className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Zero server storage
        </span>
      </div>
    </section>
  )
}
