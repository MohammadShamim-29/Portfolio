import { createSeededRandom } from '../utils/prng.js'
import { clamp } from '../utils/dateUtils.js'

function createNoise1D(seed) {
  const random = createSeededRandom(seed)
  const values = Array.from({ length: 512 }, () => random() * 2 - 1)
  return (x) => {
    const base = Math.floor(x)
    const fraction = x - base
    const smooth = fraction * fraction * (3 - 2 * fraction)
    const a = values[((base % values.length) + values.length) % values.length]
    const b =
      values[((base + 1) % values.length + values.length) % values.length]
    return a + (b - a) * smooth
  }
}

export function createWindField(seed = 24) {
  const noise = createNoise1D(seed)
  const current = {
    speed: 0.28,
    gust: 0,
    angle: 8,
    time: 0,
  }

  return {
    current,
    update(timeMs) {
      const time = timeMs / 1000
      const base =
        0.3 +
        Math.sin(time * 0.071) * 0.11 +
        Math.sin(time * 0.193 + 1.7) * 0.07 +
        noise(time * 0.045) * 0.16
      const gustWave = Math.max(0, Math.sin(time * 0.16 + 0.6))
      const gust =
        Math.pow(gustWave, 8) * 0.72 +
        Math.max(0, noise(time * 0.11 + 9.2)) * 0.18
      current.speed = clamp(base + gust * 0.3, 0.04, 1)
      current.gust = clamp(gust, 0, 1)
      current.angle = 7 + Math.sin(time * 0.031) * 9 + noise(time * 0.02) * 5
      current.time = time
      return current
    },
    speedAt(x, timeMs = current.time * 1000) {
      const time = timeMs / 1000
      return clamp(
        current.speed +
          noise(x * 0.0021 + time * 0.08) * 0.08 +
          Math.sin(x * 0.004 + time * 0.7) * 0.03,
        0,
        1,
      )
    },
  }
}

export const sharedWindField = createWindField(24)
