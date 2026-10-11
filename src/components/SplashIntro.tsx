import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SplashIntroProps {
  onFinish?: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  // Fases: 1. 'spinning' (cubo girando rápido) -> 2. 'stopped' (se detiene y aparece animación de inicio) -> 3. 'entering' (entra a la web)
  const [phase, setPhase] = useState<'spinning' | 'stopped' | 'entering'>('spinning');
  const [shockwaveKey, setShockwaveKey] = useState(0);

  const handleDismiss = () => {
    setPhase('entering');
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 650);
  };

  useEffect(() => {
    // 1. A los 1.45s el cubo se detiene y arranca la animación de inicio
    const stopTimer = setTimeout(() => {
      setPhase('stopped');
      setShockwaveKey(prev => prev + 1);
    }, 1450);

    // 2. A los 3.7s la animación de inicio completa su ciclo y entra a la web
    const enterTimer = setTimeout(() => {
      handleDismiss();
    }, 3700);

    return () => {
      clearTimeout(stopTimer);
      clearTimeout(enterTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#040404] transition-all duration-700 cursor-pointer select-none overflow-hidden ${
        phase === 'entering' ? 'opacity-0 scale-105 filter blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Luz ambiental de fondo */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#A9F8B5]/20 via-[#DFF494]/15 to-[#C1A35B]/15 blur-[140px] pointer-events-none animate-pulse" />

      {/* Contenedor principal centrado */}
      <div className="relative flex flex-col items-center z-10 px-6 text-center max-w-lg mx-auto">
        
        {/* Contenedor del Cubo Verde 3D */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Anillo de choque luminoso cuando el cubo se detiene */}
          {phase === 'stopped' && (
            <div
              key={shockwaveKey}
              className="absolute w-44 h-44 rounded-full border-2 border-[#A9F8B5] shadow-[0_0_40px_rgba(169,248,181,0.9)] animate-shockwave pointer-events-none"
            />
          )}

          {/* Resplandor volumétrico detrás del cubo */}
          <div
            className={`absolute -inset-6 rounded-3xl bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] blur-2xl transition-all duration-700 ${
              phase === 'spinning'
                ? 'opacity-80 scale-110 animate-pulse'
                : 'opacity-40 scale-100'
            }`}
          />

          {/* CUBO VERDE 3D */}
          <div className="[perspective:1200px]">
            <div
              className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-[#A9F8B5]/50 shadow-[0_0_60px_rgba(169,248,181,0.4)] bg-[#0d1410] flex items-center justify-center ${
                phase === 'spinning'
                  ? 'animate-cube-fast-spin'
                  : 'animate-cube-float'
              }`}
            >
              <img
                src="/assets/logo-emerald.jpeg"
                alt="GeoSoft Cubo Verde 3D"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              
              {/* Reflejo de cristal sobre el cubo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

              {/* Destello perimetral neón */}
              <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ANIMACIÓN DE INICIO: Aparece cuando el cubo se detiene */}
        <div
          className={`space-y-3.5 transition-all duration-700 ease-out transform ${
            phase === 'stopped'
              ? 'opacity-100 translate-y-0 filter blur-0 scale-100'
              : 'opacity-0 translate-y-6 filter blur-sm scale-95 pointer-events-none'
          }`}
        >
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#A9F8B5]/30 text-xs font-semibold tracking-[0.2em] text-[#A9F8B5] uppercase shadow-lg shadow-[#A9F8B5]/10 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#DFF494] animate-spin" />
            Software • Web • Inteligencia Artificial
          </div>

          {/* Título de Marca con Efecto Cromático */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display text-white">
            GEO<span className="text-gradient-accent">SOFT</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-sm mx-auto leading-relaxed">
            Innovación arquitectónica, plataformas inteligentes y automatización de alto rendimiento.
          </p>

          {/* Barra de progreso de entrada a la web */}
          <div className="pt-2 w-48 sm:w-56 mx-auto space-y-1.5">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] rounded-full animate-[textLightSweep_2s_ease-in-out_infinite] w-full" />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-ping" />
              <span>Iniciando experiencia...</span>
            </div>
          </div>
        </div>

        {/* Botón / Indicador táctil para saltar o entrar directo */}
        <div className="mt-7 flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer">
          <span>Toca para ingresar de inmediato</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
