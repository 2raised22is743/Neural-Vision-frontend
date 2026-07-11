import React, { useState, useEffect } from 'react';
import { RotateCcw, Cpu } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';

import InteractiveCard from './InteractiveCard';

/**
 * Custom Count-up Component using Framer Motion animate engine
 */
function CountUp({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setCount(Math.round(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <span>{count}</span>;
}

/**
 * ResultView Component
 * Renders the premium AI Inspection panel.
 * Left: Interactive 3D HTML Tilt Card (crisp image, glare, parallax and highlight box)
 * Right: Clean metrics specifications and progress indicators.
 */
export default function ResultView({
  result,
  preview,
  reset,
  hoveredTag,
  setHoveredTag
}) {
  // Resolve best confidence rating (fallback to top tag score if category score is low/skewed)
  const bestConfidence = Math.max(
    result?.confidence || 0,
    result?.tags?.[0]?.confidence || 0
  );

  const confidencePct = Math.round(bestConfidence * 100);
  const [circleOffset, setCircleOffset] = useState(251.2); // Circumference for r=40 is 251.2
  const [tagWidths, setTagWidths] = useState({});

  // Motion values for image parallax shift inside the card
  const imgX = useMotionValue(0);
  const imgY = useMotionValue(0);
  
  // Apply spring physics to image translations
  const springConfig = { stiffness: 100, damping: 20, mass: 0.6 };
  const springImgX = useSpring(imgX, springConfig);
  const springImgY = useSpring(imgY, springConfig);

  const parallaxX = useTransform(springImgX, [-0.5, 0.5], ['-10px', '10px']);
  const parallaxY = useTransform(springImgY, [-0.5, 0.5], ['-10px', '10px']);

  useEffect(() => {
    const circumference = 2 * Math.PI * 40; // 251.2
    
    const timer = setTimeout(() => {
      setCircleOffset(circumference - (confidencePct / 100) * circumference);
      
      const widths = {};
      result?.tags?.forEach((tag) => {
        widths[tag.name] = `${Math.round((tag.confidence || 0) * 100)}%`;
      });
      setTagWidths(widths);
    }, 150);

    return () => clearTimeout(timer);
  }, [result, confidencePct]);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    imgX.set(mouseX / width);
    imgY.set(mouseY / height);
  };

  const handleCardMouseLeave = () => {
    imgX.set(0);
    imgY.set(0);
  };

  // Coordinates for HTML target bounding boxes overlay
  const activeTargetBox = React.useMemo(() => {
    if (!hoveredTag) return null;
    const tag = hoveredTag.toLowerCase();
    
    // Define relative box sizing percentages [left, top, width, height]
    if (tag === 'sneaker') return { left: '10%', top: '22%', width: '80%', height: '58%' };
    if (tag === 'shoe') return { left: '8%', top: '15%', width: '84%', height: '70%' };
    if (tag === 'laces' || tag === 'lace') return { left: '38%', top: '20%', width: '24%', height: '30%' };
    if (tag === 'sole') return { left: '10%', top: '65%', width: '80%', height: '20%' };
    
    // Generic fallback bounding box
    return { left: '20%', top: '20%', width: '60%', height: '60%' };
  }, [hoveredTag]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <motion.div
      className="result-grid-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="result-main-columns">
        
        {/* LEFT COLUMN: INTERACTIVE TILT HOLOGRAM CARD (HTML RENDERER) */}
        <motion.div 
          className="result-left-column" 
          variants={itemVariants}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <InteractiveCard className="holographic-preview-card">
            <div className="holographic-html-wrapper">
              
              {/* Corner brackets */}
              <div className="scanner-bracket tl" />
              <div className="scanner-bracket tr" />
              <div className="scanner-bracket bl" />
              <div className="scanner-bracket br" />

              {/* Parallax Image element */}
              <motion.div 
                className="holo-img-container"
                style={{ x: parallaxX, y: parallaxY }}
              >
                <img
                  src={preview || result?.imageUrl}
                  alt="Classified Artifact"
                  className="holo-preview-img"
                />
              </motion.div>

              {/* Sci-fi scanning line sweep */}
              <div className="holo-card-scan-beam" />

              {/* Dynamic Target Box Overlay */}
              {activeTargetBox && (
                <div 
                  className="holo-target-box-overlay"
                  style={{
                    left: activeTargetBox.left,
                    top: activeTargetBox.top,
                    width: activeTargetBox.width,
                    height: activeTargetBox.height,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div className="target-box-corner tl" />
                  <div className="target-box-corner tr" />
                  <div className="target-box-corner bl" />
                  <div className="target-box-corner br" />
                  <span className="target-box-label">{hoveredTag}</span>
                </div>
              )}
            </div>
          </InteractiveCard>
        </motion.div>

        {/* RIGHT COLUMN: GLASSMORPHIC SPEC MATRIX & RESULTS SUMMARY */}
        <motion.div className="result-right-column" variants={itemVariants}>
          <div className="glass-panel spec-matrix-panel">
            <div className="panel-header">
              <span className="panel-title">INSPECTION SUMMARY</span>
              <Cpu size={14} className="blue-glow" />
            </div>

            <div className="spec-divider" />

            {/* Circular Confidence Dial & Identified Class */}
            <div className="confidence-summary-block">
              <div className="class-identity-stack">
                <span className="class-label">IDENTIFIED CATEGORY</span>
                <h2 className="class-value-title">{result.category}</h2>
              </div>
              
              <div className="radial-dial-wrapper">
                <svg className="radial-svg" width="96" height="96" viewBox="0 0 96 96">
                  <circle
                    className="radial-bg"
                    cx="48"
                    cy="48"
                    r="40"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    className="radial-indicator"
                    cx="48"
                    cy="48"
                    r="40"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={circleOffset}
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </svg>
                <div className="radial-percentage-overlay">
                  <CountUp value={confidencePct} />
                  <span className="pct-symbol">%</span>
                </div>
              </div>
            </div>

            <div className="spec-divider" />

            {/* Description remark block */}
            {result.description && (
              <div className="panel-desc-block">
                <span className="spec-label">MODEL REMARKS</span>
                <p className="spec-desc-text">{result.description}</p>
              </div>
            )}

            {/* Attributes probability bars */}
            {result.tags?.length > 0 && (
              <div className="panel-attributes-block">
                <span className="spec-label" style={{ marginBottom: '1.2rem', display: 'block' }}>
                  CLASS DISTRIBUTION (HOVER BADGE TO TARGET FEATURES)
                </span>
                <div className="attributes-progress-list">
                  {result.tags.slice(0, 5).map((tag, idx) => (
                    <div
                      key={tag.name}
                      className={`attribute-progress-row ${hoveredTag === tag.name ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredTag(tag.name)}
                      onMouseLeave={() => setHoveredTag(null)}
                    >
                      <div className="attribute-info">
                        <span className="attribute-name">{tag.name}</span>
                        <span className="attribute-val">{Math.round((tag.confidence || 0) * 100)}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <motion.div
                          className="progress-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: tagWidths[tag.name] || '0%' }}
                          transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                            delay: idx * 0.12
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="spec-divider" style={{ margin: '2rem 0' }} />

            <div className="panel-actions">
              <button className="reset-action-btn" onClick={reset}>
                <RotateCcw size={14} />
                <span>Analyze New Image</span>
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
