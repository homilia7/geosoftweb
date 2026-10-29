import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Repeat, Layers, Sparkles, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectQuoteData, QuoteAcceptancePayload } from '../../../types/projectQuote';
import { ClientAcceptancePopup } from './ClientAcceptancePopup';
import { soundEffects } from '../../../services/soundEffects';

interface ClientQuoteModalProps {
  quote: ProjectQuoteData;
  isOpen: boolean;
  onClose: () => void;
  onAcceptanceSuccess: (payload: QuoteAcceptancePayload) => Promise<void>;
}

export const ClientQuoteModal: React.FC<ClientQuoteModalProps> = ({
  quote,
  isOpen,
  onClose,
  onAcceptanceSuccess
}) => {
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'CRC'>(quote.currency || 'USD');
  const [selectedMode, setSelectedMode] = useState<'initial_plus_monthly' | 'only_monthly'>(
    quote.preferredMode === 'only_monthly' ? 'only_monthly' : 'initial_plus_monthly'
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (!isOpen) return null;

  const rate = quote.exchangeRate || 520;
  const isOriginalCrc = quote.currency === 'CRC';
  const viewingCrc = activeCurrency === 'CRC';
  const sym = viewingCrc ? '₡' : '$';

  const convertAmount = (val: number): number => {
    if (isOriginalCrc === viewingCrc) return val;
    if (viewingCrc && !isOriginalCrc) {
      return Math.round((val * rate) / 1000) * 1000;
    }
    return Math.round(val / rate);
  };

  const initialPayment = convertAmount(quote.modeInitialPlusMonthly.initialPayment);
  const monthlyMode1 = convertAmount(quote.modeInitialPlusMonthly.monthlyPayment);
  const monthlyMode2 = convertAmount(quote.modeOnlyMonthly.monthlyPayment);

  const handleOpenPopup = () => {
    try {
      soundEffects.playClick();
    } catch {}
    setIsPopupOpen(true);
  };

  const handleConfirm = async (payload: QuoteAcceptancePayload) => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      soundEffects.playSuccess();
    } catch {}
    await onAcceptanceSuccess(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-start overflow-y-auto p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#A9F8B5] selection:text-black">
      <div className="max-w-4xl w-full mx-auto my-auto space-y-6 animate-message-soft">
        {/* Top Floating Close Bar & Currency Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0f14]/80 border border-white/10 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-3">
            {/* Logo Cubo GeoSoft Mini en barra superior */}
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-emerald-400/30 bg-black footer-logo-glow flex items-center justify-center shrink-0">
              <img
                src="/assets/logo-emerald-md.webp"
                alt="GeoSoft Cube"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
              <div className="footer-logo-sweep" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-xs">Propuesta Comercial Oficial</span>
              <span className="text-[10px] text-gray-400 block font-mono">Ref: {quote.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-black/60 border border-white/15 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCurrency === 'USD'
                    ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
              <button
                type="button"
                onClick={() => setActiveCurrency('CRC')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCurrency === 'CRC'
                    ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ₡ CRC
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Executive Header Card con Logo del Cubo Holográfico */}
        <div className="card-accent p-6 lg:p-8 border-white/10 space-y-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-white/10">
            {/* Logo del Cubo de GeoSoft con Destello Prismático */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-emerald-400/40 bg-black/90 footer-logo-glow flex items-center justify-center shadow-[0_0_30px_rgba(169,248,181,0.25)] shrink-0">
              <img
                src="/assets/logo-emerald-md.webp"
                alt="GeoSoft 3D Cube Emblem"
                width={96}
                height={96}
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="footer-logo-sweep" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase text-[#A9F8B5] font-bold tracking-wider">
                Propuesta de Desarrollo & Software
              </span>
              <h1 className="font-display font-extrabold text-white text-xl sm:text-2xl mt-1">
                {quote.projectName}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Cliente: <strong className="text-white">{quote.clientName}</strong> {quote.clientCompany ? `(${quote.clientCompany})` : ''}
              </p>
            </div>

            <div className="text-center sm:text-right text-xs text-gray-400 shrink-0">
              <span className="block font-mono text-[11px] text-gray-500 uppercase">Validez</span>
              <span className="font-bold text-white">{quote.validUntilDays} días desde {quote.date}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#A9F8B5]" /> Emisión: {quote.date}</span>
            <span className="flex items-center gap-1.5 text-emerald-300"><Sparkles className="w-3.5 h-3.5 text-[#DFF494]" /> Moneda activa: {activeCurrency === 'CRC' ? 'Colones Costarricenses (₡)' : 'Dólares Estadounidenses ($)'}</span>
          </div>
        </div>

        {/* Deliverables / Items Breakdown */}
        <div className="card-accent p-6 border-white/10 space-y-4">
          <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A9F8B5]" />
            <span>Módulos & Entregables Incluidos</span>
          </h3>
          <div className="divide-y divide-white/5 space-y-1">
            {quote.items.map((it, idx) => {
              const convertedPrice = convertAmount(it.unitPrice);
              return (
                <div key={it.id} className="pt-3 pb-2 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-gray-300 text-[11px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{it.name}</h4>
                      <p className="text-[11px] text-gray-400">{it.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-[#A9F8B5]">{sym}{(convertedPrice * it.quantity).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2 Payment Modes (Interactive Selection) */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-white text-sm px-1">Selecciona la Modalidad de Pago que Prefieres:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode 1 Card */}
            <div
              onClick={() => setSelectedMode('initial_plus_monthly')}
              className={`card-accent p-5 border-white/10 cursor-pointer transition-all space-y-3 ${
                selectedMode === 'initial_plus_monthly'
                  ? 'ring-2 ring-[#A9F8B5] bg-emerald-950/30'
                  : 'hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#A9F8B5]" />
                  <span className="text-xs font-bold text-white">Modalidad 1: Inicial + Mensual</span>
                </div>
                {selectedMode === 'initial_plus_monthly' && (
                  <CheckCircle2 className="w-4 h-4 text-[#A9F8B5]" />
                )}
              </div>
              <div className="text-lg font-mono font-extrabold text-white">
                {sym}{initialPayment.toLocaleString()} <span className="text-xs font-sans text-gray-400 font-normal">inicial</span> + {sym}{monthlyMode1.toLocaleString()}/mes
              </div>
              <p className="text-[11px] text-gray-400">{quote.modeInitialPlusMonthly.description}</p>
            </div>

            {/* Mode 2 Card */}
            <div
              onClick={() => setSelectedMode('only_monthly')}
              className={`card-accent p-5 border-white/10 cursor-pointer transition-all space-y-3 ${
                selectedMode === 'only_monthly'
                  ? 'ring-2 ring-[#DFF494] bg-amber-950/30'
                  : 'hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Repeat className="w-4 h-4 text-[#DFF494]" />
                  <span className="text-xs font-bold text-white">Modalidad 2: Solo Mensual ($0 Inicial)</span>
                </div>
                {selectedMode === 'only_monthly' && (
                  <CheckCircle2 className="w-4 h-4 text-[#DFF494]" />
                )}
              </div>
              <div className="text-lg font-mono font-extrabold text-white">
                {sym}0 inicial + {sym}{monthlyMode2.toLocaleString()}/mes
              </div>
              <p className="text-[11px] text-gray-400">{quote.modeOnlyMonthly.description}</p>
            </div>
          </div>
        </div>

        {/* Terms & CTA Button */}
        <div className="card-accent p-6 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400 space-y-1">
            <span className="text-white font-semibold block">Garantía & Soporte GeoSoft:</span>
            <p className="text-[11px]">{quote.notes}</p>
          </div>
          <button
            type="button"
            onClick={handleOpenPopup}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black text-sm font-extrabold flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#A9F8B5]/25 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Aceptar Propuesta Comercial</span>
          </button>
        </div>

        {/* Parte Inferior: Logo de Letras Animadas de GeoSoft */}
        <div className="pt-8 pb-4 flex flex-col items-center justify-center gap-2 text-center">
          <div className="font-display font-black text-2xl sm:text-3xl tracking-widest footer-brand-title">
            <span className="footer-brand-geo">GEO</span><span className="footer-brand-soft">SOFT</span>
          </div>
          <div className="text-xs sm:text-sm font-bold tracking-widest uppercase animate-copyright-sweep">
            Consultancy & Engineering
          </div>
          <p className="text-[11px] text-gray-500 font-mono mt-1">
            Desarrollo de Software, Webs e Inteligencia Artificial de Alto Rendimiento • Costa Rica
          </p>
        </div>
      </div>

      {/* Pop-up for Name input & Confirmation */}
      {isPopupOpen && (
        <ClientAcceptancePopup
          quote={quote}
          selectedMode={selectedMode}
          activeCurrency={activeCurrency}
          convertedInitial={initialPayment}
          convertedMonthly={selectedMode === 'initial_plus_monthly' ? monthlyMode1 : monthlyMode2}
          onClose={() => setIsPopupOpen(false)}
          onConfirmAcceptance={handleConfirm}
        />
      )}
    </div>
  );
};
