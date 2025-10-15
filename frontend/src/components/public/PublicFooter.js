/*
  Purpose:
  - Render the site footer using content from the backend (footer columns).

  Contract:
  - Expects GET /api/footer-columns returning columns with `links` arrays.

  Notes:
  - Links are plain anchors to keep the footer router-agnostic. Adapt the data
    shape here if the backend changes rather than changing callers.
*/

import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

export default function PublicFooter() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // Keep fetch resilient: swallow errors and fallback to an empty array so the
    // public site doesn't crash if the API is temporarily unavailable.
    fetch(`${API_BASE}/footer-columns`)
      .then(res => res.json())
      .then(data => setColumns(Array.isArray(data) ? data : []))
      .catch(() => setColumns([]));
  }, []);

  return (
    <footer className="bg-surface text-text-inverse py-12" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map(col => (
          <div key={col.id}>
            <h4 className="text-lg font-heading font-semibold mb-3 text-text-primary">{col.column_title}</h4>
            <ul className="space-y-2">
              {Array.isArray(col.links) && col.links.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="text-text-muted hover:text-text-primary transition">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-text-secondary" aria-hidden="false">© {new Date().getFullYear()} Thunder Road Bar and Grill</div>
    </footer>
  );
}
