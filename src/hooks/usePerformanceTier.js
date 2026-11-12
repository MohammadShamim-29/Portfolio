import { useEffect, useRef, useState } from 'react'
import { animationEngine } from '../engines/animationEngine.js'
import {
  createFrameMonitor,
  detectPerformanceTier,
  getStoredTier,
  setStoredTier,
} from '../utils/performanceUtils.js'

export function usePerformanceTier() {
  const [autoTier, setAutoTier] = useState('medium')
  const [override, setOverrideState] = useState(() => getStoredTier())
  const downgradedRef = useRef(false)

  useEffect(() => {
    const detected = detectPerformanceTier()
    setAutoTier(detected)

    const media =
      window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null
    const handleMotionPreference = () => {
      setAutoTier(detectPerformanceTier())
    }
    media?.addEventListener?.('change', handleMotionPreference)
    return () => media?.removeEventListener?.('change', handleMotionPreference)
  }, [])

  useEffect(() => {
    if (override) return undefined
    const monitor = createFrameMonitor({
      threshold: 29,
      sampleWindow: 150,
      onSlow: () => {
        if (downgradedRef.current) return
        downgradedRef.current = true
        setAutoTier((current) => {
          if (current === 'full') return 'medium'
          if (current === 'medium') return 'low'
          return current
        })
      },
    })
    return animationEngine.addSampler(monitor)
  }, [override])

  const setOverride = (next) => {
    setOverrideState(next)
    setStoredTier(next)
    downgradedRef.current = false
  }

  const tier = override ?? autoTier
  return {
    tier,
    autoTier,
    override,
    setOverride,
    isManual: Boolean(override),
  }
}
