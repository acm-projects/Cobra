import React from 'react';
import { motion } from 'framer-motion';
import type { ProblemInfo } from '../../types';

interface UserStatsCardProps {
  username: string;
  country: string;
  submissions: number;
  currentProblem?: ProblemInfo;
  animationsEnabled?: boolean;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({
  username = 'User',
  country = 'United States',
  submissions = 0,
  currentProblem,
  animationsEnabled = true
}) => {
  const countryFlag = getCountryFlag(country);
  
  return (
    <motion.div 
      className="stats-card"
      initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stats-header">
        <div className="user-info">
          <div className="user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h3>{username}</h3>
            <div className="user-country">
              <span className="country-flag">{countryFlag}</span>
              <span>{country}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="stats-metrics">
        <div className="stat-item">
          <div className="stat-value">{submissions}</div>
          <div className="stat-label">Submissions</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{currentProblem?.difficulty || '-'}</div>
          <div className="stat-label">Difficulty</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{calculateSuccessRate(submissions)}%</div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>
      
      {currentProblem && (
        <div className="current-problem-info">
          <h4>Current Problem</h4>
          <div className="problem-title">{currentProblem.title || 'No active problem'}</div>
          {currentProblem.difficulty && (
            <div className={`problem-difficulty ${currentProblem.difficulty.toLowerCase()}`}>
              {currentProblem.difficulty}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Helper function to get a flag emoji for a country
function getCountryFlag(country: string): string {
  const countryToFlag: Record<string, string> = {
    'United States': '🇺🇸',
    'Canada': '🇨🇦',
    'United Kingdom': '🇬🇧',
    'Australia': '🇦🇺',
    'India': '🇮🇳',
    'China': '🇨🇳',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Japan': '🇯🇵',
    'Brazil': '🇧🇷',
    // Add more mappings as needed
  };
  
  return countryToFlag[country] || '🌎';
}

// Helper function to calculate a dummy success rate
function calculateSuccessRate(submissions: number): number {
  if (submissions === 0) return 0;
  
  // This is just a dummy calculation for the UI
  // In a real app, you would calculate this based on successful submissions
  const randomFactor = Math.floor(Math.random() * 20) + 60;
  return Math.min(randomFactor, 100);
}

export default UserStatsCard; 