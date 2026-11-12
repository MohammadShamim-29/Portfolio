import {
  BananaTree,
  BetelPalm,
  Bird,
  Building,
  Launch,
  MudHouse,
  PalmTree,
  TinHouse,
} from './scenery.jsx'

function TreeLine({ from, to, y = 650, height = 80, opacity = 0.55 }) {
  return (
    <path
      d={`M${from} ${y} C ${from + 80} ${y - height * 0.7}, ${from + 140} ${y - height}, ${from + 220} ${y - height * 0.55} C ${from + 300} ${y - height * 0.2}, ${from + 360} ${y - height * 0.9}, ${from + 450} ${y - height * 0.7} C ${from + 540} ${y - height * 0.4}, ${from + 600} ${y - height * 0.85}, ${from + 680} ${y - height * 0.6} C ${from + 760} ${y - height * 0.2}, ${from + 850} ${y - height * 0.7}, ${to} ${y} Z`}
      fill="var(--leaf)"
      opacity={opacity}
    />
  )
}

export function DistantLayer() {
  return (
    <svg
      className="layer layer-distant"
      viewBox="0 0 6000 700"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g className="distant-zone">
        <TreeLine from={-40} to={980} y={665} height={90} opacity={0.4} />
        <TreeLine from={80} to={860} y={682} height={48} opacity={0.3} />
        <Launch x={690} y={650} scale={0.55} delay={1.2} />
        <Bird x={220} y={360} scale={0.9} delay={0} />
        <Bird x={260} y={345} scale={0.7} delay={1.4} />
        <Bird x={300} y={370} scale={0.8} delay={2.3} />
      </g>

      <g className="distant-zone">
        <TreeLine from={1010} to={1990} y={665} height={86} opacity={0.5} />
        <PalmTree x={1080} y={650} scale={1.15} delay={0.2} />
        <BetelPalm x={1150} y={655} scale={1.1} delay={0.8} />
        <BananaTree x={1215} y={658} scale={1.15} delay={1.4} />
        <TinHouse x={1360} y={665} scale={0.9} flip />
        <MudHouse x={1500} y={668} scale={0.95} />
        <PalmTree x={1600} y={660} scale={1.3} flip delay={0.5} />
        <BetelPalm x={1680} y={662} scale={1.2} delay={1.1} />
        <BananaTree x={1760} y={665} scale={1.25} delay={0.4} />
        <TinHouse x={1880} y={668} scale={0.82} />
        <Bird x={1260} y={330} scale={0.7} delay={0.8} />
        <Bird x={1310} y={350} scale={0.6} delay={2.1} />
      </g>

      <g className="distant-zone">
        <TreeLine from={2010} to={2990} y={668} height={70} opacity={0.42} />
        <PalmTree x={2090} y={660} scale={1.2} delay={0.3} />
        <PalmTree x={2180} y={662} scale={0.95} flip delay={1.2} />
        <BetelPalm x={2260} y={666} scale={1.3} delay={0.6} />
        <PalmTree x={2810} y={658} scale={1.1} delay={0.9} />
        <BetelPalm x={2890} y={662} scale={1.15} flip delay={1.7} />
        <Bird x={2420} y={300} scale={1} delay={0.2} />
        <Bird x={2470} y={285} scale={0.8} delay={1.1} />
        <Bird x={2520} y={308} scale={0.9} delay={2.4} />
        <Bird x={2570} y={292} scale={0.7} delay={3.2} />
      </g>

      <g className="distant-zone">
        <ellipse cx="3520" cy="612" rx="470" ry="95" fill="var(--city)" opacity="0.18" className="city-glow" />
        <Building x={3080} y={668} width={34} height={100} delay={1} />
        <Building x={3130} y={670} width={24} height={74} delay={2} />
        <Building x={3180} y={670} width={42} height={128} delay={0} />
        <Building x={3240} y={670} width={28} height={92} delay={1} />
        <Building x={3300} y={670} width={52} height={156} delay={2} />
        <Building x={3370} y={670} width={30} height={110} delay={0} />
        <Building x={3420} y={670} width={44} height={138} delay={1} />
        <Building x={3490} y={670} width={26} height={84} delay={2} />
        <Building x={3540} y={670} width={56} height={172} delay={0} />
        <Building x={3610} y={670} width={32} height={104} delay={1} />
        <Building x={3670} y={670} width={40} height={124} delay={2} />
        <Building x={3740} y={670} width={26} height={90} delay={0} />
        <Building x={3800} y={670} width={48} height={144} delay={1} />
        <Building x={3870} y={670} width={30} height={108} delay={2} />
        <Building x={3920} y={670} width={38} height={82} delay={0} />
        <path d="M3030 668 L3990 668" stroke="var(--city)" strokeWidth="6" opacity="0.7" />
        <Launch x={3400} y={640} scale={0.6} delay={0.6} />
        <Bird x={3660} y={320} scale={0.7} delay={1.2} />
        <Bird x={3710} y={338} scale={0.6} delay={2.8} />
      </g>

      <g className="distant-zone">
        <TreeLine from={4010} to={4990} y={668} height={76} opacity={0.48} />
        <rect x="4300" y="560" width="24" height="108" fill="var(--city)" opacity="0.6" />
        <rect x="4286" y="548" width="52" height="16" rx="5" fill="var(--city)" opacity="0.68" />
        <path d="M4300 548 L4324 548 M4312 548 L4312 530" stroke="var(--shadow)" strokeWidth="3" opacity="0.45" />
        <TinHouse x={4180} y={668} scale={0.9} />
        <MudHouse x={4260} y={670} scale={0.85} />
        <TinHouse x={4440} y={668} scale={1} flip />
        <PalmTree x={4540} y={662} scale={1.2} delay={0.6} />
        <BananaTree x={4620} y={666} scale={1.1} delay={1.4} />
        <BetelPalm x={4700} y={666} scale={1.2} flip delay={0.4} />
        <TinHouse x={4820} y={668} scale={0.92} />
        <Bird x={4380} y={336} scale={0.7} delay={0.9} />
      </g>

      <g className="distant-zone">
        <TreeLine from={5010} to={5990} y={668} height={96} opacity={0.55} />
        <PalmTree x={5100} y={658} scale={1.4} delay={0.4} />
        <BetelPalm x={5180} y={662} scale={1.3} delay={1.1} />
        <PalmTree x={5260} y={660} scale={1.1} flip delay={1.8} />
        <BananaTree x={5760} y={664} scale={1.25} delay={0.7} />
        <PalmTree x={5840} y={660} scale={1.2} delay={1.3} />
        <Bird x={5320} y={320} scale={0.9} delay={0.4} />
        <Bird x={5370} y={304} scale={0.7} delay={1.6} />
        <Bird x={5420} y={328} scale={0.8} delay={2.7} />
      </g>
    </svg>
  )
}
