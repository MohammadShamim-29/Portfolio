import SunCalc from 'suncalc'
import {
  getBangladeshNoon,
  getBangladeshParts,
  minutesBetween,
} from '../utils/dateUtils.js'

export const DHAKA_LATITUDE = 23.8103
export const DHAKA_LONGITUDE = 90.4125

const RAD_TO_DEG = 180 / Math.PI

const safeDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime()) ? value : null

const toDegrees = (radians) => radians * RAD_TO_DEG

const normalizeAzimuth = (degrees) => ((degrees % 360) + 360) % 360

export function getMoonPhaseName(phase) {
  if (phase < 0.03 || phase > 0.97) return 'New moon'
  if (phase < 0.22) return 'Waxing crescent'
  if (phase < 0.28) return 'First quarter'
  if (phase < 0.47) return 'Waxing gibbous'
  if (phase < 0.53) return 'Full moon'
  if (phase < 0.72) return 'Waning gibbous'
  if (phase < 0.78) return 'Last quarter'
  return 'Waning crescent'
}

export function getSunData(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('getSunData expects a valid Date')
  }

  const parts = getBangladeshParts(date)
  const referenceNoon = getBangladeshNoon(date)

  const times = SunCalc.getTimes(referenceNoon, DHAKA_LATITUDE, DHAKA_LONGITUDE)
  const position = SunCalc.getPosition(date, DHAKA_LATITUDE, DHAKA_LONGITUDE)
  const moonPosition = SunCalc.getMoonPosition(
    date,
    DHAKA_LATITUDE,
    DHAKA_LONGITUDE,
  )
  const moonIllumination = SunCalc.getMoonIllumination(date)
  const moonTimes = SunCalc.getMoonTimes(
    referenceNoon,
    DHAKA_LATITUDE,
    DHAKA_LONGITUDE,
  )

  const altitude = toDegrees(position.altitude)
  const azimuth = normalizeAzimuth(toDegrees(position.azimuth) + 180)
  const solarNoon = safeDate(times.solarNoon)
  const sunrise = safeDate(times.sunrise)
  const sunset = safeDate(times.sunset)
  const daylightMinutes =
    sunrise && sunset ? Math.max(0, (sunset - sunrise) / 60000) : 0

  return {
    date,
    parts,
    latitude: DHAKA_LATITUDE,
    longitude: DHAKA_LONGITUDE,
    altitude,
    azimuth,
    solarNoon,
    isRising: solarNoon ? date < solarNoon : true,
    isDay: altitude > 0,
    daylightMinutes,
    times: {
      sunrise,
      sunriseEnd: safeDate(times.sunriseEnd),
      goldenHourEnd: safeDate(times.goldenHourEnd),
      solarNoon,
      goldenHour: safeDate(times.goldenHour),
      sunsetStart: safeDate(times.sunsetStart),
      sunset,
      dusk: safeDate(times.dusk),
      nauticalDusk: safeDate(times.nauticalDusk),
      night: safeDate(times.night),
      nightEnd: safeDate(times.nightEnd),
      nauticalDawn: safeDate(times.nauticalDawn),
      dawn: safeDate(times.dawn),
    },
    moon: {
      altitude: toDegrees(moonPosition.altitude),
      azimuth: normalizeAzimuth(toDegrees(moonPosition.azimuth) + 180),
      distance: moonPosition.distance,
      parallacticAngle: moonPosition.parallacticAngle,
      fraction: moonIllumination.fraction,
      phase: moonIllumination.phase,
      angle: moonIllumination.angle,
      phaseName: getMoonPhaseName(moonIllumination.phase),
      rise: safeDate(moonTimes.rise),
      set: safeDate(moonTimes.set),
      alwaysUp: Boolean(moonTimes.alwaysUp),
      alwaysDown: Boolean(moonTimes.alwaysDown),
    },
  }
}

export function getMinutesFromSolarNoon(sunData) {
  if (!sunData?.solarNoon) return 0
  const delta = sunData.date.getTime() - sunData.solarNoon.getTime()
  return delta / 60000
}

export function getSunTimesForDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const reference = new Date(Date.UTC(year, month - 1, day, 6, 0, 0))
  const times = SunCalc.getTimes(
    reference,
    DHAKA_LATITUDE,
    DHAKA_LONGITUDE,
  )
  return Object.fromEntries(
    Object.entries(times).map(([key, value]) => [key, safeDate(value)]),
  )
}

export function getSolarDistanceMinutes(a, b) {
  return minutesBetween(a, b)
}
