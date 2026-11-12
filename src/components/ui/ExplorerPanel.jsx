import { useEffect, useRef } from 'react'
import {
  Gauge,
  Info,
  MousePointer2,
  RotateCcw,
  Smartphone,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import {
  TIME_PREVIEW_OPTIONS,
  getTimeLabel,
} from '../../engines/timeEngine.js'
import { getExplorerThemes } from '../../engines/themeEngine.js'
import { getStatusLabel } from '../../engines/eventEngine.js'

const TIER_OPTIONS = [
  { id: null, label: 'Auto' },
  { id: 'full', label: 'Full' },
  { id: 'medium', label: 'Balanced' },
  { id: 'low', label: 'Light' },
]

function OptionButton({ active, children, onClick, ...props }) {
  return (
    <button
      type="button"
      className={`option-button ${active ? 'is-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  )
}

export function ExplorerPanel({
  open,
  onClose,
  preview,
  setPreview,
  resetPreview,
  theme,
  tier,
  override,
  setOverride,
  sound,
  reducedMotion,
  effectiveReduced,
  motionOverride,
  setMotionOverride,
  tilt,
}) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = [
        ...panel.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((element) => element.getClientRects().length > 0)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    document.body.classList.add('explorer-open')
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.classList.remove('explorer-open')
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [open, onClose])

  if (!open) return null

  const isManual = preview.mode === 'manual'
  const themeOptions = getExplorerThemes()
  const primary = theme?.primaryEvent
  const statusLabel = getStatusLabel(theme?.status)

  const selectTheme = (themeId) => {
    setPreview({
      mode: 'manual',
      themeId,
      timeId: preview.timeId || 'sunset',
    })
  }

  const selectTime = (timeId) => {
    setPreview({
      mode: 'manual',
      themeId: preview.themeId || 'normal',
      timeId,
    })
  }

  return (
    <div className="explorer-layer">
      <button
        type="button"
        className="explorer-backdrop"
        aria-label="Close the explorer"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        id="explorer-panel"
        className="explorer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explorer-title"
      >
        <div className="explorer-head">
          <div>
            <p className="panel-kicker">Live controls</p>
            <h2 id="explorer-title">Explore Bangladesh</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close the explorer"
          >
            <X size={18} />
          </button>
        </div>

        <div className={`preview-banner ${isManual ? 'is-manual' : ''}`}>
          <span className="preview-dot" aria-hidden="true" />
          <span>
            {isManual
              ? `Previewing ${theme?.previewLabel ?? 'a manual scene'}`
              : `Live from Dhaka · ${theme?.timeLabel} · ${theme?.seasonName}`}
          </span>
          {isManual ? (
            <button
              type="button"
              className="text-link"
              onClick={resetPreview}
            >
              <RotateCcw size={13} aria-hidden="true" />
              Return to live
            </button>
          ) : null}
        </div>

        <section className="explorer-section" aria-labelledby="explorer-time">
          <div className="explorer-section-head">
            <h3 id="explorer-time">
              <Sun size={15} aria-hidden="true" />
              Time of day
            </h3>
            <span>{getTimeLabel(theme?.phase)}</span>
          </div>
          <div className="option-grid">
            {TIME_PREVIEW_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                active={isManual && preview.timeId === option.id}
                onClick={() => selectTime(option.id)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </section>

        <section className="explorer-section" aria-labelledby="explorer-theme">
          <div className="explorer-section-head">
            <h3 id="explorer-theme">
              <Sparkles size={15} aria-hidden="true" />
              Event and season
            </h3>
            <span>{theme?.eventName}</span>
          </div>
          <div className="option-grid option-grid-wide">
            {themeOptions.map((option) => (
              <OptionButton
                key={option.id}
                active={isManual && preview.themeId === option.id}
                onClick={() => selectTheme(option.id)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </section>

        <section className="explorer-section" aria-labelledby="explorer-performance">
          <div className="explorer-section-head">
            <h3 id="explorer-performance">
              <Gauge size={15} aria-hidden="true" />
              Performance
            </h3>
            <span>Current: {tier}</span>
          </div>
          <div className="option-grid">
            {TIER_OPTIONS.map((option) => (
              <OptionButton
                key={option.id ?? 'auto'}
                active={
                  option.id === null ? override === null : override === option.id
                }
                onClick={() => setOverride(option.id)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
          <p className="explorer-help">
            Auto follows device capability and frame rate. Light disables the
            WebGL scene and most particles while keeping the landscape usable.
          </p>
        </section>

        <section className="explorer-section" aria-labelledby="explorer-sound">
          <div className="explorer-section-head">
            <h3 id="explorer-sound">
              {sound.enabled ? (
                <Volume2 size={15} aria-hidden="true" />
              ) : (
                <VolumeX size={15} aria-hidden="true" />
              )}
              Ambient sound
            </h3>
            <span>{sound.enabled ? 'On' : 'Muted'}</span>
          </div>
          <div className="sound-row">
            <button
              type="button"
              className={`option-button ${sound.enabled ? 'is-active' : ''}`}
              onClick={sound.toggle}
              aria-pressed={sound.enabled}
              disabled={!sound.supported}
            >
              {sound.enabled ? 'Mute' : 'Play'}
            </button>
            <label className="volume-control">
              <span>Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sound.volume}
                onChange={(event) => sound.setVolume(Number(event.target.value))}
                disabled={!sound.supported}
              />
            </label>
          </div>
          <p className="explorer-help">
            Synthesised ambience follows the river journey. Nothing plays
            until you choose Play.
          </p>
        </section>

        <section className="explorer-section" aria-labelledby="explorer-motion">
          <div className="explorer-section-head">
            <h3 id="explorer-motion">
              <MousePointer2 size={15} aria-hidden="true" />
              Motion
            </h3>
            <span>{effectiveReduced ? 'Reduced' : 'Full'}</span>
          </div>
          <p className="explorer-help">
            {tier === 'low' && reducedMotion && !motionOverride
              ? 'Light performance and reduced motion pause continuous animation. Enable full motion for this visit, or choose Balanced or Full above.'
              : tier === 'low' && !motionOverride
                ? 'Light performance disables continuous animation. Choose Balanced or Full above to enable it.'
                : reducedMotion && !motionOverride
                  ? 'Your device requests reduced motion. The journey still follows scroll; enable full motion for this visit to restore continuous animation.'
                  : motionOverride
                    ? 'Full motion is enabled for this visit. Continuous animation and pointer tilt are active.'
                    : 'Pointer tilt adds depth on desktop. Device tilt is optional and asks for permission on supported phones.'}
          </p>
          {reducedMotion ? (
            <button
              type="button"
              className={`option-button wide ${motionOverride ? 'is-active' : ''}`}
              onClick={() => setMotionOverride(!motionOverride)}
              aria-pressed={motionOverride}
            >
              {motionOverride ? 'Use reduced motion' : 'Enable full motion'}
            </button>
          ) : null}
          <button
            type="button"
            className={`option-button wide ${tilt.deviceTiltState === 'on' ? 'is-active' : ''}`}
            onClick={
              tilt.deviceTiltState === 'on'
                ? tilt.disableDeviceTilt
                : tilt.enableDeviceTilt
            }
            disabled={
              tilt.deviceTiltState === 'unsupported' ||
              tilt.deviceTiltState === 'denied'
            }
          >
            <Smartphone size={14} aria-hidden="true" />
            {tilt.deviceTiltState === 'on'
              ? 'Disable device tilt'
              : tilt.deviceTiltState === 'denied'
                ? 'Device tilt denied'
                : tilt.deviceTiltState === 'unsupported'
                  ? 'Device tilt unsupported'
                  : 'Enable device tilt'}
          </button>
        </section>

        {primary ? (
          <section className="explorer-section event-detail" aria-labelledby="explorer-event">
            <div className="explorer-section-head">
              <h3 id="explorer-event">
                <Info size={15} aria-hidden="true" />
                Today's event
              </h3>
              <span>{statusLabel}</span>
            </div>
            <p className="event-name">{primary.event.name}</p>
            <p>{primary.event.description}</p>
            <p className="event-source">
              {primary.occurrence.source ??
                primary.event.source ??
                'Date source not recorded.'}
            </p>
          </section>
        ) : null}

        <p className="explorer-note">
          The landscape reads the real date and time in Asia/Dhaka. Preview
          controls change only this visit and never alter the underlying data.
        </p>
      </aside>
    </div>
  )
}
