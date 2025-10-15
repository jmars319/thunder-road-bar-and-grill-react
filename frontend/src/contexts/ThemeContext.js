import React, { createContext, useEffect, useState } from 'react';

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
      return 'system';
    }
  });

  // Apply theme by toggling a data attribute on <html>
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

    try { localStorage.setItem('site-theme', theme); } catch (e) {}
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
