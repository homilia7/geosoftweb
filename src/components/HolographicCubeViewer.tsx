import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  Box,
  Layers,
  Eye,
  Maximize2
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface HolographicCubeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HolographicCubeViewer: React.FC<HolographicCubeViewerProps> = ({
  isOpen,
  onClose
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFlyThroughRunning, setIsFlyThroughRunning] = useState(false);
  const [isMorphed, setIsMorphed] = useState(false);
  const [showWireframe, setShowWireframe] = useState(true);
  const [activeModelName, setActiveModelName] = useState<string>('Cubo Holográfico Esmeralda P2.0');
  const [vertexCount, setVertexCount] = useState<string>('965,525 / 965,525');
  const [fpsCounter, setFpsCounter] = useState<number>(60);

  // Referencias a controladores 3D
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const outerCubeRef = useRef<THREE.Mesh | null>(null);
  const innerGridGroupRef = useRef<THREE.Group | null>(null);
  const hollowFrameGroupRef = useRef<THREE.Group | null>(null);
  const flyThroughRef = useRef<{ active: boolean; startTime: number }>({ active: false, startTime: 0 });
  const morphProgressRef = useRef<number>(0);
  const customModelRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. ESCENA, CÁMARA Y RENDERER
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x05070a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Controles orbitales con inercia
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.3;
    controls.maxDistance = 15;
    controlsRef.current = controls;

    // 2. SISTEMA DE ILUMINACIÓN HOLOGRÁFICA
    const ambientLight = new THREE.AmbientLight(0x06281e, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x38f9d7, 4.5, 12);
    cyanRim.position.set(-5, 3, -4);
    scene.add(cyanRim);

    const emeraldCore = new THREE.PointLight(0xa9f8b5, 5.0, 8);
    emeraldCore.position.set(0, 0, 0);
    scene.add(emeraldCore);

    // 3. GRUPO PRINCIPAL DEL CUBO
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    cubeGroupRef.current = mainGroup;

    // A. CUBO EXTERIOR DE CRISTAL / ESMERALDA TRANSLÚCIDO
    const outerSize = 1.8;
    const outerGeo = new THREE.BoxGeometry(outerSize, outerSize, outerSize, 1, 1, 1);
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
      opacity: 0.85,
      depthWrite: false
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerMesh);
    outerCubeRef.current = outerMesh;

    // B. LÍNEAS DE ARISTA EXTERIOR
    const edgesGeo = new THREE.EdgesGeometry(outerGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xa9f8b5,
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    mainGroup.add(edgesMesh);

    // C. REJILLA QUAD HOLOGRÁFICA INTERIOR (IDÉNTICA AL VIDEO)
    const innerGridGroup = new THREE.Group();
    mainGroup.add(innerGridGroup);
    innerGridGroupRef.current = innerGridGroup;

    const gridSize = 1.76;
    const gridDivisions = 16;
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x5ef2c0,
      transparent: true,
      opacity: 0.45
    });

    // 6 Rejillas en cada cara interior
    const faceOffsets = [
      { pos: [0, 0, gridSize / 2], rot: [0, 0, 0] },
      { pos: [0, 0, -gridSize / 2], rot: [0, Math.PI, 0] },
      { pos: [gridSize / 2, 0, 0], rot: [0, Math.PI / 2, 0] },
      { pos: [-gridSize / 2, 0, 0], rot: [0, -Math.PI / 2, 0] },
      { pos: [0, gridSize / 2, 0], rot: [Math.PI / 2, 0, 0] },
      { pos: [0, -gridSize / 2, 0], rot: [-Math.PI / 2, 0, 0] }
    ];

    faceOffsets.forEach(({ pos, rot }) => {
      const planeGrid = new THREE.GridHelper(gridSize, gridDivisions, 0x5ef2c0, 0x1f664a);
      planeGrid.position.set(pos[0], pos[1], pos[2]);
      planeGrid.rotation.set(rot[0], rot[1], rot[2]);
      innerGridGroup.add(planeGrid);
    });

    // Pilares esquineros internos (Columnas cibernéticas)
    const pillarMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.4,
      roughness: 0.1,
      transmission: 0.75,
      thickness: 1.0,
      transparent: true,
      opacity: 0.6
    });

    const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.76, 8);
    const cornerOffsets = [
      [-0.85, 0, -0.85],
      [0.85, 0, -0.85],
      [-0.85, 0, 0.85],
      [0.85, 0, 0.85]
    ];
    cornerOffsets.forEach(([px, py, pz]) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, py, pz);
      innerGridGroup.add(pillar);
    });

    // D. MARCO HUECO PRISMÁTICO (TRANSFORMACIÓN / MORPHING DEL VIDEO)
    const hollowGroup = new THREE.Group();
    hollowGroup.visible = false;
    mainGroup.add(hollowGroup);
    hollowFrameGroupRef.current = hollowGroup;

    // Crear 4 barras biseladas que forman el marco romboidal hueco
    const barGeo = new THREE.BoxGeometry(0.24, 1.8, 0.24);
    const barMat = new THREE.MeshPhysicalMaterial({
      color: 0x36e2b4,
      roughness: 0.06,
      metalness: 0.2,
      transmission: 0.85,
      thickness: 1.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.92
    });

    const barEdgesMat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.9 });
    const barPositions = [
      { pos: [-0.78, 0, 0], rot: [0, 0, 0] },
      { pos: [0.78, 0, 0], rot: [0, 0, 0] },
      { pos: [0, 0.78, 0], rot: [0, 0, Math.PI / 2] },
      { pos: [0, -0.78, 0], rot: [0, 0, Math.PI / 2] }
    ];

    barPositions.forEach(({ pos, rot }) => {
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(pos[0], pos[1], pos[2]);
      bar.rotation.set(rot[0], rot[1], rot[2]);
      const barEdge = new THREE.LineSegments(new THREE.EdgesGeometry(barGeo), barEdgesMat);
      bar.add(barEdge);
      hollowGroup.add(bar);
    });

    // 4. BUCLE DE RENDERIZADO Y ANIMACIÓN
    let animationId: number;
    const clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastFpsUpdate >= 1000) {
        setFpsCounter(frameCount);
        frameCount = 0;
        lastFpsUpdate = now;
      }

      // Animación de mixer si hay modelo GLB cargado
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // A. CINEMÁTICA FLY-THROUGH (REPLICA EXACTA DEL VIDEO)
      if (flyThroughRef.current.active) {
        const flyElapsed = (now - flyThroughRef.current.startTime) / 1000;
        const totalFlyDuration = 6.0;

        if (flyElapsed <= totalFlyDuration) {
          const t = flyElapsed / totalFlyDuration;

          // Curva de avance: entra al interior del cubo (Z: 5.5 -> 0.15) y luego retrocede suave
          let camZ = 5.5;
          let camRotY = 0;

          if (t < 0.45) {
            // Fase 1: Zoom In profundo penetrando las paredes de cristal
            const progress = t / 0.45;
            const ease = Math.sin((progress * Math.PI) / 2);
            camZ = 5.5 - ease * 5.25; // Llega a Z = 0.25 (Dentro de la rejilla interna)
            camera.fov = 45 - ease * 12; // Efecto gran angular interior
            camera.updateProjectionMatrix();
          } else if (t < 0.65) {
            // Fase 2: Giro panorámico interior viendo la rejilla verde holográfica
            camZ = 0.25;
            const innerProgress = (t - 0.45) / 0.2;
            camRotY = innerProgress * Math.PI * 0.8;
          } else {
            // Fase 3: Zoom Out regresando a la vista isométrica exterior
            const outProgress = (t - 0.65) / 0.35;
            const easeOut = 1 - Math.cos((outProgress * Math.PI) / 2);
            camZ = 0.25 + easeOut * 5.25;
            camRotY = (1 - easeOut) * Math.PI * 0.8;
            camera.fov = 33 + easeOut * 12;
            camera.updateProjectionMatrix();
          }

          camera.position.set(Math.sin(camRotY) * camZ, 0, Math.cos(camRotY) * camZ);
          camera.lookAt(0, 0, 0);
          controls.enabled = false;
        } else {
          flyThroughRef.current.active = false;
          setIsFlyThroughRunning(false);
          controls.enabled = true;
        }
      } else {
        controls.update();

        // Rotación suave del cubo cuando no se está interactuando fuertemente
        if (mainGroup && !customModelRef.current) {
          mainGroup.rotation.y += delta * 0.35;
          mainGroup.rotation.x += delta * 0.15;
        }
      }

      // B. MORPHING SUAVE (TRANSICIÓN A MARCO PRISMÁTICO HUECO)
      const targetMorph = isMorphed ? 1.0 : 0.0;
      morphProgressRef.current = THREE.MathUtils.lerp(morphProgressRef.current, targetMorph, delta * 4.0);
      const m = morphProgressRef.current;

      if (outerMesh && hollowGroup && innerGridGroup) {
        outerMesh.scale.setScalar(1 - m * 0.7);
        outerMesh.visible = m < 0.95;
        innerGridGroup.scale.setScalar(1 - m * 0.5);
        innerGridGroup.visible = m < 0.95 && showWireframe;

        hollowGroup.visible = m > 0.05;
        hollowGroup.scale.setScalar(0.2 + m * 0.8);
        hollowGroup.rotation.z = m * (Math.PI / 4); // Rotación a rombo como en el video
      }

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [isOpen, isMorphed, showWireframe]);

  // Manejador de vuelo de cámara
  const triggerFlyThrough = () => {
    soundEffects.playClick();
    if (!cameraRef.current) return;
    setIsFlyThroughRunning(true);
    flyThroughRef.current = {
      active: true,
      startTime: performance.now()
    };
  };

  // Manejador de carga de archivo GLB local
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const loader = new GLTFLoader();
      loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
          if (!sceneRef.current) return;

          // Remover cubo por defecto
          if (cubeGroupRef.current) {
            sceneRef.current.remove(cubeGroupRef.current);
          }
          if (customModelRef.current) {
            sceneRef.current.remove(customModelRef.current);
          }

          const model = gltf.scene;
          customModelRef.current = model;

          // Ajustar escala y centrado
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / (maxDim || 1);
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));

          sceneRef.current.add(model);

          // Configurar animaciones si contiene
          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
              mixer.clipAction(clip).play();
            });
            mixerRef.current = mixer;
          }

          setActiveModelName(file.name);
          setVertexCount('Importado desde GLB');
        },
        (error) => {
          console.error('Error al cargar archivo GLB:', error);
          alert('No se pudo cargar el archivo GLB. Asegúrate de que sea un modelo 3D válido.');
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* HUD Tecnológico Superior */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 pointer-events-auto bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5]">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base">{activeModelName}</span>
              <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-2 py-0.5 rounded-full font-mono font-bold">
                Smart Quad Mesh
              </span>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              Vértices: <span className="text-[#A9F8B5] font-semibold">{vertexCount}</span> • FPS: {fpsCounter}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          title="Cerrar visor 3D"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenedor WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Guía de Interacción en el Centro Inferior */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="text-xs text-gray-400/80 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          🖱️ Arrastra para girar 360° • Rueda para zoom • Explora el interior
        </span>
      </div>

      {/* Barra de Controles Interactivos Inferior */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-3 z-20 pointer-events-auto max-w-[90vw]">
        {/* Botón Fly-Through */}
        <button
          onClick={triggerFlyThrough}
          disabled={isFlyThroughRunning}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            isFlyThroughRunning
              ? 'bg-[#A9F8B5]/30 text-gray-400 border border-[#A9F8B5]/20'
              : 'bg-[#A9F8B5] text-black hover:bg-[#DFF494] shadow-lg shadow-[#A9F8B5]/25'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isFlyThroughRunning ? 'Vuelo en Curso...' : 'Vuelo de Cámara (Fly-Through)'}</span>
        </button>

        {/* Botón Morphing a Marco Rombo */}
        <button
          onClick={() => {
            soundEffects.playClick();
            setIsMorphed((prev) => !prev);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isMorphed ? 'Cerrar Cubo Sólido' : 'Abrir a Marco Rombo'}</span>
        </button>

        {/* Toggle Rejilla Wireframe */}
        <button
          onClick={() => {
            soundEffects.playClick();
            setShowWireframe((prev) => !prev);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
            showWireframe
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Rejilla Holográfica</span>
        </button>

        {/* Carga de Archivo GLB personalizado */}
        <label className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 transition-all flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Cargar mi .GLB</span>
          <input
            type="file"
            accept=".glb,.gltf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
