import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Auth } from './utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import './hints.css';

// Import the VerificationPage component directly
import VerificationPage from './components/VerificationPage';

// Type definitions
interface NavigateMessage {
  type: 'navigate';
  windowId?: number;
  path: string;
}

interface WindowSize {
  size: 'compact' | 'medium' | 'expanded';
  width?: number;
  height?: number;
}

// Extending Chrome Window interface
declare global {
  interface Window {
    close(): void;
  }
}

// Extending Chrome API types
interface ChromeSidePanel extends chrome.sidePanel.SidePanel {
  close(): Promise<void>;
}

// Main App Component
const SidePanel: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Verification state
  const [showVerification, setShowVerification] = useState<boolean>(false);
  
  // Loading states after verification
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLeetCodeLoader, setShowLeetCodeLoader] = useState<boolean>(false);
  const [isLeetCodeLoggedIn, setIsLeetCodeLoggedIn] = useState<boolean>(false);
  const [isLeetCodeLoading, setIsLeetCodeLoading] = useState<boolean>(true);
  
  // UI state
  const [activeSection, setActiveSection] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [windowSize, setWindowSize] = useState<WindowSize['size']>('medium');
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  
  // Chat state
  const [messageText, setMessageText] = useState<string>('');
  const chatInputRef = useRef<HTMLInputElement>(null);

  // New settings
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [defaultView, setDefaultView] = useState<string>('home');
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [dataCollection, setDataCollection] = useState<boolean>(true);
  const [timerSound, setTimerSound] = useState<string>('bell');
  const [timerVolume, setTimerVolume] = useState<number>(80);
  
  // Timer state
  const [timerType, setTimerType] = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerValue, setTimerValue] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [countdownMinutes, setCountdownMinutes] = useState<number>(0);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5);
  
  // Refs
  const timerIntervalRef = useRef<number | null>(null);
  const timerStartTimeRef = useRef<number>(0);
  const timerPausedValueRef = useRef<number>(0);
  
  // Check authentication on component mount
  useEffect(() => {
    // Load Font Awesome if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(fontAwesomeLink);
    }
    
    const checkAuth = async () => {
      try {
        const isAuthenticated = await Auth.isAuthenticated();
        setIsAuthenticated(isAuthenticated);
        
        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const verifiedParam = urlParams.get('verified') === 'true';
        
        // If verified via URL parameter, make sure it's set in localStorage
        if (verifiedParam) {
          localStorage.setItem('isVerified', 'true');
          localStorage.removeItem('needsVerification');
          localStorage.removeItem('showVerificationInSidepanel');
        }
        
        // Check if verification is needed (but skip if we have the verified param)
        const needsVerification = !verifiedParam && 
                                 (localStorage.getItem('needsVerification') === 'true' || 
                                  localStorage.getItem('showVerificationInSidepanel') === 'true');
                                  
        // If verification is needed, show the verification page
        if (needsVerification) {
          console.log('User needs verification, showing verification page');
            
          setShowVerification(true);
          return; // Skip other checks if verification is needed
        }
        
        if (!isAuthenticated) {
          // If not authenticated, navigate to signin
          const window = await chrome.windows.getCurrent();
          if (window.id) {
            chrome.runtime.sendMessage({
              type: 'navigate',
              windowId: window.id,
              path: 'signin.html'
            } as NavigateMessage);
          }
        } else {
          // Parse URL parameters for loading flag
          const loadingParam = urlParams.get('loading');
          const justVerifiedParam = urlParams.get('justVerified');
          
          // Also check localStorage as fallback
          const showLoading = loadingParam === 'true' || 
                              justVerifiedParam === 'true' || 
                              localStorage.getItem('showLoadingOnSidepanel') === 'true' ||
                              localStorage.getItem('justVerified') === 'true';
                              
          // Clear URL parameters if they exist
          if (loadingParam || justVerifiedParam || verifiedParam) {
            const url = new URL(window.location.href);
            url.searchParams.delete('loading');
            url.searchParams.delete('justVerified');
            url.searchParams.delete('verified');
            url.searchParams.delete('inSidepanel');
            window.history.replaceState({}, document.title, url.toString());
          }
          
          if (showLoading) {
            console.log('Showing loading screen in sidepanel');
            
            // Clear localStorage flags
            localStorage.removeItem('showLoadingOnSidepanel');
            localStorage.removeItem('justVerified');
            
            // Show loading process
            setIsLoading(true);
            setShowLeetCodeLoader(true);
            
            // Simulate checking LeetCode login
            setTimeout(() => {
              setIsLeetCodeLoggedIn(true);
              console.log('LeetCode login simulation complete');
              
              // Simulate fetching statistics
              setTimeout(() => {
                setIsLeetCodeLoading(false);
                console.log('LeetCode statistics fetched');
                
                // After a brief delay, hide the loader
                setTimeout(() => {
                  setShowLeetCodeLoader(false);
                  setIsLoading(false);
                  console.log('Loading screen complete');
                }, 1000);
              }, 2000);
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    
    checkAuth();
    
    // Load saved preferences
    const savedSize = localStorage.getItem('windowSize') as WindowSize['size'] || 'medium';
    setWindowSize(savedSize);
    
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const savedView = localStorage.getItem('defaultView') || 'home';
    setDefaultView(savedView);
    setActiveSection(savedView);
    
    // Load font size preference
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' || 'medium';
    setFontSize(savedFontSize);
    document.documentElement.style.fontSize = 
      savedFontSize === 'small' ? '14px' : 
      savedFontSize === 'large' ? '18px' : '16px';
    
    // Load animation preference
    const animationsState = localStorage.getItem('animationsEnabled') !== 'false';
    setAnimationsEnabled(animationsState);
    document.documentElement.setAttribute('data-animations', animationsState.toString());
    
    // Load notification preference
    const notificationsState = localStorage.getItem('notificationsEnabled') !== 'false';
    setNotificationsEnabled(notificationsState);
    
    // Load data collection preference
    const dataCollectionState = localStorage.getItem('dataCollection') !== 'false';
    setDataCollection(dataCollectionState);
    
    // Load timer sound preference
    const savedTimerSound = localStorage.getItem('timerSound') || 'bell';
    setTimerSound(savedTimerSound);
    
    // Load timer volume preference
    const savedTimerVolume = parseInt(localStorage.getItem('timerVolume') || '80');
    setTimerVolume(savedTimerVolume);
    
    // Preload audio files for timer sounds
    const sounds = ['bell', 'digital', 'gentle', 'alarm'];
    sounds.forEach(sound => {
      const audio = new Audio(chrome.runtime.getURL(`sounds/timer-${sound}.mp3`));
      audio.preload = 'auto';
      // Just triggering the load without playing
      audio.load();
      console.log(`Preloaded sound: ${sound}`);
    });
    
    // Load sidebar expanded state
    const sidebarState = localStorage.getItem('sidebarExpanded') === 'true';
    setSidebarExpanded(sidebarState);
    
    // Apply necessary styles for proper section display
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      body {
        width: 100%;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #0A0B1E;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        color: #ffffff;
      }
      
      .container {
        height: 100vh;
        display: flex;
        background-color: #0A0B1E;
        max-width: 100%;
        margin: 0;
        padding: 0;
        position: relative;
      }
      
      .container.loading .main-content {
        filter: blur(4px);
        pointer-events: none;
      }
      
      .container.loading .nav-sidebar {
        filter: blur(4px);
        pointer-events: none;
      }
      
      /* LeetCode Loader Styles */
      .leetcode-loader-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(10, 11, 30, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
      }
      
      .leetcode-loader-container {
        width: 100%;
        max-width: 460px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      
      .leetcode-loader-card {
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      }
      
      .loader-header {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        background-color: rgba(139, 92, 246, 0.1);
        border-bottom: 1px solid rgba(139, 92, 246, 0.2);
      }
      
      .loader-header i {
        color: #8B5CF6;
        font-size: 18px;
        margin-right: 12px;
      }
      
      .loader-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: white;
      }
      
      .loader-content {
        padding: 32px 24px;
        text-align: center;
      }
      
      .spinner-container {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }
      
      .spinner {
        width: 48px;
        height: 48px;
        border: 3px solid rgba(139, 92, 246, 0.2);
        border-top-color: #8B5CF6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      
      .loading-message {
        font-size: 16px;
        font-weight: 600;
        color: white;
        margin-bottom: 8px;
      }
      
      .loader-disclaimer {
        font-size: 14px;
        color: #94a3b8;
        line-height: 1.5;
        margin-bottom: 8px;
      }
      
      .completed-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #10b981;
      }
      
      .completed-message i {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      .completed-message p {
        font-size: 16px;
        font-weight: 600;
      }
      
      .loader-footer {
        padding: 16px 24px;
        background-color: rgba(0, 0, 0, 0.1);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .privacy-note {
        font-size: 12px;
        color: #94a3b8;
        text-align: center;
        margin: 0;
      }
      
      .nav-sidebar {
        width: 48px;
        min-width: 48px;
        background-color: rgba(255, 255, 255, 0.03);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 6px;
        transition: all 0.3s ease;
        position: relative;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        height: 100vh;
      }
      
      .nav-sidebar.expanded {
        width: 200px;
        min-width: 200px;
      }
      
      .sidebar-logo {
        width: 100%;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-bottom: 20px;
      }
      
      .icon-logo {
        width: 28px;
        height: 28px;
        opacity: 1;
        transition: all 0.3s ease;
        position: absolute;
      }
      
      .full-logo {
        width: 0;
        opacity: 0;
        height: 28px;
        transition: all 0.3s ease;
        object-fit: contain;
      }
      
      .nav-sidebar.expanded .icon-logo {
        opacity: 0;
        width: 0;
      }
      
      .nav-sidebar.expanded .full-logo {
        width: 160px;
        opacity: 1;
      }
      
      .nav-item {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 6px 0;
        color: #94a3b8;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
      }
      
      .nav-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
      }
      
      .nav-item.active {
        background-color: #8B5CF6;
        color: white;
      }
      
      .nav-sidebar.expanded .nav-item {
        width: 160px;
        justify-content: flex-start;
        padding-left: 12px;
      }
      
      .nav-label {
        margin-left: 10px;
        font-size: 13px;
      }
      
      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
        padding: 16px;
        box-sizing: border-box;
        background-color: rgba(10, 11, 30, 0.4);
      }
      
      .content-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
      }
      
      .section {
        flex: 1;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .section.active {
        display: flex;
        flex-direction: column;
        opacity: 1;
      }
      
      .dashboard-welcome {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 16px;
        color: white;
      }
      
      .dashboard-subtitle {
        font-size: 14px;
        color: #94a3b8;
        margin-bottom: 24px;
        line-height: 1.4;
      }
      
      .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      }
      
      .tool-button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 12px;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .tool-button i {
        font-size: 18px;
        color: #8B5CF6;
      }
      
      .tool-button span {
        font-size: 13px;
        font-weight: 500;
      }
      
      .dashboard-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
      }
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .card-header i {
        color: #8B5CF6;
        font-size: 16px;
      }
      
      .card-header h3 {
        font-size: 15px;
        font-weight: 600;
        margin: 0;
      }
      
      .problem-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        border-radius: 8px;
        margin-bottom: 6px;
        transition: all 0.2s ease;
      }
      
      .problem-title {
        font-size: 13px;
        color: #e2e8f0;
      }
      
      .problem-status {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: 500;
      }
      
      .problem-status.success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      
      .problem-status.failed {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
      
      .section { 
        display: none; 
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .section.active { 
        display: block; 
        opacity: 1;
      }
      
      .sidebar-toggle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        color: #94a3b8;
        cursor: pointer;
        margin: 10px 0;
        position: relative;
        left: 0;
        transition: all 0.3s ease;
      }
      
      .nav-sidebar.expanded .sidebar-toggle {
        left: 75px; /* This will position it more to the center when expanded */
      }
      
      .sidebar-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
      
      /* Additional styling for section contents */
      .settings-container, .hints-container, .resources-container, .errors-container {
        padding: 16px;
        overflow-y: auto;
        max-height: calc(100vh - 120px);
      }
      
      .settings-section {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
        transition: all 0.3s ease;
        width: 100%;
        box-sizing: border-box;
      }
      
      .setting-item {
        margin-bottom: 16px;
      }
      
      h3 {
        margin: 0 0 16px 0;
        color: white;
        font-size: 18px;
        font-weight: 600;
      }
      
      .search-container {
        position: relative;
        margin-bottom: 24px;
      }
      
      .search-input {
        width: 100%;
        padding: 12px 16px 12px 40px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: white;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      
      .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 16px;
      }
      
      .difficulty-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
      }
      
      .tab-button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px 16px;
        color: #94a3b8;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .tab-button.active {
        background: rgba(139, 92, 246, 0.15);
        border-color: #8B5CF6;
        color: white;
      }
      
      .timer-container {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
      }
      
      .timer-type-selector {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }
      
      .timer-type-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px 16px;
        color: #94a3b8;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .timer-type-btn.active {
        background: rgba(139, 92, 246, 0.15);
        border-color: #8B5CF6;
        color: white;
      }
      
      .timer-display {
        font-size: 32px;
        text-align: center;
        margin: 20px 0;
        font-weight: 600;
      }
      
      .btn-primary {
        background: #8B5CF6;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .btn-primary:hover {
        background: #7c4dff;
        transform: translateY(-2px);
      }
      
      .window-size-options, .countdown-controls, .timer-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 16px;
      }
      
      .theme-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      
      .theme-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .timer-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px 16px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .timer-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .timer-btn.start {
        background: #10b981;
        border-color: #059669;
      }
      
      .timer-btn.pause {
        background: #f59e0b;
        border-color: #d97706;
      }
      
      .timer-btn.reset {
        background: #ef4444;
        border-color: #dc2626;
      }
      
      .radio-option {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      input[type="number"] {
        width: 60px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: white;
      }
      
      /* Dashboard Styles */
      .dashboard {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-width: 1000px;
        margin: 0 auto;
        position: relative;
      }
      
      .dashboard::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.05), transparent 70%);
        z-index: 0;
        pointer-events: none;
      }
      
      .dashboard-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 1;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }
      
      .dashboard-card:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
        border-color: rgba(139, 92, 246, 0.3);
      }
      
      .card-header {
        padding: 20px;
        background: rgba(20, 20, 40, 0.5);
        border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .card-header i {
        color: #8B5CF6;
        font-size: 20px;
      }
      
      .card-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: white;
      }
      
      .card-content {
        padding: 20px;
      }
      
      .current-problem.dashboard-card {
        background: linear-gradient(180deg, rgba(20, 20, 40, 0.5) 0%, rgba(30, 30, 60, 0.5) 100%);
        border-left: 4px solid #8B5CF6;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      
      .stat-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
      }
      
      .stat-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #8B5CF6, #6D28D9);
        border-radius: 2px;
      }
      
      .stat-value {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 8px;
        background: linear-gradient(90deg, #8B5CF6, #6D28D9);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .stat-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      .tools-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        padding: 20px;
      }
      
      .tool-button {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .tool-button i {
        font-size: 24px;
      }
      
      .tool-button span {
        font-size: 14px;
      }
      
      .tool-button.hints i {
        color: #fbbf24;
      }
      
      .tool-button.resources i {
        color: #10b981;
      }
      
      .tool-button.errors i {
        color: #ef4444;
      }
      
      .tool-button.chat i {
        color: #60a5fa;
      }
      
      .problem-item {
        display: flex;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.3s ease;
      }
      
      .problem-item:last-child {
        border-bottom: none;
      }
      
      .problem-title {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
      }
      
      .problem-status {
        font-size: 13px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
      }
      
      .problem-status.success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      
      .problem-status.failed {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
      
      /* Hint Card Styles */
      .hint-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        margin-bottom: 24px;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .hint-card.blurred .hint-content {
        filter: blur(5px);
        user-select: none;
        pointer-events: none;
        position: relative;
      }
      
      .hint-reveal-wrapper {
        position: relative;
      }
      
      .hint-reveal-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 92, 246, 0.2);
        border: 1px solid rgba(139, 92, 246, 0.4);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 2;
      }
      
      .hint-reveal-button:hover {
        background: rgba(139, 92, 246, 0.3);
        transform: translate(-50%, -50%) scale(1.05);
      }
      
      .hints-container {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
      }
      
      .hints-header {
        margin-bottom: 24px;
      }
      
      .hints-header h2 {
        color: white;
        font-size: 24px;
        margin-bottom: 8px;
      }
      
      .hints-description {
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .difficulty-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        background: rgba(255, 255, 255, 0.03);
        padding: 8px;
        border-radius: 12px;
      }
      
      .hint-category {
        margin-bottom: 32px;
      }
      
      .hint-category h3 {
        font-size: 20px;
        margin-bottom: 16px;
        color: #8B5CF6;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .hint-category h3 i {
        font-size: 18px;
      }
      
      .hint-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
        gap: 24px;
      }
      
      /* Fix the overlapping issues in the hints cards layout */
      .hint-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        width: 100%;
        box-sizing: border-box;
      }
      
      .hint-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .hint-title {
        font-weight: 600;
        color: white;
        font-size: 16px;
      }
      
      .hint-badge {
        background: rgba(139, 92, 246, 0.1);
        color: #8B5CF6;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .hint-content {
        padding: 16px;
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.6;
      }
      
      .hint-code-snippet {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: hidden;
        margin-top: 12px;
      }
      
      .hint-code-snippet pre {
        margin: 0;
        padding: 16px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: monospace;
        font-size: 13px;
        line-height: 1.5;
        color: #e2e8f0;
      }
      
      /* Resource Styles */
      .resource-section {
        margin-bottom: 32px;
      }
      
      .resource-section-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 16px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }
      
      /* Updated styles for resource grid */
      .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        width: 100%;
      }
      
      .resource-card {
        width: 100%;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        position: relative;
        transition: all 0.2s ease;
      }
      
      .resource-icon {
        width: 40px;
        height: 40px;
        background: rgba(139, 92, 246, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      }
      
      .resource-icon i {
        color: #8B5CF6;
        font-size: 20px;
      }
      
      .resource-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(139, 92, 246, 0.1);
        color: #8B5CF6;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
      }
      
      .resource-card h3 {
        font-size: 16px;
        margin: 0 0 8px 0;
      }
      
      .resource-meta {
        display: flex;
        justify-content: space-between;
        margin: 12px 0;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 12px;
        color: #94a3b8;
      }
      
      .resource-action {
        width: 100%;
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: 8px;
        color: #8B5CF6;
        padding: 8px 0;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      
      /* Error Analysis Styles */
      .error-filters, .resource-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
        padding-bottom: 8px;
      }
      
      .error-filter-btn, .resource-category-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 6px 12px;
        color: #94a3b8;
        font-size: 14px;
        cursor: pointer;
        white-space: nowrap;
      }
      
      .error-filter-btn.active, .resource-category-btn.active {
        background: rgba(139, 92, 246, 0.1);
        border-color: #8B5CF6;
        color: white;
      }
      
      .error-summary {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 24px;
        gap: 10px;
      }
      
      .error-stat {
        flex: 1;
        min-width: 120px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
      }
      
      .error-number {
        font-size: 24px;
        font-weight: 600;
        color: #8B5CF6;
        display: block;
        margin-bottom: 4px;
      }
      
      .error-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        margin-bottom: 16px;
        overflow: hidden;
        max-width: 100%;
        box-sizing: border-box;
      }
      
      .error-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        gap: 8px;
      }
      
      .error-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 80%;
      }
      
      .error-icon {
        color: #ef4444;
      }
      
      .error-title {
        word-break: break-word;
        overflow-wrap: anywhere;
        font-weight: 600;
        color: white;
      }
      
      .error-severity {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
      }
      
      .error-severity.high {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
      
      .error-details {
        padding: 16px;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
      
      .error-location {
        font-size: 14px;
        color: #94a3b8;
        margin-bottom: 12px;
      }
      
      /* Improve code snippets to prevent overflow */
      .error-code, .error-fix-code {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        margin: 12px 0;
        max-width: 100%;
        overflow-x: auto;
        box-sizing: border-box;
      }
      
      .error-code pre, .error-fix-code pre {
        margin: 0;
        padding: 12px;
        white-space: pre-wrap;
        word-break: break-word;
        width: 100%;
        box-sizing: border-box;
      }
      
      .error-code code, .error-fix-code code {
        display: block;
        max-width: 100%;
        overflow-wrap: break-word;
      }
      
      /* Chat Styles */
      .chat-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 32px); /* Adjust to account for padding */
        background-color: rgba(10, 11, 30, 0.4);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: none;
        width: 100%;
        margin: 0 auto;
      }
      
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 0;
      }
      
      .chat-actions {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px;
        background-color: rgba(255, 255, 255, 0.02);
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .chat-input {
        display: flex;
        gap: 8px;
        align-items: flex-end;
        padding: 0 4px;
      }
      
      .input-wrapper {
        flex: 1;
        position: relative;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 8px 8px 8px 12px;
        transition: all 0.2s ease;
      }
      
      .chat-input-field {
        width: 100%;
        background: transparent;
        border: none;
        color: white;
        font-size: 14px;
        resize: none;
        outline: none;
        max-height: 80px;
        padding-right: 40px;
        line-height: 1.4;
      }
      
      .input-buttons {
        position: absolute;
        right: 8px;
        bottom: 50%;
        transform: translateY(50%);
        display: flex;
        gap: 6px;
      }
      
      .action-button {
        background: transparent;
        border: none;
        color: #94a3b8;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        padding: 0;
      }
      
      .chat-send-button {
        width: 32px;
        height: 32px;
        border-radius: 16px;
        background-color: #8B5CF6;
        color: white;
        margin-bottom: 4px;
      }
      
      .chat-send-button:hover {
        background-color: #7c3aed;
        transform: translateY(-1px);
      }
      
      .chat-footer {
        padding: 4px 8px;
        font-size: 10px;
        color: #94a3b8;
        text-align: center;
      }
      
      .chat-header {
        padding: 12px;
        background: rgba(20, 20, 40, 0.6);
        border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        backdrop-filter: blur(10px);
        position: relative;
        z-index: 10;
      }
      
      .chat-header h3 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        color: white;
      }
      
      .chat-header i {
        color: #8B5CF6;
        font-size: 16px;
      }
      
      .status-badge {
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 20px;
        margin-left: 10px;
        font-weight: normal;
        letter-spacing: 0.5px;
      }
      
      .status-badge.online {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      
      .message {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        max-width: 85%;
        margin: 2px 0;
        animation: fadeIn 0.3s ease;
      }
      
      .message.user {
        margin-left: auto;
        flex-direction: row-reverse;
      }
      
      .message.assistant {
        margin-right: auto;
      }
      
      .message-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .message-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .message-content {
        padding: 8px 12px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.4;
        position: relative;
      }
      
      .message.user .message-content {
        background-color: #8B5CF6;
        color: white;
        border-bottom-right-radius: 4px;
        margin-right: 4px;
      }
      
      .message.assistant .message-content {
        background-color: rgba(255, 255, 255, 0.05);
        color: #e2e8f0;
        border-bottom-left-radius: 4px;
        margin-left: 4px;
      }
      
      .message-text {
        margin: 0;
      }
      
      .message-time {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 4px;
        display: block;
      }
      
      .message.user .message-time {
        text-align: right;
      }
      
      /* Suggestion chips */
      .suggestion-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
      }
      
      .suggestion-chip {
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: #a78bfa;
        border-radius: 20px;
        padding: 8px 14px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      
      .chat-input-container {
        padding: 8px 12px;
        background: rgba(20, 20, 40, 0.6);
        border-top: 1px solid rgba(139, 92, 246, 0.2);
        display: flex;
        gap: 10px;
        align-items: center;
        backdrop-filter: blur(10px);
        position: relative;
        z-index: 10;
        margin-top: auto;
        margin-bottom: 0;
        height: 60px;
      }
      
      .chat-input-wrapper {
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 8px 14px;
        position: relative;
        transition: all 0.2s ease;
        max-width: 85%;
        height: 44px;
        display: flex;
        align-items: center;
      }
      
      .chat-input {
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        color: white;
        resize: none;
        outline: none;
        font-size: 14px;
        line-height: 1.4;
        padding-right: 80px;
      }
      
      .chat-input::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
      
      .chat-input-buttons {
        position: absolute;
        right: 10px;
        display: flex;
        gap: 8px;
        height: 100%;
        align-items: center;
      }
      
      .chat-input-button {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
      }
      
      .chat-send-button {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8B5CF6, #6d28d9);
        border: none;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(109, 40, 217, 0.3);
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        font-size: 18px;
      }
      
      /* Sidebar profile and spacer */
      .sidebar-spacer {
        flex-grow: 1;
      }
      
      .sidebar-profile {
        padding: 10px 0;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .sidebar-profile img {
        width: 40px;
        height: 40px;
        border-radius: 0;
        object-fit: cover;
        border: none;
      }
      
      /* Stopwatch section styles */
      .stopwatch-container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      
      .stopwatch-container h2 {
        color: var(--accent-color);
        margin-bottom: 20px;
        font-size: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 10px;
      }
      
      .timer-container {
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Add animated stopwatch styles */
      .animated-timer-display {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 30px 0;
      }
      
      .timer-circle-container {
        position: relative;
        width: 300px;
        height: 300px;
      }
      
      .timer-text {
        text-align: center;
        color: white;
        font-family: 'monospace', 'Courier New', Courier;
        text-shadow: 0 0 10px rgba(139, 92, 246, 0.7);
        letter-spacing: 2px;
      }
      
      .laps-container {
        margin-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 20px;
      }
      
      .laps-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
        max-height: 200px;
        overflow-y: auto;
      }
      
      .laps-list li {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        margin-bottom: 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border-left: 3px solid #8B5CF6;
      }
      
      .lap-number {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
      }
      
      .lap-time {
        font-family: monospace;
        color: #8B5CF6;
      }
      
      .timer-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 10px 20px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .timer-btn.start {
        background: #10b981;
        border-color: #059669;
      }
      
      .timer-btn.pause {
        background: #f59e0b;
        border-color: #d97706;
      }
      
      .timer-btn.reset {
        background: #ef4444;
        border-color: #dc2626;
      }
      
      .timer-btn.lap {
        background: rgba(139, 92, 246, 0.3);
        border-color: rgba(139, 92, 246, 0.5);
      }
      
      .timer-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .countdown-controls {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin-bottom: 24px;
      }
      
      .countdown-input {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      
      .countdown-input label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      .countdown-input input {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
        font-size: 20px;
        width: 70px;
        height: 50px;
        text-align: center;
        font-family: monospace;
      }
      
      /* Add settings page specific styles */
      .settings-container {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
      }
      
      .settings-header {
        margin-bottom: 24px;
      }
      
      .settings-header h2 {
        color: white;
        font-size: 24px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .settings-header p {
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .settings-section {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
        transition: all 0.3s ease;
        width: 100%;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
      }
      
      .settings-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #8B5CF6, #60a5fa, #86efac);
        opacity: 0.7;
      }
      
      .settings-section h3 {
        margin: 0 0 20px 0;
        color: white;
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .settings-section h3 i {
        color: #8B5CF6;
        font-size: 18px;
      }
      
      .setting-item {
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .setting-item:last-child {
        margin-bottom: 0;
      }
      
      .setting-item label {
        font-weight: 500;
        color: #e2e8f0;
        font-size: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .theme-toggle {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        cursor: pointer !important;
        padding: 12px 16px !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border-radius: 12px !important;
        transition: all 0.2s ease !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        width: max-content !important;
      }
      
      /* Replace with this improved style */
      .theme-toggle {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        cursor: pointer !important;
        padding: 10px 14px !important;
        background: rgba(30, 31, 44, 0.9) !important;
        border-radius: 10px !important;
        transition: all 0.2s ease !important;
        border: 1px solid rgba(77, 91, 206, 0.2) !important;
        width: max-content !important;
      }
      
      .theme-toggle:hover {
        background: rgba(30, 31, 44, 0.95) !important;
        border-color: rgba(77, 91, 206, 0.4) !important;
      }
      
      .theme-toggle i {
        font-size: 16px !important;
        color: #f59e0b !important;
      }
      
      .window-size-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }
      
      .font-size-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }
      
      .view-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }
      
      .toggle-switch {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 10px 14px !important;
        background: rgba(30, 31, 44, 0.9) !important;
        border-radius: 10px !important;
        transition: all 0.2s ease !important;
        border: 1px solid rgba(77, 91, 206, 0.2) !important;
        cursor: pointer !important;
        margin-top: 4px !important;
      }
      
      .toggle-switch:hover {
        background: rgba(30, 31, 44, 0.95) !important;
      }
      
      .toggle-switch .toggle-label {
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #e2e8f0 !important;
      }
      
      .toggle-switch .switch {
        position: relative !important;
        display: inline-block !important;
        width: 46px !important;
        height: 24px !important;
        flex-shrink: 0 !important;
      }
      
      .toggle-switch .switch input {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        position: absolute !important;
      }
      
      .toggle-switch .slider {
        position: absolute !important;
        cursor: pointer !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background-color: rgba(30, 31, 44, 0.9) !important;
        transition: 0.3s !important;
        border-radius: 24px !important;
        border: 1px solid rgba(77, 91, 206, 0.3) !important;
      }
      
      .toggle-switch .slider:before {
        position: absolute !important;
        content: "" !important;
        height: 18px !important;
        width: 18px !important;
        left: 3px !important;
        bottom: 2px !important;
        background-color: white !important;
        transition: 0.3s !important;
        border-radius: 50% !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
      }
      
      .toggle-switch input:checked + .slider {
        background-color: #8B5CF6 !important;
        border-color: rgba(139, 92, 246, 0.7) !important;
      }
      
      .toggle-switch input:checked + .slider:before {
        transform: translateX(22px) !important;
      }
      
      .setting-description {
        font-size: 13px;
        color: #94a3b8;
        margin-top: 8px;
        line-height: 1.4;
      }
      
      .icon-smaller {
        font-size: 12px;
      }
      
      .icon-larger {
        font-size: 20px;
      }
      
      .sound-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }
      
      .sound-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }
      
      .sound-option:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
      }
      
      .sound-option.selected {
        background: rgba(139, 92, 246, 0.15);
        border-color: #8B5CF6;
      }
      
      .sound-option .sound-icon {
        width: 40px;
        height: 40px;
        background: rgba(139, 92, 246, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        font-size: 20px;
        color: #8B5CF6;
      }
      
      .sound-option input[type="radio"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .volume-control {
        width: 100%;
        padding: 20px 0;
      }
      
      .volume-slider {
        width: 100%;
        height: 10px;
        -webkit-appearance: none;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        outline: none;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      
      .volume-slider:hover {
        opacity: 1;
      }
      
      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #8B5CF6;
        cursor: pointer;
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
      
      .volume-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #8B5CF6;
        cursor: pointer;
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
      
      .volume-label-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
      }
      
      .volume-label {
        color: #94a3b8;
        font-size: 14px;
      }
      
      .volume-value {
        color: #8B5CF6;
        font-weight: 600;
        font-size: 14px;
      }
      
      .radio-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }
      
      .radio-option:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
      }
      
      .radio-option input[type="radio"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .radio-option .size-preview {
        width: 100%;
        height: 80px;
        background: rgba(139, 92, 246, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #8B5CF6;
      }
      
      .radio-option .size-preview.compact {
        width: 40px;
        height: 40px;
        margin: 20px auto;
      }
      
      .radio-option .size-preview.medium {
        width: 60px;
        height: 60px;
        margin: 10px auto;
      }
      
      .radio-option label {
        font-weight: 500;
        margin-top: 8px;
        pointer-events: none;
      }
      
      .radio-option.selected {
        background: rgba(139, 92, 246, 0.15);
        border-color: #8B5CF6;
      }
      
      .btn-primary {
        background: #8B5CF6;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        width: max-content;
      }
      
      .btn-primary:hover {
        background: #7c4dff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
      }
      
      .btn-secondary {
        background: rgba(139, 92, 246, 0.2);
        color: #8B5CF6;
        border: 1px solid rgba(139, 92, 246, 0.3);
        padding: 10px 16px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        width: max-content;
      }
      
      .btn-secondary:hover {
        background: rgba(139, 92, 246, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
      }
      
      .btn-danger {
        background: #ef4444;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        width: max-content;
      }
      
      .btn-danger:hover {
        background: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
      
      .notification-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
      }
      
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
      }
      
      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.1);
        transition: .4s;
        border-radius: 34px;
      }
      
      .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      
      input:checked + .toggle-slider {
        background-color: #8B5CF6;
      }
      
      input:checked + .toggle-slider:before {
        transform: translateX(24px);
      }
      
      .notification-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .notification-title {
        font-weight: 500;
      }
      
      .notification-desc {
        font-size: 12px;
        color: #94a3b8;
      }
      
      .account-info {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .account-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(139, 92, 246, 0.1);
        overflow: hidden;
        /* Removing the border that creates rings */
      }
      
      .account-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .account-details {
        flex: 1;
      }
      
      .account-name {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 4px;
      }
      
      .account-email {
        color: #94a3b8;
        font-size: 14px;
      }
      
      .account-status {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
        background: rgba(134, 239, 172, 0.1);
        color: #86efac;
        width: max-content;
        margin-top: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .account-buttons {
        display: flex;
        gap: 12px;
      }
      
      /* Make the errors container responsive */
      .errors-container {
        padding: 16px;
        overflow-y: auto;
        max-height: calc(100vh - 120px);
        max-width: 100%;
        box-sizing: border-box;
      }
      
      /* Hints Styles */
      .hints-container {
        padding: 16px;
        overflow-y: auto;
        max-height: calc(100vh - 120px);
        width: 100%;
        box-sizing: border-box;
      }
      
      .hints-header {
        margin-bottom: 24px;
      }
      
      .hints-header h2 {
        font-size: 24px;
        font-weight: 600;
        color: white;
        margin: 0 0 8px 0;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .difficulty-tabs {
        display: flex;
        gap: 8px;
        margin: 16px 0;
        padding-bottom: 8px;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .difficulty-tabs::-webkit-scrollbar {
        display: none;
      }
      
      .tab-button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 8px 16px;
        color: #94a3b8;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      
      .tab-button.active {
        background: rgba(139, 92, 246, 0.15);
        border-color: #8B5CF6;
        color: white;
      }
      
      .tab-button:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-1px);
      }
      
      .hint-category {
        margin-bottom: 32px;
      }
      
      .hint-category h3 {
        font-size: 18px;
        font-weight: 600;
        color: white;
        margin: 0 0 16px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .hint-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
        width: 100%;
      }
      
      .hint-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        transition: all 0.3s ease;
        height: 100%;
      }
      
      .hint-card:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        border-color: rgba(139, 92, 246, 0.3);
      }
      
      .hint-card.blurred .hint-content {
        filter: blur(5px);
        user-select: none;
        pointer-events: none;
      }
      
      .hint-reveal-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 92, 246, 0.2);
        border: 1px solid rgba(139, 92, 246, 0.4);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 2;
      }
      
      .hint-reveal-button:hover {
        background: rgba(139, 92, 246, 0.3);
        transform: translate(-50%, -50%) scale(1.05);
      }
      
      .hints-content .hint-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
      }
      
      .hints-content .hint-card {
        max-width: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      
      .hints-content .hint-content {
        max-width: 100%;
        overflow-wrap: break-word;
      }
      
      .hints-content .hint-code-snippet {
        max-width: 100%;
        overflow-x: auto;
      }
      
      .hints-content .hint-code-snippet pre {
        white-space: pre-wrap;
        word-break: break-word;
      }
      
      .nav-items-main {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
      }
      
      .nav-items-bottom {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
      }
      
      .sidebar-profile {
        margin-top: 8px;
      }
      
      .chat-input-wrapper:focus-within {
        border-color: rgba(139, 92, 246, 0.5);
        box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
      }
      
      .chat-input-buttons {
        position: absolute;
        right: 8px;
        bottom: 6px;
        display: flex;
        gap: 6px;
      }
      
      .chat-input-button {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        width: 24px;
        height: 24px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
      }
      
      /* Chat Styles (extended) */
      .message-text code {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.3);
        padding: 2px 4px;
        border-radius: 4px;
        font-size: 12px;
        color: #e2e8f0;
      }
      
      .message-code-block {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        margin-top: 10px;
        margin-bottom: 6px;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 100%;
      }
      
      .message-code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px 8px 0 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      .message-code-language {
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .message-code-actions {
        display: flex;
        gap: 8px;
      }
      
      .message-code-action {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        padding: 3px;
        font-size: 11px;
        border-radius: 4px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .message-code-action:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
      
      .message-code-content {
        max-height: 300px;
        overflow-y: auto;
        position: relative;
        scrollbar-width: thin;
        scrollbar-color: rgba(139, 92, 246, 0.3) rgba(0, 0, 0, 0.1);
      }
      
      .message-code-content::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      .message-code-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0 0 8px 0;
      }
      
      .message-code-content::-webkit-scrollbar-thumb {
        background-color: rgba(139, 92, 246, 0.3);
        border-radius: 10px;
      }
      
      .message-code-content pre {
        margin: 0;
        padding: 12px 16px;
        white-space: pre;
        overflow-x: auto;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.5;
        color: #e2e8f0;
        counter-reset: line;
        width: 100%;
        box-sizing: border-box;
      }
      
      .message-code-content pre code {
        display: block;
        padding: 0;
        background: transparent;
      }
      
      .message-code-line-numbers {
        position: absolute;
        left: 0;
        top: 0;
        padding: 12px 0;
        text-align: right;
        color: rgba(255, 255, 255, 0.3);
        font-family: monospace;
        font-size: 12px;
        line-height: 1.5;
        user-select: none;
        background: rgba(0, 0, 0, 0.2);
        width: 30px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .message-code-with-numbers pre {
        padding-left: 40px;
      }

      /* Option grids - smaller and more consistent */
      .window-size-options,
      .font-size-options,
      .view-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px !important;
        margin-bottom: 12px !important;
      }

      .radio-option {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 6px !important;
        background: rgba(30, 31, 44, 0.9) !important;
        border: 1px solid rgba(77, 91, 206, 0.2) !important;
        border-radius: 8px !important;
        padding: 10px 6px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        position: relative !important;
      }

      .radio-option .size-preview {
        width: 100% !important;
        height: 48px !important;
        background: rgba(139, 92, 246, 0.08) !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 18px !important;
        color: #8B5CF6 !important;
      }

      .radio-option .size-preview.compact {
        width: 30px !important;
        height: 30px !important;
        margin: 9px auto !important;
      }

      .radio-option .size-preview.medium {
        width: 40px !important;
        height: 40px !important;
        margin: 4px auto !important;
      }

      .settings-section {
        background: rgba(30, 31, 44, 0.7) !important;
        border: 1px solid rgba(77, 91, 206, 0.2) !important;
        border-radius: 10px !important;
        padding: 14px !important;
        margin-bottom: 14px !important;
        transition: all 0.3s ease !important;
        width: 100% !important;
        box-sizing: border-box !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .settings-section h3 {
        margin: 0 0 12px 0 !important;
        color: white !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }

      .settings-section h3 i {
        color: #8B5CF6 !important;
        font-size: 15px !important;
      }

      .setting-item {
        margin-bottom: 14px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
      }

      .sound-options {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
        gap: 8px !important;
        margin-bottom: 12px !important;
      }

      .sound-option {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 6px !important;
        background: rgba(30, 31, 44, 0.9) !important;
        border: 1px solid rgba(77, 91, 206, 0.2) !important;
        border-radius: 8px !important;
        padding: 10px 6px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        position: relative !important;
      }

      .sound-option .sound-icon {
        width: 32px !important;
        height: 32px !important;
        background: rgba(139, 92, 246, 0.08) !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-bottom: 4px !important;
        font-size: 16px !important;
        color: #8B5CF6 !important;
      }

      .theme-toggle {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        cursor: pointer !important;
        padding: 8px 12px !important;
        background: rgba(30, 31, 44, 0.9) !important;
        border-radius: 8px !important;
        transition: all 0.2s ease !important;
        border: 1px solid rgba(77, 91, 206, 0.2) !important;
        width: max-content !important;
      }

      .radio-option.selected {
        background: rgba(139, 92, 246, 0.15) !important;
        border-color: #8B5CF6 !important;
      }

      /* Add additional styles for better appearance */
      .radio-option label {
        font-weight: 500 !important;
        font-size: 13px !important;
        margin-top: 4px !important;
        color: #e2e8f0 !important;
      }

      .radio-option:hover {
        background: rgba(77, 91, 206, 0.15) !important;
        transform: translateY(-2px) !important;
        border-color: rgba(77, 91, 206, 0.4) !important;
      }

      .radio-option.selected:hover {
        background: rgba(139, 92, 246, 0.2) !important;
        border-color: rgba(139, 92, 246, 0.7) !important;
      }

      /* Fix alignment for icons */
      .radio-option i.fas {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .icon-smaller {
        font-size: 14px !important; 
      }

      .icon-larger {
        font-size: 22px !important;
      }
    `;
    document.head.appendChild(styleElement);
    
  }, []);
  
  // Helper function to close other windows
  const closeOtherWindows = async (exceptId: number | null = null) => {
    try {
      const windows = await chrome.windows.getAll();
      for (const window of windows) {
        if (window.id !== exceptId && window.id && window.type === 'popup') {
          await chrome.windows.remove(window.id);
        }
      }
      
      // Close sidePanel if available
      if (chrome.sidePanel && 'close' in chrome.sidePanel) {
        await (chrome.sidePanel as unknown as ChromeSidePanel).close();
      }
    } catch (error) {
      console.error('Error closing windows:', error);
    }
  };
  
  // Handle navigation
  const handleNavigation = (sectionId: string) => {
    console.log('Navigation requested to section:', sectionId);
    console.log('Previous active section:', activeSection);
    setActiveSection(sectionId);
    console.log('New active section set to:', sectionId);
    localStorage.setItem('defaultView', sectionId);
    
    // Log all section elements and their active status
    setTimeout(() => {
      const sections = document.querySelectorAll('.section');
      console.log('Found', sections.length, 'section elements');
      sections.forEach(section => {
        console.log('Section ID:', section.id, 'Is active:', section.classList.contains('active'));
      });
    }, 100);
  };
  
  // Handle view toggle
  const handleViewToggle = async () => {
    try {
      const window = await chrome.windows.getCurrent();
      
      // Close other windows first
      await closeOtherWindows(window.id);
      
      // Check if we're in a popup
      if (window.type === 'popup') {
        if (windowSize === 'medium') {
          // Open side panel
          if (chrome.sidePanel && window.id) {
            await chrome.sidePanel.open({ windowId: window.id });
            // Use the global window object to close
            self.close();
          }
        } else if (windowSize === 'expanded') {
          // Open new expanded window
          chrome.windows.create({
            url: chrome.runtime.getURL('sidepanel.html'),
            type: 'popup',
            width: 800,
            height: 900
          });
          // Use the global window object to close
          self.close();
        }
        // If compact, do nothing as we're already in popup
      } else {
        // We're in sidepanel or expanded window
        if (windowSize === 'compact') {
          chrome.action.openPopup();
          if (chrome.sidePanel && 'close' in chrome.sidePanel) {
            await (chrome.sidePanel as unknown as ChromeSidePanel).close();
          }
          // Use the global window object to close
          self.close();
        } else if (windowSize === 'medium') {
          if (chrome.sidePanel && window.id) {
            await chrome.sidePanel.open({ windowId: window.id });
            // Use the global window object to close
            self.close();
          }
        } else if (windowSize === 'expanded') {
          chrome.windows.create({
            url: chrome.runtime.getURL('sidepanel.html'),
            type: 'popup',
            width: 800,
            height: 900
          });
          if (chrome.sidePanel && 'close' in chrome.sidePanel) {
            await (chrome.sidePanel as unknown as ChromeSidePanel).close();
          }
          // Use the global window object to close
          self.close();
        }
      }
    } catch (error) {
      console.error('Error toggling view:', error);
    }
  };
  
  // Handle window size change
  const handleWindowSizeChange = async (newSize: WindowSize['size']) => {
    try {
      setWindowSize(newSize);
      localStorage.setItem('windowSize', newSize);
      
      // Get current window
      const currentWindow = await chrome.windows.getCurrent();
      
      // Close other windows first
      await closeOtherWindows(currentWindow.id);
      
      // Apply the new size
      if (newSize === 'compact') {
        chrome.action.openPopup();
        if (chrome.sidePanel && 'close' in chrome.sidePanel) {
          await (chrome.sidePanel as unknown as ChromeSidePanel).close();
        }
        // Use the global window object to close
        self.close();
      } else if (newSize === 'medium') {
        // Always try to open sidepanel first before closing current window
        const windows = await chrome.windows.getAll();
        const mainWindow = windows.find(w => w.type === 'normal');

        if (mainWindow?.id) {
          await chrome.sidePanel.open({ windowId: mainWindow.id });
          // Use the global window object to close current window
          self.close();
        }
      } else if (newSize === 'expanded') {
        chrome.windows.create({
          url: chrome.runtime.getURL('sidepanel.html'),
          type: 'popup',
          width: 800,
          height: 900
        });
        if (chrome.sidePanel && 'close' in chrome.sidePanel) {
          await (chrome.sidePanel as unknown as ChromeSidePanel).close();
        }
        // Use the global window object to close
        self.close();
      }
    } catch (error) {
      console.error('Error changing window size:', error);
    }
  };
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Handle font size change
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.style.fontSize = 
      size === 'small' ? '14px' : 
      size === 'large' ? '18px' : '16px';
  };
  
  // Handle default view change
  const handleDefaultViewChange = (view: string) => {
    setDefaultView(view);
    localStorage.setItem('defaultView', view);
  };
  
  // Handle animations toggle
  const handleAnimationsToggle = () => {
    const newState = !animationsEnabled;
    setAnimationsEnabled(newState);
    localStorage.setItem('animationsEnabled', newState.toString());
    document.documentElement.setAttribute('data-animations', newState.toString());
  };
  
  // Handle notifications toggle
  const handleNotificationsToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('notificationsEnabled', newState.toString());
  };
  
  // Handle data collection toggle
  const handleDataCollectionToggle = () => {
    const newState = !dataCollection;
    setDataCollection(newState);
    localStorage.setItem('dataCollection', newState.toString());
  };
  
  // Handle timer sound change
  const handleTimerSoundChange = (sound: string) => {
    setTimerSound(sound);
    localStorage.setItem('timerSound', sound);
    
    // Play a preview of the selected sound at reduced volume
    const soundMap: Record<string, string> = {
      'bell': 'sounds/timer-bell.mp3',
      'digital': 'sounds/timer-digital.mp3',
      'gentle': 'sounds/timer-gentle.mp3',
      'alarm': 'sounds/timer-alarm.mp3'
    };
    
    const soundFile = soundMap[sound] || soundMap['bell'];
    const audio = new Audio(chrome.runtime.getURL(soundFile));
    audio.volume = 0.3; // Reduced volume for preview
    
    audio.play().catch(error => {
      console.error('Error playing sound preview:', error);
    });
  };
  
  // Handle timer volume change
  const handleTimerVolumeChange = (volume: number) => {
    setTimerVolume(volume);
    localStorage.setItem('timerVolume', volume.toString());
  };
  
  // Request notification permissions
  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }
    
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // Enable notifications if permission granted
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        
        // Show a test notification
        const notification = new Notification("Notification Test", {
          body: "Notifications are now enabled!",
          icon: chrome.runtime.getURL('images/icon.png')
        });
        
        // Play test sound
        const soundFile = localStorage.getItem('timerSound') || 'bell';
        const soundMap: Record<string, string> = {
          'bell': 'sounds/timer-bell.mp3',
          'digital': 'sounds/timer-digital.mp3',
          'gentle': 'sounds/timer-gentle.mp3',
          'alarm': 'sounds/timer-alarm.mp3'
        };
        
        const audio = new Audio(chrome.runtime.getURL(soundMap[soundFile] || soundMap['bell']));
        audio.volume = timerVolume / 100;
        audio.play().catch(error => {
          console.error('Error playing notification test sound:', error);
        });
      } else {
        // If permission denied, disable notifications
        setNotificationsEnabled(false);
        localStorage.setItem('notificationsEnabled', 'false');
        alert("Notification permission denied. You won't receive notifications when the timer ends.");
      }
    });
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      const window = await chrome.windows.getCurrent();
      if (window.id) {
        chrome.runtime.sendMessage({
          type: 'navigate',
          windowId: window.id,
          path: 'signin.html'
        } as NavigateMessage);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Timer functions
  const startTimer = () => {
    if (isTimerRunning) return;
    
    const now = Date.now();
    
    if (timerType === 'stopwatch') {
      timerStartTimeRef.current = now - timerPausedValueRef.current;
      
      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - timerStartTimeRef.current;
        setTimerValue(elapsed);
      }, 10);
    } else { // countdown
      const totalMilliseconds = (countdownMinutes * 60 + countdownSeconds) * 1000;
      
      if (timerValue <= 0) {
        // Starting a new countdown
        timerStartTimeRef.current = now;
        timerPausedValueRef.current = totalMilliseconds;
      } else {
        // Resuming a paused countdown
        timerStartTimeRef.current = now - (totalMilliseconds - timerValue);
      }
      
      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - timerStartTimeRef.current;
        const remaining = totalMilliseconds - elapsed;
        
        if (remaining <= 0) {
          pauseTimer();
          playTimerEndSound();
          setTimerValue(0);
        } else {
          setTimerValue(remaining);
        }
      }, 10);
    }
    
    setIsTimerRunning(true);
  };
  
  const pauseTimer = () => {
    if (!isTimerRunning) return;
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    timerPausedValueRef.current = timerValue;
    setIsTimerRunning(false);
  };
  
  const resetTimer = () => {
    pauseTimer();
    setTimerValue(0);
    timerPausedValueRef.current = 0;
    setLaps([]);
  };
  
  const addLap = () => {
    if (!isTimerRunning || timerType !== 'stopwatch') return;
    
    setLaps(prevLaps => [...prevLaps, timerValue]);
  };
  
  const handleTimerTypeChange = (type: 'stopwatch' | 'countdown') => {
    if (isTimerRunning) {
      pauseTimer();
    }
    
    setTimerType(type);
    resetTimer();
  };
  
  const updateCountdownTime = (minutes: number, seconds: number) => {
    setCountdownMinutes(minutes);
    setCountdownSeconds(seconds);
    
    if (!isTimerRunning && timerType === 'countdown') {
      const totalMilliseconds = (minutes * 60 + seconds) * 1000;
      setTimerValue(totalMilliseconds);
      timerPausedValueRef.current = totalMilliseconds;
    }
  };
  
  const playTimerEndSound = () => {
    // Skip playing sound if notifications are disabled
    if (!notificationsEnabled) return;
    
    // Get the selected timer sound from localStorage or use the default
    const selectedSound = localStorage.getItem('timerSound') || 'bell';
    const soundMap: Record<string, string> = {
      'bell': 'sounds/timer-bell.mp3',
      'digital': 'sounds/timer-digital.mp3',
      'gentle': 'sounds/timer-gentle.mp3',
      'alarm': 'sounds/timer-alarm.mp3'
    };
    
    // Create the audio instance with the selected sound
    const soundFile = soundMap[selectedSound] || soundMap['bell'];
    console.log("Playing timer end sound:", soundFile);
    
    // Create new audio object
    const audio = new Audio(chrome.runtime.getURL(soundFile));
    
    // Set volume based on user settings or default to 80%
    const volume = parseInt(localStorage.getItem('timerVolume') || '80') / 100;
    audio.volume = volume;
    console.log("Audio volume:", volume);
    
    // Make sure audio loads before playing
    audio.oncanplaythrough = () => {
      // Play the sound
      audio.play().then(() => {
        console.log("Sound played successfully");
      }).catch(error => {
      console.error('Error playing timer sound:', error);
        
        // Try playing with user interaction if failed
        const playWithInteraction = () => {
          alert("Timer finished! Click OK to hear the notification sound.");
          audio.play().catch(err => {
            console.error("Even after interaction, sound failed:", err);
          });
        };
        
        // Only show alert if needed
        if (error.name === "NotAllowedError") {
          playWithInteraction();
        }
      });
    };
    
    audio.onerror = (e) => {
      console.error("Audio error:", e);
    };
    
    // If notifications are enabled, show a browser notification
    if (notificationsEnabled) {
      if (Notification.permission === 'granted') {
        new Notification('Timer Complete', {
          body: 'Your countdown timer has finished!',
          icon: chrome.runtime.getURL('images/icon.png')
        });
      } else if (Notification.permission !== 'denied') {
        // Request permission if not already denied
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Timer Complete', {
              body: 'Your countdown timer has finished!',
              icon: chrome.runtime.getURL('images/icon.png')
            });
          }
        });
      }
    }
  };
  
  const formatTime = (timeMs: number): string => {
    if (timerType === 'stopwatch') {
      // Remove milliseconds display to prevent overlap
      const seconds = Math.floor((timeMs / 1000) % 60);
      const minutes = Math.floor((timeMs / 1000 / 60) % 60);
      const hours = Math.floor(timeMs / 1000 / 60 / 60);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      // Countdown timer
      const seconds = Math.floor((timeMs / 1000) % 60);
      const minutes = Math.floor((timeMs / 1000 / 60) % 60);
      
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem('sidebarExpanded', newState.toString());
  };
  
  // Toggle profile menu
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };
  
  // Handle completion of verification
  const handleVerificationComplete = () => {
    setShowVerification(false);
    setIsLoading(true);
    setShowLeetCodeLoader(true);
    
    // Simulate checking LeetCode login
    setTimeout(() => {
      setIsLeetCodeLoggedIn(true);
      
      // Simulate fetching statistics
      setTimeout(() => {
        setIsLeetCodeLoading(false);
        
        // After a brief delay, hide the loader
        setTimeout(() => {
          setShowLeetCodeLoader(false);
          setIsLoading(false);
        }, 1000);
      }, 2000);
    }, 2000);
  };
  
  // Check if verification page should be shown
  if (showVerification) {
    return <VerificationPage onVerificationComplete={handleVerificationComplete} />;
  }
  
  // Render the sidepanel UI
  return (
    <div className={`container ${isLoading ? 'loading' : ''}`}>
      {/* LeetCode Loader */}
      <AnimatePresence>
        {showLeetCodeLoader && (
          <motion.div 
            className="leetcode-loader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="leetcode-loader-container">
              <motion.div 
                className="leetcode-loader-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="loader-header">
                  <i className="fas fa-code"></i>
                  <h3>LeetCode Statistics</h3>
                </div>
                
                <div className="loader-content">
                  {isLeetCodeLoading ? (
                    <>
                      <div className="spinner-container">
                        <div className="spinner"></div>
                      </div>
                      <p className="loading-message">
                        {isLeetCodeLoggedIn 
                          ? "Fetching your LeetCode statistics..." 
                          : "Waiting for you to sign in to LeetCode..."}
                      </p>
                      <p className="loader-disclaimer">
                        {isLeetCodeLoggedIn 
                          ? "We're securely retrieving your problem-solving statistics from LeetCode." 
                          : "Please log in to your LeetCode account to access your statistics."}
                      </p>
                    </>
                  ) : (
                    <div className="completed-message">
                      <i className="fas fa-check-circle"></i>
                      <p>Statistics loaded successfully!</p>
                    </div>
                  )}
                </div>
                
                <div className="loader-footer">
                  <p className="privacy-note">
                    Your data is only used to enhance your coding experience and is never shared with third parties.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navigation Sidebar */}
      <nav className={`nav-sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        <div className="sidebar-logo">
          <img 
            className="icon-logo" 
            src={chrome.runtime.getURL('images/icon.png')} 
            alt="Cobra Icon" 
          />
          <img 
            className="full-logo" 
            src={chrome.runtime.getURL('images/cobrawhite_enhanced.png')} 
            alt="Cobra Logo" 
          />
        </div>
        
        <div className="sidebar-toggle" onClick={handleSidebarToggle}>
          <i className={`fas fa-${sidebarExpanded ? 'chevron-left' : 'chevron-right'}`}></i>
        </div>
        
        {/* Main Navigation Items */}
        <div className="nav-items-main">
        <div 
          className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} 
          onClick={() => handleNavigation('home')}
        >
          <i className="fas fa-home"></i>
          {sidebarExpanded && <span className="nav-label">Home</span>}
        </div>
        <div 
          className={`nav-item ${activeSection === 'hints' ? 'active' : ''}`} 
          onClick={() => handleNavigation('hints')}
        >
          <i className="fas fa-lightbulb"></i>
          {sidebarExpanded && <span className="nav-label">Hints</span>}
        </div>
        <div 
          className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`} 
          onClick={() => handleNavigation('resources')}
        >
          <i className="fas fa-book"></i>
          {sidebarExpanded && <span className="nav-label">Resources</span>}
        </div>
        <div 
          className={`nav-item ${activeSection === 'errors' ? 'active' : ''}`} 
          onClick={() => handleNavigation('errors')}
        >
          <i className="fas fa-bug"></i>
          {sidebarExpanded && <span className="nav-label">Errors</span>}
        </div>
          <div 
            className={`nav-item ${activeSection === 'stopwatch' ? 'active' : ''}`} 
            onClick={() => handleNavigation('stopwatch')}
          >
            <i className="fas fa-stopwatch"></i>
            {sidebarExpanded && <span className="nav-label">Stopwatch</span>}
        </div>
        <div 
          className={`nav-item ${activeSection === 'chat' ? 'active' : ''}`} 
          onClick={() => handleNavigation('chat')}
        >
          <i className="fas fa-comments"></i>
          {sidebarExpanded && <span className="nav-label">Chat</span>}
        </div>
        </div>

        {/* Past Chats Section - only visible when sidebar is expanded */}
        {sidebarExpanded && (
          <div className="past-chats-section">
            <div className="past-chats-header">
              <span>Past Chats</span>
            </div>
            <div className="past-chats-list">
              <div className="past-chat-item">
                <i className="fas fa-history"></i>
                <span className="chat-title">Binary Search Trees</span>
              </div>
              <div className="past-chat-item">
                <i className="fas fa-history"></i>
                <span className="chat-title">Dynamic Programming</span>
              </div>
              <div className="past-chat-item">
                <i className="fas fa-history"></i>
                <span className="chat-title">Graph Algorithms</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Items */}
        <div className="nav-items-bottom">
        <div 
          className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} 
          onClick={() => handleNavigation('settings')}
        >
          <i className="fas fa-cog"></i>
          {sidebarExpanded && <span className="nav-label">Settings</span>}
          </div>
          
          {/* Profile image */}
          <div className="sidebar-profile" onClick={handleProfileClick}>
            <img src={chrome.runtime.getURL('images/cobrapfp.png')} alt="Profile" />
          </div>
          
          {/* Profile Popup Menu */}
        </div>
      </nav>

      {/* Profile Popup Menu - Moved outside the sidebar for better positioning */}
      {showProfileMenu && (
        <div className="profile-popup">
          <div className="profile-header">srihanmedi</div>
          <div 
            className="profile-menu-item"
            onClick={() => {
              handleNavigation('settings');
              setShowProfileMenu(false);
            }}
          >
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </div>
          <div className="profile-menu-item">
            <i className="fas fa-paper-plane"></i>
            <span>Contact us</span>
          </div>
          <div 
            className="profile-menu-item logout"
            onClick={handleSignOut}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Log out</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="content">
          {/* Home Section */}
          <div className={`section ${activeSection === 'home' ? 'active' : ''}`} id="home">
            <div className="content">
              <h2 className="section-title">Dashboard</h2>
              
              {/* Current Problem Card */}
              <motion.div 
                className="dashboard-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card-header">
                  <div className="card-header-left">
                  <i className="fas fa-code"></i>
                  <h3>Merge Sorted Linked Lists
                  </h3>
                </div>
                  <div className="card-header-right">
                    <div className="card-actions">
                      <button className="card-action-button">
                        <i className="fas fa-sync-alt"></i>
                      </button>
                      <button className="card-action-button">
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                </div>
              </div>
                </div>
                <div className="card-content">
                  <div className="problem-info">
                    <div className="problem-meta">
                      <div className="problem-difficulty">
                        <i className="fas fa-signal"></i>
                        <span>Medium</span>
                </div>
                      <div className="problem-time">
                        <i className="fas fa-clock"></i>
                        <span>Started 27 min ago</span>
                </div>
              </div>
                    <div className="problem-description">
                      Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get and put operations.
                </div>
                    <div className="problem-tags">
                      <span className="problem-tag">Hash Table</span>
                      <span className="problem-tag">Linked List</span>
                      <span className="problem-tag">Design</span>
                    </div>
                    <div className="problem-actions">
                      <button className="problem-action-btn primary">
                        <i className="fas fa-lightbulb"></i>
                        <span>Get Hints</span>
                      </button>
                      <button className="problem-action-btn secondary">
                        <i className="fas fa-book"></i>
                        <span>View Resources</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <h2 className="section-title">Quick Actions</h2>
                <div className="tools-grid">
                <motion.div 
                  className="tool-button hints"
                  onClick={() => handleNavigation('hints')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="tool-button-icon">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <div className="tool-button-content">
                    <div className="tool-button-title">Hints</div>
                    <div className="tool-button-description">Get problem-specific guidance</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="tool-button resources"
                  onClick={() => handleNavigation('resources')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="tool-button-icon">
                    <i className="fas fa-book"></i>
                  </div>
                  <div className="tool-button-content">
                    <div className="tool-button-title">Resources</div>
                    <div className="tool-button-description">Learning materials and guides</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="tool-button errors"
                  onClick={() => handleNavigation('errors')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="tool-button-icon">
                    <i className="fas fa-bug"></i>
                  </div>
                  <div className="tool-button-content">
                    <div className="tool-button-title">Error Help</div>
                    <div className="tool-button-description">Analyze and fix code errors</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="tool-button chat"
                  onClick={() => handleNavigation('chat')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="tool-button-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <div className="tool-button-content">
                    <div className="tool-button-title">AI Chat</div>
                    <div className="tool-button-description">Get personalized assistance</div>
                </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <h2 className="section-title">Recent Activity</h2>
              <motion.div 
                className="dashboard-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="card-header">
                  <div className="card-header-left">
                  <i className="fas fa-history"></i>
                    <h3>Previously Attempted</h3>
                  </div>
                  <div className="card-header-right">
                    <div className="card-actions">
                      <button className="card-action-button">
                        <i className="fas fa-filter"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <div className="recent-problems">
                  <div className="problem-item">
                      <div className="problem-item-left">
                        <div className="problem-icon">
                          <i className="fas fa-code"></i>
                        </div>
                        <div className="problem-details">
                    <div className="problem-title">Two Sum</div>
                          <div className="problem-subtitle">Array, Hash Table</div>
                  </div>
                  </div>
                      <div className="problem-status success">
                        <i className="fas fa-check-circle"></i>
                        <span>Solved</span>
                      </div>
                    </div>
                    
                  <div className="problem-item">
                      <div className="problem-item-left">
                        <div className="problem-icon">
                          <i className="fas fa-code"></i>
                  </div>
                        <div className="problem-details">
                          <div className="problem-title">Merge Sorted Linked Lists</div>
                          <div className="problem-subtitle">Linked List, Recursion</div>
                        </div>
                      </div>
                      <div className="problem-status in-progress">
                        <i className="fas fa-spinner"></i>
                        <span>In Progress</span>
                      </div>
                    </div>
                    
                  <div className="problem-item">
                      <div className="problem-item-left">
                        <div className="problem-icon">
                          <i className="fas fa-code"></i>
                  </div>
                        <div className="problem-details">
                          <div className="problem-title">Binary Tree Maximum Path Sum</div>
                          <div className="problem-subtitle">DFS, Binary Tree</div>
                </div>
              </div>
                      <div className="problem-status failed">
                        <i className="fas fa-times-circle"></i>
                        <span>Failed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hints Section */}
          <div className={`section ${activeSection === 'hints' ? 'active' : ''}`} id="hints">
            <motion.div 
              className="hints-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="search-container"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <i className="fas fa-search search-icon"></i>
                <input type="text" placeholder="Search hints..." className="search-input" />
              </motion.div>
              
              <motion.div 
                className="hint-categories"
                initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="hint-category-btn active">All</motion.button>
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="hint-category-btn">Basic</motion.button>
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="hint-category-btn">Intermediate</motion.button>
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="hint-category-btn">Advanced</motion.button>
              </motion.div>
              
              <motion.div 
                className="hint-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.h3 
                  className="hint-section-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <i className="fas fa-layer-group"></i> Array Techniques
                </motion.h3>
                <div className="hint-grid">
                  <motion.div 
                    className="hint-card hint-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      borderColor: "rgba(139, 92, 246, 0.5)" 
                    }}
                  >
                    <div className="hint-icon">
                      <i className="fas fa-code"></i>
                  </div>
                    <div className="hint-badge">Basic</div>
                    <h3>Two Pointers Technique</h3>
                  <div className="hint-content">
                    <p>
                      The two pointers technique uses two pointers to solve array problems efficiently. 
                      Typically used in sorted arrays to find pairs with a specific sum or to detect cycles in linked lists.
                    </p>
                      <div className="hint-code-snippet blurred">
                        <pre>
                          <code>
                            {`// Example: Find pair with given sum in sorted array`.split('\n').map((line, index) => (
                              <span key={index} className="line">{line}</span>
                            ))}
                            {`function findPair(arr, target) {`.split('\n').map((line, index) => (
                              <span key={index + 1} className="line">{line}</span>
                            ))}
                            {`  let left = 0;`.split('\n').map((line, index) => (
                              <span key={index + 2} className="line">{line}</span>
                            ))}
                            {`  let right = arr.length - 1;`.split('\n').map((line, index) => (
                              <span key={index + 3} className="line">{line}</span>
                            ))}
                            {`  `.split('\n').map((line, index) => (
                              <span key={index + 4} className="line">{line}</span>
                            ))}
                            {`  while (left < right) {`.split('\n').map((line, index) => (
                              <span key={index + 5} className="line">{line}</span>
                            ))}
                            {`    if (arr[left] + arr[right] === target) {`.split('\n').map((line, index) => (
                              <span key={index + 6} className="line">{line}</span>
                            ))}
                            {`      return [left, right];`.split('\n').map((line, index) => (
                              <span key={index + 7} className="line">{line}</span>
                            ))}
                            {`    } else if (arr[left] + arr[right] < target) {`.split('\n').map((line, index) => (
                              <span key={index + 8} className="line">{line}</span>
                            ))}
                            {`      left++;`.split('\n').map((line, index) => (
                              <span key={index + 9} className="line">{line}</span>
                            ))}
                            {`    } else {`.split('\n').map((line, index) => (
                              <span key={index + 10} className="line">{line}</span>
                            ))}
                            {`      right--;`.split('\n').map((line, index) => (
                              <span key={index + 11} className="line">{line}</span>
                            ))}
                            {`    }`.split('\n').map((line, index) => (
                              <span key={index + 12} className="line">{line}</span>
                            ))}
                            {`  }`.split('\n').map((line, index) => (
                              <span key={index + 13} className="line">{line}</span>
                            ))}
                            {`  `.split('\n').map((line, index) => (
                              <span key={index + 14} className="line">{line}</span>
                            ))}
                            {`  return [-1, -1]; // Pair not found`.split('\n').map((line, index) => (
                              <span key={index + 15} className="line">{line}</span>
                            ))}
                            {`}`.split('\n').map((line, index) => (
                              <span key={index + 16} className="line">{line}</span>
                            ))}
                          </code>
                        </pre>
                        <div className="code-reveal-controls">
                          <button 
                            className="code-reveal-btn"
                            onClick={(e) => {
                              const codeSnippet = e.currentTarget.closest('.hint-code-snippet');
                              if (codeSnippet) {
                                const codeLines = codeSnippet.querySelectorAll('code > span.line');
                                const visibleLines = codeSnippet.querySelectorAll('code > span.line.visible');
                                
                                // If no lines are visible yet or we've revealed all lines, start over
                                if (visibleLines.length === 0 || visibleLines.length === codeLines.length) {
                                  // Hide all lines first by removing the visible class
                                  codeLines.forEach(line => line.classList.remove('visible'));
                                  
                                  // Show only the first two lines
                                  if (codeLines.length > 0) codeLines[0].classList.add('visible');
                                  if (codeLines.length > 1) codeLines[1].classList.add('visible');
                                  
                                  // Remove the blur when we start revealing
                                  codeSnippet.classList.remove('blurred');
                                  e.currentTarget.innerHTML = '<i class="fas fa-arrow-down"></i> Reveal Next';
    } else {
                                  // Reveal next two lines
                                  const nextLineIndex = visibleLines.length;
                                  if (nextLineIndex < codeLines.length) codeLines[nextLineIndex].classList.add('visible');
                                  if (nextLineIndex + 1 < codeLines.length) codeLines[nextLineIndex + 1].classList.add('visible');
                                  
                                  // If we've revealed all lines, update button text
                                  if (visibleLines.length + 2 >= codeLines.length) {
                                    e.currentTarget.innerHTML = '<i class="fas fa-redo"></i> Reset';
                                  }
                                }
                              }
                            }}
                          >
                            <i className="fas fa-eye"></i> Reveal Step-by-Step
                          </button>
                    </div>
                  </div>
                </div>
                  </motion.div>
                  
                  <motion.div 
                    className="hint-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      borderColor: "rgba(139, 92, 246, 0.5)" 
                    }}
                  >
                    <div className="hint-icon">
                      <i className="fas fa-code"></i>
                  </div>
                    <div className="hint-badge">Intermediate</div>
                    <h3>Sliding Window Technique</h3>
                  <div className="hint-content">
                    <p>
                        The sliding window technique is used to perform operations on a specific window size of an array or string.
                        It's particularly useful for problems involving subarrays or substrings.
                      </p>
                      <div className="hint-code-snippet blurred">
                        <pre>
                          <code>
                            {`// Example: Find max sum subarray of size k`.split('\n').map((line, index) => (
                              <span key={index} className="line">{line}</span>
                            ))}
                            {`function maxSumSubarray(arr, k) {`.split('\n').map((line, index) => (
                              <span key={index + 1} className="line">{line}</span>
                            ))}
                            {`  let maxSum = 0;`.split('\n').map((line, index) => (
                              <span key={index + 2} className="line">{line}</span>
                            ))}
                            {`  let windowSum = 0;`.split('\n').map((line, index) => (
                              <span key={index + 3} className="line">{line}</span>
                            ))}
                            {`  let start = 0;`.split('\n').map((line, index) => (
                              <span key={index + 4} className="line">{line}</span>
                            ))}
                            {`  `.split('\n').map((line, index) => (
                              <span key={index + 5} className="line">{line}</span>
                            ))}
                            {`  for (let end = 0; end < arr.length; end++) {`.split('\n').map((line, index) => (
                              <span key={index + 6} className="line">{line}</span>
                            ))}
                            {`    // Add the next element to the window`.split('\n').map((line, index) => (
                              <span key={index + 7} className="line">{line}</span>
                            ))}
                            {`    windowSum += arr[end];`.split('\n').map((line, index) => (
                              <span key={index + 8} className="line">{line}</span>
                            ))}
                            {`    `.split('\n').map((line, index) => (
                              <span key={index + 9} className="line">{line}</span>
                            ))}
                            {`    // If we've hit the window size k`.split('\n').map((line, index) => (
                              <span key={index + 10} className="line">{line}</span>
                            ))}
                            {`    if (end >= k - 1) {`.split('\n').map((line, index) => (
                              <span key={index + 11} className="line">{line}</span>
                            ))}
                            {`      // Update max sum if needed`.split('\n').map((line, index) => (
                              <span key={index + 12} className="line">{line}</span>
                            ))}
                            {`      maxSum = Math.max(maxSum, windowSum);`.split('\n').map((line, index) => (
                              <span key={index + 13} className="line">{line}</span>
                            ))}
                            {`      `.split('\n').map((line, index) => (
                              <span key={index + 14} className="line">{line}</span>
                            ))}
                            {`      // Remove the leftmost element as we slide`.split('\n').map((line, index) => (
                              <span key={index + 15} className="line">{line}</span>
                            ))}
                            {`      windowSum -= arr[start];`.split('\n').map((line, index) => (
                              <span key={index + 16} className="line">{line}</span>
                            ))}
                            {`      start++;`.split('\n').map((line, index) => (
                              <span key={index + 17} className="line">{line}</span>
                            ))}
                            {`    }`.split('\n').map((line, index) => (
                              <span key={index + 18} className="line">{line}</span>
                            ))}
                            {`  }`.split('\n').map((line, index) => (
                              <span key={index + 19} className="line">{line}</span>
                            ))}
                            {`  `.split('\n').map((line, index) => (
                              <span key={index + 20} className="line">{line}</span>
                            ))}
                            {`  return maxSum;`.split('\n').map((line, index) => (
                              <span key={index + 21} className="line">{line}</span>
                            ))}
                            {`}`.split('\n').map((line, index) => (
                              <span key={index + 22} className="line">{line}</span>
                            ))}
                          </code>
                        </pre>
                        <div className="code-reveal-controls">
                          <button 
                            className="code-reveal-btn"
                            onClick={(e) => {
                              const codeSnippet = e.currentTarget.closest('.hint-code-snippet');
                              if (codeSnippet) {
                                const codeLines = codeSnippet.querySelectorAll('code > span.line');
                                const visibleLines = codeSnippet.querySelectorAll('code > span.line.visible');
                                
                                // If no lines are visible yet or we've revealed all lines, start over
                                if (visibleLines.length === 0 || visibleLines.length === codeLines.length) {
                                  // Hide all lines first by removing the visible class
                                  codeLines.forEach(line => line.classList.remove('visible'));
                                  
                                  // Show only the first two lines
                                  if (codeLines.length > 0) codeLines[0].classList.add('visible');
                                  if (codeLines.length > 1) codeLines[1].classList.add('visible');
                                  
                                  // Remove the blur when we start revealing
                                  codeSnippet.classList.remove('blurred');
                                  e.currentTarget.innerHTML = '<i class="fas fa-arrow-down"></i> Reveal Next';
                                } else {
                                  // Reveal next two lines
                                  const nextLineIndex = visibleLines.length;
                                  if (nextLineIndex < codeLines.length) codeLines[nextLineIndex].classList.add('visible');
                                  if (nextLineIndex + 1 < codeLines.length) codeLines[nextLineIndex + 1].classList.add('visible');
                                  
                                  // If we've revealed all lines, update button text
                                  if (visibleLines.length + 2 >= codeLines.length) {
                                    e.currentTarget.innerHTML = '<i class="fas fa-redo"></i> Reset';
                                  }
                                }
                              }
                            }}
                          >
                            <i className="fas fa-eye"></i> Reveal Step-by-Step
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="hint-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.h3 
                  className="hint-section-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <i className="fas fa-project-diagram"></i> Graph Algorithms
                </motion.h3>
                <div className="hint-grid">
                  <motion.div 
                    className="hint-card blurred"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      borderColor: "rgba(139, 92, 246, 0.5)" 
                    }}
                  >
                    <div className="hint-icon">
                      <i className="fas fa-code"></i>
                    </div>
                    <div className="hint-badge">Advanced</div>
                    <h3>Depth-First Search (DFS)</h3>
                    <div className="hint-content">
                      <p>
                        Depth-First Search explores as far as possible along each branch before backtracking.
                        It's useful for problems involving paths, cycles, or topological sorting.
                      </p>
                      <div className="hint-code-snippet blurred">
                        <pre>
                          <code>
                            {`// Example: DFS implementation for a graph`.split('\n').map((line, index) => (
                              <span key={index} className="line">{line}</span>
                            ))}
                            {`function dfs(graph, start, visited = new Set()) {`.split('\n').map((line, index) => (
                              <span key={index + 1} className="line">{line}</span>
                            ))}
                            {`  // Mark the current node as visited`.split('\n').map((line, index) => (
                              <span key={index + 2} className="line">{line}</span>
                            ))}
                            {`  visited.add(start);`.split('\n').map((line, index) => (
                              <span key={index + 3} className="line">{line}</span>
                            ))}
                            {`  console.log(start);`.split('\n').map((line, index) => (
                              <span key={index + 4} className="line">{line}</span>
                            ))}
                            {`  `.split('\n').map((line, index) => (
                              <span key={index + 5} className="line">{line}</span>
                            ))}
                            {`  // Get all adjacent vertices of the node`.split('\n').map((line, index) => (
                              <span key={index + 6} className="line">{line}</span>
                            ))}
                            {`  const neighbors = graph[start] || [];`.split('\n').map((line, index) => (
                              <span key={index + 7} className="line">{line}</span>
                            ))}
                            {`  `.split('\n').map((line, index) => (
                              <span key={index + 8} className="line">{line}</span>
                            ))}
                            {`  // Recur for all adjacent vertices`.split('\n').map((line, index) => (
                              <span key={index + 9} className="line">{line}</span>
                            ))}
                            {`  for (const neighbor of neighbors) {`.split('\n').map((line, index) => (
                              <span key={index + 10} className="line">{line}</span>
                            ))}
                            {`    if (!visited.has(neighbor)) {`.split('\n').map((line, index) => (
                              <span key={index + 11} className="line">{line}</span>
                            ))}
                            {`      dfs(graph, neighbor, visited);`.split('\n').map((line, index) => (
                              <span key={index + 12} className="line">{line}</span>
                            ))}
                            {`    }`.split('\n').map((line, index) => (
                              <span key={index + 13} className="line">{line}</span>
                            ))}
                            {`  }`.split('\n').map((line, index) => (
                              <span key={index + 14} className="line">{line}</span>
                            ))}
                            {`}`.split('\n').map((line, index) => (
                              <span key={index + 15} className="line">{line}</span>
                            ))}
                          </code>
                        </pre>
                        <div className="code-reveal-controls">
                          <button 
                            className="code-reveal-btn"
                            onClick={(e) => {
                              const codeSnippet = e.currentTarget.closest('.hint-code-snippet');
                              if (codeSnippet) {
                                const codeLines = codeSnippet.querySelectorAll('code > span.line');
                                const visibleLines = codeSnippet.querySelectorAll('code > span.line.visible');
                                
                                // If no lines are visible yet or we've revealed all lines, start over
                                if (visibleLines.length === 0 || visibleLines.length === codeLines.length) {
                                  // Hide all lines first by removing the visible class
                                  codeLines.forEach(line => line.classList.remove('visible'));
                                  
                                  // Show only the first two lines
                                  if (codeLines.length > 0) codeLines[0].classList.add('visible');
                                  if (codeLines.length > 1) codeLines[1].classList.add('visible');
                                  
                                  // Remove the blur when we start revealing
                                  codeSnippet.classList.remove('blurred');
                                  e.currentTarget.innerHTML = '<i class="fas fa-arrow-down"></i> Reveal Next';
                                } else {
                                  // Reveal next two lines
                                  const nextLineIndex = visibleLines.length;
                                  if (nextLineIndex < codeLines.length) codeLines[nextLineIndex].classList.add('visible');
                                  if (nextLineIndex + 1 < codeLines.length) codeLines[nextLineIndex + 1].classList.add('visible');
                                  
                                  // If we've revealed all lines, update button text
                                  if (visibleLines.length + 2 >= codeLines.length) {
                                    e.currentTarget.innerHTML = '<i class="fas fa-redo"></i> Reset';
                                  }
                                }
                              }
                            }}
                          >
                            <i className="fas fa-eye"></i> Reveal Step-by-Step
                          </button>
                  </div>
                </div>
              </div>
                  </motion.div>
            </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Resources Section */}
          <div className={`section ${activeSection === 'resources' ? 'active' : ''}`} id="resources">
            <motion.div 
              className="resources-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="search-container"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <i className="fas fa-search search-icon"></i>
                <input type="text" placeholder="Search resources..." className="search-input" />
              </motion.div>
              
              <motion.div 
                className="resource-categories"
                initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="resource-category-btn active">All</motion.button>
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="resource-category-btn">Guides</motion.button>
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="resource-category-btn">Videos</motion.button>
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="resource-category-btn">Practice</motion.button>
                <motion.button 
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}} 
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}} 
                  className="resource-category-btn">Tools</motion.button>
              </motion.div>
              
              <motion.div 
                className="resource-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.h3 
                  className="resource-section-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <i className="fas fa-book"></i> Recommended Resources
                </motion.h3>
                <div className="resource-grid">
                  <motion.div 
                    className="resource-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      borderColor: "rgba(139, 92, 246, 0.5)" 
                    }}
                  >
                    <div className="resource-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="resource-badge">Guide</div>
                    <h3>Dynamic Programming Patterns</h3>
                    <p>Learn the most common patterns in dynamic programming problems and how to approach them systematically.</p>
                    <div className="resource-meta">
                      <div className="resource-type">
                        <i className="fas fa-book"></i> Article
                      </div>
                      <div className="resource-level">
                        <i className="fas fa-chart-line"></i> Intermediate
                      </div>
                    </div>
                    <motion.button 
                      className="resource-action"
                      whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-external-link-alt"></i> View Resource
                    </motion.button>
                  </motion.div>
                  
                  <motion.div 
                    className="resource-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      borderColor: "rgba(139, 92, 246, 0.5)" 
                    }}
                  >
                    <div className="resource-icon">
                      <i className="fas fa-video"></i>
                    </div>
                    <div className="resource-badge">Video</div>
                    <h3>Graph Algorithms Explained</h3>
                    <p>A comprehensive video series on graph algorithms including BFS, DFS, Dijkstra's, and more.</p>
                    <div className="resource-meta">
                      <div className="resource-type">
                        <i className="fas fa-video"></i> Video Series
                      </div>
                      <div className="resource-level">
                        <i className="fas fa-chart-line"></i> All Levels
                      </div>
                    </div>
                    <motion.button 
                      className="resource-action"
                      whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-external-link-alt"></i> Watch Series
                    </motion.button>
                  </motion.div>
                  </div>
              </motion.div>
              
              <motion.div 
                className="resource-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.h3 
                  className="resource-section-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <i className="fas fa-laptop-code"></i> Interactive Learning
                </motion.h3>
                <div className="resource-grid">
                  <motion.div 
                    className="resource-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      borderColor: "rgba(139, 92, 246, 0.5)" 
                    }}
                  >
                    <div className="resource-icon">
                      <i className="fas fa-code"></i>
                    </div>
                    <div className="resource-badge">Practice</div>
                    <h3>Binary Tree Visualizer</h3>
                    <p>Interactive tool to visualize binary tree operations and algorithms in real-time.</p>
                    <div className="resource-meta">
                      <div className="resource-type">
                        <i className="fas fa-tools"></i> Tool
                      </div>
                      <div className="resource-level">
                        <i className="fas fa-chart-line"></i> Beginner
                      </div>
                    </div>
                    <motion.button 
                      className="resource-action"
                      whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-play"></i> Launch Tool
                    </motion.button>
                  </motion.div>
                  
                  <motion.div 
                    className="resource-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      borderColor: "rgba(139, 92, 246, 0.5)" 
                    }}
                  >
                    <div className="resource-icon">
                      <i className="fas fa-puzzle-piece"></i>
                    </div>
                    <div className="resource-badge">Interactive</div>
                    <h3>Algorithm Playground</h3>
                    <p>Test and visualize various algorithms with custom inputs and see how they work step by step.</p>
                    <div className="resource-meta">
                      <div className="resource-type">
                        <i className="fas fa-tools"></i> Interactive Demo
                      </div>
                      <div className="resource-level">
                        <i className="fas fa-chart-line"></i> All Levels
                      </div>
                    </div>
                    <motion.button 
                      className="resource-action"
                      whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-play"></i> Try It Out
                    </motion.button>
                  </motion.div>
                  </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Error Analysis Section */}
          <div className={`section ${activeSection === 'errors' ? 'active' : ''}`} id="errors">
            <div className="errors-container">
              <div className="search-container">
                <i className="fas fa-search search-icon"></i>
                <input type="text" placeholder="Search errors..." className="search-input" />
              </div>
              
              <div className="error-filters">
                <button className="error-filter-btn active">All Errors</button>
                <button className="error-filter-btn">Active</button>
                <button className="error-filter-btn">Resolved</button>
                <button className="error-filter-btn">Syntax</button>
                <button className="error-filter-btn">Logic</button>
                <button className="error-filter-btn">Runtime</button>
              </div>
              
              <div className="error-summary">
                <div className="error-stat">
                  <span className="error-number">3</span>
                  <span className="error-label">Active Errors</span>
                </div>
                <div className="error-stat">
                  <span className="error-number">5</span>
                  <span className="error-label">Resolved Today</span>
                </div>
                <div className="error-stat">
                  <span className="error-number">89%</span>
                  <span className="error-label">Resolution Rate</span>
                </div>
              </div>
              
              <div className="error-list">
                <div className="error-item">
                  <div className="error-header">
                    <div className="error-header-left">
                      <i className="fas fa-exclamation-circle error-icon"></i>
                      <div className="error-title">ReferenceError: x is not defined</div>
                    </div>
                    <div className="error-severity high">High</div>
                  </div>
                  <div className="error-details">
                    <div className="error-location"></div>
                    <div className="error-description">
                      <p>Variable 'x' is used but never declared. Check for typos or missing declarations.</p>
                    </div>
                    <div className="error-code">
                      <pre><code>
{`function calculate() {
  return x * 10; // x is not defined
}`}
                      </code></pre>
                    </div>
                    <div className="error-fix">
                      <h4>Suggested Fix:</h4>
                      <div className="error-fix-code">
                        <pre><code>
{`function calculate(x) { // Add parameter
  return x * 10;
}

// OR

function calculate() {
  const x = 0; // Define x before using it
  return x * 10;
}`}
                        </code></pre>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="error-item">
                  <div className="error-header">
                    <div className="error-header-left">
                      <i className="fas fa-exclamation-triangle error-icon"></i>
                      <div className="error-title">TypeError: Cannot read property 'length' of undefined</div>
                    </div>
                    <div className="error-severity high">High</div>
                  </div>
                  <div className="error-details">
                    <div className="error-location"></div>
                    <div className="error-description">
                      <p>Trying to access a property of an undefined variable. Ensure the object exists before accessing its properties.</p>
                    </div>
                    <div className="error-code">
                      <pre><code>
{`function processData(data) {
  return data.items.length; // Error if data.items is undefined
}`}
                      </code></pre>
                    </div>
                    <div className="error-fix">
                      <h4>Suggested Fix:</h4>
                      <div className="error-fix-code">
                        <pre><code>
{`function processData(data) {
  // Check if data and data.items exist
  if (data && data.items) {
    return data.items.length;
  }
  return 0; // Default return value
}`}
                        </code></pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className={`section ${activeSection === 'chat' ? 'active' : ''}`} id="chat">
            <div className="chat-container">
              <motion.div 
                className="chat-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3>
                  <motion.i 
                    className="fas fa-comments"
                    animate={{ 
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatDelay: 5 
                    }}
                  ></motion.i> 
                  Cobra AI
                  <motion.span 
                    className="status-badge online"
                    animate={{ 
                      opacity: [1, 0.7, 1],
                      scale: [1, 0.95, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >Online</motion.span>
                </h3>
              </motion.div>
              
              <div className="chat-messages">
                <AnimatePresence>
                  <motion.div 
                    className="message assistant"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    layout
                  >
                    <motion.div 
                      className="message-avatar"
                      whileHover={{ scale: 1.1 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <img src="images/icon.png" alt="Cobra Assistant" />
                    </motion.div>
                    <motion.div 
                      className="message-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                    <div className="message-text">
                      <p>Hello! I'm your coding assistant. How can I help you today?</p>
                    </div>
                    <div className="message-time">10:30 AM</div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="message user"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    layout
                  >
                    <motion.div 
                      className="message-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                    <div className="message-text">
                      <p>I'm having trouble with a binary search algorithm. Can you explain how it works?</p>
                    </div>
                    <div className="message-time">10:32 AM</div>
                    </motion.div>
                    <motion.div 
                      className="message-avatar"
                      whileHover={{ scale: 1.1 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.8 }}
                    >
                      <img src="images/cobrapfp.png" alt="User" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="message assistant"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                    layout
                  >
                    <motion.div 
                      className="message-avatar"
                      whileHover={{ scale: 1.1 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 1.2 }}
                    >
                    <img src="images/icon.png" alt="Cobra Assistant" />
                    </motion.div>
                    <motion.div 
                      className="message-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.3 }}
                    >
                    <div className="message-text">
                      <p>Binary search is an efficient algorithm for finding an item in a sorted array. Here's how it works:</p>
                      <ol>
                        <li>Compare the target value to the middle element of the array.</li>
                        <li>If they match, return the index of the middle element.</li>
                        <li>If the target is less than the middle element, continue searching in the left half.</li>
                        <li>If the target is greater, continue searching in the right half.</li>
                        <li>Repeat until the item is found or the subarray size becomes zero.</li>
                      </ol>
                      
                      <div className="message-code-block">
                        <div className="message-code-header">
                          <div className="message-code-language">
                    <i className="fas fa-code"></i>
                            <span></span>
                    </div>
                          <div className="message-code-actions">
                            <button className="message-code-action">
                              <i className="fas fa-copy"></i>
                              <span>Copy</span>
                  </button>
                </div>
              </div>
                        <div className="message-code-content">
                          <pre>{`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Target found
    }
    
    if (arr[mid] < target) {
      left = mid + 1; // Search in the right half
    } else {
      right = mid - 1; // Search in the left half
    }
  }
  
  return -1; // Target not found
}`}</pre>
            </div>
          </div>

                      <p>Would you like me to explain the time complexity of this algorithm?</p>
                  </div>
                    <div className="message-time">10:33 AM</div>
                      <motion.div 
                        className="suggestion-chips"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.7 }}
                      >
                        <motion.button 
                          className="suggestion-chip"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setMessageText("Yes, explain time complexity");
                            if (chatInputRef.current) {
                              chatInputRef.current.focus();
                            }
                          }}
                        >Yes, explain time complexity</motion.button>
                        <motion.button 
                          className="suggestion-chip"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setMessageText("Show me another example");
                            if (chatInputRef.current) {
                              chatInputRef.current.focus();
                            }
                          }}
                        >Show me another example</motion.button>
                        <motion.button 
                          className="suggestion-chip"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setMessageText("No thanks");
                            if (chatInputRef.current) {
                              chatInputRef.current.focus();
                            }
                          }}
                        >No thanks</motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                </div>
                
              <motion.div 
                className="chat-input-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <div className="chat-input-wrapper">
                      <input 
                    type="text"
                    className="chat-input" 
                    placeholder="Type your message here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    ref={chatInputRef}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && messageText.trim()) {
                        // Handle send message logic here
                        console.log('Sending message:', messageText);
                        setMessageText('');
                      }
                    }}
                  />
                  <div className="chat-input-buttons">
                    <motion.button 
                      className="chat-input-button"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-microphone"></i>
                    </motion.button>
                    <motion.button 
                      className="chat-input-button"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                      whileTap={{ scale: 0.9 }}
                    >
                    <i className="fas fa-code"></i>
                    </motion.button>
                    </div>
                    </div>
                <motion.button 
                  className="chat-send-button"
                  whileHover={{ scale: 1.1, boxShadow: "0 5px 15px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 360] }}
                  transition={{ 
                    scale: { duration: 0.3, delay: 1.6 },
                    rotate: { duration: 0.5, delay: 1.6 }
                  }}
                  onClick={() => {
                    if (messageText.trim()) {
                      // Handle send message logic here
                      console.log('Sending message:', messageText);
                      setMessageText('');
                    }
                  }}
                >
                    <i className="fas fa-paper-plane"></i>
                </motion.button>
              </motion.div>
                </div>
              </div>
              
          {/* Stopwatch Section */}
          <div className={`section ${activeSection === 'stopwatch' ? 'active' : ''}`} id="stopwatch">
            <div className="stopwatch-container">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Stopwatch
              </motion.h2>

              <motion.div 
                className="timer-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                  <div className="timer-type-selector">
                  <motion.button 
                      className={`timer-type-btn ${timerType === 'stopwatch' ? 'active' : ''}`}
                      onClick={() => handleTimerTypeChange('stopwatch')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    >
                      Stopwatch
                  </motion.button>
                  <motion.button 
                      className={`timer-type-btn ${timerType === 'countdown' ? 'active' : ''}`}
                      onClick={() => handleTimerTypeChange('countdown')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    >
                      Countdown
                  </motion.button>
                  </div>
                  
                <div className="animated-timer-display">
                  <motion.div 
                    className="timer-circle-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <svg width="300" height="300" viewBox="0 0 300 300">
                      {/* Background Circle */}
                      <motion.circle
                        cx="150"
                        cy="150"
                        r="120"
                        fill="rgba(139, 92, 246, 0.05)"
                        stroke="rgba(139, 92, 246, 0.2)"
                        strokeWidth="8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                      
                      {/* Progress Circle */}
                      <motion.circle
                        cx="150"
                        cy="150"
                        r="120"
                        fill="transparent"
                        stroke="#8B5CF6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="752.4"
                        initial={{ strokeDashoffset: 752.4 }}
                        animate={{ 
                          strokeDashoffset: isTimerRunning ? [752.4, 0] : 752.4 * (1 - (timerValue / (timerType === 'countdown' ? ((countdownMinutes * 60 + countdownSeconds) * 1000) : 60000)))
                        }}
                        transition={{ 
                          duration: isTimerRunning ? (timerType === 'countdown' ? countdownMinutes * 60 + countdownSeconds : 60) : 0.5,
                          ease: "linear",
                          repeat: timerType === 'stopwatch' && isTimerRunning ? Infinity : 0
                        }}
                      />
                      
                      {/* Pulsing overlay */}
                      <motion.circle
                        cx="150"
                        cy="150"
                        r="110"
                        fill="rgba(139, 92, 246, 0.1)"
                        animate={{ 
                          scale: isTimerRunning ? [0.95, 1.05, 0.95] : 1,
                          opacity: isTimerRunning ? [0.3, 0.1, 0.3] : 0.2
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Display time in center */}
                      <foreignObject x="50" y="110" width="200" height="80">
                        <motion.div
                          className="timer-text"
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "48px",
                            fontWeight: 700,
                            color: "#fff",
                            fontFamily: "monospace"
                          }}
                          animate={{
                            scale: [1, 1.02, 1],
                            opacity: [0.9, 1, 0.9]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                          }}
                        >
                          {formatTime(timerValue).split(':').length > 2 
                            ? formatTime(timerValue).split(':').slice(1).join(':') 
                            : formatTime(timerValue)}
                        </motion.div>
                      </foreignObject>
                    </svg>
                  </motion.div>
                  </div>
                  
                  {timerType === 'countdown' && (
                  <motion.div 
                    className="countdown-controls"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                      <div className="countdown-input">
                        <label>Minutes</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="59" 
                          value={countdownMinutes}
                          onChange={(e) => updateCountdownTime(parseInt(e.target.value) || 0, countdownSeconds)}
                          disabled={isTimerRunning}
                        />
                      </div>
                      <div className="countdown-input">
                        <label>Seconds</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="59" 
                          value={countdownSeconds}
                          onChange={(e) => updateCountdownTime(countdownMinutes, parseInt(e.target.value) || 0)}
                          disabled={isTimerRunning}
                        />
                      </div>
                  </motion.div>
                )}
                
                <motion.div 
                  className="timer-controls"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                    {!isTimerRunning ? (
                    <motion.button 
                      className="timer-btn start"
                      onClick={startTimer}
                      whileHover={{ scale: 1.05, backgroundColor: "#15d893" }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                        <i className="fas fa-play"></i> Start
                    </motion.button>
                  ) : (
                    <motion.button 
                      className="timer-btn pause"
                      onClick={pauseTimer}
                      whileHover={{ scale: 1.05, backgroundColor: "#ffb84d" }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                        <i className="fas fa-pause"></i> Pause
                    </motion.button>
                  )}
                  <motion.button 
                    className="timer-btn reset"
                    onClick={resetTimer}
                    whileHover={{ scale: 1.05, backgroundColor: "#f43f5e" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                      <i className="fas fa-redo"></i> Reset
                  </motion.button>
                    {timerType === 'stopwatch' && (
                    <motion.button 
                      className="timer-btn lap"
                      onClick={addLap}
                      disabled={!isTimerRunning}
                      whileHover={{ scale: isTimerRunning ? 1.05 : 1, backgroundColor: isTimerRunning ? "#8B5CF6" : "#4B5563" }}
                      whileTap={{ scale: isTimerRunning ? 0.95 : 1 }}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1, opacity: isTimerRunning ? 1 : 0.7 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                        <i className="fas fa-flag"></i> Lap
                    </motion.button>
                    )}
                </motion.div>
                  
                  {timerType === 'stopwatch' && laps.length > 0 && (
                  <motion.div 
                    className="laps-container"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                      <h4>Laps</h4>
                      <ul className="laps-list">
                      <AnimatePresence>
                        {laps.map((lap, index) => (
                          <motion.li 
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="lap-number">Lap #{laps.length - index}</span>
                            <span className="lap-time">{formatTime(lap)}</span>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                      </ul>
                  </motion.div>
                  )}
              </motion.div>
                </div>
              </div>
              
          {/* Settings Section */}
          <div className={`section ${activeSection === 'settings' ? 'active' : ''}`} id="settings">
            <div className="settings-container">
              <div className="settings-section">
                <h3><i className="fas fa-palette"></i> Appearance</h3>
                <div className="setting-item">
                  <label>Theme</label>
                  <div className="theme-toggle" onClick={handleThemeToggle}>
                    <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`}></i>
                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </div>
              </div>
                
                <div className="setting-item">
                  <label>Font Size</label>
                  <div className="font-size-options">
                    <div 
                      className={`radio-option ${fontSize === 'small' ? 'selected' : ''}`}
                      onClick={() => handleFontSizeChange('small')}
                    >
                      <div className="size-preview">
                        <i className="fas fa-font icon-smaller"></i>
            </div>
                      <input 
                        type="radio" 
                        id="small" 
                        name="fontSize" 
                        value="small" 
                        checked={fontSize === 'small'} 
                        onChange={() => handleFontSizeChange('small')}
                      />
                      <label htmlFor="small">Small</label>
          </div>
                    <div 
                      className={`radio-option ${fontSize === 'medium' ? 'selected' : ''}`}
                      onClick={() => handleFontSizeChange('medium')}
                    >
                      <div className="size-preview">
                        <i className="fas fa-font"></i>
        </div>
                      <input 
                        type="radio" 
                        id="medium-font" 
                        name="fontSize" 
                        value="medium" 
                        checked={fontSize === 'medium'} 
                        onChange={() => handleFontSizeChange('medium')}
                      />
                      <label htmlFor="medium-font">Medium</label>
                    </div>
                    <div 
                      className={`radio-option ${fontSize === 'large' ? 'selected' : ''}`}
                      onClick={() => handleFontSizeChange('large')}
                    >
                      <div className="size-preview">
                        <i className="fas fa-font icon-larger"></i>
                      </div>
                      <input 
                        type="radio" 
                        id="large" 
                        name="fontSize" 
                        value="large" 
                        checked={fontSize === 'large'} 
                        onChange={() => handleFontSizeChange('large')}
                      />
                      <label htmlFor="large">Large</label>
                    </div>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>Window Size</label>
                  <div className="window-size-options">
                    <div className={`radio-option ${windowSize === 'compact' ? 'selected' : ''}`} onClick={() => handleWindowSizeChange('compact')}>
                      <div className="size-preview compact">
                        <i className="fas fa-compress-alt"></i>
                      </div>
                      <input 
                        type="radio" 
                        id="compact" 
                        name="windowSize" 
                        value="compact" 
                        checked={windowSize === 'compact'} 
                        onChange={() => handleWindowSizeChange('compact')}
                      />
                      <label htmlFor="compact">Compact</label>
                    </div>
                    <div className={`radio-option ${windowSize === 'medium' ? 'selected' : ''}`} onClick={() => handleWindowSizeChange('medium')}>
                      <div className="size-preview medium">
                        <i className="fas fa-expand-alt"></i>
                      </div>
                      <input 
                        type="radio" 
                        id="medium" 
                        name="windowSize" 
                        value="medium" 
                        checked={windowSize === 'medium'} 
                        onChange={() => handleWindowSizeChange('medium')}
                      />
                      <label htmlFor="medium">Medium</label>
                    </div>
                    <div 
                      className={`radio-option ${windowSize === 'expanded' ? 'selected' : ''}`}
                      onClick={() => handleWindowSizeChange('expanded')}
                    >
                      <div className="size-preview">
                        <i className="fas fa-expand"></i>
                      </div>
                      <input 
                        type="radio" 
                        id="expanded" 
                        name="windowSize" 
                        value="expanded" 
                        checked={windowSize === 'expanded'} 
                        onChange={() => handleWindowSizeChange('expanded')}
                      />
                      <label htmlFor="expanded">Expanded</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3><i className="fas fa-home"></i> Preferences</h3>
                <div className="setting-item">
                  <label>Default View</label>
                  <div className="view-options">
                    <div 
                      className={`radio-option ${defaultView === 'home' ? 'selected' : ''}`}
                      onClick={() => handleDefaultViewChange('home')}
                    >
                      <div className="size-preview">
                        <i className="fas fa-home"></i>
                      </div>
                      <input 
                        type="radio" 
                        id="home-view" 
                        name="defaultView" 
                        value="home" 
                        checked={defaultView === 'home'} 
                        onChange={() => handleDefaultViewChange('home')}
                      />
                      <label htmlFor="home-view">Home</label>
                    </div>
                    <div 
                      className={`radio-option ${defaultView === 'resources' ? 'selected' : ''}`}
                      onClick={() => handleDefaultViewChange('resources')}
                    >
                      <div className="size-preview">
                        <i className="fas fa-book"></i>
                      </div>
                      <input 
                        type="radio" 
                        id="resources-view" 
                        name="defaultView" 
                        value="resources" 
                        checked={defaultView === 'resources'} 
                        onChange={() => handleDefaultViewChange('resources')}
                      />
                      <label htmlFor="resources-view">Resources</label>
                    </div>
                    <div 
                      className={`radio-option ${defaultView === 'hints' ? 'selected' : ''}`}
                      onClick={() => handleDefaultViewChange('hints')}
                    >
                      <div className="size-preview">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <input 
                        type="radio" 
                        id="hints-view" 
                        name="defaultView" 
                        value="hints" 
                        checked={defaultView === 'hints'} 
                        onChange={() => handleDefaultViewChange('hints')}
                      />
                      <label htmlFor="hints-view">Hints</label>
                    </div>
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>Timer Sound</label>
                  <div className="sound-options">
                    <div 
                      className={`sound-option ${timerSound === 'bell' ? 'selected' : ''}`}
                      onClick={() => handleTimerSoundChange('bell')}
                    >
                      <div className="sound-icon">
                        <i className="fas fa-bell"></i>
                  </div>
                        <input 
                        type="radio" 
                        id="bell-sound" 
                        name="timerSound" 
                        value="bell" 
                        checked={timerSound === 'bell'} 
                        onChange={() => handleTimerSoundChange('bell')}
                      />
                      <label htmlFor="bell-sound">Bell</label>
                      </div>
                    <div 
                      className={`sound-option ${timerSound === 'digital' ? 'selected' : ''}`}
                      onClick={() => handleTimerSoundChange('digital')}
                    >
                      <div className="sound-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                        <input 
                        type="radio" 
                        id="digital-sound" 
                        name="timerSound" 
                        value="digital" 
                        checked={timerSound === 'digital'} 
                        onChange={() => handleTimerSoundChange('digital')}
                      />
                      <label htmlFor="digital-sound">Digital</label>
                      </div>
                    <div 
                      className={`sound-option ${timerSound === 'gentle' ? 'selected' : ''}`}
                      onClick={() => handleTimerSoundChange('gentle')}
                    >
                      <div className="sound-icon">
                        <i className="fas fa-music"></i>
                    </div>
                      <input 
                        type="radio" 
                        id="gentle-sound" 
                        name="timerSound" 
                        value="gentle" 
                        checked={timerSound === 'gentle'} 
                        onChange={() => handleTimerSoundChange('gentle')}
                      />
                      <label htmlFor="gentle-sound">Gentle</label>
                    </div>
                    <div 
                      className={`sound-option ${timerSound === 'alarm' ? 'selected' : ''}`}
                      onClick={() => handleTimerSoundChange('alarm')}
                    >
                      <div className="sound-icon">
                        <i className="fas fa-volume-up"></i>
                      </div>
                      <input 
                        type="radio" 
                        id="alarm-sound" 
                        name="timerSound" 
                        value="alarm" 
                        checked={timerSound === 'alarm'} 
                        onChange={() => handleTimerSoundChange('alarm')}
                      />
                      <label htmlFor="alarm-sound">Alarm</label>
                    </div>
                  </div>
                  
                  <div className="volume-control">
                    <label>Volume</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={timerVolume} 
                      className="volume-slider"
                      onChange={(e) => handleTimerVolumeChange(parseInt(e.target.value))}
                    />
                    <div className="volume-label-container">
                      <span className="volume-label">Min</span>
                      <span className="volume-value">{timerVolume}%</span>
                      <span className="volume-label">Max</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the app
const renderApp = () => {
  const container = document.getElementById('app');
  if (container) {
    ReactDOM.render(<SidePanel />, container);
  }
};

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', renderApp);

export default SidePanel; 