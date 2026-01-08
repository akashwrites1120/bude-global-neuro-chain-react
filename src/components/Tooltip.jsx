import React, { useMemo } from 'react';
import styles from '../styles/components/Tooltip.module.css';

const Tooltip = React.memo(({ hoveredNode, mousePos, clusters, edges }) => {
  const connectionCount = useMemo(() => {
    if (!hoveredNode) return 0;
    return edges.filter(e => e.source === hoveredNode.id || e.target === hoveredNode.id).length;
  }, [hoveredNode, edges]);

  const clusterLabel = useMemo(() => {
    if (!hoveredNode) return '';
    return clusters[hoveredNode.cluster]?.label || hoveredNode.cluster;
  }, [hoveredNode, clusters]);

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
        {clusterLabel} · {connectionCount} connections
      </div>
    </div>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
