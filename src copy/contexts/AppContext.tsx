import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import usePreferences from '../hooks/usePreferences';
import { SectionType } from '../types';

interface AppContextType {
  auth: ReturnType<typeof useAuth>;
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const preferences = usePreferences();
  
  const { 
    activeSection, 
    setActiveSection,
    darkMode: isDarkMode,
    toggleDarkMode,
    sidebarExpanded,
    toggleSidebar
  } = preferences;

  const value: AppContextType = {
    auth,
    activeSection,
    setActiveSection,
    isDarkMode,
    toggleDarkMode,
    sidebarExpanded,
    toggleSidebar
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 