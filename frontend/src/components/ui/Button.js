/*
  Purpose:
  - Shared Button component used across the app. Provides a small set of
    visual variants (primary, ghost, danger) and accepts `className` and
    other native button props.

  Contract:
  - Props: { children, className?: string, variant?: 'primary'|'ghost'|'danger', ...props }

  Notes:
  - Keep visual variants here limited; for theme token updates prefer
    updating Tailwind tokens rather than component markup.
*/

// Using automatic JSX runtime; explicit React import not required

export default function Button({ children, className = '', variant = 'primary', type = 'button', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40';
  const variants = {
    primary: 'bg-primary text-text-inverse hover:bg-primary-dark',
    ghost: 'bg-transparent text-text-primary border border-border hover:bg-surface-warm',
    danger: 'bg-error text-text-inverse hover:brightness-95'
  };
  return (
    <button type={type} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
