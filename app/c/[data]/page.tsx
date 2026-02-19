import type { Metadata } from "next"
import { ContactCardView } from "@/components/contact-card-view"

export const metadata: Metadata = {
  title: "Contact Card",
  description:
    "View and save contact information shared via ShareMyContact — privacy-first, zero-knowledge digital contact sharing.",
}

export default function ContactPage() {
  return <ContactCardView />
}
