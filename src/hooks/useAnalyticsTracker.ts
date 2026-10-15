import { useEffect } from 'react';
import { api } from '../services/api';

function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem('geosoft_vid');
    if (!vid) {
      vid = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('geosoft_vid', vid);
    }
    return vid;
  } catch {
    return 'v_anonymous';
  }
}

function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem('geosoft_sid');
    if (!sid) {
      sid = `s_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('geosoft_sid', sid);
    }
    return sid;
  } catch {
    return 's_anonymous';
  }
}

export function useAnalyticsTracker() {
  useEffect(() => {
    const visitor_id = getOrCreateVisitorId();
    const session_id = getOrCreateSessionId();

    // 1. Track initial Page View (deferred to idle so it never competes with initial paint)
    const trackPageView = () => {
      api.trackEvent({
        event_type: 'page_view',
        visitor_id,
        session_id,
        page_path: window.location.pathname,
        referrer: document.referrer
      });
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(trackPageView);
    } else {
      setTimeout(trackPageView, 2500);
    }

    // 2. Global Non-Intrusive Click & Heatmap Coordinate Listener
    const handleGlobalClick = (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Check if the click is on an interactive element (button, link, input, summary, or data-track)
        const clickable = target.closest('button, a, input, select, [data-track], .card-accent') as HTMLElement | null;
        if (!clickable) return;

        // Determine readable name for the target
        let target_name = clickable.getAttribute('data-track') ||
                          clickable.getAttribute('aria-label') ||
                          clickable.innerText?.trim().slice(0, 40) ||
                          clickable.tagName.toLowerCase();

        // If it's a WhatsApp link
        let event_type: 'click' | 'whatsapp_click' = 'click';
        if (clickable.tagName === 'A' && (clickable as HTMLAnchorElement).href?.includes('wa.me')) {
          event_type = 'whatsapp_click';
          target_name = `WhatsApp: ${target_name}`;
        }

        // Calculate click coordinates in percentage of document
        const scrollWidth = Math.max(document.body.scrollWidth, window.innerWidth);
        const scrollHeight = Math.max(document.body.scrollHeight, window.innerHeight);

        const x_pct = Math.round((e.pageX / scrollWidth) * 1000) / 10;
        const y_pct = Math.round((e.pageY / scrollHeight) * 1000) / 10;

        api.trackEvent({
          event_type,
          target_name,
          x_pct,
          y_pct,
          visitor_id,
          session_id,
          page_path: window.location.pathname
        });
      } catch (err) {
        console.error('Track error:', err);
      }
    };

    window.addEventListener('click', handleGlobalClick, { passive: true });
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const trackCustom = (event_type: 'quote_calc' | 'booking_open' | 'whatsapp_click', target_name?: string) => {
    const visitor_id = getOrCreateVisitorId();
    const session_id = getOrCreateSessionId();
    api.trackEvent({
      event_type,
      target_name,
      visitor_id,
      session_id,
      page_path: window.location.pathname
    });
  };

  return { trackCustom };
}
