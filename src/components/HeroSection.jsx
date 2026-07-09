import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * HeroSection Component
 * Renders Section 1 Hero branding.
 */
const HeroSection = forwardRef((props, ref) => {
  return (
    <section className="fullscreen-section" ref={ref}>
      <h1 className="hero-title">
        <span className="title-line-mask">
          <span className="title-line-text">NEURAL</span>
        </span>
        <span className="title-line-mask">
          <span className="title-line-text">VISION</span>
        </span>
      </h1>
      <p className="hero-desc">
        Instantly categorize inventory listings, e-commerce products, or catalog assets using computer vision. Scroll down to deploy the model.
      </p>
      <div className="scroll-down-hint">
        <span>Scroll to Enter</span>
        <ChevronDown size={18} />
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
