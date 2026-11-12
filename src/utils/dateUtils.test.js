import { describe, expect, it } from 'vitest'
import {
  addDaysToDateKey,
  bangladeshDateTimeToDate,
  getBangladeshParts,
  getBangladeshStartOfDay,
  isDateKeyBetween,
  isMonthDayBetween,
  parseDateKey,
} from './dateUtils.js'

describe('dateUtils', () => {
  it('reads the Asia/Dhaka calendar date across UTC midnight', () => {
    const beforeMidnightUtc = getBangladeshParts(
      new Date('2026-11-13T00:30:00Z'),
    )
    expect(beforeMidnightUtc.dateKey).toBe('2026-11-13')
    expect(beforeMidnightUtc.hour).toBe(6)
    expect(beforeMidnightUtc.minute).toBe(30)

    const afterMidnightUtc = getBangladeshParts(
      new Date('2026-11-13T20:00:00Z'),
    )
    expect(afterMidnightUtc.dateKey).toBe('2026-11-14')
    expect(afterMidnightUtc.hour).toBe(2)
  })

  it('converts Dhaka local midnight to the previous UTC evening', () => {
    const start = getBangladeshStartOfDay(new Date('2026-11-13T00:30:00Z'))
    expect(start.toISOString()).toBe('2026-11-12T18:00:00.000Z')

    const noon = bangladeshDateTimeToDate({
      year: 2026,
      month: 11,
      day: 13,
      hour: 12,
    })
    expect(noon.toISOString()).toBe('2026-11-13T06:00:00.000Z')
  })

  it('adds days without crossing through local time', () => {
    expect(addDaysToDateKey('2026-02-28', 1)).toBe('2026-03-01')
    expect(addDaysToDateKey('2024-02-28', 1)).toBe('2024-02-29')
    expect(addDaysToDateKey('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('validates date keys', () => {
    expect(parseDateKey('2026-11-13')).toEqual({
      year: 2026,
      month: 11,
      day: 13,
    })
    expect(() => parseDateKey('2026-02-30')).toThrow(RangeError)
    expect(() => parseDateKey('13-11-2026')).toThrow(TypeError)
  })

  it('supports wrapping month-day and date-key ranges', () => {
    expect(isMonthDayBetween('01-10', '12-16', '02-14')).toBe(true)
    expect(isMonthDayBetween('12-20', '12-16', '02-14')).toBe(true)
    expect(isMonthDayBetween('06-01', '12-16', '02-14')).toBe(false)
    expect(
      isDateKeyBetween('2027-01-02', '2026-12-16', '2027-02-14'),
    ).toBe(true)
  })
})
