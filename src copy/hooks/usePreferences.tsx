import { useState, useEffect } from 'react';
import { SectionType } from '../types';

interface Preferences {
  darkMode: boolean;
  fontSize: string;
  activeSection: SectionType;
  sidebarExpanded: boolean;
}

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    darkMode: false,
    fontSize: 'medium',
    activeSection: 'dashboard' as SectionType,
    sidebarExpanded: true
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('cobra_preferences');
    if (savedPreferences) {
      try {
        const parsedPrefs = JSON.parse(savedPreferences);
        setPreferences(prev => ({
          ...prev,
          ...parsedPrefs
        }));
      } catch (error) {
        console.error('Failed to parse preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cobra_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Utility functions to update preferences
  const toggleDarkMode = () => {
    setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setFontSize = (size: string) => {
    setPreferences(prev => ({ ...prev, fontSize: size }));
  };

  const setActiveSection = (section: SectionType) => {
    setPreferences(prev => ({ ...prev, activeSection: section }));
  };

  const toggleSidebar = () => {
    setPreferences(prev => ({ ...prev, sidebarExpanded: !prev.sidebarExpanded }));
  };

  return {
    ...preferences,
    toggleDarkMode,
    setFontSize,
    setActiveSection,
    toggleSidebar
  };
};

export default usePreferences; 