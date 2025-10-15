import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5001/api';

export default function PublicFooter() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/footer-columns`)
      .then(res => res.json())
      .then(data => setColumns(data));
  }, []);

  return (
    <footer className="bg-surface text-text-inverse py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map(col => (
          <div key={col.id}>
            <h4 className="text-lg font-heading font-semibold mb-3 text-text-primary">{col.column_title}</h4>
            <ul className="space-y-2">
              {col.links.map(link => (
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
