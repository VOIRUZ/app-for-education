// Web Audio API Sound Synthesizer & Ambient Engine
// 100% Procedural - Zero External Audio Files, Zero WASM

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.windNode = null;
    this.windGain = null;
    this.musicTimer = null;
    this.isMuted = false;
    this.currentMood = 'calm'; // 'calm', 'tense', 'emotional', 'victory'
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupWindAmbience();
      this.startAmbientMusic();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.windGain) {
      this.windGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  setMood(mood) {
    this.currentMood = mood;
  }

  // Atmospheric Martian Wind (White Noise + Sweeping Biquad Lowpass Filter)
  setupWindAmbience() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;
      filter.Q.value = 3.0;

      // Slowly modulate filter frequency for wind gusts
      setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const targetFreq = 140 + Math.random() * 220;
        filter.frequency.linearRampToValueAtTime(targetFreq, now + 3);
      }, 3500);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = this.isMuted ? 0 : 0.035;

      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);
      whiteNoise.start(0);
      this.windNode = whiteNoise;
    } catch (e) {
      console.warn('Audio ambience init notice:', e);
    }
  }

  // Procedural Warm Space Chords (Soft sine chords for emotional storytelling)
  startAmbientMusic() {
    const chordProgressions = {
      calm: [
        [220, 261.63, 329.63], // Am
        [174.61, 220, 261.63], // F
        [261.63, 329.63, 392], // C
        [196, 246.94, 293.66]  // G
      ],
      tense: [
        [146.83, 174.61, 220], // Dm
        [138.59, 174.61, 207.65], // C#dim
        [130.81, 164.81, 196]  // C
      ],
      emotional: [
        [261.63, 329.63, 392, 493.88], // Cmaj7
        [220, 261.63, 329.63, 392],    // Am7
        [174.61, 220, 261.63, 329.63]  // Fmaj7
      ]
    };

    let chordIdx = 0;
    this.musicTimer = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const chords = chordProgressions[this.currentMood] || chordProgressions.calm;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;
      this.playPadChord(chord, 4.5);
    }, 6000);
  }

  playPadChord(frequencies, duration = 4.0) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  // --- SOUND EFFECTS ---

  playClick() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playTypewriter() {
    if (!this.ctx || this.isMuted) return;
    if (Math.random() > 0.4) return; // subtle throttle
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 + Math.random() * 300, now);
    gain.gain.setValueAtTime(0.012, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  playRadioSquelch() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playChime() {
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    });
  }

  playAlarm() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(500, now + 0.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }
}
