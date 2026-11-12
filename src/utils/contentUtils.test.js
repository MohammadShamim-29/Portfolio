import { describe, expect, it } from 'vitest'
import {
  getSafeHref,
  isEmail,
  isHttpUrl,
  isPlaceholder,
} from './contentUtils.js'

describe('contentUtils', () => {
  it('detects TODO placeholders case-insensitively', () => {
    expect(isPlaceholder('TODO: add email')).toBe(true)
    expect(isPlaceholder('todo add email')).toBe(true)
    expect(isPlaceholder('Shamim')).toBe(false)
    expect(isPlaceholder(null)).toBe(false)
  })

  it('validates emails and HTTP URLs', () => {
    expect(isEmail('hello@example.com')).toBe(true)
    expect(isEmail('not-an-email')).toBe(false)
    expect(isHttpUrl('https://example.com')).toBe(true)
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
  })

  it('refuses to activate placeholder or unsafe links', () => {
    expect(getSafeHref('TODO: add GitHub URL')).toBeNull()
    expect(getSafeHref('javascript:alert(1)')).toBeNull()
    expect(getSafeHref('hello@example.com', { email: true })).toBe(
      'mailto:hello@example.com',
    )
    expect(getSafeHref('https://example.com')).toBe('https://example.com')
    expect(getSafeHref('/assets/cv/shamim.pdf')).toBe(
      '/assets/cv/shamim.pdf',
    )
  })
})
