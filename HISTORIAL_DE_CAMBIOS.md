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

### 2026-10-12 — Sincronización Estricta del Hero tras Desaparición del Splash
- **Bloqueo durante Splash Intro:** El badge 'Soluciones de IA & Software de Élite' y el cuadro showcase permanecen totalmente ocultos e inactivos (nimReady = false) mientras el logo central y los textos de bienvenida del splash estén en pantalla.
- **Disparo exclusivo post-splash:** Únicamente cuando el splash screen con el logo central y los textos concluye y se desmonta por completo (introFinished === true), se desencadenan las animaciones del Hero:
  1. El badge entra suave y fluidamente de izquierda a derecha (nimate-hero-badge-left).
  2. El cuadro con el logo e 'IA Conectada' entra suavemente de arriba hacia abajo (nimate-hero-card-down) y queda en levitación flotante permanente (nimate-hero-floating).
