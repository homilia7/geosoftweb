interface Env {
  DB: any;
}

const DEFAULT_WELCOME_MESSAGE = '¡Hola! 👋 Bienvenido a GeoSoft. Soy tu Asesor de Soluciones Digitales y Software. Cuéntame, ¿qué proyecto o reto tienes en mente para tu negocio?';

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { results } = await context.env.DB.prepare(
      "SELECT key, value FROM bot_config WHERE key IN ('length_mode', 'welcome_message', 'selected_model')"
    ).all();

    let lengthMode = 'equilibrado';
    let welcomeMessage = DEFAULT_WELCOME_MESSAGE;
    let selectedModel = 'gemini-2.0-flash';

    (results || []).forEach((row: any) => {
      if (row.key === 'length_mode') lengthMode = row.value || 'equilibrado';
      if (row.key === 'welcome_message') welcomeMessage = row.value || DEFAULT_WELCOME_MESSAGE;
      if (row.key === 'selected_model') selectedModel = row.value || 'gemini-2.0-flash';
    });

    return new Response(JSON.stringify({
      lengthMode,
      welcomeMessage,
      selectedModel
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
    const { lengthMode, welcomeMessage, selectedModel } = body;

    if (lengthMode && !['corto', 'equilibrado', 'detallado'].includes(lengthMode)) {
      return new Response(JSON.stringify({ error: 'Modo de longitud inválido. Debe ser: corto, equilibrado o detallado' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (lengthMode) {
      await context.env.DB.prepare(`
        INSERT INTO bot_config (key, value, updated_at)
        VALUES ('length_mode', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).bind(lengthMode).run();
    }

    if (welcomeMessage && typeof welcomeMessage === 'string') {
      await context.env.DB.prepare(`
        INSERT INTO bot_config (key, value, updated_at)
        VALUES ('welcome_message', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).bind(welcomeMessage.trim()).run();
    }

    if (selectedModel && typeof selectedModel === 'string') {
      await context.env.DB.prepare(`
        INSERT INTO bot_config (key, value, updated_at)
        VALUES ('selected_model', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).bind(selectedModel.trim()).run();
    }

    return new Response(JSON.stringify({
      success: true,
      lengthMode,
      welcomeMessage,
      selectedModel
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
