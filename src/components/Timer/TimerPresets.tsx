import React from 'react';
import { motion } from 'framer-motion';

export interface TimerPreset {
  id: string;
  name: string;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimerPresetsProps {
  presets: TimerPreset[];
  onSelectPreset: (preset: TimerPreset) => void;
  onCustomTime: () => void;
}

const TimerPresets: React.FC<TimerPresetsProps> = ({
  presets,
  onSelectPreset,
  onCustomTime
}) => {
  // Format time for display
  const formatPresetTime = (hours: number, minutes: number, seconds: number): string => {
    let timeString = '';
    
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    
    if (minutes > 0 || hours > 0) {
      timeString += `${minutes}m `;
    }
    
    timeString += `${seconds}s`;
    
    return timeString;
  };

  return (
    <motion.div 
      className="timer-presets"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="presets-header">
        <h4>Time Presets</h4>
      </div>
      
      <div className="presets-list">
        {presets.map((preset, index) => (
          <motion.div 
            key={preset.id}
            className="preset-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPreset(preset)}
          >
            <div className="preset-name">{preset.name}</div>
            <div className="preset-time">{formatPresetTime(preset.hours, preset.minutes, preset.seconds)}</div>
          </motion.div>
        ))}
        
        <motion.div 
          className="preset-item custom"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: presets.length * 0.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCustomTime}
        >
          <div className="preset-name">Custom</div>
          <div className="preset-icon">
            <i className="fas fa-sliders-h"></i>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimerPresets; 