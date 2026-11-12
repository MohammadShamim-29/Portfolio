import { describe, expect, it } from 'vitest'
import {
  getSeasonById,
  getSeasonForDate,
  getSeasonForMonthDay,
  getSeasonProgress,
  getSeasonThemeIds,
} from './seasonEngine.js'

describe('seasonEngine', () => {
  it('maps dates to the six-season Bengali calendar', () => {
    expect(getSeasonForMonthDay('11-13').id).toBe('hemonto')
    expect(getSeasonForMonthDay('01-10').id).toBe('sheet')
    expect(getSeasonForMonthDay('03-01').id).toBe('boshonto')
    expect(getSeasonForMonthDay('07-01').id).toBe('borsha')
  })

  it('uses the Dhaka date when resolving a season', () => {
    expect(
      getSeasonForDate(new Date('2026-11-13T00:30:00Z')).id,
    ).toBe('hemonto')
    expect(
      getSeasonForDate(new Date('2027-01-10T00:30:00Z')).id,
    ).toBe('sheet')
  })

  it('returns a progress value within the season', () => {
    const progress = getSeasonProgress(new Date('2026-11-13T06:00:00Z'))
    expect(progress).toBeGreaterThan(0)
    expect(progress).toBeLessThan(1)
  })

  it('exposes season metadata', () => {
    expect(getSeasonById('sheet')?.name).toBeTruthy()
    expect(getSeasonThemeIds()).toHaveLength(6)
  })
})
