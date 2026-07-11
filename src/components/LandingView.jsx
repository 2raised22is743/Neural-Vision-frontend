import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, Cpu, Shield, Zap, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * LandingView Component
 * Renders the scroll-driven landing page journey with 3 sections.
 * Section 1: Hero heading, CTA buttons, and space for background core.
 * Section 2: Redesigned premium glassmorphic feature cards.
 * Section 3: Centered upload dropzone.
 */
export default function LandingView({
  loading,
  phase,
  error,
  processFile
}) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  };

  const scrollToUpload = () => {
    const element = document.getElementById('upload-zone');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    const element = document.getElementById('features-zone');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Framer Motion animation presets
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 14 } }
  };

  return (
    <motion.div
      className="landing-scroll-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      
      {/* ═══════════════════════════════════════════════════════════
         SECTION 1: HERO VIEW (Left Title & CTA Buttons, Right space)
         ═══════════════════════════════════════════════════════════ */}
      <section className="scroll-section hero-section">
        <div className="hero-split-grid">
          <div className="hero-left-text">
            <motion.h1 className="hero-gradient-title" variants={itemVariants}>
              INTELLIGENT <br />
              <span>PRODUCT</span> <br />
              CLASSIFIER
            </motion.h1>

            <motion.p className="hero-desc-text" variants={itemVariants}>
              Categorize warehouse inventories, retail products, and digital catalog assets instantly using automated computer vision. Scroll down to use the model.
            </motion.p>

            <motion.div className="hero-cta-group" variants={itemVariants}>
              <button className="primary-cta-btn" onClick={scrollToUpload}>
                Use Model
              </button>
              <button className="secondary-cta-btn" onClick={scrollToFeatures}>
                Specifications
              </button>
            </motion.div>

            <motion.div className="scroll-indicator-hint" variants={itemVariants}>
              <span>Scroll to explore</span>
              <ArrowDown size={14} className="bounce-arrow" />
            </motion.div>
          </div>
          
          {/* Right side is intentionally empty so background 3D Core is fully visible */}
          <div className="hero-right-space" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION 2: REDESIGNED PREMIUM FEATURES CARDS
         ═══════════════════════════════════════════════════════════ */}
      <section id="features-zone" className="scroll-section features-section">
        <motion.div className="features-header" variants={itemVariants}>
          <span className="section-meta">PERFORMANCE MATRIX</span>
          <h2 className="section-title">Built for Speed and Accuracy</h2>
        </motion.div>

        <motion.div className="minimal-specs-bar" variants={itemVariants}>
          <div className="spec-item">
            <Zap size={15} className="blue-glow" />
            <span>Inference Speed &lt; 1.2s</span>
          </div>
          <span className="spec-dot">•</span>
          <div className="spec-item">
            <Shield size={15} className="purple-glow" />
            <span>High Confidence Analysis</span>
          </div>
          <span className="spec-dot">•</span>
          <div className="spec-item">
            <Cpu size={15} className="green-glow" />
            <span>REST API Ready</span>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SECTION 3: UPLOAD GATEWAY CENTERED CARD
         ═══════════════════════════════════════════════════════════ */}
      <section id="upload-zone" className="scroll-section upload-gateway-section">
        <motion.div className="upload-header" variants={itemVariants}>
          <span className="section-meta">MODEL DEPLOYMENT</span>
          <h2 className="section-title">Upload Artifact for Classification</h2>
        </motion.div>

        <motion.div 
          className={`upload-drop-card centered-drop-card ${dragging ? 'active' : ''} ${loading ? 'scanning' : ''}`}
          variants={itemVariants}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !loading && fileInputRef.current?.click()}
        >
          <div className="card-bottom-corners" />

          {!loading ? (
            <div className="drop-zone-inside-vertical">
              <div className="upload-icon-circle-large">
                <Upload size={28} />
              </div>
              <div className="drop-text-stack-vertical">
                <span className="drop-main-text">Analyze New Image</span>
                <span className="drop-sub-text">Drag and drop file here or click to browse</span>
              </div>
              <button className="select-file-btn">
                Select File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                  e.target.value = '';
                }}
              />
            </div>
          ) : (
            <div className="loading-state-inside-vertical">
              <div className="scanning-spinner-glow" />
              <div className="loading-phase-stack-vertical">
                <span className="phase-headline">ANALYZING TARGET</span>
                <span className="phase-text">{phase}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="upload-error-banner" style={{ justifyContent: 'center' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </motion.div>
      </section>

    </motion.div>
  );
}
