import React from 'react';
import { motion } from 'framer-motion';

interface LeetCodeLoaderProps {
  isLoggedIn: boolean;
  isLoading: boolean;
}

const LeetCodeLoader: React.FC<LeetCodeLoaderProps> = ({ isLoggedIn, isLoading }) => {
  return (
    <motion.div 
      className="leetcode-loader-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="leetcode-loader-container">
        <motion.div 
          className="leetcode-loader-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="loader-header">
            <i className="fas fa-code"></i>
            <h3>LeetCode Statistics</h3>
          </div>
          
          <div className="loader-content">
            {isLoading ? (
              <>
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
                <p className="loading-message">
                  {isLoggedIn 
                    ? "Fetching your LeetCode statistics..." 
                    : "Waiting for you to sign in to LeetCode..."}
                </p>
                <p className="loader-disclaimer">
                  {isLoggedIn 
                    ? "We're securely retrieving your problem-solving statistics from LeetCode." 
                    : "Please log in to your LeetCode account to access your statistics."}
                </p>
              </>
            ) : (
              <div className="completed-message">
                <i className="fas fa-check-circle"></i>
                <p>Statistics loaded successfully!</p>
              </div>
            )}
          </div>
          
          <div className="loader-footer">
            <p className="privacy-note">
              Your data is only used to enhance your coding experience and is never shared with third parties.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeetCodeLoader; 