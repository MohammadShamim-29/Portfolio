import { useEffect } from 'react'
import { scrollState } from '../utils/scrollStore.js'

export function useScrollProgress({ enabled = true } = {}) {
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
      const progress = Math.min(1, Math.max(0, window.scrollY / max))
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
  }, [enabled])
}
