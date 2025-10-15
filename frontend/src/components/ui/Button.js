import React from 'react';

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-bold transition shadow-sm';
  const variants = {
    primary: 'bg-primary text-text-inverse hover:bg-primary-dark',
    ghost: 'bg-transparent text-text-primary border border-border',
    danger: 'bg-error text-text-inverse hover:brightness-95'
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
