import { createContext, useEffect, useState } from 'react';

/*
  ThemeContext

  Purpose:
  - Provide a simple theme store for the app with three modes: 'light', 'dark', and 'system'.
  - Persist the user's explicit choice in localStorage (when available).
  - Apply the chosen theme by setting a `data-theme` attribute on the <html> element so
    CSS variables and utility classes can respond to the runtime theme.

  API (ThemeContext value):
  - theme: one of 'light' | 'dark' | 'system'
  - setTheme: function to change the theme (e.g., setTheme('dark'))

  Usage example:
    import { useContext } from 'react';
    import { ThemeContext } from '../contexts/ThemeContext';

    function MyComponent() {
      const { theme, setTheme } = useContext(ThemeContext);
      return <button onClick={() => setTheme('dark')}>Dark</button>;
    }

  Notes:
  - 'system' leaves control to the user's OS/browser preference by removing the
    `data-theme` attribute; CSS should use media queries (prefers-color-scheme)
    or rely on the absence of data-theme to apply the system theme.
  - The provider is intentionally lightweight — it only stores a string and side-effects
    by toggling a single HTML attribute. Keep logic here minimal to avoid hydration issues.
*/

export const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {}
});

export function ThemeProvider({ children }) {
  // 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('site-theme');
      return stored || 'system';
    } catch (e) {
      // If localStorage is not available (SSR or private browsing), fall back to 'system'.
      return 'system';
    }
  });

  // Apply theme by toggling a data attribute on <html>.
  // We keep this effect minimal: set/remove attribute and persist choice.
  useEffect(() => {
    const root = document.documentElement;

    const apply = (t) => {
      if (t === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', t);
      }
    };

    apply(theme);

    try { localStorage.setItem('site-theme', theme); } catch (_e) {
      // ignore storage errors silently — app still functions without persistence
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
