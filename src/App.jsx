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
        imageUrl: demo.imageUrl,
        category: demo.category,
        confidence: demo.confidence,
        description: demo.description,
        tags: demo.tags,
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
          </div>
        </div>
      </header>

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

            </div>
          </div>
        </section>

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
