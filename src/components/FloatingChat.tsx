import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, CalendarCheck, RefreshCw, MessageCircle } from 'lucide-react';
import { api } from '../services/api';
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

  // Cargar saludo configurado desde Cloudflare D1
  useEffect(() => {
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
  }, []);

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
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto max-w-[calc(100vw-2rem)]">
      {/* Speech Bubble Tooltip when closed */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="card-accent p-3 sm:p-3.5 rounded-2xl border-[#A9F8B5]/40 shadow-2xl max-w-[250px] sm:max-w-[270px] cursor-pointer hover:scale-105 transition-all text-xs font-medium text-white flex items-center gap-2.5 animate-bounce select-none"
        >
          <span className="text-xl">✨</span>
          <div className="leading-tight">
            <p className="text-gray-100 font-semibold">¿Dudas o cotización rápida?</p>
            <p className="text-gray-400 text-[10px]">Habla con nuestro asesor de IA 24/7</p>
          </div>
        </div>
      )}

      {/* Mini Chat Drawer when open */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-96 md:w-[410px] max-w-[420px] h-[550px] max-h-[85vh] rounded-3xl bg-[#121316]/98 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#17191d] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#A9F8B5]/40 bg-black shrink-0 relative">
                <img src="/assets/logo-gold.jpeg" alt="GeoSoft" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#A9F8B5] ring-2 ring-black" />
              </div>
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  GeoSoft IA Closer
                  <span className="px-1.5 py-0.2 rounded bg-[#A9F8B5]/20 text-[#A9F8B5] text-[9px] font-mono uppercase">
                    Ventas & Cierres
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-pulse" />
                  Asesor Activo • Respuesta Instantánea
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reiniciar conversación"
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg, idx) => {
              const isLatest = idx === messages.length - 1;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 animate-message-soft ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animationDelay: isLatest ? '0ms' : `${Math.min(idx * 40, 120)}ms` }}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-sm transition-all ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-medium rounded-tr-sm shadow-md'
                        : 'bg-[#181a1f] text-gray-100 border border-white/10 rounded-tl-sm shadow-lg'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <StructuredBotMessage text={msg.text} />
                    ) : (
                      <p className="whitespace-pre-wrap animate-text-soft">{msg.text}</p>
                    )}
                    
                    {msg.appointmentBooked && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/30 animate-text-soft">
                        <CalendarCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>¡Cita registrada con éxito! Te contactaremos.</span>
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1.5 text-right font-mono ${
                        msg.role === 'user' ? 'text-black/60' : 'text-gray-400'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-white/10 text-gray-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 border border-white/10">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2.5 items-center animate-message-soft">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-bold flex items-center justify-center text-[10px] shrink-0 shadow-sm">
                  <Sparkles className="w-3 h-3 animate-spin" />
                </div>
                <div className="bg-white/10 border border-white/10 rounded-2xl px-3.5 py-2 text-gray-300 text-[11px] flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-gray-400 ml-1">Escribiendo respuesta...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 border-t border-white/5 bg-[#0e0f12] overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-[10px] text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input & WhatsApp Action Bar */}
          <div className="p-3 border-t border-white/10 bg-[#15171b] shrink-0 space-y-2">
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
                placeholder="Escribe tu consulta o pide tu cita..."
                disabled={isTyping}
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#A9F8B5] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
              <span className="flex items-center gap-1 text-[9px]">
                <Sparkles className="w-2.5 h-2.5 text-[#A9F8B5]" />
                Potenciado con Google Gemini AI
              </span>
              <a
                href="https://wa.me/50689999999?text=Hola%20GeoSoft,%20vengo%20del%20chat%20de%20la%20web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A9F8B5] hover:underline flex items-center gap-1 font-semibold"
              >
                <MessageCircle className="w-3 h-3" />
                WhatsApp Directo
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black shadow-[0_0_30px_rgba(169,248,181,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer border border-white/20 relative"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
        <MessageSquare className="w-6 h-6 stroke-[2.2]" />
      </button>
    </div>
  );
};
