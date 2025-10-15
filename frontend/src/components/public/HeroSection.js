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

// React 17+ with new JSX transform doesn't require importing React for JSX usage.

import { useEffect, useState, useRef } from 'react';

// New HeroSection: supports a simple slideshow driven by site settings (hero_images).
export default function HeroSection() {
  const [images, setImages] = useState([]);
  const idxRef = useRef(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/api/site-settings').then(r => r.ok ? r.json() : {}).then(s => {
      if (Array.isArray(s?.hero_images) && s.hero_images.length) {
        setImages(s.hero_images.map(h => h.file_url));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!images.length) return;
    const id = window.setInterval(() => {
      idxRef.current = (idxRef.current + 1) % images.length;
      setIndex(idxRef.current);
    }, 6000);
    return () => window.clearInterval(id);
  }, [images]);

  return (
    <div className="hero-gradient text-text-inverse py-32 relative overflow-hidden">
      {/* background slideshow */}
      {images.length > 0 && (
        <div className="absolute inset-0 -z-10">
          {images.map((src, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ))}
          <div className="absolute inset-0 overlay-gradient" aria-hidden="true" />
        </div>
      )}

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
