let audioCtx = null
let isMuted = localStorage.getItem('match-score-muted') === 'true'

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function toggleMute() {
  isMuted = !isMuted
  localStorage.setItem('match-score-muted', String(isMuted))
  return isMuted
}

export function getMuteState() {
  return isMuted
}

function playTone(freq, type, duration, delay = 0, volume = 0.1) {
  if (isMuted) return
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)

    gain.gain.setValueAtTime(volume, ctx.currentTime + delay)
    // Decrece exponencialmente para evitar cliques no áudio
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + delay + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration)
  } catch (e) {
    console.warn('Audio synthesis failed:', e)
  }
}

export function playClick() {
  playTone(800, 'square', 0.08, 0, 0.05)
}

export function playSwipeLeft() {
  if (isMuted) return
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.22)
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.22)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.22)
  } catch (e) {
    console.warn(e)
  }
}

export function playSwipeRight() {
  if (isMuted) return
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(160, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.18)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.18)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.18)
  } catch (e) {
    console.warn(e)
  }
}

export function playCoin() {
  if (isMuted) return
  try {
    playTone(987.77, 'square', 0.08, 0, 0.04) // B5
    playTone(1318.51, 'square', 0.22, 0.08, 0.04) // E6
  } catch (e) {
    console.warn(e)
  }
}

export function playSuccess() {
  if (isMuted) return
  try {
    const tones = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    tones.forEach((freq, idx) => {
      playTone(freq, 'triangle', 0.15, idx * 0.07, 0.05)
    });
  } catch (e) {
    console.warn(e)
  }
}

export function playHeartbeat() {
  if (isMuted) return
  try {
    playTone(55, 'sine', 0.15, 0, 0.2)
    playTone(55, 'sine', 0.15, 0.18, 0.2)
  } catch (e) {
    console.warn(e)
  }
}

export function playFanfare() {
  if (isMuted) return
  try {
    const notes = [
      { f: 523.25, d: 0.12, t: 0.0 }, // C5
      { f: 659.25, d: 0.12, t: 0.12 }, // E5
      { f: 783.99, d: 0.12, t: 0.24 }, // G5
      { f: 1046.50, d: 0.24, t: 0.36 }, // C6
      { f: 783.99, d: 0.12, t: 0.6 }, // G5
      { f: 1046.50, d: 0.48, t: 0.72 }, // C6
    ]
    notes.forEach((note) => {
      playTone(note.f, 'square', note.d, note.t, 0.04)
    })
  } catch (e) {
    console.warn(e)
  }
}
