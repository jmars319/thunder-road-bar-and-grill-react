/*
  AboutSection

  Purpose:
  - Render editable 'About' content pulled from the backend.

  Contract:
  - Expects GET /api/about returning an object with header, paragraph, and an optional map URL.

  Security note:
  - Sanitize any rich HTML from the backend before rendering to avoid XSS. This
    component renders plain text from the `about` payload and is intentionally
    conservative.
*/

import { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

function buildMapsEmbedUrlFromAddress(address) {
  if (!address) return null;
  // Use the public embed query parameter which doesn't require an API key.
  // Example: https://www.google.com/maps?q=1600+Amphitheatre+Parkway&output=embed
  const q = encodeURIComponent(address.trim());
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

export default function AboutSection() {
  // NOTE: This component uses `bg-surface` and `bg-surface-warm` tokens for
  // panels and page background. Edit tokens in `custom-styles.css` for global
  // changes (preferred) rather than in-component literal utilities.
  // DEV: Keep panel/background colors tokenized so runtime theming and
  // accessibility adjustments remain centralized. Avoid inline hex or
  // Tailwind color shades here; update `frontend/src/custom-styles.css`.
  const [about, setAbout] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    // Fetch both about and site-settings so we can fall back to an address
    // if the admin updated the business address rather than a full embed URL.
    const load = async () => {
      try {
        const [aboutRes, siteRes] = await Promise.all([
          fetch(`${API_BASE}/about`),
          fetch(`${API_BASE}/site-settings`)
        ]);

        if (aboutRes.ok) {
          const aboutData = await aboutRes.json();
          setAbout(aboutData || null);
        } else {
          setAbout(null);
        }

        if (siteRes.ok) {
          const siteData = await siteRes.json();
          setSiteSettings(siteData || null);
        } else {
          setSiteSettings(null);
        }
      } catch {
        setAbout(null);
        setSiteSettings(null);
      }
    };

    load();
  }, []);

  return (
  <div className="py-16 bg-surface-warm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-heading font-bold text-center mb-6">About Us</h2>
        <div className="bg-surface rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-heading font-semibold mb-4 text-text-primary">{about?.header}</h3>
          <p className="text-text-secondary mb-4">{about?.paragraph}</p>
          {(() => {
            // Determine the embed src. Priority:
            // 1) about.map_embed_url if it looks like a URL (starts with http)
            // 2) about.map_embed_url if it's a plain address string -> build embed URL
            // 3) siteSettings.address -> build embed URL
            const raw = about?.map_embed_url;
            let embedSrc = null;
            if (raw) {
              const trimmed = String(raw).trim();
              if (/^https?:\/\//i.test(trimmed)) {
                embedSrc = trimmed;
              } else {
                // Treat as plain address
                embedSrc = buildMapsEmbedUrlFromAddress(trimmed);
              }
            } else if (siteSettings?.address) {
              embedSrc = buildMapsEmbedUrlFromAddress(siteSettings.address);
            }

            if (!embedSrc) return null;

            return (
              <div className="mt-4">
                <iframe
                  src={embedSrc}
                  title="Location"
                  className="w-full h-64 border-0 rounded"
                  allowFullScreen
                />
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
