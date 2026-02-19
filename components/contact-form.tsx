"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QRDisplay } from "@/components/qr-display"
import { User, Phone, Mail, Building2, Globe, Linkedin, Trash2 } from "lucide-react"
import { trackEvent } from "@/lib/gtag"

const STORAGE_KEY = "sharemycontact_data"
const STORAGE_URL_KEY = "sharemycontact_url"

interface ContactData {
  name: string
  phone: string
  email: string
  company: string
  website: string
  linkedin: string
}

const initialData: ContactData = {
  name: "",
  phone: "",
  email: "",
  company: "",
  website: "",
  linkedin: "",
}

function loadSavedData(): { formData: ContactData; url: string | null } {
  if (typeof window === "undefined") return { formData: initialData, url: null }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedUrl = localStorage.getItem(STORAGE_URL_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<ContactData>
      return {
        formData: { ...initialData, ...parsed },
        url: savedUrl || null,
      }
    }
  } catch {
    // ignore corrupt data
  }
  return { formData: initialData, url: null }
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactData>(initialData)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Restore saved data on mount
  useEffect(() => {
    const { formData: saved, url } = loadSavedData()
    setFormData(saved)
    setGeneratedUrl(url)
    setHydrated(true)
  }, [])

  // Persist form data whenever it changes (after hydration)
  useEffect(() => {
    if (!hydrated) return
    const hasData = Object.values(formData).some((v) => v.trim() !== "")
    if (hasData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    }
  }, [formData, hydrated])

  // Persist generated URL whenever it changes (after hydration)
  useEffect(() => {
    if (!hydrated) return
    if (generatedUrl) {
      localStorage.setItem(STORAGE_URL_KEY, generatedUrl)
    } else {
      localStorage.removeItem(STORAGE_URL_KEY)
    }
  }, [generatedUrl, hydrated])

  function handleChange(field: keyof ContactData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError("Full name is required.")
      return
    }

    // Filter out empty fields
    const filtered = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v.trim() !== "")
    )

    const encoded = btoa(JSON.stringify(filtered))
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    setGeneratedUrl(`${origin}/c/${encoded}`)

    const filledFields = Object.keys(filtered).join(",")
    trackEvent("generate_card", "contact_form", filledFields, Object.keys(filtered).length)
  }

  function handleReset() {
    trackEvent("click", "contact_form", "reset_form")
    setFormData(initialData)
    setGeneratedUrl(null)
    setError(null)
  }

  function handleClearAll() {
    trackEvent("click", "contact_form", "clear_all_data")
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_URL_KEY)
    setFormData(initialData)
    setGeneratedUrl(null)
    setError(null)
  }

  if (generatedUrl) {
    return (
      <div className="flex flex-col items-center gap-4">
        <QRDisplay url={generatedUrl} name={formData.name} onReset={handleReset} />
        <Button
          variant="destructive"
          onClick={handleClearAll}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear my information
        </Button>
      </div>
    )
  }

  const fields: {
    key: keyof ContactData
    label: string
    type: string
    placeholder: string
    required?: boolean
    icon: React.ReactNode
  }[] = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Jane Doe",
      required: true,
      icon: <User className="h-4 w-4" />,
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+41 79 123 45 67",
      icon: <Phone className="h-4 w-4" />,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "jane@example.com",
      icon: <Mail className="h-4 w-4" />,
    },
    {
      key: "company",
      label: "Company",
      type: "text",
      placeholder: "Acme Inc.",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      key: "website",
      label: "Website",
      type: "url",
      placeholder: "https://example.com",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      type: "url",
      placeholder: "https://linkedin.com/in/janedoe",
      icon: <Linkedin className="h-4 w-4" />,
    },
  ]

  return (
    <Card className="mx-auto w-full max-w-lg border-border shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Create Your Card
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Fill in your details below. Only your name is required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-2">
              <Label htmlFor={field.key} className="flex items-center gap-2 text-foreground">
                <span className="text-muted-foreground">{field.icon}</span>
                {field.label}
                {field.required && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
              />
            </div>
          ))}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-2 w-full">
            Generate QR Code & Link
          </Button>

          {hydrated && Object.values(formData).some((v) => v.trim() !== "") && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearAll}
              className="w-full gap-2 text-muted-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Clear my information
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
