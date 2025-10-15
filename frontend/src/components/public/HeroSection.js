/*
  HeroSection

  Purpose:
  - Hero section for the homepage: headline, subtitle, and CTAs. Presentational
    and intentionally static to avoid unexpected layout changes.

  Accessibility:
  - This component renders the main H1 for the public site. If you embed
    multiple instances on the same page, ensure only one H1 remains for
    correct semantic structure.
*/

import React from 'react';

export default function HeroSection() {
  // NOTE: This component uses the `.hero-gradient` helper which references
  // CSS tokens (see `frontend/src/custom-styles.css`). Prefer token edits
  // over changing literal color classes here so runtime theming remains intact.
  return (
  <div className="hero-gradient text-text-inverse py-32 relative overflow-hidden">
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
            role="button"
            aria-label="View menu"
            className="bg-primary text-text-inverse px-8 py-3 rounded-lg hover:bg-primary-dark transition font-bold shadow-lg"
          >
            View Menu
          </a>
          <a
            href="#reservations"
            role="button"
            aria-label="Make a reservation"
            className="bg-surface text-text-primary px-8 py-3 rounded-lg hover:bg-surface-warm transition font-bold shadow-lg"
          >
            Make a Reservation
          </a>
        </div>
      </div>
    </div>
  );
}
