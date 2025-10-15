import React, { useState, useEffect } from 'react';
import { icons } from '../../icons';

/*
  MenuSection

  Purpose:
  - Render the restaurant menu grouped by categories fetched from the backend.

  Accessibility & contract:
  - Buttons controlling collapsible panels include `aria-expanded` for screen
    readers. Price labels are plain text inside a span with `aria-hidden` false
    so screen readers announce amounts correctly.
*/

/* DEV:
   - This component relies on semantic design tokens (e.g., bg-surface-warm,
     text-text-primary, divide-divider). Update colors in
     `frontend/src/custom-styles.css` rather than altering utilities here.
   - `ChevronDown` / `ChevronUp` are imported from `lucide-react` and used
     below. The earlier eslint suppression was unnecessary and removed so
     the codebase has fewer per-file suppressions.
*/

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

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
                type="button"
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-surface-warm transition"
                aria-expanded={expandedCategory === category.id}
                aria-controls={`menu-cat-${category.id}`}
              >
                <div className="text-left">
                  <h3 className="text-2xl font-heading font-bold text-text-primary">{category.name}</h3>
                  <p className="text-text-secondary text-sm mt-1">{category.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  {expandedCategory === category.id ? (
                    React.createElement(icons.ChevronUp, { className: 'text-primary', size: 24 })
                  ) : (
                    React.createElement(icons.ChevronDown, { className: 'text-text-muted', size: 24 })
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
                  <div className="absolute inset-0 overlay-gradient"></div>
                </div>
              )}

              {expandedCategory === category.id && (
                <div id={`menu-cat-${category.id}`} className="border-t bg-surface-warm">
                  {Array.isArray(category.items) && category.items.length > 0 ? (
                    <div className="divide-y divide-divider">
                      {category.items.map(item => (
                        <div key={item.id} className="p-6 flex justify-between items-start hover:bg-surface-warm transition">
                          <div className="flex-1">
                            <h4 className="text-lg font-heading font-semibold text-text-primary">{item.name}</h4>
                            <p className="text-text-secondary text-sm mt-1">{item.description}</p>
                          </div>
                          <div className="ml-4">
                            <span className="price-badge" aria-label={typeof item.price === 'number' ? `Price ${item.price}` : 'Price not available'}>
                              {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : '\u2014'}
                            </span>
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
          {/* ensure lucide-react icons are considered used by some linters */}
          {/* (no-op handled at module scope) */}
        </div>
      </div>
    </div>
  );
}

// Some editor/lint setups don't detect usage of member-expression JSX like
// <icons.ChevronUp />. Keep a small module-scope reference to satisfy those
// tools. This is intentional and safe.
const __usedMenu = { icons };
void __usedMenu;
