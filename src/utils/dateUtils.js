export const BANGLADESH_TIME_ZONE = 'Asia/Dhaka'
export const BANGLADESH_UTC_OFFSET_MINUTES = 360
export const BANGLADESH_UTC_OFFSET_LABEL = 'UTC+06:00'

const partsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: BANGLADESH_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

const weekdayFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: BANGLADESH_TIME_ZONE,
  weekday: 'short',
})

const pad = (value) => String(value).padStart(2, '0')

const toNumber = (value) => Number.parseInt(value, 10)

export function getBangladeshParts(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('getBangladeshParts expects a valid Date')
  }

  const parts = Object.fromEntries(
    partsFormatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )

  const hour = toNumber(parts.hour) % 24
  const minute = toNumber(parts.minute)
  const second = toNumber(parts.second)

  return {
    year: toNumber(parts.year),
    month: toNumber(parts.month),
    day: toNumber(parts.day),
    hour,
    minute,
    second,
    weekday: weekdayFormatter.format(date),
    dateKey: `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`,
    monthDay: `${pad(parts.month)}-${pad(parts.day)}`,
    minutesOfDay: hour * 60 + minute,
    secondsOfDay: hour * 3600 + minute * 60 + second,
  }
}

export function makeBangladeshDateKey(year, month, day) {
  return `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`
}

export function getBangladeshDateKey(date = new Date()) {
  return getBangladeshParts(date).dateKey
}

export function bangladeshDateTimeToDate({
  year,
  month,
  day,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0,
}) {
  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hour - BANGLADESH_UTC_OFFSET_MINUTES / 60,
      minute,
      second,
      millisecond,
    ),
  )
}

export function getBangladeshStartOfDay(date = new Date()) {
  const parts = getBangladeshParts(date)
  return bangladeshDateTimeToDate({
    year: parts.year,
    month: parts.month,
    day: parts.day,
  })
}

export function getBangladeshNoon(date = new Date()) {
  const parts = getBangladeshParts(date)
  return bangladeshDateTimeToDate({
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: 12,
  })
}

export function parseDateKey(dateKey) {
  if (typeof dateKey !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    throw new TypeError(`Invalid date key: ${dateKey}`)
  }
  const [year, month, day] = dateKey.split('-').map(toNumber)
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new RangeError(`Invalid date key: ${dateKey}`)
  }
  const check = new Date(Date.UTC(year, month - 1, day))
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new RangeError(`Invalid date key: ${dateKey}`)
  }
  return { year, month, day }
}

export function addDaysToDateKey(dateKey, days) {
  const { year, month, day } = parseDateKey(dateKey)
  const next = new Date(Date.UTC(year, month - 1, day + days))
  return makeBangladeshDateKey(
    next.getUTCFullYear(),
    next.getUTCMonth() + 1,
    next.getUTCDate(),
  )
}

export function monthDayFromDateKey(dateKey) {
  const { month, day } = parseDateKey(dateKey)
  return `${pad(month)}-${pad(day)}`
}

export function compareDateKeys(a, b) {
  if (a === b) return 0
  return a < b ? -1 : 1
}

export function isDateKeyBetween(dateKey, startKey, endKey) {
  if (startKey <= endKey) {
    return dateKey >= startKey && dateKey <= endKey
  }
  return dateKey >= startKey || dateKey <= endKey
}

export function isMonthDayBetween(monthDay, startMonthDay, endMonthDay) {
  if (startMonthDay <= endMonthDay) {
    return monthDay >= startMonthDay && monthDay <= endMonthDay
  }
  return monthDay >= startMonthDay || monthDay <= endMonthDay
}

export function formatBangladeshDate(date = new Date(), options = {}) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: BANGLADESH_TIME_ZONE,
    ...options,
  }).format(date)
}

export function formatBangladeshTime(date = new Date(), options = {}) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: BANGLADESH_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    ...options,
  }).format(date)
}

export function formatBangladeshClock(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: BANGLADESH_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date)
}

export function getBangladeshHourFloat(date = new Date()) {
  const parts = getBangladeshParts(date)
  return parts.hour + parts.minute / 60 + parts.second / 3600
}

export function minutesBetween(a, b) {
  return Math.abs(a.getTime() - b.getTime()) / 60000
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function toDateKey(value) {
  if (typeof value === 'string') {
    parseDateKey(value)
    return value
  }
  if (value instanceof Date) {
    return getBangladeshDateKey(value)
  }
  throw new TypeError('toDateKey expects a Date or YYYY-MM-DD string')
}
