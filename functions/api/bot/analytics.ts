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
      botAppointments: botAppointments || []
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
