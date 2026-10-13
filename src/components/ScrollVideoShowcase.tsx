import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ArrowRight,
  CheckCircle2,
  Mouse,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export interface ScrollVideoShowcaseProps {
  onScrollToQuote: () => void;
  onOpenBooking?: () => void;
  totalFrames?: number;
  initialFrame?: number;
}

interface FrameCheckpoint {
  start: number;
  end: number;
  badge: string;
  category: string;
  title: string;
  description: string;
  accentColor: string;
  features: string[];
}

const CHECKPOINTS: FrameCheckpoint[] = [
  {
    start: 1,
    end: 12,
    badge: 'ARQUITECTURA DIGITAL',
    category: 'Ecosistema Tecnológico',
    title: 'Ingeniería de Software de Clase Mundial',
    description:
      'Desarrollo full-stack de alto rendimiento diseñado para escalar empresas en Costa Rica y toda la región sin plantillas genéricas.',
    accentColor: '#A9F8B5',
    features: ['100% Cloud Native', 'Latencia < 20ms', '0 Plantillas Lentas']
  },
  {
    start: 13,
    end: 24,
    badge: 'INTELIGENCIA ARTIFICIAL',
    category: 'Atención & Ventas 24/7',
    title: 'Chatbots & Agentes de IA Inteligentes',
    description:
      'Asistentes conversacionales que atienden en WhatsApp Cloud y Web en milisegundos, calificando prospectos y cerrando cotizaciones.',
    accentColor: '#38bdf8',
    features: ['WhatsApp Cloud API', 'Cierre de Leads +340%', 'Handoff a Humanos']
  },
  {
    start: 25,
    end: 36,
    badge: 'EXPERIENCIA WEB & SEO',
    category: 'Presencia Digital de Alto Impacto',
    title: 'Páginas Web Ultrarrápidas & Dark Tech',
    description:
      'Arquitecturas modernas con carga en menos de 0.4s y puntuación perfecta de 100/100 en Google Lighthouse para dominar búsquedas.',
    accentColor: '#fb923c',
    features: ['Velocidad 0.38s Real', 'Lighthouse 100/100', 'Diseño Silicon Valley']
  },
  {
    start: 37,
    end: 48,
    badge: 'PRODUCTOS SAAS & NUBE',
    category: 'Software as a Service Escalable',
    title: 'Plataformas SaaS & Sitios de Membresía',
    description:
      'Sistemas multi-tenant con cobros automáticos recurrentes, video protegido con DRM y portales de comunidad para monetizar.',
    accentColor: '#818cf8',
    features: ['Cobros Recurrentes', 'Seguridad DRM', 'Escalabilidad Ilimitada']
  },
  {
    start: 49,
    end: 60,
    badge: 'AUTOMATIZACIÓN & PAGOS',
    category: 'Integración Financiera',
    title: 'Sistemas de Reservas con Sinpe Móvil',
    description:
      'Agendamiento de citas en tiempo real sincronizado con Google Calendar y validación bancaria automática con Sinpe Móvil en Costa Rica.',
    accentColor: '#c084fc',
    features: ['Validación Sinpe Móvil', 'Sync Google Calendar', 'Recordatorios WhatsApp']
  },
  {
    start: 61,
    end: 72,
    badge: 'SOLUCIONES A LA MEDIDA',
    category: 'Ingeniería sin Restricciones',
    title: 'CRMs, ERPs & Software a la Medida',
    description:
      'Software construido exactamente a la medida de tu operativa comercial, sin pagar costosas suscripciones mensuales por usuario.',
    accentColor: '#2dd4bf',
    features: ['$0 por Usuario Extra', 'Código Propiedad del Cliente', 'Soporte Local']
  }
];

export const ScrollVideoShowcase: React.FC<ScrollVideoShowcaseProps> = ({
  onScrollToQuote,
  onOpenBooking,
  totalFrames = 72
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [targetFrame, setTargetFrame] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Formateador de ruta para los frames: frame_001.webp hasta frame_072.webp
  const getFrameUrl = useCallback((index: number) => {
    const padded = String(index).padStart(3, '0');
    return `/assets/scroll-sequence/frame_${padded}.webp`;
  }, []);

  // Precargar todos los 72 fotogramas en memoria
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= totalFrames) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedCount(loaded);
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isMounted = false;
    };
  }, [totalFrames, getFrameUrl]);

  // Dibujar un frame en el canvas con aspect ratio "cover"
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Calcular escala para 'cover' centrado
    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (canvasWidth - imgWidth * ratio) / 2;
    const centerShiftY = (canvasHeight - imgHeight * ratio) / 2;

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

  // Ajustar tamaño del canvas al contenedor con soporte High-DPI (Retina)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      renderFrame(Math.round(currentFrame));
    }
  }, [currentFrame, renderFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Bucle de interpolación suave (Smooth Lerp) para sensación Apple / ONO
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        // En modo auto-play, avanza a 24 FPS
        setTargetFrame((prev) => {
          const next = prev + 24 * delta;
          return next > totalFrames ? 1 : next;
        });
      }

      setCurrentFrame((prev) => {
        // Suavizado Lerp: avanza hacia targetFrame de forma orgánica
        const diff = targetFrame - prev;
        if (Math.abs(diff) < 0.05) {
          renderFrame(Math.round(targetFrame));
          return targetFrame;
        }
        const updated = prev + diff * 0.25;
        renderFrame(Math.round(updated));
        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [targetFrame, isPlaying, totalFrames, renderFrame]);

  // Manejador del Scroll del Ratón (Wheel)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isPlaying) setIsPlaying(false);

    // Sensibilidad del scroll: 1 tick de rueda ≈ 1-2 frames
    const step = e.deltaY > 0 ? 1.5 : -1.5;
    setTargetFrame((prev) => {
      const next = Math.max(1, Math.min(totalFrames, prev + step));
      return next;
    });
  };

  // Manejador de Gestos Táctiles Móviles (Touch)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].clientY);
    if (isPlaying) setIsPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;

    // Sensibilidad táctil: cada 15px de swipe desplaza 1 frame
    if (Math.abs(diff) > 8) {
      const frameDelta = (diff / 15);
      setTargetFrame((prev) => {
        const next = Math.max(1, Math.min(totalFrames, prev + frameDelta));
        return next;
      });
      setTouchStartY(currentY);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  // Checkpoint activo según el frame actual
  const activeCheckpoint =
    CHECKPOINTS.find((c) => currentFrame >= c.start && currentFrame <= c.end) || CHECKPOINTS[0];

  const currentPercent = Math.round((currentFrame / totalFrames) * 100);

  const togglePlay = () => {
    soundEffects.playClick();
    setIsPlaying((prev) => !prev);
  };

  const resetSequence = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    setTargetFrame(1);
    setCurrentFrame(1);
  };

  const toggleFullscreen = () => {
    soundEffects.playClick();
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-white/20 bg-[#07090f] shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen bg-black' : ''
      }`}
    >
      {/* Barra Superior Tecnológica / Indicador ONO */}
      <div className="bg-[#0b101c] px-4 py-3 border-b border-white/10 flex items-center justify-between z-20 relative backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-2">
            <Mouse className="w-3.5 h-3.5 text-[#A9F8B5] animate-bounce" />
            <span className="text-xs font-mono font-bold text-white tracking-wide">
              Scrollytelling 60 FPS • Estilo ONO.software
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-gray-300">
            <span>Frame:</span>
            <span className="text-[#A9F8B5] font-bold">
              {String(Math.round(currentFrame)).padStart(2, '0')} / {totalFrames}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-white font-semibold">{currentPercent}%</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa inmersiva'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Área Principal del Canvas Scrubbing */}
      <div
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full aspect-video select-none cursor-ns-resize overflow-hidden ${
          isFullscreen ? 'h-[calc(100vh-130px)] aspect-auto' : 'min-h-[340px] sm:min-h-[460px] md:min-h-[520px]'
        }`}
      >
        {/* Canvas de Alta Velocidad (WebGL/2D Hardware-Accelerated) */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block object-cover"
        />

        {/* Overlay con Gradiente Cinematográfico */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07090f] via-transparent to-black/30" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

        {/* Loader de Precarga de Frames */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
            <Loader2 className="w-8 h-8 text-[#A9F8B5] animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                Precargando Secuencia de Video ({loadedCount}/{totalFrames})
              </p>
              <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                <div
                  className="h-full bg-[#A9F8B5] transition-all duration-150"
                  style={{ width: `${(loadedCount / totalFrames) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">Optimizando fotogramas WebP para 60 FPS sin buffering</p>
            </div>
          </div>
        )}

        {/* Tarjeta de Información Dinámica Sincronizada con el Frame (Estilo ONO) */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl bg-[#090e18]/85 backdrop-blur-xl border border-white/20 shadow-2xl z-20 pointer-events-auto transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${activeCheckpoint.accentColor}25`,
                color: activeCheckpoint.accentColor
              }}
            >
              {activeCheckpoint.badge}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-mono">
              {activeCheckpoint.category}
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-extrabold text-white font-display tracking-tight leading-tight mb-2">
            {activeCheckpoint.title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4 line-clamp-3">
            {activeCheckpoint.description}
          </p>

          <div className="space-y-1.5 mb-4">
            {activeCheckpoint.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-200">
                <CheckCircle2
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: activeCheckpoint.accentColor }}
                />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                onScrollToQuote();
              }}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#A9F8B5] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#DFF494] transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#A9F8B5]/20"
            >
              <span>Cotizar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onOpenBooking && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenBooking();
                }}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Demo en Vivo
              </button>
            )}
          </div>
        </div>

        {/* Indicador Flotante Central de Ayuda (Scroll Prompt) */}
        <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 bg-[#090e18]/85 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-xs text-white z-20 pointer-events-none shadow-xl">
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[#A9F8B5]">
            <Mouse className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="font-semibold text-[11px] sm:text-xs text-white flex items-center gap-1.5">
              <span>Gira la rueda del mouse</span>
              <span className="text-[#A9F8B5]">↕</span>
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-400">
              o desliza el dedo en móvil para avanzar el video
            </div>
          </div>
        </div>
      </div>

      {/* Barra Inferior de Scrubbing Interactivo (Timeline Scrubber) */}
      <div className="bg-[#0b101c] px-4 py-3.5 sm:px-6 sm:py-4 border-t border-white/10 flex flex-col gap-3 z-20 relative">
        {/* Slider Timeline Drag & Scrub */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
            title={isPlaying ? 'Pausar reproducción continua' : 'Reproducir automáticamente a 24 FPS'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#A9F8B5]" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={resetSequence}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer shrink-0"
            title="Reiniciar secuencia al inicio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Timeline interactivo tipo Video Scrubber */}
          <div className="relative flex-1 flex items-center group py-1 cursor-pointer">
            <input
              type="range"
              min="1"
              max={totalFrames}
              step="0.1"
              value={targetFrame}
              onChange={(e) => {
                if (isPlaying) setIsPlaying(false);
                setTargetFrame(parseFloat(e.target.value));
              }}
              className="w-full h-2 rounded-lg bg-white/10 appearance-none cursor-pointer accent-[#A9F8B5] transition-all"
            />
          </div>

          <div className="font-mono text-xs text-gray-400 shrink-0 min-w-[70px] text-right">
            <span className="text-white font-bold">{Math.round(currentFrame)}</span> / {totalFrames}
          </div>
        </div>

        {/* Badges de Salto Rápido por Hitos Tecnológicos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Hitos:
          </span>
          {CHECKPOINTS.map((cp, idx) => {
            const isActive = currentFrame >= cp.start && currentFrame <= cp.end;
            return (
              <button
                key={idx}
                onClick={() => {
                  soundEffects.playClick();
                  if (isPlaying) setIsPlaying(false);
                  setTargetFrame(cp.start);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-white/15 text-white border-white/30 font-bold shadow-sm'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                  style={{ backgroundColor: cp.accentColor }}
                />
                {cp.title.split('&')[0].replace('Páginas Web', 'Web').replace('Sistemas de', '').trim()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
