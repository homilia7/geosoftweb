import React, { useState } from 'react';
import { StoreProvider, useGeoSoftStore } from './context/StoreContext';
import { SplashIntro } from './components/SplashIntro';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { SalesHook } from './components/SalesHook';
import { TechMarquee } from './components/TechMarquee';
import { ServicesBento } from './components/ServicesBento';
import { ProcessTimeline } from './components/ProcessTimeline';
import { ProjectsSection } from './components/ProjectsSection';
import { TeamSection } from './components/TeamSection';
import { CostCalculator } from './components/CostCalculator';
import { FaqSection } from './components/FaqSection';
import { CalModal } from './components/CalModal';
import { BookingModal } from './components/BookingModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FloatingChat } from './components/FloatingChat';
import { Footer } from './components/Footer';

function MainLayout() {
  const [isCalOpen, setIsCalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { openAdminModal } = useGeoSoftStore();

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
      {/* 3D Isometric Cube Animated Splash Intro */}
      <SplashIntro />

      {/* Floating Capsule Navbar */}
      <Navbar
        onOpenCal={() => setIsCalOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAdmin={openAdminModal}
        onScrollToQuote={scrollToQuote}
        onScrollToServices={scrollToServices}
      />

      <main className="overflow-x-hidden w-full">
        {/* Hero Section */}
        <Hero
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

      {/* Embedded Cal.com Modal */}
      <CalModal
        isOpen={isCalOpen}
        onClose={() => setIsCalOpen(false)}
      />

      {/* Native Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Admin Panel and Login Modal */}
      <AdminPanel />
      <AdminLoginModal />
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
