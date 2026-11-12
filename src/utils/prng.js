export function hashString(value) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function mulberry32(seed) {
  let state = seed >>> 0
  return function random() {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function createSeededRandom(seedInput) {
  const seed =
    typeof seedInput === 'number' ? seedInput : hashString(String(seedInput))
  return mulberry32(seed)
}

export function pickWeighted(random, entries) {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0)
  if (total <= 0) return entries[0]?.value
  let cursor = random() * total
  for (const entry of entries) {
    cursor -= entry.weight
    if (cursor <= 0) return entry.value
  }
  return entries[entries.length - 1]?.value
}
