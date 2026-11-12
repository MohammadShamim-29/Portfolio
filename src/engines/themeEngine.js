import themesData from '../data/themes.json'
import {
  getActiveEventStatus,
  getPrimaryEvent,
} from './eventEngine.js'
import { getSeasonById, getSeasonForDate } from './seasonEngine.js'
import { getSunData } from './sunEngine.js'
import {
  getPreviewPhase,
  getTimeLabel,
  getTimeState,
} from './timeEngine.js'
import { getWeather } from './weatherEngine.js'
import {
  ensureContrast,
  mixHex,
  withAlpha,
} from '../utils/colorUtils.js'

const PANEL_BACKGROUND = '#081214'
const PANEL_TEXT = '#f7f3e9'
const PANEL_MUTED = '#d8d3c5'

const PREVIEW_LIGHT = {
  sunrise: {
    daylight: 0.42,
    night: 0,
    twilight: 0.5,
    golden: 1,
    sunWarmth: 1,
    starOpacity: 0.08,
    shadowLength: 8,
    windowLights: 0.5,
    cityGlow: 0.3,
    isNight: false,
    moonOpacity: 0,
  },
  morning: {
    daylight: 1,
    night: 0,
    twilight: 0,
    golden: 0.25,
    sunWarmth: 0.65,
    starOpacity: 0,
    shadowLength: 2,
    windowLights: 0,
    cityGlow: 0,
    isNight: false,
    moonOpacity: 0,
  },
  noon: {
    daylight: 1,
    night: 0,
    twilight: 0,
    golden: 0,
    sunWarmth: 0.15,
    starOpacity: 0,
    shadowLength: 0.6,
    windowLights: 0,
    cityGlow: 0,
    isNight: false,
    moonOpacity: 0,
  },
  sunset: {
    daylight: 0.35,
    night: 0,
    twilight: 0.55,
    golden: 1,
    sunWarmth: 1,
    starOpacity: 0.16,
    shadowLength: 9,
    windowLights: 0.72,
    cityGlow: 0.5,
    isNight: false,
    moonOpacity: 0.1,
  },
  night: {
    daylight: 0,
    night: 1,
    twilight: 0,
    golden: 0,
    sunWarmth: 0,
    starOpacity: 1,
    shadowLength: 12,
    windowLights: 1,
    cityGlow: 1,
    isNight: true,
    moonOpacity: 1,
  },
}

const PREVIEW_SUN = {
  sunrise: { altitude: 2, azimuth: 90, x: 0.78, y: 0.47 },
  morning: { altitude: 28, azimuth: 110, x: 0.68, y: 0.58 },
  noon: { altitude: 72, azimuth: 180, x: 0.5, y: 0.82 },
  sunset: { altitude: 2, azimuth: 270, x: 0.22, y: 0.47 },
  night: { altitude: -28, azimuth: 300, x: 0.34, y: 0.62 },
}

const clamp01 = (value) => Math.max(0, Math.min(1, value))

function buildPalette({ phase, season, eventTheme, weather, light }) {
  const base =
    themesData.timePalettes[phase] ?? themesData.timePalettes.noon
  const palette = { ...base }
  const grade = season?.grade
  const vegetation = season?.vegetation

  if (grade) {
    const weight = grade.weight ?? 0.2
    palette.skyTop = mixHex(palette.skyTop, grade.tint, weight * 0.3)
    palette.skyBottom = mixHex(palette.skyBottom, grade.haze, weight * 0.45)
    palette.horizon = mixHex(palette.horizon, grade.haze, weight * 0.55)
    palette.haze = mixHex(palette.haze, grade.haze, weight * 0.65)
    palette.accent = mixHex(palette.accent, grade.accent, weight * 0.5)
  }

  if (vegetation) {
    palette.grass = mixHex(palette.grass, vegetation.grass, 0.52)
    palette.paddy = mixHex(palette.paddy, vegetation.paddy, 0.52)
    palette.leaf = mixHex(palette.leaf, vegetation.leaf, 0.42)
  }

  if (eventTheme?.overlayTint) {
    palette.skyBottom = mixHex(
      palette.skyBottom,
      eventTheme.overlayTint,
      0.18,
    )
    palette.horizon = mixHex(palette.horizon, eventTheme.overlayTint, 0.12)
    palette.haze = mixHex(palette.haze, eventTheme.overlayTint, 0.18)
    palette.water = mixHex(palette.water, eventTheme.overlayTint, 0.2)
    palette.cloud = mixHex(palette.cloud, eventTheme.overlayTint, 0.12)
  }

  if (eventTheme?.accent) palette.accent = eventTheme.accent
  if (eventTheme?.accent2) palette.accent2 = eventTheme.accent2

  if (weather) {
    palette.cloud = mixHex(
      palette.cloud,
      light.isNight ? '#4a5661' : '#8b969b',
      weather.cloudCover * 0.35,
    )
    palette.skyTop = mixHex(
      palette.skyTop,
      palette.cloud,
      weather.cloudCover * 0.22,
    )
    palette.skyBottom = mixHex(
      palette.skyBottom,
      palette.cloud,
      weather.cloudCover * 0.16,
    )
    if (weather.fogDensity > 0.05) {
      palette.haze = mixHex(
        palette.haze,
        light.isNight ? '#7d8a8d' : '#d9dfd8',
        weather.fogDensity * 0.42,
      )
    }
    if (weather.rainRate > 0.05) {
      palette.skyTop = mixHex(
        palette.skyTop,
        '#263b43',
        weather.rainRate * 0.28,
      )
      palette.water = mixHex(
        palette.water,
        '#1d343b',
        weather.rainRate * 0.2,
      )
    }
  }

  return palette
}

function getVisualSun({ sunData, phase, manual, light }) {
  if (manual) {
    const preview = PREVIEW_SUN[phase] ?? PREVIEW_SUN.noon
    const isNight = phase === 'night'
    return {
      altitude: preview.altitude,
      azimuth: preview.azimuth,
      x: preview.x,
      y: preview.y,
      visible: !isNight,
      moonX: isNight ? preview.x : 0.5,
      moonY: isNight ? preview.y : 0.7,
      moonAltitude: isNight ? 42 : -20,
      moonFraction: 0.58,
      moonPhase: 0.58,
      moonVisible: isNight,
    }
  }

  const altitude = sunData?.altitude ?? 20
  const azimuth = sunData?.azimuth ?? 180
  const moonAltitude = sunData?.moon?.altitude ?? -20
  const moonAzimuth = sunData?.moon?.azimuth ?? 180
  const sunX = 0.5 + Math.sin((azimuth * Math.PI) / 180) * 0.38
  const sunY = 0.42 + (Math.max(-18, Math.min(90, altitude)) / 90) * 0.5
  const moonX = 0.5 + Math.sin((moonAzimuth * Math.PI) / 180) * 0.38
  const moonY = 0.42 + (Math.max(-18, Math.min(90, moonAltitude)) / 90) * 0.5

  return {
    altitude,
    azimuth,
    x: sunX,
    y: sunY,
    visible: altitude > -7 && (light?.daylight ?? 0) > 0.01,
    moonX,
    moonY,
    moonAltitude,
    moonFraction: sunData?.moon?.fraction ?? 0.5,
    moonPhase: sunData?.moon?.phase ?? 0.5,
    moonVisible: moonAltitude > 0 && (light?.night ?? 0) > 0.05,
  }
}

function getParticles({ light, weather, season, eventTheme }) {
  const rain = weather?.rainRate ?? 0
  const fog = weather?.fogDensity ?? 0
  const cloud = weather?.cloudCover ?? 0
  const night = light?.night ?? 0
  const daylight = light?.daylight ?? 0
  const fireflySeason = ['borsha', 'shorot', 'hemonto'].includes(season?.id)
    ? 1
    : 0.35
  const ramadanBoost = eventTheme?.id === 'ramadan' ? 0.25 : 0

  return {
    rain,
    fog,
    fireflies: clamp01(
      (night * 0.9 + ramadanBoost) * fireflySeason * (1 - rain * 0.75),
    ),
    dust: clamp01(
      daylight * (season?.id === 'grishsho' ? 0.95 : 0.34) * (1 - rain),
    ),
    birds: clamp01((0.3 + daylight * 0.7) * (1 - rain * 0.65)),
    ripples: clamp01(rain * 0.8 + 0.16),
    shootingStars: clamp01(night * (1 - cloud) * 0.8),
    lightning: weather?.lightning ?? 0,
  }
}

function buildCssVars(palette, eventTheme, weather, light, particles) {
  const accent = ensureContrast(palette.accent, PANEL_BACKGROUND, 4.5)
  const accent2 = ensureContrast(palette.accent2, PANEL_BACKGROUND, 4.5)

  return {
    '--sky-top': palette.skyTop,
    '--sky-bottom': palette.skyBottom,
    '--horizon': palette.horizon,
    '--water': palette.water,
    '--water-deep': palette.waterDeep,
    '--haze': palette.haze,
    '--ambient': palette.ambient,
    '--cloud': palette.cloud,
    '--star': palette.star,
    '--grass': palette.grass,
    '--paddy': palette.paddy,
    '--leaf': palette.leaf,
    '--city': palette.city,
    '--window-light': palette.window,
    '--sun': palette.sun,
    '--sun-glow': palette.sunGlow,
    '--shadow': palette.shadow,
    '--accent': accent,
    '--accent-2': accent2,
    '--overlay-tint': eventTheme?.overlayTint ?? 'transparent',
    '--panel-bg': 'rgba(7, 16, 18, 0.84)',
    '--panel-bg-strong': 'rgba(5, 12, 14, 0.94)',
    '--panel-border': withAlpha(PANEL_TEXT, 0.16),
    '--text': PANEL_TEXT,
    '--muted': PANEL_MUTED,
    '--ink': '#0a1415',
    '--rain': String(weather?.rainRate ?? 0),
    '--fog': String(weather?.fogDensity ?? 0),
    '--cloud-cover': String(weather?.cloudCover ?? 0),
    '--star-opacity': String(light?.starOpacity ?? 0),
    '--window-opacity': String(light?.windowLights ?? 0),
    '--city-glow': String(light?.cityGlow ?? 0),
    '--firefly': String(particles.fireflies),
    '--dust': String(particles.dust),
    '--birds': String(particles.birds),
  }
}

export function getExplorerThemes() {
  return themesData.explorerThemes
}

export function getEventTheme(id) {
  return themesData.eventThemes[id] ?? null
}

export function getDefaultPreview() {
  return { mode: 'auto', themeId: 'normal', timeId: 'sunset' }
}

export function resolveTheme({
  date = new Date(),
  sunData = null,
  timeState = null,
  season = null,
  activeEvents = [],
  weather = null,
  preview = getDefaultPreview(),
} = {}) {
  const resolvedSun = sunData ?? getSunData(date)
  const resolvedTime = timeState ?? getTimeState(resolvedSun)
  const resolvedSeason = season ?? getSeasonForDate(date)
  const resolvedWeather =
    weather ?? getWeather(date, resolvedSeason, resolvedSun)
  const isPreview = preview?.mode === 'manual'
  const previewTheme = isPreview
    ? themesData.eventThemes[preview.themeId] ?? null
    : null

  let phase = isPreview
    ? getPreviewPhase(preview.timeId)
    : resolvedTime.phase
  if (isPreview && !preview.timeId) phase = resolvedTime.phase

  const seasonForTheme =
    isPreview && previewTheme?.kind === 'season'
      ? getSeasonById(previewTheme.seasonId) ?? resolvedSeason
      : resolvedSeason

  const primary = getPrimaryEvent(activeEvents)
  const autoEventTheme = primary
    ? themesData.eventThemes[primary.event.themeId] ?? null
    : null
  const eventTheme =
    isPreview && previewTheme?.kind === 'event'
      ? previewTheme
      : isPreview
        ? null
        : autoEventTheme

  const light = isPreview
    ? PREVIEW_LIGHT[phase] ?? PREVIEW_LIGHT.noon
    : resolvedTime.light

  const adjustedLight = {
    ...light,
    starOpacity: clamp01((light.starOpacity ?? 0) * (1 - (resolvedWeather.cloudCover ?? 0) * 0.72)),
    daylight: clamp01((light.daylight ?? 0) * (1 - (resolvedWeather.cloudCover ?? 0) * 0.22)),
  }

  const palette = buildPalette({
    phase,
    season: seasonForTheme,
    eventTheme,
    weather: resolvedWeather,
    light: adjustedLight,
  })

  const particles = getParticles({
    light: adjustedLight,
    weather: resolvedWeather,
    season: seasonForTheme,
    eventTheme,
  })

  const eventDecorations = eventTheme?.decorations ?? []
  const seasonDecorations = seasonForTheme?.decorations ?? []
  const decorations = [...new Set([...eventDecorations, ...seasonDecorations])]
  const activeStatus = getActiveEventStatus(activeEvents)
  const estimated = isPreview ? false : activeStatus === 'estimated'
  const status = isPreview ? null : activeStatus

  const previewLabel = isPreview
    ? `${previewTheme?.name ?? 'Normal Bangladesh'} · ${getTimeLabel(phase)}`
    : null

  return {
    date,
    phase,
    timeLabel: getTimeLabel(phase),
    season: seasonForTheme,
    seasonName: seasonForTheme?.name ?? 'Bangladesh',
    seasonEnglish: seasonForTheme?.english ?? '',
    weather: resolvedWeather,
    event: eventTheme,
    eventId: eventTheme?.id ?? null,
    eventName: eventTheme?.name ?? 'Normal Bangladesh',
    primaryEvent: isPreview ? null : primary,
    activeEvents,
    estimated,
    status,
    isPreview,
    previewLabel,
    decorations,
    particles,
    light: adjustedLight,
    sun: getVisualSun({
      sunData: resolvedSun,
      phase,
      manual: isPreview,
      light: adjustedLight,
    }),
    sunData: resolvedSun,
    palette,
    cssVars: buildCssVars(
      palette,
      eventTheme,
      resolvedWeather,
      adjustedLight,
      particles,
    ),
  }
}

export { PANEL_BACKGROUND, PANEL_TEXT, PANEL_MUTED, PREVIEW_LIGHT }
