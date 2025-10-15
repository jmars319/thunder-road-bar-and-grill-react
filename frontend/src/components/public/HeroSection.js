import React from 'react';

export default function HeroSection() {
  return (
    <div className="hero-gradient text-white py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="hero-title text-5xl md:text-6xl font-heading font-extrabold mb-6">
          Welcome to Thunder Road
        </h1>
        <p className="hero-subtitle text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
          Great Food. Cold Drinks. Good Times.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#menu"
            className="bg-primary text-text-inverse px-8 py-3 rounded-lg hover:bg-primary-dark transition font-bold shadow-lg"
          >
            View Menu
          </a>
          <a
            href="#reservations"
            className="bg-surface text-primary px-8 py-3 rounded-lg hover:bg-surface-warm transition font-bold shadow-lg"
          >
            Make a Reservation
          </a>
        </div>
      </div>
    </div>
  );
}
