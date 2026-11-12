import { useEffect } from 'react'
import { scrollState } from '../utils/scrollStore.js'

function getSectionProgress(scrollY, sectionIds) {
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean)
  if (sections.length < 2) return null

  const lastIndex = sections.length - 1
  const tops = sections.map(
    (element) => element.getBoundingClientRect().top + window.scrollY,
  )

  if (scrollY <= tops[0]) return 0
  if (scrollY >= tops[lastIndex]) return 1

  let index = 0
  while (index < lastIndex - 1 && scrollY >= tops[index + 1]) {
    index += 1
  }

  const span = Math.max(1, tops[index + 1] - tops[index])
  const local = Math.min(1, Math.max(0, (scrollY - tops[index]) / span))
  return (index + local) / lastIndex
}

export function useScrollProgress({ enabled = true, sectionIds = [] } = {}) {
  useEffect(() => {
    const root = document.documentElement
    if (!enabled) {
      scrollState.progress = 0
      root.style.setProperty('--journey-progress', '0')
      return undefined
    }

    let frame = 0
    const update = () => {
      frame = 0
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const rawProgress = Math.min(1, Math.max(0, window.scrollY / max))
      const progress =
        getSectionProgress(window.scrollY, sectionIds) ?? rawProgress
      scrollState.progress = progress
      root.style.setProperty('--journey-progress', progress.toFixed(5))
    }
    const requestUpdate = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [enabled, sectionIds])
}
