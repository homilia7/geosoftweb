import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Globe,
  Users,
  Cloud,
  BarChart3,
  Cpu,
  Zap,
  Calendar,
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Film,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Maximize2,
  Mouse
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { Reveal } from './Reveal';
import { ScrollVideoShowcase } from './ScrollVideoShowcase';
import { ThreeScrollyCamera } from './ThreeScrollyCamera';

export interface InteractiveVideoShowcaseProps {
  onScrollToQuote: () => void;
  onOpenBooking?: () => void;
}

interface SolutionSlide {
  id: string;
  badge: string;
  title: string;
  category: string;
  icon: React.ElementType;
  image: string;
  description: string;
  highlight: string;
  metrics: { label: string; value: string }[];
  accentColor: string;
  tagColor: string;
}

export const InteractiveVideoShowcase: React.FC<InteractiveVideoShowcaseProps> = ({
  onScrollToQuote,
  onOpenBooking
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'ono' | 'three' | 'interactive' | 'video'>('ono');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.location.hash === '#video-mp4' || window.location.hash === '#video') {
      setMode('video');
    } else if (window.location.hash === '#interactivo') {
      setMode('interactive');
    } else if (window.location.hash === '#ono' || window.location.hash === '#scroll') {
      setMode('ono');
    } else if (window.location.hash === '#3d' || window.location.hash === '#three') {
      setMode('three');
    }
  }, []);

  const SLIDE_DURATION = 4200; // ms por diapositiva

  const solutions: SolutionSlide[] = [
    {
      id: 'chatbots',
      badge: 'INTELIGENCIA ARTIFICIAL',
      category: 'Atención & Ventas 24/7',
      title: 'Chatbots & Agentes de IA 24/7',
      icon: Bot,
      image: '/assets/showcase/01-chatbots.jpg',
      description:
        'Asistentes conversacionales inteligentes que atienden a tus clientes en milisegundos, califican prospectos y cierran ventas en WhatsApp Cloud y Web con handoff a humanos.',
      highlight: 'El 70% de las ventas se concretan respondiendo en los primeros 5 minutos.',
      metrics: [
        { label: 'Tiempo de respuesta', value: '< 2 seg' },
        { label: 'Disponibilidad', value: '24/7/365' },
        { label: 'Cierre de leads', value: '+340%' }
      ],
      accentColor: '#A9F8B5',
      tagColor: '#104a0e'
    },
    {
      id: 'web',
      badge: 'DISEÑO WEB CORPORATIVO',
      category: 'Presencia Digital de Alto Impacto',
      title: 'Páginas Web Profesionales',
      icon: Globe,
      image: '/assets/showcase/02-web.jpg',
      description:
        'Sitios web de velocidad extrema y estética Dark Tech premium. Arquitectura limpia a medida sin plantillas lentas, diseñada para posicionar en Google y Alajuela/San José.',
      highlight: 'Carga instantánea en menos de 0.4s con puntuación perfecta en Google Lighthouse.',
      metrics: [
        { label: 'Velocidad de carga', value: '0.38s' },
        { label: 'Google Lighthouse', value: '100/100' },
        { label: 'Conversión B2B', value: '+180%' }
      ],
      accentColor: '#38bdf8',
      tagColor: '#0c4a6e'
    },
    {
      id: 'membresias',
      badge: 'COMUNIDADES & ACADEMIAS',
      category: 'Monetización Recurrente',
      title: 'Sitios de Membresía & LMS',
      icon: Users,
      image: '/assets/showcase/03-membership.jpg',
      description:
        'Portales de suscripción exclusiva para creadores, academias y colegios profesionales. Protección de video contra descargas, avance de módulos y pasarela de cobros.',
      highlight: 'Control total de usuarios con pagos automáticos mes a mes.',
      metrics: [
        { label: 'Cobro automático', value: '100% Nube' },
        { label: 'Retención de alumnos', value: '89%' },
        { label: 'Contenido blindado', value: 'DRM Protegido' }
      ],
      accentColor: '#fb923c',
      tagColor: '#7c2d12'
    },
    {
      id: 'saas',
      badge: 'PLATAFORMAS EN LA NUBE',
      category: 'Software as a Service Multi-Tenant',
      title: 'Plataformas SaaS Escalables',
      icon: Cloud,
      image: '/assets/showcase/04-saas.jpg',
      description:
        'Desarrollo de productos digitales escalables en la nube. Arquitecturas preparadas para millones de peticiones con base de datos distribuida y facturación modular.',
      highlight: 'Infraestructura Serverless con latencia mínima en toda Latinoamérica.',
      metrics: [
        { label: 'Uptime garantizado', value: '99.99%' },
        { label: 'Latencia global', value: '< 25ms' },
        { label: 'Escalabilidad', value: 'Ilimitada' }
      ],
      accentColor: '#818cf8',
      tagColor: '#312e81'
    },
    {
      id: 'crm',
      badge: 'GESTIÓN COMERCIAL',
      category: 'Pipelines & Clientes 360',
      title: 'Sistemas CRM a la Medida',
      icon: BarChart3,
      image: '/assets/showcase/05-crm.jpg',
      description:
        'Controla todo tu flujo de ventas sin pagar licencias mensuales abusivas como Salesforce o HubSpot. Adaptado al 100% a la operativa de tu empresa.',
      highlight: 'Visualiza oportunidades, seguimiento de llamadas y presupuestos en un solo tablero.',
      metrics: [
        { label: 'Costo por usuario extra', value: '$0' },
        { label: 'Cierre de cotizaciones', value: '+45%' },
        { label: 'Visibilidad de pipeline', value: '360°' }
      ],
      accentColor: '#c084fc',
      tagColor: '#581c87'
    },
    {
      id: 'custom-software',
      badge: 'INGENIERÍA AVANZADA',
      category: 'Código Limpio & Alto Rendimiento',
      title: 'Software a la Medida',
      icon: Cpu,
      image: '/assets/showcase/06-custom-software.jpg',
      description:
        'Desarrollo ad-hoc para resolver cuellos de botella específicos en fábricas, despachos, logística y empresas con reglas complejas que ningún software genérico cubre.',
      highlight: 'Arquitectura modular limpia que evoluciona contigo sin deuda técnica.',
      metrics: [
        { label: 'Ajuste operativo', value: '100% Exacto' },
        { label: 'Seguridad de datos', value: 'Cifrado SHA' },
        { label: 'Propiedad del código', value: '100% Tuya' }
      ],
      accentColor: '#e2e8f0',
      tagColor: '#1e293b'
    },
    {
      id: 'automatizacion',
      badge: 'EFICIENCIA OPERATIVA',
      category: 'Workflows & Conexión de Sistemas',
      title: 'Automatización de Procesos',
      icon: Zap,
      image: '/assets/showcase/07-automation.jpg',
      description:
        'Conectamos tus sistemas existentes (ERP, WhatsApp, bases de datos, pasarelas de pago y correo) para que la información fluya sin que nadie tenga que copiar y pegar.',
      highlight: 'Ahorra más de 80 horas de trabajo manual al mes por cada departamento.',
      metrics: [
        { label: 'Tiempo ahorrado', value: '-85%' },
        { label: 'Errores humanos', value: '0%' },
        { label: 'Ejecución en vivo', value: 'Automática' }
      ],
      accentColor: '#f472b6',
      tagColor: '#831843'
    },
    {
      id: 'reservas',
      badge: 'AGENDAMIENTO EN LÍNEA',
      category: 'Citas, Hotelería & Cobros Inmediatos',
      title: 'Sistemas de Reservas & Cobros',
      icon: Calendar,
      image: '/assets/showcase/08-booking.jpg',
      description:
        'Sistemas de calendario sincronizados en tiempo real para clínicas, hoteles, restaurantes y centros de eventos. Previene el overbooking y cobra automáticamente.',
      highlight: 'Sincronizado con Google Calendar, Outlook y recordatorios por WhatsApp.',
      metrics: [
        { label: 'Cobro de seña', value: 'Sinpe Móvil' },
        { label: 'Ausencias de clientes', value: '-65%' },
        { label: 'Disponibilidad', value: 'Tiempo Real' }
      ],
      accentColor: '#fde047',
      tagColor: '#713f12'
    },
    {
      id: 'pwa',
      badge: 'APLICACIONES PROGRESIVAS',
      category: 'Experiencia Móvil Nativa',
      title: 'Aplicaciones Web (PWA)',
      icon: Smartphone,
      image: '/assets/showcase/09-pwa.jpg',
      description:
        'Aplicaciones móviles de alta velocidad instalables directamente desde el navegador en iOS y Android. Cero comisiones a las tiendas de apps y funcionamiento offline.',
      highlight: 'Notificaciones push, acceso instantáneo y diseño adaptado a cada pantalla.',
      metrics: [
        { label: 'Compatibilidad', value: 'iOS & Android' },
        { label: 'Tiempo de carga', value: 'Instantáneo' },
        { label: 'Comisión de tiendas', value: '0%' }
      ],
      accentColor: '#34d399',
      tagColor: '#065f46'
    }
  ];

  // Control de avance automático tipo Reel / Stories
  useEffect(() => {
    if (!isPlaying || mode === 'video') return;

    const intervalTime = 40;
    const increment = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((cur) => (cur + 1) % solutions.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, mode, currentIndex, solutions.length]);

  const goToSlide = (idx: number) => {
    soundEffects.playClick();
    setCurrentIndex(idx);
    setProgress(0);
  };

  const togglePlay = () => {
    soundEffects.playClick();
    setIsPlaying((prev) => !prev);
  };

  const currentSlide = solutions[currentIndex];
  const CurrentIcon = currentSlide.icon;

  return (
    <section id="video-showcase" className="py-24 px-4 md:px-8 relative overflow-hidden bg-black/80">
      {/* Luz ambiental de fondo según la solución activa */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: currentSlide.accentColor }}
      />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Encabezado */}
        <Reveal effect="up" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#A9F8B5]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showcase Cinematográfico • Lo que Desarrollamos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white">
            Un Ecosistema Completo para{' '}
            <span className="text-gradient-accent">Potenciar tu Negocio</span>
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Diseños reales, código de ingeniería y experiencias de software de clase mundial creadas a tu medida.
          </p>

          {/* Selector de Modos: Opción 1 (Three.js 3D) vs Opción 2 (Video Continuo ONO) vs Interactivo vs Video */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => {
                soundEffects.playClick();
                setMode('ono');
                setIsPlaying(false);
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'ono'
                  ? 'bg-[#A9F8B5] text-black shadow-lg shadow-[#A9F8B5]/30 scale-102 sm:scale-105 ring-2 ring-[#A9F8B5]/50'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <Mouse className="w-3.5 h-3.5 animate-bounce" />
              <span>🎬 Opción 1: Showcase Interactivo (Scroll)</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setMode('three');
                setIsPlaying(false);
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'three'
                  ? 'bg-[#A9F8B5] text-black shadow-lg shadow-[#A9F8B5]/30 scale-102 sm:scale-105 ring-2 ring-[#A9F8B5]/50'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>🌟 Opción 2: 3D en Vivo (Three.js)</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setMode('interactive');
                setIsPlaying(true);
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'interactive'
                  ? 'bg-[#A9F8B5] text-black shadow-lg shadow-[#A9F8B5]/30 scale-102 sm:scale-105 ring-2 ring-[#A9F8B5]/50'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>📱 Showcase Interactivo</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setMode('video');
                setIsPlaying(false);
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'video'
                  ? 'bg-[#A9F8B5] text-black shadow-lg shadow-[#A9F8B5]/30 scale-102 sm:scale-105 ring-2 ring-[#A9F8B5]/50'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>▶️ Video MP4 HD Completo</span>
            </button>
          </div>
        </Reveal>

        {/* Reproductor / Showcase Principal */}
        <Reveal effect="up" delay={100} className="w-full">
          {mode === 'three' ? (
            <ThreeScrollyCamera
              onScrollToQuote={onScrollToQuote}
              onOpenBooking={onOpenBooking}
            />
          ) : mode === 'ono' ? (
            <ScrollVideoShowcase
              sequencePath="/assets/transition-sequence"
              totalFrames={189}
              onScrollToQuote={onScrollToQuote}
              onOpenBooking={onOpenBooking}
            />
          ) : (
            <div className="relative rounded-2xl border border-white/15 bg-gradient-to-b from-[#0e131d]/90 to-[#07090f]/95 p-3.5 sm:p-6 md:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* Barra de Progreso Segmentada tipo Stories */}
            {mode === 'interactive' && (
              <div className="grid grid-cols-9 gap-1 sm:gap-1.5 mb-5 sm:mb-8">
                {solutions.map((s, idx) => {
                  let fillPercent = 0;
                  if (idx < currentIndex) fillPercent = 100;
                  else if (idx === currentIndex) fillPercent = progress;

                  return (
                    <button
                      key={s.id}
                      onClick={() => goToSlide(idx)}
                      className="group relative h-1.5 rounded-full bg-white/15 overflow-hidden transition-all hover:h-2 cursor-pointer"
                      title={s.title}
                    >
                      <div
                        className="h-full bg-[#A9F8B5] transition-all ease-linear"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Contenido: MODO VIDEO MP4 CINEMATOGRÁFICO */}
            {mode === 'video' ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/15 relative bg-black shadow-2xl">
                <video
                  ref={videoRef}
                  src="/videos/geosoft-showcase.mp4"
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              /* Contenido: MODO INTERACTIVO CON IMÁGENES REALES DE PRODUCTO */
              <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[460px]">
                {/* Columna Izquierda: Información de la Solución Activa */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/20 transition-transform duration-300 shrink-0"
                      style={{
                        backgroundColor: `${currentSlide.accentColor}22`,
                        color: currentSlide.accentColor
                      }}
                    >
                      <CurrentIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span
                        className="text-[11px] font-bold font-mono tracking-wider uppercase block"
                        style={{ color: currentSlide.accentColor }}
                      >
                        {currentSlide.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display">
                        {currentSlide.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-300 font-light text-xs sm:text-sm md:text-base leading-relaxed">
                    {currentSlide.description}
                  </p>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-200">
                    <span className="text-[#A9F8B5] font-semibold block text-[11px] sm:text-xs uppercase tracking-wider mb-1">
                      ⚡ Ventaja Estratégica:
                    </span>
                    {currentSlide.highlight}
                  </div>

                  {/* Métricas destacadas */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-1">
                    {currentSlide.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10 text-center"
                      >
                        <div
                          className="font-bold text-xs sm:text-sm md:text-base font-mono"
                          style={{ color: currentSlide.accentColor }}
                        >
                          {m.value}
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium leading-tight mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onScrollToQuote();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#A9F8B5] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#DFF494] transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-lg shadow-[#A9F8B5]/20"
                    >
                      <span>Cotizar Solución</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {onOpenBooking && (
                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          onOpenBooking();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center text-center"
                      >
                        Agendar Demo en Vivo
                      </button>
                    )}
                  </div>
                </div>

                {/* Columna Derecha: Imagen Real de Alta Definición con Marco Tecnológico */}
                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full relative group">
                    {/* Resplandor perimetral */}
                    <div
                      className="absolute -inset-1 rounded-2xl opacity-40 blur-xl transition-all duration-500 group-hover:opacity-75"
                      style={{ backgroundColor: currentSlide.accentColor }}
                    />

                    {/* Marco tipo Pantalla de Software Silicon Valley */}
                    <div className="relative rounded-2xl border border-white/20 bg-[#090c14] overflow-hidden shadow-2xl">
                      {/* Barra superior de ventana */}
                      <div className="bg-[#111624] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="ml-2 sm:ml-3 text-[11px] sm:text-xs text-gray-400 font-mono truncate max-w-[130px] sm:max-w-[220px]">
                            geosoft.cr/solutions/{currentSlide.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-mono font-bold"
                            style={{
                              backgroundColor: `${currentSlide.accentColor}22`,
                              color: currentSlide.accentColor
                            }}
                          >
                            60 FPS • Ultra HD
                          </span>
                        </div>
                      </div>

                      {/* Imagen Real de Producto con Transición Suave */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img
                          key={currentSlide.image}
                          src={currentSlide.image}
                          alt={currentSlide.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* Viñeta sutil en bordes */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Badge interactivo flotante sobre la imagen */}
                        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-[#0a0f18]/90 backdrop-blur-md border border-white/15 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-white max-w-[calc(100%-1.25rem)]">
                          <span
                            className="w-2 h-2 rounded-full animate-ping shrink-0"
                            style={{ backgroundColor: currentSlide.accentColor }}
                          />
                          <span className="font-semibold truncate">{currentSlide.title}</span>
                          <span className="text-[10px] text-gray-400 border-l border-white/15 pl-2 font-mono hidden sm:inline">
                            Producción GeoSoft
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Barra Inferior de Control de Reproducción */}
            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                {mode === 'interactive' && (
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title={isPlaying ? 'Pausar showcase' : 'Reanudar showcase'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => goToSlide(0)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 transition-colors cursor-pointer"
                  title="Reiniciar reel"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="font-mono text-gray-400 text-xs truncate max-w-[200px] sm:max-w-none">
                  {currentIndex + 1} de {solutions.length}:{' '}
                  <span className="text-white font-semibold">{currentSlide.title}</span>
                </span>
              </div>

              {/* Píldoras de Navegación Rápida */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full w-full sm:w-auto no-scrollbar">
                {solutions.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      currentIndex === idx && mode === 'interactive'
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {s.title.split('&')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};
