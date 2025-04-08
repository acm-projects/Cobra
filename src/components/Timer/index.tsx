import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TimerPresets, { TimerPreset } from './TimerPresets';
import TimerHistory, { TimerHistoryEntry } from './TimerHistory';
import useTimer from '../../hooks/useTimer';

const Timer: React.FC = () => {
  // Use the custom timer hook
  const {
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
  } = useTimer();

  // State for timer history and presets
  const [timerHistory, setTimerHistory] = useState<TimerHistoryEntry[]>([
    {
      id: '1',
      label: 'Problem Solving Session',
      duration: 7200, // 2 hours
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      label: 'Quick Break',
      duration: 900, // 15 minutes
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      id: '3',
      label: 'Focus Session',
      duration: 3600, // 1 hour
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    }
  ]);

  const [presets] = useState<TimerPreset[]>([
    { id: 'preset1', name: 'Pomodoro', hours: 0, minutes: 25, seconds: 0 },
    { id: 'preset2', name: 'Short Break', hours: 0, minutes: 5, seconds: 0 },
    { id: 'preset3', name: 'Long Break', hours: 0, minutes: 15, seconds: 0 },
    { id: 'preset4', name: 'Focus Hour', hours: 1, minutes: 0, seconds: 0 }
  ]);

  // Handle saving timer
  const handleSaveTimer = () => {
    const currentTotalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (currentTotalSeconds === 0) return; // Don't save empty timers
    
    const newEntry: TimerHistoryEntry = {
      id: Date.now().toString(),
      label: 'Timer Session',
      duration: currentTotalSeconds,
      timestamp: new Date()
    };
    
    setTimerHistory(prev => [newEntry, ...prev]);
  };

  // Handle loading a timer from history
  const handleLoadTimer = (entry: TimerHistoryEntry) => {
    const hours = Math.floor(entry.duration / 3600);
    const minutes = Math.floor((entry.duration % 3600) / 60);
    const seconds = entry.duration % 60;
    
    setTime(hours, minutes, seconds);
  };

  // Handle removing a history entry
  const handleRemoveEntry = (id: string) => {
    setTimerHistory(prev => prev.filter(entry => entry.id !== id));
  };

  // Handle clearing all history
  const handleClearHistory = () => {
    setTimerHistory([]);
  };

  // Handle selecting a preset
  const handleSelectPreset = (preset: TimerPreset) => {
    setTime(preset.hours, preset.minutes, preset.seconds);
  };

  // Handle opening custom time dialog
  const handleCustomTime = () => {
    // For a simple implementation, we'll just use prompt dialogs
    // In a real app, you would create a custom modal component
    const hoursInput = prompt('Enter hours (0-24):', '0');
    const minutesInput = prompt('Enter minutes (0-59):', '0');
    const secondsInput = prompt('Enter seconds (0-59):', '0');
    
    const hours = parseInt(hoursInput || '0');
    const minutes = parseInt(minutesInput || '0');
    const seconds = parseInt(secondsInput || '0');
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      alert('Please enter valid numbers');
      return;
    }
    
    setTime(
      Math.min(Math.max(0, hours), 24),
      Math.min(Math.max(0, minutes), 59),
      Math.min(Math.max(0, seconds), 59)
    );
  };

  // Play alarm sound when timer reaches zero
  useEffect(() => {
    let alarm: HTMLAudioElement | null = null;
    
    if (isRunning && hours === 0 && minutes === 0 && seconds === 0) {
      alarm = new Audio('sounds/timer-alarm.mp3');
      alarm.play();
    }
    
    return () => {
      if (alarm) {
        alarm.pause();
        alarm.currentTime = 0;
      }
    };
  }, [hours, minutes, seconds, isRunning]);

  return (
    <motion.div 
      className="timer-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="timer-header">
        <h2>Timer</h2>
      </div>
      
      <div className="timer-content">
        <div className="timer-main">
          <TimerDisplay 
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            isRunning={isRunning}
            isPaused={isPaused}
          />
          
          <TimerControls 
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={startTimer}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onReset={resetTimer}
            onSave={handleSaveTimer}
          />
          
          <TimerPresets 
            presets={presets}
            onSelectPreset={handleSelectPreset}
            onCustomTime={handleCustomTime}
          />
        </div>
        
        <div className="timer-sidebar">
          <TimerHistory 
            history={timerHistory}
            onClearHistory={handleClearHistory}
            onLoadTimer={handleLoadTimer}
            onRemoveEntry={handleRemoveEntry}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Timer; 