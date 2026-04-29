import { sendGAEvent } from "@next/third-parties/google"

export const GA_ID = "G-FJ60QSS8VW"

export type EventParams = Record<
  string,
  string | number | boolean | undefined | null
>

// GA4 limits: event name 40 chars, param name 40 chars, param value 100 chars.
function clamp(value: unknown): string | number | boolean | undefined {
  if (value == null) return undefined
  if (typeof value === "string") return value.length > 100 ? value.slice(0, 100) : value
  if (typeof value === "number" || typeof value === "boolean") return value
  return String(value).slice(0, 100)
}

export function track(name: string, params: EventParams = {}): void {
  const cleaned: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(params)) {
    const c = clamp(v)
    if (c !== undefined) cleaned[k] = c
  }
  sendGAEvent("event", name.slice(0, 40), cleaned)
}

// Backwards-compatible wrapper used across existing components.
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
): void {
  track(action, {
    event_category: category,
    event_label: label,
    value,
  })
}

// ---------- Section / hover ----------

export const trackSectionView = (section: string) =>
  track("section_view", { section })

export const trackSectionExit = (section: string, dwell_ms: number) =>
  track("section_exit", { section, dwell_ms })

export const trackHover = (target: string, dwell_ms: number) =>
  track("hover_dwell", { target, dwell_ms })

// ---------- Form / field ----------

export const trackFormStart = (form: string, first_field: string) =>
  track("form_start", { form, first_field })

export const trackFieldFocus = (form: string, field: string) =>
  track("field_focus", { form, field })

export const trackFieldBlur = (params: {
  form: string
  field: string
  filled: boolean
  duration_ms: number
  char_count: number
  changed: boolean
}) => track("field_blur", params)

export const trackFieldComplete = (form: string, field: string, char_count: number) =>
  track("field_complete", { form, field, char_count })

export const trackFormSubmit = (params: {
  form: string
  filled_fields: string
  filled_count: number
  duration_ms: number
}) => track("form_submit", params)

export const trackFormError = (form: string, reason: string) =>
  track("form_error", { form, reason })

export const trackFormAbandon = (params: {
  form: string
  last_field: string
  duration_ms: number
  filled_count: number
  filled_fields: string
}) => track("form_abandon", params)

// ---------- Page-level engagement ----------

export const trackScrollDepth = (depth_pct: number) =>
  track("scroll_depth", { depth_pct })

export const trackEngagement = (params: {
  page: string
  active_ms: number
  idle_ms: number
  hidden_ms: number
  total_ms: number
  scroll_max_pct: number
  click_count: number
  rage_click_count: number
  pointer_move_count: number
  key_count: number
}) => track("page_engagement", params)

export const trackExitIntent = (page: string, total_ms: number) =>
  track("exit_intent", { page, total_ms })

export const trackRageClick = (target: string, count: number) =>
  track("rage_click", { target, count })

export const trackCtaClick = (cta: string, location: string) =>
  track("cta_click", { cta, location })
