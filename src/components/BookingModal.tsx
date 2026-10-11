import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare, Sparkles, CheckCircle2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGeoSoftStore } from '../context/StoreContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { addAppointment } = useGeoSoftStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [service, setService] = useState('Web con Agente de IA 24/7');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !whatsapp || !date) return;

    addAppointment({
      fullName,
      email,
      whatsapp,
      service,
      date,
      time,
      notes
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setNotes('');
    onClose();
  };

  const getWhatsAppConfirmationUrl = () => {
    const text = encodeURIComponent(
      `¡Hola GeoSoft! Acabo de agendar una cita en geosoftweb.pages.dev:\n\n*Nombre:* ${fullName}\n*Servicio:* ${service}\n*Fecha:* ${date} a las ${time}\n*WhatsApp:* ${whatsapp}\n\n¿Me confirman la disponibilidad?`
    );
    return `https://wa.me/50689999999?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 select-none">
      <div className="relative w-full max-w-lg bg-[#121316] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 overflow-hidden my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Compacto */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-[#16181b] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm sm:text-base leading-tight">
                Agendar Cita Estratégica
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Coordinación directa con los ingenieros de GeoSoft</p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body Compacto (Sin Scroll) */}
        <div
          className="p-3.5 sm:p-4 md:p-5 flex-grow overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              {/* Row 1: Nombre & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1 mb-1">
                    <User className="w-3 h-3 text-[#A9F8B5]" />
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Rodríguez"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1 mb-1">
                    <Mail className="w-3 h-3 text-[#A9F8B5]" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@empresa.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: WhatsApp & Servicio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1 mb-1">
                    <Phone className="w-3 h-3 text-[#A9F8B5]" />
                    Teléfono WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+506 8888-8888"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-[#DFF494]" />
                    Servicio de Interés
                  </label>
                  <select
                    value={service}
                    onChange={e => setService(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#DFF494] text-white text-xs outline-none transition-colors"
                  >
                    <option value="Web con Agente de IA 24/7">Web con Agente de IA 24/7</option>
                    <option value="Sistema de Reservas & Cobros">Sistema de Reservas & Cobros</option>
                    <option value="Plataforma SaaS & Software a Medida">Plataforma SaaS a Medida</option>
                    <option value="Web Estática / Landing Page">Web Estática / Landing Page</option>
                    <option value="Web Dinámica / Catálogo">Web Dinámica / Catálogo</option>
                    <option value="Auditoría SEO & Posicionamiento">Auditoría SEO & Posicionamiento</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Fecha & Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-[#A9F8B5]" />
                    Fecha Preferida *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-[#DFF494]" />
                    Hora Preferida
                  </label>
                  <select
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#DFF494] text-white text-xs outline-none transition-colors"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Notas Breves */}
              <div>
                <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3 h-3 text-gray-400" />
                  Cuéntanos brevemente sobre tu proyecto (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="¿Cuál es el objetivo o problema que deseas resolver?"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors resize-none"
                />
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                className="w-full btn-primary-gradient py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg mt-1"
              >
                Confirmar y Agendar Cita
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#A9F8B5]/20 border border-[#A9F8B5]/40 flex items-center justify-center text-[#A9F8B5] mx-auto animate-bounce">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg sm:text-xl font-bold font-display text-white">
                  ¡Cita Agendada Exitosamente!
                </h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto">
                  Gracias, <strong className="text-white">{fullName}</strong>. Hemos registrado tu cita para el <strong className="text-[#A9F8B5]">{date} a las {time}</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left text-xs space-y-1">
                <div className="text-white"><strong>Servicio:</strong> {service}</div>
                <div className="text-white"><strong>WhatsApp:</strong> {whatsapp}</div>
                <div className="text-white"><strong>Correo:</strong> {email}</div>
              </div>

              <div className="flex gap-2.5 justify-center pt-1">
                <a
                  href={getWhatsAppConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Notificar por WhatsApp</span>
                </a>

                <button
                  onClick={resetAndClose}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
