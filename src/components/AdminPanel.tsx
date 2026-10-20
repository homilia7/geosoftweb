import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  Tag,
  RotateCcw,
  Trash2,
  Send,
  BarChart3,
  Bot,
  FileText,
  Globe,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useGeoSoftStore } from '../context/StoreContext';
import { AppointmentStatus, PlatformType } from '../types';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { AdminBotTab } from './AdminBotTab';
import { AdminProposalsTab } from './AdminProposalsTab';
import { ClientProposalModal } from './ClientProposalModal';
import { soundEffects } from '../services/soundEffects';

type AdminTab = 'propuestas' | 'citas' | 'bot' | 'analiticas' | 'precios';

export const AdminPanel: React.FC = () => {
  const {
    pricing,
    appointments,
    proposals,
    closeAdminModal,
    logoutAdmin,
    updatePlatformPrice,
    updateAddonPrice,
    updateDiscount,
    resetPricing,
    updateAppointmentStatus,
    deleteAppointment,
    reloadProposals,
    isProposalModalOpen,
    closeProposalModal
  } = useGeoSoftStore();

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('citas')) return 'citas';
      if (hash.includes('bot')) return 'bot';
      if (hash.includes('analiticas')) return 'analiticas';
      if (hash.includes('precios')) return 'precios';
    }
    return 'propuestas';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync hash with active tab cleanly without triggering extraneous hashchange loops
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash !== `#admin-${activeTab}`) {
      history.replaceState(null, '', `#admin-${activeTab}`);
    }
  }, [activeTab]);

  const handleManualRefresh = async () => {
    try {
      soundEffects.playClick();
    } catch {}
    setIsRefreshing(true);
    await reloadProposals();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleBackToWeb = () => {
    try {
      soundEffects.playClick();
    } catch {}
    closeAdminModal();
  };

  const handleLogout = () => {
    try {
      soundEffects.playClick();
    } catch {}
    logoutAdmin();
  };

  const handleWhatsAppContact = (apt: any) => {
    const text = encodeURIComponent(
      `¡Hola ${apt.fullName}! Te saludamos de GeoSoft con relación a tu cita programada para el ${apt.date} a las ${apt.time} sobre ${apt.service}.\n\n¿Confirmamos los detalles para la videollamada?`
    );
    window.open(`https://wa.me/${apt.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const safeProposals = Array.isArray(proposals) ? proposals : [];
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const newProposalsCount = safeProposals.filter(p => (p.status || 'nueva') === 'nueva').length;
  const pendingAppointmentsCount = safeAppointments.filter(a => a.status === 'pendiente').length;

  const menuSections = [
    {
      title: 'OPERACIONES & VENTAS',
      items: [
        {
          id: 'propuestas' as AdminTab,
          label: 'Propuestas de Negocios',
          icon: FileText,
          count: safeProposals.length,
          alertBadge: newProposalsCount > 0 ? `${newProposalsCount} NUEVAS` : null,
          alertColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        },
        {
          id: 'citas' as AdminTab,
          label: 'Citas Agendadas',
          icon: Calendar,
          count: safeAppointments.length,
          alertBadge: pendingAppointmentsCount > 0 ? `${pendingAppointmentsCount} PEND.` : null,
          alertColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }
      ]
    },
    {
      title: 'INTELIGENCIA ARTIFICIAL',
      items: [
        {
          id: 'bot' as AdminTab,
          label: 'Bot Asesor IA & FAQs',
          icon: Bot,
          badge: 'Gemini AI',
          isLive: true
        }
      ]
    },
    {
      title: 'CRECIMIENTO & CONFIGURACIÓN',
      items: [
        {
          id: 'analiticas' as AdminTab,
          label: 'Métricas & Mapa de Calor',
          icon: BarChart3
        },
        {
          id: 'precios' as AdminTab,
          label: 'Precios & Promociones',
          icon: DollarSign,
          badge: pricing.discountActive ? `${pricing.discountPercent}% OFF` : undefined
        }
      ]
    }
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case 'propuestas':
        return {
          title: 'Propuestas de Negocios',
          desc: 'Fichas estructuradas capturadas interactivamente por el formulario web y el Bot de IA'
        };
      case 'citas':
        return {
          title: 'Citas y Demostraciones Agendadas',
          desc: 'Gestión de prospectos calificados que solicitaron videollamada de 15 minutos'
        };
      case 'bot':
        return {
          title: 'Asistente Virtual & Conocimiento IA',
          desc: 'Entrenamiento de RAG, FAQs, modelos de Google Gemini y control conversacional'
        };
      case 'analiticas':
        return {
          title: 'Métricas de Tráfico & Mapa de Calor',
          desc: 'Comportamiento en tiempo real, clics de usuarios y puntos calientes'
        };
      case 'precios':
        return {
          title: 'Tarifas y Campañas Promocionales',
          desc: 'Configuración en vivo del cotizador interactivo de proyectos'
        };
    }
  };

  const currentInfo = getTabTitle();

  return (
    <div className="min-h-screen w-full bg-[#07080a] text-white flex flex-col md:flex-row font-sans selection:bg-[#A9F8B5] selection:text-black">
      {/* ======================================================== */}
      {/* 1. SIDEBAR PROFESIONAL (ESCRITORIO)                      */}
      {/* ======================================================== */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-[#0c0e14] border-r border-white/10 flex-col h-screen shrink-0 sticky top-0 select-none z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-extrabold flex items-center justify-center text-sm shadow-[0_0_20px_rgba(169,248,181,0.3)]">
              GS
            </div>
            <div>
              <div className="font-display font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                GeoSoft
                <span className="text-[10px] bg-gradient-to-r from-[#A9F8B5]/20 to-[#DFF494]/20 text-[#A9F8B5] border border-[#A9F8B5]/30 px-1.5 py-0.2 rounded font-mono uppercase">
                  Admin
                </span>
              </div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cloudflare D1 en vivo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase px-3 py-1">
                {sec.title}
              </div>
              <div className="space-y-1">
                {sec.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        try {
                          soundEffects.playClick();
                        } catch {}
                        setActiveTab(item.id);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black shadow-md shadow-[#A9F8B5]/10 font-bold'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-black' : 'text-[#A9F8B5]'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.alertBadge && (
                          <span
                            className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                              isActive
                                ? 'bg-black/20 text-black border-black/30'
                                : item.alertColor
                            }`}
                          >
                            {item.alertBadge}
                          </span>
                        )}

                        {item.count !== undefined && !item.alertBadge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-gray-400'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}

                        {item.badge && !item.alertBadge && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${
                              isActive
                                ? 'bg-black/20 text-black border-black/30'
                                : 'bg-[#A9F8B5]/15 text-[#A9F8B5] border-[#A9F8B5]/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {item.isLive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-ping" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Enlace Público Widget */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
              <Globe className="w-3.5 h-3.5 text-[#A9F8B5]" />
              <span>Ficha para Clientes</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              Comparte el enlace público para recibir información de nuevos negocios.
            </p>
            <a
              href="/#propuesta"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-mono flex items-center justify-between border border-white/10 transition-colors"
            >
              <span className="truncate">/#propuesta</span>
              <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
            </a>
          </div>
        </div>

        {/* Sidebar Footer / User & Back */}
        <div className="p-4 border-t border-white/10 bg-[#090b0e] space-y-2">
          {/* User Profile Info */}
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-white/10 to-white/20 border border-white/15 flex items-center justify-center font-bold text-xs text-[#A9F8B5]">
              AD
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-bold text-white truncate">Administrador</div>
              <div className="text-[10px] text-gray-400 truncate">Ingeniería GeoSoft</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleBackToWeb}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer"
              title="Volver a la web pública de GeoSoft"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#A9F8B5]" />
              <span>Ver Web</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-2.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-rose-500/20 transition-all cursor-pointer"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. HEADER SUPERIOR MÓVIL                                 */}
      {/* ======================================================== */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0c0e14] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-bold flex items-center justify-center text-xs">
            GS
          </div>
          <div>
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              GeoSoft Admin
              <span className="text-[9px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-1.5 py-0.2 rounded font-mono">
                {activeTab}
              </span>
            </div>
            <div className="text-[10px] text-gray-400 truncate max-w-[170px]">
              {currentInfo.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            className="p-2 rounded-xl bg-white/5 text-gray-300 border border-white/10"
            title="Recargar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#A9F8B5]' : ''}`} />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black cursor-pointer shadow-sm"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Drawer Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col">
          <div className="p-4 bg-[#0c0e14] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-bold flex items-center justify-center text-xs">
                GS
              </div>
              <span className="font-display font-bold text-white text-sm">Menú de Navegación</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#090b0e]">
            {menuSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase px-3 py-1">
                  {sec.title}
                </div>
                {sec.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.alertBadge ? (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {item.alertBadge}
                        </span>
                      ) : (
                        item.count !== undefined && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10">
                            {item.count}
                          </span>
                        )
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={handleBackToWeb}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-[#A9F8B5]" />
                <span>Volver a la Web Principal</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ÁREA DE TRABAJO PRINCIPAL (FULL ESPACIO INDEPENDIENTE) */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#07080a] overflow-x-hidden">
        {/* Top Bar Ejecutiva de Escritorio */}
        <div className="hidden md:flex items-center justify-between px-6 lg:px-8 py-4 border-b border-white/10 bg-[#0c0e14]/70 backdrop-blur-xl sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <span>GeoSoft Admin</span>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <span className="text-[#A9F8B5] font-semibold capitalize">{activeTab}</span>
            </div>
            <h1 className="font-display font-bold text-white text-lg lg:text-xl mt-0.5">
              {currentInfo.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón de Recarga Manual */}
            <button
              onClick={handleManualRefresh}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              title="Sincronizar cambios en tiempo real con Cloudflare D1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#A9F8B5]' : ''}`} />
              <span>{isRefreshing ? 'Actualizando...' : 'Recargar'}</span>
            </button>

            {/* Enlace Público */}
            <a
              href="/#propuesta"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Abrir formulario público en nueva pestaña"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#A9F8B5]" />
              <span>Ver Formulario</span>
            </a>

            {/* Botón Volver a la Web */}
            <button
              onClick={handleBackToWeb}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black text-xs font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              title="Volver a la landing page pública"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Volver a la Web</span>
            </button>
          </div>
        </div>

        {/* Sub-Header con Descripción */}
        <div className="hidden md:block px-6 lg:px-8 py-2.5 bg-[#090b0e] border-b border-white/5">
          <p className="text-xs text-gray-400">
            {currentInfo.desc}
          </p>
        </div>

        {/* Cuerpo del Espacio Activo (Sin restricciones de modal, con scroll amplio y fluido) */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'propuestas' ? (
            <AdminProposalsTab />
          ) : activeTab === 'precios' ? (
            /* Tab de Precios y Campañas Promocionales */
            <div className="space-y-8 animate-message-soft">
              {/* Promo Discount Module */}
              <div className="card-accent p-6 border-[#DFF494]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#DFF494]/15 border border-[#DFF494]/30 flex items-center justify-center text-[#DFF494]">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base">Descuento Global / Campaña Promocional</h4>
                      <p className="text-xs text-gray-400">Aplica un porcentaje de descuento automático en el cotizador en vivo.</p>
                    </div>
                  </div>

                  {/* Toggle Discount */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <span className="text-xs font-semibold text-gray-300">
                      {pricing.discountActive ? 'Activo' : 'Desactivado'}
                    </span>
                    <input
                      type="checkbox"
                      checked={pricing.discountActive}
                      onChange={e => updateDiscount(pricing.discountPercent, e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${
                      pricing.discountActive ? 'bg-[#A9F8B5]' : 'bg-gray-700'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                        pricing.discountActive ? 'left-6' : 'left-0.5'
                      }`} />
                    </div>
                  </label>
                </div>

                {pricing.discountActive && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-300 font-semibold">Porcentaje de Descuento (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={pricing.discountPercent}
                        onChange={e => updateDiscount(Number(e.target.value), true)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090a0c] border border-white/15 text-white text-sm outline-none focus:border-[#A9F8B5]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-300 font-semibold">Texto del Banner Promocional</label>
                      <input
                        type="text"
                        value={pricing.discountBanner}
                        onChange={e => updateDiscount(pricing.discountPercent, true, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090a0c] border border-white/15 text-white text-sm outline-none focus:border-[#A9F8B5]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Platform Prices Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-white text-base">Tarifas Base de Plataformas</h4>
                  <button
                    onClick={resetPricing}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer Valores por Defecto</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pricing.platforms.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl bg-[#0d0f14] border border-white/10 space-y-3 shadow-md hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{p.title}</span>
                        <span className="text-[10px] font-mono bg-white/10 text-[#A9F8B5] px-2 py-0.5 rounded-full border border-white/10">
                          {p.badge}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/5">
                        <label className="text-xs text-gray-400">Precio ($):</label>
                        <input
                          type="number"
                          value={p.basePrice}
                          onChange={e => updatePlatformPrice(p.id, Number(e.target.value))}
                          className="w-32 px-3 py-1.5 rounded-lg bg-black border border-white/15 text-white font-mono font-bold text-sm text-right outline-none focus:border-[#A9F8B5]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addons Prices */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-white text-base">Tarifas de Servicios Adicionales</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  {pricing.addons.map(addon => (
                    <div key={addon.id} className="p-4 rounded-2xl bg-[#0d0f14] border border-white/10 space-y-2 shadow-md">
                      <div className="font-semibold text-white text-sm">{addon.title}</div>
                      <div className="text-[11px] text-gray-400">Periodo: {addon.period}</div>
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                        <label className="text-xs text-gray-400">Precio ($):</label>
                        <input
                          type="number"
                          value={addon.price}
                          onChange={e => updateAddonPrice(addon.id, Number(e.target.value))}
                          className="w-24 px-3 py-1.5 rounded-lg bg-black border border-white/15 text-white font-mono font-bold text-sm text-right outline-none focus:border-[#DFF494]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#A9F8B5]/10 border border-[#A9F8B5]/25 text-xs text-[#A9F8B5] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Las tarifas y promociones modificadas se sincronizan automáticamente en tiempo real con el cotizador público en la web.</span>
              </div>
            </div>
          ) : activeTab === 'citas' ? (
            /* Appointments Tab */
            <div className="space-y-6 animate-message-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d0f14] border border-white/10">
                <div>
                  <h4 className="font-display font-bold text-white text-base">Citas Solicitadas desde la Web y Bot</h4>
                  <p className="text-xs text-gray-400">Prospectos que han solicitado sesión técnica o demostración de 15 minutos.</p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    {safeAppointments.filter(a => a.status === 'pendiente').length} Pendientes
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    {safeAppointments.filter(a => a.status === 'confirmada').length} Confirmadas
                  </span>
                </div>
              </div>

              {safeAppointments.length === 0 ? (
                <div className="p-16 text-center text-gray-400 text-sm bg-[#0d0f14] rounded-2xl border border-white/10 space-y-2">
                  <Calendar className="w-8 h-8 text-gray-600 mx-auto" />
                  <p className="font-semibold text-white">No hay citas agendadas todavía</p>
                  <p className="text-xs text-gray-500">Aparecerán aquí automáticamente cuando los clientes agenden en la web o con el bot.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="p-5 rounded-2xl bg-[#0d0f14] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all shadow-lg"
                    >
                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-base">{apt.fullName}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                            apt.status === 'pendiente' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            apt.status === 'confirmada' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            apt.status === 'completada' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}>
                            {apt.status}
                          </span>
                          {apt.source === 'bot' && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-bold">
                              <Bot className="w-3 h-3 text-cyan-400" />
                              Cerrada por Bot IA
                            </span>
                          )}
                          <span className="text-xs text-gray-400">• {new Date(apt.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-300">
                          <div><strong className="text-white">Servicio:</strong> {apt.service}</div>
                          <div><strong className="text-white">Fecha:</strong> {apt.date} a las {apt.time}</div>
                          <div><strong className="text-white">WhatsApp:</strong> {apt.whatsapp}</div>
                          <div><strong className="text-white">Email:</strong> {apt.email}</div>
                        </div>

                        {apt.notes && (
                          <p className="text-xs text-gray-400 italic bg-black/40 p-2.5 rounded-xl border border-white/5">
                            "{apt.notes}"
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center md:flex-col md:items-end justify-between md:justify-start gap-2.5 pt-3 md:pt-0 border-t md:border-0 border-white/10 shrink-0">
                        {/* Status Select */}
                        <select
                          value={apt.status}
                          onChange={e => updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                          className="px-3 py-1.5 rounded-xl bg-black border border-white/15 text-xs text-white outline-none cursor-pointer focus:border-[#A9F8B5]"
                        >
                          <option value="pendiente" className="bg-[#121316]">Pendiente</option>
                          <option value="confirmada" className="bg-[#121316]">Confirmada</option>
                          <option value="completada" className="bg-[#121316]">Completada</option>
                          <option value="cancelada" className="bg-[#121316]">Cancelada</option>
                        </select>

                        <div className="flex items-center gap-2">
                          {/* WhatsApp Contact */}
                          <button
                            onClick={() => handleWhatsAppContact(apt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-sm"
                          >
                            <Send className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la cita de ${apt.fullName}?`)) {
                                deleteAppointment(apt.id);
                              }
                            }}
                            className="p-1.5 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Eliminar cita"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'analiticas' ? (
            <AdminAnalyticsTab />
          ) : (
            <AdminBotTab />
          )}
        </div>

        {/* Modal de Propuesta si el Administrador desea probar el formulario */}
        {isProposalModalOpen && (
          <ClientProposalModal
            isOpen={isProposalModalOpen}
            onClose={closeProposalModal}
          />
        )}
      </main>
    </div>
  );
};