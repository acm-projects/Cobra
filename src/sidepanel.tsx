import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { createRoot } from 'react-dom/client';
import { Auth } from "./utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import "./hints.css";
import "./styles/chat.css";
import VerificationPage from "./components/VerificationPage";
import CurrentProblem from "./components/Dashboard/CurrentProblem";
import { getHints, sendChat, getErrorAnalysis } from "./awsFunctions";
import HintCard from "./components/HintCard";
import HintCardContainer from "./components/HintCardContainer";
import ConceptualHintContainer from "./components/ConceptualHintContainer";
import { ProblemInfo, Message, WindowSize } from "./types";
import ResourceCard from "./components/ResourceCard";
import Settings from "./components/Settings";

// Type definitions
interface NavigateMessage {
  type: "navigate";
  windowId?: number;
  path: string;
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

  // Verification State
  const [showVerification, setShowVerification] = useState<boolean>(false);

  // Loading states after verification
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLeetCodeLoader, setShowLeetCodeLoader] = useState<boolean>(false);
  const [isLeetCodeLoggedIn, setIsLeetCodeLoggedIn] = useState<boolean>(false);
  const [isLeetCodeLoading, setIsLeetCodeLoading] = useState<boolean>(true);

  // UI state
  const [activeSection, setActiveSection] = useState<string>("home");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [windowSize, setWindowSize] = useState<WindowSize["size"]>("medium");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Chat state
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm CobraBot, your coding assistant. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [showInitialSuggestions, setShowInitialSuggestions] = useState<boolean>(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "Help me debug my code",
    "Explain a coding concept",
    "Review my code for best practices",
    "Help me optimize my algorithm",
    "Generate code documentation",
    "Convert code between languages"
  ]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // New settings
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [defaultView, setDefaultView] = useState<string>("home");
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [dataCollection, setDataCollection] = useState<boolean>(true);
  const [timerSound, setTimerSound] = useState<string>("bell");
  const [timerVolume, setTimerVolume] = useState<number>(80);

  // Timer state
  const [timerType, setTimerType] = useState<"countdown" | "stopwatch">(
    "countdown"
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerValue, setTimerValue] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [countdownMinutes, setCountdownMinutes] = useState<number>(30);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);

  // Refs
  const timerIntervalRef = useRef<number | null>(null);
  const timerStartTimeRef = useRef<number>(0);
  const timerPausedValueRef = useRef<number>(0);

  const [currentProblem, setCurrentProblem] = useState<ProblemInfo | undefined>(undefined);
  const [currentHint, setCurrentHint] = useState<string>("");
  const [currentCodeSnipets, setCurrentCodeSnipets] = useState<JSX.Element[]>([]);
  const [currentProblemTitle, setCurrentProblemTitle] = useState<string>("");
  const [currentDiscussions, setCurrentDiscussions] = useState<JSX.Element[]>([]);
  const [isHintsLoading, setIsHintsLoading] = useState<boolean>(false);
  const [currentProblemId, setCurrentProblemId] = useState<string | null>(null);
  const [codeSnippetsData, setCodeSnippetsData] = useState<any[]>([]);
  const [currentProblemDescription, setCurrentProblemDescription] = useState<string>("");
  const [currentDraft, setCurrentDraft] = useState<string>("");
  const [currentSlug, setCurrentSlug] = useState<string>("");
  const [scanForErrors, setScanForErrors] = useState<boolean>(true);

  // Check authentication on component mount
  useEffect(() => {
    // Load Font Awesome if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesomeLink = document.createElement("link");
      fontAwesomeLink.rel = "stylesheet";
      fontAwesomeLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
      document.head.appendChild(fontAwesomeLink);
    }

    const checkAuth = async () => {
      try {
        const isAuth = await Auth.isAuthenticated();
        setIsAuthenticated(isAuth);
        console.log("User is authenticated:", isAuth);

        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const verifiedParam = urlParams.get("verified") === "true";
        console.log("verifiedParam: ", verifiedParam);
        console.log("urlParams: ", urlParams.toString());
        // If verified via URL parameter, make sure it's set in localStorage
        if (verifiedParam) {
          localStorage.setItem("isVerified", "true");
          localStorage.removeItem("needsVerification");
          localStorage.removeItem("showVerificationInSidepanel");
        }

        // Check if verification is needed (but skip if we have the verified param)
        const needsVerification =
          !verifiedParam &&
          (localStorage.getItem("needsVerification") === "true" ||
            localStorage.getItem("showVerificationInSidepanel") === "true");
        // If verification is needed, show the verification page
        if (needsVerification) {
          console.log("User needs verification, showing verification page");
          setShowVerification(true);
          return; // Skip other checks if verification is needed
        }

        if (!isAuth) {
          console.log("User is not authenticated, navigating to signin page");
          // If not authenticated, navigate to signin
          const window = await chrome.windows.getCurrent();
          if (window.id) {
            chrome.runtime.sendMessage({
              type: "navigate",
              windowId: window.id,
              path: "signin.html",
            } as NavigateMessage);
          }
        } else {
          console.log("User is authenticated, checking verification status");
          // Check if we need to show the loading screen (only after verification)
          // Parse URL parameters for loading flag
          const loadingParam = urlParams.get("loading");
          const justVerifiedParam = urlParams.get("justVerified");
          console.log("loadingParam: ", loadingParam);
          console.log("justVerifiedParam: ", justVerifiedParam);
          console.log("showing loading? (sidepanel): " + localStorage.getItem("showLoadingOnSidepanel"));
          console.log("just verified? (sidepanel): " + localStorage.getItem("justVerified"));

          let loadingLoc = false;
          chrome.storage.local.get('showLoadingLoc', (result) => {
            loadingLoc = result.showLoadingLoc;
            console.log('loadingLoc:', loadingLoc); // Do your work here
          });

          // Also check localStorage as fallback
          const showLoading =
            loadingLoc  ||
            loadingParam === "true" ||
            justVerifiedParam === "true" ||
            localStorage.getItem("showLoadingOnSidepanel") === "true" ||
            localStorage.getItem("justVerified") === "true";

          // Clear URL parameters if they exist
          if (loadingParam || justVerifiedParam || verifiedParam) {
            const url = new URL(window.location.href);
            url.searchParams.delete("loading");
            url.searchParams.delete("justVerified");
            url.searchParams.delete("verified");
            url.searchParams.delete("inSidepanel");
            window.history.replaceState({}, document.title, url.toString());
          }

          if (showLoading) {
            console.log("Showing loading screen in sidepanel");

            // Clear localStorage flags
            localStorage.removeItem("showLoadingOnSidepanel");
            localStorage.removeItem("justVerified");

            // Show loading process
            console.log("running handleVerificationComplete");
            setShowVerification(false);
            setIsLoading(true);
            setShowLeetCodeLoader(true);
            chrome.runtime.onMessage.addListener((m,s,r) => {
              console.log("verification state recieved message: ")
              console.log(m);
              if(m.type === "retrievingUsername"){
                console.log("finding username");
                setIsLeetCodeLoggedIn(true);
              }
              if(m.type === "loggedIntoLeetCode"){
                console.log("closing loading screen");
                setIsLeetCodeLoading(false);
                setTimeout(() => {
                  setShowLeetCodeLoader(false);
                  setIsLoading(false);
                }, 1000);
              }
             });
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();

    // Load saved preferences
    const savedSize =
      (localStorage.getItem("windowSize") as WindowSize["size"]) || "medium";
    setWindowSize(savedSize);

    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const savedView = localStorage.getItem("defaultView") || "home";
    setDefaultView(savedView);
    setActiveSection(savedView);

    // Load font size preference
    const savedFontSize =
      (localStorage.getItem("fontSize") as "small" | "medium" | "large") ||
      "medium";
    setFontSize(savedFontSize);
    document.documentElement.style.fontSize =
      savedFontSize === "small"
        ? "14px"
        : savedFontSize === "large"
        ? "18px"
        : "16px";

    // Load animation preference
    const animationsState =
      localStorage.getItem("animationsEnabled") !== "false";
    setAnimationsEnabled(animationsState);
    document.documentElement.setAttribute(
      "data-animations",
      animationsState.toString()
    );

    // Load notification preference
    const notificationsState =
      localStorage.getItem("notificationsEnabled") !== "false";
    setNotificationsEnabled(notificationsState);

    // Load data collection preference
    const dataCollectionState =
      localStorage.getItem("dataCollection") !== "false";
    setDataCollection(dataCollectionState);

    // Load timer sound preference
    const savedTimerSound = localStorage.getItem("timerSound") || "bell";
    setTimerSound(savedTimerSound);

    // Load timer volume preference
    const savedTimerVolume = parseInt(
      localStorage.getItem("timerVolume") || "80"
    );
    setTimerVolume(savedTimerVolume);

    // Preload audio files for timer sounds
    const sounds = ["bell", "digital", "gentle", "alarm"];
    sounds.forEach((sound) => {
      const audio = new Audio(
        chrome.runtime.getURL(`sounds/timer-${sound}.mp3`)
      );
      audio.preload = "auto";
      // Just triggering the load without playing
      audio.load();
      console.log(`Preloaded sound: ${sound}`);
    });

    // Load sidebar expanded state
    const sidebarState = localStorage.getItem("sidebarExpanded") === "true";
    setSidebarExpanded(sidebarState);

    // Apply necessary styles for proper section display
    const styleElement = document.createElement("style");
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
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 12px 4px;
        }
        
        .tool-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 120px;
          justify-content: center;
        }
        
        .tool-button:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .tool-button-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        
        .tool-button-icon i {
          font-size: 28px;
        }
        
        .tool-button-content {
          text-align: center;
          width: 100%;
        }
        
        .tool-button-title {
          font-weight: 600;
          font-size: 16px;
          white-space: nowrap;
          color: #fff;
        }
        
        .tool-button-description {
          display: none;
        }
        
        .tool-button.hints .tool-button-icon {
          background: rgba(251, 191, 36, 0.1);
        }
        
        .tool-button.hints .tool-button-icon i {
          color: #fbbf24;
        }
        
        .tool-button.resources .tool-button-icon {
          background: rgba(16, 185, 129, 0.1);
        }
        
        .tool-button.resources .tool-button-icon i {
          color: #10b981;
        }
        
        .tool-button.errors .tool-button-icon {
          background: rgba(239, 68, 68, 0.1);
        }
        
        .tool-button.errors .tool-button-icon i {
          color: #ef4444;
        }
        
        .tool-button.chat .tool-button-icon {
          background: rgba(96, 165, 250, 0.1);
        }
        
        .tool-button.chat .tool-button-icon i {
          color: #60a5fa;
        }
        
        /* Apply the media queries for this section too */
        @media (max-width: 640px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        
        @media (max-width: 400px) {
          .tool-button {
            padding: 12px 8px;
            min-height: 90px;
          }
          
          .tool-button-icon {
            width: 32px;
            height: 32px;
            margin-bottom: 6px;
          }
          
          .tool-button-icon i {
            font-size: 16px;
          }
          
          .tool-button-title {
            font-size: 12px;
            margin-bottom: 2px;
          }
          
          .tool-button-description {
            font-size: 11px;
            line-height: 1.2;
            max-height: 26px;
            overflow: hidden;
          }
        }
        
        @media (max-width: 320px) {
          .tools-grid {
            grid-template-columns: 1fr;
          }
          
          .tool-button {
            flex-direction: row;
            align-items: center;
            min-height: auto;
            padding: 10px;
            gap: 8px;
          }
          
          .tool-button-icon {
            margin-bottom: 0;
            min-width: 24px;
            width: 24px;
            height: 24px;
          }
          
          .tool-button-content {
            text-align: left;
          }
          
          .tool-button-description {
            display: none;
          }
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
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 12px 4px;
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

        @media (max-width: 640px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        
        /* Extra narrow screens or sidebar */
        @media (max-width: 400px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding: 0 4px;
          }
          
          .tool-button {
            padding: 12px 8px;
            min-height: 90px;
          }
          
          .tool-button-icon {
            width: 32px;
            height: 32px;
            margin-bottom: 6px;
          }
          
          .tool-button-icon i {
            font-size: 16px;
          }
          
          .tool-button-title {
            font-size: 12px;
            margin-bottom: 2px;
          }
          
          .tool-button-description {
            font-size: 11px;
            line-height: 1.2;
            max-height: 26px;
            overflow: hidden;
          }
        }
        
        /* Extremely narrow sidebar */
        @media (max-width: 320px) {
          .tools-grid {
            grid-template-columns: repeat(1, 1fr);
          }
          
          .tool-button {
            flex-direction: row;
            align-items: center;
            min-height: auto;
            padding: 10px;
            gap: 8px;
          }
          
          .tool-button-icon {
            margin-bottom: 0;
            min-width: 24px;
            width: 24px;
            height: 24px;
          }
          
          .tool-button-content {
            text-align: left;
          }
          
          .tool-button-description {
            display: none;
          }
        }
      `;
    document.head.appendChild(styleElement);
  }, []);

  // Helper function to close other windows
  const closeOtherWindows = async (exceptId: number | null = null) => {
    try {
      const windows = await chrome.windows.getAll();
      for (const window of windows) {
        if (window.id !== exceptId && window.id && window.type === "popup") {
          await chrome.windows.remove(window.id);
        }
      }

      // Close sidePanel if available
      if (chrome.sidePanel && "close" in chrome.sidePanel) {
        await (chrome.sidePanel as unknown as ChromeSidePanel).close();
      }
    } catch (error) {
      console.error("Error closing windows:", error);
    }
  };


  const useDebouncedEffect = (callback: any, delay: number, deps: any) => {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback();
      }, delay);
  
      return () => clearTimeout(timeoutRef.current);
    }, deps);
  }

  useDebouncedEffect(async() => {
    console.log('No draft sent for 5 seconds.');
    //console.log('sent draft:\n', currentDraft);
    //console.log('sent slug: ', currentSlug);
    const analysis = await getErrorAnalysis(currentSlug, currentDraft);
    console.log('Analysis: ', analysis);
    const cleanedAnalysis =  analysis.replace(/\u00A0/g, ' ');
    console.log('Cleaned Analysis: ' + cleanedAnalysis);
    try {
      const res = JSON.parse(cleanedAnalysis);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, { type: 'showErrorWidget', errors: res });
      });
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return;
    }
  }, 3000, [[currentDraft], [currentSlug]]);

  // Handle navigation
  const handleNavigation = (sectionId: string) => {
    console.log("Navigation requested to section:", sectionId);
    console.log("Previous active section:", activeSection);
    setActiveSection(sectionId);
    console.log("New active section set to:", sectionId);
    localStorage.setItem("defaultView", sectionId);

    // Log all section elements and their active status
    setTimeout(() => {
      const sections = document.querySelectorAll(".section");
      console.log("Found", sections.length, "section elements");
      sections.forEach((section) => {
        console.log(
          "Section ID:",
          section.id,
          "Is active:",
          section.classList.contains("active")
        );
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
      if (window.type === "popup") {
        if (windowSize === "medium") {
          // Open side panel
          if (chrome.sidePanel && window.id) {
            await chrome.sidePanel.open({ windowId: window.id });
            // Use the global window object to close
            self.close();
          }
        } else if (windowSize === "expanded") {
          // Open new expanded window
          chrome.windows.create({
            url: chrome.runtime.getURL("sidepanel.html"),
            type: "popup",
            width: 800,
            height: 900,
          });
          // Use the global window object to close
          self.close();
        }
        // If compact, do nothing as we're already in popup
      } else {
        // We're in sidepanel or expanded window
        if (windowSize === "compact") {
          chrome.action.openPopup();
          if (chrome.sidePanel && "close" in chrome.sidePanel) {
            await (chrome.sidePanel as unknown as ChromeSidePanel).close();
          }
          // Use the global window object to close
          self.close();
        } else if (windowSize === "medium") {
          if (chrome.sidePanel && window.id) {
            await chrome.sidePanel.open({ windowId: window.id });
            // Use the global window object to close
            self.close();
          }
        } else if (windowSize === "expanded") {
          chrome.windows.create({
            url: chrome.runtime.getURL("sidepanel.html"),
            type: "popup",
            width: 800,
            height: 900,
          });
          if (chrome.sidePanel && "close" in chrome.sidePanel) {
            await (chrome.sidePanel as unknown as ChromeSidePanel).close();
          }
          // Use the global window object to close
          self.close();
        }
      }
    } catch (error) {
      console.error("Error toggling view:", error);
    }
  };

  // Handle window size change
  const handleWindowSizeChange = async (newSize: WindowSize["size"]) => {
    try {
      setWindowSize(newSize);
      localStorage.setItem("windowSize", newSize);

      // Get current window
      const currentWindow = await chrome.windows.getCurrent();

      // Close other windows first
      await closeOtherWindows(currentWindow.id);

      // Apply the new size
      if (newSize === "compact") {
        chrome.action.openPopup();
        if (chrome.sidePanel && "close" in chrome.sidePanel) {
          await (chrome.sidePanel as unknown as ChromeSidePanel).close();
        }
        // Use the global window object to close
        self.close();
      } else if (newSize === "medium") {
        // Always try to open sidepanel first before closing current window
        const windows = await chrome.windows.getAll();
        const mainWindow = windows.find((w) => w.type === "normal");

        if (mainWindow?.id) {
          await chrome.sidePanel.open({ windowId: mainWindow.id });
          // Use the global window object to close current window
          self.close();
        }
      } else if (newSize === "expanded") {
        chrome.windows.create({
          url: chrome.runtime.getURL("sidepanel.html"),
          type: "popup",
          width: 800,
          height: 900,
        });
        if (chrome.sidePanel && "close" in chrome.sidePanel) {
          await (chrome.sidePanel as unknown as ChromeSidePanel).close();
        }
        // Use the global window object to close
        self.close();
      }
    } catch (error) {
      console.error("Error changing window size:", error);
    }
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Handle font size change
  const handleFontSizeChange = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    document.documentElement.style.fontSize =
      size === "small" ? "14px" : size === "large" ? "18px" : "16px";
  };

  // Handle default view change
  const handleDefaultViewChange = (view: string) => {
    setDefaultView(view);
    localStorage.setItem("defaultView", view);
  };

  // Handle animations toggle
  const handleAnimationsToggle = () => {
    const newState = !animationsEnabled;
    setAnimationsEnabled(newState);
    localStorage.setItem("animationsEnabled", newState.toString());
    document.documentElement.setAttribute(
      "data-animations",
      newState.toString()
    );
  };

  // Handle notifications toggle
  const handleNotificationsToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem("notificationsEnabled", newState.toString());
  };

  // Handle data collection toggle
  const handleDataCollectionToggle = () => {
    const newState = !dataCollection;
    setDataCollection(newState);
    localStorage.setItem("dataCollection", newState.toString());
  };

  // Handle timer sound change
  const handleTimerSoundChange = (sound: string) => {
    setTimerSound(sound);
    localStorage.setItem("timerSound", sound);

    // Play a preview of the selected sound at reduced volume
    const soundMap: Record<string, string> = {
      bell: "sounds/timer-bell.mp3",
      digital: "sounds/timer-digital.mp3",
      gentle: "sounds/timer-gentle.mp3",
      alarm: "sounds/timer-alarm.mp3",
    };

    const soundFile = soundMap[sound] || soundMap["bell"];
    const audio = new Audio(chrome.runtime.getURL(soundFile));
    audio.volume = 0.3; // Reduced volume for preview

    audio.play().catch((error) => {
      console.error("Error playing sound preview:", error);
    });
  };

  // Handle timer volume change
  const handleTimerVolumeChange = (volume: number) => {
    setTimerVolume(volume);
    localStorage.setItem("timerVolume", volume.toString());
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
        localStorage.setItem("notificationsEnabled", "true");

        // Show a test notification
        const notification = new Notification("Notification Test", {
          body: "Notifications are now enabled!",
          icon: chrome.runtime.getURL("images/icon.png"),
        });

        // Play test sound
        const soundFile = localStorage.getItem("timerSound") || "bell";
        const soundMap: Record<string, string> = {
          bell: "sounds/timer-bell.mp3",
          digital: "sounds/timer-digital.mp3",
          gentle: "sounds/timer-gentle.mp3",
          alarm: "sounds/timer-alarm.mp3",
        };

        const audio = new Audio(
          chrome.runtime.getURL(soundMap[soundFile] || soundMap["bell"])
        );
        audio.volume = timerVolume / 100;
        audio.play().catch((error) => {
          console.error("Error playing notification test sound:", error);
        });
      } else {
        // If permission denied, disable notifications
        setNotificationsEnabled(false);
        localStorage.setItem("notificationsEnabled", "false");
        alert(
          "Notification permission denied. You won't receive notifications when the timer ends."
        );
      }
    });
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      console.log("signout successful");
      const window = await chrome.windows.getCurrent();
      if (window.id) {
        chrome.runtime.sendMessage({
          type: "navigate",
          windowId: window.id,
          path: "signin.html",
        } as NavigateMessage);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Timer functions
  const startTimer = () => {
    console.log("Starting timer...");
    if (isTimerRunning) return;

    const now = Date.now();

    if (timerType === "stopwatch") {
      timerStartTimeRef.current = now - timerPausedValueRef.current;

      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - timerStartTimeRef.current;
        setTimerValue(elapsed);
      }, 10);
    } else {
      // countdown
      const totalMilliseconds =
        (countdownMinutes * 60 + countdownSeconds) * 1000;

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
          window.clearInterval(timerIntervalRef.current!);
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
    if (!isTimerRunning || timerType !== "stopwatch") return;

    setLaps((prevLaps) => [...prevLaps, timerValue]);
  };

  const handleTimerTypeChange = (type: "stopwatch" | "countdown") => {
    if (isTimerRunning) {
      pauseTimer();
    }

    setTimerType(type);
    resetTimer();
  };

  const updateCountdownTime = (minutes: number, seconds: number) => {
    setCountdownMinutes(minutes);
    setCountdownSeconds(seconds);

    if (!isTimerRunning && timerType === "countdown") {
      const totalMilliseconds = (minutes * 60 + seconds) * 1000;
      setTimerValue(totalMilliseconds);
      timerPausedValueRef.current = totalMilliseconds;
    }
  };

  let username = "";
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "recordUsername") {
      username = message.data;
      console.log("username: " + username);
    }
  });


  function htmlToCleanText(html: string) {
      // Create a temporary element to parse the HTML
      const tempElement = document.createElement('div');
      tempElement.innerHTML = html;
      
      // Extract the plain text from the parsed HTML
      let text = tempElement.textContent || tempElement.innerText || '';
      
      // Clean up text (remove any excess whitespaces)
      text = text.replace(/\s+/g, ' ').trim();
      
      // Format the text for readability
      text = text.replace(/Example (\d+):/g, '\n\nExample $1:')
                .replace(/Input:/g, '\nInput:')
                .replace(/Output:/g, '\nOutput:')
                .replace(/Constraints:/g, '\nConstraints:')
                .replace(/\[ /g, '[') // Remove extra space before opening brackets
                .replace(/ \]/g, ']') // Remove extra space before closing brackets
                .replace(/\n/g, '\n\n'); // Ensure there's a space between lines
      
      return text;
  }

  function separateCodeSnipets(response: any) {
    console.log(response);
    setCodeSnippetsData(response || []);
    let tempTitle = "";
    const codeSnipetCards = response.map((item: any, index: any, array: any) => {
      return (<HintCard title={item.title} hint={item.code} type="code" description={item.description} key={index} ></HintCard>)});
    setCurrentCodeSnipets(codeSnipetCards);
    console.log(codeSnipetCards);
  }
  function slugToTitle(slug: string) {
    return slug
      .split('-') // Split the slug into words
      .map(word => word==='ii' ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join the words back together with spaces
  }

  chrome.runtime.onMessage.addListener(async(message, sender, respond) => {
      if (message.type === 'navigatedToProblem') {
        try {
          console.log("fetching problem hints for sidepanel");
          // Set loading state first
          setIsHintsLoading(true);
          
          // Update problem info
          setCurrentProblemId(message.problemId || null);
          setCurrentProblemTitle(slugToTitle(message.data) || "");
          setCurrentSlug(message.data);
          
          // Process the data
          setCurrentHint(message.hint);
          //console.log(message.codeSnipets);
          separateCodeSnipets(message.codeSnipets);
          setCurrentProblemTitle(slugToTitle(message.data));
          console.log("currentProblemTitle: ", message.data);
          
          //const descrResponse = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${message.data}`);
          //if (!descrResponse.ok) throw new Error("Problem not found or API error");
          //const data = await descrResponse.json();
          //const description = htmlToCleanText(data.question);
          //setCurrentProblemDescription(description);
          //console.log("currentProblemDescription: ", description);
  
          
          // Add a small delay before turning off loading to ensure smooth transitions
          setTimeout(() => {
            setIsHintsLoading(false);
          }, 200);
        } catch (e) {
          console.error("Error fetching problem hints: " + e);
          setCurrentProblem(undefined);
          setCurrentHint("");
          setCurrentCodeSnipets([]);
          setCodeSnippetsData([]);
          setIsHintsLoading(false);
        }
        console.log(message.hint);
      } else if (message.type === "displayDiscussions"){
        console.log("message.data: ", message.data);
        const selectedQuestions: any[] = message.data;
        const discussionCards: any[] = selectedQuestions.map( (item, index, array) => {
          return (
              <ResourceCard
                  key={index}
                  title={item.title}
                  link={item.link}
                  description={"Resource tags: \n" + item.tags.join("  ") || "No description available."}
                  difficulty="Easy"
                  type="Article"
              />
          );
      })
        setCurrentDiscussions(discussionCards);
      } else if (message.type === "sendDraft"){
        setCurrentDraft(message.data);
      }
    });

  const playTimerEndSound = () => {
    // Skip playing sound if notifications are disabled
    if (!notificationsEnabled) return;

    // Get the selected timer sound from localStorage or use the default
    const selectedSound = localStorage.getItem("timerSound") || "bell";
    const soundMap: Record<string, string> = {
      bell: "sounds/timer-bell.mp3",
      digital: "sounds/timer-digital.mp3",
      gentle: "sounds/timer-gentle.mp3",
      alarm: "sounds/timer-alarm.mp3",
    };

    // Create the audio instance with the selected sound
    const soundFile = soundMap[selectedSound] || soundMap["bell"];
    console.log("Playing timer end sound:", soundFile);

    // Create new audio object
    const audio = new Audio(chrome.runtime.getURL(soundFile));

    // Set volume based on user settings or default to 80%
    const volume = parseInt(localStorage.getItem("timerVolume") || "80") / 100;
    audio.volume = volume;
    console.log("Audio volume:", volume);

    // Make sure audio loads before playing
    audio.oncanplaythrough = () => {
      // Play the sound
      audio
        .play()
        .then(() => {
          console.log("Sound played successfully");
        })
        .catch((error) => {
          console.error("Error playing timer sound:", error);

          // Try playing with user interaction if failed
          const playWithInteraction = () => {
            alert("Timer finished! Click OK to hear the notification sound.");
            audio.play().catch((err) => {
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
      if (Notification.permission === "granted") {
        new Notification("Timer Complete", {
          body: "Your countdown timer has finished!",
          icon: chrome.runtime.getURL("images/icon.png"),
        });
      } else if (Notification.permission !== "denied") {
        // Request permission if not already denied
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Timer Complete", {
              body: "Your countdown timer has finished!",
              icon: chrome.runtime.getURL("images/icon.png"),
            });
          }
        });
      }
    }
  };

  const formatTime = (timeMs: number): string => {
    if (timerType === "stopwatch") {
      // Remove milliseconds display to prevent overlap
      const seconds = Math.floor((timeMs / 1000) % 60);
      const minutes = Math.floor((timeMs / 1000 / 60) % 60);
      const hours = Math.floor(timeMs / 1000 / 60 / 60);

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      // Countdown timer
      const seconds = Math.floor((timeMs / 1000) % 60);
      const minutes = Math.floor((timeMs / 1000 / 60) % 60);

      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  };

  
  const handleErrorToggle = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id!, { type: 'toggleErrorWidget', value: !scanForErrors });
    setScanForErrors(!scanForErrors);
  });}

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem("sidebarExpanded", newState.toString());
  };

  // Toggle profile menu
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Handle completion of verification
  const handleVerificationComplete = () => {
    console.log("running handleVerificationComplete");
    setShowVerification(false);
    setIsLoading(true);
    setShowLeetCodeLoader(true);
    chrome.runtime.onMessage.addListener(async(m,s,r) => {
      if(m.type === "retrievingUsername"){
        setIsLeetCodeLoggedIn(true);
      }
      if(m.type === "loggedIntoLeetCode"){
        setIsLeetCodeLoading(false);
        setTimeout(() => {
          setShowLeetCodeLoader(false);
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  // Function to handle sending a new message
  const handleSendMessage = async() => {
    if (!messageText.trim()) return;
    
    // Hide initial suggestions when user sends first message
    //setShowInitialSuggestions(false);
    
    // Create new user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    const history = messages.map((message) => {
      return JSON.stringify({role: message.role, text: message.content});
    });
    
    // Clear input field
    setMessageText("");
    
    // Show loading state
    setIsMessagesLoading(true);
    
    try {
      const response = await sendChat(messageText, history);
      const assistantResponse: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `${response}`,
        timestamp: new Date(),
        isError: false,
      };
      
      // Add the assistant's response and hide loading indicators
      setMessages(prevMessages => [...prevMessages, assistantResponse]);
      setIsTyping(false);
      setIsMessagesLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      setIsMessagesLoading(false);
    }
  };

  // Scroll to the bottom of messages when new ones come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

/*
    // Check if verification page should be shown
    if (showVerification) {
      console.log("User is not verified, showing verification page.");
      return (
        <div className={`container ${isLoading ? "loading" : ""}`}>
          <AnimatePresence>
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
                <VerificationPage onVerificationComplete={handleVerificationComplete} />
              </motion.div>
              </div>
              </motion.div>
          </AnimatePresence>
        </div>
      );
    }
*/
  // Render the sidepanel UI
  return (
    <div className={`container ${isLoading ? "loading" : ""}`}>
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
                    Your data is only used to enhance your coding experience and
                    is never shared with third parties.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Sidebar */}
      <nav className={`nav-sidebar ${sidebarExpanded ? "expanded" : ""}`}>
        <div className="sidebar-logo">
          <img
            className="icon-logo"
            src={chrome.runtime.getURL("images/icon.png")}
            alt="Cobra Icon"
          />
          <img
            className="full-logo"
            src={chrome.runtime.getURL("images/cobrawhite_enhanced.png")}
            alt="Cobra Logo"
          />
        </div>

        <div className="sidebar-toggle" onClick={handleSidebarToggle}>
          <i
            className={`fas fa-${
              sidebarExpanded ? "chevron-left" : "chevron-right"
            }`}
          ></i>
        </div>

        {/* Main Navigation Items */}
        <div className="nav-items-main">
          <div
            className={`nav-item ${activeSection === "home" ? "active" : ""}`}
            onClick={() => handleNavigation("home")}
          >
            <i className="fas fa-home"></i>
            {sidebarExpanded && <span className="nav-label">Home</span>}
          </div>
          <div
            className={`nav-item ${activeSection === "hints" ? "active" : ""}`}
            onClick={() => {handleNavigation("hints")}}
          >
            <i className="fas fa-lightbulb"></i>
            {sidebarExpanded && <span className="nav-label">Hints</span>}
          </div>
          <div
            className={`nav-item ${
              activeSection === "resources" ? "active" : ""
            }`}
            onClick={() => handleNavigation("resources")}
          >
            <i className="fas fa-book"></i>
            {sidebarExpanded && <span className="nav-label">Resources</span>}
          </div>
          <div
            className={`nav-item ${activeSection === "errors" ? "active" : ""}`}
            onClick={() => handleNavigation("errors")}
          >
            <i className="fas fa-bug"></i>
            {sidebarExpanded && <span className="nav-label">Errors</span>}
          </div>
          <div
            className={`nav-item ${
              activeSection === "stopwatch" ? "active" : ""
            }`}
            onClick={() => handleNavigation("stopwatch")}
          >
            <i className="fas fa-stopwatch"></i>
            {sidebarExpanded && <span className="nav-label">Stopwatch</span>}
          </div>
          <div
            className={`nav-item ${activeSection === "chat" ? "active" : ""}`}
            onClick={() => handleNavigation("chat")}
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
            className={`nav-item ${
              activeSection === "settings" ? "active" : ""
            }`}
            onClick={() => handleNavigation("settings")}
          >
            <i className="fas fa-cog"></i>
            {sidebarExpanded && <span className="nav-label">Settings</span>}
          </div>

          {/* Profile image */}
          <div className="sidebar-profile" onClick={handleProfileClick}>
            <img
              src={chrome.runtime.getURL("images/cobrapfp.png")}
              alt="Profile"
            />
          </div>

          {/* Profile Popup Menu */}
        </div>
      </nav>

      {/* Profile Popup Menu - Moved outside the sidebar for better positioning */}
      {showProfileMenu && (
        <div className="profile-popup">
          <div className="profile-header">{username}</div>
          <div
            className="profile-menu-item"
            onClick={() => {
              handleNavigation("settings");
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
          <div className="profile-menu-item logout" onClick={handleSignOut}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Log out</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="content">
          {/* Home Section */}
          <div
            className={`section ${activeSection === "home" ? "active" : ""}`}
            id="home"
          >
            <div className="content">
              {/* Removed Dashboard section title */}

              <CurrentProblem 
                problem={currentProblem}
                title={currentProblemTitle}
                description={currentProblemDescription}
                onGetHints= {() => {{console.log("clicked get hints")}}}
                onViewResources= {() => console.log("clicked view resources")}
                onRefresh= {() => console.log("clicked refresh")}
                onOpenExternal= {() => console.log("clicked open external")}
              ></CurrentProblem>

              {/* Quick Actions - Removed section title */}
              <div className="tools-grid">
                <motion.div
                  className="tool-button hints"
                  onClick={() => handleNavigation("hints")}
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
                  </div>
                </motion.div>

                <motion.div
                  className="tool-button resources"
                  onClick={() => handleNavigation("resources")}
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
                  </div>
                </motion.div>

                <motion.div
                  className="tool-button errors"
                  onClick={() => handleNavigation("errors")}
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
                  </div>
                </motion.div>

                <motion.div
                  className="tool-button chat"
                  onClick={() => handleNavigation("chat")}
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
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity - Removed section title */}
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
                          <div className="problem-subtitle">
                            Array, Hash Table
                          </div>
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
                          <div className="problem-title">
                            Merge Sorted Linked Lists
                          </div>
                          <div className="problem-subtitle">
                            Linked List, Recursion
                          </div>
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
                          <div className="problem-title">
                            Binary Tree Maximum Path Sum
                          </div>
                          <div className="problem-subtitle">
                            DFS, Binary Tree
                          </div>
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
          <div
            className={`section ${activeSection === "hints" ? "active" : ""}`}
            id="hints"
          >
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
                <input
                  type="text"
                  placeholder="Search hints..."
                  className="search-input"
                />
              </motion.div>

              <motion.div
                className="hint-categories"
                initial={
                  animationsEnabled
                    ? { opacity: 0, y: 20 }
                    : { opacity: 1, y: 0 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="hint-category-btn active"
                >
                  All
                </motion.button>
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="hint-category-btn"
                >
                  Basic
                </motion.button>
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="hint-category-btn"
                >
                  Intermediate
                </motion.button>
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="hint-category-btn"
                >
                  Advanced
                </motion.button>
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
                  <i className="fas fa-layer-group"></i> Hints Section
                </motion.h3>
                <div className="hint-grid">
                  <ConceptualHintContainer
                    title={currentProblemTitle}
                    hint={currentHint}
                    currentProblemId={currentProblemId}
                    isLoading={isHintsLoading}
                  />
                  <HintCardContainer 
                    hints={codeSnippetsData} 
                    currentProblemTitle={currentProblemTitle}
                    currentProblemId={currentProblemId}
                    isLoading={isHintsLoading} 
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Resources Section */}
          <div
            className={`section ${
              activeSection === "resources" ? "active" : ""
            }`}
            id="resources"
          >
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
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="search-input"
                />
              </motion.div>

              <motion.div
                className="resource-categories"
                initial={
                  animationsEnabled
                    ? { opacity: 0, y: 20 }
                    : { opacity: 1, y: 0 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="resource-category-btn active"
                >
                  All
                </motion.button>
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="resource-category-btn"
                >
                  Guides
                </motion.button>
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="resource-category-btn"
                >
                  Videos
                </motion.button>
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="resource-category-btn"
                >
                  Practice
                </motion.button>
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="resource-category-btn"
                >
                  Tools
                </motion.button>
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
                  {currentDiscussions}
                  <motion.div
                    className="resource-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      borderColor: "rgba(139, 92, 246, 0.5)",
                    }}
                  >
                    <div className="resource-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="resource-badge">Guide</div>
                    <h3>Dynamic Programming Patterns</h3>
                    <p>
                      Learn the most common patterns in dynamic programming
                      problems and how to approach them systematically.
                    </p>
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
                      whileHover={{
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {window.open("https://blog.algomaster.io/p/20-patterns-to-master-dynamic-programming","_blank");}}
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
                      borderColor: "rgba(139, 92, 246, 0.5)",
                    }}
                  >
                    <div className="resource-icon">
                      <i className="fas fa-video"></i>
                    </div>
                    <div className="resource-badge">Video</div>
                    <h3>Graph Algorithms Explained</h3>
                    <p>
                      A comprehensive video series on graph algorithms including
                      BFS, DFS, Dijkstra's, and more.
                    </p>
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
                      whileHover={{
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {window.open("https://www.youtube.com/watch?v=09_LlHjoEiY", "_blank");}}
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
                      borderColor: "rgba(139, 92, 246, 0.5)",
                    }}
                  >
                    <div className="resource-icon">
                      <i className="fas fa-code"></i>
                    </div>
                    <div className="resource-badge">Practice</div>
                    <h3>Binary Tree Visualizer</h3>
                    <p>
                      Interactive tool to visualize binary tree operations and
                      algorithms in real-time.
                    </p>
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
                      whileHover={{
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {window.open("https://visualgo.net/en/bst", "_blank");}}
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
                      borderColor: "rgba(139, 92, 246, 0.5)",
                    }}
                  >
                    <div className="resource-icon">
                      <i className="fas fa-puzzle-piece"></i>
                    </div>
                    <div className="resource-badge">Interactive</div>
                    <h3>Algorithm Playground</h3>
                    <p>
                      Test and visualize various algorithms with custom inputs
                      and see how they work step by step.
                    </p>
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
                      whileHover={{
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {window.open("https://algorithm-playground.netlify.app/?algorithm=insertionSort", "_blank");}}
                    >
                      <i className="fas fa-play"></i> Try It Out
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Error Analysis Section */}
          <div
            className={`section ${activeSection === "errors" ? "active" : ""}`}
            id="errors"
          >
            <div className="errors-container">
              <div className="search-container">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search errors..."
                  className="search-input"
                />
              </div>
              
              <div><button 
                className="error-filter-btn"
                onClick={handleErrorToggle}
                >Scan for Syntax Errors: {scanForErrors ? 'Enabled' : 'Disabled'}</button></div>

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
                      <div className="error-title">
                        ReferenceError: x is not defined
                      </div>
                    </div>
                    <div className="error-severity high">High</div>
                  </div>
                  <div className="error-details">
                    <div className="error-location"></div>
                    <div className="error-description">
                      <p>
                        Variable 'x' is used but never declared. Check for typos
                        or missing declarations.
                      </p>
                    </div>
                    <div className="error-code">
                      <pre>
                        <code>
                          {`function calculate() {
  return x * 10; // x is not defined
}`}
                        </code>
                      </pre>
                    </div>
                    <div className="error-fix">
                      <h4>Suggested Fix:</h4>
                      <div className="error-fix-code">
                        <pre>
                          <code>
                            {`function calculate(x) { // Add parameter
  return x * 10;
}

// OR

function calculate() {
  const x = 0; // Define x before using it
  return x * 10;
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="error-item">
                  <div className="error-header">
                    <div className="error-header-left">
                      <i className="fas fa-exclamation-triangle error-icon"></i>
                      <div className="error-title">
                        TypeError: Cannot read property 'length' of undefined
                      </div>
                    </div>
                    <div className="error-severity high">High</div>
                  </div>
                  <div className="error-details">
                    <div className="error-location"></div>
                    <div className="error-description">
                      <p>
                        Trying to access a property of an undefined variable.
                        Ensure the object exists before accessing its
                        properties.
                      </p>
                    </div>
                    <div className="error-code">
                      <pre>
                        <code>
                          {`function processData(data) {
  return data.items.length; // Error if data.items is undefined
}`}
                        </code>
                      </pre>
                    </div>
                    <div className="error-fix">
                      <h4>Suggested Fix:</h4>
                      <div className="error-fix-code">
                        <pre>
                          <code>
                            {`function processData(data) {
  // Check if data and data.items exist
  if (data && data.items) {
    return data.items.length;
  }
  return 0; // Default return value
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div
            className={`section ${activeSection === "chat" ? "active" : ""}`}
            id="chat"
          >
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
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                  ></motion.i>
                  CobraBot
                  <motion.span
                    className="status-badge online"
                    animate={{
                      opacity: [1, 0.7, 1],
                      scale: [1, 0.95, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Online
                  </motion.span>
                </h3>
              </motion.div>

              <div className="chat-messages" ref={chatMessagesRef}>
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`message ${message.role}`}
                      initial={{ opacity: 0, x: message.role === "assistant" ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      layout
                    >
                      {message.role === "assistant" && (
                        <motion.div
                          className="message-avatar"
                          whileHover={{ scale: 1.1 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                          }}
                        >
                          <img src="images/icon.png" alt="Cobra Assistant" />
                        </motion.div>
                      )}
                      <motion.div
                        className="message-content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <div className="message-text">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                      {message.role === "user" && (
                        <motion.div
                          className="message-avatar"
                          whileHover={{ scale: 1.1 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                          }}
                        >
                          <img src="images/cobrapfp.png" alt="User" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  {isMessagesLoading && (
                    <motion.div
                      className="message assistant"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      <motion.div
                        className="message-avatar"
                        whileHover={{ scale: 1.1 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <img src="images/icon.png" alt="Cobra Assistant" />
                      </motion.div>
                      <motion.div
                        className="message-content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="message-text">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {showInitialSuggestions && (
                <motion.div 
                  className="sliding-suggestions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <div className="suggestion-chips">
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        className="suggestion-chip"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(139, 92, 246, 0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setMessageText(prompt);
                          if (chatInputRef.current) {
                            chatInputRef.current.focus();
                          }
                        }}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                className={`chat-input-container ${showInitialSuggestions ? 'with-suggestions' : ''}`}
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
                      if (e.key === "Enter" && messageText.trim()) {
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="chat-input-buttons">
                    <motion.button
                      className="chat-input-button"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-microphone"></i>
                    </motion.button>
                    <motion.button
                      className="chat-input-button"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-code"></i>
                    </motion.button>
                  </div>
                </div>
                <motion.button
                  className="chat-send-button"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 5px 15px rgba(139, 92, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Stopwatch Section */}
          <div
            className={`section ${
              activeSection === "stopwatch" ? "active" : ""
            }`}
            id="stopwatch"
          >
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
                    className={`timer-type-btn ${
                      timerType === "stopwatch" ? "active" : ""
                    }`}
                    onClick={() => handleTimerTypeChange("stopwatch")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Stopwatch
                  </motion.button>
                  <motion.button
                    className={`timer-type-btn ${
                      timerType === "countdown" ? "active" : ""
                    }`}
                    onClick={() => handleTimerTypeChange("countdown")}
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
                          strokeDashoffset: isTimerRunning
                            ? [752.4, 0]
                            : 752.4 *
                              (1 -
                                timerValue /
                                  (timerType === "countdown"
                                    ? (countdownMinutes * 60 +
                                        countdownSeconds) *
                                      1000
                                    : 60000)),
                        }}
                        transition={{
                          duration: isTimerRunning
                            ? timerType === "countdown"
                              ? countdownMinutes * 60 + countdownSeconds
                              : 60
                            : 0.5,
                          ease: "linear",
                          repeat:
                            timerType === "stopwatch" && isTimerRunning
                              ? Infinity
                              : 0,
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
                          opacity: isTimerRunning ? [0.3, 0.1, 0.3] : 0.2,
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
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
                            fontFamily: "monospace",
                          }}
                          animate={{
                            scale: [1, 1.02, 1],
                            opacity: [0.9, 1, 0.9],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                          }}
                        >
                          {formatTime(timerValue).split(":").length > 2
                            ? formatTime(timerValue)
                                .split(":")
                                .slice(1)
                                .join(":")
                            : formatTime(timerValue)}
                        </motion.div>
                      </foreignObject>
                    </svg>
                  </motion.div>
                </div>

                {timerType === "countdown" && (
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
                        onChange={(e) =>
                          updateCountdownTime(
                            parseInt(e.target.value) || 0,
                            countdownSeconds
                          )
                        }
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
                        onChange={(e) =>
                          updateCountdownTime(
                            countdownMinutes,
                            parseInt(e.target.value) || 0
                          )
                        }
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
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
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
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
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
                  {timerType === "stopwatch" && (
                    <motion.button
                      className="timer-btn lap"
                      onClick={addLap}
                      disabled={!isTimerRunning}
                      whileHover={{
                        scale: isTimerRunning ? 1.05 : 1,
                        backgroundColor: isTimerRunning ? "#8B5CF6" : "#4B5563",
                      }}
                      whileTap={{ scale: isTimerRunning ? 0.95 : 1 }}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1, opacity: isTimerRunning ? 1 : 0.7 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <i className="fas fa-flag"></i> Lap
                    </motion.button>
                  )}
                </motion.div>

                {timerType === "stopwatch" && laps.length > 0 && (
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
                            <span className="lap-number">
                              Lap #{laps.length - index}
                            </span>
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
          {activeSection === "settings" && (
            <Settings
              theme={theme}
              fontSize={fontSize}
              windowSize={windowSize}
              defaultView={defaultView}
              animationsEnabled={animationsEnabled}
              notificationsEnabled={notificationsEnabled}
              dataCollection={dataCollection}
              timerSound={timerSound}
              timerVolume={timerVolume}
              onThemeToggle={handleThemeToggle}
              onFontSizeChange={handleFontSizeChange}
              onWindowSizeChange={handleWindowSizeChange}
              onDefaultViewChange={handleDefaultViewChange}
              onAnimationsToggle={handleAnimationsToggle}
              onNotificationsToggle={handleNotificationsToggle}
              onDataCollectionToggle={handleDataCollectionToggle}
              onTimerSoundChange={handleTimerSoundChange}
              onTimerVolumeChange={handleTimerVolumeChange}
              onRequestNotifications={requestNotificationPermission}
            />
          )}

          {/* Removed CodeAnalysis section */}
          
          {/* Toolbar */}
        </div>
      </div>
    </div>
  );
};

// Render the app
const renderApp = () => {
  const container = document.getElementById("app");
  if (container) {
    const root = createRoot(container);
    root.render(<SidePanel />);
  }
};

// Initialize the app when the DOM is ready
document.addEventListener("DOMContentLoaded", renderApp);

export default SidePanel;
