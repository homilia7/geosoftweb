import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface UltraCube3DProps {
  onStop?: () => void;
}

export const UltraCube3D: React.FC<UltraCube3DProps> = ({ onStop }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const onStopCalledRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. ESCENA, CÁMARA Y RENDERER
    const scene = new THREE.Scene();
    const isMobile = width < 640;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 10.2 : 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    // 2. ILUMINACIÓN ULTRA REALISTA (Studio Lighting Rig)
    const ambientLight = new THREE.AmbientLight(0x0a2215, 2.8);
    scene.add(ambientLight);

    // Luz principal blanca/menta de alto contraste
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.6);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    // Luz dorada lateral de recorte (Rim light)
    const goldRimLight = new THREE.PointLight(0xd4af37, 4.0, 15);
    goldRimLight.position.set(-6, 3, -2);
    scene.add(goldRimLight);

    // Luz esmeralda brillante frontal/inferior
    const emeraldFillLight = new THREE.PointLight(0x00ff88, 5.0, 12);
    emeraldFillLight.position.set(3, -4, 4);
    scene.add(emeraldFillLight);

    // Luz interna en el corazón del cubo
    const innerLight = new THREE.PointLight(0xa9f8b5, 3.5, 6);
    scene.add(innerLight);

    // 3. GRUPO PRINCIPAL DEL CUBO 3D
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // A. CUBO EXTERIOR DE CRISTAL ESMERALDA FACETADO (Physical Glass/Gemstone)
    const cubeSize = 2.4;
    const outerGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, 2, 2, 2);
    const outerMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x10b981),
      emissive: new THREE.Color(0x022c22),
      emissiveIntensity: 0.28,
      roughness: 0.04,
      metalness: 0.12,
      transmission: 0.72, // Transparencia de gema pura
      thickness: 1.8, // Absorción volumétrica realista
      attenuationColor: new THREE.Color(0x047857),
      attenuationDistance: 1.3,
      ior: 1.62, // Refracción de esmeralda natural
      reflectivity: 0.96,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
    });
    const outerCube = new THREE.Mesh(outerGeometry, outerMaterial);
    cubeGroup.add(outerCube);

    // B. BISELES Y BORDES METÁLICOS DE PRECISIÓN (Oro & Titanio)
    const edgesGeometry = new THREE.EdgesGeometry(outerGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xdff494),
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const edgesLines = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    cubeGroup.add(edgesLines);

    // C. NÚCLEO GEOMÉTRICO INTERNO (Inner Quantum Core)
    const coreSize = 1.15;
    const coreGeometry = new THREE.BoxGeometry(coreSize, coreSize, coreSize);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xa9f8b5),
      emissive: new THREE.Color(0x10b981),
      emissiveIntensity: 1.6,
      roughness: 0.25,
      metalness: 0.85,
    });
    const coreCube = new THREE.Mesh(coreGeometry, coreMaterial);
    cubeGroup.add(coreCube);

    // D. NÚCLEO OCTAÉDRICO CENTRAL (Geometría interna de alta tecnología)
    const octaGeometry = new THREE.OctahedronGeometry(0.7, 0);
    const octaMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4af37),
      emissive: new THREE.Color(0xc1a35b),
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.95,
    });
    const octaMesh = new THREE.Mesh(octaGeometry, octaMaterial);
    cubeGroup.add(octaMesh);

    // E. SOMBRA DE CONTACTO VOLUMÉTRICA EN EL SUELO
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    scene.add(shadowMesh);

    // F. PARTÍCULAS VOLUMÉTRICAS AMBIENTALES
    const particlesCount = 45;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xa9f8b5,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. ANIMACIÓN: GIRO RÁPIDO -> DESACELERACIÓN FÍSICA -> DETENCIÓN HEROICA
    const targetIsometricX = 0.52; // Ángulo isométrico elegante
    const targetIsometricY = 0.785; // 45 grados para mostrar 3 caras
    const targetIsometricZ = 0.0;

    const startTime = performance.now();
    const spinDuration = 1500; // 1.5s de giro y desaceleración
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1.0);

      if (progress < 1.0) {
        // Fase de desaceleración física (easeOutExpo / easeOutQuart)
        const t = 1.0 - Math.pow(1.0 - progress, 4);
        
        // El cubo parte con velocidad ultra rápida y se frena hasta el ángulo isométrico
        const remainingSpinsX = (1.0 - t) * (Math.PI * 6);
        const remainingSpinsY = (1.0 - t) * (Math.PI * 10);
        const remainingSpinsZ = (1.0 - t) * (Math.PI * 4);

        cubeGroup.rotation.x = targetIsometricX + remainingSpinsX;
        cubeGroup.rotation.y = targetIsometricY + remainingSpinsY;
        cubeGroup.rotation.z = targetIsometricZ + remainingSpinsZ;

        // El núcleo interno gira a contramano
        coreCube.rotation.x = -cubeGroup.rotation.x * 1.5;
        coreCube.rotation.y = -cubeGroup.rotation.y * 1.5;
        octaMesh.rotation.y = cubeGroup.rotation.y * 2.0;

        // Pulso de intensidad lumínica durante el frenado
        outerMaterial.emissiveIntensity = 0.35 + (1.0 - t) * 0.8;
      } else {
        // FASE DETENIDO: Bloqueo en ángulo isométrico + micro-levitación física
        if (!onStopCalledRef.current) {
          onStopCalledRef.current = true;
          if (onStop) onStop();
        }

        const hoverTime = (elapsed - spinDuration) * 0.002;
        const levitation = Math.sin(hoverTime) * 0.08;

        cubeGroup.position.y = levitation;
        cubeGroup.rotation.x = targetIsometricX + Math.sin(hoverTime * 0.8) * 0.03;
        cubeGroup.rotation.y = targetIsometricY + Math.cos(hoverTime * 0.6) * 0.04;
        cubeGroup.rotation.z = targetIsometricZ;

        // Núcleo rota suavemente por dentro
        coreCube.rotation.y += 0.012;
        octaMesh.rotation.x += 0.018;

        // La sombra respira con la levitación
        shadowMesh.scale.setScalar(1.0 - levitation * 0.5);
      }

      // Animación suave de las partículas
      particles.rotation.y += 0.001;

      // Movimiento suave de la luz para reflejos cambiantes
      const lightTime = elapsed * 0.0015;
      emeraldFillLight.position.x = 3 + Math.sin(lightTime) * 1.5;
      emeraldFillLight.position.y = -4 + Math.cos(lightTime) * 1.2;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Redimensionamiento
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = w < 640 ? 10.2 : 8.2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Limpieza de memoria WebGL
      outerGeometry.dispose();
      outerMaterial.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      octaGeometry.dispose();
      octaMaterial.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [onStop]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full absolute inset-0 flex items-center justify-center pointer-events-none select-none"
    />
  );
};
