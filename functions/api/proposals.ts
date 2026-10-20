interface Env {
  DB: any;
}

const ensureTable = async (db: any) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      businessName TEXT,
      contactName TEXT,
      whatsapp TEXT,
      email TEXT,
      status TEXT,
      data TEXT,
      createdAt TEXT
    )
  `).run();
};

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await ensureTable(context.env.DB);

    const { results } = await context.env.DB.prepare(
      "SELECT * FROM proposals ORDER BY createdAt DESC"
    ).all();

    const proposals = (results || []).map((row: any) => {
      try {
        if (row.data) {
          const parsed = JSON.parse(row.data);
          return {
            ...parsed,
            id: row.id,
            businessName: row.businessName || parsed.businessName,
            contactName: row.contactName || parsed.contactName,
            whatsapp: row.whatsapp || parsed.whatsapp,
            email: row.email || parsed.email,
            status: row.status || parsed.status || 'nueva',
            createdAt: row.createdAt || parsed.createdAt
          };
        }
      } catch {}
      return row;
    });

    return new Response(JSON.stringify(proposals), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error fetching proposals' }), {
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

    await ensureTable(context.env.DB);

    const body: any = await context.request.json();
    const id = body.id || `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = body.createdAt || new Date().toISOString();
    const status = body.status || 'nueva';
    const businessName = body.businessName || '';
    const contactName = body.contactName || '';
    const whatsapp = body.whatsapp || '';
    const email = body.email || '';

    const dataStr = JSON.stringify({
      ...body,
      id,
      createdAt,
      status
    });

    await context.env.DB.prepare(
      `INSERT OR REPLACE INTO proposals (id, businessName, contactName, whatsapp, email, status, data, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      businessName,
      contactName,
      whatsapp,
      email,
      status,
      dataStr,
      createdAt
    ).run();

    return new Response(JSON.stringify({ success: true, id, createdAt, status }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error creating proposal' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPatch = async (context: { request: Request; env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await ensureTable(context.env.DB);

    const body: any = await context.request.json();
    const { id, status } = body;

    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'Missing id or status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update status in proposals table and update JSON data column as well if it exists
    const existing = await context.env.DB.prepare(
      "SELECT data FROM proposals WHERE id = ?"
    ).bind(id).first();

    let updatedDataStr = null;
    if (existing && existing.data) {
      try {
        const parsed = JSON.parse(existing.data as string);
        parsed.status = status;
        parsed.updatedAt = new Date().toISOString();
        updatedDataStr = JSON.stringify(parsed);
      } catch {}
    }

    if (updatedDataStr) {
      await context.env.DB.prepare(
        "UPDATE proposals SET status = ?, data = ? WHERE id = ?"
      ).bind(status, updatedDataStr, id).run();
    } else {
      await context.env.DB.prepare(
        "UPDATE proposals SET status = ? WHERE id = ?"
      ).bind(status, id).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error updating proposal status' }), {
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

    await ensureTable(context.env.DB);

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id query parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await context.env.DB.prepare(
      "DELETE FROM proposals WHERE id = ?"
    ).bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error deleting proposal' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
