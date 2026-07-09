import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Scene from './Scene';
import Effects from './Effects';
import HeroSection from './components/HeroSection';
import UploadCard from './components/UploadCard';

import useScrollProgress from './hooks/useScrollProgress';
import useMousePosition from './hooks/useMousePosition';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PHASES = [
  'Establishing secure connection...',
  'Uploading high-resolution image...',
  'Initializing Azure AI Vision processor...',
  'Running deep vision neural layers...',
  'Extracting class probability tags...',
  'Logging classification to Cosmos DB...'
];

export default function App() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);

  // Custom hooks for tracking scroll progress and cursor coordinates at 60fps
  const scrollRef = useScrollProgress();
  const mouseRef = useMousePosition();

  // DOM Refs for GSAP ScrollTrigger
  const heroTextRef = useRef(null);
  const uploadCardRef = useRef(null);

  // ═══════════════════════════════════════════════════════════
  // 1. GSAP TIMELINE REVEALS & PINNING
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    // Reveal hero text lines on initial mount
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(heroTextRef.current.querySelectorAll('.title-line-text'), {
      translateY: 0,
      duration: 1.4,
      stagger: 0.25,
      ease: 'power4.out'
    });
    tl.fromTo(heroTextRef.current.querySelectorAll('.hero-desc, .scroll-down-hint'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.2, ease: 'power3.out' },
      '-=0.8'
    );

    // ScrollTrigger to slide up the upload zone card smoothly
    gsap.fromTo(uploadCardRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: '.upload-scroll-trigger',
          start: 'top bottom-=100',
          end: 'top center',
          scrub: 1.0
        }
      }
    );
  }, []);

  // ═══════════════════════════════════════════════════════════
  // 2. IMAGE UPLOAD & INTERACTIVE CLASSIFICATION LOOP
  // ═══════════════════════════════════════════════════════════
  const processFile = useCallback((file) => {
    setError(null);
    setResult(null);
    
    // File validation checks
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Unsupported file type. Use JPEG, PNG, or WebP.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('File size too large. Upload limit is 4MB.');
      return;
    }

    setPreview(URL.createObjectURL(file));
    classify(file);
  }, []);

  const classify = async (file) => {
    setLoading(true);
    setError(null);
    
    // Sequential progress message cycles
    let phaseIdx = 0;
    setPhase(PHASES[0]);
    const phaseInterval = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % PHASES.length;
      setPhase(PHASES[phaseIdx]);
    }, 1200);

    try {
      const fd = new FormData();
      fd.append('image', file);
      
      const res = await fetch(`${API}/classify`, { method: 'POST', body: fd });
      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Server error, classification failed.');
      }
      
      setResult(json.data);
      
      // Auto-scroll down natively to focus on showcase area
      setTimeout(() => {
        const resultScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: resultScroll, behavior: 'smooth' });
      }, 50);

    } catch (err) {
      console.error(err);
      setError(err.message);
      setPreview(null);
    } finally {
      clearInterval(phaseInterval);
      setLoading(false);
    }
  };

  const reset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setError(null);
    setHoveredTag(null);
    
    // Auto-scroll back up smoothly to Hero screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [preview]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      
      {/* A. FIXED BACKGROUND WEBGL CANVAS */}
      <div className="canvas-wrapper">
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 50, position: [0, 0, 7.5] }}
          shadows
        >
          <color attach="background" args={['#050608']} />
          <Scene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            result={result}
            loading={loading}
            preview={preview}
            hoveredTag={hoveredTag}
          />
          <Effects />
        </Canvas>
      </div>

      {/* B. TRANSPARENT SCROLLING HTML OVERLAYS */}
      <div className="overlay-container">
        
        {/* SECTION 1: HERO branding */}
        <HeroSection ref={heroTextRef} />
        
        {/* SECTION 2: Scroll trigger spacing */}
        <div className="upload-scroll-trigger" style={{ height: '120vh' }}></div>

        {/* SECTION 3: UPLOAD GATEWAY & SPECS CARD */}
        <UploadCard
          ref={uploadCardRef}
          loading={loading}
          phase={phase}
          result={result}
          error={error}
          processFile={processFile}
          reset={reset}
          setHoveredTag={setHoveredTag}
        />
      </div>

    </div>
  );
}
