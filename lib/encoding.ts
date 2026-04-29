// UTF-8 safe base64url encoding for contact card payloads.
//
// Why this exists:
//   - btoa()/atob() throw on multi-byte characters ("Zoë", emojis, …).
//   - Standard base64 contains "+", "/", "=" — none URL-safe in a path segment.
//   - We need a deterministic, reversible round-trip from arbitrary JSON to a
//     URL-safe string and back, with explicit failure modes (no silent throws).
//
// Format: base64url(utf8(JSON.stringify(payload))) — RFC 4648 §5.

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ""
  // chunked to avoid call-stack issues for large payloads
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, Math.min(i + chunk, bytes.length))
    )
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function encodePayload(payload: unknown): string {
  const json = JSON.stringify(payload)
  const bytes = new TextEncoder().encode(json)
  return bytesToBase64Url(bytes)
}

export function decodePayload<T = unknown>(encoded: string): T {
  // Try base64url first; fall back to legacy base64 (for QR codes generated
  // before this change shipped).
  let bytes: Uint8Array
  try {
    bytes = base64UrlToBytes(encoded)
  } catch {
    bytes = base64UrlToBytes(
      encoded.replace(/-/g, "+").replace(/_/g, "/")
    )
  }
  const json = new TextDecoder("utf-8", { fatal: false }).decode(bytes)
  return JSON.parse(json) as T
}
