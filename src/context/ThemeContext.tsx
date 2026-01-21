import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or default to dark
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    }
    return true;
  });

  useEffect(() => {
    // Apply theme on mount and when isDark changes
    const html = document.documentElement;
    
    if (isDark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev: boolean) => {
      const newTheme = !prev;
      localStorage.setItem('theme-mode', JSON.stringify(newTheme));
      return newTheme;
    });
  };

  const value: ThemeContextType = { isDark, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
