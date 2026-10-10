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
      particleCount: 90,
      spread: 70,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121316] rounded-3xl shadow-2xl border border-white/15 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#16181b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base md:text-lg">
                Agendar Cita Estratégica
              </h3>
              <p className="text-xs text-gray-400">Coordinación directa con los ingenieros de GeoSoft.</p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#A9F8B5]" />
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Rodríguez"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-sm outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#A9F8B5]" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@empresa.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#A9F8B5]" />
                    Teléfono WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+506 8888-8888"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-sm outline-none transition-colors"
                  />
                </div>

                {/* Service of Interest */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#DFF494]" />
                    Servicio de Interés
                  </label>
                  <select
                    value={service}
                    onChange={e => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#DFF494] text-white text-sm outline-none transition-colors"
                  >
                    <option value="Web con Agente de IA 24/7">Web con Agente de IA 24/7</option>
                    <option value="Sistema de Reservas & Cobros">Sistema de Reservas & Cobros</option>
                    <option value="Plataforma SaaS & Software a Medida">Plataforma SaaS & Software a Medida</option>
                    <option value="Web Estática / Landing Page">Web Estática / Landing Page</option>
                    <option value="Web Dinámica / Catálogo">Web Dinámica / Catálogo</option>
                    <option value="Auditoría SEO & Posicionamiento">Auditoría SEO & Posicionamiento</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#A9F8B5]" />
                    Fecha Preferida *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-sm outline-none transition-colors"
                  />
                </div>

                {/* Time Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#DFF494]" />
                    Hora Preferida
                  </label>
                  <select
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#DFF494] text-white text-sm outline-none transition-colors"
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

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  Cuéntanos brevemente sobre tu proyecto (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="¿Cuál es el objetivo principal o problema que deseas resolver?"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#090a0c] border border-white/10 focus:border-[#A9F8B5] text-white text-sm outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary-gradient py-4 text-sm font-bold uppercase tracking-wider cursor-pointer"
              >
                Confirmar y Agendar Cita
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#A9F8B5]/20 border border-[#A9F8B5]/40 flex items-center justify-center text-[#A9F8B5] mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-bold font-display text-white">
                  ¡Cita Agendada Exitosamente!
                </h4>
                <p className="text-sm text-gray-300 max-w-md mx-auto">
                  Gracias, <strong className="text-white">{fullName}</strong>. Hemos registrado tu cita para el <strong className="text-[#A9F8B5]">{date} a las {time}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="text-gray-400">Detalles de la reunión:</div>
                <div className="text-white"><strong>Servicio:</strong> {service}</div>
                <div className="text-white"><strong>WhatsApp:</strong> {whatsapp}</div>
                <div className="text-white"><strong>Correo:</strong> {email}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={getWhatsAppConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Notificar por WhatsApp</span>
                </a>

                <button
                  onClick={resetAndClose}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
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
