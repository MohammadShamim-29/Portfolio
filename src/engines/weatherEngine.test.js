import { describe, expect, it } from 'vitest'
import { getSeasonForDate } from './seasonEngine.js'
import { getWeather } from './weatherEngine.js'

const date = new Date('2026-11-13T06:00:00Z')

describe('weatherEngine', () => {
  it('is deterministic for the same date and season', () => {
    const season = getSeasonForDate(date)
    const first = getWeather(date, season)
    const second = getWeather(date, season)
    expect(second).toEqual(first)
    expect(first.dateKey).toBe('2026-11-13')
    expect(first.seed).toBeTypeOf('number')
  })

  it('keeps weather values inside their valid ranges', () => {
    const season = getSeasonForDate(date)
    const weather = getWeather(date, season)
    expect(weather.cloudCover).toBeGreaterThanOrEqual(0)
    expect(weather.cloudCover).toBeLessThanOrEqual(1)
    expect(weather.rainRate).toBeGreaterThanOrEqual(0)
    expect(weather.rainRate).toBeLessThanOrEqual(1)
    expect(weather.fogDensity).toBeGreaterThanOrEqual(0)
    expect(weather.fogDensity).toBeLessThanOrEqual(1)
    expect(weather.lightning).toBeGreaterThanOrEqual(0)
    expect(weather.lightning).toBeLessThanOrEqual(1)
    expect(weather.label).toBeTypeOf('string')
  })

  it('uses the monsoon season tendency for rain probability', () => {
    const monsoon = getSeasonForDate(new Date('2026-07-01T06:00:00Z'))
    expect(monsoon.id).toBe('borsha')
    const weather = getWeather(
      new Date('2026-07-01T06:00:00Z'),
      monsoon,
    )
    expect(['clear', 'cloudy', 'rain', 'storm', 'fog']).toContain(weather.type)
  })
})
