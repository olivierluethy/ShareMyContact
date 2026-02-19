import { sendGAEvent } from "@next/third-parties/google"

export const GA_ID = "G-FJ60QSS8VW"

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  sendGAEvent("event", action, {
    event_category: category,
    event_label: label,
    value,
  })
}
