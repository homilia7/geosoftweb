import React, { useState, useEffect } from 'react';
import { UltraCube3D } from './UltraCube3D';

interface SplashIntroProps {
  onFinish?: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  // Fases: 'spinning' -> 'stopped' -> 'entering'
  const [phase, setPhase] = useState<'spinning' | 'stopped' | 'entering'>('spinning');
  const [shockwaveKey, setShockwaveKey] = useState(0);

  const handleDismiss = () => {
    setPhase('entering');
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 700);
  };

  const handleCubeStop = () => {
    setPhase('stopped');
    setShockwaveKey(prev => prev + 1);

    // Tras detenerse y lucir el 3D ultra realista, entra suavemente a la web
    setTimeout(() => {
      handleDismiss();
    }, 1600);
  };

  useEffect(() => {
    // Fallback de seguridad si no recibiera el callback
    const safetyTimer = setTimeout(() => {
      if (phase !== 'entering') handleDismiss();
    }, 4200);

    return () => clearTimeout(safetyTimer);
  }, [phase]);

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020403] transition-all duration-700 cursor-pointer select-none overflow-hidden ${
        phase === 'entering' ? 'opacity-0 scale-105 filter blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Luz ambiental cinematográfica de fondo */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#A9F8B5]/18 via-[#00ff88]/12 to-[#C1A35B]/10 blur-[150px] pointer-events-none animate-pulse" />

      {/* Onda de choque lumínica en el centro exacto cuando el cubo frena */}
      {phase === 'stopped' && (
        <div
          key={shockwaveKey}
          className="absolute w-56 h-56 rounded-full border-2 border-[#A9F8B5] shadow-[0_0_60px_rgba(169,248,181,0.95)] animate-shockwave pointer-events-none z-10"
        />
      )}

      {/* Escenario 3D WebGL Ultra Realista: SOLO EL CUBO */}
      <div className="relative w-full h-full flex items-center justify-center z-20">
        <UltraCube3D onStop={handleCubeStop} />
      </div>
    </div>
  );
};
