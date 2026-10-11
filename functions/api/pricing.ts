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

    const { results } = await context.env.DB.prepare(
      "SELECT data FROM pricing WHERE id = 'config' LIMIT 1"
    ).all();

    if (results && results.length > 0 && results[0].data) {
      return new Response(results[0].data as string, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
    }

    return new Response(JSON.stringify({ found: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error fetching pricing' }), {
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

    const body = await context.request.json();
    const dataStr = JSON.stringify(body);

    await context.env.DB.prepare(
      "INSERT OR REPLACE INTO pricing (id, data, updated_at) VALUES ('config', ?, datetime('now'))"
    ).bind(dataStr).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error updating pricing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
