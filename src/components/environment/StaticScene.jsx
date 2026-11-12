export function StaticScene({ theme }) {
  const sun = theme?.sun ?? {}
  const light = theme?.light ?? {}
  const sunOpacity = sun.visible ? 1 : 0
  const moonOpacity = sun.moonVisible ? 1 : 0

  return (
    <div
      className="static-scene"
      aria-hidden="true"
      style={{
        '--static-sun-x': `${(sun.x ?? 0.5) * 100}%`,
        '--static-sun-y': `${(1 - (sun.y ?? 0.6)) * 100}%`,
        '--static-moon-x': `${(sun.moonX ?? 0.5) * 100}%`,
        '--static-moon-y': `${(1 - (sun.moonY ?? 0.6)) * 100}%`,
        '--static-sun-opacity': sunOpacity,
        '--static-moon-opacity': moonOpacity,
        '--static-night': light.night ?? 0,
      }}
    >
      <div className="static-sky" />
      <div className="static-stars" />
      <div className="static-sun" />
      <div className="static-moon" />
      <svg
        className="static-horizon"
        viewBox="0 0 1600 500"
        preserveAspectRatio="xMidYMax slice"
      >
        <path
          d="M0 300 C 150 280 280 292 420 310 C 600 334 760 320 920 298 C 1100 274 1300 282 1600 304 L1600 500 L0 500Z"
          fill="var(--water)"
          opacity="0.9"
        />
        <path
          d="M0 322 C 180 310 320 320 480 334 C 680 350 860 340 1040 324 C 1260 306 1440 310 1600 326"
          fill="none"
          stroke="var(--star)"
          strokeWidth="1"
          opacity="0.16"
        />
        <path
          d="M0 356 C 220 344 380 354 560 368 C 760 382 960 372 1160 356 C 1360 340 1500 344 1600 356"
          fill="none"
          stroke="var(--star)"
          strokeWidth="0.8"
          opacity="0.1"
        />
        <g fill="var(--city)" opacity="0.6">
          <rect x="1080" y="248" width="30" height="80" />
          <rect x="1120" y="224" width="42" height="104" />
          <rect x="1172" y="264" width="24" height="64" />
          <rect x="1206" y="236" width="36" height="92" />
          <rect x="1252" y="254" width="28" height="74" />
          <rect x="1290" y="212" width="46" height="116" />
          <rect x="1346" y="246" width="30" height="82" />
          <rect x="1386" y="230" width="38" height="98" />
        </g>
        <g fill="var(--leaf)" opacity="0.55">
          <path d="M0 310 C 80 260 150 268 220 300 C 280 326 340 316 420 296 L420 340 L0 340Z" />
          <path d="M500 306 C 580 268 650 276 720 302 C 780 322 840 314 900 298 L900 344 L500 344Z" />
          <path d="M900 310 C 980 280 1050 286 1120 306 L1120 346 L900 346Z" />
        </g>
        <g transform="translate(320 302) scale(0.9)" fill="var(--shadow)" opacity="0.7">
          <path d="M-46 0 C -30 12 30 12 46 0 C 26 6 -26 6 -46 0Z" />
          <path d="M-38 -2 L38 -2 L30 5 L-32 5Z" fill="var(--accent)" opacity="0.4" />
          <path d="M-20 -2 L-20 -44 L0 -12 L-20 -12Z" fill="var(--star)" opacity="0.2" />
        </g>
        <g transform="translate(760 296) scale(0.65)" fill="var(--leaf)" opacity="0.6">
          <path d="M0 0 C -4 -34 -6 -64 -1 -94" stroke="var(--leaf)" strokeWidth="5" fill="none" />
          <path d="M-1 -94 C -26 -110 -50 -104 -64 -86 C -40 -90 -18 -89 -1 -94Z" />
          <path d="M-1 -94 C 22 -111 48 -105 60 -88 C 36 -92 16 -90 -1 -94Z" />
        </g>
      </svg>
      <div className="static-water" />
      <div className="static-vignette" />
    </div>
  )
}
