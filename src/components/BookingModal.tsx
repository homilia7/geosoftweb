import React, { useState, useEffect, useRef } from 'react';
import {
  X, Calendar, Clock, User, Mail, Phone, Sparkles, CheckCircle2,
  ArrowRight, ArrowLeft, Send, AlertCircle, MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGeoSoftStore } from '../context/StoreContext';
import { api } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { addAppointment } = useGeoSoftStore();

  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  // Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Web con Agente de IA 24/7');
  const [notes, setNotes] = useState('');

  // Availability checking state
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{ available: boolean; suggestedTime?: string } | null>(null);

  // Submission state
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Auto focus on step change
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [step, isOpen]);

  // Set default date to tomorrow if empty
  useEffect(() => {
    if (!date && isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => {
    setDirection('next');
    setStep(prev => Math.min(prev + 1, 8));
  };

  const prevStep = () => {
    setDirection('prev');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleTimeSelected = async (selectedTime: string) => {
    setTime(selectedTime);
    setIsChecking(true);
    setAvailabilityResult(null);

    // Consulta de disponibilidad real en Cloudflare D1
    const check = await api.checkAvailability(date, selectedTime);

    // Breve pausa para lucir la micro-interacción con el logo de GeoSoft (1.1s)
    setTimeout(() => {
      setIsChecking(false);
      setAvailabilityResult(check);

      if (check.available) {
        // Horario disponible: avanzar al paso 3 automáticamente
        setTimeout(() => {
          setAvailabilityResult(null);
          nextStep();
        }, 750);
      }
    }, 1100);
  };

  const handleAcceptSuggestedTime = (suggested: string) => {
    setTime(suggested);
    setAvailabilityResult(null);
    nextStep();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addAppointment({
        fullName,
        email,
        whatsapp,
        service,
        date,
        time,
        notes
      });

      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.6 }
      });

      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setDirection('next');
    setSubmitted(false);
    setIsChecking(false);
    setAvailabilityResult(null);
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setNotes('');
    onClose();
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `¡Hola GeoSoft! Acabo de agendar una cita interactiva en geosoftweb.pages.dev:\n\n*Nombre:* ${fullName}\n*Servicio:* ${service}\n*Fecha:* ${date} a las ${time}\n*WhatsApp:* ${whatsapp}\n\n¿Me confirman la disponibilidad en vivo?`
    );
    return `https://wa.me/50689999999?text=${text}`;
  };

  const servicesList = [
    { title: 'Web con Agente de IA 24/7', desc: 'Ventas y cierres automáticos', icon: '🤖' },
    { title: 'Sistema de Reservas & Cobros', desc: 'Sincronización Sinpe/Stripe', icon: '📅' },
    { title: 'Plataforma SaaS a Medida', desc: 'Arquitectura escalable en la nube', icon: '⚡' },
    { title: 'Landing Page de Alto Impacto', desc: 'Conversión máxima y velocidad', icon: '🌐' },
    { title: 'Automatizaciones & APIs', desc: 'Integración CRM y WhatsApp Cloud', icon: '🛠️' },
  ];

  const standardTimes = ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM', '06:00 PM'];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none">
      <div className="relative w-full max-w-lg bg-[#111317] rounded-3xl shadow-2xl border border-white/15 overflow-hidden my-auto flex flex-col h-[510px] max-h-[92vh] animate-message-soft">
        
        {/* Barra de Progreso Superior */}
        <div className="h-1.5 w-full bg-white/5 relative overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] transition-all duration-300 ease-out"
            style={{ width: submitted ? '100%' : `${(step / 8) * 100}%` }}
          />
        </div>

        {/* Header con Navegación Atrás / Cerrar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#15171b] shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && !submitted && (
              <button
                onClick={prevStep}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Atrás</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A9F8B5] animate-pulse" />
              <span className="text-[11px] font-mono text-[#DFF494]">
                {submitted ? 'Cita Confirmada' : `Paso ${step} de 8`}
              </span>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body Animado */}
        <div className="p-5 flex-1 flex flex-col justify-center relative overflow-hidden">
          
          {/* ================= PANTALLA DE CONFIRMACIÓN ================= */}
          {submitted ? (
            <div className="text-center space-y-4 animate-step-next my-auto">
              <div className="w-14 h-14 rounded-full bg-[#A9F8B5]/20 border border-[#A9F8B5]/50 text-[#A9F8B5] flex items-center justify-center mx-auto shadow-lg shadow-[#A9F8B5]/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-display text-white">¡Cita Registrada con Éxito!</h3>
                <p className="text-xs text-gray-300 mt-1 max-w-sm mx-auto">
                  Hemos guardado tu sesión para el <strong className="text-white">{date}</strong> a las <strong className="text-[#A9F8B5]">{time}</strong>. Te contactaremos por WhatsApp.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir Confirmación en WhatsApp
                </a>
                <button
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Finalizar
                </button>
              </div>
            </div>
          ) : (
            <div
              key={step}
              className={`flex-1 flex flex-col justify-center ${
                direction === 'next' ? 'animate-step-next' : 'animate-step-prev'
              }`}
            >
              
              {/* ================= PASO 1: DÍA ================= */}
              {step === 1 && (
                <div className="space-y-4 my-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A9F8B5] font-semibold">Paso 1</span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                      ¿Qué día quieres agendar tu cita?
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Elige una fecha conveniente para coordinar tu sesión estratégica.
                    </p>
                  </div>

                  {/* Acceso rápido a días */}
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDate(todayStr)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        date === todayStr
                          ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] text-[#A9F8B5]'
                          : 'bg-[#181a1f] border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      Hoy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const tom = new Date();
                        tom.setDate(tom.getDate() + 1);
                        setDate(tom.toISOString().split('T')[0]);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#181a1f] border border-white/10 text-gray-300 hover:border-white/20 text-xs font-medium transition-all"
                    >
                      Mañana
                    </button>
                  </div>

                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#A9F8B5] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && date) nextStep(); }}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#181a1f] border border-white/15 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors"
                    />
                  </div>

                  <button
                    disabled={!date}
                    onClick={nextStep}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#A9F8B5]/20 hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Continuar a la Hora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 2: HORA & COMPROBACIÓN ================= */}
              {step === 2 && (
                <div className="space-y-4 my-auto">
                  {isChecking ? (
                    /* ANIMACIÓN DEL LOGO GEOSOFT COMPROBANDO DISPONIBILIDAD */
                    <div className="text-center py-6 space-y-4 animate-message-soft">
                      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-2xl bg-[#A9F8B5]/20 blur-xl animate-pulse" />
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#A9F8B5] shadow-[0_0_25px_rgba(169,248,181,0.6)] bg-black animate-logo-check flex items-center justify-center">
                          <img
                            src="/assets/logo-gold.jpeg"
                            alt="GeoSoft"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#A9F8B5] animate-ping" />
                          Comprobando disponibilidad...
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-1">
                          Verificando agenda en vivo para el {date} a las {time}
                        </p>
                      </div>
                    </div>
                  ) : availabilityResult && !availabilityResult.available ? (
                    /* HORA OCUPADA -> SUGERENCIA */
                    <div className="space-y-3.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center animate-message-soft">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-300">Horario no disponible</h4>
                        <p className="text-xs text-gray-300 mt-1">
                          La hora <strong className="text-white">{time}</strong> ya está reservada.
                        </p>
                      </div>

                      {availabilityResult.suggestedTime && (
                        <div className="pt-2">
                          <p className="text-[11px] text-gray-400 mb-2">Te sugerimos la siguiente hora libre:</p>
                          <button
                            onClick={() => handleAcceptSuggestedTime(availabilityResult.suggestedTime!)}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-102 transition-transform cursor-pointer"
                          >
                            <span>Aceptar {availabilityResult.suggestedTime}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => setAvailabilityResult(null)}
                        className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
                      >
                        Elegir otra hora manualmente
                      </button>
                    </div>
                  ) : availabilityResult && availabilityResult.available ? (
                    /* HORA DISPONIBLE */
                    <div className="text-center py-6 space-y-3 animate-message-soft">
                      <div className="w-12 h-12 rounded-full bg-[#A9F8B5]/20 border border-[#A9F8B5] text-[#A9F8B5] flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">¡Horario 100% Disponible!</h4>
                      <p className="text-xs text-gray-400">Avanzando a tus datos personales...</p>
                    </div>
                  ) : (
                    /* SELECCIÓN DE HORA */
                    <>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#A9F8B5] font-semibold">Paso 2</span>
                        <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                          ¿A qué hora te parece bien tu cita?
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Escoge una franja horaria sugerida o ingresa tu horario predilecto.
                        </p>
                      </div>

                      {/* Botones de horas estándar */}
                      <div className="grid grid-cols-3 gap-2">
                        {standardTimes.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleTimeSelected(t)}
                            className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                              time === t
                                ? 'bg-[#A9F8B5]/20 border-[#A9F8B5] text-[#A9F8B5] shadow-sm'
                                : 'bg-[#181a1f] border-white/10 text-gray-300 hover:border-white/30'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => handleTimeSelected(time)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#A9F8B5]/20 hover:opacity-95 transition-all cursor-pointer active:scale-98"
                        >
                          <span>Comprobar {time}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ================= PASO 3: NOMBRE ================= */}
              {step === 3 && (
                <div className="space-y-4 my-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A9F8B5] font-semibold">Paso 3</span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                      ¿Cuál es tu nombre?
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Indícanos tu nombre completo para personalizar tu sesión.
                    </p>
                  </div>

                  <div className="relative">
                    <User className="w-4 h-4 text-[#A9F8B5] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="text"
                      placeholder="Ej. Carlos Rodríguez"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && fullName.trim()) nextStep(); }}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#181a1f] border border-white/15 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors"
                    />
                  </div>

                  <button
                    disabled={!fullName.trim()}
                    onClick={nextStep}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#A9F8B5]/20 hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Continuar al Teléfono</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 4: TELÉFONO / WHATSAPP ================= */}
              {step === 4 && (
                <div className="space-y-4 my-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A9F8B5] font-semibold">Paso 4</span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                      ¿Cuál es tu número de teléfono?
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Te enviaremos los accesos de la reunión y el recordatorio por WhatsApp.
                    </p>
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#A9F8B5] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="tel"
                      placeholder="+506 8888-8888"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && whatsapp.trim()) nextStep(); }}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#181a1f] border border-white/15 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors"
                    />
                  </div>

                  <button
                    disabled={!whatsapp.trim()}
                    onClick={nextStep}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#A9F8B5]/20 hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Continuar al Correo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 5: CORREO ================= */}
              {step === 5 && (
                <div className="space-y-4 my-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A9F8B5] font-semibold">Paso 5</span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                      ¿Cuál es tu correo electrónico?
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Para enviarte el enlace de Google Meet y el resumen técnico.
                    </p>
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A9F8B5] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="email"
                      placeholder="carlos@empresa.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && email.includes('@')) nextStep(); }}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#181a1f] border border-white/15 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors"
                    />
                  </div>

                  <button
                    disabled={!email.includes('@')}
                    onClick={nextStep}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#A9F8B5]/20 hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Continuar a Servicios</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 6: SERVICIO DE INTERÉS ================= */}
              {step === 6 && (
                <div className="space-y-3.5 my-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A9F8B5] font-semibold">Paso 6</span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                      Servicio de Interés
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Selecciona la solución principal que deseas implementar.
                    </p>
                  </div>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
                    {servicesList.map(s => (
                      <div
                        key={s.title}
                        onClick={() => {
                          setService(s.title);
                          nextStep();
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                          service === s.title
                            ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] shadow-sm'
                            : 'bg-[#181a1f] border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{s.icon}</span>
                          <div>
                            <div className="text-xs font-semibold text-white">{s.title}</div>
                            <div className="text-[10.5px] text-gray-400">{s.desc}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= PASO 7: CUÉNTANOS BREVEMENTE ================= */}
              {step === 7 && (
                <div className="space-y-4 my-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A9F8B5] font-semibold">Paso 7</span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                      Cuéntanos brevemente sobre tu proyecto
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      ¿Cuál es tu objetivo o principal reto actual? (Opcional)
                    </p>
                  </div>

                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    rows={3}
                    placeholder="Ej. Buscamos automatizar citas y cobros con Sinpe y un agente de IA..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#181a1f] border border-white/15 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors resize-none"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      Omitir
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#A9F8B5]/20 hover:opacity-95 transition-all cursor-pointer active:scale-98"
                    >
                      <span>Ver Resumen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= PASO 8: RESUMEN DE TU CITA ================= */}
              {step === 8 && (
                <div className="space-y-3.5 my-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A9F8B5] font-semibold">Paso 8</span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                      Resumen de tu Cita
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Revisa tu información y confirma para reservar tu espacio.
                    </p>
                  </div>

                  {/* Tarjeta de Resumen Compacta */}
                  <div className="p-3.5 rounded-2xl bg-[#16181d] border border-white/15 space-y-2 text-xs shadow-inner">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5 text-[#A9F8B5] font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{date}</span>
                        <span className="text-gray-400 mx-1">•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{time}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#A9F8B5]/15 text-[#A9F8B5] text-[9.5px] font-semibold">
                        Confirmado
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Nombre:</span>
                        <span className="text-white font-medium truncate block">{fullName || 'No especificado'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">WhatsApp:</span>
                        <span className="text-white font-medium truncate block">{whatsapp || 'No especificado'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Correo:</span>
                        <span className="text-white font-medium truncate block">{email || 'No especificado'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Servicio:</span>
                        <span className="text-[#DFF494] font-medium truncate block">{service}</span>
                      </div>
                    </div>

                    {notes && (
                      <div className="pt-1.5 border-t border-white/10 text-[10.5px]">
                        <span className="text-gray-400">Proyecto:</span>
                        <p className="text-gray-300 italic truncate">{notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Botón de Confirmación Principal */}
                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#A9F8B5]/25 hover:opacity-95 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Guardando cita...' : 'Confirmar Cita y Enviar 🚀'}</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
