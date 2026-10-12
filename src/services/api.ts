import { Appointment, AppointmentStatus, PricingConfig } from '../types';

export interface AnalyticsData {
  totals: {
    totalViews: number;
    uniqueVisitors: number;
    todayViews: number;
    todayUnique: number;
    totalClicks: number;
    totalBookings: number;
    totalQuotes: number;
    totalWhatsApp: number;
    peakHour: string;
    peakHourCount: number;
  };
  hourly: { hour: string; visits: number }[];
  daily: { day: string; views: number; visitors: number }[];
  countries: { country: string; count: number }[];
  cities: { city: string; country: string; count: number }[];
  devices: { device: string; count: number }[];
  hotElements: { target_name: string; clicks: number }[];
  heatmapPoints: { target_name: string; x_pct: number; y_pct: number; weight: number }[];
}

export const api = {
  // Pricing
  async getPricing(): Promise<PricingConfig | null> {
    try {
      const res = await fetch('/api/pricing');
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.platforms) return data as PricingConfig;
      return null;
    } catch {
      return null;
    }
  },

  async savePricing(pricing: PricingConfig): Promise<boolean> {
    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Appointments
  async getAppointments(): Promise<Appointment[] | null> {
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data)) return data as Appointment[];
      return null;
    } catch {
      return null;
    }
  },

  async checkAvailability(date: string, time: string): Promise<{ available: boolean; suggestedTime?: string }> {
    try {
      const res = await fetch(`/api/appointments?checkDate=${encodeURIComponent(date)}&checkTime=${encodeURIComponent(time)}`);
      if (!res.ok) return { available: true };
      const data = await res.json();
      return data;
    } catch {
      return { available: true };
    }
  },

  async createAppointment(apt: Omit<Appointment, 'id' | 'createdAt' | 'status'> & { id?: string }): Promise<Appointment | null> {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apt)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        ...apt,
        id: data.id,
        createdAt: data.createdAt,
        status: data.status || 'pendiente'
      } as Appointment;
    } catch {
      return null;
    }
  },

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<boolean> {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteAppointment(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/appointments?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Analytics Tracker
  async trackEvent(eventData: {
    event_type: 'page_view' | 'click' | 'section_view' | 'quote_calc' | 'booking_open' | 'whatsapp_click';
    target_name?: string;
    x_pct?: number;
    y_pct?: number;
    session_id?: string;
    visitor_id?: string;
    page_path?: string;
    referrer?: string;
  }): Promise<boolean> {
    try {
      // Use sendBeacon if available for non-blocking telemetry
      const payload = JSON.stringify(eventData);
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const sent = navigator.sendBeacon('/api/track', payload);
        if (sent) return true;
      }

      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Fetch Full Analytics
  async getAnalytics(): Promise<AnalyticsData | null> {
    try {
      const res = await fetch('/api/analytics');
      if (!res.ok) return null;
      return (await res.json()) as AnalyticsData;
    } catch {
      return null;
    }
  },

  // Bot AI endpoints
  async sendBotMessage(params: {
    conversationId: string;
    visitorId?: string;
    message: string;
    userName?: string;
    userContact?: string;
  }): Promise<{
    success: boolean;
    reply: string;
    intent?: string;
    objection?: any;
    isUnanswered?: boolean;
    appointmentBooked?: boolean;
    conversationId?: string;
  }> {
    try {
      const res = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) {
        return {
          success: false,
          reply: 'Lo siento, no pude procesar tu mensaje. ¡Nuestro equipo humano te atiende por WhatsApp!'
        };
      }
      return await res.json();
    } catch {
      return {
        success: false,
        reply: 'Problema de conexión temporal. Escríbenos directamente a WhatsApp.'
      };
    }
  },

  async getBotAnalytics(): Promise<import('../types').BotAnalyticsData | null> {
    try {
      const res = await fetch('/api/bot/analytics');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getBotUnanswered(): Promise<import('../types').BotUnansweredQuestion[]> {
    try {
      const res = await fetch('/api/bot/unanswered');
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async answerBotQuestion(id: number, adminAnswer: string, category: string = 'General'): Promise<boolean> {
    try {
      const res = await fetch('/api/bot/unanswered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminAnswer, category })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteBotUnanswered(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/bot/unanswered?id=${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getBotFaqs(all: boolean = false): Promise<import('../types').BotFaqItem[]> {
    try {
      const res = await fetch(`/api/bot/faqs${all ? '?all=1' : ''}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async saveBotFaq(faq: Partial<import('../types').BotFaqItem>): Promise<boolean> {
    try {
      const res = await fetch('/api/bot/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteBotFaq(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/bot/faqs?id=${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getBotConfig(): Promise<import('../types').BotConfigData | null> {
    try {
      const res = await fetch('/api/bot/config');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async saveBotConfig(config: { lengthMode?: import('../types').BotLengthMode; welcomeMessage?: string }): Promise<boolean> {
    try {
      const res = await fetch('/api/bot/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};

