import React from 'react';
import { motion } from 'framer-motion';

export interface ActivityItem {
  id: string;
  type: 'solved' | 'hint' | 'failed' | 'started';
  problemTitle: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  onViewAll: () => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onViewAll
}) => {
  // Format the timestamp to a readable format
  const formatTime = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }
    if (diffMins > 0) {
      return `${diffMins}m ago`;
    }
    return 'Just now';
  };

  // Get icon based on activity type
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'solved':
        return <i className="fas fa-check-circle activity-icon solved"></i>;
      case 'hint':
        return <i className="fas fa-lightbulb activity-icon hint"></i>;
      case 'failed':
        return <i className="fas fa-times-circle activity-icon failed"></i>;
      case 'started':
        return <i className="fas fa-play-circle activity-icon started"></i>;
      default:
        return <i className="fas fa-circle activity-icon"></i>;
    }
  };

  // Get description based on activity type
  const getActivityDescription = (activity: ActivityItem): string => {
    switch (activity.type) {
      case 'solved':
        return `Solved problem "${activity.problemTitle}"`;
      case 'hint':
        return `Used a hint for "${activity.problemTitle}"`;
      case 'failed':
        return `Failed attempt on "${activity.problemTitle}"`;
      case 'started':
        return `Started working on "${activity.problemTitle}"`;
      default:
        return `Activity on "${activity.problemTitle}"`;
    }
  };

  return (
    <motion.div 
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="card-header">
        <div className="card-header-left">
          <i className="fas fa-history"></i>
          <h3>Recent Activity</h3>
        </div>
        <div className="card-header-right">
          <button className="card-link-button" onClick={onViewAll}>
            View All
          </button>
        </div>
      </div>
      <div className="card-content">
        {activities.length === 0 ? (
          <div className="no-activity">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="activity-list">
            {activities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className="activity-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="activity-icon-container">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-details">
                  <div className="activity-description">
                    {getActivityDescription(activity)}
                  </div>
                  <div className="activity-time">
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity; 