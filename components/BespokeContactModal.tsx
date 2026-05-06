"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, X } from "lucide-react"
import Link from "next/link"
import { submitBespokeEmail } from "@/lib/smc-tracking"

interface BespokeContactModalProps {
  open: boolean
  /** lead_id returned by track-bespoke-click. null while we're still waiting
   *  for the click endpoint, or if it failed — submit is disabled in both cases. */
  leadId: number | null
  onClose: () => void
}

type Status = "idle" | "loading" | "success" | "error"

export function BespokeContactModal({ open, leadId, onClose }: BespokeContactModalProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const dialogRef = useRef<HTMLDivElement>(null)

  // Reset whenever the modal is closed so a re-open starts clean.
  useEffect(() => {
    if (!open) {
      setStatus("idle")
      setErrorMessage("")
      setEmail("")
      setMessage("")
      setHoneypot("")
    }
  }, [open])

  // ESC to close.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "loading") return

    if (leadId == null) {
      setStatus("error")
      setErrorMessage("We couldn't reach our server. Please try again or use the full contact page.")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    const result = await submitBespokeEmail({
      lead_id: leadId,
      email: email.trim(),
      message: message.trim() || undefined,
      honeypot,
    })

    if (result.success) {
      setStatus("success")
    } else {
      setStatus("error")
      setErrorMessage(
        result.error === "invalid_email"
          ? "That email address doesn't look right."
          : "Something went wrong. Please try again."
      )
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bespoke-modal-title"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full bg-[#1a1c2e] text-white rounded-t-2xl sm:rounded-2xl border border-indigo-500/20 shadow-2xl p-5 sm:p-7 max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-6 sm:py-8">
            <h2
              id="bespoke-modal-title"
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3"
            >
              Thanks — we'll be in touch within 48h.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              We received your request. No further action needed on your side.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 px-5 py-2 rounded-full border border-gray-700 text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2
              id="bespoke-modal-title"
              className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2"
            >
              Let's talk.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-5">
              Tell us what you're building. We do bespoke contact-sharing solutions
              for teams, events, and brands.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div
                  className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                  role="alert"
                >
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="bespoke-email" className="text-sm font-medium text-gray-300">
                  Email <span className="text-pink-400">*</span>
                </label>
                <input
                  id="bespoke-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="bespoke-message" className="text-sm font-medium text-gray-300">
                  What do you need? <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="bespoke-message"
                  rows={3}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="A few words about your use case…"
                  className="w-full bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                />
              </div>

              {/* Honeypot — hidden from real users; bots fill it and get rejected. */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-900/30"
              >
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We'll only use your email to reply about your request.
              </p>

              <Link
                href="/contact"
                onClick={onClose}
                className="block text-center text-sm text-indigo-300 hover:text-indigo-200 underline-offset-2 hover:underline transition-colors"
              >
                Or visit our full contact page →
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
