import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/**
 * InteractiveCard Component
 * Wraps content in a 3D perspective-tilt card with dynamic cursor glare.
 * Uses Framer Motion's useSpring to smooth out rotation and prevent abrupt snaps.
 */
export default function InteractiveCard({ children, className = '', style = {} }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Configure smooth spring physics parameters for buttery-soft tilts
  const springConfig = { stiffness: 140, damping: 22, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Map normalized mouse coordinates to degrees of rotation (tilt limits: -14deg to 14deg)
  const rotateX = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);

  // Dynamic glare / reflection gradient positions
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor displacement relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates between -0.5 and 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    // Smoothly return card to default center states
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`premium-card interactive-tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {/* Glare Shine Gradient Overlay */}
      <motion.div
        style={{
          background: `radial-gradient(circle 250px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.08) 0%, transparent 80%)`,
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          borderRadius: 'inherit'
        }}
      />
      
      {/* Floating inner perspective wrapper */}
      <div style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d', height: '100%', width: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
}
