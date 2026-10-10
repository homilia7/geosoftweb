import React, { useState } from 'react';
import { SplashIntro } from './components/SplashIntro';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { SalesHook } from './components/SalesHook';
import { TechMarquee } from './components/TechMarquee';
import { ServicesBento } from './components/ServicesBento';
import { ProcessTimeline } from './components/ProcessTimeline';
import { CostCalculator } from './components/CostCalculator';
import { FaqSection } from './components/FaqSection';
import { CalModal } from './components/CalModal';
import { FloatingChat } from './components/FloatingChat';
import { Footer } from './components/Footer';

export function App() {
  const [isCalOpen, setIsCalOpen] = useState(false);

  const scrollToQuote = () => {
    const el = document.getElementById('cotizador');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    const el = document.getElementById('servicios');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#040404] text-white selection:bg-[#A9F8B5] selection:text-black">
      {/* 3D Isometric Cube Animated Splash Intro */}
      <SplashIntro />

      {/* Floating Capsule Navbar */}
      <Navbar
        onOpenCal={() => setIsCalOpen(true)}
        onScrollToQuote={scrollToQuote}
        onScrollToServices={scrollToServices}
      />

      <main>
        {/* Hero Section */}
        <Hero
          onOpenCal={() => setIsCalOpen(true)}
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
    </div>
  );
}

export default App;
