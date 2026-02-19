import { Shield, MapPin } from "lucide-react"

export function Footer() {
  return (

    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Secure by Design</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Zero-knowledge architecture — your contact data never touches our
                servers. Everything stays in your link.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Built in Zurich</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Privacy-first by design. Crafted with care in Switzerland.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} ShareMyContact. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
