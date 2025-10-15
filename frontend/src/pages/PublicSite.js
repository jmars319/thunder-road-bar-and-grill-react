// ============================================
// Thunder Road - Public Website
// File: frontend/src/pages/PublicSite.js
// ============================================

import React from 'react';
import PublicNavbar from '../components/public/PublicNavbar';
import HeroSection from '../components/public/HeroSection';
import MenuSection from '../components/public/MenuSection';
import ReservationSection from '../components/public/ReservationSection';
import AboutSection from '../components/public/AboutSection';
import PublicFooter from '../components/public/PublicFooter';

export default function PublicSite({ onGoToAdmin }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar onGoToAdmin={onGoToAdmin} />
      <HeroSection />
      <MenuSection />
      <ReservationSection />
      <AboutSection />
      <PublicFooter />
    </div>
  );
}
