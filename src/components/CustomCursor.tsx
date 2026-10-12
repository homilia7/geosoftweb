import React, { useEffect, useState, useRef } from 'react';

/**
 * CustomCursor.tsx — Puntero y Halo Magnético Fluido de Alta Gama
 * Sigue el movimiento del mouse con física elástica (lerp) y reacciona a botones y clics.
 * Desactivado automáticamente en dispositivos móviles y táctiles.
 */
export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Comprobar soporte de ratón/puntero fino (no táctil)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Posicionamiento inmediato del punto central para precisión absoluta
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Detectar si el elemento actual es interactivo
      const target = (e.target as HTMLElement)?.closest?.(
        'button, a, [role="button"], .cursor-pointer, input, textarea, select'
      );
      setIsHovering(Boolean(target));
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Bucle de animación suave con interpolación lineal (lerp = 0.18)
    const renderLoop = () => {
      const lerp = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (!isSupported) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. Halo / Anillo orbital con inercia elástica */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 pointer-events-none will-change-transform"
      >
        <div
          className={`w-8 h-8 rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
            isClicking
              ? 'scale-75 border-[#DFF494] bg-[#DFF494]/20 shadow-[0_0_12px_rgba(223,244,148,0.5)]'
              : isHovering
              ? 'scale-175 border-[#A9F8B5] bg-[#A9F8B5]/15 shadow-[0_0_20px_rgba(169,248,181,0.4)] backdrop-blur-[1px]'
              : 'scale-100 border-[#A9F8B5]/40 bg-[#A9F8B5]/5'
          }`}
        />
      </div>

      {/* 2. Punto central de precisión nítida */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 pointer-events-none will-change-transform"
      >
        <div
          className={`w-2 h-2 rounded-full transition-transform duration-150 ease-out ${
            isClicking
              ? 'scale-50 bg-[#DFF494]'
              : isHovering
              ? 'scale-150 bg-[#A9F8B5] shadow-[0_0_8px_#A9F8B5]'
              : 'scale-100 bg-[#A9F8B5]'
          }`}
        />
      </div>
    </div>
  );
};
