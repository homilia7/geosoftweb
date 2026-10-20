import React, { useId } from 'react';

export interface IslamicGeometricRibbonProps {
  theme: 'light' | 'dark';
  badgeText?: string;
  className?: string;
}

export const IslamicGeometricRibbon: React.FC<IslamicGeometricRibbonProps> = ({
  theme,
  badgeText,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '_');
  const patternId = `islamicPattern_${uid}`;
  const isLight = theme === 'light';

  return (
    <div
      className={`relative w-full h-12 sm:h-13 overflow-hidden shrink-0 flex items-center justify-center select-none ${
        isLight ? 'islamic-ribbon-light' : 'islamic-ribbon-dark'
      } ${className}`}
    >
      {/* Precision Geometric SVG Pattern Background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width="64"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            {/* Center 8-pointed Star Rosette */}
            <polygon
              points="50.00,26.00 39.85,29.25 44.73,38.73 35.25,33.85 32.00,44.00 28.75,33.85 19.27,38.73 24.15,29.25 14.00,26.00 24.15,22.75 19.27,13.27 28.75,18.15 32.00,8.00 35.25,18.15 44.73,13.27 39.85,22.75"
              fill="none"
              stroke={isLight ? 'rgba(255, 255, 255, 0.78)' : 'rgba(169, 248, 181, 0.75)'}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Inner Concentric Circle */}
            <circle
              cx="32"
              cy="26"
              r="5.5"
              fill="none"
              stroke={isLight ? 'rgba(255, 255, 255, 0.65)' : 'rgba(223, 244, 148, 0.7)'}
              strokeWidth="1"
            />
            {/* 4 Corners Corner Stars to Tile Seamlessly */}
            <polygon
              points="18.00,0.00 7.85,3.25 12.73,12.73 3.25,7.85 0.00,18.00 -3.25,7.85 -12.73,12.73 -7.85,3.25 -18.00,0.00 -7.85,-3.25 -12.73,-12.73 -3.25,-7.85 0.00,-18.00 3.25,-7.85 12.73,-12.73 7.85,-3.25"
              fill="none"
              stroke={isLight ? 'rgba(255, 255, 255, 0.78)' : 'rgba(169, 248, 181, 0.75)'}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="82.00,0.00 71.85,3.25 76.73,12.73 67.25,7.85 64.00,18.00 60.75,7.85 51.27,12.73 56.15,3.25 46.00,0.00 56.15,-3.25 51.27,-12.73 60.75,-7.85 64.00,-18.00 67.25,-7.85 76.73,-12.73 71.85,-3.25"
              fill="none"
              stroke={isLight ? 'rgba(255, 255, 255, 0.78)' : 'rgba(169, 248, 181, 0.75)'}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="18.00,52.00 7.85,55.25 12.73,64.73 3.25,59.85 0.00,70.00 -3.25,59.85 -12.73,64.73 -7.85,55.25 -18.00,52.00 -7.85,48.75 -12.73,39.27 -3.25,44.15 0.00,34.00 3.25,44.15 12.73,39.27 7.85,48.75"
              fill="none"
              stroke={isLight ? 'rgba(255, 255, 255, 0.78)' : 'rgba(169, 248, 181, 0.75)'}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="82.00,52.00 71.85,55.25 76.73,64.73 67.25,59.85 64.00,70.00 60.75,59.85 51.27,64.73 56.15,55.25 46.00,52.00 56.15,48.75 51.27,39.27 60.75,44.15 64.00,34.00 67.25,44.15 76.73,39.27 71.85,48.75"
              fill="none"
              stroke={isLight ? 'rgba(255, 255, 255, 0.78)' : 'rgba(169, 248, 181, 0.75)'}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Connecting Lattice Petal Lines */}
            <line
              x1="32"
              y1="8"
              x2="32"
              y2="0"
              stroke={isLight ? 'rgba(255, 255, 255, 0.55)' : 'rgba(169, 248, 181, 0.5)'}
              strokeWidth="1"
            />
            <line
              x1="32"
              y1="44"
              x2="32"
              y2="52"
              stroke={isLight ? 'rgba(255, 255, 255, 0.55)' : 'rgba(169, 248, 181, 0.5)'}
              strokeWidth="1"
            />
            <line
              x1="14"
              y1="26"
              x2="0"
              y2="26"
              stroke={isLight ? 'rgba(255, 255, 255, 0.55)' : 'rgba(169, 248, 181, 0.5)'}
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="26"
              x2="64"
              y2="26"
              stroke={isLight ? 'rgba(255, 255, 255, 0.55)' : 'rgba(169, 248, 181, 0.5)'}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Floating Status Pill Badge on the Ribbon */}
      {badgeText && (
        <div
          className="relative z-10 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md border shadow-sm transition-all flex items-center gap-1.5"
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(8, 12, 16, 0.88)',
            borderColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(169, 248, 181, 0.45)',
            color: isLight ? '#1c506d' : '#DFF494',
            boxShadow: isLight
              ? '0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 1px #fff'
              : '0 2px 8px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: isLight ? '#237299' : '#A9F8B5' }}
          />
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
};
