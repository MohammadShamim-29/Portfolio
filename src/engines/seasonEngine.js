import seasonsData from '../data/seasons.json'
import {
  getBangladeshParts,
  isMonthDayBetween,
  makeBangladeshDateKey,
} from '../utils/dateUtils.js'

const pad = (value) => String(value).padStart(2, '0')

export const SEASON_CALENDAR_CONVENTION = seasonsData.calendarConvention

export function getSeasons() {
  return seasonsData.seasons
}

export function getSeasonById(id) {
  return seasonsData.seasons.find((season) => season.id === id) ?? null
}

export function getSeasonForDate(date = new Date()) {
  const parts = getBangladeshParts(date)
  return getSeasonForMonthDay(parts.monthDay)
}

export function getSeasonForMonthDay(monthDay) {
  return (
    seasonsData.seasons.find((season) => {
      const start = `${pad(season.start.month)}-${pad(season.start.day)}`
      const end = `${pad(season.end.month)}-${pad(season.end.day)}`
      return isMonthDayBetween(monthDay, start, end)
    }) ?? seasonsData.seasons[0]
  )
}

export function getSeasonStartKey(season, year) {
  return makeBangladeshDateKey(year, season.start.month, season.start.day)
}

export function getSeasonProgress(date = new Date()) {
  const parts = getBangladeshParts(date)
  const season = getSeasonForMonthDay(parts.monthDay)
  const cursor = Date.UTC(parts.year, parts.month - 1, parts.day)

  let start = Date.UTC(parts.year, season.start.month - 1, season.start.day)
  if (start > cursor) {
    start = Date.UTC(
      parts.year - 1,
      season.start.month - 1,
      season.start.day,
    )
  }

  let end = Date.UTC(
    parts.year,
    season.end.month - 1,
    season.end.day,
  )
  if (end <= start) {
    end = Date.UTC(
      parts.year + 1,
      season.end.month - 1,
      season.end.day,
    )
  }

  const total = end - start
  return total <= 0 ? 0 : Math.min(1, Math.max(0, (cursor - start) / total))
}

export function getSeasonThemeIds() {
  return seasonsData.seasons.map((season) => season.id)
}
