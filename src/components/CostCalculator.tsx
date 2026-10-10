import React, { useState } from 'react';
import { Calculator, Check, Sparkles, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlatformOption, AddonService } from '../types';

export const CostCalculator: React.FC = () => {
  const platforms: PlatformOption[] = [
    {
      id: 'static',
      title: 'Web Estática / Landing Page',
      badge: 'Presencia Rápida',
      description: 'Ideal para marca corporativa, portafolio y máxima velocidad de carga.',
      basePrice: 199,
      features: ['Diseño 100% responsivo', 'Optimización SEO básica', 'Despliegue en Cloudflare']
    },
    {
      id: 'dynamic',
      title: 'Web Dinámica / Catálogo',
      badge: 'Autoadministrable',
      description: 'Ideal para blogs, catálogos, inmobiliarias o actualización frecuente.',
      basePrice: 399,
      features: ['Panel de administración fácil', 'Formularios avanzados', 'Gestión de contenido']
    },
    {
      id: 'ai',
      title: 'Web con Agente de IA 24/7',
      badge: 'Más Popular',
      description: 'Convierte visitas en clientes con chatbots inteligentes y flujos automáticos.',
      basePrice: 599,
      features: ['Chatbot de IA conversacional', 'Captura automática de leads', 'Conexión a WhatsApp / CRM']
    },
    {
      id: 'saas',
      title: 'Plataforma SaaS & Sistema Web',
      badge: 'Solución Enterprise',
      description: 'Software a medida con bases de datos, roles de usuario y pasarelas de pago.',
      basePrice: 999,
      features: ['Arquitectura en la nube', 'Pasarelas SinpePay / Stripe', 'Paneles de usuario avanzados']
    }
  ];

  const addons: AddonService[] = [
    {
      id: 'domain',
      title: 'Dominio Propio (.com / .lat)',
      description: 'Registro oficial de tu marca en internet por 1 año.',
      price: 25,
      period: 'anual'
    },
    {
      id: 'hosting',
      title: 'Hosting Cloud Premium',
      description: 'Servidores de alta velocidad con SSL y CDN global.',
      price: 75,
      period: 'anual',
      recommended: true
    },
    {
      id: 'maintenance',
      title: 'Mantenimiento & Soporte Continuo',
      description: 'Actualizaciones de seguridad, monitoreo y soporte prioritario.',
      price: 45,
      period: 'mensual'
    }
  ];

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption>(platforms[2]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['domain', 'hosting']);
  const [isGenerated, setIsGenerated] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let oneTime = selectedPlatform.basePrice;
    let annual = 0;
    let monthly = 0;

    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        if (addon.period === 'pago único') oneTime += addon.price;
        else if (addon.period === 'anual') annual += addon.price;
        else if (addon.period === 'mensual') monthly += addon.price;
      }
    });

    return { oneTime, annual, monthly, totalFirstYear: oneTime + annual + monthly * 12 };
  };

  const totals = calculateTotal();

  const handleGenerateProposal = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsGenerated(true);
  };

  const generateWhatsAppMessage = () => {
    const text = `¡Hola GeoSoft! Acabo de cotizar mi proyecto en geosoftweb.pages.dev:%0A%0A*Tipo de Web:* ${selectedPlatform.title} ($${selectedPlatform.basePrice})%0A*Servicios adicionales:* ${selectedAddons.map(id => addons.find(a => a.id === id)?.title).join(', ') || 'Ninguno'}%0A*Total Estimado Inicial:* $${totals.oneTime + totals.annual}%0A%0A¿Podemos coordinar para formalizar la propuesta exacta?`;
    return `https://wa.me/50689999999?text=${text}`;
  };

  return (
    <section id="cotizador" className="py-24 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#A9F8B5]">
            <Calculator className="w-3.5 h-3.5 text-[#A9F8B5]" />
            Transparencia Total
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
            Cotizador <span className="text-gradient-accent">Inteligente</span> en Vivo
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Configura las características de tu proyecto y obtén un estimado instantáneo sin sorpresas ni tarifas ocultas.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selectors */}
          <div className="lg:col-span-8 space-y-10">
            {/* Step 1: Platform Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#A9F8B5]/20 text-[#A9F8B5] text-xs flex items-center justify-center font-mono">1</span>
                Elige el tipo de Web / Plataforma
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {platforms.map(p => {
                  const isSelected = selectedPlatform.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlatform(p)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#181a1d] border-[#A9F8B5] shadow-[0_0_25px_rgba(169,248,181,0.15)]'
                          : 'bg-[#111215]/80 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                          isSelected ? 'bg-[#A9F8B5]/20 text-[#A9F8B5]' : 'bg-white/10 text-gray-400'
                        }`}>
                          {p.badge}
                        </span>
                        <div className="text-lg font-extrabold font-display text-white">
                          ${p.basePrice}
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-base mb-1">{p.title}</h4>
                      <p className="text-xs text-gray-400 font-light leading-relaxed mb-3">{p.description}</p>

                      <div className="space-y-1 border-t border-white/5 pt-2">
                        {p.features.map((feat, i) => (
                          <div key={i} className="text-[11px] text-gray-300 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-[#A9F8B5]" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Addons */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#DFF494]/20 text-[#DFF494] text-xs flex items-center justify-center font-mono">2</span>
                Servicios Complementarios
              </h3>

              <div className="space-y-3">
                {addons.map(addon => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#181a1d] border-[#DFF494] shadow-[0_0_20px_rgba(223,244,148,0.1)]'
                          : 'bg-[#111215]/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#DFF494] border-[#DFF494] text-black' : 'border-white/30 bg-transparent'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white flex items-center gap-2">
                            <span>{addon.title}</span>
                            {addon.recommended && (
                              <span className="text-[10px] bg-[#DFF494]/20 text-[#DFF494] px-1.5 py-0.2 rounded-full font-mono">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 font-light">{addon.description}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-white text-sm">${addon.price}</div>
                        <div className="text-[10px] text-gray-400">/{addon.period}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Summary Card */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="card-accent p-6 md:p-8 space-y-6 border-[#A9F8B5]/30">
              <div className="blob-glow" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h4 className="font-display font-bold text-lg text-white">Resumen Estimado</h4>
                <span className="text-xs font-mono text-[#A9F8B5] bg-[#A9F8B5]/10 px-2.5 py-1 rounded-full">
                  Tiempo Real
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-300">
                  <span className="truncate pr-2">{selectedPlatform.title}</span>
                  <span className="font-mono font-semibold text-white">${selectedPlatform.basePrice}</span>
                </div>

                {selectedAddons.map(id => {
                  const item = addons.find(a => a.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-gray-400 text-xs">
                      <span>{item.title}</span>
                      <span className="font-mono text-gray-200">+${item.price} ({item.period})</span>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Totals Box */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Inversión Desarrollo:</span>
                  <span className="text-2xl font-extrabold font-display text-gradient-accent">
                    ${totals.oneTime}
                  </span>
                </div>
                {totals.annual > 0 && (
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Servicios Anuales:</span>
                    <span className="font-mono text-gray-200">${totals.annual}/año</span>
                  </div>
                )}
                {totals.monthly > 0 && (
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Mantenimiento Mensual:</span>
                    <span className="font-mono text-gray-200">${totals.monthly}/mes</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {!isGenerated ? (
                  <button
                    onClick={handleGenerateProposal}
                    className="w-full btn-primary-gradient py-3.5 text-sm uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Generar Mi Propuesta
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[#A9F8B5] text-xs font-bold mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>¡Presupuesto Generado!</span>
                      </div>
                      <p className="text-[11px] text-gray-300">
                        Envía esta configuración a nuestro equipo para formalizar tu proyecto.
                      </p>
                    </div>

                    <a
                      href={generateWhatsAppMessage()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar por WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span>Presupuesto sin compromiso • Contrato & Garantía</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
