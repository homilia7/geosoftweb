import { useState, useEffect, useMemo } from 'react';
import { ProjectQuoteData, ProjectQuoteItem } from '../types/projectQuote';

const STORAGE_KEY = 'geosoft_admin_project_quote_v1';

const DEFAULT_QUOTE: ProjectQuoteData = {
  id: 'COT-' + new Date().getFullYear() + '-001',
  projectName: 'Plataforma Web E-Commerce & Agente IA 24/7',
  clientName: 'Cliente Corporativo',
  clientCompany: 'Empresa Demo S.A.',
  clientWhatsapp: '+506 ',
  clientEmail: '',
  date: new Date().toISOString().split('T')[0],
  validUntilDays: 15,
  currency: 'USD',
  currencySymbol: '$',
  notes: 'Incluye despliegue en la nube Cloudflare Pages, certificado SSL de por vida y capacitación remota.',
  items: [
    {
      id: 'item-1',
      name: 'Desarrollo Web Full-Stack & PWA React/Vite',
      description: 'Diseño bimodal exclusivo, responsive, carga en <0.5s y optimización SEO',
      quantity: 1,
      unitPrice: 650,
      category: 'desarrollo'
    },
    {
      id: 'item-2',
      name: 'Agente de Inteligencia Artificial Gemini 24/7',
      description: 'Entrenamiento RAG con catálogo propio, captura de leads y enlace a WhatsApp',
      quantity: 1,
      unitPrice: 350,
      category: 'ia'
    },
    {
      id: 'item-3',
      name: 'Integración de Pasarela de Pagos / SINPE Móvil',
      description: 'Flujo automático de confirmación de comprobantes y notificaciones inmediatas',
      quantity: 1,
      unitPrice: 200,
      category: 'integracion'
    }
  ],
  modeInitialPlusMonthly: {
    initialPayment: 1200,
    monthlyPayment: 65,
    minimumMonths: 12,
    badgeText: 'Opción Híbrida (Recomendada)',
    description: 'Menor cuota mensual. Cubre costos iniciales de desarrollo y licenciamiento.'
  },
  modeOnlyMonthly: {
    monthlyPayment: 165,
    minimumMonths: 12,
    badgeText: 'Opción Cero Desembolso',
    description: 'Sin pago inicial. El costo de desarrollo se amortiza 100% en la cuota mensual.'
  },
  preferredMode: 'both'
};

export const useProjectQuote = () => {
  const [quote, setQuote] = useState<ProjectQuoteData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_QUOTE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } catch {}
  }, [quote]);

  const itemsSubtotal = useMemo(() => {
    return quote.items.reduce((sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1), 0);
  }, [quote.items]);

  const updateField = <K extends keyof ProjectQuoteData>(key: K, value: ProjectQuoteData[K]) => {
    setQuote(prev => ({ ...prev, [key]: value }));
  };

  const addItem = (item?: Partial<ProjectQuoteItem>) => {
    const newItem: ProjectQuoteItem = {
      id: 'item-' + Date.now(),
      name: item?.name || 'Nuevo Servicio / Módulo',
      description: item?.description || 'Descripción detallada de los entregables y alcance',
      quantity: item?.quantity || 1,
      unitPrice: item?.unitPrice || 150,
      category: item?.category || 'desarrollo'
    };
    setQuote(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, updates: Partial<ProjectQuoteItem>) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(it => (it.id === id ? { ...it, ...updates } : it))
    }));
  };

  const removeItem = (id: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== id)
    }));
  };

  const updateInitialPlusMonthly = (updates: Partial<typeof quote.modeInitialPlusMonthly>) => {
    setQuote(prev => ({
      ...prev,
      modeInitialPlusMonthly: { ...prev.modeInitialPlusMonthly, ...updates }
    }));
  };

  const updateOnlyMonthly = (updates: Partial<typeof quote.modeOnlyMonthly>) => {
    setQuote(prev => ({
      ...prev,
      modeOnlyMonthly: { ...prev.modeOnlyMonthly, ...updates }
    }));
  };

  const syncInitialWithSubtotal = () => {
    updateInitialPlusMonthly({ initialPayment: itemsSubtotal });
  };

  const resetToTemplate = () => {
    setQuote({ ...DEFAULT_QUOTE, id: 'COT-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900) });
  };

  const generateWhatsAppMessage = () => {
    const sym = quote.currencySymbol;
    let msg = `*PROPUESTA COMERCIAL FORMAL — GEOSOFT*\n`;
    msg += `📄 *Proyecto:* ${quote.projectName}\n`;
    msg += `👤 *Cliente:* ${quote.clientName} (${quote.clientCompany || 'N/A'})\n`;
    msg += `📅 *Fecha:* ${quote.date} (Válida por ${quote.validUntilDays} días)\n\n`;
    msg += `*ALCANCE & MÓDULOS DEL PROYECTO:*\n`;
    quote.items.forEach((it, idx) => {
      msg += `${idx + 1}. *${it.name}* (x${it.quantity}) — ${sym}${it.unitPrice * it.quantity}\n   _${it.description}_\n`;
    });
    msg += `\n*MODALIDADES DE PAGO DISPONIBLES:*\n\n`;
    msg += `🔹 *MODALIDAD 1: Pago Inicial + Mensualidad*\n`;
    msg += `• Pago Inicial (Desarrollo & Setup): *${sym}${quote.modeInitialPlusMonthly.initialPayment}*\n`;
    msg += `• Mantenimiento & Soporte IA: *${sym}${quote.modeInitialPlusMonthly.monthlyPayment}/mes*\n`;
    msg += `• _${quote.modeInitialPlusMonthly.description}_\n\n`;
    msg += `🔹 *MODALIDAD 2: Solo Pago Mensual (Cero Desembolso Inicial)*\n`;
    msg += `• Pago Inicial: *$0 (Bonificado)*\n`;
    msg += `• Cuota Mensual Todo Incluido: *${sym}${quote.modeOnlyMonthly.monthlyPayment}/mes*\n`;
    msg += `• _${quote.modeOnlyMonthly.description}_\n\n`;
    if (quote.notes) msg += `📌 *Notas:* ${quote.notes}\n\n`;
    msg += `_Emitido por GeoSoft Consultancy & Software Engineering_\n🌐 https://www.geosoft.lat`;
    return encodeURIComponent(msg);
  };

  return {
    quote,
    itemsSubtotal,
    updateField,
    addItem,
    updateItem,
    removeItem,
    updateInitialPlusMonthly,
    updateOnlyMonthly,
    syncInitialWithSubtotal,
    resetToTemplate,
    generateWhatsAppMessage
  };
};
