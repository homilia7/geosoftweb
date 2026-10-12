import React, { useState } from 'react';
import { StoreProvider, useGeoSoftStore } from './context/StoreContext';
import { SplashIntro } from './components/SplashIntro';
import { Navbar } from './components/Navbar';
import { SmokeCursorTrail } from './components/SmokeCursorTrail';
import { soundEffects } from './services/soundEffects';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { SalesHook } from './components/SalesHook';
import { TechMarquee } from './components/TechMarquee';
import { InteractiveVideoShowcase } from './components/InteractiveVideoShowcase';
import { ServicesBento } from './components/ServicesBento';
import { ProcessTimeline } from './components/ProcessTimeline';
import { ProjectsSection } from './components/ProjectsSection';
import { TeamSection } from './components/TeamSection';
import { CostCalculator } from './components/CostCalculator';
import { FaqSection } from './components/FaqSection';
import { FloatingChat } from './components/FloatingChat';
import { Footer } from './components/Footer';
import { useAnalyticsTracker } from './hooks/useAnalyticsTracker';

// Code-splitting para modales y panel de administración
const CalModal = React.lazy(() => import('./components/CalModal').then(m => ({ default: m.CalModal })));
const BookingModal = React.lazy(() => import('./components/BookingModal').then(m => ({ default: m.BookingModal })));
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const AdminLoginModal = React.lazy(() => import('./components/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));

function MainLayout() {
  useAnalyticsTracker();
  const [isCalOpen, setIsCalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [navAnimStarted, setNavAnimStarted] = useState(false);
  const { openAdminModal } = useGeoSoftStore();

  React.useEffect(() => {
    soundEffects.init();
  }, []);

  const scrollToQuote = () => {
    const el = document.getElementById('cotizador');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    const el = document.getElementById('servicios');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#040404] text-white selection:bg-[#A9F8B5] selection:text-black overflow-x-hidden w-full relative">
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

        {/* Performance Metrics */}
        <StatsSection />

        {/* Psychological Sales Hook */}
        <SalesHook />

        {/* Infinite Tech Marquee */}
        <TechMarquee />

        {/* Interactive Video Showcase & Motion Reel */}
        <InteractiveVideoShowcase
          onScrollToQuote={scrollToQuote}
          onOpenBooking={() => setIsBookingOpen(true)}
        />

        {/* Bento Grid Solutions with Glowing Blobs */}
        <ServicesBento onScrollToQuote={scrollToQuote} />

        {/* Step by Step Timeline */}
        <ProcessTimeline />

        {/* Real Showcase / Case Studies */}
        <ProjectsSection />

        {/* Our Team Section */}
        <TeamSection />

        {/* Interactive Smart Cost Calculator */}
        <CostCalculator />

        {/* FAQs */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Chat Trigger */}
      <FloatingChat />

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

        {/* Admin Panel and Login Modal */}
        <AdminPanel />
        <AdminLoginModal />
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
