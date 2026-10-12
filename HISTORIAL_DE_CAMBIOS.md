# 📜 HISTORIAL DE CAMBIOS APROBADOS — GeoSoft Web

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquí está blindada: ninguna IA puede eliminarla o revertirla.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Repositorio:** https://github.com/homilia7/geosoftweb.git
- **Rama:** main
- **URL Producción:** https://geosoftweb.pages.dev

---

## 📅 Entradas de Cambios Aprobados

### 2026-10-12 — Sustitución Definitiva por Música Moderna Chillout & Cortina de Humo para Cursor
- **Música Moderna y Bonita de Alta Calidad (`ambient-music.mp3`):**
  - Erradicación total y definitiva del oscilador/drone de baja frecuencia que generaba el molesto sonido a motor.
  - Implementación de una pista instrumental real en MP3 (`/assets/audio/ambient-music.mp3`) de estilo chillout / lo-fi moderno, melódica, elegante y relajante.
  - Reproductor HTML5 Audio optimizado en `soundEffects.ts`:
    - Loop continuo sin interrupciones.
    - Fade-in progresivo delicado (`0.22` de volumen máximo) tras la primera interacción del usuario para cumplir con las políticas de autoplay del navegador.
    - Fade-out progresivo al pausar o silenciar desde el botón de volumen del Navbar.
    - Micro-sonidos táctiles refinados para botones (hover a 1200Hz y clic sutil táctil).
- **Cortina de Humo Fluido al Mover el Cursor (`SmokeCursorTrail.tsx`):**
  - Rastro continuo de volutas de humo vaporoso (`screen composite operation`) con física de expansión progresiva (`14px` a `80px`), turbulencia aerodinámica, rotación angular y desvanecimiento suave (`1.2s` a `1.8s`).
  - Interpolación continua entre coordenadas para evitar saltos cuando el cursor se mueve rápido.
  - Paleta armónica etérea: esmeralda suave (`#A9F8B5`), oro tenue (`#DFF494`) y niebla luminosa.
  - Desactivación automática en dispositivos móviles y suspensión de renderizado cuando el mouse se detiene.

### 2026-10-12 — Cuadro de Agendar Cita: Animación Simétrica al Dar Clic en Cerrar
- **Salida Cinemática Hacia Arriba (`animate-modal-leave`):**
  - Al hacer clic en cerrar, el cuadro se repliega con fluidez simétrica hacia arriba (`translateY(-38px)`), reduciendo sutilmente su escala a `0.98`, difuminándose con `filter: blur(10px)` y desvaneciéndose en `opacity: 0` durante 480ms con curva orgánica `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Desvanecimiento Suave del Fondo (`animate-backdrop-leave`):** Telón translúcido desvanecido suavemente en 450ms.
