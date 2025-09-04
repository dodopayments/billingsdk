"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, Theme } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
  previewDarkMode: boolean;
  setPreviewDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]); // Default theme
  const [previewDarkMode, setPreviewDarkMode] = useState<boolean>(false); // Preview-specific dark mode

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    
    // Store theme preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected-theme', theme.name);
    }
  };

  const handleSetPreviewDarkMode = (isDark: boolean) => {
    setPreviewDarkMode(isDark);
    
    // Store preview dark mode preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preview-dark-mode', isDark.toString());
    }
  };

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('selected-theme');
      if (savedTheme) {
        const theme = themes.find(t => t.name === savedTheme);
        if (theme) {
          setCurrentTheme(theme);
        }
      }
      
      const savedDarkMode = localStorage.getItem('preview-dark-mode');
      if (savedDarkMode) {
        // If user has previously set a preference, use it
        setPreviewDarkMode(savedDarkMode === 'true');
      } else {
        // If no preference saved, default to light mode for preview
        setPreviewDarkMode(false);
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      themes, 
      previewDarkMode, 
      setPreviewDarkMode: handleSetPreviewDarkMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
