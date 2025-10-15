import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const API_BASE = 'http://localhost:5001/api';

export default function PublicNavbar({ onGoToAdmin }) {
  const [siteSettings, setSiteSettings] = useState(null);
  const [navLinks, setNavLinks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/site-settings`)
      .then(res => res.json())
      .then(data => setSiteSettings(data));

    fetch(`${API_BASE}/navigation`)
      .then(res => res.json())
      .then(data => setNavLinks(data));
  }, []);

  return (
    <nav className="bg-surface shadow-md header-sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            {siteSettings?.logo_url && (
              <div className="logo-badge">
                <img
                  src={siteSettings.logo_url}
                  alt={siteSettings.business_name}
                  className="h-11 w-auto"
                />
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

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={link.url}
                className="text-text-secondary hover:text-primary font-medium transition"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onGoToAdmin}
              className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark transition text-sm font-semibold"
            >
              Admin
            </button>
            <ThemeToggle inline className="ml-2" />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-warm"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  className="text-text-primary hover:text-primary font-medium transition-colors px-4 py-2 hover:bg-surface-warm rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToAdmin();
                }}
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
