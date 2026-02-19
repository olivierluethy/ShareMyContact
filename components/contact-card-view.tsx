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
    try {
      const raw = atob(params.data as string)
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [params.data])

  if (!data || !data.name) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-foreground">Invalid Contact Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This link does not contain valid contact information. Please check the URL and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  function generateVCard() {
    if (!data) return
    trackEvent("click", "contact_card", "save_contact_vcard", 1)
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${data.name}`,
      data.phone ? `TEL:${data.phone}` : "",
      data.email ? `EMAIL:${data.email}` : "",
      data.company ? `ORG:${data.company}` : "",
      data.website ? `URL:${data.website}` : "",
      data.linkedin ? `URL:${data.linkedin}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n")

    const blob = new Blob([lines], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.name?.replace(/\s+/g, "_")}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleShare() {
    if (!data) return
    trackEvent("click", "contact_card", "share_contact")
    if (navigator.share) {
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
      await navigator.clipboard.writeText(window.location.href)
      trackEvent("share", "contact_card", "link_copied_fallback")
      setShareStatus("Link copied!")
      setTimeout(() => setShareStatus(null), 2000)
    }
  }

  const fields = [
    { icon: <Phone className="h-4 w-4" />, label: "Phone", value: data.phone, href: `tel:${data.phone}` },
    { icon: <Mail className="h-4 w-4" />, label: "Email", value: data.email, href: `mailto:${data.email}` },
    { icon: <Building2 className="h-4 w-4" />, label: "Company", value: data.company },
    { icon: <Globe className="h-4 w-4" />, label: "Website", value: data.website, href: data.website },
    { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn", value: data.linkedin, href: data.linkedin },
  ].filter((f) => f.value)

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">{data.name}</CardTitle>
          {data.company && (
            <p className="text-sm text-muted-foreground">{data.company}</p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-3">
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
                    className="truncate text-sm font-medium text-primary hover:underline"
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

          <div className="mt-4 flex gap-3">
            <Button onClick={generateVCard} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Save Contact
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              {shareStatus ?? "Share"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
