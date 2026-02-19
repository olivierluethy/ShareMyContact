"use client"

import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getLatestPosts } from "@/lib/blog-data"
import { trackEvent } from "@/lib/gtag"

export function BlogTeaser() {
  const posts = getLatestPosts(3)

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            From the Blog
          </h2>
          <p className="mt-2 text-muted-foreground">
            Insights on privacy, networking, and digital contact sharing.
          </p>
        </div>
        <Link href="/blog" onClick={() => trackEvent("click", "blog_teaser", "view_all_posts_desktop")} className="hidden md:block">
          <Button variant="ghost" className="gap-2 text-muted-foreground">
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} onClick={() => trackEvent("click", "blog_teaser", `blog_card_${post.slug}`)} className="group">
            <Card className="h-full border-border transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <CardTitle className="mt-2 text-lg leading-snug text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link href="/blog" onClick={() => trackEvent("click", "blog_teaser", "view_all_posts_mobile")}>
          <Button variant="outline" className="gap-2">
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
