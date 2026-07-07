import React from 'react';
import { motion } from 'framer-motion';

export const ConfidenceBar = ({ confidence }) => {
  const percentage = Math.min(Math.max(confidence * 100, 0), 100);
  
  // Nothing OS tactile block segments (12 blocks)
  const totalBlocks = 12;
  const activeBlocks = Math.round((percentage / 100) * totalBlocks);

  return (
    <div className="w-full space-y-3 font-mono">
      <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest">
        <span>AI Decryption Precision</span>
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-amber-500 font-bold"
        >
          {percentage.toFixed(2)}% MATCH
        </motion.span>
      </div>

      {/* Tactile block meter */}
      <div className="flex gap-[4px] w-full">
        {Array.from({ length: totalBlocks }).map((_, idx) => {
          const isActive = idx < activeBlocks;
          return (
            <motion.div
              key={idx}
              initial={{ scaleY: 0.4, opacity: 0.2 }}
              animate={{ 
                scaleY: isActive ? 1.0 : 0.6,
                opacity: isActive ? 0.95 : 0.15,
                backgroundColor: isActive ? '#d97706' : '#1e293b' // Amber vs Slate
              }}
              transition={{ delay: idx * 0.03, type: 'spring', stiffness: 150 }}
              className="h-6 flex-grow rounded-sm shadow-[0_0_8px_rgba(217,119,6,0.15)] origin-bottom"
              style={{
                boxShadow: isActive ? '0 0 10px rgba(217,119,6,0.3)' : 'none'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
export default ConfidenceBar;
