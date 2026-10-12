interface Env {
  DB: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Total conversaciones iniciadas
    const convRow = await context.env.DB.prepare(
      "SELECT COUNT(*) as total_convs, COALESCE(SUM(questions_count), 0) as total_questions, COALESCE(SUM(appointment_closed), 0) as total_closed FROM bot_conversations"
    ).first();

    // 2. Total de mensajes registrados
    const msgRow = await context.env.DB.prepare(
      "SELECT COUNT(*) as total_msgs, SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_msgs, SUM(CASE WHEN role = 'assistant' THEN 1 ELSE 0 END) as bot_msgs FROM bot_messages"
    ).first();

    // 3. Objeciones resueltas y totales
    const objStats = await context.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_objections,
        SUM(CASE WHEN status = 'resuelta' THEN 1 ELSE 0 END) as resolved_objections
      FROM bot_objections_log
    `).first();

    // 4. Desglose de objeciones por tipo
    const { results: objTypes } = await context.env.DB.prepare(`
      SELECT objection_type, COUNT(*) as count
      FROM bot_objections_log
      GROUP BY objection_type
      ORDER BY count DESC
    `).all();

    // 5. Historial reciente de objeciones (detallado)
    const { results: recentObjections } = await context.env.DB.prepare(`
      SELECT id, conversation_id, objection_type, objection_text, solution_provided, status, created_at
      FROM bot_objections_log
      ORDER BY created_at DESC
      LIMIT 25
    `).all();

    // 6. Citas cerradas por el Bot
    const { results: botAppointments } = await context.env.DB.prepare(`
      SELECT id, fullName, email, whatsapp, service, date, time, notes, status, createdAt
      FROM appointments
      WHERE source = 'bot'
      ORDER BY createdAt DESC
      LIMIT 20
    `).all();

    // 7. Preguntas sin respuesta / pendientes
    const unansRow = await context.env.DB.prepare(`
      SELECT COUNT(*) as pending_unanswered
      FROM bot_unanswered_questions
      WHERE status = 'pendiente'
    `).first();

    // 8. Total FAQs activas
    const faqsRow = await context.env.DB.prepare(`
      SELECT COUNT(*) as total_faqs FROM bot_faqs WHERE is_published = 1
    `).first();

    // 9. Métricas de Consumo de Google AI Studio y Control de Límites
    let selectedModel = 'gemini-3.5-flash';
    try {
      const cfgRow = await context.env.DB.prepare("SELECT value FROM bot_config WHERE key = 'selected_model'").first();
      if (cfgRow && cfgRow.value) selectedModel = cfgRow.value;
    } catch (_) {}

    let aiUsageStats: any = {
      requestsToday: 0,
      requestsTotal: 0,
      promptTokensTotal: 0,
      candidatesTokensTotal: 0,
      totalTokens: 0,
      tokensToday: 0,
      avgLatencyMs: 480
    };

    try {
      const totalUsageRow = await context.env.DB.prepare(`
        SELECT 
          COUNT(*) as requests_total,
          COALESCE(SUM(total_tokens), 0) as total_tokens,
          COALESCE(SUM(prompt_tokens), 0) as prompt_tokens_total,
          COALESCE(SUM(candidates_tokens), 0) as candidates_tokens_total,
          COALESCE(AVG(latency_ms), 480) as avg_latency
        FROM bot_api_logs
      `).first();

      const todayUsageRow = await context.env.DB.prepare(`
        SELECT 
          COUNT(*) as requests_today,
          COALESCE(SUM(total_tokens), 0) as tokens_today
        FROM bot_api_logs
        WHERE DATE(created_at) = DATE('now')
      `).first();

      aiUsageStats.requestsTotal = totalUsageRow?.requests_total || 0;
      aiUsageStats.totalTokens = totalUsageRow?.total_tokens || 0;
      aiUsageStats.promptTokensTotal = totalUsageRow?.prompt_tokens_total || 0;
      aiUsageStats.candidatesTokensTotal = totalUsageRow?.candidates_tokens_total || 0;
      aiUsageStats.avgLatencyMs = Math.round(totalUsageRow?.avg_latency || 480);
      aiUsageStats.requestsToday = todayUsageRow?.requests_today || 0;
      aiUsageStats.tokensToday = todayUsageRow?.tokens_today || 0;
    } catch (_) {}

    const isProModel = selectedModel.includes('pro');
    const dailyLimitRpd = isProModel ? 50 : 1500;
    const rpmLimit = isProModel ? 2 : (selectedModel.includes('lite') ? 30 : 15);
    const quotaPercent = Math.min(100, Math.round((aiUsageStats.requestsToday / dailyLimitRpd) * 100));
    
    let quotaStatus: 'safe' | 'warning' | 'danger' = 'safe';
    if (quotaPercent >= 85) {
      quotaStatus = 'danger';
    } else if (quotaPercent >= 60) {
      quotaStatus = 'warning';
    }

    const estimatedCommercialCostUsd = Number(
      ((aiUsageStats.promptTokensTotal * 0.00000010) + (aiUsageStats.candidatesTokensTotal * 0.00000040)).toFixed(4)
    );

    const aiUsage = {
      selectedModel,
      requestsToday: aiUsageStats.requestsToday,
      requestsTotal: aiUsageStats.requestsTotal,
      dailyLimitRpd,
      rpmLimit,
      promptTokensTotal: aiUsageStats.promptTokensTotal,
      candidatesTokensTotal: aiUsageStats.candidatesTokensTotal,
      totalTokens: aiUsageStats.totalTokens,
      tokensToday: aiUsageStats.tokensToday,
      avgLatencyMs: aiUsageStats.avgLatencyMs,
      freeTierCostUsd: 0.0,
      estimatedCommercialCostUsd,
      quotaPercent,
      quotaStatus
    };

    return new Response(JSON.stringify({
      totalConversations: convRow?.total_convs || 0,
      totalQuestions: Math.max(convRow?.total_questions || 0, msgRow?.user_msgs || 0),
      totalAnswers: msgRow?.bot_msgs || 0,
      totalObjections: objStats?.total_objections || 0,
      resolvedObjections: objStats?.resolved_objections || 0,
      appointmentsClosed: (botAppointments || []).length,
      pendingUnanswered: unansRow?.pending_unanswered || 0,
      totalFaqs: faqsRow?.total_faqs || 0,
      objectionsByType: objTypes || [],
      recentObjections: recentObjections || [],
      botAppointments: botAppointments || [],
      aiUsage
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error fetching bot analytics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
