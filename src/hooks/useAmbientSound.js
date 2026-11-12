import { useCallback, useEffect, useRef, useState } from 'react'

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

export function useAmbientSound(theme) {
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolumeState] = useState(0.35)
  const [supported, setSupported] = useState(true)
  const contextRef = useRef(null)
  const masterRef = useRef(null)
  const rainGainRef = useRef(null)
  const windGainRef = useRef(null)
  const themeRef = useRef(theme)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) setSupported(false)
  }, [])

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

    const lfo = context.createOscillator()
    lfo.frequency.value = 0.07
    const lfoGain = context.createGain()
    lfoGain.gain.value = 0.18
    lfo.connect(lfoGain)
    lfoGain.connect(windGain.gain)

    windSource.start()
    rainSource.start()
    lfo.start()

    contextRef.current = context
    masterRef.current = master
    rainGainRef.current = rainGain
    windGainRef.current = windGain
    return context
  }, [])

  useEffect(() => {
    if (!enabled) return
    const context = contextRef.current
    const master = masterRef.current
    if (!context || !master) return
    const rain = theme?.weather?.rainRate ?? 0
    const wind = theme?.weather?.windBias ?? 0.3
    const now = context.currentTime
    rainGainRef.current?.gain.setTargetAtTime(rain * 0.5, now, 0.8)
    windGainRef.current?.gain.setTargetAtTime(0.18 + wind * 0.32, now, 1.2)
    master.gain.setTargetAtTime(volume * 0.55, now, 0.6)
  }, [enabled, theme, volume])

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
    const rain = themeRef.current?.weather?.rainRate ?? 0
    const wind = themeRef.current?.weather?.windBias ?? 0.3
    const now = context.currentTime
    rainGainRef.current?.gain.setTargetAtTime(rain * 0.5, now, 0.8)
    windGainRef.current?.gain.setTargetAtTime(0.18 + wind * 0.32, now, 1.2)
    masterRef.current?.gain.setTargetAtTime(volume * 0.55, now, 1.2)
    setEnabled(true)
  }, [buildGraph, enabled, volume])

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
