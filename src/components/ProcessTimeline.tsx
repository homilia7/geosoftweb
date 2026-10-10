import React from 'react';
import { Target, Cpu, Rocket } from 'lucide-react';

export const ProcessTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Diagnóstico & Cotización Transparente',
      desc: 'Analizamos las metas de tu empresa, definimos la arquitectura exacta y calculamos el presupuesto sin costos ocultos.',
      icon: Target
    },
    {
      num: '02',
      title: 'Arquitectura & Desarrollo de Vanguardia',
      desc: 'Construimos tu plataforma con diseño de alta fidelidad, código limpio, integración de pasarelas y pruebas de rendimiento.',
      icon: Cpu
    },
    {
      num: '03',
      title: 'Despliegue Cloud & Ventas en Automático',
      desc: 'Publicamos tu web en servidores Cloudflare de escala mundial y activamos los agentes de IA para atender y convertir 24/7.',
      icon: Rocket
    }
  ];

  return (
    <section id="como-funciona" className="py-24 px-4 md:px-8 bg-[#070809] border-y border-white/5 relative">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFF494]">
            Metodología Ágil
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
            Cómo Llevamos tu Proyecto al Éxito
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Un proceso estructurado de 3 fases para garantizar resultados rápidos y sin complicaciones técnicas.
          </p>
        </div>

        {/* 3 Step Row / Timeline */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="card-accent p-8 relative flex flex-col justify-between group hover:border-[#DFF494]/40"
              >
                <div className="blob-glow" />
                
                <div className="space-y-6">
                  {/* Step Header with Number & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#DFF494] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-display font-black text-4xl text-white/20 group-hover:text-[#A9F8B5]/40 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold font-display text-white group-hover:text-[#DFF494] transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#A9F8B5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5]" />
                  <span>Fase {step.num} garantizada</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
