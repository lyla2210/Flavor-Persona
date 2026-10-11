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
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
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
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = this.master(destination, gainValue, start, duration);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    osc.connect(gain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private noiseBurst(start: number, duration: number, gainValue: number, destination: AudioNode, bandHz = 700) {
    const ctx = this.ctx!;
    const length = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = bandHz;
    filter.Q.value = 0.7;

    const gain = this.master(destination, gainValue, start, duration);
    source.connect(filter);
    filter.connect(gain);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  private trigger(name: SoundName) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t = this.now();
    const out = ctx.destination;

    switch (name) {
      case "tap":
        this.tone(880, "sine", t, 0.08, 0.045, out);
        this.tone(1320, "triangle", t, 0.06, 0.02, out);
        break;
      case "soft":
        this.tone(620, "sine", t, 0.05, 0.03, out);
        break;
      case "pour":
        this.noiseBurst(t, 0.55, 0.055, out, 520);
        this.tone(180, "sine", t, 0.45, 0.028, out);
        this.tone(240, "triangle", t + 0.08, 0.35, 0.018, out);
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
        this.noiseBurst(t, 0.18, 0.04, out, 1400);
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
