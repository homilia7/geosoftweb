import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Mouse,
  ArrowRight,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export interface ThreeScrollyCameraProps {
  onScrollToQuote: () => void;
  onOpenBooking?: () => void;
}

interface CameraStage {
  progress: number;
  badge: string;
  category: string;
  title: string;
  description: string;
  accentColor: string;
  features: string[];
}

const STAGES: CameraStage[] = [
  {
    progress: 0.15,
    badge: 'ARQUITECTURA DIGITAL 3D',
    category: 'Ecosistema Tecnológico',
    title: 'Cubo Holográfico de Ingeniería',
    description:
      'Renderizado 3D en tiempo real sobre WebGL a 120 FPS. Estructura monolítica con carcasa de cristal esmeralda y refracción física.',
    accentColor: '#A9F8B5',
    features: ['100% WebGL / Three.js', 'Cero Cortes de Video', 'Física de Cristal IOR 1.54']
  },
  {
    progress: 0.4,
    badge: 'VIAJE AL INTERIOR DEL NÚCLEO',
    category: 'Malla Holográfica Cuántica',
    title: 'Penetración de Cámara & Agentes IA',
    description:
      'La cámara atraviesa la superficie translúcida hacia la matriz de red interior donde operan los modelos de IA y flujos autónomos 24/7.',
    accentColor: '#38bdf8',
    features: ['Malla Quad 16x16 Neón', 'Chatbots WhatsApp Cloud', 'Latencia de Respuesta < 2s']
  },
  {
    progress: 0.65,
    badge: 'MORFISMO & ESTRUCTURA HUECA',
    category: 'Transformación de Geometría',
    title: 'Sistemas SaaS & Validación Sinpe Móvil',
    description:
      'El cubo se expande dinámicamente transformándose en un marco de diamante hueco biselado, simbolizando la apertura del ecosistema en la nube.',
    accentColor: '#fb923c',
    features: ['Plataformas Multi-Tenant', 'Validación Bancaria Sinpe', 'Contenido DRM Blindado']
  },
  {
    progress: 0.9,
    badge: 'EXPANSIÓN TOTAL',
    category: 'Ecosistema Empresarial',
    title: 'Software a la Medida de Alto Impacto',
    description:
      'La cámara emerge hacia la constelación de nodos interconectados. Soluciones desarrolladas con código propietario para tu empresa.',
    accentColor: '#c084fc',
    features: ['$0 por Usuario Extra', 'Propiedad Total del Código', 'Soporte Local Costa Rica']
  }
];

export const ThreeScrollyCamera: React.FC<ThreeScrollyCameraProps> = ({
  onScrollToQuote,
  onOpenBooking
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 a 1
  const [targetProgress, setTargetProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFreeOrbit, setIsFreeOrbit] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Referencias Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const outerCubeRef = useRef<THREE.Mesh | null>(null);
  const hollowFrameGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Inicialización de la Escena 3D
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (isFullscreen ? window.innerHeight : 540);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x04060a);
    scene.fog = new THREE.FogExp2(0x04060a, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.4;
    controls.maxDistance = 14;
    controls.enabled = isFreeOrbit;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0x07281f, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x38f9d7, 4.5, 12);
    cyanRim.position.set(-5, 3, -4);
    scene.add(cyanRim);

    const emeraldCore = new THREE.PointLight(0xa9f8b5, 5.5, 8);
    emeraldCore.position.set(0, 0, 0);
    scene.add(emeraldCore);
    coreLightRef.current = emeraldCore;

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    cubeGroupRef.current = mainGroup;

    // Cristal Esmeralda Translúcido
    const outerSize = 1.8;
    const outerGeo = new THREE.BoxGeometry(outerSize, outerSize, outerSize);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x4ff0b5,
      emissive: 0x064e3b,
      emissiveIntensity: 0.25,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.88,
      thickness: 1.6,
      attenuationColor: 0x10b981,
      attenuationDistance: 1.2,
      ior: 1.54,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.85
    });
    const outerCube = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerCube);
    outerCubeRef.current = outerCube;

    // Rejilla Quad Holográfica Interior
    const innerGridGroup = new THREE.Group();
    const faceSize = 1.65;
    const divisions = 14;
    const step = faceSize / divisions;
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x38f9d7,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const createFaceGrid = (normalAxis: 'x' | 'y' | 'z', offset: number) => {
      const points: THREE.Vector3[] = [];
      const half = faceSize / 2;
      for (let i = 0; i <= divisions; i++) {
        const coord = -half + i * step;
        if (normalAxis === 'z') {
          points.push(new THREE.Vector3(-half, coord, offset), new THREE.Vector3(half, coord, offset));
          points.push(new THREE.Vector3(coord, -half, offset), new THREE.Vector3(coord, half, offset));
        } else if (normalAxis === 'x') {
          points.push(new THREE.Vector3(offset, -half, coord), new THREE.Vector3(offset, half, coord));
          points.push(new THREE.Vector3(offset, coord, -half), new THREE.Vector3(offset, coord, half));
        } else {
          points.push(new THREE.Vector3(-half, offset, coord), new THREE.Vector3(half, offset, coord));
          points.push(new THREE.Vector3(coord, offset, -half), new THREE.Vector3(coord, offset, half));
        }
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.LineSegments(geo, gridMat);
    };

    const halfDist = faceSize / 2;
    innerGridGroup.add(createFaceGrid('z', halfDist));
    innerGridGroup.add(createFaceGrid('z', -halfDist));
    innerGridGroup.add(createFaceGrid('x', halfDist));
    innerGridGroup.add(createFaceGrid('x', -halfDist));
    innerGridGroup.add(createFaceGrid('y', halfDist));
    innerGridGroup.add(createFaceGrid('y', -halfDist));
    mainGroup.add(innerGridGroup);

    // Marco de Diamante Hueco (Morfismo del video)
    const hollowGroup = new THREE.Group();
    const barMat = new THREE.MeshPhysicalMaterial({
      color: 0x38f9d7,
      emissive: 0x064e3b,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.2,
      transmission: 0.75,
      thickness: 0.8,
      ior: 1.5,
      transparent: true,
      opacity: 0.95
    });

    const barRadius = 0.1;
    const barLength = 1.9;
    const barGeo = new THREE.CylinderGeometry(barRadius, barRadius, barLength, 16);

    const barCoords: [number, number, number, number, number, number][] = [
      [0, 0.9, 0.9, 0, 0, Math.PI / 2],
      [0, -0.9, 0.9, 0, 0, Math.PI / 2],
      [0.9, 0, 0.9, 0, 0, 0],
      [-0.9, 0, 0.9, 0, 0, 0],
      [0, 0.9, -0.9, 0, 0, Math.PI / 2],
      [0, -0.9, -0.9, 0, 0, Math.PI / 2],
      [0.9, 0, -0.9, 0, 0, 0],
      [-0.9, 0, -0.9, 0, 0, 0],
      [0.9, 0.9, 0, Math.PI / 2, 0, 0],
      [-0.9, 0.9, 0, Math.PI / 2, 0, 0],
      [0.9, -0.9, 0, Math.PI / 2, 0, 0],
      [-0.9, -0.9, 0, Math.PI / 2, 0, 0]
    ];

    barCoords.forEach(([x, y, z, rx, ry, rz]) => {
      const mesh = new THREE.Mesh(barGeo, barMat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      hollowGroup.add(mesh);
    });

    hollowGroup.visible = false;
    mainGroup.add(hollowGroup);
    hollowFrameGroupRef.current = hollowGroup;

    // Nube de Partículas Cósmicas
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 16;
      particlePos[i + 1] = (Math.random() - 0.5) * 16;
      particlePos[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xa9f8b5,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (mainGroup) {
        mainGroup.rotation.y = elapsedTime * 0.15 + scrollProgress * Math.PI * 1.5;
        mainGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1 + scrollProgress * 0.6;
      }

      if (particles) {
        particles.rotation.y = elapsedTime * 0.04;
      }

      if (coreLightRef.current) {
        coreLightRef.current.intensity = 4.5 + Math.sin(elapsedTime * 3) * 1.5;
      }

      if (!isFreeOrbit && camera) {
        const p = scrollProgress;
        let camX = 0;
        let camY = 0;
        let camZ = 5.5;
        let targetY = 0;

        if (p < 0.4) {
          const t = p / 0.4;
          camX = Math.sin(t * Math.PI * 0.5) * 0.4;
          camY = 0.4 * (1 - t) + 0.1 * t;
          camZ = 5.5 * (1 - t) + 1.2 * t;
        } else if (p < 0.75) {
          const t = (p - 0.4) / 0.35;
          camX = 0.4 * (1 - t) + 0.1 * t;
          camY = 0.1 * (1 - t) + 0.2 * t;
          camZ = 1.2 * (1 - t) - 0.5 * t;
        } else {
          const t = (p - 0.75) / 0.25;
          camX = 0.1 * (1 - t) - 1.2 * t;
          camY = 0.2 * (1 - t) + 0.6 * t;
          camZ = -0.5 * (1 - t) - 4.8 * t;
          targetY = 0.3 * t;
        }

        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, targetY, 0);

        if (p > 0.55) {
          const morphT = Math.min(1, (p - 0.55) / 0.25);
          if (outerCubeRef.current) outerCubeRef.current.scale.setScalar(1 - morphT * 0.4);
          if (hollowFrameGroupRef.current) {
            hollowFrameGroupRef.current.visible = true;
            hollowFrameGroupRef.current.scale.setScalar(morphT);
          }
        } else {
          if (outerCubeRef.current) outerCubeRef.current.scale.setScalar(1);
          if (hollowFrameGroupRef.current) hollowFrameGroupRef.current.visible = false;
        }
      } else if (isFreeOrbit && controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || (isFullscreen ? window.innerHeight : 540);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [isFreeOrbit, isFullscreen]);

  // Listener NATIVO para Wheel y Touch con { passive: false } para BLOQUEAR 100% el scroll de la web
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Bloquear estrictamente el scroll vertical de la ventana
      e.preventDefault();
      e.stopPropagation();

      if (isFreeOrbit) return;
      if (isPlaying) setIsPlaying(false);

      const step = e.deltaY > 0 ? 0.035 : -0.035;
      setTargetProgress((prev) => Math.max(0, Math.min(1, prev + step)));
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isFreeOrbit) return;
      setTouchStartY(e.touches[0].clientY);
      if (isPlaying) setIsPlaying(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isFreeOrbit || touchStartY === null) return;
      e.preventDefault();
      e.stopPropagation();

      const currentY = e.touches[0].clientY;
      const diff = touchStartY - currentY;

      if (Math.abs(diff) > 4) {
        const step = diff / 320;
        setTargetProgress((prev) => Math.max(0, Math.min(1, prev + step)));
        setTouchStartY(currentY);
      }
    };

    const onTouchEnd = () => {
      setTouchStartY(null);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [isFreeOrbit, isPlaying, touchStartY, isFullscreen]);

  // Bloqueo total del scroll del navegador y tecla Escape al estar en Pantalla Completa
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          soundEffects.playClick();
          setIsFullscreen(false);
          try {
            if (document.fullscreenElement && document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            }
          } catch (err) {}
        }
      };

      const handleGlobalWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (isFreeOrbit) return;
        const step = e.deltaY > 0 ? 0.035 : -0.035;
        setTargetProgress((prev) => Math.max(0, Math.min(1, prev + step)));
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('wheel', handleGlobalWheel, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('wheel', handleGlobalWheel);
      };
    }
  }, [isFullscreen, isFreeOrbit]);

  // Interpolación de avance suave (Smooth Lerp)
  useEffect(() => {
    let animId: number;

    const lerpLoop = () => {
      if (isPlaying) {
        setTargetProgress((prev) => {
          const next = prev + 0.004;
          return next > 1 ? 0 : next;
        });
      }

      setScrollProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.001) return targetProgress;
        return prev + diff * 0.2;
      });

      animId = requestAnimationFrame(lerpLoop);
    };

    animId = requestAnimationFrame(lerpLoop);
    return () => cancelAnimationFrame(animId);
  }, [targetProgress, isPlaying]);

  const toggleFullscreen = () => {
    soundEffects.playClick();
    const next = !isFullscreen;
    setIsFullscreen(next);

    if (next) {
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (err) {}
    } else {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch (err) {}
    }
  };

  const activeStage =
    STAGES.find((s, idx) => {
      const nextP = STAGES[idx + 1]?.progress ?? 1.1;
      return scrollProgress <= nextP;
    }) || STAGES[STAGES.length - 1];

  const currentPercent = Math.round(scrollProgress * 100);

  // Render del contenido (compartido entre modo normal y modo portal fullscreen)
  const viewerContent = (
    <div
      className={`relative w-full overflow-hidden bg-[#04060a] transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen rounded-none border-none flex flex-col justify-between'
          : 'rounded-2xl border border-white/20 shadow-2xl'
      }`}
    >
      {/* Barra Superior */}
      <div className="bg-[#080d18]/95 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-white/10 flex items-center justify-between z-30 relative backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#A9F8B5]" />
            <span className="text-xs font-mono font-bold text-white tracking-wide">
              {isFullscreen ? 'Pantalla Completa Inmersiva • Three.js 120 FPS' : 'Opción 1: Three.js 3D en Vivo • 120 FPS'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Alternar Órbita Libre */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsFreeOrbit(!isFreeOrbit);
              if (controlsRef.current) {
                controlsRef.current.enabled = !isFreeOrbit;
              }
            }}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isFreeOrbit
                ? 'bg-[#A9F8B5] text-black border-[#A9F8B5]'
                : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title={isFreeOrbit ? 'Volver a viaje guiado por scroll' : 'Girar y explorar libremente en 360°'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFreeOrbit ? 'Órbita Libre 360°' : 'Cámara Guiada'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-gray-300">
            <span>Progreso:</span>
            <span className="text-[#A9F8B5] font-bold">{currentPercent}%</span>
          </div>

          {/* Botón de Agrandar / Salir */}
          <button
            onClick={toggleFullscreen}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
              isFullscreen
                ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200'
                : 'bg-[#A9F8B5] text-black hover:bg-[#DFF494] shadow-[#A9F8B5]/25'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Agrandar a Pantalla Completa Inmersiva'}
          >
            {isFullscreen ? (
              <>
                <X className="w-4 h-4" />
                <span>Salir (Esc)</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Agrandar Pantalla</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Área del Canvas Interactivo */}
      <div
        ref={scrollAreaRef}
        className={`relative w-full select-none overflow-hidden touch-none flex-1 ${
          isFullscreen ? 'h-full min-h-0' : 'aspect-video min-h-[380px] sm:min-h-[480px] md:min-h-[540px]'
        }`}
      >
        <div ref={mountRef} className="w-full h-full block" />

        {/* Gradiente Perimetral */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#04060a] via-transparent to-black/30" />

        {/* HUD Cinemático */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl bg-[#080d18]/90 backdrop-blur-xl border border-white/20 shadow-2xl z-20 pointer-events-auto transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${activeStage.accentColor}25`,
                color: activeStage.accentColor
              }}
            >
              {activeStage.badge}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-mono">
              {activeStage.category}
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-extrabold text-white font-display tracking-tight leading-tight mb-2">
            {activeStage.title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4 line-clamp-3">
            {activeStage.description}
          </p>

          <div className="space-y-1.5 mb-4">
            {activeStage.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-200">
                <CheckCircle2
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: activeStage.accentColor }}
                />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                if (isFullscreen) setIsFullscreen(false);
                onScrollToQuote();
              }}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#A9F8B5] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#DFF494] transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#A9F8B5]/20"
            >
              <span>Cotizar Solución</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onOpenBooking && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  if (isFullscreen) setIsFullscreen(false);
                  onOpenBooking();
                }}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Agendar Demo
              </button>
            )}
          </div>
        </div>

        {/* Prompt Indicador de Scroll */}
        {!isFreeOrbit && (
          <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 bg-[#080d18]/90 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-xs text-white z-20 pointer-events-none shadow-xl">
            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[#A9F8B5]">
              <Mouse className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="font-semibold text-[11px] sm:text-xs text-white flex items-center gap-1.5">
                <span>Rueda del mouse controla la cámara</span>
                <span className="text-[#A9F8B5]">↕</span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-400">
                La página no baja; el scroll avanza la animación
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra Inferior de Scrubbing */}
      <div className="bg-[#080d18]/95 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-white/10 flex flex-col gap-2.5 z-30 relative backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
            title={isPlaying ? 'Pausar recorrido' : 'Reproducir viaje continuo de cámara'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#A9F8B5]" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsPlaying(false);
              setTargetProgress(0);
              setScrollProgress(0);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer shrink-0"
            title="Reiniciar viaje al punto inicial"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="relative flex-1 flex items-center py-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={targetProgress}
              onChange={(e) => {
                if (isPlaying) setIsPlaying(false);
                setTargetProgress(parseFloat(e.target.value));
              }}
              className="w-full h-2 rounded-lg bg-white/10 appearance-none cursor-pointer accent-[#A9F8B5] transition-all"
            />
          </div>

          <div className="font-mono text-xs text-gray-400 shrink-0 min-w-[55px] text-right">
            <span className="text-white font-bold">{currentPercent}%</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Etapas 3D:
          </span>
          {STAGES.map((stg, idx) => {
            const isActive = Math.abs(scrollProgress - stg.progress) < 0.15;
            return (
              <button
                key={idx}
                onClick={() => {
                  soundEffects.playClick();
                  if (isPlaying) setIsPlaying(false);
                  setTargetProgress(stg.progress);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-white/15 text-white border-white/30 font-bold shadow-sm'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                  style={{ backgroundColor: stg.accentColor }}
                />
                {stg.title.split('&')[0].replace('Cubo Holográfico de', 'Cubo').trim()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Si está en pantalla completa, usar createPortal en document.body para evitar cualquier contención CSS de padres
  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(viewerContent, document.body);
  }

  return viewerContent;
};
