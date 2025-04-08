import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  hours,
  minutes,
  seconds,
  isRunning,
  isPaused
}) => {
  // Format the time with leading zeros
  const formatTime = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  // Get status text based on timer state
  const getStatusText = (): string => {
    if (!isRunning && !isPaused) return 'Ready';
    if (isPaused) return 'Paused';
    return 'Running';
  };

  // Get status class based on timer state
  const getStatusClass = (): string => {
    if (!isRunning && !isPaused) return 'ready';
    if (isPaused) return 'paused';
    return 'running';
  };

  return (
    <motion.div 
      className="timer-display"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="timer-time">
        <AnimatePresence mode="wait">
          <motion.span 
            key={`hours-${hours}`}
            className="timer-digit"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(hours)}
          </motion.span>
        </AnimatePresence>
        <span className="timer-separator">:</span>
        <AnimatePresence mode="wait">
          <motion.span 
            key={`minutes-${minutes}`}
            className="timer-digit"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(minutes)}
          </motion.span>
        </AnimatePresence>
        <span className="timer-separator">:</span>
        <AnimatePresence mode="wait">
          <motion.span 
            key={`seconds-${seconds}`}
            className="timer-digit"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(seconds)}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className={`timer-status ${getStatusClass()}`}>
        <div className="status-indicator"></div>
        <div className="status-text">{getStatusText()}</div>
      </div>
    </motion.div>
  );
};

export default TimerDisplay; 