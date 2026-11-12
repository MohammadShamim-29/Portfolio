import { describe, expect, it } from 'vitest'
import {
  DHAKA_LATITUDE,
  DHAKA_LONGITUDE,
  getMinutesFromSolarNoon,
  getMoonPhaseName,
  getSunData,
} from './sunEngine.js'

const DHAKA_NOON = new Date('2026-11-13T06:00:00Z')

describe('sunEngine', () => {
  it('returns coherent Dhaka sun and moon data', () => {
    const data = getSunData(DHAKA_NOON)

    expect(data.parts.dateKey).toBe('2026-11-13')
    expect(data.latitude).toBe(DHAKA_LATITUDE)
    expect(data.longitude).toBe(DHAKA_LONGITUDE)
    expect(data.altitude).toBeGreaterThan(40)
    expect(data.azimuth).toBeGreaterThanOrEqual(0)
    expect(data.azimuth).toBeLessThan(360)
    expect(data.times.sunrise).toBeInstanceOf(Date)
    expect(data.times.sunset).toBeInstanceOf(Date)
    expect(data.times.sunrise.getTime()).toBeLessThan(
      data.times.sunset.getTime(),
    )
    expect(data.daylightMinutes).toBeGreaterThan(600)
    expect(data.daylightMinutes).toBeLessThan(780)
    expect(data.moon.fraction).toBeGreaterThanOrEqual(0)
    expect(data.moon.fraction).toBeLessThanOrEqual(1)
    expect(typeof data.moon.phaseName).toBe('string')
  })

  it('measures time relative to solar noon', () => {
    const data = getSunData(DHAKA_NOON)
    expect(Math.abs(getMinutesFromSolarNoon(data))).toBeLessThan(30)
  })

  it('maps lunar phase values to readable names', () => {
    expect(getMoonPhaseName(0)).toBe('New moon')
    expect(getMoonPhaseName(0.5)).toBe('Full moon')
    expect(getMoonPhaseName(0.25)).toBe('First quarter')
    expect(getMoonPhaseName(0.75)).toBe('Last quarter')
  })

  it('rejects invalid dates', () => {
    expect(() => getSunData(new Date('not a date'))).toThrow(TypeError)
  })
})
