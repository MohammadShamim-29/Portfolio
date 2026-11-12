import { describe, expect, it } from 'vitest'
import {
  getDefaultPreview,
  getExplorerThemes,
  resolveTheme,
} from './themeEngine.js'

const date = new Date('2026-11-13T06:00:00Z')

describe('themeEngine', () => {
  it('resolves a live theme with the required CSS variables', () => {
    const theme = resolveTheme({ date })
    expect(theme.isPreview).toBe(false)
    expect(theme.season.id).toBe('hemonto')
    expect(theme.eventName).toBe('Normal Bangladesh')
    expect(theme.cssVars['--accent']).toMatch(/^#[0-9a-f]{6}$/i)
    expect(theme.cssVars['--sky-top']).toBeTruthy()
    expect(theme.cssVars['--panel-bg']).toBeTruthy()
    expect(theme.sun.visible).toBe(true)
  })

  it('resolves a manual Eid preview without changing live event data', () => {
    const theme = resolveTheme({
      date,
      preview: { mode: 'manual', themeId: 'eid', timeId: 'sunset' },
    })
    expect(theme.isPreview).toBe(true)
    expect(theme.eventName).toBe('Eid')
    expect(theme.phase).toBe('sunset')
    expect(theme.primaryEvent).toBeNull()
    expect(theme.previewLabel).toContain('Eid')
    expect(theme.cssVars['--accent']).toBeTruthy()
  })

  it('resolves the normal preview state', () => {
    const theme = resolveTheme({
      date,
      preview: { mode: 'manual', themeId: 'normal', timeId: 'night' },
    })
    expect(theme.eventName).toBe('Normal Bangladesh')
    expect(theme.phase).toBe('night')
    expect(theme.light.isNight).toBe(true)
  })

  it('exposes explorer themes and a live default preview', () => {
    const ids = getExplorerThemes().map((option) => option.id)
    expect(ids).toContain('normal')
    expect(ids).toContain('eid')
    expect(ids).toContain('monsoon')
    expect(getDefaultPreview()).toEqual({
      mode: 'auto',
      themeId: 'normal',
      timeId: 'sunset',
    })
  })
})
