import { describe, expect, it } from 'vitest'
import {
  TIME_PHASE_LABELS,
  getLightState,
  getNextTimePhase,
  getPreviewPhase,
  getTimeLabel,
  getTimePhase,
  getTimeState,
} from './timeEngine.js'

const base = {
  date: new Date('2026-11-13T06:00:00Z'),
  solarNoon: new Date('2026-11-13T05:56:00Z'),
}

describe('timeEngine', () => {
  it('classifies altitude and solar distance into phases', () => {
    expect(getTimePhase({ ...base, altitude: 70, isRising: false })).toBe(
      'noon',
    )
    expect(getTimePhase({ ...base, altitude: 2, isRising: true })).toBe(
      'sunrise',
    )
    expect(getTimePhase({ ...base, altitude: 2, isRising: false })).toBe(
      'sunset',
    )
    expect(getTimePhase({ ...base, altitude: -20, isRising: false })).toBe(
      'night',
    )
  })

  it('derives light values from solar altitude', () => {
    const night = getLightState({ ...base, altitude: -20, isRising: false })
    expect(night.night).toBeGreaterThan(0.9)
    expect(night.daylight).toBe(0)
    expect(night.isNight).toBe(true)

    const noon = getLightState({ ...base, altitude: 70, isRising: false })
    expect(noon.daylight).toBe(1)
    expect(noon.night).toBe(0)
    expect(noon.windowLights).toBe(0)
  })

  it('returns labels and preview phases', () => {
    const state = getTimeState({
      ...base,
      solarNoon: new Date('2026-11-13T04:00:00Z'),
      altitude: 20,
      isRising: true,
    })
    expect(state.label).toBe(TIME_PHASE_LABELS.morning)
    expect(getTimeLabel('sunset')).toBe('Sunset')
    expect(getTimeLabel('unknown')).toBe('Night')
    expect(getPreviewPhase('daytime')).toBe('noon')
    expect(getPreviewPhase('missing')).toBe('noon')
    expect(getNextTimePhase('night')).toBe('astronomical-dawn')
  })
})
