import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, CalendarCheck, RefreshCw, MessageCircle } from 'lucide-react';
import { api } from '../services/api';
import { soundEffects } from '../services/soundEffects';
import { StructuredBotMessage } from './StructuredBotMessage';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  time: string;
  isObjection?: boolean;
  appointmentBooked?: boolean;
}

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('¡Hola! 👋 Bienvenido a GeoSoft. Soy tu Asesor de Soluciones Digitales y Software. Cuéntame, ¿qué proyecto o reto tienes en mente para tu negocio?');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-init',
        role: 'assistant',
        text: '¡Hola! 👋 Bienvenido a GeoSoft. Soy tu Asesor de Soluciones Digitales y Software. Cuéntame, ¿qué proyecto o reto tienes en mente para tu negocio?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => {
    let stored = typeof window !== 'undefined' ? sessionStorage.getItem('geosoft_bot_conv') : null;
    if (!stored) {
      stored = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      if (typeof window !== 'undefined') sessionStorage.setItem('geosoft_bot_conv', stored);
    }
    return stored;
  });

  const [appointmentClosed, setAppointmentClosed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar saludo configurado desde Cloudflare D1 solo al abrir el chat
  useEffect(() => {
    if (!isOpen) return;
    api.getBotConfig().then(cfg => {
      if (cfg && cfg.welcomeMessage) {
        setWelcomeMessage(cfg.welcomeMessage);
        setMessages(prev => {
          if (prev.length === 1 && prev[0].id === 'msg-init') {
            return [{
              ...prev[0],
              text: cfg.welcomeMessage
            }];
          }
          return prev;
        });
      }
    });
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Track chat opening
      api.trackEvent({
        event_type: 'click',
        target_name: 'Chat IA Abierto',
        page_path: window.location.pathname
      });
    }
  }, [isOpen, messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        soundEffects.playClick();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      soundEffects.playClick();
    } catch {}
    setIsOpen(true);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      soundEffects.playClick();
    } catch {}
    setIsOpen(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const visitorId = typeof window !== 'undefined' ? localStorage.getItem('geosoft_visitor_id') || 'anon' : 'anon';
      const response = await api.sendBotMessage({
        conversationId,
        visitorId,
        message: text
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isObjection: Boolean(response.objection?.detected),
        appointmentBooked: Boolean(response.appointmentBooked)
      };

      setMessages(prev => [...prev, botMsg]);

      if (response.appointmentBooked) {
        setAppointmentClosed(true);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          text: 'Disculpa, tuve un breve inconveniente. Puedes escribirnos directamente por WhatsApp y nuestro equipo de ingenieros te responderá de inmediato.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    const newId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('geosoft_bot_conv', newId);
    setConversationId(newId);
    setAppointmentClosed(false);
    setMessages([
      {
        id: `msg-init-reset-${Date.now()}`,
        role: 'assistant',
        text: welcomeMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickQuestions = [
    '¿Cuánto cuesta una web o tienda?',
    '¿Qué tiempo tarda la entrega?',
    '¿Por qué me conviene GeoSoft?',
    'Quiero agendar una demo gratuita'
  ];

  return (
    <>
      {/* Botón Pestaña Inferior Central con Curvas Abiertas en los Extremos (Compacto y Sutil) */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-40 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto select-none ${
          isOpen ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
      >
        <button
          type="button"
          onClick={handleOpen}
          className="relative group flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 bg-[#0d0f13]/95 hover:bg-[#14171e] text-white border-t border-x border-[#A9F8B5]/40 rounded-t-xl shadow-[0_-6px_20px_rgba(0,0,0,0.6),0_-1px_8px_rgba(169,248,181,0.2)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
          title="Abrir Chat Online • Asesor IA GeoSoft"
        >
          {/* Curva abierta izquierda (inverted fillet hacia el borde de la pantalla) */}
          <svg
            className="absolute -left-3 bottom-0 w-3 h-3 pointer-events-none overflow-visible fill-[#0d0f13] stroke-[#A9F8B5]/40"
            viewBox="0 0 12 12"
          >
            <path d="M0 12 C6 12 12 6 12 0 V12 H0 Z" strokeWidth="0" />
            <path d="M0 12 C6 12 12 6 12 0" fill="none" strokeWidth="1" />
          </svg>

          {/* Curva abierta derecha (inverted fillet hacia el borde de la pantalla) */}
          <svg
            className="absolute -right-3 bottom-0 w-3 h-3 pointer-events-none overflow-visible fill-[#0d0f13] stroke-[#A9F8B5]/40"
            viewBox="0 0 12 12"
          >
            <path d="M12 12 C6 12 0 6 0 0 V12 H12 Z" strokeWidth="0" />
            <path d="M12 12 C6 12 0 6 0 0" fill="none" strokeWidth="1" />
          </svg>

          {/* Línea de luz superior sutil */}
          <div className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#A9F8B5]/80 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Indicador luminoso pulsante */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A9F8B5] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#A9F8B5]" />
          </span>

          {/* Icono de Chat */}
          <MessageSquare className="w-3.5 h-3.5 text-[#A9F8B5] group-hover:scale-110 transition-transform" />

          {/* Etiqueta del botón pestaña */}
          <span className="text-[11px] sm:text-xs font-medium tracking-wide text-white group-hover:text-[#A9F8B5] transition-colors">
            Chat Online
          </span>
        </button>
      </div>

      {/* Capa de Fondo Oscuro con Desenfoque (Backdrop para elevar el chat sobre la web) */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/65 backdrop-blur-md z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Ventana de Chat Casi Completa (Desciende suavemente de arriba a abajo) */}
      <div
        className={`fixed inset-x-0 mx-auto top-3 sm:top-6 z-[70] w-[96vw] sm:w-[92vw] max-w-4xl h-[94vh] sm:h-[88vh] max-h-[860px] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-[120%] opacity-0 pointer-events-none'
        }`}
      >
        {/* Luz ambiental envolvente detrás de la ventana */}
        <div className="absolute -inset-3 sm:-inset-6 bg-gradient-to-b from-[#A9F8B5]/20 via-[#38bdf8]/10 to-[#C1A35B]/10 blur-3xl opacity-70 pointer-events-none rounded-3xl" />

        {/* Tarjeta Contenedora Principal */}
        <div className="relative flex-1 flex flex-col rounded-2xl sm:rounded-3xl bg-[#0e1014]/95 backdrop-blur-2xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(169,248,181,0.18)] overflow-hidden">
          {/* Header Superior */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#14161b]/90 shrink-0">
            <div>
              <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                GeoSoft • Asesor Inteligente
                <span className="px-2 py-0.5 rounded-full bg-[#A9F8B5]/15 text-[#A9F8B5] text-[10px] font-mono uppercase border border-[#A9F8B5]/20">
                  Online 24/7
                </span>
              </div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-pulse" />
                Especialista en Software, Webs y Automatización de Negocios
              </div>
            </div>

            {/* Controles de Acción: WhatsApp, Reset y Cerrar */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                href="https://wa.me/50689999999?text=Hola%20GeoSoft,%20vengo%20del%20chat%20de%20la%20web"
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir chat en WhatsApp"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={handleReset}
                title="Reiniciar conversación"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleClose}
                title="Cerrar chat (Esc)"
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cuerpo de Mensajes con Scroll Fluido */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 text-xs sm:text-sm">
            {messages.map((msg, idx) => {
              const isLatest = idx === messages.length - 1;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-2.5 animate-message-soft ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animationDelay: isLatest ? '0ms' : `${Math.min(idx * 30, 90)}ms` }}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden border border-[#A9F8B5]/40 bg-black shrink-0 mt-0.5 shadow-sm relative">
                      <img
                        src="/assets/logo-emerald-sm.webp"
                        alt="GeoSoft Asesor"
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl shadow-sm transition-all ${
                      msg.role === 'user'
                        ? 'max-w-[85%] sm:max-w-[65%] md:max-w-[50%] bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-medium rounded-tr-sm shadow-md px-3.5 py-1.5 sm:px-4 sm:py-2'
                        : 'max-w-[88%] sm:max-w-[65%] md:max-w-[52%] bg-[#16181d] text-gray-100 border border-white/10 rounded-tl-sm shadow-lg px-3.5 py-2 sm:px-4 sm:py-2.5 leading-snug'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <>
                        <StructuredBotMessage
                          text={msg.text}
                          isLatest={isLatest}
                          onLineRendered={scrollToBottom}
                          time={msg.appointmentBooked ? undefined : msg.time}
                        />

                        {msg.appointmentBooked && (
                          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/30 animate-text-soft">
                            <div className="flex items-center gap-1.5">
                              <CalendarCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>¡Cita registrada con éxito! Te contactaremos.</span>
                            </div>
                            <span className="text-[9.5px] font-mono text-emerald-400/80 shrink-0 select-none">
                              {msg.time}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="whitespace-pre-wrap leading-snug break-words">
                        {msg.text}
                        <span className="inline-block ml-2 text-[9px] font-mono text-black/60 align-baseline whitespace-nowrap select-none">
                          {msg.time}
                        </span>
                      </p>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 text-gray-300 flex items-center justify-center text-xs shrink-0 mt-0.5 border border-white/10">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 sm:gap-2.5 items-center animate-message-soft">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden border border-[#A9F8B5]/40 bg-black shrink-0 shadow-sm relative animate-pulse">
                  <img
                    src="/assets/logo-emerald-sm.webp"
                    alt="GeoSoft Asesor"
                    width={32}
                    height={32}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-2.5 text-gray-300 text-xs flex items-center gap-2 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-gray-400 ml-1">Escribiendo respuesta...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chips de Consultas Rápidas */}
          <div className="px-4 sm:px-6 py-2.5 border-t border-white/5 bg-[#0b0c0f] overflow-x-auto flex gap-2 no-scrollbar shrink-0">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-xs text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Barra de Entrada y Acciones */}
          <div className="p-2.5 sm:p-3 border-t border-white/10 bg-[#121418] shrink-0 space-y-1.5">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escribe tu consulta o pide tu propuesta..."
                disabled={isTyping}
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#A9F8B5] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shrink-0 shadow-md"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
              <span className="flex items-center gap-1.5 text-[10px]">
                <Sparkles className="w-3 h-3 text-[#A9F8B5]" />
                Asesor oficial GeoSoft • Conexión en vivo
              </span>
              <a
                href="https://wa.me/50689999999?text=Hola%20GeoSoft,%20vengo%20del%20chat%20de%20la%20web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A9F8B5] hover:underline flex items-center gap-1 font-semibold text-[10px] sm:text-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Directo
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
