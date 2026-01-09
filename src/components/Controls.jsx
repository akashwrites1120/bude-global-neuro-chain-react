import React, { useState } from 'react';
import styles from '../styles/components/Controls.module.css';
import { exportToPNG, exportToSVG, generateShareLink } from '../utils/exportHelpers';
import { soundManager } from '../utils/SoundManager';

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

  const [isMuted, setIsMuted] = useState(!soundManager.enabled);

  const handleToggleMute = () => {
    const enabled = soundManager.toggleMute();
    setIsMuted(!enabled);
    if (enabled) soundManager.playClick();
  };

  return (
    <div className={styles.controls}>
      <button
        className={styles.controlBtn}
        onClick={onResetView}
        title="Reset View (R)"
      >
        <span className={styles.icon}>⟲</span>
      </button>

      <button
        className={`${styles.controlBtn} ${animating ? styles.active : ''}`}
        onClick={onToggleAnimation}
        title={animating ? 'Pause (Space)' : 'Play (Space)'}
      >
        <span className={styles.icon}>{animating ? '⏸' : '▶'}</span>
      </button>

      <button
        className={`${styles.controlBtn} ${isMuted ? styles.muted : ''}`}
        onClick={handleToggleMute}
        title="Toggle Sound"
      >
        <span className={styles.icon}>{isMuted ? '🔇' : '🔊'}</span>
      </button>
      
      <div className={styles.separator} />
      
      <div className={styles.exportGroup}>
        <button
          className={styles.controlBtn}
          onClick={() => setShowExportMenu(!showExportMenu)}
          title="Export Options"
        >
          <span className={styles.icon}>↓</span>
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
