import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [cursorEnabled, setCursorEnabled] = useState(() => {
    const saved = localStorage.getItem('customCursor');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const body = window.document.body;
    // We only enable custom cursor on larger desktop screens (min-width: 1024px)
    if (cursorEnabled) {
      body.classList.add('has-custom-cursor');
    } else {
      body.classList.remove('has-custom-cursor');
    }
    localStorage.setItem('customCursor', JSON.stringify(cursorEnabled));
  }, [cursorEnabled]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, cursorEnabled, setCursorEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
