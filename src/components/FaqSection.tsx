import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Cuánto tiempo tarda el desarrollo de una web o sistema?',
      a: 'Una página web corporativa o landing page de alto impacto se entrega habitualmente entre 5 y 10 días hábiles. Proyectos más complejos con agentes de IA, pasarelas de pago o plataformas SaaS completas toman entre 2 y 4 semanas según el alcance.'
    },
    {
      q: '¿Cómo funciona la integración de Chatbots de IA con WhatsApp?',
      a: 'Conectamos agentes de lenguaje natural directamente a la API oficial de WhatsApp Cloud. El agente atiende a tus prospectos en segundos, responde según la información de tu empresa, recopila datos y transfiere al asesor humano cuando el cliente está listo para comprar.'
    },
    {
      q: '¿Qué pasarelas de pago se pueden integrar para reservas y compras?',
      a: 'Integramos pasarelas locales e internacionales como SinpePay (Sinpe Móvil para Costa Rica), Stripe, PayPal y tarjetas de crédito con estándares de cifrado bancario seguro.'
    },
    {
      q: '¿El código del proyecto es 100% de mi propiedad?',
      a: 'Sí. A diferencia de plataformas cerradas de suscripción como Wix o Shopify donde alquilas el software, en GeoSoft el código fuente, la base de datos y la arquitectura quedan bajo tu total propiedad y control.'
    },
    {
      q: '¿Ofrecen garantía y soporte después de publicar la web?',
      a: 'Totalmente. Incluimos garantía de funcionamiento sin errores, monitoreo de caídas 24/7 y planes de mantenimiento mensual continuo para asegurar que tu plataforma esté siempre actualizada y protegida.'
    }
  ];

  return (
    <section id="faq" className="py-24 px-4 md:px-8 border-t border-white/5 bg-[#050607]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFF494]">
            <HelpCircle className="w-3.5 h-3.5 text-[#DFF494]" />
            Respuestas Claras
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Todo lo que necesitas saber antes de iniciar tu proyecto con GeoSoft.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="card-accent overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-display font-semibold text-white text-base md:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#A9F8B5] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-sm md:text-base text-gray-300 font-light leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
