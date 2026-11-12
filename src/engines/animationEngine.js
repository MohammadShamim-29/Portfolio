class AnimationEngine {
  constructor() {
    this.subscribers = new Set()
    this.samplers = new Set()
    this.running = false
    this.pausedByVisibility = false
    this.raf = 0
    this.last = 0
    this.elapsed = 0
    this.handleVisibility = this.handleVisibility.bind(this)
    this.loop = this.loop.bind(this)

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibility)
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    this.start()
    return () => {
      this.subscribers.delete(callback)
      if (this.subscribers.size === 0) this.stop()
    }
  }

  addSampler(callback) {
    this.samplers.add(callback)
    return () => this.samplers.delete(callback)
  }

  start() {
    if (typeof window === 'undefined' || this.running) return
    if (typeof document !== 'undefined' && document.hidden) {
      this.pausedByVisibility = true
      return
    }
    this.running = true
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.loop)
  }

  stop() {
    this.running = false
    this.pausedByVisibility = false
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  handleVisibility() {
    if (typeof document === 'undefined') return
    if (document.hidden) {
      if (this.running) {
        this.running = false
        this.pausedByVisibility = true
        if (this.raf) cancelAnimationFrame(this.raf)
        this.raf = 0
      }
      return
    }

    if (this.pausedByVisibility) {
      this.pausedByVisibility = false
      this.start()
    }
  }

  loop(now) {
    if (!this.running) return
    const delta = Math.min(64, Math.max(0, now - this.last))
    this.last = now
    this.elapsed += delta

    for (const subscriber of this.subscribers) {
      try {
        subscriber(this.elapsed, delta, now)
      } catch (error) {
        console.error('Animation subscriber failed', error)
      }
    }

    for (const sampler of this.samplers) {
      try {
        sampler(delta)
      } catch (error) {
        console.error('Animation sampler failed', error)
      }
    }

    this.raf = requestAnimationFrame(this.loop)
  }

  getTime() {
    return this.elapsed
  }
}

export const animationEngine = new AnimationEngine()
