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

### 2026-10-14 — Eliminación del Cuadro / Sección del Showcase de Video en la Página
- **Retiro Completo del Cuadro y Sección de Video en el Cuerpo de la Web (`App.tsx` & `Navbar.tsx`):**
  - Se eliminó por completo la sección `#video-showcase` (`InteractiveVideoShowcase`) que contenía el reproductor de video en el cuerpo de la web, ya que la secuencia completa de video (Video 3 en reversa ➔ Video 1 ➔ Video 2) ahora pertenece exclusivamente a la experiencia de entrada interactiva (`SplashIntro`).
  - La navegación web fluye ahora de forma limpia y directa: Hero ➔ Métricas ➔ Sales Hook ➔ Tech Marquee ➔ Ecosistema de Servicios Bento (`#servicios`) ➔ Metodología ➔ Proyectos (`#proyectos`).
  - Se eliminó el enlace redundante *"Showcase en Video"* del menú móvil.
  - El peso del bundle JS principal se redujo en más de 72 KB.
- **Despliegue y Verificación en Producción:**
  - Build local con Vite (`0 errores`).
  - Desplegado exitosamente a Cloudflare Pages (`https://geosoftweb.pages.dev`).
  - Script en vivo confirmado: `index-BBvHY792.js`.

- **Control Centralizado de Música y Eliminación de Altavoz en la Intro (`SplashIntro.tsx` & `soundEffects.ts`):**
  - Se eliminó el botón de altavoz duplicado de la pantalla de introducción interactiva.
  - La música de fondo tecnológica se activa con el primer gesto de scroll o toque mediante el singleton `soundEffects.startAmbientMusic()`, asegurando que al entrar a la página la música ya esté sonando de manera continua.
  - El único botón de control de altavoz en todo el sitio es el de la barra de navegación (`Navbar.tsx`), que permite silenciar o reactivar el sonido con un solo clic.
- **Eliminación del Cuadro de Texto de Transición (`ScrollVideoShowcase.tsx` & `InteractiveVideoShowcase.tsx`):**
  - Se eliminó por completo el texto/caja *"Transición Cinemática • Video 3 (Reversa) + 1 + 2 (A todo color)"*.
  - La barra superior del reproductor queda completamente limpia y minimalista, con los indicadores luminosos y el botón de pantalla completa.
- **Estela de Humo en Autopilot al Dejar de Mover el Mouse (`SmokeCursorTrail.tsx`):**
  - **Detección de Reposo:** Cuando el usuario deja de mover el ratón durante más de 850ms, el sistema activa automáticamente el modo autopilot continuo.
  - **Vista Hero (Logo 3D en pantalla):** La estela de humo etéreo circula suavemente en bucle alrededor del cuadro del logo 3D de GeoSoft (`#hero-logo-box`).
  - **Otras secciones de la web (scrolled down):** Si el usuario se desplaza más abajo en la página, la estela vaporosa sube al menú superior (`#main-nav-capsule`) y recorre la cápsula de navegación de izquierda a derecha y de vuelta en un bucle sinusoidal hipnótico.
  - **Retorno Instantáneo:** Tan pronto como el usuario vuelve a tocar o mover el ratón, el autopilot se desactiva de inmediato y la estela sigue el cursor real con suavidad.
- **Despliegue y Verificación en Producción:**
  - Build local con Vite (`0 errores`).
  - Desplegado en Cloudflare Pages (`https://geosoftweb.pages.dev`).
  - Script en vivo confirmado: `index-DRU6LGIs.js`.

- **Aceleración Sutil del Menú Superior (`Navbar.tsx` & `Hero.tsx`):**
  - Reducido el tiempo de espera para el disparo de la animación del menú superior de 2180ms a 1450ms.
  - La cadencia de entrada de los 5 pares de botones se aceleró a ~180ms entre pares (antes 260ms), haciendo que el menú se arme de forma más dinámica, fluida y sin pausas largas.
  - La transición de la pantalla de marca *"Iniciando experiencia..."* (`SplashIntro.tsx`) se calibró a 1.8s (antes 2.2s).
- **Despliegue y Verificación en Producción:**
  - Build local con Vite (`0 errores`).
  - Desplegado exitosamente en Cloudflare Pages (`https://geosoftweb.pages.dev`).
  - Script en vivo verificado: `index-B776PhwN.js`.

- **Erradicación Total de Opacidad y Baja Calidad (Super Nítido Full HD / WebP 1280x720 Lanczos + Unsharp):**
  - Se eliminaron por completo las reproducciones borrosas o con filtros oscuros.
  - Los 189 fotogramas de la secuencia (Video 3 en reversa ➔ Video 1 ➔ Video 2) fueron procesados con escalado Lanczos y filtro unsharp de alta definición (`unsharp=5:5:1.1:5:5:0.0`) a WebP calidad 90.
  - El motor `<canvas>` renderiza a pantalla completa con soporte para pantallas Retina (`devicePixelRatio`), `imageSmoothingQuality = 'high'` y colores 100% vívidos y nítidos.
- **Avance Interactivo Exclusivo con el Scroll del Ratón (Wheel) y Swipe Táctil:**
  - El usuario controla el avance del video directamente con la rueda del ratón (`wheel`) o con gestos táctiles.
  - Curva de interpolación lerp para un avance suave a 60/120 FPS sin saltos ni tirones.
  - Bloqueo total del scroll de la página de fondo con `{ passive: false }`.
  - Pill flotante inferior con indicador animado: *"Gira la rueda del mouse para avanzar"* y barra de progreso en vivo de 0% a 100% con contador de fotogramas (`Fotograma X / 189`).
  - Al completar el scroll al 100% (fotograma 189): transiciona inmediatamente a la pantalla de marca con *"Iniciando experiencia..."*, y tras 2.2 segundos da acceso fluido a la página principal.
- **Banda Sonora Tecnológica Profesional (100% Instrumental, Cero Voces):**
  - Integrada la pista de audio sintético ambiental `/assets/audio/ambient-music.mp3` (4.5 MB, alta fidelidad).
  - Cero voces humanas; ambientación sonora puramente electrónica, futurista y tecnológica.
  - Inicio automático en la primera interacción o scroll con volumen calibrado a 0.35.
  - Botón de control flotante superior para silenciar o activar la música (`Música Tech ON / OFF`).
  - Botón *"Saltar"* disponible en todo momento para acceso inmediato a la pantalla de inicio.
- **Despliegue y Verificación:**
  - Compilación de producción con Vite exitosa (`0 errores`).
  - Push directo a `main` para despliegue automatizado en Cloudflare Pages (`https://geosoftweb.pages.dev`).

- **Secuencia Cinemática como Primer Impacto al Cargar (`SplashIntro.tsx`):**
  - Al abrir o recargar la página, lo primero que ve el usuario es la secuencia cinemática a pantalla completa en alta definición y a todo color real.
  - **Fase 1 (Video 3 en Reversa):** La cámara inicia en el fondo del túnel cuántico y viaja en reversa hacia el exterior revelando el cubo monolítico esmeralda sobre la placa de circuito integrado.
  - **Fase 2 (Video 1):** Conecta de forma fluida con el cubo 3D de GeoSoft, el lanzamiento del cohete (*"Hacemos tus ideas realidad"*) y el viaje hacia el iMac (*"Impulsamos tu negocio"*).
  - **Fase 3 (Video 2):** La cámara entra en la pantalla del iMac dando paso al panel interactivo de software con el planeta Tierra y el túnel de datos.
- **Transición Automática a Pantalla "Iniciando experiencia...":**
  - Al finalizar la reproducción del video (o al pulsar "Saltar"), el sistema pasa de inmediato a la pantalla de presentación de marca con el emblema de cristal, resplandor esmeralda, barra de progreso sweep y el indicador animado `Iniciando experiencia...`.
  - Tras 2.2 segundos de preparación, se realiza el desenfoque suave de entrada (`stage === 'entering'`) y la web carga sus componentes principales (Hero, Navbar y métricas).
- **Controles Integrados en la Intro:**
  - Botón flotante para activar sonido (`Volume2` / `VolumeX`).
  - Botón para saltar la cinemática (`ArrowRight`) y acceder al instante a la pantalla de inicio.
- **Actualización de la Secuencia de Scroll Interactiva (`transition-sequence`):**
  - Extraídos 189 fotogramas WebP optimizados de alta resolución (`public/assets/transition-sequence/frame_001.webp` hasta `frame_189.webp`) que abarcan los 25.2 segundos completos.
  - En el showcase interactivo de la página, el usuario puede manipular con la rueda del ratón o con la pantalla táctil la secuencia completa de los 3 videos a 6 hitos detallados.
- **Despliegue y Verificación en Producción:**
  - Build local con Vite (`0 errores`).
  - Desplegado a Cloudflare Pages (`https://geosoftweb.pages.dev`).
  - Smoke tests HTTP 200 confirmados en `/videos/geosoft-intro-sequence.mp4`, `/assets/transition-sequence/frame_001.webp`, `/assets/transition-sequence/frame_189.webp` y la página raíz.

### 2026-10-14 — Transición Cinemática Continua Video 1 + Video 2 (A Todo Color, Cero Opacidad y Scroll ONO)
- **Concatenación Directa y Match-Cut Perfecto (Video 1 -> Video 2):**
  - Los videos provistos por el usuario (`video 1.mp4` y `video 2.mp4`) fueron concatenados de forma ininterrumpida sin pérdida (`-c copy`) en una secuencia continua de 20 segundos.
  - Video 1 (0 a 10s): Logo "G" esmeralda en espacio 3D cinemático -> Despegue del cohete espacial con *"Hacemos tus ideas realidad"* -> Viaje de cámara hacia el iMac con *"Impulsamos tu negocio"*.
  - Transición inmediata (segundo 10.0 / fotograma 75 a 76): La cámara penetra directamente en la pantalla del iMac dando paso instantáneo al panel global de software de Video 2.
  - Video 2 (10 a 20s): Plataforma de software con globo terráqueo e hiperconectividad de red -> Inmersión en el túnel cuántico 3D con cubos holográficos de GeoSoft.
- **Erradicación Total de Opacidad / Capas Oscuras ("A Todo Color tal cual es el Video"):**
  - Se eliminaron por completo las capas superpuestas de gradiente oscuro (`bg-gradient-to-t` y `bg-gradient-to-r from-black/80`) que opacaban la imagen.
  - El `<canvas>` renderiza ahora los fotogramas WebP nativos a **100% de color real, nítido y vívido**, preservando la fidelidad exacta del metraje original.
- **Generación de Secuencia de Fotogramas de Alta Definición (`transition-sequence`):**
  - Generados 150 fotogramas WebP de alta fidelidad (`public/assets/transition-sequence/frame_001.webp` hasta `frame_150.webp`) con compresión fotográfica de alta calidad (calidad 85, Lanczos scaling, peso total ultra optimizado de solo **2.92 MB**).
  - Tasa de reproducción calibrada a 7.5 FPS para una duración exacta de 20 segundos en reproducción continua.
- **Control y Navegación Mejorada:**
  - Panel de información flotante con opción de minimizar ("Ocultar") para permitir al usuario ver la pantalla 100% despejada.
  - Checkpoints sincronizados con los 5 hitos clave del video (Identidad 3D, Despegue y Tracción, Ecosistema iMac, Plataforma Global y Núcleo Cuántico 3D).
  - Bloqueo de scroll de la página mantenido con listeners nativos `{ passive: false }` y soporte a pantalla completa inmersiva con `createPortal`.
  - Establecida como la **Opción 1 principal** en `InteractiveVideoShowcase.tsx`.
- **Despliegue y Verificación en Producción:**
  - Build de producción con Vite (`0 errores`).
  - Desplegado exitosamente a Cloudflare Pages (`https://geosoftweb.pages.dev`).
  - Smoke tests HTTP 200 confirmados en producción para la web principal y los fotogramas de la secuencia (`frame_001.webp`, `frame_075.webp`, `frame_150.webp`).

### 2026-10-13 — Implementación Dual: Opción 1 (Three.js 3D en Vivo) vs Opción 2 (Video 3D Continuo Estilo ONO)
- **Eliminación Total de Cortes de Diapositiva:**
  - El usuario indicó que en `ono.software` y en su video `Grabación cubo 2026 cubo.mp4`, la cámara realiza un **viaje 3D continuo sin cortes ni diapositivas**, donde la pantalla no baja sino que toda la cinemática ocurre en el centro del campo de visión.
- **Opción 1: Experiencia 3D Nativa en Tiempo Real (`ThreeScrollyCamera.tsx`):**
  - Desarrollado con Three.js WebGL a 120 FPS.
  - La rueda del ratón y el touch del celular controlan un spline de viaje de cámara continuo:
    - 0% - 25%: Vista panorámica exterior del cubo translúcido de cristal esmeralda (`IOR 1.54`).
    - 25% - 50%: La cámara viaja hacia adelante y **penetra directamente a través de la pared de cristal hacia el interior del cubo**.
    - 50% - 75%: Dentro del cubo, navega por la malla quad holográfica y la luz del núcleo mientras el cubo se transforma dinámicamente en el marco de diamante hueco.
    - 75% - 100%: La cámara sale a través del centro hacia la constelación de nodos de software en la nube.
  - Incluye selector para alternar entre "Cámara Guiada por Scroll" y "Modo Órbita Libre 360°" con OrbitControls.
- **Opción 2: Secuencia Cinemática de Video 3D Continuo (`ScrollVideoShowcase.tsx` + `cube-sequence`):**
  - Generada una secuencia continua de 75 fotogramas WebP (`public/assets/cube-sequence/frame_001.webp` hasta `frame_075.webp`) con un peso total ultra liviano de solo **887 KB**.
  - Plano secuencia 3D sin un solo corte de diapositiva, renderizado sobre `<canvas>` con curva de interpolación Lerp y timeline scrubber.
- **Selector de Comparación en Vivo (`InteractiveVideoShowcase.tsx`):**
  - Pestañas interactivas para alternar al instante entre:
    1. *🌟 Opción 1: 3D en Vivo (Three.js)* (activa por defecto).
    2. *🎬 Opción 2: Video 3D Continuo (Estilo ONO)*.
    3. *📱 Showcase Interactivo de Soluciones*.
    4. *▶️ Video MP4 HD (Reel)*.
- **Corrección Crítica de Bloqueo de Scroll y Pantalla Completa:**
  - **Bloqueo Total del Scroll de la Página:** Los eventos sintéticos de React usaban listeners pasivos que permitían que el navegador hiciera scroll hacia abajo en la web. Se implementaron listeners nativos en el DOM con `{ passive: false }` tanto para rueda del ratón (`wheel`) como para gestos táctiles (`touchmove`) invocando `e.preventDefault()` y `e.stopPropagation()`. La página web queda 100% inmóvil mientras el usuario avanza el video o la cámara 3D.
  - **Botón Agrandar / Pantalla Completa Real (`createPortal`):** El contenedor estaba atrapado dentro de contenedores ancestros con transformaciones CSS de `<Reveal>`. Se migró el renderizado de pantalla completa a `createPortal(..., document.body)`, bloqueando el scroll del body (`document.body.style.overflow = 'hidden'`), con soporte para tecla Escape, salida nativa de Fullscreen y botón destacado de cierre.
- **Despliegue y Verificación:**
  - Build local con Vite (`0 errores`).
  - Desplegado en Cloudflare Pages (`https://geosoftweb.pages.dev`).
  - Smoke test confirmado con HTTP 200 en `cube-sequence` y producción.

### 2026-10-12 — Optimización 100% Responsive para Teléfonos Móviles y Dispositivos Táctiles
- **Viewport y Meta Etiquetas (`index.html`):**
  - Configurado `viewport-fit=cover` y `maximum-scale=5.0` para cobertura nativa edge-to-edge en pantallas con Dynamic Island, notch y barras de navegación en iOS Safari y Chrome Android.
- **Distribución de Elementos Flotantes Anti-Colisión (`App.tsx` y `FloatingChat.tsx`):**
  - **Botón Cubo 3D:** En móviles pasa a formato compacto *"💎 Cubo 3D"* (`text-[11px] px-3 py-1.5`) posicionado en `bottom-4 left-3` con capa de prioridad segura (`z-30`).
  - **Botón Asesor IA:** Tamaño táctil ergonómico de 48px (`w-12 h-12`) en `bottom-4 right-3` con ocultamiento automático del tooltip horizontal en móviles para evitar superposiciones con el botón del cubo 3D.
  - **Drawer de Chat en Móvil:** Altura dinámica con `80dvh` (Dynamic Viewport Height) para adaptación inmediata al teclado virtual sin desbordar la pantalla.
- **Navegación Móvil y Menú Hamburguesa (`Navbar.tsx`):**
  - Botón hamburguesa con área táctil ampliada de 38px (`min-w-[36px] min-h-[36px]`) para pulsación cómoda.
  - Bloqueo de scroll en el fondo (`overflow: hidden`) mientras el menú móvil está abierto.
  - Telón de fondo oscurecido (`backdrop-blur-sm bg-black/70`) para cierre instantáneo al tocar fuera del menú.
- **Showcase Interactivo y Reel de Video (`InteractiveVideoShowcase.tsx`):**
  - Selector de modo (Interactivo vs Video MP4) con disposición flexible vertical/horizontal adaptativa en móviles.
  - Barra de progreso tipo Stories con separación compacta (`gap-1`).
  - Tipografía fluida (`text-xl sm:text-2xl md:text-3xl`) en los títulos de solución y métricas compactas legibles.
  - Marco tipo software con URL truncada dinámicamente y botones a ancho completo en móviles.
- **Visor 3D Interactivo (`HolographicCubeViewer.tsx`):**
  - HUD superior adaptable con título truncado y badge compacto *"Smart Quad"*.
  - Guía táctil específica para smartphones: *"👆 Toca y gira 360° • Pellizca para zoom"*.
  - Botones inferiores en rejilla táctil fluida de 2 columnas que no ocultan el canvas 3D.
- **Modales de Cita y Proyectos (`BookingModal.tsx`, `ProjectsSection.tsx`):**
  - Modal de reservas con `min-h-[460px] max-h-[90dvh]` y scroll interno para pantallas pequeñas y teclados abiertos.
  - Filtros de proyectos con espaciado elástico y botones de fácil toque.
- **Estilos Base y Táctiles (`index.css`):**
  - Eliminado el destello gris de selección táctil con `-webkit-tap-highlight-color: transparent`.
  - Asegurada la contención de ancho con `overflow-x: hidden`, `width: 100%` y `max-width: 100vw`.
- **Verificación y Despliegue:**
  - Build local con Vite (`0 errores`).
  - Desplegado en Cloudflare Pages (`https://geosoftweb.pages.dev`).
  - Smoke test confirmado con HTTP 200 en producción.

### 2026-10-12 — Visor 3D Interactivo del Cubo Holográfico Esmeralda (Demo en Vivo)
- **Componente Visor 3D (`HolographicCubeViewer.tsx`):**
  - **Recreación Exacta del Cubo del Video (`Grabación cubo 2026 cubo.mp4`):**
    - Carcasa de cristal esmeralda translúcido (`MeshPhysicalMaterial` con transmisión de 0.88, refracción IOR 1.54 y dispersión volumétrica verde agua).
    - Rejilla quad wireframe holográfica interior de 16x16 divisiones por cara en neón cian/esmeralda con pilares cilíndricos esquineros.
    - Núcleo de luz interna con resplandor pulsante.
  - **Cinemática Fly-Through de Cámara:** Botón que reproduce la toma del video (la cámara penetra en el cubo, recorre el entramado holográfico interior y sale suavemente).
  - **Morfismo a Marco Rombo / Prisma Hueco:** Animación de apertura que transforma el cubo en el marco biselado hueco de 4 barras como en el segundo 20 del video.
  - **Control Orbital Libre con el Ratón/Touch:** Arrastre de 360°, rotación en cualquier ángulo y zoom infinito con la rueda del ratón.
  - **Carga Directa de Archivos `.GLB`:** Botón para importar modelos 3D `.glb` exportados por el usuario con detección automática de escala y animaciones.
  - **Botón Flotante de Acceso Inmediato:** Píldora inferior izquierda *"💎 Probar Cubo 3D en Vivo"* y acceso por URL hash (`#cubo` o `#cubo3d`).
- **Despliegue y Verificación:**
  - Compilado con Vite code-splitting (`HolographicCubeViewer-E0SgbJz0.js`).
  - Desplegado a Cloudflare Pages (`https://geosoftweb.pages.dev`).

### 2026-10-12 — Video Cinemático de Alta Fidelidad & Showcase Reel con Imágenes Reales y Ken Burns
- **Imágenes Reales de Producto Ultra-HD en 16:9 (`public/assets/showcase/`):**
  - Generadas 9 piezas visuales fotorrealistas de clase Silicon Valley para cada una de las 9 soluciones:
    1. *01-chatbots.jpg:* Dashboard de IA con analítica en vivo y WhatsApp Business.
    2. *02-web.jpg:* MacBook Pro flotante con landing page Dark Tech y tarjeta holográfica.
    3. *03-membership.jpg:* Pantalla de cristal oscuro de academia VIP y reproductor de cursos.
    4. *04-saas.jpg:* Monitor curvo ultrawide con telemetría de servidores y métricas MRR.
    5. *05-crm.jpg:* Tablero comercial visual en tableta y monitor con pipeline de ventas.
    6. *06-custom-software.jpg:* Espacio de trabajo de ingeniería con monitores 4K y arquitectura cloud.
    7. *07-automation.jpg:* Red neuronal de workflows conectando Webhooks, IA y pasarelas de pago.
    8. *08-booking.jpg:* Plataforma de reservas de lujo con confirmación instantánea de Sinpe Móvil.
    9. *09-pwa.jpg:* Smartphone flotante con aplicación web progresiva y diseño futurista.
- **Efecto de Movimiento Cinemático Ken Burns (`scripts/generate_cinematic_showcase_video.js`):**
  - Eliminado cualquier aspecto plano o estático: la cámara se desplaza y hace zoom continuo (`zoompan`) sobre cada interfaz real.
  - Viñeta inferior en gradiente oscuro para tipografía nítida en Segoe UI con badges de color glowing y métricas estratégicas.
  - Transiciones suaves de crossfade (`fade in/out`) sincronizadas con la música ambiental instrumental (`ambient-music.mp3`).
  - Video renderizado a 1920x1080 Full HD (6.88 MB) en `public/videos/geosoft-showcase.mp4`.
- **Componente Web Interactivo Elevado (`InteractiveVideoShowcase.tsx`):**
  - El modo interactivo integra los renders de alta resolución dentro de un marco de ventana tecnológica de software con resplandor ambiental reactivo, badge interactivo y micro-escalado al pasar el ratón.
  - Selector de modo para reproducir el video cinemático Full HD o interactuar con las soluciones paso a paso.
- **Verificación y Despliegue en Producción:**
  - Build local con Vite (`dist` actualizado con imágenes y video).
  - Desplegado a Cloudflare Pages con verificación HTTP 200 en `geosoftweb.pages.dev`, `/videos/geosoft-showcase.mp4` y `/assets/showcase/01-chatbots.jpg`.

### 2026-10-12 — Menú de Servicios Ultra-Estable, Clic Bonito (click.wav) & Limpieza de Tooltip IA
- **Burbuja de Asesor IA Flotante (`FloatingChat.tsx`):**
  - Removido el ícono ✨ del tooltip de llamada a la acción para un aspecto minimalista, limpio y nítido.
- **Menú Desplegable de Servicios (`Navbar.tsx`):**
  - **Eliminación del Cierre Prematuro:** Se eliminó el espacio muerto (`mt-2`) que provocaba la pérdida de foco del mouse al descender, reemplazándolo por posicionamiento continuo (`pt-2`) y un **puente seguro invisible de 16px** que mantiene la superficie interactiva ininterrumpida.
  - **Retardo de Gracia (Hover Grace Buffer):** Temporizador de 280ms (`dropdownTimeoutRef`) al salir del elemento, permitiendo movimientos diagonales o rápidos sin cierres accidentales.
  - **Apertura Persistente por Clic & Click-Outside:** Al hacer clic sobre "Servicios", el menú permanece abierto de forma sólida hasta que el usuario elija una opción o haga clic fuera del menú.
- **Sonido de Clic Bonito y Profesional (`click.wav` & `soundEffects.ts`):**
  - **Buffer Precargado de Alta Fidelidad (`click.wav`):** Síntesis PCM de 55ms a 44.1kHz con forma de onda senoidal armónica (620Hz -> 160Hz con ataque terso de 2ms y caída sedosa), volumen calibrado a `0.35`.
  - **Cero Estática o Ruido Áspero:** Se erradicó cualquier ráfaga de ruido blanco sintético; el sonido es un *UI Pop* limpio, dulce, táctil y de alta gama.
  - **Fallback Armónico Puro:** Si el buffer no ha cargado, un oscilador senoidal dual reproduce exactamente la misma curva armónica.

### 2026-10-12 — Sustitución Definitiva por Música Moderna Chillout & Cortina de Humo para Cursor
- **Música Moderna y Bonita de Alta Calidad (`ambient-music.mp3`):**
  - Erradicación total y definitiva del oscilador/drone de baja frecuencia que generaba el molesto sonido a motor.
  - Implementación de una pista instrumental real en MP3 (`/assets/audio/ambient-music.mp3`) de estilo chillout / lo-fi moderno, melódica, elegante y relajante.
  - Reproductor HTML5 Audio optimizado en `soundEffects.ts`:
    - Loop continuo sin interrupciones.
    - Fade-in progresivo delicado (`0.22` de volumen máximo) tras la primera interacción del usuario.
    - Fade-out progresivo al pausar o silenciar desde el botón de volumen del Navbar.
- **Cortina de Humo Fluido al Mover el Cursor (`SmokeCursorTrail.tsx`):**
  - Rastro continuo de volutas de humo vaporoso (`screen composite operation`) con física de expansión progresiva, turbulencia y desvanecimiento suave.

### 2026-10-12 — Cuadro de Agendar Cita: Animación Simétrica al Dar Clic en Cerrar
- **Salida Cinemática Hacia Arriba (`animate-modal-leave`):**
  - Al hacer clic en cerrar, el cuadro se repliega con fluidez simétrica hacia arriba (`translateY(-38px)`), reduciendo sutilmente su escala a `0.98`, difuminándose con `filter: blur(10px)` y desvaneciéndose en `opacity: 0` durante 480ms con curva orgánica `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Desvanecimiento Suave del Fondo (`animate-backdrop-leave`):** Telón translúcido desvanecido suavemente en 450ms.
