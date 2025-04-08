import React, { useState, useEffect, useCallback } from 'react';
import { AppContext, AppContextType } from '../hooks/useAppContext';
import { UserProfile, UserPreferences } from '../types';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // User preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    fontSize: 'medium',
    showNotifications: true
  });
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    // Check for saved authentication
    const savedAuth = localStorage.getItem('cobra_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setUser(authData.user);
      } catch (error) {
        console.error('Failed to parse auth data', error);
        localStorage.removeItem('cobra_auth');
      }
    }
    
    // Check for saved preferences
    const savedPreferences = localStorage.getItem('cobra_preferences');
    if (savedPreferences) {
      try {
        const prefsData = JSON.parse(savedPreferences);
        setPreferences(prefsData);
      } catch (error) {
        console.error('Failed to parse preferences data', error);
        localStorage.removeItem('cobra_preferences');
      }
    }
    
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = preferences.theme;
    
    if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark-theme');
    }
  }, []);

  // Update theme when preferences change
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = preferences.theme;
    
    if (currentTheme === 'dark' || (currentTheme === 'system' && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark-theme');
    }
    
    // Save preferences to localStorage
    localStorage.setItem('cobra_preferences', JSON.stringify(preferences));
  }, [preferences]);
  
  // Authentication methods
  const login = useCallback(async (email: string, password: string) => {
    // In a real app, this would call an API
    // For now, we'll simulate a successful login with a fake user
    const fakeUser: UserProfile = {
      id: '123',
      username: 'testuser',
      email: email
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update state
    setUser(fakeUser);
    setIsAuthenticated(true);
    
    // Save to localStorage
    localStorage.setItem('cobra_auth', JSON.stringify({ user: fakeUser }));
  }, []);
  
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cobra_auth');
  }, []);
  
  const register = useCallback(async (email: string, username: string, password: string) => {
    // In a real app, this would call an API
    // For now, we'll simulate a successful registration with a fake user
    const fakeUser: UserProfile = {
      id: '123',
      username: username,
      email: email
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Update state
    setUser(fakeUser);
    setIsAuthenticated(true);
    
    // Save to localStorage
    localStorage.setItem('cobra_auth', JSON.stringify({ user: fakeUser }));
  }, []);
  
  // Preferences methods
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);
  
  // Theme methods
  const toggleDarkMode = useCallback(() => {
    updatePreferences({
      theme: preferences.theme === 'dark' ? 'light' : 'dark'
    });
  }, [preferences.theme, updatePreferences]);
  
  // Create context value
  const contextValue: AppContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    preferences,
    updatePreferences,
    isDarkMode,
    toggleDarkMode
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider; 