import { useEffect, useState } from 'react'
import { getPreferredReducedMotion } from '../utils/performanceUtils.js'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => getPreferredReducedMotion())

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event) => setReduced(event.matches)
    media.addEventListener?.('change', handleChange)
    return () => media.removeEventListener?.('change', handleChange)
  }, [])

  return reduced
}
