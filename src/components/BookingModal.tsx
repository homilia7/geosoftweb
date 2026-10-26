import React, { useState, useEffect, useRef } from 'react';
import {
  X, Calendar, Clock, User, Mail, Phone, CheckCircle2,
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
  const { addAppointment, theme } = useGeoSoftStore();
  const isLight = theme === 'light';

  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isClosing, setIsClosing] = useState(false);

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
      const result = await api.bookAppointment({
        fullName,
        email,
        whatsapp,
        service,
        date,
        time,
        notes,
      });

      addAppointment(result);
      setSubmitted(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: isLight ? ['#237299', '#3188af', '#e5a93b'] : ['#A9F8B5', '#DFF494', '#C1A35B'],
        });
      } catch {}
    } catch {
      alert('Hubo un inconveniente al guardar tu cita. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      resetAndClose();
      setIsClosing(false);
    }, 460);
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing]);

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

  // Helper para el título dinámico superior según el paso
  const getStepHeroTitle = () => {
    if (submitted) return '¡Cita Confirmada!';
    switch (step) {
      case 1:
        return '¿Qué día prefieres?';
      case 2:
        return '¿A qué hora te conviene?';
      case 3:
        return '¿Cuál es tu nombre?';
      case 4:
        return '¿Cuál es tu WhatsApp?';
      case 5:
        return '¿Cuál es tu correo?';
      case 6:
        return 'Servicio de Interés';
      case 7:
        return 'Sobre tu Proyecto';
      case 8:
        return 'Resumen de tu Cita';
      default:
        return 'Reserva Tu Cita';
    }
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 select-none ${
        isLight ? 'bg-slate-900/35 backdrop-blur-xl' : 'bg-black/85 backdrop-blur-xl'
      } ${isClosing ? 'animate-backdrop-leave' : 'animate-backdrop-fade'}`}
    >
      {/* Ventana de Cristal 3D Estilo Burbuja de Agua (Water Bubble Glass Window) */}
      <div
        onClick={e => e.stopPropagation()}
        data-theme={theme}
        className={`islamic-glass-card relative w-full max-w-lg rounded-[34px] sm:rounded-[38px] overflow-hidden my-auto flex flex-col min-h-[500px] max-h-[92dvh] ${
          isClosing ? 'animate-modal-leave' : 'animate-modal-drop'
        }`}
      >
        {/* Reflejo Especular Diagonal de Ventana de Cristal (Window Sheen) */}
        <div className="water-window-sheen" />

        {/* Línea de Progreso de Cristal Sutil y Limpia */}
        <div className="h-[2px] w-full bg-black/5 dark:bg-white/5 relative overflow-hidden shrink-0 z-10">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isLight
                ? 'bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-500'
                : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B]'
            }`}
            style={{ width: submitted ? '100%' : `${(step / 8) * 100}%` }}
          />
        </div>

        {/* ================= SECCIÓN SUPERIOR: BOTONES NAV + INSIGNIA + TÍTULO HERO ================= */}
        <div className="relative pt-6 pb-2 px-6 sm:px-8 text-center shrink-0 z-10">
          {/* Botón Atrás (Flotante Esquina Superior Izquierda con Menisco de Agua) */}
          {step > 1 && !submitted && (
            <button
              onClick={prevStep}
              className="water-bubble-orb absolute left-5 top-5 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full z-20"
              title="Volver al paso anterior"
              aria-label="Atrás"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Botón Cerrar (Flotante Esquina Superior Derecha con Menisco de Agua) */}
          <button
            onClick={handleClose}
            className="water-bubble-orb absolute right-5 top-5 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full z-20"
            title="Cerrar ventana"
            aria-label="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Insignia Burbuja de Agua Superior ("AGENDAR CITA") */}
          <div className="inline-flex items-center justify-center">
            <span className="water-bubble-mini-badge px-4 py-1 text-[10.5px] font-bold tracking-wider uppercase">
              {submitted ? 'Cita Confirmada' : 'Agendar Cita'}
            </span>
          </div>

          {/* Título Hero con Tipografía Distintiva */}
          <h2
            className={`font-display text-2xl sm:text-3xl font-bold tracking-tight mt-2.5 transition-colors ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {getStepHeroTitle()}
          </h2>

          {/* Subtítulo Limpio y Elegante acorde al tema (Reemplazo Liso sin barra de colores) */}
          <p className={`text-[11px] font-medium tracking-wide mt-1 transition-colors ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            {submitted ? 'Sesión Registrada en Agenda' : `Paso ${step} de 8 • Disponibilidad en Vivo`}
          </p>
        </div>

        {/* ================= CONTENIDO INFERIOR CON FORMULARIO ================= */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 flex-1 flex flex-col justify-center relative overflow-y-auto z-10">
          {/* ================= PANTALLA DE CONFIRMACIÓN ================= */}
          {submitted ? (
            <div className="text-center space-y-4 animate-step-next my-auto">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-lg ${
                  isLight
                    ? 'bg-[#237299]/20 text-[#237299] border border-[#237299]/50'
                    : 'bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/50 shadow-[#A9F8B5]/20'
                }`}
              >
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className={`text-xl font-bold font-display ${isLight ? 'text-[#2c241c]' : 'text-white'}`}>
                  ¡Cita Registrada con Éxito!
                </h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${isLight ? 'text-[#5c4f42]' : 'text-gray-300'}`}>
                  Hemos guardado tu sesión para el{' '}
                  <strong className={isLight ? 'text-[#237299]' : 'text-white'}>{date}</strong> a las{' '}
                  <strong className={isLight ? 'text-[#0d7a64]' : 'text-[#A9F8B5]'}>{time}</strong>. Te contactaremos por WhatsApp.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir Confirmación en WhatsApp
                </a>
                <button
                  onClick={handleClose}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-black/10 hover:bg-black/15 text-[#2c241c]'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
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
                  <p className={`text-xs text-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    Elige una fecha conveniente para coordinar tu sesión estratégica.
                  </p>

                  {/* Acceso rápido a días: Burbujas de Agua (Water Bubble Pills) */}
                  <div className="flex gap-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setDate(todayStr)}
                      className={`water-bubble-pill flex-1 py-2.5 px-3 rounded-2xl text-xs font-semibold ${
                        date === todayStr ? 'is-active' : ''
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
                      className={`water-bubble-pill flex-1 py-2.5 px-3 rounded-2xl text-xs font-semibold ${
                        date !== todayStr ? 'is-active' : ''
                      }`}
                    >
                      Mañana
                    </button>
                  </div>

                  <div className="relative">
                    <Calendar
                      className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                        isLight ? 'text-sky-600' : 'text-[#A9F8B5]'
                      }`}
                    />
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && date) nextStep();
                      }}
                      className={`water-bubble-input pl-10 pr-3 py-2.5 rounded-2xl text-xs outline-none transition-all ${
                        isLight ? 'islamic-input-light' : 'islamic-input-dark'
                      }`}
                    />
                  </div>

                  <button
                    disabled={!date}
                    onClick={nextStep}
                    className="btn-water-bubble-action w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-40"
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
                        <div
                          className={`absolute inset-0 rounded-2xl blur-xl animate-pulse ${
                            isLight ? 'bg-sky-500/25' : 'bg-[#A9F8B5]/20'
                          }`}
                        />
                        <div
                          className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shadow-lg bg-black animate-logo-check flex items-center justify-center ${
                            isLight ? 'border-sky-500' : 'border-[#A9F8B5]'
                          }`}
                        >
                          <img
                            src="/assets/logo-gold-md.webp"
                            alt="GeoSoft"
                            width={64}
                            height={64}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div>
                        <h4
                          className={`text-sm font-bold flex items-center justify-center gap-2 ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full animate-ping ${
                              isLight ? 'bg-sky-500' : 'bg-[#A9F8B5]'
                            }`}
                          />
                          Comprobando disponibilidad...
                        </h4>
                        <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                          Verificando agenda en vivo para el {date} a las {time}
                        </p>
                      </div>
                    </div>
                  ) : availabilityResult && !availabilityResult.available ? (
                    /* HORA OCUPADA -> SUGERENCIA */
                    <div
                      className={`space-y-3.5 p-4 rounded-2xl border text-center animate-message-soft ${
                        isLight
                          ? 'bg-amber-500/10 border-amber-500/30 text-slate-800'
                          : 'bg-amber-500/10 border-amber-500/30'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-600 dark:text-amber-300">
                          Horario no disponible
                        </h4>
                        <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                          La hora <strong className={isLight ? 'text-slate-900' : 'text-white'}>{time}</strong> ya está reservada.
                        </p>
                      </div>

                      {availabilityResult.suggestedTime && (
                        <div className="pt-2">
                          <p className={`text-[11px] mb-2 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                            Te sugerimos la siguiente hora libre:
                          </p>
                          <button
                            onClick={() => handleAcceptSuggestedTime(availabilityResult.suggestedTime!)}
                            className="btn-water-bubble-action w-full py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98"
                          >
                            <span>Aceptar {availabilityResult.suggestedTime}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => setAvailabilityResult(null)}
                        className={`text-[11px] underline cursor-pointer ${
                          isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Elegir otra hora manualmente
                      </button>
                    </div>
                  ) : availabilityResult && availabilityResult.available ? (
                    /* HORA DISPONIBLE */
                    <div className="text-center py-6 space-y-3 animate-message-soft">
                      <div
                        className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto shadow-md ${
                          isLight
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
                            : 'bg-[#A9F8B5]/20 border-[#A9F8B5] text-[#A9F8B5]'
                        }`}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        ¡Horario 100% Disponible!
                      </h4>
                      <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        Avanzando a tus datos personales...
                      </p>
                    </div>
                  ) : (
                    /* SELECCIÓN DE HORA CON BURBUJAS DE AGUA */
                    <>
                      <p className={`text-xs text-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                        Escoge una franja horaria sugerida o ingresa tu horario predilecto.
                      </p>

                      {/* Botones de horas estándar estilo burbuja de agua */}
                      <div className="grid grid-cols-3 gap-2">
                        {standardTimes.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleTimeSelected(t)}
                            className={`water-bubble-pill py-2.5 px-2 rounded-2xl text-xs font-semibold ${
                              time === t ? 'is-active' : ''
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => handleTimeSelected(time)}
                          className="btn-water-bubble-action w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98"
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
                  <p className={`text-xs text-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    Indícanos tu nombre completo para personalizar tu sesión.
                  </p>

                  <div className="relative">
                    <User
                      className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                        isLight ? 'text-sky-600' : 'text-[#A9F8B5]'
                      }`}
                    />
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="text"
                      placeholder="Ej. Carlos Rodríguez"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && fullName.trim()) nextStep();
                      }}
                      className={`water-bubble-input pl-10 pr-3 py-2.5 rounded-2xl text-xs outline-none transition-all ${
                        isLight ? 'islamic-input-light' : 'islamic-input-dark'
                      }`}
                    />
                  </div>

                  <button
                    disabled={!fullName.trim()}
                    onClick={nextStep}
                    className="btn-water-bubble-action w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-40"
                  >
                    <span>Continuar al Teléfono</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 4: TELÉFONO / WHATSAPP ================= */}
              {step === 4 && (
                <div className="space-y-4 my-auto">
                  <p className={`text-xs text-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    Te enviaremos los accesos de la reunión y el recordatorio por WhatsApp.
                  </p>

                  <div className="relative">
                    <Phone
                      className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                        isLight ? 'text-sky-600' : 'text-[#A9F8B5]'
                      }`}
                    />
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="tel"
                      placeholder="+506 8888-8888"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && whatsapp.trim()) nextStep();
                      }}
                      className={`water-bubble-input pl-10 pr-3 py-2.5 rounded-2xl text-xs outline-none transition-all ${
                        isLight ? 'islamic-input-light' : 'islamic-input-dark'
                      }`}
                    />
                  </div>

                  <button
                    disabled={!whatsapp.trim()}
                    onClick={nextStep}
                    className="btn-water-bubble-action w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-40"
                  >
                    <span>Continuar al Correo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 5: CORREO ================= */}
              {step === 5 && (
                <div className="space-y-4 my-auto">
                  <p className={`text-xs text-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    Para enviarte el enlace de Google Meet y el resumen técnico.
                  </p>

                  <div className="relative">
                    <Mail
                      className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                        isLight ? 'text-sky-600' : 'text-[#A9F8B5]'
                      }`}
                    />
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="email"
                      placeholder="carlos@empresa.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && email.includes('@')) nextStep();
                      }}
                      className={`water-bubble-input pl-10 pr-3 py-2.5 rounded-2xl text-xs outline-none transition-all ${
                        isLight ? 'islamic-input-light' : 'islamic-input-dark'
                      }`}
                    />
                  </div>

                  <button
                    disabled={!email.includes('@')}
                    onClick={nextStep}
                    className="btn-water-bubble-action w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-40"
                  >
                    <span>Continuar a Servicios</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 6: SERVICIO DE INTERÉS ================= */}
              {step === 6 && (
                <div className="space-y-3 my-auto">
                  <p className={`text-xs text-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    Selecciona la solución principal que deseas implementar.
                  </p>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
                    {servicesList.map(s => (
                      <div
                        key={s.title}
                        onClick={() => {
                          setService(s.title);
                          nextStep();
                        }}
                        className={`water-bubble-pill p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between w-full ${
                          service === s.title ? 'is-active' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{s.icon}</span>
                          <div>
                            <div className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {s.title}
                            </div>
                            <div className={`text-[10.5px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                              {s.desc}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 ${isLight ? 'text-sky-600' : 'text-gray-400'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= PASO 7: CUÉNTANOS BREVEMENTE ================= */}
              {step === 7 && (
                <div className="space-y-4 my-auto">
                  <p className={`text-xs text-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    ¿Cuál es tu objetivo o principal reto actual? (Opcional)
                  </p>

                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    rows={3}
                    placeholder="Ej. Buscamos automatizar citas y cobros con Sinpe y un agente de IA..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className={`water-bubble-input px-3.5 py-2.5 rounded-2xl text-xs outline-none transition-all resize-none ${
                      isLight ? 'islamic-input-light' : 'islamic-input-dark'
                    }`}
                  />

                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="water-bubble-pill flex-1 py-2.5 rounded-2xl text-xs font-medium cursor-pointer"
                    >
                      Omitir
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-water-bubble-action flex-1 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98"
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
                  <p className={`text-xs text-center ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    Revisa tu información y confirma para reservar tu espacio.
                  </p>

                  {/* Tarjeta de Resumen Compacta en Cristal */}
                  <div
                    className={`water-bubble-card p-4 rounded-2xl space-y-2 text-xs ${
                      isLight ? 'bg-white/80' : 'bg-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                      <div
                        className={`flex items-center gap-1.5 font-semibold ${
                          isLight ? 'text-sky-600' : 'text-[#A9F8B5]'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{date}</span>
                        <span className="opacity-50 mx-1">•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{time}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-semibold ${
                          isLight
                            ? 'bg-sky-500/15 text-sky-700'
                            : 'bg-[#A9F8B5]/15 text-[#A9F8B5]'
                        }`}
                      >
                        Confirmado
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                          Nombre:
                        </span>
                        <span className={`font-medium truncate block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {fullName || 'No especificado'}
                        </span>
                      </div>
                      <div>
                        <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                          WhatsApp:
                        </span>
                        <span className={`font-medium truncate block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {whatsapp || 'No especificado'}
                        </span>
                      </div>
                      <div>
                        <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                          Correo:
                        </span>
                        <span className={`font-medium truncate block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {email || 'No especificado'}
                        </span>
                      </div>
                      <div>
                        <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                          Servicio:
                        </span>
                        <span
                          className={`font-medium truncate block ${
                            isLight ? 'text-sky-600 font-semibold' : 'text-[#DFF494]'
                          }`}
                        >
                          {service}
                        </span>
                      </div>
                    </div>

                    {notes && (
                      <div className="pt-1.5 border-t border-black/10 dark:border-white/10 text-[10.5px]">
                        <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Proyecto:</span>
                        <p className={`italic truncate ${isLight ? 'text-slate-800' : 'text-gray-300'}`}>
                          {notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Botón de Confirmación Principal */}
                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="btn-water-bubble-action w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
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
