import { useMemo } from 'react'
import {
  getActiveEventStatus,
  getActiveEvents,
  getPrimaryEvent,
} from '../engines/eventEngine.js'

export function useCurrentEvent(date) {
  return useMemo(() => {
    const activeEvents = getActiveEvents(date)
    const primary = getPrimaryEvent(activeEvents)
    const status = getActiveEventStatus(activeEvents)
    return {
      activeEvents,
      primary,
      status,
      estimated: status === 'estimated',
      eventName: primary?.event.name ?? 'Normal Bangladesh',
      eventId: primary?.event.id ?? null,
    }
  }, [date])
}
