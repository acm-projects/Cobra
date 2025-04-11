import { signUpUser, signInUser, signOutUser, verifyEmail } from "../awsFunctions";

export class Auth {
  /**
   * Check if the user is authenticated
   * @returns {Promise<boolean>} Whether the user is authenticated
   */
  static isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(['isAuthenticated'], (result) => {
          if (chrome.runtime.lastError) {
            console.error('Error accessing storage:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(!!result.isAuthenticated);
        });
      } catch (error) {
        console.error('Error in isAuthenticated:', error);
        reject(error);
      }
    });
  }

  /**
   * Sign up a new user
   * @param {string} username - The user's username
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @returns {Promise<boolean>} Whether the sign up was successful
   */
  static signUp(username: string, email: string, password: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        const response = await signUpUser(username, email, password);
        resolve(response);
        } catch (error) {
        console.error('Error in signUp:', error);
        reject(error);
      }
    });
  }

  /**
   * Sign in the user
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise<boolean>} Whether the sign in was successful
   */
  static signIn(username: string, password: string): Promise<boolean> {
    return new Promise(async(resolve, reject) => {
      try {
        const response = await signInUser(username, password); // USERNAME
        console.log("sign in successful. response: " + response);
        resolve(true);
      } catch (error) {
        console.log("sign in failed. error: " + error);
        reject(false);
      }
    });
  }

  /**
   * Sign out the user
   * @returns {Promise<boolean>} Whether the sign out was successful
   */
  static signOut(): Promise<boolean> {
    return new Promise(async(resolve, reject) => {
      try {
        await signOutUser();
        resolve(true)
      } catch (error) {
        console.error("Signout failed: " + error);
        reject(false);
      }
    });
  }

  /**
   * Verify an email with the provided verification code
   * @param email The email to verify
   * @param code The 6-digit verification code
   * @returns Promise that resolves to true if verification was successful
   */
  static async verifyEmail(username: string, code: string): Promise<boolean> {
    try {
      console.log(`Verifying user ${username} with code ${code}`);
      
      // Simulate API call
      await new Promise(async() => verifyEmail(username, code));
      
      const success = true;
      
      if (success) {
        // Save verification status
        localStorage.setItem('username', username);
        localStorage.setItem('isVerified', 'true');
      }
      
      return success;
    } catch (error) {
      console.error('Email verification error:', error);
      return false;
    }
  }

  /**
   * Resend a verification code to the specified email
   * @param email The email to send the verification code to
   * @returns Promise that resolves when the code is sent
   */
  static async resendVerificationCode(email: string): Promise<void> {
    try {
      // In a real app, this would make an API call to resend the code
      console.log(`Resending verification code to ${email}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would trigger a new code being sent from the backend
      console.log('Verification code resent successfully');
    } catch (error) {
      console.error('Failed to resend verification code:', error);
      throw error;
    }
  }

  /**
   * Check if a user is verified
   * @returns boolean indicating if the user is verified
   */
  static isUserVerified(): boolean {
    return localStorage.getItem('isVerified') === 'true';
  }

  /**
   * Get the current user's email
   * @returns The user's email or null if not logged in
   */
  static getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
} 