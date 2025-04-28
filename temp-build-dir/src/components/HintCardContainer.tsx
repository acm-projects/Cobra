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
  
  // Show skeleton on initial load or when loading state changes
  useEffect(() => {
    // If we're loading, show skeleton
    if (isLoading) {
      setShowSkeleton(true);
      return;
    }
    
    // If we have hints and aren't loading, hide skeleton after a delay
    if (hints.length > 0 && !isLoading) {
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 800);
      
      return () => clearTimeout(timeout);
    }
  }, [hints, isLoading, currentProblemId]);
  
  // For debugging
  useEffect(() => {
    console.log('HintCardContainer render:', {
      hintsLength: hints.length,
      showSkeleton,
      currentProblemId,
      isLoading
    });
  }, [hints, showSkeleton, currentProblemId, isLoading]);

  // Show skeleton while loading or when there are no hints
  if (showSkeleton || isLoading || hints.length === 0) {
    return <HintCardSkeleton count={3} />;
  }

  // Render the actual hint cards when ready
  return (
    <>
      {hints.map((item, index) => (
        <HintCard 
          key={`${currentProblemId || 'default'}-hint-${index}`}
          title={item.title || 'Code Snippet'} 
          hint={item.code || ''} 
          type="code" 
          description={item.description || ''} 
        />
      ))}
    </>
  );
};

export default HintCardContainer; 