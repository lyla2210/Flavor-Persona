/**
 * Soft Web Audio SFX — no asset files, unlocked after first user gesture.
 */

export type SoundName =
  | "tap"
  | "pour"
  | "unlock"
  | "error"
  | "flip"
  | "reveal"
  | "save"
  | "soft";

const MUTE_KEY = "flavor-persona-muted";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private unlocked = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.muted = window.localStorage.getItem(MUTE_KEY) === "1";
    }
  }

  isMuted() {
    return this.muted;
  }

  setMuted(next: boolean) {
    this.muted = next;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    }
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  async unlock() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }
    this.unlocked = true;
  }

  play(name: SoundName) {
    if (this.muted || typeof window === "undefined") return;
    void this.unlock().then(() => {
      if (!this.unlocked || this.muted) return;
      try {
        this.trigger(name);
      } catch {
        // Ignore AudioContext failures (autoplay / unsupported).
      }
    });
  }

  private ensureContext() {
    if (typeof window === "undefined") return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) this.ctx = new AudioCtx();
    return this.ctx;
  }

  private now() {
    return this.ctx?.currentTime ?? 0;
  }

  private master(destination: AudioNode, gainValue: number, start: number, duration: number) {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    gain.connect(destination);
    return gain;
  }

  private tone(
    freq: number,
    type: OscillatorType,
    start: number,
    duration: number,
    gainValue: number,
    destination: AudioNode,
    glideTo?: number,
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = this.master(destination, gainValue, start, duration);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (glideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(glideTo, 1), start + duration * 0.85);
    }
    osc.connect(gain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private noiseBurst(
    start: number,
    duration: number,
    gainValue: number,
    destination: AudioNode,
    options?: { bandHz?: number; type?: BiquadFilterType; q?: number; brown?: boolean },
  ) {
    const ctx = this.ctx!;
    const length = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;

    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      const sample = options?.brown ? (last + 0.02 * white) / 1.02 : white;
      last = sample;
      const envelope = 1 - i / length;
      data[i] = sample * envelope;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = options?.type ?? "bandpass";
    filter.frequency.value = options?.bandHz ?? 700;
    filter.Q.value = options?.q ?? 0.7;

    const gain = this.master(destination, gainValue, start, duration);
    source.connect(filter);
    filter.connect(gain);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  /** Longer liquid pour: stream + splash + soft bubbles. */
  private playPour(t: number, out: AudioNode) {
    const ctx = this.ctx!;

    // Main falling stream
    this.noiseBurst(t, 0.72, 0.07, out, { bandHz: 780, type: "bandpass", q: 0.55 });
    this.noiseBurst(t + 0.04, 0.65, 0.045, out, { bandHz: 420, type: "lowpass", q: 0.4, brown: true });

    // Soft body of liquid
    this.tone(140, "sine", t, 0.7, 0.03, out, 95);
    this.tone(210, "triangle", t + 0.05, 0.55, 0.018, out, 150);

    // Splash accents
    this.noiseBurst(t + 0.12, 0.16, 0.05, out, { bandHz: 1600, type: "highpass", q: 0.8 });
    this.noiseBurst(t + 0.28, 0.14, 0.035, out, { bandHz: 1200, type: "bandpass", q: 1.1 });
    this.noiseBurst(t + 0.46, 0.18, 0.03, out, { bandHz: 900, type: "bandpass", q: 0.9 });

    // Tiny bubble ticks
    for (let i = 0; i < 5; i += 1) {
      const at = t + 0.1 + i * 0.1;
      this.tone(900 + i * 120, "sine", at, 0.045, 0.012, out);
      this.noiseBurst(at, 0.05, 0.016, out, { bandHz: 1800 + i * 80, type: "bandpass", q: 2.2 });
    }

    // Gentle filter sweep for flow motion
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = "sine";
    sweep.frequency.value = 6;
    sweepGain.gain.value = 0;
    sweep.connect(sweepGain);
    sweepGain.connect(out);
    sweep.start(t);
    sweep.stop(t + 0.05);
  }

  /** Light, bright click for answers. */
  private playTap(t: number, out: AudioNode) {
    this.tone(988, "sine", t, 0.09, 0.055, out);
    this.tone(1319, "triangle", t, 0.07, 0.03, out);
    this.tone(1568, "sine", t + 0.02, 0.08, 0.022, out);
    this.noiseBurst(t, 0.035, 0.018, out, { bandHz: 2400, type: "highpass", q: 0.7 });
  }

  private trigger(name: SoundName) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t = this.now();
    const out = ctx.destination;

    switch (name) {
      case "tap":
        this.playTap(t, out);
        break;
      case "soft":
        this.tone(740, "sine", t, 0.06, 0.028, out);
        this.tone(988, "triangle", t + 0.015, 0.05, 0.016, out);
        break;
      case "pour":
        this.playPour(t, out);
        break;
      case "unlock":
        this.tone(523.25, "sine", t, 0.18, 0.05, out);
        this.tone(659.25, "sine", t + 0.1, 0.2, 0.045, out);
        this.tone(783.99, "triangle", t + 0.2, 0.28, 0.04, out);
        break;
      case "error":
        this.tone(220, "triangle", t, 0.14, 0.04, out);
        this.tone(170, "sine", t + 0.05, 0.16, 0.03, out);
        break;
      case "flip":
        this.noiseBurst(t, 0.18, 0.04, out, { bandHz: 1400, type: "bandpass", q: 0.8 });
        this.tone(420, "sine", t, 0.14, 0.03, out);
        this.tone(640, "triangle", t + 0.05, 0.12, 0.022, out);
        break;
      case "reveal":
        this.tone(523.25, "sine", t, 0.22, 0.04, out);
        this.tone(659.25, "sine", t + 0.08, 0.24, 0.035, out);
        this.tone(783.99, "sine", t + 0.16, 0.32, 0.032, out);
        this.tone(1046.5, "triangle", t + 0.24, 0.38, 0.028, out);
        break;
      case "save":
        this.tone(740, "sine", t, 0.1, 0.04, out);
        this.tone(980, "sine", t + 0.08, 0.14, 0.035, out);
        break;
      default:
        break;
    }
  }
}

export const sounds = new SoundEngine();
