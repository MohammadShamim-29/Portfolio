import eventsData from '../data/events.json'
import {
  getBangladeshParts,
  isDateKeyBetween,
  isMonthDayBetween,
  parseDateKey,
  toDateKey,
} from '../utils/dateUtils.js'

const VALID_STATUSES = new Set(['confirmed', 'estimated', 'manual-override'])
const VALID_RECURRENCES = new Set(['annual-fixed', 'lunar', 'dated'])

export const EVENT_CATEGORY_PRIORITY = eventsData.categoryPriority

const pad = (value) => String(value).padStart(2, '0')

function getDateContext(input = new Date()) {
  if (input instanceof Date) {
    return getBangladeshParts(input)
  }
  if (typeof input === 'string') {
    const parts = parseDateKey(input)
    return {
      year: parts.year,
      month: parts.month,
      day: parts.day,
      dateKey: input,
      monthDay: `${pad(parts.month)}-${pad(parts.day)}`,
    }
  }
  throw new TypeError('Event engine expects a Date or YYYY-MM-DD string')
}

export function getEventCatalog(data = eventsData) {
  return data.events ?? []
}

export function getEventById(id, data = eventsData) {
  return getEventCatalog(data).find((event) => event.id === id) ?? null
}

export function getOccurrenceForEvent(event, context) {
  if (event.recurrence === 'annual-fixed') {
    if (!event.annual?.start || !event.annual?.end) return null
    if (
      !isMonthDayBetween(
        context.monthDay,
        event.annual.start,
        event.annual.end,
      )
    ) {
      return null
    }

    const startWraps = event.annual.start > event.annual.end
    const startYear =
      startWraps && context.monthDay < event.annual.start
        ? context.year - 1
        : context.year
    const endYear =
      startWraps && context.monthDay >= event.annual.start
        ? context.year + 1
        : context.year

    return {
      start: `${startYear}-${event.annual.start}`,
      end: `${endYear}-${event.annual.end}`,
      status: event.status ?? 'estimated',
      source: event.source ?? null,
    }
  }

  if (event.recurrence === 'lunar' || event.recurrence === 'dated') {
    const occurrence = (event.dates ?? []).find(
      (entry) => entry.year === context.year,
    )
    if (!occurrence) return null
    if (!isDateKeyBetween(context.dateKey, occurrence.start, occurrence.end)) {
      return null
    }
    return occurrence
  }

  return null
}

export function getActiveEvents(input = new Date(), data = eventsData, options = {}) {
  const context = getDateContext(input)
  const includeDisabled = Boolean(options.includeDisabled)
  const active = []

  for (const event of getEventCatalog(data)) {
    if (!event.enabled && !includeDisabled) continue
    const occurrence = getOccurrenceForEvent(event, context)
    if (!occurrence) continue

    const status = occurrence.status ?? event.status ?? 'estimated'
    active.push({
      event,
      occurrence,
      status,
      estimated: status === 'estimated',
      manualOverride: status === 'manual-override',
      active: true,
    })
  }

  return active.sort((a, b) => {
    if (b.event.priority !== a.event.priority) {
      return b.event.priority - a.event.priority
    }
    const categoryDelta =
      (EVENT_CATEGORY_PRIORITY[b.event.category] ?? 0) -
      (EVENT_CATEGORY_PRIORITY[a.event.category] ?? 0)
    if (categoryDelta !== 0) return categoryDelta
    return a.event.name.localeCompare(b.event.name)
  })
}

export function getPrimaryEvent(activeEvents) {
  return (
    activeEvents.find(
      (entry) =>
        entry.event.major !== false && entry.event.category !== 'seasonal',
    ) ?? null
  )
}

export function getMajorEvents(activeEvents) {
  return activeEvents.filter(
    (entry) =>
      entry.event.major !== false && entry.event.category !== 'seasonal',
  )
}

export function getSeasonalEvents(activeEvents) {
  return activeEvents.filter((entry) => entry.event.category === 'seasonal')
}

export function getEventDecorations(activeEvents) {
  const decorations = new Set()
  for (const entry of getMajorEvents(activeEvents)) {
    for (const decoration of entry.event.visual?.decorations ?? []) {
      decorations.add(decoration)
    }
  }
  return [...decorations]
}

export function getActiveEventStatus(activeEvents) {
  const major = getMajorEvents(activeEvents)
  if (major.some((entry) => entry.status === 'estimated')) return 'estimated'
  if (major.some((entry) => entry.status === 'manual-override')) {
    return 'manual-override'
  }
  if (major.length > 0) return 'confirmed'
  return null
}

export function getStatusLabel(status) {
  if (status === 'estimated') return 'Estimated date'
  if (status === 'manual-override') return 'Manual date'
  if (status === 'confirmed') return 'Confirmed date'
  return 'No active event'
}

export function getUpcomingEvents(input = new Date(), data = eventsData, days = 45) {
  const context = getDateContext(input)
  const currentKey = toDateKey(input instanceof Date ? input : input)
  const currentActive = new Set(
    getActiveEvents(input, data).map((entry) => entry.event.id),
  )
  const upcoming = []
  const seen = new Set()

  for (let offset = 1; offset <= days; offset += 1) {
    const date = new Date(
      Date.UTC(context.year, context.month - 1, context.day + offset),
    )
    const key = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
    const active = getActiveEvents(key, data)
    for (const entry of active) {
      if (currentActive.has(entry.event.id) || seen.has(entry.event.id)) continue
      seen.add(entry.event.id)
      upcoming.push({ ...entry, startsInDays: offset, startKey: key })
    }
  }

  return upcoming
}

export function getEventOccurrencesForYear(year, data = eventsData) {
  const occurrences = []
  for (const event of getEventCatalog(data)) {
    if (event.recurrence === 'annual-fixed') {
      if (!event.annual) continue
      const startWraps = event.annual.start > event.annual.end
      occurrences.push({
        eventId: event.id,
        name: event.name,
        year,
        start: `${year}-${event.annual.start}`,
        end: `${startWraps ? year + 1 : year}-${event.annual.end}`,
        status: event.status ?? 'estimated',
      })
      continue
    }
    for (const entry of event.dates ?? []) {
      if (entry.year === year) {
        occurrences.push({ eventId: event.id, name: event.name, ...entry })
      }
    }
  }
  return occurrences
}

export function validateEventsData(data = eventsData) {
  const errors = []
  const ids = new Set()

  for (const event of getEventCatalog(data)) {
    if (!event.id) errors.push('Event is missing an id')
    if (ids.has(event.id)) errors.push(`Duplicate event id: ${event.id}`)
    ids.add(event.id)
    if (!VALID_RECURRENCES.has(event.recurrence)) {
      errors.push(`${event.id}: invalid recurrence ${event.recurrence}`)
    }
    if (typeof event.priority !== 'number') {
      errors.push(`${event.id}: priority must be a number`)
    }
    if (event.recurrence === 'annual-fixed') {
      if (!event.annual?.start || !event.annual?.end) {
        errors.push(`${event.id}: annual dates missing`)
      } else {
        for (const value of [event.annual.start, event.annual.end]) {
          if (!/^\d{2}-\d{2}$/.test(value)) {
            errors.push(`${event.id}: invalid annual date ${value}`)
          }
        }
      }
      if (!VALID_STATUSES.has(event.status)) {
        errors.push(`${event.id}: invalid event status ${event.status}`)
      }
    }
    if (event.recurrence === 'lunar' || event.recurrence === 'dated') {
      if (!Array.isArray(event.dates) || event.dates.length === 0) {
        errors.push(`${event.id}: dated event needs dates`)
      }
      for (const entry of event.dates ?? []) {
        if (!VALID_STATUSES.has(entry.status)) {
          errors.push(`${event.id}: invalid occurrence status ${entry.status}`)
        }
        try {
          parseDateKey(entry.start)
          parseDateKey(entry.end)
        } catch {
          errors.push(`${event.id}: invalid occurrence date range`)
        }
        if (entry.start > entry.end) {
          errors.push(`${event.id}: occurrence starts after it ends`)
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}
