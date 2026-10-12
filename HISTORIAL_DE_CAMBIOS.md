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

### 2026-10-12 — Cortina de Humo para Cursor & Música Ambiental de Fondo Continua
- **Cortina de Humo Fluido (`SmokeCursorTrail.tsx`):**
  - Al mover el cursor, se genera una estela continua de volutas de humo vaporoso (`screen composite operation`) con física de expansión progresiva (`14px` a `80px`), turbulencia aerodinámica, rotación angular y desvanecimiento suave (`1.2s` a `1.8s`).
  - Interpolación continua entre coordenadas para evitar saltos o huecos cuando el mouse se mueve rápido.
  - Paleta armónica etérea: esmeralda suave (`#A9F8B5`), oro tenue (`#DFF494`) y niebla luminosa.
  - Cero consumo de CPU en reposo: cuando el mouse se detiene y las volutas se disipan, el loop de animación se suspende automáticamente.
  - Ocultación automática en pantallas táctiles / móviles.
- **Música Ambiental de Fondo Continua (`soundEffects.ts`):**
  - Generador sonoro inmersivo multicapa en Web Audio API: sub-bajo profundo (C2), armónicos cálidos (G2, D3, E3, B3) y filtro modulado por LFO respiratorio (0.08Hz), creando una atmósfera cinematográfica continua estilo *Interstellar / Blade Runner*.
  - Fade-in progresivo de 2.5s al interactuar el usuario (clic o toque en el Splash).
  - Control de Play/Mute integrado en el Navbar (`Volume2` / `VolumeX`) con persistencia en `localStorage`.
  - Micro-sonidos táctiles de hover (1050Hz) y clic (360Hz -> 140Hz) en botones sincronizados.

### 2026-10-12 — Cuadro de Agendar Cita: Animación Simétrica al Dar Clic en Cerrar
- **Salida Cinemática Hacia Arriba (`animate-modal-leave`):**
  - Al hacer clic en cerrar, el cuadro se repliega con fluidez simétrica hacia arriba (`translateY(-38px)`), reduciendo sutilmente su escala a `0.98`, difuminándose con `filter: blur(10px)` y desvaneciéndose en `opacity: 0` durante 480ms con curva orgánica `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Desvanecimiento Suave del Fondo (`animate-backdrop-leave`):** Telón translúcido desvanecido suavemente en 450ms.
