import React, { useState } from 'react';
import { StoreProvider, useGeoSoftStore } from './context/StoreContext';
import { SplashIntro } from './components/SplashIntro';
import { Navbar } from './components/Navbar';
import { SmokeCursorTrail } from './components/SmokeCursorTrail';
import { soundEffects } from './services/soundEffects';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { useAnalyticsTracker } from './hooks/useAnalyticsTracker';

// Code-splitting para secciones pesadas debajo del scroll
const StatsSection = React.lazy(() => import('./components/StatsSection').then(m => ({ default: m.StatsSection })));
const SalesHook = React.lazy(() => import('./components/SalesHook').then(m => ({ default: m.SalesHook })));
const TechMarquee = React.lazy(() => import('./components/TechMarquee').then(m => ({ default: m.TechMarquee })));
const ServicesBento = React.lazy(() => import('./components/ServicesBento').then(m => ({ default: m.ServicesBento })));
const ProcessTimeline = React.lazy(() => import('./components/ProcessTimeline').then(m => ({ default: m.ProcessTimeline })));
const ProjectsSection = React.lazy(() => import('./components/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const CostCalculator = React.lazy(() => import('./components/CostCalculator').then(m => ({ default: m.CostCalculator })));
const FaqSection = React.lazy(() => import('./components/FaqSection').then(m => ({ default: m.FaqSection })));
const FloatingChat = React.lazy(() => import('./components/FloatingChat').then(m => ({ default: m.FloatingChat })));

// Code-splitting para modales y panel de administración
const CalModal = React.lazy(() => import('./components/CalModal').then(m => ({ default: m.CalModal })));
const BookingModal = React.lazy(() => import('./components/BookingModal').then(m => ({ default: m.BookingModal })));
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const AdminLoginModal = React.lazy(() => import('./components/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));
const HolographicCubeViewer = React.lazy(() => import('./components/HolographicCubeViewer').then(m => ({ default: m.HolographicCubeViewer })));
const ClientProposalModal = React.lazy(() => import('./components/ClientProposalModal').then(m => ({ default: m.ClientProposalModal })));

function MainLayout() {
  useAnalyticsTracker();
  const [isCalOpen, setIsCalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCubeViewerOpen, setIsCubeViewerOpen] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [navAnimStarted, setNavAnimStarted] = useState(false);
  const {
    openAdminModal,
    isAdminModalOpen,
    isLoginModalOpen,
    isProposalModalOpen,
    openProposalModal,
    closeProposalModal
  } = useGeoSoftStore();

  const openAdminModalRef = React.useRef(openAdminModal);
  openAdminModalRef.current = openAdminModal;
  const openProposalModalRef = React.useRef(openProposalModal);
  openProposalModalRef.current = openProposalModal;
  const isModalOpenRef = React.useRef({ isAdminModalOpen, isLoginModalOpen, isProposalModalOpen });
  isModalOpenRef.current = { isAdminModalOpen, isLoginModalOpen, isProposalModalOpen };

  React.useEffect(() => {
    soundEffects.init();
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#cubo' || hash === '#cubo3d') {
        setIsCubeViewerOpen(true);
      } else if (hash === '#propuesta' || hash === '#formulario' || hash === '#brief' || path === '/propuesta') {
        if (!isModalOpenRef.current.isProposalModalOpen) {
          openProposalModalRef.current();
        }
      } else if (
        hash.startsWith('#admin') ||
        hash === '#propuestas' ||
        hash === '#admin-propuestas' ||
        path === '/admin' ||
        path === '/propuestas'
      ) {
        if (!isModalOpenRef.current.isAdminModalOpen && !isModalOpenRef.current.isLoginModalOpen) {
          openAdminModalRef.current();
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const scrollToQuote = () => {
    const el = document.getElementById('cotizador');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    const el = document.getElementById('servicios');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Espacio de Web Independiente para el Panel de Administración (No Popup)
  if (isAdminModalOpen) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-[#07080a] flex items-center justify-center text-white font-mono text-sm">Cargando Workspace de Administración...</div>}>
        <AdminPanel />
      </React.Suspense>
    );
  }

  // Espacio de Web Independiente para el Acceso Seguro de Administración
  if (isLoginModalOpen) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-[#07080a] flex items-center justify-center text-white font-mono text-sm">Cargando Acceso Seguro...</div>}>
        <AdminLoginModal />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#040404] text-white selection:bg-[#A9F8B5] selection:text-black overflow-x-hidden w-full relative transition-colors duration-300">
      {/* High-End Fluid Smoke Trail */}
      <SmokeCursorTrail />

      {/* 3D Isometric Cube Animated Splash Intro */}
      <SplashIntro onFinish={() => setIntroFinished(true)} />

      {/* Floating Capsule Navbar (inicia su animación estrictamente después de que el contenedor izquierdo aparece) */}
      <Navbar
        introFinished={navAnimStarted}
        onOpenCal={() => setIsCalOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAdmin={openAdminModal}
        onScrollToQuote={scrollToQuote}
        onScrollToServices={scrollToServices}
      />

      <main className="overflow-x-hidden w-full">
        {/* Hero Section */}
        <Hero
          introFinished={introFinished}
          onLeftContentAppeared={() => setNavAnimStarted(true)}
          onOpenCal={() => setIsCalOpen(true)}
          onOpenBooking={() => setIsBookingOpen(true)}
          onScrollToQuote={scrollToQuote}
        />

        {/* Below-the-fold Lazy Sections (cargados al completar la intro interactiva) */}
        {introFinished && (
          <React.Suspense fallback={null}>
            <StatsSection />
            <SalesHook />
            <TechMarquee />
            <ServicesBento onScrollToQuote={scrollToQuote} />
            <ProcessTimeline />
            <ProjectsSection />
            <SalesHook
              quote="Mientras tu competencia sigue respondiendo cotizaciones manualmente una por una, tu negocio podría estar agendando, cobrando y operando con software inteligente."
              badge="La velocidad de respuesta y automatización define quién gana la venta"
              icon="zap"
            />
            <CostCalculator />
            <FaqSection />
            <Footer />
          </React.Suspense>
        )}
      </main>

      {/* Floating AI Chat Trigger (iniciado al entrar a la web) */}
      {introFinished && (
        <React.Suspense fallback={null}>
          <FloatingChat />
        </React.Suspense>
      )}

      {/* Code-Split Lazy Modals & Admin */}
      <React.Suspense fallback={null}>
        {/* Embedded Cal.com Modal */}
        {isCalOpen && (
          <CalModal
            isOpen={isCalOpen}
            onClose={() => setIsCalOpen(false)}
          />
        )}

        {/* Native Appointment Booking Modal */}
        {isBookingOpen && (
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        )}

        {/* Visor 3D Interactivo del Cubo Holográfico */}
        {isCubeViewerOpen && (
          <HolographicCubeViewer
            isOpen={isCubeViewerOpen}
            onClose={() => setIsCubeViewerOpen(false)}
          />
        )}

        {/* Formulario Interactivo de Propuestas / Ficha de Negocio */}
        {isProposalModalOpen && (
          <ClientProposalModal
            isOpen={isProposalModalOpen}
            onClose={() => {
              closeProposalModal();
              if (window.location.hash === '#propuesta' || window.location.hash === '#formulario' || window.location.hash === '#brief') {
                history.pushState('', document.title, window.location.pathname + window.location.search);
              }
            }}
          />
        )}
      </React.Suspense>

    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}

export default App;
