import React, { useState, useEffect } from 'react';

interface RotatingHeadlineProps {
  phrases?: string[];
  className?: string;
}

const DEFAULT_PHRASES = [
  'Software, Webs e IA que Multiplican tus Ventas',
  'Agentes de Inteligencia Artificial Activos 24/7',
  'Sistemas y Plataformas Web de Alto Rendimiento',
  'Automatizaciones Inteligentes para tu Negocio'
];

export const RotatingHeadline: React.FC<RotatingHeadlineProps> = ({
  phrases = DEFAULT_PHRASES,
  className = 'text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] font-bold tracking-tight leading-[1.2] font-display text-white'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const tick = () => {
      clearTimeout(timer);
      if (media.matches || document.hidden) {
        setNextIndex(null);
      } else if (nextIndex === null) {
        timer = setTimeout(() => {
          setNextIndex((currentIndex + 1) % phrases.length);
        }, 4500);
      }
    };

    tick();
    media.addEventListener('change', tick);
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearTimeout(timer);
      media.removeEventListener('change', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [currentIndex, nextIndex, phrases.length]);

  return (
    <h1 className={className}>
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden="true" className="rotating-headline-container">
        {phrases.map((phrase) => (
          <span key={phrase} className="rotating-headline-phrase rotating-headline-measure">
            {phrase}
          </span>
        ))}

        <span className="rotating-headline-phrase">
          <span
            className={
              nextIndex !== null
                ? 'rotating-headline-text rotating-headline-outgoing'
                : 'rotating-headline-text'
            }
          >
            {phrases[currentIndex]}
          </span>
        </span>

        {nextIndex !== null && (
          <span className="rotating-headline-phrase">
            <span
              className="rotating-headline-text rotating-headline-incoming"
              onAnimationEnd={() => {
                setCurrentIndex(nextIndex);
                setNextIndex(null);
              }}
            >
              {phrases[nextIndex]}
            </span>
          </span>
        )}
      </span>
    </h1>
  );
};
