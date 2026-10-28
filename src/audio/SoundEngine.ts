/**
 * SoundEngine - 100% Web Audio API Synthesizer
 * Zero external MP3 files for guaranteed reliability in auditorium environments.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private lastTickTime: number = 0;

  constructor() {
    // SoundEngine will initialize context lazily upon user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.7, now + 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Mechanical wheel tick (clack) with micro-pitch variance
   */
  public playWheelTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Rate limit ticks to avoid audio buffer saturation at high velocity
    const now = performance.now();
    if (now - this.lastTickTime < 18) return;
    this.lastTickTime = now;

    const t = this.ctx.currentTime;

    // High click component
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Randomize pitch slightly for organic ratchet feel
    const baseFreq = 750 + Math.random() * 250;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.035);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(3.0, t);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.04);

    // Subtle wooden body thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(220, t);
    subOsc.frequency.exponentialRampToValueAtTime(60, t + 0.03);

    subGain.gain.setValueAtTime(0.25, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(t);
    subOsc.stop(t + 0.035);
  }

  /**
   * Dramatic TV show suspense reveal when opening question modal
   */
  public playQuestionDramaticReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Sub bass hit
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(45, t + 0.8);

    subGain.gain.setValueAtTime(0.8, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(t);
    subOsc.stop(t + 1.3);

    // Cinematic brass-like suspense chord (D minor suspense: D3, F3, A3, E4)
    const freqs = [146.83, 174.61, 220.00, 329.63];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t);
      filter.frequency.exponentialRampToValueAtTime(2400, t + 0.4);
      filter.frequency.exponentialRampToValueAtTime(600, t + 1.6);

      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 1.9);
    });
  }

  /**
   * Smooth countdown rhythmic tick for 15s timer
   */
  public playCountdownTick(isUrgent: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isUrgent ? 'sawtooth' : 'sine';
    const freq = isUrgent ? 880 : 587.33; // D5 or A5
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(isUrgent ? 0.35 : 0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isUrgent ? 0.09 : 0.05));

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Sparkling chime when official answer is revealed
   */
  public playAnswerReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Ascending luminous chime arpeggio: C5, E5, G5, B5, C6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = t + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0, noteTime);
      gain.gain.linearRampToValueAtTime(0.28, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.65);
    });
  }

  /**
   * Triumphant TV Show Winner Fanfare
   */
  public playWinnerFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Victory progression: C4 -> G4 -> C5 -> E5 -> G5 -> C6 (Held finale chord)
    const sequence = [
      { freq: 261.63, delay: 0.00, dur: 0.12 }, // C4
      { freq: 392.00, delay: 0.12, dur: 0.12 }, // G4
      { freq: 523.25, delay: 0.24, dur: 0.15 }, // C5
      { freq: 659.25, delay: 0.38, dur: 0.15 }, // E5
      { freq: 783.99, delay: 0.52, dur: 0.18 }, // G5
    ];

    sequence.forEach((item) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = t + item.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.freq, noteTime);

      gain.gain.setValueAtTime(0.0, noteTime);
      gain.gain.linearRampToValueAtTime(0.35, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + item.dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + item.dur + 0.05);
    });

    // Big triumphant final chord (C5 + E5 + G5 + C6)
    const chordTime = t + 0.72;
    const chordNotes = [523.25, 659.25, 783.99, 1046.50];

    chordNotes.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, chordTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, chordTime);

      gain.gain.setValueAtTime(0.0, chordTime);
      gain.gain.linearRampToValueAtTime(0.18, chordTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(chordTime);
      osc.stop(chordTime + 1.9);
    });
  }

  /**
   * Wrong Answer Buzzer (Classic Game Show low detuned dissonance)
   */
  public playWrongBuzzer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Two detuned sawtooth waves to create classic harsh buzz
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130.81, t); // C3

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(138.59, t); // C#3 (dissonant half step)

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, t);

    // Double buzz pattern: Bzzz - pause - Bzzz
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.setValueAtTime(0.4, t + 0.18);
    gain.gain.setValueAtTime(0.01, t + 0.22);
    gain.gain.setValueAtTime(0.4, t + 0.26);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.6);
    osc2.stop(t + 0.6);
  }
}

export const soundEngine = new SoundEngine();
