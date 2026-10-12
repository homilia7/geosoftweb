import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { UltraCube3D } from './UltraCube3D';

interface SplashIntroProps {
  onFinish?: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  // Fases: 'cube3d' (Intro 1: Cubo 3D ultra realista) -> 'brand' (Intro 2: Presentación de marca) -> 'entering' (Entrada a la web)
  const [stage, setStage] = useState<'cube3d' | 'brand' | 'entering'>('cube3d');
  const [shockwaveKey, setShockwaveKey] = useState(0);

  const handleDismiss = () => {
    setStage('entering');
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 650);
  };

  // Cuando el cubo 3D frena
  const handleCubeStop = () => {
    setShockwaveKey(prev => prev + 1);

    // Permite admirar el cubo 3D detenido durante 850ms y luego pasa a la intro de marca
    setTimeout(() => {
      setStage('brand');
    }, 850);
  };

  useEffect(() => {
    // Si está en fase 'brand', tras 2.2s entra automáticamente a la web
    if (stage === 'brand') {
      const brandTimer = setTimeout(() => {
        handleDismiss();
      }, 2200);
      return () => clearTimeout(brandTimer);
    }
  }, [stage]);

  useEffect(() => {
    // Fallback de seguridad global por si acaso
    const safetyTimer = setTimeout(() => {
      if (stage !== 'entering') handleDismiss();
    }, 5500);

    return () => clearTimeout(safetyTimer);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020403] transition-all duration-700 cursor-pointer select-none overflow-hidden ${
        stage === 'entering' ? 'opacity-0 scale-105 filter blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Luz ambiental cinematográfica de fondo */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#A9F8B5]/18 via-[#00ff88]/12 to-[#C1A35B]/12 blur-[150px] pointer-events-none animate-pulse" />

      {/* ================= ETAPA 1: CUBO 3D ULTRA REALISTA ================= */}
      {stage === 'cube3d' && (
        <div className="relative w-full h-full flex items-center justify-center animate-message-soft">
          {/* Onda de choque lumínica cuando el cubo frena */}
          {shockwaveKey > 0 && (
            <div
              key={shockwaveKey}
              className="absolute w-56 h-56 rounded-full border-2 border-[#A9F8B5] shadow-[0_0_60px_rgba(169,248,181,0.95)] animate-shockwave pointer-events-none z-10"
            />
          )}

          <div className="w-full h-full relative z-20">
            <UltraCube3D onStop={handleCubeStop} />
          </div>
        </div>
      )}

      {/* ================= ETAPA 2: LA INTRO QUE ESTABA ANTES (MARCA GEOSOFT) ================= */}
      {stage === 'brand' && (
        <div className="relative flex flex-col items-center z-20 px-6 text-center max-w-lg mx-auto animate-message-soft">
          
          {/* Emblema GeoSoft con resplandor */}
          <div className="relative group mb-6">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#A9F8B5] via-[#DFF494] to-[#C1A35B] opacity-40 blur-xl animate-pulse" />
            
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(169,248,181,0.3)] bg-[#111214] flex items-center justify-center">
              <img
                src="/assets/logo-emerald.jpeg"
                alt="GeoSoft Logo"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />
            </div>
          </div>

          {/* Tipografía de Identidad de Marca */}
          <div className="space-y-3.5">
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

          {/* Indicador táctil para saltar o entrar directo */}
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer">
            <span>Toca para ingresar de inmediato</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};
