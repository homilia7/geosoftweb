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

    const { results } = await context.env.DB.prepare(`
      SELECT id, conversation_id, question, bot_alternative_response, admin_answer, status, created_at, answered_at
      FROM bot_unanswered_questions
      ORDER BY CASE WHEN status = 'pendiente' THEN 0 ELSE 1 END, created_at DESC
      LIMIT 50
    `).all();

    return new Response(JSON.stringify(results || []), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error fetching unanswered questions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body: any = await context.request.json();
    const { id, adminAnswer, category = 'General' } = body;

    if (!id || !adminAnswer || !adminAnswer.trim()) {
      return new Response(JSON.stringify({ error: 'ID y respuesta oficial son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Obtener la pregunta original
    const questionRow = await context.env.DB.prepare(
      "SELECT question FROM bot_unanswered_questions WHERE id = ?"
    ).bind(id).first();

    if (!questionRow) {
      return new Response(JSON.stringify({ error: 'Pregunta no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const questionText = questionRow.question;

    // 2. Marcar como respondida en bot_unanswered_questions
    await context.env.DB.prepare(`
      UPDATE bot_unanswered_questions
      SET admin_answer = ?, status = 'respondida', answered_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(adminAnswer.trim(), id).run();

    // 3. Insertar automáticamente en bot_faqs para nutrir el RAG en vivo
    await context.env.DB.prepare(`
      INSERT INTO bot_faqs (question, answer, category, is_published, times_used)
      VALUES (?, ?, ?, 1, 1)
    `).bind(questionText, adminAnswer.trim(), category.trim()).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Pregunta respondida exitosamente e incorporada al RAG y a las Preguntas Frecuentes'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error answering question' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await context.env.DB.prepare(
      "DELETE FROM bot_unanswered_questions WHERE id = ?"
    ).bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error deleting question' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
