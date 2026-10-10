import React, { useState } from 'react';
import { Calendar, ChevronDown, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCal: () => void;
  onScrollToQuote: () => void;
  onScrollToServices: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCal,
  onScrollToQuote,
  onScrollToServices,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl bg-[#121316]/85 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-6 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
        {/* Brand Logo & Title */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/15 bg-black flex items-center justify-center shadow-md">
            <img
              src="/assets/logo-gold.jpeg"
              alt="GeoSoft"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="font-display font-bold text-lg tracking-wider text-white">
            GEO<span className="text-gradient-accent">SOFT</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-[14px] font-medium text-gray-300">
          <a
            href="#inicio"
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Inicio
          </a>

          {/* Solutions Dropdown */}
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className="flex items-center gap-1 px-4 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>Servicios</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#141518]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-col gap-1.5">
                <a
                  href="#servicios"
                  onClick={() => { setDropdownOpen(false); onScrollToServices(); }}
                  className="p-2.5 rounded-xl hover:bg-white/5 transition-colors group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#A9F8B5]/10 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                      Chatbots & Agentes IA
                      <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-1.5 py-0.2 rounded-full font-mono">24/7</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Captura y califica clientes en automático.</div>
                  </div>
                </a>

                <a
                  href="#servicios"
                  onClick={() => { setDropdownOpen(false); onScrollToServices(); }}
                  className="p-2.5 rounded-xl hover:bg-white/5 transition-colors group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#DFF494]/10 border border-[#DFF494]/30 flex items-center justify-center text-[#DFF494] shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs">Webs & Sistemas de Reservas</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Cobros con SinpePay, Stripe y agendas en vivo.</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          <a
            href="#como-funciona"
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Metodología
          </a>

          <a
            href="#cotizador"
            onClick={onScrollToQuote}
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Cotizador
          </a>

          <a
            href="#faq"
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenCal}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#DFF494]" />
            <span>Agendar Demo</span>
          </button>

          <button
            onClick={onScrollToQuote}
            className="btn-primary-gradient cursor-pointer text-xs uppercase tracking-wider"
          >
            Cotizar Ahora
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="pointer-events-auto absolute top-20 left-4 right-4 bg-[#121316]/98 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 md:hidden">
          <nav className="flex flex-col gap-2 text-base font-medium">
            <a
              href="#inicio"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-4 rounded-xl hover:bg-white/5 text-gray-200"
            >
              Inicio
            </a>
            <a
              href="#servicios"
              onClick={() => { setMobileOpen(false); onScrollToServices(); }}
              className="py-2.5 px-4 rounded-xl hover:bg-white/5 text-gray-200"
            >
              Servicios & Soluciones
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-4 rounded-xl hover:bg-white/5 text-gray-200"
            >
              Cómo Trabajamos
            </a>
            <a
              href="#cotizador"
              onClick={() => { setMobileOpen(false); onScrollToQuote(); }}
              className="py-2.5 px-4 rounded-xl hover:bg-white/5 text-gray-200"
            >
              Cotizador Inteligente
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-4 rounded-xl hover:bg-white/5 text-gray-200"
            >
              Preguntas Frecuentes
            </a>
          </nav>

          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => { setMobileOpen(false); onOpenCal(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 border border-white/10 text-sm font-semibold text-white"
            >
              <Calendar className="w-4 h-4 text-[#DFF494]" />
              <span>Agendar Reunión (30 Min)</span>
            </button>
            <button
              onClick={() => { setMobileOpen(false); onScrollToQuote(); }}
              className="w-full btn-primary-gradient py-3 text-center justify-center text-sm"
            >
              Cotizar Mi Proyecto
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
