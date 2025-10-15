import { createContext, useContext, useState, useCallback } from 'react';

/*
  ToastContext

  Purpose:
  - Lightweight global notification system for the app (toasts).
  - Supports simple usage: add a message with an optional type and duration.

  Public API (value provided to consumers):
  - toasts: Array of active toast objects
  - add(message, options): Adds a toast and returns its id
  - remove(id): Removes a toast by id

  Toast options (supported):
  - type: 'info' | 'success' | 'warning' | 'error' (affects appearance)
  - duration: milliseconds to auto-dismiss (defaults to 4000)
  - persistent: boolean (when true, toast is not auto-dismissed)

  Notes for maintainers:
  - The visual styling of toasts is intentionally simple (Tailwind + design tokens).
  - Keep any additional visual complexity in a single place (this file) so callers
    can continue to use the same add(...) API.
*/

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add a toast. We generate a small unique id using timestamp + random suffix.
  // `options` accepts type/duration/persistent as documented above.
  const add = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 8);
    // normalize type
    const type = options.type || 'info';
    setToasts(t => [...t, { id, message, type, ...options }]);
    if (!options.persistent) {
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), options.duration || 4000);
    }
    return id;
  }, []);

  // Remove a toast synchronously by id.
  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  // Render a small icon depending on toast type. Keep these inline svgs minimal
  // so they are easy to change or replace with a shared Icon component later.
  const renderIcon = (type) => {
    if (type === 'success') return (
      <svg className="w-5 h-5 text-success flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    if (type === 'error') return (
      <svg className="w-5 h-5 text-error flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    // info / default
    return (
      <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  };

  // Map toast type to container classes. Keep this single source of truth to
  // make visual updates easier.
  const containerFor = (type) => {
    if (type === 'success') return 'bg-success/10 border border-success text-success rounded-lg shadow-lg p-3 px-4';
    if (type === 'error') return 'bg-error/10 border border-error text-error rounded-lg shadow-lg p-3 px-4';
    return 'bg-surface rounded-lg shadow-lg p-3 px-4 text-text-primary';
  };

  return (
    <ToastContext.Provider value={{ toasts, add, remove }}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`${containerFor(t.type)}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{renderIcon(t.type)}</div>
              <div className="flex-1 text-sm leading-snug">
                {t.message}
              </div>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss"
                className="ml-3 text-text-secondary hover:text-text-primary"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
