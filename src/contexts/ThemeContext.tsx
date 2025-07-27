import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storage.set('theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (currentTheme: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'couple', 'ocean', 'forest', 'sunset', 'purple', 'rose', 'midnight');
    document.body.classList.remove('couple-theme', 'ocean-theme', 'forest-theme', 'sunset-theme', 'purple-theme', 'rose-theme', 'midnight-theme');
    
    // Add current theme class
    document.documentElement.classList.add(currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Handle dark mode for Tailwind
    if (currentTheme === 'dark' || currentTheme === 'midnight') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Handle couple theme background
    document.body.style.background = '';
    
    switch (currentTheme) {
      case 'couple':
        document.body.classList.add('couple-theme');
        break;
      case 'ocean':
        document.body.classList.add('ocean-theme');
        break;
      case 'forest':
        document.body.classList.add('forest-theme');
        break;
      case 'sunset':
        document.body.classList.add('sunset-theme');
        break;
      case 'purple':
        document.body.classList.add('purple-theme');
        break;
      case 'rose':
        document.body.classList.add('rose-theme');
        break;
      case 'midnight':
        document.body.classList.add('midnight-theme');
        break;
    }
  };

  useEffect(() => {
    // Initialize theme from storage or default
    const savedTheme = storage.get<Theme>('theme') || 'light';
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    // Listen for theme changes from auth context
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail as Theme;
      setThemeState(newTheme);
      applyTheme(newTheme);
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};