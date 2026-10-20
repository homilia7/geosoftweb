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
    // En móviles, pantallas pequeñas (<768px) o dispositivos táctiles no existe cursor de ratón suspendido
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cachedHeroRect: { left: number; top: number; width: number; height: number; bottom: number } | null = null;
    let cachedNavRect: { left: number; top: number; width: number; height: number; right: number } | null = null;
    let lastRectQueryTime = 0;

    const updateBoundingTargets = () => {
      const now = Date.now();
      if (now - lastRectQueryTime < 600 && cachedHeroRect) return;
      lastRectQueryTime = now;

      const logoEl = document.getElementById('hero-logo-box');
      if (logoEl) {
        const r = logoEl.getBoundingClientRect();
        cachedHeroRect = { left: r.left, top: r.top, width: r.width, height: r.height, bottom: r.bottom };
      } else {
        cachedHeroRect = null;
      }

      const navEl = document.getElementById('main-nav-capsule');
      if (navEl) {
        const nr = navEl.getBoundingClientRect();
        cachedNavRect = { left: nr.left, top: nr.top, width: nr.width, height: nr.height, right: nr.right };
      } else {
        cachedNavRect = null;
      }
    };

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
      updateBoundingTargets();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', updateBoundingTargets, { passive: true });

    const particles: SmokeParticle[] = [];
    let lastX = -100;
    let lastY = -100;
    let isMouseMoving = false;
    let moveTimeout: ReturnType<typeof setTimeout>;
    let animId: number | null = null;

    // Autopilot en reposo: se activa a los 3.5 segundos de inactividad
    const IDLE_DELAY_MS = 3500;
    let lastUserMoveTime = Date.now();
    let isIdle = false;
    let autopilotPos = { x: -100, y: -100 };
    let orbitAngle = 0;
    let sweepProgress = 0;
    let sweepDir = 1;

    const createParticle = (x: number, y: number, spreadFactor = 1): SmokeParticle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.25 + Math.random() * 0.75) * spreadFactor;
      // Deriva sutil hacia arriba y laterales como el humo real
      const vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 0.35;
      const vy = Math.sin(angle) * speed - (0.15 + Math.random() * 0.45);

      const colorRoll = Math.random();
      const hueType: 'emerald' | 'gold' | 'mist' =
        colorRoll > 0.45 ? 'emerald' : colorRoll > 0.2 ? 'gold' : 'mist';

      const initialRadius = 16 + Math.random() * 12;
      const maxRadius = initialRadius + 45 + Math.random() * 35;

      return {
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx,
        vy,
        radius: initialRadius,
        maxRadius,
        alpha: 0.36 + Math.random() * 0.12,
        maxAlpha: 0.42,
        decay: 0.0075 + Math.random() * 0.006, // Deja estela continua de ~1.5 segundos
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

      // Si la distancia es muy grande (salto brusco al retomar el mouse), reiniciar sin línea cruzada
      if (dist > 180) {
        lastX = currX;
        lastY = currY;
        particles.push(createParticle(currX, currY));
        return;
      }

      // Interpolación continua para que la estela no tenga cortes
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

    let hasUserInteracted = false;

    const onMouseMove = (e: MouseEvent) => {
      lastUserMoveTime = Date.now();
      if (!hasUserInteracted) {
        hasUserInteracted = true;
        animId = requestAnimationFrame(render);
      }
      if (isIdle) {
        isIdle = false;
        autopilotPos = { x: -100, y: -100 };
        lastX = e.clientX;
        lastY = e.clientY;
      }

      addSmokeAt(e.clientX, e.clientY);
      isMouseMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMouseMoving = false;
        lastX = -100;
        lastY = -100;
      }, 90);
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

      const now = Date.now();
      // Si pasan más de 1.0s sin interacción del usuario, activar modo reposo / autopilot
      if (!isMouseMoving && now - lastUserMoveTime >= IDLE_DELAY_MS) {
        isIdle = true;
      }

      // ================= LÓGICA DE AUTOPILOT EN REPOSO =================
      if (isIdle) {
        updateBoundingTargets();
        let inHeroView = false;
        const logoRect = cachedHeroRect;

        if (logoRect) {
          // El cuadro del logo está en vista si está dentro del viewport visible
          if (logoRect.bottom > 80 && logoRect.top < height - 80) {
            inHeroView = true;
          }
        }

        let targetX = 0;
        let targetY = 0;

        if (inHeroView && logoRect) {
          // ESTADO 1: Vista Hero -> Circula alrededor del cuadro del logo 3D de GeoSoft
          const cx = logoRect.left + logoRect.width / 2;
          const cy = logoRect.top + logoRect.height / 2;
          const rx = logoRect.width / 2 + 18;
          const ry = logoRect.height / 2 + 18;

          orbitAngle += 0.028;
          const cosT = Math.cos(orbitAngle);
          const sinT = Math.sin(orbitAngle);
          // Curva squircle que bordea de forma armoniosa el contenedor redondeado
          targetX = cx + rx * Math.sign(cosT) * Math.pow(Math.abs(cosT), 0.72);
          targetY = cy + ry * Math.sign(sinT) * Math.pow(Math.abs(sinT), 0.72);
        } else {
          // ESTADO 2: Abajo en otra sección de la web -> Recorre el menú superior de lado a lado
          let navLeft = 80;
          let navRight = width - 80;
          let navY = 32;

          if (cachedNavRect) {
            navLeft = Math.max(30, cachedNavRect.left + 24);
            navRight = Math.min(width - 30, cachedNavRect.right - 24);
            navY = cachedNavRect.top + cachedNavRect.height / 2;
          }

          sweepProgress += 0.009 * sweepDir;
          if (sweepProgress >= 1) {
            sweepProgress = 1;
            sweepDir = -1;
          } else if (sweepProgress <= 0) {
            sweepDir = 1;
          }

          // Easing sinusoidal suave para desacelerar y retornar en los extremos
          const eased = (1 - Math.cos(sweepProgress * Math.PI)) / 2;
          targetX = navLeft + (navRight - navLeft) * eased;
          targetY = navY + Math.sin(sweepProgress * Math.PI * 4) * 2.5;
        }

        if (autopilotPos.x === -100 || autopilotPos.y === -100) {
          autopilotPos = { x: targetX, y: targetY };
          lastX = targetX;
          lastY = targetY;
        } else {
          autopilotPos.x += (targetX - autopilotPos.x) * 0.45;
          autopilotPos.y += (targetY - autopilotPos.y) * 0.45;
        }

        addSmokeAt(autopilotPos.x, autopilotPos.y);
      }

      // Dibujar partículas activas
      if (particles.length > 0) {
        const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');
        ctx.globalCompositeOperation = isLight ? 'source-over' : 'screen';

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];

          // Física del humo: expansión y elevación
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.rotation += p.spin;

          if (p.radius < p.maxRadius) {
            p.radius += (p.maxRadius - p.radius) * 0.035;
          }

          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);

          let colorCore = isLight ? `rgba(5, 150, 105, ${p.alpha * 0.35})` : `rgba(169, 248, 181, ${p.alpha * 0.95})`;
          let colorMid = isLight ? `rgba(100, 116, 139, ${p.alpha * 0.16})` : `rgba(169, 248, 181, ${p.alpha * 0.5})`;

          if (p.hueType === 'gold') {
            colorCore = isLight ? `rgba(217, 119, 6, ${p.alpha * 0.3})` : `rgba(223, 244, 148, ${p.alpha * 0.9})`;
            colorMid = isLight ? `rgba(180, 83, 9, ${p.alpha * 0.14})` : `rgba(193, 163, 91, ${p.alpha * 0.4})`;
          } else if (p.hueType === 'mist') {
            colorCore = isLight ? `rgba(148, 163, 184, ${p.alpha * 0.28})` : `rgba(235, 255, 242, ${p.alpha * 0.8})`;
            colorMid = isLight ? `rgba(71, 85, 105, ${p.alpha * 0.12})` : `rgba(169, 248, 181, ${p.alpha * 0.3})`;
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
      }

      // El bucle de animación se mantiene activo permanentemente
      animId = requestAnimationFrame(render);
    };


    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateBoundingTargets);
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
