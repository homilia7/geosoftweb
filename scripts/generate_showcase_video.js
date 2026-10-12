import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const FFMPEG_PATH = 'C:\\Users\\User\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0-full_build\\bin\\ffmpeg.exe';
const FONT_REGULAR = 'C\\:/Windows/Fonts/segoeui.ttf';
const FONT_BOLD = 'C\\:/Windows/Fonts/segoeuib.ttf';

const OUTPUT_DIR = path.resolve('public/videos');
const TEMP_DIR = path.resolve('public/videos/temp_scenes');
const FINAL_VIDEO = path.join(OUTPUT_DIR, 'geosoft-showcase.mp4');
const AUDIO_FILE = path.resolve('public/assets/audio/ambient-music.mp3');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const scenes = [
  {
    badge: 'ECOSISTEMA GEOSOFT',
    title: 'Transformamos Ideas en Software',
    subtitle: 'Desarrollo web de alta gama, inteligencia artificial y automatizacion empresarial.',
    highlight: '9 SOLUCIONES DIGITALES CLAVE',
    metric1: '100 Por Ciento Personalizado',
    metric2: 'Arquitectura Cloud Escalamiento Garantizado',
    badgeColor: '0x104a0e',
    accentColor: '0xA9F8B5'
  },
  {
    badge: 'INTELIGENCIA ARTIFICIAL',
    title: 'Chatbots & Agentes de IA 24/7',
    subtitle: 'Atencion inmediata, calificacion automatica de clientes y conexion a WhatsApp Cloud API.',
    highlight: 'El 70 de cada 100 ventas se concretan respondiendo en los primeros 5 minutos.',
    metric1: '+340 Por Ciento Mas Conversiones',
    metric2: 'Atencion 24/7 sin descanso humano',
    badgeColor: '0x104a0e',
    accentColor: '0xA9F8B5'
  },
  {
    badge: 'DISENO WEB CORPORATIVO',
    title: 'Paginas Web de Alto Impacto',
    subtitle: 'Diseno visual irresistible, tiempos de carga inferiores a 0.5s y optimizacion SEO total.',
    highlight: 'Sitios corporativos que proyectan prestigio y capturan oportunidades comerciales.',
    metric1: 'Lighthouse 100/100',
    metric2: 'Optimizadas para Google y Alajuela/San Jose',
    badgeColor: '0x1f2937',
    accentColor: '0x38bdf8'
  },
  {
    badge: 'COMUNIDADES & ACADEMIAS',
    title: 'Sitios de Membresia & LMS',
    subtitle: 'Portales de contenido exclusivo, reproduccion protegida y cobros recurrentes automaticos.',
    highlight: 'Monetiza tu conocimiento y construye comunidades privadas leales.',
    metric1: 'Suscripciones Activas',
    metric2: 'Control de acceso por roles y niveles VIP',
    badgeColor: '0x431407',
    accentColor: '0xfb923c'
  },
  {
    badge: 'SOLUCIONES CLOUD B2B',
    title: 'Plataformas SaaS Escalables',
    subtitle: 'Software como Servicio con paneles multi-tenant, facturacion modular y alta disponibilidad.',
    highlight: 'Infraestructura serverless global con latencia cero sobre Cloudflare.',
    metric1: '99.99 Uptime Ininterrumpido',
    metric2: 'Crecimiento sin limite de servidores',
    badgeColor: '0x1e1b4b',
    accentColor: '0x818cf8'
  },
  {
    badge: 'CONTROL COMERCIAL',
    title: 'Sistemas CRM a la Medida',
    subtitle: 'Pipelines de ventas visuales, seguimiento de prospectos y cero licencias por usuario.',
    highlight: 'Ten el control absoluto de tu equipo comercial sin pagar miles de dolares a terceros.',
    metric1: 'Cero Comisiones Extra',
    metric2: 'Reportes y conversion en tiempo real',
    badgeColor: '0x3b0764',
    accentColor: '0xc084fc'
  },
  {
    badge: 'INGENIERIA DE SOFTWARE',
    title: 'Software a la Medida',
    subtitle: 'Desarrollo a codigo limpio para cuellos de botella unicos y operaciones de alta exigencia.',
    highlight: 'Bases de datos blindadas, auditoria estricta y flujos operativos eficientes.',
    metric1: 'Seguridad Militar',
    metric2: 'Adaptado al 100 por ciento a tus reglas de negocio',
    badgeColor: '0x27272a',
    accentColor: '0xe2e8f0'
  },
  {
    badge: 'EFICIENCIA OPERATIVA',
    title: 'Automatizacion de Procesos',
    subtitle: 'Sincronizacion entre bases de datos, APIs y webhooks sin ninguna intervencion manual.',
    highlight: 'Ahorra cientos de horas mensuales eliminando tareas repetitivas de administracion.',
    metric1: '-85 Por Ciento Tiempo Operativo',
    metric2: 'Flujos 100 por ciento auditados y blindados',
    badgeColor: '0x701a75',
    accentColor: '0xf472b6'
  },
  {
    badge: 'GESTION DE CITAS & PAGOS',
    title: 'Sistemas de Reservas & Cobros',
    subtitle: 'Agendas en vivo para clinicas, hoteles y servicios con cobro directo Sinpe Movil y Stripe.',
    highlight: 'Cero overbooking. Recordatorios automaticos por WhatsApp para reducir inasistencias.',
    metric1: 'Sinpe Movil & Stripe',
    metric2: 'Confirmacion y envio de recibo en 2s',
    badgeColor: '0x713f12',
    accentColor: '0xfde047'
  },
  {
    badge: 'TECNOLOGIA MOVIL Y DESKTOP',
    title: 'Aplicaciones Web Progresivas (PWA)',
    subtitle: 'Aplicaciones ultra-fluidas instalables directamente en telefonos moviles y computadoras.',
    highlight: 'Experiencia nativa veloz sin pagar el 30 por ciento a tiendas de aplicaciones.',
    metric1: 'Multiplataforma iOS / Android',
    metric2: 'Acceso offline y notificaciones push',
    badgeColor: '0x064e3b',
    accentColor: '0x34d399'
  },
  {
    badge: 'IMPULSA TU CRECIMIENTO',
    title: 'Tu Proyecto Listo con GeoSoft',
    subtitle: 'Cotizacion instantanea, asesoria de expertos y desarrollo garantizado a la primera.',
    highlight: 'Habla hoy mismo con nuestro equipo y lleva tu empresa al siguiente nivel.',
    metric1: 'Entrega Puntual Garantizada',
    metric2: 'geosoftweb.pages.dev • Contactanos 24/7',
    badgeColor: '0x104a0e',
    accentColor: '0xA9F8B5'
  }
];

console.log(`🎬 Generando ${scenes.length} escenas con FFmpeg...`);

const sceneFiles = [];

for (let i = 0; i < scenes.length; i++) {
  const sc = scenes[i];
  const scenePath = path.join(TEMP_DIR, `scene_${i.toString().padStart(2, '0')}.mp4`);
  sceneFiles.push(scenePath);

  const duration = i === 0 || i === scenes.length - 1 ? 3.5 : 3.0;

  const sanitize = (txt) => (txt || '').replace(/%/g, '').replace(/'/g, '').replace(/:/g, '\\:');

  // Filtros de video de alta estetica
  const vf = [
    // Marco exterior con brillo sutil
    `drawbox=x=80:y=60:w=1760:h=960:color=0x181e28@0.9:t=2`,
    `drawbox=x=82:y=62:w=1756:h=956:color=0x0a0d14@0.98:t=fill`,

    // Barra superior decorativa estilo app
    `drawbox=x=120:y=100:w=1680:h=50:color=0x111622@0.9:t=fill`,
    `drawbox=x=140:y=120:w=12:h=12:color=0xef4444:t=fill`,
    `drawbox=x=165:y=120:w=12:h=12:color=0xf59e0b:t=fill`,
    `drawbox=x=190:y=120:w=12:h=12:color=0x10b981:t=fill`,
    `drawtext=fontfile='${FONT_REGULAR}':text='geosoft.cr // showcase-reel // modulo-${i+1}':fontcolor=0x64748b:fontsize=16:x=230:y=116`,

    // Badge de categoría
    `drawbox=x=120:y=200:w=440:h=48:color=${sc.badgeColor}@0.85:t=fill`,
    `drawbox=x=120:y=200:w=440:h=48:color=${sc.accentColor}@0.7:t=1`,
    `drawtext=fontfile='${FONT_BOLD}':text='${sanitize(sc.badge)}':fontcolor=${sc.accentColor}:fontsize=20:x=140:y=213`,

    // Título Principal
    `drawtext=fontfile='${FONT_BOLD}':text='${sanitize(sc.title)}':fontcolor=white:fontsize=56:x=120:y=280`,

    // Subtítulo
    `drawtext=fontfile='${FONT_REGULAR}':text='${sanitize(sc.subtitle)}':fontcolor=0x94a3b8:fontsize=28:x=120:y=365`,

    // Tarjeta Central de Característica
    `drawbox=x=120:y=440:w=1680:h=230:color=0x0f1420@0.9:t=fill`,
    `drawbox=x=120:y=440:w=8:h=230:color=${sc.accentColor}:t=fill`,
    `drawtext=fontfile='${FONT_BOLD}':text='VALOR ESTRATEGICO':fontcolor=0x64748b:fontsize=18:x=160:y=480`,
    `drawtext=fontfile='${FONT_REGULAR}':text='${sanitize(sc.highlight)}':fontcolor=white:fontsize=36:x=160:y=535`,

    // Tarjetas inferiores de Métricas / Features
    `drawbox=x=120:y=720:w=820:h=160:color=0x131a29@0.85:t=fill`,
    `drawbox=x=120:y=720:w=820:h=160:color=0x1e293b@0.8:t=1`,
    `drawtext=fontfile='${FONT_BOLD}':text='${sanitize(sc.metric1)}':fontcolor=${sc.accentColor}:fontsize=32:x=160:y=780`,

    `drawbox=x=980:y=720:w=820:h=160:color=0x131a29@0.85:t=fill`,
    `drawbox=x=980:y=720:w=820:h=160:color=0x1e293b@0.8:t=1`,
    `drawtext=fontfile='${FONT_REGULAR}':text='${sanitize(sc.metric2)}':fontcolor=0xe2e8f0:fontsize=26:x=1020:y=785`,

    // Indicador de Progreso del Reel (11 segmentos)
    ...Array.from({ length: 11 }).map((_, segIdx) => {
      const segW = 145;
      const segX = 120 + segIdx * (segW + 8);
      const isFilled = segIdx <= i;
      const col = isFilled ? sc.accentColor : '0x334155@0.5';
      return `drawbox=x=${segX}:y=940:w=${segW}:h=6:color=${col}:t=fill`;
    })
  ].join(',');

  const cmd = `"${FFMPEG_PATH}" -y -f lavfi -i "color=c=0x06080e:s=1920x1080:d=${duration}:r=30" -vf "${vf}" -c:v libx264 -pix_fmt yuv420p "${scenePath}"`;
  
  process.stdout.write(`Renderizando escena ${i + 1}/${scenes.length} (${sc.badge})... `);
  execSync(cmd, { stdio: 'pipe' });
  console.log('✓');
}

// Concatenar escenas en video final con pista de audio
console.log('🔗 Concatenando escenas y mezclando pista de audio...');
const concatListFile = path.join(TEMP_DIR, 'concat.txt');
const concatContent = sceneFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(concatListFile, concatContent);

const concatCmd = `"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${concatListFile.replace(/\\/g, '/')}" -i "${AUDIO_FILE.replace(/\\/g, '/')}" -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "${FINAL_VIDEO}"`;
execSync(concatCmd, { stdio: 'pipe' });

console.log(`✅ ¡Video final generado con éxito en: ${FINAL_VIDEO}!`);
console.log(`📦 Tamaño del archivo: ${(fs.statSync(FINAL_VIDEO).size / (1024 * 1024)).toFixed(2)} MB`);
