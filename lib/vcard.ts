// Minimal vCard 3.0 generator compatible with iOS Contacts and Android Contacts.
//
// Compliance notes:
//   - Lines terminate with CRLF per RFC 6350 §3.2 (vCard 4.0) and RFC 2426 (3.0).
//   - Special characters in property values are escaped: backslash, comma,
//     semicolon, and embedded newlines.
//   - Both FN (formatted name) and N (structured name) are emitted; iOS and
//     Android need N to populate the structured name fields correctly.

export interface VCardInput {
  name: string
  phone?: string
  email?: string
  company?: string
  website?: string
  linkedin?: string
}

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
}

export function buildVCard(input: VCardInput): string {
  const fullName = input.name.trim()
  const parts = fullName.split(/\s+/)
  const givenName = parts[0] ?? ""
  const familyName = parts.length > 1 ? parts.slice(1).join(" ") : ""

  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"]
  lines.push(`FN:${escapeVCard(fullName)}`)
  // N: Family;Given;Additional;Prefix;Suffix
  lines.push(`N:${escapeVCard(familyName)};${escapeVCard(givenName)};;;`)

  if (input.phone)   lines.push(`TEL;TYPE=CELL:${escapeVCard(input.phone)}`)
  if (input.email)   lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(input.email)}`)
  if (input.company) lines.push(`ORG:${escapeVCard(input.company)}`)
  if (input.website) lines.push(`URL:${escapeVCard(input.website)}`)
  if (input.linkedin) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${escapeVCard(input.linkedin)}`)
    // Apple ignores X-SOCIALPROFILE in many versions; emit URL as a fallback.
    lines.push(`URL;TYPE=LinkedIn:${escapeVCard(input.linkedin)}`)
  }

  lines.push("END:VCARD")
  return lines.join("\r\n") + "\r\n"
}

export function vCardFilename(name: string): string {
  const safe = name.trim().replace(/[^a-zA-Z0-9_\-]+/g, "_") || "contact"
  return `${safe}.vcf`
}
