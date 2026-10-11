import React from 'react';
import { Users, Linkedin, Github, Code, Sparkles, Shield, Cpu } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  avatarIcon: any;
  avatarColor: string;
  description: string;
  tags: string[];
}

export const TeamSection: React.FC = () => {
  const team: TeamMember[] = [
    {
      name: 'Arquitectura Cloud & Liderazgo',
      role: 'Head of Engineering & Systems',
      specialty: 'Infraestructura Cloudflare & Alta Disponibilidad',
      avatarIcon: Cpu,
      avatarColor: 'from-[#004d40] to-[#104a0e]',
      description: 'Especialista en diseño de sistemas distribuidos, escalabilidad en la nube y arquitectura modular sin deuda técnica.',
      tags: ['Cloud Architecture', 'Serverless', 'PostgreSQL', 'Security']
    },
    {
      name: 'Ingeniería de IA & Agentes',
      role: 'AI Solutions Architect',
      specialty: 'Modelos Conversacionales & Automatización',
      avatarIcon: Sparkles,
      avatarColor: 'from-[#A9F8B5]/40 to-[#DFF494]/30',
      description: 'Diseño e implementación de agentes conversacionales conectados a WhatsApp Cloud, calificación de leads y flujos autónomos 24/7.',
      tags: ['OpenAI', 'WhatsApp API', 'LLM Prompting', 'CRM Sync']
    },
    {
      name: 'Desarrollo Web & Plataformas',
      role: 'Lead Full-Stack Developer',
      specialty: 'React, Vite, Node & Pasarelas de Pago',
      avatarIcon: Code,
      avatarColor: 'from-[#735c00] to-[#C1A35B]/40',
      description: 'Creación de interfaces de ultra alta velocidad, integración de pasarelas SinpePay / Stripe y experiencia de usuario fluida.',
      tags: ['React 19', 'TypeScript', 'SinpePay', 'Tailwind']
    },
    {
      name: 'Seguridad & Optimización SEO',
      role: 'Cybersecurity & Growth Specialist',
      specialty: 'Cifrado de Datos & Autoridad Digital',
      avatarIcon: Shield,
      avatarColor: 'from-[#141517] to-[#25272a]',
      description: 'Protección de bases de datos, protocolos SSL/TLS de grado bancario y estrategias de posicionamiento en motores de búsqueda.',
      tags: ['Data Protection', 'SEO Técnico', 'Core Web Vitals', 'Compliance']
    }
  ];

  return (
    <section id="equipo" className="py-24 px-4 md:px-8 bg-[#060708] border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFF494]">
            <Users className="w-3.5 h-3.5 text-[#DFF494]" />
            Talento Especializado
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
            Conoce a Nuestro <span className="text-gradient-accent">Equipo</span> de Trabajo
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Un equipo multidisciplinario de ingenieros de software, especialistas en IA y arquitectos cloud comprometidos con la excelencia técnica de cada proyecto.
          </p>
        </div>

        {/* Team Grid (Recode Inspired) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => {
            const Icon = member.avatarIcon;
            return (
              <div
                key={idx}
                className="card-accent p-5 sm:p-6 flex flex-col justify-between group hover:border-[#A9F8B5]/40"
              >
                <div className="blob-glow" />

                <div className="space-y-5">
                  {/* Avatar Icon Box */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${member.avatarColor} border border-white/15 flex items-center justify-center text-white shadow-xl mx-auto group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-10 h-10 text-[#A9F8B5]" />
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-1.5">
                    <h3 className="font-display font-bold text-lg text-white">
                      {member.name}
                    </h3>
                    <div className="text-xs font-semibold text-[#A9F8B5] font-mono">
                      {member.role}
                    </div>
                    <div className="text-[11px] text-gray-400 uppercase tracking-wider font-light">
                      {member.specialty}
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 font-light leading-relaxed text-center">
                    {member.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                    {member.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social pill footer */}
                <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-center gap-3">
                  <span className="text-[11px] text-gray-500">GeoSoft Consultancy</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
