import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Repeat, Layers, Sparkles, Building2, Calendar, FileText } from 'lucide-react';
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
  const [selectedMode, setSelectedMode] = useState<'initial_plus_monthly' | 'only_monthly'>(
    quote.preferredMode === 'only_monthly' ? 'only_monthly' : 'initial_plus_monthly'
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (!isOpen) return null;

  const sym = quote.currencySymbol;
  const itemsSubtotal = quote.items.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0);

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
        {/* Top Floating Close Bar */}
        <div className="flex items-center justify-between bg-[#0d0f14]/80 border border-white/10 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-extrabold flex items-center justify-center text-xs">
              GS
            </div>
            <div>
              <span className="font-display font-bold text-white text-xs">GeoSoft • Propuesta Oficial</span>
              <span className="text-[10px] text-gray-400 block font-mono">Ref: {quote.id}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Header Card */}
        <div className="card-accent p-6 lg:p-8 border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A9F8B5] font-bold tracking-wider">Propuesta Comercial de Software</span>
              <h1 className="font-display font-extrabold text-white text-xl sm:text-2xl mt-1">{quote.projectName}</h1>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 block">Preparado para:</span>
              <span className="text-sm font-bold text-white">{quote.clientName}</span>
              {quote.clientCompany && <span className="text-xs text-gray-400 block">{quote.clientCompany}</span>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#A9F8B5]" /> Emisión: {quote.date}</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#DFF494]" /> Válida por {quote.validUntilDays} días</span>
          </div>
        </div>

        {/* Deliverables / Items Breakdown */}
        <div className="card-accent p-6 border-white/10 space-y-4">
          <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A9F8B5]" />
            <span>Alcance & Módulos Incluidos</span>
          </h3>
          <div className="divide-y divide-white/5 space-y-1">
            {quote.items.map((it, idx) => (
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
                  <span className="text-xs font-mono font-bold text-[#A9F8B5]">{sym}{(it.unitPrice * it.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
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
                {sym}{quote.modeInitialPlusMonthly.initialPayment.toLocaleString()} <span className="text-xs font-sans text-gray-400 font-normal">inicial</span> + {sym}{quote.modeInitialPlusMonthly.monthlyPayment}/mes
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
                {sym}0 inicial + {sym}{quote.modeOnlyMonthly.monthlyPayment}/mes
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
      </div>

      {/* Pop-up for Name input & Confirmation */}
      {isPopupOpen && (
        <ClientAcceptancePopup
          quote={quote}
          selectedMode={selectedMode}
          onClose={() => setIsPopupOpen(false)}
          onConfirmAcceptance={handleConfirm}
        />
      )}
    </div>
  );
};
