import React from 'react';

/**
 * ClassificationMatrix Component
 * Renders the clean industrial spec matrix table of class attributes and tag badges.
 */
export default function ClassificationMatrix({ result, reset, setHoveredTag }) {
  return (
    <div className="result-spec-container">
      <div className="spec-header">
        <div className="spec-title">CLASSIFICATION MATRIX</div>
      </div>
      
      <div className="spec-divider" />
      
      <div className="spec-row">
        <span className="spec-label">IDENTIFIED CLASS</span>
        <span className="spec-value">{result.category}</span>
      </div>
      
      <div className="spec-row">
        <span className="spec-label">MODEL CONFIDENCE</span>
        <span className="spec-value highlight-blue">{Math.round((result.confidence || 0) * 100)}%</span>
      </div>

      {result.description && (
        <>
          <div className="spec-divider" />
          <div className="spec-description-block">
            <div className="spec-desc-label">DESCRIPTION</div>
            <p className="spec-desc-text">{result.description}</p>
          </div>
        </>
      )}

      {result.tags?.length > 0 && (
        <>
          <div className="spec-divider" />
          <div className="spec-tags-section">
            <div className="spec-desc-label" style={{ marginBottom: '0.8rem' }}>
              PROBABILITY DISTRIBUTION (HOVER FOR CV TARGET)
            </div>
            <div className="badge-grid">
              {result.tags.slice(0, 5).map((tag) => (
                <div
                  key={tag.name}
                  className="tag-badge"
                  onMouseEnter={() => setHoveredTag(tag.name)}
                  onMouseLeave={() => setHoveredTag(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="tag-name-text">{tag.name}</span>
                  <span className="tag-confidence-text">{Math.round((tag.confidence || 0) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="spec-divider" style={{ margin: '1.5rem 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-reset" onClick={reset}>
          Analyze New Image
        </button>
      </div>
    </div>
  );
}
