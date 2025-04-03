import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerState, TimerType, TimerSoundType } from '../types';
import { formatTime } from '../utils/formatters';

interface UseTimerProps {
  initialType?: TimerType;
  initialMinutes?: number;
  initialSeconds?: number;
  initialSound?: TimerSoundType;
  initialVolume?: number;
}

export const useTimer = ({
  initialType = 'stopwatch',
  initialMinutes = 25,
  initialSeconds = 0,
  initialSound = 'bell',
  initialVolume = 80
}: UseTimerProps = {}) => {
  // Timer state
  const [timerState, setTimerState] = useState<TimerState>({
    timerType: initialType,
    isRunning: false,
    value: initialType === 'countdown' ? (initialMinutes * 60 + initialSeconds) * 1000 : 0,
    laps: [],
    countdownMinutes: initialMinutes,
    countdownSeconds: initialSeconds
  });
  
  // Timer sound settings
  const [timerSound, setTimerSound] = useState<TimerSoundType>(initialSound);
  const [timerVolume, setTimerVolume] = useState<number>(initialVolume);
  
  // Refs
  const timerIntervalRef = useRef<number | null>(null);
  const timerStartTimeRef = useRef<number>(0);
  const timerPausedValueRef = useRef<number>(0);
  
  // Format current time
  const formattedTime = formatTime(timerState.value, timerState.timerType);
  
  // Start the timer
  const startTimer = useCallback(() => {
    if (timerState.isRunning) return;
    
    clearInterval(timerIntervalRef.current || undefined);
    
    const startTime = Date.now();
    timerStartTimeRef.current = startTime;
    
    if (timerState.timerType === 'stopwatch') {
      // For stopwatch, we continue from the last paused value
      timerIntervalRef.current = window.setInterval(() => {
        const elapsedSinceStart = Date.now() - timerStartTimeRef.current;
        setTimerState(prev => ({
          ...prev,
          value: timerPausedValueRef.current + elapsedSinceStart
        }));
      }, 10);
    } else {
      // For countdown, we count down from the current value
      const targetTime = startTime + timerState.value;
      
      timerIntervalRef.current = window.setInterval(() => {
        const remaining = Math.max(0, targetTime - Date.now());
        setTimerState(prev => ({
          ...prev,
          value: remaining
        }));
        
        if (remaining <= 0) {
          clearInterval(timerIntervalRef.current || undefined);
          timerIntervalRef.current = null;
          playTimerEndSound();
          setTimerState(prev => ({
            ...prev,
            isRunning: false
          }));
        }
      }, 10);
    }
    
    setTimerState(prev => ({
      ...prev,
      isRunning: true
    }));
  }, [timerState.isRunning, timerState.timerType, timerState.value]);
  
  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (!timerState.isRunning) return;
    
    clearInterval(timerIntervalRef.current || undefined);
    timerIntervalRef.current = null;
    
    // Store the current value for when we resume
    timerPausedValueRef.current = timerState.value;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
  }, [timerState.isRunning, timerState.value]);
  
  // Reset the timer
  const resetTimer = useCallback(() => {
    clearInterval(timerIntervalRef.current || undefined);
    timerIntervalRef.current = null;
    timerPausedValueRef.current = 0;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      value: prev.timerType === 'countdown' 
        ? (prev.countdownMinutes * 60 + prev.countdownSeconds) * 1000 
        : 0,
      laps: []
    }));
  }, []);
  
  // Add a lap
  const addLap = useCallback(() => {
    if (timerState.timerType === 'stopwatch' && timerState.isRunning) {
      setTimerState(prev => ({
        ...prev,
        laps: [...prev.laps, prev.value]
      }));
    }
  }, [timerState.timerType, timerState.isRunning]);
  
  // Change timer type
  const changeTimerType = useCallback((type: TimerType) => {
    // Reset before changing
    clearInterval(timerIntervalRef.current || undefined);
    timerIntervalRef.current = null;
    timerPausedValueRef.current = 0;
    
    setTimerState(prev => ({
      ...prev,
      timerType: type,
      isRunning: false,
      value: type === 'countdown' 
        ? (prev.countdownMinutes * 60 + prev.countdownSeconds) * 1000 
        : 0,
      laps: []
    }));
  }, []);
  
  // Update countdown time
  const updateCountdownTime = useCallback((minutes: number, seconds: number) => {
    const newValue = (minutes * 60 + seconds) * 1000;
    
    setTimerState(prev => ({
      ...prev,
      countdownMinutes: minutes,
      countdownSeconds: seconds,
      value: prev.timerType === 'countdown' ? newValue : prev.value
    }));
  }, []);
  
  // Play timer end sound
  const playTimerEndSound = useCallback(() => {
    try {
      const audio = new Audio(chrome.runtime.getURL(`sounds/timer-${timerSound}.mp3`));
      audio.volume = timerVolume / 100;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Audio play error:', error);
          // Try with user interaction
          const playWithInteraction = () => {
            audio.play().catch(err => {
              console.error('Audio play error with interaction:', err);
            });
            document.removeEventListener('click', playWithInteraction);
          };
          
          document.addEventListener('click', playWithInteraction, { once: true });
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [timerSound, timerVolume]);
  
  // Change timer sound
  const changeTimerSound = useCallback((sound: TimerSoundType) => {
    setTimerSound(sound);
    localStorage.setItem('timerSound', sound);
  }, []);
  
  // Change timer volume
  const changeTimerVolume = useCallback((volume: number) => {
    setTimerVolume(volume);
    localStorage.setItem('timerVolume', volume.toString());
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current || undefined);
    };
  }, []);
  
  return {
    timerState,
    formattedTime,
    timerSound,
    timerVolume,
    startTimer,
    pauseTimer,
    resetTimer,
    addLap,
    changeTimerType,
    updateCountdownTime,
    changeTimerSound,
    changeTimerVolume,
    playTimerEndSound
  };
}; 