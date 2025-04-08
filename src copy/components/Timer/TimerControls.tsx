import React from 'react';
import { motion } from 'framer-motion';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSave: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  onSave
}) => {
  // Button variants for animation
  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="timer-controls"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="timer-main-controls">
        {!isRunning && !isPaused ? (
          <motion.button 
            className="timer-button start"
            onClick={onStart}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            transition={{ duration: 0.2 }}
          >
            <i className="fas fa-play"></i>
            <span>Start</span>
          </motion.button>
        ) : isPaused ? (
          <motion.button 
            className="timer-button resume"
            onClick={onResume}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            transition={{ duration: 0.2 }}
          >
            <i className="fas fa-play"></i>
            <span>Resume</span>
          </motion.button>
        ) : (
          <motion.button 
            className="timer-button pause"
            onClick={onPause}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            transition={{ duration: 0.2 }}
          >
            <i className="fas fa-pause"></i>
            <span>Pause</span>
          </motion.button>
        )}
      </div>
      
      <div className="timer-secondary-controls">
        {(isRunning || isPaused) && (
          <motion.button 
            className="timer-button reset"
            onClick={onReset}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <i className="fas fa-undo-alt"></i>
            <span>Reset</span>
          </motion.button>
        )}
        
        {(isRunning || isPaused) && (
          <motion.button 
            className="timer-button save"
            onClick={onSave}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <i className="fas fa-save"></i>
            <span>Save</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default TimerControls; 