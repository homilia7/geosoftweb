import React from 'react';
import { Bot, CalendarCheck, Layers, Search, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicesBentoProps {
  onScrollToQuote: () => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onScrollToQuote }) => {
  return (
    <section id="servicios" className="py-24 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#A9F8B5]">
            Ecosistema de Soluciones
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white">
            Diseñado para <span className="text-gradient-accent">Dominar</span> tu Mercado
          </h2>
          <p className="text-gray-400 font-light text-base">
            Cada solución está construida con precisión técnica para resolver problemas reales y generar retorno de inversión medible.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* Bento Card 1: Chatbots & Agentes IA (Span 7) */}
          <div className="md:col-span-7 card-accent p-8 md:p-10 flex flex-col justify-between">
            <div className="blob-glow" />
            
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#A9F8B5]/10 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5]">
                <Bot className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full bg-[#A9F8B5]/15 text-[#A9F8B5] text-xs font-bold font-mono uppercase">
                  IA de Próxima Generación
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Chatbots & Agentes de Ventas 24/7
                </h3>
                <p className="text-gray-300 font-light leading-relaxed text-sm sm:text-base">
                  El 70% de las ventas se pierden si no respondes en los primeros 5 minutos. Nuestros agentes conversacionales abordan a los visitantes, resuelven dudas frecuentes, califican prospectos y transfieren la conversación a tu equipo con todo el contexto.
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 text-sm text-gray-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A9F8B5]" />
                  <span>Integración directa con WhatsApp Cloud, Web y CRM</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A9F8B5]" />
                  <span>Calificación automática de presupuestos y captura de datos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A9F8B5]" />
                  <span>Handoff fluido y transparente a ejecutivos humanos</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={onScrollToQuote}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A9F8B5] hover:text-[#DFF494] transition-colors cursor-pointer group"
              >
                <span>Cotizar Agente de IA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bento Card 2: Sistemas de Reservas & Cobros (Span 5) */}
          <div className="md:col-span-5 card-accent p-8 md:p-10 flex flex-col justify-between">
            <div className="blob-glow" />

            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#DFF494]/10 border border-[#DFF494]/30 flex items-center justify-center text-[#DFF494]">
                <CalendarCheck className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full bg-[#DFF494]/15 text-[#DFF494] text-xs font-bold font-mono uppercase">
                  Automatización de Pagos
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Sistemas de Reservas & Cobros
                </h3>
                <p className="text-gray-300 font-light leading-relaxed text-sm">
                  Ideal para clínicas, hoteles, restaurantes y empresas de servicios. Agenda sincronizada en vivo que previene el overbooking y gestiona cobros sin intervención manual.
                </p>
              </div>

              <ul className="space-y-2.5 text-sm text-gray-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DFF494]" />
                  <span>Pasarelas SinpePay / Sinpe Móvil y Stripe</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DFF494]" />
                  <span>Recordatorios automáticos por WhatsApp y correo</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={onScrollToQuote}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DFF494] hover:text-white transition-colors cursor-pointer group"
              >
                <span>Cotizar Sistema de Reservas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bento Card 3: Software a Medida & SaaS (Span 6) */}
          <div className="md:col-span-6 card-accent p-8 md:p-10 flex flex-col justify-between">
            <div className="blob-glow" />

            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-[#C1A35B]">
                <Layers className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold font-mono uppercase">
                  Cloud & Custom Dev
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Plataformas Web & Software SaaS
                </h3>
                <p className="text-gray-300 font-light leading-relaxed text-sm">
                  Diseñamos infraestructuras web preparadas para escalar. Paneles de control avanzados, multi-rol de usuarios, bases de datos blindadas y alta disponibilidad con latencia mínima.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={onScrollToQuote}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C1A35B] hover:text-white transition-colors cursor-pointer group"
              >
                <span>Cotizar Desarrollo SaaS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bento Card 4: SEO & Autoridad Local (Span 6) */}
          <div className="md:col-span-6 card-accent p-8 md:p-10 flex flex-col justify-between">
            <div className="blob-glow" />

            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-[#A9F8B5]">
                <Search className="w-7 h-7" />
              </div>

              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full bg-[#A9F8B5]/15 text-[#A9F8B5] text-xs font-bold font-mono uppercase">
                  Visibilidad de Alto Nivel
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Posicionamiento SEO & Reputación
                </h3>
                <p className="text-gray-300 font-light leading-relaxed text-sm">
                  Optimización técnica profunda y gestión de perfil corporativo para aparecer en los primeros resultados de búsqueda en Alajuela, San José y a nivel internacional.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={onScrollToQuote}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A9F8B5] hover:text-white transition-colors cursor-pointer group"
              >
                <span>Cotizar Auditoría SEO</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
