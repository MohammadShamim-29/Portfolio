import { useCallback, useEffect, useRef, useState } from 'react'

const ZONE_AMBIENCE = {
  hero: {
    wind: 0.22,
    water: 0.55,
    rain: 0.4,
    detail: 0.04,
    detailFrequency: 700,
  },
  about: {
    wind: 0.06,
    water: 0,
    rain: 0,
    detail: 0.012,
    detailFrequency: 3200,
  },
  skills: {
    wind: 0.36,
    water: 0,
    rain: 0.08,
    detail: 0.03,
    detailFrequency: 1400,
  },
  projects: {
    wind: 0.08,
    water: 0,
    rain: 0.05,
    detail: 0.06,
    detailFrequency: 160,
  },
  education: {
    wind: 0.12,
    water: 0.04,
    rain: 0.08,
    detail: 0.04,
    detailFrequency: 600,
  },
  contact: {
    wind: 0.18,
    water: 0.5,
    rain: 0.35,
    detail: 0.04,
    detailFrequency: 800,
  },
}

const DEFAULT_AMBIENCE = ZONE_AMBIENCE.hero
const BIRD_ZONES = new Set(['about', 'skills', 'education'])

function scheduleChirp(context, destination) {
  if (!destination || context.state !== 'running') return
  const now = context.currentTime + 0.02
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const base = 1700 + Math.random() * 1100

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(base, now)
  oscillator.frequency.exponentialRampToValueAtTime(base * 1.45, now + 0.07)
  oscillator.frequency.exponentialRampToValueAtTime(base * 0.92, now + 0.19)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24)
  oscillator.connect(gain)
  gain.connect(destination)
  oscillator.start(now)
  oscillator.stop(now + 0.26)
}

function createNoiseBuffer(context, seconds = 3) {
  const sampleRate = context.sampleRate
  const buffer = context.createBuffer(1, sampleRate * seconds, sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let index = 0; index < data.length; index += 1) {
    const white = Math.random() * 2 - 1
    last = last * 0.985 + white * 0.015
    data[index] = last * 3.2
  }
  return buffer
}

export function useAmbientSound(theme, zoneId = 'hero') {
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolumeState] = useState(0.35)
  const [supported, setSupported] = useState(true)
  const contextRef = useRef(null)
  const masterRef = useRef(null)
  const rainGainRef = useRef(null)
  const windGainRef = useRef(null)
  const waterGainRef = useRef(null)
  const detailGainRef = useRef(null)
  const detailFilterRef = useRef(null)
  const themeRef = useRef(theme)
  const zoneRef = useRef(zoneId)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    zoneRef.current = zoneId
  }, [zoneId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) setSupported(false)
  }, [])

  const applyMix = useCallback(
    (context, currentTheme, currentVolume, currentZone) => {
      if (!context) return
      const ambience = ZONE_AMBIENCE[currentZone] ?? DEFAULT_AMBIENCE
      const rain = currentTheme?.weather?.rainRate ?? 0
      const wind = currentTheme?.weather?.windBias ?? 0.3
      const now = context.currentTime

      windGainRef.current?.gain.setTargetAtTime(
        ambience.wind + wind * 0.18,
        now,
        0.45,
      )
      waterGainRef.current?.gain.setTargetAtTime(ambience.water, now, 0.4)
      rainGainRef.current?.gain.setTargetAtTime(
        rain * ambience.rain,
        now,
        0.45,
      )
      detailGainRef.current?.gain.setTargetAtTime(ambience.detail, now, 0.45)
      detailFilterRef.current?.frequency.setTargetAtTime(
        ambience.detailFrequency,
        now,
        0.6,
      )
      masterRef.current?.gain.setTargetAtTime(
        currentVolume * 0.55,
        now,
        0.4,
      )
    },
    [],
  )

  const buildGraph = useCallback(() => {
    if (contextRef.current) return contextRef.current
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) {
      setSupported(false)
      return null
    }

    const context = new AudioContext()
    const master = context.createGain()
    master.gain.value = 0
    master.connect(context.destination)

    const buffer = createNoiseBuffer(context, 4)

    const windSource = context.createBufferSource()
    windSource.buffer = buffer
    windSource.loop = true
    const windFilter = context.createBiquadFilter()
    windFilter.type = 'lowpass'
    windFilter.frequency.value = 420
    windFilter.Q.value = 0.6
    const windGain = context.createGain()
    windGain.gain.value = 0.5
    windSource.connect(windFilter)
    windFilter.connect(windGain)
    windGain.connect(master)

    const rainSource = context.createBufferSource()
    rainSource.buffer = buffer
    rainSource.loop = true
    rainSource.playbackRate.value = 1.7
    const rainFilter = context.createBiquadFilter()
    rainFilter.type = 'bandpass'
    rainFilter.frequency.value = 2600
    rainFilter.Q.value = 0.5
    const rainGain = context.createGain()
    rainGain.gain.value = 0
    rainSource.connect(rainFilter)
    rainFilter.connect(rainGain)
    rainGain.connect(master)

    const waterSource = context.createBufferSource()
    waterSource.buffer = buffer
    waterSource.loop = true
    waterSource.playbackRate.value = 0.48
    const waterFilter = context.createBiquadFilter()
    waterFilter.type = 'bandpass'
    waterFilter.frequency.value = 620
    waterFilter.Q.value = 0.7
    const waterGain = context.createGain()
    waterGain.gain.value = 0
    waterSource.connect(waterFilter)
    waterFilter.connect(waterGain)
    waterGain.connect(master)

    const detailSource = context.createBufferSource()
    detailSource.buffer = buffer
    detailSource.loop = true
    detailSource.playbackRate.value = 0.72
    const detailFilter = context.createBiquadFilter()
    detailFilter.type = 'bandpass'
    detailFilter.frequency.value = DEFAULT_AMBIENCE.detailFrequency
    detailFilter.Q.value = 0.9
    const detailGain = context.createGain()
    detailGain.gain.value = 0
    detailSource.connect(detailFilter)
    detailFilter.connect(detailGain)
    detailGain.connect(master)

    const lfo = context.createOscillator()
    lfo.frequency.value = 0.07
    const lfoGain = context.createGain()
    lfoGain.gain.value = 0.18
    lfo.connect(lfoGain)
    lfoGain.connect(windGain.gain)

    windSource.start()
    rainSource.start()
    waterSource.start()
    detailSource.start()
    lfo.start()

    contextRef.current = context
    masterRef.current = master
    rainGainRef.current = rainGain
    windGainRef.current = windGain
    waterGainRef.current = waterGain
    detailGainRef.current = detailGain
    detailFilterRef.current = detailFilter
    return context
  }, [])

  useEffect(() => {
    if (!enabled) return
    applyMix(contextRef.current, theme, volume, zoneId)
  }, [applyMix, enabled, theme, volume, zoneId])

  useEffect(() => {
    if (!enabled || !BIRD_ZONES.has(zoneId)) return undefined
    const context = contextRef.current
    if (!context) return undefined

    let timeoutId = 0
    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        scheduleChirp(context, masterRef.current)
        schedule()
      }, 2600 + Math.random() * 3400)
    }
    schedule()
    return () => window.clearTimeout(timeoutId)
  }, [enabled, zoneId])

  const toggle = useCallback(async () => {
    if (enabled) {
      const context = contextRef.current
      const master = masterRef.current
      if (context && master) {
        master.gain.setTargetAtTime(0, context.currentTime, 0.25)
        window.setTimeout(() => {
          contextRef.current?.suspend?.()
        }, 600)
      }
      setEnabled(false)
      return
    }

    const context = buildGraph()
    if (!context) return
    try {
      await context.resume()
    } catch {
      setSupported(false)
      return
    }
    applyMix(context, themeRef.current, volume, zoneRef.current)
    setEnabled(true)
  }, [applyMix, buildGraph, enabled, volume])

  const setVolume = useCallback((next) => {
    setVolumeState(next)
  }, [])

  useEffect(() => {
    return () => {
      contextRef.current?.close?.()
    }
  }, [])

  return {
    enabled,
    supported,
    volume,
    setVolume,
    toggle,
    label: enabled ? 'Mute ambient sound' : 'Play ambient sound',
  }
}
