import type { Metadata } from "next"
import { ArrowRight, Calendar } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { blogPosts } from "@/lib/blog-data"

const SITE_URL = "https://sharemycontact.com"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips and insights on privacy-first contact sharing, QR codes, digital business cards, and professional networking.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | ShareMyContact",
    description:
      "Tips and insights on privacy-first contact sharing, QR codes, digital business cards, and professional networking.",
    type: "website",
    url: `${SITE_URL}/blog`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
     <header className="relative mb-12 pb-8 border-b border-white/5">
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Engineering Logs
          </div>

          <div>
            {/* "block" entfernt und whitespace-nowrap hinzugefügt für eine Zeile */}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter italic whitespace-nowrap">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                Share My Contact
              </span>
              <span className="text-white ml-2">Insights</span>
            </h1>
            
            <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Reflective key learnings and architectural improvements. 
              Exploring the intersection of <span className="text-indigo-400 font-medium">privacy-first engineering</span> and 
              high-performance networking.
            </p>
          </div>

          <div className="mt-6 h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {sorted.map((post) => (
          <TrackedLink key={post.slug} href={`/blog/${post.slug}`} eventCategory="blog_list" eventLabel={`blog_card_${post.slug}`} className="group">
            <Card className="border-border transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <CardTitle className="mt-1 text-xl leading-snug text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {post.excerpt}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </CardContent>
            </Card>
          </TrackedLink>
        ))}
      </div>
    </div>
  )
}
