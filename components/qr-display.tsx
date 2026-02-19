"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, RotateCcw } from "lucide-react"
import { trackEvent } from "@/lib/gtag"

interface QRDisplayProps {
  url: string
  name: string
  onReset: () => void
}

export function QRDisplay({ url, name, onReset }: QRDisplayProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    trackEvent("click", "qr_display", "copy_link")
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement("textarea")
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-lg border-border shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-foreground">
          {"Your card is ready!"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {"Share this QR code or link with "}{name}{"'s contact details."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <QRCodeSVG
            value={url}
            size={220}
            level="M"
            bgColor="transparent"
            fgColor="currentColor"
            className="text-foreground"
          />
        </div>

        <div className="w-full">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Shareable Link
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground">
              {url}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy link to clipboard"
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button variant="ghost" onClick={() => { trackEvent("click", "qr_display", "create_new_card"); onReset() }} className="gap-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          Create a new card
        </Button>
      </CardContent>
    </Card>
  )
}
