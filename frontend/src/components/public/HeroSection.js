import React from 'react';

/*
  HeroSection

  Purpose:
  - The main marketing hero used on the public homepage. It's intentionally
    simple: a headline, a short subtitle, and two call-to-action buttons.

  Developer notes:
  - Content is currently static to keep the component predictable. If you later
    need dynamic content (from a CMS), prefer passing `title`, `subtitle`, and
    `actions` as props so the component remains presentational.
  - The visual background uses the `hero-gradient` utility which is defined in
    global styles. Keep those styles centralized so other pages can reuse them.

  Accessibility:
  - Headline uses an <h1> which is correct for a homepage hero. If this component
    is moved to another page, ensure the document outline still has a single H1.
  - CTAs are anchor links that navigate within the page; if they instead trigger
    actions (e.g., modal), convert them to <button> and provide aria attributes.
*/

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
