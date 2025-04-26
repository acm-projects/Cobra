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
  
  // Show skeleton on initial load or when loading state changes
  useEffect(() => {
    // If we're loading, show skeleton
    if (isLoading) {
      setShowSkeleton(true);
      return;
    }
    
    // If we have hint content and aren't loading, hide skeleton after a delay
    if (hint && !isLoading) {
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 800);
      
      return () => clearTimeout(timeout);
    }
  }, [hint, isLoading, currentProblemId]);
  
  // For debugging
  useEffect(() => {
    console.log('ConceptualHintContainer render:', {
      hasHint: !!hint,
      showSkeleton,
      currentProblemId,
      isLoading
    });
  }, [hint, showSkeleton, currentProblemId, isLoading]);

  // Show skeleton while loading or when there's no hint
  if (showSkeleton || isLoading || !hint) {
    return <HintCardSkeleton count={1} />;
  }

  // Render the actual hint card when ready
  return (
    <HintCard 
      key={`conceptual-${currentProblemId || 'default'}`}
      title={title || 'Conceptual Hint'} 
      hint={hint} 
      type="conceptual" 
    />
  );
};

export default ConceptualHintContainer; 