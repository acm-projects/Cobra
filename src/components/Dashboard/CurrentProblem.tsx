import React from 'react';
import { motion } from 'framer-motion';
import { ProblemInfo } from '../../types';

interface CurrentProblemProps {
  problem?: ProblemInfo;
  onGetHints: () => void;
  onViewResources: () => void;
  onRefresh: () => void;
  onOpenExternal: () => void;
}

const CurrentProblem: React.FC<CurrentProblemProps> = ({
  problem,
  onGetHints,
  onViewResources,
  onRefresh,
  onOpenExternal
}) => {
  // If no problem is detected
  if (!problem) {
    return (
      <motion.div 
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-header">
          <div className="card-header-left">
            <i className="fas fa-code"></i>
            <h3>Current Problem</h3>
          </div>
          <div className="card-header-right">
            <div className="card-actions">
              <button className="card-action-button" onClick={onRefresh}>
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
        <motion.div 
          className="card-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ fontSize: "13px", padding: "8px 0" }}
          >
            No active problem detected. Navigate to a coding problem to activate.
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // Format the time elapsed since start
  const getTimeElapsed = () => {
    if (!problem.startTime) return 'Just started';
    
    const now = new Date();
    const diffMs = now.getTime() - problem.startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just started';
    return `Started ${diffMins} min ago`;
  };

  return (
    <motion.div 
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <div className="card-header-left">
          <i className="fas fa-code"></i>
          <h3>{problem.title}</h3>
        </div>
        <div className="card-header-right">
          <div className="card-actions">
            <button className="card-action-button" onClick={onRefresh}>
              <i className="fas fa-sync-alt"></i>
            </button>
            <button className="card-action-button" onClick={onOpenExternal}>
              <i className="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="problem-info">
          <div className="problem-meta">
            <div className={`problem-difficulty ${problem.difficulty}`}>
              <i className="fas fa-signal"></i>
              <span>{problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}</span>
            </div>
            <div className="problem-time">
              <i className="fas fa-clock"></i>
              <span>{getTimeElapsed()}</span>
            </div>
          </div>
          <div className="problem-description">
            {problem.description}
          </div>
          <div className="problem-tags">
            {problem.tags.map((tag, index) => (
              <span key={index} className="problem-tag">{tag}</span>
            ))}
          </div>
          <div className="problem-actions">
            <button className="problem-action-btn primary" onClick={onGetHints}>
              <i className="fas fa-lightbulb"></i>
              <span>Get Hints</span>
            </button>
            <button className="problem-action-btn secondary" onClick={onViewResources}>
              <i className="fas fa-book"></i>
              <span>View Resources</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentProblem; 