import React from 'react';
import { Bell, CheckCircle2, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { useGeoSoftStore } from '../../../context/StoreContext';
import { BusinessProposal } from '../../../types';

export const QuoteAcceptedAlerts: React.FC = () => {
  const { proposals, updateProposalStatus } = useGeoSoftStore();

  const acceptedQuotes = (proposals || []).filter(
    p => p.aiRole === 'cotizacion_aceptada' || p.businessName?.includes('COTIZACIÓN ACEPTADA')
  );

  if (acceptedQuotes.length === 0) return null;

  const handleWhatsApp = (p: BusinessProposal) => {
    const text = encodeURIComponent(
      `¡Hola ${p.contactName}! Te saludamos de GeoSoft. Hemos recibido tu aceptación formal para el proyecto "${p.businessName.replace(' (COTIZACIÓN ACEPTADA)', '')}".\n\n¿Coordinamos hoy los accesos y el cronograma de entrega?`
    );
    const clean = (p.whatsapp || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank');
  };

  return (
    <div className="card-accent p-5 border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 to-[#0c0e14] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse border border-emerald-500/30">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <span>Cotizaciones Aceptadas por Clientes</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                {acceptedQuotes.length} NOTIFICACIÓN{acceptedQuotes.length > 1 ? 'ES' : ''}
              </span>
            </h4>
            <p className="text-[11px] text-gray-400">Clientes que hicieron clic en "Aceptar Propuesta" desde su link único</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {acceptedQuotes.map(q => {
          const isNew = (q.status || 'nueva') === 'nueva';
          return (
            <div
              key={q.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isNew
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-black/30 border-white/5 opacity-80'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{q.contactName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    {q.whatsapp}
                  </span>
                  {isNew && (
                    <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-400 text-black animate-pulse">
                      Nueva
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-300 font-medium">{q.businessName}</p>
                <p className="text-[11px] text-gray-400 line-clamp-1">{q.mainGoal}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleWhatsApp(q)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contactar WhatsApp</span>
                </button>
                {isNew && (
                  <button
                    type="button"
                    onClick={() => updateProposalStatus(q.id, 'revisada')}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs transition-all cursor-pointer"
                    title="Marcar como revisada"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
