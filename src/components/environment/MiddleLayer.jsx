import {
  BananaTree,
  BetelPalm,
  Boat,
  Bridge,
  Bus,
  Farmer,
  Fisherman,
  GhatSteps,
  Launch,
  MarketStall,
  MudHouse,
  PaddyClump,
  PalmTree,
  Person,
  PithaStall,
  Rickshaw,
  SapPot,
  Shapla,
  TinHouse,
} from './scenery.jsx'

const paddyRows = [
  { y: 796, scale: 0.8, count: 20, step: 49, offset: 2020 },
  { y: 830, scale: 1, count: 19, step: 52, offset: 2035 },
  { y: 870, scale: 1.2, count: 18, step: 56, offset: 2008 },
]

const grassTufts = Array.from({ length: 56 }, (_, index) => ({
  x: index * 108 + 20,
  y: 888 - (index % 4) * 7,
  scale: 0.8 + (index % 5) * 0.16,
  delay: (index % 9) * 0.3,
}))

export function MiddleLayer({ seasonId = 'borsha' }) {
  return (
    <svg
      className="layer layer-middle"
      viewBox="0 0 6000 900"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bank-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--grass)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--grass)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--shadow)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="field-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--paddy)" stopOpacity="0.05" />
          <stop offset="55%" stopColor="var(--paddy)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--shadow)" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <g className="middle-zone zone-river">
        <path d="M-40 842 C 140 826 280 838 430 856 C 600 876 800 860 1040 842 L1040 900 L-40 900Z" fill="url(#bank-fade)" opacity="0.6" />
        <Boat x={150} y={756} scale={1.05} delay={0.2} />
        <Boat x={420} y={806} scale={1.28} flip delay={1.1} sail={false} />
        <Boat x={690} y={742} scale={0.72} delay={0.7} />
        <Fisherman x={430} y={806} scale={1.25} delay={0.4} />
        <Launch x={850} y={690} scale={0.75} delay={0.9} />
        <path d="M120 792 C 220 786 300 790 390 798 M510 826 C 600 820 680 822 760 828" fill="none" stroke="var(--star)" strokeWidth="1.2" opacity="0.13" className="wake" />
        {seasonId === 'borsha' ? (
          <>
            <Shapla x={560} y={866} scale={1.2} delay={0.3} />
            <Shapla x={610} y={874} scale={0.9} delay={1.2} />
            <Shapla x={670} y={862} scale={1.05} delay={0.8} />
          </>
        ) : null}
      </g>

      <g className="middle-zone zone-village">
        <path d="M1000 790 C 1120 772 1240 780 1360 798 C 1510 820 1720 808 1990 786 L1990 900 L1000 900Z" fill="url(#bank-fade)" opacity="0.72" />
        <ellipse cx="1220" cy="846" rx="118" ry="34" fill="var(--water)" opacity="0.72" />
        <ellipse cx="1220" cy="840" rx="90" ry="20" fill="var(--water-deep)" opacity="0.32" />
        <Shapla x={1180} y={838} scale={1.2} delay={0.2} />
        <Shapla x={1250} y={850} scale={0.9} delay={1.4} />
        <TinHouse x={1080} y={806} scale={1.25} delay={0.2} />
        <MudHouse x={1400} y={816} scale={1.15} flip />
        <TinHouse x={1560} y={808} scale={0.9} flip />
        <PalmTree x={1010} y={810} scale={1.5} delay={0.4} />
        <BetelPalm x={1150} y={806} scale={1.4} delay={0.9} />
        <BananaTree x={1320} y={812} scale={1.45} delay={0.3} />
        <BananaTree x={1480} y={816} scale={1.2} flip delay={1.3} />
        <PalmTree x={1660} y={812} scale={1.35} flip delay={0.7} />
        <BetelPalm x={1760} y={812} scale={1.2} delay={1.5} />
        <PalmTree x={1880} y={818} scale={1.45} delay={1.1} />
        <path d="M1180 858 L1320 850" stroke="var(--shadow)" strokeWidth="2" opacity="0.3" />
        <Person x={1200} y={870} scale={1.25} delay={0.2} />
        <Person x={1290} y={862} scale={1.1} delay={1.6} flip />
        <Person x={1450} y={878} scale={1.2} delay={0.8} />
        <path d="M1720 862 C 1740 852 1770 854 1788 866 C 1770 872 1740 872 1720 862Z" fill="var(--city)" opacity="0.55" />
        <circle cx="1794" cy="858" r="4" fill="var(--city)" opacity="0.6" />
        <path d="M1800 862 L1810 850" stroke="var(--city)" strokeWidth="2" opacity="0.5" />
      </g>

      <g className="middle-zone zone-paddy">
        <path d="M1990 772 C 2180 752 2380 760 2580 780 C 2780 800 2900 790 3010 770 L3010 900 L1990 900Z" fill="url(#field-fade)" opacity="0.92" />
        {paddyRows.map((row, rowIndex) =>
          Array.from({ length: row.count }, (_, index) => (
            <PaddyClump
              key={`${rowIndex}-${index}`}
              x={row.offset + index * row.step + (rowIndex % 2) * 18}
              y={row.y + (index % 3) * 4}
              scale={row.scale * (0.9 + (index % 4) * 0.06)}
              delay={(index % 7) * 0.35 + rowIndex * 0.4}
            />
          )),
        )}
        <Farmer x={2260} y={820} scale={1.2} delay={0.4} />
        <Farmer x={2440} y={842} scale={1.35} flip delay={1.2} />
        <Farmer x={2730} y={828} scale={1.25} delay={0.8} />
        <Person x={2100} y={846} scale={1.1} delay={1.7} />
        <Person x={2890} y={836} scale={1.05} flip delay={0.6} />
        <TinHouse x={2820} y={808} scale={1.05} delay={0.5} />
        <MudHouse x={2920} y={816} scale={0.95} flip />
        <PalmTree x={2780} y={812} scale={1.25} delay={0.9} />
        <BetelPalm x={2970} y={818} scale={1.15} flip delay={1.4} />
        <Person x={2870} y={870} scale={1.1} delay={0.7} />
        <path d="M2050 878 C 2200 870 2400 872 2600 880 C 2760 886 2880 882 2960 876" fill="none" stroke="var(--shadow)" strokeWidth="2" opacity="0.16" />
      </g>

      <g className="middle-zone zone-city">
        <path d="M2990 814 C 3180 800 3360 806 3520 820 C 3720 838 3900 826 4010 810 L4010 900 L2990 900Z" fill="url(#bank-fade)" opacity="0.55" />
        <Bridge x={3520} y={792} scale={1.65} />
        <Launch x={3260} y={842} scale={0.9} delay={0.6} />
        <Boat x={3760} y={858} scale={0.8} flip delay={1.2} sail={false} />
        <Bus x={3360} y={764} scale={1.15} delay={0.2} />
        <Rickshaw x={3620} y={774} scale={1.15} delay={0.5} flip />
        <Rickshaw x={3740} y={788} scale={0.95} delay={1.4} />
        <Rickshaw x={3200} y={794} scale={0.9} delay={2.1} flip />
        <Person x={3440} y={802} scale={1.1} delay={0.6} />
        <Person x={3490} y={808} scale={1} delay={1.9} flip />
        <Person x={3860} y={806} scale={1.05} delay={1.1} />
        <Person x={3910} y={812} scale={0.95} delay={2.5} flip />
        <path d="M3040 842 C 3200 834 3400 838 3600 846 C 3780 852 3920 848 3980 840" fill="none" stroke="var(--star)" strokeWidth="1" opacity="0.1" />
      </g>

      <g className="middle-zone zone-town">
        <path d="M4010 808 C 4180 790 4380 796 4560 812 C 4740 828 4880 818 5010 800 L5010 900 L4010 900Z" fill="url(#bank-fade)" opacity="0.72" />
        <MarketStall x={4120} y={822} scale={1.25} />
        <MarketStall x={4270} y={830} scale={1.1} flip />
        <MarketStall x={4420} y={824} scale={1.2} />
        <TinHouse x={4600} y={814} scale={1.1} flip />
        <MudHouse x={4740} y={820} scale={1.05} />
        <PalmTree x={4860} y={816} scale={1.4} delay={0.6} />
        <BetelPalm x={4940} y={818} scale={1.25} flip delay={1.4} />
        <Person x={4180} y={864} scale={1.2} delay={0.3} />
        <Person x={4240} y={870} scale={1.1} delay={1.2} flip />
        <Person x={4340} y={862} scale={1.15} delay={0.9} />
        <Person x={4500} y={872} scale={1.25} delay={1.7} flip />
        <Person x={4660} y={866} scale={1.05} delay={0.5} />
        <Boat x={4900} y={862} scale={0.78} flip delay={1.1} sail={false} />
        <PithaStall x={4080} y={876} scale={0.9} />
      </g>

      <g className="middle-zone zone-ghat">
        <path d="M5010 802 C 5200 786 5400 792 5600 808 C 5780 822 5900 814 6010 796 L6010 900 L5010 900Z" fill="url(#bank-fade)" opacity="0.78" />
        <GhatSteps x={5400} y={876} scale={1.4} />
        <GhatSteps x={5760} y={884} scale={1.05} />
        <PalmTree x={5120} y={812} scale={1.5} delay={0.3} />
        <BetelPalm x={5220} y={816} scale={1.35} delay={1.1} />
        <PalmTree x={5520} y={818} scale={1.25} flip delay={1.7} />
        <BananaTree x={5860} y={818} scale={1.35} delay={0.6} />
        <BetelPalm x={5940} y={820} scale={1.25} flip delay={1.5} />
        <Boat x={5300} y={848} scale={1.05} delay={0.5} sail={false} />
        <Fisherman x={5300} y={848} scale={1.1} delay={1.3} />
        <Boat x={5680} y={862} scale={0.8} flip delay={1.8} sail={false} />
        <Person x={5480} y={852} scale={1.15} delay={0.7} />
        <Person x={5560} y={860} scale={1.05} delay={1.6} flip />
        <Person x={5820} y={858} scale={1.1} delay={2.2} />
        <path d="M5060 842 C 5240 836 5440 840 5640 848 C 5800 854 5920 850 5980 842" fill="none" stroke="var(--star)" strokeWidth="1" opacity="0.1" />
      </g>

      <g className="foreground-grass" opacity="0.85">
        {grassTufts.map((tuft, index) => (
          <g key={index} transform={`translate(${tuft.x} ${tuft.y}) scale(${tuft.scale})`}>
            <g className="grass-sway" style={{ animationDelay: `${tuft.delay}s` }}>
              <path d="M0 0 C -2 -10 -8 -17 -15 -22 M0 0 C 0 -13 1 -22 5 -30 M0 0 C 5 -10 11 -16 18 -20 M0 0 C -6 -7 -13 -10 -20 -11" fill="none" stroke="var(--grass)" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  )
}
