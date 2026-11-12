import { useCallback, useEffect, useRef, useState } from 'react'

const ZONE_AMBIENCE = {
  hero: { wind: 0.2, rain: 0.5, detail: 0.06, detailFrequency: 1200 },
  about: { wind: 0.14, rain: 0.2, detail: 0.08, detailFrequency: 2200 },
  skills: { wind: 0.3, rain: 0.12, detail: 0.06, detailFrequency: 900 },
  projects: { wind: 0.08, rain: 0.08, detail: 0.05, detailFrequency: 180 },
  education: { wind: 0.12, rain: 0.15, detail: 0.05, detailFrequency: 700 },
  contact: { wind: 0.2, rain: 0.4, detail: 0.07, detailFrequency: 1500 },
}

const DEFAULT_AMBIENCE = ZONE_AMBIENCE.hero

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
        1.2,
      )
      rainGainRef.current?.gain.setTargetAtTime(rain * ambience.rain, now, 0.8)
      detailGainRef.current?.gain.setTargetAtTime(ambience.detail, now, 1.1)
      detailFilterRef.current?.frequency.setTargetAtTime(
        ambience.detailFrequency,
        now,
        1.2,
      )
      masterRef.current?.gain.setTargetAtTime(
        currentVolume * 0.55,
        now,
        0.6,
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
    detailSource.start()
    lfo.start()

    contextRef.current = context
    masterRef.current = master
    rainGainRef.current = rainGain
    windGainRef.current = windGain
    detailGainRef.current = detailGain
    detailFilterRef.current = detailFilter
    return context
  }, [])

  useEffect(() => {
    if (!enabled) return
    applyMix(contextRef.current, theme, volume, zoneId)
  }, [applyMix, enabled, theme, volume, zoneId])

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
