import React, { useState, useEffect } from 'react';
import HintCard from './HintCard';
import HintCardSkeleton from './Loading/HintCardSkeleton';

interface HintCardContainerProps {
  hints: any[];
  currentProblemTitle: string;
  currentProblemId: string | null;
  isLoading?: boolean;
}

const HintCardContainer: React.FC<HintCardContainerProps> = ({
  hints,
  currentProblemTitle,
  currentProblemId,
  isLoading = false
}) => {
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [prevProblemId, setPrevProblemId] = useState<string | null>(currentProblemId);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Reset loading state when problem changes
  useEffect(() => {
    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    // If the problem ID changed, show skeleton
    if (currentProblemId !== prevProblemId) {
      setShowSkeleton(true);
      
      // Update the previous problem ID
      setPrevProblemId(currentProblemId);
      
      // Only keep skeleton visible for a short time if hints are already available
      if (hints.length > 0) {
        const timeout = setTimeout(() => {
          setShowSkeleton(false);
        }, 600); // Short delay when data is already available
        
        setLoadingTimeout(timeout);
      }
    } else if (isLoading) {
      // If explicitly set to loading
      setShowSkeleton(true);
    } else if (hints.length > 0) {
      // If we have hints and aren't loading anymore, clear skeleton immediately
      // This prevents the skeleton from showing too long after data is available
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 300); // Very short transition
      
      setLoadingTimeout(timeout);
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [currentProblemId, prevProblemId, isLoading, hints]);

  // Render skeletons or actual hint cards
  // Don't show skeleton if we have hints and we're not loading or changing problems
  if ((showSkeleton && !hints.length) || isLoading) {
    return <HintCardSkeleton count={3} />;
  }

  return (
    <>
      {hints.map((item, index) => (
        <HintCard 
          key={`${currentProblemId}-hint-${index}`}
          title={item.title} 
          hint={item.code} 
          type="code" 
          description={item.description} 
        />
      ))}
    </>
  );
};

export default HintCardContainer; 