/**
 * soundEffects.ts — Sistema de Micro-Interacciones Acústicas de Alta Fidelidad
 * Genera síntesis sonora en tiempo real mediante Web Audio API nativa
 * Cero dependencias externas, cero latencia y 0 KB de descargas MP3
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private hasInteracted: boolean = false;
  private lastHoverTime: number = 0;
  private listenersAttached: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('geosoft_sound_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended' && this.hasInteracted) {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public init() {
    if (typeof window === 'undefined' || this.listenersAttached) return;
    this.listenersAttached = true;

    // Desbloquear audio en el primer gesto de usuario (política de navegadores)
    const unlockAudio = () => {
      this.hasInteracted = true;
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    // Delegación global de eventos para hover y click en botones y enlaces
    document.addEventListener('mouseover', (e) => {
      const target = (e.target as HTMLElement)?.closest?.('button, a, [role="button"], .cursor-pointer, input[type="submit"]');
      if (target) {
        this.playHoverSound();
      }
    }, { passive: true });

    document.addEventListener('mousedown', (e) => {
      const target = (e.target as HTMLElement)?.closest?.('button, a, [role="button"], .cursor-pointer, input[type="submit"]');
      if (target) {
        this.playClickSound();
      }
    }, { passive: true });
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('geosoft_sound_muted', String(this.muted));
    }
    this.listeners.forEach(fn => fn(this.muted));
    if (!this.muted) {
      this.hasInteracted = true;
      this.playHoverSound();
    }
    return this.muted;
  }

  /**
   * 1. Sonido de Bienvenida / Intro (Acorde armónico etéreo futurista)
   */
  public playIntroSound() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Frecuencias del acorde pentatónico cálido (C4, E4, G4, B4, D5)
      const frequencies = [261.63, 329.63, 392.00, 493.88, 587.33];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.3);
        filter.frequency.exponentialRampToValueAtTime(700, now + 1.5);

        const delay = idx * 0.035;
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.04 / (idx + 1), now + delay + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 1.65);
      });
    } catch {}
  }

  /**
   * 2. Sonido al pasar sobre un botón (Hover — micro-blip suave y cristalino)
   */
  public playHoverSound() {
    if (this.muted) return;
    const nowMs = Date.now();
    // Throttling de 55ms para evitar saturación si el cursor pasa rápido
    if (nowMs - this.lastHoverTime < 55) return;
    this.lastHoverTime = nowMs;

    const ctx = this.getContext();
    if (!ctx || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1050, now);
      osc.frequency.exponentialRampToValueAtTime(1380, now + 0.018);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.022, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {}
  }

  /**
   * 3. Sonido al presionar un botón (Click — micro-tap táctil y mecánico)
   */
  public playClickSound() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }
}

export const soundEffects = new SoundEffectsService();
