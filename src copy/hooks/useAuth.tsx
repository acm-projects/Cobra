import { useState, useEffect, useCallback } from 'react';
import { Auth } from '../utils/auth';
import { navigateToPage } from '../utils/navigation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const isAuth = await Auth.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (!isAuth) {
        navigateToPage('signin.html');
      }
      
      return isAuth;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await Auth.signOut();
      setIsAuthenticated(false);
      navigateToPage('signin.html');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    signOut
  };
}; 