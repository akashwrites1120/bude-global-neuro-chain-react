import React, { useState, useEffect, useMemo } from 'react';
import styles from '../styles/components/DataEditor.module.css';

const DataEditor = React.memo(({ data, onDataUpdate }) => {
  const [selectedDataKey, setSelectedDataKey] = useState('clusters');
  const [editorContent, setEditorContent] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setEditorContent(JSON.stringify(data[selectedDataKey], null, 2));
    setIsValid(true);
  }, [selectedDataKey, data]);

  const nodeCount = useMemo(() => {
    return data.nodes?.length || 0;
  }, [data.nodes]);

  const handleEditorChange = (e) => {
    const value = e.target.value;
    setEditorContent(value);
    
    try {
      JSON.parse(value);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  const handleApply = () => {
    if (!isValid) return;
    
    try {
      const parsed = JSON.parse(editorContent);
      onDataUpdate(selectedDataKey, parsed);
    } catch (error) {
      console.error('Failed to apply changes:', error);
    }
  };

  const handleReset = () => {
    // Reset to current data
    setEditorContent(JSON.stringify(data[selectedDataKey], null, 2));
    setIsValid(true);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(editorContent);
      setEditorContent(JSON.stringify(parsed, null, 2));
    } catch (error) {
      // Ignore formatting errors
    }
  };

  return (
    <>
      <div className={styles.dataSelector}>
        <select
          value={selectedDataKey}
          onChange={(e) => setSelectedDataKey(e.target.value)}
        >
          <option value="clusters">clusters.json</option>
          <option value="nodes">nodes.json</option>
          <option value="edges">edges.json</option>
          <option value="descriptions">descriptions.json</option>
        </select>
      </div>

      <div className={styles.editorToolbar}>
        <button className={`${styles.editorBtn} ${styles.primary}`} onClick={handleApply}>
          Apply Changes
        </button>
        <button className={styles.editorBtn} onClick={handleReset}>
          Reset
        </button>
        <button className={styles.editorBtn} onClick={handleFormat}>
          Format
        </button>
      </div>

      <div className={styles.panelContent}>
        <textarea
          className={styles.jsonEditor}
          value={editorContent}
          onChange={handleEditorChange}
          spellCheck={false}
        />
      </div>

      <div className={styles.statusBar}>
        <div className={styles.statusIndicator}>
          <span className={`${styles.statusDot} ${!isValid ? styles.error : ''}`} />
          <span>{isValid ? 'Valid JSON' : 'Invalid JSON'}</span>
        </div>
        <span>{nodeCount} nodes</span>
      </div>
    </>
  );
});

DataEditor.displayName = 'DataEditor';

export default DataEditor;
