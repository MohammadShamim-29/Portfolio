// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { App } from './App.jsx'

describe('App', () => {
  it('renders the landscape, all six journey sections, and portfolio content', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('BANGLADESH')
    expect(html).toContain('Md. Shamim')
    expect(html).toContain('Computer Science and Engineering Graduate')
    expect(html).toContain('shamimahmed4929@gmail.com')
    expect(html).toContain('Download CV')
    expect(html).toContain('Energy Demand Forecasting for Bangladesh')
    expect(html).toContain('id="hero"')
    expect(html).toContain('id="about"')
    expect(html).toContain('id="skills"')
    expect(html).toContain('id="projects"')
    expect(html).toContain('id="education"')
    expect(html).toContain('id="contact"')
    expect(html).toContain('class="static-scene"')
  })
})
