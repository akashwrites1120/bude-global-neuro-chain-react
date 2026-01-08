import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import styles from '../styles/components/ClusterView.module.css';

const ClusterView = React.memo(({ clusters, descriptions }) => {
  const clusterSections = useMemo(() => {
    return Object.entries(descriptions).map(([id, desc], i) => {
      const cluster = clusters[id];
      if (!cluster) return null;

      const links = desc.links?.map((l, idx) => (
        <span key={`link-${idx}`} className={styles.linkTag}>{l}</span>
      )) || [];

      const backlinks = desc.backlinks?.map((l, idx) => (
        <span key={`backlink-${idx}`} className={`${styles.linkTag} ${styles.backlink}`}>{l}</span>
      )) || [];

      // Sanitize HTML content
      const sanitizedBody = DOMPurify.sanitize(desc.body);

      return {
        id,
        cluster,
        desc,
        links,
        backlinks,
        sanitizedBody,
        delay: i * 0.08
      };
    }).filter(Boolean);
  }, [clusters, descriptions]);

  return (
    <div className={styles.panelContent}>
      {clusterSections.map(({ id, cluster, desc, links, backlinks, sanitizedBody, delay }) => (
        <div
          key={id}
          className={styles.clusterSection}
          style={{ animationDelay: `${delay}s` }}
        >
          <div className={styles.clusterHeader}>
            <span
              className={styles.clusterDot}
              style={{
                background: cluster.color,
                boxShadow: `0 0 10px ${cluster.color}`
              }}
            />
            {desc.title}
          </div>
          <div className={styles.clusterBody}>
            <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
            <br /><br />
            {links}
            {backlinks}
          </div>
        </div>
      ))}
    </div>
  );
});

ClusterView.displayName = 'ClusterView';

export default ClusterView;
