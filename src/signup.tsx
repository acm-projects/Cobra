import React, { useState, FormEvent } from 'react';
import ReactDOM from 'react-dom';
import { Auth } from './utils/auth';
import { handler } from './awsFunctions.js';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Basic validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Use the Auth utility for sign up
      const signUpResponse = await Auth.signUp(email, password);
      const userId = signUpResponse.UserSub;
      chrome.runtime.sendMessage({type: "sendUserId", data: userId});
      console.log("send auth");
      await chrome.tabs.create({ url: "https://leetcode.com/accounts/login/" });
      console.log("created tab");
      
      //console.log("requested username");
      //chrome.runtime.sendMessage({type: "giveUsernameToSidePanel", data: username});
      //console.log("obtained username: " + username);
      //console.log('Sign up successful, navigating to sidepanel');
      
      // Close the popup if we're in popup mode
      chrome.windows.getCurrent(async (window) => {
        if (window.type === 'popup' && window.id) {
          chrome.windows.remove(window.id);
        }
        
        // Open the sidepanel
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs[0]?.id) {
            chrome.sidePanel.open({tabId: tabs[0].id}).then(() => {
              chrome.sidePanel.setOptions({ path: 'sidepanel.html' });
            });
          }
        });
      });
    } catch (error) {
      console.error('Error during sign up:', error);
      setErrorMessage('An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignIn = () => {
    // Navigate to signin in the same window
    window.location.href = 'signin.html';
  };

  return (
    <div className="signin-page">
      <div className="bg-decoration">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>
      
      <div className="signin-container">
        <div className="container-decoration"></div>
        
        <div className="logo-container">
          <img src="images/cobralogo.png" alt="Cobra - Code smarter, not harder" className="logo" />
          <div className="welcome-text">
            Create your account to get started with Cobra.
          </div>
        </div>
        
        <form id="signup-form" className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {errorMessage && (
            <div id="error-message" style={{ display: 'block' }}>
              {errorMessage}
            </div>
          )}
          
          <div className="button-group">
            <button
              type="submit"
              className="signin-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="login-link">
            Already have an account? <a href="#" onClick={goToSignIn}>Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Render the app
const renderApp = () => {
  const container = document.getElementById('root');
  if (container) {
    ReactDOM.render(<SignUp />, container);
  }
};

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', renderApp);

export default SignUp; 