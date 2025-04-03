import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TimerHistoryEntry {
  id: string;
  label: string;
  duration: number; // in seconds
  timestamp: Date;
}

interface TimerHistoryProps {
  history: TimerHistoryEntry[];
  onClearHistory: () => void;
  onLoadTimer: (entry: TimerHistoryEntry) => void;
  onRemoveEntry: (id: string) => void;
}

const TimerHistory: React.FC<TimerHistoryProps> = ({
  history,
  onClearHistory,
  onLoadTimer,
  onRemoveEntry
}) => {
  // Format duration in seconds to HH:MM:SS
  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    return [
      hours > 0 ? hours.toString().padStart(2, '0') : '00',
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Format date to a readable string
  const formatDate = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date >= yesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  return (
    <motion.div 
      className="timer-history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="history-header">
        <h4>Timer History</h4>
        {history.length > 0 && (
          <button 
            className="clear-history-button" 
            onClick={onClearHistory}
          >
            <i className="fas fa-trash-alt"></i>
            <span>Clear All</span>
          </button>
        )}
      </div>
      
      <div className="history-list">
        <AnimatePresence>
          {history.length === 0 ? (
            <motion.div 
              className="empty-history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <i className="fas fa-history"></i>
              <p>No timer history yet</p>
            </motion.div>
          ) : (
            history.map((entry, index) => (
              <motion.div 
                key={entry.id}
                className="history-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="history-item-info">
                  <div className="history-item-label">{entry.label || 'Unnamed timer'}</div>
                  <div className="history-item-time">{formatDuration(entry.duration)}</div>
                  <div className="history-item-date">{formatDate(entry.timestamp)}</div>
                </div>
                <div className="history-item-actions">
                  <button 
                    className="history-action-button load"
                    onClick={() => onLoadTimer(entry)}
                  >
                    <i className="fas fa-play"></i>
                  </button>
                  <button 
                    className="history-action-button remove"
                    onClick={() => onRemoveEntry(entry.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TimerHistory; 