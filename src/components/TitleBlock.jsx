import React from 'react';
import styles from '../styles/components/TitleBlock.module.css';

const TitleBlock = React.memo(() => {
  return (
    <div className={styles.titleBlock}>
      <div className={styles.company}>Bude Global</div>
      <h1 className={styles.title}>Neuro-Chain</h1>
      <div className={styles.subtitle}>Innovation Network Visualization</div>
    </div>
  );
});

TitleBlock.displayName = 'TitleBlock';

export default TitleBlock;
