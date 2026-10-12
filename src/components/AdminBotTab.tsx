import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  CalendarCheck, 
  TrendingUp, 
  RefreshCw, 
  ShieldAlert, 
  BookOpen, 
  Send, 
  Trash2, 
  PlusCircle, 
  Clock, 
  AlertCircle,
  Sliders,
  Zap,
  Target,
  FileText,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { BotAnalyticsData, BotUnansweredQuestion, BotFaqItem, BotLengthMode } from '../types';

export const AdminBotTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<BotAnalyticsData | null>(null);
  const [unanswered, setUnanswered] = useState<BotUnansweredQuestion[]>([]);
  const [faqs, setFaqs] = useState<BotFaqItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'kpis' | 'configuracion' | 'objeciones' | 'aprendizaje' | 'faqs'>('kpis');

  // Configuración de longitud de respuesta
  const [lengthMode, setLengthMode] = useState<BotLengthMode>('equilibrado');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Configuración de saludo del bot
  const [welcomeMessage, setWelcomeMessage] = useState('¡Hola! 👋 Bienvenido a GeoSoft. Soy tu Asesor de Soluciones Digitales y Software. Cuéntame, ¿qué proyecto o reto tienes en mente para tu negocio?');
  const [isSavingWelcome, setIsSavingWelcome] = useState(false);
  const [welcomeSavedFeedback, setWelcomeSavedFeedback] = useState(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(0);

  const greetingTemplates = [
    {
      title: 'Predeterminado (Consultivo & Empático)',
      badge: '⭐ Por Defecto',
      text: '¡Hola! 👋 Bienvenido a GeoSoft. Soy tu Asesor de Soluciones Digitales y Software. Cuéntame, ¿qué proyecto o reto tienes en mente para tu negocio?',
      desc: 'Cero presión inicial, enfocado en entender la necesidad del cliente antes de ofrecer servicios.'
    },
    {
      title: 'Sugerido 1: Crecimiento & Ventas',
      badge: '🚀 Enfoque ROI',
      text: '¡Hola! Qué gusto saludarte. En GeoSoft ayudamos a empresas a automatizar sus procesos y multiplicar sus ventas con páginas web y agentes de IA. ¿Cuál es el principal objetivo que te gustaría alcanzar este mes?',
      desc: 'Pensado para prospectos comerciales y directores que buscan resultados tangibles.'
    },
    {
      title: 'Sugerido 2: Ingeniería & Soluciones a Medida',
      badge: '💻 Técnico & Proyectos',
      text: '¡Hola! Bienvenido al equipo de ingeniería de GeoSoft. Diseñamos plataformas web, sistemas de reservas y software a tu medida. ¿Tienes una idea nueva que deseas construir o un sistema que necesitas modernizar?',
      desc: 'Ideal para clientes que buscan desarrollos robustos, integraciones API o SaaS.'
    },
    {
      title: 'Sugerido 3: Directo & Asesoría Rápida',
      badge: '🎯 Agilidad & Cotizaciones',
      text: '¡Hola! 👋 Estoy aquí para resolver todas tus consultas sobre desarrollo web, automatizaciones y precios en tiempo real. ¿En qué solución te gustaría que te oriente hoy?',
      desc: 'Breve y accesible para resolver dudas directas sobre planes y funcionalidades.'
    }
  ];

  // Answer form state
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [adminAnswerText, setAdminAnswerText] = useState('');
  const [adminCategory, setAdminCategory] = useState('General');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // New FAQ form state
  const [showNewFaq, setShowNewFaq] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqCat, setNewFaqCat] = useState('General');

  const fetchData = async () => {
    setLoading(true);
    const [analyticsRes, unansRes, faqsRes, configRes] = await Promise.all([
      api.getBotAnalytics(),
      api.getBotUnanswered(),
      api.getBotFaqs(true),
      api.getBotConfig()
    ]);
    if (analyticsRes) setAnalytics(analyticsRes);
    if (unansRes) setUnanswered(unansRes);
    if (faqsRes) setFaqs(faqsRes);
    if (configRes) {
      if (configRes.lengthMode) setLengthMode(configRes.lengthMode);
      if (configRes.welcomeMessage) setWelcomeMessage(configRes.welcomeMessage);
    }
    setLoading(false);
  };

  const handleLengthModeChange = async (mode: BotLengthMode) => {
    setLengthMode(mode);
    setIsSavingConfig(true);
    const ok = await api.saveBotConfig({ lengthMode: mode });
    if (ok) {
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 2500);
    }
    setIsSavingConfig(false);
  };

  const handleSaveWelcome = async () => {
    if (!welcomeMessage.trim() || isSavingWelcome) return;
    setIsSavingWelcome(true);
    const ok = await api.saveBotConfig({ welcomeMessage });
    if (ok) {
      setWelcomeSavedFeedback(true);
      setTimeout(() => setWelcomeSavedFeedback(false), 2500);
    }
    setIsSavingWelcome(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAnswerSubmit = async (item: BotUnansweredQuestion) => {
    if (!adminAnswerText.trim() || isSubmittingAnswer) return;
    setIsSubmittingAnswer(true);

    const success = await api.answerBotQuestion(item.id, adminAnswerText, adminCategory);
    if (success) {
      setAnsweringId(null);
      setAdminAnswerText('');
      await fetchData();
    }
    setIsSubmittingAnswer(false);
  };

  const handleDeleteUnanswered = async (id: number) => {
    if (!confirm('¿Descartar esta pregunta?')) return;
    const ok = await api.deleteBotUnanswered(id);
    if (ok) {
      setUnanswered(prev => prev.filter(q => q.id !== id));
      if (analytics) {
        setAnalytics({
          ...analytics,
          pendingUnanswered: Math.max(0, analytics.pendingUnanswered - 1)
        });
      }
    }
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;

    const ok = await api.saveBotFaq({
      question: newFaqQ.trim(),
      answer: newFaqA.trim(),
      category: newFaqCat.trim(),
      is_published: 1
    });

    if (ok) {
      setNewFaqQ('');
      setNewFaqA('');
      setShowNewFaq(false);
      await fetchData();
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm('¿Eliminar esta pregunta frecuente del RAG?')) return;
    const ok = await api.deleteBotFaq(id);
    if (ok) {
      setFaqs(prev => prev.filter(f => f.id !== id));
    }
  };

  const pendingQuestionsCount = unanswered.filter(q => q.status === 'pendiente').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h3 className="font-display font-bold text-white text-base sm:text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#A9F8B5]" />
            <span>Métricas & Reportería del Bot de IA</span>
            <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] animate-ping" />
              Gemini Activo
            </span>
          </h3>
          <p className="text-xs text-gray-400">
            Seguimiento de cierres persuasivos, solución de objeciones y aprendizaje en tiempo real.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#A9F8B5]' : ''}`} />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('kpis')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'kpis'
              ? 'bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Resumen de Rendimiento</span>
        </button>

        <button
          onClick={() => setActiveSubTab('configuracion')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'configuracion'
              ? 'bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#DFF494]" />
          <span>Configuración & Saludos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('objeciones')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'objeciones'
              ? 'bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Reportería de Objeciones ({analytics?.totalObjections || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('aprendizaje')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap relative ${
            activeSubTab === 'aprendizaje'
              ? 'bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Preguntas Sin Respuesta ({pendingQuestionsCount})</span>
          {pendingQuestionsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('faqs')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'faqs'
              ? 'bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Base de Conocimiento RAG ({faqs.length})</span>
        </button>
      </div>

      {/* SUB-VIEW 1: KPIS & RENDIMIENTO */}
      {activeSubTab === 'kpis' && (
        <div className="space-y-6">
          {/* Calibración de Longitud de Respuestas del Bot */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#A9F8B5]" />
                  <span>Calibración de Longitud & Estilo del Bot</span>
                </h4>
                <p className="text-xs text-gray-400">
                  Define la extensión y profundidad de las respuestas que el Bot de IA envía a los clientes.
                </p>
              </div>

              {saveFeedback && (
                <span className="text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold animate-in fade-in">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Guardado en la nube
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Modo Corto */}
              <div
                onClick={() => handleLengthModeChange('corto')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  lengthMode === 'corto'
                    ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] shadow-[0_0_15px_rgba(169,248,181,0.15)] ring-1 ring-[#A9F8B5]'
                    : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Modo Directo & Corto</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                      ~35-65 palabras
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    1 a 2 oraciones breves y directas al grano. Sin rodeos, respuestas inmediatas.
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">Velocidad: Instantánea</span>
                  {lengthMode === 'corto' && (
                    <span className="text-[#A9F8B5] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Activo
                    </span>
                  )}
                </div>
              </div>

              {/* Modo Equilibrado (DEFAULT) */}
              <div
                onClick={() => handleLengthModeChange('equilibrado')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  lengthMode === 'equilibrado'
                    ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] shadow-[0_0_15px_rgba(169,248,181,0.15)] ring-1 ring-[#A9F8B5]'
                    : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Target className="w-3.5 h-3.5 text-[#A9F8B5]" />
                      <span>Equilibrado & Persuasivo</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#A9F8B5]/20 text-[#A9F8B5] font-semibold">
                      ⭐ Por Defecto
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-normal">
                    1 a 2 párrafos concisos con viñetas de valor (~80-140 palabras). Máxima persuasión y tasa de cierre.
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-[#DFF494]">Conversión: Recomendado</span>
                  {lengthMode === 'equilibrado' && (
                    <span className="text-[#A9F8B5] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Activo
                    </span>
                  )}
                </div>
              </div>

              {/* Modo Detallado */}
              <div
                onClick={() => handleLengthModeChange('detallado')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  lengthMode === 'detallado'
                    ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] shadow-[0_0_15px_rgba(169,248,181,0.15)] ring-1 ring-[#A9F8B5]'
                    : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <FileText className="w-3.5 h-3.5 text-blue-300" />
                      <span>Detallado & Consultivo</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                      ~180-280 palabras
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Explicación exhaustiva con desglose paso a paso, arquitectura técnica, etapas y propuesta integral.
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">Profundidad: Completa</span>
                  {lengthMode === 'detallado' && (
                    <span className="text-[#A9F8B5] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Activo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-medium">Chats Iniciados</span>
                <MessageSquare className="w-4 h-4 text-[#A9F8B5]" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">
                {analytics?.totalConversations || 0}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Aperturas de conversación</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-medium">Preguntas Respondidas</span>
                <CheckCircle2 className="w-4 h-4 text-[#DFF494]" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-[#DFF494]">
                {analytics?.totalAnswers || 0}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">De {analytics?.totalQuestions || 0} realizadas</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-medium">Objeciones Resueltas</span>
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">
                {analytics?.resolvedObjections || 0}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {analytics?.totalObjections ? `${Math.round(((analytics.resolvedObjections || 0) / analytics.totalObjections) * 100)}% de efectividad` : '100% efectividad'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#A9F8B5]/15 to-[#DFF494]/5 border border-[#A9F8B5]/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-white mb-2">
                <span className="text-xs font-bold">Citas Cerradas</span>
                <CalendarCheck className="w-4 h-4 text-[#A9F8B5]" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">
                {analytics?.appointmentsClosed || 0}
              </div>
              <div className="text-[10px] text-[#A9F8B5] mt-1 font-semibold">Generadas 100% por el Bot</div>
            </div>
          </div>

          {/* Breakdown by Objection Type */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h4 className="font-semibold text-white text-sm flex items-center justify-between">
              <span>Distribución de Objeciones Detectadas</span>
              <span className="text-xs text-gray-400 font-normal">
                Total registradas: {analytics?.totalObjections || 0}
              </span>
            </h4>

            {analytics?.objectionsByType && analytics.objectionsByType.length > 0 ? (
              <div className="space-y-2.5">
                {analytics.objectionsByType.map((item, idx) => {
                  const pct = analytics.totalObjections ? Math.round((item.count / analytics.totalObjections) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-200 capitalize font-medium">
                          Objeción de {item.objection_type}
                        </span>
                        <span className="text-gray-400">{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-gray-400">
                Aún no se han registrado objeciones en las conversaciones de los usuarios.
              </div>
            )}
          </div>

          {/* Citas Cerradas por el Bot */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#A9F8B5]" />
              <span>Citas Cerradas por el Bot de IA</span>
            </h4>

            {analytics?.botAppointments && analytics.botAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Cliente</th>
                      <th className="py-2 px-3">Contacto</th>
                      <th className="py-2 px-3">Servicio</th>
                      <th className="py-2 px-3">Fecha & Hora</th>
                      <th className="py-2 px-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {analytics.botAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-white/5">
                        <td className="py-2.5 px-3 font-semibold text-white">{apt.fullName}</td>
                        <td className="py-2.5 px-3 text-gray-300 font-mono text-[11px]">{apt.whatsapp}</td>
                        <td className="py-2.5 px-3 text-gray-300">{apt.service}</td>
                        <td className="py-2.5 px-3 text-gray-300">{apt.date} • {apt.time}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Cerrada por Bot
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">
                El bot aún no ha completado el cierre de una cita. Cuando un visitante confirme en el chat, aparecerá aquí automáticamente.
              </p>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW: CONFIGURACIÓN, SALUDOS & PROTOCOLO DEL BOT */}
      {activeSubTab === 'configuracion' && (
        <div className="space-y-6">
          
          {/* 1. SECCIÓN: SALUDO INICIAL DEL BOT */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#A9F8B5]" />
                  <span>Saludo Inicial del Bot (Mensaje de Bienvenida)</span>
                </h4>
                <p className="text-xs text-gray-400">
                  Selecciona uno de los saludos sugeridos o escribe tu propio saludo personalizado.
                </p>
              </div>

              {welcomeSavedFeedback && (
                <span className="text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Saludo guardado en la nube
                </span>
              )}
            </div>

            {/* Cuadrícula de 4 Saludos (Predeterminado + 3 Sugeridos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {greetingTemplates.map((item, idx) => {
                const isSelected = welcomeMessage.trim() === item.text.trim();
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setWelcomeMessage(item.text);
                      setSelectedTemplateIndex(idx);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] ring-1 ring-[#A9F8B5] shadow-[0_0_15px_rgba(169,248,181,0.12)]'
                        : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#DFF494]">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-200 italic leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">
                        "{item.text}"
                      </p>
                      <p className="text-[10.5px] text-gray-400">{item.desc}</p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 text-[10px]">Toca para cargar al editor</span>
                      {isSelected ? (
                        <span className="text-[#A9F8B5] font-semibold flex items-center gap-1 text-[11px]">
                          <Check className="w-3 h-3" /> Seleccionado
                        </span>
                      ) : (
                        <span className="text-gray-400 hover:text-white text-[11px]">Cargar ➔</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Editor de Saludo Personalizado */}
            <div className="pt-2 space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span>Editar o Escribir Saludo Personalizado del Bot:</span>
                <span className="text-[11px] text-gray-500 font-mono">{welcomeMessage.length} caracteres</span>
              </label>

              <textarea
                rows={3}
                value={welcomeMessage}
                onChange={e => setWelcomeMessage(e.target.value)}
                placeholder="Escribe el saludo con el que el bot abrirá la conversación con tus clientes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1014] border border-white/15 focus:border-[#A9F8B5] text-white text-xs outline-none transition-colors leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-gray-400">
                  Este mensaje se mostrará automáticamente como el primer mensaje del asesor en el chat web.
                </p>

                <button
                  onClick={handleSaveWelcome}
                  disabled={isSavingWelcome || !welcomeMessage.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#A9F8B5]/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 shrink-0 active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSavingWelcome ? 'Guardando...' : 'Guardar Saludo del Bot'}</span>
                </button>
              </div>
            </div>

            {/* Vista Previa del Saludo en el Chat */}
            <div className="mt-3 p-3.5 rounded-xl bg-[#090a0d] border border-white/10 space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Vista Previa en Chat Web:
              </span>
              <div className="flex gap-2.5 items-start max-w-md pt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                </div>
                <div className="bg-[#181a1f] text-gray-100 border border-white/10 rounded-2xl rounded-tl-sm p-3 text-xs leading-relaxed shadow-md">
                  {welcomeMessage}
                </div>
              </div>
            </div>
          </div>

          {/* 2. SECCIÓN: PROTOCOLO CONSULTIVO DE VENTAS DEL BOT */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-black to-[#0d1410] border border-[#A9F8B5]/30 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#A9F8B5]/20 text-[#A9F8B5] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  Protocolo Consultivo de Ventas (Directriz Activa en Gemini)
                </h4>
                <p className="text-[11px] text-gray-400">
                  Reglas de comportamiento y psicología de ventas integradas en el prompt del bot.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-[#A9F8B5] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#A9F8B5]/20 flex items-center justify-center text-[10px]">1</span>
                  <span>Diagnóstico & Empatía</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-normal">
                  Saluda con calidez y <strong>nunca presiona agendar en el primer mensaje</strong>. Su meta inicial es escuchar y comprender el dolor o necesidad del cliente.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-[#DFF494] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#DFF494]/20 flex items-center justify-center text-[10px]">2</span>
                  <span>Solución & Valor GeoSoft</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-normal">
                  Explica estructuradamente cómo resolvemos su problema específico (código propio, entrega en 5-10 días, pasarelas locales e IA).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center text-[10px]">3</span>
                  <span>Agendamiento Natural</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-normal">
                  Solo cuando el cliente comprende el valor y valida su interés, sugiere suavemente coordinar una videollamada de 15 minutos sin compromiso.
                </p>
              </div>
            </div>
          </div>

          {/* 3. SECCIÓN: CALIBRACIÓN DE LONGITUD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#A9F8B5]" />
                  <span>Calibración de Longitud de Respuestas</span>
                </h4>
                <p className="text-xs text-gray-400">
                  Controla la extensión con la que el bot responderá a los usuarios.
                </p>
              </div>

              {saveFeedback && (
                <span className="text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Longitud guardada
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                onClick={() => handleLengthModeChange('corto')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  lengthMode === 'corto'
                    ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] ring-1 ring-[#A9F8B5]'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-300" /> Modo Corto
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">~35-65 palabras</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">1-2 oraciones directas sin rodeos.</p>
                </div>
                <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                  <span>Velocidad: Rápida</span>
                  {lengthMode === 'corto' && <span className="text-[#A9F8B5] font-semibold">✓ Activo</span>}
                </div>
              </div>

              <div
                onClick={() => handleLengthModeChange('equilibrado')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  lengthMode === 'equilibrado'
                    ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] ring-1 ring-[#A9F8B5]'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-[#A9F8B5]" /> Equilibrado
                    </span>
                    <span className="text-[10px] font-mono text-[#A9F8B5] bg-[#A9F8B5]/20 px-1 rounded">⭐ Por Defecto</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1">1-2 párrafos con viñetas estructuradas (~80-140 palabras).</p>
                </div>
                <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                  <span className="text-[#DFF494]">Máxima Conversión</span>
                  {lengthMode === 'equilibrado' && <span className="text-[#A9F8B5] font-semibold">✓ Activo</span>}
                </div>
              </div>

              <div
                onClick={() => handleLengthModeChange('detallado')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  lengthMode === 'detallado'
                    ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] ring-1 ring-[#A9F8B5]'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-300" /> Detallado
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">~180-280 palabras</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Explicación técnica y consultiva exhaustiva.</p>
                </div>
                <div className="mt-3 text-[10px] text-gray-400 flex justify-between">
                  <span>Profundidad: Alta</span>
                  {lengthMode === 'detallado' && <span className="text-[#A9F8B5] font-semibold">✓ Activo</span>}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: REPORTERÍA DETALLADA DE OBJECIONES */}
      {activeSubTab === 'objeciones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Historial cronológico de objeciones y soluciones generadas</span>
            <span>Total: {analytics?.recentObjections?.length || 0}</span>
          </div>

          {analytics?.recentObjections && analytics.recentObjections.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentObjections.map((obj, i) => (
                <div key={obj.id || i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 capitalize font-mono text-[10px]">
                      Objeción: {obj.objection_type}
                    </span>
                    <span className="text-gray-400 text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(obj.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">Lo que planteó el usuario:</div>
                    <div className="text-xs text-white font-medium bg-black/30 p-2.5 rounded-xl border border-white/5">
                      "{obj.objection_text}"
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#A9F8B5]" />
                      <span>Solución persuasiva aplicada por el Bot:</span>
                    </div>
                    <div className="text-xs text-gray-200 bg-[#A9F8B5]/5 p-2.5 rounded-xl border border-[#A9F8B5]/20 leading-relaxed">
                      {obj.solution_provided}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400">
              No hay objeciones registradas aún. Las objeciones resueltas por el bot aparecerán aquí en tiempo real.
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: PREGUNTAS SIN RESPUESTA & APRENDIZAJE */}
      {activeSubTab === 'aprendizaje' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold">Bucle de Aprendizaje Continuo (RAG)</p>
              <p className="text-gray-300 text-[11px] mt-0.5">
                Cuando un usuario pregunta algo no contemplado en el RAG, el bot le brinda una solución alternativa y registra la duda aquí. Al responderla y guardarla, se incorpora de inmediato a las Preguntas Frecuentes y el bot la aprenderá para siempre.
              </p>
            </div>
          </div>

          {unanswered.length > 0 ? (
            <div className="space-y-3">
              {unanswered.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.status === 'pendiente'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    }`}>
                      {item.status === 'pendiente' ? '⏳ Pendiente de Respuesta Oficial' : '✅ Aprendida e Incorporada'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDeleteUnanswered(item.id)}
                        className="p-1 rounded hover:bg-rose-500/20 text-gray-400 hover:text-rose-400"
                        title="Descartar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-400">Pregunta del cliente:</span>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      "{item.question}"
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400">Respuesta alternativa que dio el bot:</span>
                    <p className="text-xs text-gray-300 italic bg-black/30 p-2.5 rounded-xl border border-white/5 mt-0.5">
                      {item.bot_alternative_response}
                    </p>
                  </div>

                  {item.status === 'respondida' && item.admin_answer && (
                    <div>
                      <span className="text-[10px] text-[#A9F8B5] font-semibold">Respuesta oficial del Administrador:</span>
                      <p className="text-xs text-gray-200 bg-[#A9F8B5]/10 p-2.5 rounded-xl border border-[#A9F8B5]/30 mt-0.5">
                        {item.admin_answer}
                      </p>
                    </div>
                  )}

                  {item.status === 'pendiente' && (
                    <div className="pt-2 border-t border-white/10">
                      {answeringId === item.id ? (
                        <div className="space-y-2.5 bg-black/40 p-3.5 rounded-xl border border-white/10">
                          <label className="text-xs font-semibold text-white block">
                            Escribe la respuesta oficial para esta pregunta:
                          </label>
                          <textarea
                            value={adminAnswerText}
                            onChange={e => setAdminAnswerText(e.target.value)}
                            placeholder="Escribe la respuesta detallada. El bot usará esta respuesta en el RAG..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#A9F8B5]"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={adminCategory}
                              onChange={e => setAdminCategory(e.target.value)}
                              placeholder="Categoría (ej: Precios, Integraciones)"
                              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white"
                            />
                            <button
                              onClick={() => handleAnswerSubmit(item)}
                              disabled={!adminAnswerText.trim() || isSubmittingAnswer}
                              className="btn-primary-gradient px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Send className="w-3 h-3" />
                              <span>Guardar y Publicar en RAG</span>
                            </button>
                            <button
                              onClick={() => setAnsweringId(null)}
                              className="px-2.5 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAnsweringId(item.id);
                            setAdminAnswerText('');
                          }}
                          className="text-xs text-[#A9F8B5] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Responder y Enseñar al Bot</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400">
              No hay preguntas pendientes. El bot ha resuelto todas las consultas con el conocimiento actual.
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 4: BASE DE CONOCIMIENTO & FAQS RAG */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Preguntas Frecuentes activas en la base RAG ({faqs.length})
            </span>
            <button
              onClick={() => setShowNewFaq(!showNewFaq)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A9F8B5] border border-[#A9F8B5]/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nueva FAQ</span>
            </button>
          </div>

          {showNewFaq && (
            <form onSubmit={handleCreateFaq} className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3">
              <h5 className="font-semibold text-white text-xs">Agregar nueva Pregunta al RAG:</h5>
              <input
                type="text"
                placeholder="Pregunta frecuente (ej: ¿Cómo integro mi CRM?)"
                value={newFaqQ}
                onChange={e => setNewFaqQ(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-xs text-white"
                required
              />
              <textarea
                placeholder="Respuesta detallada para los clientes y el bot..."
                value={newFaqA}
                onChange={e => setNewFaqA(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-xs text-white"
                required
              />
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Categoría (ej: General, Soporte)"
                  value={newFaqCat}
                  onChange={e => setNewFaqCat(e.target.value)}
                  className="bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="btn-primary-gradient px-3 py-1.5 text-xs font-bold cursor-pointer"
                  >
                    Guardar FAQ
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewFaq(false)}
                    className="px-2.5 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-2.5">
            {faqs.map(faq => (
              <div key={faq.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/10 text-gray-300">
                      {faq.category}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Consultada {faq.times_used || 0} veces
                    </span>
                  </div>
                  <h6 className="font-semibold text-white text-xs">{faq.question}</h6>
                  <p className="text-gray-300 text-xs leading-relaxed">{faq.answer}</p>
                </div>

                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                  title="Eliminar FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
