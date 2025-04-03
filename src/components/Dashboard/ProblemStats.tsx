import React from 'react';
import { motion } from 'framer-motion';

interface ProblemStatsProps {
  problemsSolved: number;
  streakDays: number;
  totalHints: number;
  averageTime: number; // in minutes
}

const ProblemStats: React.FC<ProblemStatsProps> = ({
  problemsSolved,
  streakDays,
  totalHints,
  averageTime
}) => {
  return (
    <motion.div 
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="card-header">
        <div className="card-header-left">
          <i className="fas fa-chart-bar"></i>
          <h3>Problem Stats</h3>
        </div>
      </div>
      <div className="card-content">
        <div className="stats-container">
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{problemsSolved}</span>
              <span className="stat-label">Problems Solved</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="stat-icon">
              <i className="fas fa-fire"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{streakDays}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="stat-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalHints}</span>
              <span className="stat-label">Hints Used</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{averageTime}</span>
              <span className="stat-label">Avg Time (min)</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemStats; 