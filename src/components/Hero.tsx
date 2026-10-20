import React from 'react';
import { ArrowRight, Calendar, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { RotatingHeadline } from './RotatingHeadline';
import { Reveal } from './Reveal';
import { SpotlightCard } from './SpotlightCard';
import { soundEffects } from '../services/soundEffects';

interface HeroProps {
  onOpenCal: () => void;
  onOpenBooking: () => void;
  onScrollToQuote: () => void;
  introFinished?: boolean;
  onLeftContentAppeared?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenCal,
  onOpenBooking,
  onScrollToQuote,
  introFinished = false,
  onLeftContentAppeared,
}) => {
  const [rightReady, setRightReady] = React.useState(false);
  const [leftReady, setLeftReady] = React.useState(false);
  const onLeftContentAppearedRef = React.useRef(onLeftContentAppeared);

  React.useEffect(() => {
    onLeftContentAppearedRef.current = onLeftContentAppeared;
  }, [onLeftContentAppeared]);

  React.useEffect(() => {
    if (introFinished) {
      // 1. Primero aparece el contenedor derecho (cuadro 3D de arriba hacia abajo)
      const tRight = setTimeout(() => setRightReady(true), 80);

      // 2. El contenedor izquierdo completo aparece de forma ágil y fluida
      const tLeft = setTimeout(() => setLeftReady(true), 750);

      // 3. El menú de arriba inicia su aparición de forma más rápida y natural
      const tNav = setTimeout(() => {
        onLeftContentAppearedRef.current?.();
      }, 1450);

      return () => {
        clearTimeout(tRight);
        clearTimeout(tLeft);
        clearTimeout(tNav);
      };
    }
  }, [introFinished]);


  return (
    <section id="inicio" className="relative pt-16 sm:pt-20 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
      {/* Background radial ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#A9F8B5]/15 via-[#DFF494]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-[#C1A35B]/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column: Headlines & Call to Actions (aparece después del contenedor derecho) */}
          <div className={`md:col-span-7 space-y-5 text-center md:text-left transition-all ${
            leftReady ? 'animate-hero-content-left' : 'opacity-0 pointer-events-none'
          }`}>
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.18em] text-[#A9F8B5]">
              <span className="w-2 h-2 rounded-full bg-[#A9F8B5] shadow-[0_0_10px_#A9F8B5] animate-ping" />
              <span>Soluciones de IA & Software de Élite</span>
            </div>

            {/* Main Title with Refero-style chromatic beam rotating headlines */}
            <RotatingHeadline className="text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] font-bold tracking-tight leading-[1.2] font-display text-white max-w-xl mx-auto md:mx-0" />

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed max-w-xl mx-auto md:mx-0">
              Desarrollamos páginas web que convierten, sistemas de reservas en tiempo real y agentes de IA que atienden a tus clientes 24/7 sin descanso.
            </p>

            {/* CTAs Button Row: Water Bubble / Liquid Glass Style */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2 sm:pt-3">
              <button
                onClick={() => {
                  try { soundEffects.playClick(); } catch {}
                  onScrollToQuote();
                }}
                className="btn-water-bubble-primary w-full sm:w-auto cursor-pointer group"
                aria-label="Cotizar mi Proyecto"
              >
                <div className="water-bubble-gloss" />
                <span className="relative z-10">Cotizar mi Proyecto</span>
                <div className="water-bubble-icon">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>

              <button
                onClick={() => {
                  try { soundEffects.playClick(); } catch {}
                  onOpenBooking();
                }}
                className="btn-water-bubble-secondary w-full sm:w-auto cursor-pointer group"
                aria-label="Agendar Cita en Vivo"
              >
                <div className="water-bubble-gloss" />
                <div className="water-bubble-icon">
                  <Calendar className="w-4 h-4 text-[#A9F8B5] dark:text-[#DFF494]" />
                </div>
                <span className="relative z-10">Agendar Cita en Vivo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 sm:pt-5 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A9F8B5]" />
                <span>Garantía de Entrega y Código Limpio</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#DFF494]" />
                <span>Carga Ultra Rápida & Hosting Cloud</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cuadro con logo e IA Conectada (aparece primero desde arriba hacia abajo suavemente y queda flotando) */}
          <div className={`md:col-span-5 flex justify-center transition-all ${
            rightReady ? 'animate-hero-card-down' : 'opacity-0 pointer-events-none'
          }`}>
            <div id="hero-logo-box" className="relative group w-full max-w-[420px] animate-hero-floating">
              {/* Outer decorative ambient blur */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#A9F8B5]/30 to-[#C1A35B]/30 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

              {/* Glass Card Container with Spotlight Cursor */}
              <SpotlightCard
                spotlightColor="rgba(169, 248, 181, 0.22)"
                size={400}
                className="card-accent rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src="/assets/logo-emerald-md.webp"
                    alt="GeoSoft 3D Cube Emblem"
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Quick stats badge footer */}
                <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 text-center">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-lg sm:text-xl font-bold font-display text-white">24/7</div>
                    <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Atención Activa</div>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-lg sm:text-xl font-bold font-display text-white">&lt;5 min</div>
                    <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Respuesta a Leads</div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
