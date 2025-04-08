import React, { useState, FormEvent } from 'react';
import ReactDOM from 'react-dom';
import { Auth } from './utils/auth';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
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
      await Auth.signUp(username, email, password);
      
      console.log('Sign up successful, navigating to sidepanel');
      
      // Simplified approach for getting to the sidepanel after signup
      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      if (tabs.length > 0 && tabs[0].id) {
        // We have an active tab, open the sidepanel on it
        console.log('Opening sidepanel on tab:', tabs[0].id);
        await chrome.sidePanel.open({tabId: tabs[0].id});
        
        // Explicitly set the sidepanel path to sidepanel.html
        console.log('Setting sidepanel path to sidepanel.html');
        await chrome.sidePanel.setOptions({
          path: 'sidepanel.html'
        });
        
        // If we're in a popup, close it
        const currentWindow = await chrome.windows.getCurrent();
        if (currentWindow.type === 'popup' && currentWindow.id) {
          console.log('Closing popup window');
          await chrome.windows.remove(currentWindow.id);
        }
      } else {
        // Fallback: redirect to the sidepanel.html
        console.log('No active tab found, redirecting to sidepanel.html');
        window.location.href = 'sidepanel.html';
      }
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
            <i className="fas fa-user"></i>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
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