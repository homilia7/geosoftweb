import React, { useState } from 'react';
import { Calendar, ChevronDown, Menu, X, ArrowUpRight, Sparkles, Lock, Clock } from 'lucide-react';

interface NavbarProps {
  onOpenCal: () => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onScrollToQuote: () => void;
  onScrollToServices: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCal,
  onOpenBooking,
  onOpenAdmin,
  onScrollToQuote,
  onScrollToServices,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-2 sm:py-2.5 px-3 sm:px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl bg-[#121316]/30 backdrop-blur-2xl border border-white/10 rounded-full px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center justify-between">
        {/* Brand Logo & Title */}
        <a href="#" className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-white/15 bg-black flex items-center justify-center shadow-sm">
            <img
              src="/assets/logo-gold.jpeg"
              alt="GeoSoft"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="font-display font-bold text-sm sm:text-base tracking-wider text-white">
            GEO<span className="text-gradient-accent">SOFT</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 text-[13px] font-medium text-gray-300">
          <a
            href="#inicio"
            className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Inicio
          </a>

          {/* Solutions Dropdown */}
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>Servicios</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
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
            className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Metodología
          </a>

          <a
            href="#proyectos"
            className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Proyectos
          </a>

          <a
            href="#equipo"
            className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Equipo
          </a>

          <a
            href="#cotizador"
            onClick={onScrollToQuote}
            className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Cotizador
          </a>

          <a
            href="#faq"
            className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-[#A9F8B5] hover:border-[#A9F8B5]/40 transition-all cursor-pointer whitespace-nowrap"
          >
            <Clock className="w-3 h-3 text-[#DFF494]" />
            <span>Agendar Cita</span>
          </button>

          <button
            onClick={onScrollToQuote}
            className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-[11px] uppercase tracking-wider hover:opacity-90 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            Cotizar Ahora
          </button>

          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Panel de Administración"
          >
            <Lock className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="pointer-events-auto absolute top-12 sm:top-14 left-3 sm:left-4 right-3 sm:right-4 max-h-[82vh] overflow-y-auto bg-[#121316]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 md:hidden">
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
              href="#proyectos"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-4 rounded-xl hover:bg-white/5 text-gray-200"
            >
              Nuestros Proyectos
            </a>
            <a
              href="#equipo"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-4 rounded-xl hover:bg-white/5 text-gray-200"
            >
              Conoce a Nuestro Equipo
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

          <div className="flex flex-col gap-2.5 pt-4 border-t border-white/10">
            <button
              onClick={() => { setMobileOpen(false); onOpenBooking(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 text-sm font-semibold text-[#A9F8B5]"
            >
              <Clock className="w-4 h-4 text-[#DFF494]" />
              <span>Agendar Cita Directa</span>
            </button>
            <button
              onClick={() => { setMobileOpen(false); onOpenCal(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300"
            >
              <Calendar className="w-3.5 h-3.5 text-[#DFF494]" />
              <span>Cal.com Videollamada (30 Min)</span>
            </button>
            <button
              onClick={() => { setMobileOpen(false); onScrollToQuote(); }}
              className="w-full btn-primary-gradient py-3 text-center justify-center text-sm font-bold"
            >
              Cotizar Mi Proyecto
            </button>
            <button
              onClick={() => { setMobileOpen(false); onOpenAdmin(); }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400 hover:text-white"
            >
              <Lock className="w-3 h-3" />
              <span>Panel de Administración</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
