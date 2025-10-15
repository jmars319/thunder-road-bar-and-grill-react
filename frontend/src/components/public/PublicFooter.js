import React, { useEffect, useState } from 'react';

/*
  PublicFooter

  Purpose:
  - Render the site footer using columns provided by the backend. Keeps content
    editable from the CMS/backend rather than hardcoded here.

  Expected API:
  - GET /api/footer-columns -> [
      {
        id: string | number,
        column_title: string,
        links: [ { id, label, url }, ... ]
      },
      ...
    ]

  Notes for maintainers:
  - The component fetches on mount and uses a simple array shape. If the backend
    returns a different shape, add a small adapter here rather than changing callers.
  - Links are rendered as plain anchors. If you later adopt a router, replace <a>
    with a Link component and preserve the same link objects.
  - Accessibility: headings use semantic <h4>. If the footer is the first/only
    landmark on some pages, consider adding an aria-label to the <footer> element.
*/

const API_BASE = 'http://localhost:5001/api';

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
    <footer className="bg-surface text-text-inverse py-12">
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
      <div className="mt-8 text-center text-sm text-text-secondary">© {new Date().getFullYear()} Thunder Road Bar and Grill</div>
    </footer>
  );
}
