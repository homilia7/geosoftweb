import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Reveal } from './Reveal';

export const SalesHook: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Reveal effect="scale">
          <div className="card-accent p-6 sm:p-8 md:p-12 text-center relative overflow-hidden border-[#A9F8B5]/20">
            <div className="blob-glow" />
            
            <div className="w-12 h-12 rounded-2xl bg-[#A9F8B5]/10 border border-[#A9F8B5]/30 mx-auto flex items-center justify-center text-[#A9F8B5] mb-6">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white leading-relaxed italic max-w-2xl mx-auto">
              "¿A quién le comprarías tú? ¿A un negocio que solo tiene un número de WhatsApp o a una empresa con una web profesional, rápida y con atención inteligente?"
            </h2>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFF494]">
              <span>La primera impresión define el 80% de tus ventas</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
