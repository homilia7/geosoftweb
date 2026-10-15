import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlatformOption, AddonService, Appointment, AppointmentStatus, PricingConfig, PlatformType } from '../types';
import { api } from '../services/api';

export const DEFAULT_PLATFORMS: PlatformOption[] = [
  {
    id: 'static',
    title: 'Web Estática / Landing Page',
    badge: 'Presencia Rápida',
    description: 'Ideal para marca corporativa, portafolio y máxima velocidad de carga.',
    basePrice: 199,
    features: ['Diseño 100% responsivo', 'Optimización SEO básica', 'Despliegue en Cloudflare']
  },
  {
    id: 'dynamic',
    title: 'Web Dinámica / Catálogo',
    badge: 'Autoadministrable',
    description: 'Ideal para blogs, catálogos, inmobiliarias o actualización frecuente.',
    basePrice: 399,
    features: ['Panel de administración fácil', 'Formularios avanzados', 'Gestión de contenido']
  },
  {
    id: 'ai',
    title: 'Web con Agente de IA 24/7',
    badge: 'Más Popular',
    description: 'Convierte visitas en clientes con chatbots inteligentes y flujos automáticos.',
    basePrice: 599,
    features: ['Chatbot de IA conversacional', 'Captura automática de leads', 'Conexión a WhatsApp / CRM']
  },
  {
    id: 'saas',
    title: 'Plataforma SaaS & Sistema Web',
    badge: 'Solución Enterprise',
    description: 'Software a medida con bases de datos, roles de usuario y pasarelas de pago.',
    basePrice: 999,
    features: ['Arquitectura en la nube', 'Pasarelas SinpePay / Stripe', 'Paneles de usuario avanzados']
  }
];

export const DEFAULT_ADDONS: AddonService[] = [
  {
    id: 'domain',
    title: 'Dominio Propio (.com / .lat)',
    description: 'Registro oficial de tu marca en internet por 1 año.',
    price: 25,
    period: 'anual'
  },
  {
    id: 'hosting',
    title: 'Hosting Cloud Premium',
    description: 'Servidores de alta velocidad con SSL y CDN global.',
    price: 75,
    period: 'anual',
    recommended: true
  },
  {
    id: 'maintenance',
    title: 'Mantenimiento & Soporte Continuo',
    description: 'Actualizaciones de seguridad, monitoreo y soporte prioritario.',
    price: 45,
    period: 'mensual'
  }
];

const DEFAULT_PRICING: PricingConfig = {
  platforms: DEFAULT_PLATFORMS,
  addons: DEFAULT_ADDONS,
  discountPercent: 15,
  discountBanner: '¡Promoción Exclusiva de Temporada!',
  discountActive: false
};

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-demo-1',
    fullName: 'Carlos Morales',
    email: 'carlos@empresa.com',
    whatsapp: '+506 8899-7766',
    service: 'Web con Agente de IA 24/7',
    date: '2026-10-15',
    time: '10:00 AM',
    notes: 'Interesado en conectar chatbot a WhatsApp Business para clínica dental.',
    status: 'confirmada',
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-demo-2',
    fullName: 'Valeria Castro',
    email: 'valeria@hotelboutique.cr',
    whatsapp: '+506 7011-2233',
    service: 'Sistemas de Reservas & Cobros',
    date: '2026-10-18',
    time: '03:30 PM',
    notes: 'Necesita pasarela Sinpe Móvil para reservas de hospedaje.',
    status: 'pendiente',
    createdAt: new Date().toISOString()
  }
];

interface StoreContextType {
  pricing: PricingConfig;
  appointments: Appointment[];
  isAdminLoggedIn: boolean;
  isAdminModalOpen: boolean;
  isLoginModalOpen: boolean;
  updatePlatformPrice: (id: PlatformType, newPrice: number) => void;
  updateAddonPrice: (id: string, newPrice: number) => void;
  updateDiscount: (percent: number, active: boolean, banner?: string) => void;
  resetPricing: () => void;
  addAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load pricing from localStorage
  const [pricing, setPricing] = useState<PricingConfig>(() => {
    try {
      const saved = localStorage.getItem('geosoft_pricing');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PRICING;
  });

  // Load appointments from localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('geosoft_appointments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_APPOINTMENTS;
  });

  // Admin auth & modal state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('geosoft_admin_auth') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initial sync with remote Cloudflare D1 backend (deferred to 7s to prevent initial re-render)
  useEffect(() => {
    const timer = setTimeout(() => {
      api.getPricing().then(remotePricing => {
        if (remotePricing) setPricing(remotePricing);
      });
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem('geosoft_pricing', JSON.stringify(pricing));
    } catch (e) {
      console.error(e);
    }
  }, [pricing]);

  useEffect(() => {
    try {
      localStorage.setItem('geosoft_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  const updatePlatformPrice = (id: PlatformType, newPrice: number) => {
    setPricing(prev => {
      const next = {
        ...prev,
        platforms: prev.platforms.map(p => (p.id === id ? { ...p, basePrice: newPrice } : p))
      };
      api.savePricing(next);
      return next;
    });
  };

  const updateAddonPrice = (id: string, newPrice: number) => {
    setPricing(prev => {
      const next = {
        ...prev,
        addons: prev.addons.map(a => (a.id === id ? { ...a, price: newPrice } : a))
      };
      api.savePricing(next);
      return next;
    });
  };

  const updateDiscount = (percent: number, active: boolean, banner?: string) => {
    setPricing(prev => {
      const next = {
        ...prev,
        discountPercent: percent,
        discountActive: active,
        discountBanner: banner !== undefined ? banner : prev.discountBanner
      };
      api.savePricing(next);
      return next;
    });
  };

  const resetPricing = () => {
    setPricing(DEFAULT_PRICING);
    api.savePricing(DEFAULT_PRICING);
  };

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newApt: Appointment = {
      ...data,
      id: 'apt-' + Date.now(),
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    api.createAppointment(newApt);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
    api.updateAppointmentStatus(id, status);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    api.deleteAppointment(id);
  };

  const loginAdmin = (pin: string) => {
    // Default PIN: 2026 or admin2026
    if (pin.trim() === '2026' || pin.trim() === 'admin2026') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('geosoft_admin_auth', 'true');
      setIsLoginModalOpen(false);
      setIsAdminModalOpen(true);
      api.getAppointments().then(remoteApts => {
        if (remoteApts) setAppointments(remoteApts);
      });
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('geosoft_admin_auth');
    setIsAdminModalOpen(false);
  };

  const openAdminModal = () => {
    if (isAdminLoggedIn) {
      setIsAdminModalOpen(true);
      api.getAppointments().then(remoteApts => {
        if (remoteApts) setAppointments(remoteApts);
      });
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const closeAdminModal = () => setIsAdminModalOpen(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <StoreContext.Provider
      value={{
        pricing,
        appointments,
        isAdminLoggedIn,
        isAdminModalOpen,
        isLoginModalOpen,
        updatePlatformPrice,
        updateAddonPrice,
        updateDiscount,
        resetPricing,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        openAdminModal,
        closeAdminModal,
        openLoginModal,
        closeLoginModal,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useGeoSoftStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useGeoSoftStore must be used within a StoreProvider');
  }
  return context;
};
