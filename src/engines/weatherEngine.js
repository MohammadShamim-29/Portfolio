import { getBangladeshParts, clamp } from '../utils/dateUtils.js'
import { createSeededRandom, hashString, pickWeighted } from '../utils/prng.js'

const WEATHER_LABELS = {
  clear: 'Clear skies',
  cloudy: 'Soft cloud',
  rain: 'Monsoon rain',
  storm: 'Thunderstorm',
  fog: 'River fog',
}

const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

export function getWeather(date = new Date(), season, sunData = null) {
  const parts = getBangladeshParts(date)
  const seasonId = season?.id ?? 'default'
  const seedKey = `${parts.dateKey}|${seasonId}`
  const random = createSeededRandom(seedKey)
  const tendency = season?.weatherTendency ?? {
    clear: 0.5,
    cloudy: 0.25,
    rain: 0.15,
    storm: 0.05,
    fog: 0.05,
  }

  const type =
    pickWeighted(
      random,
      Object.entries(tendency).map(([value, weight]) => ({ value, weight })),
    ) ?? 'clear'

  const variance = random()
  const intensity =
    type === 'clear'
      ? 0.1 + variance * 0.15
      : type === 'cloudy'
        ? 0.35 + variance * 0.35
        : 0.55 + variance * 0.45

  const baseCloud =
    type === 'clear'
      ? 0.08 + variance * 0.12
      : type === 'cloudy'
        ? 0.45 + variance * 0.3
        : type === 'rain'
          ? 0.7 + variance * 0.25
          : type === 'storm'
            ? 0.85 + variance * 0.15
            : 0.2 + variance * 0.25

  const rainRate =
    type === 'rain'
      ? 0.45 + variance * 0.55
      : type === 'storm'
        ? 0.8 + variance * 0.2
        : 0

  const baseFog =
    type === 'fog'
      ? 0.55 + variance * 0.45
      : type === 'rain' || type === 'storm'
        ? 0.08
        : 0.02 + variance * 0.05

  const altitude = sunData?.altitude ?? 20
  const burnOff = type === 'fog' ? smoothstep(2, 22, altitude) : 0
  const fogDensity = clamp(baseFog * (1 - burnOff * 0.92), 0, 1)

  return {
    type,
    label:
      type === 'fog' && burnOff > 0.55
        ? 'Fog clearing'
        : WEATHER_LABELS[type] ?? 'Clear skies',
    intensity,
    cloudCover: clamp(baseCloud + (type === 'fog' ? 0.1 : 0), 0, 1),
    rainRate,
    fogDensity,
    lightning:
      type === 'storm'
        ? 0.65 + variance * 0.35
        : type === 'rain'
          ? 0.12
          : 0,
    windBias:
      type === 'storm'
        ? 0.8
        : type === 'rain'
          ? 0.55
          : type === 'fog'
            ? 0.12
            : 0.3,
    isFogBurningOff: type === 'fog' && burnOff > 0.1,
    seed: hashString(seedKey),
    dateKey: parts.dateKey,
  }
}

export function getWeatherLabel(weather) {
  return weather?.label ?? 'Clear skies'
}

export function getWeatherSummary(weather, season) {
  const seasonName = season?.english ?? 'Bangladesh'
  return `${weather?.label ?? 'Clear skies'} · ${seasonName}`
}
