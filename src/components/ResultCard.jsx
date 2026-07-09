import React from 'react';
import { motion } from 'framer-motion';
import { ConfidenceBar } from './ConfidenceBar.jsx';
import { Tilt3D } from './Tilt3D.jsx';
import { Tag, Sparkles, Database, Clock, Image as ImageIcon, RotateCcw, ShieldCheck } from 'lucide-react';

export const ResultCard = ({ data, onReset }) => {
  const formattedDate = new Date(data.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 18 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-stretch"
    >
      {/* Left Side: Product Image Display Card (with 3D Tilt) */}
      <div className="md:w-5/12 flex">
        <Tilt3D maxTilt={15} className="w-full flex items-center justify-center bg-slate-950/45 p-6 border border-white/5 relative min-h-[380px] rounded-3xl">
          {/* Active green camera node */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-450 animate-ping" />
            Live Preview
          </div>

          <div className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#d97706] animate-[scan_4s_ease-in-out_infinite] pointer-events-none z-10" />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden bg-slate-950/60 aspect-square w-full flex items-center justify-center border border-white/5 shadow-inner"
          >
            <img
              src={data.imageUrl}
              alt={data.category}
              className="object-contain w-full h-full p-4 filter grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
            
            {/* Tech grid mask */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
          </motion.div>
        </Tilt3D>
      </div>

      {/* Right Side: Volumetric Telemetry Analytics Dashboard */}
      <div className="md:w-7/12 flex">
        <div className="w-full p-8 rounded-3xl bg-slate-950/45 border border-white/5 flex flex-col justify-between space-y-6 shadow-2xl relative bg-[#09090f]/60">
          
          {/* Ambient colored spots inside panel - amber glow */}
          <div className="absolute top-0 right-1/4 w-[150px] h-[150px] bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            
            {/* Telemetry Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Neural Core Analysis
                </motion.div>
                <motion.h3 
                  variants={itemVariants}
                  className="text-3xl font-extrabold text-white tracking-tight leading-none uppercase font-mono"
                >
                  {data.category}
                </motion.h3>
              </div>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all shadow-md hover:shadow-amber-550/10 cursor-pointer"
                title="Classify another image"
              >
                <RotateCcw className="w-4 h-4 text-amber-500" />
              </motion.button>
            </div>

            {/* AI Synthesized Description */}
            <motion.div variants={itemVariants} className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Synthesized Description</span>
              <p className="text-slate-300 text-sm leading-relaxed bg-[#05050a]/60 p-4 rounded-2xl border border-white/5 font-mono">
                {data.description}
              </p>
            </motion.div>

            {/* Liquid Confidence Bar */}
            <motion.div variants={itemVariants}>
              <ConfidenceBar confidence={data.confidence} />
            </motion.div>

            {/* Staggered Holographic Tag Badges */}
            <motion.div variants={itemVariants} className="space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-500" /> Extracted Taxonomy Nodes
              </span>
              <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1">
                {data.tags.map((tag, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05, borderColor: 'rgba(217, 119, 6, 0.4)' }}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950/60 text-slate-300 border border-white/5 transition-all cursor-default font-mono"
                    title={`Confidence: ${(tag.confidence * 100).toFixed(2)}%`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 opacity-75" />
                    {tag.name}
                    <span className="ml-2 text-[9px] text-slate-500 font-mono">
                      {(tag.confidence * 100).toFixed(0)}%
                    </span>
                  </motion.span>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Database & Cloud Ledger Strip */}
          <motion.div 
            variants={itemVariants}
            className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500 font-mono tracking-widest uppercase"
          >
            <span className="flex items-center gap-2 bg-[#05050a]/60 px-3 py-1.5 rounded-xl border border-white/5">
              <Database className="w-3.5 h-3.5 text-slate-400" /> Ledger ID: {data.id}
            </span>
            <span className="flex items-center gap-2 bg-[#05050a]/60 px-3 py-1.5 rounded-xl border border-white/5">
              <Clock className="w-3.5 h-3.5 text-slate-450" /> Logs: {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Indexed
            </span>
          </motion.div>

        </div>
      </div>

    </motion.div>
  );
};
