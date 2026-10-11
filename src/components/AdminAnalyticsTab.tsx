import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Globe, 
  Smartphone, 
  Flame, 
  MousePointerClick, 
  TrendingUp, 
  RefreshCw, 
  Clock, 
  Sparkles, 
  MapPin, 
  Layers,
  Monitor,
  Tablet,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { api, AnalyticsData } from '../services/api';

export const AdminAnalyticsTab: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'overview' | 'heatmap'>('overview');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    const res = await api.getAnalytics();
    if (res) setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totals = data?.totals || {
    totalViews: 0,
    uniqueVisitors: 0,
    todayViews: 0,
    todayUnique: 0,
    totalClicks: 0,
    totalBookings: 0,
    totalQuotes: 0,
    totalWhatsApp: 0,
    peakHour: '--:--',
    peakHourCount: 0
  };

  const maxHourly = Math.max(...(data?.hourly?.map(h => h.visits) || [1]), 1);

  return (
    <div className="space-y-8">
      {/* Top Bar with Status and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
            <span>Métricas Reales & Analíticas en Vivo</span>
            <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-pulse" />
              Cloudflare D1 Edge
            </span>
          </h3>
          <p className="text-xs text-gray-400">
            Seguimiento propio y soberano sin intermediarios ni cookies invasivas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Subview Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-black border border-white/10 text-xs">
            <button
              onClick={() => setActiveSubView('overview')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeSubView === 'overview'
                  ? 'bg-white/15 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Reportes & Tráfico
            </button>
            <button
              onClick={() => setActiveSubView('heatmap')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeSubView === 'heatmap'
                  ? 'bg-[#A9F8B5]/20 text-[#A9F8B5]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Zonas de Calor</span>
            </button>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Recargar Métricas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#A9F8B5]' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="p-5 rounded-2xl bg-[#15171b] border border-white/10 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Visitas Totales</span>
            <BarChart3 className="w-4 h-4 text-[#A9F8B5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {totals.totalViews}
          </div>
          <div className="text-[11px] text-[#A9F8B5] flex items-center gap-1 font-mono">
            <span>Hoy: +{totals.todayViews}</span>
            <span className="text-gray-500">• {totals.uniqueVisitors} únicos</span>
          </div>
        </div>

        {/* Traffic Peak Hour */}
        <div className="p-5 rounded-2xl bg-[#15171b] border border-[#DFF494]/25 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Pico Máximo de Tráfico</span>
            <Clock className="w-4 h-4 text-[#DFF494]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#DFF494]">
            {totals.peakHour}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            Mayor concentración de visitas
          </div>
        </div>

        {/* Total Clicks */}
        <div className="p-5 rounded-2xl bg-[#15171b] border border-white/10 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Clics Registrados</span>
            <MousePointerClick className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {totals.totalClicks}
          </div>
          <div className="text-[11px] text-cyan-400 font-mono">
            Interacciones en botones clave
          </div>
        </div>

        {/* Lead Conversions */}
        <div className="p-5 rounded-2xl bg-[#15171b] border border-emerald-500/25 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Conversiones a Leads</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400">
            {totals.totalBookings + totals.totalWhatsApp}
          </div>
          <div className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
            <span>{totals.totalBookings} Citas</span>
            <span>• {totals.totalWhatsApp} WhatsApp</span>
          </div>
        </div>
      </div>

      {activeSubView === 'overview' ? (
        <>
          {/* Hourly Traffic Breakdown Chart */}
          <div className="card-accent p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#DFF494]" />
                  <span>Distribución de Tráfico por Hora (Picos del Día)</span>
                </h4>
                <p className="text-xs text-gray-400">Monitoreo continuo de 00:00 a 23:00 horas.</p>
              </div>
              <div className="text-xs font-mono text-[#DFF494] bg-[#DFF494]/10 px-2.5 py-1 rounded-full">
                Pico: {totals.peakHour}
              </div>
            </div>

            {/* 24-Hour Bar Graph */}
            <div className="pt-4 pb-2">
              <div className="flex items-end justify-between gap-1 sm:gap-2 h-44 border-b border-white/10 px-2">
                {data?.hourly?.map((item, idx) => {
                  const heightPct = Math.max((item.visits / maxHourly) * 100, item.visits > 0 ? 12 : 3);
                  const isPeak = item.hour === totals.peakHour && item.visits > 0;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-8 bg-black/90 border border-white/20 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                        {item.hour}: {item.visits} visitas
                      </div>

                      {/* Bar */}
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[18px] rounded-t-md transition-all duration-300 ${
                          isPeak
                            ? 'bg-gradient-to-t from-[#A9F8B5] to-[#DFF494] shadow-[0_0_12px_rgba(223,244,148,0.5)]'
                            : item.visits > 0
                            ? 'bg-[#A9F8B5]/60 hover:bg-[#A9F8B5]'
                            : 'bg-white/5 hover:bg-white/15'
                        }`}
                      />
                      <span className="text-[9px] font-mono text-gray-500 mt-2 truncate max-w-[20px]">
                        {item.hour.split(':')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2 Columns: Geolocation (Countries & Cities) and Device/Browser Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Geolocation */}
            <div className="card-accent p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#A9F8B5]" />
                  <span>Ubicación del Tráfico (Países)</span>
                </h4>
                <span className="text-xs text-gray-400 font-mono">Cloudflare GeoIP</span>
              </div>

              {data?.countries && data.countries.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {data.countries.map((c, i) => {
                    const countryName = c.country === 'CR' ? 'Costa Rica 🇨🇷' :
                                        c.country === 'US' ? 'Estados Unidos 🇺🇸' :
                                        c.country === 'MX' ? 'México 🇲🇽' :
                                        c.country === 'ES' ? 'España 🇪🇸' :
                                        c.country === 'CO' ? 'Colombia 🇨🇴' :
                                        c.country === 'PA' ? 'Panamá 🇵🇦' :
                                        c.country;

                    const pct = totals.totalViews > 0 ? Math.round((c.count / totals.totalViews) * 100) : 100;

                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-white flex items-center gap-2">
                            <span>{countryName}</span>
                          </span>
                          <span className="font-mono text-gray-400">
                            {c.count} visitas ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-[#A9F8B5] to-[#DFF494]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-gray-500">
                  Esperando registros de tráfico geolocalizado...
                </div>
              )}

              {/* Cities pills */}
              {data?.cities && data.cities.length > 0 && (
                <div className="pt-3 border-t border-white/5">
                  <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#DFF494]" />
                    <span>Ciudades Principales:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.cities.map((city, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                      >
                        {city.city} ({city.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Devices & Browsers */}
            <div className="card-accent p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Dispositivos & Plataformas</span>
                </h4>
                <span className="text-xs text-gray-400 font-mono">User-Agent</span>
              </div>

              {data?.devices && data.devices.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {data.devices.map((dev, i) => {
                    const devName = dev.device === 'mobile' ? 'Móvil / Smartphone' :
                                    dev.device === 'tablet' ? 'Tablet' : 'Escritorio / Laptop';
                    const DevIcon = dev.device === 'mobile' ? Smartphone :
                                    dev.device === 'tablet' ? Tablet : Monitor;
                    const pct = totals.totalViews > 0 ? Math.round((dev.count / totals.totalViews) * 100) : 100;

                    return (
                      <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-white font-medium">
                            <DevIcon className="w-4 h-4 text-[#A9F8B5]" />
                            <span>{devName}</span>
                          </div>
                          <span className="font-mono text-[#DFF494] font-bold">
                            {dev.count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full rounded-full bg-cyan-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-gray-500">
                  Esperando registros de dispositivos...
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Heatmap / Hot Zones View */
        <div className="space-y-6">
          <div className="card-accent p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Zonas de Mapa Caliente (Heatmap & Click Hotspots)</span>
                </h4>
                <p className="text-xs text-gray-400">
                  Visualización de las partes de la pantalla y botones con mayor concentración de clics.
                </p>
              </div>

              {/* Intensity legend */}
              <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Normal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Medio
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" /> Muy Caliente
                </span>
              </div>
            </div>

            {/* Interactive Page Canvas Heatmap Simulator */}
            <div className="relative w-full h-96 rounded-2xl bg-[#090a0c] border border-white/15 overflow-hidden flex flex-col items-center justify-center">
              {/* Wireframe Mockup Layout in Background */}
              <div className="absolute inset-4 opacity-25 pointer-events-none flex flex-col justify-between text-[10px] font-mono text-gray-500">
                <div className="border border-dashed border-white/20 p-2 rounded-xl flex justify-between">
                  <span>[Navbar: Inicio, Servicios, Cotizador, Agendar]</span>
                  <span>🔒 Admin</span>
                </div>
                <div className="border border-dashed border-white/20 p-4 rounded-xl flex flex-col items-center text-center">
                  <span>[Hero Section: Headlines + Botón Cotizar + Botón Agendar Cita]</span>
                </div>
                <div className="border border-dashed border-white/20 p-3 rounded-xl flex justify-around">
                  <span>[Bento Soluciones]</span>
                  <span>[Casos Reales]</span>
                </div>
                <div className="border border-dashed border-white/20 p-3 rounded-xl flex justify-between">
                  <span>[Cotizador Inteligente 2.0]</span>
                  <span>[Cal.com / Booking]</span>
                </div>
              </div>

              {/* Render Heatmap Points */}
              {data?.heatmapPoints && data.heatmapPoints.length > 0 ? (
                data.heatmapPoints.map((pt, idx) => {
                  const left = Math.min(Math.max(pt.x_pct, 5), 95);
                  const top = Math.min(Math.max(pt.y_pct, 5), 95);

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    >
                      {/* Glow halo */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-red-600 opacity-70 blur-[4px] animate-pulse group-hover:scale-150 transition-transform" />
                      <div className="absolute inset-2 rounded-full bg-rose-400 border border-white shadow-[0_0_10px_#f43f5e]" />
                    </div>
                  );
                })
              ) : (
                <div className="relative z-10 text-center space-y-2 p-6">
                  <Flame className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                  <p className="text-sm font-semibold text-white">
                    Los puntos de calor se generan en tiempo real con los clics de tus visitantes.
                  </p>
                  <p className="text-xs text-gray-400">
                    Interactúa en la web haciendo clic en los botones y vuelve aquí para ver las coordenadas calientes.
                  </p>
                </div>
              )}

              {/* Floating Tooltip for Hovered Point */}
              {hoveredPoint && (
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-black/95 border border-[#A9F8B5]/40 rounded-xl p-3 shadow-2xl z-30 text-xs text-white flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                  <div>
                    <div className="font-bold">{hoveredPoint.target_name || 'Clic en Pantalla'}</div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {hoveredPoint.weight} clics registrados en esta zona
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Top Clicked Elements Table / Ranking */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h5 className="font-display font-semibold text-white text-sm">
                Ranking de Botones y Elementos con Mayor Interacción:
              </h5>

              {data?.hotElements && data.hotElements.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.hotElements.map((el, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span className="w-5 h-5 rounded-md bg-[#A9F8B5]/15 text-[#A9F8B5] font-mono text-xs flex items-center justify-center font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-white truncate">
                          {el.target_name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#DFF494] shrink-0">
                        {el.clicks} clics
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No hay suficientes clics acumulados aún.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
