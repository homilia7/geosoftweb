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

### 2026-10-12 — Cuadro de Agendar Cita: Animación Simétrica al Dar Clic en Cerrar
- **Salida Cinemática Hacia Arriba (`animate-modal-leave`):**
  - Al hacer clic en el botón cerrar (X), en el botón Finalizar, en el backdrop o presionar la tecla Escape, el cuadro se repliega con fluidez simétrica hacia arriba (`translateY(-38px)`), reduciendo sutilmente su escala a `0.98`, difuminándose con `filter: blur(10px)` y desvaneciéndose en `opacity: 0` durante 480ms con curva orgánica `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Desvanecimiento Suave del Fondo (`animate-backdrop-leave`):**
  - El telón translúcido se desvanece suavemente en 450ms (`opacity: 0` y `backdrop-filter: blur(0px)`), eliminando cualquier corte abrupto.
- **Desmontaje Sincronizado:** El componente pospone el cierre efectivo (`onClose`) hasta que la animación de salida se completa, brindando una experiencia 100% pulida y profesional.

### 2026-10-12 — Cuadro de Agendar Cita: Suavidad Cinemática y Aterrizaje Ultra Sedoso
- **Transición de Mayor Tersura (`animate-modal-drop`):**
  - Duración de entrada de **720ms** para un descenso pausado, señorial y elegante.
  - Recorrido vertical optimizado a `translateY(-38px)` con escala `0.98`.
  - Progresión de nitidez y opacidad escalonada: arranca en `blur(10px)`, pasa por `blur(2px)` al 50% con `opacity: 0.85` y se asienta en nitidez total (`blur(0px)`) y escala natural (`scale(1)`).

### 2026-10-12 — Coreografía de 3 Actos Post-Splash: Cuadro Derecho -> Bloque Izquierdo -> Menú Superior
- **Secuencia Estricta de 3 Fases:**
  1. **Acto 1 (Cuadro Derecho):** Tras desmontarse el Splash Intro (`introFinished === true`), entra primero el cuadro showcase con el logo 3D e 'IA Conectada' cayendo suavemente de arriba hacia abajo (`animate-hero-card-down`, 1000ms) y queda en levitación flotante continua (`animate-hero-floating`).
  2. **Acto 2 (Contenedor Izquierdo Completo):** Únicamente después de que el cuadro derecho aparece y se asienta (~1000ms), inicia la entrada suave y fluida de izquierda a derecha (`animate-hero-content-left`, 1050ms) de todo el bloque izquierdo.
  3. **Acto 3 (Menú de Arriba / Navbar):** Únicamente después de que el bloque izquierdo termina de aparecer y se asienta (~2180ms totales), inicia la animación del Navbar.
