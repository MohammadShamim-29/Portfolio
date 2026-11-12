import { GrassTuft, KashPlant, SapPot, Shapla } from './scenery.jsx'

const foregroundGrass = Array.from({ length: 42 }, (_, index) => ({
  x: index * 144 + 36,
  y: 486 - (index % 3) * 10,
  scale: 1.1 + (index % 5) * 0.28,
  delay: (index % 11) * 0.28,
}))

const reeds = Array.from({ length: 26 }, (_, index) => ({
  x: index * 232 + 90,
  y: 470,
  scale: 0.8 + (index % 4) * 0.22,
  delay: (index % 8) * 0.4,
}))

export function ForegroundLayer({ decorations = [], seasonId = 'borsha' }) {
  const decorationSet = new Set(decorations)
  const showKash =
    decorationSet.has('kash') ||
    seasonId === 'shorot' ||
    seasonId === 'hemonto'
  const showShapla =
    decorationSet.has('shapla') || seasonId === 'borsha'
  const showSapPot =
    decorationSet.has('sap-pot') || seasonId === 'sheet'
  const showBlossom =
    decorationSet.has('blossom') || seasonId === 'boshonto'

  return (
    <svg
      className="layer layer-foreground"
      viewBox="0 0 6000 500"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g className="foreground-reeds">
        {reeds.map((reed, index) => (
          <g key={index} transform={`translate(${reed.x} ${reed.y}) scale(${reed.scale})`}>
            <g className="reed-sway" style={{ animationDelay: `${reed.delay}s` }}>
              <path d="M0 0 C -4 -34 -8 -66 -4 -96 M0 0 C 2 -28 8 -54 16 -72 M0 0 C -8 -22 -14 -40 -24 -52" fill="none" stroke="var(--leaf)" strokeWidth="2.2" strokeLinecap="round" opacity="0.72" />
              <path d="M-4 -96 C -8 -104 -6 -110 0 -114 C 2 -106 0 -100 -4 -96Z" fill="var(--accent)" opacity="0.32" />
            </g>
          </g>
        ))}
      </g>

      {showKash ? (
        <g className="foreground-kash">
          {Array.from({ length: 16 }, (_, index) => (
            <KashPlant
              key={index}
              x={index * 376 + 60}
              y={486 - (index % 3) * 8}
              scale={1.3 + (index % 4) * 0.35}
              delay={(index % 7) * 0.45}
            />
          ))}
        </g>
      ) : null}

      {showShapla ? (
        <g className="foreground-shapla" opacity="0.9">
          <Shapla x={340} y={474} scale={1.7} delay={0.2} />
          <Shapla x={730} y={484} scale={1.35} delay={1.1} />
          <Shapla x={2140} y={478} scale={1.5} delay={0.7} />
          <Shapla x={3320} y={486} scale={1.2} delay={1.7} />
          <Shapla x={4680} y={480} scale={1.6} delay={0.4} />
          <Shapla x={5480} y={488} scale={1.3} delay={1.3} />
        </g>
      ) : null}

      {showSapPot ? (
        <g className="foreground-sap">
          <SapPot x={980} y={430} scale={1.4} delay={0.2} />
          <SapPot x={1030} y={418} scale={1.1} delay={1.1} />
          <SapPot x={4700} y={424} scale={1.3} delay={0.6} />
        </g>
      ) : null}

      {showBlossom ? (
        <g className="foreground-blossom">
          {Array.from({ length: 10 }, (_, index) => (
            <g
              key={index}
              transform={`translate(${index * 610 + 140} ${410 - (index % 3) * 20})`}
            >
              <g className="blossom-drift" style={{ animationDelay: `${(index % 5) * 0.7}s` }}>
                <circle cx="0" cy="0" r="4" fill="var(--accent)" opacity="0.55" />
                <circle cx="7" cy="3" r="3" fill="var(--accent-2)" opacity="0.42" />
                <circle cx="-6" cy="4" r="3.4" fill="var(--accent)" opacity="0.38" />
              </g>
            </g>
          ))}
        </g>
      ) : null}

      <g className="foreground-grass-main">
        {foregroundGrass.map((tuft, index) => (
          <GrassTuft
            key={index}
            x={tuft.x}
            y={tuft.y}
            scale={tuft.scale}
            delay={tuft.delay}
          />
        ))}
      </g>

      <g className="foreground-leaves" opacity="0.55">
        {Array.from({ length: 14 }, (_, index) => (
          <path
            key={index}
            d="M0 0 C 10 -8 22 -6 28 2 C 18 8 6 7 0 0Z"
            fill="var(--leaf)"
            transform={`translate(${index * 432 + 80} ${300 + (index % 4) * 34}) rotate(${(index % 5) * 18 - 30})`}
            className="leaf-sway"
            style={{ animationDelay: `${(index % 6) * 0.5}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
