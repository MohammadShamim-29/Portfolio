import { SlidersHorizontal, Volume2, VolumeX } from 'lucide-react'

function EventBadge({ theme }) {
  if (!theme?.event || theme.eventName === 'Normal Bangladesh') return null
  const statusLabel = theme.estimated
    ? 'Estimated date'
    : theme.status === 'manual-override'
      ? 'Manual date'
      : theme.status === 'confirmed'
        ? 'Confirmed date'
        : null
  return (
    <span className="chip chip-event" title={statusLabel ?? undefined}>
      <span className="chip-spark" aria-hidden="true" />
      {theme.eventName}
      {statusLabel ? <em>{statusLabel}</em> : null}
    </span>
  )
}

export function TopBar({
  theme,
  clock,
  dateLabel,
  sound,
  onOpenExplorer,
  explorerOpen,
}) {
  return (
    <header className="top-bar">
      <a className="brand" href="#hero" aria-label="BANGLADESH 24, back to the river">
        <span className="brand-mark" aria-hidden="true">
          24
        </span>
        <span className="brand-text">
          <span className="brand-name">
            BANGLADESH <em>24</em>
          </span>
          <span className="brand-sub">Shamim · a living portfolio</span>
        </span>
      </a>

      <div className="live-cluster" aria-label="Live Dhaka conditions">
        <span className="live-dot" aria-hidden="true" />
        <span className="live-time">
          <span className="live-clock">{clock}</span>
          <span className="live-date">{dateLabel} · Dhaka</span>
        </span>
        <span className="live-chips">
          <span className="chip">{theme?.timeLabel}</span>
          <span className="chip">{theme?.seasonName}</span>
          <span className="chip chip-weather">{theme?.weather?.label}</span>
          <EventBadge theme={theme} />
        </span>
      </div>

      <div className="top-actions">
        <button
          type="button"
          className="icon-button sound-button"
          onClick={sound.toggle}
          aria-pressed={sound.enabled}
          aria-label={sound.label}
          title={sound.supported ? sound.label : 'Ambient sound is unavailable'}
          disabled={!sound.supported}
        >
          {sound.enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          <span className="button-label">
            {sound.enabled ? 'Sound on' : 'Sound off'}
          </span>
        </button>
        <button
          type="button"
          className={`icon-button explorer-button ${explorerOpen ? 'is-active' : ''}`}
          onClick={onOpenExplorer}
          aria-expanded={explorerOpen}
          aria-controls="explorer-panel"
        >
          <SlidersHorizontal size={17} />
          <span className="button-label">Explore</span>
        </button>
      </div>
    </header>
  )
}
