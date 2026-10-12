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

### 2026-10-12 — Eliminación del Punto Verde del Cursor & Calibración de Sonidos Táctiles en Botones
- **Eliminación del Punto Verde del Cursor (`CustomCursor.tsx` & `App.tsx`):**
  - Removido el punto verde (`#A9F8B5`) del cursor que causaba interferencia visual.
  - El puntero del sistema permanece limpio y nítido, manteniendo exclusivamente la **cortina de humo fluido y vaporoso** (`SmokeCursorTrail.tsx`).
- **Restauración y Calibración Sonora de Botones (`soundEffects.ts`):**
  - **Hover Cristalino:** Micro-chime moderno y sutil pero claramente perceptible (850Hz -> 1250Hz, ganancia `0.085`) al posar el cursor sobre cualquier botón o enlace interactivo, evitando disparos repetitivos con tracking de elemento actual (`lastHoverTarget`).
  - **Clic Táctil Háptico:** Tap mecánico con pegada y cuerpo cálido (onda triangular, 340Hz -> 95Hz, ganancia `0.16`) accionado de forma instantánea al `pointerdown`.
  - **Desbloqueo Inmediato y Auto-Resume:** Manejo robusto del ciclo de vida de Web Audio API: si el `AudioContext` entra en suspensión por inactividad o antes de la primera pulsación, se reactiva automáticamente (`ctx.resume()`) para garantizar que ningún sonido se pierda.

### 2026-10-12 — Sustitución Definitiva por Música Moderna Chillout & Cortina de Humo para Cursor
- **Música Moderna y Bonita de Alta Calidad (`ambient-music.mp3`):**
  - Erradicación total y definitiva del oscilador/drone de baja frecuencia que generaba el molesto sonido a motor.
  - Implementación de una pista instrumental real en MP3 (`/assets/audio/ambient-music.mp3`) de estilo chillout / lo-fi moderno, melódica, elegante y relajante.
  - Reproductor HTML5 Audio optimizado en `soundEffects.ts`:
    - Loop continuo sin interrupciones.
    - Fade-in progresivo delicado (`0.22` de volumen máximo) tras la primera interacción del usuario.
    - Fade-out progresivo al pausar o silenciar desde el botón de volumen del Navbar.
- **Cortina de Humo Fluido al Mover el Cursor (`SmokeCursorTrail.tsx`):**
  - Rastro continuo de volutas de humo vaporoso (`screen composite operation`) con física de expansión progresiva, turbulencia y desvanecimiento suave.

### 2026-10-12 — Cuadro de Agendar Cita: Animación Simétrica al Dar Clic en Cerrar
- **Salida Cinemática Hacia Arriba (`animate-modal-leave`):**
  - Al hacer clic en cerrar, el cuadro se repliega con fluidez simétrica hacia arriba (`translateY(-38px)`), reduciendo sutilmente su escala a `0.98`, difuminándose con `filter: blur(10px)` y desvaneciéndose en `opacity: 0` durante 480ms con curva orgánica `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Desvanecimiento Suave del Fondo (`animate-backdrop-leave`):** Telón translúcido desvanecido suavemente en 450ms.
