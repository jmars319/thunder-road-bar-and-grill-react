import React, { useContext, useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';

/*
  ThemeToggle

  Purpose:
  - A small, reusable button to cycle between theme modes: system -> dark -> light.
  - Placed in the UI as either an inline control (useful in headers) or as a floating
    action button (default), controlled by the `inline` prop.

  Props:
  - inline: boolean — when true, render a compact inline version instead of the floating button
  - className: string — additional classes to apply (appended to base classes)

  Behavior notes:
  - Clicking cycles the theme in the order: system -> dark -> light -> system.
  - The component triggers a short, reduced-motion-aware visual pulse when the theme
    changes to provide feedback. If the user prefers reduced motion, the animation is skipped.
  - Keep the icon set minimal here to make it easy to swap for a design system icon later.
*/

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

  // Cycle through theme modes when activated. Keep the mapping explicit so
  // adding more modes in the future is straightforward.
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
