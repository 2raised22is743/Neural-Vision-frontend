import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import LandingView from './components/LandingView';
import ResultView from './components/ResultView';
import Scene from './Scene';
import Effects from './Effects';
import useMousePosition from './hooks/useMousePosition';
import useScrollProgress from './hooks/useScrollProgress';

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
  const [view, setView] = useState('landing'); // 'landing' | 'result'
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);

  // Mouse position and scroll progress tracking refs (shared at 60fps)
  const mouseRef = useMousePosition();
  const scrollRef = useScrollProgress();

  const processFile = useCallback((file) => {
    setError(null);
    setResult(null);

    // File validation limits
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
      setView('result');

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
    setView('landing');
  }, [preview]);

  return (
    <div className="app-view-router">
      
      {/* Premium ambient backdrop lights */}
      <div className="glowing-orb orb-blue" />
      <div className="glowing-orb orb-purple" />

      {/* FIXED GLOBAL 3D BACKGROUND CANVAS FOR HERO SCROLL JOURNEY */}
      <div className="canvas-wrapper">
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 50, position: [0, 0, 7.5] }}
          shadows
        >
          <color attach="background" args={['#030508']} />
          <Scene
            scrollRef={scrollRef}
            mouseRef={mouseRef}
            loading={loading}
            result={result}
            preview={preview}
          />
          <Effects />
        </Canvas>
      </div>

      {/* Main viewport Router */}
      {view === 'landing' ? (
        <LandingView
          loading={loading}
          phase={phase}
          error={error}
          processFile={processFile}
        />
      ) : (
        <ResultView
          result={result}
          preview={preview}
          reset={reset}
          mouseRef={mouseRef}
          hoveredTag={hoveredTag}
          setHoveredTag={setHoveredTag}
        />
      )}
      
    </div>
  );
}
