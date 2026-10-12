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

### 2026-10-11 — Coreografía Teatral del Navbar y Erradicación de Parpadeos
- **Entrada en parejas simétricas:** 5 pares ordenados (Logo/Cotizar, Inicio/Agendar, Servicios/FAQ, Metodología/Cotizador, Proyectos/Equipo).
- **Luz amarilla en letras:** Iluminación de 700ms dentro del texto de los botones.
- **Apagado simultáneo:** Animación suave de 350ms a estado atenuado tenue (opacidad 0.18).
- **Haz cromático de lado a lado:** Barrido botón por botón (80ms de intervalo / 180ms de duración) que culmina con cada botón apagado.
- **Pausa de 1 segundo exacto en silencio visual:** Concluido el recorrido del haz (3700ms), todos los botones permanecen 1000ms exactos (hasta 4700ms) congelados y apagados en estado estático, sin ningún destello prematuro ni salto.
- **Despertar ultra lento forzado vía @keyframes (4.8 segundos):** Animación obligatoria a la GPU 
avSlowWakeUp (4800ms con curva cubic-bezier(0.16, 1, 0.3, 1)) que arranca desde 0.18 y eleva suave, fluida y lentísimamente el resplandor hasta sus colores definitivos.
