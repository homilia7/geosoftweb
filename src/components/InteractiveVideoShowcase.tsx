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
  Volume2,
  VolumeX,
  RotateCcw,
  Film,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { Reveal } from './Reveal';

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
  description: string;
  highlight: string;
  metrics: { label: string; value: string }[];
  accentColor: string;
  bgGradient: string;
  renderMockup: () => React.ReactNode;
}

export const InteractiveVideoShowcase: React.FC<InteractiveVideoShowcaseProps> = ({
  onScrollToQuote,
  onOpenBooking
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [mode, setMode] = useState<'interactive' | 'video'>('interactive');
  const videoRef = useRef<HTMLVideoElement>(null);

  const SLIDE_DURATION = 4200; // ms por diapositiva

  const solutions: SolutionSlide[] = [
    {
      id: 'chatbots',
      badge: 'INTELIGENCIA ARTIFICIAL',
      category: 'Atención & Ventas 24/7',
      title: 'Chatbots & Agentes de IA',
      icon: Bot,
      description:
        'Asistentes conversacionales inteligentes que atienden a tus clientes en milisegundos, califican prospectos y cierran ventas en WhatsApp Cloud y Web.',
      highlight: 'El 70% de las ventas se concretan respondiendo en los primeros 5 minutos.',
      metrics: [
        { label: 'Tiempo de respuesta', value: '< 2 seg' },
        { label: 'Disponibilidad', value: '24/7/365' },
        { label: 'Cierre de leads', value: '+340%' }
      ],
      accentColor: '#A9F8B5',
      bgGradient: 'from-[#104a0e]/30 to-[#07130a]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-3 font-sans text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A9F8B5] animate-ping" />
              <span className="font-semibold text-white">WhatsApp Business AI</span>
            </div>
            <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-2 py-0.5 rounded-full font-mono">
              En Vivo
            </span>
          </div>
          <div className="space-y-2">
            <div className="bg-white/5 border border-white/5 rounded-lg p-2.5 max-w-[85%] text-gray-300">
              Hola, ¿tienen disponibilidad para una cotización de software este jueves?
            </div>
            <div className="bg-[#104a0e]/40 border border-[#A9F8B5]/30 rounded-lg p-2.5 max-w-[85%] ml-auto text-white shadow-md">
              <span className="font-semibold text-[#A9F8B5] block text-[11px] mb-1">
                🤖 Agente GeoSoft
              </span>
              ¡Hola! Claro que sí. Tenemos espacios disponibles a las 10:00 AM y 3:00 PM. ¿Cuál horario te queda mejor?
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 pl-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A9F8B5]" />
              <span>Lead calificado y registrado en CRM automáticamente</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'web',
      badge: 'DISEÑO CORPORATIVO',
      category: 'Presencia Digital de Alto Impacto',
      title: 'Páginas Web Profesionales',
      icon: Globe,
      description:
        'Sitios web de velocidad extrema y estética premium. Construidos con arquitectura moderna que proyecta solidez corporativa y posiciona en Google.',
      highlight: 'Carga instantánea en menos de 0.4s con puntuación perfecta de rendimiento.',
      metrics: [
        { label: 'Velocidad de carga', value: '0.38s' },
        { label: 'Google Lighthouse', value: '100/100' },
        { label: 'Conversión B2B', value: '+180%' }
      ],
      accentColor: '#38bdf8',
      bgGradient: 'from-[#0369a1]/30 to-[#0c4a6e]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-3 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-gray-400 font-mono">https://tuempresa.com</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">100/100 SEO</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-white/5 border border-white/10 rounded-lg p-2">
              <div className="text-emerald-400 font-bold text-sm sm:text-base">100%</div>
              <div className="text-[10px] text-gray-400">Rendimiento</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-2">
              <div className="text-sky-400 font-bold text-sm sm:text-base">100%</div>
              <div className="text-[10px] text-gray-400">Accesibilidad</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-2">
              <div className="text-purple-400 font-bold text-sm sm:text-base">100%</div>
              <div className="text-[10px] text-gray-400">Mejores Prácticas</div>
            </div>
          </div>
          <div className="text-xs text-gray-300 bg-white/5 p-2 rounded-lg border border-white/5 flex items-center justify-between">
            <span>🛡️ Cero plantillas lentas de WordPress</span>
            <span className="text-emerald-400 font-bold">Ultrarrápido</span>
          </div>
        </div>
      )
    },
    {
      id: 'membresias',
      badge: 'COMUNIDADES & ACADEMIAS',
      category: 'Monetización Recurrente',
      title: 'Sitios de Membresía & LMS',
      icon: Users,
      description:
        'Portales de suscripción exclusiva para creadores, academias y colegios profesionales. Protección de contenido contra descargas y pasarela de cobros.',
      highlight: 'Control total de usuarios con pagos automáticos mes a mes.',
      metrics: [
        { label: 'Cobro automático', value: '100% Nube' },
        { label: 'Retención de alumnos', value: '89%' },
        { label: 'Contenido blindado', value: 'DRM Protegido' }
      ],
      accentColor: '#fb923c',
      bgGradient: 'from-[#c2410c]/30 to-[#7c2d12]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-3 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-orange-400 font-bold">Portal VIP • Nivel Pro</span>
            <span className="text-gray-400 font-mono text-[11px]">Suscripción Activa</span>
          </div>
          <div className="space-y-2">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex justify-between text-xs text-white mb-1.5 font-medium">
                <span>Módulo 3: Arquitectura Cloud</span>
                <span className="text-orange-400">75% Completado</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-3/4 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white/5 rounded border border-white/5 text-gray-300">
                🔒 Certificados emitidos
              </div>
              <div className="p-2 bg-white/5 rounded border border-white/5 text-gray-300">
                💳 Pasarela recurrente
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'saas',
      badge: 'CLOUD COMPUTING',
      category: 'Software as a Service Multi-Tenant',
      title: 'Plataformas SaaS Escalables',
      icon: Cloud,
      description:
        'Desarrollo de productos digitales escalables en la nube. Arquitecturas preparadas para millones de peticiones con base de datos distribuida y facturación.',
      highlight: 'Infraestructura Serverless con latencia mínima en toda Latinoamérica.',
      metrics: [
        { label: 'Uptime garantizado', value: '99.99%' },
        { label: 'Latencia global', value: '< 25ms' },
        { label: 'Escalabilidad', value: 'Ilimitada' }
      ],
      accentColor: '#818cf8',
      bgGradient: 'from-[#4338ca]/30 to-[#312e81]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-3 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-indigo-400 font-bold font-mono">SaaS Telemetry Hub</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
              Healthy
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
              <div className="text-xs text-gray-400">MRR Activo</div>
              <div className="text-sm font-bold text-white">$14,250</div>
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
              <div className="text-xs text-gray-400">Empresas</div>
              <div className="text-sm font-bold text-indigo-400">128</div>
            </div>
            <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
              <div className="text-xs text-gray-400">API Calls</div>
              <div className="text-sm font-bold text-emerald-400">1.8M</div>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 flex items-center justify-between bg-white/5 p-2 rounded">
            <span>Servidores Serverless Cloudflare D1</span>
            <span className="text-indigo-300 font-mono">12ms avg</span>
          </div>
        </div>
      )
    },
    {
      id: 'crm',
      badge: 'GESTIÓN COMERCIAL',
      category: 'Pipelines & Clientes 360',
      title: 'Sistemas CRM a la Medida',
      icon: BarChart3,
      description:
        'Controla todo tu flujo de ventas sin pagar licencias mensuales abusivas como Salesforce o HubSpot. Adaptado al 100% a la operativa de tu empresa.',
      highlight: 'Visualiza oportunidades, seguimiento de llamadas y presupuestos en un solo tablero.',
      metrics: [
        { label: 'Costo por usuario extra', value: '$0' },
        { label: 'Cierre de cotizaciones', value: '+45%' },
        { label: 'Visibilidad de pipeline', value: '360°' }
      ],
      accentColor: '#c084fc',
      bgGradient: 'from-[#7e22ce]/30 to-[#581c87]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-2.5 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-purple-400 font-bold">Pipeline Comercial GeoSoft</span>
            <span className="text-gray-400 font-mono text-[10px]">6 Oportunidades</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-purple-950/30 border border-purple-500/30 rounded p-2">
              <div className="font-semibold text-purple-300 mb-1">Prospecto</div>
              <div className="bg-black/50 p-1.5 rounded text-gray-200">Clínica Dental ($1,800)</div>
            </div>
            <div className="bg-sky-950/30 border border-sky-500/30 rounded p-2">
              <div className="font-semibold text-sky-300 mb-1">Cotizado</div>
              <div className="bg-black/50 p-1.5 rounded text-gray-200">Hotel Resort ($4,200)</div>
            </div>
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded p-2">
              <div className="font-semibold text-emerald-300 mb-1">Ganado</div>
              <div className="bg-black/50 p-1.5 rounded text-emerald-200 font-bold">SaaS B2B ($6,500)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'custom-software',
      badge: 'INGENIERÍA AVANZADA',
      category: 'Código Limpio & Alto Rendimiento',
      title: 'Software a la Medida',
      icon: Cpu,
      description:
        'Desarrollo ad-hoc para resolver cuellos de botella específicos en fábricas, despachos, logística y empresas con reglas complejas que ningún software genérico cubre.',
      highlight: 'Arquitectura modular limpia que evoluciona contigo sin deuda técnica.',
      metrics: [
        { label: 'Ajuste operativo', value: '100% Exacto' },
        { label: 'Seguridad de datos', value: 'Cifrado SHA' },
        { label: 'Propiedad del código', value: '100% Tuya' }
      ],
      accentColor: '#e2e8f0',
      bgGradient: 'from-[#334155]/30 to-[#1e293b]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-gray-400">
            <span>engine/businessLogic.ts</span>
            <span className="text-emerald-400">Compiled OK</span>
          </div>
          <div className="space-y-1 text-gray-300 bg-black/60 p-2.5 rounded border border-white/5 text-[11px]">
            <div><span className="text-purple-400">export async function</span> <span className="text-sky-300">processOrder</span>(orderId) &#123;</div>
            <div className="pl-3 text-gray-400">// Validación fiscal SINALEVI & D-104</div>
            <div className="pl-3"><span className="text-purple-400">const</span> result = <span className="text-purple-400">await</span> gateway.<span className="text-yellow-300">verifySinpe</span>(orderId);</div>
            <div className="pl-3"><span className="text-purple-400">return</span> result.<span className="text-emerald-400">dispatchInvoice</span>();</div>
            <div>&#125;</div>
          </div>
        </div>
      )
    },
    {
      id: 'automatizacion',
      badge: 'EFICIENCIA OPERATIVA',
      category: 'Workflows & Conexión de Sistemas',
      title: 'Automatización de Procesos',
      icon: Zap,
      description:
        'Conectamos tus sistemas existentes (ERP, WhatsApp, bases de datos, pasarelas de pago y correo) para que la información fluya sin que nadie tenga que copiar y pegar.',
      highlight: 'Ahorra más de 80 horas de trabajo manual al mes por cada departamento.',
      metrics: [
        { label: 'Tiempo ahorrado', value: '-85%' },
        { label: 'Errores humanos', value: '0%' },
        { label: 'Ejecución en vivo', value: 'Automática' }
      ],
      accentColor: '#f472b6',
      bgGradient: 'from-[#be185d]/30 to-[#831843]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-2.5 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-pink-400 font-bold">Flujo de Automatización</span>
            <span className="text-emerald-400 text-[10px] font-mono">3 Disparadores Activos</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] justify-between">
            <div className="p-2 bg-white/5 rounded border border-white/10 text-center flex-1">
              <span className="text-white block font-bold">1. Form Web</span>
              <span className="text-[10px] text-gray-400">Nuevo Lead</span>
            </div>
            <span className="text-pink-400">→</span>
            <div className="p-2 bg-pink-950/40 border border-pink-500/40 rounded text-center flex-1">
              <span className="text-pink-300 block font-bold">2. Agente IA</span>
              <span className="text-[10px] text-gray-300">Valida Datos</span>
            </div>
            <span className="text-pink-400">→</span>
            <div className="p-2 bg-emerald-950/40 border border-emerald-500/40 rounded text-center flex-1">
              <span className="text-emerald-300 block font-bold">3. Factura</span>
              <span className="text-[10px] text-gray-300">Sinpe & Email</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reservas',
      badge: 'AGENDAMIENTO EN LÍNEA',
      category: 'Citas, Hotelería & Cobros Inmediatos',
      title: 'Sistemas de Reservas & Cobros',
      icon: Calendar,
      description:
        'Sistemas de calendario sincronizados en tiempo real para clínicas, hoteles, restaurantes y centros de eventos. Previene el overbooking y cobra automáticamente.',
      highlight: 'Sincronizado con Google Calendar, Outlook y recordatorios por WhatsApp.',
      metrics: [
        { label: 'Cobro de seña', value: 'Sinpe Móvil' },
        { label: 'Ausencias de clientes', value: '-65%' },
        { label: 'Disponibilidad', value: 'Tiempo Real' }
      ],
      accentColor: '#fde047',
      bgGradient: 'from-[#a16207]/30 to-[#713f12]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-2.5 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-yellow-400 font-bold">Agenda de Citas en Vivo</span>
            <span className="text-emerald-400 text-[10px] font-mono">SinpePay Conectado</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="p-2 rounded bg-white/5 border border-white/5 text-gray-400">
              09:00 AM <br /><span className="text-[9px] text-red-400">Ocupado</span>
            </div>
            <div className="p-2 rounded bg-yellow-400/20 border border-yellow-400/50 text-white font-bold cursor-pointer">
              11:30 AM <br /><span className="text-[9px] text-yellow-300">Disponible</span>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/5 text-gray-400">
              03:00 PM <br /><span className="text-[9px] text-red-400">Ocupado</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-300 bg-white/5 p-2 rounded flex items-center justify-between">
            <span>✅ Comprobante Sinpe verificado en 2s</span>
            <span className="text-yellow-400 font-mono font-bold">₡15,000</span>
          </div>
        </div>
      )
    },
    {
      id: 'pwa',
      badge: 'APLICACIONES PROGRESIVAS',
      category: 'Experiencia Móvil Nativa',
      title: 'Aplicaciones Web (PWA)',
      icon: Smartphone,
      description:
        'Aplicaciones móviles de alta velocidad instalables directamente desde el navegador en iOS y Android. Cero comisiones a las tiendas de apps y funcionamiento offline.',
      highlight: 'Notificaciones push, acceso instantáneo y diseño adaptado a cada pantalla.',
      metrics: [
        { label: 'Compatibilidad', value: 'iOS & Android' },
        { label: 'Tiempo de carga', value: 'Instantáneo' },
        { label: 'Comisión de tiendas', value: '0%' }
      ],
      accentColor: '#34d399',
      bgGradient: 'from-[#059669]/30 to-[#065f46]/50',
      renderMockup: () => (
        <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 sm:p-5 shadow-2xl space-y-2.5 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-emerald-400 font-bold">PWA Móvil Instalada</span>
            <span className="text-gray-400 font-mono text-[10px]">Offline Ready</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center font-bold text-black text-sm">
              GS
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">App Corporativa GeoSoft</div>
              <div className="text-[11px] text-gray-400">Instalada en pantalla de inicio</div>
            </div>
          </div>
          <div className="text-[10px] text-emerald-300 text-center font-mono bg-emerald-950/40 border border-emerald-500/30 p-1.5 rounded">
            ⚡ 60 FPS • Notificaciones Push activas
          </div>
        </div>
      )
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
    <section id="video-showcase" className="py-20 px-4 md:px-8 relative overflow-hidden bg-black/60">
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Encabezado */}
        <Reveal effect="up" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#A9F8B5]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showcase Interactivo • Lo que Podemos Crear</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white">
            Un Ecosistema Completo para{' '}
            <span className="text-gradient-accent">Potenciar tu Negocio</span>
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Mira en acción las 9 soluciones digitales que desarrollamos para empresas que buscan liderar su sector.
          </p>

          {/* Selector de Modo: Interactivo vs Video MP4 */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setMode('interactive');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === 'interactive'
                  ? 'bg-[#A9F8B5] text-black shadow-lg shadow-[#A9F8B5]/20 scale-105'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Modo Interactivo en Vivo
              </span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setMode('video');
                setIsPlaying(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === 'video'
                  ? 'bg-[#A9F8B5] text-black shadow-lg shadow-[#A9F8B5]/20 scale-105'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Modo Video MP4 Full HD
              </span>
            </button>
          </div>
        </Reveal>

        {/* Reproductor / Showcase Principal */}
        <Reveal effect="up" delay={100} className="w-full">
          <div className="relative rounded-2xl border border-white/15 bg-gradient-to-b from-[#0c1017] to-[#06080d] p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Barra de Progreso Segmentada tipo Stories */}
            {mode === 'interactive' && (
              <div className="grid grid-cols-9 gap-1.5 mb-6">
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

            {/* Contenido: MODO VIDEO MP4 */}
            {mode === 'video' ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 relative bg-black">
                <video
                  ref={videoRef}
                  src="/videos/geosoft-showcase.mp4"
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              /* Contenido: MODO INTERACTIVO */
              <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[420px]">
                {/* Columna Izquierda: Información de la Solución Activa */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/20 transition-transform duration-300"
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
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                        {currentSlide.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-300 font-light text-sm sm:text-base leading-relaxed">
                    {currentSlide.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-200">
                    <span className="text-[#A9F8B5] font-semibold block text-xs uppercase tracking-wider mb-1">
                      ⚡ Ventaja Competitiva:
                    </span>
                    {currentSlide.highlight}
                  </div>

                  {/* Métricas destacadas */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {currentSlide.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 text-center"
                      >
                        <div
                          className="font-bold text-base sm:text-lg font-mono"
                          style={{ color: currentSlide.accentColor }}
                        >
                          {m.value}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onScrollToQuote();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#A9F8B5] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#DFF494] transition-all cursor-pointer flex items-center gap-2 group shadow-lg shadow-[#A9F8B5]/20"
                    >
                      <span>Cotizar {currentSlide.title}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {onOpenBooking && (
                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          onOpenBooking();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Agendar Demostración
                      </button>
                    )}
                  </div>
                </div>

                {/* Columna Derecha: Mockup Interactivo Vivo */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-md transform transition-all duration-300">
                    {currentSlide.renderMockup()}
                  </div>
                </div>
              </div>
            )}

            {/* Barra Inferior de Control de Reproducción */}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-3">
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
                <span className="font-mono text-gray-400 text-xs">
                  {currentIndex + 1} de {solutions.length}:{' '}
                  <span className="text-white font-semibold">{currentSlide.title}</span>
                </span>
              </div>

              {/* Píldoras de Navegación Rápida */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {solutions.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
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
        </Reveal>
      </div>
    </section>
  );
};
