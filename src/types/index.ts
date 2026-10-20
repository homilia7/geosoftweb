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

export interface GoogleAiUsage {
  selectedModel: string;
  requestsToday: number;
  requestsTotal: number;
  dailyLimitRpd: number;
  rpmLimit: number;
  promptTokensTotal: number;
  candidatesTokensTotal: number;
  totalTokens: number;
  tokensToday: number;
  avgLatencyMs: number;
  freeTierCostUsd: number;
  estimatedCommercialCostUsd: number;
  quotaPercent: number;
  quotaStatus: 'safe' | 'warning' | 'danger';
}

export interface GoogleModelCatalogItem {
  id: string;
  name: string;
  version: string;
  badge: string;
  badgeColor: string;
  rpdLimit: number;
  rpmLimit: number;
  tpmLimit: string;
  pricing: string;
  latencyText: string;
  contextWindow: string;
  description: string;
  strengths: string[];
  bestFor: string[];
  recommended?: boolean;
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
  aiUsage?: GoogleAiUsage;
}

export type BotLengthMode = 'corto' | 'equilibrado' | 'detallado';

export interface BotConfigData {
  lengthMode: BotLengthMode;
  welcomeMessage: string;
  selectedModel?: string;
}

export type ProposalStatus = 'nueva' | 'en_proceso' | 'completada' | 'archivada';

export interface ProposalImage {
  name: string;
  type?: 'logo' | 'producto' | 'referencia' | 'otro';
  dataUrl: string;
}

export interface BusinessProposal {
  id: string;
  // Identidad del negocio
  businessName: string;
  businessNamesAdditional?: string;
  tagline?: string;
  industry: string;
  contactName: string;
  whatsapp: string;
  email: string;
  location?: string;

  // Propósito del sitio web
  mainGoal: string;
  targetAudience: string;
  servicesOrProducts: string;
  referenceWebsites?: string;
  budgetOrTimeline?: string;

  // Agente de IA
  aiRole: string;
  aiTone: string;
  aiCommonFaqs: string;
  aiDestination: string;

  // Identidad visual y multimedia
  brandColors?: string;
  socialLinks?: string;
  images: ProposalImage[];

  notes?: string;
  status: ProposalStatus;
  source?: 'web' | 'bot';
  createdAt: string;
  updatedAt?: string;
}



