import React, { useEffect, useState } from 'react';

/*
  AboutSection

  Purpose:
  - Display the 'About Us' content retrieved from the backend. Keeps copy
    editable in the CMS instead of hardcoding it in the frontend.

  Expected API:
  - GET /api/about -> { header?: string, paragraph?: string, map_embed_url?: string }

  Notes:
  - The component tolerates missing fields by rendering nothing for absent values.
  - If richer HTML or markup is needed from the CMS, sanitize or render via a
    trusted renderer here rather than trusting raw HTML in templates.
*/

const API_BASE = 'http://localhost:5001/api';

export default function AboutSection() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/about`)
      .then(res => res.json())
      .then(data => setAbout(data))
      .catch(() => setAbout(null));
  }, []);

  return (
    <div className="py-16 bg-surface-warm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-heading font-bold text-center mb-6">About Us</h2>
        <div className="bg-surface rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-heading font-semibold mb-4 text-text-primary">{about?.header}</h3>
          <p className="text-text-secondary mb-4">{about?.paragraph}</p>
          {about?.map_embed_url && (
            <div className="mt-4">
              <iframe
                src={about.map_embed_url}
                title="Location"
                className="w-full h-64 border-0 rounded"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
