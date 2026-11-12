import { useEffect, useRef, useState } from 'react'
import {
  formatBangladeshClock,
  formatBangladeshDate,
  getBangladeshParts,
} from '../utils/dateUtils.js'

export function useBangladeshTime({ intervalMs = 1000 } = {}) {
  const [now, setNow] = useState(() => new Date())
  const timerRef = useRef(0)

  useEffect(() => {
    let cancelled = false

    const tick = () => {
      if (!cancelled) setNow(new Date())
    }

    const start = () => {
      window.clearInterval(timerRef.current)
      timerRef.current = window.setInterval(tick, intervalMs)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        window.clearInterval(timerRef.current)
      } else {
        tick()
        start()
      }
    }

    start()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      cancelled = true
      window.clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [intervalMs])

  const parts = getBangladeshParts(now)

  return {
    now,
    parts,
    clock: formatBangladeshClock(now),
    dateLabel: formatBangladeshDate(now, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }
}
