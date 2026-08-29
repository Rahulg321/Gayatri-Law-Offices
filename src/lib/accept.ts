/** RFC 9110 §12.5.1 Accept negotiation (acceptmarkdown.com / Cloudflare recipe). */

export type AcceptEntry = { type: string; q: number; specificity: number }

export function parseAccept(header: string): AcceptEntry[] {
  return header
    .split(',')
    .map((raw) => {
      const parts = raw.trim().split(';').map((s) => s.trim())
      const type = parts[0]?.toLowerCase()
      if (!type) return null
      let q = 1
      for (const param of parts.slice(1)) {
        const [name, value] = param.split('=').map((s) => s.trim())
        if (name === 'q') {
          const parsed = Number(value)
          if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed))
        }
      }
      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2
      return { type, q, specificity }
    })
    .filter((e): e is AcceptEntry => e !== null)
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === '*/*') return true
  if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1))
  return entry.type === candidate
}

/** Highest-q matching produced type, or null when every candidate is rejected (q=0) or unmatched. */
export function preferredType(header: string | null, produces: string[]): string | null {
  if (!header) return produces[0] ?? null
  const entries = parseAccept(header)
  if (entries.length === 0) return produces[0] ?? null

  let bestType: string | null = null
  let bestQ = -1
  let bestPosition = Infinity

  for (const candidate of produces) {
    let matched: AcceptEntry | null = null
    let matchedPosition = Infinity
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx]
      if (!e || !matches(e, candidate)) continue
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e
        matchedPosition = idx
      }
    }
    if (matched === null) continue
    if (matched.q <= 0) continue
    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q
      bestPosition = matchedPosition
      bestType = candidate
    }
  }

  return bestType
}

export function appendVary(headers: Headers, tokens: string[]): void {
  const existing = headers.get('Vary')
  const merged = new Set(
    (existing ? existing.split(',') : [])
      .map((s) => s.trim())
      .filter(Boolean),
  )
  for (const token of tokens) {
    const already = [...merged].some((m) => m.toLowerCase() === token.toLowerCase())
    if (!already) merged.add(token)
  }
  headers.set('Vary', [...merged].join(', '))
}

export const NEGOTIATION_VARY = ['Accept', 'Accept-Encoding'] as const

export function acceptExplicitlyPrefersJson(header: string | null): boolean {
  if (!header) return false
  const entries = parseAccept(header)
  const explicitJson = entries.some(
    (e) =>
      e.q > 0 &&
      (e.type === 'application/json' ||
        e.type === 'application/problem+json' ||
        e.type === 'application/*'),
  )
  if (!explicitJson) return false
  const chosen = preferredType(header, [
    'application/problem+json',
    'application/json',
    'text/html',
  ])
  return chosen === 'application/problem+json' || chosen === 'application/json'
}
