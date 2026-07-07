import React, { useState, useRef } from 'react';

export const Tilt3D = ({ children, className = '', maxTilt = 12 }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Normalised ratios (-0.5 to 0.5)
    const ratioX = mouseX / (width / 2);
    const ratioY = mouseY / (height / 2);

    // Calculate rotation angles (X tilts based on Y coordinate, Y tilts based on X)
    const rotateX = -ratioY * maxTilt;
    const rotateY = ratioX * maxTilt;

    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // 3D Tilt Style
  const tiltStyle = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`relative rounded-3xl overflow-hidden glass-panel-interactive transition-all duration-300 ${className}`}
    >
      {/* Volumetric spotlight overlay tracking mouse */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none opacity-55 mix-blend-screen transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${coords.x}px ${coords.y}px, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.08), transparent)`,
            zIndex: 10
          }}
        />
      )}
      
      {/* Internal Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};
