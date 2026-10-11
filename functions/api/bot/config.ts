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

    const row = await context.env.DB.prepare(
      "SELECT value FROM bot_config WHERE key = 'length_mode'"
    ).first();

    return new Response(JSON.stringify({
      lengthMode: row?.value || 'equilibrado'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error fetching config' }), {
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
    const { lengthMode } = body;

    if (!lengthMode || !['corto', 'equilibrado', 'detallado'].includes(lengthMode)) {
      return new Response(JSON.stringify({ error: 'Modo de longitud inválido. Debe ser: corto, equilibrado o detallado' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await context.env.DB.prepare(`
      INSERT INTO bot_config (key, value, updated_at)
      VALUES ('length_mode', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).bind(lengthMode).run();

    return new Response(JSON.stringify({
      success: true,
      lengthMode
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error saving config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
