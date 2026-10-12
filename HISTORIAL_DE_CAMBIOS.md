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

### 2026-10-12 — Cuadro de Agendar Cita: Animación Suave, Profesional y Fluida de Arriba hacia Abajo
- **Entrada Cinemática (`animate-modal-drop`):** Al abrir el cuadro/modal de agendar cita (`BookingModal` y `CalModal`), el contenedor desciende elegantemente de arriba hacia abajo:
  - Posición inicial: `translateY(-44px)` con ligera escala (`scale(0.97)`) y desenfoque óptico (`filter: blur(8px)`).
  - Posición final: se asienta en el centro con `translateY(0)`, escala natural (`scale(1)`) y total nitidez (`blur(0px)`).
  - Curva de física de fluidos: `cubic-bezier(0.16, 1, 0.3, 1)` en 480ms (estándar de Emil Kowalski / Apple UI).
- **Desvanecimiento de Fondo (`animate-backdrop-fade`):** El telón oscuro translúcido (`bg-black/85 backdrop-blur-md`) realiza una transición suave de opacidad en 320ms, eliminando cualquier corte abrupto.

### 2026-10-12 — Coreografía de 3 Actos Post-Splash: Cuadro Derecho -> Bloque Izquierdo -> Menú Superior
- **Secuencia Estricta de 3 Fases:**
  1. **Acto 1 (Cuadro Derecho):** Tras desmontarse el Splash Intro (`introFinished === true`), entra primero el cuadro showcase con el logo 3D e 'IA Conectada' cayendo suavemente de arriba hacia abajo (`animate-hero-card-down`, 1000ms) y queda en levitación flotante continua (`animate-hero-floating`).
  2. **Acto 2 (Contenedor Izquierdo Completo):** Únicamente después de que el cuadro derecho aparece y se asienta (~1000ms), inicia la entrada suave y fluida de izquierda a derecha (`animate-hero-content-left`, 1050ms) de todo el bloque izquierdo: badge, título rotativo, párrafo descriptivo, botones CTA y sellos de garantía.
  3. **Acto 3 (Menú de Arriba / Navbar):** Únicamente después de que el bloque izquierdo termina de aparecer y se asienta (~2180ms totales), inicia la animación del Navbar (`pairStage` secuencial de 5 pares de extremos a centro, flash amarillo de 220ms, haz cromático botón a botón, 1s de pausa apagados y despertar suave lineal de 8.5s).

### 2026-10-12 — Animación Suave de Izquierda a Derecha de Todo el Bloque Izquierdo del Hero
- **Bloque Izquierdo Unificado:** La animación suave y fluida de izquierda a derecha (`animate-hero-content-left`) cubre todo el contenedor izquierdo completo.
