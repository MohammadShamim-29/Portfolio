import { useEffect, useRef, useState } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import { animationEngine } from '../../engines/animationEngine.js'
import { sharedWindField } from '../../engines/windEngine.js'
import { rgbUnit } from '../../utils/colorUtils.js'
import { scrollState } from '../../utils/scrollStore.js'

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSunAlt;
  uniform float uSunX;
  uniform float uSunY;
  uniform float uMoonX;
  uniform float uMoonY;
  uniform float uMoonFraction;
  uniform float uMoonVisible;
  uniform float uNight;
  uniform float uCloud;
  uniform float uRain;
  uniform float uFog;
  uniform float uLightning;
  uniform float uWind;
  uniform float uCamera;
  uniform vec3 uSkyTop;
  uniform vec3 uSkyBottom;
  uniform vec3 uHorizonColor;
  uniform vec3 uWaterColor;
  uniform vec3 uWaterDeep;
  uniform vec3 uSunColor;
  uniform vec3 uSunGlow;
  uniform vec3 uCloudColor;
  uniform vec3 uStarColor;
  uniform vec3 uAccent;
  uniform vec3 uRipples[6];

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  float starLayer(vec2 uv, float scale, float threshold) {
    vec2 grid = uv * scale;
    vec2 id = floor(grid);
    vec2 local = fract(grid) - 0.5;
    float h = hash(id);
    float star = smoothstep(threshold, 1.0, h);
    float core = smoothstep(0.075, 0.0, length(local));
    float twinkle = 0.62 + 0.38 * sin(uTime * 2.1 + h * 37.0);
    return star * core * twinkle;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float horizon = 0.42;
    float skyT = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);

    vec3 sky = mix(uSkyBottom, uSkyTop, pow(skyT, 0.78));
    float horizonGlow = exp(-pow((uv.y - horizon) / 0.13, 2.0));
    sky += uHorizonColor * horizonGlow * 0.24;

    float sunX = uSunX - (uCamera - 0.5) * 0.55;
    vec2 sunPos = vec2(sunX, uSunY);
    vec2 sunDelta = (uv - sunPos) * vec2(aspect, 1.0);
    float sunDist = length(sunDelta);
    float sunVisible = step(-0.04, uSunAlt) * smoothstep(0.0, 0.03, uSunY - horizon + 0.1);
    float sunGlow = exp(-sunDist * 5.0) * 0.62 + exp(-sunDist * 19.0) * 0.55;
    float sunDisc = smoothstep(0.030, 0.020, sunDist);

    sky += uSunGlow * sunGlow * sunVisible * 0.95;
    sky = mix(sky, uSunColor, sunDisc * sunVisible);

    float angle = atan(sunDelta.y, sunDelta.x);
    float rayNoise = noise(vec2(angle * 4.0, uTime * 0.12));
    float rays = pow(max(0.0, sin(angle * 21.0 + uTime * 0.12 + rayNoise * 3.0)), 9.0);
    sky += uSunGlow * rays * exp(-sunDist * 3.2) * sunVisible * (1.0 - uCloud * 0.7) * 0.2;

    float stars = starLayer(uv, 160.0, 0.995);
    stars += starLayer(uv + 0.37, 250.0, 0.997) * 0.7;
    float starMask = smoothstep(horizon + 0.04, 0.68, uv.y) * uNight * (1.0 - uCloud * 0.86);
    sky += uStarColor * stars * starMask * 1.35;

    float moonX = uMoonX - (uCamera - 0.5) * 0.35;
    vec2 moonPos = vec2(moonX, uMoonY);
    float moonDist = length((uv - moonPos) * vec2(aspect, 1.0));
    float moonDisc = smoothstep(0.032, 0.025, moonDist);
    float moonGlow = exp(-moonDist * 8.0);
    float shadowOffset = uMoonFraction * 0.036;
    float moonShadow = smoothstep(
      0.030,
      0.023,
      length((uv - (moonPos + vec2(shadowOffset, 0.0))) * vec2(aspect, 1.0))
    );
    float moonShape = clamp(moonDisc - moonShadow, 0.0, 1.0);
    float moonVisible = uNight * uMoonVisible;
    sky += uStarColor * moonGlow * 0.16 * moonVisible;
    sky = mix(sky, uStarColor, moonShape * moonVisible * 0.95);

    vec2 cloudUv = vec2(
      uv.x * 1.7 + uTime * 0.004 * (0.35 + uWind) + uCamera * 0.2,
      uv.y * 2.3
    );
    float cloudField = fbm(cloudUv * 1.6 + fbm(cloudUv * 2.2 + uTime * 0.008) * 0.65);
    float cloudBand = smoothstep(0.46, 0.8, cloudField) * smoothstep(horizon, horizon + 0.32, uv.y);
    float cloudStrength = (0.1 + uCloud * 0.7) * cloudBand;
    sky = mix(sky, uCloudColor, cloudStrength);

    sky += vec3(0.66, 0.75, 0.88) * uLightning * 0.32;

    float haze = exp(-pow((uv.y - horizon) / 0.075, 2.0));
    sky = mix(sky, uHorizonColor, clamp(haze * 0.38 + uFog * 0.22, 0.0, 0.8));

    float waterDepth = clamp((horizon - uv.y) / horizon, 0.0, 1.0);
    vec3 water = mix(uWaterColor, uWaterDeep, pow(waterDepth, 0.72));
    vec3 reflectedSky = mix(uHorizonColor, uSkyBottom, 0.55);
    water = mix(water, reflectedSky, 0.12 + 0.08 * sin(uv.y * 28.0 + uTime * 0.5));

    float sunReflectionX = sunX + sin(uv.y * 95.0 + uTime * 1.7) * 0.012;
    float sunReflection = exp(-abs(uv.x - sunReflectionX) * 15.0) * exp(-waterDepth * 4.2);
    water += uSunGlow * sunReflection * sunVisible * 0.7;

    float moonReflectionX = moonX + sin(uv.y * 80.0 + uTime * 1.1) * 0.01;
    float moonReflection = exp(-abs(uv.x - moonReflectionX) * 18.0) * exp(-waterDepth * 5.0);
    water += uStarColor * moonReflection * moonVisible * 0.28;

    for (int i = 0; i < 6; i++) {
      vec3 ripple = uRipples[i];
      float age = uTime - ripple.z;
      if (age > 0.0 && age < 4.2) {
        vec2 center = vec2(ripple.x, ripple.y);
        float distanceToRipple = length((uv - center) * vec2(aspect, 1.0));
        float ring = sin(distanceToRipple * 95.0 - age * 11.0);
        ring *= exp(-distanceToRipple * 11.0) * exp(-age * 1.35);
        water += uAccent * ring * 0.18;
        water += vec3(0.85, 0.92, 0.9) * exp(-distanceToRipple * 28.0) * exp(-age * 2.0) * 0.12;
      }
    }

    float streak = noise(vec2(uv.x * 65.0 + uTime * 0.22, uv.y * 20.0 - uTime * 0.35));
    water += (streak - 0.5) * 0.045;
    water += smoothstep(0.72, 1.0, noise(vec2(uv.x * 90.0 + uTime * 2.0, uv.y * 55.0 - uTime * 1.5))) * uRain * 0.09;
    water = mix(water, uHorizonColor, uFog * 0.18 + smoothstep(0.0, 0.14, waterDepth) * 0.05);

    vec3 color = mix(water, sky, smoothstep(horizon - 0.004, horizon + 0.004, uv.y));
    color = mix(color, vec3(0.43, 0.51, 0.54), uRain * 0.07);
    color += (hash(uv * vec2(1280.0, 720.0) + uTime) - 0.5) * 0.012;

    float vignette = smoothstep(0.35, 1.15, length((uv - 0.5) * vec2(aspect * 0.72, 1.0)));
    color *= 1.0 - vignette * 0.34;

    gl_FragColor = vec4(pow(max(color, 0.0), vec3(0.94)), 1.0);
  }
`

const RIPPLE_COUNT = 6
const INACTIVE_RIPPLE_START = -1000

function createRippleState() {
  return Array.from({ length: RIPPLE_COUNT }, () => [0, 0, INACTIVE_RIPPLE_START])
}

export function SkyWaterShader({ theme }) {
  const canvasRef = useRef(null)
  const themeRef = useRef(theme)
  const ripplesRef = useRef(createRippleState())
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let renderer
    let program
    let resizeObserver
    let unsubscribe
    let lastRipple = 0

    try {
      renderer = new Renderer({
        canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        powerPreference: 'high-performance',
      })
    } catch (error) {
      console.warn('WebGL unavailable; using the CSS sky fallback.', error)
      setFailed(true)
      return undefined
    }

    const gl = renderer.gl
    gl.clearColor(0.02, 0.05, 0.07, 1)

    const current = themeRef.current
    const palette = current?.palette ?? {}
    const sun = current?.sun ?? {}
    const weather = current?.weather ?? {}
    const light = current?.light ?? {}

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: [1, 1] },
      uSunAlt: { value: sun.altitude ?? 20 },
      uSunX: { value: sun.x ?? 0.5 },
      uSunY: { value: sun.y ?? 0.7 },
      uMoonX: { value: sun.moonX ?? 0.5 },
      uMoonY: { value: sun.moonY ?? 0.7 },
      uMoonFraction: { value: sun.moonFraction ?? 0.5 },
      uMoonVisible: { value: sun.moonVisible ? 1 : 0 },
      uNight: { value: light.night ?? 0 },
      uCloud: { value: weather.cloudCover ?? 0 },
      uRain: { value: weather.rainRate ?? 0 },
      uFog: { value: weather.fogDensity ?? 0 },
      uLightning: { value: 0 },
      uWind: { value: 0.3 },
      uCamera: { value: 0 },
      uSkyTop: { value: rgbUnit(palette.skyTop ?? '#12213a') },
      uSkyBottom: { value: rgbUnit(palette.skyBottom ?? '#273c5e') },
      uHorizonColor: { value: rgbUnit(palette.horizon ?? '#6d5b7c') },
      uWaterColor: { value: rgbUnit(palette.water ?? '#0e1e30') },
      uWaterDeep: { value: rgbUnit(palette.waterDeep ?? '#06111d') },
      uSunColor: { value: rgbUnit(palette.sun ?? '#f0a35e') },
      uSunGlow: { value: rgbUnit(palette.sunGlow ?? '#c47d78') },
      uCloudColor: { value: rgbUnit(palette.cloud ?? '#2c3552') },
      uStarColor: { value: rgbUnit(palette.star ?? '#f4e9d0') },
      uAccent: { value: rgbUnit(palette.accent ?? '#c9a36a') },
      uRipples: { value: createRippleState() },
    }

    const geometry = new Triangle(gl)
    program = new Program(gl, { vertex, fragment, uniforms })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      program.uniforms.uResolution.value = [width, height]
    }

    resize()
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvas)
    } else {
      window.addEventListener('resize', resize)
    }

    const pushRipple = (event) => {
      if (event.clientY < window.innerHeight * 0.5) return
      const now = animationEngine.getTime() / 1000
      if (now - lastRipple < 0.12) return
      lastRipple = now
      const x = event.clientX / window.innerWidth
      const y = 1 - event.clientY / window.innerHeight
      const ripples = ripplesRef.current
      ripples.shift()
      ripples.push([x, y, now])
    }

    window.addEventListener('pointerdown', pushRipple, { passive: true })
    window.addEventListener('pointermove', pushRipple, { passive: true })

    unsubscribe = animationEngine.subscribe((time) => {
      const seconds = time / 1000
      const activeTheme = themeRef.current
      const activePalette = activeTheme?.palette ?? palette
      const activeSun = activeTheme?.sun ?? sun
      const activeWeather = activeTheme?.weather ?? weather
      const activeLight = activeTheme?.light ?? light

      const lightningBase = activeWeather.lightning ?? 0
      const pulse = Math.max(
        0,
        Math.sin(seconds * 0.9 + Math.sin(seconds * 0.13) * 3.1),
      )
      const flash =
        lightningBase *
        Math.pow(pulse, 34) *
        (0.55 + 0.45 * Math.abs(Math.sin(seconds * 11.0)))

      program.uniforms.uTime.value = seconds
      program.uniforms.uSunAlt.value = activeSun.altitude ?? 20
      program.uniforms.uSunX.value = activeSun.x ?? 0.5
      program.uniforms.uSunY.value = activeSun.y ?? 0.7
      program.uniforms.uMoonX.value = activeSun.moonX ?? 0.5
      program.uniforms.uMoonY.value = activeSun.moonY ?? 0.7
      program.uniforms.uMoonFraction.value = activeSun.moonFraction ?? 0.5
      program.uniforms.uMoonVisible.value = activeSun.moonVisible ? 1 : 0
      program.uniforms.uNight.value = activeLight.night ?? 0
      program.uniforms.uCloud.value = activeWeather.cloudCover ?? 0
      program.uniforms.uRain.value = activeWeather.rainRate ?? 0
      program.uniforms.uFog.value = activeWeather.fogDensity ?? 0
      program.uniforms.uLightning.value = flash
      program.uniforms.uWind.value = sharedWindField.current.speed
      program.uniforms.uCamera.value = scrollState.progress
      program.uniforms.uSkyTop.value = rgbUnit(activePalette.skyTop ?? '#12213a')
      program.uniforms.uSkyBottom.value = rgbUnit(
        activePalette.skyBottom ?? '#273c5e',
      )
      program.uniforms.uHorizonColor.value = rgbUnit(
        activePalette.horizon ?? '#6d5b7c',
      )
      program.uniforms.uWaterColor.value = rgbUnit(
        activePalette.water ?? '#0e1e30',
      )
      program.uniforms.uWaterDeep.value = rgbUnit(
        activePalette.waterDeep ?? '#06111d',
      )
      program.uniforms.uSunColor.value = rgbUnit(activePalette.sun ?? '#f0a35e')
      program.uniforms.uSunGlow.value = rgbUnit(
        activePalette.sunGlow ?? '#c47d78',
      )
      program.uniforms.uCloudColor.value = rgbUnit(
        activePalette.cloud ?? '#2c3552',
      )
      program.uniforms.uStarColor.value = rgbUnit(
        activePalette.star ?? '#f4e9d0',
      )
      program.uniforms.uAccent.value = rgbUnit(activePalette.accent ?? '#c9a36a')
      program.uniforms.uRipples.value = ripplesRef.current.map((ripple) => [
        ...ripple,
      ])

      renderer.render({ scene: mesh })
    })

    const handleContextLost = (event) => {
      event.preventDefault()
      setFailed(true)
    }
    canvas.addEventListener('webglcontextlost', handleContextLost)

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      window.removeEventListener('pointerdown', pushRipple)
      window.removeEventListener('pointermove', pushRipple)
      window.removeEventListener('resize', resize)
      resizeObserver?.disconnect()
      unsubscribe?.()
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`sky-shader ${failed ? 'is-hidden' : ''}`}
        aria-hidden="true"
      />
      {failed ? <div className="sky-fallback" aria-hidden="true" /> : null}
    </>
  )
}
