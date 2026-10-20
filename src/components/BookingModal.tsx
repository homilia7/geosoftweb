import React, { useState, useEffect, useRef } from 'react';
import {
  X, Calendar, Clock, User, Mail, Phone, CheckCircle2,
  ArrowRight, ArrowLeft, Send, AlertCircle, MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGeoSoftStore } from '../context/StoreContext';
import { api } from '../services/api';
import { IslamicGeometricRibbon } from './IslamicGeometricRibbon';

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
        isLight ? 'bg-stone-900/40 backdrop-blur-md' : 'bg-black/85 backdrop-blur-md'
      } ${isClosing ? 'animate-backdrop-leave' : 'animate-backdrop-fade'}`}
    >
      {/* 3D Neumorphic Islamic Glass Slab Modal Container */}
      <div
        onClick={e => e.stopPropagation()}
        data-theme={theme}
        className={`islamic-glass-card relative w-full max-w-lg rounded-[34px] sm:rounded-[38px] overflow-hidden my-auto flex flex-col min-h-[500px] max-h-[92dvh] ${
          isClosing ? 'animate-modal-leave' : 'animate-modal-drop'
        }`}
      >
        {/* Barra de Progreso Sutil en el Borde Superior */}
        <div className="h-1 w-full bg-black/10 dark:bg-white/5 relative overflow-hidden shrink-0">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isLight
                ? 'bg-gradient-to-r from-[#237299] via-[#3188af] to-[#0d7a64]'
                : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B]'
            }`}
            style={{ width: submitted ? '100%' : `${(step / 8) * 100}%` }}
          />
        </div>

        {/* ================= SECCIÓN SUPERIOR: BOTONES NAV + INSIGNIA + TÍTULO HERO ================= */}
        <div className="relative pt-5 pb-3 px-6 sm:px-8 text-center shrink-0">
          {/* Botón Atrás (Flotante Esquina Superior Izquierda) */}
          {step > 1 && !submitted && (
            <button
              onClick={prevStep}
              className={`absolute left-5 top-5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer flex items-center justify-center ${
                isLight
                  ? 'bg-black/5 hover:bg-black/10 text-[#3d332a]'
                  : 'bg-white/10 hover:bg-white/15 text-gray-200'
              }`}
              title="Volver al paso anterior"
              aria-label="Atrás"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {/* Botón Cerrar (Flotante Esquina Superior Derecha) */}
          <button
            onClick={handleClose}
            className={`absolute right-5 top-5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer flex items-center justify-center ${
              isLight
                ? 'bg-black/5 hover:bg-black/10 text-[#3d332a]'
                : 'bg-white/10 hover:bg-white/15 text-gray-200'
            }`}
            title="Cerrar ventana"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Insignia Biselada Superior ("Template" en la referencia de diseño) */}
          <div className="inline-flex items-center justify-center">
            <span
              className={`px-5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase ${
                isLight ? 'islamic-badge-light' : 'islamic-badge-dark'
              }`}
            >
              {submitted ? 'Cita Confirmada' : 'Agendar Cita'}
            </span>
          </div>

          {/* Título Hero con Tipografía Distintiva */}
          <h2
            className={`font-display text-2xl sm:text-3xl font-bold tracking-tight mt-2.5 transition-colors ${
              isLight ? 'text-[#2c241c]' : 'text-white'
            }`}
          >
            {getStepHeroTitle()}
          </h2>
        </div>

        {/* ================= FRANJA CON PATRÓN GEOMÉTRICO (RIBBON BAND) ================= */}
        <IslamicGeometricRibbon
          theme={theme}
          badgeText={submitted ? 'Sesión Registrada en Agenda' : `Paso ${step} de 8 • Disponibilidad en Vivo`}
        />

        {/* ================= CONTENIDO INFERIOR CON FORMULARIO ================= */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 flex-1 flex flex-col justify-center relative overflow-y-auto">
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
                  <p className={`text-xs text-center ${isLight ? 'text-[#605244]' : 'text-gray-300'}`}>
                    Elige una fecha conveniente para coordinar tu sesión estratégica.
                  </p>

                  {/* Acceso rápido a días */}
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDate(todayStr)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        date === todayStr
                          ? isLight
                            ? 'bg-[#237299] border-[#237299] text-white shadow-sm'
                            : 'bg-[#A9F8B5]/20 border-[#A9F8B5] text-[#A9F8B5] shadow-sm'
                          : isLight
                          ? 'bg-white/70 border-[#d8cdb9] text-[#3d332a] hover:bg-white'
                          : 'bg-[#151922] border-white/10 text-gray-300 hover:border-white/25'
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
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isLight
                          ? 'bg-white/70 border-[#d8cdb9] text-[#3d332a] hover:bg-white'
                          : 'bg-[#151922] border-white/10 text-gray-300 hover:border-white/25'
                      }`}
                    >
                      Mañana
                    </button>
                  </div>

                  <div className="relative">
                    <Calendar
                      className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                        isLight ? 'text-[#237299]' : 'text-[#A9F8B5]'
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
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs outline-none transition-colors ${
                        isLight ? 'islamic-input-light' : 'islamic-input-dark'
                      }`}
                    />
                  </div>

                  <button
                    disabled={!date}
                    onClick={nextStep}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-40 ${
                      isLight
                        ? 'bg-gradient-to-r from-[#237299] to-[#0d7a64] text-white shadow-[#237299]/25 hover:opacity-95'
                        : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] text-black shadow-[#A9F8B5]/25 hover:opacity-95'
                    }`}
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
                            isLight ? 'bg-[#237299]/25' : 'bg-[#A9F8B5]/20'
                          }`}
                        />
                        <div
                          className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shadow-lg bg-black animate-logo-check flex items-center justify-center ${
                            isLight ? 'border-[#237299]' : 'border-[#A9F8B5]'
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
                            isLight ? 'text-[#2c241c]' : 'text-white'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full animate-ping ${
                              isLight ? 'bg-[#237299]' : 'bg-[#A9F8B5]'
                            }`}
                          />
                          Comprobando disponibilidad...
                        </h4>
                        <p className={`text-[11px] mt-1 ${isLight ? 'text-[#605244]' : 'text-gray-400'}`}>
                          Verificando agenda en vivo para el {date} a las {time}
                        </p>
                      </div>
                    </div>
                  ) : availabilityResult && !availabilityResult.available ? (
                    /* HORA OCUPADA -> SUGERENCIA */
                    <div
                      className={`space-y-3.5 p-4 rounded-2xl border text-center animate-message-soft ${
                        isLight
                          ? 'bg-amber-500/15 border-amber-600/30'
                          : 'bg-amber-500/10 border-amber-500/30'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300">
                          Horario no disponible
                        </h4>
                        <p className={`text-xs mt-1 ${isLight ? 'text-[#5c4f42]' : 'text-gray-300'}`}>
                          La hora <strong className={isLight ? 'text-[#2c241c]' : 'text-white'}>{time}</strong> ya está reservada.
                        </p>
                      </div>

                      {availabilityResult.suggestedTime && (
                        <div className="pt-2">
                          <p className={`text-[11px] mb-2 ${isLight ? 'text-[#605244]' : 'text-gray-400'}`}>
                            Te sugerimos la siguiente hora libre:
                          </p>
                          <button
                            onClick={() => handleAcceptSuggestedTime(availabilityResult.suggestedTime!)}
                            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-102 transition-transform cursor-pointer ${
                              isLight
                                ? 'bg-[#237299] text-white'
                                : 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black'
                            }`}
                          >
                            <span>Aceptar {availabilityResult.suggestedTime}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => setAvailabilityResult(null)}
                        className={`text-[11px] underline cursor-pointer ${
                          isLight ? 'text-[#605244] hover:text-[#2c241c]' : 'text-gray-400 hover:text-white'
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
                            ? 'bg-[#237299]/20 border-[#237299] text-[#237299]'
                            : 'bg-[#A9F8B5]/20 border-[#A9F8B5] text-[#A9F8B5]'
                        }`}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className={`text-sm font-bold ${isLight ? 'text-[#2c241c]' : 'text-white'}`}>
                        ¡Horario 100% Disponible!
                      </h4>
                      <p className={`text-xs ${isLight ? 'text-[#605244]' : 'text-gray-400'}`}>
                        Avanzando a tus datos personales...
                      </p>
                    </div>
                  ) : (
                    /* SELECCIÓN DE HORA */
                    <>
                      <p className={`text-xs text-center ${isLight ? 'text-[#605244]' : 'text-gray-300'}`}>
                        Escoge una franja horaria sugerida o ingresa tu horario predilecto.
                      </p>

                      {/* Botones de horas estándar */}
                      <div className="grid grid-cols-3 gap-2">
                        {standardTimes.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleTimeSelected(t)}
                            className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              time === t
                                ? isLight
                                  ? 'bg-[#237299] border-[#237299] text-white shadow-sm'
                                  : 'bg-[#A9F8B5]/20 border-[#A9F8B5] text-[#A9F8B5] shadow-sm'
                                : isLight
                                ? 'bg-white/70 border-[#d8cdb9] text-[#3d332a] hover:bg-white'
                                : 'bg-[#151922] border-white/10 text-gray-300 hover:border-white/25'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => handleTimeSelected(time)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-98 ${
                            isLight
                              ? 'bg-gradient-to-r from-[#237299] to-[#0d7a64] text-white shadow-[#237299]/25 hover:opacity-95'
                              : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] text-black shadow-[#A9F8B5]/25 hover:opacity-95'
                          }`}
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
                  <p className={`text-xs text-center ${isLight ? 'text-[#605244]' : 'text-gray-300'}`}>
                    Indícanos tu nombre completo para personalizar tu sesión.
                  </p>

                  <div className="relative">
                    <User
                      className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                        isLight ? 'text-[#237299]' : 'text-[#A9F8B5]'
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
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs outline-none transition-colors ${
                        isLight ? 'islamic-input-light' : 'islamic-input-dark'
                      }`}
                    />
                  </div>

                  <button
                    disabled={!fullName.trim()}
                    onClick={nextStep}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-40 ${
                      isLight
                        ? 'bg-gradient-to-r from-[#237299] to-[#0d7a64] text-white shadow-[#237299]/25 hover:opacity-95'
                        : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] text-black shadow-[#A9F8B5]/25 hover:opacity-95'
                    }`}
                  >
                    <span>Continuar al Teléfono</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 4: TELÉFONO / WHATSAPP ================= */}
              {step === 4 && (
                <div className="space-y-4 my-auto">
                  <p className={`text-xs text-center ${isLight ? 'text-[#605244]' : 'text-gray-300'}`}>
                    Te enviaremos los accesos de la reunión y el recordatorio por WhatsApp.
                  </p>

                  <div className="relative">
                    <Phone
                      className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                        isLight ? 'text-[#237299]' : 'text-[#A9F8B5]'
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
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs outline-none transition-colors ${
                        isLight ? 'islamic-input-light' : 'islamic-input-dark'
                      }`}
                    />
                  </div>

                  <button
                    disabled={!whatsapp.trim()}
                    onClick={nextStep}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-40 ${
                      isLight
                        ? 'bg-gradient-to-r from-[#237299] to-[#0d7a64] text-white shadow-[#237299]/25 hover:opacity-95'
                        : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] text-black shadow-[#A9F8B5]/25 hover:opacity-95'
                    }`}
                  >
                    <span>Continuar al Correo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 5: CORREO ================= */}
              {step === 5 && (
                <div className="space-y-4 my-auto">
                  <p className={`text-xs text-center ${isLight ? 'text-[#605244]' : 'text-gray-300'}`}>
                    Para enviarte el enlace de Google Meet y el resumen técnico.
                  </p>

                  <div className="relative">
                    <Mail
                      className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${
                        isLight ? 'text-[#237299]' : 'text-[#A9F8B5]'
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
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs outline-none transition-colors ${
                        isLight ? 'islamic-input-light' : 'islamic-input-dark'
                      }`}
                    />
                  </div>

                  <button
                    disabled={!email.includes('@')}
                    onClick={nextStep}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-40 ${
                      isLight
                        ? 'bg-gradient-to-r from-[#237299] to-[#0d7a64] text-white shadow-[#237299]/25 hover:opacity-95'
                        : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] text-black shadow-[#A9F8B5]/25 hover:opacity-95'
                    }`}
                  >
                    <span>Continuar a Servicios</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ================= PASO 6: SERVICIO DE INTERÉS ================= */}
              {step === 6 && (
                <div className="space-y-3 my-auto">
                  <p className={`text-xs text-center ${isLight ? 'text-[#605244]' : 'text-gray-300'}`}>
                    Selecciona la solución principal que deseas implementar.
                  </p>

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
                            ? isLight
                              ? 'bg-[#237299]/15 border-[#237299] shadow-sm'
                              : 'bg-[#A9F8B5]/15 border-[#A9F8B5] shadow-sm'
                            : isLight
                            ? 'bg-white/70 border-[#d8cdb9] hover:bg-white'
                            : 'bg-[#151922] border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{s.icon}</span>
                          <div>
                            <div className={`text-xs font-semibold ${isLight ? 'text-[#2c241c]' : 'text-white'}`}>
                              {s.title}
                            </div>
                            <div className={`text-[10.5px] ${isLight ? 'text-[#605244]' : 'text-gray-400'}`}>
                              {s.desc}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 ${isLight ? 'text-[#237299]' : 'text-gray-400'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= PASO 7: CUÉNTANOS BREVEMENTE ================= */}
              {step === 7 && (
                <div className="space-y-4 my-auto">
                  <p className={`text-xs text-center ${isLight ? 'text-[#605244]' : 'text-gray-300'}`}>
                    ¿Cuál es tu objetivo o principal reto actual? (Opcional)
                  </p>

                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    rows={3}
                    placeholder="Ej. Buscamos automatizar citas y cobros con Sinpe y un agente de IA..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none transition-colors resize-none ${
                      isLight ? 'islamic-input-light' : 'islamic-input-dark'
                    }`}
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={nextStep}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-black/5 hover:bg-black/10 text-[#3d332a]'
                          : 'bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white'
                      }`}
                    >
                      Omitir
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-98 ${
                        isLight
                          ? 'bg-gradient-to-r from-[#237299] to-[#0d7a64] text-white shadow-[#237299]/25 hover:opacity-95'
                          : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] text-black shadow-[#A9F8B5]/25 hover:opacity-95'
                      }`}
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
                  <p className={`text-xs text-center ${isLight ? 'text-[#605244]' : 'text-gray-300'}`}>
                    Revisa tu información y confirma para reservar tu espacio.
                  </p>

                  {/* Tarjeta de Resumen Compacta */}
                  <div
                    className={`p-3.5 rounded-2xl border space-y-2 text-xs shadow-inner ${
                      isLight
                        ? 'bg-white/70 border-[#d8cdb9]'
                        : 'bg-[#151922] border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                      <div
                        className={`flex items-center gap-1.5 font-semibold ${
                          isLight ? 'text-[#237299]' : 'text-[#A9F8B5]'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{date}</span>
                        <span className="opacity-50 mx-1">•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{time}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold ${
                          isLight
                            ? 'bg-[#237299]/15 text-[#237299]'
                            : 'bg-[#A9F8B5]/15 text-[#A9F8B5]'
                        }`}
                      >
                        Confirmado
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className={`block text-[10px] ${isLight ? 'text-[#827263]' : 'text-gray-400'}`}>
                          Nombre:
                        </span>
                        <span className={`font-medium truncate block ${isLight ? 'text-[#2c241c]' : 'text-white'}`}>
                          {fullName || 'No especificado'}
                        </span>
                      </div>
                      <div>
                        <span className={`block text-[10px] ${isLight ? 'text-[#827263]' : 'text-gray-400'}`}>
                          WhatsApp:
                        </span>
                        <span className={`font-medium truncate block ${isLight ? 'text-[#2c241c]' : 'text-white'}`}>
                          {whatsapp || 'No especificado'}
                        </span>
                      </div>
                      <div>
                        <span className={`block text-[10px] ${isLight ? 'text-[#827263]' : 'text-gray-400'}`}>
                          Correo:
                        </span>
                        <span className={`font-medium truncate block ${isLight ? 'text-[#2c241c]' : 'text-white'}`}>
                          {email || 'No especificado'}
                        </span>
                      </div>
                      <div>
                        <span className={`block text-[10px] ${isLight ? 'text-[#827263]' : 'text-gray-400'}`}>
                          Servicio:
                        </span>
                        <span
                          className={`font-medium truncate block ${
                            isLight ? 'text-[#237299]' : 'text-[#DFF494]'
                          }`}
                        >
                          {service}
                        </span>
                      </div>
                    </div>

                    {notes && (
                      <div className="pt-1.5 border-t border-black/10 dark:border-white/10 text-[10.5px]">
                        <span className={isLight ? 'text-[#827263]' : 'text-gray-400'}>Proyecto:</span>
                        <p className={`italic truncate ${isLight ? 'text-[#3d332a]' : 'text-gray-300'}`}>
                          {notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Botón de Confirmación Principal */}
                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-98 disabled:opacity-50 ${
                      isLight
                        ? 'bg-gradient-to-r from-[#237299] via-[#3188af] to-[#0d7a64] text-white shadow-[#237299]/30 hover:opacity-95'
                        : 'bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] text-black shadow-[#A9F8B5]/25 hover:opacity-95'
                    }`}
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
