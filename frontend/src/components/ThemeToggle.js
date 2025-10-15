import React, { useContext, useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';

const labelFor = (t) => {
  if (t === 'system') return 'System';
  if (t === 'dark') return 'Dark';
  return 'Light';
};

function Icon({ theme }) {
  if (theme === 'dark') return <Moon size={16} />;
  if (theme === 'light') return <Sun size={16} />;
  return <Monitor size={16} />;
}

export default function ThemeToggle({ inline = false, className = '' }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [anim, setAnim] = useState(false);

  const cycle = () => {
    if (theme === 'system') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('system');
  };

  useEffect(() => {
    // animate on theme change unless user prefers reduced motion
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    setAnim(true);
    const t = setTimeout(() => setAnim(false), 420);
    return () => clearTimeout(t);
  }, [theme]);

  const base = inline
    ? 'bg-transparent text-text-primary px-2 py-1 rounded hover:bg-surface-warm transition text-sm'
    : 'fixed bottom-6 right-6 z-50 bg-surface border border-border text-text-primary px-3 py-2 rounded-full shadow-lg hover:opacity-90 transition';

  return (
    <button
      aria-label="Toggle theme"
      title={`Theme: ${labelFor(theme)} (click to change)`}
      onClick={cycle}
      className={`${base} ${className}`}
    >
      <span className={`inline-flex items-center justify-center ${anim ? 'theme-toggle-anim' : ''}`}>
        <Icon theme={theme} />
      </span>
      <span className="sr-only">Theme: {labelFor(theme)}</span>
    </button>
  );
}
