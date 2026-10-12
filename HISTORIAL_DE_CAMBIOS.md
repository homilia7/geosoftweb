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

### 2026-10-12 — Video Cinemático de Alta Fidelidad & Showcase Reel con Imágenes Reales y Ken Burns
- **Imágenes Reales de Producto Ultra-HD en 16:9 (`public/assets/showcase/`):**
  - Generadas 9 piezas visuales fotorrealistas de clase Silicon Valley para cada una de las 9 soluciones:
    1. *01-chatbots.jpg:* Dashboard de IA con analítica en vivo y WhatsApp Business.
    2. *02-web.jpg:* MacBook Pro flotante con landing page Dark Tech y tarjeta holográfica.
    3. *03-membership.jpg:* Pantalla de cristal oscuro de academia VIP y reproductor de cursos.
    4. *04-saas.jpg:* Monitor curvo ultrawide con telemetría de servidores y métricas MRR.
    5. *05-crm.jpg:* Tablero comercial visual en tableta y monitor con pipeline de ventas.
    6. *06-custom-software.jpg:* Espacio de trabajo de ingeniería con monitores 4K y arquitectura cloud.
    7. *07-automation.jpg:* Red neuronal de workflows conectando Webhooks, IA y pasarelas de pago.
    8. *08-booking.jpg:* Plataforma de reservas de lujo con confirmación instantánea de Sinpe Móvil.
    9. *09-pwa.jpg:* Smartphone flotante con aplicación web progresiva y diseño futurista.
- **Efecto de Movimiento Cinemático Ken Burns (`scripts/generate_cinematic_showcase_video.js`):**
  - Eliminado cualquier aspecto plano o estático: la cámara se desplaza y hace zoom continuo (`zoompan`) sobre cada interfaz real.
  - Viñeta inferior en gradiente oscuro para tipografía nítida en Segoe UI con badges de color glowing y métricas estratégicas.
  - Transiciones suaves de crossfade (`fade in/out`) sincronizadas con la música ambiental instrumental (`ambient-music.mp3`).
  - Video renderizado a 1920x1080 Full HD (6.88 MB) en `public/videos/geosoft-showcase.mp4`.
- **Componente Web Interactivo Elevado (`InteractiveVideoShowcase.tsx`):**
  - El modo interactivo integra los renders de alta resolución dentro de un marco de ventana tecnológica de software con resplandor ambiental reactivo, badge interactivo y micro-escalado al pasar el ratón.
  - Selector de modo para reproducir el video cinemático Full HD o interactuar con las soluciones paso a paso.
- **Verificación y Despliegue en Producción:**
  - Build local con Vite (`dist` actualizado con imágenes y video).
  - Desplegado a Cloudflare Pages con verificación HTTP 200 en `geosoftweb.pages.dev`, `/videos/geosoft-showcase.mp4` y `/assets/showcase/01-chatbots.jpg`.

### 2026-10-12 — Menú de Servicios Ultra-Estable, Clic Bonito (click.wav) & Limpieza de Tooltip IA
- **Burbuja de Asesor IA Flotante (`FloatingChat.tsx`):**
  - Removido el ícono ✨ del tooltip de llamada a la acción para un aspecto minimalista, limpio y nítido.
- **Menú Desplegable de Servicios (`Navbar.tsx`):**
  - **Eliminación del Cierre Prematuro:** Se eliminó el espacio muerto (`mt-2`) que provocaba la pérdida de foco del mouse al descender, reemplazándolo por posicionamiento continuo (`pt-2`) y un **puente seguro invisible de 16px** que mantiene la superficie interactiva ininterrumpida.
  - **Retardo de Gracia (Hover Grace Buffer):** Temporizador de 280ms (`dropdownTimeoutRef`) al salir del elemento, permitiendo movimientos diagonales o rápidos sin cierres accidentales.
  - **Apertura Persistente por Clic & Click-Outside:** Al hacer clic sobre "Servicios", el menú permanece abierto de forma sólida hasta que el usuario elija una opción o haga clic fuera del menú.
- **Sonido de Clic Bonito y Profesional (`click.wav` & `soundEffects.ts`):**
  - **Buffer Precargado de Alta Fidelidad (`click.wav`):** Síntesis PCM de 55ms a 44.1kHz con forma de onda senoidal armónica (620Hz -> 160Hz con ataque terso de 2ms y caída sedosa), volumen calibrado a `0.35`.
  - **Cero Estática o Ruido Áspero:** Se erradicó cualquier ráfaga de ruido blanco sintético; el sonido es un *UI Pop* limpio, dulce, táctil y de alta gama.
  - **Fallback Armónico Puro:** Si el buffer no ha cargado, un oscilador senoidal dual reproduce exactamente la misma curva armónica.

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
