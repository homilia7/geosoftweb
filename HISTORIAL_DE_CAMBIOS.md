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

### 2026-10-12 — Coreografía Teatral del Navbar: Flash Amarillo, Sweep Eléctrico y Despertar de 6s
- **Luz amarilla tipo flash instantáneo (220ms):** Destello fulgurante dentro del texto de los botones que se enciende y se apaga de golpe.
- **Haz cromático ultra rápido botón por botón:** Intervalo acelerado a 45ms entre botones y 110ms de duración por elemento; toda la onda cruza la barra en ~500ms.
- **Erradicación total de fases intermedias y destellos:** Se eliminaron los estados superfluos (ll_dimmed, one_second_pause) que provocaban re-renders y parpadeos molestos en React. El barrido transiciona de forma limpia y directa al estado final.
- **Pausa estática de 1 segundo nativa en CSS:** Delay de 1000ms sin mutaciones en el DOM, manteniendo los botones congelados y apagados en reposo total.
- **Reencendido ultra lento y sedoso (6.0 segundos):** Curva continua cubic-bezier(0.16, 1, 0.3, 1) de 6 segundos que arranca pausada y eleva suavemente la luminosidad hasta su plenitud original sin saltos.
