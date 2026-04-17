import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/api/userService';

const ThemeContext = createContext({
  theme: 'SYSTEM',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  preferences: {}
});

export const ThemeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // 1. Initial theme load (Synchronous from localStorage to avoid flash)
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme') || 'SYSTEM';
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('user_prefs');
    return saved ? JSON.parse(saved) : {
      enableSounds: true,
      enableEmailNotifications: true,
      enablePushNotifications: true
    };
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Sync theme to localStorage immediately when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle theme application and system preference listening
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (t) => {
      let resolved = t;
      if (t === 'SYSTEM') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
      }
      
      if (resolved === 'DARK') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setResolvedTheme(resolved.toLowerCase());
    };

    applyTheme(theme);

    // Listen for system changes if mode is SYSTEM
    if (theme === 'SYSTEM') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('SYSTEM');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Sync preferences from user object (passed from AuthContext)
  useEffect(() => {
    if (isAuthenticated && user?.preferences) {
      const backendPrefs = user.preferences;
      setThemeState(backendPrefs.theme || 'SYSTEM');
      
      const newPrefs = {
        enableSounds: backendPrefs.enableSounds ?? true,
        enableEmailNotifications: backendPrefs.enableEmailNotifications ?? true,
        enablePushNotifications: backendPrefs.enablePushNotifications ?? true
      };
      setPreferences(newPrefs);
      localStorage.setItem('user_prefs', JSON.stringify(newPrefs));
    }
  }, [isAuthenticated, user]);

  const updatePreferences = useCallback(async (updates) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    localStorage.setItem('user_prefs', JSON.stringify(newPrefs));

    if (isAuthenticated && user?.id) {
       try {
         await userService.updatePreferences(user.id, {
           ...updates,
           theme: updates.theme || theme
         });
       } catch (error) {
         console.error('Failed to sync preferences to backend:', error);
       }
    }
  }, [preferences, isAuthenticated, user, theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    if (isAuthenticated && user?.id) {
      userService.updatePreferences(user.id, { theme: newTheme }).catch(err => console.error(err));
    }
  }, [isAuthenticated, user]);

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'LIGHT' : 'DARK';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme, 
      setTheme, 
      toggleTheme, 
      preferences,
      updatePreferences
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
