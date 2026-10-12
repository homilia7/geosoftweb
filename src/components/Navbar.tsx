import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Menu, X, ArrowUpRight, Sparkles, Lock, Clock, Layers, Search } from 'lucide-react';

interface NavbarProps {
  onOpenCal: () => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onScrollToQuote: () => void;
  onScrollToServices: () => void;
  introFinished?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCal,
  onOpenBooking,
  onOpenAdmin,
  onScrollToQuote,
  onScrollToServices,
  introFinished,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sweepActive, setSweepActive] = useState(false);

  useEffect(() => {
    if (introFinished) {
      const timer = setTimeout(() => {
        setHasStarted(true);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [introFinished]);

  // Fallback de seguridad en caso de recarga directa sin splash
  useEffect(() => {
    const safety = setTimeout(() => {
      setHasStarted(true);
    }, 4500);
    return () => clearTimeout(safety);
  }, []);

  // Barrido cromático: arranca 1.5s después de iniciar (cuando el Par 5 ya se asentó)
  useEffect(() => {
    if (!hasStarted) return;

    const sweepTimer = setTimeout(() => {
      setSweepActive(true);
    }, 1500);

    // Repetir el barrido cromático suavemente cada 9.5s
    const repeatInterval = setInterval(() => {
      setSweepActive(false);
      setTimeout(() => setSweepActive(true), 50);
    }, 9500);

    return () => {
      clearTimeout(sweepTimer);
      clearInterval(repeatInterval);
    };
  }, [hasStarted]);

  const mobileNavItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios & Soluciones', href: '#servicios', onClick: onScrollToServices },
    { label: 'Cómo Trabajamos', href: '#como-funciona' },
    { label: 'Nuestros Proyectos', href: '#proyectos' },
    { label: 'Conoce a Nuestro Equipo', href: '#equipo' },
    { label: 'Cotizador Inteligente', href: '#cotizador', onClick: onScrollToQuote },
    { label: 'Preguntas Frecuentes', href: '#faq' },
  ];

  const desktopServices = [
    {
      title: 'Chatbots & Agentes IA',
      desc: 'Captura y califica clientes en automático.',
      badge: '24/7',
      icon: Sparkles,
      iconColor: 'text-[#A9F8B5]',
      iconBorder: 'border-[#A9F8B5]/30',
      iconBg: 'bg-[#A9F8B5]/10',
    },
    {
      title: 'Webs & Sistemas de Reservas',
      desc: 'Cobros con SinpePay, Stripe y agendas en vivo.',
      icon: ArrowUpRight,
      iconColor: 'text-[#DFF494]',
      iconBorder: 'border-[#DFF494]/30',
      iconBg: 'bg-[#DFF494]/10',
    },
    {
      title: 'Plataformas SaaS a Medida',
      desc: 'Software en la nube de alta disponibilidad.',
      icon: Layers,
      iconColor: 'text-[#C1A35B]',
      iconBorder: 'border-[#C1A35B]/30',
      iconBg: 'bg-[#C1A35B]/10',
    },
    {
      title: 'Posicionamiento SEO Local',
      desc: 'Aparece de primero en Google en tu región.',
      icon: Search,
      iconColor: 'text-[#A9F8B5]',
      iconBorder: 'border-[#A9F8B5]/30',
      iconBg: 'bg-[#A9F8B5]/10',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-2 sm:py-2.5 px-3 sm:px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl bg-[#121316]/30 backdrop-blur-2xl border border-white/10 rounded-full px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center justify-between">
        {/* Brand Logo & Title (Par 1 Izquierda) */}
        <a
          href="#"
          style={{ animationDelay: '100ms' }}
          className={`flex items-center gap-2 sm:gap-2.5 group transition-all ${
            hasStarted ? 'animate-nav-pair-left' : 'opacity-0'
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-white/15 bg-black flex items-center justify-center shadow-sm">
            <img
              src="/assets/logo-gold.jpeg"
              alt="GeoSoft"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span
            style={sweepActive ? { animationDelay: '100ms' } : undefined}
            className={`font-display font-bold text-sm sm:text-base tracking-wider text-white ${
              sweepActive ? 'nav-chromatic-sweep-white' : ''
            }`}
          >
            GEO<span className="text-gradient-accent">SOFT</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 text-[13px] font-medium text-gray-300">
          {/* Par 2 Izquierda: Inicio */}
          <a
            href="#inicio"
            style={{ animationDelay: '300ms' }}
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${
              hasStarted ? 'animate-nav-pair-left' : 'opacity-0'
            }`}
          >
            <span
              style={sweepActive ? { animationDelay: '280ms' } : undefined}
              className={sweepActive ? 'nav-chromatic-sweep' : ''}
            >
              Inicio
            </span>
          </a>

          {/* Par 3 Izquierda: Servicios Dropdown */}
          <div
            style={{ animationDelay: '500ms' }}
            className={`relative ${hasStarted ? 'animate-nav-pair-left' : 'opacity-0'}`}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span
                style={sweepActive ? { animationDelay: '460ms' } : undefined}
                className={sweepActive ? 'nav-chromatic-sweep' : ''}
              >
                Servicios
              </span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-white' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#141518]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-1.5 animate-dropdown-menu">
                {desktopServices.map((svc, sIdx) => {
                  const Icon = svc.icon;
                  return (
                    <a
                      key={svc.title}
                      href="#servicios"
                      style={{ animationDelay: `${sIdx * 60 + 50}ms` }}
                      onClick={() => { setDropdownOpen(false); onScrollToServices(); }}
                      className="animate-mobile-item p-2.5 rounded-xl hover:bg-white/5 transition-colors group flex items-start gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg ${svc.iconBg} border ${svc.iconBorder} flex items-center justify-center ${svc.iconColor} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                          <span>{svc.title}</span>
                          {svc.badge && (
                            <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-1.5 py-0.2 rounded-full font-mono">
                              {svc.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 truncate">{svc.desc}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Par 4 Izquierda: Metodología */}
          <a
            href="#como-funciona"
            style={{ animationDelay: '700ms' }}
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${
              hasStarted ? 'animate-nav-pair-left' : 'opacity-0'
            }`}
          >
            <span
              style={sweepActive ? { animationDelay: '640ms' } : undefined}
              className={sweepActive ? 'nav-chromatic-sweep' : ''}
            >
              Metodología
            </span>
          </a>

          {/* Par 5 Izquierda: Proyectos */}
          <a
            href="#proyectos"
            style={{ animationDelay: '900ms' }}
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${
              hasStarted ? 'animate-nav-pair-left' : 'opacity-0'
            }`}
          >
            <span
              style={sweepActive ? { animationDelay: '820ms' } : undefined}
              className={sweepActive ? 'nav-chromatic-sweep' : ''}
            >
              Proyectos
            </span>
          </a>

          {/* Par 5 Derecha: Equipo */}
          <a
            href="#equipo"
            style={{ animationDelay: '900ms' }}
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${
              hasStarted ? 'animate-nav-pair-right' : 'opacity-0'
            }`}
          >
            <span
              style={sweepActive ? { animationDelay: '1000ms' } : undefined}
              className={sweepActive ? 'nav-chromatic-sweep' : ''}
            >
              Equipo
            </span>
          </a>

          {/* Par 4 Derecha: Cotizador */}
          <a
            href="#cotizador"
            onClick={onScrollToQuote}
            style={{ animationDelay: '700ms' }}
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${
              hasStarted ? 'animate-nav-pair-right' : 'opacity-0'
            }`}
          >
            <span
              style={sweepActive ? { animationDelay: '1180ms' } : undefined}
              className={sweepActive ? 'nav-chromatic-sweep' : ''}
            >
              Cotizador
            </span>
          </a>

          {/* Par 3 Derecha: FAQ */}
          <a
            href="#faq"
            style={{ animationDelay: '500ms' }}
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${
              hasStarted ? 'animate-nav-pair-right' : 'opacity-0'
            }`}
          >
            <span
              style={sweepActive ? { animationDelay: '1360ms' } : undefined}
              className={sweepActive ? 'nav-chromatic-sweep' : ''}
            >
              FAQ
            </span>
          </a>
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {/* Par 2 Derecha: Agendar Cita */}
          <button
            onClick={onOpenBooking}
            style={{ animationDelay: '300ms' }}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-[#A9F8B5] hover:border-[#A9F8B5]/40 transition-all cursor-pointer whitespace-nowrap ${
              hasStarted ? 'animate-nav-pair-right' : 'opacity-0'
            }`}
          >
            <Clock className="w-3 h-3 text-[#DFF494]" />
            <span
              style={sweepActive ? { animationDelay: '1540ms' } : undefined}
              className={sweepActive ? 'nav-chromatic-sweep-emerald' : ''}
            >
              Agendar Cita
            </span>
          </button>

          {/* Par 1 Derecha: Cotizar Ahora */}
          <button
            onClick={onScrollToQuote}
            style={{ animationDelay: '100ms' }}
            className={`px-3.5 py-1 rounded-full bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-[11px] uppercase tracking-wider hover:opacity-90 shadow-sm transition-all cursor-pointer whitespace-nowrap ${
              hasStarted ? 'animate-nav-pair-right' : 'opacity-0'
            }`}
          >
            <span
              style={sweepActive ? { animationDelay: '1720ms' } : undefined}
              className={sweepActive ? 'nav-chromatic-sweep-dark' : ''}
            >
              Cotizar Ahora
            </span>
          </button>

          {/* Candado Admin */}
          <button
            onClick={onOpenAdmin}
            style={{ animationDelay: '100ms' }}
            className={`p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer ${
              hasStarted ? 'animate-nav-pair-right' : 'opacity-0'
            }`}
            title="Panel de Administración"
          >
            <Lock className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ animationDelay: '100ms' }}
          className={`md:hidden p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all ${
            hasStarted ? 'animate-nav-pair-right' : 'opacity-0'
          }`}
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="pointer-events-auto absolute top-12 sm:top-14 left-3 sm:left-4 right-3 sm:right-4 max-h-[82vh] overflow-y-auto bg-[#121316]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 md:hidden animate-mobile-drawer">
          {/* Section 1: Navigation Links */}
          <nav className="flex flex-col gap-1.5 text-base font-medium">
            {mobileNavItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                style={{ animationDelay: `${idx * 45 + 60}ms` }}
                onClick={() => {
                  setMobileOpen(false);
                  if (item.onClick) item.onClick();
                }}
                className="animate-mobile-item flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-white/5 active:bg-white/10 text-gray-200 hover:text-white transition-colors group"
              >
                <span>{item.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#A9F8B5] transition-colors" />
              </a>
            ))}
          </nav>

          {/* Section 2: Action CTAs */}
          <div
            style={{ animationDelay: `${mobileNavItems.length * 45 + 90}ms` }}
            className="animate-mobile-item flex flex-col gap-2.5 pt-4 border-t border-white/10"
          >
            <button
              style={{ animationDelay: `${(mobileNavItems.length + 1) * 45 + 90}ms` }}
              onClick={() => { setMobileOpen(false); onOpenBooking(); }}
              className="animate-mobile-item w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 text-sm font-semibold text-[#A9F8B5] active:scale-[0.98] transition-transform"
            >
              <Clock className="w-4 h-4 text-[#DFF494]" />
              <span>Agendar Cita Directa</span>
            </button>
            <button
              style={{ animationDelay: `${(mobileNavItems.length + 2) * 45 + 90}ms` }}
              onClick={() => { setMobileOpen(false); onOpenCal(); }}
              className="animate-mobile-item w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 active:scale-[0.98] transition-transform"
            >
              <Calendar className="w-3.5 h-3.5 text-[#DFF494]" />
              <span>Cal.com Videollamada (30 Min)</span>
            </button>
            <button
              style={{ animationDelay: `${(mobileNavItems.length + 3) * 45 + 90}ms` }}
              onClick={() => { setMobileOpen(false); onScrollToQuote(); }}
              className="animate-mobile-item w-full btn-primary-gradient py-3 text-center justify-center text-sm font-bold active:scale-[0.98] transition-transform"
            >
              Cotizar Mi Proyecto
            </button>
            <button
              style={{ animationDelay: `${(mobileNavItems.length + 4) * 45 + 90}ms` }}
              onClick={() => { setMobileOpen(false); onOpenAdmin(); }}
              className="animate-mobile-item w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400 hover:text-white"
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
