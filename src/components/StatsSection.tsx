import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    { value: '+300%', label: 'Conversión de Prospectos', desc: 'Con chatbots y flujos de captura' },
    { value: '< 1s', label: 'Velocidad de Carga', desc: 'Optimizada en Cloudflare Edge' },
    { value: '24/7', label: 'Operación Continua', desc: 'Ventas y reservas sin interrupción' },
    { value: '100%', label: 'Código Propio a Medida', desc: 'Cero plantillas lentas o genéricas' }
  ];

  return (
    <section className="py-12 border-y border-white/10 bg-[#070809]">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
          {stats.map((item, idx) => (
            <div key={idx} className="space-y-1 group">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-gradient-accent">
                {item.value}
              </div>
              <div className="text-sm font-semibold text-white">{item.label}</div>
              <div className="text-xs text-gray-400 font-light">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
