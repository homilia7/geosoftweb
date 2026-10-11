interface Env {
  DB: any;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(context.request.url);
    const showAll = url.searchParams.get('all') === '1';

    const sql = showAll
      ? "SELECT * FROM bot_faqs ORDER BY id DESC"
      : "SELECT * FROM bot_faqs WHERE is_published = 1 ORDER BY id ASC";

    const { results } = await context.env.DB.prepare(sql).all();

    return new Response(JSON.stringify(results || []), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error fetching faqs' }), {
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
    const { id, question, answer, category = 'General', is_published = 1 } = body;

    if (!question || !answer) {
      return new Response(JSON.stringify({ error: 'Pregunta y respuesta son requeridas' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (id) {
      // Update existing FAQ
      await context.env.DB.prepare(`
        UPDATE bot_faqs
        SET question = ?, answer = ?, category = ?, is_published = ?
        WHERE id = ?
      `).bind(question, answer, category, is_published ? 1 : 0, id).run();
    } else {
      // Insert new FAQ
      await context.env.DB.prepare(`
        INSERT INTO bot_faqs (question, answer, category, is_published)
        VALUES (?, ?, ?, ?)
      `).bind(question, answer, category, is_published ? 1 : 0).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error saving FAQ' }), {
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

    await context.env.DB.prepare("DELETE FROM bot_faqs WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error deleting FAQ' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
