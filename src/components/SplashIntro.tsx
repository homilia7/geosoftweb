import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashIntroProps {
  onFinish?: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  const handleDismiss = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 600);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#040404] transition-all duration-700 cursor-pointer select-none ${
        animatingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#A9F8B5]/20 via-[#DFF494]/15 to-[#C1A35B]/20 blur-[120px] pointer-events-none animate-pulse" />

      {/* Center 3D Cube Presentation */}
      <div className="relative flex flex-col items-center z-10 px-6 text-center">
        <div className="relative group mb-8">
          {/* Glowing Ring */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] opacity-40 blur-xl animate-pulse" />
          
          {/* Logo Frame */}
          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(169,248,181,0.25)] bg-[#111214] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <img
              src="/assets/logo-emerald.jpeg"
              alt="GeoSoft Logo 3D"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Brand Reveal Typography */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-[0.2em] text-[#A9F8B5] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#DFF494] animate-spin" />
            Software • Web • Inteligencia Artificial
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-white">
            GEO<span className="text-gradient-accent">SOFT</span>
          </h1>

          <p className="text-sm md:text-base text-gray-400 font-light max-w-sm mx-auto">
            Innovación arquitectónica y automatización de alto rendimiento.
          </p>
        </div>

        {/* Skip button pill */}
        <div className="mt-8 flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
          <span>Toca para ingresar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
