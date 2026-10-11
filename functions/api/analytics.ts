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

    const db = context.env.DB;

    // 1. Overall Totals
    const totalViewsRes = await db.prepare(
      "SELECT COUNT(*) as total_views, COUNT(DISTINCT visitor_id) as unique_visitors FROM analytics_events WHERE event_type = 'page_view'"
    ).first();

    const todayViewsRes = await db.prepare(
      "SELECT COUNT(*) as today_views, COUNT(DISTINCT visitor_id) as today_unique FROM analytics_events WHERE event_type = 'page_view' AND date(created_at) = date('now')"
    ).first();

    const totalClicksRes = await db.prepare(
      "SELECT COUNT(*) as total_clicks FROM analytics_events WHERE event_type = 'click'"
    ).first();

    const totalBookingsRes = await db.prepare(
      "SELECT COUNT(*) as total_bookings FROM analytics_events WHERE event_type = 'booking_submitted'"
    ).first();

    const totalQuotesRes = await db.prepare(
      "SELECT COUNT(*) as total_quotes FROM analytics_events WHERE event_type = 'quote_calc'"
    ).first();

    const totalWhatsAppRes = await db.prepare(
      "SELECT COUNT(*) as total_whatsapp FROM analytics_events WHERE event_type = 'whatsapp_click'"
    ).first();

    // 2. Hourly Distribution (00 to 23) for traffic peaks
    const hourlyRes = await db.prepare(
      `SELECT strftime('%H', created_at) as hour, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'page_view'
       GROUP BY hour 
       ORDER BY hour ASC`
    ).all();

    // Fill all 24 hours (00 to 23)
    const hourlyMap: Record<string, number> = {};
    for (let i = 0; i < 24; i++) {
      const hStr = i.toString().padStart(2, '0');
      hourlyMap[hStr] = 0;
    }
    let peakHour = '12:00';
    let peakHourCount = 0;

    if (hourlyRes.results) {
      for (const row of hourlyRes.results as any[]) {
        if (row.hour) {
          hourlyMap[row.hour] = Number(row.count) || 0;
          if (Number(row.count) > peakHourCount) {
            peakHourCount = Number(row.count);
            peakHour = `${row.hour}:00`;
          }
        }
      }
    }

    const hourlyStats = Object.keys(hourlyMap).map(hour => ({
      hour: `${hour}:00`,
      visits: hourlyMap[hour]
    }));

    // 3. Daily Trend (Last 7 days)
    const dailyRes = await db.prepare(
      `SELECT date(created_at) as day, COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors 
       FROM analytics_events 
       WHERE event_type = 'page_view' AND created_at >= datetime('now', '-7 days')
       GROUP BY day 
       ORDER BY day ASC`
    ).all();

    // 4. Geolocation Breakdown (Top Countries)
    const countriesRes = await db.prepare(
      `SELECT country, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'page_view' AND country IS NOT NULL 
       GROUP BY country 
       ORDER BY count DESC 
       LIMIT 8`
    ).all();

    // Top Cities
    const citiesRes = await db.prepare(
      `SELECT city, country, COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type = 'page_view' AND city IS NOT NULL 
       GROUP BY city, country 
       ORDER BY count DESC 
       LIMIT 8`
    ).all();

    // 5. Device Distribution
    const deviceRes = await db.prepare(
      `SELECT device, COUNT(*) as count 
       FROM analytics_events 
       WHERE device IS NOT NULL 
       GROUP BY device 
       ORDER BY count DESC`
    ).all();

    // 6. Top Clicked Elements / Hot Zones
    const hotElementsRes = await db.prepare(
      `SELECT target_name, COUNT(*) as clicks 
       FROM analytics_events 
       WHERE event_type = 'click' AND target_name IS NOT NULL 
       GROUP BY target_name 
       ORDER BY clicks DESC 
       LIMIT 10`
    ).all();

    // 7. Click Coordinates for Heatmap (sample up to 250 points)
    const heatmapPointsRes = await db.prepare(
      `SELECT target_name, x_pct, y_pct, COUNT(*) as weight 
       FROM analytics_events 
       WHERE event_type = 'click' AND x_pct IS NOT NULL AND y_pct IS NOT NULL 
       GROUP BY target_name, ROUND(x_pct, 1), ROUND(y_pct, 1) 
       LIMIT 250`
    ).all();

    return new Response(JSON.stringify({
      totals: {
        totalViews: totalViewsRes?.total_views || 0,
        uniqueVisitors: totalViewsRes?.unique_visitors || 0,
        todayViews: todayViewsRes?.today_views || 0,
        todayUnique: todayViewsRes?.today_unique || 0,
        totalClicks: totalClicksRes?.total_clicks || 0,
        totalBookings: totalBookingsRes?.total_bookings || 0,
        totalQuotes: totalQuotesRes?.total_quotes || 0,
        totalWhatsApp: totalWhatsAppRes?.total_whatsapp || 0,
        peakHour,
        peakHourCount
      },
      hourly: hourlyStats,
      daily: dailyRes.results || [],
      countries: countriesRes.results || [],
      cities: citiesRes.results || [],
      devices: deviceRes.results || [],
      hotElements: hotElementsRes.results || [],
      heatmapPoints: heatmapPointsRes.results || []
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error compiling analytics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
