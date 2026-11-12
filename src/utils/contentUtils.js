export function isPlaceholder(value) {
  return typeof value === 'string' && /TODO/i.test(value)
}

export function isEmail(value) {
  return (
    typeof value === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  )
}

export function isHttpUrl(value) {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function getSafeHref(value, { email = false } = {}) {
  if (!value || isPlaceholder(value)) return null
  if (email && isEmail(value)) return `mailto:${value.trim()}`
  if (isHttpUrl(value)) return value.trim()
  if (typeof value === 'string' && value.startsWith('/')) return value
  return null
}

export function getLinkEntries(links = {}) {
  return Object.entries(links).filter(([, value]) => Boolean(value))
}
