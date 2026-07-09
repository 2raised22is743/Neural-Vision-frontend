<<<<<<< HEAD
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from './components/FileUpload.jsx';
import { ResultCard } from './components/ResultCard.jsx';
import { Background3D } from './components/Background3D.jsx';
import { Tilt3D } from './components/Tilt3D.jsx';
import { 
  Sparkles, Cpu, Layers, HardDrive, ShieldCheck, Loader2, 
  Compass, ArrowUpRight, Monitor, ShoppingBag, Database
} from 'lucide-react';

const DEMO_PRODUCTS = [
  {
    name: "Carbon-Fiber Chronograph",
    category: "Chronographs",
    confidence: 0.9912,
    description: "An industrial-grade wristwatch housing a dark graphite case, carbon-fiber textured dial face, and responsive steel sub-dials.",
    imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80",
    tags: [
      { name: "chronograph", confidence: 0.99 },
      { name: "wristwatch", confidence: 0.98 },
      { name: "mechanical", confidence: 0.95 },
      { name: "carbon fiber", confidence: 0.88 },
      { name: "steel", confidence: 0.85 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    name: "Machined Steel Keyboard",
    category: "Peripheral Hardware",
    confidence: 0.9784,
    description: "An anodized aluminum mechanical keyboard featuring matte black cylindrical keycaps, brass backing plate, and raw industrial aesthetics.",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
    tags: [
      { name: "keyboard", confidence: 0.99 },
      { name: "aluminum", confidence: 0.96 },
      { name: "hardware", confidence: 0.94 },
      { name: "input tool", confidence: 0.91 },
      { name: "brass", confidence: 0.84 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    name: "Tactical VR Visor",
    category: "Optical Interface",
    confidence: 0.9621,
    description: "An optical display headset showing lightweight carbon housing, amber HUD projection layer, and adjustable rear harness mount.",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80",
    tags: [
      { name: "headset", confidence: 0.98 },
      { name: "optics", confidence: 0.96 },
      { name: "display visor", confidence: 0.93 },
      { name: "carbon case", confidence: 0.89 },
      { name: "hud", confidence: 0.85 }
    ],
    createdAt: new Date().toISOString()
  }
];

export const App = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const apiHost = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleFileSelect = (selectedFile) => {
    setError(null);
    setResult(null);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    uploadAndClassify(selectedFile);
  };

  const uploadAndClassify = async (selectedFile) => {
    setLoading(true);
    setError(null);
    try {
      setLoadingPhase('Uploading image to Azure Storage...');
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${apiHost}/classify`, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze product image.');
      }

      setResult(json.data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during classification.');
      setPreviewUrl(null);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const loadDemoProduct = (demo) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setPreviewUrl(demo.imageUrl);
    setLoadingPhase('Executing AI Vision neural sweep...');
    
    setTimeout(() => {
      setResult({
        id: `demo_${Math.floor(Math.random() * 100000)}`,
=======
import React, { useState, useEffect, useRef } from 'react';

/* =========================================================================
   CONFIG / DATA STATIC SPECIFICATIONS
   ========================================================================= */
const DEMO_PRODUCTS = [
  {
    name: "Carbon-Fiber Chronograph", category: "Chronographs", confidence: 0.9912,
    description: "An industrial-grade wristwatch housing a dark graphite case, carbon-fiber textured dial face, and responsive steel sub-dials.",
    imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80",
    tags: [{name:"chronograph",confidence:0.99},{name:"wristwatch",confidence:0.98},{name:"mechanical",confidence:0.95},{name:"carbon fiber",confidence:0.88},{name:"steel",confidence:0.85}]
  },
  {
    name: "Machined Steel Keyboard", category: "Peripheral Hardware", confidence: 0.9784,
    description: "An anodized aluminum mechanical keyboard featuring matte black cylindrical keycaps, brass backing plate, and raw industrial aesthetics.",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
    tags: [{name:"keyboard",confidence:0.99},{name:"aluminum",confidence:0.96},{name:"hardware",confidence:0.94},{name:"input tool",confidence:0.91},{name:"brass",confidence:0.84}]
  },
  {
    name: "Tactical VR Visor", category: "Optical Interface", confidence: 0.9621,
    description: "An optical display headset showing lightweight carbon housing, amber HUD projection layer, and adjustable rear harness mount.",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80",
    tags: [{name:"headset",confidence:0.98},{name:"optics",confidence:0.96},{name:"display visor",confidence:0.93},{name:"carbon case",confidence:0.89},{name:"hud",confidence:0.85}]
  }
];

const PIPELINE_STEPS = [
  { node:"01", title:"Browser Capture", desc:"Reads the dropped file and decodes it straight into an offscreen canvas buffer.",
    icon: <><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></> },
  { node:"02", title:"Pixel Sampler", desc:"Walks a downsampled grid of the image to compute average hue, brightness, and contrast.",
    icon: <><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></> },
  { node:"03", title:"Taxonomy Engine", desc:"Maps the resulting color signature onto a curated catalog taxonomy in real time.",
    icon: <path d="M4 6h16M4 12h10M4 18h16"/> },
  { node:"04", title:"Local Ledger", desc:"Appends the audit result to an in-memory session ledger — no network call required.",
    icon: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></> },
];

const LOADING_PHASES = [
  "Sampling pixel buffer...",
  "Resolving dominant chroma...",
  "Cross-referencing taxonomy...",
  "Scoring confidence interval...",
  "Compiling audit record..."
];

const CATEGORY_RULES = [
  { test:(h,s,b)=> s<0.14 && b>168, name:"Minimalist Ceramic Ware", tagPool:["ceramic","matte glaze","studio object","low-saturation"] },
  { test:(h,s,b)=> s<0.14 && b<=168, name:"Industrial Steel Components", tagPool:["steel","machined","raw metal","low-saturation"] },
  { test:(h)=> h>=340 || h<20, name:"Vermilion Composite Goods", tagPool:["red spectrum","composite","high-chroma"] },
  { test:(h)=> h>=20 && h<50, name:"Precision Timepiece Assemblies", tagPool:["amber tone","brass","warm metal"] },
  { test:(h)=> h>=50 && h<90, name:"Optical Calibration Devices", tagPool:["yellow-green","optic coating","reflective"] },
  { test:(h)=> h>=90 && h<160, name:"Bio-Adaptive Textiles", tagPool:["green spectrum","organic fiber","textile"] },
  { test:(h)=> h>=160 && h<200, name:"Marine-Grade Enclosures", tagPool:["cyan tone","waterproof shell","enclosure"] },
  { test:(h)=> h>=200 && h<260, name:"Optical Interface Hardware", tagPool:["blue spectrum","glass lens","hud"] },
  { test:(h)=> h>=260 && h<340, name:"Synthetic Polymer Fixtures", tagPool:["violet tone","injection-molded","polymer"] },
];

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l: l * 255 };
}

export default function NeuralPortal() {
  const [showCurtain, setShowCurtain] = useState(true);
  const [destroyCurtain, setDestroyCurtain] = useState(false);
  const [clockText, setClockText] = useState("00:00:00");
  const [latencyText, setLatencyText] = useState("<200ms");
  const [activeSection, setActiveSection] = useState("hero");

  // Custom cursor states
  const [cursorRingActive, setCursorRingActive] = useState(false);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });

  // Upload/Scanning App State
  const [isDragging, setIsDragging] = useState(false);
  const [uiState, setUiState] = useState('idle'); // 'idle' | 'loading' | 'result'
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPhase, setLoadingPhase] = useState('');
  const [auditResult, setAuditResult] = useState(null);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const dockHighlightRef = useRef(null);
  const sectionRefs = {
    hero: useRef(null),
    gateway: useRef(null),
    catalog: useRef(null),
    pipeline: useRef(null),
  };

  /* =========================================================================
     EFFECTS & CYCLES
     ========================================================================= */

  // Curtain & Initialization
  useEffect(() => {
    const t1 = setTimeout(() => setShowCurtain(false), 500);
    const t2 = setTimeout(() => setDestroyCurtain(true), 1450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Clock Jitter & Real-time Metadata Elements
  useEffect(() => {
    const tickClock = () => {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      setClockText(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tickClock();
    const clockInt = setInterval(tickClock, 1000);

    const latencyInt = setInterval(() => {
      const val = Math.floor(150 + Math.random() * 70);
      setLatencyText(`<${val}ms`);
    }, 2200);

    return () => { clearInterval(clockInt); clearInterval(latencyInt); };
  }, []);

  // Custom Cursor Track Loop
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseCoords.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }
    };

    let frameId;
    const ringLoop = () => {
      ringCoords.current.x += (mouseCoords.current.x - ringCoords.current.x) * 0.18;
      ringCoords.current.y += (mouseCoords.current.y - ringCoords.current.y) * 0.18;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringCoords.current.x}px, ${ringCoords.current.y}px) translate(-50%,-50%)`;
      }
      frameId = requestAnimationFrame(ringLoop);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('.clickable, button, a, [data-tilt]')) {
        setCursorRingActive(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('.clickable, button, a, [data-tilt]')) {
        setCursorRingActive(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    frameId = requestAnimationFrame(ringLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Background Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let particles = [];

    const initParticles = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from({ length: 46 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.25 + 0.05),
        vx: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        accent: Math.random() < 0.14
      }));
    };

    initParticles();
    window.addEventListener('resize', initParticles);

    let animFrameId;
    const drawParticles = (t) => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t / 1800 + p.phase) * 0.06;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.accent ? 'rgba(229,62,43,0.5)' : 'rgba(239,235,216,0.18)';
        ctx.fill();
      });
      animFrameId = requestAnimationFrame(drawParticles);
    };
    animFrameId = requestAnimationFrame(drawParticles);

    return () => {
      window.removeEventListener('resize', initParticles);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Intersection Observers for ScrollSpy Reveal Elements
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: 0.15 });

    const revealEls = document.querySelectorAll('.reveal:not(.in)');
    revealEls.forEach(el => revealObserver.observe(el));

    const sectionSpy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { threshold: 0.5 });

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) sectionSpy.observe(ref.current);
    });

    return () => {
      revealObserver.disconnect();
      sectionSpy.disconnect();
    };
  }, [uiState]);

  // Adjust Dock Indicator Highlight Pos dynamically
  useEffect(() => {
    const activeBtn = document.querySelector(`.dock-btn[data-target="${activeSection}"]`);
    if (activeBtn && dockHighlightRef.current) {
      dockHighlightRef.current.style.left = activeBtn.offsetLeft + 'px';
      dockHighlightRef.current.style.width = activeBtn.offsetWidth + 'px';
    }
  }, [activeSection]);

  /* =========================================================================
     CORE SCAN LOGIC UTILITIES
     ========================================================================= */
  const analyzeImage = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const cw = 80;
        const ch = Math.max(1, Math.round(80 * img.height / img.width));
        const tmp = document.createElement('canvas');
        tmp.width = cw; tmp.height = ch;
        const tctx = tmp.getContext('2d');
        tctx.drawImage(img, 0, 0, cw, ch);
        const data = tctx.getImageData(0, 0, cw, ch).data;

        let rSum = 0, gSum = 0, bSum = 0, n = 0;
        const lumens = [];
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          rSum += r; gSum += g; bSum += b; n++;
          lumens.push(0.299 * r + 0.587 * g + 0.114 * b);
        }
        const avgR = rSum / n, avgG = gSum / n, avgB = bSum / n;
        const meanLum = lumens.reduce((a, c) => a + c, 0) / lumens.length;
        const variance = lumens.reduce((a, c) => a + (c - meanLum) * (c - meanLum), 0) / lumens.length;
        const contrast = Math.sqrt(variance);
        const { h, s, l } = rgbToHsl(avgR, avgG, avgB);

        const rule = CATEGORY_RULES.find(r => r.test(h, s, l)) || CATEGORY_RULES[0];
        const brightnessTag = l > 190 ? "high-key" : (l < 70 ? "low-key" : "mid-tone");
        const contrastTag = contrast > 55 ? "high-contrast" : "flat-tonal";

        const tags = [
          { name: rule.tagPool[0], confidence: 0.9 + Math.random() * 0.09 },
          { name: brightnessTag, confidence: 0.85 + Math.random() * 0.1 },
          { name: contrastTag, confidence: 0.8 + Math.random() * 0.12 },
          { name: rule.tagPool[1] || "studio-lit", confidence: 0.78 + Math.random() * 0.12 },
        ];

        const confidence = Math.min(0.99, Math.max(0.82, 0.86 + (contrast / 255) * 0.35 + (Math.random() * 0.04 - 0.02)));

        resolve({
          category: rule.name,
          confidence,
          description: `Captured at ${img.width}×${img.height}px with a dominant tone near rgb(${Math.round(avgR)}, ${Math.round(avgG)}, ${Math.round(avgB)}). ${contrastTag === 'high-contrast' ? 'Sharp tonal separation suggests a studio-lit single subject.' : 'Flat tonal range suggests soft, diffused lighting conditions.'}`,
          tags,
          imageUrl: dataUrl,
          createdAt: new Date().toISOString(),
          id: 'scan_' + Math.random().toString(36).slice(2, 10)
        });
      };
      img.src = dataUrl;
    });
  };

  const handleFiles = (files) => {
    const file = files && files[0];
    if (!file) return;
    setErrorMessage('');
    const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ACCEPTED.includes(file.type)) {
      setErrorMessage('Unsupported format. Use JPEG, PNG, WEBP, or GIF.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage(`File exceeds 12MB ceiling.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => runScan(reader.result);
    reader.readAsDataURL(file);
  };

  const runScan = (dataUrl) => {
    setUiState('loading');
    setErrorMessage('');

    let phaseIdx = 0;
    setLoadingPhase(LOADING_PHASES[0]);
    const phaseInterval = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % LOADING_PHASES.length;
      setLoadingPhase(LOADING_PHASES[phaseIdx]);
    }, 320);

    Promise.all([
      analyzeImage(dataUrl),
      new Promise(res => setTimeout(res, 1400))
    ]).then(([result]) => {
      clearInterval(phaseInterval);
      setAuditResult(result);
      setUiState('result');
    });
  };

  const executePresetPass = (demo) => {
    setUiState('loading');
    setErrorMessage('');
    let phaseIdx = 0;
    setLoadingPhase("Running cognitive audit pass...");
    
    const phaseInterval = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % LOADING_PHASES.length;
      setLoadingPhase(LOADING_PHASES[phaseIdx]);
    }, 300);

    setTimeout(() => {
      clearInterval(phaseInterval);
      setAuditResult({
        id: 'demo_' + Math.floor(Math.random() * 100000),
>>>>>>> frontend-update
        imageUrl: demo.imageUrl,
        category: demo.category,
        confidence: demo.confidence,
        description: demo.description,
        tags: demo.tags,
<<<<<<< HEAD
        createdAt: demo.createdAt
      });
      setLoading(false);
      setLoadingPhase('');
    }, 1200);
  };

  const handleReset = () => {
    if (previewUrl && !previewUrl.startsWith('https://')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const scrollToElement = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-white font-sans antialiased overflow-x-hidden relative bg-[#020208]">
      
      {/* 2D HTML5 Particle Constellation Background (Highly compatible) */}
      <Background3D />

      {/* Floating Header */}
      <header className="border-b border-white/5 bg-slate-950/45 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToElement('hero')}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/10 flex items-center justify-center shadow-lg shadow-black/40">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            </div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              NeuralPortal
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-450 font-mono tracking-widest bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            COSMOS DB ACTIVE
=======
        createdAt: new Date().toISOString()
      });
      setUiState('result');
      scrollToId('gateway');
    }, 1100);
  };

  const scrollToId = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Card Mouse Tilt Animation Handling
  const handleCardTilt = (e, cardEl) => {
    const r = cardEl.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 8;
    const ry = (px - 0.5) * 8;
    cardEl.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
  };

  const resetCardTilt = (cardEl) => {
    cardEl.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  };

  const marqueeItems = [
    "SYS_STATUS: <b>OPERATIONAL</b>", "VISION_MODEL: v4.2", "AUDIT_QUEUE: CLEAR",
    "LATENCY: LIVE", "LEDGER: IN_MEMORY", "ENCRYPTION: TLS 1.3", "PIPELINE: NOMINAL"
  ];

  return (
    <div className="neural-portal-root">
      {/* Dynamic Style Injection Block for Exact Rendering Specs */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root{
          --bg:#1c1212;
          --accent:#e53e2b;
          --linen:#efebd8;
        }
        .neural-portal-root {
          background: var(--bg);
          color: var(--linen);
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .neural-portal-root ::selection{ background:rgba(229,62,43,0.3); color:#fff; }
        .mono{ font-family:'Space Mono', monospace; }

        @media (pointer:fine){
          .neural-portal-root, .neural-portal-root a, .neural-portal-root button, .neural-portal-root [data-tilt], .neural-portal-root .clickable{ cursor:none; }
        }
        #cursor-dot, #cursor-ring{
          position:fixed; top:0; left:0; pointer-events:none; z-index:9999;
          border-radius:50%; transform:translate(-50%,-50%);
        }
        #cursor-dot{
          width:5px; height:5px; background:var(--accent);
          transition:transform .08s linear;
        }
        #cursor-ring{
          width:28px; height:28px; border:1px solid rgba(239,235,216,0.35);
          transition:transform .15s ease-out, width .2s ease, height .2s ease, border-color .2s ease;
        }
        #cursor-ring.active{ width:46px; height:46px; border-color:var(--accent); }

        #bg-canvas{ position:fixed; inset:0; z-index:0; pointer-events:none; }
        .grid-overlay{
          position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.05;
          background-image:
            linear-gradient(to right, var(--linen) 1px, transparent 1px),
            linear-gradient(to bottom, var(--linen) 1px, transparent 1px);
          background-size:64px 64px;
        }
        .scanline{
          position:fixed; left:0; right:0; height:1px; background:var(--accent);
          z-index:1; pointer-events:none; opacity:0;
          animation:scan 9s linear infinite;
          box-shadow:0 0 8px 1px rgba(229,62,43,0.5);
        }
        @keyframes scan{
          0%{ top:0%; opacity:0; }
          5%{ opacity:.55; }
          50%{ opacity:.55; }
          95%{ opacity:0; }
          100%{ top:100%; opacity:0; }
        }
        .corner-mark{ position:fixed; width:16px; height:16px; border-color:rgba(239,235,216,0.15); z-index:2; pointer-events:none; }
        .corner-mark.tl{ top:24px; left:24px; border-top:1px solid; border-left:1px solid; }
        .corner-mark.tr{ top:24px; right:24px; border-top:1px solid; border-right:1px solid; }
        .corner-mark.bl{ bottom:24px; left:24px; border-bottom:1px solid; border-left:1px solid; }
        .corner-mark.br{ bottom:24px; right:24px; border-bottom:1px solid; border-right:1px solid; }

        #curtain{ position:fixed; inset:0; z-index:200; pointer-events:none; display:flex; flex-direction:column; justify-content:space-between; }
        .curtain-panel{ width:100%; height:50%; background:var(--linen); display:flex; }
        .curtain-panel.top{ align-items:flex-end; padding:32px; border-bottom:1px solid rgba(229,62,43,0.1); transition:transform .85s cubic-bezier(.85,0,.15,1); }
        .curtain-panel.bottom{ align-items:flex-start; padding:32px; transition:transform .85s cubic-bezier(.85,0,.15,1); }
        #curtain.hide .top{ transform:translateY(-100%); }
        #curtain.hide .bottom{ transform:translateY(100%); }
        .curtain-title{ font-weight:700; font-size:clamp(2rem,7vw,5rem); color:var(--bg); text-transform:uppercase; letter-spacing:-.03em; line-height:.9; }
        .curtain-sub{ font-size:11px; color:var(--accent); letter-spacing:.2em; text-transform:uppercase; }

        .reveal{ opacity:0; transform:translateY(16px); transition:opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .reveal.in{ opacity:1; transform:translateY(0); }
        .stagger > *{ transition-delay:calc(var(--i, 0) * 70ms); }

        header{
          position:sticky; top:0; z-index:50;
          border-bottom:1px solid rgba(239,235,216,0.1);
          background:rgba(28,18,18,0.9); backdrop-filter:blur(10px);
        }
        .header-inner{ max-width:1280px; margin:0 auto; padding:0 32px; height:88px; display:flex; align-items:center; justify-content:space-between; }
        .logo{ font-weight:700; font-size:14px; letter-spacing:-.02em; transition:color .3s; }
        .logo:hover{ color:var(--accent); }
        .live-tag{ display:flex; align-items:center; gap:10px; font-size:10px; letter-spacing:.15em; color:rgba(239,235,216,0.5); }
        .pulse-dot{ width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 1.6s ease-in-out infinite; }
        @keyframes pulse{ 0%,100%{opacity:1; transform:scale(1);} 50%{opacity:.4; transform:scale(1.4);} }

        .accent-bar{ position:fixed; top:0; left:0; right:0; height:3px; background:var(--accent); z-index:60; }

        .marquee-wrap{ overflow:hidden; border-bottom:1px solid rgba(239,235,216,0.08); background:rgba(229,62,43,0.03); white-space:nowrap; position:relative; z-index:40; }
        .marquee-track{ display:inline-block; padding:8px 0; animation:marquee 22s linear infinite; }
        .marquee-track span{ font-size:10px; letter-spacing:.15em; color:rgba(239,235,216,0.45); padding:0 24px; }
        .marquee-track span b{ color:var(--accent); }
        @keyframes marquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }

        main{ max-width:1200px; margin:0 auto; padding:96px 32px 176px; display:flex; flex-direction:column; gap:160px; position:relative; z-index:10; }
        section{ scroll-margin-top:128px; }

        .hero{ display:grid; grid-template-columns:1fr; gap:48px; align-items:baseline; }
        @media(min-width:1024px){ .hero{ grid-template-columns:2fr 1fr; } }
        .eyebrow{
          display:inline-block; font-size:10px; text-transform:uppercase; letter-spacing:.15em;
          color:var(--accent); border:1px solid rgba(229,62,43,0.3); background:rgba(229,62,43,0.05);
          padding:5px 10px; border-radius:2px; margin-bottom:28px;
        }
        h1{ font-weight:200; font-size:clamp(2.2rem,6vw,4rem); letter-spacing:-.03em; line-height:1.05; margin-bottom:28px; }
        h1 .accent-italic{ font-style:italic; font-weight:600; color:var(--accent); display:inline-block; }
        .hero p{ font-size:14px; font-weight:300; color:rgba(239,235,216,0.7); max-width:520px; line-height:1.7; }
        .stat-col{ border-left:1px solid rgba(239,235,216,0.1); padding-left:32px; display:flex; flex-direction:column; gap:20px; font-size:11px; }
        .stat-row{ display:flex; justify-content:space-between; align-items:baseline; padding-bottom:8px; border-bottom:1px solid rgba(239,235,216,0.05); }
        .stat-row .label{ display:flex; align-items:center; gap:8px; color:rgba(239,235,216,0.6); font-weight:500; }
        .stat-row .value{ font-weight:700; color:var(--linen); }

        .gateway{ max-width:760px; margin:0 auto; width:100%; }
        .dropzone{
          position:relative; border:1px solid rgba(239,235,216,0.1); border-radius:8px;
          padding:96px 32px; display:flex; flex-direction:column; align-items:center; text-align:center;
          background:rgba(239,235,216,0.02); transition:border-color .25s, background .25s;
        }
        .dropzone.dragging{ border-color:rgba(229,62,43,0.6); background:rgba(229,62,43,0.05); }
        .dropzone .mark{ position:absolute; width:12px; height:12px; border-color:rgba(229,62,43,0.4); transition:opacity .3s; opacity:0; }
        .dropzone:hover .mark{ opacity:1; }
        .mark.tl{ top:-1px; left:-1px; border-top:1px solid; border-left:1px solid; }
        .mark.tr{ top:-1px; right:-1px; border-top:1px solid; border-right:1px solid; }
        .mark.bl{ bottom:-1px; left:-1px; border-bottom:1px solid; border-left:1px solid; }
        .mark.br{ bottom:-1px; right:-1px; border-bottom:1px solid; border-right:1px solid; }
        .upload-icon{
          width:56px; height:56px; border-radius:50%; border:1px solid rgba(239,235,216,0.15);
          display:flex; align-items:center; justify-content:center; margin-bottom:24px; transition:border-color .3s, transform .3s;
        }
        .dropzone:hover .upload-icon{ border-color:rgba(229,62,43,0.5); transform:translateY(-3px); }
        .dropzone h3{ font-weight:500; font-size:18px; letter-spacing:-.01em; margin-bottom:8px; }
        .dropzone p{ font-size:12px; color:rgba(239,235,216,0.5); font-weight:300; max-width:340px; margin-bottom:24px; }
        .select-badge{ font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:rgba(239,235,216,0.4); border:1px solid rgba(239,235,216,0.1); padding:6px 12px; border-radius:2px; }
        .filetypes{ display:flex; align-items:center; gap:16px; margin-top:32px; font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:rgba(239,235,216,0.3); }
        .filetypes .sep{ width:4px; height:4px; border-radius:50%; background:rgba(239,235,216,0.2); }

        .error-box{ display:flex; gap:12px; border:1px solid rgba(229,62,43,0.3); background:rgba(229,62,43,0.05); padding:14px 16px; border-radius:4px; margin-top:16px; animation:slideIn .3s ease; text-align: left;}
        @keyframes slideIn{ from{opacity:0; transform:translateY(-6px);} to{opacity:1; transform:translateY(0);} }
        .error-box .title{ font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--accent); margin-bottom:2px; }
        .error-box p{ font-size:12px; color:rgba(239,235,216,0.7); font-weight:300; }

        .loading-box{
          border:1px solid rgba(239,235,216,0.1); background:rgba(239,235,216,0.03); border-radius:8px;
          padding:80px 32px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:20px;
        }
        .spinner{ width:22px; height:22px; border:2px solid rgba(229,62,43,0.2); border-top-color:var(--accent); border-radius:50%; animation:spin .8s linear infinite; }
        @keyframes spin{ to{ transform:rotate(360deg); } }
        .loading-box h4{ font-size:11px; letter-spacing:.15em; text-transform:uppercase; }
        .loading-box .phase{ font-size:10px; color:rgba(239,235,216,0.5); min-height:14px; }
        .scanbar{ width:220px; height:2px; background:rgba(239,235,216,0.08); border-radius:2px; overflow:hidden; position:relative; }
        .scanbar::after{
          content:''; position:absolute; top:0; left:-40%; width:40%; height:100%; background:var(--accent);
          animation:scanbar 1.1s ease-in-out infinite;
        }
        @keyframes scanbar{ 0%{ left:-40%; } 100%{ left:100%; } }

        .result-card{
          position:relative; border:1px solid rgba(239,235,216,0.1); background:rgba(239,235,216,0.02);
          border-radius:8px; overflow:hidden; animation:resultIn .55s cubic-bezier(.16,1,.3,1);
        }
        @keyframes resultIn{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:translateY(0); } }
        .result-card .mark{ position:absolute; width:12px; height:12px; border-color:rgba(229,62,43,0.5); z-index:2; }
        .result-header{ display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-bottom:1px solid rgba(239,235,216,0.1); background:rgba(239,235,216,0.015); }
        .result-header .status{ font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--accent); display:flex; align-items:center; gap:8px; }
        .result-header .ref{ font-size:9px; color:rgba(239,235,216,0.3); letter-spacing:.1em; }
        .result-grid{ display:grid; grid-template-columns:1fr; }
        @media(min-width:768px){ .result-grid{ grid-template-columns:2fr 3fr; } }
        .result-img-wrap{ position:relative; height:280px; overflow:hidden; border-bottom:1px solid rgba(239,235,216,0.1); }
        @media(min-width:768px){ .result-img-wrap{ height:auto; border-bottom:none; border-right:1px solid rgba(239,235,216,0.1); } }
        .result-img-wrap img{ width:100%; height:100%; object-fit:cover; filter:grayscale(1); opacity:.7; transition:filter .7s ease, opacity .7s ease, transform 4s ease; }
        .result-img-wrap:hover img{ filter:grayscale(0); opacity:1; transform:scale(1.04); }
        .cat-tag{ position:absolute; top:12px; left:12px; font-size:9px; letter-spacing:.1em; text-transform:uppercase; background:var(--bg); border:1px solid rgba(239,235,216,0.1); padding:3px 8px; }
        .result-data{ padding:32px; display:flex; flex-direction:column; justify-content:space-between; gap:32px; text-align:left; }
        .field-label{ font-size:10px; color:rgba(239,235,216,0.4); text-transform:uppercase; letter-spacing:.15em; }
        .result-data h3{ font-size:24px; font-weight:500; letter-spacing:-.02em; margin:6px 0 16px; }
        .result-data .desc{ font-size:13px; color:rgba(239,235,216,0.6); font-weight:300; line-height:1.7; margin-bottom:20px; }
        .confidence-row{ display:flex; justify-content:space-between; font-size:10px; text-transform:uppercase; letter-spacing:.15em; margin-bottom:6px; }
        .confidence-row .pct{ font-weight:700; color:var(--linen); }
        .confidence-track{ height:3px; background:rgba(239,235,216,0.1); border-radius:4px; overflow:hidden; margin-bottom:24px; }
        .confidence-fill{ height:100%; background:var(--accent); border-radius:4px; transition:width 1s cubic-bezier(.16,1,.3,1); }
        .tags-label{ display:flex; align-items:center; gap:6px; font-size:10px; color:rgba(239,235,216,0.4); text-transform:uppercase; letter-spacing:.15em; margin-bottom:10px; }
        .tag-list{ display:flex; flex-wrap:wrap; gap:8px; }
        .tag-chip{
          font-size:9px; text-transform:uppercase; letter-spacing:.1em; color:rgba(239,235,216,0.7);
          border:1px solid rgba(239,235,216,0.1); padding:5px 10px; border-radius:3px;
          transition:border-color .3s, color .3s, transform .3s; opacity:0; animation:chipIn .4s ease forwards;
        }
        @keyframes chipIn{ from{ opacity:0; transform:translateY(4px);} to{ opacity:1; transform:translateY(0);} }
        .tag-chip:hover{ border-color:rgba(229,62,43,0.5); color:var(--linen); transform:translateY(-2px); }
        .tag-chip .conf{ color:rgba(239,235,216,0.3); }
        .result-footer{ display:flex; justify-content:space-between; align-items:center; padding-top:20px; border-top:1px solid rgba(239,235,216,0.06); }
        .timestamp{ font-size:9px; color:rgba(239,235,216,0.3); letter-spacing:.1em; display:flex; align-items:center; gap:6px; }
        .reset-btn{
          font-size:10px; text-transform:uppercase; letter-spacing:.15em; color:var(--linen);
          border:1px solid rgba(239,235,216,0.15); padding:9px 16px; border-radius:3px; background:transparent;
          display:flex; align-items:center; gap:8px; transition:border-color .3s, color .3s;
        }
        .reset-btn:hover{ border-color:rgba(229,62,43,0.5); color:var(--accent); }

        .section-head{ display:flex; flex-direction:column; gap:20px; border-bottom:1px solid rgba(239,235,216,0.1); padding-bottom:24px; margin-bottom:48px; text-align: left; }
        @media(min-width:768px){ .section-head{ flex-direction:row; align-items:flex-end; justify-content:space-between; } }
        .section-eyebrow{ font-size:10px; color:var(--accent); text-transform:uppercase; letter-spacing:.15em; display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .section-head h3{ font-size:26px; font-weight:300; letter-spacing:-.02em; }
        .section-head .desc{ font-size:12px; color:rgba(239,235,216,0.6); font-weight:300; max-width:280px; line-height:1.6; }

        .catalog-grid{ display:grid; grid-template-columns:1fr; gap:32px; }
        @media(min-width:768px){ .catalog-grid{ grid-template-columns:repeat(3,1fr); } }
        .tilt-wrap{ perspective:1000px; }
        .demo-card{
          height:380px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;
          border:1px solid rgba(239,235,216,0.1); background:var(--bg); overflow:hidden; border-radius:4px;
          transition:border-color .4s, transform .2s ease-out; transform-style:preserve-3d; position:relative; text-align: left;
        }
        .demo-card .mark{ position:absolute; width:12px; height:12px; border-color:var(--accent); opacity:0; transition:opacity .3s; z-index:2; }
        .demo-card:hover .mark{ opacity:.7; }
        .demo-card:hover{ border-color:rgba(239,235,216,0.3); }
        .demo-img{ position:relative; height:190px; border-bottom:1px solid rgba(239,235,216,0.1); overflow:hidden; }
        .demo-img img{ width:100%; height:100%; object-fit:cover; filter:grayscale(1); opacity:.6; transition:filter .7s, opacity .7s, transform .7s; }
        .demo-card:hover .demo-img img{ filter:grayscale(0); opacity:1; transform:scale(1.05); }
        .demo-body{ padding:22px; flex-grow:1; display:flex; flex-direction:column; justify-content:space-between; gap:14px; background:rgba(239,235,216,0.02); }
        .demo-body h4{ font-size:14px; font-weight:500; transition:color .3s; }
        .demo-card:hover .demo-body h4{ color:var(--accent); }
        .demo-body p{ font-size:11px; color:rgba(239,235,216,0.55); font-weight:300; line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .demo-meta{ display:flex; justify-content:space-between; font-size:9px; color:rgba(239,235,216,0.4); padding-top:10px; border-top:1px solid rgba(239,235,216,0.05); }
        .demo-meta .exec{ display:flex; align-items:center; gap:4px; font-weight:700; color:var(--linen); transition:color .3s; }
        .demo-card:hover .demo-meta .exec{ color:var(--accent); }

        .pipeline-grid{ display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:640px){ .pipeline-grid{ grid-template-columns:1fr 1fr; } }
        @media(min-width:1024px){ .pipeline-grid{ grid-template-columns:repeat(4,1fr); } }
        .pipe-card{
          padding:28px; border:1px solid rgba(239,235,216,0.1); background:rgba(239,235,216,0.01);
          display:flex; flex-direction:column; justify-content:space-between; gap:24px; border-radius:4px;
          transition:background .3s, transform .3s; text-align: left;
        }
        .pipe-card:hover{ background:rgba(239,235,216,0.03); transform:translateY(-4px); }
        .pipe-top{ display:flex; justify-content:space-between; align-items:center; color:rgba(239,235,216,0.4); }
        .pipe-top .icon{ color:rgba(229,62,43,0.8); }
        .pipe-card h5{ font-size:14px; font-weight:500; margin-bottom:8px; }
        .pipe-card p{ font-size:11px; color:rgba(239,235,216,0.55); font-weight:300; line-height:1.6; }

        nav.dock{
          position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:50;
          display:flex; align-items:center; gap:0; padding:6px; border:1px solid rgba(239,235,216,0.1);
          background:rgba(28,18,18,0.95); backdrop-filter:blur(10px); border-radius:999px;
          box-shadow:0 20px 50px rgba(0,0,0,0.6); font-size:10px;
        }
        .dock-highlight{
          position:absolute; height:calc(100% - 12px); top:6px; background:rgba(229,62,43,0.12);
          border:1px solid rgba(229,62,43,0.35); border-radius:999px; transition:left .35s cubic-bezier(.16,1,.3,1), width .35s cubic-bezier(.16,1,.3,1);
        }
        .dock-btn{
          position:relative; z-index:1; background:none; border:none; color:rgba(239,235,216,0.6);
          padding:8px 18px; text-transform:uppercase; letter-spacing:.1em; font-weight:500; transition:color .2s;
        }
        .dock-btn.active, .dock-btn:hover{ color:var(--linen); }

        footer{ border-top:1px solid rgba(239,235,216,0.1); padding:40px 0; font-size:9px; color:rgba(239,235,216,0.4); position:relative; z-index:10; }
        .footer-inner{ max-width:1280px; margin:0 auto; padding:0 32px; display:flex; flex-direction:column; gap:16px; align-items:center; justify-content:space-between; letter-spacing:.15em; }
        @media(min-width:640px){ .footer-inner{ flex-direction:row; } }
        .footer-links{ display:flex; gap:16px; align-items:center; }
        .footer-links span:hover{ color:var(--accent); cursor:pointer; }
        .footer-links .strong{ color:rgba(239,235,216,0.6); font-weight:700; }

        .hidden{ display:none !important; }
        svg{ display:block; }
      ` }} />

      {/* Entrance Curtain Block */}
      {!destroyCurtain && (
        <div id="curtain" className={!showCurtain ? 'hide' : ''}>
          <div class="curtain-panel top"><span class="curtain-title">NEURAL_PORTAL</span></div>
          <div class="curtain-panel bottom"><span class="curtain-sub">©2026 // AUDIT SYSTEM INITIATED</span></div>
        </div>
      )}

      {/* Reactive Tracking Cursor Ring Layers */}
      <div id="cursor-dot" ref={cursorDotRef}></div>
      <div id="cursor-ring" ref={cursorRingRef} className={cursorRingActive ? 'active' : ''}></div>

      {/* Immersive UI Canvas Matrix Overlays */}
      <canvas id="bg-canvas" ref={canvasRef}></canvas>
      <div className="grid-overlay"></div>
      <div className="scanline"></div>
      <div className="corner-mark tl"></div>
      <div className="corner-mark tr"></div>
      <div className="corner-mark bl"></div>
      <div className="corner-mark br"></div>
      <div className="accent-bar"></div>

      {/* Main Framework Layout Container */}
      <header>
        <div className="header-inner">
          <div className="logo clickable" onClick={() => scrollToId('hero')}>NEURAL_PORTAL.</div>
          <div className="live-tag mono">
            <span className="pulse-dot"></span> LIVE_LEDGER · <span>{clockText}</span>
>>>>>>> frontend-update
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* Main Workspace Frame */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col justify-center gap-24 z-10 pb-32">
        
        {/* Telemetry HUD stats */}
        <section id="hero" className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-[9px] font-bold tracking-widest font-mono uppercase text-amber-400">
            <Cpu className="w-3.5 h-3.5" /> Neural Scanning Gateway Active
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-none uppercase font-mono">
            Catalog Audit Workspace
          </h2>
          <p className="text-xs md:text-sm text-slate-450 max-w-xl mx-auto leading-relaxed">
            Analyze and map product categories. Our backend handles public hosting on Blob Containers, queries Cognitive Vision API, and records audit logs in Cosmos DB.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center pt-2 text-[10px] font-bold tracking-wider font-mono text-slate-400">
            <span className="glass-panel px-4 py-2 rounded-xl border-white/5 flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-amber-500" /> Latency: &lt; 200ms
            </span>
            <span className="glass-panel px-4 py-2 rounded-xl border-white/5 flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-500" /> Mapping: Realtime
            </span>
            <span className="glass-panel px-4 py-2 rounded-xl border-white/5 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-amber-500" /> DB: Cosmos DB
            </span>
          </div>
        </section>

        {/* Portal Gateway (Upload and result panels) */}
        <section id="gateway" className="space-y-8 scroll-mt-24">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md mx-auto glass-panel rounded-3xl p-12 flex flex-col items-center text-center space-y-6 shadow-2xl border-white/5 relative bg-[#09090f]/60"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent animate-pulse" />
                
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center bg-slate-950/50 shadow-inner">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-300 text-xs tracking-wider uppercase font-mono">Running Inference</h4>
                  <p className="text-[10px] text-amber-400 font-mono tracking-wider">
                    {loadingPhase}
                  </p>
                </div>
              </motion.div>
            ) : result ? (
              <ResultCard key="result" data={result} onReset={handleReset} />
            ) : (
              <FileUpload key="upload" onFileSelect={handleFileSelect} error={error} />
            )}
          </AnimatePresence>
        </section>

        {/* Showcase Catalog Grid Section */}
        <section id="catalog" className="space-y-10 scroll-mt-28">
          <div className="flex flex-col items-center justify-center space-y-3">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Compass className="w-4 h-4" /> Telemetry Sandbox
            </span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight text-center uppercase font-mono">
              Holographic Sandbox Presets
            </h3>
            <p className="text-xs text-slate-450 max-w-sm text-center leading-relaxed">
              Select a preset configuration below to trigger a simulated neural scan sequence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {DEMO_PRODUCTS.map((demo, idx) => (
              <Tilt3D
                key={idx}
                maxTilt={10}
                className="h-[310px] flex flex-col justify-between"
              >
                <div 
                  onClick={() => {
                    loadDemoProduct(demo);
                    scrollToElement('gateway');
                  }}
                  className="h-full flex flex-col justify-between cursor-pointer group"
                >
                  {/* Top: Image preview */}
                  <div className="relative h-2/3 w-full bg-[#05050a] overflow-hidden border-b border-white/5">
                    <img
                      src={demo.imageUrl}
                      alt={demo.name}
                      className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020208] via-transparent to-transparent opacity-90" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl border border-white/5 bg-[#09090f]/95 text-[9px] font-bold text-amber-500 font-mono tracking-widest uppercase">
                      {demo.category}
                    </span>
                  </div>

                  {/* Bottom details */}
                  <div className="p-5 flex-grow flex flex-col justify-between bg-slate-950/20 backdrop-blur-md">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 group-hover:text-amber-500 transition-colors duration-300">
                        {demo.name}
                      </h4>
                      <p className="text-[11px] text-slate-450 mt-1 line-clamp-2 leading-relaxed">
                        {demo.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 text-[9px] text-slate-500 font-bold tracking-widest font-mono group-hover:text-slate-350 transition-colors">
                      <span>MATCH: {(demo.confidence * 100).toFixed(0)}%</span>
                      <span className="flex items-center gap-1 text-amber-500 group-hover:translate-x-1 transition-transform duration-300">
                        TEST UNIT <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Tilt3D>
            ))}
          </div>
        </section>

        {/* Cloud Ledger Pipeline Overview */}
        <section id="pipeline" className="w-full max-w-5xl mx-auto scroll-mt-28">
          <div className="bg-slate-900/10 border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 backdrop-blur-xl relative overflow-hidden bg-[#09090f]/20">
            <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest text-center font-mono">
              Cloud Ledger Architecture Flow
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Box 1 */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between border-white/5 bg-[#09090f]/40">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-950 border border-white/5 text-slate-400 rounded-xl">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono font-bold">NODE 01</span>
                </div>
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wide font-mono">React Portal</h5>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    Parses binary payloads and triggers Express router channels.
                  </p>
                </div>
              </div>

              {/* Box 2 */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between border-white/5 bg-[#09090f]/40">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-950 border border-white/5 text-slate-400 rounded-xl">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono font-bold">NODE 02</span>
                </div>
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wide font-mono">Blob Storage</h5>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    Encrypts and stores raw files inside public Azure Blob containers.
                  </p>
                </div>
              </div>

              {/* Box 3 */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between border-white/5 bg-[#09090f]/40">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-950 border border-white/5 text-slate-400 rounded-xl">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono font-bold">NODE 03</span>
                </div>
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wide font-mono">AI Vision v4</h5>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    Runs pre-trained computer vision classifications over Blob assets.
                  </p>
                </div>
              </div>

              {/* Box 4 */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between border-white/5 bg-[#09090f]/40">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-950 border border-white/5 text-slate-400 rounded-xl">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono font-bold">NODE 04</span>
                </div>
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wide font-mono">Cosmos DB</h5>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    Performs serverless audit ledger records partitioned by category.
                  </p>
                </div>
              </div>

=======
      {/* Seamless Infinit Loop Ticker Marquee */}
      <div className="marquee-wrap mono">
        <div className="marquee-track">
          {marqueeItems.concat(marqueeItems).map((item, idx) => (
            <React.Fragment key={idx}>
              <span dangerouslySetInnerHTML={{ __html: item }} />
              {idx !== marqueeItems.length * 2 - 1 && <span>//</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main>
        {/* SECTION 01: HERO PLATFORM INTRO */}
        <section id="hero" ref={sectionRefs.hero} className="hero">
          <div>
            <span className="eyebrow mono reveal in">Workspace Framework v4.1</span>
            <h1 className="reveal in">Intelligence for <br /><span className="accent-italic">Catalog Audits</span></h1>
            <p className="reveal in">A clean, high-throughput utility layer that classifies product imagery client-side — real pixel analysis, no server round-trip — and logs results to a live audit ledger.</p>
          </div>
          <div className="stat-col mono reveal in">
            <div className="stat-row">
              <span className="label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                PIPELINE
              </span>
              <span className="value">{latencyText}</span>
            </div>
            <div className="stat-row">
              <span className="label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2l1.5 4.5L12 8l-4.5 1.5L6 14l-1.5-4.5L0 8l4.5-1.5L6 2z" /><path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" /></svg>
                ANALYSIS
              </span>
              <span className="value">REALTIME</span>
            </div>
            <div className="stat-row">
              <span className="label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>
                PERSISTENCE
              </span>
              <span className="value">LOCAL_LEDGER</span>
>>>>>>> frontend-update
            </div>
          </div>
        </section>

<<<<<<< HEAD
      </main>

      {/* Floating Navigation Dock */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(255,255,255,0.01)] border-white/10 flex items-center gap-6 backdrop-blur-2xl bg-[#09090f]/75">
        <button 
          onClick={() => scrollToElement('hero')} 
          className="text-xs font-bold font-mono tracking-wider hover:text-amber-500 transition-colors uppercase cursor-pointer"
        >
          Intro
        </button>
        <div className="h-4 w-[1px] bg-white/10" />
        <button 
          onClick={() => scrollToElement('gateway')} 
          className="text-xs font-bold font-mono tracking-wider hover:text-amber-500 transition-colors uppercase cursor-pointer"
        >
          Scan
        </button>
        <div className="h-4 w-[1px] bg-white/10" />
        <button 
          onClick={() => scrollToElement('catalog')} 
          className="text-xs font-bold font-mono tracking-wider hover:text-amber-500 transition-colors uppercase cursor-pointer"
        >
          Presets
        </button>
        <div className="h-4 w-[1px] bg-white/10" />
        <button 
          onClick={() => scrollToElement('pipeline')} 
          className="text-xs font-bold font-mono tracking-wider hover:text-amber-500 transition-colors uppercase cursor-pointer"
        >
          Flow
        </button>
      </nav>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-[#030306]/90 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-slate-555 font-mono uppercase tracking-widest">
          <p>© {new Date().getFullYear()} NeuralPortal Inc.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-450 transition-colors cursor-pointer">Ledger Registry</span>
            <span>•</span>
            <span className="hover:text-slate-450 transition-colors cursor-pointer">TLS 1.3 SECURE</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
export default App;
=======
        {/* SECTION 02: GATEWAY UTILITY AREA */}
        <section id="gateway" ref={sectionRefs.gateway} className="gateway">
          {uiState === 'idle' && (
            <div
              id="dropzone"
              className={`dropzone reveal in ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
            >
              <span className="mark tl"></span><span className="mark tr"></span><span className="mark bl"></span><span class="mark br"></span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="upload-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" /><path d="M7 9l5-5 5 5" /><path d="M12 4v12" /></svg>
              </div>
              <h3>Drop a product image</h3>
              <p>Or click to browse local storage. Pixels are sampled directly in your browser — nothing uploads anywhere.</p>
              <span className="select-badge mono">SELECT_FILE</span>
              <div className="filetypes">
                <span>JPEG</span><span className="sep"></span><span>PNG</span><span class="sep"></span><span>WEBP</span><span class="sep"></span><span>MAX 12MB</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="error-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53e2b" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M12 9v4M12 17h.01M10.3 3.9L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" /></svg>
              <div>
                <div className="title mono">Intake Rejected</div>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {uiState === 'loading' && (
            <div className="loading-box">
              <div className="spinner"></div>
              <h4 className="mono">Analyzing Telemetry Assets</h4>
              <p className="phase mono">{loadingPhase}</p>
              <div className="scanbar"></div>
            </div>
          )}

          {uiState === 'result' && auditResult && (
            <div className="result-card">
              <span className="mark" style={{ top: '-1px', left: '-1px', borderTop: '1px solid', borderLeft: '1px solid' }}></span>
              <span className="mark" style={{ top: '-1px', right: '-1px', borderTop: '1px solid', borderRight: '1px solid' }}></span>
              <span className="mark" style={{ bottom: '-1px', left: '-1px', borderBottom: '1px solid', borderLeft: '1px solid' }}></span>
              <span className="mark" style={{ bottom: '-1px', right: '-1px', borderBottom: '1px solid', borderRight: '1px solid' }}></span>
              <div className="result-header mono">
                <span className="status"><span className="pulse-dot"></span> Audit Complete</span>
                <span className="ref">REF_{String(auditResult.id || 'UNSET').slice(-8).toUpperCase()}</span>
              </div>
              <div className="result-grid">
                <div className="result-img-wrap">
                  <img src={auditResult.imageUrl} alt={auditResult.category} />
                  <span className="cat-tag mono">{auditResult.category || 'Uncategorized'}</span>
                </div>
                <div className="result-data">
                  <div>
                    <span className="field-label mono">Classification</span>
                    <h3>{auditResult.category || 'Unknown Class'}</h3>
                    <p className="desc">{auditResult.description || 'No descriptive telemetry was returned for this asset.'}</p>
                    <div className="confidence-row mono">
                      <span style={{ color: 'rgba(239,235,216,0.4)' }}>Confidence</span>
                      <span className="pct">{Math.round(auditResult.confidence * 100)}%</span>
                    </div>
                    <div className="confidence-track">
                      <div className="confidence-fill" style={{ width: `${Math.round(auditResult.confidence * 100)}%` }}></div>
                    </div>
                    <div className="tags-label mono">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.6 12.6L12 21.2 2.8 12 12 2.8h8.6z" /><circle cx="7" cy="7" r="1.2" /></svg>
                      Detected Attributes
                    </div>
                    <div className="tag-list">
                      {(auditResult.tags || []).map((t, i) => (
                        <span key={i} className="tag-chip mono" style={{ animationDelay: `${i * 90}ms` }}>
                          {t.name}
                          {typeof t.confidence === 'number' && <span className="conf"> · {Math.round(t.confidence * 100)}%</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="result-footer">
                    <span className="timestamp mono">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                      {formatTimestamp(auditResult.createdAt)}
                    </span>
                    <button className="reset-btn mono" onClick={() => { setUiState('idle'); setAuditResult(null); }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                      Run New Scan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 03: PRESET CLUSTERS */}
        <section id="catalog" ref={sectionRefs.catalog}>
          <div className="section-head">
            <div>
              <span className="section-eyebrow mono">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /></svg>
                MODULE_01
              </span>
              <h3>Sandbox Execution Clusters</h3>
            </div>
            <p className="desc">Instantly fire preset processing passes through curated visual configurations.</p>
          </div>
          <div className="catalog-grid">
            {DEMO_PRODUCTS.map((demo, idx) => (
              <div key={idx} className="tilt-wrap reveal in" style={{ '--i': idx }}>
                <div
                  className="demo-card clickable"
                  data-tilt
                  onClick={() => executePresetPass(demo)}
                  onMouseMove={(e) => handleCardTilt(e, e.currentTarget)}
                  onMouseLeave={(e) => resetCardTilt(e.currentTarget)}
                >
                  <span className="mark tl" style={{ top: '-1px', left: '-1px', borderTop: '1px solid', borderLeft: '1px solid' }}></span>
                  <span className="mark tr" style={{ top: '-1px', right: '-1px', borderTop: '1px solid', borderRight: '1px solid' }}></span>
                  <span className="mark bl" style={{ bottom: '-1px', left: '-1px', borderBottom: '1px solid', borderLeft: '1px solid' }}></span>
                  <span className="mark br" style={{ bottom: '-1px', right: '-1px', borderBottom: '1px solid', borderRight: '1px solid' }}></span>
                  <div className="demo-img">
                    <img src={demo.imageUrl} alt={demo.name} />
                    <span className="cat-tag mono">{demo.category}</span>
                  </div>
                  <div className="demo-body">
                    <div>
                      <h4>{demo.name}</h4>
                      <p>{demo.description}</p>
                    </div>
                    <div className="demo-meta mono">
                      <span>CONFIDENCE: {(demo.confidence * 100).toFixed(1)}%</span>
                      <span className="exec">EXECUTE
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M7 17L17 7M8 7h9v9" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 04: PIPELINE NODES */}
        <section id="pipeline" ref={sectionRefs.pipeline}>
          <div className="section-head" style={{ borderBottom: '1px solid rgba(239,235,216,0.1)', marginBottom: '48px' }}>
            <span className="section-eyebrow mono">MODULE_02 // SYSTEM PIPELINE DATAFLOW</span>
          </div>
          <div className="pipeline-grid">
            {PIPELINE_STEPS.map((step, idx) => (
              <div key={idx} className="pipe-card reveal in" style={{ '--i': idx }}>
                <div className="pipe-top">
                  <span className="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{step.icon}</svg></span>
                  <span className="mono" style={{ fontSize: '9px' }}>ND_{step.node}</span>
                </div>
                <div>
                  <h5>{step.title}</h5>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Dock Navigator Component */}
      <nav className="dock mono">
        <div className="dock-highlight" ref={dockHighlightRef} id="dockHighlight"></div>
        <button className={`dock-btn ${activeSection === 'hero' ? 'active' : ''}`} data-target="hero" onClick={() => scrollToId('hero')}>Intro</button>
        <button className={`dock-btn ${activeSection === 'gateway' ? 'active' : ''}`} data-target="gateway" onClick={() => scrollToId('gateway')}>Scan</button>
        <button className={`dock-btn ${activeSection === 'catalog' ? 'active' : ''}`} data-target="catalog" onClick={() => scrollToId('catalog')}>Presets</button>
        <button className={`dock-btn ${activeSection === 'pipeline' ? 'active' : ''}`} data-target="pipeline" onClick={() => scrollToId('pipeline')}>Flow</button>
      </nav>

      <footer className="mono">
        <div className="footer-inner">
          <p>© 2026 NEURAL_PORTAL SYSTEMS INC.</p>
          <div className="footer-links">
            <span>REGISTRY LOGS</span><span>//</span><span className="strong">TLS 1.3 PLATFORM SECURE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
>>>>>>> frontend-update
