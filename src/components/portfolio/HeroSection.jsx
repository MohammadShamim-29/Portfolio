import {
  ArrowDown,
  ArrowUpRight,
  CloudRain,
  Moon,
  Sun,
  Wind,
} from 'lucide-react'
import { formatBangladeshTime } from '../../utils/dateUtils.js'
import { getSeasonProgress } from '../../engines/seasonEngine.js'
import { isPlaceholder } from '../../utils/contentUtils.js'

function Readout({ icon: Icon, label, value, detail }) {
  return (
    <div className="readout">
      <span className="readout-icon" aria-hidden="true">
        <Icon size={15} />
      </span>
      <span className="readout-copy">
        <span className="readout-label">{label}</span>
        <span className="readout-value">{value}</span>
        {detail ? <span className="readout-detail">{detail}</span> : null}
      </span>
    </div>
  )
}

function EnvironmentReadout({ theme }) {
  const times = theme?.sunData?.times ?? {}
  const sunrise = times.sunrise ? formatBangladeshTime(times.sunrise) : '—'
  const sunset = times.sunset ? formatBangladeshTime(times.sunset) : '—'
  const seasonProgress = Math.round(getSeasonProgress(theme.date) * 100)
  const moon = theme?.sunData?.moon
  const weather = theme?.weather
  const eventName = theme?.eventName ?? 'Normal Bangladesh'
  const eventStatus = theme?.estimated
    ? 'Estimated date'
    : theme?.status === 'manual-override'
      ? 'Manual date'
      : theme?.status === 'confirmed'
        ? 'Confirmed date'
        : null

  return (
    <div className="environment-readout" aria-label="Dhaka environment readout">
      <Readout
        icon={Sun}
        label="Sun"
        value={`${sunrise} — ${sunset}`}
        detail={`Solar noon ${times.solarNoon ? formatBangladeshTime(times.solarNoon) : '—'} · Dhaka`}
      />
      <Readout
        icon={Wind}
        label="Season"
        value={theme?.seasonName ?? 'Bangladesh'}
        detail={`${theme?.season?.english ?? ''} · ${seasonProgress}% through`}
      />
      <Readout
        icon={CloudRain}
        label="Weather"
        value={weather?.label ?? 'Clear skies'}
        detail={`Cloud ${Math.round((weather?.cloudCover ?? 0) * 100)}% · Rain ${Math.round((weather?.rainRate ?? 0) * 100)}%`}
      />
      <Readout
        icon={Moon}
        label="Moon"
        value={moon?.phaseName ?? '—'}
        detail={
          moon
            ? `${Math.round((moon.fraction ?? 0) * 100)}% illuminated`
            : 'Position unavailable'
        }
      />
      <Readout
        icon={ArrowUpRight}
        label="Today"
        value={eventName}
        detail={
          eventStatus
            ? `${eventStatus}${theme?.primaryEvent?.occurrence?.source ? ' · source checked' : ''}`
            : `${theme?.timeLabel ?? ''} in Dhaka`
        }
      />
    </div>
  )
}

export function HeroSection({ hero, theme, onScrollTo }) {
  return (
    <section
      id="hero"
      className="journey-section hero-section align-left"
      aria-labelledby="hero-title"
      tabIndex={-1}
    >
      <div className="hero-content">
        <p className="hero-eyebrow">
          <span className="eyebrow-line" aria-hidden="true" />
          {hero.eyebrow}
        </p>
        <h1 id="hero-title">{hero.headline}</h1>
        {hero.subheadline ? (
          <p
            className={`hero-subheadline ${isPlaceholder(hero.subheadline) ? 'is-placeholder' : ''}`}
          >
            {hero.subheadline}
          </p>
        ) : null}
        {hero.focus?.length ? (
          <ul className="hero-focus" aria-label="Areas of focus">
            {hero.focus.map((item) => (
              <li
                key={item}
                className={isPlaceholder(item) ? 'is-placeholder' : undefined}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <p className={`hero-lede ${isPlaceholder(hero.description) ? 'is-placeholder' : ''}`}>
          {hero.description}
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={() => onScrollTo('projects')}
          >
            {hero.primaryCta}
            <ArrowDown size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => onScrollTo('contact')}
          >
            {hero.secondaryCta}
          </button>
        </div>
        <p className="hero-note">{hero.note}</p>
        <EnvironmentReadout theme={theme} />
      </div>

      <button
        type="button"
        className="scroll-cue"
        onClick={() => onScrollTo('about')}
        aria-label="Scroll to the village section"
      >
        <span className="scroll-cue-line" aria-hidden="true" />
        <span>Follow the river</span>
        <ArrowDown size={14} aria-hidden="true" />
      </button>
    </section>
  )
}
