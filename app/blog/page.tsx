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

const SITE_URL = "https://v0-next-js-contact-sharing.vercel.app"

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
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Blog
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Insights on privacy, digital business cards, and modern networking.
        </p>
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
