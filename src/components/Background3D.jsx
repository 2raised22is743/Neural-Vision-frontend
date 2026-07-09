import React, { useEffect, useRef } from 'react';

export const Background3D = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate random particle nodes
    const particles = [];
    const particleCount = Math.min(Math.floor(width / 20), 80);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const draw = () => {
      // Clear with slight trailing alpha to create micro-motion blur
      ctx.fillStyle = '#02020a';
      ctx.fillRect(0, 0, width, height);

      // Smoothly interpolate mouse coordinate for parallax damping
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw constellation nodes
      particles.forEach((p, idx) => {
        // Move particles
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Apply mouse-influence parallax offsets
        const parallaxX = (mouse.x - width / 2) * 0.015 * (p.radius * 0.5);
        const parallaxY = (mouse.y - height / 2) * 0.015 * (p.radius * 0.5);

        ctx.beginPath();
        ctx.arc(p.x + parallaxX, p.y + parallaxY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`; // Purple nodes
        ctx.fill();

        // Connect adjacent nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2ParallaxX = (mouse.x - width / 2) * 0.015 * (p2.radius * 0.5);
          const p2ParallaxY = (mouse.y - height / 2) * 0.015 * (p2.radius * 0.5);
          
          const dx = (p.x + parallaxX) - (p2.x + p2ParallaxX);
          const dy = (p.y + parallaxY) - (p2.y + p2ParallaxY);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x + parallaxX, p.y + parallaxY);
            ctx.lineTo(p2.x + p2ParallaxX, p2.y + p2ParallaxY);
            ctx.strokeStyle = `rgba(103, 232, 249, ${(1 - dist / 120) * 0.08})`; // Cyan lines
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Dark sky base */}
      <div className="absolute inset-0 bg-[#020208]" />

      {/* Floating Canvas Constellation */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Moving Auroras (Volumetric blurs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-650/10 blur-[150px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-550/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-650/5 blur-[140px] pointer-events-none" />

      {/* 3D perspective Grid Floor */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[300px] pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(75deg) translateZ(0)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, black 30%, transparent)'
        }}
      />

      {/* Digital Noise Overlay Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%35%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};
