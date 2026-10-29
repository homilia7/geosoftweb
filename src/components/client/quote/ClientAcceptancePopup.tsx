import React, { useState } from 'react';
import { X, CheckCircle2, Send, ShieldCheck, User, Phone, Mail, Sparkles } from 'lucide-react';
import { ProjectQuoteData, QuoteAcceptancePayload } from '../../../types/projectQuote';
import { soundEffects } from '../../../services/soundEffects';

interface ClientAcceptancePopupProps {
  quote: ProjectQuoteData;
  selectedMode: 'initial_plus_monthly' | 'only_monthly';
  onClose: () => void;
  onConfirmAcceptance: (payload: QuoteAcceptancePayload) => Promise<void>;
}

export const ClientAcceptancePopup: React.FC<ClientAcceptancePopupProps> = ({
  quote,
  selectedMode,
  onClose,
  onConfirmAcceptance
}) => {
  const [fullName, setFullName] = useState(quote.clientName !== 'Cliente Corporativo' ? quote.clientName : '');
  const [phone, setPhone] = useState(quote.clientWhatsapp && quote.clientWhatsapp !== '+506 ' ? quote.clientWhatsapp : '');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isMode1 = selectedMode === 'initial_plus_monthly';
  const sym = quote.currencySymbol;
  const initialAmount = isMode1 ? quote.modeInitialPlusMonthly.initialPayment : 0;
  const monthlyAmount = isMode1 ? quote.modeInitialPlusMonthly.monthlyPayment : quote.modeOnlyMonthly.monthlyPayment;
  const modeTitle = isMode1 ? 'Pago Inicial + Mensualidad' : 'Solo Pago Mensual ($0 Inicial)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    try {
      soundEffects.playClick();
    } catch {}
    setIsSubmitting(true);

    const payload: QuoteAcceptancePayload = {
      quoteId: quote.id,
      projectName: quote.projectName,
      clientFullName: fullName.trim(),
      clientPhone: phone.trim(),
      clientEmail: email.trim(),
      selectedMode,
      selectedModeTitle: modeTitle,
      initialAmount,
      monthlyAmount,
      currencySymbol: sym,
      notes: notes.trim(),
      acceptedAt: new Date().toISOString()
    };

    await onConfirmAcceptance(payload);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="tactile-card relative w-full max-w-lg bg-[#0d0f14]/95 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 animate-message-soft">
        {!isSuccess ? (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-extrabold flex items-center justify-center text-xs">
                  GS
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Aceptar Propuesta Comercial</h3>
                  <p className="text-[11px] text-gray-400">{quote.projectName}</p>
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

            {/* Selected Mode Summary */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Modalidad Elegida:</span>
                <span className="text-xs font-bold text-white">{modeTitle}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#A9F8B5]">
                  {sym}{initialAmount > 0 ? `${initialAmount.toLocaleString()} inicial + ` : ''}{sym}{monthlyAmount}/mes
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-[#A9F8B5]" />
                  <span>Nombre Completo *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Tu nombre o el de la persona a cargo"
                  className="w-full bg-black/50 border border-white/15 focus:border-[#A9F8B5] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-[#A9F8B5]" />
                  <span>Teléfono o WhatsApp *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Ej: +506 8888-8888"
                  className="w-full bg-black/50 border border-white/15 focus:border-[#A9F8B5] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>Correo Electrónico (Opcional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  className="w-full bg-black/50 border border-white/15 focus:border-[#A9F8B5] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !fullName.trim() || !phone.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black text-xs font-extrabold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-[#A9F8B5]/20 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? 'Enviando Confirmación...' : 'Confirmar y Enviar Aceptación'}</span>
              </button>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-white text-xl">¡Propuesta Aceptada con Éxito!</h3>
            <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
              El equipo de <strong className="text-white">GeoSoft</strong> ha recibido la confirmación en su panel de administración y se pondrá en contacto contigo de inmediato para iniciar el proyecto.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Entendido / Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
