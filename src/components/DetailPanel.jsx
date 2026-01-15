import React from 'react';
import styles from '../styles/components/DetailPanel.module.css';

const DetailPanel = React.memo(({ node, cluster, onClose, onNodeSelect }) => {
  if (!node) return null;

  return (
    <div className={styles.panel}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      
      <div className={styles.header}>
        <div className={styles.clusterBadge} style={{ borderColor: cluster?.color, color: cluster?.color }}>
            {cluster?.label || node.cluster}
        </div>
        <h2 className={styles.title}>{node.label}</h2>
        {node.year && (
            <div className={styles.year}>
                {Math.abs(node.year).toLocaleString()} {node.year < 0 ? 'BCE' : 'CE'}
            </div>
        )}
      </div>

      <div className={styles.content}>
        {/* Status Section (Mock Data for now if missing) */}
        <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
                <label>Status</label>
                <span className={styles.statusValue}>{node.status || 'Concept'}</span>
            </div>
            <div className={styles.metaItem}>
                <label>Maturity</label>
                <div className={styles.meter}>
                    <div className={styles.meterFill} style={{ width: node.maturity ? `${node.maturity}%` : '40%' }}></div>
                </div>
            </div>
        </div>

        {/* Description */}
        {node.description && (
            <div className={styles.section}>
                <h3>Description</h3>
                <div className={styles.description} dangerouslySetInnerHTML={{ __html: typeof node.description === 'object' ? node.description.body : node.description }} />
            </div>
        )}

        {/* Contributors */}
        <div className={styles.section}>
            <h3>Key Contributors</h3>
            <div className={styles.tags}>
                {(node.contributors || ['Global Research Community']).map((c, i) => (
                    <span key={i} className={styles.tag}>{c}</span>
                ))}
            </div>
        </div>

        {/* Technologies */}
        <div className={styles.section}>
            <h3>Related Technologies</h3>
            <div className={styles.tags}>
                {(node.technologies || ['Cognitive Science', 'Network Theory']).map((t, i) => (
                    <span key={i} className={styles.tag} style={{ borderColor: '#0ea5e9', color: '#0ea5e9' }}>{t}</span>
                ))}
            </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
            {node.wikiUrl && (
              <button 
                className={styles.actionBtn}
                onClick={() => window.open(node.wikiUrl, '_blank')}
                title="View on Wikipedia"
              >
                📖 View Source
              </button>
            )}
            <button 
              className={styles.actionBtn}
              onClick={() => {
                const blob = new Blob([JSON.stringify(node, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${node.id}-data.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              title="Export node data as JSON"
            >
              💾 Export Data
            </button>
        </div>

      </div>
    </div>
  );
});

DetailPanel.displayName = 'DetailPanel';

export default DetailPanel;
