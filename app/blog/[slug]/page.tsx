import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User } from "lucide-react"
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
      authors: post.author,           // ← added (single author string)
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "ShareMyContact",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      // You could add creator: `@${post.author.toLowerCase().replace(/\s/g, "")}` if you have handles
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

  // Format date — prefer formattedDate if present, otherwise generate from ISO date
  const displayDate = post.formattedDate || new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Simple markdown-like rendering: headings, lists, paragraphs
  const contentBlocks = post.content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-10 mb-5 text-2xl font-semibold tracking-tight text-foreground"
        >
          {block.replace("## ", "")}
        </h2>
      )
    }
    if (block.startsWith("1. ") || block.startsWith("- ") || block.startsWith("* ")) {
      const items = block.split("\n").filter(Boolean)
      const isOrdered = block.startsWith("1. ")
      const Tag = isOrdered ? "ol" : "ul"
      return (
        <Tag
          key={i}
          className={`my-5 space-y-2.5 pl-6 text-foreground/90 leading-relaxed ${
            isOrdered ? "list-decimal" : "list-disc"
          }`}
        >
          {items.map((item, j) => (
            <li key={j}>
              {item
                .replace(/^(\d+\.\s|-\s|\*\s)/, "")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
            </li>
          ))}
        </Tag>
      )
    }
    return (
      <p key={i} className="my-5 leading-relaxed text-foreground/85">
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
    author: {
      "@type": "Person",
      name: post.author,
    },
    url: `${SITE_URL}/blog/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "ShareMyContact",
      url: SITE_URL,
    },
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TrackedLink href="/blog" eventCategory="blog_post" eventLabel={`back_to_blog_top_${slug}`}>
        <Button variant="ghost" className="mb-10 gap-2 text-muted-foreground -ml-3">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Button>
      </TrackedLink>

      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{displayDate}</time>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author}
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <p className="mt-5 text-xl leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
        {contentBlocks}
      </div>

      <div className="mt-16 border-t border-border pt-10">
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