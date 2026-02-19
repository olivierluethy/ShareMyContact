import { Hero } from "@/components/hero"
import { ContactForm } from "@/components/contact-form"
import { BlogTeaser } from "@/components/blog-teaser"
import { BespokeServices } from '@/components/BespokeServices'
import { TrustBadges } from "@/components/TrustBadges"

export default function Home() {
  return (
    <>
      <Hero />
      <section id="create" className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
        <ContactForm />
      </section>
      <div className="border-t border-border">
          <TrustBadges />
        <BespokeServices />
      </div>
    </>
  )
}
