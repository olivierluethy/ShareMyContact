// Privacy-respecting tracking client for ShareMyContact.
//
// HARD RULES:
//   - This module never sends form values. It sends booleans
//     (`has_phone`, `has_email`, …) and anonymous metadata only.
//   - All calls are fire-and-forget; failures are swallowed so they
//     can never block the user-facing flow.
//   - No third-party SDK is involved. Requests go directly to our PHP API.

const SESSION_KEY = "smc_session_id"
const FORM_STARTED_KEY = "smc_form_started_logged"

const API_BASE =
  process.env.NEXT_PUBLIC_SMC_API_BASE ||
  "https://api.sharemycontact.com"

export type FormEventType =
  | "form_started"
  | "form_submitted"
  | "qr_generated"
  | "link_copied"
  | "link_shared"

export type BespokeTriggerSource =
  | "contact_us_need_more"
  | "contact_us_footer"
  | "contact_page_form"

export interface FieldFlags {
  has_phone?: boolean
  has_email?: boolean
  has_company?: boolean
  has_website?: boolean
  has_linkedin?: boolean
}

function uuidv4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  // RFC 4122 v4 fallback for older browsers.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getSessionId(): string {
  if (typeof window === "undefined") return ""
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = uuidv4()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    // sessionStorage disabled — return a throwaway id so the call still works.
    return uuidv4()
  }
}

function deviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop"
  const w = window.innerWidth
  if (w < 768) return "mobile"
  if (w <= 1024) return "tablet"
  return "desktop"
}

function readUtm(): {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
} {
  if (typeof window === "undefined") return {}
  try {
    const params = new URLSearchParams(window.location.search)
    const out: Record<string, string> = {}
    for (const k of ["utm_source", "utm_medium", "utm_campaign"] as const) {
      const v = params.get(k)
      if (v) out[k] = v.slice(0, 100)
    }
    return out
  } catch {
    return {}
  }
}

function referrer(): string | undefined {
  if (typeof document === "undefined") return undefined
  return document.referrer ? document.referrer.slice(0, 1000) : undefined
}

async function fireAndForget(path: string, body: object): Promise<Response | null> {
  try {
    return await fetch(`${API_BASE}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: "omit",
    })
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[smc-tracking]", path, "failed:", err)
    }
    return null
  }
}

// ---------- Main form funnel (anonymous) ----------

export function trackFormStartedOnce(): void {
  if (typeof window === "undefined") return
  try {
    if (sessionStorage.getItem(FORM_STARTED_KEY)) return
    sessionStorage.setItem(FORM_STARTED_KEY, "1")
  } catch {
    // ignore — at worst we double-fire, still no PII
  }
  void trackFormEvent("form_started")
}

export function trackFormEvent(
  event_type: FormEventType,
  field_flags?: FieldFlags,
): Promise<Response | null> {
  // Defense in depth — coerce values to strict booleans so a caller can't
  // accidentally pass strings or smuggle anything else through.
  const safeFlags: Record<string, boolean> = {}
  if (field_flags) {
    for (const k of [
      "has_phone",
      "has_email",
      "has_company",
      "has_website",
      "has_linkedin",
    ] as const) {
      if (k in field_flags && field_flags[k] !== undefined) {
        safeFlags[k] = field_flags[k] === true
      }
    }
  }

  return fireAndForget("track-form-event.php", {
    session_id: getSessionId(),
    event_type,
    field_flags: Object.keys(safeFlags).length ? safeFlags : undefined,
    device_type: deviceType(),
    referrer: referrer(),
    ...readUtm(),
  })
}

// ---------- Bespoke ("Need more?") funnel ----------

export async function trackBespokeClick(
  trigger_source: BespokeTriggerSource,
): Promise<number | null> {
  const res = await fireAndForget("track-bespoke-click.php", {
    session_id: getSessionId(),
    trigger_source,
    referrer: referrer(),
    ...readUtm(),
  })
  if (!res || !res.ok) return null
  try {
    const json = (await res.json()) as { success?: boolean; lead_id?: number }
    return json.success && typeof json.lead_id === "number" ? json.lead_id : null
  } catch {
    return null
  }
}

export async function submitBespokeEmail(params: {
  lead_id: number
  email: string
  message?: string
  /** Honeypot — leave empty. Real users never see this field. */
  honeypot?: string
}): Promise<{ success: boolean; error?: string }> {
  const res = await fireAndForget("submit-bespoke-email.php", {
    session_id: getSessionId(),
    lead_id: params.lead_id,
    email: params.email,
    message: params.message,
    website_url: params.honeypot ?? "",
  })
  if (!res) return { success: false, error: "network" }
  try {
    const json = (await res.json()) as { success?: boolean; error?: string }
    return { success: !!json.success, error: json.error }
  } catch {
    return { success: false, error: "invalid_response" }
  }
}
