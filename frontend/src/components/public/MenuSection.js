import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/*
  MenuSection

  Purpose:
  - Render the restaurant menu grouped by categories fetched from the backend.

  Expected API:
  - GET /api/menu -> [
      {
        id,
        name,
        description,
        image_url?,
        items: [ { id, name, description, price }, ... ]
      },
      ...
    ]

  Notes and defensive behavior:
  - Guard against missing arrays and missing prices. If `price` is not a number,
    display a placeholder (e.g., '—') instead of crashing.
  - The expand/collapse state is local to this component. If you need deep-linking
    to an expanded category, consider lifting state to the page and syncing with the URL.
  - Images use `alt` text from the category name for accessibility.
*/

const API_BASE = 'http://localhost:5001/api';

export default function MenuSection() {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/menu`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div id="menu" className="py-16 bg-surface-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-heading font-bold text-center mb-12">Our Menu</h2>
        
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category.id} className="menu-card bg-surface rounded-lg shadow-lg overflow-hidden card-hover transition-all">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-surface-warm transition"
                aria-expanded={expandedCategory === category.id}
              >
                <div className="text-left">
                  <h3 className="text-2xl font-heading font-bold text-text-primary">{category.name}</h3>
                  <p className="text-text-secondary text-sm mt-1">{category.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  {expandedCategory === category.id ? (
                    <ChevronUp className="text-primary" size={24} />
                  ) : (
                    <ChevronDown className="text-text-muted" size={24} />
                  )}
                </div>
              </button>

              {category.image_url && (
                <div className="relative">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10"></div>
                </div>
              )}

              {expandedCategory === category.id && (
                <div className="border-t bg-surface-warm">
                  {Array.isArray(category.items) && category.items.length > 0 ? (
                    <div className="divide-y divide-divider">
                      {category.items.map(item => (
                        <div key={item.id} className="p-6 flex justify-between items-start hover:bg-surface-warm transition">
                          <div className="flex-1">
                            <h4 className="text-lg font-heading font-semibold text-text-primary">{item.name}</h4>
                            <p className="text-text-secondary text-sm mt-1">{item.description}</p>
                          </div>
                          <div className="ml-4">
                            <span className="price-badge">{typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : '—'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-text-muted">No items in this category</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
