const AUTH_KEY = 'cobra_auth';

class Auth {
  static isAuthenticated() {
    return new Promise((resolve) => {
      chrome.storage.local.get([AUTH_KEY], (result) => {
        resolve(!!result[AUTH_KEY]);
      });
    });
  }

  static async signIn(email, password) {
    if (email && password) {
      await chrome.storage.local.set({
        [AUTH_KEY]: {
          email,
          timestamp: Date.now()
        }
      });
      return true;
    }
    return false;
  }

  static async signOut() {
    try {
      await chrome.storage.local.remove([AUTH_KEY]);
      return true;
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    return new Promise((resolve) => {
      chrome.storage.local.get([AUTH_KEY], (result) => {
        resolve(result[AUTH_KEY] || null);
      });
    });
  }

  static async checkAuth() {
    const isAuth = await this.isAuthenticated();
    const currentPath = window.location.pathname;
    const isSignInPage = currentPath.includes('signin.html');

    if (!isAuth && !isSignInPage) {
      window.location.href = 'signin.html';
    } else if (isAuth && isSignInPage) {
      window.location.href = 'sidepanel.html';
    }
  }
} 