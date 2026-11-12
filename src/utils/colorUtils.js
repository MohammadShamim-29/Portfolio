const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

export function normalizeHex(value, fallback = '#000000') {
  if (typeof value !== 'string') return fallback
  const match = value.trim().match(HEX_PATTERN)
  if (!match) return fallback
  const hex = match[1]
  if (hex.length === 3) {
    return `#${hex
      .split('')
      .map((character) => character + character)
      .join('')}`.toLowerCase()
  }
  return `#${hex}`.toLowerCase()
}

export function hexToRgb(value) {
  const hex = normalizeHex(value).slice(1)
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }) {
  const channel = (value) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

export function mixHex(a, b, amount = 0.5) {
  const first = hexToRgb(a)
  const second = hexToRgb(b)
  const t = Math.max(0, Math.min(1, amount))
  return rgbToHex({
    r: first.r + (second.r - first.r) * t,
    g: first.g + (second.g - first.g) * t,
    b: first.b + (second.b - first.b) * t,
  })
}

export function withAlpha(value, alpha) {
  const { r, g, b } = hexToRgb(value)
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`
}

export function rgbUnit(value) {
  const { r, g, b } = hexToRgb(value)
  return [r / 255, g / 255, b / 255]
}

export function relativeLuminance(value) {
  const { r, g, b } = hexToRgb(value)
  const convert = (channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * convert(r) + 0.7152 * convert(g) + 0.0722 * convert(b)
}

export function contrastRatio(foreground, background) {
  const light = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  )
  const dark = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  )
  return (light + 0.05) / (dark + 0.05)
}

export function ensureContrast(
  foreground,
  background = '#081214',
  minimum = 4.5,
) {
  if (contrastRatio(foreground, background) >= minimum) return foreground
  const target = relativeLuminance(background) > 0.4 ? '#000000' : '#ffffff'
  let candidate = foreground
  for (let step = 0; step <= 10; step += 1) {
    candidate = mixHex(foreground, target, step / 10)
    if (contrastRatio(candidate, background) >= minimum) return candidate
  }
  return candidate
}

export function hexToHsl(value) {
  const { r, g, b } = hexToRgb(value)
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let hue = 0
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6
    else if (max === green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue *= 60
    if (hue < 0) hue += 360
  }
  const lightness = (max + min) / 2
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  return { h: hue, s: saturation, l: lightness }
}
