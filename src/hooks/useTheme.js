import { useEffect, useMemo, useState } from 'react'
import { getActiveEvents } from '../engines/eventEngine.js'
import { getSeasonForDate } from '../engines/seasonEngine.js'
import { getSunData } from '../engines/sunEngine.js'
import { getTimeState } from '../engines/timeEngine.js'
import { resolveTheme, getDefaultPreview } from '../engines/themeEngine.js'
import { getWeather } from '../engines/weatherEngine.js'

export function useTheme(preview = getDefaultPreview()) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer = 0
    const tick = () => setNow(new Date())
    const start = () => {
      window.clearInterval(timer)
      timer = window.setInterval(tick, 30000)
    }
    const handleVisibility = () => {
      if (document.hidden) {
        window.clearInterval(timer)
      } else {
        tick()
        start()
      }
    }
    start()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return useMemo(() => {
    const sunData = getSunData(now)
    const timeState = getTimeState(sunData)
    const season = getSeasonForDate(now)
    const activeEvents = getActiveEvents(now)
    const weather = getWeather(now, season, sunData)
    return resolveTheme({
      date: now,
      sunData,
      timeState,
      season,
      activeEvents,
      weather,
      preview,
    })
  }, [now, preview])
}
