const fill = (variable) => `var(${variable})`

export function PalmTree({ x, y, scale = 1, delay = 0, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className="tree-sway" style={{ animationDelay: `${delay}s` }}>
        <path
          d="M0 0 C -4 -32 -6 -63 -1 -96"
          fill="none"
          stroke={fill('--leaf')}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M-1 -96 C -26 -112 -52 -106 -66 -88 C -42 -92 -20 -91 -1 -96Z"
          fill={fill('--leaf')}
          opacity=".9"
        />
        <path
          d="M-1 -96 C 22 -113 49 -107 62 -90 C 38 -94 18 -92 -1 -96Z"
          fill={fill('--leaf')}
          opacity=".82"
        />
        <path
          d="M-1 -96 C -18 -123 -12 -143 2 -154 C 2 -132 3 -114 -1 -96Z"
          fill={fill('--leaf')}
          opacity=".75"
        />
        <path
          d="M-1 -96 C 18 -122 36 -129 51 -121 C 31 -116 14 -106 -1 -96Z"
          fill={fill('--leaf')}
          opacity=".68"
        />
        <path
          d="M-1 -96 C -28 -119 -48 -121 -62 -113 C -39 -110 -18 -103 -1 -96Z"
          fill={fill('--leaf')}
          opacity=".62"
        />
      </g>
    </g>
  )
}

export function BananaTree({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="tree-sway" style={{ animationDelay: `${delay}s` }}>
        <path
          d="M0 0 C 2 -26 -2 -50 2 -72"
          stroke={fill('--leaf')}
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M1 -70 C -26 -83 -42 -104 -43 -122 C -26 -106 -10 -92 4 -78Z"
          fill={fill('--leaf')}
          opacity=".88"
        />
        <path
          d="M2 -68 C 28 -80 47 -98 52 -118 C 32 -102 16 -90 -1 -77Z"
          fill={fill('--leaf')}
          opacity=".75"
        />
        <path
          d="M2 -62 C -18 -66 -37 -60 -48 -47 C -28 -51 -12 -53 1 -57Z"
          fill={fill('--leaf')}
          opacity=".7"
        />
        <path
          d="M2 -58 C 22 -64 39 -58 49 -46 C 31 -50 15 -52 1 -54Z"
          fill={fill('--leaf')}
          opacity=".62"
        />
      </g>
    </g>
  )
}

export function BetelPalm({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="tree-sway-slow" style={{ animationDelay: `${delay}s` }}>
        <path
          d="M0 0 C 3 -40 1 -82 4 -118"
          stroke={fill('--leaf')}
          strokeWidth="3.5"
          fill="none"
        />
        <path
          d="M4 -118 C -9 -129 -17 -136 -23 -144 C -9 -137 -2 -130 4 -124Z"
          fill={fill('--leaf')}
          opacity=".8"
        />
        <path
          d="M4 -118 C 16 -130 25 -136 32 -142 C 20 -133 11 -127 4 -122Z"
          fill={fill('--leaf')}
          opacity=".7"
        />
        <path
          d="M4 -118 C -4 -130 -3 -140 3 -149 C 9 -139 8 -128 4 -118Z"
          fill={fill('--leaf')}
          opacity=".65"
        />
        <circle cx="4" cy="-112" r="4" fill={fill('--accent')} opacity=".45" />
        <circle cx="1" cy="-106" r="3.4" fill={fill('--accent')} opacity=".35" />
      </g>
    </g>
  )
}

export function TinHouse({ x, y, scale = 1, flip = false, lights = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <rect x="-42" y="-52" width="84" height="52" fill={fill('--city')} opacity=".9" />
      <path d="M-50 -52 L0 -74 L50 -52Z" fill={fill('--shadow')} />
      <path d="M-50 -52 L0 -74 L50 -52" fill="none" stroke={fill('--accent')} strokeWidth="2" opacity=".35" />
      <path d="M-42 -50 L42 -50" stroke={fill('--accent')} strokeWidth="1" opacity=".18" />
      <path d="M-24 -50 L-24 -72 M-8 -50 L-8 -70 M8 -50 L8 -70 M24 -50 L24 -72" stroke={fill('--shadow')} strokeWidth="1.2" opacity=".45" />
      <rect x="-11" y="-29" width="22" height="29" fill={fill('--shadow')} opacity=".85" />
      {lights ? (
        <>
          <rect className="window-light" x="18" y="-40" width="12" height="10" fill={fill('--window-light')} opacity=".8" />
          <rect className="window-light" x="-32" y="-40" width="12" height="10" fill={fill('--window-light')} opacity=".55" />
        </>
      ) : null}
      <path d="M-42 -3 L42 -3" stroke={fill('--shadow')} strokeWidth="4" opacity=".35" />
    </g>
  )
}

export function MudHouse({ x, y, scale = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <path d="M-38 0 L-38 -44 C -38 -58 38 -58 38 -44 L38 0Z" fill={fill('--city')} opacity=".82" />
      <path d="M-46 -44 C -26 -70 26 -70 46 -44 C 20 -54 -20 -54 -46 -44Z" fill={fill('--shadow')} opacity=".9" />
      <rect x="-9" y="-26" width="18" height="26" fill={fill('--shadow')} opacity=".8" />
      <rect x="16" y="-36" width="11" height="9" fill={fill('--window-light')} opacity=".6" />
      <path d="M-38 -6 L38 -6" stroke={fill('--shadow')} strokeWidth="3" opacity=".28" />
    </g>
  )
}

export function Boat({ x, y, scale = 1, flip = false, sail = true, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className="boat-bob" style={{ animationDelay: `${delay}s` }}>
        <path
          d="M-58 0 C -40 14 38 15 58 0 C 34 7 -34 7 -58 0Z"
          fill={fill('--shadow')}
          opacity=".92"
        />
        <path d="M-52 -2 L52 -2 L42 6 L-44 6Z" fill={fill('--accent')} opacity=".52" />
        <path d="M-34 -2 L-30 -26 L-24 -26 L-22 -2" fill="none" stroke={fill('--shadow')} strokeWidth="2" opacity=".5" />
        {sail ? (
          <path d="M-26 -24 L-26 -78 L8 -30 Z" fill={fill('--star')} opacity=".2" stroke={fill('--star')} strokeWidth=".8" />
        ) : null}
        <path d="M28 -3 C 36 -18 44 -16 48 -3" fill="none" stroke={fill('--shadow')} strokeWidth="2" opacity=".55" />
        <circle cx="48" cy="-16" r="4" fill={fill('--shadow')} opacity=".8" />
        <path d="M-52 9 C -22 14 22 14 52 9" fill="none" stroke={fill('--star')} strokeWidth="1.4" opacity=".22" className="wake" />
        <path d="M-64 13 C -28 20 28 20 64 13" fill="none" stroke={fill('--star')} strokeWidth="1" opacity=".12" className="wake" />
      </g>
    </g>
  )
}

export function Fisherman({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="cast-net" style={{ animationDelay: `${delay}s` }}>
        <circle cx="0" cy="-24" r="3.4" fill={fill('--shadow')} />
        <path d="M0 -21 C 2 -15 5 -12 7 -9" stroke={fill('--shadow')} strokeWidth="3" fill="none" />
        <path d="M7 -9 L17 4 M7 -9 L-4 5" stroke={fill('--shadow')} strokeWidth="2" />
        <path d="M-16 6 C -2 -4 12 -4 24 6 C 10 12 -2 12 -16 6Z" fill="none" stroke={fill('--star')} strokeWidth="1" opacity=".35" />
        <path d="M-13 7 L-2 2 L10 8 M-4 2 L2 10 M8 4 L14 9" stroke={fill('--star')} strokeWidth=".7" opacity=".25" />
      </g>
    </g>
  )
}

export function Farmer({ x, y, scale = 1, delay = 0, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className="farmer-work" style={{ animationDelay: `${delay}s` }}>
        <circle cx="0" cy="-28" r="4" fill={fill('--shadow')} />
        <path d="M-8 -31 Q0 -39 8 -31Z" fill={fill('--accent')} opacity=".7" />
        <path d="M0 -24 C -2 -17 -3 -12 -3 -7" stroke={fill('--shadow')} strokeWidth="5" strokeLinecap="round" />
        <path d="M-1 -16 L10 -8" stroke={fill('--shadow')} strokeWidth="2.6" />
        <path d="M-3 -7 L-8 2 M-3 -7 L3 2" stroke={fill('--shadow')} strokeWidth="2.4" />
        <path d="M10 -8 L18 3" stroke={fill('--shadow')} strokeWidth="1.4" opacity=".7" />
      </g>
    </g>
  )
}

export function Person({ x, y, scale = 1, delay = 0, flip = false, color = '--shadow' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className="walker" style={{ animationDelay: `${delay}s` }}>
        <circle cx="0" cy="-22" r="3.2" fill={fill(color)} />
        <path d="M0 -19 C 0 -13 0 -9 0 -5" stroke={fill(color)} strokeWidth="4" strokeLinecap="round" />
        <path d="M0 -6 L-5 4 M0 -6 L5 4" stroke={fill(color)} strokeWidth="2.2" className="legs" />
        <path d="M0 -15 L-6 -8 M0 -15 L6 -8" stroke={fill(color)} strokeWidth="1.8" opacity=".8" />
      </g>
    </g>
  )
}

export function Rickshaw({ x, y, scale = 1, delay = 0, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className="rickshaw-roll" style={{ animationDelay: `${delay}s` }}>
        <path d="M-18 -22 L22 -22 L30 -4 L-26 -4Z" fill={fill('--shadow')} opacity=".72" />
        <path d="M-24 -30 C -10 -40 12 -40 26 -30 L22 -22 L-18 -22Z" fill={fill('--accent')} opacity=".62" />
        <path d="M-22 -31 C -8 -38 10 -38 24 -31" fill="none" stroke={fill('--accent-2')} strokeWidth="1.4" opacity=".7" />
        <circle className="wheel-spin" cx="-16" cy="-2" r="8" fill="none" stroke={fill('--shadow')} strokeWidth="2.4" />
        <circle className="wheel-spin wheel-spin-slow" cx="24" cy="-2" r="8" fill="none" stroke={fill('--shadow')} strokeWidth="2.4" />
        <circle cx="-16" cy="-2" r="2" fill={fill('--shadow')} />
        <circle cx="24" cy="-2" r="2" fill={fill('--shadow')} />
        <path d="M-8 -34 L-8 -42" stroke={fill('--shadow')} strokeWidth="2" />
        <circle cx="-8" cy="-45" r="3" fill={fill('--shadow')} />
        <path d="M-4 -34 C 2 -30 4 -26 6 -22" stroke={fill('--shadow')} strokeWidth="2.2" fill="none" />
        <circle cx="28" cy="-20" r="1.8" fill={fill('--accent-2')} className="bell" />
      </g>
    </g>
  )
}

export function Bus({ x, y, scale = 1, delay = 0, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className="bus-roll" style={{ animationDelay: `${delay}s` }}>
        <rect x="-42" y="-30" width="84" height="27" rx="4" fill={fill('--city')} opacity=".9" />
        <rect x="-36" y="-25" width="18" height="10" fill={fill('--window-light')} opacity=".55" />
        <rect x="-13" y="-25" width="18" height="10" fill={fill('--window-light')} opacity=".42" />
        <rect x="10" y="-25" width="18" height="10" fill={fill('--window-light')} opacity=".32" />
        <rect x="-42" y="-14" width="84" height="5" fill={fill('--accent')} opacity=".5" />
        <circle className="wheel-spin" cx="-26" cy="-2" r="7" fill={fill('--shadow')} />
        <circle className="wheel-spin" cx="26" cy="-2" r="7" fill={fill('--shadow')} />
        <circle cx="-26" cy="-2" r="2.6" fill={fill('--city')} />
        <circle cx="26" cy="-2" r="2.6" fill={fill('--city')} />
      </g>
    </g>
  )
}

export function Launch({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="boat-bob" style={{ animationDelay: `${delay}s` }}>
        <path d="M-72 0 C -50 12 48 12 72 0 C 44 6 -44 6 -72 0Z" fill={fill('--shadow')} opacity=".9" />
        <rect x="-36" y="-22" width="64" height="20" fill={fill('--city')} opacity=".88" />
        <rect x="-26" y="-17" width="10" height="7" fill={fill('--window-light')} opacity=".55" />
        <rect x="-10" y="-17" width="10" height="7" fill={fill('--window-light')} opacity=".45" />
        <rect x="6" y="-17" width="10" height="7" fill={fill('--window-light')} opacity=".35" />
        <rect x="-10" y="-34" width="24" height="12" fill={fill('--city')} opacity=".92" />
        <path d="M2 -34 L2 -48 L8 -48 L8 -34" fill={fill('--accent')} opacity=".4" />
        <path d="M-60 7 C -20 12 20 12 60 7" fill="none" stroke={fill('--star')} strokeWidth="1.2" opacity=".2" />
      </g>
    </g>
  )
}

export function Bird({ x, y, scale = 1, delay = 0, className = 'bird-drift' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className={className} style={{ animationDelay: `${delay}s` }}>
      <path d="M-8 0 Q -4 -5 0 0 Q 4 -5 8 0" fill="none" stroke={fill('--shadow')} strokeWidth="1.6" strokeLinecap="round" className="bird-wing" />
    </g>
  )
}

export function PaddyClump({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="paddy-sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 C -2 -14 -8 -24 -12 -32 M0 0 C 1 -16 3 -26 5 -36 M0 0 C 4 -13 9 -21 14 -28" fill="none" stroke={fill('--paddy')} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M-12 -32 C -18 -36 -22 -34 -25 -29 C -20 -29 -16 -30 -12 -32Z" fill={fill('--paddy')} opacity=".9" />
        <path d="M5 -36 C 3 -42 6 -46 11 -48 C 10 -42 8 -39 5 -36Z" fill={fill('--paddy')} opacity=".82" />
        <path d="M14 -28 C 20 -32 25 -30 28 -25 C 22 -25 18 -26 14 -28Z" fill={fill('--paddy')} opacity=".75" />
      </g>
    </g>
  )
}

export function KashPlant({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="kash-sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 C -2 -22 -5 -40 -4 -58" fill="none" stroke={fill('--leaf')} strokeWidth="2" />
        <path d="M-4 -58 C -14 -66 -18 -74 -16 -82 C -9 -76 -5 -68 -4 -58Z" fill={fill('--star')} opacity=".42" />
        <path d="M-4 -58 C 4 -68 10 -74 16 -76 C 10 -69 5 -63 -4 -58Z" fill={fill('--star')} opacity=".34" />
        <path d="M-4 -58 C -3 -70 0 -78 5 -84 C 5 -74 2 -66 -4 -58Z" fill={fill('--star')} opacity=".28" />
        <path d="M0 -20 C 9 -28 16 -27 20 -21 C 13 -21 7 -21 0 -20Z" fill={fill('--leaf')} opacity=".7" />
      </g>
    </g>
  )
}

export function GrassTuft({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="grass-sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 C -2 -8 -7 -14 -12 -18 M0 0 C 0 -10 1 -17 4 -23 M0 0 C 4 -8 9 -13 14 -16 M0 0 C -5 -6 -10 -8 -16 -9" fill="none" stroke={fill('--grass')} strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </g>
  )
}

export function Shapla({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="float-slow" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx="0" cy="2" rx="14" ry="5" fill={fill('--leaf')} opacity=".55" />
        <path d="M-7 0 C -5 -6 0 -8 3 -2 C 5 -7 10 -5 9 0 C 5 2 -2 2 -7 0Z" fill={fill('--star')} opacity=".55" />
        <path d="M-2 -1 L0 -7 L2 -1" fill={fill('--accent')} opacity=".6" />
      </g>
    </g>
  )
}

export function GhatSteps({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-80 0 L80 0 L60 -12 L-60 -12Z" fill={fill('--city')} opacity=".55" />
      <path d="M-60 -12 L60 -12 L44 -24 L-44 -24Z" fill={fill('--city')} opacity=".62" />
      <path d="M-44 -24 L44 -24 L30 -36 L-30 -36Z" fill={fill('--city')} opacity=".7" />
      <path d="M-30 -36 L30 -36 L18 -46 L-18 -46Z" fill={fill('--city')} opacity=".76" />
      <path d="M-80 0 L80 0" stroke={fill('--accent')} strokeWidth="1.5" opacity=".3" />
    </g>
  )
}

export function MarketStall({ x, y, scale = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <rect x="-34" y="-30" width="68" height="30" fill={fill('--city')} opacity=".72" />
      <path d="M-44 -30 L-34 -46 L34 -46 L44 -30Z" fill={fill('--accent')} opacity=".5" />
      <path d="M-44 -30 L-34 -46 L-22 -30Z" fill={fill('--accent-2')} opacity=".35" />
      <path d="M-22 -30 L-12 -46 L0 -30Z" fill={fill('--accent')} opacity=".42" />
      <path d="M0 -30 L10 -46 L22 -30Z" fill={fill('--accent-2')} opacity=".35" />
      <path d="M22 -30 L32 -46 L44 -30Z" fill={fill('--accent')} opacity=".4" />
      <rect x="-28" y="-20" width="12" height="10" fill={fill('--paddy')} opacity=".7" />
      <rect x="-10" y="-20" width="12" height="10" fill={fill('--accent')} opacity=".55" />
      <rect x="8" y="-20" width="12" height="10" fill={fill('--leaf')} opacity=".6" />
      <circle cx="-22" cy="-12" r="3" fill={fill('--window-light')} opacity=".5" />
      <circle cx="16" cy="-12" r="3" fill={fill('--window-light')} opacity=".45" />
    </g>
  )
}

export function PithaStall({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-24" y="-24" width="48" height="24" fill={fill('--city')} opacity=".7" />
      <path d="M-32 -24 L-24 -38 L24 -38 L32 -24Z" fill={fill('--accent')} opacity=".45" />
      <circle cx="-12" cy="-29" r="4" fill={fill('--star')} opacity=".55" />
      <circle cx="0" cy="-30" r="5" fill={fill('--star')} opacity=".45" />
      <circle cx="12" cy="-29" r="4" fill={fill('--star')} opacity=".5" />
      <path d="M-12 -16 C -12 -24 -4 -24 -4 -16 C -4 -8 -12 -8 -12 -16Z" fill={fill('--window-light')} opacity=".55" />
      <path d="M-10 -40 C -14 -48 -6 -52 -9 -60" fill="none" stroke={fill('--star')} strokeWidth="1" opacity=".18" className="steam" />
    </g>
  )
}

export function SapPot({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="float-slow" style={{ animationDelay: `${delay}s` }}>
        <path d="M-3 0 L-5 10 L5 10 L3 0Z" fill={fill('--accent')} opacity=".55" />
        <path d="M-6 4 L6 4" stroke={fill('--shadow')} strokeWidth="1" opacity=".4" />
        <path d="M0 0 L0 -14" stroke={fill('--shadow')} strokeWidth="1.2" opacity=".5" />
      </g>
    </g>
  )
}

export function Bridge({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-230 0 L230 0 L210 -16 L-210 -16Z" fill={fill('--city')} opacity=".86" />
      <path d="M-210 -16 L-160 -58 L-110 -16 M-110 -16 L-60 -70 L-10 -16 M-10 -16 L40 -62 L90 -16 M90 -16 L140 -54 L190 -16" fill="none" stroke={fill('--shadow')} strokeWidth="3" opacity=".55" />
      <path d="M-230 0 L230 0" stroke={fill('--accent')} strokeWidth="2" opacity=".38" />
      <path d="M-200 -18 L200 -18" stroke={fill('--star')} strokeWidth="1" opacity=".16" />
      <path d="M-230 4 C -150 12 150 12 230 4" fill="none" stroke={fill('--star')} strokeWidth="1" opacity=".12" />
    </g>
  )
}

export function Building({ x, y, width = 30, height = 80, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-width / 2} y={-height} width={width} height={height} fill={fill('--city')} opacity=".92" />
      {Array.from({ length: Math.max(2, Math.floor(height / 16)) }).map((_, row) => (
        <g key={row}>
          <rect
            className="city-window"
            x={-width / 2 + 5}
            y={-height + 8 + row * 14}
            width={Math.max(4, width / 4)}
            height="4"
            fill={fill('--window-light')}
            opacity={0.2 + ((row + delay) % 3) * 0.14}
          />
          <rect
            className="city-window"
            x={width / 2 - 5 - Math.max(4, width / 4)}
            y={-height + 8 + row * 14}
            width={Math.max(4, width / 4)}
            height="4"
            fill={fill('--window-light')}
            opacity={0.16 + ((row + delay + 1) % 4) * 0.1}
          />
        </g>
      ))}
      <path d={`M0 ${-height} L0 ${-height - 8}`} stroke={fill('--shadow')} strokeWidth="1.5" opacity=".6" />
    </g>
  )
}
