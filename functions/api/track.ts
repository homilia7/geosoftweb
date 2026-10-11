interface Env {
  DB: any;
}

function parseDevice(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase();
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
    return 'tablet';
  }
  if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function parseBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('edg/')) return 'Edge';
  if (ua.includes('chrome/')) return 'Chrome';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';
  if (ua.includes('firefox/')) return 'Firefox';
  if (ua.includes('opera') || ua.includes('opr/')) return 'Opera';
  return 'Otro';
}

function parseOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('win')) return 'Windows';
  if (ua.includes('mac') && !ua.includes('iphone') && !ua.includes('ipad')) return 'macOS';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
  if (ua.includes('linux')) return 'Linux';
  return 'Otro';
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const req = context.request;
    const body: any = await req.json().catch(() => ({}));
    const userAgent = req.headers.get('user-agent') || '';
    
    // Cloudflare Edge Geolocation Headers
    const country = req.headers.get('cf-ipcountry') || 'CR';
    const city = req.headers.get('cf-ipcity') || 'San José';
    const region = req.headers.get('cf-region') || 'San José';

    const device = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);
    const os = parseOS(userAgent);

    const id = `ev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const sessionId = body.session_id || 'anonymous-session';
    const visitorId = body.visitor_id || 'anonymous-visitor';
    const eventType = body.event_type || 'page_view';
    const targetName = body.target_name || null;
    const xPct = typeof body.x_pct === 'number' ? body.x_pct : null;
    const yPct = typeof body.y_pct === 'number' ? body.y_pct : null;
    const pagePath = body.page_path || '/';
    const referrer = body.referrer || req.headers.get('referer') || '';

    await context.env.DB.prepare(
      `INSERT INTO analytics_events 
       (id, session_id, visitor_id, event_type, target_name, x_pct, y_pct, page_path, country, city, region, device, browser, os, referrer, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      id,
      sessionId,
      visitorId,
      eventType,
      targetName,
      xPct,
      yPct,
      pagePath,
      country,
      city,
      region,
      device,
      browser,
      os,
      referrer
    ).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Tracking error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
