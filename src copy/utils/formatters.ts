import { TimerType } from '../types';

/**
 * Format timer value to display string
 * @param timeMs Time in milliseconds
 * @param timerType Type of timer (stopwatch or countdown)
 * @returns Formatted time string
 */
export const formatTime = (timeMs: number, timerType: TimerType): string => {
  if (timerType === 'stopwatch') {
    const ms = Math.floor((timeMs % 1000) / 10);
    const seconds = Math.floor((timeMs / 1000) % 60);
    const minutes = Math.floor((timeMs / 1000 / 60) % 60);
    const hours = Math.floor(timeMs / 1000 / 60 / 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  } else {
    // Countdown timer
    const seconds = Math.floor((timeMs / 1000) % 60);
    const minutes = Math.floor((timeMs / 1000 / 60) % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Format date to readable string
 * @param date Date object
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}; 