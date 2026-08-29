/** Minimal YAML 1.2 dump for JSON-serializable OpenAPI documents. */
export function toYaml(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (value === null) return 'null'
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  if (typeof value === 'string') return yamlString(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return value
      .map((item) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          const inner = toYaml(item, indent + 1)
          return `${pad}- ${inner.replace(/^\s+/, '')}`
        }
        return `${pad}- ${toYaml(item, 0)}`
      })
      .join('\n')
  }
  if (isPlainObject(value)) {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    return entries
      .map(([k, v]) => {
        const key = yamlKey(k)
        if (v === undefined) return null
        if (isPlainObject(v) || Array.isArray(v)) {
          const inner = toYaml(v, indent + 1)
          if (inner === '{}' || inner === '[]') return `${pad}${key}: ${inner}`
          return `${pad}${key}:\n${inner}`
        }
        return `${pad}${key}: ${toYaml(v, 0)}`
      })
      .filter((line): line is string => line !== null)
      .join('\n')
  }
  return yamlString(String(value))
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function yamlKey(key: string): string {
  return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(key) ? key : yamlString(key)
}

function yamlString(value: string): string {
  if (value === '') return '""'
  if (/[:#\n]/.test(value) || /^(true|false|null|yes|no)$/i.test(value)) {
    return JSON.stringify(value)
  }
  return value
}
