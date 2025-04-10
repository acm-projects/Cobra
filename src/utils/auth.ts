import { signUpUser, signInUser, signOutUser } from "../awsFunctions";

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
  static signUp(username: string, email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const response = await signUpUser("testUser", password, email);
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
    return new Promise((resolve, reject) => {
      try {
        const response = await signInUser(email, password); // USERNAME
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
} 