import React, { useState } from 'react';
import { Building2, Calendar, DollarSign, FileSpreadsheet, Sparkles, User, ArrowLeftRight } from 'lucide-react';
import { ProjectQuoteData } from '../../../types/projectQuote';

interface QuoteHeaderProps {
  quote: ProjectQuoteData;
  updateField: <K extends keyof ProjectQuoteData>(key: K, value: ProjectQuoteData[K]) => void;
  onSwitchCurrency: (currency: 'USD' | 'CRC', autoConvert: boolean) => void;
}

export const QuoteHeader: React.FC<QuoteHeaderProps> = ({ quote, updateField, onSwitchCurrency }) => {
  const [autoConvert, setAutoConvert] = useState(true);

  return (
    <div className="card-accent p-6 lg:p-7 border-white/10 space-y-6">
      {/* Top Branding Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-extrabold flex items-center justify-center text-lg shadow-[0_0_25px_rgba(169,248,181,0.25)] shrink-0">
            GS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-white text-lg tracking-wide">GEOSOFT</span>
              <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/30 px-2 py-0.5 rounded-full font-mono uppercase font-semibold">
                Cotizador Oficial
              </span>
            </div>
            <p className="text-xs text-gray-400">Consultancy & Software Engineering • Propuesta Comercial</p>
          </div>
        </div>

        {/* Currency Switcher & Exchange Rate */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Currency Toggle */}
          <div className="flex items-center bg-black/60 border border-white/15 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => onSwitchCurrency('USD', autoConvert)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                quote.currency === 'USD'
                  ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>$ Dólares (USD)</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchCurrency('CRC', autoConvert)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                quote.currency === 'CRC'
                  ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>₡ Colones (CRC)</span>
            </button>
          </div>

          {/* Exchange rate input */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-[10px] text-gray-400 font-mono mr-1.5">TC: ₡</span>
            <input
              type="number"
              min={100}
              max={1000}
              step={5}
              value={quote.exchangeRate || 520}
              onChange={e => updateField('exchangeRate', Number(e.target.value) || 520)}
              className="w-12 bg-transparent text-white font-mono font-bold outline-none text-right"
              title="Tipo de cambio colones por dólar"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-right hidden sm:block">
            <div className="text-[9px] font-mono text-gray-500 uppercase">Cotización</div>
            <div className="text-xs font-mono font-bold text-white">{quote.id}</div>
          </div>
        </div>
      </div>

      {/* Main Project Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold font-mono uppercase text-[#A9F8B5] flex items-center gap-1.5">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Nombre del Proyecto / Software</span>
        </label>
        <input
          type="text"
          value={quote.projectName}
          onChange={e => updateField('projectName', e.target.value)}
          placeholder="Ej: Desarrollo de Plataforma Web, App Móvil y Agente IA 24/7"
          className="w-full bg-black/50 border border-white/15 focus:border-[#A9F8B5] focus:ring-1 focus:ring-[#A9F8B5] rounded-xl px-4 py-3 text-white text-base font-bold placeholder:text-gray-600 outline-none transition-all"
        />
      </div>

      {/* Client & Date Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        <div>
          <label className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5 mb-1.5">
            <User className="w-3 h-3 text-[#A9F8B5]" />
            <span>Contacto / Cliente</span>
          </label>
          <input
            type="text"
            value={quote.clientName}
            onChange={e => updateField('clientName', e.target.value)}
            placeholder="Nombre completo"
            className="w-full bg-black/40 border border-white/10 focus:border-[#A9F8B5] rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5 mb-1.5">
            <Building2 className="w-3 h-3 text-[#A9F8B5]" />
            <span>Empresa / Negocio</span>
          </label>
          <input
            type="text"
            value={quote.clientCompany}
            onChange={e => updateField('clientCompany', e.target.value)}
            placeholder="Nombre de la empresa"
            className="w-full bg-black/40 border border-white/10 focus:border-[#A9F8B5] rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3 h-3 text-[#A9F8B5]" />
            <span>Fecha de Emisión</span>
          </label>
          <input
            type="date"
            value={quote.date}
            onChange={e => updateField('date', e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-[#A9F8B5] rounded-xl px-3 py-2 text-xs text-white outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3 h-3 text-[#DFF494]" />
            <span>Vigencia (Días)</span>
          </label>
          <input
            type="number"
            min={1}
            max={90}
            value={quote.validUntilDays}
            onChange={e => updateField('validUntilDays', Number(e.target.value) || 15)}
            className="w-full bg-black/40 border border-white/10 focus:border-[#A9F8B5] rounded-xl px-3 py-2 text-xs text-white outline-none"
          />
        </div>
      </div>
    </div>
  );
};
