import { useEffect, useRef } from 'react'
import { animationEngine } from '../../engines/animationEngine.js'
import { sharedWindField } from '../../engines/windEngine.js'
import { withAlpha } from '../../utils/colorUtils.js'

const TIER_COUNTS = {
  full: { rain: 170, fireflies: 42, dust: 80, birds: 8 },
  medium: { rain: 110, fireflies: 26, dust: 46, birds: 5 },
  low: { rain: 60, fireflies: 14, dust: 22, birds: 3 },
}

function createParticles(width, height, tier) {
  const counts = TIER_COUNTS[tier] ?? TIER_COUNTS.medium
  return {
    rain: Array.from({ length: counts.rain }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 10 + Math.random() * 18,
      speed: 460 + Math.random() * 420,
      alpha: 0.18 + Math.random() * 0.3,
    })),
    fireflies: Array.from({ length: counts.fireflies }, () => ({
      x: Math.random() * width,
      y: height * 0.45 + Math.random() * height * 0.5,
      radius: 0.8 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.8,
      drift: 8 + Math.random() * 20,
    })),
    dust: Array.from({ length: counts.dust }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      radius: 0.5 + Math.random() * 1.4,
      speed: 5 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.12 + Math.random() * 0.24,
    })),
    birds: Array.from({ length: counts.birds }, () => ({
      x: Math.random() * width,
      y: height * 0.12 + Math.random() * height * 0.28,
      speed: 12 + Math.random() * 22,
      size: 3 + Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
      flap: 2 + Math.random() * 2.4,
    })),
    shootingStars: [],
    nextShootingStar: 4 + Math.random() * 10,
  }
}

function drawBird(context, bird, time, color) {
  const flap = Math.sin(time * bird.flap + bird.phase) * 0.7
  const { x, y, size } = bird
  context.beginPath()
  context.moveTo(x - size, y + flap * size * 0.4)
  context.quadraticCurveTo(x - size * 0.4, y - size * 0.6, x, y)
  context.quadraticCurveTo(x + size * 0.4, y - size * 0.6, x + size, y + flap * size * 0.4)
  context.strokeStyle = color
  context.lineWidth = 1.1
  context.stroke()
}

export function AmbientCanvas({ theme, tier = 'medium' }) {
  const canvasRef = useRef(null)
  const themeRef = useRef(theme)
  const tierRef = useRef(tier)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    tierRef.current = tier
  }, [tier])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined

    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reducedMotion) return undefined

    let width = 0
    let height = 0
    let particles = null
    let elapsed = 0
    let resizeObserver
    let unsubscribe

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        tierRef.current === 'low' ? 1.25 : 2,
      )
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = createParticles(width, height, tierRef.current)
    }

    resize()
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(document.documentElement)
    } else {
      window.addEventListener('resize', resize)
    }

    const draw = (time, delta) => {
      const active = themeRef.current
      if (!active || !particles) return
      elapsed += delta / 1000
      const seconds = time / 1000
      const dt = Math.min(0.064, delta / 1000)
      const palette = active.palette ?? {}
      const particlesConfig = active.particles ?? {}
      const weather = active.weather ?? {}
      const light = active.light ?? {}
      const wind = sharedWindField.current

      context.clearRect(0, 0, width, height)

      const rainAmount = Math.max(
        0,
        Math.min(1, (weather.rainRate ?? 0) * 1.2),
      )
      if (rainAmount > 0.03) {
        const rainCount = Math.floor(particles.rain.length * rainAmount)
        context.strokeStyle = withAlpha(
          palette.star ?? '#dfe9e6',
          light.isNight ? 0.24 : 0.32,
        )
        context.lineWidth = 1
        context.beginPath()
        for (let index = 0; index < rainCount; index += 1) {
          const drop = particles.rain[index]
          drop.y += drop.speed * dt
          drop.x += (wind.speed * 60 + 20) * dt
          if (drop.y > height + 30) {
            drop.y = -30 - Math.random() * 80
            drop.x = Math.random() * width
          }
          if (drop.x > width + 30) drop.x = -30
          const slant = 0.16 + wind.speed * 0.22
          context.moveTo(drop.x, drop.y)
          context.lineTo(drop.x + drop.length * slant, drop.y + drop.length)
        }
        context.stroke()
      }

      const fireflyAmount = Math.max(0, particlesConfig.fireflies ?? 0)
      if (fireflyAmount > 0.04) {
        const fireflyCount = Math.floor(
          particles.fireflies.length * fireflyAmount,
        )
        for (let index = 0; index < fireflyCount; index += 1) {
          const firefly = particles.fireflies[index]
          const twinkle =
            0.35 + 0.65 * Math.abs(Math.sin(seconds * firefly.speed + firefly.phase))
          const x =
            firefly.x +
            Math.sin(seconds * 0.3 + firefly.phase) * firefly.drift +
            wind.speed * 18
          const y =
            firefly.y +
            Math.cos(seconds * 0.23 + firefly.phase) * firefly.drift * 0.5
          context.beginPath()
          context.arc(x, y, firefly.radius * (0.8 + twinkle * 0.4), 0, Math.PI * 2)
          context.fillStyle = withAlpha(palette.accent ?? '#f2d38a', twinkle * 0.55)
          context.fill()
          context.beginPath()
          context.arc(x, y, firefly.radius * 4, 0, Math.PI * 2)
          context.fillStyle = withAlpha(palette.accent ?? '#f2d38a', twinkle * 0.08)
          context.fill()
        }
      }

      const dustAmount = Math.max(0, particlesConfig.dust ?? 0)
      if (dustAmount > 0.05) {
        const dustCount = Math.floor(particles.dust.length * dustAmount)
        context.fillStyle = withAlpha(palette.star ?? '#f6edda', 0.2)
        for (let index = 0; index < dustCount; index += 1) {
          const mote = particles.dust[index]
          mote.x += (mote.speed + wind.speed * 20) * dt
          mote.y += Math.sin(seconds * 0.4 + mote.phase) * 0.16
          if (mote.x > width + 10) mote.x = -10
          context.globalAlpha = mote.alpha * (0.65 + 0.35 * Math.sin(seconds + mote.phase))
          context.beginPath()
          context.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2)
          context.fill()
        }
        context.globalAlpha = 1
      }

      const birdAmount = Math.max(0, particlesConfig.birds ?? 0)
      if (birdAmount > 0.1) {
        const birdCount = Math.floor(particles.birds.length * birdAmount)
        context.strokeStyle = withAlpha(
          palette.shadow ?? '#1a1a22',
          light.isNight ? 0.1 : 0.32,
        )
        for (let index = 0; index < birdCount; index += 1) {
          const bird = particles.birds[index]
          bird.x += bird.speed * dt
          bird.y += Math.sin(seconds * 0.4 + bird.phase) * 0.12
          if (bird.x > width + 40) {
            bird.x = -40
            bird.y = height * 0.12 + Math.random() * height * 0.28
          }
          drawBird(context, bird, seconds, context.strokeStyle)
        }
      }

      const shootingStarAmount = Math.max(
        0,
        particlesConfig.shootingStars ?? 0,
      )
      if (shootingStarAmount > 0.05) {
        particles.nextShootingStar -= dt
        if (particles.nextShootingStar <= 0) {
          particles.shootingStars.push({
            x: width * (0.2 + Math.random() * 0.7),
            y: height * (0.04 + Math.random() * 0.22),
            vx: -220 - Math.random() * 160,
            vy: 120 + Math.random() * 90,
            life: 0,
            maxLife: 0.8 + Math.random() * 0.5,
          })
          particles.nextShootingStar =
            5 + Math.random() * 14 - shootingStarAmount * 3
        }
        for (let index = particles.shootingStars.length - 1; index >= 0; index -= 1) {
          const star = particles.shootingStars[index]
          star.life += dt
          star.x += star.vx * dt
          star.y += star.vy * dt
          const fade = 1 - star.life / star.maxLife
          if (fade <= 0) {
            particles.shootingStars.splice(index, 1)
            continue
          }
          const gradient = context.createLinearGradient(
            star.x,
            star.y,
            star.x - star.vx * 0.08,
            star.y - star.vy * 0.08,
          )
          gradient.addColorStop(0, withAlpha(palette.star ?? '#ffffff', fade * 0.9))
          gradient.addColorStop(1, withAlpha(palette.star ?? '#ffffff', 0))
          context.strokeStyle = gradient
          context.lineWidth = 1.4
          context.beginPath()
          context.moveTo(star.x, star.y)
          context.lineTo(star.x - star.vx * 0.08, star.y - star.vy * 0.08)
          context.stroke()
        }
      }
    }

    unsubscribe = animationEngine.subscribe(draw)

    return () => {
      unsubscribe?.()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-canvas" aria-hidden="true" />
}
