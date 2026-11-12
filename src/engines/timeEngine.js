import { clamp } from '../utils/dateUtils.js'
import { getMinutesFromSolarNoon } from './sunEngine.js'

export const TIME_PHASES = [
  'astronomical-dawn',
  'sunrise',
  'morning',
  'noon',
  'afternoon',
  'sunset',
  'twilight',
  'night',
]

export const TIME_PHASE_LABELS = {
  'astronomical-dawn': 'Astronomical dawn',
  sunrise: 'Sunrise',
  morning: 'Morning',
  noon: 'Noon',
  afternoon: 'Afternoon',
  sunset: 'Sunset',
  twilight: 'Twilight',
  night: 'Night',
}

export const TIME_PREVIEW_OPTIONS = [
  { id: 'sunrise', label: 'Sunrise', phase: 'sunrise' },
  { id: 'morning', label: 'Morning', phase: 'morning' },
  { id: 'daytime', label: 'Daytime', phase: 'noon' },
  { id: 'sunset', label: 'Sunset', phase: 'sunset' },
  { id: 'night', label: 'Night', phase: 'night' },
]

const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

const gaussian = (value, center, width) =>
  Math.exp(-0.5 * ((value - center) / width) ** 2)

export function getTimePhase(sunData) {
  const altitude = sunData.altitude

  if (altitude < -18) return 'night'
  if (altitude < -12) {
    return sunData.isRising ? 'astronomical-dawn' : 'twilight'
  }
  if (altitude < 6) {
    return sunData.isRising ? 'sunrise' : 'sunset'
  }

  const solarDistance = getMinutesFromSolarNoon(sunData)
  if (Math.abs(solarDistance) <= 45) return 'noon'

  return sunData.isRising ? 'morning' : 'afternoon'
}

export function getLightState(sunData) {
  const altitude = sunData.altitude
  const daylight = smoothstep(-6, 8, altitude)
  const night = 1 - smoothstep(-18, -5, altitude)
  const twilight =
    smoothstep(-18, -5, altitude) * (1 - smoothstep(-5, 8, altitude))
  const golden = gaussian(altitude, 3, 9)
  const sunWarmth = clamp(1 - altitude / 40, 0, 1)
  const starOpacity = clamp((-altitude - 1) / 16, 0, 1)
  const shadowLength = clamp(1.4 / Math.max(0.1, Math.sin((Math.max(altitude, 0) * Math.PI) / 180)), 0.25, 14)
  const windowLights = 1 - smoothstep(-4, 8, altitude)
  const cityGlow = 1 - smoothstep(-8, 4, altitude)

  return {
    altitude,
    daylight,
    night,
    twilight,
    golden,
    sunWarmth,
    starOpacity,
    shadowLength,
    windowLights,
    cityGlow,
    isNight: altitude < -6,
    moonOpacity: clamp((-altitude + 4) / 10, 0, 1),
  }
}

export function getTimeState(sunData) {
  const phase = getTimePhase(sunData)
  return {
    phase,
    label: TIME_PHASE_LABELS[phase],
    light: getLightState(sunData),
    minutesFromSolarNoon: getMinutesFromSolarNoon(sunData),
  }
}

export function getTimeLabel(phase) {
  return TIME_PHASE_LABELS[phase] ?? TIME_PHASE_LABELS.night
}

export function getPreviewPhase(timeId) {
  return (
    TIME_PREVIEW_OPTIONS.find((option) => option.id === timeId)?.phase ??
    'noon'
  )
}

export function getNextTimePhase(phase) {
  const index = TIME_PHASES.indexOf(phase)
  if (index === -1) return TIME_PHASES[0]
  return TIME_PHASES[(index + 1) % TIME_PHASES.length]
}
