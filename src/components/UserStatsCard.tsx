import React from 'react';
import { User } from '../types/User';
import '../styles/userStats.css';

interface UserStatsCardProps {
  user: User;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ user }) => {
  const { name, country, problemsSolved, rank, badge, currentProblem } = user;
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="user-stats-card">
      <div className="user-header">
        <div className="user-avatar">
          {getInitials(name)}
        </div>
        <div className="user-info">
          <div className="user-name">{name}</div>
          <div className="user-country">{country}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{problemsSolved}</div>
          <div className="stat-label">Problems Solved</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{rank}</div>
          <div className="stat-label">Global Rank</div>
        </div>
      </div>

      {currentProblem && (
        <div className="current-problem">
          <div className="problem-header">Currently Working On</div>
          <div className="problem-title">{currentProblem.title}</div>
          <div className={`problem-badge difficulty-${currentProblem.difficulty.toLowerCase()}`}>
            {currentProblem.difficulty}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatsCard; 