import React, { useState, FormEvent } from 'react';
import ReactDOM from 'react-dom';
import { Auth } from './utils/auth';
import LeetCodeLoader from './components/Loading/LeetCodeLoader';
import { signUpUser, signInUser } from "./awsFunctions";

const SignIn: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Use the Auth utility for sign in
      await signInUser(username, password); 
      
      console.log('Authentication successful, redirecting to sidepanel');
      
      // Navigate directly to the sidepanel without showing the loading screen
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

        chrome.runtime.sendMessage({type: "recordUsername", data: username});
      } else {
        // Fallback: redirect to the sidepanel.html
        console.log('No active tab found, redirecting to sidepanel.html');
        window.location.href = 'sidepanel.html';
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      setErrorMessage('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const goToSignUp = () => {
    // Instead of opening a new window, navigate to signup in the same window
    window.location.href = 'signup.html';
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
            Welcome to Cobra, your AI-powered coding assistant.
          </div>
        </div>
        
        <form id="signin-form" className="signin-form" onSubmit={handleSubmit}>
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          
          <div className="login-link">
            Don't have an account? <a href="#" onClick={goToSignUp}>Sign Up</a>
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
    ReactDOM.render(<SignIn />, container);
  }
};

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', renderApp);

export default SignIn; 