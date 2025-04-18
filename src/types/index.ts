// Type definitions for the app
export interface NavigateMessage {
  type: 'navigate';
  windowId?: number;
  path: string;
}

export interface WindowSize {
  size: 'compact' | 'medium' | 'large';
  width?: number;
  height?: number;
}

// Extending Chrome API types
export interface ChromeSidePanel extends chrome.sidePanel.SidePanel {
  close(): Promise<void>;
}

// Types for app preferences
export type ThemeType = 'light' | 'dark';
export type FontSizeType = 'small' | 'medium' | 'large';
export type TimerType = 'stopwatch' | 'countdown';
export type TimerSoundType = 'bell' | 'digital' | 'gentle' | 'alarm';

// Section names for navigation
export type SectionType = 'dashboard' | 'chat' | 'learn' | 'practice' | 'timer' | 'settings' | 'profile';

// Interface for app preferences/settings
export interface AppPreferences {
  theme: ThemeType;
  fontSize: FontSizeType;
  windowSize: WindowSize['size'];
  defaultView: SectionType;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  dataCollection: boolean;
  sidebarExpanded: boolean;
  timerSound: TimerSoundType;
  timerVolume: number;
}

// Timer state interface
export interface TimerState {
  timerType: TimerType;
  isRunning: boolean;
  value: number;
  laps: number[];
  countdownMinutes: number;
  countdownSeconds: number;
}

// Problem information interface
export interface ProblemInfo {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  tags: string[];
  startTime?: Date;
  url?: string;
}

// Recent activity problem item
export interface RecentProblem {
  title: string;
  subtopics: string[];
  status: 'solved' | 'failed' | 'in-progress';
}

// Chat history item
export interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  date: string;
}

// User types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserPreferences {
  theme: ThemeMode;
  fontSize: FontSize;
  showNotifications: boolean;
}

// Timer related types
export interface TimerSession {
  id: string;
  label?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  active: boolean;
  badge?: number;
}

// Chat related types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Hint related types
export interface HintCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Hint {
  id: string;
  title: string;
  content: string;
  codeSnippets?: string[];
  categoryId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
} 