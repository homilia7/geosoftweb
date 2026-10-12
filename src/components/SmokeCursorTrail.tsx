import React, { useEffect, useRef } from 'react';

/**
 * SmokeCursorTrail.tsx — Cortina de Humo Fluido y Estela Vaporosa para el Cursor
 * Emite volutas de humo etéreo con física de expansión, rotación, turbulencia y desvanecimiento suave.
 * Rendimiento optimizado a 60fps con modo de composición 'screen' y auto-pausa cuando está en reposo.
 */

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  rotation: number;
  spin: number;
  hueType: 'emerald' | 'gold' | 'mist';
}

export const SmokeCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Solo para dispositivos con mouse/puntero fino (ignora pantallas táctiles)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles: SmokeParticle[] = [];
    let lastX = -100;
    let lastY = -100;
    let isMouseMoving = false;
    let moveTimeout: ReturnType<typeof setTimeout>;
    let animId: number | null = null;

    const createParticle = (x: number, y: number, spreadFactor = 1): SmokeParticle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.2 + Math.random() * 0.7) * spreadFactor;
      // Deriva sutil hacia arriba y laterales como el humo real
      const vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3;
      const vy = Math.sin(angle) * speed - (0.15 + Math.random() * 0.4);

      const colorRoll = Math.random();
      const hueType: 'emerald' | 'gold' | 'mist' =
        colorRoll > 0.5 ? 'emerald' : colorRoll > 0.25 ? 'gold' : 'mist';

      const initialRadius = 14 + Math.random() * 12;
      const maxRadius = initialRadius + 45 + Math.random() * 35;

      return {
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx,
        vy,
        radius: initialRadius,
        maxRadius,
        alpha: 0.32 + Math.random() * 0.12,
        maxAlpha: 0.38,
        decay: 0.0075 + Math.random() * 0.006, // Dura entre ~1.2s y 1.8s dejando estela continua
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        hueType,
      };
    };

    const addSmokeAt = (currX: number, currY: number) => {
      if (lastX === -100 || lastY === -100) {
        lastX = currX;
        lastY = currY;
        particles.push(createParticle(currX, currY));
        return;
      }

      // Distancia euclidiana entre el frame anterior y actual
      const dx = currX - lastX;
      const dy = currY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Interpolación continua para que la cortina de humo no tenga huecos si el mouse se mueve rápido
      const stepSize = 8;
      const steps = Math.max(1, Math.min(Math.floor(dist / stepSize), 14));

      for (let i = 0; i < steps; i++) {
        const t = (i + 1) / steps;
        const ix = lastX + dx * t;
        const iy = lastY + dy * t;
        particles.push(createParticle(ix, iy, 1.2));
      }

      lastX = currX;
      lastY = currY;
    };

    const onMouseMove = (e: MouseEvent) => {
      addSmokeAt(e.clientX, e.clientY);
      isMouseMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMouseMoving = false;
        lastX = -100;
        lastY = -100;
      }, 90);

      if (!animId) {
        render();
      }
    };

    const onMouseLeave = () => {
      lastX = -100;
      lastY = -100;
      isMouseMoving = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Si no hay partículas y el mouse no se mueve, dormimos el bucle (0% CPU)
      if (particles.length === 0 && !isMouseMoving) {
        animId = null;
        return;
      }

      ctx.globalCompositeOperation = 'screen';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Física del humo: expansión y elevación
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985; // fricción con el aire
        p.vy *= 0.985;
        p.rotation += p.spin;

        // El radio crece mientras el humo se disipa
        if (p.radius < p.maxRadius) {
          p.radius += (p.maxRadius - p.radius) * 0.035;
        }

        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Gradiente radial difuso que simula una nube de gas/humo
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);

        let colorCore = `rgba(169, 248, 181, ${p.alpha * 0.9})`;
        let colorMid = `rgba(169, 248, 181, ${p.alpha * 0.45})`;

        if (p.hueType === 'gold') {
          colorCore = `rgba(223, 244, 148, ${p.alpha * 0.85})`;
          colorMid = `rgba(193, 163, 91, ${p.alpha * 0.35})`;
        } else if (p.hueType === 'mist') {
          colorCore = `rgba(235, 255, 242, ${p.alpha * 0.7})`;
          colorMid = `rgba(169, 248, 181, ${p.alpha * 0.25})`;
        }

        radGrad.addColorStop(0, colorCore);
        radGrad.addColorStop(0.35, colorMid);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.translate(-p.x, -p.y);

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(moveTimeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9990] w-full h-full"
      aria-hidden="true"
    />
  );
};
