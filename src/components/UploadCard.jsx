import React, { useRef, useState, forwardRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import ClassificationMatrix from './ClassificationMatrix';

/**
 * UploadCard Component
 * Encapsulates the drag-and-drop zone, tilt animations, file upload handling,
 * loading progress phases, and results spec sheet.
 */
const UploadCard = forwardRef(({
  loading,
  phase,
  result,
  error,
  processFile,
  reset,
  setHoveredTag
}, ref) => {
  const [dragging, setDragging] = useState(false);
  const [cardTransform, setCardTransform] = useState('none');
  const fileInputRef = useRef(null);

  // 3D Card Hover Tilt Interaction (Isolated locally)
  const handleCardMouseMove = (e) => {
    const card = ref?.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 6;
    const rotateY = (x / (rect.width / 2)) * 6;
    setCardTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`);
  };

  const handleCardMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
  };

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

  return (
    <section className={`fullscreen-section upload-section ${result ? 'has-result' : ''}`}>
      <div
        className={`premium-card ${result ? 'result-mode' : ''}`}
        ref={ref}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{ transform: cardTransform }}
      >
        <div className="card-bottom-corners" />

        {/* CASE 1: IDLE / Drag & Drop Upload Zone */}
        {!loading && !result && (
          <>
            <div
              className={`drag-zone ${dragging ? 'active' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                <Upload size={28} />
              </div>
              <h3 className="drag-headline">Analyze Artifact</h3>
              <p className="drag-sub">
                Drag & drop product image or click to select
              </p>
              <button className="select-btn">
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

            {error && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', color: '#f87171', fontSize: '0.85rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}
          </>
        )}

        {/* CASE 2: LOADING / SCANNING TIMELINE STATUS */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 0' }}>
            <div className="loading-spinner" />
            <h3 className="drag-headline" style={{ fontSize: '1.1rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              {phase}
            </h3>
          </div>
        )}

        {/* CASE 3: CLASSIFIED RESULT MATRIX */}
        {result && (
          <ClassificationMatrix
            result={result}
            reset={reset}
            setHoveredTag={setHoveredTag}
          />
        )}
      </div>
    </section>
  );
});

UploadCard.displayName = 'UploadCard';
export default UploadCard;
