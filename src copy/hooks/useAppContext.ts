import { useContext, createContext } from 'react';
import { UserProfile, UserPreferences } from '../types';

export interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, username: string, password: string) => Promise<void>;
  
  // User preferences
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};

export default useAppContext; 