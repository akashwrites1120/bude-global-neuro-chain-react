import React, { useState } from 'react';
import styles from '../styles/components/Controls.module.css';
import { exportToPNG, exportToSVG, generateShareLink } from '../utils/exportHelpers';

const Controls = React.memo(({ 
  animating, 
  onResetView, 
  onToggleAnimation, 
  onExportData,
  canvasRef,
  nodes,
  edges,
  clusters,
  camera,
  zoom
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportPNG = () => {
    exportToPNG(canvasRef, 'bude-global-neuro-chain.png');
    setShowExportMenu(false);
  };

  const handleExportSVG = () => {
    exportToSVG(nodes, edges, clusters, 'bude-global-neuro-chain.svg');
    setShowExportMenu(false);
  };

  const handleShareLink = () => {
    const link = generateShareLink(camera, zoom);
    navigator.clipboard.writeText(link).then(() => {
      alert('Share link copied to clipboard!');
    });
    setShowExportMenu(false);
  };

  return (
    <div className={styles.controls}>
      <button
        className={styles.controlBtn}
        onClick={onResetView}
        title="Reset View (R)"
      >
        ⟲
      </button>
      <button
        className={styles.controlBtn}
        onClick={onToggleAnimation}
        title={animating ? 'Pause (Space)' : 'Play (Space)'}
      >
        {animating ? '⏸' : '▶'}
      </button>
      
      <div className={styles.exportGroup}>
        <button
          className={styles.controlBtn}
          onClick={() => setShowExportMenu(!showExportMenu)}
          title="Export Options"
        >
          ↓
        </button>
        
        {showExportMenu && (
          <div className={styles.exportMenu}>
            <button onClick={handleExportPNG} className={styles.exportOption}>
              📷 Export PNG
            </button>
            <button onClick={handleExportSVG} className={styles.exportOption}>
              🎨 Export SVG
            </button>
            <button onClick={onExportData} className={styles.exportOption}>
              📄 Export JSON
            </button>
            <button onClick={handleShareLink} className={styles.exportOption}>
              🔗 Copy Share Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

Controls.displayName = 'Controls';

export default Controls;
