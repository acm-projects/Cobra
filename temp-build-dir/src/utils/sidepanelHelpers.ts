/**
 * Utility functions for the sidepanel component
 */

/**
 * Format time for display
 */
export const formatTime = (timeMs: number, timerType: "stopwatch" | "countdown"): string => {
  if (timerType === "stopwatch") {
    // Remove milliseconds display to prevent overlap
    const seconds = Math.floor((timeMs / 1000) % 60);
    const minutes = Math.floor((timeMs / 1000 / 60) % 60);
    const hours = Math.floor(timeMs / 1000 / 60 / 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    // Countdown timer
    const seconds = Math.floor((timeMs / 1000) % 60);
    const minutes = Math.floor((timeMs / 1000 / 60) % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
};

/**
 * Mock implementations of other needed functions to satisfy TypeScript.
 * These will be replaced by actual implementations in sidepanel.tsx
 */
export const mockHandleVerificationComplete = () => {
  console.log("Mock handleVerificationComplete");
};

export const mockHandleSidebarToggle = () => {
  console.log("Mock handleSidebarToggle");
};

export const mockHandleProfileClick = () => {
  console.log("Mock handleProfileClick");
}; 