import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Loader2,
  X
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export interface ScrollVideoShowcaseProps {
  onScrollToQuote: () => void;
  onOpenBooking?: () => void;
  totalFrames?: number;
  initialFrame?: number;
  sequencePath?: string;
  sequenceTitle?: string;
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

const TRANSITION_CHECKPOINTS: FrameCheckpoint[] = [
  {
    start: 1,
    end: 39,
    badge: 'NÚCLEO 3D & HARDWARE',
    category: 'Arquitectura & Cristal',
    title: 'Descompresión del Núcleo Cuántico',
    description:
      'La cámara viaja en reversa desde el entramado interno de datos hacia la revelación de la estructura monolítica esmeralda.',
    accentColor: '#A9F8B5',
    features: ['Plano Secuencia Inverso', 'Refracción Óptica de Cristal', 'Arquitectura Monolítica']
  },
  {
    start: 40,
    end: 75,
    badge: 'IDENTIDAD 3D & INGENIERÍA',
    category: 'Ecosistema GeoSoft',
    title: 'Arquitectura Digital de Vanguardia',
    description:
      'Soluciones de software y plataformas web de alto rendimiento desde Costa Rica para toda la región. Cero plantillas genéricas.',
    accentColor: '#38bdf8',
    features: ['Estructura 3D Monolítica', 'Código Limpio a Medida', 'Rendimiento Extremo']
  },
  {
    start: 76,
    end: 100,
    badge: 'DESPEGUE Y ESCALABILIDAD',
    category: 'Impulso Empresarial',
    title: 'Hacemos tus Ideas Realidad',
    description:
      'Lanzamiento continuo de plataformas preparadas para escalar a millones de usuarios con latencia mínima.',
    accentColor: '#fb923c',
    features: ['Arquitectura Serverless', 'Velocidad de Carga < 0.4s', 'Despliegues Continuos']
  },
  {
    start: 101,
    end: 125,
    badge: 'ECOSISTEMA PROFESIONAL',
    category: 'Software Corporativo',
    title: 'Impulsamos tu Negocio',
    description:
      'Sistemas de reservas con Sinpe Móvil, CRMs a la medida y plataformas SaaS con diseño Dark Tech premium.',
    accentColor: '#c084fc',
    features: ['Validación Sinpe Móvil', 'Sync Google Calendar', 'Membresías con DRM']
  },
  {
    start: 126,
    end: 155,
    badge: 'CONECTIVIDAD GLOBAL',
    category: 'Red Distribuida en Tiempo Real',
    title: 'Transición a Plataforma Global',
    description:
      'Inmersión instantánea en la interfaz de software. Centraliza operaciones, sucursales y clientes en una sola nube.',
    accentColor: '#38bdf8',
    features: ['Monitoreo en Tiempo Real', 'Chatbots WhatsApp Cloud', 'Multi-Tenant & Nube']
  },
  {
    start: 156,
    end: 189,
    badge: 'NÚCLEO CUÁNTICO 3D',
    category: 'Ciberespacio & Datos',
    title: 'Túnel de Datos & Cubo Holográfico',
    description:
      'Viaje a través del flujo de información con el cubo monolítico de GeoSoft como núcleo central de seguridad y código.',
    accentColor: '#A9F8B5',
    features: ['Cifrado Extremo SHA', 'Propiedad 100% del Código', 'Soporte y Garantía Total']
  }
];

const CUBE_CHECKPOINTS: FrameCheckpoint[] = [
  {
    start: 1,
    end: 18,
    badge: 'ESTRUCTURA 3D MONOLÍTICA',
    category: 'Ecosistema GeoSoft',
    title: 'Cubo Holográfico Esmeralda',
    description:
      'Video continuo 3D CGI sin cortes de diapositiva. Carcasa de cristal esmeralda con refracción física y entramado cuántico.',
    accentColor: '#A9F8B5',
    features: ['Plano Secuencia Continuo', 'Sin Cortes de Pantalla', 'Renderizado 3D']
  },
  {
    start: 19,
    end: 38,
    badge: 'VIAJE DE CÁMARA CONTINUO',
    category: 'Inmersión en el Cristal',
    title: 'Penetración en el Núcleo & IA 24/7',
    description:
      'La cámara viaja sin interrupción a través del cristal. Cada giro del ratón hace que la cámara penetre en la malla de datos.',
    accentColor: '#38bdf8',
    features: ['Cámara Dolly In Suave', 'Chatbots & Modelos LLM', 'Automatización de Flujos']
  },
  {
    start: 39,
    end: 56,
    badge: 'MALLA INTERNA Y NUBE',
    category: 'Arquitectura Distribuida',
    title: 'Navegación Interior & SaaS Multi-Tenant',
    description:
      'Dentro del cristal, la cámara recorre los pilares estructurales y la luz del núcleo donde residen las bases de datos y la facturación.',
    accentColor: '#fb923c',
    features: ['Plataformas en la Nube', 'Validación Sinpe Móvil', 'Seguridad de Alta Resistencia']
  },
  {
    start: 57,
    end: 75,
    badge: 'APERTURA Y EXPANSIÓN',
    category: 'Geometría Transformable',
    title: 'Marco Hueco & Software a la Medida',
    description:
      'El cubo se expande en un marco de diamante hueco mientras la cámara sale por el centro hacia el ecosistema final de GeoSoft.',
    accentColor: '#c084fc',
    features: ['Transformación Cinemática', 'Código Limpio a la Medida', 'Soporte y Garantía Total']
  }
];

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
  sequencePath = '/assets/transition-sequence',
  totalFrames = 189,
  sequenceTitle = 'Transición Cinemática • Video 3 (Reversa) + 1 + 2'
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [targetFrame, setTargetFrame] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const getFrameUrl = useCallback((index: number) => {
    const padded = String(index).padStart(3, '0');
    return `${sequencePath}/frame_${padded}.webp`;
  }, [sequencePath]);

  // Precargar fotogramas en memoria
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    setIsLoading(true);
    setLoadedCount(0);

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
  }, [resizeCanvas, isFullscreen]);

  // Bucle de interpolación suave (Smooth Lerp)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        setTargetFrame((prev) => {
          const fpsRate = totalFrames > 100 ? 7.5 : 24;
          const next = prev + fpsRate * delta;
          return next > totalFrames ? 1 : next;
        });
      }

      setCurrentFrame((prev) => {
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

  // Listener NATIVO para Wheel y Touch con { passive: false } para BLOQUEAR 100% el scroll de la web
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isPlaying) setIsPlaying(false);

      const step = e.deltaY > 0 ? (totalFrames > 100 ? 3.0 : 1.6) : (totalFrames > 100 ? -3.0 : -1.6);
      setTargetFrame((prev) => Math.max(1, Math.min(totalFrames, prev + step)));
    };

    const onTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
      if (isPlaying) setIsPlaying(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY === null) return;
      e.preventDefault();
      e.stopPropagation();

      const currentY = e.touches[0].clientY;
      const diff = touchStartY - currentY;

      if (Math.abs(diff) > 4) {
        const factor = totalFrames > 100 ? 1.8 : 1.0;
        const frameDelta = (diff / 10) * factor;
        setTargetFrame((prev) => Math.max(1, Math.min(totalFrames, prev + frameDelta)));
        setTouchStartY(currentY);
      }
    };

    const onTouchEnd = () => {
      setTouchStartY(null);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [isPlaying, touchStartY, totalFrames, isFullscreen]);

  // Bloqueo total del scroll del navegador y tecla Escape al estar en Pantalla Completa
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          soundEffects.playClick();
          setIsFullscreen(false);
          try {
            if (document.fullscreenElement && document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            }
          } catch (err) {}
        }
      };

      const handleGlobalWheel = (e: WheelEvent) => {
        e.preventDefault();
        const step = e.deltaY > 0 ? 1.6 : -1.6;
        setTargetFrame((prev) => Math.max(1, Math.min(totalFrames, prev + step)));
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('wheel', handleGlobalWheel, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('wheel', handleGlobalWheel);
      };
    }
  }, [isFullscreen, totalFrames]);

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
    const next = !isFullscreen;
    setIsFullscreen(next);

    if (next) {
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (err) {}
    } else {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch (err) {}
    }
  };

  const currentCheckpoints = sequencePath.includes('transition')
    ? TRANSITION_CHECKPOINTS
    : sequencePath.includes('cube')
      ? CUBE_CHECKPOINTS
      : CHECKPOINTS;
  const activeCheckpoint =
    currentCheckpoints.find((c) => currentFrame >= c.start && currentFrame <= c.end) || currentCheckpoints[0];

  const currentPercent = Math.round((currentFrame / totalFrames) * 100);

  const viewerContent = (
    <div
      className={`relative w-full overflow-hidden bg-[#07090f] transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen rounded-none border-none flex flex-col justify-between'
          : 'rounded-2xl border border-white/20 shadow-2xl'
      }`}
    >
      {/* Barra Superior */}
      <div className="bg-[#0b101c]/95 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-white/10 flex items-center justify-between z-30 relative backdrop-blur-xl shrink-0">
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
              {isFullscreen ? 'Pantalla Completa Inmersiva • Video 3D 60 FPS' : sequenceTitle}
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
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
              isFullscreen
                ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200'
                : 'bg-[#A9F8B5] text-black hover:bg-[#DFF494] shadow-[#A9F8B5]/25'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Agrandar a Pantalla Completa Inmersiva'}
          >
            {isFullscreen ? (
              <>
                <X className="w-4 h-4" />
                <span>Salir (Esc)</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Agrandar Pantalla</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Área del Canvas - 100% Sin overlays ni opacidad oscura */}
      <div
        ref={scrollAreaRef}
        className={`relative w-full select-none overflow-hidden touch-none flex-1 bg-black ${
          isFullscreen ? 'h-full min-h-0' : 'aspect-video min-h-[380px] sm:min-h-[480px] md:min-h-[540px]'
        }`}
      >
        <canvas ref={canvasRef} className="w-full h-full block object-cover" />

        {isLoading && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
            <Loader2 className="w-8 h-8 text-[#A9F8B5] animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                Precargando Secuencia 3D ({loadedCount}/{totalFrames})
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

        {/* Panel de Información Flotante (Con opción de minimizar para apreciar el video 100% despejado) */}
        {isInfoVisible ? (
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 rounded-2xl bg-[#090e18]/85 backdrop-blur-xl border border-white/20 shadow-2xl z-20 pointer-events-auto transition-all duration-300">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${activeCheckpoint.accentColor}25`,
                    color: activeCheckpoint.accentColor
                  }}
                >
                  {activeCheckpoint.badge}
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-mono hidden sm:inline">
                  {activeCheckpoint.category}
                </span>
              </div>
              <button
                onClick={() => setIsInfoVisible(false)}
                className="text-gray-400 hover:text-white px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] font-mono cursor-pointer transition-colors"
                title="Minimizar panel"
              >
                Ocultar
              </button>
            </div>

            <h3 className="text-base sm:text-xl md:text-2xl font-extrabold text-white font-display tracking-tight leading-tight mb-2">
              {activeCheckpoint.title}
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
              {activeCheckpoint.description}
            </p>

            <div className="space-y-1 mb-3 sm:mb-4">
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
                  if (isFullscreen) setIsFullscreen(false);
                  onScrollToQuote();
                }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#A9F8B5] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#DFF494] transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#A9F8B5]/20"
              >
                <span>Cotizar Solución</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onOpenBooking && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    if (isFullscreen) setIsFullscreen(false);
                    onOpenBooking();
                  }}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Demo en Vivo
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsInfoVisible(true)}
            className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-[#090e18]/85 backdrop-blur-md border border-white/20 text-xs font-mono text-white hover:bg-white/10 flex items-center gap-2 cursor-pointer shadow-lg transition-all"
            title="Expandir información"
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeCheckpoint.accentColor }} />
            <span>{activeCheckpoint.badge} • Ver info</span>
          </button>
        )}

        <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 bg-[#090e18]/90 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-xs text-white z-20 pointer-events-none shadow-xl">
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[#A9F8B5]">
            <Mouse className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="font-semibold text-[11px] sm:text-xs text-white flex items-center gap-1.5">
              <span>Rueda del mouse avanza el video 3D</span>
              <span className="text-[#A9F8B5]">↕</span>
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-400">
              La página no baja; el scroll mueve los fotogramas
            </div>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="bg-[#0b101c]/95 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-white/10 flex flex-col gap-2.5 z-30 relative backdrop-blur-xl shrink-0">
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

          <div className="relative flex-1 flex items-center py-1">
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Hitos:
          </span>
          {currentCheckpoints.map((cp, idx) => {
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

  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(viewerContent, document.body);
  }

  return viewerContent;
};
