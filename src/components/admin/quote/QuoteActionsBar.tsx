import React, { useState } from 'react';
import { Send, Copy, Check, Printer, RotateCcw, FileText } from 'lucide-react';
import { ProjectQuoteData } from '../../../types/projectQuote';
import { soundEffects } from '../../../services/soundEffects';

interface QuoteActionsBarProps {
  quote: ProjectQuoteData;
  onUpdateNotes: (notes: string) => void;
  onReset: () => void;
  getWhatsAppEncoded: () => string;
}

export const QuoteActionsBar: React.FC<QuoteActionsBarProps> = ({
  quote,
  onUpdateNotes,
  onReset,
  getWhatsAppEncoded
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    try {
      soundEffects.playClick();
    } catch {}
    const decoded = decodeURIComponent(getWhatsAppEncoded());
    navigator.clipboard.writeText(decoded);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    try {
      soundEffects.playClick();
    } catch {}
    const text = getWhatsAppEncoded();
    const cleanPhone = (quote.clientWhatsapp || '').replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    try {
      soundEffects.playClick();
    } catch {}
    window.print();
  };

  return (
    <div className="card-accent p-6 border-white/10 space-y-4">
      {/* Terms & Notes Input */}
      <div>
        <label className="text-xs font-mono uppercase text-gray-400 block mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#A9F8B5]" />
          <span>Términos, Garantías y Condiciones Comerciales</span>
        </label>
        <textarea
          rows={2}
          value={quote.notes}
          onChange={e => onUpdateNotes(e.target.value)}
          placeholder="Ej: Incluye despliegue en Cloudflare Pages, SSL de por vida, soporte 24/7 y tiempo de entrega de 3 semanas."
          className="w-full bg-black/40 border border-white/10 focus:border-[#A9F8B5] rounded-xl p-3 text-xs text-white placeholder:text-gray-600 outline-none resize-none"
        />
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Borrador</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            title="Imprimir o Guardar en PDF"
          >
            <Printer className="w-3.5 h-3.5 text-gray-300" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#A9F8B5]" />
                <span>Copiar Propuesta</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black text-xs font-extrabold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-[#A9F8B5]/20"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Enviar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
