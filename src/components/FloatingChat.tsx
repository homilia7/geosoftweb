import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Speech Bubble Tooltip when closed */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="card-accent p-3.5 rounded-2xl border-[#A9F8B5]/30 shadow-2xl max-w-[260px] cursor-pointer hover:scale-105 transition-all text-xs font-medium text-white flex items-center gap-2.5 animate-bounce"
        >
          <span className="text-lg">👋</span>
          <p className="text-gray-200">¿Buscas crear tu web o cotizar una solución con IA?</p>
        </div>
      )}

      {/* Mini Chat Drawer when open */}
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-3xl bg-[#121316]/95 backdrop-blur-2xl border border-white/15 p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-black">
                <img src="/assets/logo-gold.jpeg" alt="GeoSoft" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  GeoSoft Asistente
                  <span className="w-2 h-2 rounded-full bg-[#A9F8B5] animate-pulse" />
                </div>
                <div className="text-[10px] text-gray-400">Atención en Línea</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-200">
              ¡Hola! Estoy listo para responder tus dudas sobre diseño web, bots de IA o integraciones. ¿Qué tipo de proyecto deseas construir?
            </div>
          </div>

          <a
            href="https://wa.me/50689999999?text=Hola%20GeoSoft,%20quiero%20conversar%20sobre%20mi%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-primary-gradient py-2.5 text-xs text-center justify-center font-bold flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Hablar por WhatsApp</span>
          </a>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black shadow-[0_0_30px_rgba(169,248,181,0.4)] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border border-white/20"
      >
        <MessageSquare className="w-6 h-6 stroke-[2.2]" />
      </button>
    </div>
  );
};
