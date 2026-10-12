/**
 * soundEffects.ts — Sistema de Audio de Alta Fidelidad
 * Música de fondo moderna, melódica y relajante (ambient-music.mp3)
 * + Micro-interacciones táctiles sutiles en botones (Hover & Click)
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private hasInteracted: boolean = false;
  private lastHoverTime: number = 0;
  private listenersAttached: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  // Reproductor de música moderna de fondo
  private audioElement: HTMLAudioElement | null = null;
  private targetVolume: number = 0.22; // Volumen suave, moderno y elegante
  private fadeInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('geosoft_sound_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    }
  }

  private getAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioElement) {
      this.audioElement = new Audio('/assets/audio/ambient-music.mp3');
      this.audioElement.loop = true;
      this.audioElement.volume = this.muted ? 0 : 0.001;
      this.audioElement.preload = 'auto';
    }
    return this.audioElement;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

    // Desbloquear audio y reproducir música al primer gesto del usuario
    const unlockAudio = () => {
      this.hasInteracted = true;
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      if (!this.muted) {
        this.startAmbientMusic();
      }

      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    // Delegación global de eventos para hover y click en botones y enlaces
    document.addEventListener(
      'mouseover',
      (e) => {
        const target = (e.target as HTMLElement)?.closest?.(
          'button, a, [role="button"], .cursor-pointer, input[type="submit"]'
        );
        if (target) {
          this.playHoverSound();
        }
      },
      { passive: true }
    );

    document.addEventListener(
      'mousedown',
      (e) => {
        const target = (e.target as HTMLElement)?.closest?.(
          'button, a, [role="button"], .cursor-pointer, input[type="submit"]'
        );
        if (target) {
          this.playClickSound();
        }
      },
      { passive: true }
    );
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
    this.listeners.forEach((fn) => fn(this.muted));

    if (this.muted) {
      this.stopAmbientMusic();
    } else {
      this.hasInteracted = true;
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      this.startAmbientMusic();
      this.playHoverSound();
    }
    return this.muted;
  }

  /**
   * =========================================================================
   * 1. MÚSICA MODERNA DE FONDO (Pista Chill / Ambient Melódico)
   * =========================================================================
   */
  public startAmbientMusic() {
    if (this.muted) return;
    const audio = this.getAudioElement();
    if (!audio) return;

    if (this.fadeInterval) {
      window.clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    try {
      if (audio.paused) {
        audio.volume = 0.001;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.fadeIn(audio);
            })
            .catch(() => {
              // Navegador aún no permite reproducción automática
            });
        }
      } else {
        this.fadeIn(audio);
      }
    } catch {}
  }

  private fadeIn(audio: HTMLAudioElement) {
    if (this.fadeInterval) window.clearInterval(this.fadeInterval);
    const step = 0.015;
    this.fadeInterval = window.setInterval(() => {
      if (audio.volume + step >= this.targetVolume) {
        audio.volume = this.targetVolume;
        if (this.fadeInterval) {
          window.clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
      } else {
        audio.volume += step;
      }
    }, 80);
  }

  public stopAmbientMusic() {
    const audio = this.audioElement;
    if (!audio || audio.paused) return;

    if (this.fadeInterval) {
      window.clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const step = 0.03;
    this.fadeInterval = window.setInterval(() => {
      if (audio.volume - step <= 0.01) {
        audio.volume = 0;
        audio.pause();
        if (this.fadeInterval) {
          window.clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
      } else {
        audio.volume -= step;
      }
    }, 60);
  }

  /**
   * =========================================================================
   * 2. SONIDO DE ENTRADA / BIENVENIDA (Acorde brillante suave)
   * =========================================================================
   */
  public playIntroSound() {
    if (this.muted) return;
    this.startAmbientMusic();

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Acorde brillante etéreo suave (E4, G#4, B4, E5)
      const frequencies = [329.63, 415.30, 493.88, 659.25];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const delay = idx * 0.04;
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.025 / (idx + 1), now + delay + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 1.25);
      });
    } catch {}
  }

  /**
   * =========================================================================
   * 3. SONIDO DE HOVER EN BOTONES (Micro-Tick Sutil y Cristalino)
   * =========================================================================
   */
  public playHoverSound() {
    if (this.muted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastHoverTime < 60) return;
    this.lastHoverTime = nowMs;

    const ctx = this.getContext();
    if (!ctx || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.015);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.018, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.022);
    } catch {}
  }

  /**
   * =========================================================================
   * 4. SONIDO DE CLIC EN BOTONES (Micro-Tap Mecánico Táctil)
   * =========================================================================
   */
  public playClickSound() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }
}

export const soundEffects = new SoundEffectsService();
