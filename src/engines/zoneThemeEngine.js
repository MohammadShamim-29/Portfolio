import { mixHex } from '../utils/colorUtils.js'

const ZONE_THEMES = {
  hero: {
    weight: 0.3,
    tint: '#0b5a6a',
    tintOpacity: 0.18,
    palette: {
      skyTop: '#0b2f45',
      skyBottom: '#2b7080',
      horizon: '#d6a56b',
      water: '#0a3440',
      waterDeep: '#051c25',
      haze: '#a8c8c4',
      ambient: '#0b2b32',
      cloud: '#8fb0b5',
      grass: '#2f6b4a',
      paddy: '#6f8f3f',
      leaf: '#2f6b4a',
    },
  },
  about: {
    weight: 0.34,
    tint: '#2f7a3f',
    tintOpacity: 0.2,
    palette: {
      skyTop: '#123a36',
      skyBottom: '#5c8f5f',
      horizon: '#e3bd74',
      water: '#1b4a40',
      waterDeep: '#0b2a25',
      haze: '#c8d6a8',
      ambient: '#12332a',
      cloud: '#c7d6b7',
      grass: '#3f7a3d',
      paddy: '#7f9a3f',
      leaf: '#2f6b35',
    },
  },
  skills: {
    weight: 0.38,
    tint: '#8a9a2f',
    tintOpacity: 0.18,
    palette: {
      skyTop: '#17495a',
      skyBottom: '#8fb05a',
      horizon: '#f0d78a',
      water: '#2a5a46',
      waterDeep: '#12352b',
      haze: '#e0d9a0',
      ambient: '#1a3d2b',
      cloud: '#d6d7b0',
      grass: '#5f8a35',
      paddy: '#b0a83f',
      leaf: '#4f7a2f',
    },
  },
  projects: {
    weight: 0.32,
    tint: '#4a5a9a',
    tintOpacity: 0.18,
    palette: {
      skyTop: '#1b2340',
      skyBottom: '#5b4d7a',
      horizon: '#e58a5a',
      water: '#182a44',
      waterDeep: '#0a1428',
      haze: '#b9a7c7',
      ambient: '#161e33',
      cloud: '#8d83a8',
      grass: '#3a4a5a',
      paddy: '#5a5a4a',
      leaf: '#2f3f4a',
    },
  },
  education: {
    weight: 0.34,
    tint: '#b07a3f',
    tintOpacity: 0.18,
    palette: {
      skyTop: '#2a2c4a',
      skyBottom: '#a06b4a',
      horizon: '#f2b56b',
      water: '#3a3040',
      waterDeep: '#1c1826',
      haze: '#e6c39a',
      ambient: '#2a1f2a',
      cloud: '#d6b49a',
      grass: '#6a6a3a',
      paddy: '#9a8a3a',
      leaf: '#4a5a35',
    },
  },
  contact: {
    weight: 0.32,
    tint: '#a05a6a',
    tintOpacity: 0.18,
    palette: {
      skyTop: '#2a2444',
      skyBottom: '#a35f6e',
      horizon: '#f2a36b',
      water: '#1d2c44',
      waterDeep: '#0b1626',
      haze: '#e6b0a8',
      ambient: '#1f2035',
      cloud: '#c79aa8',
      grass: '#3f5a4a',
      paddy: '#6a7a4a',
      leaf: '#2f4a3f',
    },
  },
}

const ATMOSPHERE_KEYS = [
  'skyTop',
  'skyBottom',
  'horizon',
  'water',
  'waterDeep',
  'haze',
  'ambient',
  'cloud',
]

const VEGETATION_KEYS = ['grass', 'paddy', 'leaf']

export function getZoneTheme(zoneId) {
  return ZONE_THEMES[zoneId] ?? ZONE_THEMES.hero
}

export function resolveZoneTheme(theme, zoneId) {
  const zone = getZoneTheme(zoneId)
  const resolvedZoneId = ZONE_THEMES[zoneId] ? zoneId : 'hero'
  if (!theme?.palette) return theme

  const palette = { ...theme.palette }
  for (const key of ATMOSPHERE_KEYS) {
    if (palette[key] && zone.palette[key]) {
      palette[key] = mixHex(palette[key], zone.palette[key], zone.weight)
    }
  }
  for (const key of VEGETATION_KEYS) {
    if (palette[key] && zone.palette[key]) {
      palette[key] = mixHex(
        palette[key],
        zone.palette[key],
        Math.min(0.6, zone.weight * 1.35),
      )
    }
  }

  return {
    ...theme,
    zone: resolvedZoneId,
    palette,
    cssVars: {
      ...theme.cssVars,
      '--sky-top': palette.skyTop,
      '--sky-bottom': palette.skyBottom,
      '--horizon': palette.horizon,
      '--water': palette.water,
      '--water-deep': palette.waterDeep,
      '--haze': palette.haze,
      '--ambient': palette.ambient,
      '--cloud': palette.cloud,
      '--grass': palette.grass,
      '--paddy': palette.paddy,
      '--leaf': palette.leaf,
      '--zone-tint': zone.tint,
      '--zone-tint-opacity': String(zone.tintOpacity),
    },
  }
}
