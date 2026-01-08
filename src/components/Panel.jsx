import React, { useState } from 'react';
import ClusterView from './ClusterView';
import DataEditor from './DataEditor';
import styles from '../styles/components/Panel.module.css';

const Panel = React.memo(({ data, onDataUpdate }) => {
  const [activeTab, setActiveTab] = useState('clusters');

  return (
    <div className={styles.panel}>
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
    </div>
  );
});

Panel.displayName = 'Panel';

export default Panel;
