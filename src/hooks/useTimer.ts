import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTimerReturn {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setTime: (hours: number, minutes: number, seconds: number) => void;
}

export const useTimer = (): UseTimerReturn => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Store timer in ref so it can be accessed in the cleanup function
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Store initial time values for reset functionality
  const initialTimeRef = useRef({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Cleanup function to clear the timer interval
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Set the timer to specified values
  const setTime = useCallback((h: number, m: number, s: number) => {
    // Stop any running timer
    clearTimer();
    
    // Update state
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setIsRunning(false);
    setIsPaused(false);
    
    // Store initial values for reset
    initialTimeRef.current = { hours: h, minutes: m, seconds: s };
  }, [clearTimer]);
  
  // Start the timer
  const startTimer = useCallback(() => {
    // Don't start if already running
    if (isRunning) return;
    
    // Don't start if all values are 0
    if (hours === 0 && minutes === 0 && seconds === 0) return;
    
    // Store initial values for reset
    initialTimeRef.current = { hours, minutes, seconds };
    
    // Start timer
    setIsRunning(true);
    setIsPaused(false);
  }, [hours, minutes, seconds, isRunning]);
  
  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (!isRunning || isPaused) return;
    
    setIsPaused(true);
  }, [isRunning, isPaused]);
  
  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (!isRunning || !isPaused) return;
    
    setIsPaused(false);
  }, [isRunning, isPaused]);
  
  // Reset the timer to initial values
  const resetTimer = useCallback(() => {
    clearTimer();
    
    const { hours, minutes, seconds } = initialTimeRef.current;
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
    setIsRunning(false);
    setIsPaused(false);
  }, [clearTimer]);
  
  // Timer decrement logic
  const decrementTimer = useCallback(() => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      // Timer has reached 00:00:00, stop it
      clearTimer();
      setIsRunning(false);
      return;
    }
    
    if (seconds > 0) {
      setSeconds(seconds - 1);
    } else if (minutes > 0) {
      setMinutes(minutes - 1);
      setSeconds(59);
    } else if (hours > 0) {
      setHours(hours - 1);
      setMinutes(59);
      setSeconds(59);
    }
  }, [hours, minutes, seconds, clearTimer]);
  
  // Set up the timer interval
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(decrementTimer, 1000);
    } else {
      clearTimer();
    }
    
    // Clean up on unmount
    return clearTimer;
  }, [isRunning, isPaused, decrementTimer, clearTimer]);
  
  return {
    hours,
    minutes,
    seconds,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setTime
  };
};

export default useTimer; 