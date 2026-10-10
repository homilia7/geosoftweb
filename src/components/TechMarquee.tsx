import React from 'react';

export const TechMarquee: React.FC = () => {
  const technologies = [
    'OpenAI & LLMs',
    'WhatsApp Cloud API',
    'Cloudflare Pages',
    'React & Vite',
    'Supabase & PostgreSQL',
    'Sinpe Móvil / SinpePay',
    'Stripe Global Payments',
    'Tailwind CSS',
    'Google Cloud'
  ];

  return (
    <section className="py-8 bg-[#040404] border-b border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">
          Ecosistema Tecnológico & Integraciones Nativas
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex items-center">
        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#040404] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#040404] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-10 py-3">
          {[...technologies, ...technologies].map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#A9F8B5]/40 transition-colors whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5]" />
              <span>{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
