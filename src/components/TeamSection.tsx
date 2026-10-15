import React from 'react';
import { Users } from 'lucide-react';
import { Reveal } from './Reveal';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export const TeamSection: React.FC = () => {
  const team: TeamMember[] = [
    {
      name: 'John Harden',
      role: 'Full-Stack Web Development',
      image: '/assets/team-john.jpg'
    },
    {
      name: 'Emily Johnson',
      role: 'Front-End Web Development',
      image: '/assets/team-emily.jpg'
    },
    {
      name: 'Michael Davis',
      role: 'Mobile App Development',
      image: '/assets/team-michael.jpg'
    },
    {
      name: 'Sarah Lee',
      role: 'UI/UX & Web Development',
      image: '/assets/team-sarah.jpg'
    }
  ];

  return (
    <section id="equipo" className="py-24 px-4 md:px-8 bg-[#060708] border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <Reveal effect="up" className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFF494]">
            <Users className="w-3.5 h-3.5 text-[#DFF494]" />
            Equipo de Desarrollo
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
            Conoce a Nuestro <span className="text-gradient-accent">Equipo</span> de Trabajo
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Especialistas dedicados al desarrollo, arquitectura y diseño de software de alto impacto.
          </p>
        </Reveal>

        {/* Team Grid (Single Row as in reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {team.map((member, idx) => (
            <Reveal
              key={idx}
              effect="up"
              delay={idx * 120}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#121316] border border-white/10 shadow-lg group-hover:border-[#A9F8B5]/40 group-hover:shadow-[0_15px_35px_rgba(169,248,181,0.15)] transition-all duration-500">
                <img
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={375}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="mt-4 text-left">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-[#A9F8B5] transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 font-normal mt-1">
                  {member.role}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
