import React, { useState } from 'react';
import { Calculator, Check, Sparkles, Send, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGeoSoftStore } from '../context/StoreContext';
import { PlatformOption } from '../types';
import { Reveal } from './Reveal';

export const CostCalculator: React.FC = () => {
  const { pricing } = useGeoSoftStore();
  const platforms = pricing.platforms;
  const addons = pricing.addons;

  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('ai');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['domain', 'hosting']);
  const [isGenerated, setIsGenerated] = useState(false);

  // Find selected platform from dynamic store
  const selectedPlatform = platforms.find(p => p.id === selectedPlatformId) || platforms[0];

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const rawOneTime = selectedPlatform.basePrice;
    const discountMultiplier = pricing.discountActive ? (100 - pricing.discountPercent) / 100 : 1;
    const oneTime = Math.round(rawOneTime * discountMultiplier);

    let annual = 0;
    let monthly = 0;

    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        if (addon.period === 'pago único') annual += addon.price;
        else if (addon.period === 'anual') annual += addon.price;
        else if (addon.period === 'mensual') monthly += addon.price;
      }
    });

    return { rawOneTime, oneTime, annual, monthly, savings: rawOneTime - oneTime };
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
    const text = encodeURIComponent(
      `¡Hola GeoSoft! Acabo de cotizar mi proyecto en geosoftweb.pages.dev:\n\n*Tipo de Web:* ${selectedPlatform.title} ($${totals.oneTime}${pricing.discountActive ? ' con ' + pricing.discountPercent + '% OFF' : ''})\n*Servicios adicionales:* ${selectedAddons.map(id => addons.find(a => a.id === id)?.title).join(', ') || 'Ninguno'}\n*Total Inicial:* $${totals.oneTime + totals.annual}\n\n¿Podemos coordinar para formalizar la propuesta exacta?`
    );
    return `https://wa.me/50689999999?text=${text}`;
  };

  return (
    <section id="cotizador" className="py-24 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <Reveal effect="up" className="text-center max-w-2xl mx-auto space-y-4">
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

          {/* Active Promo Discount Banner */}
          {pricing.discountActive && (
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#DFF494]/15 border border-[#DFF494]/30 text-xs font-bold text-[#DFF494] shadow-[0_0_20px_rgba(223,244,148,0.2)] animate-pulse">
              <Tag className="w-4 h-4" />
              <span>{pricing.discountBanner} ({pricing.discountPercent}% de descuento aplicado)</span>
            </div>
          )}
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selectors */}
          <Reveal effect="left" delay={50} className="lg:col-span-8 space-y-10">
            {/* Step 1: Platform Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#A9F8B5]/20 text-[#A9F8B5] text-xs flex items-center justify-center font-mono">1</span>
                Elige el tipo de Web / Plataforma
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {platforms.map(p => {
                  const isSelected = selectedPlatform.id === p.id;
                  const discountMultiplier = pricing.discountActive ? (100 - pricing.discountPercent) / 100 : 1;
                  const discountedPrice = Math.round(p.basePrice * discountMultiplier);

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlatformId(p.id)}
                      className={`tactile-card p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'is-selected border-white/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                          isSelected ? 'bg-[#A9F8B5]/20 text-[#A9F8B5]' : 'bg-white/10 text-gray-400'
                        }`}>
                          {p.badge}
                        </span>
                        
                        <div className="text-right">
                          {pricing.discountActive ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xs text-gray-500 line-through font-mono">${p.basePrice}</span>
                              <span className="text-lg font-extrabold font-display text-[#DFF494]">${discountedPrice}</span>
                            </div>
                          ) : (
                            <div className="text-lg font-extrabold font-display text-white">
                              ${p.basePrice}
                            </div>
                          )}
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
                      className={`tactile-card p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isChecked
                          ? 'is-selected border-white/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          isChecked ? 'bg-[#DFF494] border-[#DFF494] text-black' : 'border-white/30 bg-transparent'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white flex items-center gap-2 flex-wrap">
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

                      <div className="text-right shrink-0">
                        <div className="font-bold text-white text-sm">${addon.price}</div>
                        <div className="text-[10px] text-gray-400">/{addon.period}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Right Column: Live Summary Card */}
          <Reveal effect="right" delay={150} className="lg:col-span-4 sticky top-28">
            <div className="card-accent p-5 sm:p-6 md:p-8 space-y-6 border-[#A9F8B5]/30">
              <div className="blob-glow" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="font-display font-bold text-lg text-white">Resumen Estimado</h3>
                <span className="text-xs font-mono text-[#A9F8B5] bg-[#A9F8B5]/10 px-2.5 py-1 rounded-full">
                  Tiempo Real
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-300">
                  <span className="truncate pr-2">{selectedPlatform.title}</span>
                  <div className="text-right">
                    {pricing.discountActive ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 line-through font-mono">${totals.rawOneTime}</span>
                        <span className="font-mono font-bold text-[#DFF494]">${totals.oneTime}</span>
                      </div>
                    ) : (
                      <span className="font-mono font-semibold text-white">${totals.oneTime}</span>
                    )}
                  </div>
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
                {pricing.discountActive && (
                  <div className="flex justify-between items-center text-xs text-[#DFF494]">
                    <span>Ahorro Promocional:</span>
                    <span className="font-mono font-bold">-${totals.savings} USD</span>
                  </div>
                )}
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
          </Reveal>
        </div>
      </div>
    </section>
  );
};
