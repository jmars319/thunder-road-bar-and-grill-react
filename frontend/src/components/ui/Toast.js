// Small, accessible Toast / inline notification component.
// Props:
// - type: 'success' | 'error' | 'info' (controls colors)
// - children: message content
// - onClose: optional callback to render a close button
export default function Toast({ type = 'info', children, onClose }) {
  const base = 'rounded-lg p-3 mb-2 flex items-center gap-3';
  const variants = {
    success: 'bg-success/10 border border-success text-success',
    error: 'bg-error/10 border border-error text-error',
    info: 'bg-surface p-3 border border-border text-text-primary'
  };

  return (
    <div role="status" aria-live="polite" className={`${base} ${variants[type] || variants.info}`}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} className="text-sm text-text-secondary px-2 py-1 rounded hover:bg-surface-warm">✕</button>
      )}
    </div>
  );
}
