export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-qr-codes-are-still-king-in-2026",
    title: "Why QR Codes Are Still King in 2026",
    date: "2026-02-10",
    excerpt:
      "From restaurant menus to conference badges, QR codes have cemented their place in everyday life. Here's why they remain the fastest bridge between the physical and digital world.",
    content: `QR codes have been around since 1994, but it took a global pandemic to push them into the mainstream. Now, in 2026, they're more ubiquitous than ever.

## The Simplicity Factor

Unlike NFC, Bluetooth, or proprietary apps, QR codes require nothing more than a smartphone camera. There's no pairing, no app download, no account creation. You point, you scan, you're connected.

## Privacy Advantages

When you share a QR code containing your contact information, you control exactly what data is included. There's no social media algorithm tracking the exchange, no third-party database storing your details. The data lives in the code itself.

## The Business Card Revolution

Traditional paper business cards are wasteful and easy to lose. Digital business cards powered by QR codes offer a sustainable, always-up-to-date alternative. With tools like ShareMyContact, you can encode your contact details directly into a QR code — no server, no account, no data collection.

## Looking Ahead

As augmented reality glasses become more common, QR codes will likely evolve into visual anchors for AR experiences. But their core value proposition — instant, universal, no-friction data transfer — will remain unchanged.

The humble QR code isn't going anywhere. If anything, it's just getting started.`,
  },
  {
    slug: "privacy-in-digital-business-cards",
    title: "Privacy in Digital Business Cards",
    date: "2026-01-28",
    excerpt:
      "Most digital business card platforms store your data on their servers. Learn why zero-knowledge architecture matters and how to keep your contacts truly private.",
    content: `When you hand someone a paper business card, the exchange is inherently private. No server logs the interaction, no algorithm processes the data. But when you switch to digital, privacy often takes a backseat.

## The Problem with Traditional Platforms

Most digital business card services require you to create an account, upload your information to their servers, and trust them to handle it responsibly. Your contact data becomes their asset — used for analytics, sold to partners, or simply vulnerable to breaches.

## What Zero-Knowledge Means

A zero-knowledge architecture means the service provider never has access to your data. With ShareMyContact, your contact information is encoded directly into the URL using base64 encoding. The data travels from your browser to the recipient's browser — our servers never see it.

## Why This Matters

- **No data breaches**: You can't leak data you never stored.
- **No tracking**: We don't know who creates cards or who views them.
- **Full control**: Want to update your info? Generate a new link. Want to delete it? Simply stop sharing the old one.

## Best Practices

1. Only include information you're comfortable sharing publicly
2. Use different cards for different contexts (work vs. personal)
3. Regularly review and update your shared links
4. Consider using a link shortener for cleaner URLs

Privacy isn't a feature — it's a fundamental right. Your contact information should be yours to share on your terms.`,
  },
  {
    slug: "networking-tips-for-2026",
    title: "Networking Tips for 2026",
    date: "2026-01-15",
    excerpt:
      "Conferences, meetups, and remote work have changed how we connect. Here are practical strategies for building meaningful professional relationships this year.",
    content: `Professional networking in 2026 looks vastly different from even a few years ago. With hybrid events becoming the norm and AI reshaping industries, the way we build connections has evolved.

## Lead with Value

The most effective networkers in 2026 don't ask "What do you do?" — they ask "What are you working on?" This subtle shift opens the door to genuine conversation and potential collaboration.

## Digital-First Impressions

Your digital presence is often the first thing a new contact sees. Make sure your LinkedIn is current, your personal site reflects your latest work, and your contact sharing method is frictionless. A QR code on your phone or a simple shareable link beats fumbling with paper cards every time.

## The Follow-Up Framework

Meeting someone is only the beginning. The real value comes from what happens next:

1. **Within 24 hours**: Send a brief message referencing something specific from your conversation
2. **Within a week**: Share an article, resource, or introduction relevant to their interests
3. **Within a month**: Check in with a genuine update or question

## Hybrid Event Strategies

For in-person events, have your QR code ready on your phone's lock screen. For virtual events, include your ShareMyContact link in your chat profile and virtual background.

## Quality Over Quantity

It's tempting to collect as many contacts as possible, but meaningful relationships matter more than a large Rolodex. Focus on building 5-10 strong connections per event rather than 50 superficial ones.

## The Privacy Advantage

Using a privacy-first contact sharing tool sends a signal: you respect people's data. In an era of increasing privacy awareness, this matters more than you might think.

The best networking tip for 2026? Be genuinely interested in other people. Technology just makes the logistics easier.`,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getLatestPosts(count: number = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}
