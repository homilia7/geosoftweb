import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-14 border-t border-white/10 bg-[#040404] text-xs text-gray-400">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3.5 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/15 bg-black footer-logo-glow flex items-center justify-center shadow-md">
            <img
              src="/assets/logo-gold.jpeg"
              alt="GeoSoft"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Prismatic Moving Light Ray */}
            <div className="footer-logo-sweep" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm">
              GEO<span className="text-gradient-accent">SOFT</span>
            </div>
            <div className="text-[11px] font-semibold tracking-wider animate-copyright-sweep">
              Consultancy & Engineering
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
          <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
          <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Metodología</a>
          <a href="#proyectos" className="hover:text-white transition-colors">Proyectos</a>
          <a href="#equipo" className="hover:text-white transition-colors">Equipo</a>
          <a href="#cotizador" className="hover:text-white transition-colors">Cotizador</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="text-center md:text-right text-gray-500">
          <p>© 2026 GeoSoft. Todos los derechos reservados.</p>
          <p className="text-[10px] mt-0.5">Desplegado en Cloudflare Pages • geosoftweb.pages.dev</p>
        </div>
      </div>
    </footer>
  );
};
