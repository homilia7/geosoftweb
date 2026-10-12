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

### 2026-10-12 — Cuadro de Agendar Cita: Suavidad Cinemática y Aterrizaje Ultra Sedoso
- **Transición de Mayor Tersura (`animate-modal-drop`):**
  - Duración extendida de 480ms a **720ms** para un descenso más pausado, señorial y elegante.
  - Recorrido vertical optimizado a `translateY(-38px)` con escala `0.98` para evitar sensaciones de salto o brusquedad.
  - Progresión de nitidez y opacidad escalonada: arranca en `blur(10px)`, transiciona al 50% con `opacity: 0.85` y `blur(2px)`, y aterriza suavemente en el centro con nitidez total (`blur(0px)`) y escala natural (`scale(1)`).
  - Telón de fondo translúcido con desenfoque de cristal (`animate-backdrop-fade`) sincronizado a **520ms**.

### 2026-10-12 — Cuadro de Agendar Cita: Animación Suave, Profesional y Fluida de Arriba hacia Abajo
- **Entrada Cinemática (`animate-modal-drop`):** Al abrir el cuadro/modal de agendar cita (`BookingModal` y `CalModal`), el contenedor desciende elegantemente de arriba hacia abajo.

### 2026-10-12 — Coreografía de 3 Actos Post-Splash: Cuadro Derecho -> Bloque Izquierdo -> Menú Superior
- **Secuencia Estricta de 3 Fases:**
  1. **Acto 1 (Cuadro Derecho):** Tras desmontarse el Splash Intro (`introFinished === true`), entra primero el cuadro showcase con el logo 3D e 'IA Conectada' cayendo suavemente de arriba hacia abajo (`animate-hero-card-down`, 1000ms) y queda en levitación flotante continua (`animate-hero-floating`).
  2. **Acto 2 (Contenedor Izquierdo Completo):** Únicamente después de que el cuadro derecho aparece y se asienta (~1000ms), inicia la entrada suave y fluida de izquierda a derecha (`animate-hero-content-left`, 1050ms) de todo el bloque izquierdo.
  3. **Acto 3 (Menú de Arriba / Navbar):** Únicamente después de que el bloque izquierdo termina de aparecer y se asienta (~2180ms totales), inicia la animación del Navbar.
