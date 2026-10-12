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

### 2026-10-12 — Animación Suave de Izquierda a Derecha de Todo el Bloque Izquierdo del Hero
- **Bloque Izquierdo Unificado:** La animación suave y fluida de izquierda a derecha (`animate-hero-content-left`) ahora cubre todo el contenedor izquierdo completo:
  1. Badge 'Soluciones de IA & Software de Élite'.
  2. Titular rotativo ('Agentes de Inteligencia Artificial...', 'Software, Webs e IA...').
  3. Párrafo descriptivo ('Desarrollamos páginas web que convierten...').
  4. Botones de acción ('Cotizar mi Proyecto' y 'Agendar Cita en Vivo').
  5. Indicadores de confianza y garantía ('Garantía de Entrega y Código Limpio', 'Carga Ultra Rápida').
- **Disparo Exclusivo Post-Splash:** Todo el bloque izquierdo permanece oculto hasta que concluye el splash inicial del logo central (`introFinished === true`), momento en el cual entra suave y fluidamente de izquierda a derecha junto con la caída del cuadro derecho que queda flotando.

### 2026-10-12 — Sincronización Estricta del Hero tras Desaparición del Splash
- **Bloqueo durante Splash Intro:** Los elementos del Hero permanecen totalmente ocultos e inactivos mientras el logo central y los textos de bienvenida del splash estén en pantalla.
- **Disparo exclusivo post-splash:** Únicamente cuando el splash screen con el logo central y los textos concluye y se desmonta por completo (`introFinished === true`), se desencadenan las animaciones del Hero:
  1. El badge entra suave y fluidamente de izquierda a derecha.
  2. El cuadro con el logo e 'IA Conectada' entra suavemente de arriba hacia abajo (`animate-hero-card-down`) y queda en levitación flotante permanente (`animate-hero-floating`).
