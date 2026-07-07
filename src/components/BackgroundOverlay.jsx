import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundOverlay = () => {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden pointer-events-none bg-[#030306]">
      {/* Volumetric Shifting Glows - Warm Amber and Ice Blue/White only */}
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-amber-550/[0.04] blur-[160px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1.1, 1, 1.1],
          x: [0, -50, 0],
          y: [0, 40, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-slate-500/[0.05] blur-[150px] pointer-events-none" 
      />

      {/* Cyberpunk Scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 18, 18, 0) 50%, rgba(255, 255, 255, 0.25) 50%)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Premium Carbon / Metal Grid Floor */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(217, 119, 6, 0.05) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Depth Shadow Mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030306]/80 via-transparent to-[#030306] pointer-events-none" />
    </div>
  );
};
