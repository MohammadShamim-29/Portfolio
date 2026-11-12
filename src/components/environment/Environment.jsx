import { useEffect, useRef } from 'react'
import { animationEngine } from '../../engines/animationEngine.js'
import { sharedWindField } from '../../engines/windEngine.js'
import { AmbientCanvas } from './AmbientCanvas.jsx'
import { Decorations } from './Decorations.jsx'
import { DistantLayer } from './DistantLayer.jsx'
import { ForegroundLayer } from './ForegroundLayer.jsx'
import { MiddleLayer } from './MiddleLayer.jsx'
import { SkyWaterShader } from './SkyWaterShader.jsx'
import { StaticScene } from './StaticScene.jsx'

export function Environment({
  theme,
  tier = 'medium',
  reducedMotion = false,
  environmentRef,
}) {
  const rootRef = useRef(null)

  useEffect(() => {
    const node = rootRef.current
    if (!node || reducedMotion) return undefined
    const unsubscribe = animationEngine.subscribe((time) => {
      const wind = sharedWindField.update(time)
      node.style.setProperty('--wind', wind.speed.toFixed(3))
      node.style.setProperty('--gust', wind.gust.toFixed(3))
      node.style.setProperty('--wind-angle', `${wind.angle.toFixed(1)}deg`)
    })
    return unsubscribe
  }, [reducedMotion])

  const setRefs = (node) => {
    rootRef.current = node
    if (typeof environmentRef === 'function') environmentRef(node)
    else if (environmentRef) environmentRef.current = node
  }

  const cssVars = theme?.cssVars ?? {}
  const useWebGL = !reducedMotion && tier !== 'low'
  const style = {
    ...cssVars,
    '--season': theme?.season?.id ?? 'borsha',
    '--phase': theme?.phase ?? 'noon',
  }

  return (
    <div
      ref={setRefs}
      className="environment"
      style={style}
      data-phase={theme?.phase}
      data-season={theme?.season?.id}
      data-event={theme?.eventId ?? 'normal'}
      data-tier={tier}
      aria-hidden="true"
    >
      <StaticScene theme={theme} />
      {useWebGL ? <SkyWaterShader theme={theme} /> : null}
      <div className="zone-ground" />
      <DistantLayer />
      <MiddleLayer seasonId={theme?.season?.id} />
      <ForegroundLayer
        decorations={theme?.decorations ?? []}
        seasonId={theme?.season?.id}
      />
      {reducedMotion ? null : <AmbientCanvas theme={theme} tier={tier} />}
      <Decorations
        decorations={theme?.decorations ?? []}
        eventId={theme?.eventId}
      />
      <div className="environment-fog" />
      <div className="environment-vignette" />
      <div className="environment-grain" />
    </div>
  )
}
