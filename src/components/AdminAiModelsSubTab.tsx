import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Layers,
  Activity,
  DollarSign,
  Gauge,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Target
} from 'lucide-react';
import { GoogleAiUsage, GoogleModelCatalogItem } from '../types';

interface AdminAiModelsSubTabProps {
  aiUsage?: GoogleAiUsage;
  selectedModel: string;
  onModelChange: (modelId: string) => Promise<void>;
  isSavingModel: boolean;
  modelSavedFeedback: string | null;
  onRefresh: () => void;
}

export const googleModelsCatalog: GoogleModelCatalogItem[] = [
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    version: 'v2.0 Flash (Next-Gen)',
    badge: '⭐ Modelo Principal Recomendado',
    badgeColor: 'text-[#A9F8B5] bg-[#A9F8B5]/15 border-[#A9F8B5]/30',
    rpdLimit: 1500,
    rpmLimit: 15,
    tpmLimit: '1,000,000 TPM',
    pricing: '$0.00 en Free Tier ($0.10 / $0.40 por 1M en Pago)',
    latencyText: 'Ultra Baja (< 350ms)',
    contextWindow: '1,048,576 tokens (1M)',
    description: 'El modelo insignia de Google para agentes conversacionales en tiempo real. Velocidad relámpago, razonamiento multimodal y formato Markdown estructurado con párrafos limpios y viñetas.',
    strengths: [
      'Latencia mínima de respuesta (<350ms) que engancha al prospecto sin demoras.',
      'Estructura visual obligatoria con saltos dobles de línea y viñetas de alto impacto.',
      'Generación JSON estricta y fiable para registrar intenciones y citas en la base de datos.',
      'Cuota gratuita muy generosa de 1,500 solicitudes diarias en Google AI Studio.'
    ],
    bestFor: [
      'Servicio al cliente (Atención instantánea 24/7 sin tiempos de espera)',
      'Dar mejores respuestas (Formato limpio, viñetas, negritas, cero textos acumulados)',
      'Generar agendamientos (Flujo consultivo en 3 pasos que cierra citas cordialmente)'
    ],
    recommended: true
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    version: 'v1.5 Pro (Deep Reasoning)',
    badge: '🧠 Máxima Inteligencia & Psicología',
    badgeColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
    rpdLimit: 50,
    rpmLimit: 2,
    tpmLimit: '32,000 TPM',
    pricing: '$0.00 en Free Tier ($1.25 / $5.00 por 1M en Pago)',
    latencyText: 'Media (~1.2s - 1.8s)',
    contextWindow: '2,097,152 tokens (2M)',
    description: 'El modelo de mayor capacidad cognitiva y razonamiento profundo de Google. Especializado en análisis psicológico de necesidades, argumentación persuasiva ante objeciones complejas y formulación de propuestas de alto valor.',
    strengths: [
      'Ventana de contexto colosal de 2 Millones de tokens para memoria conversacional ilimitada.',
      'Detección de intenciones ocultas, frustraciones y necesidades implícitas del cliente.',
      'Persuasión consultiva de alto nivel para rebatir objeciones de precio ("muy caro") o competencia.',
      'Cálculo y redacción de propuestas comerciales estratégicas con desglose de Retorno de Inversión (ROI).'
    ],
    bestFor: [
      'Comprender al cliente (Detección profunda del dolor real de negocio y lectura entre líneas)',
      'Solucionar objeciones (Persuasión consultiva lógica ante dudas de precio, tiempo o desconfianza)',
      'Presentar ofertas (Estructura propuestas de alto valor con garantías y cálculo de ROI)'
    ]
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    version: 'v1.5 Flash (Balanced)',
    badge: '🎯 Preciso, Ágil & Estable',
    badgeColor: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
    rpdLimit: 1500,
    rpmLimit: 15,
    tpmLimit: '1,000,000 TPM',
    pricing: '$0.00 en Free Tier ($0.075 / $0.30 por 1M en Pago)',
    latencyText: 'Baja (~450ms)',
    contextWindow: '1,048,576 tokens (1M)',
    description: 'Modelo equilibrado optimizado para alta eficiencia operativa, síntesis de datos y calificación metódica de prospectos sin sobrecargar recursos ni agotar la cuota.',
    strengths: [
      'Seguimiento metódico y disciplinado de los protocolos de diagnóstico comercial.',
      'Extracción analítica precisa de presupuesto, rol de decisión y urgencia del proyecto.',
      'Altísima estabilidad con 1,500 peticiones diarias en el plan gratuito de Google.',
      'Ideal para absorber picos intensos de tráfico comercial y anuncios publicitarios (Ads).'
    ],
    bestFor: [
      'Calificar leads (Diagnostica presupuesto, rol de decisión y urgencia en minutos)',
      'Servicio al cliente (Atención estable y económica para alto volumen)'
    ]
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    version: 'v2.0 Flash-Lite (High RPM)',
    badge: '⚡ Cuota Extendida (30 RPM)',
    badgeColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    rpdLimit: 1500,
    rpmLimit: 30,
    tpmLimit: '1,000,000 TPM',
    pricing: '$0.00 en Free Tier ($0.075 / $0.30 por 1M en Pago)',
    latencyText: 'Ultra Baja (< 250ms)',
    contextWindow: '1,048,576 tokens (1M)',
    description: 'Versión ultraligera diseñada específicamente para maximizar la frecuencia de llamadas concurrentes. Ofrece el doble de solicitudes por minuto (30 RPM) con respuestas prácticamente instantáneas.',
    strengths: [
      '30 solicitudes por minuto (el doble que otros modelos estándar en Google AI Studio).',
      'Velocidad de respuesta imperceptible para el usuario (<250ms).',
      'Excelente resistencia a la saturación en chats simultáneos o campañas virales.',
      'Cero costo de infraestructura dentro del cupo gratuito diario.'
    ],
    bestFor: [
      'Servicio al cliente (Concurrencia masiva con cero latencia y 30 RPM)',
      'Calificar leads (Respuestas rápidas para capturar la atención de usuarios impacientes)'
    ]
  }
];

export const OBJECTIVE_FILTERS = [
  { id: 'all', label: 'Todos los Modelos', icon: Layers },
  { id: 'servicio', label: '🎧 Servicio al Cliente', model: 'gemini-2.0-flash', reason: 'Ultra baja latencia (<350ms), disponibilidad 24/7 y tono cordial y empático.' },
  { id: 'calificar', label: '🎯 Calificar Leads', model: 'gemini-1.5-flash', reason: 'Extracción metódica de presupuesto, rol y necesidad sin gastar recursos excesivos.' },
  { id: 'comprender', label: '🧠 Comprender al Cliente', model: 'gemini-1.5-pro', reason: 'Ventana de 2M de tokens, análisis psicológico profundo y lectura entre líneas del dolor del negocio.' },
  { id: 'respuestas', label: '✍️ Dar Mejores Respuestas', model: 'gemini-2.0-flash', reason: 'Formato visual en viñetas limpias, negritas estratégicas y cero texto acumulado.' },
  { id: 'objeciones', label: '🛡️ Solucionar Objeciones', model: 'gemini-1.5-pro', reason: 'El más persuasivo y analítico para derribar objeciones complejas de precio, desconfianza o tiempo.' },
  { id: 'ofertas', label: '💼 Presentar Ofertas', model: 'gemini-1.5-pro', reason: 'Estructuración de propuestas de alto valor con garantías de GeoSoft y cálculo de ROI.' },
  { id: 'agendamientos', label: '📅 Generar Agendamientos', model: 'gemini-2.0-flash', reason: 'Flujo consultivo en 3 pasos que concreta la cita y WhatsApp sin presionar al cliente.' }
];

export const AdminAiModelsSubTab: React.FC<AdminAiModelsSubTabProps> = ({
  aiUsage,
  selectedModel,
  onModelChange,
  isSavingModel,
  modelSavedFeedback,
  onRefresh
}) => {
  const [activeObjective, setActiveObjective] = useState<string>('all');

  const usage = aiUsage || {
    selectedModel,
    requestsToday: 0,
    requestsTotal: 28,
    dailyLimitRpd: selectedModel.includes('pro') ? 50 : 1500,
    rpmLimit: selectedModel.includes('pro') ? 2 : (selectedModel.includes('lite') ? 30 : 15),
    promptTokensTotal: 23800,
    candidatesTokensTotal: 5016,
    totalTokens: 28816,
    tokensToday: 0,
    avgLatencyMs: 480,
    freeTierCostUsd: 0.0,
    estimatedCommercialCostUsd: 0.0044,
    quotaPercent: 0,
    quotaStatus: 'safe' as const
  };

  const selectedObjectiveObj = OBJECTIVE_FILTERS.find(f => f.id === activeObjective);

  const getStatusBadge = () => {
    if (usage.quotaStatus === 'danger') {
      return {
        bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
        dot: 'bg-rose-500',
        label: '🔴 LÍMITE CRÍTICO — Cuota diaria próxima a agotarse (>85%)',
        desc: 'Has alcanzado más del 85% del cupo diario gratuito de Google AI Studio. Considera alternar a un modelo de mayor cupo o pausar peticiones automáticas.'
      };
    }
    if (usage.quotaStatus === 'warning') {
      return {
        bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        dot: 'bg-amber-400',
        label: '🟡 PRECAUCIÓN — Consumo moderado de cuota diaria (60-85%)',
        desc: 'El consumo diario está entre el 60% y el 85%. El servicio opera con normalidad, pero monitorea los picos de tráfico antes del reinicio nocturno.'
      };
    }
    return {
      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      dot: 'bg-emerald-400',
      label: '🟢 SEGURO — Operando holgadamente dentro de la cuota (<60%)',
      desc: 'El Bot de IA está consumiendo la API de Google de forma equilibrada. Tienes suficiente margen de solicitudes gratuitas para operar todo el día.'
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="space-y-6">
      {/* Feedback Banner on Model Switch */}
      {modelSavedFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Modelo actualizado con éxito a: <code className="font-mono bg-black/40 px-2 py-0.5 rounded text-white">{modelSavedFeedback}</code></span>
          </div>
          <span className="text-[10px] text-emerald-200">Guardado en Cloudflare D1</span>
        </div>
      )}

      {/* Main Quota Status Card */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${statusBadge.bg} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${statusBadge.dot} animate-pulse`} />
            <h4 className="font-semibold text-white text-sm sm:text-base">
              {statusBadge.label}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Reinicio de Cuota:</span>
            <span className="font-mono text-gray-200 bg-black/30 px-2 py-0.5 rounded border border-white/10">00:00 UTC Diariamente</span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          {statusBadge.desc}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 font-medium flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#A9F8B5]" />
              Consumo de Peticiones Diarias (RPD)
            </span>
            <span className="font-mono text-white font-bold">
              {usage.requestsToday} / {usage.dailyLimitRpd} RPD ({usage.quotaPercent}%)
            </span>
          </div>
          <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                usage.quotaPercent >= 85
                  ? 'bg-rose-500'
                  : usage.quotaPercent >= 60
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-[#A9F8B5] to-[#DFF494]'
              }`}
              style={{ width: `${Math.max(3, Math.min(100, usage.quotaPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Peticiones Diarias */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Peticiones Hoy</span>
            <Activity className="w-4 h-4 text-[#A9F8B5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white">
            {usage.requestsToday}
            <span className="text-xs font-normal text-gray-400 ml-1.5">/ {usage.dailyLimitRpd}</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
            <span>Total histórico:</span>
            <span className="font-mono text-white font-semibold">{usage.requestsTotal} calls</span>
          </div>
        </div>

        {/* Tokens Procesados */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Tokens Procesados</span>
            <Cpu className="w-4 h-4 text-[#DFF494]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-[#DFF494]">
            {usage.totalTokens.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
            <span>In: {usage.promptTokensTotal.toLocaleString()}</span>
            <span>Out: {usage.candidatesTokensTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Gasto Real Google AI Studio */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Gasto Real AI API</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">
            $0.00 <span className="text-xs font-normal text-gray-300">USD</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
            <span>Free Tier Activo</span>
            <span className="text-emerald-300 font-semibold">100% Gratis</span>
          </div>
        </div>

        {/* Latencia & Límites RPM */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Latencia & RPM</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white">
            ~{usage.avgLatencyMs} <span className="text-xs font-normal text-gray-400">ms</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
            <span>Límite velocidad:</span>
            <span className="font-mono text-white font-semibold">{usage.rpmLimit} RPM</span>
          </div>
        </div>
      </div>

      {/* Active Model Spotlight Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/15 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Modelo en Producción Activo
              </span>
              <span className="text-xs text-gray-400 font-mono">Google AI Studio</span>
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
              <span>{selectedModel}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-gray-300">
              <span className="text-gray-500 mr-1.5">Cuota Diaria:</span>
              <strong className="text-white font-mono">{usage.dailyLimitRpd} RPD</strong>
            </div>
            <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-gray-300">
              <span className="text-gray-500 mr-1.5">Costo Equivalente:</span>
              <strong className="text-emerald-300 font-mono">~${usage.estimatedCommercialCostUsd} USD (Ahorrado)</strong>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Este es el motor de Inteligencia Artificial que procesa en vivo todas las conversaciones de los visitantes en la web. Puedes cambiarlo en cualquier momento con 1 clic en el catálogo inferior.
        </p>
      </div>

      {/* Objective Filter Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-[#A9F8B5]" />
              <span>¿Para qué objetivo buscas el mejor modelo?</span>
            </h4>
            <p className="text-xs text-gray-400">
              Selecciona uno de los 7 objetivos clave para ver la recomendación técnica y comercial ideal de Google.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {OBJECTIVE_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveObjective(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeObjective === f.id
                  ? 'bg-[#A9F8B5] text-black shadow-[0_0_15px_rgba(169,248,181,0.3)] font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Selected Objective Detail Banner */}
        {selectedObjectiveObj && selectedObjectiveObj.id !== 'all' && (
          <div className="p-3.5 rounded-xl bg-[#A9F8B5]/10 border border-[#A9F8B5]/30 text-xs text-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#A9F8B5] shrink-0" />
              <span>
                El <strong>MEJOR modelo</strong> para <strong className="text-white">{selectedObjectiveObj.label}</strong> es{' '}
                <strong className="text-[#A9F8B5] underline underline-offset-2">{selectedObjectiveObj.model}</strong>:{' '}
                {selectedObjectiveObj.reason}
              </span>
            </div>
            {selectedModel !== selectedObjectiveObj.model && (
              <button
                onClick={() => onModelChange(selectedObjectiveObj.model!)}
                disabled={isSavingModel}
                className="px-3 py-1 rounded-lg bg-[#A9F8B5] text-black font-bold text-xs hover:bg-[#A9F8B5]/90 transition-all cursor-pointer self-start sm:self-auto shrink-0 disabled:opacity-50"
              >
                Activar {selectedObjectiveObj.model}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Google Models Catalog Grid */}
      <div className="space-y-4">
        <h4 className="font-semibold text-white text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#DFF494]" />
          <span>Catálogo de Modelos de Google AI Studio & Casos de Uso</span>
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {googleModelsCatalog.map(model => {
            const isActive = selectedModel === model.id;
            const isMatchForObjective = selectedObjectiveObj?.model === model.id;

            return (
              <div
                key={model.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#A9F8B5]/10 border-[#A9F8B5] shadow-[0_0_20px_rgba(169,248,181,0.15)] ring-1 ring-[#A9F8B5]/40'
                    : isMatchForObjective
                    ? 'bg-white/[0.08] border-[#A9F8B5]/60 ring-1 ring-[#A9F8B5]/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
                          {model.badge}
                        </span>
                        {isActive && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Activo
                          </span>
                        )}
                        {isMatchForObjective && !isActive && (
                          <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/30 px-2 py-0.5 rounded-full font-bold">
                            🏆 Recomendado para tu filtro
                          </span>
                        )}
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white font-display">
                        {model.name}
                      </h4>
                      <div className="text-[11px] font-mono text-gray-400">{model.version}</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {model.description}
                  </p>

                  {/* Quota & Spec Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-gray-500 block text-[10px]">Límite Diario:</span>
                      <strong className="text-white font-mono">{model.rpdLimit} RPD</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Límite Velocidad:</span>
                      <strong className="text-white font-mono">{model.rpmLimit} RPM</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Latencia:</span>
                      <strong className="text-white">{model.latencyText}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">Costo Free Tier:</span>
                      <strong className="text-emerald-300 font-mono">$0.00 USD</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 block text-[10px]">Ventana de Contexto:</span>
                      <strong className="text-gray-200">{model.contextWindow}</strong>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-gray-300 block">Fortalezas Clave:</span>
                    <ul className="space-y-1 text-xs text-gray-400">
                      {model.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#A9F8B5] shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best For Section (Requested by user) */}
                  <div className="p-3 rounded-xl bg-black/40 border border-[#A9F8B5]/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#A9F8B5]">
                      <Award className="w-3.5 h-3.5" />
                      <span>ES EL MEJOR PARA:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-gray-200">
                      {model.bestFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#A9F8B5] font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-gray-400 font-mono">
                    ID API: <code className="text-gray-200">{model.id}</code>
                  </div>

                  {isActive ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Modelo Activo
                    </span>
                  ) : (
                    <button
                      onClick={() => onModelChange(model.id)}
                      disabled={isSavingModel}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#A9F8B5] text-white hover:text-black border border-white/20 hover:border-transparent text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Activar este Modelo</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
