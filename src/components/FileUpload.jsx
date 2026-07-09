import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, AlertCircle, FileImage, Radio } from 'lucide-react';
import { Tilt3D } from './Tilt3D.jsx';

const MAX_SIZE_MB = 4;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const FileUpload = ({ onFileSelect, error: externalError }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [internalError, setInternalError] = useState(null);
  const fileInputRef = useRef(null);

  const error = externalError || internalError;

  const validateAndSelectFile = (file) => {
    setInternalError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setInternalError('Payload structure mismatch. JPEG, PNG, or WebP only.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setInternalError(`Payload limit exceeded. Maximum size: ${MAX_SIZE_MB}MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Curved Smoked Glass Panel */}
      <Tilt3D maxTilt={6} className="relative rounded-[32px] overflow-hidden bg-slate-950/40 border border-white/5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Double-layered glass frame highlights */}
        <div className="absolute inset-[1px] rounded-[31px] border border-white/5 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative p-12 text-center cursor-pointer min-h-[300px] flex flex-col justify-center items-center overflow-hidden transition-colors duration-500
            ${isDragActive ? 'bg-amber-500/[0.02]' : 'bg-transparent'}
          `}
        >
          {/* Volumetric horizontal sweep line */}
          <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#f59e0b,0_0_25px_#f59e0b] animate-[scan_3s_ease-in-out_infinite] pointer-events-none z-10" />

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleChange}
          />

          <div className="relative space-y-8 flex flex-col items-center z-20">
            
            {/* Core Terminal Icon with soft amber spotlight */}
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/[0.04] rounded-full blur-xl scale-150 animate-pulse" />
              <div className="p-4 rounded-full bg-[#09090f] border border-white/5 text-amber-500 relative z-10 flex items-center justify-center shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <Radio className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-ping" />
            </div>

            {/* Minimal Nothing OS Typography */}
            <div className="space-y-2 font-mono uppercase tracking-wider">
              <p className="text-sm text-slate-200 font-bold">
                Drop item file or <span className="text-amber-500 cursor-pointer hover:underline decoration-amber-500/50">Load System</span>
              </p>
              <p className="text-[10px] text-slate-500">
                JPEG // PNG // WEBP // MAX {MAX_SIZE_MB}MB
              </p>
            </div>

            {/* Tactile Asset Node badges */}
            <div className="flex gap-2 justify-center text-[9px] text-slate-500 font-mono tracking-widest uppercase">
              <span className="flex items-center gap-1.5 bg-slate-950/60 border border-white/5 px-3 py-1 rounded-xl">
                <FileImage className="w-3 h-3 text-slate-600" /> JPG
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 border border-white/5 px-3 py-1 rounded-xl">
                <FileImage className="w-3 h-3 text-amber-500" /> PNG
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 border border-white/5 px-3 py-1 rounded-xl">
                <FileImage className="w-3 h-3 text-slate-600" /> WEBP
              </span>
            </div>

          </div>

          {/* Micro-dot screen matrix */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_0)] bg-[size:16px_16px] pointer-events-none opacity-40" />
        </div>
      </Tilt3D>

      {/* Tactile Glass Exception Alert */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex items-start gap-4 p-5 bg-amber-500/[0.02] border border-amber-500/20 rounded-[20px] text-amber-300 font-mono uppercase shadow-md"
          >
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-left">
              <h5 className="font-bold text-amber-200 text-xs tracking-widest">GATEWAY EXCEPTION</h5>
              <p className="text-[10px] mt-0.5 leading-relaxed text-slate-400 tracking-wider lowercase">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FileUpload;
