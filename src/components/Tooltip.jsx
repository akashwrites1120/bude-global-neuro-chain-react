import React, { useMemo } from 'react';
import styles from '../styles/components/Tooltip.module.css';

const Tooltip = React.memo(({ hoveredNode, mousePos, clusters, edges, descriptions }) => {
  const connectionCount = useMemo(() => {
    if (!hoveredNode) return 0;
    return edges.filter(e => e.source === hoveredNode.id || e.target === hoveredNode.id).length;
  }, [hoveredNode, edges]);

  const clusterLabel = useMemo(() => {
    if (!hoveredNode) return '';
    return clusters[hoveredNode.cluster]?.label || hoveredNode.cluster;
  }, [hoveredNode, clusters]);

  const description = useMemo(() => {
    if (!hoveredNode) return null;
    
    // 1. Check external descriptions.json (usually for cluster hubs)
    if (descriptions && descriptions[hoveredNode.id]) {
        const desc = descriptions[hoveredNode.id];
        // Handle object structure from descriptions.json
        if (typeof desc === 'object') {
            return { __html: desc.body };
        }
        return desc; // Should be a string
    }
    
    // 2. Check inline node description (from nodes.json)
    if (hoveredNode.description) {
        return hoveredNode.description;
    }

    // 3. Fallback
    return null;
  }, [hoveredNode, descriptions]);

  const yearLabel = useMemo(() => {
    if (!hoveredNode?.year) return null;
    const y = hoveredNode.year;
    const absYear = Math.abs(y).toLocaleString();
    return y < 0 ? `${absYear} BCE` : `${absYear} CE`;
  }, [hoveredNode]);

  if (!hoveredNode) return null;

  return (
    <div
      className={`${styles.tooltip} ${hoveredNode ? styles.visible : ''}`}
      style={{
        left: `${mousePos.x + 12}px`,
        top: `${mousePos.y + 12}px`
      }}
    >
      <div className={styles.tooltipTitle}>{hoveredNode.label}</div>
      <div className={styles.tooltipMeta}>
        <span style={{ color: clusters[hoveredNode.cluster]?.color }}>●</span> {clusterLabel} · {connectionCount} connections
      </div>
      {yearLabel && (
        <div className={styles.tooltipYear}>
            {yearLabel}
        </div>
      )}
      {description && typeof description === 'object' ? (
          <div 
            className={styles.tooltipDescription} 
            dangerouslySetInnerHTML={description} 
          />
      ) : description ? (
          <div className={styles.tooltipDescription}>
            {description}
          </div>
      ) : null}
    </div>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
