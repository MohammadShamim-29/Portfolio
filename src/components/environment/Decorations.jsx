import decorativeText from '../../data/decorativeText.json'

function Crescent() {
  return (
    <svg className="decoration decoration-crescent" viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M62 12 A38 38 0 1 0 88 66 A30 30 0 0 1 62 12Z"
        fill="var(--accent)"
        opacity="0.55"
      />
      <circle cx="34" cy="30" r="1.4" fill="var(--star)" opacity="0.7" />
      <circle cx="25" cy="44" r="1" fill="var(--star)" opacity="0.5" />
      <circle cx="43" cy="52" r="1.2" fill="var(--star)" opacity="0.55" />
    </svg>
  )
}

function Lanterns() {
  const lanterns = [
    { left: '8%', delay: 0, scale: 1 },
    { left: '19%', delay: 1.2, scale: 0.78 },
    { left: '31%', delay: 2.1, scale: 0.9 },
    { left: '66%', delay: 0.6, scale: 0.82 },
    { left: '78%', delay: 1.8, scale: 1 },
    { left: '89%', delay: 2.6, scale: 0.72 },
  ]
  return (
    <div className="decoration decoration-lanterns">
      {lanterns.map((lantern, index) => (
        <div
          key={index}
          className="lantern"
          style={{
            left: lantern.left,
            transform: `scale(${lantern.scale})`,
            animationDelay: `${lantern.delay}s`,
          }}
        >
          <span className="lantern-wire" />
          <span className="lantern-body" />
          <span className="lantern-glow" />
        </div>
      ))}
    </div>
  )
}

function Geometric() {
  return <div className="decoration decoration-geometric" />
}

function FestiveLights() {
  return (
    <div className="decoration decoration-lights">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className="light-bulb"
          style={{
            left: `${(index / 17) * 100}%`,
            animationDelay: `${(index % 6) * 0.3}s`,
          }}
        />
      ))}
    </div>
  )
}

function Alpana() {
  return (
    <svg className="decoration decoration-alpana" viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.4">
        <circle cx="100" cy="100" r="84" />
        <circle cx="100" cy="100" r="64" />
        <circle cx="100" cy="100" r="42" />
        <circle cx="100" cy="100" r="20" />
        {Array.from({ length: 16 }, (_, index) => {
          const angle = (index / 16) * Math.PI * 2
          return (
            <g key={index} transform={`rotate(${(index / 16) * 360} 100 100)`}>
              <path d="M100 18 C 112 40 112 58 100 74 C 88 58 88 40 100 18Z" />
              <circle cx="100" cy="86" r="3" />
              <path
                d="M100 30 C 106 46 106 58 100 68"
                strokeDasharray="2 5"
                transform={`rotate(${angle * 0} 100 100)`}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

function Flag() {
  return (
    <div className="decoration decoration-flag" aria-hidden="true">
      <span className="flag-cloth">
        <span className="flag-disc" />
      </span>
    </div>
  )
}

function ShaheedMinar() {
  return (
    <svg className="decoration decoration-minar" viewBox="0 0 220 150" aria-hidden="true">
      <circle cx="110" cy="58" r="42" fill="var(--accent)" opacity="0.12" />
      <g fill="var(--shadow)" opacity="0.62">
        <rect x="14" y="92" width="192" height="7" rx="2" />
        <rect x="28" y="99" width="164" height="6" rx="2" />
        <path d="M96 92 L96 28 L104 16 L112 28 L112 92Z" />
        <path d="M70 92 L70 46 L78 38 L86 46 L86 92Z" />
        <path d="M122 92 L122 46 L130 38 L138 46 L138 92Z" />
        <path d="M46 92 L46 64 L54 56 L62 64 L62 92Z" />
        <path d="M146 92 L146 64 L154 56 L162 64 L162 92Z" />
        <circle cx="104" cy="46" r="2.4" fill="var(--accent)" opacity="0.7" />
      </g>
      <g fill="var(--accent)" opacity="0.38">
        <circle cx="40" cy="110" r="2" />
        <circle cx="58" cy="114" r="1.6" />
        <circle cx="164" cy="111" r="1.8" />
        <circle cx="182" cy="115" r="1.4" />
      </g>
    </svg>
  )
}

function MartyrsMemorial() {
  return (
    <svg className="decoration decoration-memorial" viewBox="0 0 240 140" aria-hidden="true">
      <g fill="var(--shadow)" opacity="0.56">
        <path d="M24 126 L48 44 L60 44 L60 126Z" />
        <path d="M66 126 L92 26 L104 26 L104 126Z" />
        <path d="M110 126 L136 8 L148 8 L148 126Z" />
        <path d="M154 126 L180 26 L192 26 L192 126Z" />
        <path d="M198 126 L222 44 L234 44 L234 126Z" />
        <rect x="12" y="126" width="216" height="8" rx="3" />
      </g>
      <circle cx="130" cy="70" r="48" fill="var(--accent)" opacity="0.1" />
    </svg>
  )
}

function FallingFlowers() {
  return (
    <div className="decoration decoration-flowers">
      {Array.from({ length: 14 }, (_, index) => (
        <span
          key={index}
          className="falling-flower"
          style={{
            left: `${(index / 13) * 100}%`,
            animationDelay: `${(index % 7) * 0.9}s`,
            animationDuration: `${7 + (index % 5) * 1.4}s`,
          }}
        />
      ))}
    </div>
  )
}

function FestiveConfetti() {
  return (
    <div className="decoration decoration-confetti">
      {Array.from({ length: 24 }, (_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            left: `${(index * 37) % 100}%`,
            animationDelay: `${(index % 9) * 0.5}s`,
            animationDuration: `${5 + (index % 6) * 0.8}s`,
            background:
              index % 3 === 0
                ? 'var(--accent)'
                : index % 3 === 1
                  ? 'var(--star)'
                  : 'var(--accent-2)',
          }}
        />
      ))}
    </div>
  )
}

function GoldenFields() {
  return <div className="decoration decoration-golden-fields" />
}

function Pitha() {
  return (
    <div className="decoration decoration-pitha">
      {Array.from({ length: 7 }, (_, index) => (
        <span
          key={index}
          className="pitha-shape"
          style={{
            left: `${8 + index * 13}%`,
            animationDelay: `${(index % 4) * 0.8}s`,
          }}
        />
      ))}
    </div>
  )
}

function DecorativeTypography({ eventId }) {
  const entry = decorativeText[eventId]
  if (!entry?.text) return null
  return (
    <div className="decoration decoration-typography" aria-hidden="true">
      <span className="decorative-bengali">{entry.text}</span>
    </div>
  )
}

export function Decorations({ decorations = [], eventId = null }) {
  if (!decorations.length) return null
  const has = (name) => decorations.includes(name)

  return (
    <div className="decorations" aria-hidden="true">
      {has('crescent') ? <Crescent /> : null}
      {has('lanterns') ? <Lanterns /> : null}
      {has('geometric') ? <Geometric /> : null}
      {has('festive-lights') ? <FestiveLights /> : null}
      {has('alpana') ? <Alpana /> : null}
      {has('red-white') ? <div className="decoration decoration-red-white" /> : null}
      {has('flag') ? <Flag /> : null}
      {has('shaheed-minar') ? <ShaheedMinar /> : null}
      {has('national-landmarks') ? <MartyrsMemorial /> : null}
      {has('flowers') ? <FallingFlowers /> : null}
      {has('festive') ? <FestiveConfetti /> : null}
      {has('golden-fields') || has('harvest') ? <GoldenFields /> : null}
      {has('pitha') ? <Pitha /> : null}
      {has('river-fog') ? <div className="decoration decoration-river-fog" /> : null}
      {has('decorative-typography') ? (
        <DecorativeTypography eventId={eventId} />
      ) : null}
    </div>
  )
}
