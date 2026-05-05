"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User,
  Phone,
  Mail,
  Building2,
  Globe,
  Linkedin,
  Download,
  Share2,
} from "lucide-react"
import { trackEvent } from "@/lib/gtag"
import { decodePayload } from "@/lib/encoding"
import { buildVCard, vCardFilename } from "@/lib/vcard"

interface ContactData {
  name?: string
  phone?: string
  email?: string
  company?: string
  website?: string
  linkedin?: string
}

export function ContactCardView() {
  const params = useParams()
  const [shareStatus, setShareStatus] = useState<string | null>(null)

  const data = useMemo<ContactData | null>(() => {
    const raw = params.data
    if (typeof raw !== "string" || raw.length === 0) return null
    try {
      return decodePayload<ContactData>(raw)
    } catch {
      trackEvent("error", "contact_card", "decode_failed")
      return null
    }
  }, [params.data])

  if (!data || !data.name) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 sm:px-6">
        <Card className="max-w-md text-center">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-foreground">Invalid Contact Card</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <p className="text-muted-foreground text-sm">
              This link does not contain valid contact information. Please check the URL and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  function generateVCard() {
    if (!data?.name) return
    trackEvent("click", "contact_card", "save_contact_vcard", 1)

    try {
      const vcard = buildVCard({
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company,
        website: data.website,
        linkedin: data.linkedin,
      })

      const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = vCardFilename(data.name)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // Defer revoke so Safari/iOS can finish the download.
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      trackEvent("error", "contact_card", "vcard_generation_failed")
      setShareStatus("Could not save contact")
      setTimeout(() => setShareStatus(null), 2000)
    }
  }

  async function handleShare() {
    if (!data) return
    trackEvent("click", "contact_card", "share_contact")
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${data.name}'s Contact`,
          url: window.location.href,
        })
        trackEvent("share", "contact_card", "native_share_completed")
      } catch {
        trackEvent("share", "contact_card", "native_share_cancelled")
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        trackEvent("share", "contact_card", "link_copied_fallback")
        setShareStatus("Link copied!")
      } catch {
        setShareStatus("Could not copy link")
      }
      setTimeout(() => setShareStatus(null), 2000)
    }
  }

  const fields = [
    { icon: <Phone className="h-4 w-4" />, label: "Phone", value: data.phone, href: data.phone ? `tel:${data.phone}` : undefined },
    { icon: <Mail className="h-4 w-4" />, label: "Email", value: data.email, href: data.email ? `mailto:${data.email}` : undefined },
    { icon: <Building2 className="h-4 w-4" />, label: "Company", value: data.company },
    { icon: <Globe className="h-4 w-4" />, label: "Website", value: data.website, href: data.website },
    { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn", value: data.linkedin, href: data.linkedin },
  ].filter((f) => f.value)

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="items-center text-center px-4 sm:px-6">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
            <User className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
          </div>
          <CardTitle className="text-xl text-foreground sm:text-2xl break-words">{data.name}</CardTitle>
          {data.company && (
            <p className="text-sm text-muted-foreground break-words">{data.company}</p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-4 sm:gap-4 sm:px-6">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-3 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                {field.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{field.label}</p>
                {field.href ? (
                  <a
                    href={field.href}
                    target={field.label === "Phone" || field.label === "Email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("click", "contact_card", `field_${field.label.toLowerCase()}`)}
                    className="block truncate text-sm font-medium text-primary hover:underline"
                  >
                    {field.value}
                  </a>
                ) : (
                  <p className="truncate text-sm font-medium text-foreground">
                    {field.value}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button onClick={generateVCard} className="flex-1 gap-2 h-11">
              <Download className="h-4 w-4" />
              Save Contact
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2 h-11 sm:flex-initial">
              <Share2 className="h-4 w-4" />
              {shareStatus ?? "Share"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
