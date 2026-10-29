import React from 'react';
import { CreditCard, Repeat, Sparkles, Check, ArrowRight } from 'lucide-react';
import { PaymentModeInitialPlusMonthly, PaymentModeOnlyMonthly } from '../../../types/projectQuote';

interface QuotePricingModesProps {
  currencySymbol: string;
  itemsSubtotal: number;
  modeInitial: PaymentModeInitialPlusMonthly;
  modeMonthly: PaymentModeOnlyMonthly;
  preferredMode: 'both' | 'initial_plus_monthly' | 'only_monthly';
  onUpdateInitial: (updates: Partial<PaymentModeInitialPlusMonthly>) => void;
  onUpdateMonthly: (updates: Partial<PaymentModeOnlyMonthly>) => void;
  onSelectPreferred: (mode: 'both' | 'initial_plus_monthly' | 'only_monthly') => void;
  onSyncSubtotal: () => void;
}

export const QuotePricingModes: React.FC<QuotePricingModesProps> = ({
  currencySymbol,
  itemsSubtotal,
  modeInitial,
  modeMonthly,
  preferredMode,
  onUpdateInitial,
  onUpdateMonthly,
  onSelectPreferred,
  onSyncSubtotal
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <span>Modalidades de Pago Flexibles</span>
            <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/30 px-2 py-0.5 rounded-full font-mono uppercase">
              2 Opciones para el Cliente
            </span>
          </h3>
          <p className="text-xs text-gray-400">Define los precios y cuotas para cada alternativa comercial</p>
        </div>

        {/* Mode presentation selector */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => onSelectPreferred('both')}
            className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
              preferredMode === 'both' ? 'bg-white/10 text-white' : 'text-gray-400'
            }`}
          >
            Mostrar Ambas
          </button>
          <button
            type="button"
            onClick={() => onSelectPreferred('initial_plus_monthly')}
            className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
              preferredMode === 'initial_plus_monthly' ? 'bg-[#A9F8B5] text-black font-bold' : 'text-gray-400'
            }`}
          >
            Destacar Opción 1
          </button>
          <button
            type="button"
            onClick={() => onSelectPreferred('only_monthly')}
            className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
              preferredMode === 'only_monthly' ? 'bg-[#DFF494] text-black font-bold' : 'text-gray-400'
            }`}
          >
            Destacar Opción 2
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ======================================================== */}
        {/* MODALIDAD 1: PAGO INICIAL + MENSUALIDAD                  */}
        {/* ======================================================== */}
        <div className={`card-accent p-6 border-white/10 space-y-5 transition-all ${
          preferredMode === 'initial_plus_monthly' ? 'ring-2 ring-[#A9F8B5]/50 bg-emerald-950/20' : ''
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A9F8B5] font-bold">Modalidad 1</span>
                <h4 className="font-display font-bold text-white text-base">Pago Inicial + Mensualidad</h4>
              </div>
            </div>
            <button
              type="button"
              onClick={onSyncSubtotal}
              className="text-[10px] font-mono text-gray-400 hover:text-[#A9F8B5] bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded-lg transition-all cursor-pointer"
              title="Copiar subtotal de ítems como pago inicial"
            >
              Usar Subtotal ({currencySymbol}{itemsSubtotal.toLocaleString()})
            </button>
          </div>

          {/* Pricing Inputs */}
          <div className="grid grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-white/10">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Pago Inicial</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-mono">{currencySymbol}</span>
                <input
                  type="number"
                  min={0}
                  step={25}
                  value={modeInitial.initialPayment}
                  onChange={e => onUpdateInitial({ initialPayment: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#A9F8B5] rounded-xl pl-7 pr-3 py-2 text-sm font-bold text-white font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Mantenimiento Mensual</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-mono">{currencySymbol}</span>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={modeInitial.monthlyPayment}
                  onChange={e => onUpdateInitial({ monthlyPayment: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#A9F8B5] rounded-xl pl-7 pr-3 py-2 text-sm font-bold text-[#A9F8B5] font-mono outline-none"
                />
              </div>
            </div>
          </div>

          {/* Badge & Description */}
          <div className="space-y-2">
            <input
              type="text"
              value={modeInitial.badgeText}
              onChange={e => onUpdateInitial({ badgeText: e.target.value })}
              placeholder="Etiqueta distintiva (ej. Menor cuota mensual)"
              className="w-full bg-white/5 border border-white/10 focus:border-[#A9F8B5] rounded-lg px-3 py-1.5 text-xs text-[#A9F8B5] outline-none font-medium"
            />
            <input
              type="text"
              value={modeInitial.description}
              onChange={e => onUpdateInitial({ description: e.target.value })}
              placeholder="Descripción comercial para el cliente"
              className="w-full bg-white/5 border border-white/10 focus:border-[#A9F8B5] rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODALIDAD 2: SOLO PAGO MENSUAL ($0 INICIAL)              */}
        {/* ======================================================== */}
        <div className={`card-accent p-6 border-white/10 space-y-5 transition-all ${
          preferredMode === 'only_monthly' ? 'ring-2 ring-[#DFF494]/50 bg-amber-950/20' : ''
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DFF494]/15 border border-[#DFF494]/30 flex items-center justify-center text-[#DFF494]">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#DFF494] font-bold">Modalidad 2</span>
                <h4 className="font-display font-bold text-white text-base">Solo Pago Mensual (Suscripción)</h4>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              $0 INICIAL
            </span>
          </div>

          {/* Pricing Inputs */}
          <div className="grid grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-white/10">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Pago Inicial</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-gray-400 font-mono">
                {currencySymbol}0.00
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Cuota Todo Incluido</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-mono">{currencySymbol}</span>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={modeMonthly.monthlyPayment}
                  onChange={e => onUpdateMonthly({ monthlyPayment: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#DFF494] rounded-xl pl-7 pr-3 py-2 text-sm font-bold text-[#DFF494] font-mono outline-none"
                />
              </div>
            </div>
          </div>

          {/* Badge & Description */}
          <div className="space-y-2">
            <input
              type="text"
              value={modeMonthly.badgeText}
              onChange={e => onUpdateMonthly({ badgeText: e.target.value })}
              placeholder="Etiqueta distintiva (ej. Sin desembolso inicial)"
              className="w-full bg-white/5 border border-white/10 focus:border-[#DFF494] rounded-lg px-3 py-1.5 text-xs text-[#DFF494] outline-none font-medium"
            />
            <input
              type="text"
              value={modeMonthly.description}
              onChange={e => onUpdateMonthly({ description: e.target.value })}
              placeholder="Descripción comercial para el cliente"
              className="w-full bg-white/5 border border-white/10 focus:border-[#DFF494] rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
