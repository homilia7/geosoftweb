import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  ExternalLink,
  Search,
  MessageCircle,
  Trash2,
  Sparkles,
  Bot,
  Globe,
  Building2,
  Calendar,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RefreshCw,
  X
} from 'lucide-react';
import { useGeoSoftStore } from '../context/StoreContext';
import { BusinessProposal, ProposalStatus } from '../types';
import { soundEffects } from '../services/soundEffects';

export const AdminProposalsTab: React.FC = () => {
  const { proposals, updateProposalStatus, deleteProposal, openProposalModal, reloadProposals } = useGeoSoftStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Recargar propuestas automáticamente al montar el componente
  useEffect(() => {
    reloadProposals();
  }, []);

  const handleManualRefresh = async () => {
    soundEffects.playClick();
    setIsRefreshing(true);
    await reloadProposals();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Generar URL pública para clientes
  const getPublicLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/#propuesta`;
    }
    return 'https://geosoftweb.pages.dev/#propuesta';
  };

  const handleCopyLink = () => {
    soundEffects.playClick();
    const link = getPublicLink();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenLiveForm = () => {
    soundEffects.playClick();
    openProposalModal();
  };

  const handleWhatsAppClient = (prop: BusinessProposal) => {
    const bName = prop.businessName || 'tu negocio';
    const cName = prop.contactName || 'estimado cliente';
    const text = encodeURIComponent(
      `¡Hola ${cName}! Te saludamos de GeoSoft con relación a la información que nos compartiste de tu negocio "${bName}".\n\n` +
      `Ya estamos revisando los requerimientos de tu sitio web y tu agente de IA. ¿Tienes disponibilidad para coordinar los primeros detalles de diseño?`
    );
    const cleanPhone = (prop.whatsapp || '').replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      alert('Esta propuesta no tiene un número de WhatsApp registrado.');
      return;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  // Generar Prompt Estructurado para IA (Claude / ChatGPT / Gemini)
  const handleCopyAIPrompt = (prop: BusinessProposal) => {
    soundEffects.playClick();
    const prompt = `### ESPECIFICACIÓN MAESTRA DE PROYECTO WEB & AGENTE DE IA
**Cliente:** ${prop.contactName || 'N/A'} (${prop.businessName || 'Sin nombre'})
**WhatsApp:** ${prop.whatsapp || 'N/A'} | **Email:** ${prop.email || 'N/A'}
**Ubicación:** ${prop.location || 'N/A'}
**Sector / Industria:** ${prop.industry || 'General'}
**Marcas o Sucursales Adicionales:** ${prop.businessNamesAdditional || 'Ninguna'}
**Lema Comercial:** ${prop.tagline || 'N/A'}

---
#### 1. REQUERIMIENTOS DEL SITIO WEB
- **Objetivo Principal:** ${prop.mainGoal || 'Presencia de marca y captación de clientes'}
- **Público Objetivo:** ${prop.targetAudience || 'Público general'}
- **Servicios / Productos Ofrecidos:**
${prop.servicesOrProducts || 'Servicios estándar del rubro'}
- **Páginas de Referencia / Inspiración:** ${prop.referenceWebsites || 'Ninguna indicada'}
- **Colores Corporativos:** ${prop.brandColors || 'Por definir según identidad'}
- **Redes Sociales:** ${prop.socialLinks || 'N/A'}

---
#### 2. ESPECIFICACIÓN DEL AGENTE DE INTELIGENCIA ARTIFICIAL (24/7)
- **Rol del Agente:** ${(prop.aiRole || 'ventas').toUpperCase()}
- **Tono Conversacional:** ${(prop.aiTone || 'amigable').toUpperCase()}
- **Acción / Canal de Cierre:** ${prop.aiDestination || 'whatsapp'}
- **Preguntas Frecuentes y Respuestas Clave:**
${prop.aiCommonFaqs || 'Información general de servicios y cotizaciones'}

---
#### 3. NOTAS ADICIONALES DEL CLIENTE
${prop.notes || 'Sin notas adicionales'}
`;

    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(prop.id);
    setTimeout(() => setCopiedPromptId(null), 3000);
  };

  const safeProposals = Array.isArray(proposals) ? proposals : [];

  // Filtrado de propuestas
  const filteredProposals = safeProposals.filter(p => {
    if (!p) return false;
    const bName = (p.businessName || '').toLowerCase();
    const cName = (p.contactName || '').toLowerCase();
    const ind = (p.industry || '').toLowerCase();
    const addNames = (p.businessNamesAdditional || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !q ||
      bName.includes(q) ||
      cName.includes(q) ||
      ind.includes(q) ||
      addNames.includes(q);

    const status = p.status || 'nueva';
    const matchesStatus =
      statusFilter === 'todas'
        ? true
        : statusFilter === 'bot'
        ? p.source === 'bot'
        : status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'nueva':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'en_proceso':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'completada':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'archivada':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Módulo Superior: Generador de Enlace Público para Dueños de Negocio */}
      <div className="card-accent p-4 sm:p-6 border-[#A9F8B5]/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                Enlace para Recibir Propuestas de Clientes
                <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-2 py-0.5 rounded-full font-mono uppercase">
                  Activo
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Comparte este enlace con dueños de negocio para que completen el formulario interactivo con sus datos y fotos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleManualRefresh}
              title="Actualizar listado de propuestas"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#A9F8B5]' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            <button
              onClick={handleOpenLiveForm}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Probar Formulario</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black text-xs font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md"
            >
              {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
        </div>

        {/* Input con URL pública para visualizar */}
        <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs">
          <Globe className="w-3.5 h-3.5 text-[#A9F8B5] shrink-0" />
          <span className="text-gray-300 select-all font-mono truncate flex-1">
            {getPublicLink()}
          </span>
          <span className="text-[10px] text-[#A9F8B5] font-mono shrink-0 hidden sm:inline">
            Formulario Interactivo de 5 Pasos
          </span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filtros de Estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'todas', label: 'Todas', count: safeProposals.length },
            { id: 'nueva', label: 'Nuevas', count: safeProposals.filter(p => (p.status || 'nueva') === 'nueva').length },
            { id: 'bot', label: '🤖 Bot IA', count: safeProposals.filter(p => p.source === 'bot').length },
            { id: 'en_proceso', label: 'En Proceso', count: safeProposals.filter(p => p.status === 'en_proceso').length },
            { id: 'completada', label: 'Completadas', count: safeProposals.filter(p => p.status === 'completada').length }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === f.id
                  ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{f.label}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/10 text-[10px] font-mono">
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por negocio o contacto..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#A9F8B5] transition-colors"
          />
        </div>
      </div>

      {/* Listado de Propuestas Recibidas */}
      {filteredProposals.length === 0 ? (
        <div className="text-center py-12 space-y-3 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No hay fichas o propuestas en esta categoría</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Comparte el enlace público con clientes o pulsa "Probar Formulario" para registrar una nueva propuesta.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map(prop => {
            const isExpanded = expandedId === prop.id;
            const isCopied = copiedPromptId === prop.id;
            const status = prop.status || 'nueva';

            return (
              <div
                key={prop.id}
                className="rounded-2xl border border-white/15 bg-[#14161b] hover:border-white/25 transition-all overflow-hidden shadow-lg"
              >
                {/* Header de la Tarjeta */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#16181e]">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A9F8B5]/20 to-[#DFF494]/20 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5] font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-white text-base">{prop.businessName || 'Sin Nombre de Negocio'}</h4>
                        {prop.businessNamesAdditional && (
                          <span className="text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                            +{prop.businessNamesAdditional}
                          </span>
                        )}
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${getStatusBadge(status)}`}>
                          {status.replace('_', ' ')}
                        </span>
                        {prop.source === 'bot' ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-mono">
                            <Bot className="w-3 h-3 text-cyan-400" />
                            Capturada por Bot IA
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-mono">
                            <Globe className="w-3 h-3 text-purple-400" />
                            Formulario Web
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1 text-white">
                          <span>👤</span>
                          {prop.contactName || 'Sin Contacto'}
                        </span>
                        <span>•</span>
                        <span className="text-gray-300">{prop.industry || 'General'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          {prop.createdAt ? new Date(prop.createdAt).toLocaleDateString([], {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Reciente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Botón WhatsApp Directo */}
                    <button
                      onClick={() => handleWhatsAppClient(prop)}
                      title="Contactar al cliente por WhatsApp"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Botón Copiar Prompt para IA */}
                    <button
                      onClick={() => handleCopyAIPrompt(prop)}
                      title="Copiar prompt maestro estructurado para Claude / ChatGPT"
                      className="px-3 py-1.5 rounded-xl bg-[#A9F8B5]/15 hover:bg-[#A9F8B5]/25 border border-[#A9F8B5]/30 text-[#A9F8B5] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{isCopied ? '¡Prompt Copiado!' : 'Prompt IA'}</span>
                    </button>

                    {/* Cambiar Estado */}
                    <select
                      value={status}
                      onChange={e => updateProposalStatus(prop.id, e.target.value as ProposalStatus)}
                      className="bg-black/40 border border-white/10 rounded-xl text-xs text-gray-300 px-2.5 py-1.5 focus:outline-none focus:border-[#A9F8B5] cursor-pointer"
                    >
                      <option value="nueva" className="bg-[#14161b] text-white">Nueva</option>
                      <option value="en_proceso" className="bg-[#14161b] text-white">En Proceso</option>
                      <option value="completada" className="bg-[#14161b] text-white">Completada</option>
                      <option value="archivada" className="bg-[#14161b] text-white">Archivada</option>
                    </select>

                    {/* Alternar Desplegable */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : prop.id)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title={isExpanded ? 'Plegar detalles' : 'Ver ficha completa'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la ficha de ${prop.businessName || 'este negocio'}?`)) {
                          deleteProposal(prop.id);
                        }
                      }}
                      title="Eliminar propuesta"
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Vista Detallada Desplegable */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-white/10 space-y-4 bg-[#111317] text-xs animate-message-soft">
                    {prop.source === 'bot' && (
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-200 text-xs flex items-center gap-2 font-medium">
                        <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Ficha recopilada interactivamente por el Asistente de IA en el chat web de GeoSoft.</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Columna 1: Requerimientos Web */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                        <div className="flex items-center gap-2 text-white font-bold border-b border-white/10 pb-1.5">
                          <Globe className="w-4 h-4 text-[#A9F8B5]" />
                          <span>Especificaciones de la Web</span>
                        </div>

                        <div>
                          <span className="text-gray-400">Objetivo comercial: </span>
                          <span className="text-gray-200 font-medium">{prop.mainGoal || 'Captación'}</span>
                        </div>

                        <div>
                          <span className="text-gray-400">Público meta: </span>
                          <span className="text-gray-200">{prop.targetAudience || 'General'}</span>
                        </div>

                        <div>
                          <span className="text-gray-400 block mb-1">Servicios / Productos:</span>
                          <p className="text-gray-300 bg-white/5 p-2 rounded-lg whitespace-pre-wrap font-mono text-[11px]">
                            {prop.servicesOrProducts || 'No especificado'}
                          </p>
                        </div>

                        {prop.referenceWebsites && (
                          <div>
                            <span className="text-gray-400">Webs de referencia: </span>
                            <span className="text-[#A9F8B5] underline break-all">{prop.referenceWebsites}</span>
                          </div>
                        )}
                      </div>

                      {/* Columna 2: Agente de IA */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                        <div className="flex items-center gap-2 text-white font-bold border-b border-white/10 pb-1.5">
                          <Bot className="w-4 h-4 text-[#DFF494]" />
                          <span>Agente de Inteligencia Artificial (24/7)</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-gray-400">Rol: </span>
                            <span className="text-[#A9F8B5] font-semibold uppercase">{prop.aiRole || 'ventas'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Tono: </span>
                            <span className="text-[#DFF494] font-semibold uppercase">{prop.aiTone || 'amigable'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Destino: </span>
                            <span className="text-white font-mono">{prop.aiDestination || 'whatsapp'}</span>
                          </div>
                        </div>

                        {prop.aiCommonFaqs && (
                          <div>
                            <span className="text-gray-400 block mb-1">Preguntas y respuestas clave:</span>
                            <p className="text-gray-300 bg-white/5 p-2 rounded-lg whitespace-pre-wrap font-mono text-[11px] max-h-32 overflow-y-auto">
                              {prop.aiCommonFaqs}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Galería de Imágenes y Archivos Adjuntos */}
                    {prop.images && prop.images.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                          <span className="font-bold text-white flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[#A9F8B5]" />
                            Archivos Multimedia y Logotipos ({prop.images.length})
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            Haz clic en cualquier imagen para verla en tamaño completo
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {prop.images.map((img, idx) => (
                            <div
                              key={idx}
                              onClick={() => setLightboxImage(img.dataUrl)}
                              className="group relative rounded-xl overflow-hidden border border-white/15 bg-black/60 p-1 flex flex-col gap-1 cursor-pointer hover:border-[#A9F8B5] transition-all"
                            >
                              <div className="h-20 w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                                <img
                                  src={img.dataUrl}
                                  alt={img.name}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="flex items-center justify-between text-[10px] px-1">
                                <span className="text-gray-300 truncate max-w-[60px]" title={img.name}>
                                  {img.name}
                                </span>
                                <span className="text-[#A9F8B5] uppercase font-mono font-bold text-[8.5px]">
                                  {img.type || 'img'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notas y Enlaces Adicionales */}
                    {(prop.notes || prop.brandColors || prop.socialLinks || prop.email || prop.location) && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px]">
                        {prop.email && (
                          <div>
                            <span className="text-gray-400 font-semibold block">Email:</span>
                            <span className="text-white">{prop.email}</span>
                          </div>
                        )}
                        {prop.location && (
                          <div>
                            <span className="text-gray-400 font-semibold block">Ubicación:</span>
                            <span className="text-white">{prop.location}</span>
                          </div>
                        )}
                        {prop.brandColors && (
                          <div>
                            <span className="text-gray-400 font-semibold block">Colores de marca:</span>
                            <span className="text-white">{prop.brandColors}</span>
                          </div>
                        )}
                        {prop.socialLinks && (
                          <div>
                            <span className="text-gray-400 font-semibold block">Redes sociales:</span>
                            <span className="text-white">{prop.socialLinks}</span>
                          </div>
                        )}
                        {prop.notes && (
                          <div className="sm:col-span-3">
                            <span className="text-gray-400 font-semibold block">Notas o solicitudes especiales:</span>
                            <span className="text-gray-200">{prop.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox para previsualizar imagen en grande */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Vista previa"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
