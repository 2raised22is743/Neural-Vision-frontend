import React, { forwardRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

/**
 * HeroSection Component
 * Renders Section 1 Hero branding with interactive 3D Glass Card.
 */
const HeroSection = forwardRef(({ preview, onUploadTrigger }, ref) => {
  const [hovered, setHovered] = useState(false);

  // Motion values for tracking cursor position relative to card center (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth spring physics configuration
  const springConfig = { damping: 25, stiffness: 200, mass: 0.8 };
  
  // Maps 0-1 coordinate to 3D rotation angles (-12 to 12 degrees)
  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), springConfig);

  // Parallax offsets for the image inside the card (-15px to 15px)
  const imgX = useSpring(useTransform(x, [0, 1], [-15, 15]), springConfig);
  const imgY = useSpring(useTransform(y, [0, 1], [-15, 15]), springConfig);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates between 0 and 1
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    // Reset spring to center
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <section className="fullscreen-section" ref={ref}>
      <div className="hero-container">
        
        {/* Left Column: Headings and Upload CTA */}
        <div className="hero-content-left">
          <h1 className="hero-title">
            <span className="title-line-mask">
              <span className="title-line-text">NEURAL</span>
            </span>
            <span className="title-line-mask">
              <span className="title-line-text">VISION</span>
            </span>
          </h1>
          <p className="hero-desc">
            Instantly categorize inventory listings, e-commerce products, or catalog assets using computer vision. Select a file to deploy the model.
          </p>
          <button className="hero-cta-btn" onClick={onUploadTrigger}>
            <Sparkles size={16} />
            <span>Select Product Image</span>
          </button>
        </div>

        {/* Right Column: 3D Interactive Glass Card */}
        <div className="hero-visual-right">
          <motion.div
            className="hero-glass-card-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setHovered(true)}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
          >
            {/* Ambient Card Backplate Glow (tracks mouse position) */}
            <motion.div 
              className="hero-card-glow"
              style={{
                background: useTransform(
                  [x, y],
                  ([latestX, latestY]) => `radial-gradient(circle at ${latestX * 100}% ${latestY * 100}%, rgba(96, 165, 250, 0.28) 0%, rgba(192, 132, 252, 0.16) 40%, transparent 70%)`
                )
              }}
            />

            {/* Glass Card Body */}
            <div className="hero-glass-card">
              <div className="neon-strip" />
              
              {/* Card Telemetry / Metadata tags */}
              <div className="hero-card-telemetry">
                <span>[ LAYER_Z_OVERLAY ]</span>
                <div className="hero-card-telemetry-green">
                  <span />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* 3D Image Parallax Frame */}
              <div className="hero-card-image-frame">
                {/* Volumetric glow directly behind product */}
                <motion.div 
                  className="hero-image-volumetric-glow"
                  style={{
                    scale: hovered ? 1.15 : 1.0,
                    opacity: hovered ? 0.95 : 0.6
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.img
                  src={preview || "/hero_product.png"}
                  alt="Product Classifier Target"
                  className="hero-product-image"
                  style={{
                    x: imgX,
                    y: imgY,
                    scale: hovered ? 1.05 : 1.0,
                    filter: hovered 
                      ? "drop-shadow(0 20px 35px rgba(0, 0, 0, 0.85)) brightness(1.05)" 
                      : "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.7)) brightness(1.0)"
                  }}
                />
              </div>

              {/* Card Footer */}
              <div className="hero-card-footer">
                <h4 className="hero-card-footer-title">
                  {preview ? "SCANNING ARTIFACT..." : "COGNITIVE SYSTEM"}
                </h4>
                <p className="hero-card-footer-subtitle">
                  {preview ? "Image telemetry established. Processing computer vision request." : "Secure computer vision classification model. Hover to inspect."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      <div className="scroll-down-hint">
        <span>Scroll to Enter</span>
        <ChevronDown size={18} />
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
