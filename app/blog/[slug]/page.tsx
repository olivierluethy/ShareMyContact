import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogPosts, getPostBySlug } from "@/lib/blog-data"
import { TrackedLink } from "@/components/tracked-link"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

const SITE_URL = "https://v0-next-js-contact-sharing.vercel.app"

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "ShareMyContact",
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
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Simple markdown-like rendering: headings and paragraphs
  const contentBlocks = post.content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-8 mb-4 text-xl font-semibold tracking-tight text-foreground"
        >
          {block.replace("## ", "")}
        </h2>
      )
    }
    if (block.startsWith("1. ") || block.startsWith("- ")) {
      const items = block.split("\n").filter(Boolean)
      const isOrdered = block.startsWith("1. ")
      const Tag = isOrdered ? "ol" : "ul"
      return (
        <Tag
          key={i}
          className={`my-4 space-y-2 pl-6 text-foreground leading-relaxed ${
            isOrdered ? "list-decimal" : "list-disc"
          }`}
        >
          {items.map((item, j) => (
            <li key={j}>
              {item.replace(/^(\d+\.\s|-\s|\*\*|\*\*)/, "").replace(/\*\*/g, "")}
            </li>
          ))}
        </Tag>
      )
    }
    return (
      <p key={i} className="my-4 leading-relaxed text-foreground/85">
        {block}
      </p>
    )
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "ShareMyContact",
      url: SITE_URL,
    },
  }

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackedLink href="/blog" eventCategory="blog_post" eventLabel={`back_to_blog_top_${slug}`}>
        <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground -ml-3">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Button>
      </TrackedLink>

      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </header>

      <div className="border-t border-border pt-8">{contentBlocks}</div>

      <div className="mt-12 border-t border-border pt-8">
        <TrackedLink href="/blog" eventCategory="blog_post" eventLabel={`all_posts_bottom_${slug}`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            All Posts
          </Button>
        </TrackedLink>
      </div>
    </article>
  )
}
