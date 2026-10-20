import React, { useId, useCallback } from 'react';
import { useGeoSoftStore } from '../context/StoreContext';
import { soundEffects } from '../services/soundEffects';

export interface NeumorphicThemeToggleProps {
  scale?: number;
  className?: string;
  showLabel?: boolean;
  onToggle?: () => void;
  idPrefix?: string;
}

export const NeumorphicThemeToggle: React.FC<NeumorphicThemeToggleProps> = ({
  scale = 0.28,
  className = '',
  showLabel = false,
  onToggle,
  idPrefix,
}) => {
  const { theme, toggleTheme } = useGeoSoftStore();
  const reactId = useId().replace(/:/g, '_');
  const uid = idPrefix || reactId;

  // Synthesize realistic mechanical tactile switch sound using Web Audio API
  const playTactileSwitchSound = useCallback((targetMode: 'light' | 'dark') => {
    if (soundEffects.isMuted()) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;

      // 1. Mechanical slide thud
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';

      if (targetMode === 'dark') {
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.09);
      } else {
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.085);
      }

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      // 2. Crisp metallic latch click after knob travel
      const clickOsc = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(targetMode === 'dark' ? 920 : 1240, now + 0.06);
      clickOsc.frequency.exponentialRampToValueAtTime(280, now + 0.095);

      clickGain.gain.setValueAtTime(0.001, now);
      clickGain.gain.setValueAtTime(0.12, now + 0.06);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.098);

      clickOsc.connect(clickGain);
      clickGain.connect(audioCtx.destination);
      clickOsc.start(now + 0.06);
      clickOsc.stop(now + 0.1);
    } catch {
      // Fallback
    }
  }, []);

  const handleClick = () => {
    const nextMode = theme === 'light' ? 'dark' : 'light';
    playTactileSwitchSound(nextMode);
    if (onToggle) {
      onToggle();
    } else {
      toggleTheme();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const orangeGlowId = `orangeNeon_${uid}`;
  const blueGlowId = `blueNeon_${uid}`;
  const orangeArcId = `orangeArc_${uid}`;
  const blueArcId = `blueArc_${uid}`;
  const trackSunCoreId = `trackSunCore_${uid}`;
  const recessedMoonId = `recessedMoon_${uid}`;
  const paleBlueMoonId = `paleBlueMoon_${uid}`;
  const knobSunGradId = `knobSunGrad_${uid}`;
  const knobMoonGradId = `knobMoonGrad_${uid}`;

  // Dimensions
  const targetWidth = Math.round(340 * scale);
  const targetHeight = Math.round(154 * scale);

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0 cursor-pointer"
        style={{
          width: targetWidth,
          height: targetHeight,
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label="Selector de Tema Neumórfico 3D Día / Noche"
        tabIndex={0}
      >
        <div
          className="absolute"
          style={{
            width: 340,
            height: 154,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Main 3D Neumorphic Switch Container */}
          <div className="neo-switch" data-mode={theme}>
            {/* Recessed Inner Track */}
            <div className="neo-track">
              {/* Ambient Inner Rim Glows */}
              <div className="rim-light-left" />
              <div className="rim-light-right" />

              {/* Precision Neon Rim Arcs SVG */}
              <svg
                className="rim-svg-overlay"
                viewBox="0 0 310 124"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id={orangeGlowId} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="4.5" result="blur1" />
                    <feGaussianBlur stdDeviation="10" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id={blueGlowId} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="4" result="blur1" />
                    <feGaussianBlur stdDeviation="9" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient
                    id={orangeArcId}
                    x1="0"
                    y1="0"
                    x2="115"
                    y2="124"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#ffaa33" stopOpacity="0.15" />
                    <stop offset="28%" stopColor="#ff9900" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#ffd27d" stopOpacity="1" />
                    <stop offset="72%" stopColor="#ff8800" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffaa33" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient
                    id={blueArcId}
                    x1="310"
                    y1="0"
                    x2="195"
                    y2="124"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#00b7ff" stopOpacity="0.15" />
                    <stop offset="25%" stopColor="#00d2ff" stopOpacity="0.98" />
                    <stop offset="50%" stopColor="#b8f2ff" stopOpacity="1" />
                    <stop offset="75%" stopColor="#0095ff" stopOpacity="0.98" />
                    <stop offset="100%" stopColor="#00b7ff" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                {/* Left Warm Orange Inner Rim Arc */}
                <path
                  className="orange-arc-stroke"
                  d="M 88 2.5 H 62 A 59.5 59.5 0 0 0 62 121.5 H 88"
                  stroke={`url(#${orangeArcId})`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter={`url(#${orangeGlowId})`}
                />
                {/* Right Electric Blue Inner Rim Arc */}
                <path
                  className="blue-arc-stroke"
                  d="M 222 2.5 H 248 A 59.5 59.5 0 0 1 248 121.5 H 222"
                  stroke={`url(#${blueArcId})`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  filter={`url(#${blueGlowId})`}
                />
              </svg>

              {/* Track Left Icon: Glowing Yellow Sun (Revealed in Dark Mode) */}
              <div className="track-icon-left">
                <svg
                  className="w-14 h-14"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id={trackSunCoreId} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF7B2" />
                      <stop offset="55%" stopColor="#FFDF40" />
                      <stop offset="100%" stopColor="#FF9E00" />
                    </radialGradient>
                  </defs>
                  <circle cx="32" cy="32" r="14.5" fill={`url(#${trackSunCoreId})`} />
                  <g fill="#FFD43B">
                    <path d="M32 5.5C33.1 5.5 34.8 11.8 34.8 13.2C34.8 14.1 33.5 14.6 32 14.6C30.5 14.6 29.2 14.1 29.2 13.2C29.2 11.8 30.9 5.5 32 5.5Z" />
                    <path d="M32 58.5C33.1 58.5 34.8 52.2 34.8 50.8C34.8 49.9 33.5 49.4 32 49.4C30.5 49.4 29.2 49.9 29.2 50.8C29.2 52.2 30.9 58.5 32 58.5Z" />
                    <path d="M58.5 32C58.5 33.1 52.2 34.8 50.8 34.8C49.9 34.8 49.4 33.5 49.4 32C49.4 30.5 49.9 29.2 50.8 29.2C52.2 29.2 58.5 30.9 58.5 32Z" />
                    <path d="M5.5 32C5.5 33.1 11.8 34.8 13.2 34.8C14.1 34.8 14.6 33.5 14.6 32C14.6 30.5 14.1 29.2 13.2 29.2C11.8 29.2 5.5 30.9 5.5 32Z" />
                    <path d="M50.7 13.3C51.5 14.1 48.2 19.7 47.2 20.7C46.6 21.3 45.3 20.8 44.2 19.8C43.2 18.7 42.7 17.4 43.3 16.8C44.3 15.8 49.9 12.5 50.7 13.3Z" />
                    <path d="M13.3 50.7C14.1 51.5 19.7 48.2 20.7 47.2C21.3 46.6 20.8 45.3 19.8 44.2C18.7 43.2 17.4 42.7 16.8 43.3C15.8 44.3 12.5 49.9 13.3 50.7Z" />
                    <path d="M50.7 50.7C49.9 51.5 44.3 48.2 43.3 47.2C42.7 46.6 43.2 45.3 44.2 44.2C45.3 43.2 46.6 42.7 47.2 43.3C48.2 44.3 51.5 49.9 50.7 50.7Z" />
                    <path d="M13.3 13.3C12.5 14.1 15.8 19.7 16.8 20.7C17.4 21.3 18.7 20.8 19.8 19.8C20.8 18.7 21.3 17.4 20.7 16.8C19.7 15.8 14.1 12.5 13.3 13.3Z" />
                  </g>
                </svg>
              </div>

              {/* Track Right Icon: Recessed Pale Blue Crescent Moon (Revealed in Light Mode) */}
              <div className="track-icon-right">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id={recessedMoonId} x="-25%" y="-25%" width="150%" height="150%">
                      <feOffset dx="1.5" dy="2.5" />
                      <feGaussianBlur stdDeviation="2" result="offset-blur" />
                      <feComposite
                        operator="out"
                        in="SourceGraphic"
                        in2="offset-blur"
                        result="inverse"
                      />
                      <feFlood floodColor="#7c90b0" floodOpacity="0.65" result="color" />
                      <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                      <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
                    <linearGradient
                      id={paleBlueMoonId}
                      x1="16"
                      y1="12"
                      x2="48"
                      y2="52"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#b8c9e6" />
                      <stop offset="100%" stopColor="#cedbf0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M40.8 15.2C38.4 14.5 35.8 14.3 33.1 14.7C22.9 16.1 15.8 25.5 17.2 35.7C18.6 45.9 28 53 38.2 51.6C43.6 50.8 48.2 47.8 51.1 43.6C49.5 44.3 47.7 44.8 45.8 45.1C36.8 46.3 28.5 40 27.3 31C26.2 23.4 30.5 16.2 37.5 13.7C38.6 13.3 39.8 14.9 40.8 15.2Z"
                    fill="#ffffff"
                    transform="translate(1, 1.5)"
                    opacity="0.85"
                  />
                  <path
                    d="M40.8 15.2C38.4 14.5 35.8 14.3 33.1 14.7C22.9 16.1 15.8 25.5 17.2 35.7C18.6 45.9 28 53 38.2 51.6C43.6 50.8 48.2 47.8 51.1 43.6C49.5 44.3 47.7 44.8 45.8 45.1C36.8 46.3 28.5 40 27.3 31C26.2 23.4 30.5 16.2 37.5 13.7C38.6 13.3 39.8 14.9 40.8 15.2Z"
                    fill={`url(#${paleBlueMoonId})`}
                    filter={`url(#${recessedMoonId})`}
                  />
                </svg>
              </div>

              {/* Sliding 3D Circular Knob with Metallic Ring */}
              <div className="neo-knob">
                <div className="neo-knob-face">
                  {/* Knob Icon 1: Bright Glowing Yellow Sun (Active in Light Mode) */}
                  <div className="knob-icon-sun">
                    <svg
                      className="w-14 h-14 sun-animate"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <radialGradient id={knobSunGradId} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="32%" stopColor="#FFF380" />
                          <stop offset="75%" stopColor="#FFD026" />
                          <stop offset="100%" stopColor="#FF9900" />
                        </radialGradient>
                      </defs>
                      <circle cx="32" cy="32" r="14.5" fill={`url(#${knobSunGradId})`} />
                      <g fill="#FFDA33">
                        <path d="M32 5.5C33.1 5.5 34.8 11.8 34.8 13.2C34.8 14.1 33.5 14.6 32 14.6C30.5 14.6 29.2 14.1 29.2 13.2C29.2 11.8 30.9 5.5 32 5.5Z" />
                        <path d="M32 58.5C33.1 58.5 34.8 52.2 34.8 50.8C34.8 49.9 33.5 49.4 32 49.4C30.5 49.4 29.2 49.9 29.2 50.8C29.2 52.2 30.9 58.5 32 58.5Z" />
                        <path d="M58.5 32C58.5 33.1 52.2 34.8 50.8 34.8C49.9 34.8 49.4 33.5 49.4 32C49.4 30.5 49.9 29.2 50.8 29.2C52.2 29.2 58.5 30.9 58.5 32Z" />
                        <path d="M5.5 32C5.5 33.1 11.8 34.8 13.2 34.8C14.1 34.8 14.6 33.5 14.6 32C14.6 30.5 14.1 29.2 13.2 29.2C11.8 29.2 5.5 30.9 5.5 32Z" />
                        <path d="M50.7 13.3C51.5 14.1 48.2 19.7 47.2 20.7C46.6 21.3 45.3 20.8 44.2 19.8C43.2 18.7 42.7 17.4 43.3 16.8C44.3 15.8 49.9 12.5 50.7 13.3Z" />
                        <path d="M13.3 50.7C14.1 51.5 19.7 48.2 20.7 47.2C21.3 46.6 20.8 45.3 19.8 44.2C18.7 43.2 17.4 42.7 16.8 43.3C15.8 44.3 12.5 49.9 13.3 50.7Z" />
                        <path d="M50.7 50.7C49.9 51.5 44.3 48.2 43.3 47.2C42.7 46.6 43.2 45.3 44.2 44.2C45.3 43.2 46.6 42.7 47.2 43.3C48.2 44.3 51.5 49.9 50.7 50.7Z" />
                        <path d="M13.3 13.3C12.5 14.1 15.8 19.7 16.8 20.7C17.4 21.3 18.7 20.8 19.8 19.8C20.8 18.7 21.3 17.4 20.7 16.8C19.7 15.8 14.1 12.5 13.3 13.3Z" />
                      </g>
                    </svg>
                  </div>

                  {/* Knob Icon 2: Glowing Light-Blue Crescent Moon + Stars (Active in Dark Mode) */}
                  <div className="knob-icon-moon">
                    <svg
                      className="w-14 h-14"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient
                          id={knobMoonGradId}
                          x1="16"
                          y1="14"
                          x2="46"
                          y2="50"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="45%" stopColor="#B8F1FF" />
                          <stop offset="100%" stopColor="#5CE1FF" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M36.5 14.5C34.2 14.1 31.8 14.1 29.3 14.6C19.6 16.6 13.4 26.1 15.4 35.8C17.4 45.5 26.9 51.7 36.6 49.7C42.2 48.5 46.8 45.1 49.4 40.5C47.5 41.4 45.4 42 43.2 42.3C34.4 43.4 26.4 37.2 25.3 28.4C24.4 21.6 28.1 15.2 34.2 12.5C35.2 12.1 35.8 14.3 36.5 14.5Z"
                        fill={`url(#${knobMoonGradId})`}
                      />
                      <path
                        className="star-1"
                        d="M43 14.5L44.4 18.6L48.5 20L44.4 21.4L43 25.5L41.6 21.4L37.5 20L41.6 18.6L43 14.5Z"
                        fill="#E0F9FF"
                      />
                      <path
                        className="star-2"
                        d="M35.5 22L36.3 24.2L38.5 25L36.3 25.8L35.5 28L34.7 25.8L32.5 25L34.7 24.2L35.5 22Z"
                        fill="#C2F2FF"
                      />
                      <path
                        className="star-3"
                        d="M43.5 28L44.3 30.2L46.5 31L44.3 31.8L43.5 34L42.7 31.8L40.5 31L42.7 30.2L43.5 28Z"
                        fill="#E0F9FF"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2.5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-black/40 border border-white/10 backdrop-blur-md shadow-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                theme === 'light'
                  ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                  : 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
              }`}
            />
            <span className={theme === 'light' ? 'text-slate-900 font-semibold' : 'text-slate-200'}>
              {theme === 'light' ? 'Modo Claro (Light Mode)' : 'Modo Oscuro (Dark Mode)'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
