import React, { useState } from 'react';
import ClusterView from './ClusterView';
import DataEditor from './DataEditor';
import styles from '../styles/components/Panel.module.css';

const Panel = React.memo(({ data, onDataUpdate }) => {
  const [activeTab, setActiveTab] = useState('clusters');
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={`${styles.panel} ${isCollapsed ? styles.collapsed : ''}`}>
      <div 
        className={styles.panelHeader}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>DATA & CLUSTERS</span>
        <span className={styles.toggleIcon}>{isCollapsed ? '▲' : '▼'}</span>
      </div>

      {!isCollapsed && (
        <>
            <div className={styles.panelTabs}>
                <button
                className={`${styles.panelTab} ${activeTab === 'clusters' ? styles.active : ''}`}
                onClick={() => setActiveTab('clusters')}
                >
                Clusters
                </button>
                <button
                className={`${styles.panelTab} ${activeTab === 'editor' ? styles.active : ''}`}
                onClick={() => setActiveTab('editor')}
                >
                Data Editor
                </button>
            </div>

            <div className={styles.tabView} style={{ display: activeTab === 'clusters' ? 'block' : 'none' }}>
                <ClusterView
                clusters={data.clusters}
                descriptions={data.descriptions}
                />
            </div>

            <div className={styles.tabView} style={{ display: activeTab === 'editor' ? 'block' : 'none' }}>
                <DataEditor
                data={data}
                onDataUpdate={onDataUpdate}
                />
            </div>
        </>
      )}
    </div>
  );
});

Panel.displayName = 'Panel';

export default Panel;
