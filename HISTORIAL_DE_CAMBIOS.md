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

### 2026-10-12 — Coreografía Teatral del Navbar: Encendido Constante y Uniforme (8.5s Linear)
- **Eliminación del salto en el último milisegundo:** Se erradicó el temporizador 	Normal de React que desmontaba abruptamente la clase al final de la animación provocando un encendido de golpe. Ahora la animación se mantiene de forma permanente en su fotograma final (oth).
- **Encendido constante y uniforme (curva linear):** Se reemplazó la curva ease agresiva por una progresión linear pura de 8.5 segundos, permitiendo un movimiento suave, continuo, uniforme y predecible desde el primer segundo hasta el final sin saltos ni aceleraciones bruscas.
- **Pausa de 1 segundo en reposo absoluto:** Congelamiento de 1000ms apagados (opacity: 0.2) gestionado nativamente en el delay de CSS.
- **Flash amarillo instantáneo (220ms) y barrido rápido (45ms):** Preservados con alta velocidad y fluidez.
