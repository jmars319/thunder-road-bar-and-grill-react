import React, { useState, useEffect } from 'react';

import { icons } from '../../icons';
import ThemeToggle from '../ThemeToggle';

/*
  PublicNavbar

  Purpose:
  - Site navigation used by the public website. Loads `site-settings` and
    `navigation` from the backend and renders responsive navigation.

  Contract:
  - Props: { onGoToAdmin?: function }
  - Data: expects GET /api/site-settings and GET /api/navigation endpoints.

  Accessibility & logo notes:
  - If the configured `siteSettings.logo_url` points to an SVG file, this
    component will attempt to fetch the SVG and render it inline so it can
    inherit `currentColor` from CSS tokens (recolorable). If fetch fails or
    the URL is not an SVG, it falls back to a normal <img> element.
  - Inline SVG content is injected as raw HTML; only use this with trusted
    sources. If your admin allows arbitrary uploads, sanitize SVGs server-side.
  - Styling: uses design token classes (e.g., bg-primary, bg-surface, text-text-*)
    and runtime theme variables. Prefer editing tokens in `custom-styles.css`.
*/

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

export default function PublicNavbar({ onGoToAdmin }) {
  const [siteSettings, setSiteSettings] = useState(null);
  const [logoSvg, setLogoSvg] = useState(null);
  const [navLinks, setNavLinks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load site-level settings (logo, name, tagline). Keep errors silent for now.
    fetch(`${API_BASE}/site-settings`)
      .then(res => res.json())
      .then(data => setSiteSettings(data))
      .catch(() => {});

    // Load the navigation payload (array of { id, label, url }).
    fetch(`${API_BASE}/navigation`)
      .then(res => res.json())
      .then(data => setNavLinks(data || []))
      .catch(() => setNavLinks([]));
  }, []);

  // Smooth-scroll handler for same-page hash links. For links that begin
  // with '#', prevent default navigation and scroll the matching element
  // into view with smooth behavior. Also close the mobile menu when used.
  function handleNavClick(e, url) {
    if (!url) return;
    try {
      // normalize to a hash fragment if present, e.g. '/#about' or 'https://site/#about'
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        e.preventDefault();
        const id = url.slice(hashIndex + 1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback to setting the hash so the browser can attempt navigation
          window.location.hash = url;
        }
        setMobileMenuOpen(false);
      }
    } catch (err) {
      // swallow any errors to avoid breaking the nav
    }
  }

  // If the logo_url is an SVG file, fetch the content and render inline so it
  // inherits currentColor (recolorable). This is a best-effort fetch and will
  // gracefully fall back to <img> on error.
  useEffect(() => {
    if (!siteSettings?.logo_url) return;
    const url = siteSettings.logo_url;
    if (typeof url === 'string' && url.toLowerCase().endsWith('.svg')) {
      fetch(url)
        .then(r => (r.ok ? r.text() : Promise.reject()))
        .then(svgText => setLogoSvg(svgText))
        .catch(() => setLogoSvg(null));
    } else {
      setLogoSvg(null);
    }
  }, [siteSettings]);

  // Listen for siteSettingsUpdated events so the navbar updates instantly
  // when an admin changes the logo or other settings in the MediaModule.
  useEffect(() => {
    const handler = (e) => {
      try {
        const payload = e?.detail || {};
        setSiteSettings(payload);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('siteSettingsUpdated', handler);
    return () => window.removeEventListener('siteSettingsUpdated', handler);
  }, []);

  return (
    <nav className="bg-surface shadow-md header-sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            {siteSettings?.logo_url && (
              <div className="logo-badge">
                {/* Prefer inline SVG when available so logos can inherit token colors */}
                {logoSvg ? (
                  <span
                    role="img"
                    aria-label={siteSettings.business_name || 'Site logo'}
                    className="h-11 w-auto inline-block"
                    dangerouslySetInnerHTML={{ __html: logoSvg }}
                  />
                ) : (
                  <img
                    src={siteSettings.logo_url}
                    alt={siteSettings.business_name}
                    className="h-11 w-auto"
                  />
                )}
              </div>
            )}
            <div>
              <div className="text-xl font-bold text-text-primary font-heading">
                {siteSettings?.business_name || 'Thunder Road Bar and Grill'}
              </div>
              {siteSettings?.tagline && (
                <div className="text-xs text-text-secondary">{siteSettings.tagline}</div>
              )}
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/**
             * Small mapping: treat an incoming 'Contact' navigation item as the
             * public-facing careers link. This keeps the admin-driven navigation
             * flexible while making the public nav point to the JobSection on the
             * page (id="#jobs"). Admins can still update navigation in the DB.
             */}
            {navLinks.map(link => {
              const isContactLink = (link.url && link.url.toLowerCase() === '#contact') || (link.label && link.label.toLowerCase().includes('contact'));
              const renderLabel = isContactLink ? 'Careers' : link.label;
              const renderUrl = isContactLink ? '#jobs' : link.url;
              return (
                <a
                  key={link.id}
                  href={renderUrl}
                  onClick={(e) => handleNavClick(e, renderUrl)}
                  className="text-text-secondary hover:text-text-primary font-medium transition"
                >
                  {renderLabel}
                </a>
              );
            })}
            {/* DEV: Admin button and nav links use semantic design tokens (bg-primary, text-text-inverse,
                hover:bg-primary-dark, text-text-primary, etc.). Adjust tokens in
                `frontend/src/custom-styles.css` rather than changing utility classes here. */}
            <button
              type="button"
              onClick={onGoToAdmin}
              aria-label="Open admin panel"
              className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark transition text-sm font-semibold"
            >
              Admin
            </button>
            {React.createElement(ThemeToggle, { inline: true, className: 'ml-2' })}
            {/* ensure ThemeToggle symbol is considered used by linters */}
            {/* ensure ThemeToggle symbol is considered used by some linters */}
            {/* (no-op handled at module scope) */}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-warm"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? React.createElement(icons.X, { size: 24 }) : React.createElement(icons.Menu, { size: 24 })}
          </button>
        </div>

        {/* Mobile menu content - keeps markup separate for clarity */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 border-t">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map(link => {
                const isContactLink = (link.url && link.url.toLowerCase() === '#contact') || (link.label && link.label.toLowerCase().includes('contact'));
                const renderLabel = isContactLink ? 'Careers' : link.label;
                const renderUrl = isContactLink ? '#jobs' : link.url;
                return (
                  <a
                    key={link.id}
                    href={renderUrl}
                    className="text-text-primary hover:text-primary font-medium transition-colors px-4 py-2 hover:bg-surface-warm rounded"
                    onClick={(e) => handleNavClick(e, renderUrl)}
                  >
                    {renderLabel}
                  </a>
                );
              })}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToAdmin();
                }}
                type="button"
                aria-label="Admin login"
                className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark transition text-sm font-semibold mx-4"
              >
                Admin Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Some editor/lint setups don't detect JSX uses of member-expressions like
// `<icons.X />`. Provide a small used-symbol object so those tools don't
// incorrectly report `icons` or `ThemeToggle` as unused.
const __usedNavbar = { icons, ThemeToggle };
void __usedNavbar;
