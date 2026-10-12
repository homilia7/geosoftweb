import React, { useState } from 'react';
import { ExternalLink, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Reveal } from './Reveal';

interface Project {
  id: string;
  title: string;
  category: string;
  tag: 'ia' | 'saas' | 'ecommerce';
  badge: string;
  description: string;
  metrics: string;
  technologies: string[];
  gradient: string;
  demoUrl?: string;
}

export const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'ia' | 'saas' | 'ecommerce'>('todos');

  const projects: Project[] = [
    {
      id: 'dentalclik',
      title: 'DentalClik AI Platform',
      category: 'HealthTech & Citas Médicas',
      tag: 'ia',
      badge: 'Agentes 24/7 + Reservas',
      description: 'Plataforma médica para clínicas dentales con asistente de IA que agenda pacientes, envía recordatorios por WhatsApp y gestiona expedientes en tiempo real.',
      metrics: '+340% Citas Automatizadas',
      technologies: ['React', 'Cloudflare Workers', 'WhatsApp Cloud API', 'OpenAI'],
      gradient: 'from-[#004d40] to-[#104a0e]',
      demoUrl: 'https://dentalclik-app.pages.dev'
    },
    {
      id: 'declara360',
      title: 'Declara 360 FinTech',
      category: 'Facturación & Tributación',
      tag: 'saas',
      badge: 'SaaS Empresarial',
      description: 'Sistema web de facturación electrónica y gestión tributaria inteligente para empresas y profesionales independientes con reportes automáticos.',
      metrics: '0% Errores de Facturación',
      technologies: ['React', 'PostgreSQL', 'Cloudflare Pages', 'Tailwind CSS'],
      gradient: 'from-[#1a1a1a] to-[#25272a]',
      demoUrl: 'https://declara360-alr.pages.dev'
    },
    {
      id: 'clikfood',
      title: 'ClikFood GastroPlatform',
      category: 'E-commerce & Delivery',
      tag: 'ecommerce',
      badge: 'Pedidos en Vivo',
      description: 'Ecosistema de pedidos gastronómicos digitales con menú autoadministrable, cobros instantáneos por Sinpe Móvil y despacho directo a WhatsApp.',
      metrics: '< 45s Tiempo de Orden',
      technologies: ['React', 'SinpePay Gateway', 'Vite', 'Supabase'],
      gradient: 'from-[#735c00] to-[#1a1a1a]',
      demoUrl: 'https://clikfood.pages.dev'
    },
    {
      id: 'carautos',
      title: 'CarAutos CR Marketplace',
      category: 'Marketplace Automotriz',
      tag: 'saas',
      badge: 'Catálogo de Vehículos',
      description: 'Portal de compra y venta de autos de alta gama con filtros interactivos, cotizador de financiamiento y contacto directo por WhatsApp.',
      metrics: '+180% Prospectos Cualificados',
      technologies: ['React', 'Cloudflare CDN', 'Tailwind', 'REST API'],
      gradient: 'from-[#141517] to-[#040404]',
      demoUrl: 'https://carautoscr.pages.dev'
    },
    {
      id: 'sinpepay',
      title: 'SinpePay Gateway Suite',
      category: 'Pasarela de Cobros Nativos',
      tag: 'ecommerce',
      badge: 'Sinpe Móvil Automático',
      description: 'Integración y validación automática de pagos por Sinpe Móvil para comercios digitales en Costa Rica, eliminando comprobantes manuales.',
      metrics: 'Verificación en &lt; 2 seg',
      technologies: ['Node.js API', 'Webhooks', 'Cifrado SHA-256', 'Sinpe'],
      gradient: 'from-[#004d40] to-[#735c00]'
    },
    {
      id: 'bosuni',
      title: 'Bosuni CR Luxury Stays',
      category: 'Hospitality & Reservas',
      tag: 'ecommerce',
      badge: 'Comunidades & Hospedaje',
      description: 'Motor exclusivo de reservas para hospedajes y experiencias de montaña con calendario interactivo y pasarela de cobros recurrentes.',
      metrics: '100% Sin Overbooking',
      technologies: ['React', 'Calendar Sync', 'Cloudflare Pages', 'Stripe'],
      gradient: 'from-[#104a0e] to-[#1a1a1a]',
      demoUrl: 'https://bosuni.pages.dev'
    }
  ];

  const filteredProjects = activeFilter === 'todos' 
    ? projects 
    : projects.filter(p => p.tag === activeFilter);

  return (
    <section id="proyectos" className="py-24 px-4 md:px-8 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <Reveal effect="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#A9F8B5]">
              <Sparkles className="w-3.5 h-3.5 text-[#DFF494]" />
              Casos Reales de Éxito
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
              Nuestros <span className="text-gradient-accent">Proyectos</span> Destacados
            </h2>
            <p className="text-gray-400 font-light text-sm sm:text-base">
              Explora algunas de las plataformas web, agentes de IA y sistemas SaaS que hemos diseñado y desplegado en producción.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'ia', label: 'IA & Agentes' },
              { id: 'saas', label: 'Plataformas SaaS' },
              { id: 'ecommerce', label: 'Reservas & Pagos' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black shadow-[0_0_15px_rgba(169,248,181,0.3)]'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj, idx) => (
            <Reveal
              key={proj.id}
              effect="up"
              delay={idx * 100}
              className="flex"
            >
              <div className="w-full card-accent p-5 sm:p-6 flex flex-col justify-between group">
                <div className="blob-glow" />

                <div className="space-y-5">
                  {/* Visual Banner Preview */}
                  <div className={`w-full h-40 rounded-2xl bg-gradient-to-tr ${proj.gradient} border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500`}>
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#A9F8B5] border border-white/10 font-bold">
                        {proj.badge}
                      </span>
                      {proj.demoUrl && (
                        <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white group-hover:bg-[#A9F8B5] group-hover:text-black transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <div className="z-10">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{proj.category}</div>
                      <div className="text-xl font-bold font-display text-white">{proj.title}</div>
                    </div>
                  </div>

                  {/* Description & Impact Metric */}
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Impacto Medible:</span>
                      <span className="text-xs font-bold font-mono text-[#DFF494]" dangerouslySetInnerHTML={{ __html: proj.metrics }} />
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-6 mt-4 border-t border-white/10">
                  {proj.demoUrl ? (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A9F8B5] hover:text-[#DFF494] transition-colors"
                    >
                      <span>Ver Proyecto en Vivo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#DFF494]" />
                      <span>Despliegue Privado Enterprise</span>
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
