import { useCallback, useEffect, useMemo, useState } from 'react'
import portfolio from '../data/portfolio.json'
import { Environment } from '../components/environment/Environment.jsx'
import { AboutSection } from '../components/portfolio/AboutSection.jsx'
import { ContactSection } from '../components/portfolio/ContactSection.jsx'
import { EducationSection } from '../components/portfolio/EducationSection.jsx'
import { HeroSection } from '../components/portfolio/HeroSection.jsx'
import { ProjectsSection } from '../components/portfolio/ProjectsSection.jsx'
import { SkillsSection } from '../components/portfolio/SkillsSection.jsx'
import { ExplorerPanel } from '../components/ui/ExplorerPanel.jsx'
import { Footer } from '../components/ui/Footer.jsx'
import { Navigation } from '../components/ui/Navigation.jsx'
import { TopBar } from '../components/ui/TopBar.jsx'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { useAmbientSound } from '../hooks/useAmbientSound.js'
import { useBangladeshTime } from '../hooks/useBangladeshTime.js'
import { usePerformanceTier } from '../hooks/usePerformanceTier.js'
import { usePointerTilt } from '../hooks/usePointerTilt.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { useScrollProgress } from '../hooks/useScrollProgress.js'
import { useTheme } from '../hooks/useTheme.js'
import { getDefaultPreview } from '../engines/themeEngine.js'

const SECTION_INDEX = {
  hero: '01',
  about: '02',
  skills: '03',
  projects: '04',
  education: '05',
  contact: '06',
}

export function App() {
  const [preview, setPreview] = useState(() => getDefaultPreview())
  const [explorerOpen, setExplorerOpen] = useState(false)
  const [motionOverride, setMotionOverride] = useState(false)
  const theme = useTheme(preview)
  const { clock, dateLabel } = useBangladeshTime()
  const performance = usePerformanceTier()
  const reducedMotion = useReducedMotion()
  const effectiveReduced =
    (reducedMotion || performance.tier === 'low') && !motionOverride
  const tilt = usePointerTilt({ enabled: !effectiveReduced })

  const sectionIds = useMemo(
    () => portfolio.sections.map((section) => section.id),
    [],
  )
  const { activeId, scrollToSection } = useActiveSection(sectionIds)
  const sound = useAmbientSound(theme, activeId)
  const sectionMap = useMemo(
    () =>
      Object.fromEntries(
        portfolio.sections.map((section) => [section.id, section]),
      ),
    [],
  )

  useScrollProgress({ sectionIds })

  const resetPreview = useCallback(() => {
    setPreview(getDefaultPreview())
  }, [])

  const closeExplorer = useCallback(() => setExplorerOpen(false), [])
  const openExplorer = useCallback(() => setExplorerOpen(true), [])

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta && theme?.palette?.skyTop) {
      meta.setAttribute('content', theme.palette.skyTop)
    }
    document.documentElement.style.colorScheme = 'dark'
  }, [theme])

  useEffect(() => {
    if (!explorerOpen) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') setExplorerOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [explorerOpen])

  return (
    <div
      className="app"
      style={theme?.cssVars}
      data-phase={theme?.phase}
      data-season={theme?.season?.id}
      data-event={theme?.eventId ?? 'normal'}
      data-tier={performance.tier}
      data-reduced-motion={effectiveReduced ? 'true' : 'false'}
    >
      <a className="skip-link" href="#main">
        Skip to portfolio content
      </a>

      <Environment
        theme={theme}
        tier={performance.tier}
        reducedMotion={effectiveReduced}
      />

      <div className="scene-tint" aria-hidden="true" />
      <div className="journey-progress-bar" aria-hidden="true">
        <span />
      </div>

      <TopBar
        theme={theme}
        clock={clock}
        dateLabel={dateLabel}
        sound={sound}
        onOpenExplorer={openExplorer}
        explorerOpen={explorerOpen}
      />

      <Navigation
        sections={portfolio.sections}
        activeId={activeId}
        scrollToSection={scrollToSection}
      />

      <main id="main">
        <HeroSection
          hero={portfolio.hero}
          theme={theme}
          onScrollTo={scrollToSection}
        />
        <AboutSection
          about={portfolio.about}
          section={sectionMap.about}
          index={SECTION_INDEX.about}
        />
        <SkillsSection
          skills={portfolio.skills}
          section={sectionMap.skills}
          index={SECTION_INDEX.skills}
        />
        <ProjectsSection
          projects={portfolio.projects}
          section={sectionMap.projects}
          index={SECTION_INDEX.projects}
        />
        <EducationSection
          education={portfolio.education}
          certifications={portfolio.certifications}
          experience={portfolio.experience}
          section={sectionMap.education}
          index={SECTION_INDEX.education}
        />
        <ContactSection
          contact={portfolio.contact}
          owner={portfolio.owner}
          section={sectionMap.contact}
          index={SECTION_INDEX.contact}
        />
      </main>

      <Footer meta={portfolio.meta} onScrollTo={scrollToSection} />

      <ExplorerPanel
        open={explorerOpen}
        onClose={closeExplorer}
        preview={preview}
        setPreview={setPreview}
        resetPreview={resetPreview}
        theme={theme}
        tier={performance.tier}
        override={performance.override}
        setOverride={performance.setOverride}
        sound={sound}
        reducedMotion={reducedMotion}
        effectiveReduced={effectiveReduced}
        motionOverride={motionOverride}
        setMotionOverride={setMotionOverride}
        tilt={tilt}
      />
    </div>
  )
}
