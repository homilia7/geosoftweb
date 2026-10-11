export type PlatformType = 'static' | 'dynamic' | 'ai' | 'saas';

export interface PlatformOption {
  id: PlatformType;
  title: string;
  badge: string;
  description: string;
  basePrice: number;
  features: string[];
}

export interface AddonService {
  id: string;
  title: string;
  description: string;
  price: number;
  period: 'pago único' | 'mensual' | 'anual';
  recommended?: boolean;
}

export interface QuoteState {
  platform: PlatformType;
  selectedAddons: string[];
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Appointment {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: AppointmentStatus;
  source?: 'web' | 'bot';
  createdAt: string;
}

export interface PricingConfig {
  platforms: PlatformOption[];
  addons: AddonService[];
  discountPercent: number; // e.g. 15 for 15% off
  discountBanner: string; // e.g. "¡Promoción de Lanzamiento!"
  discountActive: boolean;
}

export interface BotObjectionLog {
  id: number;
  conversation_id: string;
  objection_type: string;
  objection_text: string;
  solution_provided: string;
  status: string;
  created_at: string;
}

export interface BotUnansweredQuestion {
  id: number;
  conversation_id: string;
  question: string;
  bot_alternative_response: string;
  admin_answer?: string;
  status: 'pendiente' | 'respondida';
  created_at: string;
  answered_at?: string;
}

export interface BotFaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_published: number;
  times_used: number;
  created_at: string;
}

export interface BotAnalyticsData {
  totalConversations: number;
  totalQuestions: number;
  totalAnswers: number;
  totalObjections: number;
  resolvedObjections: number;
  appointmentsClosed: number;
  pendingUnanswered: number;
  totalFaqs: number;
  objectionsByType: Array<{ objection_type: string; count: number }>;
  recentObjections: BotObjectionLog[];
  botAppointments: Appointment[];
}

