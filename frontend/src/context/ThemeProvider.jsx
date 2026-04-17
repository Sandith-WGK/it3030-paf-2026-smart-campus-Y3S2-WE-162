import React, { useState, useEffect, useCallback } from 'react';
import { ThemeContext } from './ThemeContext';
import { useAuth } from './AuthContext';
import { userService } from '../services/api/userService';

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
      const nextTheme = backendPrefs.theme || 'SYSTEM';

      // Only update theme if it actually changed
      setThemeState((prev) => (prev === nextTheme ? prev : nextTheme));

      const newPrefs = {
        enableSounds: backendPrefs.enableSounds ?? true,
        enableEmailNotifications: backendPrefs.enableEmailNotifications ?? true,
        enablePushNotifications: backendPrefs.enablePushNotifications ?? true
      };
      
      // Only update prefs if they actually changed
      setPreferences((prev) => {
        const same =
          prev.enableSounds === newPrefs.enableSounds &&
          prev.enableEmailNotifications === newPrefs.enableEmailNotifications &&
          prev.enablePushNotifications === newPrefs.enablePushNotifications;

        if (same) return prev;
        localStorage.setItem('user_prefs', JSON.stringify(newPrefs));
        return newPrefs;
      });
    }
  }, [isAuthenticated, user]);

  const updatePreferences = useCallback(async (updates) => {
    const newTheme = updates.theme || theme;
    const newPrefs = { ...preferences, ...updates, theme: newTheme };
    
    // Update local state first
    setPreferences(newPrefs);
    localStorage.setItem('user_prefs', JSON.stringify(newPrefs));
    if (updates.theme) setThemeState(updates.theme);

    if (isAuthenticated && user?.userId) {
       try {
         await userService.updatePreferences(user.userId, updates);
       } catch (error) {
         console.error('Failed to sync preferences to backend:', error);
       }
    }
  }, [preferences, isAuthenticated, user, theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    if (isAuthenticated && user?.userId) {
      userService.updatePreferences(user.userId, { theme: newTheme }).catch(err => console.error(err));
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
