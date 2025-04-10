import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrentProblem from './CurrentProblem';
import ProblemStats from './ProblemStats';
import RecentActivity from './RecentActivity';
import LeetCodeLoader from '../Loading/LeetCodeLoader';
import { ProblemInfo } from '../../types';
import { ActivityItem } from './RecentActivity';

const Dashboard: React.FC = () => {
  // State for LeetCode loader
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [isLeetCodeLoggedIn, setIsLeetCodeLoggedIn] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);

  // Mock data for the dashboard components
  // In a real implementation, this would come from APIs or context
  const [currentProblem, setCurrentProblem] = useState<ProblemInfo | undefined>({
    id: 'prob123',
    title: 'Two Sum',
    difficulty: 'medium',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    tags: ['Array', 'Hash Table'],
    startTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    url: 'https://leetcode.com/problems/two-sum/'
  });

  const [stats, setStats] = useState({
    problemsSolved: 42,
    streakDays: 7,
    totalHints: 15,
    averageTime: 23 // in minutes
  });

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'act1',
      type: 'solved',
      problemTitle: 'Valid Parentheses',
      timestamp: new Date(Date.now() - 2 * 60 * 60000) // 2 hours ago
    },
    {
      id: 'act2',
      type: 'hint',
      problemTitle: 'Two Sum',
      timestamp: new Date(Date.now() - 30 * 60000) // 30 minutes ago
    },
    {
      id: 'act3',
      type: 'started',
      problemTitle: 'Two Sum',
      timestamp: new Date(Date.now() - 20 * 60000) // 20 minutes ago
    },
    {
      id: 'act4',
      type: 'failed',
      problemTitle: 'Merge Intervals',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000) // 1 day ago
    }
  ]);

  // Check LeetCode login status and fetch statistics
  useEffect(() => {
    const checkLeetCodeStatus = async () => {
      try {
        // Simulate checking if user is logged into LeetCode
        // In a real implementation, this would make an API call to check login status
        setTimeout(() => {
          // For demo purposes, we'll simulate being logged in after 2 seconds
          setIsLeetCodeLoggedIn(true);
          
          // After detecting login, simulate fetching statistics
          setTimeout(() => {
            // This is where you would fetch actual LeetCode stats
            setIsLoadingStats(false);
            
            // After loading is complete, hide the loader after a short delay
            setTimeout(() => {
              setShowLoader(false);
            }, 1000);
          }, 2000);
        }, 2000);
      } catch (error) {
        console.error('Error checking LeetCode status:', error);
        setIsLoadingStats(false);
      }
    };
    
    checkLeetCodeStatus();
  }, []);

  // Force show loader again (for testing or refreshing)
  const refreshLeetCodeStats = () => {
    setShowLoader(true);
    setIsLoadingStats(true);
    setIsLeetCodeLoggedIn(false);
    
    // Re-run the check and loading sequence
    setTimeout(() => {
      setIsLeetCodeLoggedIn(true);
      setTimeout(() => {
        setIsLoadingStats(false);
        setTimeout(() => {
          setShowLoader(false);
        }, 1000);
      }, 2000);
    }, 2000);
  };

  // Handler functions
  const handleGetHints = () => {
    // Navigate to hints section or show hints modal
    console.log('Getting hints for problem:', currentProblem?.title);
  };

  const handleViewResources = () => {
    // Navigate to resources section
    console.log('Viewing resources for problem:', currentProblem?.title);
  };

  const handleRefreshProblem = () => {
    // Refresh problem data
    console.log('Refreshing problem data');
    // Optionally refresh LeetCode stats as well
    refreshLeetCodeStats();
  };

  const handleOpenExternal = () => {
    // Open problem in external browser
    if (currentProblem?.url) {
      window.open(currentProblem.url, '_blank');
    }
  };

  const handleViewAllActivity = () => {
    // Navigate to activity history page
    console.log('Viewing all activity');
  };

  // Clear current problem (for testing empty state)
  const clearProblem = () => {
    setCurrentProblem(undefined);
  };

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* LeetCode Loader */}
      <AnimatePresence>
        {showLoader && (
          <LeetCodeLoader
            isLoggedIn={isLeetCodeLoggedIn}
            isLoading={isLoadingStats}
          />
        )}
      </AnimatePresence>
      
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-actions">
          <button className="dashboard-action-button" onClick={refreshLeetCodeStats}>
            <i className="fas fa-sync-alt"></i>
            <span>Refresh LeetCode Stats</span>
          </button>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <CurrentProblem 
            problem={currentProblem}
            onGetHints={handleGetHints}
            onViewResources={handleViewResources}
            onRefresh={handleRefreshProblem}
            onOpenExternal={handleOpenExternal}
          />
          
          <RecentActivity 
            activities={activities} 
            onViewAll={handleViewAllActivity}
          />
        </div>
        
        <div className="dashboard-sidebar">
          <ProblemStats 
            problemsSolved={stats.problemsSolved}
            streakDays={stats.streakDays}
            totalHints={stats.totalHints}
            averageTime={stats.averageTime}
          />
          
          {/* Additional sidebar components can be added here */}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 