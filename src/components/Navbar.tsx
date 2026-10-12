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

type NavAnimPhase =
  | 'entrance'
  | 'yellow_letters'
  | 'all_dimmed'
  | 'color_sweep'
  | 'one_second_pause'
  | 'slow_wake_up'
  | 'normal';

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
  const [pairStage, setPairStage] = useState(0); // 0: oculto, 1: Par 1, 2: Par 2, 3: Par 3, 4: Par 4, 5: Par 5
  const [animPhase, setAnimPhase] = useState<NavAnimPhase>('entrance');

  useEffect(() => {
    if (!introFinished) return;

    // Secuencia de aparición de los 5 pares (separados por 500ms de cadencia visible)
    const t1 = setTimeout(() => setPairStage(1), 150);  // Par 1: Logo & Cotizar Ahora
    const t2 = setTimeout(() => setPairStage(2), 650);  // Par 2: Inicio & Agendar Cita
    const t3 = setTimeout(() => setPairStage(3), 1150); // Par 3: Servicios & FAQ
    const t4 = setTimeout(() => setPairStage(4), 1650); // Par 4: Metodología & Cotizador
    const t5 = setTimeout(() => setPairStage(5), 2150); // Par 5: Proyectos & Equipo

    // 1. Al asentarse los botones (~2650ms), la luz amarilla se enciende adentro de las letras
    const tYellow = setTimeout(() => setAnimPhase('yellow_letters'), 2750);

    // 2. A los 3500ms, los botones como que se apagan todos de una vez
    const tDimmed = setTimeout(() => setAnimPhase('all_dimmed'), 3550);

    // 3. A los 3950ms, pasa la luz por cada uno de ellos (RÁPIDO Y FLUIDO: 105ms entre botones)
    const tSweep = setTimeout(() => setAnimPhase('color_sweep'), 3950);

    // 4. Tras apagarse el último elemento (3950ms + 1200ms = 5150ms), se espera exactamente 1 segundo apagados
    const tPause = setTimeout(() => setAnimPhase('one_second_pause'), 5150);

    // 5. A los 6150ms (tras 1 segundo de pausa), suave y lentamente empiezan a encender al color original (2.8s)
    const tSlowWake = setTimeout(() => setAnimPhase('slow_wake_up'), 6150);

    // 6. A los 9200ms (tras despertar completamente sin saltos), queda en estado normal definitivo
    const tNormal = setTimeout(() => setAnimPhase('normal'), 9200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tYellow);
      clearTimeout(tDimmed);
      clearTimeout(tSweep);
      clearTimeout(tPause);
      clearTimeout(tSlowWake);
      clearTimeout(tNormal);
    };
  }, [introFinished]);

  // Fallback de seguridad amplio (9.5s) solo en caso de recarga directa sin splash
  useEffect(() => {
    const safety = setTimeout(() => {
      setPairStage(prev => (prev === 0 ? 5 : prev));
      setAnimPhase('normal');
    }, 9500);
    return () => clearTimeout(safety);
  }, []);

  const getEntranceClass = (direction: 'left' | 'right', minPair: number) => {
    if (pairStage < minPair) return 'opacity-0 pointer-events-none';
    if (animPhase === 'entrance') {
      return direction === 'left' ? 'animate-nav-pair-left' : 'animate-nav-pair-right';
    }
    return '';
  };

  const getNavContainerAnim = (itemIndex: number) => {
    if (animPhase === 'all_dimmed' || animPhase === 'one_second_pause') {
      return 'nav-phase-dimmed';
    }
    if (animPhase === 'slow_wake_up') {
      return 'nav-phase-slow-wake';
    }
    return '';
  };

  const getNavSweepStyle = (itemIndex: number): React.CSSProperties | undefined => {
    if (animPhase === 'color_sweep') {
      return { animationDelay: `${itemIndex * 105}ms` };
    }
    return undefined;
  };

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
      <div className={`pointer-events-auto w-full max-w-5xl bg-[#121316]/30 backdrop-blur-2xl border border-white/10 rounded-full px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center justify-between transition-opacity duration-300 ${
        pairStage > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Par 1 Izquierda: Logo y Letras GeoSoft (de izquierda a derecha) */}
        <a
          href="#"
          className={`flex items-center gap-2 sm:gap-2.5 group transition-all ${getEntranceClass('left', 1)} ${getNavContainerAnim(0)}`}
        >
          <div
            style={getNavSweepStyle(0)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border bg-black flex items-center justify-center shadow-sm transition-all duration-300 border-white/15 ${
              animPhase === 'color_sweep' ? 'nav-sweep-logo-item' : ''
            }`}
          >
            <img
              src="/assets/logo-gold.jpeg"
              alt="GeoSoft"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span
            style={getNavSweepStyle(0)}
            className={`font-display font-bold text-sm sm:text-base tracking-wider transition-all duration-300 ${
              animPhase === 'yellow_letters'
                ? 'nav-phase-yellow-letters'
                : animPhase === 'color_sweep'
                ? 'nav-sweep-pass-item'
                : 'text-white'
            }`}
          >
            GEO<span className={animPhase === 'yellow_letters' ? 'text-yellow-300' : 'text-gradient-accent'}>SOFT</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 text-[13px] font-medium text-gray-300">
          {/* Par 2 Izquierda: Botón Inicio (de izquierda a derecha) */}
          <a
            href="#inicio"
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${getEntranceClass('left', 2)} ${getNavContainerAnim(1)}`}
          >
            <span
              style={getNavSweepStyle(1)}
              className={`transition-colors ${
                animPhase === 'yellow_letters'
                  ? 'nav-phase-yellow-letters'
                  : animPhase === 'color_sweep'
                  ? 'nav-sweep-pass-item'
                  : ''
              }`}
            >
              Inicio
            </span>
          </a>

          {/* Par 3 Izquierda: Botón Servicios (de izquierda a derecha) */}
          <div
            className={`relative ${getEntranceClass('left', 3)} ${getNavContainerAnim(2)}`}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span
                style={getNavSweepStyle(2)}
                className={`transition-colors ${
                  animPhase === 'yellow_letters'
                    ? 'nav-phase-yellow-letters'
                    : animPhase === 'color_sweep'
                    ? 'nav-sweep-pass-item'
                    : ''
                }`}
              >
                Servicios
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                dropdownOpen ? 'rotate-180 text-white' : animPhase === 'yellow_letters' ? 'text-yellow-300' : 'text-gray-400'
              }`} />
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

          {/* Par 4 Izquierda: Botón Metodología (de izquierda a derecha) */}
          <a
            href="#como-funciona"
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${getEntranceClass('left', 4)} ${getNavContainerAnim(3)}`}
          >
            <span
              style={getNavSweepStyle(3)}
              className={`transition-colors ${
                animPhase === 'yellow_letters'
                  ? 'nav-phase-yellow-letters'
                  : animPhase === 'color_sweep'
                  ? 'nav-sweep-pass-item'
                  : ''
              }`}
            >
              Metodología
            </span>
          </a>

          {/* Par 5 Izquierda: Botón Proyectos (de izquierda a derecha) */}
          <a
            href="#proyectos"
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${getEntranceClass('left', 5)} ${getNavContainerAnim(4)}`}
          >
            <span
              style={getNavSweepStyle(4)}
              className={`transition-colors ${
                animPhase === 'yellow_letters'
                  ? 'nav-phase-yellow-letters'
                  : animPhase === 'color_sweep'
                  ? 'nav-sweep-pass-item'
                  : ''
              }`}
            >
              Proyectos
            </span>
          </a>

          {/* Par 5 Derecha: Botón Equipo (de derecha a izquierda) */}
          <a
            href="#equipo"
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${getEntranceClass('right', 5)} ${getNavContainerAnim(5)}`}
          >
            <span
              style={getNavSweepStyle(5)}
              className={`transition-colors ${
                animPhase === 'yellow_letters'
                  ? 'nav-phase-yellow-letters'
                  : animPhase === 'color_sweep'
                  ? 'nav-sweep-pass-item'
                  : ''
              }`}
            >
              Equipo
            </span>
          </a>

          {/* Par 4 Derecha: Botón Cotizador (de derecha a izquierda) */}
          <a
            href="#cotizador"
            onClick={onScrollToQuote}
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${getEntranceClass('right', 4)} ${getNavContainerAnim(6)}`}
          >
            <span
              style={getNavSweepStyle(6)}
              className={`transition-colors ${
                animPhase === 'yellow_letters'
                  ? 'nav-phase-yellow-letters'
                  : animPhase === 'color_sweep'
                  ? 'nav-sweep-pass-item'
                  : ''
              }`}
            >
              Cotizador
            </span>
          </a>

          {/* Par 3 Derecha: Botón FAQ (de derecha a izquierda) */}
          <a
            href="#faq"
            className={`px-2.5 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors ${getEntranceClass('right', 3)} ${getNavContainerAnim(7)}`}
          >
            <span
              style={getNavSweepStyle(7)}
              className={`transition-colors ${
                animPhase === 'yellow_letters'
                  ? 'nav-phase-yellow-letters'
                  : animPhase === 'color_sweep'
                  ? 'nav-sweep-pass-item'
                  : ''
              }`}
            >
              FAQ
            </span>
          </a>
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {/* Par 2 Derecha: Botón Agendar Cita (de derecha a izquierda) */}
          <button
            onClick={onOpenBooking}
            style={getNavSweepStyle(8)}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-[#A9F8B5] hover:border-[#A9F8B5]/40 transition-colors cursor-pointer whitespace-nowrap ${getEntranceClass('right', 2)} ${getNavContainerAnim(8)} ${
              animPhase === 'color_sweep' ? 'nav-sweep-booking-item' : ''
            }`}
          >
            <Clock className={`w-3 h-3 transition-colors ${animPhase === 'yellow_letters' ? 'text-yellow-300' : 'text-[#DFF494]'}`} />
            <span
              className={animPhase === 'yellow_letters' ? 'nav-phase-yellow-letters' : ''}
            >
              Agendar Cita
            </span>
          </button>

          {/* Par 1 Derecha: Botón Cotizar Ahora (de derecha a izquierda) */}
          <button
            onClick={onScrollToQuote}
            style={getNavSweepStyle(9)}
            className={`px-3.5 py-1 rounded-full bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-[11px] uppercase tracking-wider hover:opacity-90 shadow-sm transition-all cursor-pointer whitespace-nowrap ${getEntranceClass('right', 1)} ${getNavContainerAnim(9)} ${
              animPhase === 'color_sweep' ? 'nav-sweep-primary-item' : ''
            }`}
          >
            <span
              className={animPhase === 'yellow_letters' ? 'nav-phase-yellow-letters' : ''}
            >
              Cotizar Ahora
            </span>
          </button>

          {/* Candado Admin (Par 1 Derecha) */}
          <button
            onClick={onOpenAdmin}
            className={`p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer ${getEntranceClass('right', 1)} ${getNavContainerAnim(9)}`}
            title="Panel de Administración"
          >
            <Lock className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Hamburger Button (Par 1 Derecha) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-1.5 rounded-full border transition-all ${getEntranceClass('right', 1)} ${getNavContainerAnim(9)} ${
            animPhase === 'yellow_letters'
              ? 'border-yellow-400 text-yellow-300 bg-yellow-400/20'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
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
