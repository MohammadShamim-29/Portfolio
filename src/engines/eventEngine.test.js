import { describe, expect, it } from 'vitest'
import {
  getActiveEvents,
  getActiveEventStatus,
  getPrimaryEvent,
  getStatusLabel,
  getUpcomingEvents,
  validateEventsData,
} from './eventEngine.js'

describe('eventEngine', () => {
  it('finds confirmed Eid-ul-Fitr on its 2026 date', () => {
    const active = getActiveEvents('2026-03-21')
    const eid = active.find((entry) => entry.event.id === 'eid-ul-fitr')
    expect(eid?.status).toBe('confirmed')
    expect(getPrimaryEvent(active)?.event.id).toBe('eid-ul-fitr')
    expect(getActiveEventStatus(active)).toBe('confirmed')
  })

  it('keeps seasonal events out of the primary event slot', () => {
    const active = getActiveEvents('2026-11-13')
    expect(active.some((entry) => entry.event.id === 'season-hemonto')).toBe(
      true,
    )
    expect(getPrimaryEvent(active)).toBeNull()
    expect(getActiveEventStatus(active)).toBeNull()
  })

  it('marks Nabanna as a manual date and lists it as upcoming', () => {
    const active = getActiveEvents('2026-11-16')
    const nabanna = active.find((entry) => entry.event.id === 'nabanna')
    expect(nabanna?.status).toBe('manual-override')
    expect(nabanna?.estimated).toBe(false)
    expect(getPrimaryEvent(active)?.event.id).toBe('nabanna')

    const upcoming = getUpcomingEvents('2026-11-13', undefined, 10)
    const upcomingNabanna = upcoming.find(
      (entry) => entry.event.id === 'nabanna',
    )
    expect(upcomingNabanna?.startsInDays).toBe(3)
  })

  it('labels statuses and validates the data file', () => {
    expect(getStatusLabel('estimated')).toBe('Estimated date')
    expect(getStatusLabel(null)).toBe('No active event')
    expect(validateEventsData()).toEqual({ valid: true, errors: [] })
  })
})
