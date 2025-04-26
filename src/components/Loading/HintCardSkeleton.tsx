import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HintCardSkeletonProps {
  count?: number;
}

const HintCardSkeleton: React.FC<HintCardSkeletonProps> = ({ count = 1 }) => {
  return (
    <AnimatePresence>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="hint-card hint-card-skeleton"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          transition={{ delay: 0.05 * index, duration: 0.3 }}
        >
          <div className="hint-icon skeleton-icon">
            <div className="skeleton-pulse"></div>
          </div>
          <div className="hint-badge skeleton-badge">
            <div className="skeleton-pulse"></div>
          </div>
          <div className="skeleton-title">
            <div className="skeleton-pulse"></div>
          </div>
          <div className="hint-content">
            <div className="skeleton-description">
              <div className="skeleton-pulse"></div>
              <div className="skeleton-pulse" style={{ width: '80%' }}></div>
            </div>
            <div className="hint-code-snippet skeleton-code">
              <div className="skeleton-code-lines">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="skeleton-line"
                    style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                  >
                    <div className="skeleton-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="code-reveal-controls">
                <div className="skeleton-button">
                  <div className="skeleton-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default HintCardSkeleton; 