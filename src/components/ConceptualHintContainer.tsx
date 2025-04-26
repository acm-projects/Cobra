import React, { useState, useEffect } from 'react';
import HintCard from './HintCard';
import HintCardSkeleton from './Loading/HintCardSkeleton';

interface ConceptualHintContainerProps {
  title: string;
  hint: string;
  currentProblemId: string | null;
  isLoading?: boolean;
}

const ConceptualHintContainer: React.FC<ConceptualHintContainerProps> = ({
  title,
  hint,
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
      
      // If hint is already available, transition quickly
      if (hint) {
        const timeout = setTimeout(() => {
          setShowSkeleton(false);
        }, 600); // Short delay when data is already available
        
        setLoadingTimeout(timeout);
      }
    } else if (isLoading) {
      // If explicitly set to loading
      setShowSkeleton(true);
    } else if (hint) {
      // If we have hints and aren't loading anymore, clear skeleton faster
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
  }, [currentProblemId, prevProblemId, isLoading, hint]);

  // Render skeleton or actual hint card
  // Don't show skeleton if we have a hint and we're not in a loading state
  if ((showSkeleton && !hint) || isLoading) {
    return <HintCardSkeleton count={1} />;
  }

  return (
    <HintCard 
      title={title} 
      hint={hint} 
      type="conceptual" 
    />
  );
};

export default ConceptualHintContainer; 