export interface BlogPost {
  slug: string;
  title: string;
  date: string;           // ISO format YYYY-MM-DD – used for reliable sorting
  formattedDate: string;  // Human-readable version for display
  excerpt: string;
  content: string;
  author: string;         // Made required – every post should have one
}

export const blogPosts: BlogPost[] = [
  {
    slug: "two-days-with-sharemycontact",
    title: "Two Days with ShareMyContact – Breaking the Number Barrier",
    date: "2026-02-19", // ← adjust to today's or launch date
    formattedDate: "February 19, 2026",
    excerpt:
      "Just two days after launching this project, I'm already seeing how it quietly removes one of the most awkward barriers in everyday social situations — asking for someone's number.",
    content: `Exactly two days have passed since I brought this project to life.

The truth is, I had already experienced far too many moments where I wanted to ask for someone's number but held back simply because the situation never felt quite right. Especially in places surrounded by lots of people — standing around at an event, a bar, a party — the idea of asking a woman I just met for her number can suddenly feel incredibly awkward. The moment she types it in and we exchange contacts in front of everyone, it can come across as almost cringe-worthy to both of us.

And it's not just romantic contexts. Asking for a phone number carries this strange weight in general. If I approach a woman and ask directly, nearby guys instantly think: “Oh, he's trying to get with her right now.” That single thought loop — anticipating judgment, overthinking every word — often stops the question before it even leaves my mouth.

With ShareMyContact, the interaction changes completely. I walk up, say something like “Hey, want to quickly exchange contacts?” and then simply show the QR code. She scans it, done. To everyone watching, it just looks like I'm showing her something on my phone — nothing more, nothing special. The whole vibe stays light and low-pressure. Even the guys who get jealous fast are far less likely to read anything into it.

The same dynamic plays out at work. You want a colleague's number for professional reasons, but the “right moment” never arrives. You already know in advance it would take multiple steps: small talk → building rapport → finding a natural segue → actually asking → maybe explaining why → exchanging… easily five mental hurdles. When you keep replaying that sequence in your head, it's easy to become almost melancholic and conclude that the moment will simply never happen — unless you're completely alone with the person, away from any audience.

That invisible barrier has, at least for now, disappeared.

The project has only been live for two days, but it's already shifting how these small, everyday exchanges feel. Let's see where the journey goes from here.`,
author: "Olivier",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getLatestPosts(count: number = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}