/**
 * soundEffects.ts — Sistema Sensorial Acústico Completo
 * Incluye:
 * 1. Música Ambiental de Fondo Continua Generativa (Atmósfera espacial cinematográfica)
 * 2. Sonido de Bienvenida / Intro
 * 3. Micro-ticks de Hover en botones
 * 4. Micro-taps mecánicos al presionar botones
 * Cero dependencias externas, 0 KB de descargas MP3 y cero consumo de ancho de banda.
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private hasInteracted: boolean = false;
  private lastHoverTime: number = 0;
  private listenersAttached: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  // Nodos para la música ambiental continua
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private ambientLfo: OscillatorNode | null = null;
  private isAmbientPlaying: boolean = false;

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

    // Desbloquear audio en el primer gesto de usuario (requerido por políticas de navegadores)
    const unlockAudio = () => {
      this.hasInteracted = true;
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          if (!this.muted && !this.isAmbientPlaying) {
            this.startAmbientMusic();
          }
        }).catch(() => {});
      } else {
        if (!this.muted && !this.isAmbientPlaying) {
          this.startAmbientMusic();
        }
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
      const target = (e.target as HTMLElement)?.closest?.(
        'button, a, [role="button"], .cursor-pointer, input[type="submit"]'
      );
      if (target) {
        this.playHoverSound();
      }
    }, { passive: true });

    document.addEventListener('mousedown', (e) => {
      const target = (e.target as HTMLElement)?.closest?.(
        'button, a, [role="button"], .cursor-pointer, input[type="submit"]'
      );
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
   * 1. MÚSICA AMBIENTAL DE FONDO CONTINUA (Atmósfera Espacial Cinematográfica)
   * =========================================================================
   */
  public startAmbientMusic() {
    if (this.muted || this.isAmbientPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.isAmbientPlaying = true;
      const now = ctx.currentTime;

      // Ganancia maestra de música ambiental
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      // Fade-in suave de 2.5 segundos para una entrada elegante y no invasiva
      masterGain.gain.linearRampToValueAtTime(0.042, now + 2.5);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      // Filtro pasa-bajos dinámico con resonancia sutil
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(2.2, now);
      filter.connect(masterGain);
      this.ambientFilter = filter;

      // LFO para hacer que el filtro "respire" suavemente como una atmósfera viva
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08, now); // 1 ciclo cada 12.5 segundos
      lfoGain.gain.setValueAtTime(140, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.ambientLfo = lfo;

      // Capas armónicas del acorde cósmico (C2, G2, D3, E3, B3)
      const layers = [
        { freq: 65.41, type: 'sine' as OscillatorType, gain: 0.8 },     // Fundamental Sub C2
        { freq: 98.00, type: 'sine' as OscillatorType, gain: 0.6 },     // Quinta G2
        { freq: 146.83, type: 'triangle' as OscillatorType, gain: 0.35 },// Novena D3
        { freq: 164.81, type: 'sine' as OscillatorType, gain: 0.4 },    // Tercera E3
        { freq: 246.94, type: 'sine' as OscillatorType, gain: 0.25 },   // Séptima Mayor B3
      ];

      this.ambientOscs = [];

      layers.forEach((layer) => {
        const osc = ctx.createOscillator();
        const layerGain = ctx.createGain();

        osc.type = layer.type;
        osc.frequency.setValueAtTime(layer.freq, now);

        layerGain.gain.setValueAtTime(layer.gain, now);

        osc.connect(layerGain);
        layerGain.connect(filter);
        osc.start(now);

        this.ambientOscs.push(osc);
      });
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public stopAmbientMusic() {
    if (!this.isAmbientPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (this.ambientGain) {
        // Fade-out suave de 1.2 segundos
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
      }

      setTimeout(() => {
        this.ambientOscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.ambientOscs = [];

        if (this.ambientLfo) {
          try {
            this.ambientLfo.stop();
            this.ambientLfo.disconnect();
          } catch {}
          this.ambientLfo = null;
        }

        if (this.ambientFilter) {
          this.ambientFilter.disconnect();
          this.ambientFilter = null;
        }

        if (this.ambientGain) {
          this.ambientGain.disconnect();
          this.ambientGain = null;
        }

        this.isAmbientPlaying = false;
      }, 1250);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  /**
   * =========================================================================
   * 2. SONIDO DE BIENVENIDA / INTRO (Acorde Armónico Etéreo)
   * =========================================================================
   */
  public playIntroSound() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Si la música de fondo no estaba sonando, arrancarla
    if (!this.isAmbientPlaying) {
      this.startAmbientMusic();
    }

    try {
      const now = ctx.currentTime;
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
   * =========================================================================
   * 3. SONIDO DE HOVER EN BOTONES (Micro-Blip Suave y Cristalino)
   * =========================================================================
   */
  public playHoverSound() {
    if (this.muted) return;
    const nowMs = Date.now();
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
   * =========================================================================
   * 4. SONIDO DE CLIC EN BOTONES (Micro-Tap Táctil y Mecánico)
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
