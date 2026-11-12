import { useCallback, useEffect, useRef, useState } from 'react'

export function usePointerTilt({ enabled = true } = {}) {
  const targetRef = useRef(null)
  const frameRef = useRef(0)
  const valuesRef = useRef({ x: 0, y: 0 })
  const [deviceTiltState, setDeviceTiltState] = useState('off')
  const deviceHandlerRef = useRef(null)

  const apply = useCallback(() => {
    frameRef.current = 0
    const target = targetRef.current ?? document.documentElement
    target.style.setProperty('--tilt-x', valuesRef.current.x.toFixed(4))
    target.style.setProperty('--tilt-y', valuesRef.current.y.toFixed(4))
  }, [])

  const schedule = useCallback(() => {
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(apply)
  }, [apply])

  useEffect(() => {
    if (!enabled) return undefined

    const handlePointer = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      valuesRef.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      }
      schedule()
    }

    const handleLeave = () => {
      valuesRef.current = { x: 0, y: 0 }
      schedule()
    }

    window.addEventListener('pointermove', handlePointer, { passive: true })
    document.addEventListener('pointerleave', handleLeave)
    return () => {
      window.removeEventListener('pointermove', handlePointer)
      document.removeEventListener('pointerleave', handleLeave)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [enabled, schedule])

  const disableDeviceTilt = useCallback(() => {
    if (deviceHandlerRef.current) {
      window.removeEventListener('deviceorientation', deviceHandlerRef.current)
      deviceHandlerRef.current = null
    }
    setDeviceTiltState('off')
  }, [])

  const enableDeviceTilt = useCallback(async () => {
    if (
      typeof window === 'undefined' ||
      typeof window.DeviceOrientationEvent === 'undefined'
    ) {
      setDeviceTiltState('unsupported')
      return 'unsupported'
    }

    try {
      if (
        typeof window.DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const permission =
          await window.DeviceOrientationEvent.requestPermission()
        if (permission !== 'granted') {
          setDeviceTiltState('denied')
          return 'denied'
        }
      }

      const handler = (event) => {
        const gamma = Math.max(-30, Math.min(30, event.gamma ?? 0))
        const beta = Math.max(-30, Math.min(30, (event.beta ?? 0) - 45))
        valuesRef.current = {
          x: gamma / 30,
          y: beta / 30,
        }
        schedule()
      }
      deviceHandlerRef.current = handler
      window.addEventListener('deviceorientation', handler, { passive: true })
      setDeviceTiltState('on')
      return 'on'
    } catch {
      setDeviceTiltState('denied')
      return 'denied'
    }
  }, [schedule])

  useEffect(() => disableDeviceTilt, [disableDeviceTilt])

  return {
    targetRef,
    deviceTiltState,
    enableDeviceTilt,
    disableDeviceTilt,
  }
}
