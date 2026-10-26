import React, { useState } from 'react';
import { ExternalLink, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Reveal } from './Reveal';

interface Project {
  id: string;
  title: string;
  category: string;
  tag: 'reservas' | 'fintech' | 'saas';
  badge: string;
  description: string;
  metrics: string;
  technologies: string[];
  gradient: string;
  demoUrl?: string;
}

export const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'reservas' | 'fintech' | 'saas'>('todos');

  const projects: Project[] = [
    {
      id: 'reservascr',
      title: 'reservascr.app',
      category: 'Motor de Reservas & Agendas',
      tag: 'reservas',
      badge: 'Reservas en Vivo 24/7',
      description: 'Plataforma integral de gestión de reservas, citas y sincronización en tiempo real con notificaciones automáticas por WhatsApp y cobros integrados.',
      metrics: '+280% Eficiencia en Citas',
      technologies: ['React & Vite', 'Calendar Sync', 'WhatsApp API', 'Cloudflare Pages'],
      gradient: 'from-[#022c22] via-[#047857] to-[#10b981]',
      demoUrl: 'https://reservascr.app'
    },
    {
      id: 'sibopay',
      title: 'sibopay.com',
      category: 'Pasarela Fintech & Pagos Sinpe',
      tag: 'fintech',
      badge: 'Cobros Instantáneos',
      description: 'Pasarela de pagos rápidos y de alta seguridad con validación automatizada de transferencias Sinpe Móvil y cobros con tarjetas internacionales.',
      metrics: '< 3 seg Validación Sinpe',
      technologies: ['Fintech API', 'Sinpe Móvil', 'Stripe Gateway', 'Cifrado SHA-256'],
      gradient: 'from-[#0c2340] via-[#1d4ed8] to-[#0284c7]',
      demoUrl: 'https://sibopay.com'
    },
    {
      id: 'declara360',
      title: 'declara360.com',
      category: 'Facturación & Gestión Tributaria',
      tag: 'saas',
      badge: 'SaaS Empresarial',
      description: 'Sistema web de facturación electrónica inteligente y administración tributaria automatizada para empresas, comercios y profesionales independientes.',
      metrics: '100% Sin Errores Tributarios',
      technologies: ['React & TypeScript', 'PostgreSQL', 'API Tributaria', 'Cloudflare Pages'],
      gradient: 'from-[#450a0a] via-[#b91c1c] to-[#e11d48]',
      demoUrl: 'https://declara360.com'
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
              Últimos <span className="text-gradient-accent">Proyectos</span> Destacados
            </h2>
            <p className="text-gray-400 font-light text-sm sm:text-base">
              Plataformas web, motores de reservas y soluciones fintech de alta disponibilidad desarrolladas para negocios en producción.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'reservas', label: 'Reservas & Citas' },
              { id: 'fintech', label: 'Fintech & Pagos' },
              { id: 'saas', label: 'SaaS Tributario' }
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
                  <div className={`w-full h-44 rounded-2xl bg-gradient-to-tr ${proj.gradient} border border-white/20 p-5 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-lg`}>
                    {/* Darkening bottom vignette overlay for 100% sharp text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none rounded-2xl" />

                    <div className="flex items-center justify-between z-10 relative">
                      <span className="project-banner-badge inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse inline-block" />
                        <span>{proj.badge}</span>
                      </span>
                      {proj.demoUrl && (
                        <span className="project-banner-btn w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300">
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <div className="z-10 relative">
                      <div className="project-banner-category text-xs font-bold uppercase tracking-wider mb-1">
                        {proj.category}
                      </div>
                      <div className="project-banner-title text-xl sm:text-2xl font-black font-display tracking-tight">
                        {proj.title}
                      </div>
                    </div>
                  </div>

                  {/* Description & Impact Metric */}
                  <div className="space-y-3">
                    <p className="text-xs sm:text-[13px] text-gray-300 font-normal leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">Impacto Medible:</span>
                      <span className="text-xs font-bold font-mono text-[#DFF494]" dangerouslySetInnerHTML={{ __html: proj.metrics }} />
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium"
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
