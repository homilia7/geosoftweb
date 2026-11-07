import React, { useState } from 'react';
import { Calculator, Check, Sparkles, Send, CheckCircle2, ShieldCheck, Tag, Rocket, Repeat } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGeoSoftStore } from '../context/StoreContext';
import { PlatformOption } from '../types';
import { Reveal } from './Reveal';

export const CostCalculator: React.FC = () => {
  const { pricing } = useGeoSoftStore();
  const platforms = pricing.platforms.filter(p => p.id !== 'ai');
  const addons = pricing.addons;

  const [planMode, setPlanMode] = useState<'emprendedor' | 'tradicional'>('emprendedor');
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('static');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['domain', 'hosting']);
  const [isGenerated, setIsGenerated] = useState(false);

  // Find selected platform from dynamic store
  const selectedPlatform = platforms.find(p => p.id === selectedPlatformId) || platforms[0];
  const isEntrepreneur = planMode === 'emprendedor';

  const entrepreneurFee = selectedPlatform.entrepreneurMonthlyPrice ||
    (selectedPlatform.id === 'static' ? 35000 : selectedPlatform.id === 'dynamic' ? 55000 : 80000);

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
    if (isEntrepreneur) {
      const text = encodeURIComponent(
        `¡Hola GeoSoft! Me interesa el *Plan Emprendedor (Cuota Mensual Única)* para mi proyecto:\n\n` +
        `🚀 *Plan:* Plan Emprendedor Personalizado\n` +
        `💻 *Plataforma:* ${selectedPlatform.title} (${selectedPlatform.badge})\n` +
        `💵 *Adelanto de Proyecto:* ₡0 (¡Sin pagos por adelantos!)\n` +
        `🌐 *Anualidades:* ₡0 (¡Sin anualidades! Dominio y Hosting cloud incluidos)\n` +
        `📅 *Cuota Mensual Única:* ₡${entrepreneurFee.toLocaleString('es-CR')}/mes adaptada a mi negocio\n\n` +
        `¿Podemos coordinar para formalizar e iniciar el desarrollo?`
      );
      return `https://wa.me/50689999999?text=${text}`;
    }

    const text = encodeURIComponent(
      `¡Hola GeoSoft! Acabo de cotizar mi proyecto en geosoftweb.pages.dev:\n\n*Tipo de Web:* ${selectedPlatform.title} (₡${totals.oneTime.toLocaleString('es-CR')}${pricing.discountActive ? ' con ' + pricing.discountPercent + '% OFF' : ''})\n*Servicios adicionales:* ${selectedAddons.map(id => addons.find(a => a.id === id)?.title).join(', ') || 'Ninguno'}\n*Total Inicial:* ₡${(totals.oneTime + totals.annual).toLocaleString('es-CR')}\n\n¿Podemos coordinar para formalizar la propuesta exacta?`
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

          {/* Selector de Modalidad: Plan Emprendedor vs Inversión Tradicional */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto p-1.5 rounded-2xl bg-black/60 border border-white/10 mt-4">
            <button
              type="button"
              onClick={() => setPlanMode('emprendedor')}
              className={`w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isEntrepreneur
                  ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black shadow-lg shadow-[#A9F8B5]/20 font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Rocket className="w-4 h-4 stroke-[2.5]" />
              <span>Plan Emprendedor (Cuota Mensual Única)</span>
              <span className={`text-[9.5px] font-mono uppercase px-1.5 py-0.5 rounded-md ${
                isEntrepreneur ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-gray-400'
              }`}>
                ₡0 Adelanto
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPlanMode('tradicional')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                !isEntrepreneur
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Proyecto Tradicional</span>
            </button>
          </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map(p => {
                  const isSelected = selectedPlatform.id === p.id;
                  const discountMultiplier = pricing.discountActive ? (100 - pricing.discountPercent) / 100 : 1;
                  const discountedPrice = Math.round(p.basePrice * discountMultiplier);
                  const monthlyFee = p.entrepreneurMonthlyPrice || (p.id === 'static' ? 35000 : p.id === 'dynamic' ? 55000 : 80000);

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlatformId(p.id)}
                      className={`tactile-card p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'is-selected border-white/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        {/* Badges Bar */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold shrink-0 ${
                            isSelected ? 'bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/30' : 'bg-white/10 text-gray-400'
                          }`}>
                            {p.badge}
                          </span>
                          {isEntrepreneur && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#A9F8B5] border border-emerald-500/30 whitespace-nowrap shrink-0">
                              ₡0 adelanto
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-bold text-white text-base mb-1">{p.title}</h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-3">{p.description}</p>

                        {/* Dedicated Price Block (100% width, never clipped) */}
                        <div className="p-3 rounded-xl bg-black/50 border border-white/10 mb-3 flex items-baseline justify-between gap-2">
                          <span className="text-[11px] text-gray-400 font-medium">
                            {isEntrepreneur ? 'Cuota mensual:' : 'Inversión:'}
                          </span>
                          <div className="text-right">
                            {isEntrepreneur ? (
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-extrabold font-mono text-[#DFF494] tracking-tight">
                                  ₡{monthlyFee.toLocaleString('es-CR')}
                                </span>
                                <span className="text-xs text-gray-400 font-sans">/mes</span>
                              </div>
                            ) : pricing.discountActive ? (
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xs text-gray-500 line-through font-mono">₡{p.basePrice.toLocaleString('es-CR')}</span>
                                <span className="text-lg font-extrabold font-display text-[#DFF494]">₡{discountedPrice.toLocaleString('es-CR')}</span>
                              </div>
                            ) : (
                              <div className="text-lg font-extrabold font-display text-white">
                                ₡{p.basePrice.toLocaleString('es-CR')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

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
                <span>{isEntrepreneur ? 'Beneficios Incluidos y Complementarios' : 'Servicios Complementarios'}</span>
              </h3>

              {isEntrepreneur && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#A9F8B5] text-xs font-bold font-mono uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-[#A9F8B5]" />
                    <span>Beneficios Integrados del Plan Emprendedor ($0 Adicional):</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[#A9F8B5] font-bold">✓</span>
                      <span>Dominio propio (.com / .lat) sin anualidades</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[#A9F8B5] font-bold">✓</span>
                      <span>Hosting Cloud Premium con SSL sin anualidades</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[#A9F8B5] font-bold">✓</span>
                      <span>Mantenimiento y monitoreo técnico 24/7</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[#A9F8B5] font-bold">✓</span>
                      <span>Desarrollo completo a medida con $0 adelanto</span>
                    </div>
                  </div>
                </div>
              )}

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
                        <div className="font-bold text-white text-sm">₡{addon.price.toLocaleString('es-CR')}</div>
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
                    {isEntrepreneur ? (
                      <span className="font-mono font-bold text-[#DFF494]">₡{entrepreneurFee.toLocaleString('es-CR')}/mes</span>
                    ) : pricing.discountActive ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 line-through font-mono">₡{totals.rawOneTime.toLocaleString('es-CR')}</span>
                        <span className="font-mono font-bold text-[#DFF494]">₡{totals.oneTime.toLocaleString('es-CR')}</span>
                      </div>
                    ) : (
                      <span className="font-mono font-semibold text-white">₡{totals.oneTime.toLocaleString('es-CR')}</span>
                    )}
                  </div>
                </div>

                {!isEntrepreneur && selectedAddons.map(id => {
                  const item = addons.find(a => a.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-gray-400 text-xs">
                      <span>{item.title}</span>
                      <span className="font-mono text-gray-200">+₡{item.price.toLocaleString('es-CR')} ({item.period})</span>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Totals Box */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                {isEntrepreneur ? (
                  <>
                    <div className="flex justify-between items-baseline pb-2 border-b border-white/10">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Adelanto de Proyecto:</span>
                      <span className="text-base font-mono font-extrabold text-[#A9F8B5]">
                        ₡0 <span className="text-[10px] text-gray-400 font-sans font-normal">(¡Sin adelantos!)</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pb-2 border-b border-white/10">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Cobros por Anualidades:</span>
                      <span className="text-sm font-mono font-bold text-[#DFF494]">
                        ₡0 / año <span className="text-[10px] text-gray-400 font-sans font-normal">(¡Sin anualidades!)</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <div>
                        <span className="text-xs font-bold text-white block">Cuota Mensual Única:</span>
                        <span className="text-[10px] text-[#A9F8B5] font-mono">Plan Emprendedor</span>
                      </div>
                      <span className="text-2xl font-extrabold font-display text-gradient-accent">
                        ₡{entrepreneurFee.toLocaleString('es-CR')}
                        <span className="text-xs font-normal text-gray-400 font-sans">/mes</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[10.5px] text-gray-300 space-y-0.5">
                      <div className="text-[#A9F8B5] font-bold">✓ Beneficios Plan Emprendedor:</div>
                      <div>• Dominio + Hosting cloud sin cobros anuales.</div>
                      <div>• Mantenimiento y soporte técnico continuo.</div>
                      <div>• Cuota mensual adaptada a tus necesidades.</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Inversión Desarrollo:</span>
                      <span className="text-2xl font-extrabold font-display text-gradient-accent">
                        ₡{totals.oneTime.toLocaleString('es-CR')}
                      </span>
                    </div>
                    {pricing.discountActive && (
                      <div className="flex justify-between items-center text-xs text-[#DFF494]">
                        <span>Ahorro Promocional:</span>
                        <span className="font-mono font-bold">-₡{totals.savings.toLocaleString('es-CR')}</span>
                      </div>
                    )}
                    {totals.annual > 0 && (
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Servicios Anuales:</span>
                        <span className="font-mono text-gray-200">₡{totals.annual.toLocaleString('es-CR')}/año</span>
                      </div>
                    )}
                    {totals.monthly > 0 && (
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Mantenimiento Mensual:</span>
                        <span className="font-mono text-gray-200">₡{totals.monthly.toLocaleString('es-CR')}/mes</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {!isGenerated ? (
                  <button
                    onClick={handleGenerateProposal}
                    className="w-full btn-primary-gradient py-3.5 text-sm uppercase tracking-wider font-bold cursor-pointer"
                  >
                    {isEntrepreneur ? 'Solicitar Plan Emprendedor' : 'Generar Mi Propuesta'}
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
