import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag, RotateCcw, Trash2, Send, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useGeoSoftStore } from '../context/StoreContext';
import { AppointmentStatus, PlatformType } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    pricing,
    appointments,
    isAdminModalOpen,
    closeAdminModal,
    logoutAdmin,
    updatePlatformPrice,
    updateAddonPrice,
    updateDiscount,
    resetPricing,
    updateAppointmentStatus,
    deleteAppointment
  } = useGeoSoftStore();

  const [activeTab, setActiveTab] = useState<'precios' | 'citas'>('precios');

  if (!isAdminModalOpen) return null;

  const handleWhatsAppContact = (apt: any) => {
    const text = encodeURIComponent(
      `¡Hola ${apt.fullName}! Te saludamos de GeoSoft con relación a tu cita programada para el ${apt.date} a las ${apt.time} sobre ${apt.service}.\n\n¿Confirmamos los detalles para la videollamada?`
    );
    window.open(`https://wa.me/${apt.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-lg p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#121316] rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#16181b] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-bold flex items-center justify-center text-xs sm:text-sm shadow-md shrink-0">
              GS
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                Panel de Administración
                <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-2 py-0.5 rounded-full font-mono">
                  En Vivo
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-400">Control de tarifas, promociones y citas.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={logoutAdmin}
              className="text-xs text-gray-400 hover:text-rose-400 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </button>
            <button
              onClick={closeAdminModal}
              className="p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-[#0d0e10] shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('precios')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'precios'
                ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Precios & Descuentos</span>
          </button>

          <button
            onClick={() => setActiveTab('citas')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'citas'
                ? 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Citas Agendadas ({appointments.length})</span>
            {appointments.some(a => a.status === 'pendiente') && (
              <span className="w-2 h-2 rounded-full bg-[#A9F8B5] animate-ping" />
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6 sm:space-y-8">
          {activeTab === 'precios' ? (
            <div className="space-y-8">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090a0c] border border-white/15 text-white text-sm outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-300 font-semibold">Texto del Banner Promocional</label>
                      <input
                        type="text"
                        value={pricing.discountBanner}
                        onChange={e => updateDiscount(pricing.discountPercent, true, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090a0c] border border-white/15 text-white text-sm outline-none"
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

                <div className="grid sm:grid-cols-2 gap-4">
                  {pricing.platforms.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{p.title}</span>
                        <span className="text-[10px] font-mono bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                          {p.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-gray-400">Precio Base ($):</label>
                        <input
                          type="number"
                          value={p.basePrice}
                          onChange={e => updatePlatformPrice(p.id, Number(e.target.value))}
                          className="w-32 px-3 py-1.5 rounded-lg bg-black border border-white/15 text-white font-mono font-bold text-sm outline-none focus:border-[#A9F8B5]"
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
                    <div key={addon.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="font-semibold text-white text-sm">{addon.title}</div>
                      <div className="text-[11px] text-gray-400">Periodo: {addon.period}</div>
                      <div className="flex items-center gap-2 pt-1">
                        <label className="text-xs text-gray-400">Precio ($):</label>
                        <input
                          type="number"
                          value={addon.price}
                          onChange={e => updateAddonPrice(addon.id, Number(e.target.value))}
                          className="w-24 px-3 py-1.5 rounded-lg bg-black border border-white/15 text-white font-mono font-bold text-sm outline-none focus:border-[#DFF494]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#A9F8B5]/10 border border-[#A9F8B5]/25 text-xs text-[#A9F8B5] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Los precios se guardan y actualizan automáticamente en el cotizador en tiempo real para todos los visitantes.</span>
              </div>
            </div>
          ) : (
            /* Appointments Tab */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-white text-base">Citas Solicitadas desde la Web</h4>
                  <p className="text-xs text-gray-400">Gestiona los prospectos que han solicitado asesoría.</p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                    {appointments.filter(a => a.status === 'pendiente').length} Pendientes
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                    {appointments.filter(a => a.status === 'confirmada').length} Confirmadas
                  </span>
                </div>
              </div>

              {appointments.length === 0 ? (
                <div className="p-12 text-center text-gray-500 text-sm">
                  No hay citas agendadas todavía.
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map(apt => (
                    <div
                      key={apt.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-base">{apt.fullName}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-semibold ${
                            apt.status === 'pendiente' ? 'bg-amber-500/20 text-amber-300' :
                            apt.status === 'confirmada' ? 'bg-emerald-500/20 text-emerald-300' :
                            apt.status === 'completada' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-rose-500/20 text-rose-300'
                          }`}>
                            {apt.status}
                          </span>
                          <span className="text-xs text-gray-400">• {new Date(apt.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-300">
                          <div><strong>Servicio:</strong> {apt.service}</div>
                          <div><strong>Fecha:</strong> {apt.date} a las {apt.time}</div>
                          <div><strong>WhatsApp:</strong> {apt.whatsapp}</div>
                          <div><strong>Email:</strong> {apt.email}</div>
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
                          className="px-3 py-1.5 rounded-lg bg-black border border-white/15 text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>

                        <div className="flex items-center gap-2">
                          {/* WhatsApp Contact */}
                          <button
                            onClick={() => handleWhatsAppContact(apt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteAppointment(apt.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
          )}
        </div>
      </div>
    </div>
  );
};
