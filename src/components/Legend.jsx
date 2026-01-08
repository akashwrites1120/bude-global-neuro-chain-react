import React, { useMemo } from 'react';
import styles from '../styles/components/Legend.module.css';

const Legend = React.memo(({ clusters, onFocusCluster }) => {
  const clusterEntries = useMemo(() => {
    return Object.entries(clusters);
  }, [clusters]);

  return (
    <div className={styles.legend}>
      {clusterEntries.map(([id, cluster]) => (
        <div
          key={id}
          className={styles.legendItem}
          onClick={() => onFocusCluster(id)}
          data-cluster={id}
        >
          <span
            className={styles.legendDot}
            style={{ color: cluster.color }}
          />
          <span>{cluster.label}</span>
        </div>
      ))}
    </div>
  );
});

Legend.displayName = 'Legend';

export default Legend;
