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
import { Check, Copy, RotateCcw, Pencil } from "lucide-react"
import { trackEvent } from "@/lib/gtag"

interface QRDisplayProps {
  url: string
  name: string
  onReset: () => void
  onEdit: () => void
}

export function QRDisplay({ url, name, onReset, onEdit }: QRDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [showEnlarged, setShowEnlarged] = useState(false)   // ← moved here

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
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Your card is ready!
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-1.5">
          Share this QR code or link with {name}'s contact details
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-8">
        {/* QR Code – clickable to enlarge */}
        <button
          type="button"
          onClick={() => setShowEnlarged(true)}
          className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.98]"
          aria-label="Tap to enlarge QR code for easier scanning"
        >
          <QRCodeSVG
            value={url}
            size={typeof window !== 'undefined' && window.innerWidth < 640 ? 260 : 220}
            level="M"
            bgColor="transparent"
            fgColor="currentColor"
            className="text-foreground transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              Tap to enlarge
            </span>
          </div>
        </button>

        <p className="text-xs text-muted-foreground text-center -mt-4 sm:hidden">
          Tap the QR code to make it larger for easier scanning
        </p>

        {/* Shareable Link */}
        <div className="w-full space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Shareable Link
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-md border border-border bg-muted px-3 py-2.5 font-mono text-xs text-foreground">
              {url}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy link to clipboard"
              className="shrink-0 h-10 w-10"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            variant="outline"
            onClick={() => {
              trackEvent("click", "qr_display", "edit_information")
              onEdit()
            }}
            className="gap-2 h-11"
          >
            <Pencil className="h-4 w-4" />
            Edit Information
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              trackEvent("click", "qr_display", "create_new_card")
              onReset()
            }}
            className="gap-2 text-muted-foreground h-11"
          >
            <RotateCcw className="h-4 w-4" />
            Create a new card
          </Button>
        </div>
      </CardContent>

      {/* Enlarged Modal */}
      {showEnlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setShowEnlarged(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute -right-3 -top-3 rounded-full bg-background p-2 text-foreground shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={() => setShowEnlarged(false)}
              aria-label="Close enlarged view"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <QRCodeSVG
              value={url}
              size={320}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
              className="mx-auto rounded-xl shadow-inner"
            />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Scan with your camera
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}