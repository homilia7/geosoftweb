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
    const checkDate = url.searchParams.get('checkDate');
    const checkTime = url.searchParams.get('checkTime');

    if (checkDate && checkTime) {
      const existing = await context.env.DB.prepare(
        "SELECT id, time FROM appointments WHERE date = ? AND status != 'cancelada'"
      ).bind(checkDate).all();

      const bookedTimes: string[] = (existing?.results || []).map((r: any) => (r.time || '').trim().toLowerCase());
      const isTaken = bookedTimes.includes(checkTime.trim().toLowerCase());

      if (isTaken) {
        const standardSlots = ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM', '06:00 PM'];
        const suggested = standardSlots.find(s => !bookedTimes.includes(s.toLowerCase())) || '03:30 PM';
        return new Response(JSON.stringify({ available: false, suggestedTime: suggested }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ available: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { results } = await context.env.DB.prepare(
      "SELECT * FROM appointments ORDER BY createdAt DESC"
    ).all();

    return new Response(JSON.stringify(results || []), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error fetching appointments' }), {
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
    const id = body.id || `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = body.createdAt || new Date().toISOString();
    const status = body.status || 'pendiente';
    const source = body.source || 'web';

    await context.env.DB.prepare(
      `INSERT INTO appointments (id, fullName, email, whatsapp, service, date, time, notes, status, source, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      body.fullName || '',
      body.email || '',
      body.whatsapp || '',
      body.service || '',
      body.date || '',
      body.time || '',
      body.notes || '',
      status,
      source,
      createdAt
    ).run();

    return new Response(JSON.stringify({ success: true, id, createdAt, status }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error creating appointment' }), {
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

    const body: any = await context.request.json();
    const { id, status } = body;

    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'Missing id or status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await context.env.DB.prepare(
      "UPDATE appointments SET status = ? WHERE id = ?"
    ).bind(status, id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error updating appointment' }), {
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
      return new Response(JSON.stringify({ error: 'Missing id query parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await context.env.DB.prepare(
      "DELETE FROM appointments WHERE id = ?"
    ).bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error deleting appointment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
