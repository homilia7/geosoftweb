import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, ArrowRight, Volume2, VolumeX, Mouse, ChevronDown } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface SplashIntroProps {
  onFinish?: () => void;
}

const TOTAL_FRAMES = 189;
const FRAME_BASE_PATH = '/assets/transition-sequence';

export const SplashIntro: React.FC<SplashIntroProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  // Fases: 'cinematic' (Video interactivo con scroll) -> 'brand' (Pantalla con "Iniciando experiencia...") -> 'entering' (Carga la página web)
  const [stage, setStage] = useState<'cinematic' | 'brand' | 'entering'>('cinematic');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedMapRef = useRef<boolean[]>([]);
  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const animFrameIdRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Iniciar la música tecnológica profesional (instrumental, cero voces)
  const tryPlayAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.35;
    audioRef.current.muted = isMuted;
    audioRef.current
      .play()
      .then(() => setIsAudioPlaying(true))
      .catch(() => {
        // El navegador requiere interacción del usuario
        setIsAudioPlaying(false);
      });
  }, [isMuted]);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted && audioRef.current.paused) {
        audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
      }
    }
  };

  // Inicializar audio
  useEffect(() => {
    const audio = new Audio('/assets/audio/ambient-music.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Intentar reproducir de inmediato si la política del navegador lo permite
    tryPlayAudio();

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [tryPlayAudio]);

  // Dibujar un frame específico en el canvas con máxima nitidez
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIdx)));

    // Si el fotograma no está listo aún, buscar el más cercano cargado
    if (!loadedMapRef.current[targetIdx]) {
      let found = false;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (targetIdx - offset >= 1 && loadedMapRef.current[targetIdx - offset]) {
          targetIdx = targetIdx - offset;
          found = true;
          break;
        }
        if (targetIdx + offset <= TOTAL_FRAMES && loadedMapRef.current[targetIdx + offset]) {
          targetIdx = targetIdx + offset;
          found = true;
          break;
        }
      }
      if (!found) return;
    }

    const img = imagesRef.current[targetIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (canvasWidth - imgWidth * ratio) / 2;
    const centerShiftY = (canvasHeight - imgHeight * ratio) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(
      img,
      0,
      0,
      imgWidth,
      imgHeight,
      centerShiftX,
      centerShiftY,
      imgWidth * ratio,
      imgHeight * ratio
    );
  }, []);

  // Ajustar dimensiones del canvas considerando Device Pixel Ratio
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      renderFrame(currentFrameRef.current);
    }
  }, [renderFrame]);

  // Precarga progresiva de los 189 fotogramas ultra-nítidos
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];
    const loadedMap: boolean[] = [];

    // Pre-cargar el fotograma 1 de inmediato para visualización instantánea
    const frame1 = new Image();
    frame1.src = `${FRAME_BASE_PATH}/frame_001.webp`;
    frame1.onload = () => {
      if (!isMounted) return;
      loadedMap[1] = true;
      resizeCanvas();
      renderFrame(1);
    };
    images[1] = frame1;

    // Cargar los demás fotogramas en paralelo
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const padded = String(i).padStart(3, '0');
      const img = new Image();
      img.src = `${FRAME_BASE_PATH}/frame_${padded}.webp`;
      img.onload = () => {
        if (!isMounted) return;
        loadedMap[i] = true;
      };
      images[i] = img;
    }

    imagesRef.current = images;
    loadedMapRef.current = loadedMap;

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      isMounted = false;
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas, renderFrame]);

  const handleSequenceComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    soundEffects.playIntroSound();
    setStage('brand');
  }, []);

  // Bucle de animación suave con interpolación (lerp)
  useEffect(() => {
    if (stage !== 'cinematic') return;

    const animate = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.18;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameRound = Math.round(currentFrameRef.current);
      setCurrentFrameNum(frameRound);
      const calculatedProgress = Math.min(100, Math.max(0, Math.round((currentFrameRef.current / TOTAL_FRAMES) * 100)));
      setProgress(calculatedProgress);

      renderFrame(currentFrameRef.current);

      // Si llegó al final de la secuencia de scroll (fotograma 189 o >= 99%)
      if (currentFrameRef.current >= TOTAL_FRAMES - 0.5 && targetFrameRef.current >= TOTAL_FRAMES) {
        handleSequenceComplete();
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [stage, renderFrame, handleSequenceComplete]);

  // Manejo de scroll con la rueda del ratón (Wheel)
  useEffect(() => {
    if (stage !== 'cinematic') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Iniciar la música en el primer gesto de scroll
      tryPlayAudio();

      // Sensibilidad optimizada para avance suave y controlado
      const stepDelta = e.deltaY * 0.08;
      const nextTarget = Math.max(1, Math.min(TOTAL_FRAMES, targetFrameRef.current + stepDelta));
      targetFrameRef.current = nextTarget;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
        tryPlayAudio();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0 || touchStartYRef.current === null) return;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY;
      touchStartYRef.current = currentY;

      const stepDelta = deltaY * 0.12;
      const nextTarget = Math.max(1, Math.min(TOTAL_FRAMES, targetFrameRef.current + stepDelta));
      targetFrameRef.current = nextTarget;
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [stage, tryPlayAudio]);

  // Bloqueo estricto del scroll del navegador mientras la intro está activa
  useEffect(() => {
    if (!visible) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, 0);
    };
  }, [visible]);

  const handleDismiss = () => {
    soundEffects.playIntroSound();
    setStage('entering');
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 650);
  };

  // Si está en fase 'brand', tras 2.2s entra automáticamente a la web
  useEffect(() => {
    if (stage === 'brand') {
      const brandTimer = setTimeout(() => {
        handleDismiss();
      }, 2200);
      return () => clearTimeout(brandTimer);
    }
  }, [stage]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-all duration-700 select-none overflow-hidden ${
        stage === 'entering' ? 'opacity-0 scale-105 filter blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ================= ETAPA 1: VIDEO INTERACTIVO CON SCROLL DEL MOUSE ULTRA-NÍTIDO ================= */}
      {stage === 'cinematic' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* Canvas con aceleración gráfica y máxima nitidez */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Barra Superior Flotante: Marca, Música Tecnológica y Botón Saltar */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-30 flex items-center justify-between pointer-events-auto">
            {/* Badge de marca */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono text-gray-200 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#A9F8B5] animate-pulse shadow-[0_0_8px_#A9F8B5]" />
              <span className="font-semibold tracking-wider text-white">GEOSOFT</span>
              <span className="text-gray-500">•</span>
              <span className="text-[11px] text-[#A9F8B5]">Intro Interactiva</span>
            </div>

            {/* Controles: Audio y Saltar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSound}
                className="px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/20 hover:border-[#A9F8B5]/50 text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xl active:scale-95"
                title={isMuted ? 'Activar música' : 'Silenciar música'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                    <span className="hidden sm:inline text-gray-400">Música OFF</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#A9F8B5] animate-pulse" />
                    <span className="hidden sm:inline text-[#A9F8B5]">Música Tech ON</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSequenceComplete}
                className="px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/20 hover:border-[#A9F8B5] text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xl active:scale-95 group"
                title="Saltar animación de introducción"
              >
                <span className="group-hover:text-[#A9F8B5] transition-colors">Saltar</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A9F8B5] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Indicador Central Inferior: Guía de Scroll y Progreso */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
            {/* Pill flotante con animación de mouse */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl text-xs font-mono text-gray-200">
              <div className="relative flex items-center justify-center">
                <Mouse className="w-4 h-4 text-[#A9F8B5] animate-bounce" />
              </div>
              <span className="hidden sm:inline text-white font-medium">
                Gira la rueda del mouse para avanzar
              </span>
              <span className="sm:hidden text-white font-medium">
                Desliza para avanzar
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#A9F8B5] animate-pulse" />
            </div>

            {/* Barra de progreso de la secuencia de 0% a 100% */}
            <div className="w-full space-y-1">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#A9F8B5] via-[#38bdf8] to-[#c084fc] rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_#A9F8B5]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 px-0.5">
                <span>Fotograma {currentFrameNum} / {TOTAL_FRAMES}</span>
                <span className="text-[#A9F8B5] font-semibold">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ETAPA 2: PANTALLA "INICIANDO EXPERIENCIA..." (MARCA GEOSOFT) ================= */}
      {stage === 'brand' && (
        <div
          onClick={handleDismiss}
          className="relative flex flex-col items-center z-20 px-6 text-center max-w-lg mx-auto animate-message-soft cursor-pointer"
        >
          {/* Luz ambiental cinematográfica de fondo */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#A9F8B5]/18 via-[#00ff88]/12 to-[#C1A35B]/12 blur-[150px] pointer-events-none animate-pulse" />

          {/* Emblema GeoSoft con resplandor */}
          <div className="relative group mb-6">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] opacity-40 blur-xl animate-pulse" />
            
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(169,248,181,0.3)] bg-[#111214] flex items-center justify-center">
              <img
                src="/assets/logo-emerald.jpeg"
                alt="GeoSoft Logo"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />
            </div>
          </div>

          {/* Tipografía de Identidad de Marca */}
          <div className="space-y-3.5">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#A9F8B5]/30 text-xs font-semibold tracking-[0.2em] text-[#A9F8B5] uppercase shadow-lg shadow-[#A9F8B5]/10 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#DFF494] animate-spin" />
              Software • Web • Inteligencia Artificial
            </div>

            {/* Título de Marca con Efecto Cromático */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display text-white">
              GEO<span className="text-gradient-accent">SOFT</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-sm mx-auto leading-relaxed">
              Innovación arquitectónica, plataformas inteligentes y automatización de alto rendimiento.
            </p>

            {/* Barra de progreso de entrada a la web */}
            <div className="pt-2 w-48 sm:w-56 mx-auto space-y-1.5">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] rounded-full animate-[textLightSweep_2s_ease-in-out_infinite] w-full" />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-ping" />
                <span>Iniciando experiencia...</span>
              </div>
            </div>
          </div>

          {/* Indicador táctil para saltar o entrar directo */}
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer">
            <span>Toca para ingresar de inmediato</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};


