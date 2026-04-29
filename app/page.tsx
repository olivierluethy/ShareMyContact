import { Hero } from "@/components/hero"
import { ContactForm } from "@/components/contact-form"
import { BespokeServices } from "@/components/BespokeServices"
import { TrustBadges } from "@/components/TrustBadges"
import { LandingTracker } from "@/components/landing-tracker"
import { TrackedSection } from "@/components/tracked-section"

export default function Home() {
  return (
    <>
      <LandingTracker />
      <TrackedSection name="hero">
        <Hero />
      </TrackedSection>
      <TrackedSection name="contact_form" threshold={0.25}>
        <section id="create" className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
          <ContactForm />
        </section>
      </TrackedSection>
      <div className="border-t border-border">
        <TrackedSection name="trust_badges" trackHover>
          <TrustBadges />
        </TrackedSection>
        <TrackedSection name="bespoke_services" trackHover>
          <BespokeServices />
        </TrackedSection>
      </div>
    </>
  )
}
