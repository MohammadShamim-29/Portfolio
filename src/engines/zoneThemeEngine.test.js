import { describe, expect, it } from 'vitest'
import { getZoneTheme, resolveZoneTheme } from './zoneThemeEngine.js'

const paletteKeys = [
  'skyTop',
  'skyBottom',
  'horizon',
  'water',
  'waterDeep',
  'haze',
  'ambient',
  'cloud',
  'grass',
  'paddy',
  'leaf',
]

function makeTheme() {
  return {
    palette: Object.fromEntries(paletteKeys.map((key) => [key, '#101010'])),
    cssVars: { '--sky-top': '#101010' },
  }
}

describe('zoneThemeEngine', () => {
  it('mixes the active zone into the atmosphere and vegetation palette', () => {
    const theme = makeTheme()
    const village = resolveZoneTheme(theme, 'about')

    expect(village.zone).toBe('about')
    expect(village.palette.skyTop).not.toBe('#101010')
    expect(village.palette.grass).not.toBe('#101010')
    expect(village.cssVars['--sky-top']).toBe(village.palette.skyTop)
    expect(village.cssVars['--zone-tint']).toBe(getZoneTheme('about').tint)
    expect(village.cssVars['--zone-tint-opacity']).toBe('0.2')
  })

  it('falls back to the river zone for an unknown section', () => {
    const theme = makeTheme()
    const fallback = resolveZoneTheme(theme, 'missing')

    expect(fallback.zone).toBe('hero')
    expect(fallback.cssVars['--zone-tint']).toBe(getZoneTheme('hero').tint)
  })
})
