import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const FFMPEG_PATH = 'C:\\Users\\User\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0-full_build\\bin\\ffmpeg.exe';
const FONT_REGULAR = 'C\\:/Windows/Fonts/segoeui.ttf';
const FONT_BOLD = 'C\\:/Windows/Fonts/segoeuib.ttf';

const OUTPUT_DIR = path.resolve('public/videos');
const TEMP_DIR = path.resolve('public/videos/temp_cinematic');
const FINAL_VIDEO = path.join(OUTPUT_DIR, 'geosoft-showcase.mp4');
const AUDIO_FILE = path.resolve('public/assets/audio/ambient-music.mp3');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const scenes = [
  {
    image: 'public/assets/showcase/01-chatbots.jpg',
    badge: 'INTELIGENCIA ARTIFICIAL',
    title: 'Chatbots & Agentes de IA 24/7',
    subtitle: 'Atencion instantanea, calificacion automatica y conexion a WhatsApp Cloud API.',
    metric1: '+340x Conversiones',
    metric2: 'Atencion 24/7 sin descanso humano',
    badgeColor: '0x064e3b',
    accentColor: '0xA9F8B5'
  },
  {
    image: 'public/assets/showcase/02-web.jpg',
    badge: 'DISENO WEB CORPORATIVO',
    title: 'Paginas Web de Alto Impacto',
    subtitle: 'Carga ultrarrapida en 0.3s, estetica Dark Tech premium y posicionamiento SEO.',
    metric1: 'Lighthouse 100/100',
    metric2: 'Optimizadas para Alajuela y San Jose',
    badgeColor: '0x0c4a6e',
    accentColor: '0x38bdf8'
  },
  {
    image: 'public/assets/showcase/03-membership.jpg',
    badge: 'COMUNIDADES & ACADEMIAS',
    title: 'Sitios de Membresia & LMS',
    subtitle: 'Portales de contenido exclusivo, reproduccion protegida y cobros recurrentes.',
    metric1: 'Suscripciones Activas',
    metric2: 'Control de acceso VIP por roles',
    badgeColor: '0x7c2d12',
    accentColor: '0xfb923c'
  },
  {
    image: 'public/assets/showcase/04-saas.jpg',
    badge: 'PLATAFORMAS EN LA NUBE',
    title: 'Plataformas SaaS Escalables',
    subtitle: 'Software as a Service con arquitectura multi-tenant y telemetria en tiempo real.',
    metric1: '99.99 Uptime Global',
    metric2: 'Latencia 12ms sobre Cloudflare D1',
    badgeColor: '0x312e81',
    accentColor: '0x818cf8'
  },
  {
    image: 'public/assets/showcase/05-crm.jpg',
    badge: 'GESTION COMERCIAL',
    title: 'Sistemas CRM a la Medida',
    subtitle: 'Pipelines de ventas visuales, tracking de clientes y cero licencias por usuario.',
    metric1: 'Cero Licencias Extra',
    metric2: 'Control 360 de prospectos y ventas',
    badgeColor: '0x581c87',
    accentColor: '0xc084fc'
  },
  {
    image: 'public/assets/showcase/06-custom-software.jpg',
    badge: 'INGENIERIA DE SOFTWARE',
    title: 'Software a la Medida',
    subtitle: 'Desarrollo ad-hoc con arquitectura modular, codigo limpio y maxima seguridad.',
    metric1: '100 por ciento Personalizado',
    metric2: 'Adaptado a tus reglas de negocio',
    badgeColor: '0x1e293b',
    accentColor: '0xe2e8f0'
  },
  {
    image: 'public/assets/showcase/07-automation.jpg',
    badge: 'EFICIENCIA OPERATIVA',
    title: 'Automatizacion de Procesos',
    subtitle: 'Sincronizacion entre bases de datos, APIs y webhooks sin intervencion manual.',
    metric1: '-85x Horas Manuales',
    metric2: 'Flujos 100 auditados y continuos',
    badgeColor: '0x831843',
    accentColor: '0xf472b6'
  },
  {
    image: 'public/assets/showcase/08-booking.jpg',
    badge: 'AGENDAMIENTO EN LINEA',
    title: 'Sistemas de Reservas & Cobros',
    subtitle: 'Agendas en vivo para clinicas y hoteles con cobro instantaneo Sinpe Movil y Stripe.',
    metric1: 'Sinpe Movil & Stripe',
    metric2: 'Confirmacion automatica en 2s',
    badgeColor: '0x713f12',
    accentColor: '0xfde047'
  },
  {
    image: 'public/assets/showcase/09-pwa.jpg',
    badge: 'TECNOLOGIA MOVIL NATIVA',
    title: 'Aplicaciones Web Progresivas (PWA)',
    subtitle: 'Apps fluidas a 60 FPS instalables en movil y desktop sin comision de tiendas.',
    metric1: 'Multiplataforma iOS / Android',
    metric2: 'Modo Offline y Notificaciones Push',
    badgeColor: '0x065f46',
    accentColor: '0x34d399'
  }
];

console.log(`🎬 Generando ${scenes.length} escenas cinematográficas con Ken Burns & UI Renders...`);

const sceneFiles = [];

for (let i = 0; i < scenes.length; i++) {
  const sc = scenes[i];
  const scenePath = path.join(TEMP_DIR, `cinematic_${i.toString().padStart(2, '0')}.mp4`);
  sceneFiles.push(scenePath);

  const durationSec = 3.2;
  const fps = 30;
  const totalFrames = Math.round(durationSec * fps);

  const sanitize = (txt) => (txt || '').replace(/%/g, '').replace(/'/g, '').replace(/:/g, '\\:');

  // Dirección alternativa del zoom/pan para dinamismo
  const zoomExpr = i % 2 === 0
    ? `min(zoom+0.0012,1.15)`
    : `max(1.15-0.0012*on,1.0)`;

  const panX = i % 2 === 0
    ? `iw/2-(iw/zoom/2)`
    : `(iw-iw/zoom)*(on/${totalFrames})`;

  const panY = `ih/2-(ih/zoom/2)`;

  // Filtros combinados: Ken Burns + Viñeta inferior + Badges + Tipografía + Fade In/Out
  const vf = [
    // 1. Ken Burns Effect (Cámara lenta que se mueve sobre la imagen de alta definición)
    `scale=1920:1080`,
    `zoompan=z='${zoomExpr}':x='${panX}':y='${panY}':d=${totalFrames}:s=1920x1080:fps=${fps}`,

    // 2. Viñeta oscura inferior para legibilidad cinematográfica
    `drawbox=x=0:y=640:w=1920:h=440:color=0x03060a@0.90:t=fill`,
    `drawbox=x=0:y=640:w=1920:h=2:color=${sc.accentColor}@0.8:t=fill`,

    // 3. Marca de agua superior GeoSoft
    `drawbox=x=80:y=50:w=260:h=38:color=0x0a0f18@0.85:t=fill`,
    `drawbox=x=80:y=50:w=260:h=38:color=0x1e293b@0.8:t=1`,
    `drawtext=fontfile='${FONT_BOLD}':text='GEOSOFT SHOWCASE':fontcolor=white:fontsize=15:x=100:y=62`,

    // 4. Badge de la solución
    `drawbox=x=80:y=680:w=360:h=42:color=${sc.badgeColor}@0.90:t=fill`,
    `drawbox=x=80:y=680:w=360:h=42:color=${sc.accentColor}@0.8:t=1`,
    `drawtext=fontfile='${FONT_BOLD}':text='${sanitize(sc.badge)}':fontcolor=${sc.accentColor}:fontsize=18:x=100:y=692`,

    // 5. Título Principal
    `drawtext=fontfile='${FONT_BOLD}':text='${sanitize(sc.title)}':fontcolor=white:fontsize=46:x=80:y=745`,

    // 6. Subtítulo explicativo
    `drawtext=fontfile='${FONT_REGULAR}':text='${sanitize(sc.subtitle)}':fontcolor=0x94a3b8:fontsize=23:x=80:y=815`,

    // 7. Tarjeta flotante de métricas
    `drawbox=x=1360:y=690:w=480:h=150:color=0x0a0f18@0.92:t=fill`,
    `drawbox=x=1360:y=690:w=480:h=150:color=0x1e293b@0.9:t=1`,
    `drawtext=fontfile='${FONT_BOLD}':text='${sanitize(sc.metric1)}':fontcolor=${sc.accentColor}:fontsize=30:x=1390:y=725`,
    `drawtext=fontfile='${FONT_REGULAR}':text='${sanitize(sc.metric2)}':fontcolor=0xe2e8f0:fontsize=20:x=1390:y=780`,

    // 8. Barra de progreso segmentada en la parte superior
    ...Array.from({ length: 9 }).map((_, segIdx) => {
      const segW = 180;
      const segX = 80 + segIdx * (segW + 16);
      const isFilled = segIdx <= i;
      const col = isFilled ? sc.accentColor : '0x334155@0.5';
      return `drawbox=x=${segX}:y=100:w=${segW}:h=4:color=${col}:t=fill`;
    }),

    // 9. Transición cinematográfica: Crossfade suave al entrar y salir (fade in 0.3s, fade out 0.3s)
    `fade=t=in:st=0:d=0.35`,
    `fade=t=out:st=${(durationSec - 0.35).toFixed(2)}:d=0.35`
  ].join(',');

  const cmd = `"${FFMPEG_PATH}" -y -i "${path.resolve(sc.image).replace(/\\/g, '/')}" -vf "${vf}" -c:v libx264 -pix_fmt yuv420p "${scenePath}"`;

  process.stdout.write(`Renderizando escena cinematográfica ${i + 1}/${scenes.length} (${sc.badge})... `);
  execSync(cmd, { stdio: 'pipe' });
  console.log('✓');
}

// Concatenar con la música ambiental
console.log('🔗 Ensamblando video final con audio en alta resolución...');
const concatListFile = path.join(TEMP_DIR, 'concat.txt');
const concatContent = sceneFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(concatListFile, concatContent);

const concatCmd = `"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${concatListFile.replace(/\\/g, '/')}" -i "${AUDIO_FILE.replace(/\\/g, '/')}" -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "${FINAL_VIDEO}"`;
execSync(concatCmd, { stdio: 'pipe' });

console.log(`✨ ¡Video cinemático generado con éxito en: ${FINAL_VIDEO}!`);
console.log(`📦 Tamaño final: ${(fs.statSync(FINAL_VIDEO).size / (1024 * 1024)).toFixed(2)} MB`);
