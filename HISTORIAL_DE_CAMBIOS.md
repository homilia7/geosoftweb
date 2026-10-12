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

### 2026-10-12 — Coreografía de 3 Actos Post-Splash: Cuadro Derecho -> Bloque Izquierdo -> Menú Superior
- **Secuencia Estricta de 3 Fases:**
  1. **Acto 1 (Cuadro Derecho):** Tras desmontarse el Splash Intro (`introFinished === true`), entra primero el cuadro showcase con el logo 3D e 'IA Conectada' cayendo suavemente de arriba hacia abajo (`animate-hero-card-down`, 1000ms) y queda en levitación flotante continua (`animate-hero-floating`).
  2. **Acto 2 (Contenedor Izquierdo Completo):** Únicamente después de que el cuadro derecho aparece y se asienta (~1000ms), inicia la entrada suave y fluida de izquierda a derecha (`animate-hero-content-left`, 1050ms) de todo el bloque izquierdo: badge, título rotativo, párrafo descriptivo, botones CTA y sellos de garantía.
  3. **Acto 3 (Menú de Arriba / Navbar):** Únicamente después de que el bloque izquierdo termina de aparecer y se asienta (~2180ms totales), inicia la animación del Navbar (`pairStage` secuencial de 5 pares de extremos a centro, flash amarillo de 220ms, haz cromático botón a botón, 1s de pausa apagados y despertar suave lineal de 8.5s).
- **Reposo Absoluto Previo:** Mientras cada fase espera su turno, los elementos se mantienen en opacidad 0 y sin eventos de puntero (`opacity-0 pointer-events-none`).

### 2026-10-12 — Animación Suave de Izquierda a Derecha de Todo el Bloque Izquierdo del Hero
- **Bloque Izquierdo Unificado:** La animación suave y fluida de izquierda a derecha (`animate-hero-content-left`) ahora cubre todo el contenedor izquierdo completo:
  1. Badge 'Soluciones de IA & Software de Élite'.
  2. Titular rotativo ('Agentes de Inteligencia Artificial...', 'Software, Webs e IA...').
  3. Párrafo descriptivo ('Desarrollamos páginas web que convierten...').
  4. Botones de acción ('Cotizar mi Proyecto' y 'Agendar Cita en Vivo').
  5. Indicadores de confianza y garantía ('Garantía de Entrega y Código Limpio', 'Carga Ultra Rápida').

### 2026-10-12 — Sincronización Estricta del Hero tras Desaparición del Splash
- **Bloqueo durante Splash Intro:** Los elementos del Hero permanecen totalmente ocultos e inactivos mientras el logo central y los textos de bienvenida del splash estén en pantalla.
- **Disparo exclusivo post-splash:** Únicamente cuando el splash screen con el logo central y los textos concluye y se desmonta por completo (`introFinished === true`), se desencadenan las animaciones del Hero.
