"use client"

import { useEffect, useState } from "react"
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
import { trackFormEvent } from "@/lib/smc-tracking"

interface QRDisplayProps {
  url: string
  name: string
  onReset: () => void
  onEdit: () => void
}

export function QRDisplay({ url, name, onReset, onEdit }: QRDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [showEnlarged, setShowEnlarged] = useState(false)
  const [qrSize, setQrSize] = useState(220)

  // qr_generated fires once per render of a successfully-displayed QR.
  // The form-submit event already fired in contact-form; this lets us
  // measure the gap (= JS errors / abandons between submit and display).
  useEffect(() => {
    void trackFormEvent("qr_generated")
    // We intentionally do not depend on `url` — re-renders shouldn't re-fire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pick a QR size that always fits the screen — never overflow on small phones.
  useEffect(() => {
    function updateSize() {
      const w = window.innerWidth
      // Account for outer page px-4 (32) + card px-4/6 (32-48) + button p-4 (32).
      // Cap to keep a comfortable scan size on tablets/desktop.
      const available = Math.min(w - 96, 280)
      setQrSize(Math.max(180, available))
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      void trackFormEvent("link_copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      void trackFormEvent("link_copied")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-lg border-border shadow-lg">
      <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
        <CardTitle className="text-xl font-semibold text-foreground sm:text-2xl">
          Your card is ready!
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-1.5 text-sm">
          Share this QR code or link with {name}'s contact details
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 px-4 sm:gap-8 sm:px-6">
        {/* QR Code – clickable to enlarge */}
        <button
          type="button"
          onClick={() => setShowEnlarged(true)}
          className="group relative rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.98] sm:p-6"
          aria-label="Tap to enlarge QR code for easier scanning"
        >
          <QRCodeSVG
            value={url}
            size={qrSize}
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

        <p className="text-xs text-muted-foreground text-center -mt-2 sm:-mt-4 sm:hidden">
          Tap the QR code to make it larger for easier scanning
        </p>

        {/* Shareable Link */}
        <div className="w-full space-y-2 min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            Shareable Link
          </p>
          <div className="flex items-center gap-2 min-w-0">
            <code className="flex-1 min-w-0 truncate rounded-md border border-border bg-muted px-3 py-2.5 font-mono text-[11px] text-foreground sm:text-xs">
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
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            variant="outline"
            onClick={onEdit}
            className="gap-2 h-11 w-full sm:w-auto"
          >
            <Pencil className="h-4 w-4" />
            Edit Information
          </Button>

          <Button
            variant="ghost"
            onClick={onReset}
            className="gap-2 text-muted-foreground h-11 w-full sm:w-auto"
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
            className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
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
              className="mx-auto h-auto w-full max-w-[320px] rounded-xl shadow-inner"
            />

            <p className="mt-4 text-center text-sm text-gray-500 sm:mt-6">
              Scan with your camera
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
