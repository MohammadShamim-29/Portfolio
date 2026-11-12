export const PERFORMANCE_TIERS = ['full', 'medium', 'low']

export const PARTICLE_BUDGETS = {
  full: { rain: 150, fireflies: 26, dust: 34, fog: 10, birds: 22, ripples: 8 },
  medium: { rain: 60, fireflies: 12, dust: 14, fog: 5, birds: 10, ripples: 4 },
  low: { rain: 0, fireflies: 0, dust: 0, fog: 0, birds: 0, ripples: 0 },
}

const STORAGE_KEY = 'bd24.performance-tier'

export function detectWebGL() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

export function getPreferredReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function detectPerformanceTier(overrides = {}) {
  const reducedMotion =
    overrides.reducedMotion ?? getPreferredReducedMotion()
  if (reducedMotion) return 'low'

  const navigatorInfo =
    typeof navigator !== 'undefined' ? navigator : {}
  const cores =
    overrides.hardwareConcurrency ?? navigatorInfo.hardwareConcurrency ?? 4
  const memory = overrides.deviceMemory ?? navigatorInfo.deviceMemory ?? 4
  const saveData = overrides.saveData ?? navigatorInfo.connection?.saveData
  const webgl = overrides.webgl ?? detectWebGL()

  if (saveData || cores <= 2 || memory <= 2) return 'low'
  if (!webgl || cores <= 4 || memory <= 4) return 'medium'
  return 'full'
}

export function isJourneyTier(tier) {
  return tier !== 'low'
}

export function isWebGLTier(tier) {
  return tier === 'full'
}

export function getStoredTier() {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return PERFORMANCE_TIERS.includes(value) ? value : null
  } catch {
    return null
  }
}

export function setStoredTier(tier) {
  if (typeof window === 'undefined') return
  try {
    if (tier) window.localStorage.setItem(STORAGE_KEY, tier)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be unavailable in private browsing; the UI still works.
  }
}

export function createFrameMonitor({
  threshold = 27,
  sampleWindow = 120,
  cooldown = 400,
  onSlow,
} = {}) {
  let samples = 0
  let total = 0
  let cooldownFrames = 0
  let reported = false

  return (delta) => {
    if (reported) return
    if (cooldownFrames > 0) {
      cooldownFrames -= 1
      return
    }
    samples += 1
    total += delta
    if (samples < sampleWindow) return
    const average = total / samples
    samples = 0
    total = 0
    if (average > threshold) {
      reported = true
      cooldownFrames = cooldown
      onSlow?.(average)
    }
  }
}

export function scaleParticleBudget(budget, factor) {
  return Math.max(0, Math.round(budget * factor))
}
