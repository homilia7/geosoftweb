import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface SplashIntroProps {
  onFinish?: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  // Fases: 'cinematic' (Video 3 en reversa ➔ Video 1 ➔ Video 2) -> 'brand' (Pantalla con "Iniciando experiencia...") -> 'entering' (Carga la página web)
  const [stage, setStage] = useState<'cinematic' | 'brand' | 'entering'>('cinematic');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    soundEffects.playIntroSound();
    setStage('brand');
  };

  const handleDismiss = () => {
    soundEffects.playIntroSound();
    setStage('entering');
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 650);
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Si está en fase 'brand', tras 2.2s entra automáticamente a la web
  useEffect(() => {
    if (stage === 'brand') {
      const brandTimer = setTimeout(() => {
        handleDismiss();
      }, 2200);
      return () => clearTimeout(brandTimer);
    }
  }, [stage]);

  // Si el usuario hace clic durante la cinemática, avanza a la pantalla de "Iniciando experiencia..."
  const handleContainerClick = () => {
    if (stage === 'cinematic') {
      handleVideoEnd();
    } else if (stage === 'brand') {
      handleDismiss();
    }
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-all duration-700 cursor-pointer select-none overflow-hidden ${
        stage === 'entering' ? 'opacity-0 scale-105 filter blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ================= ETAPA 1: SECUENCIA CINEMÁTICA VIDEO 3 (REVERSA) + 1 + 2 A TODO COLOR ================= */}
      {stage === 'cinematic' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src="/videos/geosoft-intro-sequence.mp4"
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleVideoEnd}
            onError={handleVideoEnd}
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Botones Superiores Flotantes: Activar Sonido & Saltar Animación */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSound();
              }}
              className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hidden sm:inline">Activar Sonido</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#A9F8B5]" />
                  <span className="hidden sm:inline">Sonido ON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleVideoEnd();
              }}
              className="px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-[#A9F8B5] text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              title="Saltar animación"
            >
              <span>Saltar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A9F8B5]" />
            </button>
          </div>

          {/* Indicador inferior discreto */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 z-30 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#A9F8B5] animate-pulse" />
              <span>GeoSoft • Intro Cinemática</span>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-gray-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 hidden sm:block">
              Toca para continuar a la web
            </div>
          </div>
        </div>
      )}

      {/* ================= ETAPA 2: PANTALLA "INICIANDO EXPERIENCIA..." (MARCA GEOSOFT) ================= */}
      {stage === 'brand' && (
        <div className="relative flex flex-col items-center z-20 px-6 text-center max-w-lg mx-auto animate-message-soft">
          {/* Luz ambiental cinematográfica de fondo */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#A9F8B5]/18 via-[#00ff88]/12 to-[#C1A35B]/12 blur-[150px] pointer-events-none animate-pulse" />

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

