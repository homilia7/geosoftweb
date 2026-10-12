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

### 2026-10-12 — Ecosistema Sensorial: Custom Cursor Fluido & Micro-Interacciones Acústicas Web Audio
- **Animación del Mouse (`CustomCursor.tsx`):**
  - Cursor fluido de doble elemento: un punto central nítido esmeralda (`#A9F8B5`) y un halo magnético orbital (`32px`) con interpolación elástica continua (`lerp = 0.18`).
  - Detección de elementos interactivos: el halo se expande a `scale-175` con resplandor esmeralda (`box-shadow: 0 0 20px rgba(169,248,181,0.4)`) sobre botones y enlaces.
  - Efecto de compresión y onda táctil (`scale-75`) al hacer clic.
  - Ocultación automática en dispositivos táctiles / móviles (`pointer: coarse`).
- **Sistema de Audio Sintético (`soundEffects.ts`):**
  - **Sonido de Entrada / Bienvenida (`playIntroSound`):** Acorde armónico pentatónico etéreo cálido generado en tiempo real con filtro pasa-bajos dinámico al ingresar a la web.
  - **Sonido de Botones al Pasar el Cursor (`playHoverSound`):** Micro-tick sutil de alta frecuencia (1050Hz - 1380Hz, 25ms, volumen suave de 0.022 con decaimiento exponencial) con throttling inteligente para evitar saturación.
  - **Sonido al Presionar un Botón (`playClickSound`):** Micro-tap percusivo mecánico y táctil (360Hz -> 140Hz, 35ms) que otorga confirmación física instantánea.
  - **Cero Dependencias y 0 KB de Audio:** Síntesis matemática pura con Web Audio API sin consumir ancho de banda ni latencia.
  - **Control de Silencio / Mute Toggle:** Botón accesible integrado en el Navbar (`Volume2` / `VolumeX`) con persistencia en `localStorage` (`geosoft_sound_muted`).

### 2026-10-12 — Cuadro de Agendar Cita: Animación Simétrica al Dar Clic en Cerrar
- **Salida Cinemática Hacia Arriba (`animate-modal-leave`):**
  - Al hacer clic en el botón cerrar (X), en el botón Finalizar, en el backdrop o presionar la tecla Escape, el cuadro se repliega con fluidez simétrica hacia arriba (`translateY(-38px)`), reduciendo sutilmente su escala a `0.98`, difuminándose con `filter: blur(10px)` y desvaneciéndose en `opacity: 0` durante 480ms con curva orgánica `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Desvanecimiento Suave del Fondo (`animate-backdrop-leave`):**
  - El telón translúcido se desvanece suavemente en 450ms (`opacity: 0` y `backdrop-filter: blur(0px)`), eliminando cualquier corte abrupto.

### 2026-10-12 — Cuadro de Agendar Cita: Suavidad Cinemática y Aterrizaje Ultra Sedoso
- **Transición de Mayor Tersura (`animate-modal-drop`):**
  - Duración de entrada de **720ms** para un descenso pausado, señorial y elegante.
  - Recorrido vertical optimizado a `translateY(-38px)` con escala `0.98`.
  - Progresión de nitidez y opacidad escalonada: arranca en `blur(10px)`, pasa por `blur(2px)` al 50% con `opacity: 0.85` y se asienta en nitidez total (`blur(0px)`) y escala natural (`scale(1)`).
