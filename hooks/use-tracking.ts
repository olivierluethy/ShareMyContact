"use client"

import { useEffect, useRef, type RefObject } from "react"
import {
  trackEngagement,
  trackExitIntent,
  trackHover,
  trackRageClick,
  trackScrollDepth,
  trackSectionExit,
  trackSectionView,
} from "@/lib/gtag"

// Tracks the first time a section enters the viewport, then measures dwell
// time across show/hide cycles and emits section_exit when it leaves.
export function useSectionView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  section: string,
  options: { threshold?: number; minDwellMs?: number } = {},
): void {
  const { threshold = 0.4, minDwellMs = 750 } = options
  const seenRef = useRef(false)
  const enteredAtRef = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!seenRef.current) {
              seenRef.current = true
              trackSectionView(section)
            }
            if (enteredAtRef.current == null) {
              enteredAtRef.current = performance.now()
            }
          } else if (enteredAtRef.current != null) {
            const dwell = Math.round(performance.now() - enteredAtRef.current)
            enteredAtRef.current = null
            if (dwell >= minDwellMs) trackSectionExit(section, dwell)
          }
        }
      },
      { threshold },
    )
    observer.observe(el)

    return () => {
      if (enteredAtRef.current != null) {
        const dwell = Math.round(performance.now() - enteredAtRef.current)
        if (dwell >= minDwellMs) trackSectionExit(section, dwell)
        enteredAtRef.current = null
      }
      observer.disconnect()
    }
  }, [ref, section, threshold, minDwellMs])
}

// Tracks intentional hover dwell — only emits when the cursor stayed long
// enough to be more than incidental movement.
export function useHoverTracking<T extends HTMLElement>(
  ref: RefObject<T | null>,
  target: string,
  minDwellMs = 600,
): void {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!Number.isFinite(minDwellMs)) return
    let enteredAt: number | null = null

    function handleEnter() {
      enteredAt = performance.now()
    }
    function handleLeave() {
      if (enteredAt == null) return
      const dwell = Math.round(performance.now() - enteredAt)
      enteredAt = null
      if (dwell >= minDwellMs) trackHover(target, dwell)
    }

    el.addEventListener("mouseenter", handleEnter)
    el.addEventListener("mouseleave", handleLeave)
    return () => {
      el.removeEventListener("mouseenter", handleEnter)
      el.removeEventListener("mouseleave", handleLeave)
    }
  }, [ref, target, minDwellMs])
}

// Emits scroll_depth at 25/50/75/100% milestones, once each per page load.
export function useScrollDepth(): void {
  useEffect(() => {
    const milestones = [25, 50, 75, 100] as const
    const fired = new Set<number>()
    let raf = 0

    function compute() {
      raf = 0
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
      for (const m of milestones) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m)
          trackScrollDepth(m)
        }
      }
    }
    function onScroll() {
      if (raf) return
      raf = requestAnimationFrame(compute)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    compute()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

function describeTarget(el: Element | null): string {
  if (!el) return "unknown"
  const id = el.id ? `#${el.id}` : ""
  const cls =
    typeof (el as HTMLElement).className === "string"
      ? `.${(el as HTMLElement).className.split(/\s+/).filter(Boolean).slice(0, 2).join(".")}`
      : ""
  return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 80)
}

// Page-level engagement: time buckets (active / idle / hidden), pointer moves,
// clicks, rage clicks, key presses, max scroll, and exit intent.
export function usePageEngagement(page: string): void {
  useEffect(() => {
    const start = performance.now()
    let lastActivity = start
    let lastTick = start
    let activeMs = 0
    let idleMs = 0
    let hiddenMs = 0
    let isVisible = document.visibilityState === "visible"
    let scrollMaxPct = 0
    let clickCount = 0
    let rageClickCount = 0
    let pointerMoveCount = 0
    let keyCount = 0
    let recentClicks: number[] = []
    let exitFired = false
    let flushed = false

    const IDLE_THRESHOLD = 30_000

    function tick() {
      const now = performance.now()
      const delta = now - lastTick
      lastTick = now
      if (!isVisible) hiddenMs += delta
      else if (now - lastActivity > IDLE_THRESHOLD) idleMs += delta
      else activeMs += delta
    }

    const interval = window.setInterval(tick, 1000)

    function markActivity() {
      lastActivity = performance.now()
    }

    function onVisibilityChange() {
      tick()
      isVisible = document.visibilityState === "visible"
      if (isVisible) markActivity()
    }

    function onClick(e: MouseEvent) {
      clickCount++
      markActivity()
      const now = performance.now()
      recentClicks.push(now)
      recentClicks = recentClicks.filter((t) => now - t < 1000)
      if (recentClicks.length >= 4) {
        rageClickCount++
        trackRageClick(describeTarget(e.target as Element | null), recentClicks.length)
        recentClicks = []
      }
    }

    let pointerThrottle = 0
    function onPointerMove() {
      const now = performance.now()
      if (now - pointerThrottle < 250) return
      pointerThrottle = now
      pointerMoveCount++
      markActivity()
    }

    function onScroll() {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.min(100, (window.scrollY / scrollable) * 100)
      if (pct > scrollMaxPct) scrollMaxPct = pct
      markActivity()
    }

    function onKey() {
      keyCount++
      markActivity()
    }

    function onMouseOut(e: MouseEvent) {
      if (exitFired) return
      if (e.relatedTarget == null && (e.clientY ?? 999) <= 0) {
        exitFired = true
        trackExitIntent(page, Math.round(performance.now() - start))
      }
    }

    function flush() {
      if (flushed) return
      flushed = true
      tick()
      trackEngagement({
        page,
        active_ms: Math.round(activeMs),
        idle_ms: Math.round(idleMs),
        hidden_ms: Math.round(hiddenMs),
        total_ms: Math.round(performance.now() - start),
        scroll_max_pct: Math.round(scrollMaxPct),
        click_count: clickCount,
        rage_click_count: rageClickCount,
        pointer_move_count: pointerMoveCount,
        key_count: keyCount,
      })
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    document.addEventListener("click", onClick)
    document.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("keydown", onKey)
    document.addEventListener("mouseout", onMouseOut)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pagehide", flush)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      document.removeEventListener("click", onClick)
      document.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mouseout", onMouseOut)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pagehide", flush)
      flush()
    }
  }, [page])
}
