import { useCallback, useEffect, useState } from 'react'

export function useActiveSection(sectionIds, { enabled = true } = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null)

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return undefined

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (elements.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -42% 0px', threshold: [0.1, 0.35, 0.6] },
    )

    for (const element of elements) observer.observe(element)
    return () => observer.disconnect()
  }, [enabled, sectionIds])

  const scrollToSection = useCallback(
    (id) => {
      const element = document.getElementById(id)
      if (!element) return
      const reduced = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      )?.matches
      element.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
      window.setTimeout(() => {
        element.setAttribute('tabindex', '-1')
        element.focus({ preventScroll: true })
      }, reduced ? 0 : 700)
    },
    [],
  )

  return { activeId, setActiveId, scrollToSection }
}
