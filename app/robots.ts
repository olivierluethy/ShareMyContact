import type { MetadataRoute } from "next"

const SITE_URL = "https://v0-next-js-contact-sharing.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/c/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
